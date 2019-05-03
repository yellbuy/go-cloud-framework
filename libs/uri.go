package libs

import (
	"net/url"
	"strings"
)

// 可以通过修改底层url.QueryEscape代码获得更高的效率，很简单
func EncodeURI(str string) string {
	r := url.QueryEscape(str)
	r = strings.Replace(r, "+", "%20", -1)
	return r
}
