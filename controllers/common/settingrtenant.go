/* *********************************************
** @Des: 系统配置管理

********************************************** */
package controllers

// 配置管理
type SettingTenantController struct {
	SettingController
}

func (self *SettingTenantController) Prepare() {
	self.SettingController.Prepare()
	self.SettingController.Appid = self.Appid
	self.SettingController.Tid = self.Tid

}
