// app管理

package controllers
import (
	"strings"
		"fmt"
		// "time"
			// "errors"
			// "strconv"
	"yellbuy.com/YbCloudDataApi/controllers/share"
	"yellbuy.com/YbCloudDataApi/libs"
	baseModels "yellbuy.com/YbCloudDataApi/models/base"
	commonModels "yellbuy.com/YbCloudDataApi/models/common"
)
type EditionController struct {
	share.AdminBaseController
}
//加载模板
func (self *EditionController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "base/edition/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}
func (self *EditionController) EditionList() {
	if self.IsAjax() {
		key := self.GetString("key")
		// rangetime:= self.GetString("rangetime")
		appstate, err := self.GetInt8("appstate",-2)
		appmode, err := self.GetInt8("appmode",0)
		page, err := self.GetUint32("page")
		if err != nil || page == 0 {
			page = 1
		}
		level,_:= self.GetInt8("level",0)
		limit, err := self.GetUint32("limit")
		if err != nil || limit == 0 {
			limit = 30
		}
		// var starttime string =""
		// var endtime string=""
		// if len(rangetime)>0{
		// sp:=strings.Split(rangetime,"到")
		// starttime=sp[0]
		// endtime=sp[1]
		// }
		
		//列表
	
		// EditionGetList(appid uint, tid uint, key string, starttime string,endtime string, appstate,appmode int8, page, pagesize uint32) ([]*Edition, int64, error) {
	// list := make([]*Edition, 0)
		 list,total,_ := baseModels.EditionGetList(self.Appid, self.Tid, key,level, appstate,appmode , page-1, limit)

		self.AjaxList("成功", libs.E0, total, list)
	} else {
		// cont, _ := baseModels.EditionGetList(self.Appid, self.Tid, 0)
		// self.Context["allowAdd"] = cont == 0
		self.Context["pageTitle"] = "EDITION管理"
		self.display()
	}
}
func (self *EditionController) EditionEdit() {
	id,_:=self.GetInt64("id")
	if self.Ctx.Input.IsPost(){
		if form, err := form2edition(self, id); err != nil {
			self.AjaxMsg(err.Error(), libs.E100000)
			self.StopRun()
		} else {
			if err := baseModels.EditionUpdate( form); err != nil {
				fmt.Println(err)
				self.AjaxMsg(err.Error(), libs.E100000)
			} else {
				self.AjaxMsg("", libs.E0)
			}
		}

	}else{
		
		var mode *baseModels.Edition
		if id>0{
         mode,_=  baseModels.EditionGetById(id)
		}
		provinceList, _ := commonModels.GetAreaList(0, 0)
		self.Context["provinceList"] = provinceList
		self.Context["pageTitle"] = "Edtion编辑"
		self.Context["info"] =mode
		self.display()
	}

}
func form2edition(self *EditionController,id int64) (*baseModels.Edition,error){
	form := new(baseModels.Edition)
	form.Id = id
	form.Name = strings.TrimSpace(self.GetString("Name"))
	form.Mode,_ = self.GetInt8("appmode")
	form.State, _ = self.GetInt8("appstate")	
	form.Remark=strings.TrimSpace(self.GetString("Remark"))
	form.Level,_= self.GetInt8("Level")
	form.Limit,_= self.GetInt64("Limit")
	form.Order,_=self.GetInt64("Order")
	form.Kind,_= self.GetInt8("Kind")
	// form.Postcode = strings.TrimSpace(self.GetString("Postcode"))
	// form.Addr = strings.TrimSpace(self.GetString("Addr"))
	// form.Idno = strings.TrimSpace(self.GetString("Idno"))
	// form.Idname = strings.TrimSpace(self.GetString("Idname"))
	price,_ := self.GetFloat("Price")
	form.Price=float32(price)
	// IsDefault, _ := self.GetInt8("IsDefault")
	// form.IsDefault = IsDefault

	
	// form.UserId = self.Uid


	return form, nil
}
