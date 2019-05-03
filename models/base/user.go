/**********************************************
** @Des: This file ...
** @Author:
** @Date:   2017-09-16 15:42:43
** @Last Modified by:
** @Last Modified time: 2017-09-17 11:48:17
***********************************************/
package base

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/utils"
)

type IAttactUser interface {
	SetUser(user *User)
}

var Fields = []string{"Id", "Username", "Name", "Code", "Parentid", "Alias", "Pinyin", "Nickname", "Gender",
	"WorkPlace", "Position", "Kind", "Type", "Order", "Enable", "IsExternal", "IsSenior",
	"IsBoss", "IsAdmin", "IsHide", "Isleader", "Tel", "StateCode", "Idno", "Mobile", "Email",
	"Hiredate", "Birthdate", "Avatar", "Postcode", "Extattr", "ExternalProfile",
	"Country", "Province", "City", "District", "Street", "Streetnumber", "Address", "Addrcode", "Location", "LocationTime",
	"Lng", "Lat", "GeoHash", "Balance", "FrozenBalance", "Score", "Point", "Rank", "QrCode", "ExtAttr",
	"CreateTime", "UpdateTime", "LoginTime", "LoginDevice", "Remark", "SourceIdentifier", "RoleIds", "Uid", "Tid", "Appid"}

var AuthFields = []string{"id", "username", "name", "nickname", "email", "mobile", "avatar", "code", "tel",
	"position", "password", "salt", "enable", "role_ids", "login_time", "login_device", "is_admin", "isleader", "is_external", "tid", "appid"}

var UpdateFields = []string{"Username", "Name", "Code", "Parentid", "Alias", "Pinyin", "Nickname", "Gender",
	"WorkPlace", "Position", "Kind", "Type", "Order", "Enable", "IsExternal", "IsSenior",
	"IsBoss", "IsAdmin", "IsHide", "Isleader", "Tel", "StateCode", "Idno", "Mobile", "Email",
	"Hiredate", "Birthdate", "Avatar", "Postcode", "Extattr", "ExternalProfile",
	"Country", "Province", "City", "District", "Street", "Streetnumber", "Address", "Addrcode",
	"QrCode", "UpdateTime", "Remark", "SourceIdentifier", "RoleIds"}

var UpdateProfileFields = []string{"Name", "Code", "Alias", "Pinyin", "Nickname", "Gender",
	"WorkPlace", "Position", "Kind", "Type", "Order", "Enable", "IsExternal", "IsSenior",
	"IsBoss", "IsAdmin", "IsHide", "Isleader", "Tel", "StateCode", "Idno", "Mobile", "Email",
	"Hiredate", "Birthdate", "Avatar", "Postcode", "Extattr", "ExternalProfile",
	"Country", "Province", "City", "District", "Street", "Streetnumber", "Address", "Addrcode",
	"QrCode", "UpdateTime", "Remark", "SourceIdentifier"}

type UserBase struct {
	Id       uint
	Username string `valid:"MaxSize(64)"`
	Name     string `valid:"MaxSize(64)"`
	Code     string `valid:"MaxSize(64)"`
	Avatar   string `valid:"MaxSize(255)"`
	Parentid uint
	Nickname string `valid:"MaxSize(64)"`
	Gender   uint8
	Tel      string `valid:"MaxSize(32)"`
	Idno     string `valid:"MaxSize(18)"`
	Mobile   string `valid:"MaxSize(16)"`
	Email    string `valid:"MaxSize(64)"`
	Balance  float32
	// 冻结余额
	FrozenBalance float32
	Score         int
	Point         int
	Rank          uint
}

