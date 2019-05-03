/**
 * Created by 陈熠 on 2017/6/21
 * email   :  228112142@qq.com
 */
(function ($) {
    /* 入口函数 */
    $.fn.labelTool = function () {
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
            R = labelTool.getDataByCode(cyProps.codeName);
        }
        //如果是从后台获取数据
        if (url != undefined && url != "") {
            R = labelTool.getDataByUrl(cyProps.url);
        }
        //如果是从枚举获取数据
        if (enumName != undefined && url != "") {
            R = labelTool.getDataByEnum(cyProps.enumName);
        }
        labelTool.renderData(R, $grid, cyProps);
    };
    /*默认配置*/
    var cyProps = {};
    /*方法对象*/
    var labelTool = {
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
        /**组件数据渲染 by chenyi 2017/7/20*/
        renderData: function (R, $grid, cyProps) {
            var _grid = $grid;
            var _value = $(_grid).attr("value");
            $(_grid).removeAttr("value");
            var _showColor = cyProps.showColor||"false";
            var data = R.data;
            var valueHtml="";
            if (data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    //设置默认值
                    if (_value == data[i].code) {
                        valueHtml=data[i].value;
                        //是否显示颜色
                        if(_showColor=="true"){
                            //默认值为1时绿色  0时红色
                            if(_value==1){
                                valueHtml="<span style='color:green'>"+data[i].value+"</span>"
                            }
                            if(_value==0){
                                valueHtml="<span style='color:red'>"+data[i].value+"</span>"
                            }
                        }
                        $(_grid).html(valueHtml);
                    }
                }
            }
        }
    }

})(jQuery);
$(document).ready(function () {
    var labels = $("[cyType='labelTool']");
    for (var i = 0; i < labels.length; i++) {
        $(labels[i]).labelTool();
    }
});