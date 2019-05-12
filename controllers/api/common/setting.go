package controllers

import (
	"strings"

	apiController "yellbuy.com/YbCloudDataApi/controllers/api"
	"yellbuy.com/YbCloudDataApi/libs"
	baseModels "yellbuy.com/YbCloudDataApi/models/base"
	commonModels "yellbuy.com/YbCloudDataApi/models/common"
)

type ApiSettingController struct {
	apiController.CommonApiController
}

// @Title 查询应用级设置信息
// @Description 查询应用级设置信息
// @Param   groupKey     path    string  true      "设置组Key，必填"
// @Param   itemKey     path    string  true      "设置项Key，选填，如为空则返回groupKey组下所有的设置项"
// @Success 0 {array} eshop.AdPosition
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/common/setting/app [get]
func (self *ApiSettingController) App() {

	groupKey := strings.TrimSpace(self.GetString("groupKey"))
	if len(groupKey) == 0 {
		self.Fail(libs.E100000, "groupKey参不能为空")
	}
	itemKey := strings.TrimSpace(self.GetString("itemKey"))
	settings, err := commonModels.SettingLoadFor(self.Appid, 0, 0)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	// if len(itemKey)>0{
	// 	group,err:=SettingGetValueFor(settings,groupKey,itemKey)
	// }
	group, err := commonModels.SettingGetGroupFor(settings, groupKey)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	items := group.Items
	for _, val := range items {
		if val.Type != 5 {
			// 过滤掉涉及安全有关的设置
			if len(itemKey) > 0 && val.Key == itemKey {
				self.Success(val)
			}
		}

	}
	if len(itemKey) == 0 {
		// 返回组下所有设置
		self.Success(items)
	}
	// 未找到指定设置项，返回错误
	self.Fail(libs.E100000, "itemKey不存在")

}

// @Title 查询租户级设置信息
// @Description 查询租户级设置信息
// @Param   id     path    uint  true      "租户标识，为0则按当前用户所在租户获取，如未登陆则返回错误"
// @Param   groupKey     path    string  true      "设置组Key，必填"
// @Param   itemKey     path    string  true      "设置项Key，选填，如为空则返回groupKey组下所有的设置项"
// @Success 0 {array} eshop.AdPosition
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/common/setting/tenant/:id [get]
func (self *ApiSettingController) Tenant() {
	id, _ := self.GetParaUint(":id")
	if id == 0 {
		id = self.Tid
	}
	if id == 0 {
		self.Fail(libs.E100000, "租户标识不能为空")
	}
	groupKey := strings.TrimSpace(self.GetString("groupKey"))
	if len(groupKey) == 0 {
		self.Fail(libs.E100000, "groupKey参不能为空")
	}
	itemKey := strings.TrimSpace(self.GetString("itemKey"))
	settings, err := commonModels.SettingLoadFor(self.Appid, id, 0)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	// if len(itemKey)>0{
	// 	group,err:=SettingGetValueFor(settings,groupKey,itemKey)
	// }
	group, err := commonModels.SettingGetGroupFor(settings, groupKey)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	items := group.Items
	for _, val := range items {
		if val.Type != 5 {
			// 过滤掉涉及安全有关的设置
			if len(itemKey) > 0 && val.Key == itemKey {
				self.Success(val)
			}
		}

	}
	if len(itemKey) == 0 {
		// 返回组下所有设置
		self.Success(items)
	}
	// 未找到指定设置项，返回错误
	self.Fail(libs.E100000, "itemKey不存在")

}

// @Title 查询用户级设置信息
// @Description 查询用户级设置信息
// @Param   id     path    uint  true      "用户标识，为0则按当前用户获取，如未登陆则返回错误"
// @Param   groupKey     path    string  true      "设置组Key，必填"
// @Param   itemKey     path    string  true      "设置项Key，选填，如为空则返回groupKey组下所有的设置项"
// @Success 0 {array} eshop.AdPosition
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/common/setting/user/:id [get]
func (self *ApiSettingController) User() {

	id, _ := self.GetParaUint(":id")
	if id == 0 {
		id = self.Uid
	}
	if id == 0 {
		self.Fail(libs.E100000, "用户标识不能为空")
	}
	user, err := baseModels.UserGetBy(id)
	if err != nil || user.Appid != self.Appid {
		self.Fail(libs.E100000, "用户不存在")
	}
	groupKey := strings.TrimSpace(self.GetString("groupKey"))
	if len(groupKey) == 0 {
		self.Fail(libs.E100000, "groupKey参不能为空")
	}
	itemKey := strings.TrimSpace(self.GetString("itemKey"))
	settings, err := commonModels.SettingLoadFor(self.Appid, user.Tid, user.Id)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	// if len(itemKey)>0{
	// 	group,err:=SettingGetValueFor(settings,groupKey,itemKey)
	// }
	group, err := commonModels.SettingGetGroupFor(settings, groupKey)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	items := group.Items
	for _, val := range items {
		if val.Type != 5 {
			// 过滤掉涉及安全有关的设置
			if len(itemKey) > 0 && val.Key == itemKey {
				self.Success(val)
			}
		}

	}
	if len(itemKey) == 0 {
		// 返回组下所有设置
		self.Success(items)
	}
	// 未找到指定设置项，返回错误
	self.Fail(libs.E100000, "itemKey不存在")

}
