/**********************************************
** @Des: 系统配置管理

***********************************************/
package controllers

// 配置管理
type SettingSysController struct {
	SettingController
}

func (self *SettingSysController) Prepare() {
	self.SettingController.Prepare()
}
