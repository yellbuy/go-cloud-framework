/**********************************************
** @Des: This file ...
** @Author: ybxx
** @Date:   2018-09-16 15:42:43
** @Last Modified by:
** @Last Modified time: 2018-10-09 11:48:17
***********************************************/
package logistics

import (
	// "github.com/astaxie/beego"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	// "crypto/md5"
	. "yellbuy.com/YbGoCloundFramework/libs"
	expModels "yellbuy.com/YbGoCloundFramework/models/exp"
)

type KdniaoCustomer struct {
	Name         string
	Mobile       string
	Tel          string
	PostCode     string
	ProvinceName string
	CityName     string
	ExpAreaName  string
	Address      string
}
type KdniaoCommodity struct {
	GoodsName     string
	Goodsquantity int
	GoodsWeight   float32
}
type KdniaoEOrderModel struct {
	OrderCode             string
	ShipperCode           string
	CustomerName          string
	CustomerPwd           string
	SendSite              string
	PayType               int8
	MemberID              string
	ExpType               string
	IsNotice              int8
	MonthCode             string
	Sender                KdniaoCustomer
	Receiver              KdniaoCustomer
	Commodity             []KdniaoCommodity
	Weight                float32
	Quantity              int
	IsReturnPrintTemplate int8
	LogisticCode          string
	TemplateSize          string
}

// type MyJsonName struct {
// 	EBusinessID           string `json:"EBusinessID"`
// 	EstimatedDeliveryTime string `json:"EstimatedDeliveryTime"`
// 	Order                 struct {
// 		LogisticCode    string `json:"LogisticCode"`
// 		MarkDestination string `json:"MarkDestination"`
// 		OrderCode       string `json:"OrderCode"`
// 		OriginCode      string `json:"OriginCode"`
// 		OriginName      string `json:"OriginName"`
// 		PackageCode     string `json:"PackageCode"`
// 		ShipperCode     string `json:"ShipperCode"`
// 	} `json:"Order"`
// 	PrintTemplate string `json:"PrintTemplate"`
// 	Reason        string `json:"Reason"`
// 	ResultCode    string `json:"ResultCode"`
// 	Success       bool   `json:"Success"`
// }

var (
	kdniaoBaseDomain string = "https://api.kdniao.com"
	kdniaoBaseUrl    string = "https://api.kdniao.com/api"
)

