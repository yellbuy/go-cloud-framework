layui.define(['larryms','forms','cascade'],function(exports){
	var $ = layui.$,
		larryms = layui.larryms,
		forms = layui.forms,
		cascade = layui.cascade;

	var test = cascade.render({
		elem:'#city',
		data:'../../larryms/data/demo/city.json',
		tips:['请选择省（直辖市）','请选择市','请选择县（区）','请选择街道'],
		selected:[42,4205]
	});


	forms.on('submit(tags)',function(data){
		larryms.msg(JSON.stringify(data.field));
		return false;
	})

	exports('linkage',{});
});