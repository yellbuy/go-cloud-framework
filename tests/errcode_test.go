package test

import (
	"fmt"
	"testing"

	"yellbuy.com/YbGoCloundFramework/libs"
	"yellbuy.com/YbGoCloundFramework/models"
	"yellbuy.com/YbGoCloundFramework/models/amis"
	// "yellbuy.com/YbGoCloundFramework/models/credit"
)

func init() {
	models.Init()
}

// TestBeego is a sample to run an endpoint test
func TestErrcode(t *testing.T) {
	if libs.E201021 != 100000 {

		// models.DelData(1)
		// t.Errorf("failed")

	}
}
func Testapp(t *testing.T) {

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

}
func TestBeegoapp(t *testing.T) {
	// var data credit.CreditContract
	// data.ID = 48
	// data.Type = "cxd"
	// data.Title = "盐边se"
	// data.No = "ybxe"
	// data.Tid = 1001
	// data.Appid = 1002
	// data.CreatedDate = time.Now()
	// // data.Parentid = 46
	var data amis.Assetinfo
	data, err := amis.AssetinfoDetailbyID(0)
	fmt.Println(err, data)
	// cn, err := credit.ContractAdd(data)
	// fmt.Println(err, cn)

}
