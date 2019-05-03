package controllers

import (
	"encoding/json"
	"strings"

	apiController "yellbuy.com/YbGoCloundFramework/controllers/api"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/common"
	"yellbuy.com/YbGoCloundFramework/models/eshop"
)

// 管理员控制器，需进行登录授权认证
type ApiStatisticsGoodsController struct {
	apiController.BaseApiController
	Model string
}

//前期准备
func (self *ApiStatisticsGoodsController) Prepare() {
	self.BaseApiController.Prepare()
	self.Model = common.ModelEshopGoodsName
}

// @Title 点赞
// @Description 进行点赞操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/favior [post]
func (self *ApiStatisticsGoodsController) Favior() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "商品标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeFavior
	statistics.Uid = self.Uid

	model, err := eshop.GoodsGetById(statistics.RecordId, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.GoodsName
	statistics.ImgUrl = model.GoodsImg
	statistics.Tid = model.Tid
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	common.JobQueue.Add(&statistics)
}

// @Title 取消点赞
// @Description 取消点赞操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/favior/delete [post,put]
func (self *ApiStatisticsGoodsController) FaviorCancel() {
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

// @Title 购物车商品列表
// @Description 查询当前登录用户的购物车商品列表
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/cart [get]
func (self *ApiStatisticsGoodsController) Carts() {
	goodsList := make([]*eshop.Goods, 0)

	var requestDto common.StatisticsAppRequestDto
	requestDto.Models = common.ModelEshopGoodsName
	requestDto.ActType = common.ActTypeCart
	requestDto.Uid = self.Uid
	requestDto.Appid = self.Appid
	requestDto.Fields = "record_id"
	requestDto.PageSize = 100
	list, err := common.StatisticsGetAppList(&requestDto)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	idMap := make(map[int64]common.StatisticsAppResponseDto)
	ids := make([]int64, 0)
	for _, val := range list {
		if val.RecordId > 0 {
			idMap[val.RecordId] = val
			ids = append(ids, val.RecordId)
		}
	}
	if len(ids) == 0 {
		self.Success(goodsList)
	}
	goodsList, err = eshop.GoodsLoadList(ids, self.Appid)

	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	res := make([]*eshop.Goods, 0)
	for _, val := range goodsList {
		//绑定购买数量和规格
		if stat, ok := idMap[val.Id]; ok {
			if val.IsOnSale > 0 {
				val.BuyNum = stat.Num
				if val.BuyNum < 1 {
					val.BuyNum = 1
				}
				val.Spec = stat.Content
				val.GoodsSpec = strings.TrimSpace(val.GoodsSpec)
				if val.GoodsSpec != "" {
					val.GoodsSpecList = strings.Split(val.GoodsSpec, ",")
				}
				res = append(res, val)
			}
		}
	}
	self.Success(res)
}

// @Title 添加到购物车
// @Description 进行添加到购物车操作
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/cart [post]
func (self *ApiStatisticsGoodsController) Cart() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "商品标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeCart
	statistics.Uid = self.Uid

	model, err := eshop.GoodsGetById(statistics.RecordId, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.GoodsName
	statistics.ImgUrl = model.GoodsImg
	statistics.Tid = model.Tid
	statistics.Appid = model.Appid
	statistics.IsExistCheck = true
	common.JobQueue.Add(&statistics)

	self.Success("ok")
}

// @Title 删除购物车指定商品
// @Description 删除购物车指定商品，如果多个商品，以字符‘,’分割
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/cart/delete/:id [post,put]
func (self *ApiStatisticsGoodsController) CartDelete() {
	ids := strings.TrimSpace(self.GetParaString(":id"))
	if len(ids) == 0 {
		self.Fail(libs.E100000, "商品标识无效")
	}
	var dto common.StatisticsAppRequestDto
	dto.RecordIds = ids
	dto.Models = common.ModelEshopGoodsName
	dto.ActType = common.ActTypeCart
	dto.Uid = self.Uid
	dto.Appid = self.Appid
	_, err := common.StatisticsSoftDelBy(&dto)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}

// @Title 清空购物车
// @Description 清空购物车
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/cart/delete [post,put]
func (self *ApiStatisticsGoodsController) CartClear() {
	_, err := common.StatisticsClear(self.Model, common.ActTypeCart, self.Uid, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	self.Success("ok")
}

// @Title 收藏
// @Description 进行收藏操作
// @Param   models     path    string  false      "统计指标分组，多个以，分割，支持的指标有：广告：eshop_ad，文章：eshop_Goods，商家：base_tenant，商品：eshop_goods，订单：eshop_order_info，订单明细：eshop_order_goods"
// @Param   actTypes     path    string  false      "指标操作分类，多个以，分割，为空则为所有分类，支持的分类有：点击：1，点赞：2，收藏：10，购物车：30，评价：50，回复：100"
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/collect [post]
func (self *ApiStatisticsGoodsController) Collect() {
	var statistics common.Statistics
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &statistics)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if statistics.RecordId <= 0 {
		self.Fail(libs.E100000, "商品标识RecordId无效")
	}

	statistics.Model = self.Model
	statistics.ActType = common.ActTypeCollect
	statistics.Uid = self.Uid

	model, err := eshop.GoodsGetById(statistics.RecordId, self.Appid)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}
	statistics.Title = model.GoodsName
	statistics.ImgUrl = model.GoodsImg
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
// @router v1/eshop/goods/collect/delete/:id [post,put]
func (self *ApiStatisticsGoodsController) CollectDelete() {
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
// @router v1/eshop/goods/collect/delete [post,put]
func (self *ApiStatisticsGoodsController) CollectClear() {
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
// @router v1/eshop/goods/reply [post]
func (self *ApiStatisticsGoodsController) Reply() {
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
// @router v1/eshop/goods/reply/delete/:id [post,put]
func (self *ApiStatisticsGoodsController) ReplyDelete() {
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
