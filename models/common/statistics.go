package common

import (
	// "strings"
	// "strconv"
	"fmt"
	"strings"
	"time"

	//   "fmt"
	"errors"
	//    "strings"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbCloudDataApi/libs"
	"yellbuy.com/YbCloudDataApi/utils"
)

const (
	// 广告
	ModelEshopAdName = "eshop_ad"
	// 文章
	ModelCmsArticleName = "cms_article"
	// 用户
	ModelBaseUserName = "base_user"
	// 商家
	ModelBaseTenantName = "base_tenant"
	// 商品
	ModelEshopGoodsName = "eshop_goods"
	// 订单
	ModelEshopOrderName = "eshop_order_info"
	// 订单明细
	ModelEshopOrderGoodsName = "eshop_order_goods"

	// 点击，即浏览
	ActTypeClick uint8 = 1
	// 点赞
	ActTypeFavior uint8 = 2
	// 收藏
	ActTypeCollect uint8 = 10
	// 购物车
	ActTypeCart uint8 = 20
	// 评价
	ActTypeEval uint8 = 50
	// 回复
	ActTypeReply uint8 = 100
	// 定位
	ActTypeLocation uint8 = 200
)

var StatisticsAppFields = []string{"s.id", "s.act_type", "s.ext_act_type", "s.model", "s.record_id", "s.parentid",
	"s.title", "s.content", "s.img_url", "s.video_url", "s.audio_url", "s.state", "s.audit_state", "s.is_del", "s.create_time",
	"s.num", "s.score", "s.files", "s.ip", "s.uid", "s.tid", "s.appid",
	"u.name as u_name", "u.nickname as u_nickname", "u.username as Username", "u.avatar as user_avatar",
	"t.name as tenant_name", "t.logo as tenant_logo", "a.name as app_name"}

// 统计汇总信息，如文章浏览量，收藏量，点赞量等
type StatisticsSummary struct {
	// 按总量
	ClickNum   int64   `orm:"-"`
	FaviorNum  int64   `orm:"-"`
	CollectNum int64   `orm:"-"`
	CartNum    int64   `orm:"-"`
	EvalNum    int64   `orm:"-"`
	EvalScore  float32 `orm:"-"`
	ReplyNum   int64   `orm:"-"`

	// 按人
	ClickCount   int64 `orm:"-"`
	FaviorCount  int64 `orm:"-"`
	CollectCount int64 `orm:"-"`
	CartCount    int64 `orm:"-"`
	EvalCount    int64 `orm:"-"`
	ReplyCount   int64 `orm:"-"`
}

// 统计行为信息（如文章是否已读，收藏，点赞等）
type StatisticsAction struct {
	IsClick   bool `orm:"-"`
	IsFavior  bool `orm:"-"`
	IsCollect bool `orm:"-"`
	IsCart    bool `orm:"-"`
	IsEval    bool `orm:"-"`
	IsReply   bool `orm:"-"`
}

// '系统行为统计表';
type Statistics struct {
	Id int64 //` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
	// 行为类型，1：点击，2：点赞，10：收藏，20：评价，100：评论 `valid:"Required;Range(1, 255)"`
	ActType uint8 `valid:"Required"`
	// 扩展类型，每个值自定义
	ExtActType uint8
	Model      string `valid:"Required;MaxSize(32)"` //` varchar(127) NOT NULL DEFAULT '' COMMENT '行为名称',
	RecordId   int64  `valid:"Required;Min(1)"`      //` varchar(255) NOT NULL DEFAULT '' COMMENT '行为描述',
	Parentid   int64  `valid:"Min(0)"`
	Title      string `valid:"MaxSize(32)"`
	ImgUrl     string `valid:"MaxSize(255)"`
	AudioUrl   string `valid:"MaxSize(255)"`
	VideoUrl   string `valid:"MaxSize(255)"`
	//'地点',
	Location string
	// '地点经度',
	LocationLng float32
	//'地点纬度',
	LocationLat float32
	Content     string //` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '类型',
	//` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态',
	State      int8 `valid:"Range(-1, 1)"`
	AuditState int8 `valid:"Range(-1, 1)"`
	// 数量
	Num uint
	// 分数
	Score      float32
	Files      string    `valid:"MaxSize(255)"`
	CreateTime time.Time //` bigint(13) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',
	Ip         int64
	IsDel      uint8 //` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
	Uid        uint  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
	Tid        uint  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
	Appid      uint  //` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '执行用户id',
	//ModelBase  `orm:"-"`
	// 数据是否存在的检查标记，设置为false，则始终添加处理，否则会自动判断当前用户保存的数据是否存在，不存在则更新，否则添加
	IsExistCheck bool     `orm:"-"`
	PicsArr      []string `orm:"-"`
}

