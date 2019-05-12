/**********************************************
** @Des: base controller
** @Author:
** @Date:   2017-09-07 16:54:40
** @Last Modified by:
** @Last Modified time: 2017-09-18 10:28:01
***********************************************/
package share

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"yellbuy.com/YbGoCloundFramework/libs"
	//"yellbuy.com/YbGoCloundFramework/utils"

	"github.com/astaxie/beego"
	"github.com/yansuan/beego-pongo2"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

type AdminBaseController struct {
	beego.Controller
	ControllerName string
	ActionName     string

	PageSize uint
	AllowUrl string

	User     *baseModels.User
	Username string
	Realname string
	OrgId    int64
	RoleIds  string

	IsAdmin bool
	Appid   uint
	Tid     uint
	Uid     uint
	// 主账号用户ID，切换数据权限时需要
	MasterUid uint
	*baseModels.PermissionTree

	// 存储使用的值
	ScopeTypeAppid uint
	ScopeTypeTid   uint
	ScopeTypeUid   uint

	// 数据过滤层级 0：默认，1：系统，2：应用，3：租户，4：用户，多少级就应该有多少个过滤参数
	ScopeLevel uint8
	// 所在类型 0：默认，1：系统，2：应用，3：租户，4：用户，即记录在数据库中值达到的层级，0表示：appid，tid，uid均为0；1表示：appid有值，tid，uid为0
	ScopeType uint8

	// 后台类型，0：未授权 1：系统，2：应用，3：租户，4：用户
	ScopeKind uint8
	// 权限Key，多个权限使用","分割
	PermissionKeys string
	// 是否加载下级子权限
	PermissionChildrenLoad bool
	// 是否进行了下级子权限的判断和加载
	PermissionChildrenChecked bool

	PermissionChildren     []baseModels.PermissionBase
	PermissionChildrenKeys []string

	Context pongo2.Context
}

// GetUint returns input value as int64 or the default value while it's present and input is blank.
func (self *AdminBaseController) GetUint(key string, def ...uint) (uint, error) {
	strv := self.Ctx.Input.Query(key)
	if len(strv) == 0 && len(def) > 0 {
		return def[0], nil
	}
	val, err := strconv.ParseInt(strv, 10, 64)
	return uint(val), err
}

// 获取查询范围值
func (self *AdminBaseController) GetScopeLevelIds() []interface{} {
	scopeIds := make([]interface{}, 0)
	switch self.ScopeLevel {
	case libs.DATA_SCOPE_DEFAULT:
		// 缺省值，将没有数据
		scopeIds = append(scopeIds, -1)
		break
	case libs.DATA_SCOPE_SYS:
		break
	case libs.DATA_SCOPE_APP:
		scopeIds = append(scopeIds, self.Appid)
		break
	case libs.DATA_SCOPE_TENANT:
		scopeIds = append(scopeIds, self.Appid)
		scopeIds = append(scopeIds, self.Tid)
		break
	case libs.DATA_SCOPE_USER:
		scopeIds = append(scopeIds, self.Appid)
		scopeIds = append(scopeIds, self.Tid)
		scopeIds = append(scopeIds, self.Uid)
		break
	}
	return scopeIds
}

// 返回应保存的appid,tid,uid
func (self *AdminBaseController) GetScopeTypeIds() (uint, uint, uint) {
	return self.ScopeTypeAppid, self.ScopeTypeTid, self.ScopeTypeUid
}

// 获取授权范围值
func (self *AdminBaseController) GetAuthScopeTypeIds(kind uint8) (uint, uint, error) {
	switch kind {
	case libs.DATA_SCOPE_DEFAULT:
		// 缺省值，将没有数据
		return 0, 0, errors.New("无权限")
	case libs.DATA_SCOPE_SYS:
		return 0, 0, nil
	case libs.DATA_SCOPE_APP:
		return self.Appid, 0, nil
	case libs.DATA_SCOPE_TENANT:
		return self.Appid, self.Tid, nil
	case libs.DATA_SCOPE_USER:
		return self.Appid, self.Tid, nil
	}
	return 0, 0, errors.New("授权参数不正确")
}

