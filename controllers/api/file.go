package controllers

import (
	// "crypto"
	"fmt"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	// "github.com/astaxie/beego"
	// "yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models/common"
	// "yellbuy.com/YbGoCloundFramework/utils"
	// "log"
	// "strings"
	// "time"
)

type ApiFileController struct {
	BaseApiController
}

// @Title 文件上传接口
// @Description 文件上传接口
// @Param   file     body    byte[]  true        上传的文件
// @Success 200 {object} common.Attfile
// @Failure 404 no enough input
// @Failure 401 No Admin
// @router /v1/file/upload [post]
func (self *ApiFileController) Upload() {
	//image，这是一个key值，对应的是html中input type-‘file’的name属性值
	files, _ := self.GetFiles("file")
	if len(files) == 0 {
		self.Fail(100000, "无文件上传")
	}
	list := make([]map[string]interface{}, 0)
	for _, h := range files {

		//得到文件的名称
		fileName := h.Filename
		arr := strings.Split(fileName, ":")
		if len(arr) > 1 {
			index := len(arr) - 1
			fileName = arr[index]
		}
		// 获取文件扩展名
		ext := path.Ext(fileName)
		now := time.Now()
		// 生成新文存放名
		fileNewName := string(now.Format("20060102150405")) + strconv.Itoa(time.Now().Nanosecond()) + ext
		fmt.Println("文件名称:")
		fmt.Println(fileName)
		//关闭上传的文件，不然的话会出现临时文件不能清除的情况
		//h.Close()
		data := make(map[string]interface{})
		//保存文件到指定的位置
		//static/uploadfile,这个是文件的地址，第一个static前面不要有/
		dateStr := now.Format("2006-01-02")
		// 生成存放目录
		dir := path.Join("static/upload/file/", dateStr)
		exist, err := libs.PathExists(dir)
		if err != nil {
			self.Fail(100000, "系统错误")
		}
		if !exist {
			err := os.Mkdir(dir, os.ModePerm)
			if err != nil {
				self.Fail(100001, "文件夹创建失败")
			}
		}
		// 生成存放路径
		fpath := path.Join(dir, fileNewName)

		if err := self.SaveToFile("file", fpath); err != nil {
			self.Fail(100002, "文件上传失败")
		}
		fpath = "/" + fpath
		attfile := new(common.Attfile)
		attfile.Name = fileName
		attfile.Savename = fileNewName
		attfile.Savepath = fpath
		attfile.Size = int(h.Size)
		attfile.Ext = ext
		//显示在本页面，不做跳转操作

		if id, err := common.AttfileAdd(attfile); err != nil {
			fmt.Println(err)
			self.Fail(100004, "文件保存失败")
		} else {
			data["src"] = fpath
			data["id"] = id
			data["name"] = fileName
			list = append(list, data)
		}
	}
	self.Success(list)
}
