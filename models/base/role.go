/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-14 15:24:51
** @Last Modified by:   
** @Last Modified time: 2017-09-17 11:48:52
***********************************************/
package base

import (
	"errors"
	"time"

	. "yellbuy.com/YbGoCloundFramework/libs"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
)

type Role struct {
	Id         int
	Code       string `Required;valid:"MaxSize(32)"`
	Name       string `Required;valid:"MaxSize(32)"`
	Remark     string `valid:"MaxSize(255)"`
	IsStatic   int8
	State      int8
	CreateId   uint
	UpdateId   uint
	CreateTime time.Time
	UpdateTime time.Time
	Tid        uint
	Appid      uint
	Checked    bool `orm:"-"`
}

func (r *Role) TableName() string {
	return RoleTableName()
}
func RoleTableName() string {
	return TableName("base_role")
}

func RoleGetList(appid, tid uint, page, pageSize int, filters ...interface{}) ([]*Role, int64) {
	offset := (page - 1) * pageSize
	list := make([]*Role, 0)
	query := orm.NewOrm().QueryTable(RoleTableName()).Filter("appid", appid).Filter("tid", tid)
	if len(filters) > 0 {
		l := len(filters)
		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	total, _ := query.Count()
	query.OrderBy("-id").Limit(pageSize, offset).All(&list)
	return list, total
}

// 数据验证
func RoleIsValid(role *Role) error {
	result := validation.Validation{}
	isValid, err := result.Valid(role)
	if err != nil {
		return FailError(E201204, err)
	}
	if !isValid {
		if result.HasErrors() {
			return FailError(E201204, errors.New(result.Errors[0].Message))
		}
	}
	if err := RoleExists(role); err != nil {
		return FailError(E201204, err)
	}
	return nil
}

func RoleExists(role *Role) error {
	query := orm.NewOrm().QueryTable(RoleTableName()).
		Exclude("Id", role.Id).
		Filter("appid", role.Appid).Filter("tid", role.Tid)

	count, err := query.Filter("Code", role.Code).Count()
	if err != nil {
		return err
	} else if count > 0 {
		return errors.New("角色编码已存在")
	}
	count, err = query.Filter("Name", role.Name).Count()
	if err != nil {
		return err
	} else if count > 0 {
		return errors.New("角色名称已存在")
	}
	return nil
}

func RoleGetByCode(appid, tid uint, code string) (*Role, error) {
	role := new(Role)
	err := orm.NewOrm().QueryTable(RoleTableName()).
		Filter("appid", appid).Filter("tid", tid).Filter("Code", code).Limit(1).One(role)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func RoleGetByName(appid, tid uint, name string) (*Role, error) {
	role := new(Role)
	err := orm.NewOrm().QueryTable(RoleTableName()).
		Filter("appid", appid).Filter("tid", tid).Filter("Name", name).Limit(1).One(role)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func RoleGetById(appid, tid uint, id int) (*Role, error) {
	role := new(Role)
	err := orm.NewOrm().QueryTable(RoleTableName()).
		Filter("id", id).Filter("appid", appid).Filter("tid", tid).One(role)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func RoleAdd(appid, tid uint, role *Role) (int64, error) {
	role.Appid = appid
	role.Tid = tid
	if err := RoleIsValid(role); err != nil {
		return 0, err
	}
	role.IsStatic = 0
	role.CreateTime = time.Now()
	role.UpdateTime = role.CreateTime
	id, err := orm.NewOrm().Insert(role)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func RoleUpdate(appid, tid uint, role *Role) error {
	role.Appid = appid
	role.Tid = tid
	if err := RoleIsValid(role); err != nil {
		return err
	}

	role.UpdateTime = time.Now()
	if _, err := orm.NewOrm().QueryTable(RoleTableName()).
		Filter("appid", appid).Filter("tid", tid).Filter("id", role.Id).
		Update(orm.Params{
			"Code":       role.Code,
			"Name":       role.Name,
			"State":      role.State,
			"Remark":     role.Remark,
			"UpdateId":   role.UpdateId,
			"UpdateTime": role.UpdateTime,
		}); err != nil {
		return err
	}
	return nil
}

func RoleDelete(appid, tid uint, id int) (int64, error) {
	orm := orm.NewOrm()
	orm.Begin()
	count, err := orm.QueryTable(RoleTableName()).
		Filter("appid", appid).Filter("tid", tid).Filter("id", id).Delete()
	if err != nil {
		orm.Rollback()
		return 0, err
	}
	if count > 0 {
		_, err := orm.QueryTable(RolePermissionTableName()).Filter("role_id", id).Delete()
		if err != nil {
			orm.Rollback()
			return 0, err
		}
	}
	orm.Commit()
	return count, nil
}
