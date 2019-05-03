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
	"time"

	"github.com/astaxie/beego"

	"errors"

	"encoding/json"

	apiController "yellbuy.com/YbGoCloundFramework/controllers/api"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/libs/oauth"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
	"yellbuy.com/YbGoCloundFramework/models/weixin"
	"yellbuy.com/YbGoCloundFramework/utils"
	// cache "github.com/patrickmn/go-cache"
)

type ApiWeixinController struct {
	apiController.CommonApiController
}

// @Title 微信授权，获取session
// @Description 微信授权，获取session
// @Success 0 {object} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/oauth/weixin/login [post]
func (self *ApiWeixinController) OAuth() {
	//https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.code2Session.html
	wxUser := new(weixin.WxUser)
	//fmt.Println(string(self.Ctx.Input.RequestBody))
	err := json.Unmarshal(self.Ctx.Input.RequestBody, wxUser)
	if err != nil {
		self.Fail(libs.E100000, err.Error())
	}

	if wxUser.Code == "" {
		self.Fail(libs.E100000, "code参数错误")
	}
	fmt.Println(wxUser)
	//应用级别的设置
	settings, err := commonModels.SettingLoadFor(self.Appid, 0, 0)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	wxGroupKey := "CONFIG_GROUP_WEIXIN"
	appid, err := commonModels.SettingGetValueFor(settings, wxGroupKey, "wx_AppID")
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	} else if appid == "" {
		self.Fail(libs.E100000, "微信appid未配置")
	}
	secret, err := commonModels.SettingGetValueFor(settings, wxGroupKey, "wx_AppSecret")
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	} else if secret == "" {
		self.Fail(libs.E100000, "微信参数未配置")
	}
	//fmt.Printf("appid:%s,secret:%s,code:%s", appid, secret, wxUser.Code)
	session, err := oauth.WeixinGetSession(appid, secret, wxUser.Code)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	//fmt.Printf("%+v", session)
	if session.Errcode != 0 {
		self.Fail(libs.E100000, fmt.Sprintf("微信接口异常，错误代码：%s，消息：%s", session.Errcode, session.Errmsg))
	}
	wxUser.Openid = session.Openid
	wxUser.Unionid = session.Unionid
	wxUser.SessionKey = session.SessionKey

	user, err := weixin.WxUserSave(wxUser, self.Appid, self.Tid)
	if err != nil {
		fmt.Println(err)
		self.Fail(libs.E100000, err.Error())
	}
	// 下载微信头像
	wxUser.Avatar, err = libs.SaveAvatarForUser(wxUser.AvatarUrl, user.Id)
	if err != nil {
		beego.Error(err)
	}

	et := utils.EasyToken{
		Username: user.Username,
		Uid:      user.Id,
		Roleids:  user.RoleIds,
		Isleader: int8(user.Isleader),
		// Orgids:user.UserOrgs
		ExpiresAt: time.Now().Unix() + 3600*12,
	}

	token, err := et.GetToken()
	if token == "" || err != nil {
		self.Fail(libs.E100000, err.Error())
	} else {
		self.Success(apiController.LoginToken{user, token})
	}
}

// @Title 微信支付
// @Description 微信授权，获取session
// @Success 0 {object} controllers.api.Response
// @Failure 100000 服务器端错误
// @Failure 100001 unauthorized
// @router v1/oauth/weixin/pay [post]
func (self *ApiWeixinController) Pay() {
	if self.Uid == 0 {
		self.Fail(libs.E100001, "未登陆用户")
	}
	//应用级别的设置
	settings, err := commonModels.SettingLoadFor(self.Appid, 0, 0)
	if err != nil {
		self.Fail(libs.E100000, err)
	}

	wxGroupKey := "CONFIG_GROUP_WEIXIN"
	appid, err := commonModels.SettingGetValueFor(settings, wxGroupKey, "wx_AppID")
	if err != nil {
		self.Fail(libs.E100000, err)
	} else if appid == "" {
		self.Fail(libs.E100000, errors.New("微信appid未配置"))
	}
	// secret, err := commonModels.SettingGetValueFor(settings, wxGroupKey, "wx_AppSecret")
	// if err != nil {
	// 	self.Fail(libs.E100000, err)
	// } else if secret=="" {
	// 	self.Fail(libs.E100000, error.New("微信参数未配置"))
	// }
	mchid, err := commonModels.SettingGetValueFor(settings, wxGroupKey, "wx_MchID")
	if err != nil {
		self.Fail(libs.E100000, err)
	} else if mchid == "" {
		self.Fail(libs.E100000, errors.New("微信支付商户号未配置"))
	}
	paykey, err := commonModels.SettingGetValueFor(settings, wxGroupKey, "wx_PayKey")
	if err != nil {
		self.Fail(libs.E100000, err)
	} else if paykey == "" {
		self.Fail(libs.E100000, errors.New("微信支付参数未配置"))
	}
	oauth.InitWxMiniProgramClient(appid, mchid, paykey)
	//libs.MiniProgramPay(total_fee float32, openid, body, out_trade_no, notify_url string)
}
