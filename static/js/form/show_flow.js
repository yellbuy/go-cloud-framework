function ShowFlow(flowid,nodep,flowp,ctrolp){
	this.flowid = flowid;
	this.$bgDiv = $('#'+flowid);
	this.nodep = nodep;
	this.flowp = flowp;
	this.ctrolp = ctrolp;
	this.initBgDiv();
	this.$workArea = this.$bgDiv.find('.fixedFlow_content');
	this.initNode();
	this.flowInfo = flowp;
	this.initWorkForNode();
}
ShowFlow.prototype = {
	initFlowInfo:function(){
		return this.flowp[this.flowid];
	},
	initBgDiv:function(){
		var $content = $('<div class="fixedFlow"><div class="clearfix"><div class="fl flowTitle" style="text-align: left;width: 390px;cursor: pointer">'+this.flowp.flowName+'</div><div class="fl fixedFlow_hd" style="height:20px;"><span class="icon_max"></span><span class="icon_close"></span></div></div><ul class="fixedFlow_content" style="min-height:auto;display:none;margin-top:5px;"></ul></div>')
		this.$bgDiv.prepend($content);
		var This = this;
		$content.find('.icon_close').click(function(){
			licloseFlow(This.flowid,This.flowp.flowName);
			This.$bgDiv.remove();
		});
		$content.find('.icon_max').click(function(){
			This.$workArea.toggle();
			if($(this).hasClass('icon_min')){
				$(this).removeClass('icon_min').addClass('icon_max');
				This.$bgDiv.find('.fixedFlow').next().remove();
			}else{
				$(this).removeClass('icon_max').addClass('icon_min');
				This.$workArea.find('.fixedFlow_title:eq(0)').click();
			}

		});
		$content.find('.flowTitle').click(function(){
			$content.find('.fixedFlow_hd').children(':eq(0)').click();

		});
	},
	initNode:function(){
		var nodep = this.nodep;
		var firstCtrol = this.getJsonInfo(fieldList,this.flowid,'first');
		var firstNode = $('<li><div class="fixedFlow_title"><span>填写/提交表单</span></div></li>').data('ctrolp',firstCtrol);
		this.$workArea.append(firstNode);
		for(var i = 0;i<nodep.length;i++){
			var ctrolInfo = this.getJsonInfo(fieldList,this.flowid,nodep[i].id);
			var $li = $('<li><div class="fixedFlow_title"><span>'+nodep[i].nodeName+'</span></div></li>').data('nodep',nodep[i]).data('ctrolp',ctrolInfo);
			this.$workArea.append($li);
		}
	},
	getJsonInfo:function(list,flowId,nodeId){
		var backJsonObj=[];
		if(list){
			var nodeFieldList= this.ctrolp[flowId+"_"+nodeId];//获取已获得的字段信息
			for(var i=0;i<list.length;i++){
				var jsonObj = {};
				jsonObj["fieldKey"] = list[i].itemKey;
				jsonObj["flowId"] = flowId;
				jsonObj["nodeId"] = nodeId;
				jsonObj["itemType"] = list[i].itemType;
				jsonObj["label"] = list[i].itemName.replace(/\s/g, "");//清掉字段名称所有的空格不然解析json会报错
				if(nodeFieldList){//遍历控制字段里面是否对该字段已有记录
					var noFind=true;
					for(var j=0;j<nodeFieldList.length;j++){
						if(nodeFieldList[j].fieldId==list[i].itemKey){
							jsonObj["canShow"]=nodeFieldList[j].isRead=="0"?false:true;//0是禁止
							jsonObj["canEdit"]=nodeFieldList[j].isUpdate=="0"?false:true;
							noFind=false;
							break;
						}
					}
					if(noFind){
						jsonObj["canShow"] =true;
						jsonObj["canEdit"] =nodeId=="first"?true:false;
					}
				}else{
					jsonObj["canShow"] =true;
					jsonObj["canEdit"] =nodeId=="first"?true:false;
				}
				backJsonObj.push(jsonObj);
			}
		}
		return backJsonObj;
	},
	initWorkForNode:function(){
		this.$workArea.delegate('.fixedFlow_title','click',{inthis:this},function(e){
			var This = e.data.inthis;
			var $li = $(this).parents('li');
			var nodeInfo = $li.data('nodep');
			var ctrolInfo = $li.data('ctrolp');
			//console.log(nodeInfo);
			//console.log(ctrolInfo);
			var $node_focus = This.$workArea.find('.fixedFlow_title.node_focus');
			$node_focus.removeClass('node_focus');
			$(this).addClass('node_focus');
			$('.fixedFlow_li>.form').remove();
			This.showInfo(nodeInfo,ctrolInfo,$li.index());
			This.showFlow();
		});
	},
	showFlow:function(){
		//console.log(this.flowInfo);
		var flowInfo = this.flowInfo;
		var flowAttr = $('<div class="flowAttrBox" style="display:none;"></div>');
		flowAttr.append('<div class="node_edit_item mt20">'
			+'<div class="node_edit_sidebar">流程名称：</div>'
			+'<div class="node_edit_content"><input type="text" class="form-text" value="'+flowInfo.flowName+'"></div></div>'
			+'</div>');
		flowAttr.append('<div class="node_edit_item mt5">'
			+'<div class="node_edit_sidebar">流程分组：</div>'
			+'<div class="node_edit_content"><select style="width:300px;"><option value>'+flowInfo.groupName+'</option></select></div>'
			+'</div>');
		var $range = $('<div class="node_edit_item">'
			+'<div class="node_edit_sidebar">目标对象：</div>'
			+'<div class="node_edit_content">'
			+'<div class="label_radio"><input style="margin-top: 6px;" type="radio" class="radio_all"><label style="margin:5px 0px;">所有人</label></div>'
			+'<div class="label_radio"><input style="margin-top: 6px;" type="radio" class="radio_specified"><label style="margin:5px 0px;"> 特定对象</label></div>'
			+'</div>');
		if(flowInfo.ranges == 1){
			$range.find('.radio_all').attr('checked',true);
		}else{
			$range.find('.radio_specified').attr('checked',true);
		}
		flowAttr.append($range);
		flowAttr.append('<div class="node_edit_item" style="display: block;">'
			+'<div class="node_edit_sidebar">备注：</div>'
			+'<div class="node_edit_content"><textarea placeholder="备注仅后台可见" value="'+flowInfo.remark+'" rows="3" cols="" style="width:290px;height:48px;"></textarea></div>'
			+'</div>')
		return flowAttr;
	},
	showInfo:function(nodeInfo,ctrolInfo,step){
		var $temp = $('<div class="form">'
			+'<div class="fixedFlow_edit">'
			+'<div class="top flex">'
			+'<span class="nodeAttr active">操作权限</span>'
			+'<span class="nodeAttr">节点属性</span>'
			+'<span class="nodeAttr">流程属性</span>'
			+'</div>'
			+'<div class="con">'
			+'<div class="jurisdictionBox">'
			+'</div>'
			+'<div class="nodeAttrBox" style="display:none;"></div>'
			+'</div>'
			+'</div></div>');
		if(!nodeInfo)$temp.find('.nodeAttr').eq(1).hide();
		if(nodeInfo){
			var nodeattrBox = $temp.find('.nodeAttrBox');
			nodeattrBox.append('<div class="node_edit_item">'
				+'<div class="node_edit_sidebar">步骤：</div>'
				+'<div class="node_edit_content">'+step+'</div>'
				+'</div>');
			nodeattrBox.append('<div class="node_edit_item ">'
				+'<div class="node_edit_sidebar">节点名称：</div>'
				+'<div class="node_edit_content"><input type="text" class="form-text" maxlength="20" value="'+nodeInfo.nodeName+'" placeholder="请填写名称（最多20字）"></div>'
				+'</div>');
			var nodeType = $('<div class="node_edit_item ">'
				+'<div class="node_edit_sidebar">类型：</div>'
				+'<div class="node_edit_content">'
				+'<label class="dropdown-tip-toggle mr20" dropdown-tip-toggle="表示审查后批准执行；微信端处理时使用“审批”、“退审”按钮"><input type="radio"  value="1">审批 </label>'
				+'<label class="dropdown-tip-toggle mr20" dropdown-tip-toggle="表示已领会、收到通知；微信端处理时使用“确认”、“退回”按钮"><input type="radio"  value="2">知会</label>'
				+'<label class="dropdown-tip-toggle" dropdown-tip-toggle="表示承接经办、接受办理；微信端处理时使用“办理”、“退回”按钮"><input type="radio"  value="3">承办</label>'
				+'</div>'
				+'</div>');
			nodeType.find('[value='+nodeInfo.nodeType+']').attr('checked','checked');
			nodeattrBox.append(nodeType);
			var isQuery = $('<div class="node_edit_item ">'
				+'<div class="node_edit_sidebar line30_1">处理人：</div>'
				+'<div class="node_edit_content line30_1">'
				+'<label class="dropdown-tip-toggle" dropdown-tip-toggle="填写并提交表单的人"><input type="radio"  value="1">提单人</label>'
				+'<br><label class="dropdown-tip-toggle mr15" dropdown-tip-toggle="提单人当前部门的直接负责人，勾选后如果没有直接负责人，则往上一级寻找（部门负责人在通讯录管理中设置）"><input type="radio" name="is_lading" value="3">部门负责人</label>'
				+'<label class="dropdown-tip-toggle" dropdown-tip-toggle="从提单人的部门负责人开始，根据组织架构逐级向上审批；可以添加结束条件，不添加则一直到往上逐级到最高负责人处理才进入下一节点">'
				+'<input type="checkbox" value="4">按组织架构自动逐级审批'
				+'</label><br>'
				+''
				+'<label class="dropdown-tip-toggle" dropdown-tip-toggle="从通讯录中选择具体成员，其中标签适用于“审批角色”，即：流程选择某个标签后，只需在通讯录中统一管理该标签里的成员，不用因为人员变动再修改流程">'
				+'<input type="radio" value="2">选择处理人/标签角色'
				+'</label>'
				+'</div>');
			isQuery.find('[value='+nodeInfo.isLading+']').attr('checked','checked');
			if(nodeInfo.isLading == 3&&nodeInfo.isQuery == 1){
				isQuery.find('[value="4"]').attr('checked','checked');
			}

			nodeattrBox.append(isQuery);
			if(nodeInfo.isLading == 2){
				var personList = nodeInfo.personList,tagList = nodeInfo.tagList;
				var tagL ='',person = '';
				for(var i = 0;i<personList.length;i++){
					person += '<div class="append_item"><img src="'+personList[i].headPic+'">'+personList[i].personName+'</div>'
				}
				for(var j = 0;j<tagList.length;j++){
					tagL += '<div class="append_item"><img src="'+baseURL+'/manager/images/tag_icon02.png">'+tagList[j].tagName+'</div>';
				}
				var $personList = $('<div class="form-node-set p0" style="margin-left:100px;">'
					+'<div class="chooseDeptAndUs">'
					+'<div class="clear-fix">已选<span class="orange selectedTag ml5">'+tagList.length+'</span> 标签，<span class="orange selectedUser">'+personList.length+'</span> 成员</div>'
					+'<div class="selected">'
					+'<div class="tagList"></div>'
					+'<div class="personnelList"></div>'
					+'</div>'
					+'</div>');
				$personList.find('.tagList').html(tagL);
				$personList.find('.personnelList').html(person);
				nodeattrBox.append($personList);
			}
			var nodeset = $('<div>'
				+'<div class="node_edit_item mt10 ">'
				+'<div class="node_edit_sidebar line30_1">节点设置：</div>'
				+'<div class="node_edit_content line30_1">'
				+'<div>'
				+'<label class="mr15 dropdown-tip-toggle" dropdown-tip-toggle="当前节点的所有处理人都需要处理才能进入下一节点"><input name="isSigned" type="checkbox">当前节点启用会签</label>'
				+'<label class="mr15 dropdown-tip-toggle" dropdown-tip-toggle="当前节点的处理人可以自由添加通讯录权限范围内的成员协助处理，加签类型：##· 加会签：在当前节点中添加处理人##· 加前签：在当前节点之前添加处理人##· 加后签：在当前节点之后添加处理人"><input name="isAddCountersigned" type="checkbox">允许加签</label>'
				+'<br><label class="dropdown-tip-toggle" dropdown-tip-toggle="当前节点需要在手机上进行指纹验证才能处理；如手机不支持指纹功能时，必须使用手写签名"><input name="isSotered" type="checkbox">使用指纹验证</label><span class="mobile-device c999 f12" onclick="soterQRCode()">查看支持的设备</span>'
				+'<br><label class="mr15"><input name="isUseHandWriteSigned" type="checkbox">必须手写签名</label>'
				+'<label class="mr15 dropdown-tip-toggle" dropdown-tip-toggle="使用后台存档的手写签名图，可规范审批##格式，同时提高审批效率。##· 签名图在“通讯录管理 > 设置”中管理"><input name="isUsePresetSigned" type="checkbox">允许使用存档签名</label>'
				+'<br><label class="dropdown-tip-toggle" dropdown-tip-toggle="当前节点处理人与上一节点处理人相同时，系统自动同意并通过##自动审批无效状况：##· 当前节点处理人使用“部门负责人”并且提单人属于多部门人时"><input name="isAutomaticAudited" type="checkbox">自动审批</label>'
				+'<br><label class=""><input name="isCanEnded" type="checkbox">允许当前节点提前结束流程</label>'
				+'<br><label class="mr15 dropdown-tip-toggle" dropdown-tip-toggle="上一节点处理完毕时，可以从当前节点里##已设置的处理人中选择具体处理成员"><input name="isChoiceed" type="checkbox">允许被上一节点指定处理人</label><label class="dropdown-tip-toggle" style="display:none;" dropdown-tip-toggle="默认选中当前节点全部处理人"><input name="isChoice1" type="checkbox" checked="checked">默认全选</label>'
				+'<br><label><input name="isTimeSeted" type="checkbox">节点时效设置</label>'
				+'</div>'
				+'</div>'
				+'</div>'
				+'</div>');

			nodeset.find('[name=isSigned]').attr('checked',nodeInfo.isSign ==0?true:false);
			nodeset.find('[name=isAddCountersigned]').attr('checked',nodeInfo.isAddCountersign ==1?true:false);
			nodeset.find('[name=isAutomaticAudited]').attr('checked',nodeInfo.isAutomaticAudit ==1?true:false);
			nodeset.find('[name=isUsePresetSigned]').attr('checked',nodeInfo.isUsePresetSign ==1?true:false);
			nodeset.find('[name=isSotered]').attr('checked',nodeInfo.isSoter ==1?true:false);
			nodeset.find('[name=isUseHandWriteSigned]').attr('checked',nodeInfo.isUseHandWriteSign ==1?true:false);
			nodeset.find('[name=isCanEnded]').attr('checked',nodeInfo.isCanEnd ==0?true:false);
			nodeset.find('[name=isChoiceed]').attr('checked',nodeInfo.isChoice ==0?true:false);
			nodeset.find('[name=isTimeSeted]').attr('checked',nodeInfo.isTimeSet ==1?true:false);
			nodeattrBox.append(nodeset);
		}


		$temp.find('.con').append(this.showFlow());
		this.$bgDiv.append($temp);
		$temp.find('input,select,textarea').attr('disabled','disabled');
		$temp.find('.jurisdictionBox input').removeAttr('disabled');
		this.showCtrol($temp.find('.jurisdictionBox'),ctrolInfo,nodeInfo?nodeInfo.id:'first');
		$temp.find('.nodeAttr').click(function(){
			var index = $(this).index();
			$temp.find('.con').children().hide().eq(index).show();
			$temp.find('.nodeAttr').removeClass('active');
			$(this).addClass('active');
		});

	},
	showCtrol:function($ele,nodeInfo,nodeid){
		var isShow;
		if(nodeid == 'first'){
			isShow = 'none';
		}else{
			isShow = 'block';
		}
		var This = this;
		var $table = $('<table class="tableFixed"><tbody><tr><th class="td1">字段名称</th><th class="td2 " width="150px"><div class="'+isShow+'"><input class="n-canEdit-all" type="checkbox">可编辑</div></th><th class="td3" width="90px"><input class="n-canShow-all" type="checkbox">可见</th></tr></table>');

		for(var i=0; i<nodeInfo.length; i++){
			var canEdit =  nodeInfo[i].canEdit ? 'checked="checked"' : '';
			var canShow = nodeInfo[i].canShow ? 'checked="checked"' : '';
			var isdisable = '';
			if(nodeInfo[i].canShow == false){
				isdisable = 'disabled="disabled"';
			}
			var appendhtml = $('<tr  data-fieldKey="'+nodeInfo[i].fieldKey+'"><td class="td1 ellipsis">'+nodeInfo[i].label+'</td><td class="td2"><input class="n-canEdit '+isShow+'" type="checkbox"' +canEdit+isdisable+'/></td><td class="td3"><input class="n-canShow" type="checkbox" ' +canShow+'/></td></tr>');
			if(nodeInfo[i].itemType == 'SectionBreak'||nodeInfo[i].itemType == 'ImageCheckBox'){
				appendhtml.find('.n-canEdit').removeClass('block').addClass('none');
			}
			$table.append(appendhtml);
		}
		//绑定编辑input的事件
		$table.find('input').click(function(){
			var $this = $(this);
			if($this.hasClass('n-canEdit-all')||$this.hasClass('n-canShow-all')){
				var a_canEdit = $this.hasClass('n-canEdit-all');
				var backNodeInfo = [];
				var iscan = this.checked;
				$.each(nodeInfo,function(k,value){
					if(a_canEdit){
						if(value.canShow)value.canEdit = iscan;
					}else{
						value.canShow = iscan;
						if(iscan == false){
							value.canEdit = false;
						}
					}
					backNodeInfo.push(value);
				});
				if(a_canEdit){
					$this.parents('table').find('.n-canEdit').each(function(index,ele){
						var canshow = $(ele).parents('tr').find('input')[1].checked;
						if(canshow)$(ele).attr('checked',iscan);
					});
				}else{
					$this.parents('table').find('.n-canShow').each(function(index,ele){
						$(ele).attr('checked',iscan);
						if(!iscan){
							$this.parents('table').find('.n-canEdit').each(function(index,el){
								$(el).attr('checked',iscan).attr('disabled','disabled');
							});
						}else{
							$this.parents('table').find('.n-canEdit').each(function(index,el){
								$(el).removeAttr('disabled');
							});
						}
					});
				}
			}else{
				var fieldKey = $this.parents('tr').attr('data-fieldKey');
				var backNodeInfo = [];
				var iscan = this.checked;
				var isEdit = $this.hasClass('n-canEdit')
				$.each(nodeInfo,function(k,value){
					if(value.fieldKey==fieldKey){
						if(isEdit){
							value.canEdit = iscan;
						}else{
							value.canShow = iscan;
							var inputE = $this.parents('tr').find('input:eq(0)');
							if(!iscan){
								value.canEdit = false;
								inputE.attr('checked',iscan).attr('disabled','disabled');
							}else{
								inputE.removeAttr('disabled');
							}
						}
					}
					backNodeInfo.push(value);
				});
				var nodeEle = This.$workArea.find('.fixedFlow_title.node_focus');
				nodeEle.parents('li').data('ctrolp',backNodeInfo);
			}
		});
		$ele.html($table);
	}
}
//根据字段列表更新已经有的可编辑可见信息
function update_gdInfo(fieldList){
	$('.fixedFlow_content li').each(function(index,ele){
		var nodeInfo =  $(ele).data('ctrolp');
		var flowId = $(ele).parents('.fixedFlow_li')[0].id;
		var nodep = $(ele).data('nodep');
		var nodeId = nodep?nodep.id:'first';
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
			jsonObj["canEdit"] = nodeId == 'first'?true:false;
			backNodeInfo.push(jsonObj);
		}
		$(ele).data('ctrolp',backNodeInfo);
	});
}
