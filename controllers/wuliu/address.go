/**********************************************
** @Des: 管理员
** @Author: 
** @Date:   2017-09-16 14:17:37
** @Last Modified by:   
** @Last Modified time: 2017-09-17 11:14:07
***********************************************/
package controllers

import (
	// "errors"
	"errors"
	"fmt"
	"strconv"
	"time"

	// "strconv"

	"strings"

	"yellbuy.com/YbGoCloundFramework/libs"

	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	// BaseModels "yellbuy.com/YbGoCloundFramework/models/base"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
	wuliuModels "yellbuy.com/YbGoCloundFramework/models/wuliu"
)

type AddressController struct {
	share.AdminBaseController
}

//加载模板
func (self *AddressController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "wuliu/address/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

func (self *AddressController) List() {
	if self.IsAjax() {
		name := strings.TrimSpace(self.GetString("name"))
		//列表
		kind, _ := self.GetInt8("kind",-1)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		dto := new(wuliuModels.AddressRequestDto)
		dto.PageIndex = page - 1
		dto.PageSize = limit
		scopeIds := self.GetScopeLevelIds()
		list, total, _ := wuliuModels.AddressGetListBySearch(name,kind, dto ,scopeIds...)
		// AddressGetListByUser(self.Appid, self.Tid, self.Uid, kind, name, page-1, limit)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		// cont, _ := BaseModels.OrgCount(self.Appid, self.Tid, 0)
		// self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "客户地址"
		self.display()
	}
}
func (self *AddressController) SearchList() {
	if self.IsAjax() {
		search := strings.TrimSpace(self.GetString("search"))
		//列表
		// kind, _ := self.GetInt8("kind")
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		dto := new(wuliuModels.AddressRequestDto)
		dto.PageIndex = page - 1
		dto.PageSize = limit
		scopeIds := self.GetScopeLevelIds()
		list, total, _ := wuliuModels.AddressGetListBySearch(search, -1,dto ,scopeIds...)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		// cont, _ := BaseModels.OrgCount(self.Appid, self.Tid, 0)
		// self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "客户地址"
		self.display()
	}
}


func (self *AddressController) Add() {
	if self.IsAjax() {
		var id int64 = 0
		if form, err := form2Address(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if id, err := wuliuModels.AddressAdd(self.Appid, self.Tid, form); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				self.AjaxMsg(strconv.FormatInt(id, 10), libs.E0)
			}
		}
	} else {
		// productList, _ := expModels.ProductGetValidList(self.Appid, self.Tid, "")
		// self.Context["productList"] = productList
		// courierList := findCouriers("",self.Appid,self.Tid)
		// self.Context["courierList"] = courierList
		self.Context["pageTitle"] = "客户管理"
		self.display()
	}
}

func (self *AddressController) Edit() {

	if self.IsAjax() {
		id, err := self.GetInt64("Id")
		if err != nil || id <= 0 {
			self.AjaxMsg("记录不存在", libs.E100000)
			self.StopRun()
		}
		if form, err := form2Address(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if err := wuliuModels.AddressUpdate(self.Appid, self.Tid, form); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				self.AjaxMsg("", libs.E0)
			}
		}
	} else {
		if id, err := self.GetInt64("id"); err != nil {
			self.Redirect("/wuliu/Address/list", 302)
			self.StopRun()
		} else if form, err := wuliuModels.AddressGetById(self.Appid, self.Tid, id); err != nil {
			self.Redirect("/wuliu/Address/list", 302)
			self.StopRun()
		} else {
			self.Context["pageTitle"] = "地址管理"
			self.Context["info"] = form

			self.display()
		}
	}
}

func form2Address(self *AddressController, id int64) (*wuliuModels.Address, error) {

	form := new(wuliuModels.Address)
	form.Id = id
	form.Appid = self.Appid
	form.Tid = self.Tid
	form.Name = strings.TrimSpace(self.GetString("Name"))
	form.ExternalId = strings.TrimSpace(self.GetString("ExternalId"))
	Kind, _ := self.GetInt8("Kind")
	form.Kind = Kind
	form.Mobile = strings.TrimSpace(self.GetString("Mobile"))
	form.Phone = strings.TrimSpace(self.GetString("Phone"))
	ProvinceId, _ := self.GetInt("ProvinceId")
	if ProvinceId == 0 {
		return form, errors.New("省编码不能为空")
	}
	if area, err := commonModels.GetAreaById(ProvinceId); err == nil {
		form.Province = area.Areaname
	} else {
		return form, errors.New("省编码不存在")
	}
	form.ProvinceId = int64(ProvinceId)

	CityId, _ := self.GetInt("CityId")
	if CityId == 0 {
		return form, errors.New("市编码不能为空")
	}
	if area, err := commonModels.GetAreaById(CityId); err == nil {
		form.City = area.Areaname
	} else {
		return form, errors.New("市编码不存在")
	}
	form.CityId = int64(CityId)

	CountyId, _ := self.GetInt("CountyId")
	if CountyId == 0 {
		return form, errors.New("区县编码不能为空")
	}
	if area, err := commonModels.GetAreaById(CountyId); err == nil {
		form.County = area.Areaname
	} else {
		return form, errors.New("区县编码不存在")
	}
	form.CountyId = int64(CountyId)

	StreetId, _ := self.GetInt("StreetId")
	if StreetId == 0 {
		return form, errors.New("街道乡镇编码不能为空")
	}
	if area, err := commonModels.GetAreaById(StreetId); err == nil {
		form.Street = area.Areaname
	} else {
		return form, errors.New("街道乡镇编码不存在")
	}
	form.StreetId = int64(StreetId)

	form.Postcode = strings.TrimSpace(self.GetString("Postcode"))
	form.Addr = strings.TrimSpace(self.GetString("Addr"))
	form.Idno = strings.TrimSpace(self.GetString("Idno"))
	form.Idname = strings.TrimSpace(self.GetString("Idname"))
	form.Pics = strings.TrimSpace(self.GetString("Pics"))
	IsDefault, _ := self.GetInt8("IsDefault")
	form.IsDefault = IsDefault

	State, _ := self.GetInt8("State")
	form.State = State

	form.UserId = self.Uid
	form.UpdateTime.Time = time.Now()

	return form, nil
}

func (self *AddressController) Del() {
	if !self.IsAjax() {
		self.StopRun()
	}
	id, _ := self.GetInt64("id")

	if err := wuliuModels.AddressDelete(self.Appid, self.Tid, id); err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("操作成功", libs.E0)
}
