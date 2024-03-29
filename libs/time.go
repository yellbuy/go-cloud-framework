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
	"fmt"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
)

type Time struct {
	time.Time
}

// MarshalJSON 序列化为JSON
func (t Time) MarshalJSON() ([]byte, error) {
	if t.IsZero() {
		return []byte("\"\""), nil
	}
	stamp := fmt.Sprintf("\"%s\"", t.Format("2006-01-02 15:04:05"))
	return []byte(stamp), nil
}

// UnmarshalJSON 反序列化为JSON
func (t *Time) UnmarshalJSON(data []byte) error {
	var err error
	t.Time, err = time.Parse("2006-01-02 15:04:05", string(data)[1:20])
	return err
}

// String 重写String方法
func (t *Time) String() string {
	data, _ := json.Marshal(t)
	return string(data)
}

// FieldType 数据类型
func (t *Time) FieldType() int {
	return orm.TypeDateTimeField

}

// SetRaw 读取数据库值
func (t *Time) SetRaw(value interface{}) error {
	switch value.(type) {
	case time.Time:
		t.Time = value.(time.Time)
	}
	return nil
}

// RawValue 写入数据库
func (t *Time) RawValue() interface{} {
	str := t.Format("2006-01-02 15:04:05")
	if str == "0001-01-01 00:00:00" {
		return nil
	}
	return str
}

// Format 跟 PHP 中 date 类似的使用方式，如果 ts 没传递，则使用当前时间
func Format(format string, ts ...time.Time) string {
	patterns := []string{
		// 年
		"Y", "2006", // 4 位数字完整表示的年份
		"y", "06", // 2 位数字表示的年份

		// 月
		"m", "01", // 数字表示的月份，有前导零
		"n", "1", // 数字表示的月份，没有前导零
		"M", "Jan", // 三个字母缩写表示的月份
		"F", "January", // 月份，完整的文本格式，例如 January 或者 March

		// 日
		"d", "02", // 月份中的第几天，有前导零的 2 位数字
		"j", "2", // 月份中的第几天，没有前导零

		"D", "Mon", // 星期几，文本表示，3 个字母
		"l", "Monday", // 星期几，完整的文本格式;L的小写字母

		// 时间
		"g", "3", // 小时，12 小时格式，没有前导零
		"G", "15", // 小时，24 小时格式，没有前导零
		"h", "03", // 小时，12 小时格式，有前导零
		"H", "15", // 小时，24 小时格式，有前导零

		"a", "pm", // 小写的上午和下午值
		"A", "PM", // 小写的上午和下午值

		"i", "04", // 有前导零的分钟数
		"s", "05", // 秒数，有前导零
	}
	replacer := strings.NewReplacer(patterns...)
	format = replacer.Replace(format)

	t := time.Now()
	if len(ts) > 0 {
		t = ts[0]
	}
	return t.Format(format)
}

func StrToLocalTime(value string) time.Time {
	if value == "" {
		return time.Time{}
	}
	zoneName, offset := time.Now().Zone()

	zoneValue := offset / 3600 * 100
	if zoneValue > 0 {
		value += fmt.Sprintf(" +%04d", zoneValue)
	} else {
		value += fmt.Sprintf(" -%04d", zoneValue)
	}

	if zoneName != "" {
		value += " " + zoneName
	}
	return StrToTime(value)
}

func StrToTime(value string) time.Time {
	if value == "" {
		return time.Time{}
	}
	layouts := []string{
		"2006-01-02 15:04:05 -0700 MST",
		"2006-01-02 15:04:05 -0700",
		"2006-01-02 15:04:05",
		"2006/01/02 15:04:05 -0700 MST",
		"2006/01/02 15:04:05 -0700",
		"2006/01/02 15:04:05",
		"2006-01-02 -0700 MST",
		"2006-01-02 -0700",
		"2006-01-02",
		"2006/01/02 -0700 MST",
		"2006/01/02 -0700",
		"2006/01/02",
		"2006-01-02 15:04:05 -0700 -0700",
		"2006/01/02 15:04:05 -0700 -0700",
		"2006-01-02 -0700 -0700",
		"2006/01/02 -0700 -0700",
		time.ANSIC,
		time.UnixDate,
		time.RubyDate,
		time.RFC822,
		time.RFC822Z,
		time.RFC850,
		time.RFC1123,
		time.RFC1123Z,
		time.RFC3339,
		time.RFC3339Nano,
		time.Kitchen,
		time.Stamp,
		time.StampMilli,
		time.StampMicro,
		time.StampNano,
	}

	var t time.Time
	var err error
	for _, layout := range layouts {
		t, err = time.Parse(layout, value)
		if err == nil {
			return t
		}
	}
	panic(err)
}
