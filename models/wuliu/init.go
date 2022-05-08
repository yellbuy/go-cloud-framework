/**********************************************
** @Des: This file ...
** @Author:
** @Date:   2017-09-08 00:18:02
** @Last Modified by:
** @Last Modified time: 2017-09-16 17:26:48
***********************************************/

package wuliu

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	orm.RegisterModel(new(OrderInfo), new(Address))
}

func TableName(name string) string {

	return beego.AppConfig.String("db.prefix") + name
}
