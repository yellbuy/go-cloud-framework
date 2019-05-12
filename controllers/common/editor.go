/**********************************************
** @Des: This file ...
** @Author: cheguoyong
** @Date:   2017-09-08 17:48:30
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-09 18:50:41
***********************************************/
package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	"yellbuy.com/YbCloudDataApi/models/common"
	"yellbuy.com/YbCloudDataApi/utils"

	"github.com/sipt/GoJsoner"
	"yellbuy.com/YbCloudDataApi/controllers/share"

	"yellbuy.com/YbCloudDataApi/libs"
)

type EditorController struct {
	share.AdminBaseController
}

func (self *EditorController) Prepare() {
	self.AdminBaseController.Prepare()
}

func (self *EditorController) Ueditor() {
	action := self.GetString("action")
	res := make(map[string]interface{})
	switch action {
	case "config":
		res, _ = ueditorLoadConfigByCache()
		break
	case "uploadimage":
		state, url := self.ueditorUpload("image")
		res["state"] = state
		res["url"] = url
		break
	case "uploadvideo":
		state, url := self.ueditorUpload("video")
		res["state"] = state
		res["url"] = url
		break
	case "uploadfile":
		state, url := self.ueditorUpload("file")
		res["state"] = state
		res["url"] = url
		break
	case "listimage":
		start, _ := self.GetUint("start", 0)
		size, _ := self.GetUint("size", 20)
		scopeIds := self.GetScopeLevelIds()

		total, list, err := common.AttfileGetPagedListBy(start, size, "image", scopeIds...)
		files := make([]map[string]interface{}, len(list))
		if err == nil {
			res["state"] = "SUCCESS"
			for index, val := range list {
				// urls[index] = fmt.Sprintf("%v%v","http://localhost:8081",val.Savepath)
				file := make(map[string]interface{})
				file["url"] = val.Savepath
				file["title"] = val.Name
				file["alt"] = val.Name
				files[index] = file
			}

		} else {
			fmt.Println(err)
			res["state"] = "加载图片时发生错误"

		}
		res["list"] = files
		res["start"] = start
		res["size"] = size
		res["total"] = total
		break
	case "listfile":
		start, _ := self.GetUint("start", 0)
		size, _ := self.GetUint("size", 20)
		scopeIds := self.GetScopeLevelIds()
		total, list, err := common.AttfileGetPagedList(start, size, "file", scopeIds...)
		files := make([]map[string]interface{}, len(list))
		if err == nil {
			res["state"] = "SUCCESS"
			for index, val := range list {
				file := make(map[string]interface{})
				file["url"] = val.Savepath
				file["title"] = val.Name
				file["alt"] = val.Name
				files[index] = file
			}

		} else {
			fmt.Println(err)
			res["state"] = "加载图片时发生错误"

		}
		res["list"] = files
		res["start"] = start
		res["size"] = size
		res["total"] = total
		break
	}
	self.Data["json"] = res
	self.ServeJSON()
	self.StopRun()
}

//上传文件
func (self *EditorController) ueditorUpload(kind string) (state string, url string) {
	//image，这是一个key值，对应的是html中input type-‘file’的name属性值
	f, h, _ := self.GetFile("file")
	//得到文件的名称
	fileName := h.Filename
	arr := strings.Split(fileName, ":")
	if len(arr) > 1 {
		index := len(arr) - 1
		fileName = arr[index]
	}
	// 获取文件扩展名
	ext := path.Ext(fileName)
	if len(ext) == 0 {
		state = "不允许的文件类型"
		url = "error|不支持的文件格式"
		return
	}
	ext = strings.ToLower(ext)
	if kind == "image" {
		if h.Size > (1024 * 1024 * 10) {
			state = "上传图片最大不能超过10M"
			url = "error|文件过大"
			return
		}
		if ext != ".png" && ext != ".jpg" && ext != ".jpeg" && ext != ".bmp" && ext != ".gif" {
			state = "不允许的文件类型"
			url = "error|不支持的文件格式"
			return
		}
	} else if kind == "video" {
		if h.Size > (1024 * 1024 * 100) {
			state = "上传视频最大不能超过100M"
			url = "error|文件过大"
			return
		}
		if ext != ".flv" && ext != ".swf" && ext != ".mkv" && ext != ".avi" && ext != ".rm" &&
			ext != ".rmvb" && ext != ".mpeg" && ext != ".mpg" && ext != ".ogg" && ext != ".ogv" && ext != ".mov" && ext != ".wmv" &&
			ext != ".mp4" && ext != ".webm" && ext != ".mp3" && ext != ".wav" && ext != ".mid" {
			state = "不允许的文件类型"
			url = "error|不支持的文件格式"
			return
		}
	} else if kind == "file" {
		if h.Size > (1024 * 1024 * 100) {
			state = "上传文件最大不能超过100M"
			url = "error|文件过大"
			return
		}
		if ext != ".png" && ext != ".jpg" && ext != ".jpeg" && ext != ".gif" && ext != ".bmp" &&
			ext != ".flv" && ext != ".swf" && ext != ".mkv" && ext != ".avi" && ext != ".rm" && ext != ".rmvb" && ext != ".mpeg" &&
			ext != ".mpg" && ext != ".ogg" && ext != ".ogv" && ext != ".mov" && ext != ".wmv" && ext != ".mp4" && ext != ".webm" && ext != ".mp3" &&
			ext != ".wav" && ext != ".mid" && ext != ".rar" && ext != ".zip" && ext != ".tar" && ext != ".gz" && ext != ".7z" && ext != ".bz2" &&
			ext != ".cab" && ext != ".iso" && ext != ".doc" && ext != ".docx" && ext != ".xls" && ext != ".xlsx" && ext != ".ppt" && ext != ".pptx" &&
			ext != ".pdf" && ext != ".txt" && ext != ".md" && ext != ".xml" {
			state = "不允许的文件类型"
			url = "error|不支持的文件格式"
			return
		}
	} else {
		state = "不允许的上传方式"
		url = "error|不允许的上传方式"
		return
	}
	// if ext != ".png" && ext != ".jpg" && ext != ".jpeg" && ext != ".bmp" && ext != ".gif" {
	// 	self.Ctx.WriteString("error|不支持的文件格式")
	// 	self.StopRun()
	// }
	now := time.Now()
	// 生成新文存放名
	fileNewName := string(now.Format("20060102150405")) + strconv.Itoa(time.Now().Nanosecond()) + ext
	//fmt.Println("文件名称:")
	//fmt.Println(fileName)
	//关闭上传的文件，不然的话会出现临时文件不能清除的情况
	f.Close()
	//保存文件到指定的位置
	//static/uploadfile,这个是文件的地址，第一个static前面不要有/
	dateStr := now.Format("2006-01-02")
	// 生成存放目录
	dir := path.Join("static/upload/", kind, dateStr)
	exist, err := libs.PathExists(dir)
	if err != nil {
		state = "FAILED"
		url = "error|系统错误"
		return
	}
	if !exist {
		err := os.Mkdir(dir, os.ModePerm)
		if err != nil {
			state = "FAILED"
			url = "error|文件夹创建失败"
			return
		}
	}
	// 生成存放路径
	fpath := path.Join(dir, fileNewName)
	if err := self.SaveToFile("file", fpath); err != nil {
		state = "FAILED"
		url = "error|文件上传失败"
		return
	}
	if kind == "image" {
		// 压缩处理
		img, err := imaging.Open(fpath)
		if err != nil {
			fmt.Println("image resize err:", err)
		} else {
			// 限制最大宽度为1000
			img = imaging.Resize(img, 1000, 0, imaging.Lanczos)
			err = imaging.Save(img, fpath, imaging.JPEGQuality(80))
			if err != nil {
				fmt.Println("image resize save:", err)
			}
		}
	}
	state = "SUCCESS"
	url = fpath
	return
}

