package common

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/validation"

	"github.com/astaxie/beego/orm"
	. "yellbuy.com/YbCloudDataApi/libs"
)

type Category struct {
	// '分类ID',
	Id int64
	// '栏目名称',
	Name string `valid:"MaxSize(63)"`
	// '标识名称',
	Key string `valid:"MaxSize(63)"`
	//'允许发布的内容类型',
	Type string `valid:"MaxSize(100)"`
	//'暂时无用',

	Title string `valid:"MaxSize(100)"`
	//'子任务标题',
	ChildrenTitle string `valid:"MaxSize(100)"`
	// '上级ID',
	Parentid int64
	Fid      string `valid:"MaxSize(4000)"`
	Fname    string `valid:"MaxSize(4000)"`
	// 分类层级
	Level int8
	// '排序（同级有效）',
	Order int64
	// '列表每页行数',
	ListRow int8
	// 'SEO的网页标题',
	MetaTitle string `valid:"MaxSize(50)"`
	//'关键字',
	Keywords string `valid:"MaxSize(255)"`
	//'描述',
	Description string `valid:"MaxSize(255)"`
	//'频道页模板',
	TemplateIndex string `valid:"MaxSize(100)"`
	//'列表页模板',
	TemplateLists string `valid:"MaxSize(100)"`
	//'详情页模板',
	TemplateDetail string `valid:"MaxSize(100)"`
	//'编辑页模板',
	TemplateEdit string `valid:"MaxSize(100)"`
	//列表绑定模型',
	Model string `valid:"MaxSize(100)"`
	//'子文档绑定模型',
	ModelSub string `valid:"MaxSize(100)"`
	//'外链',
	LinkId int
	// '是否允许发布内容',
	AllowPublish int8
	//'提交后允许修改重新提交',
	AllowModify int8
	// '可见性',
	Display int8
	// '发布的文章是否需要审核',
	Check int8
	//
	ReplyModel string `valid:"MaxSize(100)`
	//'扩展设置',
	Extend string `valid:"MaxSize(20)"`
	//'创建时间',
	CreateTime Time
	//'更新时间',
	UpdateTime Time
	//'数据状态，-1：逻辑删除，0：禁用，1：有效',
	State int8
	//'分类图标',
	CoverId int64
	//
	Icon string `valid:"MaxSize(255)"`
	//'分组定义',
	Groups string `valid:"MaxSize(255)"`
	//` text,
	Documentsorts string
	//'栏目类型 0系统模型 1独立模型 2单页面',
	Mold int8
	//'是否在移动端显示 1显示 0不显示',
	Isapp int8
	//'手机频道模版',
	TemplateMIndex string `valid:"MaxSize(100)"`
	//'手机列表模版',
	TemplateMLists string `valid:"MaxSize(100)"`
	//'手机详情页模版',
	TemplateMDetail string `valid:"MaxSize(100)"`
	//'仅限特定对象可见',
	IsPublishSpec int
	//'发布部门',
	PublishDepts string
	//'发布人员',
	PublishUsers string
	//'开启发帖时间段限制',
	LimitPublishTime int8
	//'允许的发帖开始时间',
	AllowStartTime Time
	//'允许的发帖结束时间',
	AllowEndTime Time
	//'话题编辑时限',
	EditTimeLimit int
	//'是否允许回复评论',
	AllowComment int8
	//'审核状态，0：不需要审核，1：需要审核',
	AuditState int8
	//'审核部门',
	AuditDepts string
	//'审核人员',
	AuditUsers string
	//'评论审核状态',
	CommentAuditState int8
	//'审核部门',
	CommentAuditDepts string
	//'审核人员',
	CommentAuditUsers string
	//'是否通知',
	IsPushNotice int8
	//'图片必填',
	RequiredPics int8
	//'new：党建要闻，mien：银江风采，deputy：人大代表之家',
	Kind string `valid:"MaxSize(32)"`
	// 是否逻辑删除
	IsDel int8
	//'所属租户',
	Tid uint
	Uid uint
	//'所属租户',
	Appid      uint
	CoverUrl   string      `orm:"-"`
	NodeOpened bool        `orm:"-" json:"lay_is_open"`
	ParentName string      `orm:"-"`
	Children   []*Category `orm:"-" json:"Children"`
}

// 稽查查询Dto
type CategoryRequestDto struct {
	// 所属ID（任务ID）
	Pid             int64
	Name            string `json:"name"`
	ContainDisabled bool   `json:"containDisabled"`
	// 类型
	Kind       string `json:"kind"`
	PageIndex  uint32 `json:"pageIndex"`
	PageSize   uint32 `json:"pageSize"`
	Parentid   int64  `json:"parentid"`
	FetchChild bool   `json:"fetchChild"`
}

