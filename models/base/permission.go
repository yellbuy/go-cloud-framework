/**********************************************
** @Des: 权限因子
** @Author: 
** @Date:   2017-09-09 20:50:36
** @Last Modified by:   che
** @Last Modified time: 2017-09-17 21:42:08
***********************************************/
package base

import (
	"encoding/xml"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/antchfx/xmlquery"
	"github.com/astaxie/beego"
	cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/utils"
)

type PermissionOpt interface {
	SetPermission(bool)
	GetPermission() bool
	SetPath(string)
	GetPath() string
	GetIsHide() bool
	GetScopeLevel() uint8
	GetScopeType() uint8
}
type Configuration struct {
	XMLName     xml.Name     `xml:"configuration"`
	Version     string       `xml:"version,attr"`
	Permissions []Permission `xml:"permission"`
}

type PermissionBase struct {
	Key      string `xml:"key,attr"`
	Name     string `xml:"name,attr"`
	Font     string `xml:"font,attr"`
	Icon     string `xml:"icon,attr"`
	Path     string `xml:"path,attr"`
	Desc     string `xml:"desc,attr"`
	Ext      string `xml:"ext,attr"`
	IsPublic bool   `xml:"isPublic,attr"`
	IsHide   bool   `xml:"isHide,attr"`
	IsSpread bool   `xml:"isSpread,attr"`
	// 数据过滤层级 0：默认，1：系统，2：应用，3：租户，4：用户，多少级就应该有多少个过滤参数
	ScopeLevel uint8 `xml:"scopeLevel,attr"`
	// 所在类型 0：默认，1：系统，2：应用，3：租户，4：用户，即记录在数据库中值达到的层级，0表示：appid，tid，uid均为0；1表示：appid有值，tid，uid为0
	ScopeType uint8 `xml:"scopeType,attr"`
	// XMLName xml.Name `xml:"permission"`
	Modules []Module `xml:"module"`
	Actions []Action `xml:"action"`

	HasPermission bool           `xml:"-"`
	Self          *PermissionOpt `xml:"-"`
}
type Permission struct {
	PermissionBase
}

// 实现接口
func (self *PermissionBase) SetPermission(value bool) {
	self.HasPermission = value
}
func (self *PermissionBase) GetPermission() bool {
	return self.HasPermission
}
func (self *PermissionBase) SetPath(value string) {
	self.Path = value
}
func (self *PermissionBase) GetPath() string {
	return self.Path
}
func (self *PermissionBase) GetIsHide() bool {
	return self.IsHide
}
func (self *PermissionBase) GetModules() []Module {
	return self.Modules
}
func (self *PermissionBase) GetActions() []Action {
	return self.Actions
}
func (self *PermissionBase) GetScopeLevel() uint8 {
	return self.ScopeLevel
}
func (self *PermissionBase) GetScopeType() uint8 {
	return self.ScopeType
}

// func (m *Permission) GetKey() string {
// 	return m.Key
// }
// func (m *Permission) SetPermission(hasPermission bool) {
// 	m.HasPermission = hasPermission
// }

type Module struct {
	PermissionBase
	Event  string `xml:"event,attr"`
	Target string `xml:"target,attr"`

	// Mamager PermissionManager `xml:"-"`
}

type Action struct {
	PermissionBase
	Event  string `xml:"event,attr"`
	Target string `xml:"target,attr"`
	// Mamager PermissionManager `xml:"-"`
}

// 权限树结构
type PermissionTree struct {
	Permissions   []Permission
	PermissionMap map[string]PermissionOpt
	UrlCheckMap   map[string]bool
	AllowUrls     string
}

type CachePermission struct {
	// 所有权限
	Permissions      []Permission
	UrlPermissionMap map[string]bool
	AllowUrl         string
	PermissionMap    map[string]PermissionOpt
}

const (
	SettingSystemFileName = "sys"
	SettingAppFileName    = "app"
	SettingTenantFileName = "tenant"
	SettingUserFileName   = "user"
	// Cache_Setting_Db_Key   = "common_set_db_%v_%v_%v"
	// Cache_Setting_File_Key = "common_set_file_%v"
)

