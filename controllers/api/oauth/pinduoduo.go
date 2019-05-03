/**********************************************
** @Des: 管理员
** @Author: cheguoyong
** @Date:   2017-09-16 14:17:37
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-17 11:14:07
***********************************************/
package controllers

import (
	"fmt"

	"github.com/astaxie/beego"
	// "errors"

	"strconv"
	"strings"

	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/libs/oauth"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"

	// cache "github.com/patrickmn/go-cache"
	"yellbuy.com/YbGoCloundFramework/controllers/share"
)

type PinduoduoController struct {
	share.AdminBaseController
}

func (self *PinduoduoController) display(tpl ...string) {
	var tplname string
	if len(tpl) > 0 {
		tplname = strings.Join([]string{tpl[0], "html"}, ".")
	} else {
		_, actionName := self.GetControllerAndAction()
		tplname = "oauth/pinduoduo/" + strings.ToLower(actionName) + ".html"
	}
	self.Display(tplname)
}

// 获取相关参数配置
func getPddConfig(userId uint) (clientId, clientSecret, redirectUri string) {
	domain := beego.AppConfig.String("domain")
	clientId = beego.AppConfig.String("pdd::client_id")
	clientSecret = beego.AppConfig.String("pdd::client_secret")
	redirectUri = fmt.Sprint("%v/pinduoduo/oauth&state=%v", clientId, domain, userId)
	return clientId, clientSecret, redirectUri
}
func (self *PinduoduoController) Login() {
	clientId, _, redirectUri := getPddConfig(self.Uid)
	oauthUrl := fmt.Sprint("https://mms.pinduoduo.com/open.html?response_type=code&client_id=%v&redirect_uri=%v&state=%v", clientId, redirectUri, self.Uid)
	self.Redirect(oauthUrl, 302)
	self.StopRun()
}

func (self *PinduoduoController) OAuth() {
	code := self.GetString("code")
	if len(code) == 0 {
		self.AjaxMsg("code参数错误", libs.E100000)
	}
	userId, err := self.GetInt("state")
	if err != nil || userId <= 0 {
		self.AjaxMsg("state参数错误", libs.E100000)
	}
	clientId, clientSecret, redirectUri := getPddConfig(uint(userId))
	pddToken, body, err := oauth.PddPostToken(clientId, clientSecret, code, redirectUri, strconv.Itoa(userId))
	oauthToken := new(commonModels.OauthToken)
	oauthToken.Kind = oauth.KIND_PDD
	oauthToken.AccessToken = pddToken.AccessToken
	oauthToken.RefreshToken = pddToken.RefreshToken
	oauthToken.OwnerId = pddToken.OwnerId
	oauthToken.OwnerName = pddToken.OwnerName
	oauthToken.ExpiresIn = pddToken.ExpiresIn
	oauthToken.TokenJson = body
	oauthToken.Uid = userId
	oauthToken.Tid = self.Tid
	oauthToken.Appid = self.Appid
	err = commonModels.OauthTokenSave(oauthToken)
	if err != nil {
		self.AjaxMsg(err.Error(), libs.E100000)
	}
	self.AjaxMsg("ok", libs.E0)
}