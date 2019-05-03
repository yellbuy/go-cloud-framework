layui.define(['larryms','forms','code'],function(exports){
	var $ = layui.$,
	 larryms = layui.larryms,
	 forms = layui.forms;
	layui.code({
		skin: 'notepad',
		about: false,
		elem: ".layui-code",
		encode: true
	});
	forms.transfer({
		elem:'#test',
		source:'../../larryms/data/demo/transfer.json'
	})

	forms.on('submit(baseTransfer)',function(data){
		larryms.msg(JSON.stringify(data.field));
		return false;
	})
	exports('transferDemo',{});
});
