//获取一个DIV的绝对坐标的功能函数,即使是非绝对定位,一样能获取到
function getElCoordinate(dom) {
	var t = dom.offsetTop;
	var l = dom.offsetLeft;
	dom=dom.offsetParent;
	while (dom) {
		t += dom.offsetTop;
		l += dom.offsetLeft;
	dom=dom.offsetParent;
    }
    return {
        top: t,
		left: l
	};
}
//兼容各种浏览器的,获取鼠标真实位置
function mousePosition(ev){
	if(!ev) ev=window.event;
		if(ev.pageX || ev.pageY){
				return {x:ev.pageX, y:ev.pageY};
		}
		return {
				x:ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
				y:ev.clientY + document.documentElement.scrollTop  - document.body.clientTop
		};
}
//给DATE类添加一个格式化输出字串的方法
Date.prototype.format = function(format)
{
	 var o = {
			"M+" : this.getMonth()+1, //month
			"d+" : this.getDate(),    //day
			"h+" : this.getHours(),   //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second  ‘
		//quarter
			"q+" : Math.floor((this.getMonth()+3)/3),
			"S" : this.getMilliseconds() //millisecond
	 };;
	 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length==1 ? o[k] :
					("00"+ o[k]).substr((""+ o[k]).length));
		return format;
}
//JS]根据格式字符串分析日期（MM与自动匹配两位的09和一位的9）
//alert(getDateFromFormat(sDate,sFormat));
function getDateFromFormat(dateString,formatString){
	var regDate = /\d+/g;
	var regFormat = /[YyMmdHhSs]+/g;
	var dateMatches = dateString.match(regDate);
	var formatmatches = formatString.match(regFormat);
	var date = new Date();
	for(var i=0;i<dateMatches.length;i++){
		switch(formatmatches[i].substring(0,1)){
			case 'Y':
			case 'y':
				date.setFullYear(parseInt(dateMatches[i]));break;
			case 'M':
				date.setMonth(parseInt(dateMatches[i])-1);break;
			case 'd':
				date.setDate(parseInt(dateMatches[i]));break;
			case 'H':
			case 'h':
				date.setHours(parseInt(dateMatches[i]));break;
			case 'm':
				date.setMinutes(parseInt(dateMatches[i]));break;
			case 's':
				date.setSeconds(parseInt(dateMatches[i]));break;
		}
	}
	return date;
}
//货币分析成浮点数
//alert(parseCurrency("￥1,900,000.12"));
function parseCurrency(currentString){
	var regParser = /[\d\.]+/g;
	var matches = currentString.match(regParser);
	var result = '';
	var dot = false;
	for(var i=0;i<matches.length;i++){
		var temp = matches[i];
		if(temp =='.'){
			if(dot) continue;
		}
		result += temp;
	}
	return parseFloat(result);
}

