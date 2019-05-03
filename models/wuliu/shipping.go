/* *********************************************
** @Des: 云联物流项目管理modles
** @Author: ybxx
** @Date:   2018-10-22 21:42:43
** @Last Modified by:   ybxx
** @Last Modified time: 2018-10-22 21:48:17
********************************************** */
package wuliu

import (
	"errors"
	"fmt"
	"strings"
	"time"

	//    "strings"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/models"
	// baseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

// 运单列表
type OrderInfo struct {
	Id               int64  //` bigint(20) DEFAULT NULL COMMENT '标识',
	Openid           string //varchar(32) DEFAULT '',
	No               string `valid:"MaxSize(20)"` // varchar(20) DEFAULT '' COMMENT '运单号',
	ListDate         Time   // datetime DEFAULT NULL COMMENT '收货日期',
	IsDel            int    //` int(11) DEFAULT NULL COMMENT '删除状态',
	TruckNo          string `valid:"MaxSize(20)"`   // varchar(10) DEFAULT '' COMMENT '发货车号',
	CreatedFid       string `valid:"MaxSize(2048)"` //` varchar(2048) DEFAULT '' COMMENT '发运人完整标识路径',
	CreatedFname     string `valid:"MaxSize(255)"`  //` varchar(255) DEFAULT '' COMMENT '发运人完整名称路径',
	ReceivesiteFid   string `valid:"MaxSize(255)"`  //` varchar(255) DEFAULT '' COMMENT '到货网点完整标识路径',
	ReceivesiteFname string `valid:"MaxSize(255)"`  //` varchar(255) DEFAULT '' COMMENT '到货网点名称路径',
	SendsiteFid      string `valid:"MaxSize(255)"`  //` varchar(255) DEFAULT '' COMMENT '发到货网点完整标识路径',
	SendsiteFname    string `valid:"MaxSize(255)"`  //` varchar(255) DEFAULT '' COMMENT '发',
	SendUnit         string `valid:"MaxSize(20)"`   //` varchar(20) DEFAULT '' COMMENT '发货人',

	SendPinyin       string `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '' COMMENT '拼音代码',
	SendCustomerName string `valid:"MaxSize(55)"`  //` varchar(55) DEFAULT '' COMMENT '托运人',

	ReceiveUnit string `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '' COMMENT '收货人',

	ReceivePinyin       string  `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '' COMMENT '收货人拼音',
	ReceiveAreaCode     string  `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '',到货地址区域代码
	SendAreaCode        string  `valid:"MaxSize(20)"`  //发货地址区域代码
	GoodsName           string  `valid:"MaxSize(20)"`  //` varchar(20) DEFAULT '' COMMENT '货物品名',
	Amount              int     // int(11) DEFAULT NULL COMMENT '数量',
	Pack                string  `valid:"MaxSize(55)"` //` varchar(55) DEFAULT '' COMMENT '包装',
	Weight              float32 //` decimal(18,2) DEFAULT NULL COMMENT '重量',
	StandardWeight      float32 //` decimal(18,2) DEFAULT NULL,
	LastWeight          float32 //` decimal(18,2) DEFAULT NULL,
	Volume              float32 //` decimal(18,2) DEFAULT NULL COMMENT '体积',
	ShippingMode        int     //` int(5) DEFAULT NULL COMMENT '运输方式（0：快运，1：托运）',
	ChargeMode          int     //` int(11) DEFAULT NULL COMMENT '计价方式',
	PackFee             float32 //` decimal(18,2) DEFAULT NULL COMMENT '打包费',
	PremiumAmount       float32 //` decimal(18,2) DEFAULT NULL COMMENT '保价金额',
	PremiumFee          float32 // decimal(18,2) DEFAULT NULL COMMENT '保价费',
	Freight             float32 //` decimal(18,2) DEFAULT NULL COMMENT '合计运费',
	FreightCash         float32 // ` decimal(18,2) DEFAULT NULL COMMENT '现付运费',
	FreightDelivery     float32 // ` decimal(18,2) DEFAULT NULL COMMENT '到付运费',
	FreightMonth        float32 //` decimal(18,2) DEFAULT NULL COMMENT '月结运费',
	FreightReceipt      float32 //` decimal(18,2) DEFAULT NULL COMMENT '回单付运费',
	Disbursement        float32 //` decimal(18,2) DEFAULT NULL COMMENT '垫付款',
	AgencyFund          float32 //` decimal(18,2) DEFAULT NULL COMMENT '代收款',
	PayState            int     //(11) DEFAULT NULL,
	PayMode             int     //(11) DEFAULT NULL COMMENT '收费方式（0：现金，1：到付）',
	DeliveryMode        int     //(11) DEFAULT NULL COMMENT '配送方式（自取、配送）',
	ShippingOperator    string  `valid:"MaxSize(64)"` //` varchar(64) DEFAULT '' COMMENT '承运经办人',
	ShippingState       int     //(11) DEFAULT NULL COMMENT '0：下单,1：揽件,2：发货,3：运输中,4：到站,5：配送中,6：预约取货,7：签收',
	ShippingStateText   string  `valid:"MaxSize(20)"` // varchar(255) DEFAULT '' COMMENT '运单状态',
	ShippingDate        Time    //` datetime DEFAULT NULL COMMENT '发货日期',
	CreatedDate         Time    //` datetime DEFAULT NULL COMMENT '创建时间',
	Comment             string  `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '' COMMENT '备注',
	PhotoPath           string  `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '',
	ExtensionDataTypeId string  `valid:"MaxSize(255)"` //` varchar(255) DEFAULT '',
	ExtensionData       string  `valid:"MaxSize(255)"` //` varchar(255) DEFAULT ''
	SendId              int64   // ` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '发件人标识',
	SendName            string  `valid:"MaxSize(32)" ` // varchar(32) CHARACTER SET utf8mb4 NOT NULL DEFAULT '' COMMENT '发件人',
	SendMobile          string  `valid:"MaxSize(15)" ` // varchar(15) CHARACTER SET utf8mb4 NOT NULL DEFAULT '' COMMENT '发件人电话',
	SendPhone           string  `valid:"MaxSize(15)"`
	//    varchar(15) CHARACTER SET utf8mb4 DEFAULT NULL,
	SendCountry string `valid:"MaxSize(20)"`
	//   ` varchar(20) CHARACTER SET utf8mb4 DEFAULT '中国' COMMENT '国家',
	SendProvince string `valid:"MaxSize(20)"`
	//   ` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0' COMMENT '省',
	SendCity   string `valid:"MaxSize(20)"` // varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0' COMMENT '发件人城市',
	SendCounty string `valid:"MaxSize(20)"`
	//   ` varchar(20) CHARACTER SET utf8mb4 NO//T NULL DEFAULT '0' COMMENT '收件人区县',
	SendStreet      string  `valid:"MaxSize(32)"`  //` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL,
	SendAddr        string  `valid:"MaxSize(32)"`  //` varchar(32) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '发件人街道地址',
	SendHousenumber string  `valid:"MaxSize(255)"` //`valid:"MaxSize(255)"` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '发件人门牌号',
	SendPostcode    string  `valid:"MaxSize(8)"`   // varchar(8) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '发件人邮编',
	SendIdno        string  `valid:"MaxSize(18)"`  // varchar(18) CHARACTER SET utf8mb4 DEFAULT NULL,
	SendIdname      string  `valid:"MaxSize(32)"`  //` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL,
	ReceiveId       int64   //` bigint(20) unsigned DEFAULT '0' COMMENT '收件人标识',
	ReceiveName     string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL,
	ReceiveTime     string  `valid:"MaxSize(80)"`  //` varchar(80) CHARACTER SET utf8mb4 DEFAULT NULL,
	ReceivePhone    string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL,
	ReceiveMobile   string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT '' COMMENT '收件人电话',
	ReceiveCountry  string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 DEFAULT '中国',
	ReceiveProvince string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0' COMMENT '省',
	ReceiveCity     string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0' COMMENT '收件人市',
	ReceiveCounty   string  `valid:"MaxSize(20)"`  //unty` varchar(20) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0' COMMENT '收件人区县',
	ReceiveStreet   string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
	ReceiveAddr     string  `valid:"MaxSize(255)"` //` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '' COMMENT '收件人地址',
	ReceivePostcode string  `valid:"MaxSize(255)"` //`valid:"MaxSize(255)"`//` varchar(8) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '收件人邮编',
	ReceiveIdno     string  `valid:"MaxSize(20)"`  //` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '收件人身份证号',
	ReceiveIdname   string  `valid:"MaxSize(32)"`  //` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '收件人身份证姓名',
	ExpSiteId       int64   //` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '所在投递点'
	FreightReciver  float32 //` decimal(18,2) DEFAULT NULL COMMENT '接货费',
	FreightSend     float32 //` decimal(18,2) DEFAULT NULL COMMENT '收货费',
	FreightDispatch float32 //` decimal(18,2) DEFAULT NULL COMMENT '分拨费',
	ExpendPaid      float32 //` decimal(18,2) DEFAULT NULL COMMENT '扩展已付费',
	ExpendUnpaid    float32 //` decimal(18,2) DEFAULT NULL COMMENT '扩展未付费',
	SmsFee          float32 //` decimal(18,2) DEFAULT NULL COMMENT '短信费',
	LeaveStorage    float32 //` decimal(18,2) DEFAULT NULL COMMENT '出港仓储费',
	ArrivalStorage  float32 //` decimal(18,2) DEFAULT NULL COMMENT '进港仓储费',
	CommissionFee   float32 //` decimal(18,2) DEFAULT NULL COMMENT '代办费',
	CarryFee        float32 //` decimal(18,2) DEFAULT NULL COMMENT '叉吊费',
	Uid             uint
	Appid           uint
	Tid             uint
}

var shippingupdateFields = []string{"TruckNo", "CreatedFid", "CreatedFname", "ReceivesiteFid", "ReceivesiteFname",
	"SendsiteFid", "SendsiteFname", "SendUnit", "SendPinyin", "SendCustomerName",
	"ReceiveUnit", "ReceivePinyin", "ReceiveAreaCode", "SendAreaCode", "GoodsName",
	"Amount", "Pack", "Weight", "StandardWeight", "LastWeight", "Volume", "ShippingMode",
	"ChargeMode", "PackFee", "PremiumAmount", "PremiumFee", "Freight", "FreightCash",
	"FreightDelivery", "FreightMonth", "FreightReceipt", "Disbursement", "AgencyFund",
	"PayState", "PayMode", "DeliveryMode", "ShippingOperator", "ShippingState",
	"ShippingStateText", "ShippingDate", "CreatedDate", "Comment", "PhotoPath",
	"ExtensionDataTypeId", "ExtensionData", "SendId", "SendName", "SendMobile",
	"SendPhone", "SendCountry", "SendProvince", "SendCity", "SendCounty",
	"SendStreet", "SendAddr", "SendHousenumber", "SendPostcode", "SendIdno",
	"SendIdname", "ReceiveId", "ReceiveName", "ReceiveTime", "ReceivePhone",
	"ReceiveMobile", "ReceiveCountry", "ReceiveProvince", "ReceiveCity",
	"ReceiveCounty", "ReceiveStreet", "ReceiveAddr", "ReceivePostcode",
	"ReceiveIdno", "ReceiveIdname", "ExpSiteId", "FreightReciver", "FreightSend",
	"FreightDispatch", "ExpendPaid", "ExpendUnpaid", "SmsFee", "LeaveStorage",
	"ArrivalStorage", "CommissionFee", "CarryFee"}

type ShippingRequestDto struct {
	PageIndex uint32 `json:"pageIndex"`
	PageSize  uint32 `json:"pageSize"`
	Order     string `json:"order"`
}

func (a *OrderInfo) TableName() string {
	return TableName("wuliu_order_info")
}
func OrderInfoTableName() string {
	return TableName("wuliu_order_info")
}

// (self.Appid, self.Tid, self.Uid, kind, name, page-1, limit
// func ShippingGetList(appid, tid uint, startDate time.Time, endDate time.Time, customerId, courierId int, name string, page, pagesize uint32) ([]*OrderInfo, int64, error) {
//  wuliuModels.ShippingGetList(self.Appid, self.Tid, self.Uid, faddress,toaddres,shipstate,paymode,agencyfund,rangtime, page-1, limit)

func OrderInfoGetList(faddress, toaddress, shipstate string, paymode, agencyfund int, rangtime []string, dto *ShippingRequestDto, scopeIds ...interface{}) ([]*OrderInfo, int64, error) {
	var startDate, endDate string
	if len(rangtime) > 1 {
		startDate = rangtime[0]
		endDate = rangtime[1] + " 23:59:59"
	}

	o := orm.NewOrm()

	query := o.QueryTable(OrderInfoTableName())

	query = AppendFilter(query, scopeIds...)
	if len(rangtime) > 1 {
		startDate = rangtime[0]
		endDate = rangtime[1] + " 23:59:59"

		query = query.Filter("created_date__gte", startDate)
		query = query.Filter("created_date__lt", endDate)
	}
	if faddress != "" {
		query = query.Filter("send_address__contains", faddress)
	}
	if len(toaddress) > 0 {
		query = query.Filter("receive_address__contains", toaddress)
	}
	if len(shipstate) > 0 {
		query = query.Filter("shipping_state_text", shipstate)
	}
	if paymode >= 0 {
		query = query.Filter("pay_mode", paymode)
	}

	list := make([]*OrderInfo, 0)
	offset := dto.PageIndex * dto.PageSize
	if offset < 0 {
		offset = 10
	}
	num, err := query.Count()
	if num > 0 {
		query.OrderBy("-id").Limit(dto.PageSize, offset).All(&list)

	}
	//num 总数
	fmt.Println(num)
	return list, num, err
}
func GetShipingById(appid, tid uint, id int64) (*OrderInfo, error) {
	o := orm.NewOrm()

	query := o.QueryTable(OrderInfoTableName())
	list := new(OrderInfo)
	err := query.Filter("id", id).One(list)
	return list, err

}
func ShippingAdd(appid, tid uint, shipping *OrderInfo) (int64, error) {
	shipping.Appid = appid
	shipping.Tid = tid
	// 添加设置未支付状态

	err := IsValidShipping(shipping)
	if err != nil {
		return 0, err
	}

	o := orm.NewOrm()

	o.Begin()
	if id, err := o.Insert(shipping); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	} else {
		o.Commit()
		return id, nil
	}

}
func ShippingStateUpdate(appid, tid uint, state string, idlist string) (int64, error) {
	statel := strings.Split(state, ":")
	ids := strings.Split(idlist, ",")

	cond := orm.NewCondition()

	for i := 0; i < len(ids); i++ {
		cond = cond.Or("Id", ids[i])
	}

	dt := time.Now().Format("2006-01-02 15:04:05")
	fmt.Println(dt)
	o := orm.NewOrm()

	o.Begin()

	if num, err := o.QueryTable(OrderInfoTableName()).Filter("appid", appid).Filter("tid", tid).SetCond(cond).
		Update(orm.Params{"shipping_state": statel[0], "shipping_state_text": statel[1]}); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	} else {
		o.Commit()
		return num, nil
	}

}