type User struct {
	Id              uint
	Username        string `valid:"MaxSize(64)"`
	Name            string `valid:"MaxSize(64)"`
	Code            string `valid:"MaxSize(64)"`
	Password        string `orm:"column(password)";valid:"Maxize(32)"`
	Salt            string `orm:"column(salt)";valid:"MaxSize(10)"`
	Parentid        uint
	Alias           string `valid:"MaxSize(32)"`
	Pinyin          string `valid:"MaxSize(127)"`
	Nickname        string `valid:"MaxSize(64)"`
	Gender          uint8
	WorkPlace       string `valid:"MaxSize(64)"`
	Position        string `valid:"MaxSize(128)"`
	Kind            int8
	Type            int8
	Order           int64
	Enable          uint8
	IsExternal      uint8
	IsSenior        uint8
	IsBoss          uint8
	IsAdmin         uint8
	IsHide          uint8
	Isleader        uint8
	Tel             string `valid:"MaxSize(32)"`
	StateCode       string `valid:"MaxSize(16)"`
	Idno            string `valid:"MaxSize(18)"`
	Mobile          string `valid:"MaxSize(16)"`
	Email           string `valid:"MaxSize(64)"`
	Hiredate        time.Time
	Birthdate       time.Time
	Avatar          string
	Postcode        string `valid:"MaxSize(16)"`
	Extattr         string
	ExternalProfile string
	Country         string `valid:"MaxSize(16)"`
	Province        string `valid:"MaxSize(16)"`
	City            string `valid:"MaxSize(16)"`
	District        string `valid:"MaxSize(16)"`
	Street          string `valid:"MaxSize(16)"`
	Streetnumber    string `valid:"MaxSize(16)"`
	Address         string `valid:"MaxSize(64)"`
	Addrcode        uint
	// 当前位置
	Location string `valid:"MaxSize(64)"`
	// 当前位置更新时间
	LocationTime time.Time
	Lng          float32
	Lat          float32
	GeoHash      string `valid:"MaxSize(16)"`
	Balance      float32
	// 冻结余额
	FrozenBalance float32
	Score         int
	Point         int
	Rank          uint
	QrCode        string `valid:"MaxSize(256)"`
	CreateTime    time.Time
	UpdateTime    time.Time
	LoginTime     time.Time
	// 登录设备信息，单点登录使用
	LoginDevice      string `valid:"MaxSize(36)"`
	Remark           string
	SourceIdentifier string `valid:"MaxSize(36)"`
	RoleIds          string
	IsDel            int8
	Uid              uint
	Tid              uint
	Appid            uint

	UserOrgs []*UserOrg `orm:"column(user_id);reverse(many)"` // 设置一对多的反向关系

	// 所属组织标识
	Orgs []int64 `orm:"-";`
	// 所属组织中的人员排序
	Orders []int64 `orm:"-";`
	// 所属组织中是否为领导
	Isleaders []uint8 `orm:"-";`
	// 所属职务
	Positions []string `orm:"-";`
	// 主岗
	MainOrg *Org `orm:"-";`
	// 新密码
	PasswordNew string `orm:"-";`
	// 确认密码
	PasswordConfirm string `orm:"-";`
}

type UserOrg struct {
	Id    int64
	OrgId int64
	// 组织信息
	Org *Org `orm:"-";`
	// UserId         int64
	Fid      string `valid:"MaxSize(256)"`
	Isleader uint8
	Position string `MaxSize(128)"`
	Order    int64
	Tid      uint
	Appid    uint
	User     *User `orm:"column(user_id);rel(fk)"` // 设置一对多关系
}

func (a *User) TableName() string {
	return TableName("base_user")
}

func (a *UserOrg) TableName() string {
	return TableName("base_user_org")
}

func UserTableName() string {
	return TableName("base_user")
}
func UserOrgTableName() string {
	return TableName("base_user_org")
}

// 判断用户是否是管理员用户
func (self *User) UserIsAdmin() bool {
	return self.IsAdmin == 1 || self.Id == 1000000001
}

// 数据验证
func UserValid(self *User) error {
	result := validation.Validation{}
	isValid, err := result.Valid(self)
	if err != nil {
		return FailError(E201004, err)
	}
	if !isValid {
		if result.HasErrors() {
			return FailError(E201004, errors.New(result.Errors[0].Message))
		}
	}
	// 判用户名是否重复
	if exist, err := UsernameExist(self.Appid, self.Tid, self.Id, self.Username); exist || err != nil {
		return FailError(E201024, err)
	}
	if len(self.Orgs) > 0 {
		if exist, err := OrgExistIds(self.Appid, self.Tid, self.Orgs...); !exist || err != nil {
			return FailError(E201000, err)
		}
	}
	return nil
}

func UsernameExist(appid, tid, id uint, username string) (bool, error) {
	cnt, err := orm.NewOrm().
		QueryTable(UserTableName()).
		Exclude("id", id).
		Exclude("is_del", 1).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("username", strings.TrimSpace(username)).Count()
	if err != nil {
		return false, FailError(E201000, nil)
	}

	return cnt > 0, nil
}