type StatisticsDataRequestDto struct {
	// 多个model以，进行分割
	Models string `json:"model"`
	// 多个actType以，进行分割
	ActTypes string `json:"actTypes"`
	// 多个extActType以，进行分割
	ExtActTypes string `json:"extActTypes"`
	RecordId    int64  `json:"recordId"`
	Parentid    int64  `json:"parentid"`
	OnlyPublish bool   `json:"onlyPublish"` // 仅发布的
	OnlyAudit   bool   `json:"onlyAudit"`   // 仅审核通过的
	// 分组字段，为空则默认按Model，ActType分组
	GroupFields string `json:"groupFields"`
	Tid         uint   `json:"tid"`
	Uid         uint   `json:"uid"`
	Appid       uint   `json:"appid"`
	// 统计开始时间
	StartTime string `json:"startTime"`
	// 统计结束时间
	EndTime string `json:"endTime"`
}
type StatisticsAppResponseDto struct {
	Statistics
	StatisticsSummary
	// 次数，按人
	UNickname  string
	UName      string
	UserName   string
	UserAvatar string
	TenantName string
	TenantLogo string
	AppName    string
	AppLogo    string
}

type StatisticsDataResponseDto struct {
	Statistics
	// 次数，按人
	CountNum int64
	// 总数
	Total int64
	// 评分
	Score float32
}

type StatisticsRequestDto struct {
	ActType    uint8  `json:"actType"`
	ExtActType uint8  `json:"extActType"`
	Models     string `json:"models"`
	RecordId   int64  `json:"recordId"`
	Parentid   int64  `json:"parentid"`
	Title      string `json:"title"`
	State      int8   `json:"state"`
	AuditState int8   `json:"auditState"`
	PageIndex  uint32 `json:"pageIndex"`
	PageSize   uint32 `json:"pageSize"`
}
type StatisticsAppRequestDto struct {
	StatisticsRequestDto
	RecordIds string `json:"recordIds"`
	Fields    string `json:"fields"`
	Appid     uint   `json:"appid"`
	Tid       uint   `json:"tid"`
	Uid       uint   `json:"uid"`
}

type StatisticsExistRequestDto struct {
	// 多个model以，进行分割
	Models string `json:"model"`
	// 多个actType以，进行分割
	ActTypes string `json:"actTypes"`
	// 多个extActType以，进行分割
	ExtActTypes string `json:"extActTypes"`
	RecordIds   string `json:"recordIds"`
	Parentids   string `json:"parentids"`
	OnlyPublish bool   `json:"onlyPublish"` // 仅发布的
	OnlyAudit   bool   `json:"onlyAudit"`   // 仅审核通过的
	Tid         uint   `json:"tid"`
	Uid         uint   `json:"uid"`
	Appid       uint   `json:"appid"`
	// 统计开始时间
	StartTime string `json:"startTime"`
	// 统计结束时间
	EndTime string `json:"endTime"`
}

func (a *Statistics) TableName() string {
	return TableName("common_statistics")
}
func StatisticsTableName() string {
	return TableName("common_statistics")
}

