package controllers

import (
	// "crypto"
	"encoding/json"

	"yellbuy.com/YbGoCloundFramework/libs"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
	"yellbuy.com/YbGoCloundFramework/utils"

	// "log"
	"strings"
	"time"
)

var (
	ErrPhoneIsRegis     = ErrResponse{422001, "手机用户已经注册"}
	ErrNicknameIsRegis  = ErrResponse{422002, "用户名已经被注册"}
	ErrNicknameOrPasswd = ErrResponse{422003, "账号或密码错误。"}
)

type UserController struct {
	CommonApiController
}

// @Title 登录
// @Description 账号登录，成功返回token
// @Success 200 {object} controllers.api.Response
// @Failure 404 no enough input
// @Failure 401 No Admin
// @router /v1/base/user/login [get,post,OPTIONS]
func (self *UserController) Login() {

	var input map[string]interface{}
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &input)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	// appid, _ := libs.GetInt(input, "appid")
	// tid, _ := libs.GetInt(input, "tid")
	appid := self.Appid
	// username := libs.GetString(input, "username")
	// password := libs.GetString(input, "password")
	// username := self.GetString("username")
	// password := self.GetString("password")

	user, _, err := baseModels.UserValidPassword(input["username"].(string), input["password"].(string), self.GetClientIp(), appid)

	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	name := user.Username
	if len(user.Name) > 0 {
		name = user.Name
	}
	et := utils.EasyToken{
		Username: name,
		Uid:      user.Id,
		Roleids:  user.RoleIds,
		Isleader: int8(user.Isleader),
		// Orgids:user.UserOrgs
		ExpiresAt: time.Now().Unix() + 3600*12,
	}

	token, err := et.GetToken()
	if token == "" || err != nil {
		self.Fail(libs.E100000, err.Error())
	} else {
		self.Success(LoginToken{user, token})
	}
}

// @Title 认证测试
// @Description 测试错误码
// @Success 200 {object} controllers.api.Response
// @Failure 401 unauthorized
// @router v1/base/user/auth [get]
func (self *UserController) Auth() {
	et := utils.EasyToken{}
	authtoken := strings.TrimSpace(self.Ctx.Request.Header.Get("Authorization"))
	valid, _, err := et.ValidateToken(authtoken)
	if !valid {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("is login")
}

// @Title 获取用户列表
// @Description 获取用户列表
// @Success 200 {array} base.User
// @Failure 401 unauthorized
// @router v1/base/users [get]
func (self *UserController) Users() {
	et := utils.EasyToken{}
	authtoken := strings.TrimSpace(self.Ctx.Request.Header.Get("Authorization"))
	valid, _, err := et.ValidateToken(authtoken)
	if !valid {
		self.Fail(libs.E100001, err.Error())
	}
	// UserList(appid, tid uint, external int, pageIndex, pageSize uint32, order string, filters ...interface{}
	pageSize, err := self.GetInt64("pageSize")
	if err != nil {
		pageSize = 10
	}
	pageIndex, err := self.GetInt64("pageIndex")
	if err != nil {
		pageIndex = 0
	}
	filters := make([]interface{}, 0)
	name := strings.TrimSpace(self.GetString("name"))
	if len(name) > 0 {
		filters = append(filters, "Name__contains", name)
	}
	total, users := baseModels.UserList(uint(self.Appid), uint(self.Tid), 0, uint32(pageIndex), uint32(pageSize), "", filters...)
	self.SuccessList(users, total)
}

// @Title 获取组织列表
// @Description 获取组织列表
// @Success 200 {array} base.User
// @Failure 401 unauthorized
// @router v1/base/orgs [get]
func (self *UserController) Orgs() {
	et := utils.EasyToken{}
	authtoken := strings.TrimSpace(self.Ctx.Request.Header.Get("Authorization"))
	valid, _, err := et.ValidateToken(authtoken)
	if !valid {
		self.Fail(libs.E100001, err.Error())
	}
	// UserList(appid, tid uint, external int, pageIndex, pageSize uint32, order string, filters ...interface{}

	orgs := baseModels.OrgList(self.Appid, self.Tid)
	list := make([]*baseModels.Org, 0)
	baseModels.OrgSort(orgs, &list, 0)
	self.SuccessList(list, int64(len(list)))
}
