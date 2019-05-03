layui.define('larryms', function(exports) {
	var $ = layui.$,
		larryms = layui.larryms;
	if(layui.cache.identified == 'error403'){
		var index = top.larryms.open({
			type:2,
			title:false,
			resize:false,
			maxmin:false,
			content:'general/scene/403_1.html'
		});
		top.layer.full(index);
	}else if (layui.cache.identified == 'contacts') {
		layui.use('rate', function() {
			var rate = layui.rate;

			rate.render({
				elem: '.larry-rate',
				value: 4,
				length: 6,
				theme: '#859CB7' //自定义主题色
			});
		});
	}else if(layui.cache.identified == 'photos'){
		
	}

	exports('scene', {});
});