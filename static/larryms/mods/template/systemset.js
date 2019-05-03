layui.define(['larryms','forms','neditor'],function(exports){
	var $ = layui.$,
		larryms = layui.larryms,
		forms = layui.forms,
		element = layui.element,
		neditor = layui.neditor;
	//获取所有html容器
        var $larrymsHtml = $('.larryms-html');
        $larrymsHtml.each(function() {
            var currId = $(this).attr('id'),
                name = currId + 'ue';

               var ue = UE.getEditor(currId, {
				initialFrameWidth: null
			});
			ue.ready(function() {
				ue.setHeight(200);
			});
        });

    exports('systemset',{});
});