package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiActionController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiActionController"],
        beego.ControllerComments{
            Method: "SignIn",
            Router: `/v1/action/signin`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiActionController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiActionController"],
        beego.ControllerComments{
            Method: "SignInList",
            Router: `/v1/action/signinlist`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiFileController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiFileController"],
        beego.ControllerComments{
            Method: "Upload",
            Router: `/v1/file/upload`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiSettingController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:ApiSettingController"],
        beego.ControllerComments{
            Method: "Version",
            Router: `v1/setting/version`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:DefaultController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:DefaultController"],
        beego.ControllerComments{
            Method: "GetAll",
            Router: `/`,
            AllowHTTPMethods: []string{"any"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"],
        beego.ControllerComments{
            Method: "Login",
            Router: `/v1/base/user/login`,
            AllowHTTPMethods: []string{"get","post","OPTIONS"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"],
        beego.ControllerComments{
            Method: "Orgs",
            Router: `v1/base/orgs`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"],
        beego.ControllerComments{
            Method: "Auth",
            Router: `v1/base/user/auth`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api:UserController"],
        beego.ControllerComments{
            Method: "Users",
            Router: `v1/base/users`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
