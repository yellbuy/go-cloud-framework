// //commm.set
// //配置管理
package common

import (
	"encoding/xml"
	"errors"
	"fmt"
	"log"
	"os"

	// "strconv"
	"strings"

	"io/ioutil"
	// "net/url"
	// "time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"yellbuy.com/YbCloudDataApi/utils"

	"github.com/astaxie/beego/validation"
	"yellbuy.com/YbCloudDataApi/libs"
)

type Setting struct {
	// '配置ID',
	Id int64
	// 配置名称',
	Key string
	// 配置类型',0:字符，1:数字，2:文本，3:数组，4:枚举 5：密码，6：图片上传，10：富文本编辑器
	Type int8
	//'分类，0：平台，1：租户，2：用户',
	Kind uint8

	//'配置名称',
	Name string `valid:"MaxSize(255)"`
	//'配置分组',
	Group string `valid:"MaxSize(50)"`
	//'配置值',
	Extra string
	//'配置说明',
	Remark string
	//'创建时间',
	CreateTime libs.Time
	//'更新时间',
	UpdateTime libs.Time
	//'状态',
	State int8
	//'配置值',
	Value string
	//'排序',
	Order int64
	//'租户标识',
	Uid uint
	//'租户标识',
	Tid uint
	//'租户标识',
	Appid uint
	// 转换枚举供前端
	Extrastr []string `orm:"-"`
}

var SettingFields = []string{"id", "key", "type", "kind", "name", "group", "extra", "remark",
	"update_time", "status", "value", "order"}

// 系统配置设置转 xml
type Settings struct {
	XMLName  xml.Name          `xml:"configuration"`
	Version  string            `xml:"version,attr"`
	Groups   []Group           `xml:"group"`
	GroupMap map[string]*Group `xml:"-"`
}
type SettingBase struct {
	Key   string `xml:"key,attr"`
	Name  string `xml:"name,attr"`
	State string `xml:"state,attr"`
	Order int64  `xml:"order,attr"`
	Hide  bool   `xml:"hide,attr"`
}
type Group struct {
	SettingBase
	Items []Item `xml:"item"`

	ItemMap map[string]*Item `xml:"-"`
}
type Item struct {
	SettingBase
	Value   string   `xml:"value"`
	Type    int8     `xml:"type,attr"`
	Remark  string   `xml:"remark"`
	Options []Option `xml:"options>option"`
}

type Option struct {
	Value  string `xml:"value,attr"`
	Name   string `xml:",innerxml"`
	Remark string `xml:"remark"`
}

// 配置缓存设置
// 根据 sys appid tid uid 设置缓存 分配
// type SettingIdLeveMap struct{
// 	SysAppTU map[string] SettingGroupMap
// }
// 缓存 组 分配
type SettingGroupMap struct {
	Group map[string]SettingItemMap
}
type SettingItemMap struct {
	Name  string
	Order int
	Key   string
	Hide  bool
	Item  map[string]Item
}

const (
	SettingSystemFileName = "sys"
	SettingAppFileName    = "app"
	SettingTenantFileName = "tenant"
	SettingUserFileName   = "user"
)

func (a *Setting) TableName() string {
	return TableName("common_setting")
}

func SettingTableName() string {
	return TableName("common_setting")
}

// 配置管理查询
func SettingGetListBy(appid uint, tid uint, search string, group int, id uint32, kind int8, page, pagesize uint32) ([]*Setting, int64, error) {
	list := make([]*Setting, 0)
	offset := page * pagesize
	o := orm.NewOrm()
	query := o.QueryTable(SettingTableName()).Filter("tid", tid).Filter("appid", appid).Filter("kind", kind)
	if len(search) > 0 {
		cond := orm.NewCondition()
		cond1 := cond.Or("key__icontains", search).Or("title__icontains", search)
		cond2 := cond.AndCond(cond1)
		query = query.SetCond(cond2)
	}
	if group > 0 {
		query = query.Filter("group", group)
	}
	if id > 0 {
		query = query.Filter("id", id)
	}
	num, err := query.Count()
	if num > 0 {
		query.Limit(pagesize, offset).All(&list)
	}
	return list, num, err
}