func getPermissionFileName(kind uint8) string {
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

func getPermissionLoadPath(kind uint8) string {
	appname := beego.AppConfig.String("app.name")
	return fmt.Sprintf("assets/%s/permission/%s.xml", appname, getPermissionFileName(kind))
}

// 读权限资源文件
func PermissionRead(kind uint8) (string, error) {
	path := getPermissionLoadPath(kind)
	if len(path) == 0 {
		return "", errors.New("参数不正确")
	}
	content, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}
	return string(content), err
}
func PermissionSave(kind uint8, content string) error {
	path := getPermissionLoadPath(kind)
	var cfg Configuration
	err := xml.Unmarshal([]byte(content), &cfg)
	if err != nil {
		return errors.New("权限资源内容检查失败，请确认正确后重新操作")
	}
	err = ioutil.WriteFile(path, []byte(content), os.ModeDevice)
	if err != nil {
		log.Fatal(err)
	} else {
		utils.Cache.Flush()
	}
	return err
}

// 写权限资源文件
func PermissionLoad(kind uint8) (*PermissionTree, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBasePermissionFileByKind, kind)
	cacheData, found := utils.Cache.Get(cacheKey)
	if found && cacheData != nil { //从缓存取菜单
		originalTree := cacheData.(*PermissionTree)
		// 深度复制数据，只能复制数组部分，否则Map指针关联不到数据
		cloneData := libs.Copy(originalTree.Permissions)
		data := cloneData.([]Permission)
		tree := &PermissionTree{}
		tree.Permissions = data
		return tree, nil
	}
	path := getPermissionLoadPath(kind)
	var tree = &PermissionTree{}

	fs, err := os.Open(path)
	if err != nil {
		return tree, err
	}
	doc, err := xmlquery.Parse(fs)
	if err != nil {
		return tree, err
	}
	node := xmlquery.FindOne(doc, "//configuration")
	// node := xmlquery.FindOne(doc, "//application[@key='"+appname+"']")
	// fmt.Printf("node: %f\n", node)
	content := node.OutputXML(true)
	var cfg Configuration
	// fmt.Println("content:", content)
	err = xml.Unmarshal([]byte(content), &cfg)
	if err == nil {
		tree.Permissions = cfg.Permissions
		// Map结构，按Key存储，以快速查找
		tree = SetPermissionTree(tree)
		utils.Cache.Set(cacheKey, tree, cache.NoExpiration)
	} else {
		fmt.Printf("PermissionLoad err", err)
	}
	return tree, err
}

// 维护一个Map结构，方便快速获取节点数据
func SetPermissionTree(tree *PermissionTree) *PermissionTree {
	tree.PermissionMap = make(map[string]PermissionOpt)
	tree.UrlCheckMap = make(map[string]bool)
	for index, val := range tree.Permissions {

		// 预先设置公开权限状态
		if val.IsPublic {
			tree.Permissions[index].HasPermission = true
		}
		// 处理路径
		if len(val.Path) > 0 {
			val.Path = strings.TrimSpace(strings.ToLower(val.Path))
			tree.UrlCheckMap[val.Path] = val.HasPermission
		}

		tree.PermissionMap[val.Key] = &tree.Permissions[index]
		tree = setPermissionTreeForModules(tree, val.Modules)
		tree = setPermissionTreeForActions(tree, val.Actions)
	}
	return tree
}

// 递归子节点
func setPermissionTreeForModules(tree *PermissionTree, data []Module) *PermissionTree {
	for index, val := range data {
		// 预先设置公开权限状态
		if val.IsPublic {
			data[index].HasPermission = true
		}
		tree.PermissionMap[val.Key] = &data[index]
		if len(val.Modules) > 0 {
			tree = setPermissionTreeForModules(tree, val.Modules)
		}
		if len(val.Actions) > 0 {
			tree = setPermissionTreeForActions(tree, val.Actions)
		}
	}
	return tree
}

// 递归子节点
func setPermissionTreeForActions(tree *PermissionTree, data []Action) *PermissionTree {
	for index, val := range data {
		// 预先设置公开权限状态
		if val.IsPublic {
			data[index].HasPermission = true
		}
		tree.PermissionMap[val.Key] = &data[index]
		if len(val.Modules) > 0 {
			tree = setPermissionTreeForModules(tree, val.Modules)
		}
		if len(val.Actions) > 0 {
			tree = setPermissionTreeForActions(tree, val.Actions)
		}
	}
	return tree
}

