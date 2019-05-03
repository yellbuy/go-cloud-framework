function FixedFlow(bgDiv){
	this.$bgDiv = bgDiv;
	this.nodeData=[];
	this.$nodeDom = {};
	this.$max=0;
	//this.$bgDiv.children(".GooFlow_work").append(this.$workArea);
	this.initBgDiv();
	this.$workArea = this.$bgDiv.find('.fixedFlow_content');
	this.initWorkForNode();
	this.save_node = function(This){
		var $node = this.$workArea.find('.fixedFlow_title.node_focus').parents('li');
		//  如果没有编辑节点
		if(!$node.length)return;
		var nodeInfo = {};
		nodeInfo['nodeName'] = $('#flow_node_name').val();
		//节点处理人列表
		var personList = $('#node_personList').data('personList');
		var tagList = $('#node_personList').data('tagList');
		var appoint_dept_ids = $('#node_deptList').data('deptList');
		var skip_dept_ids = $('#unnode_deptList').data('deptList');
		var notify_user_list = [];
		//保存节点类型
		nodeInfo['nodeType'] = $('input[name=nodeType]:checked').val();
		nodeInfo['isSign'] = $('input[name=isSign]')[0].checked?0:1;//开启会签
		nodeInfo['isChoice'] = $('input[name=isChoice]')[0].checked?2:1;//允许上一节点指定当前节点处理
		if($('input[name=isChoice1]')[0].checked){
			nodeInfo['isChoice'] = 0;
		}
		nodeInfo['isCanEnd'] = $('input[name=isCanEnd]')[0].checked?0:1;//允许结束流程
		nodeInfo['isSoter'] = $('input[name=isSoter]')[0].checked?1:0;//使用指纹验证
		nodeInfo['isUseHandWriteSign'] = $('input[name=isUseHandWriteSign]')[0].checked?1:0;//指纹
		nodeInfo['isUsePresetSign'] = $('input[name=isUsePresetSign]')[0].checked?1:0;//指纹
		nodeInfo['isAutomaticAudit'] = $('input[name=isAutomaticAudit]')[0].checked?1:0;//自动审批
		nodeInfo['isAddCountersign'] = $('input[name=isAddCountersign]')[0].checked?1:0;

		//按组织架构自动逐级审批
		nodeInfo['isQuery'] = $('input[name=isQuery]')[0].checked?1:0;
		//审批新加
		nodeInfo['isCreateFirst'] = $('input[name=isCreateFirst]:checked').val();
		nodeInfo['upAuditNum'] = $('input[name=upAuditNum]').val();
		nodeInfo['endLevelNum'] = $('input[name=endLevelNum]').val();
		nodeInfo['skipLevelNum'] = $('input[name=skipLevelNum]').val();
		nodeInfo['skip_dept_ids'] = skip_dept_ids;

		//处理人选项保存
		nodeInfo['isLading'] = $('input[name=is_lading]:checked').val();
		nodeInfo['personList'] = personList;//处理人
		nodeInfo['tagList'] = tagList;//标签
		nodeInfo['appoint_dept_ids'] = appoint_dept_ids;//部门数据
		nodeInfo['nodeGroupList'] = [];
		//节点指定处理人
		if(nodeInfo['isLading'] == 5 ){
			var pointVoInfo = $('#free_pick').data('pointVoInfo');
			nodeInfo['flowNodeAuditAppointSetList'] = pointVoInfo;
			//pointVoInfo['nodeId'] = '';
			//pointVoInfo['appointType'] = $('[name=appointType]:checked').val();;
			//pointVoInfo['appointNodeId'] = '';
		}else{
			nodeInfo['flowNodeAuditAppointSetList'] = [];
		}
		//保存时效的设置对象
		nodeInfo['isTimeSet'] = $('input[name=isTimeSet]')[0].checked?1:0;
		if(nodeInfo['isTimeSet'] == 1){
			var voInfo = {};
			nodeInfo['flowNodeTimeSetVO'] = voInfo;
			voInfo['waitTime'] = $('[name="waitTime"]').val();
            voInfo['waitDay'] = $('[name="waitDay"]').val();
            voInfo['waitMinute'] = $('[name="waitMinute"]').val();
			voInfo['message'] = $('[name="message"]').val();
			voInfo['invalidType'] =$('[name=invalidType]:checked').val();
			voInfo['returnNodeId'] = $('[name="returnNodeId"]').val();
		}else{
			nodeInfo['flowNodeTimeSetVO'] = {};
		}

		var oldNodeInfo = $node.data('nodeInfo');
		nodeInfo['id'] = oldNodeInfo.id;
		console.log(Object.getOwnPropertyNames(nodeInfo).length+'属性')
		$node.data('nodeInfo',nodeInfo);
		this.$workArea.find('.fixedFlow_title.node_focus').children(':eq(0)').html($('#flow_node_name').val());
	};

}
FixedFlow.prototype = {
	initBgDiv:function(){
		this.$bgDiv.prepend('<div class="fixedFlow"><li style="padding-bottom:0px"><div class="fixedFlow_title1"><span>填写/提交表单</span></div></li><ul id="dragsort" class="fixedFlow_content"></ul></div>');
	},
	addNode:function(i,json){
		//兼容
		if(!json.isAddCountersign)json.isAddCountersign = 0;
		if(!json.isTimeSet)json.isTimeSet = 0;
		if(!json.appoint_dept_ids)json.appoint_dept_ids = [];
		if(!json.tagList)json.tagList = [];
		if(!json.flowNodeTimeSetVO)json.flowNodeTimeSetVO = {};
		if(!json.flowNodeAuditAppointSetList)json.flowNodeAuditAppointSetList = [];
		if(json.isUseHandWriteSign == undefined)json.isUseHandWriteSign = 0;
		if(json.isUsePresetSign  == undefined)json.isUsePresetSign = 0;


		if(json.isCreateFirst  == undefined)json.isCreateFirst = 1;
		if(json.upAuditNum  == undefined)json.upAuditNum = '';
		if(json.endLevelNum  == undefined)json.endLevelNum = '';
		if(json.skip_dept_ids  == undefined)json.skip_dept_ids = [];
		if(json.skipLevelNum  == undefined)json.skipLevelNum = '';

		var $nodeDom = $('<li><div class="fixedFlow_title"><span>'+json.nodeName+'</span><i class="fixedFlow_drag"><div></div><div></div><div></div></i><div class="'+(i==0?'fixedFlow_add">+':'fixedFlow_del">-')+'</div></div></li>');
		$nodeDom.data('nodeInfo',json);
		this.$workArea.append($nodeDom);
	},
	//根据节点id删除时效的指定节点为id的数据
	delNode:function(id){
		var data = this.exportData();
		for(var i = 0;i<data.length;i++){
			var flowNodeTimeSetVO = data[i].flowNodeTimeSetVO, isTimeSet = data[i].isTimeSet;
			if(isTimeSet == 0){
				continue;
			}else{
				if(id==flowNodeTimeSetVO.returnNodeId){
					//节点信息修改
					flowNodeTimeSetVO.returnNodeId = '';
					this.$workArea.children('li').eq(i).data('nodeInfo',data[i]);
				}
			}
		}
	},
	//载入一组数据
	loadData:function(data){
		this.$max = data.nodes.length;
		for(var i=0;i < data.nodes.length;i++){

			this.addNode(i,data.nodes[i]);
		}
		this.$workArea.find('.fixedFlow_title:eq(0)').click();
		$('#fixedFlow_info').show();
		$("#dragsort").dragsort({ dragSelector: ".fixedFlow_drag", dragBetween: false,dragEnd: saveOrder1, placeHolderTemplate: "<li></li>",scrollSpeed:5});//拖动
	},
	exportData:function(flag){
		var data = [];
		if(flag){
			var index = this.$workArea.find('.fixedFlow_title.node_focus').parents('li').index();
			this.$workArea.find('li').slice(0, index).each(function(i,ele){
				data.push($(ele).data('nodeInfo'));
			});
			return data;
		}
		var $items = this.$workArea.find('li');
		$items.each(function(i,ele){
			var info = $(ele).data('nodeInfo')||{};
			//赋值上一节点的id 获取上一节点的id
			var upId = '';

			if(info.isLading == 5 && info.flowNodeAuditAppointSetList.length>0 && info.flowNodeAuditAppointSetList[0].appointType == 2 ){
				if(i > 0){
					var upData = $items.eq(i-1).data('nodeInfo');
					upId = upData.id;
				}
				info.flowNodeAuditAppointSetList[0].appointNodeId = upId;
			}
			data.push(info);
		});
		this.nodeData = data;
		return data;
	},
	//获取节点的id和名字
	getNodeInfoTemp:function(id){
		var data = this.exportData();
		var temp = '<option value="">填写/提交表单</option>';
		for(var i=0; i<data.length; i++){
			if(id == data[i].id)continue;
			temp += '<option value="'+data[i].id+'">'+data[i].nodeName+'</option>';
		}
		temp+='<option value="over_node">结束节点</option>';
		return temp;
	},
	//绑定事件
	initWorkForNode:function(){
		this.$workArea.delegate('.fixedFlow_title','click',{inthis:this},function(e){
			var This = e.data.inthis;
			This.save_node();
			var $node_focus = This.$workArea.find('.fixedFlow_title.node_focus');
			var $nodeP = $(this).parents('li');
			var nodeInfo = $nodeP.data('nodeInfo');
			if(!nodeInfo){
				return;
            }
            console.log(nodeInfo);
			$node_focus.removeClass('node_focus');
			$(this).addClass('node_focus');
			$('#flow_node_name').val(nodeInfo.nodeName);
			$('#fixedFlow_step').html($nodeP.index()+1);
			var nodeType = nodeInfo.nodeType;
			var is_lading = nodeInfo.isLading;
			var personList = nodeInfo.personList;
			var tagList = nodeInfo.tagList;

            $('#node_personList').data('personList',personList).data('tagList',tagList);
            makeSelectOutput('select_node_person',personList,null,tagList);
            console.log(tagList);
			if(tagList.length>0){
				$('.tag-tips').show();
			}else{
				$('.tag-tips').hide();
			}
			//选择处理人
			if(is_lading==3){
				$('input[name=isChoice1]').attr('checked',false).attr('disabled','disabled');
				$('[name=isQuery]').removeAttr('disabled');
			}else{
				$('[name=isQuery]').attr('checked',false).attr('disabled','disabled');
			}
			//清除选中的人员
			if(is_lading != 2){
				$('.form-node-set').hide();
			}else{
				$('.form-node-set').show();
			}
			if(is_lading == 5){
				$('#free_pick').show();
				$('[name="isChoice"]').attr('disabled',true);
			}else{
				$('#free_pick').hide();
				$('[name="isChoice"]').attr('disabled',false);
			}
			//自由选择节点,自由选择值初始化
			var flowNodeAuditAppointSetList = nodeInfo.flowNodeAuditAppointSetList;
			render_appoint_node(flowNodeAuditAppointSetList,$('#free_pick'));
			var isSign = nodeInfo.isSign==0?true:false;
			var isChoice = nodeInfo.isChoice==0||nodeInfo.isChoice==2?true:false;
			//默认全选
			if(nodeInfo.isChoice==0&&is_lading!=3){
				$('input[name=isChoice1]').attr('checked',isChoice).removeAttr('disabled');
			}else if(nodeInfo.isChoice==2&&is_lading!=3){
				$('input[name=isChoice1]').attr('checked',false).removeAttr('disabled');
			}else if(nodeInfo.isChoice==1){
				$('input[name=isChoice1]').attr('checked',false).attr('disabled','disabled');
			}
			var isCanEnd = nodeInfo.isCanEnd==0?true:false;
			var isQuery = nodeInfo.isQuery==1?true:false;
			var isSoter = nodeInfo.isSoter==1?true:false;
			var isUseHandWriteSign = nodeInfo.isUseHandWriteSign==1?true:false;
			var isUsePresetSign = nodeInfo.isUsePresetSign==1?true:false;
			var isAutomaticAudit = nodeInfo.isAutomaticAudit==1?true:false;
			var isAddCountersign = nodeInfo.isAddCountersign ==1?true:false;
			$('input[name=nodeType][value='+nodeType+']').prop('checked',true);
			// $('input[name=is_lading]').removeAttr("checked");
            $('input[name=is_lading][value='+is_lading+']').prop('checked',true);
			$('input[name=isChoice]').attr('checked',isChoice);
			$('input[name=isSign]').attr('checked',isSign);
			$('input[name=isCanEnd]').attr('checked',isCanEnd);
			$('input[name=isQuery]').attr('checked',isQuery);
			$('input[name=isSoter]').attr('checked',isSoter);
			$('input[name=isUseHandWriteSign]').attr('checked',isUseHandWriteSign);
			$('input[name=isUsePresetSign]').attr('checked',isUsePresetSign);
			$('input[name=isAutomaticAudit]').attr('checked',isAutomaticAudit);
			$('input[name=isAddCountersign]').attr('checked',isAddCountersign);
			var appoint_dept_ids = nodeInfo.appoint_dept_ids;
			if(isQuery){
				$('#dept_approval').show();
			}else{
				$('#dept_approval').hide();
			}
			$('#node_deptList').data('deptList',appoint_dept_ids);
			makeSelectOutput('select_node_dept_div',[],appoint_dept_ids);
			//新加部门审批
			var skip_dept_ids = nodeInfo.skip_dept_ids;
			$('#unnode_deptList').data('deptList',skip_dept_ids);
			makeSelectOutput('skip_dept_ids',[],skip_dept_ids);

			var isCreateFirst = nodeInfo.isCreateFirst;
			var upAuditNum = nodeInfo.upAuditNum;
			var endLevelNum = nodeInfo.endLevelNum;
			var skipLevelNum = nodeInfo.skipLevelNum;
			isCreateFirst == '1'?$('[name=isCreateFirst]').eq(0).attr('checked',true):$('[name=isCreateFirst]').eq(1).attr('checked',true)
			$('[name=upAuditNum]').val(upAuditNum);
			$('[name=endLevelNum]').val(endLevelNum);
			$('[name=skipLevelNum]').val(skipLevelNum);

			//初始化时效设置
			var isTimeSet = nodeInfo.isTimeSet == 1? true: false;
			$('[name="isTimeSet"]').attr('checked',isTimeSet);
			isTimeSet?$('#isTimeout').show():$('#isTimeout').hide();

			var flowNodeTimeSetVO = nodeInfo.flowNodeTimeSetVO;
			var returnNodeId = flowNodeTimeSetVO.returnNodeId==undefined? '' : flowNodeTimeSetVO.returnNodeId;
			var invalidType = flowNodeTimeSetVO.invalidType==undefined? 1 : flowNodeTimeSetVO.invalidType;
			var waitTime = flowNodeTimeSetVO.waitTime==undefined?2 :flowNodeTimeSetVO.waitTime;
            var waitDay = flowNodeTimeSetVO.waitDay==undefined?0 :flowNodeTimeSetVO.waitDay;
            var waitMinute = flowNodeTimeSetVO.waitMinute==undefined?0 :flowNodeTimeSetVO.waitMinute;
			var message = flowNodeTimeSetVO.message==undefined?'' :flowNodeTimeSetVO.message;
			$('[name="returnNodeId"]').html(This.getNodeInfoTemp(nodeInfo.id)).val(returnNodeId).off().on('change',function(){
				save_node();
			});
			$('[name="waitTime"]').val(waitTime);
            $('[name="waitDay"]').val(waitDay);
            $('[name="waitMinute"]').val(waitMinute);
			$('[name="message"]').val(message);
			$('[name=invalidType]').eq(invalidType-1).attr('checked','checked');
			if(invalidType == 1){
				$('#message_content').show();
				$('#node_content').hide();
			}else{
				$('#message_content').hide();
				$('#node_content').show();
			}

			//保存数据
            $('#flow_node_name,textarea[name=message],input[name=waitDay],input[name=waitTime],input[name=waitMinute],input[name=upAuditNum],input[name=endLevelNum],input[name=skipLevelNum]').off('blur').on('blur',function(){
                var name = $(this).attr('name');
                if(name == 'waitTime'){
                    var value = $(this).val();
                    if(value<0||value.indexOf('.')!= -1){
                        // _alert('提示','时长只能设置为正整数，请重新设置');
                        $(this).val(0);
                    }
                    if(value>23){
                        $(this).val(23);
					}
                }
                if(name == 'waitDay'|| name == 'waitMinute'){
                    var value = $(this).val();
                    if(value<0||value.indexOf('.')!= -1){
                        //_alert('提示','值不能小于0，请重新设置');
                        $(this).val(0);
                    }
                    if( name == 'waitMinute'&&value>59){
						$(this).val(59);
					}
                }
                save_node();
            });

			$('input[name=isCreateFirst],input[name=isUseHandWriteSign],input[name=isUsePresetSign],input[name=isSoter],input[name=nodeType],input[name=isSign],input[name=isChoice],input[name=isChoice1],input[name=isCanEnd],input[name=isAutomaticAudit],input[name=isAddCountersign]').unbind('click').bind('click',save_node);
			function save_node(e){
				if($(this).attr('name')=='isChoice'){
					if($(this)[0].checked&&$('[name=is_lading]:checked').val() != '3'){
						$('input[name=isChoice1]').removeAttr('disabled');
					}else{
						$('input[name=isChoice1]').attr('checked',false).attr('disabled','disabled');
					}
				}

				This.save_node();
			}
		});
		this.$workArea.delegate('.fixedFlow_add','click',{inthis:this},function(e){
			e.stopPropagation();
			var This = e.data.inthis;
			var data = {
			"id": uuid(),
			"isAutomaticAudit": 0,
			"isCanEnd": "1",
			"isChoice": "1",
			"isLading": "2",
			"isQuery": "0",
			"isSign": "1",
			"isSoter": 0,
			"nodeGroupList": [],
			"nodeName": "节点"+(This.$max+1),
			"nodeType": "1",
			"personList": [],
			"appoint_dept_ids":[]
		}
			This.addNode(This.$max+1,data);
			This.$max++;
		});
		this.$workArea.delegate('.fixedFlow_del','click',{inthis:this},function(e){
			var This = e.data.inthis;
			e.stopPropagation();
			var $li = $(this).parents('li');
			var delId = $li.data('nodeInfo').id;
			$li.remove();
			//删除
			This.delNode(delId);
			This.$workArea.find('.fixedFlow_title.node_focus').click();

		});
	},
	reset_addbtn:function(){
		this.$workArea.find('.fixedFlow_title.node_focus').click();
		var $addList = this.$workArea.find('.fixedFlow_add');
		var index = $addList.parents('li').index();
		if(index!=0){
			$addList.removeClass('fixedFlow_add').addClass('fixedFlow_del').html('-');
			this.$workArea.find('.fixedFlow_del:eq(0)').removeClass('fixedFlow_del').addClass('fixedFlow_add').html("+");
		}
	}
}
//将此类的构造函数加入至JQUERY对象中
jQuery.extend({
	createFixedFlow:function(bgDiv){
		return new FixedFlow(bgDiv);
	}
});

