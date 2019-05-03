/**********************************************
** @Des: login
** @Author: cheguoyong
** @Date:   2017-09-07 16:30:10
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:55:21
***********************************************/
package controllers

import (
	"fmt"
	"strings"

	"github.com/astaxie/beego"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/utils"

	// "yellbuy.com/YbGoCloundFramework/models"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

type LoginController struct {
	share.AdminBaseController
}

//登录 TODO:XSRF过滤
func (self *LoginController) LoginIn() {
	if self.Uid > 0 {
		self.RedirectTo(beego.URLFor("AdminController.Index"))
	}
	beego.ReadFromRequest(&self.Controller)

	errmsg := ""
	appid, err := self.GetUint32("appid", 0)
	if err != nil {
		errmsg = "参数不正确"
	}

	if self.IsPost() && err == nil {
		username := strings.TrimSpace(self.GetString("username"))
		password := strings.TrimSpace(self.GetString("password"))
		captcha := strings.TrimSpace(self.GetString("captcha"))
		if len(captcha) != 4 {
			errmsg = "验证码不正确!"
		}
		if username != "" && password != "" {
			// var isExternal int8 = 0
			user, authKey, err := baseModels.UserValidPassword(username, password, self.GetClientIp(), appid)
			fmt.Println(user)
			// flash := beego.NewFlash()
			if err == nil {
				if user.IsExternal > 0 {
					errmsg = "外部账号不能登录后台"
				} else {
					var isProxy uint8 = 0
					authSession := libs.AdminAuthSession{user.Appid, user.Tid, user.Id, user.Id, isProxy, authKey}
					self.SetSession(libs.AdminAuthSessionName, authSession.GetSessionString())
					// 默认6个小时过期
					// self.Ctx.SetCookie("auth", strconv.Itoa(int(user.Id))+"|"+authkey, 6*3600)
					self.RedirectTo(beego.URLFor("AdminController.Index"))
				}

			} else {
				errmsg = err.Error()
			}
		} else {
			errmsg = "用户名和密码不能为空"
		}
	}
	self.Context["errmsg"] = errmsg
	self.Display("login/login.html")
}

//登出
func (self *LoginController) LoginOut() {
	if self.Uid > 0 {
		// 清除缓存
		utils.Cache.Delete(fmt.Sprintf(utils.CacheKeyBaseUserAuthByUid, self.Uid))
		utils.Cache.Delete(fmt.Sprintf(utils.CacheKeyBasePermissionByKindUid, self.ScopeKind, self.Uid))
		utils.Cache.Delete(fmt.Sprintf(utils.CacheKeyBasePermissionMdlByKindKeyUid, self.ScopeKind, libs.AdminPermissionRootKey, self.Uid))
	}
	// utils.Cache.Delete("admin_menu_" + strconv.Itoa(self.userId))
	self.DestroySession()
	//self.SessionRegenerateID()
	// self.Ctx.SetCookie("auth", "")
	self.RedirectTo(beego.URLFor("LoginController.LoginIn"))
}

func (self *LoginController) NoAuth() {
	self.Ctx.WriteString("没有权限")
}