func userOrgCreate(data *User) []*UserOrg {
	userOrgs := make([]*UserOrg, 0, len(data.Orgs))
	if len(data.Orgs) == 0 {
		return userOrgs
	}
	o := orm.NewOrm()
	for i, v := range data.Orgs {
		userOrg := new(UserOrg)
		userOrg.OrgId = v

		// userOrg.UserId= data.Id
		userOrg.User = data
		userOrg.Tid = data.Tid
		userOrg.Appid = data.Appid
		userOrg.Order = data.Order
		userOrg.Isleader = data.Isleader
		userOrg.Position = data.Position
		if len(data.Orders) > i+1 {
			userOrg.Order = data.Orders[i]
		}
		if len(data.Isleaders) > i+1 {
			userOrg.Isleader = data.Isleaders[i]
		}
		if len(data.Positions) > i+1 {
			userOrg.Position = data.Positions[i]
		}
		if data.Id > 0 {
			row := new(UserOrg)
			err := o.QueryTable(UserOrgTableName()).
				Filter("org_id", userOrg.OrgId).Filter("user_id", userOrg.User.Id).One(row, "Id")
			if err == nil {
				userOrg.Id = row.Id
			}
		}

		userOrgs = append(userOrgs, userOrg)
	}
	return userOrgs
}

// 创建组织
func UserAdd(data *User, pwd string) (int64, error) {
	// 参数验证
	validErr := UserValid(data)
	if validErr != nil {
		return 0, validErr
	}
	data.IsDel = 0
	// 密码有效，设置密码
	pwd = strings.TrimSpace(pwd)
	if len(pwd) > 0 {
		enpwd, salt := Password(4, pwd)
		data.Password = enpwd
		data.Salt = salt
		data.CreateTime = time.Now()
	}

	//新增
	userOrgs := userOrgCreate(data)
	o := orm.NewOrm()
	o.Begin()
	if id, err := o.Insert(data); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	} else {
		if len(userOrgs) > 0 {
			if _, err := o.InsertMulti(100, userOrgs); err != nil {
				o.Rollback()
				return 0, FailError(E201000, err)
			}
		}
		o.Commit()
		return id, nil
	}
}

func UserUpdate(data *User, pwd string) (int64, error) {
	// 参数验证
	validErr := UserValid(data)
	if validErr != nil {
		return 0, validErr
	}
	data.UpdateTime = time.Now()
	// 密码有效，设置密码
	pwd = strings.TrimSpace(pwd)
	updateFields := UpdateFields
	if len(pwd) > 0 {
		pwd, salt := Password(4, pwd)
		data.Password = pwd
		data.Salt = salt
		updateFields = append(updateFields, "Password", "Salt")
		// data.CreateTime = time.Now()
	}

	userOrgs := userOrgCreate(data)
	o := orm.NewOrm()
	o.Begin()
	total, err := o.Update(data, updateFields...)
	if err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	}

	userOrgIds := make([]int64, 0)
	qs := o.QueryTable("base_user_org")
	if len(userOrgs) > 0 {
		for _, v := range userOrgs {
			// 不存在插入，否则更新
			if v.Id == 0 {
				if id, err := o.Insert(v); err != nil {
					o.Rollback()
					return 0, FailError(E201000, err)
				} else {
					v.Id = id
				}
			} else {
				if _, err := o.Update(v); err != nil {
					o.Rollback()
					return 0, FailError(E201000, err)
				}
			}
			userOrgIds = append(userOrgIds, v.Id)
		}
		// if _, err := qs.Filter("user_id", data.Id).Delete(); err != nil{
		// 	o.Rollback()
		// 	return 0, FailError(E201000,err)
		// }

		// 删除不包含的记录
		if _, err := qs.
			Exclude("id__in", userOrgIds).
			Filter("user_id", data.Id).
			Delete(); err != nil {
			o.Rollback()
			return 0, FailError(E201000, err)
		}
	} else {
		// 全删除
		if _, err := qs.Filter("user_id", data.Id).
			Delete(); err != nil {
			o.Rollback()
			return 0, FailError(E201000, err)
		}
	}
	o.Commit()
	// 删除用户缓存
	DeleteUserAuthCache(data.Id)
	DeleteUserCache(data.Id)
	return total, nil
}

