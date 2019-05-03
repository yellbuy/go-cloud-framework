package controllers

import (
	// "crypto"
	// "encoding/json"
	"fmt"
	// "strings"
	// "time"

	// "github.com/astaxie/beego"
	// "yellbuy.com/YbGoCloundFramework/libs"
	// "yellbuy.com/YbGoCloundFramework/controllers/share"
	"yellbuy.com/YbGoCloundFramework/libs"
	actionModels "yellbuy.com/YbGoCloundFramework/models/common"
	// "yellbuy.com/YbGoCloundFramework/utils"
	// "log"
	// "strings"
	// "time"
)

type ApiActionController struct {
	// share.AdminBaseController
	BaseApiController
}
// @Title 签到
// @Description 签到记录添加
// @Success 200 {object} controllers.api.Response
// @Failure 404 no enough input
// @Failure 401 No Admin
// @router /v1/action/signin [get]
func (self *ApiActionController) SignIn() {
	scopeIds := make([]interface{}, 0)
	scopeIds = append(scopeIds, self.Uid)
	
		actmodel := new(actionModels.ActionLog)
		actmodel.Uid = int64(self.Uid)
	
		actmodel.Remark=self.GetString("remark")

		num, _ := actionModels.ActionLogAdd(actmodel)
		fmt.Println(num)
		if num <= 0 {
			self.Fail(libs.E100000, fmt.Sprintf("签到失败！"))
		}
	
	self.Success(nil)

}

// @Title 签到记录
// @Description 获取签到记录
// @Success 200 {object} controllers.api.Response
// @Failure 404 no enough input
// @Failure 401 No Admin
// @router /v1/action/signinlist [get]
func (self *ApiActionController) SignInList() {

	dto := new(actionModels.ActionLogRequestDto)
		dto.Key = self.GetString("key")
	
		dto.State, _ = self.GetInt8("logstate",-2)
		dto.Kind, _= self.GetInt8("logkind",-1)
		
	
	dto.PageIndex, _ = self.GetUint32("pageIndex")
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	scopeIds := make([]interface{}, 0)
	scopeIds = append(scopeIds, self.Uid)
	list, num, err := actionModels.ActionLogGetList(dto,"","",scopeIds)
	if(err!=nil){
		self.Fail(libs.E100000, fmt.Sprintf("获取记录失败！"))
	}
	
	fmt.Println(num)
	
	self.Success(list)

}
