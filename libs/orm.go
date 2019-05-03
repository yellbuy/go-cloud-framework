/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-08 00:24:25
** @Last Modified by:   
** @Last Modified time: 2017-09-17 10:12:06
***********************************************/

package libs

import (
	"errors"
	"strings"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	"github.com/devfeel/mapper"
)

// 追加查询过滤参数
func AppendFilter(query orm.QuerySeter, ownerIds ...interface{}) orm.QuerySeter {
	if len(ownerIds) > 0 {
		query = query.Filter("appid", ownerIds[0])
		if len(ownerIds) > 1 {
			query = query.Filter("tid", ownerIds[1])
			if len(ownerIds) > 2 {
				query = query.Filter("uid", ownerIds[2])
			}
		}
	}

	return query
}
func ValidParams(model interface{}, params orm.Params, isReversalFields bool, limitFields ...string) (bool, error) {
	if len(params) == 0 {
		return false, FailError(E201204, errors.New("params参数不能为空"))
	}
	mapper.MapperMap(params, model)
	result := validation.Validation{}
	isValid, err := result.Valid(model)
	if err != nil {
		return false, FailError(E201204, err)
	}
	for paraKey, _ := range params {
		// 关键字段不能更新
		lower := strings.TrimSpace(strings.ToLower(paraKey))
		if lower == "appid" || lower == "tid" || lower == "uid" {
			delete(params, paraKey)
		}
	}
	for _, val := range limitFields {
		_, ok := params[val]
		if ok {
			// 存在，但是不能包含该字段进行更新
			if isReversalFields {
				delete(params, val)
			}
		} else {

			if !isReversalFields {
				delete(params, val)
			}
		}
	}
	if !isValid {
		if result.HasErrors() {
			for _, val := range result.Errors {
				if _, ok := params[val.Field]; !ok {
					return false, FailError(E201204, errors.New(result.Errors[0].Message))
				}
			}

		}
	}
	return false, nil
}
func UpdateParams(table, keyName string, keyValue interface{}, model interface{}, params orm.Params,
	isReversalFields bool, fields string, ownerIds ...interface{}) (int64, error) {
	if len(strings.TrimSpace(table)) == 0 {
		return 0, FailError(E201204, errors.New("table参数不能为空"))
	}
	if len(strings.TrimSpace(keyName)) == 0 {
		return 0, FailError(E201204, errors.New("keyName参数不能为空"))
	}
	if len(params) == 0 {
		return 0, FailError(E201204, errors.New("params参数不能为空"))
	}
	limitFields := strings.Split(fields, ",")
	_, err := ValidParams(model, params, isReversalFields, limitFields...)
	if err != nil {
		return 0, err
	}

	qs := orm.NewOrm().QueryTable(table).Filter(keyName, keyValue)
	qs = AppendFilter(qs, ownerIds...)
	rowCount, err := qs.Update(params)
	return rowCount, err
}
func GetAuthKindValue(appid, tid, uid uint) uint8 {
	kind := DATA_SCOPE_DEFAULT
	if appid == 0 {
		kind = DATA_SCOPE_SYS
	} else if tid == 0 {
		kind = DATA_SCOPE_APP
	} else if uid == 0 {
		kind = DATA_SCOPE_TENANT
	} else {
		kind = DATA_SCOPE_USER
	}
	return kind
}

func GetSettingKindValue(appid, tid, uid uint) (uint8, uint, uint, uint) {
	kind := DATA_SCOPE_DEFAULT
	if appid == 0 {
		kind = DATA_SCOPE_SYS
		tid = 0
		uid = 0
	} else if tid == 0 {
		kind = DATA_SCOPE_APP
		uid = 0
	} else if uid == 0 {
		kind = DATA_SCOPE_TENANT
	} else {
		kind = DATA_SCOPE_USER
	}
	return kind, appid, tid, uid
}