// 更新基本信息
func UserUpdateProfile(data *User, pwd string) (int64, error) {
	// 参数验证
	validErr := UserValid(data)
	if validErr != nil {
		return 0, validErr
	}
	data.UpdateTime = time.Now()
	// 密码有效，设置密码
	pwd = strings.TrimSpace(pwd)
	updateFields := UpdateProfileFields
	if len(pwd) > 0 {
		pwd, salt := Password(4, pwd)
		data.Password = pwd
		data.Salt = salt
		updateFields = append(updateFields, "Password", "Salt")
		// data.CreateTime = time.Now()
	}
	o := orm.NewOrm()
	total, err := o.Update(data, updateFields...)
	// 删除用户缓存
	DeleteUserCache(data.Id)
	return total, err
}

// 更新用户的当前位置
func UserUpdateLocation(id uint, location string, lng, lat float32, scopeIds ...interface{}) error {
	o := orm.NewOrm()
	query := o.QueryTable(UserTableName()).Filter("id", id)
	if len(scopeIds) > 0 {
		query = query.Filter("appid", scopeIds[0])
	}
	if len(scopeIds) > 1 {
		query = query.Filter("tid", scopeIds[1])
	}
	_, err := query.Update(orm.Params{"location": location, "location_time": time.Now(), "lng": lng, "lat": lat})
	// 删除用户缓存
	DeleteUserCache(id)
	return err
}

// 更新余额
func UserUpdateBalance(appid, tid uint, id uint, balance float32) error {
	var user User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id", id).Limit(1).One(&user)
	if err != nil {
		return err
	}
	user.Balance = balance
	user.UpdateTime = time.Now()
	user.Balance = balance * float32(100)
	_, err = o.Update(&user, "Balance", "UpdateTime")
	// 删除用户缓存
	DeleteUserCache(id)
	return err
}

// 更新余额
func UserUpdateFrozenBalance(appid, tid uint, id uint, balance float32) error {
	var user User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id", id).Limit(1).One(&user)
	if err != nil {
		return err
	}
	user.FrozenBalance = user.FrozenBalance * float32(100)
	user.UpdateTime = time.Now()
	_, err = o.Update(&user, "FrozenBalance", "UpdateTime")
	// 删除用户缓存
	DeleteUserCache(id)
	return err
}

// 更新分数
func UserUpdateScore(appid, tid uint, id uint, score int) (int64, error) {
	var user User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id", id).Limit(1).One(&user)
	if err != nil {
		return 0, err
	}
	user.Score = score
	user.UpdateTime = time.Now()
	_, err = o.Update(&user, "score", "UpdateTime")
	// 删除用户缓存
	DeleteUserCache(id)
	return 0, err
}

// 更新积分
func UserUpdatePoint(appid, tid uint, id uint, point int) (int64, error) {
	var user User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id", id).Limit(1).One(&user)
	if err != nil {
		return 0, err
	}
	user.Point = point
	user.UpdateTime = time.Now()
	_, err = o.Update(&user, "point", "UpdateTime")
	// 删除用户缓存
	DeleteUserCache(id)
	return 0, err
}

// 更新排名
func UserUpdateRank(appid, tid uint, id uint, rank uint) (int64, error) {
	var user User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id", id).Limit(1).One(&user)
	if err != nil {
		return 0, err
	}
	user.Rank = rank
	user.UpdateTime = time.Now()
	_, err = o.Update(&user, "rank", "UpdateTime")
	// 删除用户缓存
	DeleteUserCache(id)
	return 0, err
}
func UserDelete(appid, tid uint, ids ...uint) (uint64, error) {
	idsLen := len(ids)
	if idsLen == 0 {
		return 0, FailError(E201004, nil)
	}
	if idsLen > 1000 {
		return 0, FailError(E201004, nil)
	}
	o := orm.NewOrm()
	o.Begin()
	// 查找下级节点数
	if num, err := o.QueryTable(UserTableName()).
		Filter("id__in", ids).
		Filter("appid", appid).
		Filter("tid", tid).
		Delete(); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	} else if num > 0 {
		// 删除人员所在组织
		if _, err := o.QueryTable(UserOrgTableName()).
			Filter("user_id__in", ids).
			Filter("appid", appid).
			Filter("tid", tid).
			Delete(); err != nil {
			o.Rollback()
			return 0, FailError(E201000, err)
		}
	}
	o.Commit()
	// 删除用户缓存
	for _, id := range ids {
		DeleteUserAuthCache(id)
		DeleteUserCache(id)
	}

	return 0, nil
}

