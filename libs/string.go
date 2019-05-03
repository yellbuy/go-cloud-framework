/**********************************************
** @Des: This file ...
** @Author: 
** @Date:   2017-09-08 00:24:25
** @Last Modified by:   
** @Last Modified time: 2017-09-17 10:12:06
***********************************************/

package libs

import (
	"crypto/md5"
	"fmt"
	"math"
	"math/rand"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

var emailPattern = regexp.MustCompile("[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[a-zA-Z0-9](?:[\\w-]*[\\w])?")

func JoinForInterface(joinStr string, params ...interface{}) string {
	if len(params) == 0 {
		return ""
	}
	strArray := make([]string, len(params))
	for i, arg := range params {
		switch arg.(type) {
		case int64:
			strArray[i] = strconv.FormatInt(arg.(int64), 10)
		case uint64:
			strArray[i] = strconv.FormatUint(arg.(uint64), 10)
		case int:
			strArray[i] = strconv.Itoa(arg.(int))
		case string:
			strArray[i] = arg.(string)
		}
	}
	str := strings.Join(strArray, joinStr)
	return str
}

func JoinForInt64Arr(joinStr string, params []int64) string {
	if len(params) == 0 {
		return ""
	}
	strArray := make([]string, len(params))
	for i, arg := range params {
		strArray[i] = strconv.FormatInt(arg, 10)
	}
	str := strings.Join(strArray, joinStr)
	return str
}

func JoinForIntArr(joinStr string, params []int) string {
	if len(params) == 0 {
		return ""
	}
	strArray := make([]string, len(params))
	for i, arg := range params {
		strArray[i] = strconv.Itoa(arg)
	}
	str := strings.Join(strArray, joinStr)
	return str
}

func StringArray2Interface(strSls []string) []interface{} {
	newSls := make([]interface{}, len(strSls))
	for i, v := range strSls {
		newSls[i] = v
	}
	return newSls
}

func Split2Interface(str string) []interface{} {
	if len(str) == 0 {
		return make([]interface{}, 0)
	}
	arr := strings.Split(str, ",")
	return StringArray2Interface(arr)
}

func Split2Int64(str string) []int64 {
	if len(str) == 0 {
		return make([]int64, 0)
	}
	arr := strings.Split(str, ",")
	res := StringArray2Interface(arr)
	return Interface2IntArr(res...)
}
func Split2Uint(str string) []uint {
	if len(str) == 0 {
		return make([]uint, 0)
	}
	arr := strings.Split(str, ",")
	res := StringArray2Interface(arr)
	return Interface2UintArr(res...)
}
func Interface2IntArr(params ...interface{}) []int64 {
	array := make([]int64, len(params))
	if len(params) == 0 {
		return array
	}
	for i, arg := range params {
		switch arg.(type) {
		case uint:
			array[i] = int64(arg.(uint))
		case int64:
			array[i] = arg.(int64)
		case uint64:
			array[i] = int64(arg.(uint64))
		case int:
			array[i] = int64(arg.(int))
		case string:
			if v, err := strconv.Atoi(arg.(string)); err == nil {
				array[i] = int64(v)
			}
		}
	}
	return array
}
func Interface2UintArr(params ...interface{}) []uint {
	array := make([]uint, len(params))
	if len(params) == 0 {
		return array
	}
	for i, arg := range params {
		switch arg.(type) {
		case uint:
			array[i] = arg.(uint)
		case int64:
			array[i] = uint(arg.(int64))
		case uint64:
			array[i] = uint(arg.(uint64))
		case int:
			array[i] = uint(arg.(int))
		case string:
			if v, err := strconv.Atoi(arg.(string)); err == nil {
				array[i] = uint(v)
			}
		}
	}
	return array
}
func Md5(buf []byte) string {
	hash := md5.New()
	hash.Write(buf)
	return fmt.Sprintf("%x", hash.Sum(nil))
}

func SizeFormat(size float64) string {
	units := []string{"Byte", "KB", "MB", "GB", "TB"}
	n := 0
	for size > 1024 {
		size /= 1024
		n += 1
	}

	return fmt.Sprintf("%.2f %s", size, units[n])
}

func IsEmail(b []byte) bool {
	return emailPattern.Match(b)
}

func Password(len int, pwdO string) (pwd string, salt string) {
	salt = GetRandomString(4)
	defaultPwd := "123456"
	if pwdO != "" {
		defaultPwd = pwdO
	}
	pwd = Md5([]byte(defaultPwd + salt))
	return pwd, salt
}

// 生成32位MD5
// func MD5(text string) string{
//    ctx := md5.New()
//    ctx.Write([]byte(text))
//    return hex.EncodeToString(ctx.Sum(nil))
// }

//生成随机字符串
func GetRandomString(lens int) string {
	str := "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	bytes := []byte(str)
	result := []byte{}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	for i := 0; i < lens; i++ {
		result = append(result, bytes[r.Intn(len(bytes))])
	}
	return string(result)
}

func AmountConvert(p_money float64, p_round bool) string {
	var NumberUpper = []string{"壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "零"}
	var Unit = []string{"分", "角", "圆", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟"}
	var regex = [][]string{
		{"零拾", "零"}, {"零佰", "零"}, {"零仟", "零"}, {"零零零", "零"}, {"零零", "零"},
		{"零角零分", "整"}, {"零分", "整"}, {"零角", "零"}, {"零亿零万零元", "亿元"},
		{"亿零万零元", "亿元"}, {"零亿零万", "亿"}, {"零万零元", "万元"}, {"万零元", "万元"},
		{"零亿", "亿"}, {"零万", "万"}, {"拾零圆", "拾元"}, {"零圆", "元"}, {"零零", "零"}}
	str, DigitUpper, Unit_Len, round := "", "", 0, 0
	if p_money == 0 {
		return "零"
	}
	if p_money < 0 {
		str = "负"
		p_money = math.Abs(p_money)
	}
	if p_round {
		round = 2
	} else {
		round = 1
	}
	Digit_byte := []byte(strconv.FormatFloat(p_money, 'f', round+1, 64)) //注意币种四舍五入
	Unit_Len = len(Digit_byte) - round

	for _, v := range Digit_byte {
		if Unit_Len >= 1 && v != 46 {
			s, _ := strconv.ParseInt(string(v), 10, 0)
			if s != 0 {
				DigitUpper = NumberUpper[s-1]

			} else {
				DigitUpper = "零"
			}
			str = str + DigitUpper + Unit[Unit_Len-1]
			Unit_Len = Unit_Len - 1
		}
	}
	for i, _ := range regex {
		reg := regexp.MustCompile(regex[i][0])
		str = reg.ReplaceAllString(str, regex[i][1])
	}
	if string(str[0:3]) == "元" {
		str = string(str[3:len(str)])
	}
	if string(str[0:3]) == "零" {
		str = string(str[3:len(str)])
	}
	return str
}

// String regex="(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<town>[^区]+区|.+镇)?(?<village>.*)";
// var geocoderPattern = regexp.MustCompile(`(?P<province>[^省]+自治区|.*?省|.*?行政区|.*?市)?(?P<city>[^市]+自治州|.*?州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)?(?P<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?P<street>[^区]+区|.+镇)?(?P<address>.*)`)
var geocoderPattern = regexp.MustCompile(`(?P<province>[^省]+自治区|.+?省|.+?行政区|.+?市)?(?P<city>[^市]+自治州|.+?地区|.+?行政单位|.+?盟|市辖区|.+?市|.+?州)?(?P<county>[^区]+县|.+?区|.+?市|.+?旗|.+?海域|.+?岛)(?P<street>[^区]+区|.+?镇|.+?街道|.+?民族乡|.+?乡)?(?P<address>.*)`)

const (
	ProvinceAlias = "province"
	CityAlias     = "city"
	CountyAlias   = "county"
	StreetAlias   = "street"
	AddressAlias  = "address"
)

//把地址进行省、市、区、街道分解
func GeocoderAddress(address string) map[string][2]string {
	// address = "北京市三台县xx路xx号"
	// address = "浙江省杭州市三台区浙江省杭州市三台区未台县xx路xx号"
	// address = "四川省凉山州会理县鹿厂镇明星村11号"
	//arr := geocoderPattern.FindAllStringSubmatch("四川省凉山彝族自治州会理县鹿厂镇明星村11号", -1)
	var res = map[string][2]string{ProvinceAlias: [2]string{"", ""}, CityAlias: [2]string{"", ""}, CountyAlias: [2]string{"", ""}, StreetAlias: [2]string{"", ""}, AddressAlias: [2]string{"", ""}}

	arrList := geocoderPattern.FindAllStringSubmatch(address, -1)
	groupNames := geocoderPattern.SubexpNames()
	fmt.Printf("%q\n", arrList)
	fmt.Printf("%q\n", groupNames)
	if len(arrList) == 0 {
		return res
	}
	arr := arrList[0]
	// [0]:"北京市三台区鹿厂镇明星村11号"
	// [1]:"北京市"
	// [2]:""
	// [3]:"三台区"
	// [4]:"鹿厂镇"
	// [5]:"明星村11号"
	for i, v := range groupNames {
		if i > 0 && len(arr) >= i {
			str := strings.TrimSpace(arr[i])
			val := res[v]
			if len(str) == 0 && i > 1 {
				// 为空，则设置为上一组的值
				preName := groupNames[i-1]
				val[0] = res[preName][0]
				val[1] = res[preName][1]

			} else {
				val[0] = str
				if i == 1 {
					// 省
					str = strings.Replace(str, "自治区", "", -1)
					str = strings.Replace(str, "行政区", "", -1)
					str = strings.Replace(str, "直辖市", "", -1)
					str = strings.Replace(str, "省", "", -1)
					str = strings.Replace(str, "市", "", -1)
				} else if i == 2 {
					// 市
					str = strings.Replace(str, "市辖区", "", -1)
					str = strings.Replace(str, "地级市", "", -1)
					str = strings.Replace(str, "市", "", -1)
					str = strings.Replace(str, "自治州", "", -1)
					str = strings.Replace(str, "州", "", -1)
					str = strings.Replace(str, "地区", "", -1)
					str = strings.Replace(str, "行政单位", "", -1)
					str = strings.Replace(str, "盟", "", -1)
					str = strings.Replace(str, "自治县", "", -1)
					str = strings.Replace(str, "县", "", -1)
				} else if i == 3 {
					// 区县
					str = strings.Replace(str, "县级市", "", -1)
					str = strings.Replace(str, "自治县", "", -1)
					str = strings.Replace(str, "市", "", -1)
					str = strings.Replace(str, "县", "", -1)
					str = strings.Replace(str, "市辖区", "", -1)
					str = strings.Replace(str, "区", "", -1)
					str = strings.Replace(str, "旗", "", -1)
					str = strings.Replace(str, "海域", "", -1)
					str = strings.Replace(str, "岛", "", -1)
				} else if i == 4 {
					// 乡镇
					str = strings.Replace(str, "街道", "", -1)
					str = strings.Replace(str, "民族乡", "", -1)
					str = strings.Replace(str, "镇", "", -1)
					str = strings.Replace(str, "区", "", -1)
					str = strings.Replace(str, "乡", "", -1)
				}
				val[1] = str
			}
			res[v] = val
		}
	}
	return res
}

// 对字符串字符进行排序
func SortString(src string, sep string) string {
	arr := strings.Split(src, sep)
	sort.Strings(arr)
	res := strings.Join(arr, sep)
	return res
}
