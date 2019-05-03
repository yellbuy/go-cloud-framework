/**********************************************
** @Des: 系统配置管理

***********************************************/
package controllers

// 配置管理
type SettingUserController struct {
	SettingController
}

func (self *SettingUserController) Prepare() {
	self.SettingController.Prepare()
	self.SettingController.Appid = self.Appid
	self.SettingController.Tid = self.Tid
	self.SettingController.Uid = self.Uid
}
