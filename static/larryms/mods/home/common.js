layui.define(['jquery','larryMenu'], function(exports) {
	var $ = layui.$,
	larryMenu = layui.larryMenu();
	//顶部菜单点击监听
	$('#menus').on('click', function() {
		if ($(this).hasClass('actice')) {
			$(this).removeClass('actice');
			$('#left_nav').removeClass('pt-page-moveFromLeft');
			$('#left_nav').addClass('pt-page-moveToLeftFade');

		} else {
			$(this).addClass('actice');
			$('#left_nav').addClass('current-this');
			$('#left_nav').removeClass('pt-page-moveToLeftFade');
			$('#left_nav').addClass('pt-page-moveFromLeft');
		}
	});

	$('*[lay-tips]').on('mouseenter', function() {
		var content = $(this).attr('lay-tips');

		this.index = layer.tips('<div style="padding: 10px; font-size: 14px; color: #eee;">' + content + '</div>', this, {
			time: -1,
			maxWidth: 280,
			tips: [3, '#3A3D49']
		});
	}).on('mouseleave', function() {
		layer.close(this.index);
	});



	var larrymsElemBox = $('#larry_layout'),
		LarryMenuDatas = [
			[{
				text: "刷新当前页",
				func: function() {
					if (top == self) {
						if (larrymsElemBox.length) {
							larryms.confirm('您确定要重新加载系统吗！', {},function() {
								top.document.location.reload();
							}, function() {
								return;
							});
						} else {
							document.location.reload();
						}
					} else {
						if (layui.cache.layertype !== undefined && layui.cache.layertype == 2) {
							var curIndex = parent.layer.getFrameIndex(window.name),
								$curIframe = $('#layui-layer-iframe' + curIndex),
								curIframeUrl = $curIframe.context.URL;
							parent.layer.iframeSrc(curIndex, curIframeUrl);
						} else {
							$('.layui-tab-content .layui-tab-item', parent.document).each(function() {
								if ($(this).hasClass('layui-show')) {
									$(this).children('iframe').attr('src', $(this).children('iframe').attr('src'));
									return false;
								}
							});
						}
					}
				}
			}, {
				text: "重载主框架",
				func: function() {
					top.document.location.reload();
				}
			}]
		];
	var Core = new Function();
	Core.prototype.tab = {
		// 页面右键菜单
		rightMenu: function(larryMenuData) {
			larryMenu.ContentMenu(larryMenuData, {
				name: 'body'
			}, $('body'));
			if (window.top === window.self) {
				var $larrymsTabCon = $('#larry_tab_content');
				if ($larrymsTabCon.length !== 0) {
					$larrymsTabCon.mouseenter(function() {
						larryMenu.remove();
					});
				}
			} else {
				if (layui.cache.layertype !== undefined && layui.cache.layertype == 2) {
					$('iframe', parent.document).mouseout(function() {
						larryMenu.remove();
					});
				}
				var $larymsIframe = $('#larry_tab_content', window.parent.document);

				$larymsIframe.mouseout(function() {
					larryMenu.remove();
				});
			}
		}
	};
	Core.prototype.init = function() {
		var that = this;
		//常用右键菜单功能
		if (layui.cache.rightMenu !== false && layui.cache.rightMenu !== 'custom') {
			that.tab.rightMenu(LarryMenuDatas);
		} else if (layui.cache.rightMenu === false) {
			larryMenu.remove();
			larryMenu = null;
			$(document).bind("contextmenu", function(e) {
				return false;
			});
		} else if (layui.cache.rightMenu === 'none') {
			larryMenu.remove();
			larryMenu = null;
		}
	};
	var larryCore = new Core();
	larryCore.init();
	exports('common', larryCore);
})