package common

import (
	// "strings"
	// "strconv"
	"time"

	//   "fmt"
	"errors"
	//    "strings"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbCloudDataApi/libs"
	// "yellbuy.com/YbCloudDataApi/models/common"
	// "yellbuy.com/YbCloudDataApi/models"
	// baseModels "yellbuy.com/YbCloudDataApi/models/base"
)
// 行为日志表';
type Sms struct{
			//'主键',
		Id  int64
			//'分类，1：短信，2：Email',
		Kind int8
			//'类型id',
		CategoryId int64
			// '标题',
		Title   string `valid:"MaxSize(255)"`
			//'内容',
		Content  string `valid:"MaxSize(1023)"`
		//  '状态，0，未发送，1：成功，-1：失败',
		State  int8
			//'是否删除',
		IsDel  int8
			//'入队时间',
		CreateTime Time
			//'计划发送时间',
		ScheduleTime Time
			// '发送目标',
		SendTo  string `valid:"MaxSize(255)"`
			//'执行行为的时间',
		SendTime  Time
			//'发送次数',
		SendCount int8
			//'响应代码',
		Errcode  string `valid:"MaxSize(31)"`
			//'响应消息',
		Errmsg string `valid:"MaxSize(255)"`
			//'执行用户id',
		Uid uint64
			//'所属租户',
		Tid     uint64
		//'所属应用',
  		 Appid  uint64

}

var SmsListFields = []string{"Id", "Pid", "Name", "Key", "CoverId", "Icon", "Order", "Status"}

func (a *Sms) TableName() string {
	return TableName("common_sms")
}
func SmsTableName() string {
	return TableName("common_sms")
}

//短信列表
func SmsGetList(appid uint, tid uint, key string, starttime string,endtime string, smsstate,smskind int8, page, pagesize uint32) ([]*Sms, int64, error) {
	list := make([]*Sms, 0)
	offset := page * pagesize
	o := orm.NewOrm()
	query := o.QueryTable(SmsTableName()).Filter("tid", tid).Filter("appid", appid)
	if len(key)>0 {
		cond:=orm.NewCondition()
		cond1:=cond.Or("title__icontains",key).Or("send_to__icontains",key).Or("content__icontains",key)
		query = query.SetCond(cond1)
	}
	if smsstate>-2{
		query = query.Filter("state", smsstate)
		}
	if smskind>-1{
			query = query.Filter("kind", smskind)
			}	
	if len(starttime) > 0 {
		query = query.Filter("send_time_gt",starttime )
	}
	if len(endtime) > 0 {
		query = query.Filter("send_time__lt",endtime)
	}

	num, err := query.Count()
	if num > 0 {
		query.OrderBy("state","-send_time").Limit(pagesize, offset).All(&list)
	}
	

	
	return list, num, err

}

func SmsGetById(appid, tid uint, id int64) (Sms, error) {
	model := new(Sms)
	o := orm.NewOrm()
	query := o.QueryTable(SmsTableName()).Filter("tid", tid).Filter("appid", appid)
	err := query.Filter("id", id).One(model)
	
	return *model, err
}
func SmsAdd(appid, tid uint, sms *Sms) (int64, error) {
	err := IsValidSms(sms)
	sms.CreateTime.Time = time.Now()
	
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
	

	id, err := o.Insert(sms)
	return id, err
}

func SmsUpdate(appid, tid uint, sms *Sms) (int64, error) {
	err := IsValidSms(sms)
	sms.SendTime.Time = time.Now()
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
		query := o.QueryTable(SmsTableName()).Filter("tid", tid).Filter("appid", appid).
			Filter("id", sms.Id)
			num, err:= query.Update(orm.Params{"errcode":sms.Errcode,"errmsg":sms.Errmsg,"state":sms.State,})
	
	return num, err
}

func SmsDelete(appid uint, tid uint, id int64) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(SmsTableName()).Filter("tid", tid).Filter("appid", appid)
	num, err := query.Filter("id", id).Delete()
	return num, err
}

// 数据验证
func IsValidSms(sms *Sms) error {
	result := validation.Validation{}
	isValid, err := result.Valid(sms)
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