var CategoryUpdateFields = []string{"name", "key", "type", "level", "fid", "fname",
	"title", "children_title", "parentid", "order", "list_row", "meta_title", "keywords", "description",
	"template_index", "template_lists", "template_detail", "template_edit", "model", "model_sub",
	"link_id", "allow_publish", "allow_modify", "display", "check", "reply_model", "extend", "update_time",
	"state", "cover_id", "icon", "groups", "documentsorts", "mold", "isapp",
	"template_m_index", "template_m_lists", "template_m_detail",
	"is_publish_spec", "publish_depts", "publish_users", "limit_publish_time", "allow_start_time", "allow_end_time",
	"edit_time_limit", "allow_comment", "audit_state", "audit_depts", "audit_users",
	"comment_audit_state", "comment_audit_depts", "comment_audit_users", "is_push_notice", "required_pics"}

// 节点数据 Key
func CategoryGetByKey(kind string, key string, scopeIds ...interface{}) (Category, error) {

	qs := orm.NewOrm().QueryTable(CategoryTableName()).Filter("is_del", 0).Filter("kind", kind).Filter("key", key)
	qs = AppendFilter(qs, scopeIds...)
	var model Category
	if err := qs.One(&model); err == orm.ErrNoRows {
		return model, FailError(E201000, err)
	}
	return model, nil
}

// 节点数据 Id
func CategoryGetById(id int64, scopeIds ...interface{}) (Category, error) {
	qs := orm.NewOrm().QueryTable(CategoryTableName()).Filter("id", id).Filter("is_del", 0)
	qs = AppendFilter(qs, scopeIds...)

	var model Category
	if err := qs.One(&model); err == orm.ErrNoRows {
		return model, FailError(E201000, err)
	}
	return model, nil
}

// 根据类型获取分页数据
func CategoryGetMapBy(kind string, containDisabled bool, scopeIds ...interface{}) (map[int64]*Category, error) {
	dto := new(CategoryRequestDto)
	dto.Kind = kind
	dto.ContainDisabled = containDisabled
	res := make(map[int64]*Category)
	list, err := CategoryGetList(kind, containDisabled, scopeIds...)
	if err != nil {
		return res, err
	}
	for _, val := range list {
		res[val.Id] = val
	}
	return res, nil
}

// 根据类型获取所有数据
func CategoryGetList(kind string, containDisabled bool, scopeIds ...interface{}) ([]*Category, error) {
	dto := new(CategoryRequestDto)
	dto.Kind = kind
	dto.ContainDisabled = containDisabled
	list, err := CategoryGetListBy(dto, scopeIds...)
	return list, err
}

// 根据类型获取所有数据
func CategoryGetListBy(dto *CategoryRequestDto, scopeIds ...interface{}) ([]*Category, error) {
	dto.PageIndex = 0
	dto.PageSize = 1000000000
	_, list, err := CategoryGetPagedList(dto, scopeIds...)
	return list, err
}

// 根据类型获取分页数据
func CategoryGetPagedList(dto *CategoryRequestDto, scopeIds ...interface{}) (int64, []*Category, error) {
	list := make([]*Category, 0)
	qs := orm.NewOrm().QueryTable(CategoryTableName()).Filter("kind", dto.Kind).Filter("is_del", 0)
	qs = AppendFilter(qs, scopeIds...)
	if len(dto.Name) > 0 {
		qs = qs.Filter("name__contains", dto.Name)
	}
	if !dto.ContainDisabled {
		qs = qs.Filter("state", 1)
	}
	if dto.PageSize == 0 {
		dto.PageSize = 20
	}
	offset := dto.PageIndex * dto.PageSize
	total, _ := qs.Count()
	if _, err := qs.OrderBy("order").Limit(dto.PageSize, offset).All(&list); err != nil {
		return total, list, FailError(E201000, err)
	}
	return total, list, nil
}

// 根据类型获取所有数据
func CategoryLoadList(kind string, containDisabled bool, ids string, scopeIds ...interface{}) ([]*Category, error) {
	list := make([]*Category, 0)
	if len(ids) == 0 {
		return list, nil
	}
	qs := orm.NewOrm().QueryTable(CategoryTableName()).Filter("is_del", 0).Filter("kind", kind)
	qs = AppendFilter(qs, scopeIds...)
	qs = qs.Filter("id__in", strings.Split(ids, ","))
	if !containDisabled {
		qs = qs.Filter("state", 1)
	}

	if _, err := qs.OrderBy("order").Limit(100000000).All(&list); err != nil {
		return list, FailError(E201000, err)
	}
	return list, nil
}

