/**********************************************
** @Des: This file ...
** @Author:
** @Date:   2017-09-08 00:18:02
** @Last Modified by:
** @Last Modified time: 2017-09-16 17:26:48
***********************************************/

package common

import (
	"fmt"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
	"github.com/xeoncross/goworkqueue"
)

// 任务队列
var JobQueue = goworkqueue.NewQueue(beego.AppConfig.DefaultInt("jobqueue.size", 1000), beego.AppConfig.DefaultInt("jobqueue.workers", 50),
	func(job interface{}, workerID int) {
		switch job.(type) {
		case *Statistics:
			_, err := StatisticsSave(job.(*Statistics))
			if err != nil {
				fmt.Println("队列处理失败：", job, err)
			}
		case Statistics:
			data := job.(Statistics)
			_, err := StatisticsSave(&data)
			if err != nil {
				fmt.Println("队列处理失败：", job, err)
			}
		default:
			fmt.Println("队列任务未处理：", job)
		}
	})

func init() {

	orm.RegisterModel(new(Attfile), new(CommonData), new(Category), new(Area),
		new(SnGenerator), new(Setting), new(Sms), new(ActionLog),
		new(Action), new(OauthToken), new(Statistics))
}

func TableName(name string) string {
	return beego.AppConfig.String("db.prefix") + name
}

func StartQueue() {
	queue := goworkqueue.NewQueue(1000, 100, func(job interface{}, workerID int) {
		fmt.Println("Processing", job)
	})
	queue.Add("one") // anything can add "jobs" to process
	queue.Run()      // Blocks until queue.Close() is called
}
