/**********************************************
** @Des: This file ...
** @Author: cheguoyong
** @Date:   2017-09-14 14:23:32
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:31:13
***********************************************/
package controllers

import (
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego"
	"yellbuy.com/YbCloudDataApi/controllers/share"
	"yellbuy.com/YbCloudDataApi/libs"
	baseModels "yellbuy.com/YbCloudDataApi/models/base"
)

type RoleController struct {
	share.AdminBaseController
}

//加载模板
func (self *RoleController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/role/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

func (self *RoleController) List() {
	self.Context["pageTitle"] = "角色管理"
	self.display()
}

func (self *RoleController) Add() {
	//self.Data["zTree"] = true //引入ztreecss
	self.Context["pageTitle"] = "新增角色"
	self.display()
}

func (self *RoleController) Edit() {
	//self.Data["zTree"] = true //引入ztreecss
	self.Context["pageTitle"] = "编辑角色"

	id, _ := self.GetInt("id", 0)
	role, _ := baseModels.RoleGetById(self.Appid, self.Tid, id)
	row := make(map[string]interface{})
	row["id"] = role.Id
	row["code"] = role.Code
	row["is_static"] = role.IsStatic
	row["name"] = role.Name
	row["remark"] = role.Remark
	self.Context["role"] = row

	//获取选择的树节点
	// roleAuth, _ := baseModels.RolePermissionGetById(id)
	// 加载权限

	// self.Data["auth"] = keyList
	// fmt.Println(keyList)
	self.display()
}

func (self *RoleController) GetNodes() {
	id, _ := self.GetInt("id", 0)
	tree, err := baseModels.PermissionLoad(self.ScopeKind)
	if err != nil {
		self.AjaxList(err.Error(), libs.E100000, 0, nil)
	}
	tree = baseModels.SetPermissionTree(tree)
	// 角色权限检查，id为1000000001的默认为超级管理员，具有所有权限
	// result, _, err := baseModels.PermissionCheckForRoles(permissions, strconv.Itoa(id), self.Uid == 1000000001)
	tree, err = baseModels.PermissionCheckForRoles(tree, strconv.Itoa(id), false)
	if err != nil {
		self.AjaxList(err.Error(), libs.E100000, 0, nil)
	}
	res := baseModels.Permission2Tree(tree.Permissions)
	self.AjaxList("", libs.E0, int64(len(res)), res)
}

func (self *RoleController) AjaxSave() {
	role := new(baseModels.Role)
	role.Code = strings.TrimSpace(self.GetString("code"))
	role.Name = strings.TrimSpace(self.GetString("name"))
	role.Remark = strings.TrimSpace(self.GetString("remark"))
	role.CreateTime = time.Now()
	role.UpdateTime = time.Now()
	role.State = 1
	perms := make([]string, 0)
	self.Ctx.Input.Bind(&perms, "nodes_data") //ul ==[str array]
	role_id, _ := self.GetInt("id")
	if role_id == 0 {
		//新增
		role.CreateId = self.Uid
		role.UpdateId = self.Uid
		if id, err := baseModels.RoleAdd(self.Appid, self.Tid, role); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		} else {
			baseModels.RolePermissionMultiAddFor(int(id), perms)
		}
		self.AjaxMsg("", libs.E0)
	}
	//修改
	role.Id = role_id
	role.UpdateId = self.Uid
	if err := baseModels.RoleUpdate(self.Appid, self.Tid, role); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	} else {
		baseModels.RolePermissionSave(role_id, perms)
	}
	self.AjaxMsg("", libs.E0)
}

func (self *RoleController) AjaxDel() {

	role_id, _ := self.GetInt("id")
	// role, _ := baseModels.RoleGetById(self.Appid, self.Tid, role_id)
	// role.Status = 0
	// role.Id = role_id

	if _, err := baseModels.RoleDelete(self.Appid, self.Tid, role_id); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("", libs.E0)
}

func (self *RoleController) Table() {
	//列表
	page, err := self.GetInt("page")
	if err != nil {
		page = 1
	}
	limit, err := self.GetInt("limit")
	if err != nil {
		limit = 30
	}

	name := strings.TrimSpace(self.GetString("name"))
	pageSize := limit
	//查询条件
	filters := make([]interface{}, 0)
	filters = append(filters, "state", 1)
	if name != "" {
		filters = append(filters, "name__icontains", name)
	}
	result, count := baseModels.RoleGetList(self.Appid, self.Tid, page, pageSize, filters...)
	list := make([]map[string]interface{}, len(result))
	for k, v := range result {
		row := make(map[string]interface{})
		row["id"] = v.Id
		row["code"] = v.Code
		row["name"] = v.Name
		row["is_static"] = v.IsStatic
		row["remark"] = v.Remark
		row["create_time"] = beego.Date(v.CreateTime, "Y-m-d H:i:s")
		row["update_time"] = beego.Date(v.UpdateTime, "Y-m-d H:i:s")
		list[k] = row
	}
	self.AjaxList("成功", libs.E0, count, list)
}