//前期准备
func (self *AdminBaseController) Prepare() {
	self.Context = make(pongo2.Context)
	self.PageSize = 20
	controllerName, actionName := self.GetControllerAndAction()
	self.ControllerName = strings.ToLower(controllerName[0 : len(controllerName)-10])
	self.ActionName = strings.ToLower(actionName)

	self.Data["version"] = beego.AppConfig.String("version")
	self.Data["siteName"] = beego.AppConfig.String("site.name")
	self.Data["curRoute"] = self.ControllerName + "." + self.ActionName
	self.Data["curController"] = self.ControllerName
	self.Data["curAction"] = self.ActionName

	self.Context["version"] = beego.AppConfig.String("version")
	self.Context["siteName"] = beego.AppConfig.String("site.name")
	self.Context["curRoute"] = self.ControllerName + "." + self.ActionName
	self.Context["curController"] = self.ControllerName
	self.Context["curAction"] = self.ActionName
	// noAuth := "ajaxsave/ajaxdel/table/loginin/loginout/getnodes/start"
	// isNoAuth := strings.Contains(noAuth, self.actionName)
	fmt.Println(self.ControllerName)
	if strings.Compare(self.ControllerName, "public") != 0 && strings.Compare(self.ControllerName, "apidoc") != 0 &&
		strings.Compare(self.ControllerName, "home") != 0 && strings.Compare(self.ControllerName, "editor") != 0 {
		self.auth()
	}

	if self.User != nil {
		if len(self.User.UserOrgs) > 0 {
			self.OrgId = self.User.UserOrgs[0].OrgId
		}
		self.RoleIds = self.User.RoleIds
	}

}
func (self *AdminBaseController) Display(tplPath string) {
	//pongo2.RenderString(self.Ctx, tplPath, self.Context)
	if err := pongo2.Render(self.Ctx, tplPath, self.Context); err != nil {
		fmt.Println(err)
	}
	self.StopRun()
}

//登录权限验证
func (self *AdminBaseController) auth() {
	// self.CruSession = self.Ctx.Input.CruSession
	session := self.GetSession(libs.AdminAuthSessionName)
	if session != nil {
		sessionStr, ok := session.(string)
		if ok && sessionStr != "" {
			authSession := libs.GetAdminAuthSession(sessionStr)
			// 主用户id才是登录后不会变的
			if authSession.MasterUid > 0 {
				masterUid := authSession.MasterUid
				//self.ScopeKind = authSession.ScopeKind
				user, err := baseModels.UserGetByAuth(masterUid)
				if err != nil {
					baseModels.DeleteUserAuthCache(masterUid)
				} else {
					if masterUid != uint(user.Id) {
						// 匹配不上，进行删除
						baseModels.DeleteUserAuthCache(user.Id)
					} else {
						// 授权判断
						isAdmin := user.UserIsAdmin()
						// 获取授权Key
						authKey := libs.GetAuthKey(authSession.Appid, authSession.Tid, authSession.Uid, authSession.MasterUid,
							user.LoginDevice, user.Password, user.Salt, uint8(user.Enable), user.IsExternal, isAdmin, user.RoleIds, authSession.IsProxy)
						// 匹配授权key，实现简单的单点登录
						if authKey == authSession.AuthKey {
							self.User = user
							self.MasterUid = masterUid

							self.Appid = authSession.Appid
							self.Tid = authSession.Tid
							self.Uid = authSession.Uid

							self.Username = user.Username
							self.Realname = user.Name
							self.IsAdmin = isAdmin
							self.RoleIds = user.RoleIds
							uid := self.Uid
							if authSession.IsProxy == 1 {
								uid = 0
							}
							// 获取所在级别，代理用户按uid为0获取值
							self.ScopeKind = libs.GetAuthKindValue(self.Appid, self.Tid, uid)

							if permissionTree, err := baseModels.PermissionLoadForUser(self.ScopeKind, self.Uid, isAdmin); err == nil {
								self.PermissionTree = permissionTree
							} else {
								fmt.Println("PermissionLoadForUser", err)
								self.PermissionTree = &baseModels.PermissionTree{}
							}

							self.PermissonCheck()
							self.setDataContext()
						}

					}

				}
			}
		}
	}

	if self.Uid == 0 && (self.ControllerName != "login" && self.ActionName != "loginin") {
		self.RedirectTo(beego.URLFor("LoginController.LoginIn"))
	}
}

