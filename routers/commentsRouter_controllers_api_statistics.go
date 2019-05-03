package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "Collect",
            Router: `v1/cms/article/collect`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "CollectClear",
            Router: `v1/cms/article/collect/delete`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "CollectDelete",
            Router: `v1/cms/article/collect/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "Favior",
            Router: `v1/cms/article/favior`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "FaviorDelete",
            Router: `v1/cms/article/favior/delete`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "Reply",
            Router: `v1/cms/article/reply`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsArticleController"],
        beego.ControllerComments{
            Method: "ReplyDelete",
            Router: `v1/cms/article/reply/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "Tenant",
            Router: `v1/tenant/profile`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "UserClick",
            Router: `v1/user/profile/click`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "UserCollect",
            Router: `v1/user/profile/collect`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "UserEval",
            Router: `v1/user/profile/eval`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "UserFavior",
            Router: `v1/user/profile/favior`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "UserReply",
            Router: `v1/user/profile/reply`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsController"],
        beego.ControllerComments{
            Method: "User",
            Router: `v1/user/profile/statistics`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "Carts",
            Router: `v1/eshop/goods/cart`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "Cart",
            Router: `v1/eshop/goods/cart`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "CartClear",
            Router: `v1/eshop/goods/cart/delete`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "CartDelete",
            Router: `v1/eshop/goods/cart/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "Collect",
            Router: `v1/eshop/goods/collect`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "CollectClear",
            Router: `v1/eshop/goods/collect/delete`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "CollectDelete",
            Router: `v1/eshop/goods/collect/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "GoodsEval",
            Router: `v1/eshop/goods/eval/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "Favior",
            Router: `v1/eshop/goods/favior`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "FaviorCancel",
            Router: `v1/eshop/goods/favior/delete`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "Reply",
            Router: `v1/eshop/goods/reply`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsGoodsController"],
        beego.ControllerComments{
            Method: "ReplyDelete",
            Router: `v1/eshop/goods/reply/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsOrderGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsOrderGoodsController"],
        beego.ControllerComments{
            Method: "Eval",
            Router: `v1/eshop/ordergoods/reply`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsOrderGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsOrderGoodsController"],
        beego.ControllerComments{
            Method: "Reply",
            Router: `v1/eshop/ordergoods/reply`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsOrderGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsOrderGoodsController"],
        beego.ControllerComments{
            Method: "ReplyDelete",
            Router: `v1/eshop/ordergoods/reply/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "Collect",
            Router: `v1/base/tenant/collect`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "CollectClear",
            Router: `v1/base/tenant/collect/clear`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "CollectDelete",
            Router: `v1/base/tenant/collect/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "Favior",
            Router: `v1/base/tenant/favior`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "FaviorCancel",
            Router: `v1/base/tenant/favior/delete`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "Reply",
            Router: `v1/base/tenant/reply`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/statistics:ApiStatisticsTenantController"],
        beego.ControllerComments{
            Method: "ReplyDelete",
            Router: `v1/base/tenant/reply/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
