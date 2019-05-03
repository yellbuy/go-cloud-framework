//app管理

package base

import (
	"errors"
	"fmt"
	"time"

	// "fmt"
	"strings"
	// "time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/common"
	"yellbuy.com/YbGoCloundFramework/utils"
)

// 租户表';
type TenantBase struct {
	Id uint
	//(11) unsigned NOT NULL AUTO_INCREMENT,
	Name string `valid:"MaxSize(20)"`

	//` varchar(32) NOT NULL DEFAULT '',
	// EditionId  int64
	//(11) unsigned DEFAULT NULL,

	Mode uint8
	//`剩余次数',
	Times uint
	//'到期时间',
	ExpireTime   Time
	CreationTime Time
	//'数据状态0未审核，1审核未通过，2：审核通过，-1删除',
	State int8
	IsTop uint8
	Order int64
	IsDel int8 //
	//'金钱',
	Amount float32
	//'价格',
	Price float32
	//'头像',
	Logo string `valid:"MaxSize(255)"`
	Tag  string `valid:"MaxSize(255)"`
	//'所在区域代码',
	AreaId   int64
	Province string `valid:"MaxSize(20)"`
	City     string `valid:"MaxSize(20)"`
	County   string `valid:"MaxSize(20)"`
	Addr     string `valid:"MaxSize(20)"`
	Linkman  string `valid:"MaxSize(20)"`
	Phone    string `valid:"MaxSize(20)"`
	// 经度
	Lng float64
	// 纬度
	Lat   float64
	Appid uint
}
type Tenant struct {
	TenantBase
	// 全称
	FullName string `valid:"MaxSize(63)"`
	// 资质证明材料
	CertifyPics string `valid:"MaxSize(255)"`
	Desc        string

	//'多图上传',
	Pics string `valid:"MaxSize(255)"`
	// 审核说明
	Remark string `valid:"MaxSize(200)"`

	PermissionKey string   `valid:"MaxSize(20)"`
	TenantKey     string   `valid:"MaxSize(20)"`
	Edition       *Edition `orm:"column(edition_id);rel(fk);null;on_delete(set_null)"`

	// 统计汇总信息
	common.StatisticsSummary `orm:"-"`
	// 统计操作信息
	common.StatisticsAction `orm:"-"`
	PicArr                  []string `orm:"-"`
}
type TenantDto struct {
	TenantBase
	// 距离
	Distance float32
	// 销量
	SaleNum int64
	// 优惠劵数量
	CouponNum int64
	// 优惠劵发放数量
	CouponSendNum int64
}

// 查询
type TenantRequestDto struct {
	// 排序方式，1：按距离，2：按销量，3：按人气
	SortKind uint8 `json:"sortKind"`
	// 经度
	Lng float64 `json:"lng"`
	// 纬度
	Lat       float64 `json:"lat"`
	PageIndex int     `json:"pageIndex"`
	PageSize  int     `json:"pageSize"`
}

var TenantAppUpdateFields = []string{"Desc", "Logo", "Pics", "AreaId", "Province", "City", "County",
	"Addr", "Linkman", "Phone", "Lng", "Lat", "Remark", "Tag", "CertifyPics"}
var TenantAdminUpdateFields = []string{"Name", "Desc", "Mode", "Times", "ExpireTime",
	"State", "IsTop", "Order", "Amount", "Price", "Logo", "Pics", "AreaId", "Province", "City", "County",
	"Addr", "Linkman", "Phone", "Lng", "Lat", "Remark", "Tag", "PermissionKey", "TenantKey"}

func (a *Tenant) TableName() string {
	return TableName("base_tenant")
}
func TenantTableName() string {
	return TableName("base_tenant")
}

// 分页查询，APP端使用
func TenantGetPagedList(dto *TenantRequestDto, scopeIds ...interface{}) ([]TenantDto, error) {
	var list []TenantDto

	if dto.PageSize == 0 {
		dto.PageSize = 10
	}
	order := ""
	if dto.SortKind == 1 {
		order = "distance, t.is_top desc, t.order"
	} else if dto.SortKind == 2 {
		order = "sale_num desc,t.is_top desc,t.order"
	} else if dto.SortKind == 3 {
		order = "click_num desc,t.is_top desc,t.order"
	} else if dto.SortKind == 4 {
		// 领劵排行
		order = "coupon_send_num desc,t.is_top desc,t.order"
	} else {
		order = "t.is_top desc,t.order"
	}
	orderFields := strings.Split(order, ",")
	offset := dto.PageIndex * dto.PageSize
	qb, err := orm.NewQueryBuilder("mysql")
	if err != nil {
		return nil, err
	}

	qb.Select("t.id", "t.name", "t.creation_time", "t.state", "t.logo", "t.pics", "t.area_id",
		"t.province", "t.city", "t.county", "t.addr", "t.linkman", "t.phone", "t.tag",
		"t.lng", "t.lat", "t.is_top", "t.order", "t.appid",
		"st_distance(point (t.lng, t.lat),point(?,?))/0.0111 AS distance",
		"(select count(s.id) from common_statistics as s where s.model='base_tenant' and s.record_id=t.id and s.act_type=1 and s.is_del = 0) as click_num",
		"(select count(o.id) from eshop_order_info as o where t.id = o.tid AND o.is_del = 0 AND o.pay_state = 1 AND create_time > ?) as sale_num",
		"(select count(a.id) from eshop_coupon_activity as a where t.id = a.tid AND a.is_del = 0 AND a.send_start_date >= ? AND a.send_end_date < ?) as coupon_num",
		"(select count(c.id) from eshop_coupon as c where t.id = c.tid AND c.is_del = 0 AND c.expiration_time >= ?) as coupon_send_num").
		From("base_tenant as t").
		Where("t.appid = ? AND t.is_del = 0 AND t.state = 1 AND t.expire_time > ?").
		OrderBy(orderFields...).
		Limit(dto.PageSize).Offset(offset)

	// 近6个月的销量计算开始时间
	startTime := time.Now().AddDate(0, -6, 0)
	curTime := time.Now()
	endTime := curTime.AddDate(0, 0, 1)
	sql := qb.String()
	fmt.Println(sql)
	appid := scopeIds[0]
	o := orm.NewOrm()
	_, err = o.Raw(sql, dto.Lng, dto.Lat, startTime, curTime, endTime, endTime, appid, curTime).QueryRows(&list)
	return list, err
}