// 查找父级包含的子列表
func CategoryGetListParentid(dto *CategoryRequestDto, scopeIds ...interface{}) ([]*Category, error) {
	_, list, err := CategoryGetPagedListByParentid(dto, scopeIds...)
	return list, err
}

// 查找父级包含的子列表
func CategoryGetPagedListByParentid(dto *CategoryRequestDto, scopeIds ...interface{}) (int64, []*Category, error) {
	offset := dto.PageIndex * dto.PageSize
	list := make([]*Category, 0)

	query := orm.NewOrm().QueryTable(CategoryTableName()).
		Exclude("is_del", 1).Filter("kind", dto.Kind)
	query = AppendFilter(query, scopeIds...)
	// if len(filters) > 0 {
	// 	l := len(filters)
	// 	for k := 0; k < l; k += 2 {
	// 		query = query.Filter(filters[k].(string), filters[k+1])
	// 	}
	// }
	if len(dto.Name) > 0 {
		query = query.Filter("name__contains", dto.Name)
	}
	if dto.Parentid == 0 {
		if !dto.FetchChild {
			query = query.Filter("parentid", dto.Parentid)
		}
		total, _ := query.Count()
		_, err := query.OrderBy("order").Limit(dto.PageSize, offset).All(&list)
		return total, list, err
	}
	if dto.FetchChild {
		var info Category
		_ = query.Filter("id", dto.Parentid).One(&info, "fid")
		if len(info.Fid) == 0 {
			return 0, list, nil
		}
		query = query.Filter("fid__startswith", info.Fid+",")
		total, _ := query.Count()
		_, err := query.OrderBy("order").Limit(dto.PageSize, offset).All(&list)
		return total, list, err
	}
	query = query.Filter("parentid", dto.Parentid)
	total, _ := query.Count()
	_, err := query.OrderBy("order").Limit(dto.PageSize, offset).All(&list)
	return total, list, err
}

// 增加节点
func CategoryAdd(appid, tid, uid uint, data *Category) (int64, error) {
	data.Appid = appid
	data.Tid = tid
	data.Uid = uid
	data.CreateTime.Time = time.Now()
	data.UpdateTime = data.CreateTime
	err := IsValidCategory(data)
	if err != nil {
		return 0, err
	}
	err = CategoryValidAdd(data)
	if err != nil {
		return 0, err
	}

	o := orm.NewOrm()
	err = o.Begin()
	if data.Parentid == 0 {
		data.Level = 1
		data.Fname = "/" + data.Name
		id, err := o.Insert(data)
		if err != nil {
			err = o.Rollback()
			fmt.Println(err)
			return 0, FailError(E201000, nil)
		}
		data.Id = id
		data.Fid = strconv.FormatInt(id, 10)
		_, err = o.Update(data, "fid")
		if err != nil {
			o.Rollback()
			fmt.Println(err)
			return 0, FailError(E201000, nil)
		}
	} else {
		var parent Category
		err = o.QueryTable(CategoryTableName()).
			Filter("id", data.Parentid).
			Filter("tid", data.Tid).Filter("appid", data.Appid).
			One(&parent, "id", "fname", "level", "fid")
		if err == orm.ErrNoRows {
			// 没有找到记录
			return 0, FailError(E201002, err)
		}
		data.Level = parent.Level + 1
		data.Fname = parent.Fname + "/" + data.Name
		id, err := o.Insert(data)
		if err != nil {
			o.Rollback()
			return 0, FailError(E201000, nil)
		}
		data.Id = id
		idStr := strconv.FormatInt(id, 10)
		if len(parent.Fid) > 0 {
			data.Fid = parent.Fid + "," + idStr
		} else {
			data.Fid = idStr
		}
		_, err = o.Update(data, "fid")
		if err != nil {
			o.Rollback()
			return 0, FailError(E201000, nil)
		}

	}
	err = o.Commit()
	return data.Id, nil

}

// 排序
func CategorySort(allList []*Category, curList *[]*Category, parentId int64) {
	for _, val := range allList {
		if val.Parentid == parentId {
			if parentId == 0 {
				val.NodeOpened = true
			}
			*curList = append(*curList, val)
			CategorySort(allList, curList, val.Id)
		}
	}
}

