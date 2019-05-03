layui.define('larryms', function(exports) {
	var $ = layui.$,
		larryms = layui.larryms;
	var thisText = $('.layout-switch dd.layui-this').children('a').text();
	//主要用于demo示例的布局风格切换,本扩展模块代码于实际项目无甚用处，可在框架主页面底部的入口位置删除引用即可
	$('.layout-switch dd').on('click', function() {
		var layout_url = $(this).children('a').data('href'),
			tipsText = $(this).children('a').data('text');
		larryms.confirm('您确定要切换布局风格吗？由于当前演示站不同布局风格共用同一菜单数据，会在切换时清空页面缓存', {
			skin: 'layui-layer-molv'
		}, function() {
			if (layout_url != '') {
				larryms.msg('正在进行切换布局风格，请稍等...', {
					time: 500
				}, function() {
					//设定清空缓存标识
					// layui.data('switchs',{
					// 	key:'clearSwitch',
					// 	value:true
					// });
					larryms.cleanCached.clearAll();
					window.location.href = layout_url;
				});
			}else{
				larryms.msg('您当前选择的布局风格还未发布更新，请耐心等待官网更新！');
			}

		}, function() {
			if(tipsText !=''){
				larryms.msg('继续浏览《' + tipsText + '》风格的demo');
			}else{
				larryms.msg('继续浏览《' + thisText + '》风格的demo');
			}
		});
	});

	exports('switchs', {});
});