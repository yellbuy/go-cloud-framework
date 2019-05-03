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
	. "yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/models/common"
	// "yellbuy.com/YbGoCloundFramework/models"
	// baseModels "yellbuy.com/YbGoCloundFramework/models/base"
)

// '行为日志表';
type ActionLog struct {
	Id         int64  //` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
	ActionId   int64  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '行为id',
	Value      int64  // int(10) NOT NULL DEFAULT '0' COMMENT '得到积分',
	ActionIp   int64  //` bigint(20) NOT NULL COMMENT '执行行为者ip',
	Model      string //` varchar(50) NOT NULL DEFAULT '' COMMENT '触发行为的表',
	Kind       string //` varchar(36) DEFAULT NULL COMMENT '类型',
	RecordId   int64  // int(10) unsigned NOT NULL DEFAULT '0' COMMENT '触发行为的数据id',
	Content    string //` varchar(255) NOT NULL DEFAULT '' COMMENT '日志内容',
	Remark     string // varchar(255) NOT NULL DEFAULT '' COMMENT '日志备注',
	State      int8   //` tinyint(2) NOT NULL DEFAULT '1' COMMENT '状态',
	CreateTime Time   //` bigint(13) unsigned NOT NULL DEFAULT '0' COMMENT '执行行为的时间',
	IsDel      int8   //` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
	Uid        int64  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
	Tid        int64  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
	Appid      int64  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',

}
type ActionLogRequestDto struct {
	Key  string `json:"key"`
	Name  string `json:"name"`
	Remark string `json:"remark"`
	Rule  string `json:"rule"`
	Log string `json:"log"`
	Kind int8  `json:"kind"`
	State int8 `json:"state"`
	UpdateTime Time `json:"updateTime"`
	IsDel  int8 `json:"isDel"`
	PageIndex  uint32 `json:"pageIndex"`
	PageSize   uint32 `json:"pageSize"`
}
var LogListFields = []string{"Id", "ActionId", "Value", "ActionIp", "Model", "Kind", "RecordId", "Content", "Remark", "State", "CreateTime", "IsDel"}

func (a *ActionLog) TableName() string {
	return TableName("common_action_log")
}
func ActionLogTableName() string {
	return TableName("common_action_log")
}

//签到列表
func ActionLogGetList(dto *ActionLogRequestDto,starttime,endtime string, scopeIds ...interface{}) ([]*ActionLog, int64, error) {
	list := make([]*ActionLog, 0)
	offset := (dto.PageIndex-1)*dto.PageSize
	o := orm.NewOrm()
	query := o.QueryTable(ActionLogTableName())
	query=AppendFilter(query, scopeIds...)
	if len(dto.Key) > 0 {
		cond := orm.NewCondition()
		cond1 := cond.Or("remark__icontains", dto.Key). Or("content__icontains", dto.Key)
		query = query.SetCond(cond1)
	}
	if dto.State > -2 {
		query = query.Filter("state", dto.State)
	}
	if dto.Kind > -1 {
		query = query.Filter("kind", dto.Kind)
	}
	if len(starttime) > 0 {
		query = query.Filter("create_time_gt", starttime)
	}
	if len(endtime) > 0 {
		query = query.Filter("create_time__lt", endtime)
	}

	num, err := query.Count()
	if num > 0 {
		query.OrderBy("state").Limit(dto.PageSize, offset).All(&list)
	}

	return list, num, err

}

func ActionLogGetById(id int64,scopeIds...interface{}) (ActionLog, error) {
	model := new(ActionLog)
	o := orm.NewOrm()
	query := o.QueryTable(ActionLogTableName())
	query = AppendFilter(query, scopeIds...)
	err := query.Filter("id", id).One(model)

	return *model, err
}
func ActionLogGetByUid(scopeIds ...interface{}) (ActionLog, error) {
	model := new(ActionLog)
	o := orm.NewOrm()
	curdate := time.Now().Format("2006-01-02")

	query := o.QueryTable(ActionLogTableName())
	query = AppendFilter(query, scopeIds...)
	err := query.Filter("create_time__gte", curdate+" 00:00:00").Filter("create_time__lte", curdate+" 23:59:59").One(model)

	return *model, err
}

func ActionLogAdd( actionlog *ActionLog) (int64, error) {
	err := IsValidActionLog(actionlog)
	actionlog.CreateTime.Time = time.Now()

	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()

	id, err := o.Insert(actionlog)
	return id, err
}

func ActionLogUpdate(actionlog *ActionLog) (int64, error) {
	err := IsValidActionLog(actionlog)
	actionlog.CreateTime.Time = time.Now()
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
	// query := o.QueryTable(ActionLogTableName()).Filter("tid", tid).Filter("appid", appid).
	// 	Filter("id", actionlog.Id)
	num, err := o.Update(actionlog, LogListFields...)

	return num, err
}

func ActionLogDelete(id int64,scopeIds ...interface{}) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(ActionLogTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("id", id).Delete()
	return num, err
}

// 数据验证
func IsValidActionLog(actionlog *ActionLog) error {
	result := validation.Validation{}
	isValid, err := result.Valid(actionlog)
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
