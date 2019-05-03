package main

import (
	"time"

	"yellbuy.com/YbGoCloundFramework/models"
	_ "yellbuy.com/YbGoCloundFramework/routers"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"
	cache "github.com/patrickmn/go-cache"

	"yellbuy.com/YbGoCloundFramework/utils"
)

func main() {
	models.Init()
	utils.Cache = cache.New(60*time.Minute, 120*time.Minute)
	beego.BConfig.WebConfig.AutoRender = true
	beego.BConfig.WebConfig.Session.SessionProvider = "file"
	beego.BConfig.WebConfig.Session.SessionProviderConfig = "./tmp"
	beego.InsertFilter("/api/*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type", "Authorization", "appid"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		AllowCredentials: true,
	}))

	beego.Run()
}
