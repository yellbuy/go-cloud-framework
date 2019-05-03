package common

import (
	"errors"
	"time"

	"github.com/astaxie/beego/orm"
)

type OauthToken struct {
	Id           uint
	Kind         string `valid:"MaxSize(16)"`
	AccessToken  string `valid:"MaxSize(128)"`
	RefreshToken string `valid:"MaxSize(128)"`
	OwnerId      string `valid:"MaxSize(64)"`
	OwnerName    string `valid:"MaxSize(64)"`
	ExpiresIn    int
	TokenJson    string
	RefreshTime  time.Time

	Uid   int // 用户标识',
	Tid     uint // 租户标识',
	Appid     uint //'应用标识',
}

//  保存token
func OauthTokenSave(item *OauthToken) error {
	item.RefreshTime = time.Now()
	query := orm.NewOrm()
	exist := query.QueryTable(OauthTokenTableName()).Filter("kind", item.Kind).
		Filter("uid", item.Uid).Filter("tid", item.Tid).Filter("appid", item.Appid).Exist()
	var err error
	if exist {
		// 更新
		_, err = query.QueryTable(OauthTokenTableName()).Filter("kind", item.Kind).
			Filter("uid", item.Uid).Filter("tid", item.Tid).Filter("appid", item.Appid).Update(orm.Params{
			"AccessToken": item.AccessToken, "RefreshToken": item.RefreshToken, "OwnerId": item.OwnerId,
			"OwnerName": item.OwnerName, "ExpiresIn": item.ExpiresIn, "TokenJson": item.TokenJson, "RefreshTime": item.RefreshTime,
		})

	} else {
		// 添加
		_, err = query.Insert(item)
	}
	return err
}

//  查询
func OauthTokenGetList(appid uint, tid uint, ids []interface{}) ([]*OauthToken, error) {
	list := make([]*OauthToken, 0)
	if len(ids) == 0 {
		return list, errors.New("文件标识不能为空")
	}
	query := orm.NewOrm().QueryTable(OauthTokenTableName())
	query = query.Filter("appid", appid).Filter("tid", tid)
	query = query.Filter("id__in", ids...)
	query.Limit(len(ids), 0).All(&list)
	return list, nil
}

func OauthTokenGetById(id int64) (*OauthToken, error) {
	item := new(OauthToken)
	query := orm.NewOrm().QueryTable(OauthTokenTableName()).Filter("id", id)
	err := query.Limit(1).One(item)
	return item, err
}

func OauthTokenGetBy(kind string, uid, tid, appid uint) (*OauthToken, error) {
	item := new(OauthToken)
	query := orm.NewOrm().QueryTable(OauthTokenTableName()).Filter("kind", kind).
		Filter("uid", uid).Filter("tid", tid).Filter("appid", appid)
	err := query.One(item, "savepath")
	return item, err
}

func OauthTokenDel(id int64) error {
	query := orm.NewOrm().QueryTable(OauthTokenTableName())
	_, err := query.Filter("id", id).Delete()
	return err
}

func (a *OauthToken) TableName() string {
	return TableName("common_oauth_token")
}

func OauthTokenTableName() string {
	return TableName("common_oauth_token")
}
