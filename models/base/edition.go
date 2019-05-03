//edition管理

package base
import (
	"errors"
	// "fmt"
	// "strings"
	// "time"

	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	. "yellbuy.com/YbGoCloundFramework/libs"
)
// '版本信息表';
type Edition struct{
			Id int64 

		// varchar(64) NOT NULL DEFAULT '',
			Name string `valid:"MaxSize(64)"`
		// '等级',
			Level int8
		//'价格',
			Price float32 
		//'数据状态0禁用，1启用，-1删除',
			State int8 
		//'0：年，1：月，2：周，3：天',
			Mode  int8 
		//'记录数限制，0：不限制',
			Limit  int64
		//'排序',
			Order int64 
		//'说明',
			Remark string  `valid:"MaxSize(200)"`
			PermissionKey  string `valid:"MaxSize(255)"`
		//'类型，0：应用，1：租户',
			Kind int8
		//'所属应用',
			Tid     uint64
			//'所属应用',
			Appid     uint64
	
 } 
 func (a *Edition) TableName() string {
	return TableName("base_edition")
}
func EditionTableName() string {
	return TableName("base_edition")
}
func EditionGetList(appid uint, tid uint, key string, level,appstate,appmode int8, page, pagesize uint32) ([]*Edition, int64, error) {
	list := make([]*Edition, 0)
	offset := page * pagesize
	o := orm.NewOrm()
	query := o.QueryTable(EditionTableName())/* .Filter("tid", tid).Filter("appid", appid) */
	if len(key)>0 {
		cond:=orm.NewCondition()
		cond1:=cond.Or("name__icontains",key).Or("remark__icontains",key)
		query = query.SetCond(cond1)
	}
		if level>0{
		query = query.Filter("level", level)
		}
	if appstate>-2{
		query = query.Filter("state", appstate)
		}
	if appmode>0{
			query = query.Filter("mode", appmode)
			}	
	

	num, err := query.Count()
	if num > 0 {
		query. OrderBy("order").Limit(pagesize, offset).All(&list)
	}
	return list, num, err

}
func EditionGetById(id int64)(*Edition,error){
    mode:=new(Edition)
      o := orm.NewOrm()
        query := o.QueryTable(EditionTableName())
    err:=query.Filter("id",id).One(mode)
    return mode,err
        
}
func EditionUpdate(Mode *Edition)(error){
      err := IsValidEdition(Mode)
        if err != nil {
          return  err
        }
          o := orm.NewOrm()
        if Mode.Id==0 {
          _, err=o.Insert(Mode)
        }else{
          //  query := o.QueryTable(TenantTableName())
         _, err=o.Update(Mode)
        }
          return err
}
// 数据验证
func IsValidEdition(Edition *Edition) error {
	result := validation.Validation{}
	isValid, err := result.Valid(Edition)
	if err != nil {
		return FailError(E201204, err)
	}
	if !isValid {
		if result.HasErrors() {
			return FailError(E201204, errors.New(result.Errors[0].Message))
		}
	}

	return nil
}
 

  