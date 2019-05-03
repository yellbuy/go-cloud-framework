/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-08 00:24:25
** @Last Modified by:   
** @Last Modified time: 2017-09-17 10:12:06
***********************************************/

package libs

import (
    "os"
)

// 判断文件夹是否存在
func PathExists(path string) (bool, error) {
    _, err := os.Stat(path)
    if err == nil {
        return true, nil
    }
    if os.IsNotExist(err) {
        return false, nil
    }
    return false, err
}