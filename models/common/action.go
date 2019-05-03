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
// '系统行为表';
type Action struct{

  Id int64//` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',

  Key string //` varchar(36) NOT NULL DEFAULT '' COMMENT '行为唯一标识',
  Name  string //` varchar(127) NOT NULL DEFAULT '' COMMENT '行为名称',
  Remark string//` varchar(255) NOT NULL DEFAULT '' COMMENT '行为描述',
  Rule  string //` text COMMENT '行为规则',
  Log string //` text COMMENT '日志规则',
  Kind int8//` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '类型',
  State int8 //` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态',
  UpdateTime Time //` bigint(13) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',
  IsDel  int8 //` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
  Uid  int64 //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
  Tid int64//` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
  Appid int64 //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
}
  
type ActionRequestDto struct {
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

var ActionListFields = [] string {"key","name","remark","kind","rule","log","State","update_time","is_del"}
func (a *Action) TableName() string {
	return TableName("common_action")
}
func ActionTableName() string {
	return TableName("common_action")
}

//签到列表
func ActionGetList(dto *ActionRequestDto, starttime string,endtime string,scopeIds ...interface{}) ([]*Action, int64, error) {
	list := make([]*Action, 0)
	offset := (dto.PageIndex-1) *dto.PageSize
	o := orm.NewOrm()
	query := o.QueryTable(ActionTableName())
	query = AppendFilter(query, scopeIds...)
	if len(dto.Key)>0 {
		cond:=orm.NewCondition()
		cond1:=cond.Or("remark__icontains",dto.Key).Or("name__icontains",dto.Key).Or("rule__icontains",dto.Key)
		query = query.SetCond(cond1)
	}
	if dto.State>-2{
		query = query.Filter("state", dto.State)
		}
	if dto.Kind>-1{
			query = query.Filter("kind", dto.Kind)
			}	
	if len(starttime) > 0 {
		query = query.Filter("create_time_gt",starttime )
	}
	if len(endtime) > 0 {
		query = query.Filter("create_time__lt",endtime)
	}

	num, err := query.Count()
	if num > 0 {
		query.OrderBy("state").Limit(dto.PageSize, offset).All(&list)
	}
	

	
	return list, num, err

}

func ActionGetById( id int64,scopyIds...interface{}) (Action, error) {
	model := new(Action)
	o := orm.NewOrm()
	query := o.QueryTable(ActionTableName())
	query = AppendFilter(query, scopyIds...)
	err := query.Filter("id", id).One(model)
	
	return *model, err
}
func ActionAdd(action *Action,scopyIds ...interface{}) (int64, error) {
	err := IsValidAction(action)
	action.UpdateTime.Time = time.Now()
	
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
	

	id, err := o.Insert(action)
	return id, err
}

func ActionUpdate(action *Action,scopyIds...interface{}) (int64, error) {
	err := IsValidAction(action)
	action.UpdateTime.Time = time.Now()
	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
		// query := o.QueryTable(ActionLogTableName()).Filter("tid", tid).Filter("appid", appid).
		// 	Filter("id", actionlog.Id)
			num, err:=o.Update(action ,ActionListFields...)
	
	return num, err
}

func ActionDelete(id int64,scopeIds...interface{}) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(ActionTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("id", id).Delete()
	return num, err
}

// 数据验证
func IsValidAction(action *Action) error {
	result := validation.Validation{}
	isValid, err := result.Valid(action)
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
