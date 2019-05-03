layui.define(['larryms', 'forms', 'table','common'], function(exports) {
	var $ = layui.$,
		larryms = layui.larryms,
		common = layui.common,
		forms = layui.forms;
	table = layui.table;

	var dataUrl = $('#rolelist').data('url');
	table.render({
		elem: '#rolelist',
		url: dataUrl,
		method: 'post',
		limit: 15,
		even: true, //开启隔行背景
		page: true,
		page: true,
		height: "full-175",
		text: {
			none: '暂无相关数据'
		},
		cols: [
			[{
				type: "checkbox",
				fixed: "left",
				width: 50
			}, {
				type: 'numbers',
				title: '编号',
				width: 60
			}, {
				field: 'title',
				title: '角色名称',
				width: 160,
				align: 'center'
			}, {
				field: 'description',
				title: '角色描述',
				width: 180
			}, {
				field: 'rules',
				title: '权限规则',
				align: 'center',
				templet: function(d) {
					if (d.rules) {
						return d.rules;
					} else {
						return '<span style="color:#bbb;">当前该角色暂未完成授权操作</span>';
					}
				}
			}, {
				field: 'status',
				title: '权限组状态',
				sort: true,
				align: 'center',
				width: 120,
				templet: function(d) {
					var statusCheck = d.status == 1 ? "checked" : "";
					return '<input type="checkbox" name="status" lay-filter="status" lay-skin="switch" lay-text="启用|关闭" ' + statusCheck + '>';
				}
			}, {
				field: 'create_time',
				title: '创建时间',
				sort: true,
				align: 'center'
			}, {
				field: 'update_time',
				title: '修改时间',
				sort: true,
				align: 'center'
			}, {
				title: '操作',
				width: 230,
				templet: '#opreateBar',
				fixed: "right",
				align: "center"
			}, ]
		]
	});
	table.on('checkbox(rolelist)', function(obj) {
		var checkStatus = table.checkStatus('rolelist'),
			data = checkStatus.data;
		data.length > 0 ? $('.isDelete').removeClass("disabled") : $('.isDelete').addClass("disabled");
		data.length > 0 ? $('.isDelete').attr("disabled", false) : $('.isDelete').attr("disabled", true);
		layui.layer.tips('选中了：' + data.length + ' 个', '.isDelete', {
			tips: [1, '#78BA32']
		});
	});
	$('.larry-btn-groups .layui-btn').on('click', function() {
			var type = $(this).data('type'),
				url = $(this).data('url');
			active[type] ? active[type].call(this, url) : '';
	});
	var active = {
		add:function(url){
				common.CreateAddForm('添加新角色', url, {
					width: '520px',
					height: '380px'
				});
		},
		del:function(){
			var checkStatus = table.checkStatus('rolelist'),
					data = checkStatus.data;
				var ids = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == 1) {
						layer.msg("超级管理员角色不能删除!");
						return;
					}
					ids.push(data[i].id);
				}
				if(ids.length == 0){
					larryms.msg('请先选择待删除项',{icon:2});
					return false;
				}
				larryms.msg('正在执行删除...',{icon:2,time:1000},function(){
					larryms.msg('很抱歉这里只是前端演示数据逻辑执行，执行删除需要您请求服务端完成');
				});
		}
	};
	table.on('checkbox(rolelist)', function(obj) {
		var checkStatus = table.checkStatus('rolelist'),
			data = checkStatus.data;
		data.length > 0 ? $('.isDelete').removeClass("disabled") : $('.isDelete').addClass("disabled");
		data.length > 0 ? $('.isDelete').attr("disabled", false) : $('.isDelete').attr("disabled", true);
		layui.layer.tips('选中了：' + data.length + ' 个', '.isDelete', {
			tips: [1, '#393D49']
		});
	});

	table.on('tool(rolelist)', function(obj) {
		var data = obj.data;
		switch (obj.event) {
			case 'grantauth':
				larryms.msg('权限授权模块会在下一个版本中更新larrytree模块后 提供模板示例，将会有更加丰富完整的权限系列');
				//引入core模块，执行tab选项卡操作
				// core.tabOperate({
				// 	href: $(this).data('url'),
				// 	id: $(this).data('id'),
				// 	font: "larry-icon",
				// 	icon: "larry-quanxianguanli",
				// 	group: $(this).data('group')
				// }, 'nonetabIframe');
				break;
			case 'edit':
				larryms.msg('这里是编辑功能'+JSON.stringify(data));
				break;

			case 'del':
				larryms.msg('删除'+JSON.stringify(data));
				break;
		}
	});
	exports('role', {});
})