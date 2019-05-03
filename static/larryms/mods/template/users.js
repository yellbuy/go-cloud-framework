layui.define(['larryms', 'forms', 'table', 'common'], function(exports) {
	var $ = layui.$,
		larryms = layui.larryms,
		forms = layui.forms,
		common = layui.common;
	table = layui.table;
	var dataUrl = $('#userMange').data('url');
	table.render({
		elem: '#userMange',
		url: dataUrl,
		method: 'post',
		limit: 15,
		even: true, //开启隔行背景
		page: true,
		page: true,
		toolbar: '#toolbar',
		height: "full-145",
		defaultToolbar: ['filter', 'print', 'exports'],
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
					field: 'username',
					title: '用户名',
					width: 100
				}, {
					field: 'realname',
					title: '姓名',
					width: 120
				}, {
					field: 'name',
					title: '部门',
					width: 100,
					align: 'center'
				}, {
					field: 'zhiwei',
					title: '当前职位',
					align: 'center'
				}, {
					field: 'phone',
					title: '手机号',
					align: 'center'
				},

				{
					field: 'status',
					title: '在岗状态',
					sort: true,
					width: 100,
					templet: function(d) {
						var statusCheck = d.status == 1 ? "checked" : "";
						return '<input type="checkbox" name="status" lay-filter="status" lay-skin="switch" lay-text="在岗|离岗" ' + statusCheck + '>';
					}
				}, {
					field: 'online_state',
					title: '当前状态',
					sort: true,
					width: 100,
					align: 'center',
					templet: function(d) {
						if (d.online_state == 1) {
							return '<span class="larry-btn larry-btn-xs radius larry-btn-outline-primary">当前在线</span>';
						} else if (d.online_state == 0) {
							return '<span class="larry-btn larry-btn-xs radius larry-btn-outline-secondary">当前离线</span>';
						} else if (d.online_state == 2) {
							return '<span class="larry-btn larry-btn-xs radius larry-btn-outline-info">已锁屏幕</span>';
						} else if (d.online_state == 3) {
							return '<span class="larry-btn larry-btn-xs radius larry-btn-outline-danger">正在忙碌</span>';
						}
					}
				}, {
					field: 'login_num',
					title: '登录次数',
					sort: true,
					align: 'center'
				}, {
					field: 'last_login_ip',
					title: '登录ip',
					align: 'center'
				}, {
					field: 'last_login_time',
					title: '登录时间',
					sort: true,
					align: 'center'
				}, {
					title: '操作',
					width: 150,
					templet: '#opreateBar',
					fixed: "right",
					align: "center"
				},
			]
		]
	});

	table.on('checkbox(userMange)', function(obj) {
		var checkStatus = table.checkStatus('userMange'),
			data = checkStatus.data;
		data.length > 0 ? $('.isDelete').removeClass("disabled") : $('.isDelete').addClass("disabled");
		data.length > 0 ? $('.isDelete').attr("disabled", false) : $('.isDelete').attr("disabled", true);
		layui.layer.tips('选中了：' + data.length + ' 个', '.isDelete', {
			tips: [1, '#393D49']
		});
	});
	table.on('toolbar(userMange)', function(obj) {
		switch (obj.event) {
			case 'add':
				var urls = $(this).data('url');
				common.CreateAddForm('添加员工', urls, {
					width: '600px',
					height: '600px'
				});
				break;
			case 'del':
				var checkStatus = table.checkStatus('userMange'),
					data = checkStatus.data;
				var ids = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == 1) {
						layer.msg("系统管理员不能删除!");
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
				break;

			case 'search':
				larryms.msg("搜索功能需请求服务端执行，此次只提供前端实现演示",{icon:1},function(){
					common.ReloadOrSearch('userMange',table);
				});
				break;

			case 'reload':
				common.ReloadOrSearch('userMange',table);
				break;
		}
	});

	table.on('tool(userMange)', function(obj){
		var data = obj.data;
		switch(obj.event){
		case 'edit':
			var urls = $(this).data('url');
				common.CreateAddForm('编辑员工', urls, {
					width: '600px',
					height: '600px'
				});
	 		break;
	 	case 'del':
	 		if (data.id==1){
				layer.msg("系统管理员不能删除!");
				return;
			}else{
				larryms.msg('您正在删除'+JSON.stringify(data)+'请结合服务端请求完成删除');
			}
			
		}
	});	

	exports('users', {});
});