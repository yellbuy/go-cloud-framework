package common

import (
	//"fmt"
	//"strconv"
	//"strings"

	"errors"
	"fmt"
	"log"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	. "yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/utils"
)

type Area struct {
	Id          int
	CountryCode uint8
	Areaname    string
	Parentid    int
	Shortname   string
	AreaCode    int
	ZipCode     int
	StateCode   string
	Pinyin      string
	Lng         float32
	Lat         float32
	Level       uint8
	Position    string
	Sort        string
}
type AreaBack struct {
	Id          uint
	CountryCode uint8
	Areaname    string
	Parentid    uint
}

type AreaTree struct {
	Id       uint        `json:"id"`
	Name     string      `json:"name"`
	Pid      uint        `json:"pid"`
	Children []*AreaTree `json:"children"`
}

type AreaPicker struct {
	Label string `json:"label"`
	Value int    `json:"value"`
}

func (a *Area) TableName() string {
	return TableName("common_area")
}

func AreaTableName() string {
	return TableName("common_area")
}

const ZH_CN = uint8(86)

func GetAreaTree(parentid int, maxLevel uint) ([]map[string]interface{}, error) {
	loadCallbackFunc := func() (interface{}, error) {
		tree := make([]map[string]interface{}, 0)
		if list, err := GetAreaListByCountry(parentid, maxLevel, ZH_CN); err != nil {
			beego.Error(err)
			return nil, err
		} else {
			for index, val := range list {
				if val.Parentid == 0 {
					node := make(map[string]interface{})
					node["id"] = val.Id
					node["value"] = val.Id
					node["name"] = val.Areaname
					node["label"] = val.Areaname
					node["pid"] = val.Parentid
					// node.Children = make([]*AreaTree, 0)
					tree = append(tree, node)
					// 移除当前元素，提供性能
					list = append(list[:index], list[index+1:]...)
					arr2Tree(node, list)
				}
			}
			return tree, nil
		}
	}
	cacheKey := fmt.Sprintf(utils.CacheKeyCommonAreaTreeByPidAndMaxLevel, parentid, maxLevel)
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	tree, ok := res.([]map[string]interface{})
	if !ok {
		return nil, errors.New("区域加载失败：类型错误")
	}
	return tree, nil
}

// 递归树形结构
func arr2Tree(curNode map[string]interface{}, list []*Area) {
	for index, val := range list {
		if val.Parentid == curNode["id"] {
			node := make(map[string]interface{})
			node["id"] = val.Id
			node["value"] = val.Id
			node["name"] = val.Areaname
			node["label"] = val.Areaname
			node["pid"] = val.Parentid
			var children []map[string]interface{}
			if _, ok := curNode["children"]; ok {
				children = curNode["children"].([]map[string]interface{})

			} else {
				children = make([]map[string]interface{}, 0)
			}
			children = append(children, node)
			curNode["children"] = children
			// 移除当前元素，提供性能
			list = append(list[:index], list[index+1:]...)
			arr2Tree(node, list)
		}
	}
}
func GetAreaList(parentid int, maxLevel uint) ([]*Area, error) {
	return GetAreaListByCountry(parentid, maxLevel, ZH_CN)
}
func GetAreaGroup(parentid int, maxLevel uint) (map[string][]AreaPicker, error) {
	loadCallbackFunc := func() (interface{}, error) {
		list, err := GetAreaListByCountry(parentid, maxLevel, ZH_CN)
		if err != nil {
			return nil, err
		}
		res := make(map[string][]AreaPicker)
		for _, val := range list {
			key := fmt.Sprintf("area_%v", val.Level)
			data, ok := res[key]
			if !ok {
				data = make([]AreaPicker, 0)
			}
			data = append(data, AreaPicker{val.Areaname, val.Id})
			res[key] = data
		}
		return res, nil
	}
	cacheKey := fmt.Sprintf(utils.CacheKeyCommonAreaGroupByPidAndMaxLevel, parentid, maxLevel)
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	group, ok := res.(map[string][]AreaPicker)
	if !ok {
		return nil, errors.New("区域加载失败：类型错误")
	}
	return group, nil
}

func GetAreaById(id int) (*Area, error) {
	loadCallbackFunc := func() (interface{}, error) {
		area := new(Area)
		err := orm.NewOrm().QueryTable(AreaTableName()).
			Filter("Id", id).One(area)
		return area, err
	}
	cacheKey := fmt.Sprintf(utils.CacheKeyCommonAreaById, id)
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	area, ok := res.(*Area)
	if !ok {
		return nil, errors.New("区域加载失败：类型错误")
	}
	return area, nil
}

func GetAreaListByCountry(parentid int, maxLevel uint, countryCode uint8) ([]*Area, error) {
	codeList := make([]*Area, 0)
	qt := orm.NewOrm().QueryTable(AreaTableName()).
		Filter("CountryCode", countryCode)
	if parentid >= 0 {
		qt = qt.Filter("parentid", parentid)
	}
	if maxLevel > 0 {
		qt = qt.Filter("level__lte", maxLevel)
	}
	if _, err := qt.Limit(100000000, 0).All(&codeList, "id", "areaname", "parentid", "level"); err != nil {
		return codeList, FailError(E201000, err)
	}

	return codeList, nil
	// }
}

func AreaGetByName(parentid int, nameArr ...string) (*Area, error) {
	if len(nameArr) == 0 {
		return nil, errors.New("参数不能为空")
	}
	var area Area
	qt := orm.NewOrm().QueryTable(AreaTableName()).
		Filter("CountryCode", ZH_CN).Filter("parentid", parentid)
	// 尝试精确查询
	for _, name := range nameArr {
		if len(name) > 0 {
			err := qt.Filter("areaname", name).Limit(1).One(&area)
			if err == nil && area.Id > 0 {
				return &area, nil
			}
		}
	}
	// 精确查询失败，进行模糊查询
	for _, name := range nameArr {
		if len(name) > 0 {
			err := qt.Filter("areaname__startswith", name).Limit(1).One(&area)
			if err == nil && area.Id > 0 {
				return &area, nil
			}
		}
	}
	return nil, errors.New("区域名称不存在")
}