// 配置管理数据库查询
func SettingGetList(appid, tid, uid uint) ([]*Setting, error) {
	kind, appid, tid, uid := libs.GetSettingKindValue(appid, tid, uid)
	var list []*Setting

	o := orm.NewOrm()
	query := o.QueryTable(SettingTableName()).Filter("appid", appid).Filter("tid", tid).Filter("uid", uid).Filter("kind", kind)
	_, err := query.Limit(-1).All(&list)
	return list, err
}

// 配置管理group查询
func SettingGetListByGroup(appid, tid, uid uint, group string, kind uint8) ([]*Setting, error) {
	list := make([]*Setting, 0)

	o := orm.NewOrm()
	query := o.QueryTable(SettingTableName()).Filter("tid", tid).Filter("appid", appid).Filter("uid", uid).Filter("kind", kind)
	_, err := query.Filter("group", group).All(&list)

	return list, err
}

// 配置设置组项目数据
func SettingGetListByKeys(appid, tid, uid uint, group string, keys []string, kind int8) ([]*Setting, error) {
	list := make([]*Setting, 0)

	o := orm.NewOrm()
	cond := orm.NewCondition()
	cond1 := cond.And("kind", kind).And("group", group).And("tid", tid).And("uid", uid).And("appid", appid)

	query := o.QueryTable(SettingTableName())
	cond3 := cond.Or("key", '0')
	for _, v := range keys {
		cond3 = cond3.Or("key", v)
	}
	cond2 := cond.AndCond(cond3).AndCond(cond1)
	_, err := query.SetCond(cond2).OrderBy("Key", "-kind").Limit(100).All(&list)
	l := new([]*Setting)
	m := new(Setting)
	for _, v := range list {
		if m.Key != v.Key {
			if v.Type == 4 {
				sp := strings.Split(v.Extra, "\r\n")
				v.Extrastr = sp
			}
			*l = append(*l, v)
		}
		m = v
	}

	return *l, err
}

// 配置管理修改 未用
func SettingUpdate(appid uint, tid uint, setting *Setting) (int64, error) {
	err := IsValidSetting(setting)

	if err != nil {
		return 0, err
	}
	o := orm.NewOrm()
	num, err := o.Update(setting)
	return num, err
}

// 配置设置批量保存
func SettingListSave(appid, tid, uid uint, settinglist []*Setting) (int64, error) {
	kind, appid, tid, uid := libs.GetSettingKindValue(appid, tid, uid)

	o := orm.NewOrm()
	o.Begin()
	query := o.QueryTable(SettingTableName())
	var total int64 = 0
	var num int64
	var err error
	for _, item := range settinglist {
		// 有效检查
		err := IsValidSetting(item)
		if err != nil {
			break
		}
		// key存在？更新：插入
		count, _ := query.Filter("appid", appid).Filter("tid", tid).Filter("uid", uid).Filter("kind", kind).Filter("group", item.Group).Filter("Key", item.Key).Count()
		if count > 0 {
			// 同时更新group和key，解决map结构大小写敏感而数据库存储不敏感的BUG
			num, err = query.Filter("appid", appid).Filter("tid", tid).Filter("uid", uid).Filter("kind", kind).Filter("group", item.Group).Filter("Key", item.Key).Update(orm.Params{
				"group": item.Group, "key": item.Key, "value": item.Value, "kind": kind, "update_time": item.UpdateTime.Time,
				"type": item.Type, "extra": item.Extra, "name": item.Name, "remark": item.Remark, "order": item.Order})
		} else {
			num, err = o.Insert(item)
		}
		if err != nil {
			break
		}
		total += num
	}
	if err != nil {
		fmt.Println(err)
		o.Rollback()
	} else {
		o.Commit()
		cacheKey := fmt.Sprintf(utils.CacheKeyCommonSettingDbByAppidTidUid, appid, tid, uid)
		utils.Cache.Delete(cacheKey)
	}
	return num, err
}