// 数据验证
func IsValidShipping(shipping *OrderInfo) error {
	result := validation.Validation{}
	isValid, err := result.Valid(shipping)
	if err != nil {
		return FailError(E201204, err)
	}
	if !isValid {
		if result.HasErrors() {
			return FailError(E201204, errors.New(result.Errors[0].Message))
		}
	}

	return nil
}

func ShippingUpdate(shipping *OrderInfo) (int64, error) {
	o := orm.NewOrm()

	o.Begin()
	// o.Read(&shipping)
	if id, err := o.Update(shipping, shippingupdateFields...); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	} else {
		o.Commit()
		return id, nil
	}
}
func ShippingGetNum(startdate string, enddate string) int64 {
	o := orm.NewOrm()

	query := o.QueryTable(OrderInfoTableName())
	num, _ := query.Filter("created_date__gte", startdate).Filter("created_date__lte", enddate).Count()

	return num

}

// 文通用查询
func OrderInfoGetAll(query map[string]interface{}, exclude map[string]interface{},
	condMap map[string]map[string]interface{}, fields []string, sortby []string,
	order []string, offset int64, limit int64, scopeIds ...interface{}) (int64, []OrderInfo, error) {
	var (
		objArrs []OrderInfo
		err     error
		num     int64
	)
	qs := orm.NewOrm().QueryTable(OrderInfoTableName())
	qs = AppendFilter(qs, scopeIds)
	qs = qs.RelatedSel()
	cond := orm.NewCondition()
	if _, ok := condMap["and"]; ok {
		andMap := condMap["and"]
		for k, v := range andMap {
			k = strings.Replace(k, ".", "__", -1)
			cond = cond.And(k, v)
		}
	}
	if _, ok := condMap["or"]; ok {
		orMap := condMap["or"]
		for k, v := range orMap {
			k = strings.Replace(k, ".", "__", -1)
			cond = cond.Or(k, v)
		}
	}
	qs = qs.SetCond(cond)
	// query k=v
	for k, v := range query {
		// rewrite dot-notation to Object__Attribute
		k = strings.Replace(k, ".", "__", -1)
		qs = qs.Filter(k, v)
	}
	//exclude k=v
	for k, v := range exclude {
		// rewrite dot-notation to Object__Attribute
		k = strings.Replace(k, ".", "__", -1)
		qs = qs.Exclude(k, v)
	}
	// order by:
	var sortFields []string
	if len(sortby) != 0 {
		if len(sortby) == len(order) {
			// 1) for each sort field, there is an associated order
			for i, v := range sortby {
				orderby := ""
				if order[i] == "desc" {
					orderby = "-" + strings.Replace(v, ".", "__", -1)
				} else if order[i] == "asc" {
					orderby = strings.Replace(v, ".", "__", -1)
				} else {
					return num, nil, FailError(E201204, errors.New("Error: Invalid order. Must be either [asc|desc]"))
				}
				sortFields = append(sortFields, orderby)
			}
			qs = qs.OrderBy(sortFields...)
		} else if len(sortby) != len(order) && len(order) == 1 {
			// 2) there is exactly one order, all the sorted fields will be sorted by this order
			for _, v := range sortby {
				orderby := ""
				if order[0] == "desc" {
					orderby = "-" + strings.Replace(v, ".", "__", -1)
				} else if order[0] == "asc" {
					orderby = strings.Replace(v, ".", "__", -1)
				} else {
					return num, nil, FailError(E201204, errors.New("Error: Invalid order. Must be either [asc|desc]"))
				}
				sortFields = append(sortFields, orderby)
			}
		} else if len(sortby) != len(order) && len(order) != 1 {
			return num, nil, FailError(E201204, errors.New("Error: sortby, order sizes mismatch or order size is not 1"))
		}
	} else {
		if len(order) != 0 {
			return num, nil, FailError(E201204, errors.New("Error: unused order fields"))
		}
	}
	qs = qs.OrderBy(sortFields...)
	if cnt, err := qs.Count(); err == nil {
		if cnt > 0 {
			// paginator = utils.GenPaginator(limit, offset, cnt)
			if _, err = qs.Limit(limit, offset).All(&objArrs, fields...); err == nil {
				num = cnt
			}
		}
	}
	return num, objArrs, err

}