// 加载用户权限
func PermissionLoadForUser(kind uint8, uid uint, isAdmin bool) (*PermissionTree, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBasePermissionByKindUid, kind, uid)
	cacheData, found := utils.Cache.Get(cacheKey)
	if found && cacheData != nil {
		return cacheData.(*PermissionTree), nil
	}
	// 缓存未找到，继续处理
	// 加载原始权限资源
	originalTree, err := PermissionLoad(kind)
	if err != nil || originalTree == nil {
		return nil, err
	}

	// 深度复制数据，只能复制数组部分，否则Map指针关联不到数据
	cloneData := libs.Copy(originalTree.Permissions)
	data := cloneData.([]Permission)
	tree := &PermissionTree{}
	tree.Permissions = data
	tree = SetPermissionTree(tree)
	tree, err = PermissionCheckForUid(tree, uid, isAdmin)
	if err == nil && tree != nil {
		utils.Cache.Set(cacheKey, tree, utils.TenMinuteExpiration)
	}

	return tree, err
}

// 加载用户指定Key下的直接下属权限节点
func PermissionLoadChildForKey(keyName string, kind uint8, uid uint, isAdmin bool) ([]PermissionBase, error) {
	res := make([]PermissionBase, 0)
	tree, err := PermissionLoadForUser(kind, uid, isAdmin)
	if err != nil {
		return res, err
	}
	// 需要更新权限，因为Permissons中的值暂时没法更新
	if val, exist := tree.PermissionMap[keyName]; exist {

		switch val.(type) {
		case *Permission:
			for _, val := range val.(*Permission).Modules {
				val.PermissionBase.HasPermission = tree.PermissionMap[val.Key].GetPermission()
				res = append(res, val.PermissionBase)
			}
			for _, val := range val.(*Permission).Actions {
				val.PermissionBase.HasPermission = tree.PermissionMap[val.Key].GetPermission()
				res = append(res, val.PermissionBase)
			}
			break
		case *Module:
			for _, val := range val.(*Module).Modules {
				val.PermissionBase.HasPermission = tree.PermissionMap[val.Key].GetPermission()
				res = append(res, val.PermissionBase)
			}
			for _, val := range val.(*Module).Actions {
				val.PermissionBase.HasPermission = tree.PermissionMap[val.Key].GetPermission()
				res = append(res, val.PermissionBase)
			}
			break
		case *Action:
			for _, val := range val.(*Action).Modules {
				val.PermissionBase.HasPermission = tree.PermissionMap[val.Key].GetPermission()
				res = append(res, val.PermissionBase)
			}
			for _, val := range val.(*Action).Actions {
				val.PermissionBase.HasPermission = tree.PermissionMap[val.Key].GetPermission()
				res = append(res, val.PermissionBase)
			}
			break
		}
	}
	return res, nil
}

// 加载用户模块导航菜单权限
func PermissionModulesLoadForUser(kind uint8, uid uint, keyName string, isAdmin bool) ([]map[string]interface{}, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBasePermissionMdlByKindKeyUid, kind, uid)
	cacheData, found := utils.Cache.Get(cacheKey)
	if found && cacheData != nil {
		return cacheData.([]map[string]interface{}), nil
	}
	menuMap := make([]map[string]interface{}, 0)
	tree, err := PermissionLoadForUser(kind, uid, isAdmin)
	if err != nil {
		fmt.Println("PermissionModulesLoadForUser", err)
		return menuMap, err
	}
	if val, exist := tree.PermissionMap[keyName]; exist {
		if perm, ok := val.(*Permission); ok {
			menuMap = permissionModulesLoadMap(tree.PermissionMap, "0", perm.Modules)
		}
	}

	utils.Cache.Set(cacheKey, menuMap, utils.DefaultExpiration)
	return menuMap, nil
}

// 加载菜单
func permissionModulesLoadMap(permMap map[string]PermissionOpt, parent string, modules []Module) []map[string]interface{} {
	menuMap := make([]map[string]interface{}, 0)
	for _, val := range modules {
		//fmt.Println(val.PermissionBase.Key, val.PermissionBase.Name)
		// if val.HasPermission {
		// 是否有权限和是否隐藏，此处需要使用Map来判断
		perm := permMap[val.Key]
		fmt.Println(val.PermissionBase.Key, val.PermissionBase.Name, perm)

		if perm.GetPermission() && !perm.GetIsHide() {
			mdl := make(map[string]interface{})
			mdl["pid"] = parent
			mdl["id"] = val.Key
			mdl["title"] = val.Name
			font := "fa"
			if len(val.Font) > 0 {
				font = val.Font
			}
			mdl["font"] = font
			mdl["icon"] = val.Icon
			mdl["url"] = val.Path
			mdl["spread"] = val.IsSpread
			children := permissionModulesLoadMap(permMap, val.Key, val.Modules)
			mdl["children"] = children
			menuMap = append(menuMap, mdl)
		}
	}
	return menuMap
}

