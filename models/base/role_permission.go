/**********************************************
** @Des: This file ...
** @Author: cheguoyong
** @Date:   2017-09-15 11:44:13
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:49:13
***********************************************/
package base

import (
	"errors"
	"strings"

	"github.com/astaxie/beego/orm"
	"yellbuy.com/YbGoCloundFramework/libs"
)

type RolePermission struct {
	RoleId        int    `orm:"pk"`
	PermissionKey string `valid:"Maxize(255)"`
}

func (ra *RolePermission) TableName() string {
	return TableName("base_role_permission")
}
func RolePermissionTableName() string {
	return TableName("base_role_permission")
}

func RolePermissionAdd(ra *RolePermission) (int64, error) {
	return orm.NewOrm().Insert(ra)
}
func RolePermissionGetByUid(uid uint, scopeIds ...interface{}) ([]*RolePermission, error) {
	list := make([]*RolePermission, 0)
	if uid == 0 {
		return list, nil
	}
	o := orm.NewOrm()
	query := o.QueryTable(UserTableName()).Filter("id", uid)
	query = libs.AppendFilter(query, scopeIds...)
	var user User
	err := query.One(&user, "role_ids")
	if err != nil {
		return list, err
	}

	return RolePermissionGetByIds(user.RoleIds)
}

func RolePermissionGetByIds(roleids string) ([]*RolePermission, error) {
	list := make([]*RolePermission, 0)
	if len(roleids) == 0 || roleids == "0" {
		return list, nil
	}
	ids := libs.Split2Int64(roleids)
	query := orm.NewOrm().QueryTable(RolePermissionTableName())
	_, err := query.Filter("role_id__in", ids).Limit(-1).All(&list, "permission_key")
	return list, err
}
func RolePermissionMapGetByIds(roleids string) (map[string]string, error) {
	list, err := RolePermissionGetByIds(roleids)

	result := make(map[string]string, 64)
	if err != nil {
		return result, err
	}

	for _, val := range list {
		result[val.PermissionKey] = val.PermissionKey
	}
	return result, nil
}

func RolePermissionGetById(roleid int) ([]*RolePermission, error) {
	list := make([]*RolePermission, 0)
	query := orm.NewOrm().QueryTable(RolePermissionTableName())
	_, err := query.Filter("role_id", roleid).Limit(-1).All(&list, "AuthId")
	if err != nil {
		return nil, err
	}
	return list, nil
}

func RolePermissionDelete(role_id int) (int64, error) {
	query := orm.NewOrm().QueryTable(RolePermissionTableName())
	return query.Filter("role_id", role_id).Delete()
}

func RolePermissionMultiAdd(ras []*RolePermission) (n int, err error) {
	query := orm.NewOrm().QueryTable(RolePermissionTableName())
	i, _ := query.PrepareInsert()
	for _, ra := range ras {
		_, err := i.Insert(ra)
		if err == nil {
			n = n + 1
		}
	}
	i.Close() // 别忘记关闭 statement
	return n, err
}
func RolePermissionMultiAddFor(roleId int, perms []string) (n int, err error) {
	list := make([]*RolePermission, len(perms), len(perms))
	for i, v := range perms {
		child := RolePermission{roleId, v}
		list[i] = &child
	}
	return RolePermissionMultiAdd(list)
}
func RolePermissionSave(roleid int, ras []string) (n int, err error) {
	if roleid <= 0 {
		return 0, errors.New("角色标识不正确")
	}
	rolePermissionList := make([]*RolePermission, len(ras), len(ras))
	for index, key := range ras {
		rolePermissionList[index] = &RolePermission{roleid, key}
	}
	o := orm.NewOrm()
	o.Begin()

	query := o.QueryTable(RolePermissionTableName())
	if _, err := query.Filter("role_id", roleid).Delete(); err != nil {
		o.Rollback()
		return 0, err
	}
	i, _ := query.PrepareInsert()
	for _, ra := range rolePermissionList {
		_, err := i.Insert(ra)
		if err == nil {
			n = n + 1
		} else {
			i.Close()
			o.Rollback()
			return 0, err
		}
	}
	i.Close() // 别忘记关闭 statement
	o.Commit()
	return n, err
}

// 权限数组转角色权限
func permissionTreeToRolePermission(roleid int, permissions []Permission) []RolePermission {
	rolePermissionList := make([]RolePermission, len(permissions))
	for _, val := range permissions {
		perm := RolePermission{roleid, val.Key}
		rolePermissionList = append(rolePermissionList, perm)
		if len(val.Modules) > 0 {
			rolePermissionList = permissionTreeToModule(roleid, val.Modules, rolePermissionList)
		}
		if len(val.Actions) > 0 {
			rolePermissionList = permissionTreeToAction(roleid, val.Actions, rolePermissionList)
		}
	}
	return rolePermissionList
}

// 权限模块数组转角色权限
func permissionTreeToModule(roleid int, modules []Module, list []RolePermission) []RolePermission {
	if len(modules) == 0 {
		return list
	}
	for _, val := range modules {
		perm := RolePermission{roleid, val.Key}
		list = append(list, perm)
		if len(val.Modules) > 0 {
			list = permissionTreeToModule(roleid, val.Modules, list)
		}
		if len(val.Actions) > 0 {
			list = permissionTreeToAction(roleid, val.Actions, list)
		}
	}
	return list
}

// 权限动作数组转角色权限
func permissionTreeToAction(roleid int, actions []Action, list []RolePermission) []RolePermission {
	if len(actions) == 0 {
		return list
	}
	for _, val := range actions {
		perm := RolePermission{roleid, val.Key}
		list = append(list, perm)
		if len(val.Modules) > 0 {
			list = permissionTreeToModule(roleid, val.Modules, list)
		}
		if len(val.Actions) > 0 {
			list = permissionTreeToAction(roleid, val.Actions, list)
		}
	}
	return list
}

// 判断角色是否有指定的权限
func HasPermissionForRoles(key string, roleids string) (bool, error) {
	if len(key) == 0 {
		return false, errors.New("key 不能为空")
	}
	if len(roleids) == 0 {
		return false, errors.New("roleids 不能为空")
	}
	query := orm.NewOrm().QueryTable(RolePermissionTableName())
	query = query.Filter("permission_key", key).Filter("role_id__in", strings.Split(roleids, ","))
	count, err := query.Count()
	return count > 0, err
}