func UserSoftDelete(appid uint, tid uint, ids ...uint) (int64, error) {
	idsLen := len(ids)
	if idsLen == 0 {
		return 0, FailError(E201004, nil)
	}
	if idsLen > 1000 {
		return 0, FailError(E201004, nil)
	}
	o := orm.NewOrm()
	o.Begin()
	// 查找下级节点数
	if num, err := o.QueryTable(UserTableName()).
		Filter("id__in", ids).
		Filter("appid", appid).
		Filter("tid", tid).
		Update(orm.Params{
			"IsDel": 1,
		}); err != nil {
		o.Rollback()
		return 0, FailError(E201000, err)
	} else if num > 0 {
		// 删除人员所在组织
		if _, err := o.QueryTable(UserOrgTableName()).
			Filter("user_id__in", ids).
			Filter("appid", appid).
			Filter("tid", tid).
			Delete(); err != nil {
			o.Rollback()
			return 0, FailError(E201000, err)
		}
	}
	o.Commit()
	// 删除用户缓存
	for _, id := range ids {
		DeleteUserAuthCache(id)
		DeleteUserCache(id)
	}
	return 0, nil
}

func UserGetById(appid uint, tid uint, id uint) (*User, error) {
	var data User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Exclude("is_del", 1).
		Filter("id", id).
		Filter("appid", appid).
		Filter("tid", tid).
		One(&data, Fields...)
	if err != nil {
		return nil, err
	}
	o.LoadRelated(&data, "UserOrgs")
	if len(data.UserOrgs) > 0 {
		data.MainOrg, _ = OrgGetById(appid, tid, data.UserOrgs[0].OrgId)
	}
	// 修正余额，因为beego orm coladd不支持float32，因此数据库中存储的单位为分，此处转换为元
	data.Balance = data.Balance / float32(100)
	return &data, nil
}

// 获取账户余额等信息
func UserGetNumberBy(id uint) (UserBase, error) {
	var data User
	user := UserBase{}
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Filter("is_del", 0).
		Filter("id", id).
		One(&data, "id", "name", "nickname", "username", "code", "avatar", "balance", "frozen_balance", "score", "point", "rank")
	if err != nil {
		return user, err
	}
	// 修正余额，因为beego orm coladd不支持float32，因此数据库中存储的单位为分，此处转换为元
	data.Balance = data.Balance / float32(100)

	user.Id = data.Id
	user.Name = data.Name
	user.Nickname = data.Nickname
	user.Username = data.Username
	user.Code = data.Code
	user.Avatar = data.Avatar
	user.Balance = data.Balance
	user.FrozenBalance = data.FrozenBalance
	user.Score = data.Score
	user.Point = data.Point
	user.Rank = data.Rank

	return user, nil
}

func UserGetBy(id uint) (*User, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBaseUserById, id)
	loadCallbackFunc := func() (interface{}, error) {
		var data User
		o := orm.NewOrm()
		err := o.QueryTable(UserTableName()).
			Filter("is_del", 0).
			Filter("id", id).
			One(&data, Fields...)
		if err != nil {
			return nil, err
		}
		o.LoadRelated(&data, "UserOrgs")
		if len(data.UserOrgs) > 0 {
			data.MainOrg, _ = OrgGetById(data.Appid, data.Tid, data.UserOrgs[0].OrgId)
		}
		// 修正余额，因为beego orm coladd不支持float32，因此数据库中存储的单位为分，此处转换为元
		data.Balance = data.Balance / float32(100)
		return &data, nil
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		return nil, err
	}
	user := res.(*User)
	return user, nil

}

func UserGetByUsername(appid, tid uint, username string) (*User, error) {
	var data User
	o := orm.NewOrm()
	err := o.QueryTable(UserTableName()).
		Exclude("is_del", 1).
		Filter("username", strings.TrimSpace(username)).
		Filter("appid", appid).
		Filter("tid", tid).
		One(&data, Fields...)
	if err != nil {
		return nil, err
	}
	_, err = o.LoadRelated(&data, "UserOrgs")
	if err != nil {
		return nil, err
	}
	if len(data.UserOrgs) > 0 {
		data.MainOrg, _ = OrgGetById(appid, tid, data.UserOrgs[0].OrgId)
	}
	// 修正余额，因为beego orm coladd不支持float32，因此数据库中存储的单位为分，此处转换为元
	data.Balance = data.Balance / float32(100)
	return &data, nil
}

