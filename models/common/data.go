package common

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/astaxie/beego/orm"
	. "yellbuy.com/YbCloudDataApi/libs"
)

type CommonData struct {
	Id         int64
	Parentid   int64
	Fid        string `valid:"MaxSize(4000)"`
	Type       string `Required;valid:"MaxSize(255)"`
	Name       string `Required;valid:"MaxSize(255)"`
	Fname      string `valid:"MaxSize(4000)"`
	Code       string `Required;valid:"MaxSize(255)"`
	Value      string
	Desc       string
	Pinyin     string
	Level      int8
	Status     int8
	Predefined uint8
	IsDel      int8
	Order      int64
	Ext        string
	Uid        uint
	Tid        uint
	Appid      uint
	NodeOpened bool                     `orm:"-" json:"lay_is_open"`
	ParentName string                   `orm:"-"`
	ValueData  []map[string]interface{} `orm:"-" json:"ValueData"`
	Children   []*CommonData            `orm:"-" json:"Children"`
}

// 节点数据 Code
func CommonDataGetByCode(appid, tid uint, tp string, code string) (CommonData, error) {
	var model CommonData
	if err := orm.NewOrm().
		QueryTable(TableName("common_data")).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("type", tp).
		Filter("is_del", 0).
		Filter("code", code).One(&model); err == orm.ErrNoRows {
		return model, FailError(E201000, err)
	}
	return model, nil
}

// 节点数据 Id
func CommonDataGetById(appid uint, tid uint, id int64) (CommonData, error) {
	// data.Parentid,data.Tid,data.Appid
	var model CommonData
	if err := orm.NewOrm().QueryTable(TableName("common_data")).
		Filter("tid", tid).Filter("appid", appid).
		Filter("id", id).Filter("is_del", 0).One(&model); err == orm.ErrNoRows {
		return model, FailError(E201000, err)
	}
	return model, nil
}

// 根据类型获取分页数据
func CommonDataGetMapByType(appid uint, tid uint, tp string, containDisabled bool) (map[int64]*CommonData, error) {
	res := make(map[int64]*CommonData)
	list, err := CommonDataGetListByType(appid, tid, tp, containDisabled)
	if err != nil {
		return res, err
	}
	for _, val := range list {
		res[val.Id] = val
	}
	return res, nil
}

// 根据类型获取所有数据
func CommonDataGetListByType(appid uint, tid uint, tp string, containDisabled bool) ([]*CommonData, error) {
	_, list, err := CommonDataGetPagedListByType(appid, tid, tp, containDisabled, 0, 1000000000)
	return list, err
}

// 根据类型获取所有数据
func CommonDataLoadListByType(appid uint, tid uint, tp string, containDisabled bool, ids string) ([]*CommonData, error) {
	list := make([]*CommonData, 0)
	if len(ids) == 0 {
		return list, nil
	}
	qs := orm.NewOrm().QueryTable(CommonDataTableName()).
		Filter("appid", appid).Filter("tid", tid).Filter("type", tp).Filter("is_del", 0)
	qs = qs.Filter("id__in", strings.Split(ids, ","))
	if !containDisabled {
		qs = qs.Filter("status", 1)
	}

	if _, err := qs.OrderBy("order").Limit(100000000).All(&list); err != nil {
		return list, FailError(E201000, err)
	}
	return list, nil
}

// 根据类型获取分页数据
func CommonDataGetPagedListByType(appid uint, tid uint, tp string, containDisabled bool, pageindex, pagesize uint32) (int64, []*CommonData, error) {
	list := make([]*CommonData, 0)
	qs := orm.NewOrm().QueryTable(CommonDataTableName()).
		Filter("appid", appid).Filter("tid", tid).Filter("type", tp).Filter("is_del", 0)
	if !containDisabled {
		qs = qs.Filter("status", 1)
	}
	offset := pageindex * pagesize
	total, _ := qs.Count()
	if _, err := qs.OrderBy("order").Limit(pagesize, offset).All(&list); err != nil {
		return total, list, FailError(E201000, err)
	}
	return total, list, nil
}

// 查找父级包含的子列表
func CommonDataGetListByParentid(appid, tid, uid uint, tp string, parentid int64,
	fetchChild bool, filters ...interface{}) []*CommonData {
	_, list := CommonDataGetPagedListByParentid(appid, tid, uid, tp, parentid, 0, 1000000000, fetchChild, filters)
	return list
}

