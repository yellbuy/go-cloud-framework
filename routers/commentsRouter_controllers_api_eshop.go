package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"],
        beego.ControllerComments{
            Method: "CouponActivities",
            Router: `v1/eshop/activity/coupon`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"],
        beego.ControllerComments{
            Method: "GoodsActivities",
            Router: `v1/eshop/activity/goods`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"],
        beego.ControllerComments{
            Method: "Prepay",
            Router: `v1/eshop/activity/prepay`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiActivityController"],
        beego.ControllerComments{
            Method: "CouponCount",
            Router: `v1/eshop/coupon/count`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdController"],
        beego.ControllerComments{
            Method: "Ads",
            Router: `v1/eshop/ads`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"],
        beego.ControllerComments{
            Method: "PostGoods",
            Router: `v1/eshop/goods/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"],
        beego.ControllerComments{
            Method: "PutGoods",
            Router: `v1/eshop/goods/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"],
        beego.ControllerComments{
            Method: "PostTenant",
            Router: `v1/eshop/tenant/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAdminController"],
        beego.ControllerComments{
            Method: "PutTenant",
            Router: `v1/eshop/tenant/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAreaController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAreaController"],
        beego.ControllerComments{
            Method: "AreaGroup",
            Router: `v1/eshop/area/group`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAreaController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiAreaController"],
        beego.ControllerComments{
            Method: "AreaTree",
            Router: `v1/eshop/area/tree`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiGoodsController"],
        beego.ControllerComments{
            Method: "CategoryList",
            Router: `v1/eshop/category`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiGoodsController"],
        beego.ControllerComments{
            Method: "GoodsList",
            Router: `v1/eshop/goods`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiGoodsController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiGoodsController"],
        beego.ControllerComments{
            Method: "Goods",
            Router: `v1/eshop/goods/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PostArticle",
            Router: `/v1/cms/article/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PutArticle",
            Router: `/v1/cms/article/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "DeleteArticle",
            Router: `/v1/cms/article/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PutAddress",
            Router: `/v1/eshop/address/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PutAddressDefault",
            Router: `/v1/eshop/address/default/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "DeleteAddress",
            Router: `/v1/eshop/address/delete/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PutAddressTop",
            Router: `/v1/eshop/address/top/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "Profile",
            Router: `v1/base/user/profile`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PutProfile",
            Router: `v1/base/user/profile/`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "Addresses",
            Router: `v1/eshop/address`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PostAddress",
            Router: `v1/eshop/address/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "Address",
            Router: `v1/eshop/address/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "PostCoupon",
            Router: `v1/eshop/coupon/:id`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiMemberController"],
        beego.ControllerComments{
            Method: "Coupons",
            Router: `v1/eshop/coupons`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "PostOrder",
            Router: `/v1/eshop/order`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "CalcOrder",
            Router: `/v1/eshop/order/calc`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "PutOrderCancel",
            Router: `/v1/eshop/order/cancel/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "PutOrderEval",
            Router: `/v1/eshop/order/eval/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "PutOrderReceive",
            Router: `/v1/eshop/order/receive/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "PutOrderReset",
            Router: `/v1/eshop/order/reset/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "Orders",
            Router: `v1/eshop/order`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiOrderController"],
        beego.ControllerComments{
            Method: "OrderStat",
            Router: `v1/eshop/order/statistics`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"],
        beego.ControllerComments{
            Method: "PostTenant",
            Router: `v1/eshop/tenant/`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"],
        beego.ControllerComments{
            Method: "Tenant",
            Router: `v1/eshop/tenant/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"],
        beego.ControllerComments{
            Method: "Tenants",
            Router: `v1/eshop/tenants`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/eshop:ApiTenantController"],
        beego.ControllerComments{
            Method: "PutTenant",
            Router: `v1/rhjj/tenant/:id`,
            AllowHTTPMethods: []string{"post","put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
