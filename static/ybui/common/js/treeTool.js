/**
 * Created by 陈熠 on 2017/6/21
 * email   :  228112142@qq.com
 */
(function ($) {
    var cyProps = {};
    /* 入口函数 */
    $.fn.treeTool = function () {
        //参数数据
        cyProps = $(this).attr("cyProps");
        if (!cyProps) {
            return
        }
        cyProps = cyProps ? cyProps : "";
        //将表格参数转为json
        cyProps = eval("({" + cyProps + "})");
        //添加默认样式
        $(this).attr("readonly", "readonly");
        $(this).attr("style", "padding-right: 30px;");
        //为该组件添加清空按钮
        $(this).after('<i class="layui-icon  clear-btn" onclick="clearTreeData(this)">&#x1006;</i>');
        //获取控件id
        var _id = $(this).attr("id")||"id_"+new Date().getTime();
        //获取下拉树默认值的id
        var _value = $(this).attr("value") || "";
        //下拉树显示的值
        var valueName="";
        //加载下拉树数据
        $.ajax({
            type: "post",
            url: cyProps.url,
            contentType: "application/json",
            async: false,
            dataType: "json",
            success: function (R) {
                if (R.code == 0) {
                    ztree = $.fn.zTree.init($("#zTree"), setting, R.data);
                    var node = ztree.getNodeByParam("id", _value);
                    if (node != null) {
                        //获取下拉树要显示的值
                        valueName=node.name;
                        // 选中下拉树默认节点
                        ztree.selectNode(node);
                        $(this).val(node.name);
                    }
                } else {
                    alert(R.msg);
                }
            },
            error: function () {
                alert("系统错误");
            }
        });
        if(_value!=null&&_value!=""){
            $(this).attr("valueId",_value);
            $(this).val(valueName);
        }

        $("#" + _id + "_id").remove();
        //$("#treeLayer").remove();
        $(".layui-layer-molv").remove();

        $(this).after('<input value="' + _value + '"  style="display: none" id="' + _id + '_id"  name="' + cyProps.name + '"  class="layui-input">' +
            '<div id="treeLayer" style="display: none;padding:10px;"> ' +
            '<ul id="zTree" class="ztree"></ul> ' +
            '</div>');
    };


})(jQuery);
var setting = {
    data: {
        simpleData: {
            enable: true
        },
        key: {
            url: "nourl"
        }
    }
};
var ztree;
/**菜单列表*/
function openZtree(obj) {
    var _id = $(obj).attr("id");
    var _value=$("#" + _id + "_id").val();
    $("#" + _id + "_id").remove();
    $(".layui-layer-molv").remove();
    $("#treeLayer").remove();
    var cyProps = $(obj).attr("cyProps");
    if (!cyProps) {
        return
    }
    cyProps = cyProps ? cyProps : "";
    //将表格参数转为json
    cyProps = eval("({" + cyProps + "})");

    $(obj).after('<input  id="' + _id + '_id"  style="display: none" name="' + cyProps.name + '" value="' + _value + '" class="layui-input">' +
        '<div id="treeLayer" style="display: none;padding:10px;"> ' +
        '<ul id="zTree" class="ztree"></ul> ' +
        '</div>');
    $.ajax({
        type: "post",
        url: cyProps.url,
        contentType: "application/json",
        async: false,
        dataType: "json",
        success: function (R) {
            if (R.code == 0) {
                ztree = $.fn.zTree.init($("#zTree"), setting, R.data);
                var node = ztree.getNodeByParam("id", _value);
                if (node != null) {
                    ztree.selectNode(node);
                    $(obj).val(node.name);
                }
            } else {
                alert(R.msg);
            }
        },
        error: function () {
            alert("系统错误");
        }
    });
    layer.open({
        type: 1,
        offset: '50px',
        skin: 'layui-layer-molv',
        title: "请选择",
        area: ['300px', '400px'],
        shade: 0,
        shadeClose: false,
        content: jQuery("#treeLayer"),
        btn: ['确定', '取消'],
        btn1: function (index) {
            var node = ztree.getSelectedNodes();
            if (node.length > 0) {
                $("#" + _id + "_id").val(node[0].id);
                $("#" + _id).val(node[0].name);
               // $(obj).attr("valueId", node[0].id);
            }
            //选择上级菜单
            layer.close(index);
        }
    });
}
/**清空下拉树数据**/
function clearTreeData(obj){
        //重置显示的值
    $(obj).prev().prev().prev().val("");
    $(obj).prev().prev().val("");
}
$(document).ready(function () {
    $("[cyType='treeTool']").click(function () {
        var obj = $(this);
        openZtree(obj);
    });
    //下拉树查询
    var treeTools = $("[cyType='treeTool']");
    for (var i = 0; i < treeTools.length; i++) {
        $(treeTools[i]).treeTool();
    }


});
