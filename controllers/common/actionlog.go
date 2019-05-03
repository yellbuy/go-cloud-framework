// /* **************************************************
//  * 仁和纪委 栏目管理
//  *************************************************** */
package controllers

import (
	// "errors"

	"fmt"
	// "strconv"
	// "time"

	// "strconv"

	"strings"

	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	// "yellbuy.com/YbGoCloundFramework/controllers"
	// BaseModels "yellbuy.com/YbGoCloundFramework/models/base"
	// commonModels "yellbuy.com/YbGoCloundFramework/models/common"
	logModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type ActionLogController struct {
	share.AdminBaseController

}

// const (
// 	SYS_APPID = 0
// 	SYS_TID   = 0
// )

//加载模板
func (self *ActionLogController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		 _, actionName := self.GetControllerAndAction()
		tplname = "/common/action/" + strings.ToLower(actionName) + ".html"
		// fmt.Println(actionName)
		// tplname = "/cms/cms/list.html"
		// tplname = "wuliu/shipping/list.html"
	}
	self.Display(tplname)
}
func (self *ActionLogController) ActionlogList() {
	if self.IsAjax() {
		dto := new(logModels.ActionLogRequestDto)
		dto.Key = self.GetString("key")
		rangetime:= self.GetString("rangetime")
		dto.State, _ = self.GetInt8("logstate",-2)
		dto.Kind, _ = self.GetInt8("logkind",-1)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		dto.PageIndex=page
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		dto.PageSize=limit
		var starttime string =""
		var endtime string=""
		if len(rangetime)>0{
		sp:=strings.Split(rangetime,"到")
		starttime=sp[0]
		endtime=sp[1]
		}
		scopeIds := self.GetScopeLevelIds()
		list, total, _ := logModels.ActionLogGetList(dto,starttime,endtime,scopeIds...)
		//   fmt.Println("state",list[0].Title)

		self.AjaxList("成功", libs.E0, total, list)
	} else {

		self.Context["pageTitle"] = "签到管理"

		self.display()
	}

}
func (self *ActionLogController) ActionLogDel() {
	if self.IsAjax() {
		id, _ := self.GetInt64("id")
		scopeIds := self.GetScopeLevelIds()
		if _, err := logModels.ActionLogDelete(id,scopeIds); err != nil {
			fmt.Println(err)
			self.AjaxMsg(err, libs.E100000)
		} else {
			// self.AjaxMsg("", libs.E0)
			self.AjaxSuccess("")
		}
	}

}
// func (self *SmsController) SmsAdd() {
// 	if self.IsAjax() {
// 		if model, err := form2Category(self, 0); err != nil {
// 			self.AjaxMsg(err.Error(), libs.E100000)
// 			self.StopRun()
// 		} else {
// 			if _, err := cmsModels.SmsAdd(SYS_APPID, SYS_TID, model); err != nil {
// 				fmt.Println(err)
// 				self.AjaxMsg(err, libs.E100000)
// 			} else {
// 				self.AjaxMsg("", libs.E0)
// 			}
// 		}
// 	} else {

// 		self.Context["pageTitle"] = "短信添加"

// 		self.display()
// 	}
// }

func (self *ActionLogController) ActionLogDetail() {
		id, _ := self.GetInt64("id")
	if self.Ctx.Input.IsPost() {
	
		// if model, err := form2Sms(self, id); err != nil {
		// 	self.AjaxMsg(err.Error(), libs.E100000)
		// 	self.StopRun()
		// } else {
		// 	if(id<=0){
		// 			if _, err := smsModels.SmsAdd(SYS_APPID, SYS_TID, model); err != nil {
		// 				fmt.Println(err)
		// 				self.AjaxMsg(err, libs.E100000)
		// 			} else {
		// 				self.AjaxMsg("", libs.E0)
		// 		}
		// 	}else{
		// 		if _, err := smsModels.SmsUpdate(SYS_APPID, SYS_TID, model); err != nil {
		// 			fmt.Println(err)
		// 			self.AjaxMsg(err, libs.E100000)
		// 		} else {
		// 			self.AjaxMsg("", libs.E0)
		// 		}
		// 	}
		// 	}
		} else {
		scopeIds := self.GetScopeLevelIds()
		model,_:=logModels.ActionLogGetById(id,scopeIds )
		
		self.Context["pageTitle"] = "短信详情"
		self.Context["info"]=model
		
		self.display()
	}
}

// func form2Sms(self *CategoryController, id int64) (*cmsModels.SMs, error) {

// 	model := new(cmsModels.Sms)
// 	model.Id = id
// 	model.Appid = SYS_APPID
// 	model.Tid = SYS_TID
// 	model.Kind = CMS_KIND
// 	model.Name = strings.TrimSpace(self.GetString("name"))
// 	model.Key = self.GetString("key")

// 	model.Pid, _ = self.GetInt("pid")
// 	model.CoverId, _ = self.GetInt("cover_id")
// 	model.Icon = self.GetString("icon")
// 	model.CreateTime.Time = time.Now()
// 	model.UpdateTime.Time = time.Now()
// 	// logo, _ := self.GetInt64("Logo")
// 	// model.Logo = logo
// 	//  model.EditTimeLimit=100
// 	state, _ := self.GetInt8("status")
// 	model.State = state

// 	// model.Url = strings.TrimSpace(self.GetString("Url"))
// 	order, err := self.GetInt64("order")
// 	if err != nil {
// 		order = time.Now().Unix()
// 	}
// 	model.Order = order
// 	// model.Remark = strings.TrimSpace(self.GetString("Remark"))

// 	return model, nil
// }
