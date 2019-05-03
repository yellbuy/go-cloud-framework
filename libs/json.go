/**********************************************
** @Des: This file ...
** @Author: yellbuy
** @Date:   2017-09-08 00:24:25
** @Last Modified by:   yellbuy
** @Last Modified time: 2017-09-17 10:12:06
***********************************************/

package libs

import (
	"encoding/json"
	"errors"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/logs"

	// "github.com/polaris1119/logger"
	simplejson "github.com/bitly/go-simplejson"
)

// ParseJson2Struct 解析 json 到 struct 或 slice struct
func ParseJson2Struct(body []byte, v interface{}) error {
	rv := reflect.ValueOf(v)
	if rv.Kind() != reflect.Ptr || rv.IsNil() {
		return &json.InvalidUnmarshalError{Type: reflect.TypeOf(v)}
	}

	sjson, err := simplejson.NewJson(body)
	if err != nil {
		return err
	}

	rv = rv.Elem()
	if rv.Kind() == reflect.Slice {
		for i, length := 0, rv.Len(); i < length; i++ {
			modelVal := rv.Index(i)
			parseJsonOneStruct(modelVal, sjson.GetIndex(i))
		}
		return nil
	} else {
		return parseJsonOneStruct(rv, sjson)
	}
}

// parseJsonOneStruct 解析 json 到 一个struct
func parseJsonOneStruct(rv reflect.Value, sjson *simplejson.Json) error {
	if rv.Kind() != reflect.Struct {
		return errors.New("v must be pointer of struct")
	}

	fieldType := rv.Type()

	for i, fieldCount := 0, rv.NumField(); i < fieldCount; i++ {
		fieldVal := rv.Field(i)
		if !fieldVal.CanSet() {
			continue
		}

		structField := fieldType.Field(i)
		structTag := structField.Tag
		names := strings.Split(structTag.Get("json"), ",")
		name := names[0]

		var (
			tmpJson *simplejson.Json
			ok      bool
		)
		if tmpJson, ok = sjson.CheckGet(name); !ok {
			name = structField.Name
			if tmpJson, ok = sjson.CheckGet(name); !ok {
				continue
			}
		}

		switch structField.Type.Kind() {
		case reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uint, reflect.Uintptr:
			val := tmpJson.MustUint64()
			if val == 0 {
				val, _ = strconv.ParseUint(tmpJson.MustString("0"), 10, 64)
			}
			fieldVal.SetUint(val)
		case reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64, reflect.Int:
			val := tmpJson.MustInt64()
			if val == 0 {
				val, _ = strconv.ParseInt(tmpJson.MustString("0"), 10, 64)
			}
			fieldVal.SetInt(val)
		case reflect.String:
			val, err := tmpJson.String()
			if err != nil {
				v, err := tmpJson.Uint64()
				if err != nil {
					logs.Error("[string]name=", name, ";field_type=string;value=", tmpJson)
					// logger.Errorln("[string]name=", name, ";field_type=string;value=", tmpJson)
				} else {
					val = strconv.FormatUint(v, 10)
				}
			}
			fieldVal.SetString(val)
		case reflect.Bool:
			val := tmpJson.MustBool()
			if !val {
				val, _ = strconv.ParseBool(tmpJson.MustString("false"))
			}
			fieldVal.SetBool(val)
		case reflect.Float32, reflect.Float64:
			val := tmpJson.MustFloat64()
			if val == 0.0 {
				val, _ = strconv.ParseFloat(tmpJson.MustString("0.0"), 64)
			}
			fieldVal.SetFloat(val)
		case reflect.Struct:
			if structField.Type.Name() == "Time" {
				local, _ := time.LoadLocation("Local")
				val, err := time.ParseInLocation("2006-01-02 15:04:05", tmpJson.MustString(), local)
				if err == nil {
					fieldVal.Set(reflect.ValueOf(val))
				}
			}
		default:
			logs.Error("name=", name, ";field_type=", structField.Type.Kind(), ";value=", tmpJson)
			// logger.Errorln("name=", name, ";field_type=", structField.Type.Kind(), ";value=", tmpJson)
		}
	}

	return nil
}