// 获取是否进行了操作的帮助方法
func StatisticsGetAction(list []Statistics) StatisticsAction {
	var action StatisticsAction
	for _, stat := range list {
		switch stat.ActType {
		case ActTypeClick:
			action.IsClick = true
			break
		case ActTypeFavior:
			action.IsFavior = true
			break
		case ActTypeCollect:
			action.IsCollect = true
			break
		case ActTypeCart:
			action.IsCart = true
			break
		case ActTypeEval:
			action.IsEval = true
			break
		case ActTypeReply:
			action.IsReply = true
			break
		}
	}
	return action
}

// 无缓存查询行为数据是否存在（点赞、已读、收藏等场景）
func StatisticsGetExists(dto *StatisticsExistRequestDto) ([]Statistics, error) {
	var list []Statistics
	qb, err := orm.NewQueryBuilder("mysql")
	if err != nil {
		return nil, err
	}
	// 去除空格
	dto.RecordIds = strings.TrimSpace(dto.RecordIds)
	dto.Parentids = strings.TrimSpace(dto.Parentids)
	dto.ActTypes = strings.TrimSpace(dto.ActTypes)
	dto.ExtActTypes = strings.TrimSpace(dto.ExtActTypes)
	groupFields := make([]string, 0)
	if len(dto.RecordIds) > 0 {
		groupFields = append(groupFields, "record_id")
	}
	if len(dto.Parentids) > 0 {
		groupFields = append(groupFields, "parentid")
	}
	if len(dto.ExtActTypes) > 0 {
		groupFields = append(groupFields, "ext_act_type")
	}
	groupFields = append(groupFields, "act_type")

	builder := qb.Select(groupFields...).
		From("common_statistics").Where(" is_del=0 ")
	if dto.Appid > 0 {
		builder = builder.And(fmt.Sprintf("appid = %v", dto.Appid))
	}
	if dto.Tid > 0 {
		builder = builder.And(fmt.Sprintf("tid = %v", dto.Tid))
	}
	if dto.Uid > 0 {
		builder = builder.And(fmt.Sprintf("uid = %v", dto.Uid))
	}
	if len(strings.TrimSpace(dto.Models)) > 0 {
		models := strings.Split(dto.Models, ",")
		if len(models) > 1 {
			builder = builder.And(fmt.Sprintf("FIND_IN_SET (model,'%v')", dto.Models))
		} else {
			builder = builder.And(fmt.Sprintf("model = '%v'", dto.Models))
		}
	}
	if strings.Contains(dto.ActTypes, ",") {
		builder = builder.And(fmt.Sprintf("FIND_IN_SET (act_type,'%v')", dto.ActTypes))
	} else if len(dto.ActTypes) > 0 {
		builder = builder.And(fmt.Sprintf("act_type = %v", dto.ActTypes))
	}
	if strings.Contains(dto.ExtActTypes, ",") {
		builder = builder.And(fmt.Sprintf("FIND_IN_SET (ext_act_type,'%v')", dto.ExtActTypes))
	} else if len(dto.ExtActTypes) > 0 {
		builder = builder.And(fmt.Sprintf("ext_act_type = %v", dto.ExtActTypes))
	}
	if strings.Contains(dto.RecordIds, ",") {
		builder = builder.And(fmt.Sprintf("FIND_IN_SET (record_id,'%v')", dto.RecordIds))
	} else if len(dto.RecordIds) > 0 {
		builder = builder.And(fmt.Sprintf("record_id = %v", dto.RecordIds))
	}
	if strings.Contains(dto.Parentids, ",") {
		builder = builder.And(fmt.Sprintf("FIND_IN_SET (parentid,'%v')", dto.Parentids))
	} else if len(dto.Parentids) > 0 {
		builder = builder.And(fmt.Sprintf("parentid = %v", dto.Parentids))
	}

	if dto.OnlyPublish {
		builder = builder.And("state == 1")
	} else {
		builder = builder.And("state >= 0")
	}
	if dto.OnlyAudit {
		builder = builder.And("audit_state == 1")
	} else {
		builder = builder.And("audit_state >= 0")
	}
	if len(dto.StartTime) > 0 {
		builder = builder.And(fmt.Sprintf("create_time >= %v", dto.StartTime))
	}
	if len(dto.EndTime) > 0 {
		builder = builder.And(fmt.Sprintf("create_time < %v", dto.EndTime))
	}

	builder = builder.GroupBy(groupFields...)

	sql := qb.String()
	o := orm.NewOrm()
	_, err = o.Raw(sql).QueryRows(&list)
	if err != nil {
		fmt.Println(sql)
		fmt.Println(err)
	}
	return list, err
}

