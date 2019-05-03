/**********************************************
** @Des: This file ...
** @Author: ybxx
** @Date:   2018-09-16 15:42:43
** @Last Modified by:
** @Last Modified time: 2018-10-09 11:48:17
***********************************************/
package oauth

import (
	// "github.com/astaxie/beego"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/milkbobo/gopay"

	"github.com/milkbobo/gopay/client"
	"github.com/milkbobo/gopay/common"
	"github.com/milkbobo/gopay/constant"
)

type WeixinSession struct {
	Openid     string `json:"openid"`
	SessionKey string `json:"session_key"`
	Unionid    string `json:"unionid"`
	Errcode    int64  `json:"errcode"`
	Errmsg     string `json:"errmsg"`
}

func WeixinGetSession(appid, secret, js_code string) (*WeixinSession, error) {
	//文档地址：https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.code2Session.html
	//接口地址：https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
	url := fmt.Sprintf("https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code", appid, secret, js_code)
	resp, err := http.Get(url)
	defer resp.Body.Close()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	res := new(WeixinSession)
	if err := json.Unmarshal(body, res); err != nil {
		fmt.Println("body:", err)
		return nil, err
	}
	return res, nil
}
func InitWxMiniProgramClient(wx_appid, wx_mch_id, key string) {
	client.InitWxMiniProgramClient(&client.WechatMiniProgramClient{
		AppID:      wx_appid,
		MchID:      wx_mch_id,
		Key:        key,
		PrivateKey: nil,
		PublicKey:  nil,
	})
}

func MiniProgramPay(total_fee float32, openid, body, out_trade_no, notify_url string) (map[string]string, error) {

	//支付
	// m["body"] = TruncatedText(charge.Describe, 32)
	// m["out_trade_no"] = charge.TradeNum
	// m["total_fee"] = WechatMoneyFeeToString(charge.MoneyFee)
	// m["notify_url"] = charge.CallbackURL
	// m["openid"] = charge.OpenID
	charge := new(common.Charge)
	charge.PayMethod = constant.WECHAT_MINI_PROGRAM //支付方式
	charge.OpenID = openid
	charge.Describe = body
	charge.MoneyFee = float64(total_fee) * 100 // 支付钱单位分
	charge.Describe = body                     //支付描述
	charge.TradeNum = out_trade_no             //交易号
	charge.CallbackURL = notify_url            //回调地址必须跟下面一样

	fdata, err := gopay.Pay(charge)
	if err != nil {
		fmt.Println(err)
	}
	return fdata, err
}
