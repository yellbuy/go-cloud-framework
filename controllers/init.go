package controllers

import (
	"encoding/gob"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	. "github.com/yansuan/pongo2"
	"yellbuy.com/YbGoCloundFramework/libs"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
	commonModels "yellbuy.com/YbGoCloundFramework/models/common"
)

func filterPadLeft(in *Value, param *Value) (*Value, *Error) {
	str := in.String()
	num, _ := strconv.Atoi(param.String())
	if num < 0 {
		num = 0
	}
	str = strings.Repeat("--", num) + str
	return AsValue(str), nil
}
func filterPadRight(in *Value, param *Value) (*Value, *Error) {
	str := in.String()
	num, _ := strconv.Atoi(param.String())
	if num < 0 {
		num = 0
	}
	str = str + strings.Repeat("--", num)
	return AsValue(str), nil
}

func filterSplit(in *Value, param *Value) (*Value, *Error) {
	chunks := strings.Split(in.String(), param.String())

	return AsValue(chunks), nil
}
func filterNow(in *Value, param *Value) (*Value, *Error) {
	t := time.Now()
	return AsValue(t.Format(param.String())), nil
}

// 根据id获取上传文件的服务器路径
func filterFilePath(in *Value, param *Value) (*Value, *Error) {
	id, _ := strconv.ParseInt(in.String(), 10, 64)
	path := ""
	if id > 0 {
		path, _ = commonModels.AttfileGetPathById(id)
	}
	if len(path) == 0 {
		path = param.String()
	}
	return AsValue(path), nil
}

// 根据字符串获取收个上传文件的服务器路径
func filterFirstFilePath(in *Value, param *Value) (*Value, *Error) {
	path := ""
	chunks := strings.Split(in.String(), param.String())
	if len(chunks) > 0 {
		id, _ := strconv.ParseInt(chunks[0], 10, 64)
		if id > 0 {
			path, _ = commonModels.AttfileGetPathById(id)
		}
	}
	return AsValue(path), nil
}

// 根据字符串获取一组文件路径，param为限制的数量，为空或者0表示不限制
func filterFilePathArray(in *Value, param *Value) (*Value, *Error) {
	num := in.Integer()
	if num < 0 {
		num = 0
	}
	pathArr := make([]string, num)
	chunks := strings.Split(in.String(), param.String())
	for _, v := range chunks {
		id, _ := strconv.ParseInt(v, 10, 64)
		if id > 0 {
			path, _ := commonModels.AttfileGetPathById(id)
			if len(path) > 0 {
				pathArr = append(pathArr, path)
				if num > 0 && len(pathArr) >= num {
					return AsValue(pathArr), nil
				}
			}
		}
	}
	return AsValue(pathArr), nil
}

func filterUnmarshal(in *Value, param *Value) (*Value, *Error) {
	str := in.String()
	str = strings.TrimSpace(str)
	if len(str) > 0 {
		if strings.HasPrefix(str, "[") {
			data := make([]map[string]interface{}, 0)
			err := json.Unmarshal([]byte(str), &data)
			if err != nil {
				fmt.Println(err)
			}
			return AsValue(data), nil
		} else {
			var data map[string]interface{}
			err := json.Unmarshal([]byte(str), &data)
			if err != nil {
				fmt.Println(err)
			}
			return AsValue(data), nil
		}
	}
	return AsValue(nil), nil
}

func filterMarshal(in *Value, param *Value) (*Value, *Error) {
	data := in.Interface()
	var str = ""
	if data != nil {
		res, err := json.Marshal(data)
		if err != nil {
			fmt.Println(err)
			return AsValue(""), nil
		}
		str = string(res)
	}
	return AsValue(str), nil
}

// 根据用户id，查找用户名
func filterUser(in *Value, param *Value) (*Value, *Error) {
	uid := in.Integer()
	if uid < 0 {
		uid = 0
	}
	user, err := baseModels.UserGetBy(uint(uid))
	if err != nil {
		return AsValue(""), nil
	}
	if len(user.Name) > 0 {
		return AsValue(user.Name), nil
	}
	if len(user.Nickname) > 0 {
		return AsValue(user.Name), nil
	}
	return AsValue(user.Username), nil
}

// 根据用户ids，批量查找用户名
func filterUsers(in *Value, param *Value) (*Value, *Error) {
	ids := in.String()
	if len(ids) == 0 {
		return AsValue(""), nil
	}
	idArr := libs.Split2Uint(ids)
	if len(idArr) == 0 {
		return AsValue(""), nil
	}
	users, err := baseModels.UserLoadBy(idArr...)
	if err != nil {
		return AsValue(""), nil
	}
	names := ""
	for _, user := range users {
		if len(names) > 0 {
			names = names + ","
		}
		if len(user.Name) > 0 {
			names = names + user.Name
		} else if len(user.Nickname) > 0 {
			names = names + user.Nickname
		} else {
			names = names + user.Username
		}
	}

	return AsValue(names), nil
}

func init() {
	gob.Register(&libs.AdminAuthSession{})
	RegisterFilter("padLeft", filterPadLeft)
	RegisterFilter("padRight", filterPadRight)
	RegisterFilter("split", filterSplit)
	RegisterFilter("now", filterNow)
	RegisterFilter("filePath", filterFilePath)
	RegisterFilter("firstFilePath", filterFilePath)
	RegisterFilter("filePathArray", filterFilePathArray)
	RegisterFilter("marshal", filterMarshal)
	RegisterFilter("unmarshal", filterUnmarshal)

	RegisterFilter("user", filterUser)
	RegisterFilter("users", filterUsers)
}
