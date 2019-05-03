/**********************************************
** @Des: 系统配置管理

***********************************************/
package controllers

// 配置管理
type SettingAppController struct {
	SettingController
}

func (self *SettingAppController) Prepare() {
	self.SettingController.Prepare()
	self.SettingController.Appid = self.Appid

}
