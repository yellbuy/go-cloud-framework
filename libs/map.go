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
	"strconv"
)

func GetInt64Param(input map[string]string, key string) (int64, error) {
	if v, ok := input[key]; ok {
		if v, err := strconv.Atoi(v); err == nil {
			return int64(v), nil
		} else {
			return 0, err
		}
	} else {
		return 0, errors.New("key 不存在")
	}
}

func GetDefaultInt64Param(input map[string]string, key string, defaultValue int64) int64 {
	if v, ok := input[key]; ok {
		if v, err := strconv.Atoi(v); err == nil {
			return int64(v)
		} else {
			return defaultValue
		}
	} else {
		return defaultValue
	}
}

func GetUintParam(input map[string]string, key string) (uint, error) {
	if v, ok := input[key]; ok {
		if v, err := strconv.Atoi(v); err == nil {
			return uint(v), nil
		} else {
			return 0, err
		}
	} else {
		return 0, errors.New("key 不存在")
	}
}

func GetDefaultUintParam(input map[string]string, key string, defaultValue uint) uint {
	if v, ok := input[key]; ok {
		if v, err := strconv.Atoi(v); err == nil {
			return uint(v)
		} else {
			return defaultValue
		}
	} else {
		return defaultValue
	}
}

func GetInt(input map[string]interface{}, key string) (int, error) {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case int64:
			return int(v.(int64)), nil
		case uint64:
			return int(v.(uint64)), nil
		case int:
			return v.(int), nil
		case string:
			if v, err := strconv.Atoi(v.(string)); err == nil {
				return v, nil
			} else {
				return 0, err
			}
		default:
			return 0, errors.New("无法解析的类型")
		}
	} else {
		return 0, errors.New("key 不存在")
	}
}

func GetDefaultInt(input map[string]interface{}, key string, defaultValue int) int {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case int64:
			return int(v.(int64))
		case uint64:
			return int(v.(uint64))
		case int:
			return int(v.(int))
		case string:
			if v, err := strconv.Atoi(v.(string)); err == nil {
				return v
			} else {
				return defaultValue
			}
		default:
			return defaultValue
		}
	} else {
		return defaultValue
	}
}

func GetUint(input map[string]interface{}, key string) (uint, error) {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case int64:
			return uint(v.(int64)), nil
		case uint64:
			return uint(v.(uint64)), nil
		case int:
			return uint(v.(int)), nil
		case uint:
			return v.(uint), nil
		case string:
			if v, err := strconv.Atoi(v.(string)); err == nil {
				return uint(v), nil
			} else {
				return 0, err
			}
		default:
			return 0, errors.New("无法解析的类型")
		}
	} else {
		return 0, errors.New("key 不存在")
	}
}

func GetDefaultUint(input map[string]interface{}, key string, defaultValue uint) uint {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case int64:
			return uint(v.(int64))
		case uint64:
			return uint(v.(uint64))
		case int:
			return uint(v.(int))
		case uint:
			return v.(uint)
		case string:
			if v, err := strconv.Atoi(v.(string)); err == nil {
				return uint(v)
			} else {
				return defaultValue
			}
		default:
			return defaultValue
		}
	} else {
		return defaultValue
	}
}

func GetInt64(input map[string]interface{}, key string) (int64, error) {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case int64:
			return v.(int64), nil
		case uint64:
			return int64(v.(uint64)), nil
		case int:
			return int64(v.(int)), nil
		case string:
			if v, err := strconv.Atoi(v.(string)); err == nil {
				return int64(v), nil
			} else {
				return 0, err
			}
		default:
			return 0, errors.New("无法解析的类型")
		}
	} else {
		return 0, errors.New("key 不存在")
	}
}

func GetDefaultInt64(input map[string]interface{}, key string, defaultValue int64) int64 {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case int64:
			return v.(int64)
		case uint64:
			return int64(v.(uint64))
		case int:
			return int64(v.(int))
		case string:
			if v, err := strconv.Atoi(v.(string)); err == nil {
				return int64(v)
			} else {
				return defaultValue
			}
		default:
			return defaultValue
		}
	} else {
		return defaultValue
	}
}

func GetString(input map[string]interface{}, key string) string {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case float64:
			return strconv.FormatFloat(v.(float64), 'f', -1, 64)
		case float32:
			return strconv.FormatFloat(float64(v.(float32)), 'f', -1, 32)
		case int64:
			return strconv.FormatInt(v.(int64), 10)
		case int:
			return strconv.Itoa(v.(int))
		case uint:
			return strconv.FormatInt(int64(v.(uint)), 10)
		case int8:
			return strconv.Itoa(int(v.(int8)))
		case uint8:
			return strconv.Itoa(int(v.(uint8)))
		case string:
			return v.(string)
		default:
			return ""
		}
	} else {
		return ""
	}
}

func GetDefaultString(input map[string]interface{}, key string, defaultValue string) string {
	if v, ok := input[key]; ok {
		switch v.(type) {
		case float64:
			return strconv.FormatFloat(v.(float64), 'f', -1, 64)
		case float32:
			return strconv.FormatFloat(float64(v.(float32)), 'f', -1, 32)
		case int64:
			return strconv.FormatInt(v.(int64), 10)
		case int:
			return strconv.Itoa(v.(int))
		case uint:
			return strconv.FormatInt(int64(v.(uint)), 10)
		case int8:
			return strconv.Itoa(int(v.(int8)))
		case uint8:
			return strconv.Itoa(int(v.(uint8)))
		case string:
			return v.(string)
		default:
			return defaultValue
		}
	} else {
		return defaultValue
	}
}