func TenantGetList(appid uint, key string, starttime string, endtime string, appstate, appmode int8, page, pagesize uint32) ([]*Tenant, int64, error) {
	list := make([]*Tenant, 0)
	offset := page * pagesize
	o := orm.NewOrm()
	query := o.QueryTable(TenantTableName()). /* .Filter("tid", tid).Filter("appid", appid) */ RelatedSel()
	if len(key) > 0 {
		cond := orm.NewCondition()
		cond1 := cond.Or("name__icontains", key).Or("desc__icontains", key).Or("remark__icontains", key)
		query = query.SetCond(cond1)
	}
	if appstate > -2 {
		query = query.Filter("state", appstate)
	}
	if appmode > 0 {
		query = query.Filter("mode", appmode)
	}
	if len(starttime) > 0 {
		query = query.Filter("expire_time__gt", starttime)
	}
	if len(endtime) > 0 {
		query = query.Filter("expire_time__lt", endtime)
	}

	num, err := query.Count()
	if num > 0 {
		query.Limit(pagesize, offset).All(&list)
	}
	return list, num, err

}
func TenantGetByCache(id uint, appid uint) (*Tenant, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBaseTenantById, id)
	loadCallbackFunc := func() (interface{}, error) {
		model := new(Tenant)
		o := orm.NewOrm()
		query := o.QueryTable(TenantTableName()).Filter("is_del", 0).Filter("id", id)
		if appid > 0 {
			query = query.Filter("appid", appid)
		}
		err := query.One(model)
		if len(model.Pics) > 0 {
			model.PicArr, _ = common.AttfileUrlLoadList(model.Pics)
			if len(model.PicArr) == 0 {
				// 相册为空，加载默认的商品主图
				model.PicArr = append(model.PicArr, model.Logo)
			}
		}
		return model, err
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		return nil, err
	}
	tenant := res.(*Tenant)
	return tenant, nil
}

func TenantGetById(id, appid uint) (*Tenant, error) {
	model := new(Tenant)
	o := orm.NewOrm()
	query := o.QueryTable(TenantTableName()).Filter("id", id)
	if appid > 0 {
		query = query.Filter("appid", appid)
	}
	err := query.One(model)
	if len(model.Pics) > 0 {
		model.PicArr, _ = common.AttfileUrlLoadList(model.Pics)
		if len(model.PicArr) == 0 {
			// 相册为空，加载默认的商品主图
			model.PicArr = append(model.PicArr, model.Logo)
		}
	}

	// 加载统计信息
	var statRequestDto = new(common.StatisticsDataRequestDto)
	statRequestDto.GroupFields = "act_type"
	statRequestDto.Models = common.ModelBaseTenantName
	statRequestDto.ActTypes = fmt.Sprintf("%v,%v,%v,%v", common.ActTypeClick, common.ActTypeFavior, common.ActTypeCollect, common.ActTypeReply)
	statRequestDto.RecordId = int64(id)
	res, _ := common.StatisticsGetCacheValues(statRequestDto)
	model.StatisticsSummary = common.StatisticsGetSummary(res)
	// 浏览加1
	model.StatisticsSummary.ClickNum = model.StatisticsSummary.ClickNum + 1

	return model, err

}
func TenantAdd(appid uint, model *Tenant) (int64, error) {
	model.Appid = appid
	err := IsValidTenant(model)
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
	model.CreationTime.Time = time.Now()
	id, err := o.Insert(model)
	return id, err
}

func TenantUpdate(appid uint, model *Tenant, fileds []string) (int64, error) {
	err := IsValidTenant(model)
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
	total, err := o.Update(model, fileds...)
	return total, err
}

// 逻辑删除
func TenantSoftDel(appid uint, id uint) error {
	o := orm.NewOrm()
	_, err := o.QueryTable(TenantTableName()).Filter("appid", appid).Filter("id", id).Update(orm.Params{"is_del": 1})
	return err
}

// 数据验证
func IsValidTenant(Tenant *Tenant) error {
	result := validation.Validation{}
	isValid, err := result.Valid(Tenant)
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
