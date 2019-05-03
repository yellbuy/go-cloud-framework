package test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"runtime"
	"testing"

	// "yellbuy.com/YbGoCloundFramework/models/credit"
	"yellbuy.com/YbGoCloundFramework/models/amis"
	// "yellbuy.com/YbGoCloundFramework/models/credit"
	_ "yellbuy.com/YbGoCloundFramework/routers"

	"github.com/astaxie/beego"
	. "github.com/smartystreets/goconvey/convey"
)

func init() {
	_, file, _, _ := runtime.Caller(1)
	apppath, _ := filepath.Abs(filepath.Dir(filepath.Join(file, ".."+string(filepath.Separator))))
	beego.TestBeegoInit(apppath)
}

// TestBeego is a sample to run an endpoint test
func TestBeego(t *testing.T) {
	r, _ := http.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)
	var data amis.Assetinfo
	// data.ID = 48
	// data.Type = "cxd"
	// data.Title = "盐边"
	// data.No = "ybx"
	// data.Tid = 1001
	// data.Appid = 1002
	// data.CreatedDate = time.Now()
	// data.Parentid = 46
	data, err := amis.AssetinfoDetailbyID(0)
	// cn, err := credit.ContractAdd(data)
	fmt.Println(err, data)

	beego.Trace("testing", "TestBeego", "Code[%d]\n%s", w.Code, w.Body.String())

	Convey("Subject: Test Station Endpoint\n", t, func() {
		Convey("Status Code Should Be 200", func() {
			So(w.Code, ShouldEqual, 200)
		})
		Convey("The Result Should Not Be Empty", func() {
			So(w.Body.Len(), ShouldBeGreaterThan, 0)
		})
	})
}
