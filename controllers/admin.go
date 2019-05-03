/**********************************************
** @Des: This file ...
** @Author: cheguoyong
** @Date:   2017-09-08 10:21:13
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-09 18:04:41
***********************************************/
package controllers

import (
	"fmt"
	"strings"

	"github.com/astaxie/beego"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	"yellbuy.com/YbGoCloundFramework/libs"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

type AdminController struct {
	share.AdminBaseController
	PermissionKey string
}

func (self *AdminController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.AdminBaseController.GetControllerAndAction()
		tplname = "admin/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}
func (self *AdminController) Index() {
	self.Context["pageTitle"] = "系统首页"
	copyright := beego.AppConfig.DefaultString("cms::copyright", "2019 © 云数据 Power by 业贝信息")
	self.Context["copyright"] = copyright
	self.display()
	// self.TplName = "public/main.html"
}

func (self *AdminController) Start() {
	self.Context["pageTitle"] = "控制面板"
	self.display()
}
func (self *AdminController) AjaxMenu() {
	menu, err := baseModels.PermissionModulesLoadForUser(self.ScopeKind, self.Uid, libs.AdminPermissionRootKey, self.IsAdmin)
	if err != nil {
		fmt.Println("AjaxMenu", err)
	}
	self.AjaxSuccess(menu)
	// self.Data["json"] = menu
	// self.ServeJSON()
	// self.StopRun()
}

// func (self *AdminController) AjaxMenu2() {
// 	key := self.GetString("key")
// 	cheMen, found := utils.Cache.Get("admin_menu_" + strconv.Itoa(self.userId))
// 	menu := make(map[string]interface{})
// 	list2 := make([]map[string]interface{}, 0)
// 	i := 0
// 	if len(key) > 0 && found && cheMen != nil { //从缓存取菜单
// 		menu := cheMen.(*baseModels.CheMenu)
// 		for _, v := range menu.PermissionList {
// 			if v.Key == "admin" {
// 				for _, vap := range v.Modules {
// 					if vap.Key == key && vap.HasPermission {
// 						for _, val := range vap.Modules {
// 							if val.IsHide || !val.HasPermission {
// 								continue
// 							}
// 							// 二级菜单
// 							child := make(map[string]interface{})
// 							child["name"] = val.Name
// 							child["icon"] = val.Icon
// 							child["path"] = val.Path
// 							child["isSpread"] = i == 0 || val.IsSpread
// 							// 三级菜单
// 							children := make([]map[string]interface{}, 0)
// 							for _, vam := range val.Modules {
// 								if vam.IsHide || !vam.HasPermission {
// 									continue
// 								}
// 								child := make(map[string]interface{})
// 								child["name"] = vam.Name
// 								child["icon"] = vam.Icon
// 								child["path"] = vam.Path
// 								child["isSpread"] = i == 0 || vam.IsSpread
// 								children = append(children, child)
// 							}
// 							child["children"] = children
// 							list2 = append(list2, child)
// 							i++
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// 	menu["menuList"] = list2
// 	self.Data["json"] = menu
// 	self.ServeJSON()
// 	self.StopRun()
// }
