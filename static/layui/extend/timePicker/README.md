### 功能说明：

用于列表筛选时间或者选择时间，比原有的laydate组件上多了几个特定的时间供用户选择，如 今天，昨天，本月，上月。

同时还集成了js格式化时间插件moment.js，该组件还支持时间戳显示。

样式展示：

![样式展示](https://images.gitee.com/uploads/images/2018/0926/103727_dc8bc85b_7367.png "index.png")


### html代码实例：


```
<input type="text" class="layui-input " name="" id="demo" value="" placeholder="">
```


### js代码实例：


```
layui.config({
    base: '__STATIC__/admin/js/',
});
layui.use(['timePicker'],function () {
    var timePicker = layui.timePicker;
    timePicker.render({
        elem: '#demo', //定义输入框input对象
        options:{      //可选参数timeStamp，format
            timeStamp:false,//true开启时间戳 开启后format就不需要配置，false关闭时间戳 //默认false
            format:'YYYY-MM-DD',//格式化时间具体可以参考moment.js官网 默认是YYYY-MM-DD HH:ss:mm
        },
    });
     
})
```



