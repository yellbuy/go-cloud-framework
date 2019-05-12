package common

import (
	// "fmt"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbCloudDataApi/libs"
)

type SnGenerator struct {
	Id           int64
	Name         string `Required;valid:"MaxSize(64)"`
	GenFormat    string `Required;valid:"MaxSize(36)"`
	ValueLength  uint
	CurDateValue string `valid:"MaxSize(32)"`
	DateFormat   string `valid:"MaxSize(32)"`
	Seed         int64
	Increment    int
	NextValue    int64
	LimitValue   int64
	Order        int64
	Tid          uint
	Appid        uint
}

// 生成一组流水号
func GetNextGroup(appid, tid uint, name string, num uint, customTag string) ([]string, error) {
	snArr := make([]string, 0)
	if len(name) == 0 {
		return snArr, errors.New("name不能为空")
	}
	name = strings.TrimSpace(name)
	if len(name) == 0 {
		return snArr, errors.New("name不能为空")
	}
	if num == 0 {
		return snArr, errors.New("生成数量必须大于0")
	}
	if len(customTag) == 0 {
		customTag = strings.TrimSpace(customTag)
	}
	sql := "SELECT * FROM " + SnGeneratorTableName() + " WHERE appid=? and tid =? and name=? for update"
	var row SnGenerator
	o := orm.NewOrm()
	o.Begin()
	if err := o.Raw(sql, appid, tid, name).QueryRow(&row); err != nil {
		o.Rollback()
		return snArr, err
	}
	if row.LimitValue != 0 {
		if row.LimitValue > 0 && row.NextValue > row.LimitValue {
			o.Rollback()
			return snArr, errors.New("生成值超过允许最大范围")
		} else if row.LimitValue < 0 && row.NextValue < row.LimitValue {
			o.Rollback()
			return snArr, errors.New("生成值超过允许最小范围")
		}
	}
	if len(row.GenFormat) > 0 {
		row.GenFormat = strings.ToUpper(row.GenFormat)
	}
	genFormat := row.GenFormat

	if !strings.Contains(genFormat, "%V") && !strings.Contains(genFormat, "%v") {
		genFormat = genFormat + "%v" // 无值字段，默认流水号添加到字符串尾部
	}
	if row.Increment == 0 {
		row.Increment = 1
	}
	// curNextValue := row.NextValue
	shouldGenDateStr := strings.Contains(genFormat, "%D") || strings.Contains(genFormat, "%d")
	dateStr := ""
	if shouldGenDateStr {
		dateStr = time.Now().Format(row.DateFormat)
	}
	if dateStr != row.CurDateValue {
		row.NextValue = row.Seed
		row.CurDateValue = dateStr
	}
	totalStr := strings.Repeat("0", int(row.ValueLength))
	genFormat = strings.Replace(genFormat, "%A", strconv.Itoa(int(row.Appid)), -1)
	genFormat = strings.Replace(genFormat, "%T", strconv.Itoa(int(row.Tid)), -1)
	genFormat = strings.Replace(genFormat, "%D", dateStr, -1)
	genFormat = strings.Replace(genFormat, "%N", name, -1)
	genFormat = strings.Replace(genFormat, "%C", customTag, -1)

	for i := 0; uint(i) < num; i++ {
		valueStr := totalStr + strconv.FormatInt(row.NextValue, 10)
		index := len(valueStr) - int(row.ValueLength)
		valueStr = valueStr[index:]
		curStr := strings.Replace(genFormat, "%V", valueStr, -1)
		snArr = append(snArr, curStr)
		row.NextValue = row.NextValue + int64(row.Increment)
	}
	if res, err := o.Update(&row); err != nil {
		o.Rollback()
		return snArr, err
	} else if res == 0 {
		o.Rollback()
		return snArr, errors.New("更新失败：并发冲突")
	}
	o.Commit()
	return snArr, nil
}

// 生成一组流水号
func GetNext(appid uint, tid uint, name string, customTag string) (string, error) {
	if snArr, err := GetNextGroup(appid, tid, name, 1, customTag); err != nil {
		return "", err
	} else {
		return snArr[0], nil
	}

}

//符合规范检查
func SnGeneragorIsValid(data *SnGenerator) error {
	if len(data.Name) > 0 {
		data.Name = strings.TrimSpace(data.Name)
	}
	if len(data.DateFormat) > 0 {
		data.DateFormat = strings.TrimSpace(data.DateFormat)
	}
	if len(data.CurDateValue) > 0 {
		data.CurDateValue = strings.TrimSpace(data.CurDateValue)
	}

	result := validation.Validation{}
	isValid, err := result.Valid(data)
	if err != nil {
		return FailError(E201204, err)
	}
	if !isValid {
		if result.HasErrors() {
			return FailError(E201204, errors.New(result.Errors[0].Message))
		}
	}
	nameExist := orm.NewOrm().QueryTable(CommonDataTableName()).
		Exclude("Id", data.Id).
		Filter("appid", data.Appid).Filter("tid", data.Tid).
		Filter("name", data.Name).Exist()
	if nameExist {
		return FailError(E201005, nil)
	}
	return nil
}

//节点数据更新
func SnGeneragorSave(appid, tid uint, data *SnGenerator) (int64, error) {
	data.Appid = appid
	data.Tid = tid
	err := SnGeneragorIsValid(data)
	if err != nil {
		return 0, err
	}
	id := data.Id
	o := orm.NewOrm()
	if data.Id == 0 {
		id, err = o.Insert(data)
	} else {
		id, err = o.Update(data)
	}
	return id, err
}

//删除当前节点
func SnGeneragorDelete(appid, tid uint, id int64) error {
	if _, err := orm.NewOrm().QueryTable(SnGeneratorTableName()).
		Filter("Appid", appid).
		Filter("Tid", tid).
		Filter("id", id).
		Delete(); err != nil {
		return FailError(E201007, err)
	}
	return nil
}

func (a *SnGenerator) TableName() string {
	return TableName("common_sn_generator")
}

func SnGeneratorTableName() string {
	return TableName("common_sn_generator")
}
