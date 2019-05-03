/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-08 00:24:25
** @Last Modified by:   
** @Last Modified time: 2017-09-17 10:12:06
***********************************************/

package libs

// import (
// 	"strings"
// 	"strconv"
// 	"crypto/md5"
// 	"fmt"
// 	"math/rand"
// 	"regexp"
// 	"time"
// )

func Int642InterfaceArray(arr []int64) []interface{} {
	res := make([]interface{}, 0)
	for _, v := range arr {
		res = append(res, v)
	}
	return res
}

func Int2InterfaceArray(arr []int) []interface{} {
	res := make([]interface{}, 0)
	for _, v := range arr {
		res = append(res, v)
	}
	return res
}

func Interface2stringArray(arr []interface{}) []string {
	res := make([]string, 0)
	for _, v := range arr {
		if str, ok := v.(string); ok {
			res = append(res, str)
		}
	}
	return res
}

func Int64InArray(arr []int64, n int64) bool {

	for _, v := range arr {
		if v == n {
			return true
		}
	}
	return false
}

func IntInArray(arr []int, n int) bool {

	for _, v := range arr {
		if v == n {
			return true
		}
	}
	return false
}

func StringInArray(arr []string, n string) bool {

	for _, v := range arr {
		if v == n {
			return true
		}
	}
	return false
}
