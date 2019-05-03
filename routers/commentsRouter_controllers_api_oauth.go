package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiAvatarController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiAvatarController"],
        beego.ControllerComments{
            Method: "AvatarTenant",
            Router: `v1/avatar/tenant/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiAvatarController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiAvatarController"],
        beego.ControllerComments{
            Method: "AvatarUser",
            Router: `v1/avatar/user/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiWeixinController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiWeixinController"],
        beego.ControllerComments{
            Method: "OAuth",
            Router: `v1/oauth/weixin/login`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiWeixinController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/oauth:ApiWeixinController"],
        beego.ControllerComments{
            Method: "Pay",
            Router: `v1/oauth/weixin/pay`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
