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
	"errors"
	"fmt"
	"strconv"
	"time"

	// "strconv"
	"strings"
	// "time"

	//cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbCloudDataApi/controllers/share"
	"yellbuy.com/YbCloudDataApi/libs"
	baseModels "yellbuy.com/YbCloudDataApi/models/base"
	"yellbuy.com/YbCloudDataApi/utils"
)

type UserController struct {
	share.AdminBaseController
}

//加载模板
func (self *UserController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/user/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

func (self *UserController) List() {
	if self.IsAjax() {
		parentid, _ := self.GetInt64("parentid")
		name := strings.TrimSpace(self.GetString("name"))
		fetchChild, err := self.GetBool("fetchChild")
		if err != nil {
			fetchChild = false
		}
		//列表
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		external := 0
		filters := make([]interface{}, 0)
		if len(name) > 0 {
			filters = append(filters, "Name__contains", name)
		}
		total, list := baseModels.OrgUserList(self.Appid, self.Tid, parentid, external, page-1, limit, fetchChild, filters...)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		cont, _ := baseModels.OrgCount(self.Appid, self.Tid, 0)
		self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "用户管理"
		self.display()
	}
}

func (self *UserController) Add() {
	if self.IsAjax() {
		var id uint = 0
		if user, pwd, err := form2Struct(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if uid, err := baseModels.UserAdd(user, pwd); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				id = uint(uid)
				src := user.Avatar
				if string(src[0]) == "/" {
					src = src[1:len(src)]
					dest := fmt.Sprintf("static/img/avatar/user/%v.png", id)
					// 复制文件
					if src != dest {
						libs.CopyFile(src, dest)
					}
				}
				self.AjaxMsg("", libs.E0)
			}
		}
	} else {
		var pid int64 = 0
		cont, _ := baseModels.OrgCount(self.Appid, self.Tid, pid)
		if cont == 0 {
			self.Redirect("/base/org/list", 302)
			return
		}
		if parent, err := baseModels.OrgGetById(self.Appid, self.Tid, pid); err != nil {
			self.Redirect("/base/org/list", 302)
			return
		} else {
			self.Context["parent"] = parent
		}
		roleList, _ := baseModels.RoleGetList(self.Appid, self.Tid, 0, 10000000)
		self.Context["roleList"] = roleList
		// userOrgIds :=make([]int64,0)
		// data := baseModels.OrgTree(self.Appid,self.Tid,pid, userOrgIds)
		// tree, _ := json.Marshal(data)
		// self.Data["tree"] = string(tree)
		self.Context["pageTitle"] = "用户管理"
		// self.Data["info"] = new(baseModels.User)
		self.display()
	}
}

func (self *UserController) Edit() {
	if self.IsAjax() {
		id, err := self.GetUint("Id")
		if err != nil || id <= 0 {
			self.AjaxMsg("记录不存在", libs.E100000)
			self.StopRun()
		}
		if user, pwd, err := form2Struct(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if _, err := baseModels.UserUpdate(user, pwd); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				// 删除缓存
				kind := libs.GetAuthKindValue(user.Appid, user.Tid, user.Id)
				self.DeleteCache(kind, user.Id)

				src := user.Avatar
				if string(src[0]) == "/" {
					src = src[1:len(src)]
					dest := fmt.Sprintf("static/img/avatar/user/%v.png", id)
					// 复制文件
					if src != dest {
						libs.CopyFile(src, dest)
					}
				}

				self.AjaxMsg("", libs.E0)
			}
		}
	} else {
		var pid int64 = 0
		cont, _ := baseModels.OrgCount(uint(self.Appid), uint(self.Tid), pid)
		if cont == 0 {
			self.Redirect("/base/org/list", 302)
			self.StopRun()
		}

		if id, err := self.GetInt64("id"); err != nil {
			self.Redirect("/base/org/list", 302)
			self.StopRun()
		} else if user, err := baseModels.UserGetById(uint(self.Appid), uint(self.Tid), uint(id)); err != nil {
			self.Redirect("/base/org/list", 302)
			self.StopRun()
		} else {
			userOrgIds := make([]int64, 0)
			for _, v := range user.UserOrgs {
				userOrgIds = append(userOrgIds, v.OrgId)
			}
			data := baseModels.OrgTree(self.Appid, self.Tid, pid, userOrgIds)
			tree, _ := json.Marshal(data)
			treeJson := string(tree)
			self.Context["tree"] = treeJson
			self.Context["pageTitle"] = "用户管理"
			self.Context["info"] = user
			roles := make([]int, 0)
			if len(user.RoleIds) > 0 {
				roleIdArr := strings.Split(user.RoleIds, ",")
				for _, roleId := range roleIdArr {
					if id, err := strconv.Atoi(roleId); err == nil {
						roles = append(roles, id)
					}
				}
			}

			roleList, _ := baseModels.RoleGetList(self.Appid, self.Tid, 1, 1000000)
			if len(roles) > 0 {
				for _, r := range roleList {
					for _, i := range roles {
						if r.Id == i {
							r.Checked = true
							break
						}
					}
				}
			}
			self.Context["roleList"] = roleList

			self.display()
		}
	}
}

