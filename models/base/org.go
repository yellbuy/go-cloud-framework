/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-16 15:42:43
** @Last Modified by:   
** @Last Modified time: 2017-09-17 11:48:17
***********************************************/
package base

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
	. "yellbuy.com/YbGoCloundFramework/libs"
)

type Org struct {
	Id       int64
	Name     string `valid:"Required;MaxSize(32)"`
	Parentid int64
	Fid      string `valid:"MaxSize(256)"`
	Fname    string `valid:"MaxSize(512)"`
	Code     string `valid:"Required;MaxSize(36)"`
	LongName string `valid:"MaxSize(64)"`
	Kind     int
	Type     int
	Order    int64
	// Enable uint8
	IsHide           uint8
	IsVirtual        uint8
	Level            uint8
	Extattr          string
	ChildrenIds      string
	Children         []*Org `orm:"-";`
	Selected         string `orm:"-";`
	Tel              string `valid:"MaxSize(32)"`
	Url              string `valid:"MaxSize(255)"`
	Postcode         string `valid:"MaxSize(16)"`
	Principal        string `valid:"MaxSize(255)"`
	Country          string `valid:"MaxSize(16)"`
	Province         string `valid:"MaxSize(16)"`
	City             string `valid:"MaxSize(16)"`
	District         string `valid:"MaxSize(16)"`
	Street           string `valid:"MaxSize(16)"`
	Streetnumber     string `valid:"MaxSize(16)"`
	Address          string `valid:"MaxSize(64)"`
	Addrcode         string `valid:"MaxSize(8)"`
	Lng              float32
	Lat              float32
	GeoHash          string `MaxSize(16)"`
	Balance          float32
	Score            int
	Rank             int
	UpdatedTime      time.Time
	Desc             string
	SourceIdentifier string `valid:"MaxSize(36)"`
	Tid              uint
	Appid            uint
}

func (a *Org) TableName() string {
	return TableName("base_org")
}
func OrgTableName() string {
	return TableName("base_org")
}

// 数据验证
func OrgValid(a *Org) error {
	//验证编码是否为空
	a.Code = strings.TrimSpace(a.Code)
	if len(a.Code) == 0 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Code, "")-1 > 32 {
		return FailError(E201004, nil)
	}
	// 验证姓名
	a.Name = strings.TrimSpace(a.Name)
	if len(a.Name) == 0 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Name, "")-1 > 32 {
		return FailError(E201004, nil)
	}
	if strings.Contains(a.Name, "/") {
		return FailError(E201006, nil)
	}
	if a.Parentid > 0 && a.Id == a.Parentid {
		return FailError(E201008, nil)
	}
	if strings.Count(a.LongName, "")-1 > 64 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Tel, "")-1 > 32 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Url, "")-1 > 255 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Postcode, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Principal, "")-1 > 255 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Country, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Province, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.City, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.District, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Street, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Streetnumber, "")-1 > 16 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Address, "")-1 > 64 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.Addrcode, "")-1 > 8 {
		return FailError(E201004, nil)
	}
	if strings.Count(a.SourceIdentifier, "")-1 > 36 {
		return FailError(E201004, nil)
	}
	o := orm.NewOrm()
	query := o.QueryTable(OrgTableName()).
		Exclude("id", a.Id).
		Filter("appid", a.Appid).
		Filter("tid", a.Tid).
		Filter("parentid", a.Parentid).
		Filter("name", a.Name)
	cnt, err := query.Count()
	if err != nil {
		return FailError(E201000, nil)
	}
	if cnt > 0 {
		return FailError(E201009, nil)
	}

	query = o.QueryTable(OrgTableName()).
		Exclude("id", a.Id).
		Filter("appid", a.Appid).
		Filter("tid", a.Tid).
		Filter("code", a.Code)
	cnt, err = query.Count()
	if err != nil {
		return FailError(E201000, nil)
	}
	if cnt > 0 {
		return FailError(E201005, nil)
	}
	if a.Parentid == 0 {
		cnt, err := o.QueryTable(OrgTableName()).
			Exclude("id", a.Id).
			Filter("appid", a.Appid).
			Filter("tid", a.Tid).
			Filter("parentid", 0).
			Count()
		if err != nil {
			return FailError(E201000, nil)
		}
		if cnt > 0 {
			return FailError(E201003, nil)
		}
	}
	return nil
}