// 生成电子面单
func PostKdniaoEOrder(appid, tid uint, orderId int64) (expModels.Order, error) {
	order, err := expModels.OrderGetById(appid, tid, orderId)
	if err != nil {
		return order, err
	}
	if order.Id == 0 || order.IsDel == 1 {
		return order, errors.New("订单不存在或已被删除")
	}
	if len(order.LogisticsEorder) > 32 {
		return order, nil
	}
	if order.AcceptCountyId == 0 {
		return order, errors.New("订单收货区域不正确")
	}
	if order.ProductCompanyId == 0 {
		return order, errors.New("订单所属项目快递公司的标识不正确")
	}
	company, err := expModels.ProductCompanyGetById(appid, tid, order.ProductCompanyId)
	if err != nil {
		return order, err
	}
	if company.Id == 0 {
		return order, errors.New("订单所属项目快递公司不存在")
	}
	if order.ProductCompanyAddrId == 0 {
		return order, errors.New("订单所选虚拟地址标识不正确")
	}
	virAddr, err := expModels.ProductCompanyAddrGetById(appid, tid, order.ProductCompanyAddrId)
	if err != nil {
		return order, err
	}
	if virAddr.Id == 0 {
		return order, errors.New("订单所选虚拟地址不存在")
	}
	model := make(map[string]interface{})
	model["OrderCode"] = strconv.FormatInt(order.Id, 10)
	model["ShipperCode"] = company.CodeKdniao
	model["CustomerName"] = company.CustomerName
	model["CustomerPwd"] = company.CustomerPwd
	model["SendSite"] = company.SendSite
	model["PayType"] = company.PayType
	model["MemberID"] = company.MemberId
	model["ExpType"] = company.ExpType
	model["IsNotice"] = company.IsNotice
	model["MonthCode"] = company.MonthCode
	model["Sender"] = KdniaoCustomer{Name: virAddr.Name, Mobile: virAddr.Mobile,
		Tel: virAddr.Phone, PostCode: virAddr.Postcode, ProvinceName: virAddr.Province,
		CityName: virAddr.City, ExpAreaName: virAddr.County, Address: virAddr.Street + virAddr.Address}
	// model["Sender"] = KdniaoCustomer{Name: order.SendName, Mobile: order.SendMobile,
	// 	Tel: order.SendPhone, PostCode: order.SendPostcode, ProvinceName: order.SendProvince,
	// 	CityName: order.SendCity, ExpAreaName: order.SendCounty, Address: order.SendStreet + order.SendAddr}
	model["Receiver"] = KdniaoCustomer{Name: order.AcceptName, Mobile: order.AcceptMobile,
		Tel: order.AcceptPhone, PostCode: order.AcceptPostcode, ProvinceName: order.AcceptProvince,
		CityName: order.AcceptCity, ExpAreaName: order.AcceptCounty, Address: order.AcceptStreet + order.AcceptAddr}
	commodity := new(KdniaoCommodity)
	commodity.GoodsName = order.GoodsType
	commodity.GoodsWeight = order.Weight
	commodity.Goodsquantity = order.Num
	model["Commodity"] = [1]*KdniaoCommodity{commodity}

	model["Weight"] = order.Weight
	model["Quantity"] = order.Num

	model["IsReturnPrintTemplate"] = 1
	if len(order.LogisticsCode) > 0 {
		model["LogisticCode"] = order.LogisticsCode
	}
	if len(company.TemplateSize) > 0 {
		model["TemplateSize"] = company.TemplateSize
	}
	arr, err := json.Marshal(model)
	if err != nil {
		fmt.Println("error:", err)
	}
	requestData := string(arr)
	fmt.Println("jsonStr:", requestData)
	dataSign := requestData + company.KdniaoAppkey
	requestData = EncodeURI(requestData)
	// 数据内容签名：把(请求内容(未编码)+AppKey)进行MD5加密，然后Base64编码，最后 进行URL(utf-8)编码。详细过程请查看Demo
	dataSign = Md5([]byte(dataSign))
	// console.log(dataSign);
	dataSign = base64.URLEncoding.EncodeToString([]byte(dataSign))

	postData := url.Values{"RequestData": {requestData},
		"EBusinessID": {company.KdniaoEbusinessId},
		"RequestType": {"1007"},
		"DataSign":    {dataSign},
		"DataType":    {"2"},
	}
	fmt.Println("postData:", postData)

	URL_EORDERSERVICE := kdniaoBaseUrl + `/EOrderService`
	//URL_EORDERSERVICE = "http://testapi.kdniao.com:8081/api/Eorderservice"

	resp, err := http.PostForm(URL_EORDERSERVICE, postData)
	defer resp.Body.Close()

	if err != nil {
		fmt.Println(URL_EORDERSERVICE, err)
		return order, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(URL_EORDERSERVICE, err)
		return order, err
	}
	resMap := make(map[string]interface{})

	if err := json.Unmarshal(body, &resMap); err != nil {
		fmt.Println("body:", err)
		return order, err
	}
	fmt.Println("body:", resMap)
	if success, ok := resMap["Success"]; ok {
		//"ResultCode": "106",
		// "Reason": "该订单号已下单成功"，
		if success.(bool) == true || resMap["ResultCode"].(string) == "106" {
			if template, ok := resMap["PrintTemplate"]; ok && len(template.(string)) > 16 {
				order.LogisticsEorder = template.(string)
			}
			if eOrder, ok := resMap["Order"].(map[string]interface{}); ok {
				logisticsCode := eOrder["LogisticCode"].(string)
				if len(logisticsCode) > 0 {
					order.LogisticsCode = logisticsCode
				}
			}
			err := expModels.OrderUpdateEOrder(&order)
			return order, err

		}
	}
	return order, errors.New(resMap["Reason"].(string))
}
