/**********************************************
** @Des: 管理员
** @Author: cheguoyong
** @Date:   2017-09-16 14:17:37
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:14:07
***********************************************/
package controllers

import (
	//"errors"

	//"encoding/json"
	// "strconv"
	"strings"
	// "time"

	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	CommonModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type AreaController struct {
	share.AdminBaseController
}

//加载模板
func (self *AreaController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "common/Area/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

func (self *AreaController) GetChildren() {
	pid, _ := self.GetInt("pid")
	list, _ := CommonModels.GetAreaList(pid, 0)
	self.Data["json"] = list
	self.ServeJSON()
	self.StopRun()
}