// 有效检验
func IsValidSetting(setting *Setting) error {
	result := validation.Validation{}
	isValid, err := result.Valid(setting)
	if err != nil {
		return libs.FailError(libs.E201204, err)
	}
	if !isValid {
		if result.HasErrors() {
			return libs.FailError(libs.E201204, errors.New(result.Errors[0].Message))
		}
	}

	return nil
}
func getSettingFileName(kind uint8) string {
	var xmlfile string
	if kind == 1 {
		xmlfile = SettingSystemFileName
	} else if kind == 2 {
		xmlfile = SettingAppFileName
	} else if kind == 3 {
		xmlfile = SettingTenantFileName
	} else if kind == 4 {
		xmlfile = SettingUserFileName
	}
	return xmlfile
}

func getSettingLoadPath(kind uint8) string {
	appname := beego.AppConfig.String("app.name")
	return fmt.Sprintf("assets/%s/setting/%s.xml", appname, getSettingFileName(kind))
}

// 读设置资源文件
func SettingRead(kind uint8) (string, error) {
	path := getSettingLoadPath(kind)
	if len(path) == 0 {
		return "", errors.New("参数不正确")
	}
	content, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}
	return string(content), err
}

// 写设置资源文件
func SettingSave(kind uint8, content string) error {
	path := getSettingLoadPath(kind)
	var cfg Settings
	err := xml.Unmarshal([]byte(content), &cfg)
	if err != nil {
		return errors.New("设置配置内容检查失败，请确认正确后重新操作")
	}
	err = ioutil.WriteFile(path, []byte(content), os.ModeDevice)
	if err != nil {
		log.Fatal(err)
	} else {
		cacheKey := fmt.Sprintf(utils.CacheKeyCommonSettingFileByKind, kind)
		utils.Cache.Delete(cacheKey)
	}
	return err
}

// 加载系统，应用，租户，用户关联的设置项
func SettingLoadFor(appid, tid, uid uint) (*Settings, error) {
	kind, appid, tid, uid := libs.GetSettingKindValue(appid, tid, uid)

	loadCallbackFunc := func() (interface{}, error) {
		settings, err := SettingLoad(kind)
		if err != nil {
			return nil, err
		}
		list, err := SettingGetList(appid, tid, uid)
		if err != nil {
			return settings, err
		}
		for _, val := range list {
			if group, gok := settings.GroupMap[val.Group]; gok {
				if item, ok := group.ItemMap[val.Key]; ok {
					item.Value = val.Value
				}
			}
		}
		for i := range settings.Groups {
			group := settings.Groups[i]
			groupMap := settings.GroupMap[group.Key]
			for j := 0; j < len(group.Items); j++ {
				curItem := group.Items[j]
				// 设置item的值
				if _, ok := groupMap.ItemMap[curItem.Key]; ok {
					group.Items[j].Value = groupMap.ItemMap[curItem.Key].Value
				}

			}
		}
		return settings, nil
	}
	cacheKey := fmt.Sprintf(utils.CacheKeyCommonSettingDbByAppidTidUid, appid, tid, uid)
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	settings, ok := res.(*Settings)
	if !ok {
		return settings, errors.New("设置加载失败：类型错误")
	}
	return settings, nil
}

