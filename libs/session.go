/**********************************************
** @Des: This file ...
** @Author: yellbuy
** @Date:   2018-09-16 14:24:25
** @Last Modified by:   yellbuy
** @Last Modified time:  2018-09-16 14:24:25
***********************************************/

package libs

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/astaxie/beego"
)

const (
	AdminAuthSessionName = "admin_auth"
)

type AdminAuthSession struct {
	// 当前应用标识
	Appid uint
	// 当前租户标识
	Tid uint
	// 当前使用的用户标识
	Uid uint
	// 主用户标识，切换用户时需要
	MasterUid uint
	// 是否代理用户
	IsProxy uint8
	// 校验Key
	AuthKey string
}

func GetAuthKey(appid, tid, uid, masterUid uint, loginDevice, pwd, salt string, isEnable, isExternal uint8, isAdmin bool, roleIds string, isProxy uint8) string {
	// 是否启用单点登录
	singleSignOn := beego.AppConfig.DefaultBool("singleSignOn", false)
	if !singleSignOn {
		loginDevice = ""
	}
	// ip生成不稳定，暂时不用
	str := fmt.Sprintf("%v|%v|%v|%v|%s|%s|%s|%v|%v|%v|%s|%v", appid, tid, uid, masterUid, loginDevice, pwd, salt, isEnable, isExternal, isAdmin, roleIds, isProxy)
	authKey := Md5([]byte(str))
	return authKey
}
func (self *AdminAuthSession) GetSessionString() string {
	return fmt.Sprintf("%v|%v|%v|%v|%v|%s", self.Appid, self.Tid, self.Uid, self.MasterUid, self.IsProxy, self.AuthKey)
}
func GetAdminAuthSession(sessionString string) *AdminAuthSession {
	if len(sessionString) == 0 {
		return nil
	}
	arr := strings.Split(sessionString, "|")
	if len(arr) < 6 {
		return nil
	}
	appid, _ := strconv.Atoi(arr[0])
	tid, _ := strconv.Atoi(arr[1])
	uid, _ := strconv.Atoi(arr[2])
	masterUid, _ := strconv.Atoi(arr[3])
	isProxy, _ := strconv.Atoi(arr[4])
	authKey := arr[5]
	return &AdminAuthSession{uint(appid), uint(tid), uint(uid), uint(masterUid), uint8(isProxy), authKey}
}