// 无缓存查询统计数据
func StatisticsGetValues(dto *StatisticsDataRequestDto) ([]StatisticsDataResponseDto, error) {
	var list []StatisticsDataResponseDto
	qb, err := orm.NewQueryBuilder("mysql")
	if err != nil {
		return nil, err
	}
	var groupFields []string
	dto.GroupFields = strings.TrimSpace(dto.GroupFields)
	if len(dto.GroupFields) > 0 {
		groupFields = strings.Split(dto.GroupFields, ",")
	}

	// 追加统计字段
	selectFields := append(groupFields, "count(s.id) as total", "count(distinct s.uid) as count_num", "COALESCE(avg(s.score),0) as score")
	builder := qb.Select(selectFields...).
		From("common_statistics as s").Where(" is_del=0 ")
	if dto.Appid > 0 {
		builder = builder.And(fmt.Sprintf("appid = %v", dto.Appid))
	}
	if dto.Tid > 0 {
		builder = builder.And(fmt.Sprintf("tid = %v", dto.Tid))
	}
	if dto.Uid > 0 {
		builder = builder.And(fmt.Sprintf("uid = %v", dto.Uid))
	}
	if len(strings.TrimSpace(dto.Models)) > 0 {
		models := strings.Split(dto.Models, ",")
		if len(models) > 1 {
			builder = builder.And(fmt.Sprintf("FIND_IN_SET (model,'%v')", dto.Models))
		} else {
			builder = builder.And(fmt.Sprintf("model = '%v'", dto.Models))
		}
	}
	if strings.Contains(dto.ActTypes, ",") {
		builder = builder.And(fmt.Sprintf("FIND_IN_SET (act_type,'%v')", dto.ActTypes))
	} else if len(strings.TrimSpace(dto.ActTypes)) > 0 {
		builder = builder.And(fmt.Sprintf("act_type = %v", dto.ActTypes))
	}
	if strings.Contains(dto.ExtActTypes, ",") {
		builder = builder.And(fmt.Sprintf("FIND_IN_SET (ext_act_type,'%v')", dto.ExtActTypes))
	} else if len(strings.TrimSpace(dto.ExtActTypes)) > 0 {
		builder = builder.And(fmt.Sprintf("ext_act_type = %v", dto.ExtActTypes))
	}
	if dto.RecordId > 0 {
		builder = builder.And(fmt.Sprintf("record_id = %v", dto.RecordId))
	}
	if dto.Parentid > 0 {
		builder = builder.And(fmt.Sprintf("parentid = %v", dto.Parentid))
	}
	if dto.OnlyPublish {
		builder = builder.And("state = 1")
	} else {
		builder = builder.And("state >= 0")
	}
	if dto.OnlyAudit {
		builder = builder.And("audit_state = 1")
	} else {
		builder = builder.And("audit_state >= 0")
	}
	if len(dto.StartTime) > 0 {
		builder = builder.And(fmt.Sprintf("create_time >= %v", dto.StartTime))
	}
	if len(dto.EndTime) > 0 {
		builder = builder.And(fmt.Sprintf("create_time < %v", dto.EndTime))
	}

	if len(groupFields) > 0 {
		builder = builder.GroupBy(groupFields...)
	}

	sql := qb.String()
	o := orm.NewOrm()
	_, err = o.Raw(sql).QueryRows(&list)
	if err != nil {
		fmt.Println(sql, err)
	}

	return list, err
}

