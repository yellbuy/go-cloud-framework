/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-08 00:24:25
** @Last Modified by:   
** @Last Modified time: 2017-09-17 10:12:06
***********************************************/

package libs

import (
	"fmt"
	"strconv"
)

func Float64ToDecimal(value float64) float64 {
	value, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", value), 64)
	return value
}
func Float32ToDecimal(value float32) float32 {
	result, _ := strconv.ParseFloat(fmt.Sprintf("%.2f", value), 32)
	return float32(result)
}

// 截取小数位数
func Float64Round(f float64, n int) float64 {
	format := "%." + strconv.Itoa(n) + "f"
	res, _ := strconv.ParseFloat(fmt.Sprintf(format, f), 64)
	return res
}

// 截取小数位数
func Float32Round(f float32, n int) float32 {
	format := "%." + strconv.Itoa(n) + "f"
	res, _ := strconv.ParseFloat(fmt.Sprintf(format, f), 32)
	return float32(res)
}
