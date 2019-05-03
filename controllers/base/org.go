/**********************************************
** @Des: 管理员
** @Author: cheguoyong
** @Date:   2017-09-16 14:17:37
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:14:07
***********************************************/
package controllers

import (
	"encoding/json"
	"fmt"

	// "strconv"
	"strings"
	// "time"

	//"github.com/astaxie/beego/orm"
	"yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	BaseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

type OrgController struct {
	share.AdminBaseController
}

func (self *OrgController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/org/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

func (self *OrgController) List() {
	if self.IsAjax() {
		// var mystruct = map[int]interface
		data := make(map[string]interface{})
		list := BaseModels.OrgList(self.Appid, self.Tid)

		data["code"] = libs.E0
		data["msg"] = libs.ErrorMap[libs.E0]
		data["data"] = list
		self.Data["json"] = data
		fmt.Println("data:")
		fmt.Println(data)
		self.ServeJSON()
	} else {
		cont, _ := BaseModels.OrgCount(self.Appid, self.Tid, 0)
		self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "组织管理"

		pid, _ := self.GetInt64("parentid")
		if org, err := BaseModels.OrgGetById(self.Appid, self.Tid, pid); err == nil {
			self.Data["org"] = org
		}
		self.display()
	}
}

func (self *OrgController) MembSelect() {
	if self.IsAjax() {
		// var mystruct = map[int]interface
		data := make(map[string]interface{})
		list := BaseModels.OrgList(self.Appid, self.Tid)

		data["code"] = libs.E0
		data["msg"] = libs.ErrorMap[libs.E0]
		data["data"] = list
		self.Data["json"] = data
		fmt.Println("data:")
		fmt.Println(data)
		self.ServeJSON()
	} else {
		cont, _ := BaseModels.OrgCount(self.Appid, self.Tid, 0)
		self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "组织管理"

		pid, _ := self.GetInt64("parentid")
		if org, err := BaseModels.OrgGetById(self.Appid, self.Tid, pid); err == nil {
			self.Context["org"] = org
		}
		self.display()
	}
}

//获取全部节点
func (self *OrgController) Nodes() {
	result := BaseModels.OrgList(self.Appid, self.Tid)
	list := make([]map[string]interface{}, len(result))
	for k, v := range result {
		row := make(map[string]interface{})
		row["id"] = v.Id
		row["pId"] = v.Parentid
		row["name"] = v.Name
		row["open"] = true
		list[k] = row
	}

	self.AjaxList("成功", 0, 0, list)
}

//获取全部节点
func (self *OrgController) Tree() {
	parentid := int64(0)
	userOrgIds := make([]int64, 0)
	tree := BaseModels.OrgTree(self.Appid, self.Tid, parentid, userOrgIds)
	self.AjaxList("成功", libs.E0, 1, tree)
}

func (self *OrgController) Add() {
	if self.IsAjax() {
		Org := new(BaseModels.Org)
		Org.Appid = self.Appid
		Org.Tid = self.Tid
		Org.Name = strings.TrimSpace(self.GetString("name"))
		Org.Code = strings.TrimSpace(self.GetString("code"))
		Org.Parentid = 0
		if pid, err := self.GetInt64("parentid"); err == nil {
			Org.Parentid = pid
		}
		fmt.Println(Org)
		if _, err := BaseModels.OrgAdd(Org); err != nil {
			fmt.Println(err)
			self.AjaxMsg(err.Error(), libs.E100000)
		}
		self.AjaxMsg("", libs.E0)
	} else {
		var pid int64 = 0
		if addpid, err := self.GetInt64("parentid"); err == nil {
			pid = addpid
		}
		if pid == 0 {
			cont, _ := BaseModels.OrgCount(self.Appid, self.Tid, pid)
			if cont > 0 {
				self.Redirect("/base/org/list", 302)
				return
			}
		}
		if parent, err := BaseModels.OrgGetById(self.Appid, self.Tid, pid); err != nil {
			self.Redirect("/base/org/list", 302)
			return
		} else {
			self.Context["parent"] = parent
		}
		userOrgIds := make([]int64, 0)
		data := BaseModels.OrgTree(self.Appid, self.Tid, pid, userOrgIds)
		tree, _ := json.Marshal(data)
		self.Context["tree"] = string(tree)
		self.Context["pageTitle"] = "组织管理"
		self.display()
	}
}

func (self *OrgController) Edit() {
	if self.IsAjax() {
		id, _ := self.GetInt64("id")
		Org, err := BaseModels.OrgGetById(self.Appid, self.Tid, id)
		if err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			return
		}

		Org.Name = strings.TrimSpace(self.GetString("name"))
		Org.Code = strings.TrimSpace(self.GetString("code"))
		Org.Parentid = 0
		if pid, err := self.GetInt64("parentid"); err == nil {
			Org.Parentid = pid
		}
		fmt.Println(Org)
		if _, err := BaseModels.OrgUpdate(Org); err != nil {
			fmt.Println(err)
			self.AjaxMsg(err.Error(), libs.E100000)
		}
		self.AjaxMsg("", libs.E0)
	} else {
		var id int64 = 0
		if addpid, err := self.GetInt64("id"); err == nil {
			id = addpid
		}
		if id == 0 {
			self.Redirect("/org/list", 302)
			return
		}
		if info, err := BaseModels.OrgGetById(self.Appid, self.Tid, id); err != nil {
			self.Redirect("/org/list", 302)
			return
		} else {
			self.Context["info"] = info
			if info.Parentid > 0 {
				if parent, err := BaseModels.OrgGetById(self.Appid, self.Tid, info.Parentid); err == nil {
					self.Context["parent"] = parent
				}
			}
		}

		var pid int64 = 0
		userOrgIds := make([]int64, 0)
		data := BaseModels.OrgTree(self.Appid, self.Tid, pid, userOrgIds)
		tree, _ := json.Marshal(data)
		self.Context["tree"] = string(tree)
		self.Context["pageTitle"] = "组织管理"
		self.display()
	}
}

func (self *OrgController) Del() {
	if !self.IsAjax() {
		self.StopRun()
	}
	id, _ := self.GetInt64("id")

	if _, err := BaseModels.OrgDelete(self.Appid, self.Tid, id); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("操作成功", libs.E0)
}
