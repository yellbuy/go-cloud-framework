/**
 * Created by 陈熠 on 2017/8/16
 * email   :  228112142@qq.com
 * 联动选择框控件
 */
(function ($) {
    /* 入口函数 */
    $.fn.linkSelectTool = function () {

        //当前对象
        var $grid = this;
        //获取参数
        cyProps = $grid.attr("cyProps");
        if (!cyProps) {
            return
        }
        cyProps = cyProps ? cyProps : "";
        //将参数转为json
        cyProps = eval("({" + cyProps + "})");
        //获取顶级id
        var topId=cyProps.topId;
        cyProps.normalUrl= cyProps.url+"/"+topId;

        var R = selectTool.getDataByUrl(cyProps.normalUrl);

        selectTool.renderData(R, $grid, cyProps);
    };
    /*默认配置*/
    var cyProps = {};
    /*方法对象*/
    var selectTool = {
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
        /**渲染下拉框数据 by chenyi 2017/6/21*/
        renderData: function (R, $grid, cyProps) {

            var _grid = $grid;
            //获取下拉控件的name
            var _name = cyProps.name;
            $(_grid).attr("name",_name);
            //获取下拉控件的默认值
            var _value = $(_grid).attr("value");
            var _values = _value.split(",");
            $(_grid).removeAttr("value");
            //获取是否有提示
            var _selectTip = cyProps.tips || "请选择";
            //搜索功能参数
            var _search = cyProps.search || "true";
            var data = R.data;
            var _select = '<select name="' + _name + '" ></select>';
            //是否开启搜索功能
            if (_search == "true") {
                _select = _select.replace("<select", "<select  lay-search");

            }
            //添加监控标识
             _select = _select.replace("<select", "<select lay-filter='link'" );

            $(_grid).append(_select);

            if (_selectTip != "false") {
                $(_grid).find("select").append('<option value="">' + _selectTip + '</option>');
            }
            if (data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var _option = '<option value="' + data[i].code + '">' + data[i].value + '</option>';
                    //设置默认值
                    if (_values.length>0&&_values[0] == data[i].code) {
                        _option = _option.replace("<option", "<option selected ")
                    }
                    $(_grid).find("select").append(_option);
                }
            }
            /**下级数据回填 chenyi 2017/8/16**/
            if(_value!=""&&_values != undefined){

                for(var j=0;j<_values.length;j++){
                    if(_values[j]!=""){

                        //获取所有下级数据
                        var LowerData = selectTool.getDataByUrl(cyProps.url+"/"+ _values[j]);
                        var curr_data=LowerData.data;
                        if(curr_data){
                            var _div = '<div id="div_' + _values[j] + '" class="layui-input-inline" ></div>';
                            $(_grid).parent().append(_div);
                            var _select = '<select id="select_' + _values[j] + '" name="'+cyProps.name+'" lay-search lay-filter="link" ></select>';
                            $("#div_" + _values[j]).append(_select);
                            $("#select_" + _values[j]).append('<option value="">请选择</option>');
                            for (var i = 0; i < curr_data.length; i++) {
                                var _option = '<option value="' + curr_data[i].code + '">' + curr_data[i].value + '</option>';
                                //设置默认值

                                if (_values[j+1] == curr_data[i].code) {
                                    _option = _option.replace("<option", "<option selected ")
                                }
                                $("#select_" + _values[j]).append(_option);
                            }
                        }
                        }

                }
            }

            //渲染下拉框
            layui.use(['form'], function () {
                var form = layui.form;
                //监听提交
                form.on('select()', function (data) {
                    return false;
                });
                //下拉框监听事件
                form.on('select(link)', function (data) {

                    //当前元素的父节点
                    var _grid = $(data.othis).parent();
                    //删除当前点击的下级地区dom
                    $(_grid).nextAll(".layui-input-inline").remove();
                    //当前点击的id
                    var parentId = data.value;
                    if (parentId != "") {
                        //获取所有下级地区
                        var R = selectTool.getDataByUrl(cyProps.url+"/"+ parentId);

                        if (R.data&&R.data.length > 0) {
                            var _div = '<div id="div_' + data.value + '" class="layui-input-inline" ></div>';
                            $(_grid).after(_div);
                            var _select = '<select id="select_' + data.value + '" name="'+cyProps.name+'" lay-search lay-filter="link" ></select>';
                            $("#div_" + data.value).append(_select);
                            $("#select_" + data.value).append('<option value="">请选择</option>');
                            for (var i = 0; i < R.data.length; i++) {
                                var _option = '<option value="' + R.data[i].code + '">' + R.data[i].value + '</option>';
                                $("#select_" + data.value).append(_option);
                            }
                        }

                        form.render('select');
                    }
                    return false;

                });

            });

            layui.use('form', function () {
                var form = layui.form;
                form.render('select');
            });
        }
    }

})(jQuery);
$(document).ready(function () {
    //下拉树查询
    var linkSelects = $("[cyType='linkSelectTool']");

    for (var i = 0; i < linkSelects.length; i++) {
        $(linkSelects[i]).linkSelectTool();
    }
});