func UserLoadByIds(appid uint, tid uint, ids ...uint) ([]*User, error) {
	idsLen := len(ids)
	if idsLen == 0 {
		return nil, FailError(E201004, nil)
	}
	if idsLen > 1000 {
		return nil, FailError(E201004, nil)
	}
	list := make([]*User, idsLen)
	_, err := orm.NewOrm().
		QueryTable(UserTableName()).
		Exclude("is_del", 1).
		Filter("appid", appid).
		Filter("tid", tid).
		Filter("id__in", ids).
		OrderBy("order").
		All(&list, Fields...)
	if err != nil {
		return nil, FailError(E201000, nil)
	}
	return list, nil
}
func UserLoadBy(ids ...uint) ([]*User, error) {
	idsLen := len(ids)
	if idsLen == 0 {
		return nil, FailError(E201004, nil)
	}
	if idsLen > 1000 {
		return nil, FailError(E201004, nil)
	}
	list := make([]*User, idsLen)
	_, err := orm.NewOrm().
		QueryTable(UserTableName()).
		Exclude("is_del", 1).
		Filter("id__in", ids).
		OrderBy("order").
		All(&list, Fields...)
	if err != nil {
		return nil, FailError(E201000, nil)
	}
	return list, nil
}

func UserList(appid, tid uint, external int, pageIndex, pageSize uint32, order string, filters ...interface{}) (int64, []*User) {
	offset := pageIndex * pageSize
	list := make([]*User, 0)
	query := orm.NewOrm().QueryTable(UserTableName())
	if len(filters) > 0 {
		l := len(filters)
		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	query = query.Exclude("is_del", 1).Filter("appid", appid).Filter("tid", tid)
	// 是否过滤外部用户
	if external > -1 {
		query = query.Filter("is_external", external)
	}
	if len(order) == 0 {
		order = "order"
	}
	query = query.OrderBy(order)
	total, _ := query.Count()
	query.Limit(pageSize, offset).All(&list, Fields...)
	return total, list
}

// 查找人员所在的部门负责人
func LeaderList(appid, tid uint, external int8, orgid, uid uint) []*User {
	query := orm.NewOrm().QueryTable(UserTableName()).
		Filter("is_del", 0).
		Filter("appid", appid).Filter("tid", tid).Filter("Isleader", 1)

	if orgid > 0 {
		query = query.Filter("UserOrgs__OrgId", orgid)
	}
	// 是否过滤外部用户
	if external > -1 {
		query = query.Filter("is_external", external)
	}
	list := make([]*User, 0)
	if uid > 0 {
		user, _ := UserGetById(appid, tid, uid)
		if user != nil && len(user.UserOrgs) > 0 {
			orgIds := make([]interface{}, 0)
			for _, org := range user.UserOrgs {
				orgIds = append(orgIds, org.OrgId)
			}
			query = query.Filter("UserOrgs__OrgId__in", orgIds...)
		} else {
			return list
		}
	}

	query.OrderBy("order").Limit(1000000000, 0).All(&list, Fields...)
	return list
}

// 查找部门包含的用户列表
func OrgUserList(appid, tid uint, oid int64, external int, pageIndex, pageSize uint32, fetchChild bool, filters ...interface{}) (int64, []*User) {
	offset := pageIndex * pageSize
	list := make([]*User, 0)

	if oid == 0 {
		return UserList(appid, tid, external, pageIndex, pageSize, "Order", filters...)
	}
	query := orm.NewOrm().QueryTable(UserTableName()).
		Exclude("is_del", 1).
		Filter("appid", appid).Filter("tid", tid)
	if len(filters) > 0 {
		l := len(filters)
		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	// 是否过滤外部用户
	if external > -1 {
		query = query.Filter("is_external", external)
	}
	if fetchChild {
		orgIds := OrgChildList(appid, tid, oid, true, fetchChild)
		if len(orgIds) == 0 {
			return 0, list
		}
		query = query.Filter("UserOrgs__OrgId__in", orgIds)
	} else {
		query = query.Filter("UserOrgs__OrgId", oid)
	}
	total, _ := query.Count()
	query.OrderBy("order").Limit(pageSize, offset).All(&list, Fields...)
	fmt.Println(list)
	return total, list
}

// 此方法将加载密码等敏感信息
func UserGetByAuth(id uint) (*User, error) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBaseUserAuthByUid, id)
	loadCallbackFunc := func() (interface{}, error) {
		var data User
		o := orm.NewOrm()
		err := o.QueryTable(UserTableName()).
			Filter("is_del", 0).
			Filter("id", id).
			One(&data, AuthFields...)
		if err != nil {
			return nil, err
		}
		o.LoadRelated(&data, "UserOrgs")
		if len(data.UserOrgs) > 0 {
			data.MainOrg, _ = OrgGetById(data.Appid, data.Tid, data.UserOrgs[0].OrgId)
		}
		return &data, nil
	}
	res, err := utils.GetCache(cacheKey, loadCallbackFunc)
	if err != nil {
		return nil, err
	}
	user := res.(*User)
	return user, nil
}

