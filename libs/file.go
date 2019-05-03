package libs

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"strings"
)

//解析text文件内容
func ReadFile(path string) ([]byte, error) {
	//打开文件的路径
	fi, err := os.Open(path)
	if err != nil {
		fmt.Println("打开文件失败")
		fmt.Println(err)
	}
	defer fi.Close()
	//读取文件的内容
	fd, err := ioutil.ReadAll(fi)
	if err != nil {
		fmt.Println("读取文件失败:", err)
	}
	return fd, err
}

func GetPathForUser(uid uint) string {
	if uid == 0 {
		return "static/img/avatar/user/0.png"
	}
	path := fmt.Sprintf("static/img/avatar/user/%v.png", uid)
	exist, _ := PathExists(path)
	if exist {
		return path
	}
	return ""
}

func GetPathForTenant(tid uint) string {
	if tid == 0 {
		return "static/img/avatar/tenant/0.png"
	}
	path := fmt.Sprintf("static/img/avatar/tenant/%v.png", tid)
	exist, _ := PathExists(path)
	if exist {
		return path
	}
	return ""
}

// 下载头像并保存
func SaveAvatarForUser(url string, uid uint) (string, error) {
	return saveAvatar(0, url, uid)
}

// 下载头像并保存
func SaveAvatarForTenant(url string, tid uint) (string, error) {
	return saveAvatar(1, url, tid)
}

// kind==0：用户，否则租户
func saveAvatar(kind uint, url string, id uint) (string, error) {
	name := "user"
	if kind > 0 {
		name = "tenant"
	}
	defPath := fmt.Sprintf("/static/img/avatar/%v/0.png", name)
	url = strings.TrimSpace(url)
	if len(url) == 0 {
		return defPath, nil
	}
	// 生成存放目录
	dir := fmt.Sprintf("static/img/avatar/%v", name)
	exist, err := PathExists(dir)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	if !exist {
		err := os.Mkdir(dir, os.ModePerm)
		if err != nil {
			fmt.Println(err)
			return "", err
		}
		if err != nil {
			fmt.Println(err)
			return "", err
		}
	}
	// 生成存放路径
	fpath := path.Join(dir, fmt.Sprintf("%v.png", id))
	//通过http请求获取图片的流文件
	resp, _ := http.Get(url)
	body, _ := ioutil.ReadAll(resp.Body)
	file, _ := os.Create(fpath)
	defer file.Close()
	// f, err := os.OpenFile(tofile, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	// if err != nil {
	// 	return "", err
	// }
	// defer f.Close()
	//io.Copy(f, file)

	_, err = io.Copy(file, bytes.NewReader(body))
	if err != nil {
		return defPath, nil
	}
	//转换为绝对路径
	return "/" + fpath, nil
}
