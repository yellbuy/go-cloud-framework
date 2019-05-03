//common_setting
//配置管理
package controllers

import (
	"errors"
	"fmt"
	"time"

	// "encoding/json"

	// "strconv"
	"strings"

	// "bytes"
	// "json"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	"yellbuy.com/YbGoCloundFramework/libs"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type SettingController struct {
	share.AdminBaseController
}
type TabList struct {
	Key  string
	Name string
}

// 设置缓存

//加载模板
func (self *SettingController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "/common/setting/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

// 配置xml文件编辑
func (self *SettingController) SettingFileEdit() {
	kind, _ := self.GetUint8("kind", 0)

	if self.Ctx.Input.IsPost() {
		if kind < 1 || kind > 4 {
			self.AjaxMsg("参数错误", libs.E100000)
		}
		content := self.GetString("Content")

		err := commonModels.SettingSave(kind, content)
		if err != nil {
			fmt.Println(err)
			self.AjaxMsg("保存失败", libs.E100000)
		}

		self.AjaxMsg("", libs.E0)
	} else {
		// content, _ := ioutil.ReadFile("assets/setting/" + xmlfile + ".xml")
		content, err := commonModels.SettingRead(kind)
		if err != nil {
			fmt.Println(err)
		}
		self.Context["kind"] = kind
		self.Context["pageTitle"] = "配置管理"
		self.Context["content"] = string(content)
		self.display()
	}

}

// 配置设置编辑 保存数据到数据库
func (self *SettingController) SettingGroupEdit() {
	groupKey := self.GetString("group")
	if self.Ctx.Input.IsPost() {
		list, err := form2Settinglist(self, groupKey)
		if err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		}

		if _, err := commonModels.SettingListSave(self.Appid, self.Tid, self.Uid, list); err != nil {
			self.AjaxMsg(err, libs.E100000)
		} else {
			// 删除数据库未用数据
			commonModels.SettingDelInvalid(self.Appid, self.Tid, self.Uid, groupKey)
			self.AjaxMsg("", libs.E0)
		}
	} else {

		settings, _ := commonModels.SettingLoadFor(self.Appid, self.Tid, self.Uid)
		// 默认选择第一组
		if len(groupKey) == 0 && len(settings.Groups) > 0 {
			groupKey = settings.Groups[0].Key
		}
		if group, ok := settings.GroupMap[groupKey]; ok {
			for index, _ := range group.Items {
				item := group.Items[index]
				// 设置新值
				group.Items[index].Value = group.ItemMap[item.Key].Value
			}
			self.Context["items"] = group.Items
		}
		self.Context["pageTitle"] = "设置配置"

		self.Context["group"] = groupKey
		self.Context["groups"] = settings.Groups
		self.display()
	}

}

// // 修改设置数据 转换setting
func form2Settinglist(self *SettingController, groupKey string) ([]*commonModels.Setting, error) {
	// kind := libs.GetAuthKindValue(self.ScopeTypeAppid, self.ScopeTypeTid, self.ScopeTypeUid)
	settings, err := commonModels.SettingLoad(self.ScopeKind)
	if err != nil {
		return nil, err
	}
	group, ok := settings.GroupMap[groupKey]
	if !ok {
		return nil, errors.New("组标识不存在")
	}
	list := make([]*commonModels.Setting, 0)
	// na.Id = id
	formlist := self.Ctx.Request.Form

	for key, val := range formlist {

		item, ok := group.ItemMap[key]
		if ok {
			setting := new(commonModels.Setting)
			setting.Key = key
			setting.Remark = item.Remark
			setting.Type = item.Type
			var str string

			if item.Type == 4 {
				for _, v := range item.Options {
					str += v.Name + "\r\n"
				}
				setting.Extra = str
			}
			setting.Name = item.Name
			setting.Order = item.Order
			if len(val) > 0 {
				setting.Value = val[0]
			} else {
				setting.Value = item.Value
			}
			setting.Group = groupKey
			setting.CreateTime.Time = time.Now()
			setting.UpdateTime.Time = time.Now()
			setting.Kind, setting.Appid, setting.Tid, setting.Uid = libs.GetSettingKindValue(self.Appid, self.Tid, self.Uid)
			list = append(list, setting)
		}
	}
	return list, nil
}