// 权限Map转authtree所需的数据结构
func Permission2Tree(list []Permission) []map[string]interface{} {
	result := make([]map[string]interface{}, 0)
	for _, val := range list {
		child := make(map[string]interface{})
		child["value"] = val.Key
		child["name"] = val.Name
		child["icon"] = val.Icon
		child["checked"] = val.HasPermission
		child["disabled"] = false
		list := make([]map[string]interface{}, 0)
		if len(val.Modules) > 0 {
			children := module2Tree(val.Modules)
			list = append(list, children...)
		}
		if len(val.Actions) > 0 {
			children := action2Tree(val.Actions)
			list = append(list, children...)
		}
		if len(list) > 0 {
			child["list"] = list
		}
		result = append(result, child)
	}
	return result
}
func module2Tree(nodes []Module) []map[string]interface{} {
	result := make([]map[string]interface{}, 0)
	for _, val := range nodes {
		child := make(map[string]interface{})
		child["value"] = val.Key
		child["name"] = val.Name
		child["icon"] = val.Icon
		child["checked"] = val.HasPermission
		child["disabled"] = false
		list := make([]map[string]interface{}, 0)
		if len(val.Modules) > 0 {
			children := module2Tree(val.Modules)
			list = append(list, children...)
		}
		if len(val.Actions) > 0 {
			children := action2Tree(val.Actions)
			list = append(list, children...)
		}
		if len(list) > 0 {
			child["list"] = list
		}
		result = append(result, child)
	}
	return result
}

func action2Tree(nodes []Action) []map[string]interface{} {
	result := make([]map[string]interface{}, 0)
	for _, val := range nodes {
		child := make(map[string]interface{})
		child["value"] = val.Key
		child["name"] = val.Name
		child["icon"] = val.Icon
		child["checked"] = val.HasPermission
		child["disabled"] = false
		list := make([]map[string]interface{}, 0)
		if len(val.Modules) > 0 {
			children := module2Tree(val.Modules)
			list = append(list, children...)
		}
		if len(val.Actions) > 0 {
			children := action2Tree(val.Actions)
			list = append(list, children...)
		}
		if len(list) > 0 {
			child["list"] = list
		}
		result = append(result, child)
	}
	return result
}

// 用户权限检查
func PermissionCheckForUid(tree *PermissionTree, uid uint, isSupperAdmin bool) (*PermissionTree, error) {
	tree.AllowUrls = ""
	rolePermissions, err := RolePermissionGetByUid(uid)
	if err != nil {
		fmt.Println("PermissionCheckForRoles", err)
		return nil, err
	}
	tree = updatePermissionTree(tree, rolePermissions, isSupperAdmin)
	return tree, nil
}

// 角色权限检查
func PermissionCheckForRoles(tree *PermissionTree, roleids string, isSupperAdmin bool) (*PermissionTree, error) {
	tree.AllowUrls = ""
	rolePermissions, err := RolePermissionGetByIds(roleids)
	if err != nil {
		fmt.Println("PermissionCheckForRoles", err)
		return nil, err
	}
	tree = updatePermissionTree(tree, rolePermissions, isSupperAdmin)
	return tree, nil
}

func updatePermissionTree(tree *PermissionTree, rolePermissions []*RolePermission, isSupperAdmin bool) *PermissionTree {
	// 超级管理员，具有所有权限
	if isSupperAdmin {
		for _, val := range tree.PermissionMap {
			val.SetPermission(true)
			tree.UrlCheckMap[val.GetPath()] = true
			tree.AllowUrls = fmt.Sprintf("%s,%s", tree.AllowUrls, val.GetPath())
		}
	} else {
		for _, val := range rolePermissions {
			if node, ok := tree.PermissionMap[val.PermissionKey]; ok {
				node.SetPermission(true)
				tree.UrlCheckMap[node.GetPath()] = true
				tree.AllowUrls = fmt.Sprintf("%s,%s", tree.AllowUrls, node.GetPath())
			}
		}
	}
	//fmt.Println("tree permissons 0:", tree.Permissions[0].Modules[0].PermissionBase.HasPermission)
	//fmt.Println("admin_eshop_nav HasPermission:", tree.PermissionMap["admin_eshop_nav"].GetPermission())
	return tree
}