// 创建组织
func OrgAdd(data *Org) (int64, error) {
	// 参数验证
	validErr := OrgValid(data)
	if validErr != nil {
		return 0, validErr
	}
	o := orm.NewOrm()
	if data.Parentid == 0 {
		data.Level = 1
		o.Begin()
		data.Fname = "/" + data.Name
		if id, err := o.Insert(data); err != nil {
			err = o.Rollback()
			return 0, FailError(E201000, nil)
		} else {
			// 更新fid字段
			data.Id = id
			data.Fid = strconv.FormatInt(id, 10)
		}

		if _, err := o.Update(data, "fid"); err != nil {
			err = o.Rollback()
			return 0, FailError(E201000, nil)
		}
		o.Commit()
		return data.Id, nil
	} else {
		var parent Org
		err := o.QueryTable(OrgTableName()).
			Filter("id", data.Parentid).
			Filter("appid", data.Appid).
			Filter("tid", data.Tid).
			One(&parent, "id", "name", "level", "fname", "fid", "children_ids")
		if err == orm.ErrNoRows {
			// 没有找到记录
			return 0, FailError(E201002, err)
		}
		fmt.Println("parent:", parent)
		data.Level = parent.Level + 1
		data.Fname = parent.Fname + "/" + data.Name
		err = o.Begin()
		id, err := o.Insert(data)
		if err != nil {
			err = o.Rollback()
			return 0, FailError(E201002, nil)
		}
		data.Id = id
		idStr := strconv.FormatInt(id, 10)
		if len(parent.Fid) > 0 {
			data.Fid = parent.Fid + "," + idStr
		} else {
			data.Fid = idStr
		}
		if len(parent.ChildrenIds) > 0 {
			parent.ChildrenIds = parent.ChildrenIds + "," + idStr
		} else {
			parent.ChildrenIds = idStr
		}

		fmt.Println("parent:", &parent)
		if _, err := o.Update(&parent, "ChildrenIds"); err != nil {
			err = o.Rollback()
			return 0, FailError(E201000, nil)
		}
		fmt.Println("data:", data)
		if _, err := o.Update(data, "Fid"); err != nil {
			err = o.Rollback()
			return 0, FailError(E201000, nil)
		}
		err = o.Commit()
		return id, nil
	}
}

func OrgUpdate(data *Org) (int64, error) {
	// 参数验证
	err := OrgValid(data)
	if err != nil {
		return 0, err
	}
	var oriOrg Org
	o := orm.NewOrm()
	err = o.QueryTable(OrgTableName()).
		Filter("appid__exact", data.Appid).
		Filter("tid__exact", data.Tid).
		Filter("id__exact", data.Id).
		One(&oriOrg, "Id", "Parentid", "Fid", "Fname")

	if err == orm.ErrNoRows {
		return 0, FailError(E201001, nil)
	}
	idStr := strconv.FormatInt(data.Id, 10)
	var parentOrg Org
	if data.Parentid == 0 {
		//更新节点相关信息
		data.Level = 1
		data.Fid = idStr
		data.Fname = "/" + data.Name
	} else {
		err := o.QueryTable(OrgTableName()).
			Filter("appid__exact", data.Appid).
			Filter("tid__exact", data.Tid).
			Filter("id__exact", data.Parentid).
			One(&parentOrg, "Id", "Parentid", "Fid", "Fname", "Level", "ChildrenIds")
		if err == orm.ErrNoRows {
			return 0, FailError(E201002, nil)
		}
		// 更新节点相关信息
		data.Level = parentOrg.Level + 1
		data.Fid = parentOrg.Fid + "," + idStr
		data.Fname = parentOrg.Fname + "/" + data.Fname
	}
	err = o.Begin()

	num, err := o.Update(data)
	if err != nil {
		err = o.Rollback()
		return 0, FailError(E201000, nil)
	}
	// 计算层级差
	level := data.Level - oriOrg.Level
	if level >= 0 {
		o.Raw("UPDATE base_org SET fid = replace('fid','?','?'), fname = replace('fname','?','?'),level = level + ? WHERE fid like ?",
			oriOrg.Fid+",", data.Fid+",", oriOrg.Fname, data.Fname+"/", level, oriOrg.Fid)
	} else {
		o.Raw("UPDATE base_org SET fid = replace('fid','?','?'), fname = replace('fname','?','?'), level = level - ? WHERE fid like ?",
			oriOrg.Fid+",", data.Fid+",", oriOrg.Fname, data.Fname+"/", level, oriOrg.Fid)
	}

	if oriOrg.Parentid != data.Parentid {
		// 从原父节点中移除本节点
		if oriOrg.Parentid > 0 {
			var lists orm.ParamsList
			num, err := o.QueryTable(OrgTableName()).
				Exclude("id", data.Id).
				Filter("appid", data.Tid).
				Filter("parentid", oriOrg.Parentid).
				ValuesFlat(&lists, "id")
			if err != nil {
				if num == 0 {
					parentOrg = Org{Id: oriOrg.Parentid, ChildrenIds: ""}
				} else {
					ids := JoinForInterface(",", lists...)
					parentOrg = Org{Id: oriOrg.Parentid, ChildrenIds: ids}
				}
				o.Update(parentOrg, "ChildrenIds")
			}
		}
		// 新父节点增加本节点
		if data.Parentid > 0 {
			var lists orm.ParamsList
			_, err := o.QueryTable(OrgTableName()).
				Exclude("id", data.Id).
				Filter("appid", data.Appid).
				Filter("tid", data.Tid).
				Filter("parentid", data.Parentid).
				ValuesFlat(&lists, "id")
			if err != nil {
				lists = append(lists, strconv.FormatInt(data.Id, 10))
				ids := JoinForInterface(",", lists...)
				parentOrg = Org{Id: data.Parentid, ChildrenIds: ids}
				o.Update(parentOrg, "ChildrenIds")
			}
		}
	}

	o.Commit()
	return num, nil
}