// 装载设置数据缓存 不存在读取xml文件到SetMenu map装到缓存
func SettingLoad(kind uint8) (*Settings, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyCommonSettingFileByKind, kind)
	loadCallbackFunc := func() (interface{}, error) {
		content, err := ioutil.ReadFile(getSettingLoadPath(kind))
		if err != nil {
			return nil, err
		}
		var settings Settings
		err = xml.Unmarshal([]byte(content), &settings)
		return &settings, err
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	settings, ok := res.(*Settings)
	if !ok {
		return nil, errors.New("类型转换失败")
	}
	// 深度复制数据，解决数据被共享的问题
	cloneData := libs.Copy(settings)
	settings = cloneData.(*Settings)

	settings.GroupMap = make(map[string]*Group)
	for i, _ := range settings.Groups {
		group := settings.Groups[i]
		group.ItemMap = make(map[string]*Item)
		for j, _ := range group.Items {
			item := group.Items[j]
			group.ItemMap[item.Key] = &item
		}
		settings.GroupMap[group.Key] = &group
	}

	return settings, nil
}
func SettingGetGroupFor(settings *Settings, groupKey string) (*Group, error) {
	if val, ok := settings.GroupMap[groupKey]; ok {
		return val, nil
	}
	return nil, errors.New("设置组不存在")
}
func SettingGetValueFor(settings *Settings, groupKey, key string, def ...string) (string, error) {
	group, err := SettingGetGroupFor(settings, groupKey)
	if err != nil {
		return "", err
	}
	value := ""
	if val, ok := group.ItemMap[key]; ok {
		value = val.Value
	}
	if len(value) == 0 && len(def) > 0 {
		value = def[0]
	}
	return value, nil
}

// 通过根据Group值获取系统级设置组
func SettingGetGroupForSys(group string) (*Group, error) {
	settings, err := SettingLoadFor(0, 0, 0)
	if err != nil {
		return nil, err
	}
	return SettingGetGroupFor(settings, group)
}

// 通过根据Group值获取应用级设置组
func SettingGetGroupForApp(appid uint, group string) (*Group, error) {
	settings, err := SettingLoadFor(appid, 0, 0)
	if err != nil {
		return nil, err
	}
	return SettingGetGroupFor(settings, group)
}

// 通过根据Group值获取应用级设置组
func SettingGetGroupForTenant(appid, tid uint, group string) (*Group, error) {
	settings, err := SettingLoadFor(appid, tid, 0)
	if err != nil {
		return nil, err
	}
	return SettingGetGroupFor(settings, group)
}

// 通过根据Group值获取应用级设置组
func SettingGetGroupForUser(group string, appid, tid, uid uint) (*Group, error) {
	settings, err := SettingLoadFor(appid, tid, uid)
	if err != nil {
		return nil, err
	}
	return SettingGetGroupFor(settings, group)
}

// 通过根据Group，Key值获取系统级设置值
func SettingGetValueForSys(group, key string, def ...string) (string, error) {
	settings, err := SettingLoadFor(0, 0, 0)
	if err != nil {
		return "", err
	}
	value, err := SettingGetValueFor(settings, group, key, def...)
	return value, err
}

// 通过根据Group，Key值获取应用级设置值
func SettingGetValueForApp(appid uint, group, key string, def ...string) (string, error) {
	settings, err := SettingLoadFor(appid, 0, 0)
	if err != nil {
		return "", err
	}
	value, err := SettingGetValueFor(settings, group, key, def...)
	return value, err
}

// 通过根据Group，Key值获取租户级设置值
func SettingGetValueForTenant(appid, tid uint, group, key string, def ...string) (string, error) {
	settings, err := SettingLoadFor(appid, tid, 0)
	if err != nil {
		return "", err
	}
	value, err := SettingGetValueFor(settings, group, key, def...)
	return value, err
}

// 通过根据Group，Key值获取用户级设置值
func SettingGetValueForUser(appid, tid, uid uint, group, key string, def ...string) (string, error) {
	settings, err := SettingLoadFor(appid, tid, uid)
	if err != nil {
		return "", err
	}
	value, err := SettingGetValueFor(settings, group, key, def...)
	return value, err
}

// 删除组无用项
func SettingDelInvalid(appid uint, tid uint, uid uint, group string) error {
	kind, appid, tid, uid := libs.GetSettingKindValue(appid, tid, uid)

	settings, err := SettingLoadFor(appid, tid, uid)
	keys := make([]string, 0)
	if group, ok := settings.GroupMap[group]; ok {
		for key, _ := range group.ItemMap {
			keys = append(keys, key)
		}
	}

	query := orm.NewOrm().QueryTable(SettingTableName()).Exclude("key__in", keys).Filter("kind", kind).Filter("appid", appid).
		Filter("appid", appid).Filter("group", group).Filter("tid", tid).Filter("uid", uid)
	_, err = query.Delete()
	return err
}
