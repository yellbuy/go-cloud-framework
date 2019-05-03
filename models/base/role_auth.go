/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-15 11:44:13
** @Last Modified by:   
** @Last Modified time: 2017-09-17 11:49:13
***********************************************/
package base

import (
	"bytes"
	"strconv"
	"strings"

	"github.com/astaxie/beego/orm"
)

type RoleAuth struct {
	AuthId int `orm:"pk"`
	RoleId int64
}

func (ra *RoleAuth) TableName() string {
	return TableName("base_role_auth")
}
func RoleAuthTableName() string {
	return TableName("base_role_auth")
}

func RoleAuthAdd(ra *RoleAuth) (int64, error) {
	return orm.NewOrm().Insert(ra)
}

func RoleAuthGetById(roleid int) ([]*RoleAuth, error) {
	list := make([]*RoleAuth, 0)
	query := orm.NewOrm().QueryTable(RoleAuthTableName())
	_, err := query.Filter("role_id", roleid).All(&list, "AuthId")
	if err != nil {
		return nil, err
	}
	return list, nil
}

func RoleAuthDelete(id int) (int64, error) {
	query := orm.NewOrm().QueryTable(RoleAuthTableName())
	return query.Filter("role_id", id).Delete()
}

//获取多个
func RoleAuthGetByIds(RoleIds string) (Authids string, err error) {
	list := make([]*RoleAuth, 0)
	query := orm.NewOrm().QueryTable(RoleAuthTableName())
	ids := strings.Split(RoleIds, ",")
	_, err = query.Filter("role_id__in", ids).All(&list, "AuthId")
	if err != nil {
		return "", err
	}
	b := bytes.Buffer{}
	for _, v := range list {
		if v.AuthId != 0 && v.AuthId != 1 {
			b.WriteString(strconv.Itoa(v.AuthId))
			b.WriteString(",")
		}
	}
	Authids = strings.TrimRight(b.String(), ",")
	return Authids, nil
}

func RoleAuthMultiAdd(ras []*RoleAuth) (n int, err error) {
	query := orm.NewOrm().QueryTable(RoleAuthTableName())
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
