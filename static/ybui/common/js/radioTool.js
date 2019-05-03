/**
 * Created by 陈熠 on 2017/6/21
 * email   :  228112142@qq.com
 */
(function ($) {
    /* 入口函数 */
    $.fn.radioTool = function () {
        //当前表格对象
        var $grid = this;
        //获取表格参数
        cyProps = $grid.attr("cyProps");
        if (!cyProps) {
            return
        }
        cyProps = cyProps ? cyProps : "";
        //将表格参数转为json
        cyProps = eval("({" + cyProps + "})");
        //获取数据的地址，只能通过表码或url，如果两个都写，默认是url
        //从表码获取数据
        var codeName = cyProps.codeName;
        //从后台获取数据
        var url = cyProps.url;
        //从枚举获取数据
        var enumName = cyProps.enumName;
        var R = "";
        //如果是通过表码取值
        if (codeName != undefined && codeName != "") {
            R = radioTool.getDataByCode(cyProps.codeName);
        }
        //如果是从后台获取数据
        if (url != undefined && url != "") {
            R = radioTool.getDataByUrl(cyProps.url);
        }
        //如果是从枚举获取数据
        if (enumName != undefined && url != "") {
            R = radioTool.getDataByEnum(cyProps.enumName);
        }
        radioTool.renderData(R, $grid, cyProps);
    };
    /*默认配置*/
    var cyProps = {};
    /*方法对象*/
    var radioTool = {
        /**获取数据 by chenyi 2017/6/21*/
        getDataByUrl: function (url) {
            var data;
            $.ajax({
                url: url,
                async: false,
                type: 'post',
                dataType: "json",
                success: function (R) {
                    if (R.code == 0) {
                        data = R;
                    } else {
                        data = {};
                        alert(R.msg);
                    }
                }
            });
            return data;
        },
        /**获取数据 by chenyi 2017/7/5*/
        getDataByCode: function (codeName) {
            /**localStorage是否已存在该数据*/
            var data = $t.getStorageItem(codeName);
            if (!data) {
                $.ajax({
                    url: $s.getDataByCode,
                    async: false,
                    data: {codeName: codeName},
                    type: 'post',
                    dataType: "json",
                    success: function (R) {
                        if (R.code == 0) {
                            data = R;
                            /**设置localStorage缓存*/
                            $t.setStorageItem(codeName, data);
                        } else {
                            data = {};
                            alert(R.msg);
                        }
                    }
                });

            }

            return data;
        },
        /**获取数据 by chenyi 2017/7/19*/
        getDataByEnum: function (enumName) {
            /**localStorage是否已存在该数据*/
            var data = $t.getStorageItem(enumName);
            if (!data) {
                $.ajax({
                    url: $s.getDataByEnum,
                    async: false,
                    type: 'post',
                    data: {enumName: enumName},
                    dataType: "json",
                    success: function (R) {
                        if (R.code == 0) {
                            data = R;
                            /**设置localStorage缓存*/
                            $t.setStorageItem(enumName, data);
                        } else {
                            data = {};
                            alert(R.msg);
                        }
                    }
                });
            }
            return data;
        },
        /**单选组件数据渲染 by chenyi 2017/7/20*/
        renderData: function (R, $grid, cyProps) {
            var _grid = $grid;
            $(_grid).attr("style", "height:38px;width:auto!important;");
            var _name = $(_grid).attr("name");
            var _value = $(_grid).attr("value");
            $(_grid).removeAttr("lay-verify");
            $(_grid).removeAttr("name");
            $(_grid).removeAttr("value");
            //获取单选框禁用的值
            var _disabled = cyProps.disabled||"";
            var _disableds = _disabled.split(",");
            //获取监控标识
            var filter = cyProps.filter || "";
            var data = R.data;
            if (data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var _input = '<input type="radio"  name="' + _name + '" title="' + data[i].value + '" value="' + data[i].code + '">';
                    //设置默认值
                    if (_value == data[i].code) {
                        _input = _input.replace("<input", "<input checked ")
                    }
                    //设置禁用
                    if (_disableds.indexOf(data[i].code) != -1) {
                        _input = _input.replace("<input", "<input disabled ")
                    }
                    //添加监控标识
                    if (filter != "") {
                        _input = _input.replace("<input", "<input lay-filter=" + filter);
                    }
                    $(_grid).append(_input);
                }
            }
            radioTool.renderRadio();
        },
        renderRadio: function () {
            layui.use('form', function () {
                var form = layui.form;
                form.render('radio');

            });
        }
    }

})(jQuery);
$(document).ready(function () {
    var radios = $("[cyType='radioTool']");
    for (var i = 0; i < radios.length; i++) {
        $(radios[i]).radioTool();
    }
});