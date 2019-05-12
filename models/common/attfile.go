package common

import (
	"errors"
	"time"

	"github.com/astaxie/beego/orm"
	"yellbuy.com/YbCloudDataApi/libs"
)

type Attfile struct {
	Id         uint
	Name       string
	Savename   string
	Savepath   string
	Ext        string
	Mime       string
	Size       int
	Md5        string
	Sha1       string
	Location   uint8
	Url        string
	CreateTime time.Time
	Kind       string
	Uid        uint
	Tid        uint // 租户标识',
	Appid      uint //'应用标识',
}

//  新增文件
func AttfileAdd(file *Attfile) (int64, error) {
	file.CreateTime = time.Now()
	query := orm.NewOrm()
	id, err := query.Insert(file)
	return id, err
}

//  加载文件
func AttfileGetPagedList(pageIndex, pageSize uint, kind string, scopeIds ...interface{}) (int64, []*Attfile, error) {
	if pageSize == 0 {
		pageSize = 10
	}
	offset := pageIndex * pageSize

	return AttfileGetPagedListBy(offset, pageSize, kind, scopeIds...)
}

//  加载文件
func AttfileGetPagedListBy(offset, pageSize uint, kind string, scopeIds ...interface{}) (int64, []*Attfile, error) {
	list := make([]*Attfile, 0)
	if pageSize == 0 {
		pageSize = 10
	}
	query := orm.NewOrm().QueryTable(AttfileTableName())
	query = libs.AppendFilter(query, scopeIds...)
	if kind != "" {
		query = query.Filter("kind", kind)
	}
	total, err := query.Count()
	if total > 0 {
		_, err = query.OrderBy("-id").Limit(pageSize, offset).All(&list)
	}

	return total, list, err
}

//  加载文件
func AttfileGetList(ids []interface{}, scopeIds ...interface{}) ([]*Attfile, error) {
	list := make([]*Attfile, 0)
	if len(ids) == 0 {
		return list, errors.New("文件标识不能为空")
	}
	query := orm.NewOrm().QueryTable(AttfileTableName())
	query = libs.AppendFilter(query, scopeIds...)
	query = query.Filter("id__in", ids...)
	query.Limit(len(ids), 0).All(&list)
	return list, nil
}

//  加载文件
func AttfileLoadList(ids []interface{}) ([]*Attfile, error) {
	list := make([]*Attfile, 0)
	if len(ids) == 0 {
		return list, errors.New("文件标识不能为空")
	}
	query := orm.NewOrm().QueryTable(AttfileTableName())
	query = query.Filter("id__in", ids...)
	query.Limit(len(ids), 0).All(&list)
	return list, nil
}

//  加载文件
func AttfileUrlLoadList(idStr string) ([]string, error) {
	res := make([]string, 0)
	if len(idStr) == 0 {
		return res, nil
	}
	var list orm.ParamsList
	ids := libs.Split2Interface(idStr)
	query := orm.NewOrm().QueryTable(AttfileTableName())
	query = query.Exclude("savepath__isnull", true).Filter("id__in", ids...)
	_, err := query.ValuesFlat(&list, "savepath")
	if err != nil {
		return res, err
	}
	for _, val := range list {
		url, _ := val.(string)
		if len(url) > 0 {
			res = append(res, url)
		}
	}
	return res, nil
}

func AttfileGetById(id int64) (*Attfile, error) {
	item := new(Attfile)
	query := orm.NewOrm().QueryTable(AttfileTableName()).Filter("id", id)
	err := query.One(item)
	return item, err
}

func AttfileLoadPathList(ids []interface{}) ([]string, error) {
	if len(ids) == 0 {
		return nil, errors.New("文件标识不能为空")
	}
	var list orm.ParamsList
	query := orm.NewOrm().QueryTable(AttfileTableName())
	query = query.Filter("id__in", ids...)
	_, err := query.Limit(len(ids), 0).ValuesFlat(&list, "savepath")
	PicPaths := libs.Interface2stringArray(list)
	return PicPaths, err
}

func AttfileGetPathById(id int64) (string, error) {
	item := new(Attfile)
	query := orm.NewOrm().QueryTable(AttfileTableName()).Filter("id", id)
	err := query.One(item, "savepath")
	return item.Savepath, err
}

func AttfileDel(id int64) error {
	query := orm.NewOrm().QueryTable(AttfileTableName())
	_, err := query.Filter("id", id).Delete()
	return err
}

func (a *Attfile) TableName() string {
	return TableName("common_attfile")
}

func AttfileTableName() string {
	return TableName("common_attfile")
}