//把查询的统计结果，转换为汇总对象结构
func StatisticsGetSummary(list []StatisticsDataResponseDto) StatisticsSummary {
	var res StatisticsSummary
	for _, stat := range list {
		fmt.Printf("%+v", stat)
		switch stat.ActType {
		case ActTypeClick:
			res.ClickNum = stat.Total
			res.ClickCount = stat.CountNum
			break
		case ActTypeFavior:
			res.FaviorNum = stat.Total
			res.FaviorCount = stat.CountNum
			break
		case ActTypeCollect:
			res.CollectNum = stat.Total
			res.CollectCount = stat.CountNum
			break
		case ActTypeCart:
			res.CartNum = stat.Total
			res.CartCount = stat.CountNum
			break
		case ActTypeEval:
			res.EvalNum = stat.Total
			res.EvalCount = stat.CountNum
			res.EvalScore = stat.Score
			break
		case ActTypeReply:
			res.ReplyNum = stat.Total
			res.ReplyCount = stat.CountNum
			break
		}
	}
	return res
}

//统计基础数据列表，有缓存
func StatisticsGetCacheValues(dto *StatisticsDataRequestDto) ([]StatisticsDataResponseDto, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyCommonStatisticsValues, dto)
	loadCallbackFunc := func() (interface{}, error) {
		list, err := StatisticsGetValues(dto)
		return list, err
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc, utils.FileMinuteExpiration)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	data := res.([]StatisticsDataResponseDto)
	return data, nil
}

//APP端调用的统计信息
func StatisticsGetAppList(dto *StatisticsAppRequestDto) ([]StatisticsAppResponseDto, error) {
	var list []StatisticsAppResponseDto

	if dto.PageSize == 0 {
		dto.PageSize = 10
	}

	offset := int(dto.PageIndex * dto.PageSize)
	qb, err := orm.NewQueryBuilder("mysql")
	if err != nil {
		return nil, err
	}

	builder := qb.Select(StatisticsAppFields...).
		From("common_statistics as s").
		InnerJoin("base_user as u").On("s.uid = u.id").
		InnerJoin("base_app as a").On("s.appid = a.id").
		LeftJoin("base_tenant as t").On("s.tid = t.id").
		Where("s.id in(select max(ss.id) from common_statistics as ss where ss.is_del = 0")
	if dto.State > 0 {
		builder = builder.And(fmt.Sprintf("ss.state = %v", dto.State))
	} else {
		builder = builder.And("ss.state >= 0")
	}
	if dto.AuditState > 0 {
		builder = builder.And(fmt.Sprintf("ss.audit_state = %v", dto.AuditState))
	} else {
		builder = builder.And("ss.audit_state >= 0")
	}

	if len(strings.TrimSpace(dto.Models)) > 0 {
		models := strings.Split(dto.Models, ",")
		if len(models) > 1 {
			builder = builder.And(fmt.Sprintf("FIND_IN_SET (ss.model,'%v')", dto.Models))
		} else {
			builder = builder.And(fmt.Sprintf("ss.model = '%v'", dto.Models))
		}
	}
	if dto.ActType > 0 {
		builder = builder.And(fmt.Sprintf("ss.act_type = %v", dto.ActType))
	}
	if dto.ExtActType > 0 {
		builder = builder.And(fmt.Sprintf("ss.ext_act_type = %v", dto.ExtActType))
	}
	if dto.RecordId > 0 {
		builder = builder.And(fmt.Sprintf("ss.record_id = %v", dto.RecordId))
	}
	if dto.Parentid > 0 {
		builder = builder.And(fmt.Sprintf("ss.parentid = %v", dto.Parentid))
	}
	if dto.Uid > 0 {
		builder = builder.And(fmt.Sprintf("ss.uid = %v", dto.Uid))
	}
	if dto.Tid > 0 {
		builder = builder.And(fmt.Sprintf("s.tid = %v", dto.Tid))
	}
	if dto.Appid > 0 {
		builder = builder.And(fmt.Sprintf("ss.appid = %v", dto.Appid))
	}
	if len(dto.Title) > 0 {
		builder = builder.And("ss.title like '%?%'")
	}
	builder = builder.And("ss.is_del = 0 GROUP BY ss.record_id)")
	builder = builder.OrderBy("s.id desc").Limit(int(dto.PageSize)).Offset(offset)

	sql := builder.String()
	o := orm.NewOrm()
	if len(dto.Title) > 0 {
		_, err = o.Raw(sql, dto.Title).QueryRows(&list)
	} else {
		_, err = o.Raw(sql).QueryRows(&list)
	}

	if err != nil {
		fmt.Println(err, sql)
	}

	fmt.Printf("%+v", list)
	return list, err
}

