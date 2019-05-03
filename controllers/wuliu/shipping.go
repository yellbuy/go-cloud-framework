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

	"fmt"
	// "strconv"
	"time"

	"strconv"

	"strings"

	"yellbuy.com/YbGoCloundFramework/libs"

	// "yellbuy.com/YbGoCloundFramework/utils"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	// BaseModels "yellbuy.com/YbGoCloundFramework/models/base"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
	wuliuModels "yellbuy.com/YbGoCloundFramework/models/wuliu"
)

type Address struct {
	province string
	city     string
	county   string
	street   string
	area     string
}
type ShippingController struct {
	share.AdminBaseController
}

//加载模板
func (self *ShippingController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "wuliu/shipping/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

// CreatedFName string //` varchar(255) DEFAULT '' COMMENT '发运人完整名称路径',
//   ToSiteFID string//` varchar(255) DEFAULT '' COMMENT '到货网点完整标识路径',
//   ToSiteFName string//` varchar(255) DEFAULT '' COMMENT '到货网点名称路径',
//   CreatedDate time.Time//` datetime DEFAULT NULL COMMENT '创建时间',
//  ShippingState int//(11) DEFAULT NULL COMMENT '0：下单,1：揽件,2：发货,3：运输中,4：到站,5：配送中,6：预约取货,7：签收',
//    PayMode int//(11) DEFAULT NULL COMMENT '收费方式（0：现金，1：到付）',
//  AgencyFund float32//` decimal(18,2) DEFAULT NULL COMMENT '代收款',
func (self *ShippingController) FromList() {
	if self.IsAjax() {
		// name := strings.TrimSpace(self.GetString("name"))

		rangtime := strings.Split(self.GetString("rangtime"), " - ")
		faddress := strings.TrimSpace(self.GetString("Faddress"))
		toaddres := strings.TrimSpace(self.GetString("Toaddress"))
		// fmt.Println("as+", rangtime)
		shipstate := self.GetString("shipstate")
		paymode, _ := self.GetInt("PayMode", -1)
		agencyfund, _ := self.GetInt("AgencyFund")
		fmt.Println("aws+", paymode)

		//列表
		kind, _ := self.GetInt8("kind")
		fmt.Println(kind)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		dto := new(wuliuModels.ShippingRequestDto)
		dto.PageIndex = page - 1
		dto.PageSize = limit
		scopeIds := self.GetScopeLevelIds()
		list, total, _ := wuliuModels.OrderInfoGetList(faddress, toaddres, shipstate, paymode, agencyfund, rangtime, dto, scopeIds...)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		menu, _ := commonModels.SettingLoad(self.ScopeKind)
		shipstatelist := menu.GroupMap["CONFIG_GROUP_WULIU"].ItemMap["WULIU_STATE"]

		self.Context["pageTitle"] = "订单管理"
		self.Context["shippingstate"] = strings.Split(shipstatelist.Value, "\n")
		self.display()
	}
}
func (self *ShippingController) ToList() {
	if self.IsAjax() {

		rangtime := strings.Split(self.GetString("rangtime"), " - ")
		faddress := strings.TrimSpace(self.GetString("Faddress"))
		toaddres := strings.TrimSpace(self.GetString("Toaddress"))
		fmt.Println("as+", rangtime)
		shipstate := self.GetString("shipstate")
		paymode, _ := self.GetInt("PayMode", -1)
		agencyfund, _ := self.GetInt("AgencyFund")
		fmt.Println("aws+", paymode)

		//列表
		kind, _ := self.GetInt8("kind")
		fmt.Println(kind)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		dto := new(wuliuModels.ShippingRequestDto)
		dto.PageIndex = page - 1
		dto.PageSize = limit
		scopeIds := self.GetScopeLevelIds()
		list, total, _ := wuliuModels.OrderInfoGetList(faddress, toaddres, shipstate, paymode, agencyfund, rangtime, dto, scopeIds...)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
	
		menu, _ := commonModels.SettingLoad(self.ScopeKind)
		shipstatelist := menu.GroupMap["CONFIG_GROUP_WULIU"].ItemMap["WULIU_STATE"]
		// fmt.Println("stste", shipstatelist[0].Name)
		self.Context["pageTitle"] = "订单管理"
		self.Context["shippingstate"] = strings.Split(shipstatelist.Value, "\n")
		self.display()
	}
}
// func (self *ShippingController) Add() {
// 	if self.IsAjax() {
// 		var id int64 = 0
// 		if shipping, err := FormToShipping(self, id); err != nil {
// 			self.AjaxMsg(err.Error(), libs.E100000)
// 			self.StopRun()
// 		} else {
// 			var dstart = time.Now().Format("2006-01-02 00:00:00")
// 			var dend = time.Now().AddDate(0, 0, 1).Format("2006-01-02 00:00:00")
// 			// fmt.Println(dt,dt1)
// 			num := wuliuModels.ShippingGetNum(dstart, dend)
// 			no := fmt.Sprintf("%04d", num+1)
// 			shipping.No = time.Now().Format("20060102") + no
// 			// shipping.ShippingStateText="下单"
// 			if _, err := wuliuModels.ShippingAdd(self.Appid, self.Tid, shipping); err != nil {
// 				fmt.Println(err)
// 				self.AjaxMsg(err.Error(), libs.E100000)
// 			} else {
// 				self.AjaxMsg("", libs.E0)
// 			}
// 		}
// 	} else {
// 		self.Context["pageTitle"] = "增加运单"
// 		provinceList, _ := commonModels.GetAreaList(0, 0)
// 		// kindlist,_:=commonModels.CommonDataGetListByType(0,0,"goods",false)//货物种类
// 		// CommonDataGetListByType(appid uint, tid uint, tp string, containDisabled bool) ([]*CommonData, error)
// 		self.Context["provinceList"] = provinceList
// 		// sele.Context["kindlist"]=kindlist
// 		self.Context["ApiCss"] = true
// 		self.display()
// 	}
// }
func (self *ShippingController) Edit() {
	if self.IsAjax() {
		var id int64 = 0
		id, _ = self.GetInt64("id")
		if shipping, err := FormToShipping(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			fas:=self.GetString("Fromaddrsave")
			if fas=="on"{
				form,_:=shippingSendToform(shipping)
			if err := wuliuModels.ShippingAddressUpdate(self.Appid, self.Tid, form); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
				}
			}
			fas=self.GetString("Toaddrsave")
			if fas=="on"{
				form,_:=shippingReceiveToform(shipping)
			if err := wuliuModels.ShippingAddressUpdate(self.Appid, self.Tid, form); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
				}
			}
			if id==0{
				var dstart = time.Now().Format("2006-01-02 00:00:00")	
				var dend = time.Now().AddDate(0, 0, 1).Format("2006-01-02 00:00:00")
				// fmt.Println(dt,dt1)
				num := wuliuModels.ShippingGetNum(dstart, dend)
				no := fmt.Sprintf("%04d", num+1)
				shipping.No = time.Now().Format("20060102") + no
				// shipping.ShippingStateText="下单"
				if nid, err := wuliuModels.ShippingAdd(self.Appid, self.Tid, shipping); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg(nid, libs.E0)
				}
			}else{
				if _, err := wuliuModels.ShippingUpdate(shipping); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			}
		}
	} else {
		var id int64 = 0
		id, _ = self.GetInt64("id")
		kind:=self.GetString("kind")
		module, _ := wuliuModels.GetShipingById(self.Appid, self.Tid, id)
		provinceList, _ := commonModels.GetAreaList(0, 0)
		self.Context["provinceList"] = provinceList

		
		fromAreacode := strings.Split(module.SendAreaCode, "/")
		fAddresscode := new(Address)

		fAddresscode.province = fromAreacode[0]
		if len(fromAreacode) > 2 {
			fAddresscode.city = fromAreacode[1]
			fAddresscode.county = fromAreacode[2]
			
		}
	
		toareacode := strings.Split(module.ReceiveAreaCode, "/")
		toAddresscode := new(Address)
		toAddresscode.province = toareacode[0]
		if len(toareacode) > 2 {
			toAddresscode.city = toareacode[1]
			toAddresscode.county = toareacode[2]
			// toAddresscode.street = toareacode[3]
		}
		menu, _ := commonModels.SettingLoad(self.ScopeKind)
		shippingclasslist := menu.GroupMap["CONFIG_GROUP_WULIU"].ItemMap["GOODS_CLASS"]
		tenantlist, _, _ := baseModels.TenantGetList(self.Appid, "", "", "", -2, 0, 0, 100)
		if kind=="from"{
			self.Context["towebsit"] = tenantlist
		
		}
		if kind=="to"{
			self.Context["fromwebsit"] = tenantlist	
		}
		self.Context["pageTitle"] = "运单号：" + module.No
		self.Context["info"] =module
		self.Context["shippingcalss"] =strings.Split(shippingclasslist.Value,"\n")
		self.Context["farea"] = fAddresscode
		// self.Context["taddress"] = toAddress
		self.Context["tarea"] = toAddresscode
		
		
		self.display()
	}
}
func FormToShipping(self *ShippingController, id int64) (*wuliuModels.OrderInfo, error) {
	ship := new(wuliuModels.OrderInfo)
	var err error
	ship.Id = id
	ship.SendUnit = self.GetString("FromUnit")
	ship.SendMobile = self.GetString("FromTel")
	// ship.UpdateDate.Time = time.Now()
	ship.No = self.GetString("No")
	//   ListDate   time.Time // datetime DEFAULT NULL COMMENT '收货日期',
	//   DeleteStatus int //` int(11) DEFAULT NULL COMMENT '删除状态',
	ship.TruckNo = self.GetString("TruckNo")
	//   ship.CreatedFid =self.userId
	//   ship.CreatedFname=self.name
	sit := strings.Split(self.GetString("Tosit"), ";")
	if len(sit) > 1 {
		ship.ReceivesiteFid = sit[0]
		ship.ReceivesiteFname = sit[1]
	}
	sit = strings.Split(self.GetString("Fromsit"), ";")
	if len(sit) > 1 {
		ship.SendsiteFid = sit[0]
		ship.SendsiteFname = sit[1]
	}
	//   TositeFid string//` varchar(255) DEFAULT '' COMMENT '到货网点完整标识路径',
	//   TositeFname string//` varchar(255) DEFAULT '' COMMENT '到货网点名称路径',
	ship.SendUnit = self.GetString("FromUnit")
	//   FromTel int//` int(11) DEFAULT '0' COMMENT '电话',
	//   FromTel2 int//` int(11) DEFAULT '0',
	co := strings.Split(self.GetString("ProvinceId"), ";")
	ship.SendProvince = co[1]
	// provinceid := co[0]
	co = strings.Split(self.GetString("CityId"), ";")
	ship.SendCity = co[1]
	// cityid := co[0]
	co = strings.Split(self.GetString("CountyId"), ";")
	countyid := co[0]
	ship.SendCounty = co[1]
	// co = strings.Split(self.GetString("StreetId"), ";")
	// streetid := co[0]
	// ship.SendStreet = co[1]

	ship.SendAddr = self.GetString("Address")
	// ship.FromAddress = province + " " + city + " " + county + " " + street + " " + area
	ship.SendAreaCode =countyid
	//  provinceid + "/" + cityid + "/" +  
	//   FromPinyin string //` varchar(255) DEFAULT '' COMMENT '拼音代码',
	//   FromCustomerName string //` varchar(55) DEFAULT '' COMMENT '托运人',
	//   FromCity string //` varchar(55) DEFAULT '',
	ship.ReceiveUnit = self.GetString("ToUnit")
	ship.ReceiveMobile = self.GetString("ToTel")
	//   Totel2 int//` int(11) DEFAULT '0',
	co = strings.Split(self.GetString("ToProvinceId"), ";")
	ship.ReceiveProvince = co[1]
	// provinceid = co[0]
	co = strings.Split(self.GetString("ToCityId"), ";")
	// cityid = co[0]
	ship.ReceiveCity = co[1]
	co = strings.Split(self.GetString("ToCountyId"), ";")
	countyid = co[0]
	ship.ReceiveCounty = co[1]
	
	co = strings.Split(self.GetString("ToCountyId"), ";")
	countyid = co[0]
	ship.ReceiveCounty = co[1]
	ship.ReceiveAddr = self.GetString("ToAddress")
	// ship.ToAddress = province + " " + city + " " + county + " " + street + " " + area
	// provinceid + "/" + cityid + "/" +
	ship.ReceiveAreaCode =  countyid 

	ship.GoodsName = self.GetString("GoodsName")
	ship.Amount, _ = self.GetInt("Amount", 0)

	ft, _ := self.GetFloat("Weight", 0)
	ship.Weight = float32(ft)
	
	ft, _ = self.GetFloat("Volume", 0)
	ship.Volume = float32(ft)
	ship.ShippingMode, _ = self.GetInt("ShippingMode", 0)
	//   ChargeMode int//` int(11) DEFAULT NULL COMMENT '计价方式',
	//   PackFee float32//` decimal(18,2) DEFAULT NULL COMMENT '打包费',
	ft, _ = self.GetFloat("PremiumAmount", 0)
	ship.PremiumAmount = float32(ft)
	ft, _ = self.GetFloat("PremiumFee", 0)
	ship.PremiumFee = float32(ft)
	
	ft, _ = self.GetFloat("Disbursement", 0)
	ship.Disbursement = float32(ft)
	ft, _ = self.GetFloat("AgencyFund")
	ship.AgencyFund = float32(ft)
	ship.PayState, _ = self.GetInt("PayStatus")
	ft, _ = self.GetFloat("Freight")
	ship.Freight = float32(ft)
	ship.PayMode, _ = self.GetInt("PayMode")
		ship.FreightCash= 0
		ship.FreightDelivery=0
		ship.FreightMonth=0
		ship.FreightReceipt=0
	if ship.PayMode==1{
		ship.FreightCash= float32(ft)
	}
	if ship.PayMode==2{
		ship.FreightDelivery= float32(ft)
	}
	if ship.PayMode==3{
		ship.FreightMonth= float32(ft)
	}
	if ship.PayMode==4{
		ship.FreightReceipt= float32(ft)
	}

	ship.DeliveryMode, _ = self.GetInt("DeliveryMode")
	//   ShippingOperator string //` varchar(64) DEFAULT '' COMMENT '承运经办人',
	sh_state:= self.GetString("ShippingState") 
	if len(sh_state)==0{
	ship.ShippingState = 0
	ship.ShippingStateText = "下单"
	}else{
		st:=strings.Split(sh_state,":")
		ship.ShippingState,_ =strconv.Atoi(st[0])
		ship.ShippingStateText = st[1]
		}
	//   ShippingDate time.Time//` datetime DEFAULT NULL COMMENT '发货日期',
	//   CreatedDate time.Time//` datetime DEFAULT NULL COMMENT '创建时间',

	ship.Comment = self.GetString("Comment") 
		fee,_:=self.GetFloat("PackFee") 
	ship.PackFee=float32(fee)
		fee,_=self.GetFloat("FreightReciver") 
	ship.FreightReciver	=float32(fee)
	fee,_=self.GetFloat("FreightSend") 
	ship.FreightSend=float32(fee)
		fee,_=self.GetFloat("FreightDispatch") 	
	ship.FreightDispatch=float32(fee)
		fee,_=self.GetFloat("ExpendPaid") 
	ship.ExpendPaid=float32(fee)	
		fee,_=self.GetFloat("ExpendUnpaid") 	
	ship.ExpendUnpaid =float32(fee)
		fee,_=self.GetFloat("SmsFee") 	
	ship.SmsFee 	=float32(fee)
		fee,_=self.GetFloat("LeaveStorage") 	
	ship.LeaveStorage =float32(fee)
		fee,_=self.GetFloat("ArrivalStorage") 	
	ship.ArrivalStorage =float32(fee)
		fee,_=self.GetFloat("CarryFee") 
	ship.CarryFee =float32(fee)	
		fee,_=self.GetFloat("CommissionFee") 
	ship.CommissionFee  =float32(fee)	

	return ship, err

}
func (self *ShippingController) State_Update() {
	fmt.Println("state_updatefff")

	if self.Ctx.Input.IsPost() {
		var state = self.GetString("shipstate")
		idlist := self.GetString("Idlist")
		//  if shipping, err := FormToShipping(self, id); err != nil {
		// 	self.AjaxMsg(err.Error(), libs.E100000)
		// 	self.StopRun()
		// } else {
		// 	var dstart=time.Now().Format("2006-01-02 00:00:00")
		// 	var dend=time.Now().AddDate(0,0,1).Format("2006-01-02 00:00:00")
		fmt.Println(state, idlist)
		// 	num:=wuliuModels.ShippingGetNum(dstart,dend)
		// 	no:=fmt.Sprintf("%04d",num+1)
		// 	shipping.No=time.Now().Format("20060102")+no
		// 	// shipping.ShippingStateText="下单"
		if _, err := wuliuModels.ShippingStateUpdate(self.Appid, self.Tid, state, idlist); err != nil {
			fmt.Println(err)
			self.AjaxMsg(err.Error(), libs.E100000)
		} else {
			self.AjaxMsg("", libs.E0)
		}
		
	} else {
		idlist := self.GetString("idlist")
		self.Context["pageTitle"] = "增加运单"
		// shipstatelist, _ := commonModels.CommonDataGetListByType(self.Appid, self.Tid, "shippingstate", false)
		// kindlist,_:=commonModels.CommonDataGetListByType(0,0,"goods",false)//货物种类
		// CommonDataGetListByType(appid uint, tid uint, tp string, containDisabled bool) ([]*CommonData, error)
		menu, _ := commonModels.SettingLoad(self.ScopeKind)
		shipstatelist := menu.GroupMap["CONFIG_GROUP_WULIU"].ItemMap["WULIU_STATE"]
		self.Context["stateList"] =strings.Split(shipstatelist.Value,"\n")
		self.Context["idlist"] = idlist
		self.Context["ApiCss"] = true
		fmt.Println("dt,dt1")
		self.display()
	}
}
func (self *ShippingController) Fright_Count() {
	fmt.Println("fright_count")

	if self.Ctx.Input.IsPost() {
		// var state = self.GetString("shipstate")
		// idlist := self.GetString("Idlist")
		//  if shipping, err := FormToShipping(self, id); err != nil {
		// 	self.AjaxMsg(err.Error(), libs.E100000)
		// 	self.StopRun()
		// } else {
		// 	var dstart=time.Now().Format("2006-01-02 00:00:00")
		// 	var dend=time.Now().AddDate(0,0,1).Format("2006-01-02 00:00:00")
		// fmt.Println(state, idlist)
		// 	num:=wuliuModels.ShippingGetNum(dstart,dend)
		// 	no:=fmt.Sprintf("%04d",num+1)
		// 	shipping.No=time.Now().Format("20060102")+no
		// // 	// shipping.ShippingStateText="下单"
		// if _, err := wuliuModels.ShippingStateUpdate(self.Appid, self.Tid, state, idlist); err != nil {
		// 	fmt.Println(err)
		// 	self.AjaxMsg(err.Error(), libs.E100000)
		// } else {
		// 	self.AjaxMsg("", libs.E0)
		// }
		// }
	} else {
		// idlist := self.GetString("idlist")
		self.Context["pageTitle"] = "增加运单"
		// // shipstatelist, _ := commonModels.CommonDataGetListByType(self.Appid, self.Tid, "shippingstate", false)
		// // kindlist,_:=commonModels.CommonDataGetListByType(0,0,"goods",false)//货物种类
		// // CommonDataGetListByType(appid uint, tid uint, tp string, containDisabled bool) ([]*CommonData, error)
		// menu, _ := commonModels.SettingLoad(self.ScopeKind)
		// shipstatelist := menu.GroupMap["CONFIG_GROUP_WULIU"].ItemMap["WULIU_STATE"]
		// self.Context["stateList"] =strings.Split(shipstatelist.Value,"\n")
		// self.Context["idlist"] = idlist
		// self.Context["ApiCss"] = true
		// fmt.Println("dt,dt1")
		self.display()
	}
}
func shippingSendToform(shipping *wuliuModels.OrderInfo) (*wuliuModels.Address, error) {

	form := new(wuliuModels.Address)
	// form.Id = id
	// form.Appid = self.Appid
	// form.Tid = self.Tid
	form.Name = shipping.SendUnit
	// form.ExternalId = strings.TrimSpace(self.GetString("ExternalId"))
	// Kind, _ := self.GetInt8("Kind")
	form.Kind = 0
	form.Mobile = shipping.SendMobile
	// form.Phone = strings.TrimSpace(self.GetString("Phone"))
	areacode:=strings.Split(shipping.SendAreaCode,"/")
	form.ProvinceId,_ =strconv.ParseInt(areacode[0], 10, 64)
	form.CityId,_ =strconv.ParseInt(areacode[1], 10, 64) 
	form.CountyId ,_=strconv.ParseInt(areacode[2], 10, 64)
	form.Province=shipping.SendProvince
	form.City=shipping.SendCity
	form.County=shipping.SendCounty
	form.Postcode = shipping.SendPostcode
	form.Addr = shipping.SendAddr
	// form.Idno = strings.TrimSpace(self.GetString("Idno"))
	// form.Idname = strings.TrimSpace(self.GetString("Idname"))
	// form.Pics = strings.TrimSpace(self.GetString("Pics"))
	// IsDefault, _ := self.GetInt8("IsDefault")
	// form.IsDefault = IsDefault

	// State, _ := self.GetInt8("State")
	// form.State = State

	// form.UserId = self.Uid
	form.UpdateTime.Time = time.Now()

	return form, nil
}
func shippingReceiveToform(shipping *wuliuModels.OrderInfo) (*wuliuModels.Address, error) {

	form := new(wuliuModels.Address)
	// form.Id = id
	// form.Appid = self.Appid
	// form.Tid = self.Tid
	form.Name = shipping.ReceiveUnit
	// form.ExternalId = strings.TrimSpace(self.GetString("ExternalId"))
	// Kind, _ := self.GetInt8("Kind")
	form.Kind = 1
	form.Mobile = shipping.ReceiveMobile
	// form.Phone = strings.TrimSpace(self.GetString("Phone"))
	areacode:=strings.Split(shipping.ReceiveAreaCode,"/")
	form.ProvinceId,_ =strconv.ParseInt(areacode[0], 10, 64)
	form.CityId,_ =strconv.ParseInt(areacode[1], 10, 64) 
	form.CountyId ,_=strconv.ParseInt(areacode[2], 10, 64)
	form.Province=shipping.ReceiveProvince
	form.City=shipping.ReceiveCity
	form.County=shipping.ReceiveCounty
	form.Postcode = shipping.ReceivePostcode
	form.Addr = shipping.ReceiveAddr
	// form.Idno = strings.TrimSpace(self.GetString("Idno"))
	// form.Idname = strings.TrimSpace(self.GetString("Idname"))
	// form.Pics = strings.TrimSpace(self.GetString("Pics"))
	// IsDefault, _ := self.GetInt8("IsDefault")
	// form.IsDefault = IsDefault

	// State, _ := self.GetInt8("State")
	// form.State = State

	// form.UserId = self.Uid
	form.UpdateTime.Time = time.Now()

	return form, nil
}
