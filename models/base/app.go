//app管理

package base

import (
	"errors"
	"fmt"

	// "fmt"
	// "strings"
	// "time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbCloudDataApi/libs"
	"yellbuy.com/YbCloudDataApi/utils"
)

// 租户表';
type App struct {
	Id uint

	Name string `valid:"MaxSize(30)"`

	// EditionId  int64

	Desc string
	// '计费模式，1：时间，2：次数',
	Mode int8
	//'剩余次数',
	Times uint64
	//`到期时间',
	ExpireTime   Time
	CreationTime Time
	//`数据状态0未审核，1审核未通过，2：审核通过，-1删除',
	State int8
	IsDel int8 //

	//` 金钱',
	Amount float32
	//` 价格',
	Price float32
	//`头像',
	Logo string
	//` 多图上传',
	Pics string
	//`所在区域代码',
	AreaId   int64
	Province string `valid:"MaxSize(20)"`

	City   string `valid:"MaxSize(20)"`
	County string `valid:"MaxSize(20)"`

	Addr string `valid:"MaxSize(20)"`
	// 联系人
	Linkman string `valid:"MaxSize(20)"`
	Phone   string `valid:"MaxSize(20)"`

	Remark string
	// 域名
	Domain        string   `valid:"MaxSize(1023)"`
	PermissionKey string   `valid:"MaxSize(20)"`
	AppKey        string   `valid:"MaxSize(64)"`
	Edition       *Edition `orm:"column(edition_id);rel(fk);null;on_delete(set_null)"`
}

var AppListFields = []string{"Name", "Desc", "Mode", "Times", "ExpireTime",
	/* "CreationTime", */ "State", "Amount", "Price", "Logo", "Pics",
	"AreaId", "Province", "City", "County", "Addr", "Linkman", "Phone",
	"Remark", "Domain"}

func (a *App) TableName() string {
	return TableName("base_app")
}
func AppTableName() string {
	return TableName("base_app")
}
func AppGetList(key string, starttime string, endtime string, appstate, appmode int8, page, pagesize uint32) ([]*App, int64, error) {
	list := make([]*App, 0)
	offset := page * pagesize
	o := orm.NewOrm()
	query := o.QueryTable(AppTableName()).Filter("is_del", 0).RelatedSel()
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
		query.OrderBy("-id").Limit(pagesize, offset).All(&list)
	}
	return list, num, err

}
func getCacheKeyForId(id uint) string {
	return fmt.Sprintf(utils.CacheKeyBaseAppById, id)
}
func AppGetById(id uint) (*App, error) {
	cacheKey := getCacheKeyForId(id)
	loadCallbackFunc := func() (interface{}, error) {
		mode := new(App)
		o := orm.NewOrm()
		query := o.QueryTable(AppTableName()).Filter("is_del", 0)
		err := query.Filter("id", id).One(mode)
		return mode, err
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		return nil, err
	}
	app := res.(*App)
	return app, nil
}

func AppUpdate(model *App) error {
	err := IsValidApp(model)
	if err != nil {
		return err
	}
	o := orm.NewOrm()
	if model.Id == 0 {
		id, err := o.Insert(model)
		if err == nil {
			model.Id = uint(id)
		}
	} else {
		//  query := o.QueryTable(AppTableName())
		_, err = o.Update(model, AppListFields...)
		cacheKey := getCacheKeyForId(model.Id)
		utils.Cache.Delete(cacheKey)
	}

	return err
}

// 逻辑删除
func AppSoftDel(id uint) error {
	o := orm.NewOrm()
	_, err := o.QueryTable(AppTableName()).Filter("id", id).Update(orm.Params{"is_del": 1})
	if err == nil {
		cacheKey := getCacheKeyForId(id)
		utils.Cache.Delete(cacheKey)
	}
	return err

}

// 数据验证
func IsValidApp(App *App) error {
	result := validation.Validation{}
	isValid, err := result.Valid(App)
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
