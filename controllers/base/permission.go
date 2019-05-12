/**********************************************
** @Des: 权限因子
** @Author: cheguoyong
** @Date:   2017-09-09 16:14:31
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:23:40
***********************************************/

package controllers

import (
	"strings"

	"yellbuy.com/YbCloudDataApi/controllers/share"
	libs "yellbuy.com/YbCloudDataApi/libs"
	baseModels "yellbuy.com/YbCloudDataApi/models/base"
)

type PermissionController struct {
	share.AdminBaseController
}

func (self *PermissionController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/permission/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

// 修改
func (self *PermissionController) Edit() {
	if self.Ctx.Input.IsPost() {
		content := self.GetString("Content")
		if len(content) == 0 {
			self.AjaxMsg("无内容", libs.E100000)
		}
		err := baseModels.PermissionSave(self.ScopeKind, content)
		if err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}

		// self.AjaxSuccess("成功")
		self.AjaxMsg("", libs.E0)
	} else {
		content, err := baseModels.PermissionRead(self.ScopeKind)
		if err != nil {
			self.Context["error"] = err.Error()
		}

		self.Context["pageTitle"] = "权限资源管理"
		self.Context["content"] = content
		self.display()
	}
}