func OrgDelete(appid uint, tid uint, ids ...int64) (uint64, error) {
	idsLen := len(ids)
	if idsLen == 0 {
		return 0, FailError(E201004, nil)
	}
	if idsLen > 1000 {
		return 0, FailError(E201004, nil)
	}
	o := orm.NewOrm()
	// 查找下级节点数
	num, err := o.QueryTable(OrgTableName()).
		Filter("parentid__in", ids).
		Filter("appid", appid).
		Filter("tid", tid).
		Count()
	if num > 0 {
		return 0, FailError(E201007, nil)
	}

	var pids orm.ParamsList
	num, err = o.QueryTable(OrgTableName()).
		Filter("id__in", ids).
		Filter("appid", appid).
		Filter("tid", tid).
		ValuesFlat(&pids, "parentid")

	err = o.Begin()

	num, err = o.QueryTable(OrgTableName()).
		Filter("id__in", ids).
		Filter("appid__exact", appid).
		Filter("tid__exact", tid).
		Delete()
	if err != nil {
		err = o.Rollback()
		return 0, FailError(E201000, nil)
	}
	// 删除人员成员
	if _, err := o.QueryTable(UserOrgTableName()).
		Filter("org_id__in", ids).
		Delete(); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	}
	for _, v := range pids {
		// 父节点移除本节点
		pid := v.(int64)
		if pid > 0 {
			var lists orm.ParamsList
			if num, err := o.QueryTable(OrgTableName()).
				Filter("appid", appid).
				Filter("tid", tid).
				Filter("parentid", pid).
				ValuesFlat(&lists, "id"); err == nil {
				var parentOrg Org
				if num == 0 {
					parentOrg = Org{Id: pid, ChildrenIds: ""}
				} else {
					ids := JoinForInterface(",", lists...)
					parentOrg = Org{Id: pid, ChildrenIds: ids}
				}
				o.Update(&parentOrg, "ChildrenIds")
			}
		}
	}
	err = o.Commit()
	return 0, nil
}

// 排序
func OrgSort(allList []*Org, curList *[]*Org, parentId int64) {
	for _, val := range allList {
		if val.Parentid == parentId {
			*curList = append(*curList, val)
			OrgSort(allList, curList, val.Id)
		}
	}
}

func OrgGetById(appid uint, tid uint, id int64) (*Org, error) {
	if id == 0 {
		return OrgGetRoot(appid, tid)
	}
	var org Org
	err := orm.NewOrm().QueryTable(OrgTableName()).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		One(&org)
	if err != nil {
		return nil, err
	}
	return &org, nil
}

func OrgGetByCode(appid uint, tid uint, code string) (*Org, error) {
	var org Org
	err := orm.NewOrm().QueryTable(OrgTableName()).
		Filter("code__exact", code).
		Filter("appid__exact", appid).
		Filter("tid__exact", tid).
		One(&org)
	if err != nil {
		return nil, err
	}
	return &org, nil
}

