package controllers

import (
	"encoding/json"
	"strings"

	apiController "yellbuy.com/YbGoCloundFramework/controllers/api"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/cms"
	"yellbuy.com/YbGoCloundFramework/models/common"
)

// 管理员控制器，需进行登录授权认证
type ApiStatisticsArticleController struct {
	apiController.BaseApiController
	Model string
	//// 广告 ModelEshopAdName = "eshop_ad"
	// 文章 ModelCmsArticleName = "cms_article"
	// 商家 ModelBaseTenantName = "base_tenant"
	// 商品 ModelEshopGoodsName = "eshop_goods"
	// 订单 ModelEshopOrderName = "eshop_order_info"
	// 订单明细 ModelEshopOrderGoodsName = "eshop_order_goods"

}

//前期准备
func (self *ApiStatisticsArticleController) Prepare() {
	self.BaseApiController.Prepare()
	self.Model = common.ModelCmsArticleName
}

// @Title 点赞
// @Description 进行点赞操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/cms/article/favior [post]
func (self *ApiStatisticsArticleController) Favior() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "文章标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeFavior
	statistics.Uid = self.Uid

	model, err := cms.ArticleGetBy(self.Appid, statistics.RecordId)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Title
	statistics.ImgUrl = model.ImgUrl
	statistics.Tid = model.Tid
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 取消点赞
// @Description 取消点赞操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/cms/article/favior/delete [post,put]
func (self *ApiStatisticsArticleController) FaviorDelete() {
	var reqDto common.StatisticsAppRequestDto
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &reqDto)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if reqDto.RecordId <= 0 {
		self.Fail(libs.E100000, "商品标识RecordId无效")
	}

	reqDto.Models = self.Model
	reqDto.ActType = common.ActTypeFavior
	reqDto.Uid = self.Uid
	_, err = common.StatisticsSoftDelBy(&reqDto)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}

// @Title 收藏
// @Description 进行收藏操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/cms/article/collect [post]
func (self *ApiStatisticsArticleController) Collect() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "文章标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeCollect
	statistics.Uid = self.Uid

	model, err := cms.ArticleGetBy(self.Appid, statistics.RecordId)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Title
	statistics.ImgUrl = model.ImgUrl
	statistics.Tid = model.Tid
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 取消收藏
// @Description 取消收藏操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/cms/article/collect/delete/:id [post,put]
func (self *ApiStatisticsArticleController) CollectDelete() {
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
// @router v1/cms/article/collect/delete [post,put]
func (self *ApiStatisticsArticleController) CollectClear() {
	_, err := common.StatisticsClear(self.Model, common.ActTypeCollect, self.Uid, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}

// @Title 回复操作
// @Description 进行回复操作
// @Param   RecordId     body    string  true      "文章标识"
// @Param   Parentid     body    string  false      "回复文章为0，回复评论则为评论的的Id"
// @Param   Content     body    string  true      "评论内容"
// @Param   Pics     body    string  false      "上传图片的i值，以，分割 "
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/cms/article/reply [post]
func (self *ApiStatisticsArticleController) Reply() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "文章标识RecordId无效")
	}
	if len(statistics.Content) == 0 {
		self.Fail(libs.E100000, "回复内容不能为空")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeCollect
	statistics.Uid = self.Uid

	model, err := cms.ArticleGetBy(self.Appid, statistics.RecordId)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.Title
	statistics.ImgUrl = model.ImgUrl
	statistics.Tid = model.Tid
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
// @router v1/cms/article/reply/delete/:id [post,put]
func (self *ApiStatisticsArticleController) ReplyDelete() {
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
