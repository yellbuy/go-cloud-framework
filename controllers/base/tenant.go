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

type TenantController struct {
	share.AdminBaseController
}

//加载模板
func (self *TenantController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/tenant/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}
func (self *TenantController) TenantList() {
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
			sp := strings.Split(rangetime, " - ")
			starttime = sp[0]
			endtime = sp[1]
		}

		//列表

		// AppGetList(appid uint, tid uint, key string, starttime string,endtime string, appstate,appmode int8, page, pagesize uint32) ([]*Tenant, int64, error) {
		// list := make([]*Tenant, 0)
		list, total, _ := baseModels.TenantGetList(self.Appid, key, starttime, endtime, appstate, appmode, page-1, limit)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		// cont, _ := baseModels.AppGetList(self.Appid, self.Tid, 0)
		// self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "TENANT管理"
		self.display()
	}
}
func (self *TenantController) TenantEdit() {
	id, _ := self.GetUint("id")
	if self.Ctx.Input.IsPost() {
		form, err := form2Tenant(self, id)
		if err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}
		if id == 0 {
			_, err = baseModels.TenantAdd(self.Appid, form)
		} else {
			_, err = baseModels.TenantUpdate(self.Appid, form, baseModels.TenantAdminUpdateFields)
		}
		if err != nil {
			fmt.Println(err)
			self.AjaxMsg(err.Error(), libs.E100000)
		}
		self.AjaxMsg("", libs.E0)
	} else {

		var mode *baseModels.Tenant
		if id > 0 {
			mode, _ = baseModels.TenantGetById(id,self.Appid)
		} else {
			mode = new(baseModels.Tenant)
			mode.ExpireTime.Time = time.Now()
		}
		editionlist, _, _ := baseModels.EditionGetList(self.Appid, self.Tid, "", -1, -2, 0, 0, 100)
		provinceList, _ := commonModels.GetAreaList(0, 0)
		self.Context["provinceList"] = provinceList
		self.Context["editionlist"] = editionlist
		self.Context["pageTitle"] = "tenant编辑"
		self.Context["info"] = mode
		self.display()
	}
}

// 逻辑删除
func (self *TenantController) TenantDel() {
	id, _ := self.GetUint("id")
	if err := baseModels.TenantSoftDel(self.Appid, id); err != nil {
		fmt.Println(err)
		self.AjaxMsg(err.Error(), libs.E100000)
	} else {
		self.AjaxMsg("", libs.E0)
	}
}

// 商户后台
func (self *TenantController) TenantManage() {

	if self.Ctx.Input.IsPost() {
		id, _ := self.GetUint("id")
		if id == 0 {
			self.AjaxMsg("请选择待管理租户", libs.E100000)
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
		// if authSession.IsProxy > 0 {
		// 	self.AjaxMsg("已是代理用户，不能进行后续操作", libs.E0)
		// }
		if authSession.Tid > 0 {
			self.AjaxMsg("身份认证失败，无法进行后续操作", libs.E100000)
		}

		// 重新计算AuthKey
		user, err := baseModels.UserGetByAuth(authSession.MasterUid)
		if err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}

		// 更改应用值
		authSession.Appid = authSession.Appid
		// 租户标识设置为0
		authSession.Tid = id
		authSession.IsProxy = 1

		authKey := libs.GetAuthKey(authSession.Appid, authSession.Tid, authSession.Uid, authSession.MasterUid,
			self.GetClientIp(), user.Password, user.Salt, uint8(user.Enable), user.IsExternal, self.IsAdmin, user.RoleIds, authSession.IsProxy)
		authSession.AuthKey = authKey
		sessionStr = authSession.GetSessionString()
		self.SetSession(libs.AdminAuthSessionName, sessionStr)
		self.AjaxMsg("身份认证成功", libs.E0)
	}

}

func form2Tenant(self *TenantController, id uint) (*baseModels.Tenant, error) {
	form := new(baseModels.Tenant)
	form.Id = id
	form.Name = strings.TrimSpace(self.GetString("Name"))
	form.FullName = strings.TrimSpace(self.GetString("FullName"))
	form.Mode, _ = self.GetUint8("Mode")
	form.State, _ = self.GetInt8("State")
	form.IsTop, _ = self.GetUint8("IsTop")
	form.Order, _ = self.GetInt64("Order")
	form.Linkman = strings.TrimSpace(self.GetString("Linkman"))
	form.Remark = strings.TrimSpace(self.GetString("Remark"))
	form.Desc = strings.TrimSpace(self.GetString("Desc"))
	form.Phone = strings.TrimSpace(self.GetString("Phone"))
	form.Addr = strings.TrimSpace(self.GetString("Addr"))
	form.Logo = self.GetString("Logo")
	form.Pics = strings.TrimSpace(self.GetString("Pics"))
	form.Times, _ = self.GetUint("Times")
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
	// form.AreaId = areaid;
	form.Lng, _ = self.GetFloat("Lng")
	form.Lat, _ = self.GetFloat("Lat")

	return form, nil
}

func (self *TenantController) GetTenantById() {
	id, _ := self.GetUint("id")
	list, _ := baseModels.TenantGetById(id,self.Appid)
	self.Data["json"] = list
	self.ServeJSON()
	self.StopRun()

}