// 查找父级包含的子列表
func CommonDataGetPagedListByParentid(appid, tid, uid uint, tp string, parentid int64, pageIndex, pageSize uint32,
	fetchChild bool, filters ...interface{}) (int64, []*CommonData) {
	offset := pageIndex * pageSize
	list := make([]*CommonData, 0)

	query := orm.NewOrm().QueryTable(CommonDataTableName()).
		Exclude("is_del", 1).
		Filter("appid", appid).Filter("tid", tid).Filter("Type", tp)
	if len(filters) > 0 {
		l := len(filters)
		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	// 是否用户过滤
	if uid > 0 {
		query = query.Filter("uid", uid)
	}
	if parentid == 0 {
		if !fetchChild {
			query = query.Filter("parentid", parentid)
		}
		total, _ := query.Count()
		query.OrderBy("order").Limit(pageSize, offset).All(&list)
		return total, list
	}
	if fetchChild {
		var info CommonData
		_ = query.Filter("id", parentid).One(&info, "fid")
		if len(info.Fid) == 0 {
			return 0, list
		}
		query = query.Filter("fid__startswith", info.Fid+",")
		total, _ := query.Count()
		query.OrderBy("order").Limit(pageSize, offset).All(&list)
		return total, list
	}
	query = query.Filter("parentid", parentid)
	total, _ := query.Count()
	query.OrderBy("order").Limit(pageSize, offset).All(&list)
	return total, list
}

// 增加节点
func CommonDataAdd(data *CommonData) (int64, error) {
	err := IsValid(data)
	if err != nil {
		return 0, err
	}
	err = ValidDataAdd(data)
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
			return 0, FailError(E201000, nil)
		}
		data.Id = id
		data.Fid = strconv.FormatInt(id, 10)
		_, err = o.Update(data, "fid")
		if err != nil {
			o.Rollback()
			return 0, FailError(E201000, nil)
		}
	} else {
		var parent CommonData
		err = o.QueryTable(TableName("common_data")).
			Filter("id", data.Parentid).
			Filter("tid", data.Tid).Filter("uid", data.Uid).Filter("appid", data.Appid).
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

//增加数据逻辑检查
func ValidDataAdd(data *CommonData) error {
	if data.Id > 0 && data.Id == data.Parentid {
		return FailError(E201008, nil)
	}
	if data.Parentid != 0 {

		// 父节点是否存在
		_, err := CommonDataGetById(data.Appid, data.Tid, data.Parentid)
		if err != nil {
			return FailError(E201002, err)
		}

	}
	//同级是否唯一
	query := orm.NewOrm().QueryTable(CommonDataTableName()).
		Exclude("is_del", 1).
		Filter("appid", data.Appid).Filter("tid", data.Tid).
		Filter("Type", data.Type)
	nameExistQs := query.Filter("Parentid", data.Parentid).Filter("Name", data.Name).Exist()
	if nameExistQs {
		return FailError(E201005, nil)
	}
	codeExistQs := query.Filter("Code", data.Code).Exist()
	if codeExistQs {
		return FailError(E201005, nil)
	}
	return nil
}

//符合规范检查
func IsValid(data *CommonData) error {
	// var err error

	// if len(data.Type) > 255 {
	// 	return FailError(E202011, err)
	// }
	// // strings.ToLower()
	// data.Type = strings.TrimSpace(data.Type)
	// if data.Type == "" {
	// 	return FailError(E201010, err)
	// }

	// if len(data.Code) > 255 {
	// 	return FailError(E201011, err)
	// }
	// data.Code = strings.TrimSpace(data.Code)
	// if data.Code == "" {
	// 	return FailError(E201010, err)
	// }
	// if len(data.Name) >= 255 {
	// 	return FailError(E201011, err)
	// }
	// data.Name = strings.TrimSpace(data.Name)
	// if data.Name == "" {
	// 	return FailError(E201010, err)
	// }

	// if len(data.Fname) >= 255 {
	// 	return FailError(E201011, err)
	// }
	// if len(data.Fid) >= 4000 {
	// 	return FailError(E201011, err)
	// }
	// if data.Type == data.Code {
	// 	return FailError(E201008, err)
	// }
	return nil
}
func ValidDataUpdate(data *CommonData) error {
	if data.Id > 0 && data.Id == data.Parentid {
		return FailError(E201008, nil)
	}
	if data.Parentid != 0 {
		// 父节点是否存在
		dt, err := CommonDataGetById(data.Appid, data.Tid, data.Parentid)
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
	query := orm.NewOrm().QueryTable(CommonDataTableName()).
		Exclude("id", data.Id).
		Filter("is_del", 0).Filter("appid", data.Appid).
		Filter("tid", data.Tid).Filter("Type", data.Type)
	nameExistQs := query.Filter("Parentid", data.Parentid).Filter("Name", data.Name).Exist()
	if nameExistQs {
		return FailError(E201005, nil)
	}
	codeExistQs := query.Filter("Code", data.Code).Exist()
	if codeExistQs {
		return FailError(E201005, nil)
	}
	return nil
}

//节点数据更新
func CommonDataUpdate(data *CommonData) error {
	err := IsValid(data)
	if err != nil {
		return err
	}

	err = ValidDataUpdate(data)
	if err != nil {
		return err
	}
	//更新前数据
	dt, err := CommonDataGetById(data.Appid, data.Tid, data.Id)
	if err != nil {
		return err
	}
	parent := new(CommonData)
	if data.Parentid > 0 {
		parentnode, err := CommonDataGetById(data.Appid, data.Tid, data.Parentid)
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
	_, err = o.Update(data)

	if err != nil {
		o.Rollback()
		return FailError(E201000, err)
	}
	//节点下级父节点更新

	// if dt.Code != data.Code {
	sql := "Update " + CommonDataTableName() + " set fid=replace(fid,'" + dt.Fid +
		"','" + data.Fid + "'),fname=replace(fname,'" + dt.Fname + "','" + data.Fname + "'),level=level+" + strconv.Itoa(int(Level)) +
		"  where appid = ? and tid = ? and id != ? and fid like ?"
	// o.QueryTable("common_data").Filter("parent_id", dt.Parentid)
	// .Update(orm.Params{"type": data.Code})
	cn, err := o.Raw(sql, dt.Appid, dt.Tid, dt.Id, dt.Fid+"%").Exec()
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
func CommonDataUpdateValue(appid, tid uint, id int64, value string) error {
	_, err := orm.NewOrm().QueryTable(TableName("common_data")).
		Filter("appid", appid).Filter("tid", tid).Filter("is_del", 0).Filter("id", id).Update(orm.Params{
		"value": value})
	return err
}

//软删除（逻辑删除）当前节点
func CommonDataSoftDelete(appid, tid uint, childCascadeDelete bool, ids ...interface{}) error {
	if len(ids) == 0 {
		return FailError(E201007, nil)
	}
	var list []*CommonData
	qs := orm.NewOrm().QueryTable("common_data").Filter("Appid", appid).Filter("Tid", tid)

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
		if _, err := o.QueryTable(CommonDataTableName()).Filter("Fid__startswith", fid+",").Update(orm.Params{"is_del": 1}); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	for _, id := range ids {
		if _, err := o.QueryTable(CommonDataTableName()).Filter("id", id).Update(orm.Params{"is_del": 1}); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	o.Commit()
	return nil
}

//删除当前节点
func CommonDataDelete(appid, tid uint, childCascadeDelete bool, ids ...interface{}) error {
	if len(ids) == 0 {
		return FailError(E201007, nil)
	}
	var list []*CommonData
	qs := orm.NewOrm().QueryTable("common_data").Filter("Appid", appid).Filter("Tid", tid)

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
		if _, err := o.QueryTable(CommonDataTableName()).Filter("fid__startswith", fid+",").Delete(); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	for _, id := range ids {
		if _, err := o.QueryTable(CommonDataTableName()).Filter("id", id).Delete(); err != nil {
			o.Rollback()
			return FailError(E201007, err)
		}
	}
	o.Commit()
	return nil
}

// 转换为tree结构
func CommonDataList2Tree(parentid int64, list []*CommonData) []*CommonData {
	res := make([]*CommonData, 0)
	for _, val := range list {
		if val.Parentid == parentid {
			commonDataLoadTreeChildren(val, list)
			res = append(res, val)
		}
	}
	return res
}

// 加载子节点
func commonDataLoadTreeChildren(parent *CommonData, list []*CommonData) {
	children := make([]*CommonData, 0)
	for _, val := range list {
		if val.Parentid == parent.Id {
			commonDataLoadTreeChildren(val, list)
			children = append(children, val)
		}
	}
	parent.Children = children
}
func (a *CommonData) TableName() string {
	return TableName("common_data")
}

func CommonDataTableName() string {
	return TableName("common_data")
}
