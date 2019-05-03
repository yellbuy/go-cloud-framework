// app管理

package controllers

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"yellbuy.com/YbGoCloundFramework/controllers/share"
	"yellbuy.com/YbGoCloundFramework/libs"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type AppController struct {
	share.AdminBaseController
}

//加载模板
func (self *AppController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/app/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}
func (self *AppController) AppList() {
	if self.IsAjax() {
		key := self.GetString("key")
		rangetime := self.GetString("rangetime")
		appstate, err := self.GetInt8("appstate", -2)
		appmode, err := self.GetInt8("appmode", 0)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		var starttime string = ""
		var endtime string = ""
		if len(rangetime) > 0 {
			sp := strings.Split(rangetime, " _ ")
			starttime = sp[0]
			endtime = sp[1]
		}

		//列表

		// AppGetList(appid uint, tid uint, key string, starttime string,endtime string, appstate,appmode int8, page, pagesize uint32) ([]*App, int64, error) {
		// list := make([]*App, 0)
		list, total, _ := baseModels.AppGetList(key, starttime, endtime, appstate, appmode, page-1, limit)

		self.AjaxList("成功", libs.E0, total, list)
	} else {

		self.Context["pageTitle"] = "APP管理"
		self.display()
	}
}
func (self *AppController) AppEdit() {
	id, _ := self.GetUint("Id")
	if self.Ctx.Input.IsPost() {
		if form, err := form2app(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if err := baseModels.AppUpdate(form); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				self.AjaxMsg("", libs.E0)
			}
		}

	} else {

		var mode *baseModels.App
		if id > 0 {
			mode, _ = baseModels.AppGetById(id)
		} else {
			mode = new(baseModels.App)
			mode.ExpireTime.Time = time.Now()
		}
		editionlist, _, _ := baseModels.EditionGetList(self.Appid, self.Tid, "", -1, -2, 0, 0, 100)

		provinceList, _ := commonModels.GetAreaList(0, 0)
		self.Context["provinceList"] = provinceList
		self.Context["editionlist"] = editionlist
		self.Context["pageTitle"] = "APP编辑"
		self.Context["info"] = mode
		self.display()
	}

}
func (self *AppController) AppManage() {

	if self.Ctx.Input.IsPost() {
		id, _ := self.GetUint("id")
		if id == 0 {
			self.AjaxMsg("请选择待管理应用", libs.E100000)
		}
		session := self.GetSession(libs.AdminAuthSessionName)
		if session == nil {
			self.AjaxMsg("超时已过期", libs.E0)
		}
		sessionStr, ok := session.(string)
		if !ok && sessionStr != "" {
			self.AjaxMsg("身份认证失败，请重新登录", libs.E0)
		}
		authSession := libs.GetAdminAuthSession(sessionStr)
		if authSession.IsProxy > 0 {
			self.AjaxMsg("已是代理用户，不能进行后续操作", libs.E0)
		}
		if authSession.Appid > 0 {
			self.AjaxMsg("身份认证失败，无法进行后续操作", libs.E100000)
		}

		// 重新计算AuthKey
		user, err := baseModels.UserGetByAuth(authSession.MasterUid)
		if err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}

		// 更改应用值
		authSession.Appid = id
		// 租户标识设置为0
		authSession.Tid = 0
		authSession.IsProxy = 1

		authKey := libs.GetAuthKey(authSession.Appid, authSession.Tid, authSession.Uid, authSession.MasterUid,
			self.GetClientIp(), user.Password, user.Salt, uint8(user.Enable), user.IsExternal, self.IsAdmin, user.RoleIds, authSession.IsProxy)
		authSession.AuthKey = authKey
		sessionStr = authSession.GetSessionString()
		self.SetSession(libs.AdminAuthSessionName, sessionStr)
		self.AjaxMsg("身份认证成功", libs.E0)
	}

}
func (self *AppController) AppDel() {
	id, _ := self.GetUint("id")
	if err := baseModels.AppSoftDel(id); err != nil {
		fmt.Println(err)
		self.AjaxMsg(err.Error(), libs.E100000)
	} else {
		self.AjaxMsg("", libs.E0)
	}
}
func form2app(self *AppController, id uint) (*baseModels.App, error) {
	form := new(baseModels.App)
	form.Id = id
	form.Name = strings.TrimSpace(self.GetString("Name"))
	form.Mode, _ = self.GetInt8("Mode")
	form.State, _ = self.GetInt8("State")
	form.Linkman = strings.TrimSpace(self.GetString("Linkman"))
	form.Remark = strings.TrimSpace(self.GetString("Remark"))
	form.Desc = strings.TrimSpace(self.GetString("Desc"))
	form.Phone = strings.TrimSpace(self.GetString("Phone"))
	form.Addr = strings.TrimSpace(self.GetString("Address"))
	form.Pin, _ = self.GetInt64("Pin")
	form.Pics = strings.TrimSpace(self.GetString("Pics"))
	form.Domain = strings.TrimSpace(self.GetString("Domain"))
	form.Times, _ = self.GetUint64("Times")
	form.Edition = new(baseModels.Edition)
	form.Edition.Id, _ = self.GetInt64("Edition")
	date_str := self.GetString("ExpireTime")
	the_time, err := time.ParseInLocation("2006-01-02 15:04:05", date_str+" 00:00:00", time.Local)
	fmt.Println(err)
	form.ExpireTime.Time = the_time
	// var areaid string
	area := strings.Split(self.GetString("ProvinceId"), ";")

	if len(area) == 2 {
		form.Province = area[1]
		// areaid+=area[0]+"|"
	} else {
		return form, errors.New("省编码不存在")
	}
	// form.ProvinceId = int64(ProvinceId)
	area = strings.Split(self.GetString("CityId"), ";")
	if len(area) == 2 {
		form.City = area[1]
		// areaid+=area[0]+"|"
	} else {
		return form, errors.New("市编码不存在")
	}
	// form.CityId = int64(CityId)

	area = strings.Split(self.GetString("CountyId"), ";")
	if len(area) == 2 {
		form.County = area[1]
		// areaid+=area[0]+"|"
		form.AreaId, _ = strconv.ParseInt(area[0], 10, 64)
	} else {
		return form, errors.New("区县编码不存在")
	}
	// form.AreaId =areaid
	// StreetId, _ := self.GetInt("StreetId")
	// if StreetId == 0 {
	// 	return form, errors.New("街道乡镇编码不能为空")
	// }
	// if area, err := commonModels.GetAreaById(StreetId); err == nil {
	// form.Street = area.Areaname
	// } else {
	// return form, errors.New("街道乡镇编码不存在")
	// }
	// form.StreetId = int64(StreetId)

	// form.Postcode = strings.TrimSpace(self.GetString("Postcode"))
	// form.Addr = strings.TrimSpace(self.GetString("Addr"))
	// form.Idno = strings.TrimSpace(self.GetString("Idno"))
	// form.Idname = strings.TrimSpace(self.GetString("Idname"))
	// form.Pics = strings.TrimSpace(self.GetString("Pics"))
	// IsDefault, _ := self.GetInt8("IsDefault")
	// form.IsDefault = IsDefault

	// State, _ := self.GetInt8("State")
	// form.State = State

	// form.UserId = self.Uid
	form.CreationTime.Time = time.Now()

	return form, nil
}
