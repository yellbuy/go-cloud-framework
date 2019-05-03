//common_category
//配置管理
package controllers

import (
	// "errors"

	// "encoding/json"

	// "strconv"

	"fmt"
	"strings"

	// "bytes"
	// "json"

	"time"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
	"yellbuy.com/YbGoCloundFramework/libs"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
)

type CategoryController struct {
	share.AdminBaseController
	// 类型
	Kind string
	// 是否软删除
	IsSoftDel bool
	// View模板路径，如果为空，则使用默认模板
	TemplatePath string
}

func (self *CategoryController) Prepare() {
	self.AdminBaseController.Prepare()
}
func (self *CategoryController) getTemplatePath() string {
	templatePath := self.TemplatePath
	if len(templatePath) == 0 {
		templatePath = "/common/category/"
	}
	return templatePath
}

//加载模板
func (self *CategoryController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		templatePath := self.getTemplatePath()
		tplname = templatePath + strings.ToLower(actionName) + ".html"
	}
	self.Context["kind"] = self.Kind
	self.Display(tplname)
}

func (self *CategoryController) ConcreteList() {
	if self.IsAjax() {
		//列表
		name := strings.TrimSpace(self.GetString("name"))
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		dto := new(commonModels.CategoryRequestDto)
		dto.Kind = self.Kind
		dto.Name = name
		dto.ContainDisabled = true
		dto.PageIndex = page - 1
		dto.PageSize = limit
		total, list, _ := commonModels.CategoryGetPagedList(dto, self.GetScopeLevelIds()...)
		commonModels.CategoryLoadCoverUrl(list)
		self.AjaxList("成功", libs.E0, total, list)

	} else {
		self.Context["pageTitle"] = "分类管理"
		self.display()
	}
}

func (self *CategoryController) ConcreteDataEdit() {
	if self.Ctx.Input.IsPost() {
		if data, err := form2CategoryStruct(self); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if data.Id > 0 {
				if err := commonModels.CategoryUpdate(data); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			} else {
				if _, err := commonModels.CategoryAdd(self.Appid, self.Tid, self.Uid, data); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			}

		}
	} else {
		id, _ := self.GetInt64("id")

		//var err error
		if id > 0 {
			info, _ := commonModels.CategoryGetById(id, self.Appid, self.Tid)
			if info.Id == 0 {
				templatePath := self.getTemplatePath()
				self.Redirect(templatePath+"concretelist", 302)
				self.StopRun()
			}
			self.Context["info"] = info
		} else {
			info := new(commonModels.Category)
			info.State = 1
			self.Context["info"] = info
		}

		self.Context["pageTitle"] = "分类管理"

		self.display()
	}
}

func (self *CategoryController) ChildList() {
	//列表
	page, err := self.GetUint32("page")
	if err != nil || page == 0 {
		page = 1
	}
	limit, err := self.GetUint32("limit")
	if err != nil || limit == 0 {
		limit = 30
	}
	name := strings.TrimSpace(self.GetString("name"))
	parentid, _ := self.GetInt64("parentid")
	fetchChild, _ := self.GetBool("fetchChild")
	dto := new(commonModels.CategoryRequestDto)
	dto.Kind = self.Kind
	dto.Name = name
	dto.ContainDisabled = true
	dto.Parentid = parentid
	dto.FetchChild = fetchChild
	dto.PageIndex = page - 1
	dto.PageSize = limit
	if total, list, err := commonModels.CategoryGetPagedListByParentid(dto, self.GetScopeLevelIds()...); err != nil {
		self.AjaxList(err.Error(), libs.E100000, 0, nil)
	} else {
		commonModels.CategoryLoadCoverUrl(list)
		self.AjaxList("成功", libs.E0, total, list)
	}
}

func (self *CategoryController) HierarchyList() {
	if self.IsAjax() {
		dto := new(commonModels.CategoryRequestDto)
		dto.Kind = self.Kind
		dto.ContainDisabled = true
		if list, err := commonModels.CategoryGetListBy(dto, self.GetScopeLevelIds()...); err != nil {
			self.AjaxList(err.Error(), libs.E100000, 0, nil)
		} else {
			for _, val := range list {
				val.NodeOpened = val.Level == 1
			}
			commonModels.CategoryLoadCoverUrl(list)
			self.AjaxList("成功", libs.E0, int64(len(list)), list)
		}
	} else {
		self.Context["pageTitle"] = "分类管理"
		self.display()
	}
}

func (self *CategoryController) HierarchyEdit() {
	if self.Ctx.Input.IsPost() {
		if data, err := form2CategoryStruct(self); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
		} else {
			if data.Id > 0 {
				if err := commonModels.CategoryUpdate(data); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			} else {
				if _, err := commonModels.CategoryAdd(self.Appid, self.Tid, self.Uid, data); err != nil {
					fmt.Println(err)
					self.AjaxMsg(err.Error(), libs.E100000)
				} else {
					self.AjaxMsg("", libs.E0)
				}
			}

		}
	} else {
		id, _ := self.GetInt64("id")

		//var err error
		if id > 0 {
			info, _ := commonModels.CategoryGetById(id, self.GetScopeLevelIds()...)
			if info.Id == 0 {
				templatePath := self.getTemplatePath()
				self.Redirect(templatePath+"hierarchylist", 302)
				self.StopRun()
			}
			self.Context["info"] = info
		} else {
			info := new(commonModels.Category)
			info.Parentid, _ = self.GetInt64("pid")
			info.State = 1
			self.Context["info"] = info
		}
		dto := new(commonModels.CategoryRequestDto)
		dto.Kind = self.Kind
		dto.ContainDisabled = true
		data, _ := commonModels.CategoryGetListBy(dto, self.GetScopeLevelIds()...)
		list := make([]*commonModels.Category, 0)
		commonModels.CategorySort(data, &list, 0)
		self.Context["list"] = list
		self.Context["pageTitle"] = "分类管理"

		self.display()
	}
}
func form2CategoryStruct(self *CategoryController) (*commonModels.Category, error) {
	Category := new(commonModels.Category)
	Category.Id = 0
	if id, err := self.GetInt64("Id"); err == nil {
		Category.Id = id
	}
	Category.Appid = self.Appid
	Category.Tid = self.Tid
	Category.Uid = self.Uid
	Category.Kind = self.Kind
	Category.Name = strings.TrimSpace(self.GetString("Name"))
	Category.Type = strings.TrimSpace(self.GetString("Type"))
	Category.Key = strings.TrimSpace(self.GetString("Key"))
	Category.Parentid, _ = self.GetInt64("Parentid")
	Category.State, _ = self.GetInt8("State")
	order, err := self.GetInt64("Order")
	if err != nil {
		order = time.Now().Unix()
	}
	Category.Order = order
	Category.CoverId, _ = self.GetInt64("CoverId")
	Category.Description = self.GetString("Description")
	Category.Parentid = 0
	if pid, err := self.GetInt64("Parentid"); err == nil {
		Category.Parentid = pid
	}
	return Category, nil
}

func (self *CategoryController) Del() {
	if !self.IsAjax() {
		self.StopRun()
	}
	id, _ := self.GetInt64("id")
	var err error
	if self.IsSoftDel {
		err = commonModels.CategorySoftDelete(id, true, self.Appid)
	} else {
		err = commonModels.CategoryDelete(id, true, self.Appid)
	}
	if err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("操作成功", libs.E0)
}
