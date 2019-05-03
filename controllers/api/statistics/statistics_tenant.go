package controllers

import (
	"encoding/json"
	"fmt"
	"strings"

	apiController "yellbuy.com/YbGoCloundFramework/controllers/api"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/base"
	"yellbuy.com/YbGoCloundFramework/models/common"
)

// 管理员控制器，需进行登录授权认证
type ApiStatisticsTenantController struct {
	apiController.BaseApiController
	Model string
}

//前期准备
func (self *ApiStatisticsTenantController) Prepare() {
	self.BaseApiController.Prepare()
	self.Model = common.ModelBaseTenantName
}

// @Title 商户点赞
// @Description 进行商户点赞操作
// @Param   models     path    string  false      "统计指标分组，多个以，分割，支持的指标有：广告：base_ad，文章：base_Tenant，商家：base_tenant，租户：base_tenant，订单：base_order_info，订单明细：base_order_tenant"
// @Param   actTypes     path    string  false      "指标操作分类，多个以，分割，为空则为所有分类，支持的分类有：点击：1，点赞：2，收藏：10，购物车：30，评价：50，回复：100"
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/favior [post]
func (self *ApiStatisticsTenantController) Favior() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "租户标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeFavior
	statistics.Uid = self.Uid

	model, err := base.TenantGetById(uint(statistics.RecordId), self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Name
	statistics.ImgUrl = model.Logo
	statistics.Tid = model.Id
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 取消商户点赞
// @Description 取消商户点赞操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/favior/delete [post,put]
func (self *ApiStatisticsTenantController) FaviorCancel() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "租户标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeFavior
	statistics.Uid = self.Uid

	model, err := base.TenantGetById(uint(statistics.RecordId), self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Name
	statistics.ImgUrl = model.Logo
	statistics.Tid = model.Id
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	id, err := common.StatisticsExist(&statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	if id > 0 {
		_, err := common.StatisticsSoftDel(id, self.Appid)
		if err != nil {
			self.Fail(libs.E100000, err.Error())
		}
	}
	self.Success("ok")
}

// @Title 收藏商户
// @Description 进行商户收藏操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/collect [post]
func (self *ApiStatisticsTenantController) Collect() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	fmt.Println(statistics)
	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "租户标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeCollect
	statistics.Uid = self.Uid

	model, err := base.TenantGetById(uint(statistics.RecordId),self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Name
	statistics.ImgUrl = model.Logo
	statistics.Tid = model.Id
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 取消商户收藏
// @Description 取消商户收藏操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/collect/delete/:id [post,put]
func (self *ApiStatisticsTenantController) CollectDelete() {
	ids := strings.TrimSpace(self.GetParaString(":id"))
	if len(ids) == 0 {
		self.Fail(libs.E100000, "商品标识无效")
	}
	var dto common.StatisticsAppRequestDto
	dto.RecordIds = ids
	dto.Models = self.Model
	dto.ActType = common.ActTypeCollect
	dto.Uid = self.Uid
	dto.Appid = self.Appid
	_, err := common.StatisticsSoftDelBy(&dto)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}

// @Title 清空收藏
// @Description 清空收藏
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/collect/clear [post,put]
func (self *ApiStatisticsTenantController) CollectClear() {
	_, err := common.StatisticsClear(self.Model, common.ActTypeCollect, self.Uid, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}

// @Title 商户评论操作
// @Description 进行回复操作
// @Param   RecordId     body    string  true      "文章标识"
// @Param   Parentid     body    string  false      "回复文章为0，回复评论则为评论的的Id"
// @Param   Content     body    string  true      "评论内容"
// @Param   Pics     body    string  false      "上传图片的i值，以，分割 "
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/reply [post]
func (self *ApiStatisticsTenantController) Reply() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "租户标识RecordId无效")
	}
	if len(statistics.Content) == 0 {
		self.Fail(libs.E100000, "回复内容不能为空")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeReply
	statistics.Uid = self.Uid

	model, err := base.TenantGetById(uint(statistics.RecordId),self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Name
	statistics.ImgUrl = model.Logo
	statistics.Tid = model.Id
	statistics.Appid = model.Appid
	statistics.IsExistCheck = false
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 删除回复
// @Description 删除回复
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/base/tenant/reply/delete/:id [post,put]
func (self *ApiStatisticsTenantController) ReplyDelete() {
	id, _ := self.GetParaInt64(":id")
	if id <= 0 {
		self.Fail(libs.E100000, "回复标识无效")
	}

	_, err := common.StatisticsSoftDel(id, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}
