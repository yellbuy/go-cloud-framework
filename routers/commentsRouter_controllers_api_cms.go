package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiArticleController"],
        beego.ControllerComments{
            Method: "ArticleList",
            Router: `/v1/cms/article`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiArticleController"],
        beego.ControllerComments{
            Method: "Article",
            Router: `/v1/cms/article/:id`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiArticleController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiArticleController"],
        beego.ControllerComments{
            Method: "Articles",
            Router: `v1/cms/articles`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiCategoryController"] = append(beego.GlobalControllerRouter["yellbuy.com/YbGoCloundFramework/controllers/api/cms:ApiCategoryController"],
        beego.ControllerComments{
            Method: "CategoryList",
            Router: `v1/cms/category`,
            AllowHTTPMethods: []string{"get"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
