/**********************************************
** @Des: 权限因子
** @Author: cheguoyong
** @Date:   2017-09-09 16:14:31
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:23:40
***********************************************/

package controllers

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"yellbuy.com/YbCloudDataApi/controllers/share"
	libs "yellbuy.com/YbCloudDataApi/libs"
	baseModels "yellbuy.com/YbCloudDataApi/models/base"
	"yellbuy.com/YbCloudDataApi/utils"
)

type AuthController struct {
	share.AdminBaseController
}

//加载模板
func (self *AuthController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/auth/" + strings.ToLower(actionName) + ".html"
	}
	self.Layout = "public/layout.html"
	self.TplName = tplname
}

func (self *AuthController) Index() {

	self.Data["pageTitle"] = "权限因子"
	self.display()
}

func (self *AuthController) List() {
	self.Data["zTree"] = true //引入ztreecss
	self.Data["pageTitle"] = "权限因子"
	self.display()
}

//获取全部节点
func (self *AuthController) GetNodes() {
	filters := make([]interface{}, 0)
	filters = append(filters, "state", 1)
	result, count := baseModels.AuthGetList(self.Appid, self.Tid, 1, 1000, filters...)
	list := make([]map[string]interface{}, len(result))
	for k, v := range result {
		row := make(map[string]interface{})
		row["id"] = v.Id
		row["pId"] = v.Pid
		row["name"] = v.AuthName
		row["open"] = true
		list[k] = row
	}

	self.AjaxList("成功", libs.E0, count, list)
}

//获取一个节点
func (self *AuthController) GetNode() {
	id, _ := self.GetInt("id")
	result, _ := baseModels.AuthGetById(self.Appid, self.Tid, id)
	// if err == nil {
	// 	self.ajaxMsg(err.Error(), MSG_ERR)
	// }
	row := make(map[string]interface{})
	row["id"] = result.Id
	row["pid"] = result.Pid
	row["auth_name"] = result.AuthName
	row["auth_url"] = result.AuthUrl
	row["sort"] = result.Sort
	row["is_show"] = result.IsShow
	row["icon"] = result.Icon

	fmt.Println(row)

	self.AjaxList("成功", libs.E0, 0, row)
}

//新增或修改
func (self *AuthController) AjaxSave() {
	auth := new(baseModels.Auth)
	auth.UserId = self.Uid
	auth.Pid, _ = self.GetInt("pid")
	auth.AuthName = strings.TrimSpace(self.GetString("auth_name"))
	auth.AuthUrl = strings.TrimSpace(self.GetString("auth_url"))
	auth.Sort, _ = self.GetInt("sort")
	auth.IsShow, _ = self.GetInt("is_show")
	auth.Icon = strings.TrimSpace(self.GetString("icon"))
	auth.UpdateTime = time.Now().Unix()

	auth.State = 1

	id, _ := self.GetInt("id")
	if id == 0 {
		//新增
		auth.CreateTime = time.Now().Unix()
		auth.CreateId = self.Uid
		auth.UpdateId = self.Uid
		if _, err := baseModels.AuthAdd(self.Appid, self.Tid, auth); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}
	} else {
		auth.Id = id
		auth.UpdateId = self.Uid
		if err := auth.Update(); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}
	}
	utils.Cache.Delete("admin_menu_" + strconv.Itoa(int(self.Uid)))
	self.AjaxMsg("", libs.E0)
}

//删除
func (self *AuthController) AjaxDel() {
	id, _ := self.GetInt("id")
	auth, _ := baseModels.AuthGetById(self.Appid, self.Tid, id)
	auth.Id = id
	auth.State = 0
	if err := auth.Update(); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	utils.Cache.Delete("admin_menu_" + strconv.Itoa(int(self.Uid)))
	self.AjaxMsg("", libs.E0)
}
