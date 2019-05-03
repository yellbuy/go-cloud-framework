layui.define(['larryms', 'forms', 'table', 'laydate','element'], function(exports) {
	var $ = layui.$,
		larryms = layui.larryms,
		forms = layui.forms,
		laydate = layui.laydate,
		element = layui.element,
		table = layui.table;

	laydate.render({
		elem: '#dateDemo',
		btns: ['confirm']
	});

	var tableUrl = $('#larryOrder').data('url');
	table.render({
		elem: '#larryOrder',
		url: tableUrl//模拟接口
			,
		cols: [
			[{
				type: 'numbers',
				fixed: 'left',
				width: 50,
				title: '编号'
			}, {
				field: 'orderid',
				width: 120,
				title: '订单单号',
				sort: true,
				align:'center'
			}, {
				field: 'title',
				title: '订单内容',
				minWidth: 300
			}, {
				field: 'progress',
				title: '进度',
				minWidth: 200,
				align: 'center',
				templet: '#progressTpl'
			}, {
				field: 'area',
				title: '所属地区',
				width: 100,
				align:'center'
			}, {
				field: 'submit',
				width: 100,
				title: '业务员',
				align: 'left'
			}, {
				field: 'accept',
				width: 120,
				title: '审核人员'
			}, {
				field: 'state',
				title: '订单状态',
				templet: '#buttonTpl',
				width: 100,
				align: 'center'
			}, {
				title: '操作',
				align: 'center',
				fixed: 'right',
				width: 190,
				toolbar: '#table-system-order'
			}]
		],
		page: true,
		limit: 10,
		limits: [10, 15, 20, 25, 30],
		text: '对不起，加载出现异常！',
		done: function() {
			element.render('progress')
		}
	});
	exports('orders', {});
})