package controllers

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models"
	baseModels "yellbuy.com/YbGoCloundFramework/models/base"
	"yellbuy.com/YbGoCloundFramework/utils"
)

type LoginToken struct {
	User  *baseModels.User `json:"user"`
	Token string           `json:"token"`
}
type CommonApiController struct {
	beego.Controller
	User *baseModels.User
	// 是否验Token，验证情况下，token验证是否将立即返回错误，否则作为未授权用户处理
	IsValidateToken bool
	Appid           uint
	Tid             uint
	Uid             uint
}

//Response 结构体
type Response struct {
	Errcode int         `json:"errcode"`
	Errmsg  string      `json:"errmsg"`
	Data    interface{} `json:"data"`
}
type ResponseList struct {
	Errcode int         `json:"errcode"`
	Errmsg  string      `json:"errmsg"`
	Data    interface{} `json:"data"`
	Total   int64       `json:"total"`
}

//Response 结构体
type ErrResponse struct {
	Errcode int         `json:"errcode"`
	Errmsg  interface{} `json:"errmsg"`
}

//前期准备
func (self *CommonApiController) Prepare() {
	if self.Ctx.Input.IsOptions() {
		self.Success("ok")
	}
	appid, _ := self.GetHeaderUint("appid")
	if appid == 0 {
		appid, _ = self.GetUint("appid")
	}
	if appid == 0 {
		appid, _ = self.GetParaUint("appid")
	}

	if appid == 0 {
		self.Fail(libs.E100000, "appid参数无效")
	}
	// 设置应用范围ID
	self.Appid = appid

	et := utils.EasyToken{}
	authtoken := strings.TrimSpace(self.Ctx.Request.Header.Get("Authorization"))
	valid, token, err := et.ValidateToken(authtoken)
	if valid && err == nil {
		self.Uid = uint(token.Uid)
	}
	if self.IsValidateToken {
		fmt.Println(valid, token, err)
		if err != nil {
			self.Fail(libs.E100001, err.Error())
		}
		if !valid {
			self.Fail(libs.E100001, libs.ErrorMap[libs.E100001])
		}

	}

	if self.Uid > 0 {
		user, err := baseModels.UserGetByAuth(self.Uid)
		if err != nil {
			if self.IsValidateToken {
				self.Fail(libs.E100001, err.Error())
			}
			self.Uid = 0
			baseModels.DeleteUserAuthCache(self.Uid)
		} else {
			self.User = user
			self.Appid = user.Appid
			self.Tid = user.Tid
		}
	}
}
func (self *CommonApiController) Options() {
	self.Success(self.Uid)
}
func (self *CommonApiController) Success(data interface{}) {
	// out := make(map[string]interface{})
	// out["errno"] = 0
	// out["errmsg"] = "ok"
	// out["data"] = data
	self.Data["json"] = Response{0, "ok", data}
	self.ServeJSON()
	self.StopRun()
}

func (self *CommonApiController) SuccessList(data interface{}, total int64) {
	// out := make(map[string]interface{})
	// out["errno"] = 0
	// out["errmsg"] = "ok"
	// out["data"] = data
	self.Data["json"] = ResponseList{0, "ok", data, total}
	self.ServeJSON()
	self.StopRun()
}
func (self *CommonApiController) SuccessWithMsg(data interface{}, msg string) {
	// out := make(map[string]interface{})
	// out["errno"] = 0
	// out["errmsg"] = msg
	// out["data"] = data
	self.Data["json"] = Response{0, msg, data}
	self.ServeJSON()
	self.StopRun()
}

func (self *CommonApiController) Fail(errcode int, errmsg interface{}) {
	// out := make(map[string]interface{})
	// out["errcode"] = errcode
	// out["errmsg"] = errmsg
	self.Data["json"] = ErrResponse{errcode, errmsg}
	self.ServeJSON()
	self.StopRun()
}

// GetUint returns input value as int64 or the default value while it's present and input is blank.
func (self *CommonApiController) GetUint(key string, def ...uint) (uint, error) {
	strv := self.Ctx.Input.Query(key)
	if len(strv) == 0 && len(def) > 0 {
		return def[0], nil
	}
	val, err := strconv.ParseInt(strv, 10, 64)
	return uint(val), err
}
func (self *CommonApiController) GetHeaderUint(key string) (uint, error) {
	str := self.Ctx.Request.Header.Get(key)
	if v, err := strconv.Atoi(str); err == nil {
		return uint(v), nil
	} else {
		return 0, err
	}
}

func (self *CommonApiController) GetParaUint(key string) (uint, error) {
	return libs.GetUintParam(self.Ctx.Input.Params(), key)
}
func (self *CommonApiController) GetParaInt64(key string) (int64, error) {
	return libs.GetInt64Param(self.Ctx.Input.Params(), key)
}
func (self *CommonApiController) GetParaString(key string) string {
	return self.Ctx.Input.Param(key)
}

