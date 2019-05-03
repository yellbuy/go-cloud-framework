/**********************************************
** @Des: This file ...
** @Author:
** @Date:   2017-09-08 00:18:02
** @Last Modified by:
** @Last Modified time: 2017-09-16 17:26:48
***********************************************/

package models

import (
	"errors"
	"fmt"
	"net/url"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
	"yellbuy.com/YbGoCloundFramework/libs"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

func Init() {
	dbhost := beego.AppConfig.String("db.host")
	dbport := beego.AppConfig.String("db.port")
	dbuser := beego.AppConfig.String("db.user")
	dbpassword := beego.AppConfig.String("db.password")
	dbname := beego.AppConfig.String("db.name")
	timezone := beego.AppConfig.String("db.timezone")
	maxidleconns := beego.AppConfig.DefaultInt("db.maxidleconns", 0)
	maxopenconns := beego.AppConfig.DefaultInt("db.maxopenconns", 0)
	if dbport == "" {
		dbport = "3306"
	}
	dsn := dbuser + ":" + dbpassword + "@tcp(" + dbhost + ":" + dbport + ")/" + dbname + "?charset=utf8"
	// fmt.Println(dsn)

	if timezone != "" {
		dsn = dsn + "&loc=" + url.QueryEscape(timezone)
	}
	orm.RegisterDataBase("default", "mysql", dsn, maxidleconns, maxopenconns)
	orm.RegisterModel(new(baseModels.Org), new(baseModels.User), new(baseModels.UserOrg),
		new(baseModels.Role), new(baseModels.RolePermission),
		new(baseModels.App), new(baseModels.Tenant), new(baseModels.Edition))

	if beego.AppConfig.String("runmode") == "dev" {
		orm.Debug = true
	}
}

func TableName(name string) string {
	return beego.AppConfig.String("db.prefix") + name
}

// 通用查询
func QueryGetAll(table string, query map[string]interface{}, exclude map[string]interface{},
	condMap map[string]map[string]interface{}, fields []string, sortby []string,
	order []string, offset int64, limit int64, ids ...uint) (int64, []orm.Params, error) {
	var (
		res []orm.Params
		err error
		num int64
	)
	for i, v := range fields {
		fields[i] = strings.Replace(v, ".", "__", -1)
	}
	qs := orm.NewOrm().QueryTable(table)
	// qs = qs.RelatedSel()
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
	length := len(ids)
	// 应用
	if length > 0 {
		qs = qs.Filter("appid", ids[0])
	}
	// 租户
	if length > 1 {
		qs = qs.Filter("tid", ids[1])
	}
	// 用户
	if length > 2 {
		qs = qs.Filter("uid", ids[2])
	}
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
					return num, nil, libs.FailError(libs.E201204, errors.New("Error: Invalid order. Must be either [asc|desc]"))
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
					return num, nil, libs.FailError(libs.E201204, errors.New("Error: Invalid order. Must be either [asc|desc]"))
				}
				sortFields = append(sortFields, orderby)
			}
		} else if len(sortby) != len(order) && len(order) != 1 {
			return num, nil, libs.FailError(libs.E201204, errors.New("Error: sortby, order sizes mismatch or order size is not 1"))
		}
	} else {
		if len(order) != 0 {
			return num, nil, libs.FailError(libs.E201204, errors.New("Error: unused order fields"))
		}
	}
	qs = qs.OrderBy(sortFields...)
	if cnt, err := qs.Count(); err == nil {
		if cnt > 0 {
			// paginator = utils.GenPaginator(limit, offset, cnt)
			if _, err = qs.Limit(limit, offset).Values(&res, fields...); err == nil {
				num = cnt
			} else {
				return 0, res, err
			}
		}
	} else {
		fmt.Println(err)
		return cnt, res, err
	}
	return num, res, err
}