$(function(){
	$('#fixedFlow_info').on('click','[name=is_lading]',function(){
		var value = $(this).val();
		if(value != 3){
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
		if(value != 2 ){
			//清空选人
			$('#node_personList').data('personList',[]);
			makeSelectOutput('select_node_person');
			$('.form-node-set').hide();
		}else{
			$('.form-node-set').show();
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
	$('[name="isQuery"]').on('click',function(){
		if($(this)[0].checked == true){
			$('#dept_approval').show();
		}else{
			$('#dept_approval').hide();
		}
		$('#flow_node_name').blur();
	});
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

});
function saveOrder1(){
	demo.reset_addbtn();
}
/***获取指纹验证的二维码**/
function soterQRCode(){
	var url=baseHttpURL +"/open/demo/soter.jsp";
	var tmp='<div class="TipLayer"><div class="TipLayerTit"><i id="popCloseQ"">×</i></div>'+
		'<div class="TipLayerMain shareImgList" id="showQrcodeId" ></div><div class="TipLayerBtn">' +
		'请使用处理人的手机扫描二维码确认是否支持指纹功能</div>' +
		'<div class="mt20">目前只支持机型：<br>iPhone、金立 、Hisense、HTC、IVVI、 Meitu、MOTO、OPPO、SUGAR、TCL、 vivo、ZUK、乐视、魅族、努比亚、一加、中国移动、中兴、富士康 、酷派、锤子、华硕</div>' +
		'<div style="color:#ff3333;">微信将在近期逐步开放：小米、三星、华为的机型</div>';
	with(window.top){
		$('body').append(tmp);
		if ($("#showQrcodeId").attr("title") == undefined) {
			var qrcode = new QRCode(document.getElementById("showQrcodeId"), {
				width: 220, //设置宽高
				height: 220
			});
			qrcode.makeCode(url);
		}
		$('.overlay').show();
		$('#popCloseQ',window.top.document).on('click',function(){//取消
			$('.overlay').hide();
			$('.TipLayer').remove();
		});
		$('#downQrcode',window.top.document).on('click',function(){//下载二维码
			html2canvas(this).then(function (canvas) {
				canvas.id = "html2canvas";
				var image = new Image();
				image.id  = "image";
				image.src = canvas.toDataURL("image/png");
			})

		});
	}
}

/***保存流程信息**/
function saveFlow(){
	//alert(1)
	if($('[name="name"]').val() == ""){
		
		_alert("流程名称不能为空");
		return;
	}
	if($("#deptIds").val()=="" && $("#userIds").val()=="" && $('[name="range"]').val()=="3"){
		_alert("特定对象为空");
		return ;
	}
	if($("[name='category_id']").val()==""){
		_alert("请选择流程分组");
		return;
	}
	//alert(1)
	$("#flowNodeJson").val(JSON.stringify(demo.exportData()));
	
	if(!checkFlowInfo(demo.nodeData))return;
	$("#flowForm").ajaxSubmit({
		dataType:"json",
		//data:,
		async:true,
		forceSync:true,
		success:function(a){
			if (a.status == 0) {
				window.history.go(-1);
				// var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				// parent.layer.close(index); //再执行关闭   
			}else{
                top.layer.alert(a.message);
			}
		},
        error:function(){
            // hideLoading();
            $(":button").attr("disabled",false);
            _alert("通讯故障");
        }
	});

}
/***验证节点信息**/
function checkFlowInfo(data){
	for(var i = 0;i<data.length;i++){
		var nodeName =  data[i].nodeName,isLading = data[i].isLading,personList = data[i].personList,tagList = data[i].tagList;
		var flowNodeAuditAppointSetList = data[i].flowNodeAuditAppointSetList;
		if(isLading == 2 && personList.length == 0&&tagList.length == 0){
			_alert('节点“'+nodeName+'”处理人不能为空');
			return false;
		}
		if(isLading == 5 && flowNodeAuditAppointSetList.length > 0){
			if(flowNodeAuditAppointSetList[0].appointType == 3  && flowNodeAuditAppointSetList[0].appointNodeId == '' ){
				_alert('节点“'+nodeName+'”请选择特定节点');
				return false;
			}
		}
	}
	return true;
}
function getFlowGroupHtml(groupList){
	var content = '<option value="">请选择</option>';
	if(groupList&&groupList.length>0){
		for(var i = 0;i<groupList.length;i++){
			content+='<option value="'+groupList[i].id+'">'+groupList[i].name+'</option>';
		}
	}
	$('[name="category_id"]').html(content);
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
/**验证最大字符，最小字符的设置**/
function checkMaxAndMiniVal(obj,type){
	if($(obj).val()!=""){
		if(type==1){//最小值
			if($(obj).val()<0){
				$(obj).val(0);
			}
			else if($(obj).val()>2000){
				$(obj).val(0);
			}
		}else if(type==2){//最大值
			if($(obj).val()<0){
				$(obj).val(0);
			}
			else if($(obj).val()>2000){
				$(obj).val(2000);
			}
		}
	}
}
function add_appoint(){
	var $flow_node_name = $('#flow_node_name');
	var $free_pick = $('#free_pick');//<span class="span-item"><span>未命名</span><span class="close">×</span></span>
	var selectData = $free_pick.data('pointVoInfo');
	var nodeData = demo.exportData(true);
	if(nodeData.length == 0){
		_top_alert('没有可选的节点',false);
		return;
	}
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
		var $li = $('<li class="clearfix"><label class="block"><span>'+item.nodeName+'</span><input value="'+item.id+'" name="appointNode" class="ipt-cb" type="checkbox"></label></li>').data('info',item);;
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
				appointNodeId:item.id,
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
		}];
		$free_pick.data('pointVoInfo',voInfo);
		$('#flow_node_name').blur();
	});
}
