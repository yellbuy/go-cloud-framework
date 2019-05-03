package controllers

import (
	"strconv"
	"strings"

	"github.com/astaxie/beego"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/base"
	// "yellbuy.com/YbGoCloundFramework/utils"
	// "log"
	// "strings"
	// "time"
)

type ApiAvatarController struct {
	beego.Controller
}

// @Title 获取用户头像
// @Description 获取用户头像，id为0则为用户头像
// @Success 200 {object} string
// @router v1/avatar/user/:id [get]
func (self *ApiAvatarController) AvatarUser() {
	str := self.Ctx.Input.Param(":id")
	index := strings.Index(str, ".")
	if index >= 0 {
		str = str[:index]
	}

	id, _ := strconv.Atoi(str)
	uid := uint(id)
	//weixin.WxUserGetIdByOpenid("123")
	path := libs.GetPathForUser(uid)
	if uid > 0 && path == "" {
		user, _ := base.UserGetByAuth(uid)
		path = user.Avatar
	}
	if path == "" {
		path = libs.GetPathForUser(0)
	}
	file, _ := libs.ReadFile(path)
	self.Ctx.Output.ContentType("png")
	self.Ctx.Output.Body(file)
}

// @Title 获取租户logo
// @Description 获取租户logo，id为0则为当前租户的logo
// @Success 200 {object} string
// @router v1/avatar/tenant/:id [get]
func (self *ApiAvatarController) AvatarTenant() {
	str := self.Ctx.Input.Param(":id")
	index := strings.Index(str, ".")
	if index >= 0 {
		str = str[:index]
	}

	id, _ := strconv.Atoi(str)
	tid := uint(id)
	path := libs.GetPathForTenant(tid)
	if tid > 0 && path == "" {
		tenant, _ := base.TenantGetByCache(tid, 0)
		path = tenant.Logo
	}
	if path == "" {
		path = libs.GetPathForTenant(0)
	}
	file, _ := libs.ReadFile(path)
	self.Ctx.Output.ContentType("png")
	self.Ctx.Output.Body(file)
}