func StatisticsGetAppById(id int64, uid, tid, appid uint) (*StatisticsAppResponseDto, error) {
	if id <= 0 {
		return nil, errors.New("标识参数不正确")
	}
	model := new(StatisticsAppResponseDto)
	qb, err := orm.NewQueryBuilder("mysql")
	if err != nil {
		return nil, err
	}
	builder := qb.Select(StatisticsAppFields...).
		From("common_statistics as s").
		InnerJoin("base_app as a").On("s.appid = a.id").
		LeftJoin("base_tenant as t").On("s.tid = t.id").Where("s.is_del=0")
	builder = builder.And(fmt.Sprintf("id = %v", id))
	if uid > 0 {
		builder = builder.And(fmt.Sprintf("uid = %v", uid))
	}
	if tid > 0 {
		builder = builder.And(fmt.Sprintf("tid = %v", tid))
	}
	if appid > 0 {
		builder = builder.And(fmt.Sprintf("appid = %v", appid))
	}

	sql := builder.String()
	fmt.Println(sql)
	o := orm.NewOrm()
	err = o.Raw(sql).QueryRow(model)
	return model, err
}

//统计基础数据列表
func StatisticsGetList(dto *StatisticsRequestDto, scopeIds ...interface{}) ([]*Statistics, int64, error) {
	list := make([]*Statistics, 0)
	offset := (dto.PageIndex - 1) * dto.PageSize
	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName()).Filter("is_del", 0)
	query = AppendFilter(query, scopeIds...)
	if len(dto.Title) > 0 {
		cond := orm.NewCondition()
		cond1 := cond.Or("title__icontains", dto.Title)
		query = query.SetCond(cond1)
	}
	if dto.State > -2 {
		query = query.Filter("state", dto.State)
	}
	if dto.State >= 0 && dto.AuditState > -2 {
		query = query.Filter("audit_state", dto.State)
	}
	if dto.ActType > 0 {
		query = query.Filter("act_type", dto.ActType)
	}
	if dto.ExtActType > 0 {
		query = query.Filter("ext_act_type", dto.ExtActType)
	}
	if len(strings.TrimSpace(dto.Models)) > 0 {
		models := Split2Interface(dto.Models)
		if len(models) > 1 {
			query = query.Filter("model__in", models...)
		} else {
			query = query.Filter("model", dto.Models)
		}
	}
	if dto.RecordId > 0 {
		query = query.Filter("record_id", dto.RecordId)
	}
	if dto.Parentid > 0 {
		query = query.Filter("parentid", dto.Parentid)
	}
	num, err := query.Count()
	if num > 0 {
		query.OrderBy("-create_time").Limit(dto.PageSize, offset).All(&list)
	}

	return list, num, err

}

func StatisticsGetById(id int64, scopeIds ...interface{}) (Statistics, error) {
	model := new(Statistics)
	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName()).Filter("is_del", 0)
	query = AppendFilter(query, scopeIds...)
	err := query.Filter("id", id).One(model)

	return *model, err
}

