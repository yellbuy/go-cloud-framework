/**
 * Created by 陈熠 on 2017/8/22
 * email   :  228112142@qq.com
 * 上传控件
 */
(function ($) {
    /* 入口函数 */
    $.fn.starTool = function () {
        //当前对象
        var $grid = this;
        //获取参数
        cyProps = $grid.attr("cyProps");
        cyProps = cyProps ? cyProps : "";
        //将参数转为json
        cyProps = eval("({" + cyProps + "})");
        $.extend(defaultParam, cyProps);

        //星星存放容器
        starTool.create($grid);
        //动态设置星星评分
        starTool.setStar($grid,cyProps.value||0);

    };
    /*默认配置*/
    var cyProps = {};
    var defaultParam={
        // 选择器，创建全部星元素存放的选择器
        selector: $('.star'),
        // 表单name，表单提交name得值
        name: 'star',
        // 单星宽度
        width: 23,
        // 单星高度
        height: 22,
        // 单星之间右外边局
        margin: 5,
        // 总星个数
        count: 5,
        // 未选星样式
        not: '/statics/img/star/not.png',
        // 全选星样式
        all: '/statics/img/star/all.png',
        // 半选星样式
        half: '/statics/img/star/half.png',
        // 鼠标经过手势样式，更多样式参考CSS cursor 属性
        cursor: 'pointer',
        //是否可选
        disable:false
    };
    /*方法对象*/
    var starTool = {
        create : function(selector){

            var params ={};
            $.extend(params, defaultParam);
            var setStyle = this.setStyle;

            // 选择器为空，使用默认选择器
            if(selector != ''){
                params.selector = $(selector);
            }

            // 初始化全部星元素存放的元素
            params.selector.css({'width':params.width * params.count + (params.margin * params.count - 1) +'px', 'position': 'relative', 'cursor': params.cursor});

            // 追加创建单星元素
            for(var i = 0; i < params.count; i++){
                params.selector.append('<span></span>');
            }

            // 初始化单星样式。
            params.selector.find('span').css({
                'margin-right': params.margin + 'px',
                'display': 'inline-block',
                'background': 'url('+params.not+')',
                'width': params.width + 'px',
                'height': params.height + 'px',
                'position': 'relative',
                'background-size': params.width+'px '+params.height+'px',
            });
            // 最后一颗单星去掉右外边距。
            params.selector.find('span:last').css({
                'margin-right': '0px',
            });

            // 添加name隐藏表单
            params.selector.append('<input type="text" name="'+params.name+'" style="display:none"/>');

            if(params.disable===false){
                // 鼠标离开事件
                params.selector.mouseleave(function(e){

                    var starValue = $(this).find('input').val();

                    // 没有设置星星分数
                    if(starValue == ''){

                        $(this).find('span').css({'background': 'url('+params.not+')','background-size': params.width+'px '+params.height+'px',});
                    }
                    // 设置了星星分数
                    if(starValue != ''){
                        // 更新星级样式
                        setStyle($(this),parseFloat(starValue),params);
                    }


                    // 鼠标左侧划出，清除样式
                    var position = e.pageX - $(this).offset().left;
                    if(position < 0){
                        $(this).find('span').css({'background': 'url('+params.not+')','background-size': params.width+'px '+params.height+'px',});
                    }
                });

                // 鼠标点击事件
                params.selector.click(function(e){

                    // 鼠标坐标
                    var position = e.pageX - $(this).offset().left;
                    // 计算鼠标当前所在星级范围
                    var allStar = parseInt(position/(params.width+params.margin));
                    var halfStar = position%(params.width+params.margin);
                    if(halfStar <= params.width/2-1){
                        halfStar = 0.5;
                    }else{
                        halfStar = 1;
                    }

                    // 设置星星分数
                    $(this).find('input').val(allStar+halfStar);
                    // 更新星级样式
                    setStyle($(this),allStar+halfStar,params);
                })

                // 鼠标经过事件
                params.selector.mousemove(function(e){
                    // 鼠标坐标
                    var position = e.pageX - $(this).offset().left;
                    // 计算鼠标当前所在星级范围
                    var allStar = parseInt(position/(params.width+params.margin));
                    var halfStar = position%(params.width+params.margin);
                    if(halfStar <= params.width/2-1){
                        halfStar = 0.5;
                    }else{
                        halfStar = 1;
                    }
                    setStyle($(this),allStar+halfStar,params);
                });
            }

        },
        // 动态设置分数
        setStar : function(selector,star){
            var params ={};
            $.extend(params, defaultParam);
            // 更新样式
            this.setStyle($(selector),star,params);
            // 设置星星分数
            $(selector).find('input').val(star);
        },
        // 动态获取分数
        getStar : function(selector){
            // 获取星星分数
            return $(selector).find('input').val();
        },
        // 设置星星样式
        setStyle : function(selector,star,params){

            var init = star.toFixed(1).split('.');
            var allStar = init [0];
            var halfStar = init [1]/10;
            // 设置前初始化星星样式
            selector.find('span').css({'background': 'url('+params.not+')','background-size': params.width+'px '+params.height+'px',});

            // 设置当前鼠标前星星样式为全
            selector.find('span:lt('+(allStar)+')').css({'background': 'url('+params.all+')','background-size': params.width+'px '+params.height+'px'});

            // 设置当前鼠标所在位置星星样式
            if(halfStar != 0 ){   // 如果半星为0则忽略

                if(halfStar > 0 && halfStar < 0.6){  // 半星大于0小于0.6为半星
                    selector.find('span:eq('+(allStar)+')').css({'background': 'url('+params.half+')','background-size': params.width+'px '+params.height+'px'});
                }else{ // 半星大于0小于0.6为全星
                    selector.find('span:eq('+(allStar)+')').css({'background': 'url('+params.all+')','background-size': params.width+'px '+params.height+'px'});
                }
            }
        }
    }

})(jQuery);


$(document).ready(function () {
    var starTool = $("[cyType='starTool']");
    for (var i = 0; i < starTool.length; i++) {
        $(starTool[i]).starTool();
    }
});