//上传文件
func (self *EditorController) WangeditorUpload() {
	//image，这是一个key值，对应的是html中input type-‘file’的name属性值
	f, h, _ := self.GetFile("file")
	//得到文件的名称
	fileName := h.Filename
	arr := strings.Split(fileName, ":")
	if len(arr) > 1 {
		index := len(arr) - 1
		fileName = arr[index]
	}
	// 获取文件扩展名
	ext := path.Ext(fileName)
	if len(ext) == 0 {
		self.Ctx.WriteString("error|不支持的文件格式")
		self.StopRun()
	}
	ext = strings.ToLower(ext)
	if ext != ".png" && ext != ".jpg" && ext != ".jpeg" && ext != ".bmp" && ext != ".gif" {
		self.Ctx.WriteString("error|不支持的文件格式")
		self.StopRun()
	}
	now := time.Now()
	// 生成新文存放名
	fileNewName := string(now.Format("20060102150405")) + strconv.Itoa(time.Now().Nanosecond()) + ext
	fmt.Println("文件名称:")
	fmt.Println(fileName)
	//关闭上传的文件，不然的话会出现临时文件不能清除的情况
	f.Close()
	//保存文件到指定的位置
	//static/uploadfile,这个是文件的地址，第一个static前面不要有/
	dateStr := now.Format("2006-01-02")
	// 生成存放目录
	dir := path.Join("static/upload/file/", dateStr)
	exist, err := libs.PathExists(dir)
	if err != nil {
		self.Ctx.WriteString("error|系统错误")
		self.StopRun()
	}
	if !exist {
		err := os.Mkdir(dir, os.ModePerm)
		if err != nil {
			self.Ctx.WriteString("error|文件夹创建失败")
			self.StopRun()
		}
		if err != nil {
			self.Ctx.WriteString("error|文件夹创建失败")
			self.StopRun()
		}
	}
	// 生成存放路径
	fpath := path.Join(dir, fileNewName)

	if err := self.SaveToFile("file", fpath); err != nil {
		self.Ctx.WriteString("error|文件上传失败")
		self.StopRun()
	}
	fpath = "/" + fpath
	self.Ctx.WriteString(fpath)
	self.StopRun()
}

func ueditorLoadConfigByCache() (map[string]interface{}, error) {
	cacheKey := utils.CacheKeyCommonUeditorConfig
	loadCallbackFunc := func() (interface{}, error) {
		var res map[string]interface{}
		data, err := ioutil.ReadFile("static/larryms/lib/extend/ueditor/ueditor.config.json")
		if err != nil {
			return res, err
		}
		// 去除注释
		str, err := GoJsoner.Discard(string(data))
		if err != nil {
			return res, err
		}
		//读取的数据为json格式，需要进行解码
		err = json.Unmarshal([]byte(str), &res)
		if err != nil {
			return res, err
		}
		return res, nil
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil || res == nil {
		fmt.Println(err)
		return nil, err
	}

	config := res.(map[string]interface{})
	return config, err
}
