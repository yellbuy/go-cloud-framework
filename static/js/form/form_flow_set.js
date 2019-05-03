
var  flowIds="";//记录已有的
var fieldList=[];//最新的字段信息
var delFieldList=[];//要删除的字段数据
var addFieldList=[];//要添加的字段信息
var oldFieIdJson=[];//旧字段信息
var isOldForm=true;//是否未旧表单 用于点击时弹出提示框 且只有之前固定的时候弹出来
/**获取流程节点信息**/
function getFlowNodeInfo(isInstance,flow_ids,flowNames){//id name都是以|分隔
	$("#flowIds").val(flow_ids);
	if(flow_ids==""){//清空
		 $('.fixedFlow_box').each(function(i,el){//实时data-value总量
          $(el).remove();
         });
	}
	var queryFlowIds="";//需要查询的流程id
	var deleFlowIds="";//需要剔除的流程id
	if(!isInstance){//不是初始化的时候
		 var flowIdArry=flow_ids.split("|");
		 for(var i=0;i<flowIdArry.length;i++){//找出要查询的flowid
	    	 if(flowIdArry[i]!=""&&(flowIds.indexOf(flowIdArry[i]+"|")==-1||flowIds=="")){
	    		 queryFlowIds+=flowIdArry[i]+"|";
	    	 }
	     }
		 if(flowIds!=""){//剔除不需要的flowid
			 var flowIdExitArry=flowIds.split("|");
			 for(var i=0;i<flowIdExitArry.length;i++){
		    	 if(flowIdExitArry[i]!=""&&flow_ids.indexOf(flowIdExitArry[i]+"|")==-1){
		    		 deleFlowIds+=flowIdExitArry[i]+"|";
		    	 }
		     }
			 delFlowHtml(deleFlowIds);
		 }
		 flowIds=flow_ids;
		 getFlowAndContralInfo(queryFlowIds);
	}else{
		flowIds=flow_ids;
		getFlowAndContralInfo(flowIds);
	}
	
	 
}
/**删除没有被选中的流程***/
function delFlowHtml(deleFlowIds){
	var delFlowIdArry=deleFlowIds.split("|");
	for(var i=0;i<delFlowIdArry.length;i++){
		if(delFlowIdArry[i]!=""){
			$("#"+delFlowIdArry[i]).remove();
		}
	}
}

/**获取流程节点以及流程控制的字段**/
function getFlowAndContralInfo(queryFlowIds){
	$.ajax({
		url : baseURL+"/flow/flowAction!ajaxSearchFlowAndContralInfo.action",
		type : "post",
		async : false,
		data:{"refId":definitionId,"flowIds":queryFlowIds},
		dataType : "json",
		success : function(result) {
			//console.log(result)
			if (result.code == "0") {
				var flowp = result.data.flowMap;
				var nodep = result.data.flowNodeMap;
				var ctrolp = result.data.flowContralFiledMap;
				for(var i in flowp){
					$('#flow_node_info').append('<div id="'+i+'" class="clearfix fixedFlow_li mb10"></div>');
					new ShowFlow(i,nodep[i],flowp[i],ctrolp);
				}
				if(isFirtstClickFlow){
					$('.icon_max').first().click();
				}
			}
		},
		error : function() {
			_alert("错误提示", "系统繁忙！");
		}
	});
	
}
    window.fixedFlow={
        switchTab:function (){//切换列表
            var index=$(this).index();
            $(this).siblings('span').removeClass('active');
            $(this).addClass('active');
            $(this).parents('.fixedFlow_edit').find('.edit_content').hide().eq(index).show();
        },
		submitData:function(){//提交数据
			var countData=[];
			$('.fixedFlow_content li').each(function(i,el){
				countData.push($(el).data('ctrolp'));
			})
			$("#flow_node_field_json").val(JSON.stringify(countData));
		}
    }
function getFormFiledInfo(){
	var field = generateChildFormString();
	$("#formField").val(field);
	field = JSON.parse(field);
    var data = {};
    data.fieldList = [];
    data.getJsonHtml = {};
    data.getJsonHtml.ordered_fields = [];
    var addf = [];
    var keyL = [];
    if(field!=""){
        for(var i=0;i<field.length;i++){
            var fieldJson = field[i];
           //如果子表单字段为空，不做处理
    if(fieldJson._type == 'Fields::ChildField' || fieldJson._type == 'Fields::FORMREFCustomerField'){
    	//if(!fieldJson.children)return;
    }
            var tem = {
                "itemKey": fieldJson._id?fieldJson._id:'fo'+uuid().replace(/-/g,''),//new uuid 或者id
                "itemName": fieldJson.label,//label
                "itemType": fieldJson._type.split('::')[1]//"_type": "Fields::TextField",
            }
            if(!fieldJson._id){addf.push(tem);}
            fieldJson._id = tem.itemKey;
            data.getJsonHtml.ordered_fields.push(fieldJson);
           // if(fieldJson._type == 'Fields::ImageCheckBox')continue;//||fieldJson._type == 'Fields::SectionBreak'
            data.fieldList.push(tem);
           keyL.push(tem.itemKey);
        }
    }
    addFieldList = addf;
    var delF = [];
    for(var j=0;j<oldFieIdJson.length;j++){
        var okey =  oldFieIdJson[j].itemKey
        if(okey){
			if(keyL.indexOf(okey)==-1){
				delF.push(oldFieIdJson[j]);
			}
        }
      }
    delFieldList = delF;
    fieldList = data.fieldList;
    oldFieIdJson = data.fieldList;
    if(fieldList&&fieldList.length>0){
		  try{//每次切换到流程设定页面时，都请求一下获取最新的字段信息以及字段html代码
			  $("#form_design").html(formFiledDivHtmlInfo);
			  renderChildForm(data.getJsonHtml);
		  }catch(e){//没有字段时防止js报错
			  $("#form_design").html(formFiledDivHtmlInfo);
			  var formJson = $.parseJSON('{\"description\":null,\"name\":null,\"token\":null,\"class_name\":\"Form\",\"ordered_fields\":[]}');
			  renderChildForm(formJson);
		  }
		  setTimeout(function(){
			  if($('.sf-add-ziduanbox').length == 0){
				  $('.sidebar').after('<div class="sf-add-ziduanbox"></div>');
			  }
		  },500);
		  
	  }
	 //分支流程更新节点的可编辑可见信息
	if($('#isFreeFlow').val()==3){
		update_fenzhiInfo(fieldList);
		if(delFieldList.length>0&&demo){
			demo.update_condition(delFieldList);
		}
	}
	if($('#isFreeFlow').val()==2){
		update_gdInfo(fieldList);
	}
}