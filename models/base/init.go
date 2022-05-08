/**********************************************
** @Des: This file ...
** @Author:
** @Date:   2017-09-08 00:18:02
** @Last Modified by:
** @Last Modified time: 2017-09-16 17:26:48
***********************************************/

package base

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func init() {

	orm.RegisterModel(new(Org), new(User), new(UserOrg), new(Role), new(RolePermission),
		new(App), new(Tenant), new(Edition))
}

func TableName(name string) string {
	return beego.AppConfig.String("db.prefix") + name
}
