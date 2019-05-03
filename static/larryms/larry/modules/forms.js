layui.define(["larryms"],
function(r) {
    "use strict";
    var A = layui.$,
    m = layui.larryms,
    i = layui.hint(),
    h = layui.device(),
    $ = "forms",
    g = ".larry-form",
    z = "larry-this",
    e = "larry-show",
    j = "larry-hide",
    Z = "larry-disabled",
    a = function() {
        this.config = {
            verify: {
                required: [/[\S]+/, "必填项不能为空"],
                phone: [/^1(3|4|5|7|8)\d{9}$/, "请输入正确的手机号"],
                tel: [/^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/, "请输入正确的座机号码"],
                email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, "邮箱格式不正确"],
                url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, "链接格式不正确"],
                date: [/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/, "日期格式不正确"],
                identity: [/(^\d{15}$)|(^\d{17}(\d|X|x)$)/, "请输入正确的身份证号"],
                uname: [/^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9_]*$/, "只能为汉字和字母数字组合"],
                int: [/^[0-9]\d*$/, "正整数"],
                qq: [/^[1-9][0-9]{4,10}$/, "请输入正确的QQ号码"],
                number: function(r) {
                    if (!r || isNaN(r)) return "只能填写数字"
                },
                min: function(r, e) {
                    if (r.length < e) return "输入不能小于长度" + e
                },
                max: function(r, e) {
                    if (r.length > e) return "输入长度不能大于长度" + e
                },
                between: function(r, e) {
                    var a = parseInt(e.split("-")[0]),
                    t = parseInt(e.split("-")[1]);
                    if (r.length < a || r.length > t) {
                        return "输入长度只能介于" + a + "和" + t + "之间"
                    }
                },
                accepted: function(r) {},
                alpha: [/^[a-zA-Z]+$/, "只能为纯字母"],
                alphaNum: [/^[a-zA-Z]+$/, "只能为字母或数字"],
                alphaDash: [/^[a-zA-Z_-]+$/, "只能为字母或数字_-"],
                chs: [/^[\u4e00-\u9fa5]+$/, "只能为汉字"],
                chsAlpha: [/^[A-Za-z\u4e00-\u9fa5]+$/, "只能为汉字和字母"],
                chsAlphaNum: [/^[A-Za-z0-9\u4e00-\u9fa5]+$/, "只能为汉字、字母、数字"],
                chsAlphaNumDash: [/^[A-Za-z0-9_\u4e00-\u9fa5]+$/, "只能为汉字、字母、数字、下划线"],
                xdigit: [/([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "不是正确的十六进制格式"],
                httpUrl: [/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/, "请输入正确的网址url"],
                domain: [/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, "请输入正确的域名"],
                ip: [/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/, "请输入正确的ip地址"],
                disabled: [/[^~\x22]+/, "禁止输入~特殊符号"],
                macAddr: [/^[A-F0-9]{2}(-[A-F0-9]{2}){5}$/, "请输入正确的mac地址，默认'-'分割"],
                part: [/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/, "请输入正确的端口号"],
                longitude: [/^[\-\+]?(0?\d{1,2}|0?\d{1,2}\.\d{1,15}|1[0-7]?\d{1}|1[0-7]?\d{1}\.\d{1,15}|180|180\.0{1,15})$/, "请输入正确的经度"],
                latitude: [/^[\-\+]?([0-8]?\d{1}|[0-8]?\d{1}\.\d{1,15}|90|90\.0{1,15})$/, "请输入正确的纬度"],
                car: [/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[a-hj-zA-HJ-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[a-hj-np-zA-HJ-NP-Z0-9]{4,5}[a-hj-np-zA-HJ-NP-Z0-9挂学警港澳]{1}$/, "请输入正确的车牌号码"],
                level: function(r, e) {
                    var a = this.pwdStrong(r);
                    if (a < e) {
                        return "密码复杂度不够"
                    }
                },
                pwd: [/((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-z\d#@!~%^&*]{5,32}/i, "密码只能为6-32位的非纯数字、非纯字母、非纯特殊字符所组成"],
                isRepeat: function(r, e) {
                    if (r !== A("#" + e).val()) {
                        return "两次密码输入不一致"
                    }
                },
                isCreditCode: function(r) {
                    var e = /^[0-9A-Z]+$/;
                    if (r.length != 18 || e.test(r) == false) {
                        return "社会统一信用代码格式不正确"
                    } else {
                        var a;
                        var t;
                        var i = 0;
                        var l = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
                        var s = "0123456789ABCDEFGHJKLMNPQRTUWXY";
                        for (var n = 0; n < r.length - 1; n++) {
                            a = r.substring(n, n + 1);
                            t = s.indexOf(a);
                            i = i + t * l[n]
                        }
                        var c = 31 - i % 31;
                        if (c == 31) {
                            c = 0
                        }
                        var f = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
                        var o = f.split(",");
                        c = o[c];
                        var d = r.substring(17, 18);
                        if (c != d) {
                            return "社会统一信用代码格式不正确"
                        }
                        return true
                    }
                },
                isBankCard: function(r) {
                    r = r || String(this);
                    if ("" == r.trim() || undefined == r) {
                        return false
                    }
                    var e = r.substr(r.length - 1, 1);
                    var a = r.substr(0, r.length - 1);
                    var t = new Array;
                    for (var i = a.length - 1; i > -1; i--) {
                        t.push(a.substr(i, 1))
                    }
                    var l = new Array;
                    var s = new Array;
                    var n = new Array;
                    for (var c = 0; c < t.length; c++) {
                        if ((c + 1) % 2 == 1) {
                            if (parseInt(t[c]) * 2 < 9) l.push(parseInt(t[c]) * 2);
                            else s.push(parseInt(t[c]) * 2)
                        } else n.push(t[c])
                    }
                    var f = new Array;
                    var o = new Array;
                    for (var d = 0; d < s.length; d++) {
                        f.push(parseInt(s[d]) % 10);
                        o.push(parseInt(s[d]) / 10)
                    }
                    var u = 0;
                    var p = 0;
                    var y = 0;
                    var v = 0;
                    var h = 0;
                    for (var m = 0; m < l.length; m++) {
                        u = u + parseInt(l[m])
                    }
                    for (var g = 0; g < n.length; g++) {
                        p = p + parseInt(n[g])
                    }
                    for (var b = 0; b < f.length; b++) {
                        y = y + parseInt(f[b]);
                        v = v + parseInt(o[b])
                    }
                    h = parseInt(u) + parseInt(p) + parseInt(y) + parseInt(v);
                    var k = parseInt(h) % 10 == 0 ? 10 : parseInt(h) % 10;
                    var x = 10 - k;
                    if (e == x) {
                        return true
                    } else {
                        return "请输入正确的银行卡号"
                    }
                },
                isIdCard: function(r) {
                    var e = {
                        11 : "北京",
                        12 : "天津",
                        13 : "河北",
                        14 : "山西",
                        15 : "内蒙古",
                        21 : "辽宁",
                        22 : "吉林",
                        23 : "黑龙江 ",
                        31 : "上海",
                        32 : "江苏",
                        33 : "浙江",
                        34 : "安徽",
                        35 : "福建",
                        36 : "江西",
                        37 : "山东",
                        41 : "河南",
                        42 : "湖北 ",
                        43 : "湖南",
                        44 : "广东",
                        45 : "广西",
                        46 : "海南",
                        50 : "重庆",
                        51 : "四川",
                        52 : "贵州",
                        53 : "云南",
                        54 : "西藏 ",
                        61 : "陕西",
                        62 : "甘肃",
                        63 : "青海",
                        64 : "宁夏",
                        65 : "新疆",
                        71 : "台湾",
                        81 : "香港",
                        82 : "澳门",
                        91 : "国外 "
                    };
                    var a = "";
                    var t = true;
                    if (!r || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(r)) {
                        a = "身份证号格式错误";
                        t = false
                    } else if (!e[r.substr(0, 2)]) {
                        a = "地址编码错误";
                        t = false
                    } else {
                        if (r.length == 18) {
                            r = r.split("");
                            var i = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                            var l = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
                            var s = 0;
                            var n = 0;
                            var c = 0;
                            for (var f = 0; f < 17; f++) {
                                n = r[f];
                                c = i[f];
                                s += n * c
                            }
                            var o = l[s % 11];
                            if (l[s % 11] != r[17]) {
                                a = "校验位错误";
                                t = false
                            }
                        }
                    }
                    if (!t) {
                        return a
                    }
                },
                pwdStrong: function(r) {
                    var e = 0;
                    if (r.match(/[a-z]/g)) {
                        e++
                    }
                    if (r.match(/[A-Z]/g)) {
                        e++
                    }
                    if (r.match(/[0-9]/g)) {
                        e++
                    }
                    if (r.match(/(.[^a-z0-9A-Z])/g)) {
                        e++
                    }
                    if (e > 4) {
                        e = 4
                    }
                    if (e === 0) return false;
                    return e
                }
            },
            func: {}
        }
    };
    a.prototype.set = function(r) {
        var e = this;
        A.extend(true, e.config, r);
        return e
    };
    a.prototype.verify = function(r) {
        var e = this;
        A.extend(true, e.config.verify, r);
        return e
    };
    a.prototype.func = function(r) {
        var e = this;
        A.extend(true, e.config.func, r);
        return e
    };
    a.prototype.on = function(r, e) {
        return layui.onevent.call(this, $, r, e)
    };
    a.prototype.val = function(r, a) {
        var e = this,
        t = A(g + '[lay-filter="' + r + '"]');
        t.each(function(r, e) {
            var i = A(this);
            layui.each(a,
            function(r, e) {
                var a = i.find('[name="' + r + '"]'),
                t;
                if (!a[0]) return;
                t = a[0].type;
                if (t === "checkbox") {
                    a[0].checked = e
                } else if (t === "radio") {
                    a.each(function() {
                        if (this.value === e) {
                            this.checked = true
                        }
                    })
                } else {
                    a.val(e)
                }
            })
        });
        b.render(null, r)
    };
    a.prototype.transfer = function(r) {
        var n = this,
        e = "",
        t = "",
        a = new Array;
        var c = r.sourceName || "来源列表",
        f = r.targetName || "目标列表";
        if (JSON.stringify(r) == "{}" || r == undefined || m.typeFn.isString(r)) {
            console.log("穿梭框未被成功渲染，请检查参数设置");
            return false
        } else {
            if (m.typeFn.isString(r.elem)) {
                e = A(r.elem)
            } else if (m.typeFn.isObj(r.elem)) {
                e = r.elem
            } else {
                console.log("穿梭框未被成功渲染，请检查elem参数设置");
                return false
            }
            if (m.isUrl(r.source) == true) {
                A.ajax({
                    type: r.type || "GET",
                    url: r.source,
                    async: false,
                    dataType: "json",
                    success: function(r, e, a) {
                        t = r.data
                    },
                    error: function(r, e, a) {
                        console.log("穿梭框的来源数据获取出错！");
                        return false
                    },
                    complete: function() {}
                })
            } else if (m.isUrl(r.source) == "obj") {
                t = r.source.data
            } else {
                t = {}
            }
        }
        var i = e.attr("name"),
        l = e.val(),
        s = [];
        if (l !== "") {
            s = l.split(",");
            for (var o = 0; o < s.length; o++) {
                for (var d = 0; d < t.length; d++) {
                    if (t[d].value == s[o]) {
                        a.push(t[d]);
                        t = A.grep(t,
                        function(r) {
                            return r != t[d]
                        })
                    }
                }
            }
        }
        var u = n.listHtml(e, t, "source"),
        p = n.listHtml(e, a, "target", i);
        var y = ['<div class="larry-transfer-content">', '<div class="larry-transfer-panel larry-transfer-source">', '<div class="larry-transfer-top">', '<span class="larry-transfer-title">' + c + "</span>", "</div>", '<div class="larry-transfer-list">', u, "</div>", '<div class="larry-transfer-bottom">', '<input type="checkbox" class="larry-transfer-all" lay-filter="transferAll" title="全选" lay-skin="primary">', "</div>", "</div>", '<div class="larry-transfer-btngroup">', '<div class="larry-transfer-btn larry-transfer-toright"><i class="layui-icon layui-icon-next"></i></div>', '<div class="larry-transfer-btn larry-transfer-toleft"><i class="layui-icon layui-icon-prev"></i></div>', "</div>", '<div class="larry-transfer-panel larry-transfer-target">', '<div class="larry-transfer-top">', '<span class="larry-transfer-title">' + f + "</span>", "</div>", '<div class="larry-transfer-list">', p, "</div>", '<div class="larry-transfer-bottom">', '<input type="checkbox" class="larry-transfer-all" lay-filter="transferAll" title="全选" lay-skin="primary">', "</div>", , "</div>", "</div>"].join("");
        e.after(y);
        function v(r) {
            var a = new Array;
            r.each(function(r, e) {
                a.push(A(e).val())
            });
            e.attr("value", a.join(","))
        }
        var h = function() {
            n.on("checkbox(transferAll)",
            function(r) {
                var e = A(this).parent(".larry-transfer-bottom").siblings(".larry-transfer-list"),
                a = e.find('input[transfer="larry"]');
                if (r.elem.checked) {
                    a.attr("checked", "checked");
                    a.siblings(".larry-unselect").addClass("larry-form-checked")
                } else {
                    a.attr("checked", false);
                    a.siblings(".larry-unselect").removeClass("larry-form-checked")
                }
            });
            n.on("checkbox(larrylist)",
            function(r) {
                if (r.elem.checked) {
                    A(r.elem).attr("checked", "checked")
                } else {
                    A(r.elem).attr("checked", false)
                }
            });
            A(".larry-transfer-toright").on("click",
            function() {
                var r = A(this).parents(".larry-transfer-content"),
                e = r.children(".larry-transfer-source").children(".larry-transfer-list"),
                a = e.find('input[checked="checked"]'),
                t = a.parent("li"),
                i = r.children(".larry-transfer-target").children(".larry-transfer-list"),
                l = i.find('input[transfer="larry"]'),
                s = r.children(".larry-transfer-source").children(".larry-transfer-bottom").children("input");
                if (a.length > 0) {
                    s.attr("checked", false);
                    s.siblings(".larry-form-checkbox").remove();
                    a.attr("checked", false);
                    l.siblings(".larry-unselect").remove();
                    t.children(".larry-unselect").remove();
                    i.append(t);
                    n.render("checkbox")
                } else {
                    m.msg("请从" + c + "中至少选择一项进行操作")
                }
                v(i.find('input[transfer="larry"]'))
            });
            A(".larry-transfer-toleft").on("click",
            function() {
                var r = A(this).parents(".larry-transfer-content"),
                e = r.children(".larry-transfer-target").children(".larry-transfer-list"),
                a = e.find('input[checked="checked"]'),
                t = a.parent("li"),
                i = r.children(".larry-transfer-source").children(".larry-transfer-list"),
                l = i.find('input[transfer="larry"]'),
                s = r.children(".larry-transfer-target").children(".larry-transfer-bottom").children("input");
                if (a.length > 0) {
                    s.attr("checked", false);
                    s.siblings(".larry-form-checkbox").remove();
                    a.attr("checked", false);
                    l.siblings(".larry-unselect").remove();
                    t.children(".larry-unselect").remove();
                    i.append(t);
                    n.render("checkbox")
                } else {
                    m.msg("请从" + f + "中至少选择一项进行操作")
                }
                v(e.find('input[transfer="larry"]'))
            })
        };
        n.render("checkbox");
        h()
    };
    a.prototype.listHtml = function(r, e, a, t) {
        var i = "";
        if (a == "source") {
            if (e !== undefined) {
                for (var l = 0; l < e.length; l++) {
                    i += '<li><input type="checkbox" lay-filter="larrylist" transfer="larry" title="' + e[l].text + '" lay-skin="primary" value="' + e[l].value + '"/></li>'
                }
            }
        } else if (a == "target") {
            if (e !== undefined) {
                for (var l = 0; l < e.length; l++) {
                    i += '<li><input type="checkbox" lay-filter="larrylist" transfer="larry" name="' + t + '" title="' + e[l].text + '" lay-skin="primary" value="' + e[l].value + '"/></li>'
                }
            }
        }
        return i
    };
    a.prototype.render = function(r, e) {
        var l = this,
        a = A(g +
        function() {
            return e ? '[lay-filter="' + e + '"]': ""
        } ()),
        t = {
            select: function() {
                var v = "请选择",
                g = "larry-form-select",
                b = "larry-select-title",
                k = "larry-select-none",
                x = "",
                C, r = a.find('select[multiple!="multiple"]'),
                e = a.find('select[multiple="multiple"]'),
                w = function(r, e) {
                    if (!A(r.target).parent().hasClass(b) || e) {
                        A("." + g).removeClass(g + "ed " + g + "up");
                        C && x && C.val(x)
                    }
                    C = null
                },
                h = function(l, r, e) {
                    var s = A(this),
                    a = l.find("." + b),
                    n = a.find("input"),
                    c = l.find("dl"),
                    f = c.children("dd"),
                    t = c.children("dd.larry-select-tips"),
                    i = this.selectedIndex,
                    o,
                    d = l.hasClass("larry-multiple-select") ? true: false;
                    if (r) return;
                    if (d) {
                        var u = a.children(".larry-title-input")
                    }
                    var p = function() {
                        var r = l.offset().top + l.outerHeight() + 5 - I.scrollTop(),
                        e = c.outerHeight();
                        i = s[0].selectedIndex;
                        l.addClass(g + "ed");
                        f.removeClass(j);
                        o = null;
                        f.eq(i).addClass(z).siblings().removeClass(z);
                        if (r + e > I.height() && r >= e) {
                            l.addClass(g + "up")
                        }
                        v()
                    },
                    y = function(r) {
                        l.removeClass(g + "ed " + g + "up");
                        n.blur();
                        o = null;
                        if (r) return;
                        h(n.val(),
                        function(r) {
                            var e = s[0].selectedIndex;
                            if (!d) {
                                if (r) {
                                    x = A(s[0].options[e]).html();
                                    if (e === 0 && x === n.attr("placeholder")) {
                                        x = ""
                                    }
                                    n.val(x || "")
                                }
                            }
                        })
                    },
                    v = function() {
                        var r = c.children("dd." + z);
                        if (!r[0]) return;
                        var e = r.position().top,
                        a = c.height(),
                        t = r.height();
                        if (e > a) {
                            c.scrollTop(e + c.scrollTop() - a + t - 5)
                        }
                        if (e < 0) {
                            c.scrollTop(e + c.scrollTop() - 5)
                        }
                    };
                    a.on("click",
                    function(r) {
                        l.hasClass(g + "ed") ? y() : (w(r, true), p());
                        c.find("." + k).remove()
                    });
                    a.find(".larry-edge").on("click",
                    function() {
                        n.focus()
                    });
                    n.on("keyup",
                    function(r) {
                        var e = r.keyCode;
                        if (e === 9) {
                            p()
                        }
                    }).on("keydown",
                    function(l) {
                        var r = l.keyCode;
                        if (r === 9) {
                            y()
                        }
                        var s = function(t, i) {
                            var r, e;
                            l.preventDefault();
                            var a = function() {
                                var r = c.children("dd." + z);
                                if (c.children("dd." + j)[0] && t === "next") {
                                    var e = c.children("dd:not(." + j + ",." + Z + ")"),
                                    a = e.eq(0).index();
                                    if (a >= 0 && a < r.index() && !e.hasClass(z)) {
                                        return e.eq(0).prev()[0] ? e.eq(0).prev() : c.children(":last")
                                    }
                                }
                                if (i && i[0]) {
                                    return i
                                }
                                if (o && o[0]) {
                                    return o
                                }
                                return r
                            } ();
                            e = a[t]();
                            r = a[t]("dd:not(." + j + ")");
                            if (!e[0]) return o = null;
                            o = a[t]();
                            if ((!r[0] || r.hasClass(Z)) && o[0]) {
                                return s(t, o)
                            }
                            r.addClass(z).siblings().removeClass(z);
                            v()
                        };
                        if (r === 38) s("prev");
                        if (r === 40) s("next");
                        if (r === 13) {
                            l.preventDefault();
                            c.children("dd." + z).trigger("click")
                        }
                    });
                    var h = function(t, r, i) {
                        var l = 0;
                        layui.each(f,
                        function() {
                            var r = A(this),
                            e = r.text(),
                            a = e.indexOf(t) === -1;
                            if (t === "" || i === "blur" ? t !== e: a) l++;
                            i === "keyup" && r[a ? "addClass": "removeClass"](j)
                        });
                        var e = l === f.length;
                        return r(e),
                        e
                    };
                    var m = function(r) {
                        var e = this.value,
                        a = r.keyCode;
                        if (a === 9 || a === 13 || a === 37 || a === 38 || a === 39 || a === 40) {
                            return false
                        }
                        h(e,
                        function(r) {
                            if (r) {
                                c.find("." + k)[0] || c.append('<p class="' + k + '">无匹配项</p>')
                            } else {
                                c.find("." + k).remove()
                            }
                        },
                        "keyup");
                        if (e === "") {
                            c.find("." + k).remove()
                        }
                        v()
                    };
                    if (!d) {
                        if (e) {
                            n.on("keyup", m).on("blur",
                            function(r) {
                                var e = s[0].selectedIndex;
                                C = n;
                                x = A(s[0].options[e]).html();
                                if (e === 0 && x === n.attr("placeholder")) {
                                    x = ""
                                }
                                setTimeout(function() {
                                    h(n.val(),
                                    function(r) {
                                        x || n.val("")
                                    },
                                    "blur")
                                },
                                200)
                            })
                        }
                    }
                    if (d) {
                        u.on("click", "a i.larry-icon",
                        function() {
                            var t = A(this).siblings("span").attr("lay-value"),
                            r = A(this).parent("a"),
                            e = A(this).parents(".larry-select-title").siblings("dl").find("dd");
                            r.remove();
                            e.each(function(r, e) {
                                var a = this;
                                if (A(a).attr("lay-value") == t) {
                                    A(a).removeClass("larry-this");
                                    A(a).children("input").attr("checked", false);
                                    A(a).children(".larry-form-checkbox").removeClass("larry-form-checked")
                                }
                            });
                            var a = n.val().split(",");
                            a.splice(A.inArray(t, a), 1);
                            n.attr("value", a.join(","))
                        });
                        t.on("click", "a.larry-opreate",
                        function() {
                            var r = A(this),
                            e = r.children("span").attr("lay-value");
                            var a = r.parent().parents("dl");
                            if (e === "checkall") {
                                a.find('input[type="checkbox"]').each(function(r, e) {
                                    if (A(this).attr("checked") !== "checked" && A(this).is(":checked") != true) {
                                        var a = A(this).parent().attr("lay-value");
                                        A(this).attr("checked", "checked");
                                        A(this).siblings(".larry-unselect").addClass("larry-form-checked");
                                        u.append('<a><span lay-value="' + a + '">' + A(this).attr("title") + '</span><i class="larry-icon larry-guanbi1"></i></a>');
                                        if (n.val() == "") {
                                            n.attr("value", a)
                                        } else {
                                            n.attr("value", n.val() + "," + a)
                                        }
                                    }
                                })
                            } else if (e === "inverse") {
                                a.find('input[type="checkbox"]').each(function(r, e) {
                                    var a = A(this).parent().attr("lay-value"),
                                    t = A(this).attr("title");
                                    if (A(this).attr("checked") !== "checked" && A(this).is(":checked") != true) {
                                        A(this).attr("checked", "checked");
                                        A(this).siblings(".larry-unselect").addClass("larry-form-checked");
                                        u.append('<a><span lay-value="' + a + '">' + t + '</span><i class="larry-icon larry-guanbi1"></i></a>');
                                        if (n.val() == "") {
                                            n.attr("value", a)
                                        } else {
                                            n.attr("value", n.val() + "," + a)
                                        }
                                    } else {
                                        A(this).attr("checked", false);
                                        A(this).siblings(".larry-unselect").removeClass("larry-form-checked");
                                        u.find("a").children("span").each(function() {
                                            if (A(this).text() === t) {
                                                A(this).parent().remove()
                                            }
                                        });
                                        var i = n.val();
                                        i = i.split(",");
                                        i.splice(A.inArray(a, i), 1);
                                        n.attr("value", i.join(","))
                                    }
                                })
                            } else if (e === "empty") {
                                u.empty();
                                a.find('input[type="checkbox"]').each(function(r, e) {
                                    A(this).attr("checked", false);
                                    A(this).siblings(".larry-unselect").removeClass("larry-form-checked")
                                });
                                n.attr("value", "")
                            }
                        })
                    }
                    f.on("click",
                    function() {
                        var r = A(this),
                        i = r.attr("lay-value");
                        var e = s.attr("lay-filter");
                        if (r.hasClass(Z)) return false;
                        if (r.hasClass("larry-select-tips")) {
                            if (!d) {
                                n.val("")
                            }
                        } else {
                            if (!d) {
                                n.val(r.text());
                                r.addClass(z)
                            } else {
                                var a = r.children('input[type="checkbox"]');
                                if (a.attr("checked") !== "checked") {
                                    a.attr("checked", "checked");
                                    a.siblings(".larry-unselect").addClass("larry-form-checked");
                                    u.append('<a><span lay-value="' + i + '">' + r.text() + '</span><i class="larry-icon larry-guanbi1"></i></a>');
                                    if (n.val() == "") {
                                        n.attr("value", i)
                                    } else {
                                        n.attr("value", n.val() + "," + i)
                                    }
                                } else {
                                    a.attr("checked", false);
                                    a.siblings(".larry-unselect").removeClass("larry-form-checked");
                                    var t = u.children("a");
                                    t.each(function(r, e) {
                                        var a = this;
                                        if (A(a).children("span").attr("lay-value") == i) {
                                            A(a).remove();
                                            var t = n.val();
                                            t = t.split(",");
                                            t.splice(A.inArray(i, t), 1);
                                            n.attr("value", t.join(","))
                                        }
                                    })
                                }
                            }
                        }
                        r.siblings().removeClass(z);
                        s.val(i).removeClass("larry-form-danger");
                        layui.event.call(this, $, "select(" + e + ")", {
                            elem: s[0],
                            value: i,
                            othis: l
                        });
                        if (!d) {
                            y(true)
                        }
                        return false
                    });
                    l.find("dl>dt").on("click",
                    function(r) {
                        return false
                    });
                    A(document).off("click", w).on("click", w)
                };
                if (r.length > 0) {
                    r.each(function(r, e) {
                        var a = A(this),
                        t = a.next("." + g),
                        i = this.disabled,
                        l = e.value,
                        s = A(e.options[e.selectedIndex]),
                        n = e.options[0];
                        if (typeof a.attr("lay-ignore") === "string") return a.show();
                        var c = typeof a.attr("lay-search") === "string",
                        f = n ? n.value ? v: n.innerHTML || v: v;
                        var o = A(['<div class="' + (c ? "": "larry-unselect ") + g, (i ? " larry-select-disabled": "") + '">', '<div class="' + b + '">', '<input type="text" placeholder="' + f + '" ' + ('value="' + (l ? s.html() : "") + '"') + (c ? "": " readonly") + ' class="larry-input' + (c ? "": " larry-unselect") + (i ? " " + Z: "") + '">', '<i class="larry-edge larry-icon larry-xiangxiajiantoushixin"></i></div>', '<dl class="larry-anim larry-anim-upbit' + (a.find("optgroup")[0] ? " larry-select-group": "") + '">',
                        function(r) {
                            var a = [];
                            layui.each(r,
                            function(r, e) {
                                if (r === 0 && !e.value) {
                                    a.push('<dd lay-value="" class="larry-select-tips">' + (e.innerHTML || v) + "</dd>")
                                } else if (e.tagName.toLowerCase() === "optgroup") {
                                    a.push("<dt>" + e.label + "</dt>")
                                } else {
                                    a.push('<dd lay-value="' + e.value + '" class="' + (l === e.value ? z: "") + (e.disabled ? " " + Z: "") + '">' + e.innerHTML + "</dd>")
                                }
                            });
                            a.length === 0 && a.push('<dd lay-value="" class="' + Z + '">没有选项</dd>');
                            return a.join("")
                        } (a.find("*")) + "</dl>", "</div>"].join(""));
                        t[0] && t.remove();
                        a.after(o);
                        h.call(this, o, i, c)
                    })
                }
                if (e.length > 0) {
                    e.each(function(r, e) {
                        var a = A(this),
                        t = a.next("." + g),
                        i = this.disabled,
                        l = new Array,
                        s = "",
                        n = A(e).attr("name"),
                        c = A(e).children('option[selected="selected"]'),
                        f = A(e.options[e.selectedIndex]),
                        o = e.options[0];
                        for (var d = 0; d < c.length; d++) {
                            l[d] = A(c[d]).val()
                        }
                        if (typeof a.attr("lay-ignore") === "string") return a.show();
                        if (l.length > 1) {
                            s = l.join(",")
                        }
                        var u = typeof a.attr("lay-search") === "string",
                        p = o ? o.value ? v: o.innerHTML || v: v;
                        var y = A(['<div class="larry-multiple-select ' + (u ? "": "larry-unselect ") + g, (i ? " larry-select-disabled": "") + '">', '<div class="' + b + '">', '<input type="text" name="' + n + '" placeholder="' + p + '" ' + ('value="' + (l.length > 0 ? s: "") + '"') + (u ? "": " readonly") + ' class="larry-input' + (u ? "": " larry-unselect") + (i ? " " + Z: "") + '">', '<i class="larry-edge larry-icon larry-xiangxiajiantoushixin"></i><div class="larry-title-input clearfix">',
                        function(r) {
                            var e = [];
                            if (r.length > 0) {
                                for (var a = 0; a < r.length; a++) {
                                    e.push('<a><span lay-value="' + A(r[a]).val() + '">' + A(r[a]).text() + '</span><i class="larry-icon  larry-guanbi1"></i></a>')
                                }
                            }
                            return e.join("")
                        } (c), "</div></div>", '<dl class="larry-anim larry-anim-upbit' + (a.find("optgroup")[0] ? " larry-select-group": "") + '">', '<dd lay-value="" class="larry-select-tips">', '<a class="larry-opreate"><i class="larry-icon larry-quanxuan1"></i><span lay-value="checkall">全选</span></a>', '<a class="larry-opreate"><i class="larry-icon larry-fanxuan1"></i><span lay-value="inverse">反选</span></a>', '<a class="larry-opreate"><i class="larry-icon larry-qingkong"></i><span lay-value="empty">清空</span></a>', "</dd>",
                        function(r) {
                            var a = [];
                            layui.each(r,
                            function(r, e) {
                                if (r === 0 && !e.value) {} else if (e.tagName.toLowerCase() === "optgroup") {
                                    a.push("<dt>" + e.label + "</dt>")
                                } else {
                                    a.push('<dd lay-value="' + e.value + '" class="' + (e.disabled ? " " + Z: "") + '"><input type="checkbox" title="' + e.innerHTML + '" ' + (A.inArray(e.value, l) != -1 ? 'checked="checked"': "") + ' lay-skin="primary"/></dd>')
                                }
                            });
                            a.length === 0 && a.push('<dd lay-value="" class="' + Z + '">没有选项</dd>');
                            return a.join("")
                        } (a.find("*")) + "</dl>", "</div>"].join(""));
                        t[0] && t.remove();
                        a.after(y);
                        h.call(this, y, i, u);
                        A(e).removeAttr("name")
                    })
                }
            },
            checkbox: function() {
                var f = {
                    checkbox: ["larry-form-checkbox", "larry-form-checked", "checkbox"],
                    _switch: ["larry-form-switch", "larry-form-onswitch", "switch"]
                },
                r = a.find("input[type=checkbox]"),
                o = function(a, t) {
                    var i = A(this);
                    a.on("click",
                    function() {
                        var r = i.attr("lay-filter"),
                        e = (i.attr("lay-text") || "").split("|");
                        if (i[0].disabled) return;
                        i[0].checked ? (i[0].checked = false, a.removeClass(t[1]).find("em").text(e[1])) : (i[0].checked = true, a.addClass(t[1]).find("em").text(e[0]));
                        layui.event.call(i[0], $, t[2] + "(" + r + ")", {
                            elem: i[0],
                            value: i[0].value,
                            othis: a
                        })
                    })
                };
                r.each(function(r, a) {
                    var e = A(this),
                    t = e.attr("lay-skin"),
                    i = (e.attr("lay-text") || "").split("|"),
                    l = this.disabled;
                    if (t === "switch") t = "_" + t;
                    var s = f[t] || f.checkbox;
                    if (typeof e.attr("lay-ignore") === "string") return e.show();
                    var n = e.next("." + s[0]),
                    c = A(['<div class="larry-unselect ' + s[0], a.checked ? " " + s[1] : "", l ? " larry-checkbox-disbaled " + Z: "", '"', t ? ' lay-skin="' + t + '"': "", ">",
                    function() {
                        var r = a.title.replace(/\s/g, ""),
                        e = {
                            checkbox: [r ? "<span>" + a.title + "</span>": "", '<i class="layui-icon layui-icon-ok"></i>'].join(""),
                            _switch: "<em>" + ((a.checked ? i[0] : i[1]) || "") + "</em><i></i>"
                        };
                        return e[t] || e["checkbox"]
                    } (), "</div>"].join(""));
                    n[0] && n.remove();
                    e.after(c);
                    o.call(this, c, s)
                })
            },
            radio: function() {
                var n = "larry-form-radio",
                c = ["larry-danxuanxuanzhong", "larry-radio1"],
                r = a.find("input[type=radio]"),
                s = function(i) {
                    var l = A(this),
                    s = "larry-anim-scaleSpring";
                    i.on("click",
                    function() {
                        var r = l[0].name,
                        e = l.parents(g);
                        var a = l.attr("lay-filter");
                        var t = e.find("input[name=" + r.replace(/(\.|#|\[|\])/g, "\\$1") + "]");
                        if (l[0].disabled) return;
                        layui.each(t,
                        function() {
                            var r = A(this).next("." + n);
                            this.checked = false;
                            r.removeClass(n + "ed");
                            r.find(".larry-icon").removeClass(s).removeClass(c[0]).addClass(c[1])
                        });
                        l[0].checked = true;
                        i.addClass(n + "ed");
                        i.find(".larry-icon").addClass(s).removeClass(c[1]).addClass(c[0]);
                        layui.event.call(l[0], $, "radio(" + a + ")", {
                            elem: l[0],
                            value: l[0].value,
                            othis: i
                        })
                    })
                };
                r.each(function(r, e) {
                    var a = A(this),
                    t = a.next("." + n),
                    i = this.disabled;
                    if (typeof a.attr("lay-ignore") === "string") return a.show();
                    t[0] && t.remove();
                    var l = A(['<div class="larry-unselect ' + n, e.checked ? " " + n + "ed": "", (i ? " larry-radio-disbaled " + Z: "") + '">', '<i class="larry-anim larry-icon ' + c[e.checked ? 0 : 1] + '"></i>', "<div>" +
                    function() {
                        var r = e.title || "";
                        if (typeof a.next().attr("lay-radio") === "string") {
                            r = a.next().html();
                            a.next().remove()
                        }
                        return r
                    } () + "</div>", "</div>"].join(""));
                    a.after(l);
                    s.call(this, l)
                })
            },
            input: function() {
                var r = a.find("input.larry-input[type='password']");
                r.each(function(r, e) {
                    var a = A(e).data("eye"),
                    t = A(e).data("level");
                    if (a) {
                        A(this).parent().append('<span class="larry-showpwd" id="showpwd_' + r + '"><i class="larry-icon larry-yincangmima"></i></span>');
                        var i = false;
                        A("#showpwd_" + r).on("click",
                        function() {
                            if (!i) {
                                A(this).children("i").addClass("larry-xianshimima").removeClass("larry-yincangmima");
                                A(this).siblings('input[type="password"]').attr("type", "text");
                                i = true
                            } else {
                                A(this).children("i").addClass("larry-yincangmima").removeClass("larry-xianshimima");
                                A(this).siblings('input[type="text"]').attr("type", "password");
                                i = false
                            }
                        })
                    }
                    if (t) {
                        A(this).parent().append('<div class="larry-strength larry-hide"><span class="larry-security">安全程度：</span><b><i>弱</i><i>中</i><i>强</i><i>很强</i></b></div>');
                        A(this).on("keyup",
                        function() {
                            var r = A(this).val(),
                            e = A(this).parent().find(".larry-strength");
                            if (r.length > 5) {
                                e.removeClass("larry-hide").show(300);
                                var a = l.config.verify.pwdStrong(r);
                                e.find("b i").removeClass("on");
                                for (var t = 0; t < a; t++) {
                                    e.find("b i").eq(t).addClass("on")
                                }
                            } else {
                                e.hide(500)
                            }
                        })
                    }
                });
                var e = a.find("input[tags='larry-tags']");
                e.each(function(r, e) {
                   
                    var t = A(this),
                    a = t.val();
                    var i = a.split(","),
                    l = "";
                    for (var s = 0; s < i.length; s++) {
                        l += '<a class="larry-tag"><span>' + i[s] + '</span><i class="larry-icon larry-guanbi1"></i></a>'
                    }
                    t.parent().append('<input type="text" id="larryTagsEntry_' + r + '" class="larry-input larry-tag-entry" autocomplete="off"  placeholder="' + t.attr("placeholder") + '"/>');
                    t.parent().append('<div class="larry-input-tags clearfix">' + l + "</div>");
                    A("#larryTagsEntry_" + r).on("keypress",
                    function(r) {
                        var e = r.keyCode ? r.keyCode: r.which;
                        if (e == "13") {
                            var a = m.stringFn.trim(A(this).val(), 2);
                            if (!a) {
                                return false
                            }
                            if (m.ArrayFn.contains(i, a) != true) {
                                i.push(a);
                                t.attr("value", i.join(","));
                                A(this).val("");
                                A(this).siblings(".larry-input-tags").append('<a class="larry-tag"><span>' + a + '</span><i class="larry-icon larry-guanbi1"></i></a>')
                            } else {
                                m.msg("您当前输入的" + a + "标签已存在");
                                A(this).val("")
                            }
                        }
                    });
                    A("#larryTagsEntry_" + r).siblings(".larry-input-tags").on("click", "a.larry-tag i.larry-icon",
                    function() {
                        var r = A(this).siblings("span").text(),
                        e = A(this).parent();
                        e.remove();
                        var a = t.val().split(",");
                        a.splice(A.inArray(r, a), 1);
                        t.attr("value", a.join(","))
                    })
                })
            },
            textsum: function() {
                var r = a.find("input.larry-input,input.larryms-input,textarea.larry-textarea,textarea.larryms-textarea");
                r.each(function(r, e) {
                    var a = A(e).attr("maxlength");
                    if (a == undefined || a == "undefined") {
                        return true
                    } else {
                        A(this).parent().append('<span class="larry-maxlength">0/' + a + "</span>");
                        if (A(this).length > 0) {
                            var t = A(this).height();
                            if (t < 60) {
                                A(this).css({
                                    paddingRight: "80px"
                                }).siblings(".sumtips").css({
                                    "line-height": t + "px"
                                })
                            } else {
                                A(this).siblings(".sumtips").css({
                                    height: "38px",
                                    "line-height": "38px !important"
                                })
                            }
                        }
                        A(this).on("keyup",
                        function() {
                            var r = a - A(this).val().length;
                            A(this).siblings(".larry-maxlength").html(r + "/" + a)
                        })
                    }
                })
            },
            transfer: function() {
                var r = ["larry-transfer", "larry-transfered"],
                e = a.find("input[larry-transfer=transfer]");
                e.each(function(r, e) {
                    var a = A(e).data("source");
                    if (a !== "1" && a !== undefined) {
                        var t = {
                            elem: A(e),
                            source: a
                        };
                        l.transfer(t)
                    } else {}
                })
            }
        };
        r ? t[r] ? t[r]() : i.error("不支持的" + r + "表单渲染") : layui.each(t,
        function(r, e) {
            e()
        });
        return l
    };
    a.prototype.vaildator = function(r) {
        if (!r) {
            m.alert("forms独立验证器需设置待验证区域id");
            return true
        }
        var e = this,
        a = A(r),
        p = e.config.verify,
        y = null,
        v = "larry-form-danger",
        t = {},
        i = a.find("*[lay-verify]");
        layui.each(i,
        function(c, f) {
            var o = A(this),
            r = o.attr("lay-verify").split("|"),
            d = o.attr("lay-verType") || "tips",
            u = o.val();
            o.removeClass(v);
            layui.each(r,
            function(r, e) {
                var a = "",
                t = "";
                if (e.indexOf(":")) {
                    t = e.split(":");
                    a = t[1];
                    e = t[0]
                }
                var i, l = "",
                s = typeof p[e] === "function";
                if (p[e]) {
                    var n = false,
                    i = s ? l = p[e](u, a, f) : !p[e][0].test(u);
                    if (A(f).attr("lay-error")) {
                        n = A(f).attr("lay-error").split("|")
                    }
                    if (n[c]) {
                        l = n[c] || l
                    } else {
                        l = l || p[e][1]
                    }
                    if (i) {
                        if (d === "tips") {
                            m.tips(l,
                            function() {
                                if (typeof o.attr("lay-ignore") !== "string") {
                                    if (f.tagName.toLowerCase() === "select" || /^checkbox|radio$/.test(f.type)) {
                                        return o.next()
                                    }
                                }
                                return o
                            } (), {
                                tips: 1
                            })
                        } else if (d === "alert") {
                            m.alert(l, {
                                title: "提示",
                                shadeClose: true
                            })
                        } else if (d === "anim") {
                            A(f).addClass("larry-verify-anim");
                            if (A(f).siblings("span.larry-span-tips")) {
                                A(f).siblings("span.larry-span-tips").remove()
                            }
                            A(f).after('<span class="larry-span-tips">' + l + "</span>");
                            A(f).blur(function() {
                                A(this).siblings("span.larry-span-tips").remove();
                                A(this).removeClass("larry-verify-anim");
                                A(this).removeClass("larry-form-danger")
                            })
                        } else if (d === "below") {
                            if (A(f).siblings("span.larry-span-tips")) {
                                A(f).siblings("span.larry-span-tips").remove()
                            }
                            A(f).after('<span class="larry-span-tips">' + l + "</span>");
                            A(f).blur(function() {
                                A(this).siblings("span.larry-span-tips").remove();
                                A(this).removeClass("larry-form-danger")
                            })
                        } else {
                            m.msg(l, {
                                icon: 5,
                                shift: 6
                            })
                        }
                        if (!h.android && !h.ios) f.focus();
                        o.addClass(v);
                        return y = true
                    } else {}
                }
            });
            if (y) return y
        });
        if (y) {
            return false
        } else {
            return true
        }
    };
    var t = function() {
       
        var r = A(this),
        u = b.config.verify,
        p = null,
        y = "larry-form-danger",
        t = {},
        e = r.closest(g),
        a = e.find("*[lay-verify]"),
        i = r.parents("form")[0],
        l = e.find("input,select,textarea"),
        s = r.attr("lay-filter");
        console.log('r.closest(g)',g)
        layui.each(a,
        function(r, c) {
            var f = A(this),
            e = f.attr("lay-verify").split("|"),
            o = f.attr("lay-verType") || "tips",
            d = f.val();
            f.removeClass(y);
            layui.each(e,
            function(r, e) {
                var a = "",
                t = "";
                if (e.indexOf(":")) {
                    t = e.split(":");
                    a = t[1];
                    e = t[0]
                }
                var i, l = "",
                s = typeof u[e] === "function";
                if (u[e]) {
                    var n = false,
                    i = s ? l = u[e](d, a, c) : !u[e][0].test(d);
                    if (A(c).attr("lay-error")) {
                        n = A(c).attr("lay-error").split("|")
                    }
                    if (n[r]) {
                        l = n[r] || l
                    } else {
                        l = l || u[e][1]
                    }
                    if (i) {
                        if (o === "tips") {
                            m.tips(l,
                            function() {
                                if (typeof f.attr("lay-ignore") !== "string") {
                                    if (c.tagName.toLowerCase() === "select" || /^checkbox|radio$/.test(c.type)) {
                                        return f.next()
                                    }
                                }
                                return f
                            } (), {
                                tips: 1
                            })
                        } else if (o === "alert") {
                            m.alert(l, {
                                title: "提示",
                                shadeClose: true
                            })
                        } else if (o === "anim") {
                            A(c).addClass("larry-verify-anim");
                            if (A(c).siblings("span.larry-span-tips")) {
                                A(c).siblings("span.larry-span-tips").remove()
                            }
                            A(c).after('<span class="larry-span-tips">' + l + "</span>");
                            A(c).blur(function() {
                                A(this).siblings("span.larry-span-tips").remove();
                                A(this).removeClass("larry-verify-anim");
                                A(this).removeClass("larry-form-danger")
                            })
                        } else if (o === "below") {
                            if (A(c).siblings("span.larry-span-tips")) {
                                A(c).siblings("span.larry-span-tips").remove()
                            }
                            A(c).after('<span class="larry-span-tips">' + l + "</span>");
                            A(c).blur(function() {
                                A(this).siblings("span.larry-span-tips").remove();
                                A(this).removeClass("larry-form-danger")
                            })
                        } else {
                            m.msg(l, {
                                icon: 5,
                                shift: 6
                            })
                        }
                        if (!h.android && !h.ios) c.focus();
                        f.addClass(y);
                        return p = true
                    }
                }
            });
            if (p) return p
        });
        if (p) return false;
        var n = {};
        layui.each(l,
        function(r, e) {
            e.name = (e.name || "").replace(/^\s*|\s*&/, "");
            if (!e.name) return;
            if (/^.*\[\]$/.test(e.name)) {
                var a = e.name.match(/^(.*)\[\]$/g)[0];
                n[a] = n[a] | 0;
                e.name = e.name.replace(/^(.*)\[\]$/, "$1[" + n[a]+++"]")
            }
            if (/^checkbox|radio$/.test(e.type) && !e.checked) return;
            t[e.name] = e.value
        });
        return layui.event.call(this, $, "submit(" + s + ")", {
            elem: this,
            form: i,
            field: t
        })
    };
    var l = function() {
        var f = A(this),
        o = b.config.verify,
        d = null,
        u = "larry-form-danger",
        r = {},
        e = f.parents(g),
        a = f.parents("form")[0],
        t = e.find("input,select,textarea"),
        p = f.attr("lay-verType") || "tips",
        y = f.attr("blur") || 1;
        f.removeClass(u);
        var i = f.attr("lay-valid"),
        l = false,
        s = "";
        if (i.indexOf(":")) {
            s = i.split(":");
            l = s[1];
            i = s[0]
        }
        if (!i) return false;
        if (i == "blur") {
            var v = 0;
            f.blur(function() {
                var c = f.val();
                if (!l) {
                    if (!f.attr("lay-verify")) return false;
                    var r = f.attr("lay-verify").split("|");
                    layui.each(r,
                    function(r, e) {
                        var a = "",
                        t = false;
                        if (e.indexOf(":")) {
                            t = e.split(":");
                            e = t[0];
                            a = t[1]
                        }
                        var i, l = "",
                        s = typeof o[e] === "function";
                        if (o[e]) {
                            var n = false,
                            i = s ? l = o[e](c, a, f) : !o[e][0].test(c);
                            if (f.attr("lay-error")) {
                                n = f.attr("lay-error").split("|")
                            }
                            if (n[r]) {
                                l = n[r] || l
                            } else {
                                l = l || o[e][1]
                            }
                            if (i) {
                                if (p === "tips") {
                                    m.tips(l,
                                    function() {
                                        if (typeof f.attr("lay-ignore") !== "string") {
                                            if (f.get(0).tagName.toLowerCase() === "select" || /^checkbox|radio$/.test(f.get(0).type)) {
                                                return f.next()
                                            }
                                        }
                                        return f
                                    } (), {
                                        tips: 1
                                    })
                                } else if (p === "anim") {
                                    f.addClass("larry-verify-anim");
                                    if (f.siblings("span.larry-span-tips")) {
                                        f.siblings("span.larry-span-tips").remove()
                                    }
                                    f.after('<span class="larry-span-tips">' + l + "</span>")
                                } else if (p === "below") {
                                    if (f.siblings("span.larry-span-tips")) {
                                        f.siblings("span.larry-span-tips").remove()
                                    }
                                    f.after('<span class="larry-span-tips">' + l + "</span>")
                                } else if (p === "alert") {
                                    m.alert(l, {
                                        title: "提示",
                                        shadeClose: true
                                    })
                                } else {
                                    m.msg(l, {
                                        icon: 5,
                                        shift: 6
                                    })
                                }
                                if (y !== -1) {
                                    v++;
                                    if (v > y) {
                                        return d = false
                                    }
                                }
                                if (!h.android && !h.ios) f.focus();
                                f.addClass(u);
                                return d = true
                            } else {
                                if (p === "anim" || p === "below") {
                                    f.siblings("span.larry-span-tips").remove();
                                    f.removeClass("larry-verify-anim");
                                    f.removeClass("larry-form-danger")
                                }
                            }
                        }
                    });
                    if (d) return false
                } else {
                    var e = b.config.func;
                    var a = e[l](c, f);
                    if (a) {
                        if (!h.android && !h.ios) f.focus();
                        f.addClass(u);
                        return d = true
                    }
                    if (d) return false
                }
            })
        } else if (i == "focus") {} else if (i == "keyup") {}
    };
    var b = new a,
    s = A(document),
    I = A(window);
    b.render();
    s.on("reset", g,
    function() {
        var r = A(this).attr("lay-filter");
        setTimeout(function() {
            b.render(null, r)
        },
        50)
    });
    s.on("submit", g, t).on("click", "*[lay-submit]", t);
    s.on("click", "*[lay-valid]", l);
    r($, b)
});