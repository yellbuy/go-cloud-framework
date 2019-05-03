package controllers

import (
	"encoding/json"

	apiController "yellbuy.com/YbGoCloundFramework/controllers/api"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/common"
	"yellbuy.com/YbGoCloundFramework/models/eshop"
)

// 管理员控制器，需进行登录授权认证
type ApiStatisticsOrderGoodsController struct {
	apiController.BaseApiController
	Model string
}

//前期准备
func (self *ApiStatisticsOrderGoodsController) Prepare() {
	self.BaseApiController.Prepare()
	self.Model = common.ModelEshopOrderGoodsName
}

// @Title 订单商品评价操作
// @Description 进行订单商品评论操作
// @Param   RecordId     body    string  true      "文章标识"
// @Param   Parentid     body    string  false      "回复文章为0，回复评论则为评论的的Id"
// @Param   Content     body    string  true      "评论内容"
// @Param   Pics     body    string  false      "上传图片的i值，以，分割 "
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/ordergoods/reply [post]
func (self *ApiStatisticsOrderGoodsController) Eval() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "订单商品标识RecordId无效")
	}
	if len(statistics.Content) == 0 {
		self.Fail(libs.E100000, "回复内容不能为空")
	}
	if statistics.Score <= 0 {
		self.Fail(libs.E100000, "未进行评分")
	}
	statistics.Model = self.Model
	statistics.ActType = common.ActTypeEval
	statistics.Uid = self.Uid
	//此处逻辑待处理
	model, err := eshop.GoodsGetById(statistics.RecordId, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.GoodsName
	statistics.ImgUrl = model.GoodsImg
	statistics.Tid = model.Tid
	statistics.Appid = model.Appid
	statistics.IsExistCheck = false
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 订单商品评论操作
// @Description 进行订单商品评论操作
// @Param   RecordId     body    string  true      "文章标识"
// @Param   Parentid     body    string  false      "回复文章为0，回复评论则为评论的的Id"
// @Param   Content     body    string  true      "评论内容"
// @Param   Pics     body    string  false      "上传图片的i值，以，分割 "
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/ordergoods/reply [post]
func (self *ApiStatisticsOrderGoodsController) Reply() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "商品标识RecordId无效")
	}
	if len(statistics.Content) == 0 {
		self.Fail(libs.E100000, "回复内容不能为空")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeReply
	statistics.Uid = self.Uid

	model, err := eshop.GoodsGetById(statistics.RecordId, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.GoodsName
	statistics.ImgUrl = model.GoodsImg
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
// @router v1/eshop/ordergoods/reply/delete/:id [post,put]
func (self *ApiStatisticsOrderGoodsController) ReplyDelete() {
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
