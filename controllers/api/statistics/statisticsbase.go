package controllers

import (
	"fmt"
	"strings"

	apiController "yellbuy.com/YbGoCloundFramework/controllers/api"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/common"
)

// 管理员控制器，需进行登录授权认证
type ApiStatisticsController struct {
	apiController.CommonApiController
	Model string
}

//前期准备
func (self *ApiStatisticsController) Prepare() {
	self.CommonApiController.Prepare()
}

// @Title 个人中心查询用户自身的统计结果
// @Description 查询统计结果
// @Param   uid     path    uint  false "指定的用户标识，未指定则为当前用户"
// @Param   models     path    string  false      "统计指标分组，多个以，分割，支持的指标有：广告：eshop_ad；文章：cms_article；商家：base_tenant；商品：eshop_goods；订单：eshop_order_info；订单明细：eshop_order_goods"
// @Param   actTypes     path    string  false      "指标操作分类，多个以，分割，为空则为所有分类，支持的分类有：点击：1；点赞：2；收藏：10；购物车：20；评价：50；回复：100；定位：200"
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/user/profile/statistics [get]
func (self *ApiStatisticsController) User() {
	// 未登陆
	uid, _ := self.GetUint("uid")
	if uid == 0 {
		uid = self.Uid
	}
	// 未登陆
	if self.Uid == 0 {
		var list []common.StatisticsDataResponseDto
		self.Success(list)
	}
	var dto = new(common.StatisticsDataRequestDto)
	dto.Models = strings.TrimSpace(self.GetString("models"))
	dto.ActTypes = strings.TrimSpace(self.GetString("actTypes"))
	if len(dto.ActTypes) == 0 {
		dto.ActTypes = fmt.Sprintf("%v,%v,%v,%v,%v,%v", common.ActTypeClick, common.ActTypeFavior, common.ActTypeCollect, common.ActTypeCart, common.ActTypeEval, common.ActTypeReply)
	}
	dto.Appid = self.Appid
	dto.Uid = self.Uid
	dto.GroupFields = "act_type"
	list, err := common.StatisticsGetValues(dto)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 个人中心查询用户自身的足迹列表
// @Description 个人中心查询用户自身的足迹列表
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/user/profile/click [get]
func (self *ApiStatisticsController) UserClick() {
	// 未登陆
	if self.Uid == 0 {
		self.Success(nil)
	}

	var dto = new(common.StatisticsAppRequestDto)
	dto.PageIndex, _ = self.GetUint32("pageIndex", 0)
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	dto.Models = fmt.Sprintf("%v,%v,%v", common.ModelCmsArticleName, common.ModelEshopGoodsName, common.ModelBaseTenantName)
	dto.ActType = common.ActTypeClick
	dto.Appid = self.Appid
	dto.Uid = self.Uid
	list, err := common.StatisticsGetAppList(dto)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 个人中心查询用户自身的收藏列表
// @Description 个人中心查询用户自身的收藏列表
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/user/profile/collect [get]
func (self *ApiStatisticsController) UserCollect() {
	// 未登陆
	if self.Uid == 0 {
		self.Success(nil)
	}
	var dto = new(common.StatisticsAppRequestDto)
	dto.PageIndex, _ = self.GetUint32("pageIndex", 0)
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	dto.Models = fmt.Sprintf("%v,%v,%v", common.ModelCmsArticleName, common.ModelEshopGoodsName, common.ModelBaseTenantName)
	dto.ActType = common.ActTypeCollect
	dto.Appid = self.Appid
	dto.Uid = self.Uid
	list, err := common.StatisticsGetAppList(dto)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 个人中心查询用户自身的点赞列表
// @Description 个人中心查询用户自身的点赞列表
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/user/profile/favior [get]
func (self *ApiStatisticsController) UserFavior() {
	// 未登陆
	if self.Uid == 0 {
		self.Success(nil)
	}
	var dto = new(common.StatisticsAppRequestDto)
	dto.PageIndex, _ = self.GetUint32("pageIndex", 0)
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	dto.Models = fmt.Sprintf("%v,%v,%v", common.ModelCmsArticleName, common.ModelEshopGoodsName, common.ModelBaseTenantName)
	dto.ActType = common.ActTypeFavior
	dto.Appid = self.Appid
	dto.Uid = self.Uid
	list, err := common.StatisticsGetAppList(dto)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 个人中心查询用户自身的评论列表
// @Description 个人中心查询用户自身的评论列表
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/user/profile/reply [get]
func (self *ApiStatisticsController) UserReply() {
	// 未登陆
	if self.Uid == 0 {
		self.Success(nil)
	}
	var dto = new(common.StatisticsAppRequestDto)
	dto.PageIndex, _ = self.GetUint32("pageIndex", 0)
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	dto.Models = fmt.Sprintf("%v,%v,%v", common.ModelCmsArticleName, common.ModelEshopGoodsName, common.ModelBaseTenantName)
	dto.ActType = common.ActTypeReply
	dto.Appid = self.Appid
	dto.Uid = self.Uid
	list, err := common.StatisticsGetAppList(dto)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 商品评价列表
// @Description 查询指定商品标识的商品评价列表
// @Success 0 {array} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/eshop/goods/eval/:id [get]
func (self *ApiStatisticsGoodsController) GoodsEval() {
	goodsId, err := self.GetParaInt64(":id")
	if err != nil || goodsId <= 0 {
		fmt.Println(err)
		self.Success(nil)
	}
	var dto = new(common.StatisticsAppRequestDto)
	dto.PageIndex, _ = self.GetUint32("pageIndex", 0)
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	dto.Models = fmt.Sprintf("%v", common.ModelEshopGoodsName)
	dto.ActType = common.ActTypeEval
	dto.Appid = self.Appid
	dto.Uid = 0
	dto.RecordId = goodsId
	list, err := common.StatisticsGetAppList(dto)

	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 个人中心查询用户自身的评价列表
// @Description 个人中心查询用户自身的评价列表
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/user/profile/eval [get]
func (self *ApiStatisticsController) UserEval() {
	// 未登陆
	if self.Uid == 0 {
		self.Success(nil)
	}
	var dto = new(common.StatisticsAppRequestDto)
	dto.PageIndex, _ = self.GetUint32("pageIndex", 0)
	dto.PageSize, _ = self.GetUint32("pageSize", 10)
	dto.Models = fmt.Sprintf("%v", common.ModelEshopGoodsName)
	dto.ActType = common.ActTypeEval
	dto.Appid = self.Appid
	dto.Uid = self.Uid
	list, err := common.StatisticsGetAppList(dto)

	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}

// @Title 商家查询自身的统计结果
// @Description 查询统计结果
// @Param   models     path    string  false      "统计指标分组，多个以，分割，支持的指标有：广告：eshop_ad，文章：cms_article，商家：base_tenant，商品：eshop_goods，订单：eshop_order_info，订单明细：eshop_order_goods"
// @Param   actTypes     path    string  false      "指标操作分类，多个以，分割，为空则为所有分类，支持的分类有：点击：1，点赞：2，收藏：10，购物车：30，评价：50，回复：100"
// @Success 0 {array} common.Statistics
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/tenant/profile [get]
func (self *ApiStatisticsController) Tenant() {
	// 未登陆
	if self.Uid == 0 {
		var list []common.StatisticsDataResponseDto
		self.Success(list)
	}
	var dto = new(common.StatisticsDataRequestDto)
	dto.Models = strings.TrimSpace(self.GetString("models"))
	dto.ActTypes = strings.TrimSpace(self.GetString("actTypes"))
	if len(dto.ActTypes) == 0 {
		dto.ActTypes = fmt.Sprintf("%v,%v,%v,%v,%v,%v", common.ActTypeClick, common.ActTypeFavior, common.ActTypeCollect, common.ActTypeCart, common.ActTypeEval, common.ActTypeReply)
	}
	dto.Appid = self.Appid
	dto.Tid = self.Tid
	list, err := common.StatisticsGetValues(dto)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	self.Success(list)
}