func (self *AdminBaseController) PermissonCheck() {
	// 根据后台类型，设置数据保存和过滤的默认范围
	// 默认查询过滤级别
	self.ScopeLevel = self.ScopeKind
	// 默认数据保存记录类型，默认保存至Uid
	self.ScopeType = libs.DATA_SCOPE_USER
	// 是否进行了下级权限的检测，初始为False
	self.PermissionChildrenChecked = false

	permissionKeys := strings.TrimSpace(self.PermissionKeys)
	// 是否有权限
	hasAuth := false
	if len(permissionKeys) > 0 {
		// 走PermissionKey校验方式
		permissionKeyArr := strings.Split(permissionKeys, ",")
		length := len(permissionKeyArr)
		if length > 0 {
			mainPermissionKey := strings.TrimSpace(permissionKeyArr[0])
			// 有权限
			if mainPerm, ok := self.PermissionTree.PermissionMap[mainPermissionKey]; ok && mainPerm.GetPermission() {
				hasAuth = true
				// 设置数据权限
				scopeLevel := mainPerm.GetScopeLevel()
				if scopeLevel != libs.DATA_SCOPE_DEFAULT {
					self.ScopeLevel = scopeLevel
				}
				scopeType := mainPerm.GetScopeType()
				if scopeType != libs.DATA_SCOPE_DEFAULT {
					self.ScopeType = scopeType
				}
			}
			if length > 1 && !hasAuth {
				for i := 1; i < length; i++ {
					permissionKey := strings.TrimSpace(permissionKeyArr[i])
					if perm, ok := self.PermissionTree.PermissionMap[permissionKey]; ok && perm.GetPermission() {
						hasAuth = true
						break
					}
				}
			}
			// 有权限，获取直接下级权限，此处用在界面按钮的状态控制方面
			if hasAuth && self.PermissionChildrenLoad {
				self.PermissionChildrenChecked = true
				permissonArr, err := baseModels.PermissionLoadChildForKey(mainPermissionKey, self.ScopeKind, self.Uid, self.IsAdmin)
				if err != nil {
					length := len(permissonArr)
					keyArr := make([]string, length, length)
					for i := 0; i < length; i++ {
						keyArr[i] = permissonArr[i].Key
					}
					self.PermissionChildren = permissonArr
					self.PermissionChildrenKeys = keyArr
				}
			}
		}
	} else {
		// 走Url地址校验方式
		//不需要权限检查
		publicAuth := "ajaxsave/ajaxdel/table/loginin/loginout/getnodes/getfields/gettree/start/show/print/ajaxapisave/index/group/public/home/env/code/apidetail/ajaxmenu/oauth/upload/avatarupload/ueditor"
		// 检查公共权限
		hasAuth = strings.Contains(publicAuth, self.ActionName)
		if !hasAuth {
			// 请求地址判断
			url := self.ControllerName + "/" + self.ActionName
			hasAuth = strings.Contains(self.PermissionTree.AllowUrls, strings.ToLower(url))
			// fmt.Println("self.PermissionTree.AllowUrls:", self.PermissionTree.AllowUrls)
		}
	}

	// 设置存储数据权限值
	switch self.ScopeType {
	case libs.DATA_SCOPE_SYS:
		self.ScopeTypeAppid, self.ScopeTypeTid, self.ScopeTypeUid = 0, 0, 0
		break
	case libs.DATA_SCOPE_APP:
		self.ScopeTypeAppid, self.ScopeTypeTid, self.ScopeTypeUid = self.Appid, 0, 0
		break
	case libs.DATA_SCOPE_TENANT:
		self.ScopeTypeAppid, self.ScopeTypeTid, self.ScopeTypeUid = self.Appid, self.Tid, 0
	case libs.DATA_SCOPE_USER:
		self.ScopeTypeAppid, self.ScopeTypeTid, self.ScopeTypeUid = self.Appid, self.Tid, self.Uid
	}
	if !hasAuth {
		if self.IsAjax() {
			self.AjaxMsg("没有权限", libs.E100002)
		} else {
			self.Ctx.WriteString("没有权限")
		}
	}
}

