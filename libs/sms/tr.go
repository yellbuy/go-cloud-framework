/**********************************************
** @Des: This file ...
** @Author: ybxx
** @Date:   2018-09-16 15:42:43
** @Last Modified by:
** @Last Modified time: 2018-10-09 11:48:17
***********************************************/
package sms

import (
	// "github.com/astaxie/beego"

	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

func PostTrSms(urlPath, accesskey, secret, sign, templateId string, mobile string, content string) error {
	postData := url.Values{"accesskey": {accesskey},
		"secret":     {secret},
		"sign":       {sign},
		"templateId": {templateId},
		"mobile":     {mobile},
		"content":    {content},
	}
	resp, err := http.PostForm(urlPath, postData)
	defer resp.Body.Close()

	if err != nil {
		fmt.Println(urlPath, err)
		return err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(urlPath, err)
		return err
	}
	resMap := make(map[string]interface{})

	if err := json.Unmarshal(body, &resMap); err != nil {
		fmt.Println("body:", err)
		return err
	}
	fmt.Println("body:", resMap)
	if code, ok := resMap["code"]; ok {
		//"ResultCode": "106",
		// "Reason": "该订单号已下单成功"，
		if code.(string) == "0" {
			return nil
		} else {
			return errors.New(resMap["msg"].(string))
		}
		// 写短信发送记录
	}
	return errors.New("操作失败")
}