func (self *UserController) Profile() {
	if self.IsAjax() {
		user, _ := baseModels.UserGetById(uint(self.Appid), uint(self.Tid), uint(self.Uid))
		if user == nil || user.Id == 0 {
			self.AjaxMsg("用户不存在", libs.E100000)
		}
		user.Nickname = strings.TrimSpace(self.GetString("Nickname"))
		user.Name = strings.TrimSpace(self.GetString("Name"))
		user.Mobile = strings.TrimSpace(self.GetString("Mobile"))
		user.Tel = strings.TrimSpace(self.GetString("Tel"))
		user.Email = strings.TrimSpace(self.GetString("Email"))
		//user.Nickname = strings.TrimSpace(self.GetString("Nickname"))

		// user.Enable, _ = self.GetInt8("Enable")
		user.UpdateTime = time.Now()

		pwd := ""
		resetPwd := self.GetString("ResetPwd")
		if resetPwd == "1" {

			pwdNew := strings.TrimSpace(self.GetString("PasswordNew"))
			if len(pwdNew) == 0 {
				self.AjaxMsg("请输入新密码", libs.E100000)
			}
			pwdConfirm := strings.TrimSpace(self.GetString("PasswordConfirm"))

			if pwdNew != pwdConfirm {
				self.AjaxMsg("两次密码不一致", libs.E100000)
			}

			pwdOld := strings.TrimSpace(self.GetString("PasswordOld"))
			if _, _, err := baseModels.UserValidPassword(user.Username, pwdOld, self.GetClientIp(), uint(self.Appid)); err != nil {
				self.AjaxMsg(err.Error(), libs.E100000)
			}

			pwd = pwdNew
		}

		if _, err := baseModels.UserUpdate(user, pwd); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		} else {
			// 删除缓存
			self.DeleteCache(self.ScopeKind, user.Id)
			self.AjaxMsg("", libs.E0)
		}

	} else {
		self.Context["pageTitle"] = "资料修改"
		user, _ := baseModels.UserGetById(uint(self.Appid), uint(self.Tid), uint(self.Uid))
		row := make(map[string]interface{})
		row["Id"] = user.Id
		row["Username"] = user.Username
		row["Nickname"] = user.Nickname
		row["Name"] = user.Name
		row["Mobile"] = user.Mobile
		row["Tel"] = user.Tel
		row["Email"] = user.Email
		self.Context["info"] = row
		// utils.Cache.Delete("uid" + strconv.Itoa(uint(self.Uid)))
		self.display()
	}

}

func form2Struct(self *UserController, id uint) (*baseModels.User, string, error) {
	User := new(baseModels.User)
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
	order, _ := self.GetInt64("Order")
	User.Order = order
	User.Mobile = strings.TrimSpace(self.GetString("Mobile"))
	User.Email = strings.TrimSpace(self.GetString("Email"))
	User.Position = strings.TrimSpace(self.GetString("Position"))
	isleader, _ := self.GetUint8("Isleader")
	User.Isleader = isleader
	User.Tel = strings.TrimSpace(self.GetString("Tel"))
	User.Address = strings.TrimSpace(self.GetString("Address"))
	User.Parentid = 0
	if pid, err := self.GetInt64("Parentid"); err == nil {
		User.Parentid = uint(pid)
	}

	// User.Parentid = 0

	orgIds := strings.TrimSpace(self.GetString("OrgIds"))
	if len(orgIds) == 0 {
		self.AjaxMsg("请选择所属组织", libs.E100000)
		return User, "", errors.New("请选择所属组织")
	}
	var orgIdArr []int64
	if err := json.Unmarshal([]byte("["+orgIds+"]"), &orgIdArr); err != nil {
		return User, "", errors.New("请选择所属组织")
	}
	pwd := ""
	User.Orgs = orgIdArr
	pwd = strings.TrimSpace(self.GetString("Password"))
	if User.Id == 0 && len(pwd) == 0 {
		return User, "", errors.New("请输入密码")
	}
	repwd := strings.TrimSpace(self.GetString("Repassword"))
	if pwd != repwd {
		return User, "", errors.New("密码和确认密码必须一致")
	}

	roleIds := make([]int, 0)
	self.Ctx.Input.Bind(&roleIds, "RoleIds")
	for _, id := range roleIds {
		if id > 0 {
			if len(User.RoleIds) > 0 {
				User.RoleIds = User.RoleIds + ","
			}
			User.RoleIds = User.RoleIds + strconv.Itoa(id)
		}
	}
	return User, pwd, nil
}

func (self *UserController) Del() {
	if !self.IsAjax() {
		self.StopRun()
	}
	id, _ := self.GetUint("id")

	if _, err := baseModels.UserSoftDelete(self.Appid, self.Tid, id); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("操作成功", libs.E0)
}

func (self *UserController) DeleteCache(kind uint8, uid uint) {
	utils.Cache.Delete(fmt.Sprintf(utils.CacheKeyBaseUserAuthByUid, uid))
	utils.Cache.Delete(fmt.Sprintf(utils.CacheKeyBasePermissionByKindUid, kind, uid))
	utils.Cache.Delete(fmt.Sprintf(utils.CacheKeyBasePermissionMdlByKindKeyUid, kind, libs.AdminPermissionRootKey, uid))
}