func (self *AdminBaseController) setDataContext() {
	self.Data["adminScopeKind"] = self.ScopeKind
	self.Data["uid"] = self.Uid
	self.Data["tid"] = self.Tid
	self.Data["appid"] = self.Appid
	self.Data["username"] = self.Username
	self.Data["realname"] = self.Realname
	self.Data["masterUid"] = self.MasterUid
	self.Data["scopeKind"] = self.ScopeKind

	self.Data["isAdmin"] = self.IsAdmin
	self.Data["user"] = self.User
	self.Data["permissionChildrenChecked"] = self.PermissionChildrenChecked
	self.Data["permissionChildren"] = self.PermissionChildren
	self.Data["permissionChildrenKeys"] = self.PermissionChildrenKeys

	self.Context["adminScopeKind"] = self.ScopeKind
	self.Context["uid"] = self.Uid
	self.Context["tid"] = self.Tid
	self.Context["appid"] = self.Appid
	self.Context["username"] = self.Username
	self.Context["realname"] = self.Realname
	self.Context["masterUid"] = self.MasterUid
	self.Context["scopeKind"] = self.ScopeKind

	self.Context["isAdmin"] = self.IsAdmin
	self.Context["user"] = self.User

	self.Context["permissionChildrenChecked"] = self.PermissionChildrenChecked
	self.Context["permissionChildren"] = self.PermissionChildren
	self.Context["permissionChildrenKeys"] = self.PermissionChildrenKeys
}

// 是否POST提交
func (self *AdminBaseController) IsPost() bool {
	return self.Ctx.Request.Method == "POST"
}

//获取用户IP地址
func (self *AdminBaseController) GetClientIp() string {
	s := self.Ctx.Input.IP()
	return s
	// s := self.Ctx.Request.RemoteAddr
	// l := strings.LastIndex(s, ":")
	// return s[0:l]
}

// 重定向
func (self *AdminBaseController) RedirectTo(url string) {
	self.Redirect(url, 302)
	self.StopRun()
}

//加载模板
func (self *AdminBaseController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		tplname = self.ControllerName + "/" + self.ActionName + ".html"
	}
	self.Layout = "public/layout.html"
	self.TplName = tplname
}

//ajax返回
func (self *AdminBaseController) AjaxMsg(msg interface{}, msgno int) {
	out := make(map[string]interface{})
	out["status"] = msgno
	out["message"] = msg
	out["errcode"] = msgno
	out["errmsg"] = msg
	self.Data["json"] = out
	self.ServeJSON()
	self.StopRun()
}

func (self *AdminBaseController) AjaxSuccess(data ...interface{}) {
	out := make(map[string]interface{})
	out["errcode"] = 0
	if len(data) > 0 {
		out["data"] = data[0]
	}
	if len(data) > 1 {
		out["errmsg"] = data[1]
		out["message"] = data[1]
	} else {
		out["errmsg"] = "ok"
		out["message"] = "ok"
	}
	out["status"] = 0

	self.Data["json"] = out
	self.ServeJSON()
	self.StopRun()
}

func (self *AdminBaseController) AjaxSuccessWithMsg(data interface{}, msg string) {
	out := make(map[string]interface{})
	out["status"] = 0
	out["message"] = msg
	out["errcode"] = 0
	out["errmsg"] = msg
	out["data"] = data
	self.Data["json"] = out
	self.ServeJSON()
	self.StopRun()
}

func (self *AdminBaseController) AjaxFail(errcode int, errmsg interface{}) {
	out := make(map[string]interface{})
	out["status"] = errcode
	out["message"] = errmsg
	out["errcode"] = errcode
	out["errmsg"] = errmsg
	self.Data["json"] = out
	self.ServeJSON()
	self.StopRun()
}

func (self *AdminBaseController) AjaxList(msg interface{}, msgno int, count int64, data interface{}) {
	out := make(map[string]interface{})
	out["code"] = msgno
	out["msg"] = msg
	out["errcode"] = msgno
	out["errmsg"] = msg
	out["count"] = count
	out["data"] = data
	self.Data["json"] = out
	self.ServeJSON()
	self.StopRun()
}
