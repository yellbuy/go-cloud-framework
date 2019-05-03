layui.define(['jquery',  'util'], function(exports) {
	'use strict';
	var $ = layui.$,
		layer = layui.layer,
		larryms = layui.larryms,
		util = layui.util;

	
	
	if (window.top !== window.self) {
		if (!layui.cache.layertype) {
			larryms.utils.fixbar({
				bar1: true,
				bgcolor: '#009688',
				custom: 'larry-tab="iframe" data-group="0" data-id="2" fresh="1" data-url="console.html"'
			});
		}
		util.fixbar();
	}
	var Func =function(){};
	/**
	 * 定义功能函数
	 * @Author   Larry
	 * @DateTime 2019-03-08T19:22:55+0800
	 * @param    {[type]}                 layui.cache.isFunction [description]
	 * @return   {[type]}                                        [description]
	 */
	Func.prototype.CreateAddForm = function(tit,url,options){
			tit = tit?tit:'新增';
			options = options == undefined ? {} : options;
			options.width = options.width ? options.width : '600px';
			options.height = options.height ? options.height : '520px';
			options.type =options.type ? options.type : 2;
			options.skin = options.skin ? options.skin : "larryms-navy";
			larryms.open({
				title:tit,
				skin:options.skin,
				type:options.type,
				maxmin: true,
				area:[options.width,options.height],
				content:url
			});
		}
	Func.prototype.ReloadOrSearch = function(tid, table) {
		var name = [],
			value = [];
		$("[id^='searchbox']").each(function() {
			if ($(this).val() != '') {
				var names = $(this).attr('name');
				name.push(names);
				value.push($(this).val());
			}
		});
		//执行重载
		table.reload(tid, {
			page: {
				curr: 1 //重新从第 1 页开始
			},
			where: {
				name: name.join('||'),
				value: value.join('||')
			}
		});
	}

	if(layui.cache.isFunction == true){
		var func = new Func();
	}else{
		var func = {};
	}
	
	
	exports('common', func);
});