// 是否存在
func StatisticsExist(data *Statistics) (int64, error) {
	var dbModel Statistics
	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName())
	err := query.Filter("model", data.Model).Filter("act_type", data.ActType).
		Filter("record_id", data.RecordId).Filter("parentid", data.Parentid).Filter("uid", data.Uid).Filter("is_del", 0).One(&dbModel, "id")

	return dbModel.Id, err
}

func StatisticsSave(data *Statistics) (int64, error) {
	data.CreateTime = time.Now()
	data.IsDel = 0
	data.State = 1
	err := IsValidStatistics(data)
	if err != nil {
		//fmt.Println(err, data)
		return 0, err
	}
	o := orm.NewOrm()
	// 判断是否需进行数据存在的检查，购物车，收藏等需进行本判断
	if data.IsExistCheck {
		// 需判断数据是否存在
		id, _ := StatisticsExist(data)
		if id > 0 {
			data.Id = id
			_, err := o.Update(data)
			return id, err
		}
	}

	// 100以下的acttype，非匿名用户不允许重复插入
	data.Id, err = o.Insert(data)

	return data.Id, err
}

// 软清空指定人员的信息
func StatisticsSoftClear(model string, actType uint8, uid uint, scopeIds ...interface{}) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("model", model).Filter("act_type", actType).Filter("uid", uid).Update(orm.Params{"is_del": 1})
	return num, err
}

// 清空指定人员的信息
func StatisticsClear(model string, actType uint8, uid uint, scopeIds ...interface{}) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("model", model).Filter("act_type", actType).Filter("uid", uid).Delete()
	return num, err
}

// 按条件批量软清空
func StatisticsSoftDelBy(dto *StatisticsAppRequestDto) (int64, error) {
	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName()).Filter("is_del", 0)

	if dto.State > 0 {
		query = query.Filter("state", dto.State)
	}

	if dto.AuditState > 0 {
		query = query.Filter("audit_state", dto.State)
	}

	if len(strings.TrimSpace(dto.Models)) > 0 {
		models := Split2Interface(dto.Models)
		if len(models) > 1 {
			query = query.Filter("model__in", models...)
		} else {
			query = query.Filter("model", dto.Models)
		}
	}
	if dto.ActType > 0 {
		query = query.Filter("act_type", dto.ActType)
	}
	if dto.ExtActType > 0 {
		query = query.Filter("ext_act_type", dto.ExtActType)
	}
	if dto.RecordId > 0 {
		query = query.Filter("record_id", dto.RecordId)
	}
	if len(dto.RecordIds) > 0 {
		recordIds := Split2Interface(dto.RecordIds)
		if len(recordIds) > 0 {
			query = query.Filter("record_id__in", recordIds...)
		}
	}
	if dto.Parentid > 0 {
		query = query.Filter("parentid", dto.Parentid)
	}
	if dto.Uid > 0 {
		query = query.Filter("uid", dto.Uid)
	}
	if dto.Tid > 0 {
		query = query.Filter("tid", dto.Tid)
	}
	if dto.Appid > 0 {
		query = query.Filter("appid", dto.Appid)
	}
	num, err := query.Update(orm.Params{"is_del": 1})
	return num, err
}

// 软删除
func StatisticsSoftDelByIds(ids []interface{}, scopeIds ...interface{}) (int64, error) {
	if len(ids) == 0 {
		return 0, errors.New("请选择待删除的记录")
	}
	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("record__in", ids...).Update(orm.Params{"is_del": 1})
	return num, err
}

// 软删除
func StatisticsSoftDel(id int64, scopeIds ...interface{}) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("id", id).Update(orm.Params{"is_del": 1})
	return num, err
}
func StatisticsDelete(id int64, scopeIds ...interface{}) (int64, error) {

	o := orm.NewOrm()
	query := o.QueryTable(StatisticsTableName())
	query = AppendFilter(query, scopeIds...)
	num, err := query.Filter("id", id).Delete()
	return num, err
}

// 数据验证
func IsValidStatistics(Statistics *Statistics) error {
	result := validation.Validation{}
	isValid, err := result.Valid(Statistics)
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
