/**
 * Created by 陈熠 on 2017/6/21
 * email   :  228112142@qq.com
 */
(function ($) {
    /* 入口函数 */
    $.fn.checkboxTool = function () {
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
            R = checkboxTool.getDataByCode(cyProps.codeName);
        }
        //如果是从后台获取数据
        if (url != undefined && url != "") {
            R = checkboxTool.getDataByUrl(cyProps.url);
        }
        //如果是从枚举获取数据
        if (enumName != undefined && url != "") {
            R = checkboxTool.getDataByEnum(cyProps.enumName);
        }
        checkboxTool.renderData(R, $grid, cyProps);
    };
    /*默认配置*/
    var cyProps = {};
    /*方法对象*/
    var checkboxTool = {
        /**通过url获取数据 by chenyi 2017/7/5*/
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
        /**渲染数据 by chenyi 2017/6/21*/
        renderData: function (R, $grid, cyProps) {
            var _grid = $grid;
            //获取下拉控件的name
            var _name = $(_grid).attr("name");
            //获取下拉控件的默认值
            var _value = $(_grid).attr("value");
            var _values = _value.split(",");
            var selectTip = "请选择";
            $(_grid).attr("style","height:38px;width:auto!important;");
            $(_grid).removeAttr("lay-verify");
            $(_grid).removeAttr("name");
            $(_grid).removeAttr("value");
            //获取监控标识
            var filter = cyProps.filter || "";
            //获取复选框禁用的值
            var _disabled = cyProps.disabled||"";
            var _disableds = _disabled.split(",");
            var data = R.data;
            $(_grid).find("select").append('<option value="">' + selectTip + '</option>');
            if (data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var _input = '<input type="checkbox" lay-skin="primary"  name="'+_name+'[]" title="' + data[i].value + '" value="' + data[i].code + '">';
                    //设置默认值
                    if (_values.indexOf(data[i].code)!=-1) {
                        _input = _input.replace("<input", "<input checked ")
                    }
                    //添加监控标识
                    if (filter != "") {
                        _input = _input.replace("<input", "<input lay-filter=" + filter);
                    }
                    //设置禁用
                    if (_disableds.indexOf(data[i].code) != -1) {
                        _input = _input.replace("<input", "<input disabled ")
                    }
                    $(_grid).append(_input);
                }
            }
            //是否打开全选按钮
            var allBtn = cyProps.allBtn||'false';
            if(allBtn=='true'){
                $(_grid).prepend(' <input type="checkbox" lay-skin="primary" title="全选" lay-filter="allChoose">');
                layui.use('form', function () {
                    var $ = layui.jquery, form = layui.form;
                    //全选
                    form.on('checkbox(allChoose)', function (data) {
                        var child = $($(data.elem).parent()).find('input[type="checkbox"]');
                        child.each(function (index, item) {
                            item.checked = data.elem.checked;
                        });
                        form.render('checkbox');
                    });

                });
            }
        }
    }

})(jQuery);
$(document).ready(function () {
    //下拉树查询
    var checkboxs = $("[cyType='checkboxTool']");
    for (var i = 0; i < checkboxs.length; i++) {
        $(checkboxs[i]).checkboxTool();
    }
});