func (self *CommonApiController) GetClientIp() string {
	s := self.Ctx.Input.IP()
	return s
	// s := self.Ctx.Request.RemoteAddr
	// l := strings.LastIndex(s, ":")
	// return s[0:l]
}

// func (self *BaseApiController) Finish() {
// 	// AllowOrigins: []string{"https://*.foo.com"},
// 	//  AllowMethods: []string{"PUT", "PATCH"},
// 	//  AllowHeaders: []string{"Origin"},
// 	//  ExposeHeaders: []string{"Content-Length"},
// 	//  AllowCredentials: true,    }))
// 	self.Ctx.ResponseWriter.Header().Add("Access-Control-Allow-Origin", "*")
// 	self.Ctx.ResponseWriter.Header().Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
// 	self.Ctx.ResponseWriter.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
// }

var sqlOp = map[string]string{
	"eq":  "=",
	"ne":  "<>",
	"gt":  ">",
	"gte": ">=",
	"lt":  "<",
	"lte": "<=",
}

var queryOp = map[string]string{
	"eq":  "exact",
	"gt":  "gt",
	"gte": "gte",
	"lt":  "lt",
	"lte": "lte",
	"sw":  "startswith",
	"ew":  "endswith",
	"ct":  "contains",
}
var condOp = map[string]string{
	"_and_": "and",
	"_or_":  "or",
	"_AND_": "and",
	"_OR_":  "or",
	"_And_": "and",
	"_Or_":  "or",
}

// ParseOffsetParm parse offset parameter.
//   offset=n
func (base *CommonApiController) ParseFieldsParm() []string {
	var fields []string
	// fields: col1,col2,entity.col3
	if v := base.GetString("fields"); v != "" {
		fields = strings.Split(v, ",")
	}
	return fields
}

// ParseQueryParm parse query parameters.
//   query=col1:op1:val1,col2:op2:val2,...
//   op: =, ne, gt, ge, lt, le
func (base *CommonApiController) ParseQueryParm() (v map[string]interface{}, err error) {
	var nameRule = regexp.MustCompile("^[a-zA-Z0-9_]+$")
	queryVal := make(map[string]interface{})

	query := base.GetString("query")
	if query == "" {
		return queryVal, nil
	}

	for _, cond := range strings.Split(query, ",") {
		kov := strings.Split(cond, ":")
		if len(kov) != 3 {
			return queryVal, errors.New("Query format != k:o:v")
		}

		var key string
		var value string
		var operator string
		if !nameRule.MatchString(kov[0]) {
			return queryVal, errors.New("Query key format is wrong")
		}
		key = kov[0]
		if op, ok := queryOp[kov[1]]; ok {
			operator = op
		} else {
			return queryVal, errors.New("Query operator is wrong")
		}
		value = strings.Replace(kov[2], "'", "\\'", -1)
		key = key + "__" + operator
		queryVal[key] = value
	}

	return queryVal, nil
}

// ParseQueryParm parse query parameters.
//   exclude=col1:op1:val1,col2:op2:val2,...
//   op: =, ne, gt, ge, lt, le
func (base *CommonApiController) ParseExcludeParm() (v map[string]interface{}, err error) {
	var nameRule = regexp.MustCompile("^[a-zA-Z0-9_]+$")
	queryVal := make(map[string]interface{})

	query := base.GetString("exclude")
	if query == "" {
		return queryVal, nil
	}

	for _, cond := range strings.Split(query, ",") {
		kov := strings.Split(cond, ":")
		if len(kov) != 3 {
			return queryVal, errors.New("Query 参数个数不正确，应为 k:o:v")
		}

		var key string
		var value string
		var operator string
		if !nameRule.MatchString(kov[0]) {
			return queryVal, errors.New("Query key format is wrong")
		}
		key = kov[0]
		if op, ok := queryOp[kov[1]]; ok {
			operator = op
		} else {
			return queryVal, errors.New("Query operator is wrong")
		}
		value = strings.Replace(kov[2], "'", "\\'", -1)
		key = key + "__" + operator
		queryVal[key] = value
	}

	return queryVal, nil
}

