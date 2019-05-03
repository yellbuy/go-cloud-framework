/**********************************************
** @Des: This file ...
** @Author: cheguoyong
** @Date:   2017-09-08 10:21:13
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-09 18:04:41
***********************************************/
package controllers

import (
	"strings"

	"github.com/astaxie/beego"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
)

type HomeController struct {
	share.AdminBaseController
}

func (self *HomeController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "home/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}
func (self *HomeController) Index() {
	self.Context["pageTitle"] = "系统首页"
	copyright := beego.AppConfig.DefaultString("cms::copyright", "2019 © 云数据 Power by 业贝信息")
	self.Context["copyright"] = copyright
	self.display()
	// self.TplName = "public/main.html"
}

func (self *HomeController) Start() {
	self.Context["pageTitle"] = "控制面板"
	self.display()
}
