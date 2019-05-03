package controllers

import (
	"yellbuy.com/YbGoCloundFramework/libs"
)

type BaseApiController struct {
	CommonApiController
	Username string
	Nickname string
	Realname string
	OrgId    int64
	RoleIds  string
	Isleader uint8

	IsAdmin bool
}

//前期准备
func (self *BaseApiController) Prepare() {
	// 进行token验证
	self.IsValidateToken = true
	self.CommonApiController.Prepare()
	if self.Uid == 0 {
		self.Fail(libs.E100001, libs.ErrorMap[libs.E100001])
	}
	// 设置用户信息
	self.Appid = self.User.Appid
	self.Tid = self.User.Tid
	self.Username = self.User.Username
	self.Nickname = self.User.Nickname
	self.Realname = self.User.Name
	self.RoleIds = self.User.RoleIds
	self.Isleader = self.User.Isleader
	self.IsAdmin = self.User.UserIsAdmin()
}
