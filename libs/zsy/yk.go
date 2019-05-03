/**********************************************
** @Des: This file ...
** @Author: ybxx
** @Date:   2018-09-16 15:42:43
** @Last Modified by:
** @Last Modified time: 2018-10-09 11:48:17
***********************************************/
package zsy

import (
	"errors"
	// "github.com/astaxie/beego"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	//"net/url"
)

type YkResponseDto struct {
	Errcode int                      `json:"errcode"`
	Errmsg  string                   `json:"errmsg"`
	Data    []map[string]interface{} `json:"data"`
}

func PostYkBillList(urlPath, kh string) ([]map[string]interface{}, error) {
	// postData := url.Values{"kh": {kh}}
	// fmt.Println(urlPath, postData)
	// resp, err := http.PostForm(urlPath, postData)
	resp, err := http.PostForm(urlPath+"?kh="+kh, nil)
	if err != nil {
		fmt.Println("err：", err)
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(urlPath, err)
		return nil, err
	}
	// fmt.Println("body：", string(body))
	res := new(YkResponseDto)
	if err := json.Unmarshal(body, &res); err != nil {
		fmt.Println("body:", err)
		return nil, err
	}
	fmt.Println("res errmsg：", res.Errmsg)
	if res.Errcode != 0 {
		return nil, errors.New(res.Errmsg)
	}
	return res.Data, nil
}

func PostYkAllBillList(urlPath, startTime, endTime string) ([]map[string]interface{}, error) {
	// postData := url.Values{"kh": {kh}}
	// fmt.Println(urlPath, postData)
	// resp, err := http.PostForm(urlPath, postData)
	resp, err := http.PostForm(urlPath+"?startTime="+startTime+"&endTime="+endTime, nil)
	if err != nil {
		fmt.Println("err：", err)
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(urlPath, err)
		return nil, err
	}
	// fmt.Println("body：", string(body))
	res := new(YkResponseDto)
	if err := json.Unmarshal(body, &res); err != nil {
		fmt.Println("body:", err)
		return nil, err
	}
	fmt.Println("res errmsg：", res.Errmsg)
	if res.Errcode != 0 {
		return nil, errors.New(res.Errmsg)
	}
	return res.Data, nil
}

func PostYkBillDetails(urlPath, ywlsh string, kh string) ([]map[string]interface{}, error) {
	// postData := url.Values{"kh": {kh}, "ywlsh": {ywlsh}}
	// resp, err := http.PostForm(urlPath, postData)
	resp, err := http.PostForm(urlPath+"?kh="+kh+"&ywlsh="+ywlsh, nil)
	if err != nil {
		fmt.Println("err：", err)
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(urlPath, err)
		return nil, err
	}
	res := new(YkResponseDto)
	if err := json.Unmarshal(body, &res); err != nil {
		fmt.Println("body:", err)
		return nil, err
	}
	fmt.Println("res errmsg：", res.Errmsg)
	if res.Errcode != 0 {
		return nil, errors.New(res.Errmsg)
	}
	return res.Data, nil
}
