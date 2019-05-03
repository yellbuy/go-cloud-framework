/**********************************************
** @Des: 管理员
** @Author: cheguoyong
** @Date:   2017-09-16 14:17:37
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:14:07
***********************************************/
package controllers

import (
	// "errors"
	"fmt"
	// "strconv"
	"strings"
	"time"

	"yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	BaseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

type CustomerController struct {
	share.AdminBaseController
}

//加载模板
func (self *CustomerController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/customer/" + strings.ToLower(actionName) + ".html"
	}
	self.Layout = "public/layout.html"
	self.TplName = tplname
}

func (self *CustomerController) List() {
	if self.IsAjax() {
		name := strings.TrimSpace(self.GetString("name"))
		//列表
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		external := 1
		filters := make([]interface{}, 0)
		if len(name) > 0 {
			filters = append(filters, "Name__contains", name)
		}
		order := "-UpdateTime"
		total, list := BaseModels.UserList(self.Appid, self.Tid, external, page-1, limit, order, filters...)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		cont, _ := BaseModels.OrgCount(self.Appid, self.Tid, 0)
		self.Data["allowAdd"] = cont == 0
		self.Data["pageTitle"] = "客户管理"
		self.display()
	}
}

func (self *CustomerController) Add() {
	if self.IsAjax() {
		var id uint = 0
		if user, err := form2Customer(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {

			if _, err := BaseModels.UserAdd(user, ""); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				self.AjaxMsg("", libs.E0)
			}
		}
	} else {
		self.Data["pageTitle"] = "客户管理"
		self.display()
	}
}

func (self *CustomerController) Edit() {

	if self.IsAjax() {
		id, err := self.GetInt64("Id")
		if err != nil || id <= 0 {
			self.AjaxMsg("记录不存在", libs.E100000)
			self.StopRun()
		}
		if user, err := form2Customer(self, uint(id)); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if _, err := BaseModels.UserUpdate(user, ""); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				self.AjaxMsg("", libs.E0)
			}
		}
	} else {
		if id, err := self.GetInt64("id"); err != nil {
			self.Redirect("/customer/list", 302)
			self.StopRun()
		} else if user, err := BaseModels.UserGetById(uint(self.Appid), uint(self.Tid), uint(id)); err != nil {
			self.Redirect("/customer/list", 302)
			self.StopRun()
		} else {
			self.Data["pageTitle"] = "用户管理"
			self.Data["info"] = user
			self.display()
		}
	}
}

func form2Customer(self *CustomerController, id uint) (*BaseModels.User, error) {
	User := new(BaseModels.User)
	User.Id = id
	User.Appid = self.Appid
	User.Tid = self.Tid
	User.Username = strings.TrimSpace(self.GetString("Username"))
	User.Nickname = strings.TrimSpace(self.GetString("Nickname"))
	User.Name = strings.TrimSpace(self.GetString("Name"))
	User.Code = strings.TrimSpace(self.GetString("Code"))
	enable, _ := self.GetUint8("Enable")
	User.Enable = enable
	gender, _ := self.GetUint8("Gender")
	User.Gender = gender
	kind, _ := self.GetInt8("Kind")
	User.Kind = kind
	order, _ := self.GetInt64("Order")
	User.Order = order
	User.Mobile = strings.TrimSpace(self.GetString("Mobile"))
	User.Email = strings.TrimSpace(self.GetString("Email"))
	isleader, _ := self.GetUint8("Isleader")
	User.Isleader = isleader
	User.Tel = strings.TrimSpace(self.GetString("Tel"))
	User.Address = strings.TrimSpace(self.GetString("Address"))
	User.Remark = self.GetString("Remark")
	User.Parentid = 0
	User.IsExternal = 1
	User.Enable = 1
	User.UpdateTime = time.Now()
	if pid, err := self.GetInt64("Parentid"); err == nil {
		User.Parentid = uint(pid)
	}
	orgIdArr := make([]int64, 0)
	User.Orgs = orgIdArr

	return User, nil
}

func (self *CustomerController) Del() {
	if !self.IsAjax() {
		self.StopRun()
	}
	id, _ := self.GetInt64("id")

	if _, err := BaseModels.UserDelete(self.Appid, self.Tid, uint(id)); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("操作成功", libs.E0)
}