func setUserAuthCache(data *User) {
	if data.Id > 0 {
		//存储缓存
		cacheKey := fmt.Sprintf(utils.CacheKeyBaseUserAuthByUid, data.Id)
		utils.Cache.Set(cacheKey, data, utils.DefaultExpiration)
	}
}
func DeleteUserAuthCache(id uint) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBaseUserAuthByUid, id)
	utils.Cache.Delete(cacheKey)
}

func DeleteUserCache(id uint) {
	cacheKey := fmt.Sprintf(utils.CacheKeyBaseUserById, id)
	utils.Cache.Delete(cacheKey)
}

func UserValidPassword(username string, password string, ipAddress string, scopeIds ...interface{}) (*User, string, error) {
	username = strings.TrimSpace(username)
	password = strings.TrimSpace(password)
	if len(username) == 0 {
		return nil, "", errors.New("用户名不能为空")
	}
	if len(password) == 0 {
		return nil, "", errors.New("密码不能为空")
	}
	var data User
	o := orm.NewOrm()
	query := o.QueryTable(UserTableName())
	query = AppendFilter(query, scopeIds...)
	err := query.Filter("is_del", 0).Filter("username", strings.TrimSpace(username)).
		One(&data, AuthFields...)
	if err != nil {
		if err == orm.ErrNoRows {
			return nil, "", errors.New("帐号或密码错误")
		}
		return nil, "", err
	}

	// if isExternal == 0 && data.IsExternal != isExternal {
	// 	return nil, errors.New("非后台用户不能登录后台")
	// }
	if data.Enable == 0 {
		return nil, "", errors.New("该帐号已禁用")
	}
	pwd := ""
	if len(data.Password) > 0 && len(data.Salt) > 0 {
		pwd = Md5([]byte(password + data.Salt))

	}
	if data.Password != pwd {
		return nil, "", errors.New("帐号或密码错误")
	}
	_, err = o.LoadRelated(&data, "UserOrgs")
	if err != nil && err != orm.ErrNoRows {
		return nil, "", err
	}
	if len(data.UserOrgs) > 0 {
		data.MainOrg, _ = OrgGetById(data.Appid, data.Tid, data.UserOrgs[0].OrgId)
	}
	isAdmin := data.UserIsAdmin()
	var isProxy uint8 = 0
	authKey := GetAuthKey(data.Appid, data.Tid, data.Id, data.Id, ipAddress, data.Password, data.Salt, uint8(data.Enable), data.IsExternal, isAdmin, data.RoleIds, isProxy)
	data.LoginTime = time.Now()
	data.LoginDevice = ipAddress
	_, err = o.QueryTable(UserTableName()).Filter("id", data.Id).Update(orm.Params{
		"login_time":   data.LoginTime,
		"login_device": ipAddress,
	})
	if err != nil {
		return nil, "", err
	}
	// 复制缓存信息，因为缓存需要Password，Salt敏感信息
	cacheData := Copy(&data).(*User)
	setUserAuthCache(cacheData)

	// 清楚敏感数据
	data.Password = ""
	data.Salt = ""
	return &data, authKey, nil
}

func UserAttachFor(id uint, obj IAttactUser) {
	user, err := UserGetBy(id)
	if err != nil {
		fmt.Println(err)
	}
	obj.SetUser(user)
}