//将颜色格式转换为RGB格式，并附加上透明度
function brgba(hex, opacity) {
		if( ! /#?\d+/g.test(hex) ) return hex; //如果是“red”格式的颜色值，则不转换。//正则错误，参考后面的PS内容
		var h = hex.charAt(0) == "#" ? hex.substring(1) : hex,
				r = parseInt(h.substring(0,2),16),
				g = parseInt(h.substring(2,4),16),
				b = parseInt(h.substring(4,6),16),
				a = opacity;
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
function change_input(obj){
	var opt = $(obj).find("option:selected");//获取选中的option
	var input_key = $(obj).val();
	var input_type = opt.attr("input_type");
    $(obj).parents(".con-select").find(".form_value").replaceWith('<input type="text" onchange="$(\'#flow_node_name\').blur();" class="form-text form_value" style="width:130px;">');
    var $input = $(obj).parents(".con-select").find(".form_value");
    $input.css('cursor','default').removeAttr('onclick').removeAttr('readonly').removeAttr('placeholder');
	var arr = ["NumberField","EquationField","other","StatisticsField",'CascadeDropDown','MEMBERCustomerField','DEPTCustomerField','CRMCustomerField','boolean'];
	if(arr.indexOf(input_type)==-1){
		$(obj).parents(".con-select").find(".form_oper").html('<option value="1">等于</option><option value="2">不等于</option>');
	}else if(input_type == 'other'||input_type == 'CascadeDropDown'||input_type == 'MEMBERCustomerField'||input_type == 'DEPTCustomerField'||input_type == 'CRMCustomerField'||input_type == 'boolean'){
		$(obj).parents(".con-select").find(".form_oper").html('<option value="9">包含</option>');//<option value="10">不包含</option>
		//是提单人和提单人部门的条件处理
		if(input_key == "creatorUserIds"|| input_type == 'MEMBERCustomerField'){
			$input.css('cursor','pointer').attr('id','k'+uuid().replace(/-/g,'')).attr('onclick','getUser(this.id)').attr('readonly',true).attr('placeholder','请选择');
		}else if(input_key == "creatorDpIds" || input_type == "DEPTCustomerField"){
			$input.css('cursor','pointer').attr('id','k'+uuid().replace(/-/g,'')).attr('onclick','chooseNode(this.id)').attr('readonly',true).attr('placeholder','请选择');
		}else if(input_key == "createPosition"){
			$(obj).parents(".con-select").find(".form_oper").html('<option value="1">等于</option><option value="2">不等于</option>');
		}else if(input_type == 'CascadeDropDown'){
			//add_choicesId();
			$input.css('cursor','pointer').attr('onclick','showDialogbox(\''+input_key+'\',this)').attr('readonly',true).attr('placeholder','请选择');
		}else if(input_type == 'CRMCustomerField'){
			$input.css('cursor','pointer').attr('id','k'+uuid().replace(/-/g,'')).attr('onclick','chooseClient(this.id)').attr('readonly',true).attr('placeholder','请选择');
		}else if(input_type == 'boolean'){
            $(obj).parents(".con-select").find(".form_oper").html('<option value="11">超额</option>');
            $(obj).parents(".con-select").find(".form_value").replaceWith('<select class="form_value" onchange="$(\'#flow_node_name\').blur();" style=" vertical-align: middle; width: 140px;"><option value="1">是</option><option value="0">否</option></select>')
		}
	}else{
		$(obj).parents(".con-select").find(".form_oper").html('<option value="3">大于</option><option value="4">大于等于</option><option value="5">等于</option><option value="6">不等于</option><option value="7">小于等于</option><option value="8">小于</option>');
	}

}
function showDialogbox(id,obj){
	//字段id
	var choices = '';
	var formString = _formString;
	for(var i = 0;i<formString.length;i++){
		if(id == formString[i]._id){
			choices = formString[i].choices;
			break;
		}
	}
	add_dialog_box(choices,obj)
}
function add_dialog_box(choices,obj){

	var $dialog = $('<div class="pop_wrap7" style="width: 600px; display: block;">'
		+'<div class="SS_tit"> <span>选择选项</span><i class="btnclose">×</i> </div>'
		+'<div class="pop_wrap6_main">'
		+'<div class="select_main_group clearfix">'
		+'<div class="select_list_l">'
		+'<div style="color:#999;padding: 10px 0px 5px 30px;">一级下拉框内容</div>'
		+'<ul class="select_list">'
		//+'<li class="clearfix"><span class="groupName">类别三</span></li>'
		+'</ul>'
		+'</div>'
		+'<div class="select_list_r">'
		+'<div class="select_list_r_top c999 clearfix" style="padding-left:10px;"> 二级下拉框内容</div>'
		+'<ul class="select_list">'
		//+'<li class="clearfix"><span class="userName">接口表单测试</span><input class="ipt-cb" type="checkbox"></li>'
		+'</ul>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'<div class="SS_btn" style="margin-top:0;"> <input type="button" value="确定" class="btn orangeBtn twoBtn mr10 mb0"> </div>'
		+'</div>');
	$dialog.find('.btnclose').click(function(){
		window.top.$('#overlayDiv').hide();
		$dialog.remove();
	});
	$dialog.find('.SS_btn input').click(function(){
		//确定按钮
		//alert('aaaa');
		var _id = $('.select_list_l .select_list .on',$dialog).attr('attrid');
		var isCheck = [];
		$('.select_list_r .select_list',$dialog).find('[type=checkbox]:checked').each(function(i,ele){
			isCheck.push($(ele).val());
		});
		$(obj).data('info',{'_id':_id,'value':isCheck});
		$(obj).val(isCheck.join(','));
		$('#flow_node_name').blur();
		window.top.$('#overlayDiv').hide();
		$dialog.remove();
	});
	var $ul = $('<ul>');
	for(var i = 0;i<choices.length;i++){
		var $li = $('<li class="clearfix" attrid="'+choices[i]._id+'"><span class="groupName">'+choices[i].value+'</span></li>');
		$li.data('info',choices[i].sub_choices);
		$ul.append($li);
	}
	$('li',$ul).click(function(){
		$(this).parents().find('li').removeClass('on');
		$(this).addClass('on');
		var sub_choices = $(this).data('info');
		var $subUl = $('<ul>');
		if(sub_choices){
			for(var j = 0;j<sub_choices.length;j++){
				var $subLi = $('<li class="clearfix"><span class="userName">'+sub_choices[j].value+'</span><input value="'+sub_choices[j].value+'" class="ipt-cb" type="checkbox"></li>');;
				$subUl.append($subLi);
			}
			$('.select_list_r .select_list',$dialog).html($subUl.children('li').clone(true));
		}
	});
	$('.select_list_l .select_list',$dialog).html($ul.children('li').clone(true));
	if($(obj).val() == ''){
		$('.select_list_l .select_list',$dialog).find('li:eq(0)').click();
	}else{
		var data = $(obj).data('info');
		if(data){
			$('[attrid='+data._id+']',$dialog).click();
			var value = data.value;
			setTimeout(function(){
				for(var i = 0;i<value.length;i++){
					$('[value='+value[i]+']',$dialog).attr('checked',true);
				}
			},200);
		}
	}
	window.top.$('#overlayDiv').show();
	window.top.$('body').append($dialog);
}
function del_form_rule(obj){
	$(obj).parent().remove();
	$('#flow_node_name').blur();
}
function del_form_cond(obj){
	$(obj).parent().parent().remove();
	$('#flow_node_name').blur();
}
//检测流程图
function check_step2(){
	var data = demo.exportData();
	if(!check_process('start_node',data)){
		_alert("提示信息",'流程设置有误，请检查流程节点的连线是否正确');
		return false;
	}
	if(check_end_node(data)){
		_alert("提示信息",'流程设置有误，结束节点不允许再有下一节点');
		return false;
	}
	if(!check_handle(data)){
		return false;
	}
	return true;
}
function check_handle(data){
	var nodes = data.nodes;
	for(i in nodes){
		var other = nodes[i].other;
		var nodeName = nodes[i].nodeName;
		if(other.is_lading== '2'){
			var handle_accounts = other.handle_accounts;
			var groupIds = other.groupIds;
			var tagList = other.tagList;
			if(handle_accounts.length==0 && groupIds.length==0&&tagList.length == 0){
				_alert("提示信息",'“'+nodeName+'”节点处理人不能为空');
				return false;
			}
		}
		if(other.is_lading== '5'){
			var flowNodeAuditAppointSetList = other.flowNodeAuditAppointSetList;
			if(flowNodeAuditAppointSetList.length > 0 && flowNodeAuditAppointSetList[0].appointType == 3  && flowNodeAuditAppointSetList[0].appointNodeId == '' ){
				_alert("提示信息",'节点“'+nodeName+'”请选择特定节点');
				return false;
			}
		}
	}
	return true;
}
function check_end_node(data){
	var next_node = false;
	for(var i in data['lines']){
		var line = data['lines'][i];
		if(line['from']=='end_node'){
			next_node =  true;
			break;
		}else{
			next_node =  false;
		}
	}
	return next_node;
}
/**
 * 检查流程是否正确
 */
function check_process(node_name,data){
	//标示是否有下级节点
	var next_node = false;
	for(var i in data['lines']){
		var line = data['lines'][i];
		if(line['from']==node_name){
			next_node = true;
			if(line["is_road"]==1){
				continue;
			}
			line["is_road"] = 1;
			if(!check_process(line['to'],data)){
				next_node = false;
				break;
			}
		}
	}
	if(next_node){
		return true;
	}else{
		if(node_name=='end_node'){
			return true;
		}else{
			return false;
		}
	}
}
//添加条件流转
function add_form_condition(){
	$('#condition_content').append($('.condition_none').html());
}
function add_form_rule(obj){

	var form_html = get_form_html();
	//规则模板
	var rule_html =
    '<div class="con-select">'
	    +'<select class="form_rule" onchange="change_input(this);$(\'#flow_node_name\').blur();" style="width:120px;">'
	    	+ form_html
	    +'</select>'
	    +'<select class="form_oper" style="width:100px;" onchange="$(\'#flow_node_name\').blur();" >'
	    +'</select>'
	    +'<input type="text" class="form-text form_value" onchange="$(\'#flow_node_name\').blur();" style="width:130px;">'
	    +'<div onclick="del_form_rule(this);" class="con-close1">×</div>'
	+'</div>';
    $(obj).parent().before(rule_html);

}
//返回判断条件控件
function get_form_html(){
	 //字段判断条件初始化
	var form_html = '<option value="0">请选择条件</option>'+'<option value="creatorDpIds" input_type="other">提单人部门</option><option value="creatorUserIds" input_type="other">提单人</option><option value="createPosition" input_type="other">职位</option>';
	if(fieldList!=''){
		for(var i in fieldList){
			var data = fieldList[i];
			var type = data.itemType;//"Fields::CascadeDropDown"
			var arr = ["TextField","TextArea","RadioButton","NumberField","DropDown","EmailField","TelephoneField","MobileField","DateField","DateTimeField","RatingField","EquationField","StatisticsField","CascadeDropDown","MEMBERCustomerField",'DEPTCustomerField','CRMCustomerField','boolean'];//
			if(arr.indexOf(type)!=-1){
				form_html += '<option value="'+data.itemKey+'" input_type="'+type+'">'+data.itemName+'</option>';
			}
		}
	}
	return form_html;
}
var nodeFieldInfoMap = {};
//给每一个节点添加一个节点的字段可编辑可见信息
function getFenzhiJsonInfo(list,flowId,nodeId,nodeProperty){
	var backJsonObj=[];
	if(list.length>0){
    	for(var i=0;i<list.length;i++){
    		 var jsonObj = {};
    		 jsonObj["fieldKey"] = list[i].itemKey;
    		 jsonObj["flowId"] = flowId;
    		 jsonObj["nodeId"] = nodeId;
    		 jsonObj["itemType"] = list[i].itemType;
    		 jsonObj["label"] = list[i].itemName.replace(/\s/g, "");//清掉字段名称所有的空格不然解析json会报错

    		 jsonObj["canShow"] =true;
			 jsonObj["canEdit"] =nodeProperty=="0"?true:false;

    		 backJsonObj.push(jsonObj);
    	}
    }
	return backJsonObj;
}
//根据字段列表更新已经有的可编辑可见信息
function update_fenzhiInfo(fieldList){
	var jsonData = demo.exportData();
	$('.item_task_node').each(function(index,element){
		var nodeInfo =  $(element).data('nodeInfo');
		var flowId = jsonData.flowId;
		var nodeId = jsonData.nodes[this.id].nodeId;
		var backNodeInfo = [];
		for(var i=0;i<fieldList.length;i++){
			//遍历节点的字段的可编辑可见信息(旧的信息)
			var flag = false;
			$.each(nodeInfo,function(k,value){
				if(value.fieldKey == fieldList[i].itemKey){
					flag = true;
					value.label = fieldList[i].itemName;
					backNodeInfo.push(value);
				}
			});
			if(flag)continue;
			var jsonObj = {};
    		jsonObj["fieldKey"] = fieldList[i].itemKey;
    		jsonObj["flowId"] = flowId;
    		jsonObj["nodeId"] = nodeId;
    		jsonObj["itemType"] = fieldList[i].itemType;
    		jsonObj["label"] = fieldList[i].itemName.replace(/\s/g, "");//清掉字段名称所有的空格不然解析json会报错

    		jsonObj["canShow"] =true;
			jsonObj["canEdit"] =element.id=="start_node"?true:false;
    		backNodeInfo.push(jsonObj);

		}
		$(element).data('nodeInfo',backNodeInfo);
	});
}

//选择审核用户
function getUser(num) {
	if(typeof num =='object')num = "";
    var top=(window.screen.height-630)/2;
    var left=(window.screen.width-580)/2;
    window.open(baseURL+"/manager/include/flow_choose_user_main.jsp?num="+num, '节点审批人','left='+left+',top='+top+',height=500, width=820, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=yes,directories=no,menubar=no');
}
//选择审核用户组
function getGroup(num) {
	if(typeof num =='object')num = "";
    var top=(window.screen.height-630)/2;
    var left=(window.screen.width-580)/2;
    window.open(baseURL+"/manager/include/flow_choose_usergroup_main.jsp?num="+num, '节点审批人','left='+left+',top='+top+',height=500, width=820, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=yes,directories=no,menubar=no');
}
function chooseNode(num) {
    var top=(window.screen.height-630)/2;
    var left=(window.screen.width-460)/2;
    window.open(baseURL+"/manager/include/form_chooseNoods.jsp?num="+num, '组织节点选择', 'left='+left+',top='+top+',height=600, width=460, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
}
function chooseClient(num){
	var top=(window.screen.height-630)/2;
	var left=(window.screen.width-460)/2;
	window.open(baseURL+"/manager/include/flow_choose_crm.jsp?num="+num, 'newwindow', 'left='+left+',top='+top+',height=500, width=820, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=yes,directories=no,menubar=no');
}
function saveOrder() {
	$('#flow_node_name').blur();
}
$(function(){
	//加载underscore.webapp\js\do1\common\underscore-min.js
	if(!window._){
		$.getScript(baseURL+"/js/do1/common/underscore-min.js",function(){  //加载test.js,成功后，并执行回调函数
		});
	}
	//防止用户超时
	continueSession();
	//不是超表的分支流程隐藏人员控件
	if(agentCode!='form'&&!window._formString){
		$('#personnel_control').hide();
	}
	$('#flow_fenzhi_node').on('click','[name=is_lading]',function(){
		var value = $(this).val();
		if(value!=3){
			$('[name=isQuery]').attr('checked',false).attr('disabled','disabled');
			$('#node_deptList').data('deptList',[]);
			makeSelectOutput('select_node_dept_div');
			$('#dept_approval').hide();
			if($('[name=isChoice]')[0].checked)$('input[name=isChoice1]').attr('checked',false).removeAttr('disabled');
		}else{
			//去掉默认全选
			$('input[name=isChoice1]').attr('checked',false).attr('disabled','disabled');
			$('[name=isQuery]').removeAttr('disabled');
		}
		//清除选中的人员 1.提单人 2.选择处理人  3.部门负责人
		if(value!=2){
			//清空选人
			$('#node_personList').data('personList',[]);
			makeSelectOutput('select_node_person');
			$('.form-node-set').hide();
		}else{
			$('.form-node-set').show();
		}
		if(value==4){
			$('#personnel_list').show();
		}else{
			$('#personnel_list').hide();
		}
		if(value == 5){
			$('#free_pick').show();
			$('[name="isChoice"]').attr('disabled',true).attr('checked',false);
		}else{
			$('#free_pick').hide();
			$('[name="isChoice"]').attr('disabled',false);
		}
		$('#flow_node_name').blur();
	});
	$("#condition_content").dragsort({ dragSelector: ".edit-node-condition", dragBetween: false,dragEnd: saveOrder,scrollSpeed:5});//拖动
	$('#condition_content').on('mouseup mousedown','.con-select,.con-close,.next_nodes,.con-add',function(e){
		e.stopPropagation();
	});
	$('[name="isQuery"]').on('click',function(){
		if($(this)[0].checked == true){
			$('#dept_approval').show();
		}else{
			$('#dept_approval').hide();
		}
		$('#flow_node_name').blur();
	});
	//时效的点击事件绑定
	$('[name="isTimeSet"]').on('click',function(){
		if($(this)[0].checked == true){
			$('#isTimeout').show();
		}else{
			$('#isTimeout').hide();
		}
		$('#flow_node_name').blur();
	});
	$('[name="invalidType"]').on('click',function(){
		if($(this).val() == 1){
			$('#message_content').show();
			$('#node_content').hide();
		}else{
			$('#message_content').hide();
			$('#node_content').show();
		}
		$('#flow_node_name').blur();
	});
	wxqyhConfig.ready(function(){
		var $isloading = $('[name=is_lading][value="4"]');
		if(!isVipGold(interfaceCode.INTERFACE_CODE_FORM)){
			$isloading.attr('disabled','disabled').next('a').show();
		}else{
			$isloading.next('a').hide();
		}
	});
});
//初始化选人
function reload_Selection(){
	SelectionPlugIn=new selectionPlugIn();
	SelectionPlugIn.deptinit();
	SelectionPlugIn.tagInit();
	SelectionPlugIn.searchUserDept("searchCreator","2");
}
//手写签名金卡和老银卡用户能用
function checkIsGold(e){
	if(!isVipGold(interfaceCode.INTERFACE_CODE_FORM)){
		if(!(isVipSilver()&&isOldUserVip())){
			e.preventDefault();
			_alertGoldVip('');
		}
	}
}
function get_member_list(){
	var formString =_formString,memberList = [];
	if(formString){
		if(formString.length>0){
			for(var i=0;i<formString.length;i++){
				//"Fields::MEMBERCustomerField"
				if(formString[i]._type =="Fields::MEMBERCustomerField"){
					memberList.push({
						_id:formString[i]._id,
						_type:formString[i]._type,
						label:formString[i].label
					});
				}
			}
		}

	}
	if(memberList.length>0){
		show_dialog(memberList);
	}else{
		_alert('提示','请在【表单设计】中，增加“通讯录成员”字段');
	}
	function show_dialog(memberList){
		var $list = $('#personnel_list'),$name = $('#flow_node_name'),oldData = $list.data('memberData');
		var $dialog = $('<div class="pop_wrap7" style="width: 480px; display: block;">'
			+'<div class="SS_tit"> <span> 选择人员控件</span><i class="btnclose">×</i> </div>'
			+'<div class="pop_wrap6_main clearfix">'
			+'<div class="select_list_r mt20" style="width:100%;">'
				//+'<ul class="select_list">'
				//+'<li class="clearfix"><span>二级选项1</span><input value="二级选项1" class="ipt-cb" type="checkbox"></li>'
				//+'<li class="clearfix"><span>二级选项2</span><input value="二级选项2" class="ipt-cb" type="checkbox"></li>'
				//+'</ul>'
			+'</div>'
			+'</div>'
			+'<div class="SS_btn" style="margin-top:0;"> <input type="button" value="确定" class="btn orangeBtn twoBtn mr10 mb0"></div>'
			+'</div>');
		var $ul = $('<ul class="select_list"></ul>');
		for(var i=0;i<memberList.length;i++){
			$ul.append($('<li class="clearfix"><span>'+memberList[i].label+'</span><input id="ko'+memberList[i]._id+'" class="ipt-cb" type="checkbox"></li>').data('memberData',memberList[i]));
		}
		if(oldData){
			$.each(oldData,function(i,val){
				$('#ko'+val._id,$ul).attr('checked','checked');
			});
		}
		$('input',$ul).on('click',function(e){
			if($(this).is(':checked')&&$ul.find('li>input:checked').length==6){
				_top_alert('只支持选择 5 个人员控件',false);
				e.preventDefault();
			}
		});
		$dialog.find('.select_list_r').append($ul);
		$dialog.find('.btnclose').click(function(){
			window.top.$('#overlayDiv').hide();
			$dialog.remove();
		});
		$dialog.find('.SS_btn input').click(function(){
			var memberData = [];
			$dialog.find('.select_list li>input:checked').parent('li').each(function(){
				memberData.push($(this).data('memberData'));
			});
			$list.data('memberData',memberData);
			show_member_list($list,$name);
			$name.blur();
			$dialog.find('.btnclose').click();
		});
		window.top.$('#overlayDiv').show();
		window.top.$('body').append($dialog);

	}
}

function show_member_list(obj,$name){
	var data = $(obj).data('memberData');
	$('div',obj).html('');
	if(data){
		$.each(data,function(i,val){
			$('div',obj).append($('<span class="span-item"><span>'+val.label+'</span><span class="close">×</span></span>').data('memberData',val));
		});
		$(obj).on('click','.close',function(){
			$(this).parent().remove();
			var memberData = [];
			$(obj).find('.span-item').each(function(i,ele){
				memberData.push($(ele).data('memberData'));
			});
			$(obj).data('memberData',memberData);
			$name.blur();
		})
	}
}
//自由选择
function add_appoint(){
	var $flow_node_name = $('#flow_node_name');
	var $free_pick = $('#free_pick');//<span class="span-item"><span>未命名</span><span class="close">×</span></span>
	var selectData = $free_pick.data('pointVoInfo');
	 //能够选择的节点
	var demo_node = demo.getUpNodes(demo.$focus);
	var nodeData = _.pick(demo.$nodeData,demo_node);

	var $dialog = $('<div class="pop_wrap7" style="width: 480px; display: block;">'
		+'<div class="SS_tit"> <span> 选择节点</span><i class="btnclose">×</i> </div>'
		+'<div class="pop_wrap6_main clearfix">'
		+'<div class="select_list_r mt20" style="width:100%;">'
			//+'<ul class="select_list">'
			//+'<li class="clearfix"><label class="block"><span>二级选项1</span><input value="二级选项1" name="appointNode" class="ipt-cb" type="radio"></label></li>'
			//+'<li class="clearfix"><label class="block"><span>二级选项2</span><input value="二级选项2" name="appointNode" class="ipt-cb" type="radio"></label></li>'
			//+'</ul>'
		+'</div>'
		+'</div>'
		+'<div class="SS_btn" style="margin-top:0;"> <input type="button" value="确定" class="btn orangeBtn twoBtn mr10 mb0"></div>'
		+'</div>');
	var $ul = $('<ul class="select_list"></ul>');
	$.each(nodeData,function(i,item){
		var $li = $('<li class="clearfix"><label class="block"><span>'+item.nodeName+'</span><input value="'+item.nodeId+'" name="appointNode" class="ipt-cb" type="checkbox"></label></li>').data('info',item);;
		$ul.append($li);
	});
	$.each(selectData,function(i,e){
		$ul.find('input[value='+e.appointNodeId+']').attr('checked',true);
	});

	$dialog.find('.select_list_r').append($ul);
	$dialog.find('.btnclose').click(function(){
		window.top.$('#overlayDiv').hide();
		$dialog.remove();
	});
	$dialog.find('.SS_btn input').click(function(){
		var $li = $ul.find('[name="appointNode"]:checked').parents('li');
		var item = $li.eq(0).data('info');
		if(!item){_top_alert('请选择节点',false);return;}
		var pointVoInfo = [];
		$li.each(function(i,e){
			var item = $(e).data('info');
			pointVoInfo.push({
				appointType:'3',
				appointNodeId:item.nodeId,
				appointNodeName:item.nodeName
			})
		});
		render_appoint_node(pointVoInfo,$free_pick)
		$flow_node_name.blur();
		$dialog.find('.btnclose').click();
	});
	window.top.$('#overlayDiv').show();
	window.top.$('body').append($dialog);
}
function render_appoint_node(pointVoInfo,$free_pick){
	if(pointVoInfo.length == 0){
		pointVoInfo = [{
			appointType:'2',
			appointNodeId:'',
			appointNodeName:''
		}]
	}
	var appointType = pointVoInfo[0].appointType;
	$('input[name=appointType][value='+appointType+']').attr('checked',true);

	if(appointType == 3){
		$('#free_pick_node').show();
	}else{
		$('#free_pick_node').hide();
	}
	$free_pick.data('pointVoInfo',pointVoInfo);
	if(pointVoInfo[0].appointNodeName){
		$free_pick.find('.pick-node').html('');
		$.each(pointVoInfo,function(i,e){
			var $item = $('<span class="span-item"><span>'+e.appointNodeName+'</span><span class="close">×</span></span>').data('info',e);
			$free_pick.find('.pick-node').append($item);
		});
	}else{
		$free_pick.find('.pick-node').html('');
	}
	$free_pick.find('.close').click(function(){
		$(this).parents('.span-item').remove();
		var voInfo = [];
		$('.pick-node').find('.span-item').each(function(i,e){
			voInfo.push($(e).data('info'));
		});
		if(voInfo.length == 0){
			voInfo = [{
				appointType:'3',
				appointNodeId:'',
				appointNodeName:''
			}];
		}
		$free_pick.data('pointVoInfo',voInfo);
		$('#flow_node_name').blur();
	});
	$('input[name=appointType]').unbind('change').on('change',function(){
		//自由选择
		if($(this).val() == 3){
			$('#free_pick_node').show();
		}else{
			$('#free_pick_node').hide();
		}
		var voInfo = [{
			appointType:$(this).val(),
			appointNodeId:'',
			appointNodeName:''
		}]
		$free_pick.data('pointVoInfo',voInfo);
		$('#flow_node_name').blur();
	});

}