// 排序
func CategoryLoadCoverUrl(list []*Category) {
	for _, val := range list {
		if val.CoverId > 0 {
			val.CoverUrl, _ = AttfileGetPathById(val.CoverId)
		}
	}
}

//增加数据逻辑检查
func CategoryValidAdd(data *Category) error {
	if data.Id > 0 && data.Id == data.Parentid {
		return FailError(E201008, nil)
	}
	if data.Parentid != 0 {

		// 父节点是否存在
		_, err := CategoryGetById(data.Parentid)
		if err != nil {
			return FailError(E201002, err)
		}

	}
	//同级是否唯一
	query := orm.NewOrm().QueryTable(CategoryTableName()).
		Exclude("is_del", 1).
		Filter("appid", data.Appid).Filter("tid", data.Tid).Filter("uid", data.Uid).
		Filter("Kind", data.Kind)
	nameExistQs := query.Filter("Parentid", data.Parentid).Filter("Name", data.Name).Exist()
	if nameExistQs {
		return FailError(E201009, nil)
	}
	if len(data.Key) > 0 {
		keyExistQs := query.Filter("key", data.Key).Exist()
		if keyExistQs {
			return FailError(E201010, nil)
		}
	}
	return nil
}

//符合规范检查
func IsValidCategory(data *Category) error {
	result := validation.Validation{}
	isValid, err := result.Valid(data)
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
func CategoryValidUpdate(data *Category) error {
	if data.Id > 0 && data.Id == data.Parentid {
		return FailError(E201008, nil)
	}
	if data.Parentid != 0 {
		// 父节点是否存在
		dt, err := CategoryGetById(data.Parentid)
		if err != nil {
			return FailError(E201002, err)
		}
		//循环
		str := strconv.FormatInt(data.Id, 10)
		if strings.Contains(dt.Fid, str) {
			return FailError(E201002, err)
		}
	}
	//同级是否唯一
	query := orm.NewOrm().QueryTable(CategoryTableName()).
		Exclude("id", data.Id).
		Filter("is_del", 0).Filter("appid", data.Appid).
		Filter("tid", data.Tid).Filter("uid", data.Uid).Filter("Kind", data.Kind)
	nameExistQs := query.Filter("Parentid", data.Parentid).Filter("Name", data.Name).Exist()
	if nameExistQs {
		return FailError(E201009, nil)
	}
	if len(data.Key) > 0 {
		keyExistQs := query.Filter("key", data.Key).Exist()
		if keyExistQs {
			return FailError(E201010, nil)
		}
	}

	return nil
}

//节点数据更新
func CategoryUpdate(data *Category) error {

	err := IsValidCategory(data)
	if err != nil {
		return err
	}

	err = CategoryValidUpdate(data)
	if err != nil {
		return err
	}
	//更新前数据
	dt, err := CategoryGetById(data.Id)
	if err != nil {
		return err
	}
	data.Appid = dt.Appid
	data.Tid = dt.Tid
	data.Uid = dt.Uid
	data.UpdateTime.Time = time.Now()
	parent := new(Category)
	if data.Parentid > 0 {
		parentnode, err := CategoryGetById(data.Parentid)
		if err != nil {
			return FailError(E201002, err)
		}
		parent = &parentnode
	}

	if dt.Parentid != data.Parentid {

		str := strconv.FormatInt(data.Id, 10)
		data.Fid = parent.Fid + "," + str
		data.Fname = parent.Fname + "/" + data.Name

		data.Level = parent.Level + 1

	} else {
		if data.Parentid == 0 {
			data.Level = 1
			data.Fid = strconv.FormatInt(data.Id, 10)
			data.Fname = "/" + data.Name
		} else {
			data.Fid = parent.Fid + "," + strconv.FormatInt(data.Id, 10)
			data.Level = parent.Level + 1
			data.Fname = parent.Fname + "/" + data.Name
		}

	}
	Level := data.Level - dt.Level
	o := orm.NewOrm()
	err = o.Begin()
	_, err = o.Update(data, CategoryUpdateFields...)

	if err != nil {
		o.Rollback()
		return FailError(E201000, err)
	}
	//节点下级父节点更新

	// if dt.Code != data.Code {
	sql := "Update " + CategoryTableName() + " set fid=replace(fid,'" + dt.Fid +
		"','" + data.Fid + "'),fname=replace(fname,'" + dt.Fname + "','" + data.Fname + "'),level=level+" + strconv.Itoa(int(Level)) +
		"  where appid = ? and tid = ? and uid = ? and id != ? and fid like ?"
	// o.QueryTable(CategoryTableName()).Filter("parent_id", dt.Parentid)
	// .Update(orm.Params{"type": data.Code})
	cn, err := o.Raw(sql, dt.Appid, dt.Tid, dt.Uid, dt.Id, dt.Fid+"%").Exec()
	if err != nil {
		o.Rollback()
		return FailError(E201000, err)
	}
	// }
	fmt.Println(cn)
	err = o.Commit()
	return nil
}

//更新值，表单设计器需要使用
func CategoryUpdateValue(id int64, value string, scopeIds ...interface{}) error {
	qs := orm.NewOrm().QueryTable(CategoryTableName()).Filter("id", id).Filter("is_del", 0)
	qs = AppendFilter(qs, scopeIds...)
	_, err := qs.Update(orm.Params{
		"value": value})
	return err
}

//软删除（逻辑删除）当前节点
func CategorySoftDelete(id int64, childCascadeDelete bool, scopeIds ...interface{}) error {
	ids := make([]interface{}, 0)
	ids = append(ids, id)
	return CategorySoftDeleteBy(ids, childCascadeDelete, scopeIds...)
}

//软删除（逻辑删除）当前节点
func CategorySoftDeleteBy(ids []interface{}, childCascadeDelete bool, scopeIds ...interface{}) error {
	if len(ids) == 0 {
		return FailError(E201007, nil)
	}
	var list []*Category
	qs := orm.NewOrm().QueryTable(CategoryTableName())
	qs = AppendFilter(qs, scopeIds...)

	if !childCascadeDelete {
		exist := qs.Filter("Parentid__in", ids...).Exist()
		if exist {
			return FailError(E201007, nil)
		}
	}
	fids := make([]string, len(ids))
	qs.Filter("Id__in", ids...).Limit(10000000, 0).All(&list, "Id", "Fid")
	for _, item := range list {
		fids = append(fids, item.Fid)
	}
	o := orm.NewOrm()
	o.Begin()
	for _, fid := range fids {
		if _, err := o.QueryTable(CategoryTableName()).Filter("fid__startswith", fid+",").Update(orm.Params{"is_del": 1}); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	for _, id := range ids {
		if _, err := o.QueryTable(CategoryTableName()).Filter("id", id).Update(orm.Params{"is_del": 1}); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	o.Commit()
	return nil
}

//软删除（逻辑删除）当前节点
func CategoryDelete(id int64, childCascadeDelete bool, scopeIds ...interface{}) error {
	ids := make([]interface{}, 0)
	ids = append(ids, id)
	return CategoryDeleteBy(ids, childCascadeDelete, scopeIds...)
}

//删除当前节点
func CategoryDeleteBy(ids []interface{}, childCascadeDelete bool, scopeIds ...interface{}) error {
	if len(ids) == 0 {
		return FailError(E201007, nil)
	}
	var list []*Category
	qs := orm.NewOrm().QueryTable(CategoryTableName())
	qs = AppendFilter(qs, scopeIds...)

	if !childCascadeDelete {
		exist := qs.Filter("Parentid__in", ids...).Exist()
		if exist {
			return FailError(E201007, nil)
		}
	}
	fids := make([]string, len(ids))
	qs.Filter("Id__in", ids...).Limit(10000000, 0).All(&list, "Id", "Fid")
	for _, item := range list {
		fids = append(fids, item.Fid)
	}
	o := orm.NewOrm()
	o.Begin()
	for _, fid := range fids {
		if _, err := o.QueryTable(CategoryTableName()).Filter("fid__startswith", fid+",").Delete(); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	for _, id := range ids {
		if _, err := o.QueryTable(CategoryTableName()).Filter("id", id).Delete(); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	o.Commit()
	return nil
}

// 转换为tree结构
func CategoryList2Tree(parentid int64, list []*Category) []*Category {
	res := make([]*Category, 0)
	for _, val := range list {
		if val.Parentid == parentid {
			categoryLoadTreeChildren(val, list)
			res = append(res, val)
		}
	}
	return res
}

// 加载子节点
func categoryLoadTreeChildren(parent *Category, list []*Category) {
	children := make([]*Category, 0)
	for _, val := range list {
		if val.Parentid == parent.Id {
			categoryLoadTreeChildren(val, list)
			children = append(children, val)
		}
	}
	parent.Children = children
}
func (a *Category) TableName() string {
	return TableName("common_category")
}

func CategoryTableName() string {
	return TableName("common_category")
}
