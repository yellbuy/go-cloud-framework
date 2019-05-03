package controllers

import (
	// "crypto"

	"github.com/astaxie/beego"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
	// "yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/utils"
	// "log"
	// "strings"
	// "time"
)

type ApiSettingController struct {
	beego.Controller
	// BaseApiController
}

// @Title 获取APP版本升级相关参数
// @Description 测试错误码
// @Success 200 {array} common.Setting
// @Failure 401 unauthorized
// @router v1/setting/version [get]
func (self *ApiSettingController) Version() {
	// 村居监督 kind = APP_GROUP
	// appid:=self.Appid
	// tid:=self.Tid
	// uid:=self.Uid
	// kind:=libs.GetAuthKindValue(appid, tid, uid)
	// data := commonModels.SettingGetGroup(kind,appid, tid, uid, "APP_GROUP")
	data, err := commonModels.SettingGetGroupForApp(1, "APP_GROUP")
	if err != nil {
		self.Data["json"] = ErrResponse{100000, err.Error()}
	} else {
		self.Data["json"] = Response{0, "ok", data}
	}

	self.ServeJSON()
	self.StopRun()
}