// ParseOrderParm parse order parameters.
//   order=col1:asc|desc,col2:asc|esc,...
func (base *CommonApiController) ParseOrderParm() (sortBy []string, order []string, err error) {
	var nameRule = regexp.MustCompile("^[a-zA-Z0-9_]+$")
	sortBy = make([]string, 0)
	order = make([]string, 0)

	v := strings.TrimSpace(base.GetString("order"))
	if len(v) == 0 {
		return sortBy, order, nil
	}

	for _, cond := range strings.Split(v, ",") {
		kv := strings.Split(cond, ":")
		if len(kv) < 1 {
			return nil, nil, errors.New("Order format != k:v")
		}
		if !nameRule.MatchString(kv[0]) {
			return nil, nil, errors.New("Order key format is wrong")
		}
		if len(kv) > 1 {
			o := strings.TrimSpace(kv[1])
			if len(o) == 0 {
				o = "asc"
			} else if o != "asc" && o != "desc" {
				return nil, nil, errors.New("Order val isn't asc/desc")
			}
			order = append(order, o)
		}

		sortBy = append(sortBy, kv[0])

	}

	return sortBy, order, nil
}

// ParseLimitParm parse limit parameter.
//   limit=n
func (base *CommonApiController) ParseLimitParm() (l int64, err error) {
	v, err := base.GetInt64("limit")
	if err != nil {
		if v, err = base.GetInt64("pageSize"); err != nil {
			return 10, err
		}
	}
	if v > 0 {
		return v, nil
	} else {
		return 10, nil
	}
}

// ParseOffsetParm parse offset parameter.
//   offset=n
func (base *CommonApiController) ParseOffsetParm(pageSize int64) (o int64, err error) {
	v, err := base.GetInt64("offset")
	if err != nil {
		if pageIndex, err := base.GetInt64("pageIndex"); err != nil {
			return 0, err
		} else {
			v = pageIndex * pageSize
		}
	}
	if v > 0 {
		return v, nil
	} else {
		return 0, nil
	}
}

// VerifyForm use validation to verify input parameters.
func (base *CommonApiController) VerifyForm(obj interface{}) (err error) {
	valid := validation.Validation{}
	ok, err := valid.Valid(obj)
	if err != nil {
		return err
	}
	if !ok {
		str := ""
		for _, err := range valid.Errors {
			str += err.Key + ":" + err.Message + ";"
		}
		return errors.New(str)
	}

	return nil
}

// 解析url query查询参数进行通用查询
// api/v1/rhjj/forms?query=id:gt:1036014&fields=id,category.name&limit=1&order=id:asc
func (base *CommonApiController) GetAllByQuery(tableName string, condMap map[string]map[string]interface{}, ids ...uint) (int64, []orm.Params) {
	fields := base.ParseFieldsParm()
	return base.GetAllByQueryForFields(tableName, condMap, fields, ids...)
}

// 解析url query查询参数进行通用查询
// api/v1/rhjj/forms?query=id:gt:1036014&fields=id,category.name&limit=1&order=id:asc
func (base *CommonApiController) GetAllByQueryForFields(tableName string, condMap map[string]map[string]interface{}, fields []string, ids ...uint) (int64, []orm.Params) {
	queryVal, err := base.ParseQueryParm()
	if err != nil {
		beego.Debug("ParseQuery:", err)
		base.Fail(libs.E100000, err.Error())
	}
	beego.Debug("QueryVal:", queryVal)
	excludeVal, err := base.ParseExcludeParm()
	if err != nil {
		beego.Debug("ParseExclude:", err)
		base.Fail(libs.E100000, err.Error())
	}
	beego.Debug("ExcludeVal:", excludeVal)
	sortBy, order, err := base.ParseOrderParm()
	if err != nil {
		beego.Debug("ParseOrder:", err)
		base.Fail(libs.E100000, err.Error())
	}
	beego.Debug("Order:", order)

	limit, err := base.ParseLimitParm()
	/*
		if err != nil {
			beego.Debug("ParseLimit:", err)
			c.RetError(errInputData)
			return
		}
	*/
	beego.Debug("Limit:", limit)

	offset, err := base.ParseOffsetParm(limit)
	/*
		if err != nil {
			beego.Debug("ParseOffset:", err)
			c.RetError(errInputData)
			return
		}
	*/
	beego.Debug("Offset:", offset)
	// func FormTemplateGetAll(tid uint, appid uint, query map[string]interface{}, exclude map[string]interface{},
	// condMap map[string]map[string]interface{}, fields []string, sortBy []string,
	// order []string, offset int64, limit int64) (int64, []FormTemplate, error) {
	total, result, err := GetAll(tableName, queryVal, excludeVal, condMap, fields, sortBy, order, offset, limit, ids...)
	if err != nil {
		beego.Error("GetAll:", err)
		base.Fail(libs.E100000, err.Error())
	}
	return total, result
}

// 通用查询
func GetAll(tableName string, query map[string]interface{}, exclude map[string]interface{},
	condMap map[string]map[string]interface{}, fields []string, sortby []string,
	order []string, offset int64, limit int64, ids ...uint) (int64, []orm.Params, error) {
	return models.QueryGetAll(tableName, query, exclude, condMap, fields, sortby, order, offset, limit, ids...)
}
