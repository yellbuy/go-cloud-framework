/**********************************************
** @Des: This file ...
** @Author: ybxx
** @Date:   2018-09-16 15:42:43
** @Last Modified by:
** @Last Modified time: 2018-10-09 11:48:17
***********************************************/
package wuliu

import (
	"errors"
	"fmt"
	"strings"
	// "time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models"
)

//  项目
type Address struct {
	// 标识
	Id         int64 //(11) NOT NULL AUTO_INCREMENT,
	UserId     uint   //(11) NOT NULL AUTO_INCREMENT,
	Kind       int8
	ExternalId string `valid:"MaxSize(32)"` //varchar(31) DEFAULT NULL COMMENT
	Name       string `valid:"MaxSize(32)"` //varchar(31) DEFAULT NULL COMMENT
	Mobile     string `valid:"MaxSize(15)"` //varchar(31) DEFAULT NULL COMMENT
	Phone      string `valid:"MaxSize(15)"` //varchar(31) DEFAULT NULL COMMENT
	Country    string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	ProvinceId int64  //varchar(31) DEFAULT NULL COMMENT
	CityId     int64
	CountyId   int64
	StreetId   int64
	Province   string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	City       string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	County     string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	Street     string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	Addr       string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	Postcode   string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	Idno       string `valid:"MaxSize(20)"` //varchar(31) DEFAULT NULL COMMENT
	Idname     string `valid:"MaxSize(32)"` //varchar(31) DEFAULT NULL COMMENT

	Pics       string `valid:"MaxSize(255)"` //varchar(31) DEFAULT NULL COMMENT
	Pic1       int64
	Pic2       int64
	State      int8
	IsDefault  int8
	UpdateTime Time
	// 租户标识,
	Tid uint
	//应用标识,
	Appid     uint
}
type AddressRequestDto struct {
	PageIndex uint32 `json:"pageIndex"`
	PageSize  uint32 `json:"pageSize"`
	Order     string `json:"order"`
}

func (a *Address) TableName() string {
	return TableName("wuliu_address")
}

//
func AddressTableName() string {
	return models.TableName("wuliu_address")
}

// AddressBriefList 合同简略查询，标题，银行，银行账号，等
func AddressGetList(appid, tid uint, kind int8, name string, page, pagesize uint32) ([]*Address, int64, error) {
	query := orm.NewOrm().QueryTable(AddressTableName()).Filter("tid", tid).Filter("appid", appid).Filter("kind", kind)
	str := strings.TrimSpace(name)
	if str != "" {
		cond := orm.NewCondition()
		cond = cond.Or("name__contains", str).Or("mobile__contains", str).
			Or("phone__contains", str).Or("idno__contains", str).Or("idname__contains", str)
		query = query.SetCond(cond)
	}

	list := make([]*Address, 0)
	offset := page * pagesize
	num, err := query.Count()
	if num > 0 {
		query.OrderBy("is_default", "-update_time").Limit(pagesize, offset).All(&list)

	}
	//num 总数
	return list, num, err
}

// 根据电话,收发货查询地址
func AddressGetListByPhondKind(phone string,kind int8) (*Address,  error) {
	query := orm.NewOrm().QueryTable(AddressTableName())
	query = query.Filter("mobile",phone).Filter("kind",kind)
		
	list :=new(Address)
	
	err:=query.One(list)
	
	return list,  err
}
// 根据 search 查地址
func AddressGetListBySearch( search string,kind int8,  dto *AddressRequestDto,scopeIds ...interface{}) ([]*Address, int64, error) {
	query := orm.NewOrm().QueryTable(AddressTableName())
		query = AppendFilter(query, scopeIds...)
	str := strings.TrimSpace(search)
	if str != "" {
		cond := orm.NewCondition()
		cond1 := cond.Or("name__contains", str).Or("mobile__contains", str)
			// Or("phone__contains", str).Or("idno__contains", str).Or("idname__contains", str)
		query = query.SetCond(cond.AndCond(cond1))
	}
	if kind>=0{
		query= query.Filter("kind",kind)
	}

	list := make([]*Address, 0)
	offset := dto.PageIndex * dto.PageSize
	if offset < 0 {
		offset = 10
	}
	num, err := query.Count()
	if num > 0 {
		query.OrderBy( "-update_time").Limit(dto.PageSize, offset).All(&list)

	}
	//num 总数
	return list, num, err
}

// ContratDetailbyId 合同详细查询 by ID号
func AddressGetById(appid, tid uint, id int64) (Address, error) {
	var model Address
	query := orm.NewOrm().QueryTable(AddressTableName())
	if id <= 0 {
		return model, FailError(E201201, nil)
		//  Id 号错误
	}
	err := query.Filter("appid", appid).Filter("tid", tid).Filter("id", id).One(&model)
	return model, err
}