func PermissionCheck(treeNodes []Permission, rolePermissionMap map[string]string, isSupperAdmin bool) ([]Permission, map[string]bool) {
	urlCheckMap := make(map[string]bool, 0)
	for i, val := range treeNodes {
		if val.IsPublic || isSupperAdmin {
			// 公开的，默认有权限
			val.HasPermission = true

		} else if _, ok := rolePermissionMap[val.Key]; ok {
			//是否有权限
			val.HasPermission = ok
		}

		if len(val.Path) > 0 {
			path := strings.ToLower(val.Path)
			if hasPerm, ok := urlCheckMap[path]; !ok {
				// 没有数据设置到map中
				urlCheckMap[path] = val.HasPermission
			} else if !hasPerm && val.HasPermission {
				// 原来的没有权限，新的key有权限，则设置为有权限，确保所有地址能正常授权
				urlCheckMap[path] = true
			}
		}
		if len(val.Modules) > 0 {
			permissionModuleCheck(val.Modules, rolePermissionMap, urlCheckMap, isSupperAdmin)
		}
		if len(val.Actions) > 0 {
			permissionActionCheck(val.Actions, rolePermissionMap, urlCheckMap, isSupperAdmin)
		}
		treeNodes[i] = val
	}
	return treeNodes, urlCheckMap
}

// 角色模块权限检查
func permissionModuleCheck(treeNodes []Module, rolePermissionMap map[string]string, urlCheckMap map[string]bool, isSupperAdmin bool) {
	if len(treeNodes) == 0 {
		return
	}
	for i, val := range treeNodes {
		if val.IsPublic || isSupperAdmin {
			// 公开的，默认有权限
			val.HasPermission = true

		} else if _, ok := rolePermissionMap[val.Key]; ok {
			//是否有权限
			val.HasPermission = ok
		}
		if len(val.Path) > 0 {
			path := strings.ToLower(val.Path)
			if hasPerm, ok := urlCheckMap[path]; !ok {
				// 没有数据设置到map中
				urlCheckMap[path] = val.HasPermission
			} else if !hasPerm && val.HasPermission {
				// 原来的没有权限，新的key有权限，则设置为有权限，确保所有地址能正常授权
				urlCheckMap[path] = true
			}
		}
		if len(val.Modules) > 0 {
			permissionModuleCheck(val.Modules, rolePermissionMap, urlCheckMap, isSupperAdmin)
		}
		if len(val.Actions) > 0 {
			permissionActionCheck(val.Actions, rolePermissionMap, urlCheckMap, isSupperAdmin)
		}
		treeNodes[i] = val
	}
}

// 角色动作权限检查
func permissionActionCheck(treeNodes []Action, rolePermissionMap map[string]string, urlCheckMap map[string]bool, isSupperAdmin bool) {
	if len(treeNodes) == 0 {
		return
	}
	for i, val := range treeNodes {
		if val.IsPublic || isSupperAdmin {
			// 公开的，默认有权限
			val.HasPermission = true

		} else if _, ok := rolePermissionMap[val.Key]; ok {
			//是否有权限
			val.HasPermission = ok
		}
		if len(val.Path) > 0 {
			path := strings.ToLower(val.Path)
			if hasPerm, ok := urlCheckMap[path]; !ok {
				// 没有数据设置到map中
				urlCheckMap[path] = val.HasPermission
			} else if !hasPerm && val.HasPermission {
				// 原来的没有权限，新的key有权限，则设置为有权限，确保所有地址能正常授权
				urlCheckMap[path] = true
			}
		}
		if len(val.Modules) > 0 {
			permissionModuleCheck(val.Modules, rolePermissionMap, urlCheckMap, isSupperAdmin)
		}
		if len(val.Actions) > 0 {
			permissionActionCheck(val.Actions, rolePermissionMap, urlCheckMap, isSupperAdmin)
		}
		treeNodes[i] = val
	}
}