func OrgGetRoot(appid uint, tid uint) (*Org, error) {
	var org Org
	err := orm.NewOrm().QueryTable(OrgTableName()).
		Filter("parentid", 0).
		Filter("appid", appid).
		Filter("tid", tid).
		One(&org)
	if err != nil && err != orm.ErrNoRows {
		return nil, err
	}
	return &org, nil
}

func OrgLoadByIds(appid uint, tid uint, ids ...uint64) ([]*Org, error) {

	idsLen := len(ids)
	if idsLen == 0 {
		return nil, FailError(E201004, nil)
	}
	if idsLen > 1000 {
		return nil, FailError(E201004, nil)
	}
	list := make([]*Org, 0)
	_, err := orm.NewOrm().
		QueryTable(OrgTableName()).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id__in", ids).
		OrderBy("order").
		All(&list)
	if err != nil {
		return nil, FailError(E201000, nil)
	}
	return list, nil
}

func OrgExistIds(appid, tid uint, ids ...int64) (bool, error) {
	idsLen := len(ids)
	if idsLen == 0 {
		return false, FailError(E201004, nil)
	}
	cnt, err := orm.NewOrm().
		QueryTable(OrgTableName()).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id__in", ids).Count()
	if err != nil {
		return false, FailError(E201000, nil)
	}
	return int(cnt) == idsLen, nil
}

func OrgList(appid, tid uint, filters ...interface{}) []*Org {
	list := make([]*Org, 0)
	query := orm.NewOrm().QueryTable(OrgTableName())
	if len(filters) > 0 {
		l := len(filters)
		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	query = query.Filter("appid", appid).Filter("tid", tid)
	query.OrderBy("order").Limit(AllowMaxQueryCount).All(&list)
	fmt.Println("list:", list)
	return list
}

// 获取目录树结构
func OrgChildList(appid, tid uint, id int64, containSelf bool, fetchChild bool) []int64 {
	query := orm.NewOrm().QueryTable(OrgTableName())
	query = query.Filter("appid", appid).
		Filter("tid", tid)
	if fetchChild {
		query = query.Filter("fid__contains", id)
		query = query.Exclude("id", id)
	} else {
		query = query.Filter("parentid", id)
	}
	var list orm.ParamsList
	query.OrderBy("order").Limit(AllowMaxQueryCount).ValuesFlat(&list, "id")
	if len(list) == 0 {
		return nil
	}
	data := Interface2IntArr(list...)
	if containSelf {
		data = append([]int64{id}, data...)
	}

	return data
}

// 获取目录树结构
func OrgTree(appid, tid uint, parentid int64, userOrgIds []int64) *Org {
	list := make([]*Org, 0)
	query := orm.NewOrm().QueryTable(OrgTableName())
	query = query.Filter("appid", appid).Filter("tid", tid)
	if parentid > 0 {
		query = query.Filter("fid__contains", parentid)
	}
	query.Limit(AllowMaxQueryCount).All(&list, "id", "name", "parentid", "fid")
	if len(list) == 0 {
		return nil
	}
	var tree *Org
	if parentid == 0 {
		for _, v := range list {
			if v.Parentid == 0 {
				tree = v
				break
			}
		}
	} else {
		for _, v := range list {
			if v.Id == parentid {
				tree = v
				break
			}
		}
	}

	if tree != nil {
		if Int64InArray(userOrgIds, tree.Id) {
			tree.Selected = "Selected"
		}
		fillChildren(tree, list, userOrgIds)
	}
	return tree
}

// 递归填充子节点
func fillChildren(node *Org, list []*Org, userOrgIds []int64) {
	for _, v := range list {
		if v.Parentid == node.Id {
			if node.Children == nil {
				node.Children = make([]*Org, 0)
			}
			fillChildren(v, list, userOrgIds)
			node.Children = append(node.Children, v)
			if Int64InArray(userOrgIds, v.Id) {
				v.Selected = "Selected"
			}
		}
	}
}

// 创建组织
func OrgCount(appid, tid uint, pid int64) (int64, error) {
	query := orm.NewOrm().QueryTable(OrgTableName())
	query = query.Filter("appid", appid).Filter("tid", tid).Filter("parentid", pid)
	cont, err := query.OrderBy("order").Count()
	if err != nil {
		return 0, FailError(E201000, err)
	}
	return cont, nil
}
