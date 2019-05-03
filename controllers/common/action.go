// /* **************************************************
//  * 仁和纪委 栏目管理
//  *************************************************** */
package controllers

import (
	// "errors"

	"fmt"
	// "strconv"
	"time"

	// "strconv"

	"strings"

	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	// "yellbuy.com/YbGoCloundFramework/controllers"
	// BaseModels "yellbuy.com/YbGoCloundFramework/models/base"
	// commonModels "yellbuy.com/YbGoCloundFramework/models/common"
	actModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type ActionController struct {
	share.AdminBaseController
}

// const (
// 	SYS_APPID = 0
// 	SYS_TID   = 0
// )

//加载模板
func (self *ActionController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		// _, actionName := self.BaseController.GetControllerAndAction()
		tplname = "/common/action/" + strings.ToLower(actionName) + ".html"
		// fmt.Println(actionName)
		// tplname = "/cms/cms/list.html"
		// tplname = "wuliu/shipping/list.html"
	}
	self.Display(tplname)
}
func (self *ActionController) ActionList() {
	if self.IsAjax() {
		dto := new(actModels.ActionRequestDto)
		dto.Key = self.GetString("key")
		rangetime:= self.GetString("rangetime")
		dto.State, _= self.GetInt8("logstate",-2)
		dto.Kind,_= self.GetInt8("logkind",-1)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 10
		}
		dto.PageIndex=page
		dto.PageSize=limit
		var starttime string =""
		var endtime string=""
		if len(rangetime)>0{
		sp:=strings.Split(rangetime,"到")
		starttime=sp[0]
		endtime=sp[1]
		}
		scopeIds := self.GetScopeLevelIds()
		list, total, _ := actModels.ActionGetList(dto,starttime,endtime,scopeIds...)
		//   fmt.Println("state",list[0].Title)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		id,_:=self.GetInt("Id")
		self.Context["pageTitle"] = "签到规则"
		self.Context["actionid"]=id
		self.display()
	}

}
func (self *ActionController) ActionDel() {
	if self.IsAjax() {
		id, _ := self.GetInt64("id")
		scopeIds := self.GetScopeLevelIds()
		if _, err := actModels.ActionDelete(id,scopeIds...); err != nil {
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

func (self *ActionController) ActionEdit() {
		id, _ := self.GetInt64("id")
	if self.Ctx.Input.IsPost() {
		scopyIds := self.GetScopeLevelIds()
		if model, err := form2Action(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if(model.Id<=0){
					if _, err := actModels.ActionAdd(model,scopyIds...); err != nil {
						fmt.Println(err)
						self.AjaxMsg(err, libs.E100000)
					} else {
						self.AjaxMsg("", libs.E0)
				}
			}else{
				if _, err := actModels.ActionUpdate(model,scopyIds...); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err, libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			}
			}
		} else {
		scopyIds := self.GetScopeLevelIds()
		model,_:=actModels.ActionGetById( id,scopyIds... )
		
		self.Context["pageTitle"] = "规则编辑"
		self.Context["info"]=model
		
		self.display()
	}
}

func form2Action(self *ActionController, id int64) (*actModels.Action, error) {

	model := new(actModels.Action)
	model.Id,_ = self.GetInt64("actId") 
	// model.Appid = SYS_APPID
	// model.Tid = SYS_TID
	model.Kind , _ = self.GetInt8("actKind") 
	model.Name = self.GetString("actName")
	model.Key = self.GetString("actKey")

	model.Rule= self.GetString("actRule")
	model.Log= self.GetString("actLog")
	// model.Remark = self.GetString("Remark")
	model.UpdateTime.Time = time.Now()
	// logo, _ := self.GetInt64("Logo")
	// model.Logo = logo
	//  model.EditTimeLimit=100
	state, _ := self.GetInt8("actState")
	model.State = state

	// model.Url = strings.TrimSpace(self.GetString("Url"))
	// order, err := self.GetInt64("order")
	// if err != nil {
	// 	order = time.Now().Unix()
	// }
	// model.Order = order
	model.Remark = strings.TrimSpace(self.GetString("actRemark"))

	return model, nil
}
