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
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"github.com/liunian1004/pdd"
)

const (
	KIND_PDD = "pdd"
)

type PddToken struct {
	AccessToken  string   `json:"access_token"`
	ExpiresIn    int      `json:"expires_in"`
	OwnerId      string   `json:"owner_id"`
	OwnerName    string   `json:"owner_name"`
	RefreshToken string   `json:"refresh_token"`
	Scope        []string `json:"scope"`
}

func PddPostToken(clientId, clientSecret, code, redirectUri string, state string) (*PddToken, string, error) {
	postData := url.Values{"clientId": {clientId}, "clientSecret": {clientSecret}, "code": {code},
		"grant_type": {"authorization_code"}, "redirectUri": {redirectUri}, "state": {state}}
	resp, err := http.Post("http://open-api.pinduoduo.com/oauth/token", "application/json", strings.NewReader(postData.Encode()))
	defer resp.Body.Close()

	if err != nil {
		fmt.Println(err)
		return nil, "", err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return nil, "", err
	}
	res := new(PddToken)
	if err := json.Unmarshal(body, res); err != nil {
		fmt.Println("body:", err)
		return nil, "", err
	}
	if len(res.AccessToken) > 0 {
		postData := url.Values{"clientId": {clientId}, "clientSecret": {clientSecret}, "code": {code},
			"grant_type": {"refresh_token"}, "refresh_token": {res.AccessToken}, "redirectUri": {redirectUri}, "state": {state}}
		refreshResp, err := http.Post("http://open-api.pinduoduo.com/oauth/token", "application/json", strings.NewReader(postData.Encode()))
		defer refreshResp.Body.Close()
		if err != nil {
			fmt.Println(err)
			return nil, "", err
		}

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
			return nil, "", err
		}
		tokenRes := new(PddToken)
		if err := json.Unmarshal(body, tokenRes); err != nil {
			fmt.Println("body:", err)
			return nil, "", err
		}
		return tokenRes, string(body), nil
	}

	return nil, "", errors.New("refresh_token不存在")
}

func PddOrderListIncrementGet(clientId, clientSecret, access_token string, start_updated_at, end_updated_at int64) ([]*pdd.Order, error) {
	ddk := pdd.NewDDK(&pdd.Config{
		ClientId:     clientId,
		ClientSecret: clientSecret,
	})
	page := 1
	param := pdd.NewParams()
	param["access_token"] = access_token
	param["order_status"] = 1  //发货状态，1-待发货，2-已发货待签收，3-已签收，5-全部
	param["refund_status"] = 1 //售后状态，1-无售后或售后关闭，2-售后处理中，3-退款中，4-退款成功 5-全部
	param["page"] = page
	res, err := ddk.OrderListIncrementGet(start_updated_at, end_updated_at, param)
	if err != nil {
		return nil, err
	}
	orderList := res.OrderList
	for {
		if res.TotalCount <= page*100 {
			break
		}
		page++
		param["page"] = page
		newRes, err := ddk.OrderListIncrementGet(start_updated_at, end_updated_at, param)
		if err != nil {
			return orderList, nil
		}
		orderList = append(orderList, newRes.OrderList...)
	}
	return orderList, nil
}
