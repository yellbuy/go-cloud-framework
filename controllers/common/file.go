/**********************************************
** @Des: This file ...
** @Author: cheguoyong
** @Date:   2017-09-08 17:48:30
** @Last Modified by:   cheguoyong
** @Last Modified time: 2017-09-09 18:50:41
***********************************************/
package controllers

import (
	"fmt"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	"yellbuy.com/YbCloudDataApi/controllers/share"
	"yellbuy.com/YbCloudDataApi/models/common"

	"yellbuy.com/YbCloudDataApi/libs"
)

type FileController struct {
	share.AdminBaseController
}
func (self *FileController) Prepare() {
	self.AdminBaseController.Prepare()
}

func (self *FileController) AvatarUpload() {
	kind := strings.TrimSpace(self.GetString("Kind"))
	if kind == "" {
		self.AjaxFail(libs.E100000, "上传类型不能为空")
	}
	if kind != "user" && kind != "tenant" && kind != "app" {
		self.AjaxFail(libs.E100000, "上传类型错误，仅支持‘user’，‘tenant’，‘app’")
	}
	id, _ := self.GetUint("id")
	if id == 0 {
		self.AjaxFail(libs.E100000, "标识不能为空")
	}
	msg := libs.UploadAvatar(self.AdminBaseController.Controller, id, kind)
	if msg != "" {
		self.AjaxFail(libs.E100000, msg)
	}
	self.AjaxSuccess()
}

//上传文件
func (self *FileController) Upload() {
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
	// 文件类型，图片文件需进行压缩处理
	kind := "file"
	if ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".bmp" || ext == ".gif" {
		kind = "image"
		if h.Size > (1024 * 1024 * 10) {
			self.AjaxFail(libs.E100000, "上传图片最大不能超过10M")
		}
	} else if ext == ".flv" || ext == ".swf" || ext == ".mkv" || ext == ".avi" || ext == ".rm" ||
		ext == ".rmvb" || ext == ".mpeg" || ext == ".mpg" || ext == ".ogg" || ext == ".ogv" || ext == ".mov" || ext == ".wmv" ||
		ext == ".mp4" || ext == ".webm" || ext == ".mp3" || ext == ".wav" || ext == ".mid" {
		kind = "video"
	}
	if h.Size > (1024 * 1024 * 100) {
		self.AjaxFail(libs.E100000, "上传文件最大不能超过100M")
	}

	now := time.Now()
	// 生成新文存放名
	fileNewName := string(now.Format("20060102150405")) + strconv.Itoa(time.Now().Nanosecond()) + ext
	// fmt.Println("文件名称:")
	// fmt.Println(fileName)
	//关闭上传的文件，不然的话会出现临时文件不能清除的情况
	f.Close()
	data := make(map[string]interface{})
	//保存文件到指定的位置
	//static/Filefile,这个是文件的地址，第一个static前面不要有/
	dateStr := now.Format("2006-01-02")
	// 生成存放目录
	dir := path.Join("static/upload/", kind, dateStr)
	exist, err := libs.PathExists(dir)
	if err != nil {
		self.AjaxList("系统错误", 1, 0, data)
	}
	if !exist {
		err := os.Mkdir(dir, os.ModePerm)
		if err != nil {
			self.AjaxList("文件夹创建失败", 2, 0, data)
		}
		if err != nil {
			self.AjaxList("文件夹创建失败", 2, 0, data)
		}
	}
	// 生成存放路径
	fpath := path.Join(dir, fileNewName)

	if err := self.SaveToFile("file", fpath); err != nil {
		self.AjaxList("文件上传失败", 3, 0, data)
	}
	// 图片压缩
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

	fpath = "/" + fpath
	attfile := new(common.Attfile)
	attfile.Name = fileName
	attfile.Savename = fileNewName
	attfile.Savepath = fpath
	attfile.Size = int(h.Size)
	attfile.Ext = ext
	attfile.Kind = kind
	attfile.Appid = self.Appid
	attfile.Tid = self.Tid
	attfile.Uid = self.Uid
	//显示在本页面，不做跳转操作

	if id, err := common.AttfileAdd(attfile); err != nil {
		fmt.Println(err)
		self.AjaxList("文件保存失败", 4, 0, data)
	} else {
		data["src"] = fpath
		data["id"] = id
		data["name"] = fileName
		self.AjaxList("", 0, 1, data)
	}
}
