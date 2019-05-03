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
	"fmt"
	//"encoding/json"
	// "strconv"
	"strings"
	// "time"

	"yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	CommonModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type CommonDataController struct {
	share.AdminBaseController
}

//加载模板
func (self *CommonDataController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "common/commondata/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

func (self *CommonDataController) GetListByType() {
	tp := strings.TrimSpace(self.GetString("type"))
	if len(tp) == 0 {
		self.AjaxList("失败", libs.E100000, 0, nil)
	} else {
		list, _ := CommonModels.CommonDataGetListByType(self.Appid, self.Tid, tp, false)
		self.Data["json"] = list
		self.ServeJSON()
		self.StopRun()
		// self.AjaxList("成功", libs.E0, 0, list)
	}
}

func (self *CommonDataController) ConcreteDataList() {
	if self.IsAjax() {
		//列表
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}

		tp := strings.TrimSpace(self.GetString("type"))
		if len(tp) == 0 {
			self.AjaxList("失败", libs.E100000, 0, nil)
		} else {
			total, list, _ := CommonModels.CommonDataGetPagedListByType(self.Appid, self.Tid, tp, true, page-1, limit)
			self.AjaxList("成功", libs.E0, total, list)
		}

	} else {

		typeList, _ := CommonModels.CommonDataGetListByType(self.Appid, self.Tid, "concretecommondata", true)
		self.Context["TypeList"] = typeList
		tp := strings.TrimSpace(self.GetString("type"))
		if len(tp) > 0 {
			self.Context["Type"] = tp
		} else if len(typeList) > 0 {
			self.Context["Type"] = typeList[0].Code
		} else {
			self.Context["Type"] = "concretecommondata"
		}

		self.Context["pageTitle"] = "基础代码管理"
		self.display()
	}
}

func (self *CommonDataController) ConcreteDataEdit() {
	if self.IsAjax() {
		if data, err := form2Struct(self); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if data.Id > 0 {
				if err := CommonModels.CommonDataUpdate(data); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			} else {
				if _, err := CommonModels.CommonDataAdd(data); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			}

		}
	} else {
		id, _ := self.GetInt64("id")

		//var err error
		if id > 0 {
			info, _ := CommonModels.CommonDataGetById(self.Appid, self.Tid, id)
			if info.Id == 0 {
				self.Redirect("/common/commondata/concretedatalist", 302)
				self.StopRun()
			}
			self.Context["info"] = info
		} else {
			info := new(CommonModels.CommonData)
			info.Type = strings.TrimSpace(self.GetString("type"))
			if len(info.Type) == 0 {
				self.Redirect("/common/commondata/concretedatalist", 302)
				self.StopRun()
			}
			info.Status = 1
			self.Context["info"] = info
		}

		self.Context["pageTitle"] = "数据字典管理"

		self.display()
	}
}

func form2Struct(self *CommonDataController) (*CommonModels.CommonData, error) {
	CommonData := new(CommonModels.CommonData)
	CommonData.Id = 0
	if id, err := self.GetInt64("Id"); err == nil {
		CommonData.Id = id
	}
	CommonData.Appid = self.Appid
	CommonData.Tid = self.Tid
	CommonData.Name = strings.TrimSpace(self.GetString("Name"))
	CommonData.Type = strings.TrimSpace(self.GetString("Type"))
	CommonData.Code = strings.TrimSpace(self.GetString("Code"))
	CommonData.Value = self.GetString("Value")
	CommonData.Desc = self.GetString("Desc")
	CommonData.Uid = self.Uid
	CommonData.Status, _ = self.GetInt8("Status")
	CommonData.Pinyin = self.GetString("Pinyin")
	CommonData.Ext = self.GetString("Ext")
	CommonData.Predefined, _ = self.GetUint8("Predefined")
	order, _ := self.GetInt64("Order")
	CommonData.Order = order
	CommonData.Parentid = 0
	if pid, err := self.GetInt64("Parentid"); err == nil {
		CommonData.Parentid = pid
	}
	return CommonData, nil
}

func (self *CommonDataController) Del() {
	if !self.IsAjax() {
		self.StopRun()
	}
	id, _ := self.GetInt64("id")
	// arr := make([]interface{},1)
	// arr = append(arr,id)
	if err := CommonModels.CommonDataDelete(self.Appid, self.Tid, true, id); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("操作成功", libs.E0)
}
