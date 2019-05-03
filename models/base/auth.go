/**********************************************
** @Des: 权限因子
** @Author: 
** @Date:   2017-09-09 20:50:36
** @Last Modified by:   
** @Last Modified time: 2017-09-17 21:42:08
***********************************************/
package base

import (
	"fmt"

	"github.com/astaxie/beego/orm"
)

type Auth struct {
	Id         int
	AuthName   string
	AuthUrl    string
	UserId     uint
	Pid        int
	Sort       int
	Icon       string
	IsShow     int
	State      int
	CreateId   uint
	UpdateId   uint
	CreateTime int64
	UpdateTime int64
	Tid        uint
	Appid      uint
}

func (a *Auth) TableName() string {
	return TableName("base_auth")
}

func AuthTableName() string {
	return TableName("base_auth")
}

func AuthGetList(appid, tid uint, page, pageSize int, filters ...interface{}) ([]*Auth, int64) {
	offset := (page - 1) * pageSize
	list := make([]*Auth, 0)
	query := orm.NewOrm().QueryTable(AuthTableName()).Filter("appid", appid).Filter("tid", tid)
	if len(filters) > 0 {
		l := len(filters)
		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	total, _ := query.Count()
	query.OrderBy("pid", "sort").Limit(pageSize, offset).All(&list)

	return list, total
}

func AuthGetListByIds(appid, tid uint, authIds string, userId uint) ([]*Auth, error) {

	list1 := make([]*Auth, 0)
	var list []orm.Params
	//list:=[]orm.Params
	var err error
	if userId == 1000000001 {
		//超级管理员
		_, err = orm.NewOrm().Raw("select id,auth_name,auth_url,pid,icon,is_show from pp_uc_auth where appid=? and tid=? && state=? order by pid asc,sort asc", appid, tid, 1).Values(&list)
	} else {
		_, err = orm.NewOrm().Raw("select id,auth_name,auth_url,pid,icon,is_show from pp_uc_auth where appid=? and tid=? && state=1 and id in("+authIds+") order by pid asc,sort asc", appid, tid, authIds).Values(&list)
	}

	for k, v := range list {
		fmt.Println(k, v)
	}

	fmt.Println(list)
	return list1, err
}

func AuthAdd(appid, tid uint, auth *Auth) (int64, error) {
	auth.Appid = appid
	auth.Tid = tid
	return orm.NewOrm().Insert(auth)
}

func AuthGetById(appid, tid uint, id int) (*Auth, error) {
	a := new(Auth)

	err := orm.NewOrm().QueryTable(AuthTableName()).Filter("appid", appid).Filter("tid", tid).Filter("id", id).One(a)
	if err != nil {
		return nil, err
	}
	return a, nil
}

func (a *Auth) Update(fields ...string) error {
	if _, err := orm.NewOrm().Update(a, fields...); err != nil {
		return err
	}
	return nil
}
