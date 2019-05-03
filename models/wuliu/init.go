/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-08 00:18:02
** @Last Modified by:   
** @Last Modified time: 2017-09-16 17:26:48
***********************************************/

package wuliu

import (
	"fmt"
	"net/url"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	 _ "github.com/go-sql-driver/mysql"
)

func init() {
	dbhost := beego.AppConfig.String("db.host")
	dbport := beego.AppConfig.String("db.port")
	dbuser := beego.AppConfig.String("db.user")
	dbpassword := beego.AppConfig.String("db.password")
	dbname := beego.AppConfig.String("db.name")
	timezone := beego.AppConfig.String("db.timezone")
	maxidleconns := beego.AppConfig.DefaultInt("db.maxidleconns",0)
	maxopenconns := beego.AppConfig.DefaultInt("db.maxopenconns",0)
	if dbport == "" {
		dbport = "3306"
	}
	dsn := dbuser + ":" + dbpassword + "@tcp(" + dbhost + ":" + dbport + ")/" + dbname + "?charset=utf8"
	fmt.Println("dns",dsn)

	if timezone != "" {
		dsn = dsn + "&loc=" + url.QueryEscape(timezone)
	}
	orm.RegisterDataBase("wuliu", "mysql", dsn, maxidleconns, maxopenconns)
	orm.RegisterModel(new(OrderInfo),new(Address))
	fmt.Println("dsn", dsn)
	if beego.AppConfig.String("runmode") == "dev" {
		orm.Debug = true
	}
}

func TableName(name string) string {
	
	return beego.AppConfig.String("db.prefix") + name
}
