package routers

import (
	"github.com/astaxie/beego"
	"yellbuy.com/YbGoCloundFramework/controllers"
	api_controllers "yellbuy.com/YbGoCloundFramework/controllers/api"
	base_controllers "yellbuy.com/YbGoCloundFramework/controllers/base"
	common_controllers "yellbuy.com/YbGoCloundFramework/controllers/common"
	wuliu_controllers "yellbuy.com/YbGoCloundFramework/controllers/wuliu"
)

func init() {
	// 默认首页

	//appname := beego.AppConfig.String("app.name")
	beego.Router("/", &controllers.AdminController{}, "*:Index")
	beego.Router("/admin/ajaxmenu", &controllers.AdminController{}, "*:AjaxMenu")
	beego.Router("/login", &controllers.LoginController{}, "*:LoginIn")
	beego.Router("/login_out", &controllers.LoginController{}, "*:LoginOut")
	beego.Router("/no_auth", &controllers.LoginController{}, "*:NoAuth")

	beego.Router("/home", &controllers.HomeController{}, "*:Index")

	beego.AutoPrefix("/base", &base_controllers.OrgController{})
	beego.AutoPrefix("/base", &base_controllers.UserController{})
	beego.AutoPrefix("/base", &base_controllers.CustomerController{})
	beego.AutoPrefix("/base", &base_controllers.AuthController{})
	beego.AutoPrefix("/base", &base_controllers.RoleController{})
	beego.AutoPrefix("/base", &base_controllers.PermissionController{})
	beego.AutoPrefix("/base", &base_controllers.AppController{})
	beego.AutoPrefix("/base", &base_controllers.TenantController{})
	beego.AutoPrefix("/base", &base_controllers.EditionController{})

	beego.AutoPrefix("/common", &common_controllers.CommonDataController{})
	beego.AutoPrefix("/common", &common_controllers.AreaController{})

	beego.AutoPrefix("/common", &common_controllers.SettingController{})
	// beego.AutoPrefix("/common", &common_controllers.SettingSysController{})
	// beego.AutoPrefix("/common", &common_controllers.SettingAppController{})
	// beego.AutoPrefix("/common", &common_controllers.SettingUserController{})
	// beego.AutoPrefix("/common", &common_controllers.SettingTenantController{})
	// beego.AutoPrefix("/common", &common_controllers.SetConfigController{})
	// beego.AutoPrefix("/common", &common_controllers.SetConfigSysController{})
	// beego.AutoPrefix("/common", &common_controllers.SetConfigAppController{})
	// beego.AutoPrefix("/common", &common_controllers.SetConfigUserController{})
	// beego.AutoPrefix("/common", &common_controllers.SetConfigTenantController{})
	beego.AutoPrefix("/common", &common_controllers.SmsController{})
	beego.AutoPrefix("/common", &common_controllers.ActionLogController{})
	beego.AutoPrefix("/common", &common_controllers.ActionController{})
	beego.AutoPrefix("/common", &common_controllers.EditorController{})

	beego.AutoPrefix("/wuliu", &wuliu_controllers.ShippingController{})
	beego.AutoPrefix("/wuliu", &wuliu_controllers.AddressController{})

	// 测试地址
	beego.AutoPrefix("/api/test", &api_controllers.DefaultController{})
	// api控制器
	ns := beego.NewNamespace("/api",
		beego.NSInclude(
			&api_controllers.UserController{},

			&api_controllers.ApiFileController{},
			&api_controllers.ApiActionController{},
		),
	)
	beego.AddNamespace(ns)

	// beego.AutoRouter(&controllers.UserController{})
	// beego.AutoRouter(&controllers.AdminController{})
	//beego.SetStaticPath("/swagger", "swagger")
	//beego.SetStaticPath("/static", "static")
}
