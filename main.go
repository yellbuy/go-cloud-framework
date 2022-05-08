package main

import (
	"fmt"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"
	"github.com/astaxie/beego/toolbox"
	cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbCloudFramework/models"
	"yellbuy.com/YbCloudFramework/models/jobs"
	_ "yellbuy.com/YbCloudFramework/routers"
	"yellbuy.com/YbCloudFramework/utils"
)

func main() {
	fmt.Println("run")
	jobs.Init()
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
	beego.InsertFilter("/static/*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type", "Authorization", "appid"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		AllowCredentials: true,
	}))

	toolbox.StartTask()
	defer toolbox.StopTask()

	beego.Run()
}
