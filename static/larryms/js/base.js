layui.extend({
	larryms: "lib/larryms"
}).define(["jquery", "configure", "layer", "larryms"], function(e) {
	"use strict";
	var d = layui.$,
		o = layui.configure,
		s = layui.layer,
		c = layui.device(),
		r = d(window),
		u = layui.larryms;
	var i = new Function;
	var l = {
		admin: "lib/admin",
		forms: "larry/modules/forms",
		cascade: "larry/modules/cascade",
		larryms: "lib/larryms",
		larryTab: "lib/larryTab",
		larryElem: "lib/larryElem",
		larryMenu: "lib/larryMenu",
		larryajax: "lib/larryajax",
		larryEditor: "lib/larryEditor",
		larryApi: "lib/larryApi",
		larryTree: "lib/larryTree",
		larrySecret: "lib/larrySecret",
		webuploader: "lib/extend/webuploader/webuploader",
		face: "lib/face",
		xss: "lib/xss",
		wangEditor: "lib/extend/we/wangEditor",
		echarts: "lib/extend/echarts",
		echartStyle: "lib/extend/echartStyle",
		md5: "lib/extend/md5",
		base64: "lib/extend/base64",
		fullPage: "lib/extend/fullPage",
		geetest: "lib/extend/geetest",
		classie: "lib/extend/classie",
		snapsvg: "lib/extend/svg/snapsvg",
		svgLoader: "lib/extend/svg/svgLoader",
		clipboard: "lib/extend/clipboard",
		swiper: "lib/extend/swiper/swiper",
		ckplayer: "lib/extend/ckplayer/ckplayer",
		countup: "lib/extend/countup",
		qrcode: "lib/extend/qrcode",
		flash: "lib/extend/video/flash",
		EvEmitter: "lib/extend/EvEmitter",
		imagesloaded: "lib/extend/imagesloaded",
		jqui: "lib/extend/jqueryui/jqui",
		ztree: "lib/extend/ztree/ztree",
		ztreeCheck: "lib/extend/ztree/ztreeCheck",
		ztreeExedit: "lib/extend/ztree/ztreeExedit",
		ztreeExhide: "lib/extend/ztree/ztreeExhide",
		ueconfig: "lib/extend/ueditor/ueconfig",
		neconfig: "lib/extend/neditor/neconfig",
		nebase: "lib/extend/neditor/nebase",
		ueditor: "lib/extend/ueditor/ueditor",
		neditor: "lib/extend/neditor/neditor",
		pdfobject: "lib/extend/pdfobject",
		coords: "lib/extend/gridster/coords",
		collision: "lib/extend/gridster/collision",
		fullpages: "lib/extend/fullpage/fullpages",
		cropper: "lib/extend/cropper",
		tinymce: "lib/extend/tinymce/tinymce",
		ckeditor: "lib/extend/ckeditor/ckeditor",
		masonry: "lib/extend/masonry",
		modernizr: "lib/modernizr"
	};
	i.prototype.modules = function() {
		for (var e in l) {
			layui.modules[e] = l[e]
		}
	}();
	if (o.thirdExtend == true) {
		var a = o.basePath + o.thirdDir + "conf.json";
		d.ajaxSettings.async = false;
		d.getJSON(a, function(e) {
			for (var r in e) {
				layui.modules[r] = o.thirdDir + e[r]
			}
		});
		d.ajaxSettings.async = true
	}
	window.larrymsExtend = true;
	layui.cache.extendStyle = o.basePath + "lib/extendStyle/";
	var y = o.modules + o.modsname;
	if (o.uploadUrl) {
		layui.cache.neUploadUrl = o.uploadUrl
	} else {
		layui.cache.neUploadUrl = ""
	}
	if (o.upvideoUrl) {
		layui.cache.neVideoUrl = o.upvideoUrl
	} else {
		layui.cache.neVideoUrl = ""
	}

	function b() {
		var e = r.width();
		if (e >= 1200) {
			return 3
		} else if (e >= 992) {
			return 2
		} else if (e >= 768) {
			return 1
		} else {
			return 0
		}
	}
	i.prototype.init = function() {
		var e = this;
		u.debug = o.debug;
		if (o.browserCheck) {
			if (c.ie && c.ie < 8) {
				s.alert("本系统最低支持ie8，您当前使用的是古老的 IE" + c.ie + " \n 建议使用IE9及以上版本的现代浏览器", {
					title: u.tit[0],
					skin: "larry-debug",
					icon: 2,
					resize: false,
					zIndex: s.zIndex,
					anim: Math.ceil(Math.random() * 6)
				})
			}
			if (c.ie) {
				d("body").addClass("larryms-ie-hack")
			}
		}
		u.screen = b();
		if (o.fontSet) {
			if (o.font !== "larry-icon") {
				layui.link(layui.cache.base + "css/fonts/larry-icon.css")
			}
			u.fontset({
				font: o.font,
				url: o.fontUrl,
				online: o.fontSet
			})
		} else {
			layui.link(layui.cache.base + "css/fonts/larry-icon.css")
		}
		if (window.top === window.self) {
			layui.use(["larrySecret", "md5"], function() {
				var e = layui.larrySecret,
					r = layui.md5;
				var i = e.userKey;
				if (o.grantUser && o.grantKey) {
					var l = u.grantCheck(o.grantUser, o.grantKey, i);
					if (!l) {
						console.log("您需要前往larryms.com官网获取产品授权,或检查授权参数是否正确配置");
						return false
					}
				} else {
					console.log("请前往larryms.com官方获取授权密钥,或检查配置文件必填参数");
					return false
				}
			})
		}
		if (layui.cache.page) {
			layui.cache.page = layui.cache.page.split(",");
			if (d.inArray("larry", layui.cache.page) === -1) {
				var r = {};
				for (var i = 0; i < layui.cache.page.length; i++) {
					r[layui.cache.page[i]] = y + layui.cache.page[i]
				}
				layui.extend(r);
				layui.use(layui.cache.page)
			}
		}
		if (o.basecore !== "undefined") {
			var l = o.basecore.split(",");
			var a = {};
			for (var i = 0; i < l.length; i++) {
				a[l[i]] = o.modules + l[i]
			}
			layui.extend(a);
			layui.use(o.basecore)
		}
		if (o.modscore) {
			if (layui.cache.modscore == false) {
				return false
			}
			var t = o.corename.split(",");
			var n = {};
			for (var i = 0; i < t.length; i++) {
				n[t[i]] = y + t[i]
			}
			layui.extend(n);
			layui.use(o.corename)
		}
	}();
	window.onresize = function() {
		u.screen = b()
	};
	e("larry", {})
});