// AddressAdd 新增加合同
func AddressAdd(appid, tid uint, model *Address) (int64, error) {
	model.Appid = appid
	model.Tid = tid
	err := IsValidAddress(model)
	if err != nil {
		return 0, err
	}

	query := orm.NewOrm()
	query.Begin()
	var id int64
	if id, err = query.Insert(model); err != nil {
		fmt.Println(err)
		query.Rollback()
		return 0, err
	} else if model.IsDefault == 1 {
		query.QueryTable(AddressTableName()).Exclude("Id", model.Id).
			Filter("Appid", model.Appid).Filter("Tid", model.Tid).Filter("UserId", model.UserId).
			Update(orm.Params{
				"IsDefault": 0,
			})
	}
	query.Commit()
	return id, err
}

// 地址修改
func AddressUpdate(appid uint, tid uint, Address *Address) error {
	err := IsValidAddress(Address)
	if err != nil {
		return err
	}

	query := orm.NewOrm()
	_, err = query.Update(Address)
	return err
}
func ShippingAddressUpdate(appid uint, tid uint, address *Address) error {
	err := IsValidAddress(address)
	if err != nil {
		return err
	}  
	query := orm.NewOrm()
	oraddr,err:= AddressGetListByPhondKind(address.Mobile,address.Kind)
	if err!=orm.ErrNoRows{
		address.Id=oraddr.Id	
	_, err = query.Update(address)
	}else{
	_,err=query.Insert(address)
	}
	return err
}

// 地址删除
func AddressDelete(appid, tid uint, id int64) error {

	query := orm.NewOrm().QueryTable(AddressTableName())

	_, err := query.Filter("appid", appid).Filter("tid", tid).Filter("id", id).Delete()
	return err
}

// 数据验证
func IsValidAddress(Address *Address) error {
	result := validation.Validation{}
	isValid, err := result.Valid(Address)
	if err != nil {
		return FailError(E201204, err)
	}
	if !isValid {
		if result.HasErrors() {
			return FailError(E201204, errors.New(result.Errors[0].Message))
		}
	}

	return nil
}

// 项目通用查询
func AddressGetAll(tid uint, appid uint, query map[string]interface{}, exclude map[string]interface{},
	condMap map[string]map[string]interface{}, fields []string, sortby []string,
	order []string, offset int64, limit int64) (int64, []Address, error) {
	var (
		objArrs []Address
		err     error
		num     int64
	)
	qs := orm.NewOrm().QueryTable(AddressTableName())
	qs = qs.RelatedSel()
	cond := orm.NewCondition()
	if _, ok := condMap["and"]; ok {
		andMap := condMap["and"]
		for k, v := range andMap {
			k = strings.Replace(k, ".", "__", -1)
			cond = cond.And(k, v)
		}
	}
	if _, ok := condMap["or"]; ok {
		orMap := condMap["or"]
		for k, v := range orMap {
			k = strings.Replace(k, ".", "__", -1)
			cond = cond.Or(k, v)
		}
	}
	qs = qs.SetCond(cond)
	// query k=v
	for k, v := range query {
		// rewrite dot-notation to Object__Attribute
		k = strings.Replace(k, ".", "__", -1)
		qs = qs.Filter(k, v)
	}
	qs = qs.Filter("app_id", appid)
	qs = qs.Filter("tid", tid)
	//exclude k=v
	for k, v := range exclude {
		// rewrite dot-notation to Object__Attribute
		k = strings.Replace(k, ".", "__", -1)
		qs = qs.Exclude(k, v)
	}
	// order by:
	var sortFields []string
	if len(sortby) != 0 {
		if len(sortby) == len(order) {
			// 1) for each sort field, there is an associated order
			for i, v := range sortby {
				orderby := ""
				if order[i] == "desc" {
					orderby = "-" + strings.Replace(v, ".", "__", -1)
				} else if order[i] == "asc" {
					orderby = strings.Replace(v, ".", "__", -1)
				} else {
					return num, nil, FailError(E201204, errors.New("Error: Invalid order. Must be either [asc|desc]"))
				}
				sortFields = append(sortFields, orderby)
			}
			qs = qs.OrderBy(sortFields...)
		} else if len(sortby) != len(order) && len(order) == 1 {
			// 2) there is exactly one order, all the sorted fields will be sorted by this order
			for _, v := range sortby {
				orderby := ""
				if order[0] == "desc" {
					orderby = "-" + strings.Replace(v, ".", "__", -1)
				} else if order[0] == "asc" {
					orderby = strings.Replace(v, ".", "__", -1)
				} else {
					return num, nil, FailError(E201204, errors.New("Error: Invalid order. Must be either [asc|desc]"))
				}
				sortFields = append(sortFields, orderby)
			}
		} else if len(sortby) != len(order) && len(order) != 1 {
			return num, nil, FailError(E201204, errors.New("Error: sortby, order sizes mismatch or order size is not 1"))
		}
	} else {
		if len(order) != 0 {
			return num, nil, FailError(E201204, errors.New("Error: unused order fields"))
		}
	}
	qs = qs.OrderBy(sortFields...)
	if cnt, err := qs.Count(); err == nil {
		if cnt > 0 {
			// paginator = utils.GenPaginator(limit, offset, cnt)
			if _, err = qs.Limit(limit, offset).All(&objArrs, fields...); err == nil {
				num = cnt
			}
		}
	}
	return num, objArrs, err

}
