var isTask;
var formFiledDivHtmlInfo = '';
/** 保存总共字段信息**/
var formFieldArry = new Array();
var formPO = '';
var promptInfo = '';
var isFirtstClickFlow = true;// 是不是第一次点击表单流程
var _formString = '';
$(function() { // 初始化表单信息数据
  if (operationType == 'update') { // 如果是编辑表单则显示
    $('#formTemplateBtn').show();
  } else{ // 复制则修改新增和发布
    // $("#myForm").attr("action",baseURL+"/form/formAction!ajaxAdd.action");
  }
  showWeiXinField();// 显示微信特有的字段
  $('#radio_all').attr('style', 'margin: 8px 5px 0px 0px;');
  $('#radio_all_id').attr('style', 'line-height: 30px; margin-bottom: 0px;');
  $('#radio_specified').attr('style', 'margin: 8px 5px 0px 0px;');
  $('#radio_specified_id').attr('style', 'line-height: 30px; margin-bottom: 0px;');
  // 上传媒体文件引入
  wxqyh_uploadfile.agent = 'form';
  if (operationType == 'update')
    {wxqyh_uploadfile.groupId=versions_id;}
  wxqyh_uploadfile.init();
  // 上传媒体文件引入  end
  agentCode = 'form';// 定义模块

  // 加载类别
  setTimeout(function() {
    //window.top._hideLoading();
    // showTypeDict();
    form_data_init();
  }, 100);
});
function form_data_init() {
  var id = $('#formId').val() || 0;
  formPO = _doGetDataSrc(baseURL + '/rhjj/formtype/getfields/?id=' + id, null);
  //alert(formPO);
  // 兼容官方写法
  formPO.tbFormControlPO = formPO;
  //console.log(formPO);
  // alert(formPO);
  try { // 因为新增的表单是没有没有字段信息的，所以会报错catch后重新初始化
    formFiledDivHtmlInfo = $('#form_design').html();
    renderChildForm(formPO.fields);
  }catch (e) {
    $('#form_design').html(formFiledDivHtmlInfo);
    var formJson = $.parseJSON('{\"description\":null,\"name\":null,\"token\":null,\"class_name\":\"Form\",\"ordered_fields\":[]}');
    renderChildForm(formJson);
    // 延时加载除去滚动条
    setTimeout('_resetFrameHeight()', 500);
  }


  definitionId = formPO.tbFormControlPO.id;

  // region start 标题模板，当前未实现，暂时删除
  // if("undefined"!=typeof(formPO.tbFormControlPO.titleTemplate)&&formPO.tbFormControlPO.titleTemplate!=null){//标题模板
  // 	$("#titleTemplate").val(formPO.tbFormControlPO.titleTemplate);
  // 	var ordered_fields = formPO.fields.ordered_fields;
  // 	var nobj = {};
  // 	if(ordered_fields){
  // 		for(var i=0;i<ordered_fields.length;i++){
  // 			nobj[ordered_fields[i]._id] = ordered_fields[i].label;
  // 		}
  // 	}
  // 	var nhtml = (function(str){
  // 		var arry = str.match(/{[^}]+}/g);
  // 		var newStr = str;
  // 		if(arry){
  // 			$.each(arry,function(i,e){
  // 				var e1 = e.substring(1,e.length-1);
  // 				if(e1.substring(0,2)=="fo"){
  // 					if(nobj[e1]){
  // 						var temp = '<span attrid="'+e1+'" contenteditable="false">'+nobj[e1]+'</span>'
  // 					}else{
  // 						temp = '';
  // 					}
  // 					newStr =  newStr.replace(new RegExp(e,"g"),temp);
  // 				}else{
  // 					var data = {
  // 						'yyyy_MM_dd_HH_mm_ss_E':'年_月_日_时_分_秒_星期X',
  // 						'yyyy_MM_dd_HH_mm_ss':'年_月_日_时_分_秒',
  // 						'yyyyMMdd HHmmss':'年月日 时分秒',
  // 						'yyyyMMddHHmmss':'年月日时分秒',
  // 						'yyyy/MM/dd HH:mm':'年/月/日 时:分',
  // 						'yyyyMMddHHmm':'年月日时分',
  // 						'yyyyMMdd':'年月日',
  // 						'yyyy':'年',
  // 						'E':'星期X',
  // 						'create_user_name':'提单人',
  // 						'create_user_dept':'提单人部门'
  // 					}
  // 					if(data[e1]){
  // 						var temp = '<span attrid="'+e1+'" contenteditable="false">'+data[e1]+'</span>';
  // 						newStr =  newStr.replace(new RegExp(e,"g"),temp);
  // 					}
  // 				}

  // 			});
  // 		}
  // 		return newStr;
  // 	})(formPO.tbFormControlPO.titleTemplate);
  // 	$('.form-title-input').html(nhtml);
  // }
  // region end 标题模板

  // region start 附件，当前未实现，暂时删除
  // if(formPO.mediaList&&formPO.mediaList.length>0){//附件
  // 	previewFiles(formPO.mediaList,"medialist","mediaIds");
  // }
  // region end 附件

  // region start 设置项 此处直接设置在界面上，因此此处取消设置
  // $('[name="is_build_title"]').val(formPO.is_build_title);
  // $('[name="is_build_sort"]').val(formPO.is_build_sort);
  // $('[name="is_updae_title"]').val(formPO.is_updae_title);
  // region end 设置项

  // // region start 禁用
  // if(operationType=="update"&&"1"==formPO.isUpdate){//是否可以修改
  // 	$("#isUpdate").hide();
  // }
  // if("1"==formPO.tbFormControlPO.isAnonymous){//是否允许匿名提交
  //     $('[name="tbFormControlPO.isAnonymous"]').attr('checked',true);
  // }
  // if(!isVipSilver()){//是否可以启用记录审批修改轨迹
  // 	$("#isSaveOrbit").attr("disabled","disabled");
  // 	$("#isSaveOrbitSpan").show();
  // }
  // if(!isVipGold(interfaceCode.INTERFACE_CODE_FORM)){//是否可以启用记录审批修改轨迹
  // 	$("#wx_download_mx").attr("disabled","disabled");
  // 	$("#wx_download_mxSpan").show();
  //     $('[name="tbFormControlPO.isAnonymous"]').attr("disabled","disabled").next('span').show();
  // }
  // if(formPO.tbFormControlPO.isSaveOrbit==1){//允许提单人保存修改轨迹
  // 	$("#isSaveOrbit").attr("checked",true);
  // }
  // if(isVipGold(interfaceCode.INTERFACE_CODE_FORM) && formPO.tbFormControlPO.isWxDownloadMx == 1){
  // 	$("#wx_download_mx").attr("checked",true);
  // }
  // $("#wx_download_mx").on("click",function(){
  // 	if(!isVipGold(interfaceCode.INTERFACE_CODE_FORM)){
  // 		_alertGoldVip("该功能");
  // 		$("#wx_download_mx").attr("checked",false);
  // 	}
  // });

  // if(formPO.ranges=="3"){//目标对象
  // 	var obj=$("#radio_specified").parent('div');
  // 	$(obj).addClass('active');
  // 	$("#radio_specified").attr('checked','true');
  // 	$("#chooseDeptAndUs").show();
  // 	$("#range").val(formPO.ranges);
  // 	$("#deptIds").val(formPO.departIds);
  // 	$("#chooseDeptAndUs").append('<div class="selected"><div class="personnelList"></div></div>')
  // 	if(formPO.departName!=null && formPO.departName!=""){
  // 		$("#DepartmentList").show();
  // 		var deptList=formPO.departName.split("\|");
  // 		var deptIdList=formPO.departIds.split("\|");
  // 		$('.selected_num1').html(deptList.length);
  // 		for(var i=0;i<deptList.length;i++){
  // 			SelectionPlugIn.addChoose_init("chooseDeptAndUs",deptIdList[i],deptList[i]);
  // 		}
  // 	}
  // 	if(formPO.persons!=null && formPO.persons!=""){
  // 		$("#PersonList").show();
  // 		var userNames="";
  // 		var personId="";
  // 		var pics="";
  // 		var personList=formPO.persons;
  // 		$('.selected_num2').html(personList.length);
  // 		$('.more-pop-tit span.num').html('('+personList.length+')');
  // 		for(var i=0;i<personList.length;i++){
  // 			personId=personId+personList[i].userId+"|";
  // 			userNames=userNames+personList[i].personName+"|";
  // 			pics=pics+personList[i].headPic+"|";
  // 			SelectionPlugIn.addChoose_init("chooseDeptAndUs",personList[i].userId,personList[i].personName,personList[i].headPic);
  // 		}
  // 		personId=personId.substring(0,personId.length-1);
  // 		$("#chooseIds").val(personId);
  // 		$("#chooseNames").val(userNames);
  // 		$("#picIds").val(pics);
  // 		$("#userIds").val(personId);
  // 	}

  // }else{
  // 	var obj=$("#radio_all").parent('div');
  // 	$(obj).addClass('active');
  // 	$("#radio_all").attr('checked','true');
  // 	$("#range").val(formPO.ranges);
  // }
  // if("2"==formPO.tbFormControlPO.isSendMsg){//发布编辑后是否发送给目标对象
  // 	$("#isSendMsg").attr("checked",true);
  // }else{
  // 	$("#isSendMsg").attr("checked",false);
  // }
  // //判断是否可以@人 Luoguangcan 2017-3-15
  // if("1"==formPO.tbFormControlPO.isCanAt){
  // 	$("#formForwardControl_label").attr("checked",true);
  // }
  // //判断文件是否必须上传
  // if("1"==formPO.tbFormControlPO.isPic){
  // 	$("#isPic").attr("checked",true);
  // 	$("#isFileMust_lable").addClass('inline-block');
  // 	$("#isFileMust_lable").show();
  // 	if("1"==formPO.tbFormControlPO.isFileMust){
  // 		$("#isFileMust").attr("checked", true);
  // 	}
  // }
  // //是否允许选择图片
  // if("0"==formPO.tbFormControlPO.formPhotoSet){
  // 	$("#formPhotoSet").attr("checked", true);
  // }
  // if(formPO.isImgWatermark){
  // 	$("#isAddWatermark").attr("checked",true);
  // }
  // if(!isVipGold(interfaceCode.INTERFACE_CODE_FORM)){//是否是金卡
  // 	$("[name='tbFormControlPO.isCallback']").attr("disabled","disabled");
  // 	$("#flowNodeListGold").show();
  // }else{
  // 	if(formPO.hasCallbackUrl){
  // 		//表单数据同步至企业SAP/ERP等系统金卡VIP功能
  // 		if("1"==formPO.tbFormControlPO.isCallback){
  // 			$("[name='tbFormControlPO.isCallback']").attr("checked",true);
  // 			initFlowNodeList($("[name='tbFormControlPO.isCallback']"));
  // 		}
  // 	}else{
  // 		$("[name='tbFormControlPO.isCallback']").removeAttr('onclick').click(function(e){
  // 			e.preventDefault();
  // 			_alert('提示','您还没有设置回调地址');
  // 		});
  // 		//$("[name='tbFormControlPO.isCallback']").attr("disabled",true);
  // 	}
  // }

  // //是否允许上传附件
  // if("1"==formPO.tbFormControlPO.isFile){
  // 	$("#isFile").attr("checked",true);
  // }

  // //判断是否为允许删除
  // if("0"==formPO.tbFormControlPO.isCanDel){
  // 	$("#isCanDel").attr("checked", true);
  // }
  // //提交次数
  // if(formPO.tbFormControlPO.submitTime){
  // 	$("#submitTime").val(formPO.tbFormControlPO.submitTime);
  // }
  // //一个用户可提交
  // if(formPO.tbFormControlPO.actorTime){
  // 	$("#actorTime").val(formPO.tbFormControlPO.actorTime);
  // }
  // //每用户每天可提交
  // if(formPO.tbFormControlPO.daySubmitNum){
  // 	$("#daySubmitNum").val(formPO.tbFormControlPO.daySubmitNum);
  // }
  // //有效开始结束时间
  // if(formPO.tbFormControlPO.startTime){
  // 	$("#startTime").val(formPO.tbFormControlPO.startTime);
  // }
  // if(formPO.tbFormControlPO.stopTime){
  // 	$("#stopTime").val(formPO.tbFormControlPO.stopTime);
  // }
  // if(formPO.tbFormControlPO.isTask=="2"){
  // 	if(formPO.tbFormControlPO.isFreeFlow=="2"){
  // 		$("#isCanUpdate_lable").html("允许审批人修改表单");
  // 	}else{
  // 		isOldForm=false;
  // 		$("#isCanUpdate_lable").html("允许负责人修改表单");
  // 	}
  // 	if("0"==formPO.tbFormControlPO.isCanUpdate){
  // 		$("#isCanUpdate").attr("checked",true);
  // 	}
  // 	$("#isCanUpdate_div").show();

  // }else{
  // 	isOldForm=false;
  // }
  // //有效提醒时间
  // if(formPO.tbFormControlPO.isRemind){
  // 	$("#isRemind").attr("checked",true);
  // 	$("#startSendMsgTimeDiv").show();
  // 	if(formPO.tbFormControlPO.startSendMsgTime){
  // 		$("#startSendMsgTime").val(formPO.tbFormControlPO.startSendMsgTime);
  // 	}
  // 	if(formPO.tbFormControlPO.endSendMsgTime){
  // 		$("#endSendMsgTime").val(formPO.tbFormControlPO.endSendMsgTime);
  // 	}
  // }
  // //循环提醒
  // if("1"==formPO.tbFormControlPO.isWriterRemind){
  // 	getReminderTaskInfo(formPO.tbFormDetailsPO.definitionVersionsId);
  // }

  // //初始化默认负责人
  // if(formPO.tbFormControlPO.isRelatives=="1"){
  // 	$("#isDisableRelatives_lable").addClass('inline-block');
  // 	$("#isDisableRelatives_lable").show();
  // 	$("#isRelatives").attr("checked",true);

  // 	if(formPO.tbFormControlPO.isDisableRelatives=="0"){
  // 		$("#isDisableRelatives").attr("checked", true);
  // 		if(formPO.tbFormControlPO.isTask=="2"&&formPO.tbFormControlPO.isFreeFlow=="1"){
  // 			$("#relativesMaxNumDiv").show();
  // 			$("#relativesMaxNum").val(formPO.tbFormControlPO.relativesMaxNum);
  // 		}else{
  // 			$("#relativesMaxNumDiv").hide();
  // 			$("#relativesMaxNum").val(0);
  // 		}

  // 	}else{
  // 		$("#relativesMaxNumDiv").hide();

  // 	}

  // 	$("#given_div").show();
  // 	var personList=formPO.givenList;
  // 	makeSelectOutput("given_div",personList);
  // }
  // //加载表单类型
  // if(formPO.tbFormControlPO.isTask){
  // 	isTask=formPO.tbFormControlPO.isTask;
  // 	if(isTask==3){//外部单复制为内部单时默认为普通单
  // 		range= $("#range").val(1);//默认所有目标对象
  // 		isTask=0;
  // 	}
  // 	$("#isTask").val(isTask);
  // 	if(isTask==0){
  //         $("#isCanUpdate_div").show();
  //         $("#isCanUpdate_lable").html("允许提单人/负责人重新提交表单");
  // 		$("#isOrdinary").addClass('active');
  // 		$("#isFreeFlow").val("1");
  // 		$("#isFreeFlow_1").attr("checked",true);
  // 		$("#isFreeFlow_2").attr("checked",false);
  // 		if("0"==formPO.tbFormControlPO.isCanUpdate){
  // 			$("#isCanUpdate").attr("checked",true);
  // 		}
  // 	}
  // 	else if(isTask==1){
  //         $("#isCanUpdate_div").show();
  //         $("#isCanUpdate_lable").html("允许提单人/负责人重新提交表单");
  // 		$("#isTask_div").addClass('active');
  // 		$("#isFreeFlow").val("1");
  // 		$("#isFreeFlow_1").attr("checked",true);
  // 		$("#isFreeFlow_2").attr("checked",false);
  // 		$("#isRelatives").attr("checked",true);
  // 		$("#isRelatives").click();
  // 		$("#isRelatives").attr("checked",true);
  // 		$("#given_div_info").show();
  // 		$("#given_div_info").html("（当前为任务单，必须启用负责人功能）");
  //         if("0"==formPO.tbFormControlPO.isCanUpdate){
  //             $("#isCanUpdate").attr("checked",true);
  //         }

  // 	}else if(isTask==2){
  // 		$("#isApproval").addClass('active');
  // 		$("#isRelatives").attr("checked",true);
  // 		if(formPO.tbFormControlPO.isFreeFlow!="2"){
  // 			$("#isRelatives").click();
  // 			$("#isRelatives").attr("checked",true);
  // 		}
  // 		getFlowIds();
  // 	}
  // }
  // region end 禁用

  isInitialization = false;// 加载了对流程的逻辑判断后设置为false

  // 加载默认相关人
  // region start 禁用加载默认相关人
  // if(formPO.tbFormControlPO.isRelevants=="1"){
  // 	if("1"==formPO.tbFormControlPO.sendRelevantStatus){
  // 		$("#sendRelevantStatus").val("1");
  // 		$("#sendRelevantStatus1").attr("checked", true);
  // 	}else if("2"==formPO.tbFormControlPO.sendRelevantStatus){
  // 		$("#sendRelevantStatus").val("2");
  // 		$("#sendRelevantStatus2").attr("checked", true);
  // 	}else if("3"==formPO.tbFormControlPO.sendRelevantStatus){
  // 		$("#sendRelevantStatus").val("3");
  // 		$("#sendRelevantStatus2").attr("checked", true);
  // 		$("#sendRelevantStatus1").attr("checked", true);
  // 	}else{//都不推送
  // 		$("#sendRelevantStatus").val("0");
  // 		$("#sendRelevantStatus2").attr("checked", false);
  // 		$("#sendRelevantStatus1").attr("checked", false);
  // 	}
  // 	$("#relevant_msg_div").show();

  // 	//显示是否允许自由选择相关人
  // 	$("#isDisableRelevants_lable").addClass('inline-block');
  // 	$("#isDisableRelevants_lable").show();
  // 	if("0"==formPO.tbFormControlPO.isDisableRelevants){
  // 		$("#isDisableRelevants").attr("checked", true);
  // 	}

  // 	$("#isRelevants").attr('checked','true');
  // 	$("#relevant_div").show();
  // 	if(formPO.relevantList){
  // 		var personList=formPO.relevantList;
  // 		makeSelectOutput("relevant_div",personList);
  // 	}
  // }
  // //设置状态和控制按钮显示与隐藏
  // if(operationType=="update"){//编辑的时候
  // 	var status = formPO.status;
  // 	$("#status").val(status);
  // 	promptInfo=status;
  // 	if(status == 2){//草稿
  // 		$("#draftBtn").show();
  // 	}
  // 	else{
  // 		$("#publishBtn").val("保存");
  // 		$("#submitTimeTip").html("（当前版本已被用户提交了"+formPO.fillFormCount+"次）");
  // 	}
  // }else{//copy的时候
  // 	$("#status").val(2);
  // 	promptInfo=2;
  // 	$("#draftBtn").show();
  // 	$("#submitTimeTip").html("（当前版本已被用户提交了0次）");
  // }
  // region end 禁用加载默认相关人

  // 初始化数据接口
  // region start 数据接口，暂时禁用
  // var $list = $('#node_data_list'),$str = $('[name="qyFlowNodeCallbackList"]');
  // if(formPO.qyFlowNodeCallbackList){$list.data('nodeData',formPO.qyFlowNodeCallbackList);
  // append_node_item($list,$str)};
  // region end
}

function initFlowNodeList(t) {
  if ($('#isTask').val() == 2) {
    if ($(t).is(':checked')) {
      $('#get_qyFlowNodeListbt').show();
    } else{
      $('#get_qyFlowNodeListbt').hide();
      var $list = $('#node_data_list'), $str = $('[name="qyFlowNodeCallbackList"]');
      $list.data('nodeData', []);
      append_node_item($list, $str);
    }
  }
}
// 是否显示提醒时间设置div
function showStartEndTimeDiv(obj) {
  if (obj.checked) {
    $('#startSendMsgTimeDiv').show();
  } else{
    $('#startSendMsgTimeDiv').hide();
  }
}
// 上传附件显示是否必须上传选项
function clickFile(obj) {
  if (obj.checked) {
    $('#isFileMust_lable').addClass('inline-block');
    $('#isFileMust_lable').show();
  } else {
    $('#isFileMust').attr('checked', false);
    $('#isFileMust_lable').removeClass('inline-block');
    $('#isFileMust_lable').hide();
  }
}
// 切换表单类型
function changeFormType(obj, type) {
  $('#isTask').val(type);
  if (type != 2) { // 如果不是审批单的时候隐藏允许负责人最大数以及是否允许审批人修改表单字段
    $('#isFreeFlow').val('1');
    $('#isFreeFlow_1').attr('checked', true);
    $('#isFreeFlow_1').click();
    $('#isFreeFlow_1').attr('checked', true);
    $('#isFreeFlow_2').attr('checked', false);
    $('#isCanUpdate_div').hide();
    $('#relativesMaxNumDiv').hide();
    $('#relativesMaxNum').val(0);
    $('#isCanUpdate').attr('checked', false);
    $('#isCanUpdate_div').show();
    $('#isCanUpdate_lable').html('允许提单人/负责人重新提交表单');
  }else {
    $('#isFreeFlow').val('1');
    $('#isFreeFlow_1').attr('checked', true);
    $('#isFreeFlow_1').click();
    $('#isFreeFlow_1').attr('checked', true);
    $('#isFreeFlow_2').attr('checked', false);
    $('#isCanUpdate_div').show();
  }
  if (type == 1 || type == 2) { // 任务审批单时默认选中负责人数据信息
    $('#isRelatives').attr('checked', true);
    $('#isRelatives').click();
    $('#isRelatives').attr('checked', true);
    $('#given_div_info').show();
  }
  if (type == 1) {
    $('#given_div_info').html('（当前为任务单，必须启用负责人功能）');
  } else if (type == 2) { // type==2为审批单
    if (formPO.tbFormControlPO.isFreeFlow == '2') { // 如果当前审批单流程类型为固定流程时
      $('#isFreeFlow_2').click();// 保持当前固定流程为选中状态
    }
    if (formPO.tbFormControlPO.isFreeFlow == '3') { // 如果当前审批单流程类型为分支流程时
      $('#isFreeFlow_3').click();// 保持当前分支流程为选中状态
    }
    if (formPO.tbFormControlPO.isFreeFlow != '1') {
      $('#isFreeFlow_1').attr('checked', false);// 去掉自由流程的选中状态
    }
    $('#given_div_info').html('（当前为审批单，审批流程为自由流程，必须启用负责人功能）');
  }else {
    $('#given_div_info').hide();
  }
  $(obj).siblings('.formType').removeClass('active');
  $(obj).addClass('active');
}
// 加载类别
function showTypeDict() {
  $.ajax({
    url: baseURL + '/form/formAction!getFormtype.action?status=1',
    type: 'get',
    async: false,
    dataType: 'json',
    success: function(result) {
      if (result.code == '0') {
        var formtypeList = result.data.formtypeList;
        var strHtml = '';
        for (var i = 0; i < formtypeList.length; i++) {
          var formtypeVO = formtypeList[i];
          strHtml += "<option value='" + formtypeVO.id + "'>" +
						formtypeVO.typeName + '</option>';
        }
        strHtml += "<option value=''>其它</option>";
        $('#s_typeId').append(strHtml);
        if (result.data.isVip) { // vip功能
          $('#formloopremind_a').hide();
          $('#isWriterRemind').attr('disabled', false);
        } else{
          $('#isWriterRemindSpan').show();
        }
        window.corpId = result.data.corpId;
      }
    },
    error: function() {
      _alert('错误提示', '系统繁忙！');
    }
  });
}
// 切换表单设置菜单
function changeFormSet(typeNum) {
  if (typeNum == 1) { // 表单设置
    $('#formDesign').removeClass('active');
    $('#formWrite').removeClass('active');
    $('#formFlow').removeClass('active');
    $('#formSet').addClass('active');
    $('#form_setDiv').show();
    $('#form_designDiv').hide();
    $('#form_write_setDiv').hide();
    $('#form_flow_set').hide();
  } else if (typeNum == 2) { // 表单设计
    $('#formDesign').addClass('active');
    $('#formSet').removeClass('active');
    $('#formWrite').removeClass('active');
    $('#formFlow').removeClass('active');
    $('#form_setDiv').hide();
    $('#form_designDiv').show();
    $('#form_write_setDiv').hide();
    $('#form_flow_set').hide();
  } else if (typeNum == 3) { // 表单填写设置
    $('#formDesign').removeClass('active');
    $('#formSet').removeClass('active');
    $('#formWrite').addClass('active');
    $('#formFlow').removeClass('active');
    $('#form_setDiv').hide();
    $('#form_designDiv').hide();
    $('#form_write_setDiv').show();
    $('#form_flow_set').hide();
  } else if (typeNum == 4) { // 表单流程设置
    _formString = JSON.parse(GoldenData.generateFormString(GoldenData.form));
    add_choicesId();
    if ($('#isTask').val() == '2') {
      $('#flowSet_tip_div').hide();
      $('#flowType_div').show();
      getFormFiledInfo();
      if (demo) { var focus = demo.$focus; if (focus != '') { $('#' + focus).click() } };
    }else {
      $('#flowType_div').hide();
      $('#flowSet_tip_div').show();
    }
    $('#formDesign').removeClass('active');
    $('#formSet').removeClass('active');
    $('#formWrite').removeClass('active');
    $('#formFlow').addClass('active');
    $('#form_setDiv').hide();
    $('#form_designDiv').hide();
    $('#form_write_setDiv').hide();
    $('#form_flow_set').show();
    if (isFirtstClickFlow) {
      isFirtstClickFlow = false;
    }
  }
}
// 为两级下拉框加id
function add_choicesId() {
  var formString = _formString;
  var flag = false;
  for (var i = 0; i < formString.length; i++) {
    if ('Fields::CascadeDropDown' == formString[i]._type) {
      flag = true;
      var choices = formString[i].choices;
      if (choices.length > 0) {
        for (var j = 0; j < choices.length; j++) {
          if (!formString[i].choices[j]._id) {
            formString[i].choices[j]._id = 'fo' + uuid().replace(/-/g, '');
          }
        }
      }
      continue;
    }
  }
  if (flag) {
    renderChildForm({ordered_fields: formString});
  }
}
// 上传附件
/**
 * 上传媒体文件
 * @param fileElementId
 * @param mediaName
 * @param ulobj
 */
function wxqyh_uploadFile(fileElementId, mediaName, ulobj) {
  showLoading('正在上传.....');
  $.ajaxFileUpload({
    url: baseURL + '/fileupload/fileUploadMgrAction!doUploadFile.action', // 需要链接到服务器地址
    data: {
      'agent': agentCode
    },
    secureuri: false,
    fileElementId: fileElementId, // 文件选择框的id属性
    dataType: 'json', // 服务器返回的格式，可以是json
    success: function(data) {
      if (data.code=='0') {
        // 显示上传的文件
        wxqyh_showfile([data.data.mediaInfo], $('#medialist'), mediaName);
        hideLoading();
      } else{
        hideLoading();
        _alert('错误提示', data.desc);
      }

      // 上传完成后都需要重新绑定一下事件
      wxqyh_uploadfile.unbind();
      wxqyh_uploadfile.init();
    },
    error: function() {
      hideLoading();
      _alert('错误提示', '网络连接失败，请检查网络连接');
      // 上传完成后都需要重新绑定一下事件
      wxqyh_uploadfile.unbind();
      wxqyh_uploadfile.init();
    }
  });
}
// 循环提醒中获取当前时间
function getDefualRemindTime() {
  $.ajax({
    type: 'POST',
    url: baseURL + '/form/formAction!initialWriterTime.action',
    data: {},
    dataType: 'json',
    success: function(result) {
      if ('0' == result.code) {
        $('#remindTime').val(result.data.writerInitialTime);
      }
    }
  });
}
/** 根据版本号id获取循环任务信息**/
function getReminderTaskInfo(refId) {
  $('#formloopremind_a').hide();
  $('#isWriterRemind').attr('disabled', false);
  $('#isWriterRemind').attr('checked', true);
  $.ajax({
    type: 'POST',
    url: baseURL + '/remindtask/remindtaskAction!getReminderTaskByForeighId.action',
    data: {id: refId, agentCode: 'form', isTomm: '1'},
    dataType: 'json',
    success: function(result) {
      if ('0' == result.code) {
        var data = result.data.tbReminderTaskPO;
        $('#remindTime').val(data.remindTimeToss);
        var remindCycle = data.remindCycle;
        $('#remindCycle option').each(function() {
          if (this.value == remindCycle)
            {this.selected=true;}
        });
        if (remindCycle != '0') {
          $('#endTimeId').show();
          $('#endTime').val(data.endTime);
        }
        $('#content').val(data.content);
        $('#isWriterRemindStartTimeDiv').show();
        isCycle();
        $('#isWriterRemind').val('1');
        $('#tbReminderTaskPOId').val(data.id);
      }
    }
  });
}
// 是否开启填写提醒功能
function openAndClossWriterRemind(obj) {
  if (obj.checked) {
    if ('' == $('#remindTime').val()) {
      getDefualRemindTime();
    }
    $('#isWriterRemindStartTimeDiv').show();
    isCycle();
    $('#isWriterRemind').val('1');
  } else{
    $('#isWriterRemindStartTimeDiv').hide();
    $('#isWriterRemind').val('0');
  }
}
// 是否重复提醒设置
function isCycle() {
  var remindCycle = $('#remindCycle').val();
  if (remindCycle == '0') {
    $('#isWriterRemindClossTimeDiv').hide();
  }else {
    $('#isWriterRemindClossTimeDiv').show();
  }
}

// 控制自由选择负责人
function clickRelative(obj) {
  if (obj.checked) {
    $('#given_div').show();
    $('#isDisableRelatives_lable').addClass('inline-block');
  } else {
    var isTask = document.getElementById('isTask');
    if ($('#isTask').val() == '2' || $('#isTask').val() == '1') {
      obj.checked = true;
      return false;
    } else {
      $('#isDisableRelatives_lable').removeClass('inline-block');
      $('#isDisableRelatives_lable').hide();
    }
    $('#given_div').hide();
  }
}
// 紧启用相关人
function clickRelevant(obj) {
  if (obj.checked) {
    $('#relevant_div').show();
    $('#isDisableRelevants_lable').show();
    $('#isDisableRelevants_lable').addClass('inline-block');
    $('#sendRelevantStatus1').attr('checked', true);
    $('#sendRelevantStatus2').attr('checked', false);
    $('#isDisableRelevants').attr('checked', false);
    $('#relevant_msg_div').show();
  }else {
    $('#isDisableRelevants_lable').removeClass('inline-block');
    $('#isDisableRelevants_lable').hide();
    $('#relevant_div').hide();
    $('#relevant_msg_div').hide();
    $('#isDisableRelevants').attr('checked', false);
    $('#sendRelevantStatus2').attr('checked', false);
    $('#sendRelevantStatus1').attr('checked', false);
    $('#sendRelevantStatus').val('0');
  }
}
// 点击禁用自由选择负责人时隐藏最多可选择人数
function isShowRelativesMaxNum(obj) {
  if (obj.checked) {
    if ($('#isTask').val() == '2') {
      $('#relativesMaxNum').val(0);
      $('#relativesMaxNumDiv').show();
    }
  } else{
    $('#relativesMaxNumDiv').hide();
    $('#relativesMaxNum').val(0);
  }
}

function clickSendRelevantStatus() {
  var sendRelevantStatus1 = document.getElementById('send_relevant_status1').checked;// 是否审批完成推送
  var sendRelevantStatus2 = document.getElementById('send_relevant_status2').checked;// 是否提单就推送
  if (sendRelevantStatus1 == true && sendRelevantStatus2 == true) { // 都推送
    $('#send_relevant_status').val('3');
  } else if (sendRelevantStatus1 == true) {
    $('#send_relevant_status').val('1');
  } else if (sendRelevantStatus2 == true) {
    $('#send_relevant_status').val('2');
  } else{ // 防止漏掉就默认审批完成推送
    $('#send_relevant_status').val('0');
  }
}
// 选择流程类型
function clickTreeFlow(obj) {
  $('#isFreeFlow').val($(obj).val());
  var choose = $(obj).val();
  if (choose == '1') { // 自由流程
    $('#give_group_div').hide();
    $('#flow_node_info,#flow_fenzhi_node').hide();
    $('#flowVipNoteTipsSpan').hide();
    $('#given_div').show();
    $('#given_div_isRelatives').show();
    $('#isDisableRelatives_lable').addClass('inline-block');
    $('#isDisableRelatives_lable').show();
    $('#relativesMaxNumDiv').show();
    $('#isCanUpdate_lable').html('允许负责人修改表单');
    $('#isFreeFlow_1').attr('checked', true);
    $('#isFreeFlow_2,#isFreeFlow_3').attr('checked', false);
    $('#isDisableRelatives').attr('checked', true);
    $('#isCanUpdate_div').show();
  } else if (choose == '2') { // 固定流程isDisableRelatives
    document.getElementById('isRelatives').checked = true;
    $('#isDisableRelatives_lable').removeClass('inline-block');
    $('#isDisableRelatives_lable').hide();
    $('#flow_node_info').show();
    $('#give_group_div').show();
    $('#given_div').hide();
    $('#given_div_isRelatives, #flow_fenzhi_node').hide();
    $('#flowVipNoteTipsSpan').hide();
    $('#relativesMaxNumDiv').hide();
    $('#isCanUpdate_lable').html('允许审批人修改表单');
    $('#isFreeFlow_1,#isFreeFlow_3').attr('checked', false);
    $('#isFreeFlow_2').attr('checked', true);
    $('#isCanUpdate').attr('checked', true);
    $('#isCanUpdate_div').hide();
  } else{ // 分支流程
    if (isVipSilver())
      {$("#flowVipNoteTipsSpan").hide();}
    else
      {$("#flowVipNoteTipsSpan").show();}
    document.getElementById('isRelatives').checked = true;
    $('#isDisableRelatives_lable').removeClass('inline-block');
    $('#isDisableRelatives_lable').hide();
    $('#flow_fenzhi_node').show();
    $('#given_div,#give_group_div,#flow_node_info').hide();
    $('#given_div_isRelatives').hide();
    $('#relativesMaxNumDiv').hide();
    $('#isCanUpdate_lable').html('允许审批人修改表单');
    $('#isFreeFlow_1,#isFreeFlow_2').attr('checked', false);
    $('#isFreeFlow_3').attr('checked', true);
    $('#isCanUpdate').attr('checked', true);
    $('#isCanUpdate_div').hide();
    // 为分支流程开始和结束节点添加编辑信息
    if (!demo)initFenzhi();
  }
}
function doDetail(e) {
  if ($(e.target).hasClass('set_choices_quota') || $(e.target).hasClass('add_multiple_choices')) return;
  // 除去滚动条
  _resetFrameHeight();
  // 延时加载除去滚动条
  setTimeout('_resetFrameHeight()', 500);
}
function stopPropa(e) {
  if ($(e.target).hasClass('btn-primary')) return;
  e.stopPropagation();
}

/** 加载时获取流程信息***/
function getFlowIds() {
  getFormFiledInfo();
  // 固定流程
  if (formPO.tbFormControlPO.isFreeFlow == '2') {
    if (operationType != 'copy') {
      // $('.form-type-select label').eq(0).hide();
      // $('.form-type-select label').eq(2).hide();
      $('#isFreeFlow_1,#isFreeFlow_3').attr('disabled', true);
      $('.form-type-select label').eq(0).css({'color': '#bbb', 'cursor': 'default'});
      $('.form-type-select label').eq(2).css({'color': '#bbb', 'cursor': 'default'});
    }
    $('#isFreeFlow').val('2');
    $('#isFreeFlow_1').attr('checked', false);
    $('#isFreeFlow_2').attr('checked', true);
    $('#isCanUpdate').attr('checked', true);
    $('#isCanUpdate_div').hide();
    flowList = formPO.flowList;
    $('#flowNum').html('(' + flowList.length + ')');
    $('#flowCount1').html('(' + flowList.length + ')');
    if (flowList) {
      var flowNames = '';
      for (var i = 0; i < flowList.length; i++) {
        flowNames = flowNames + flowList[i].flowName + '|';
        flowIds = flowIds + flowList[i].id + '|';
      }
      getFlowNodeInfo(true, flowIds, flowNames);
    }

    document.getElementById('isRelatives').checked = true;
    $('#chooseFlowNames').val(flowNames);
    $('#flowIds').val(flowIds);
    $('#chooseFlowIds').val(flowIds);
    $('.cPage').show();
    $('#back').show();
    $('#given_div').hide();
    $('#given_div_isRelatives').hide();
    $('#give_freeflow_div').show();
    // 分支流程
  } else if (formPO.tbFormControlPO.isFreeFlow == '3') {
    // 如果是分支流程就不允许切换固定流程和自由流程（复制可以切换）
    if (operationType != 'copy') {
      // $('.form-type-select label').slice(0,2).hide();
      $('#isFreeFlow_1,#isFreeFlow_2').attr('disabled', true);
      $('.form-type-select label').slice(0, 2).css({'color': '#bbb', 'cursor': 'default'});
    }
    $('#isFreeFlow').val('3');
    var flowJson = formPO.flowJson;
    var flowControlJson = formPO.flowControlJson;
    if (operationType == 'copy' && flowJson && flowControlJson) {
      try {
        var nodeIds = [];
        var flowId = flowJson.flowId;
        flowJson.flowId = uuid();
        for (i in flowJson.nodes) {
          nodeIds.push(flowJson.nodes[i].nodeId);
        }
        var oldflowJson = JSON.stringify(flowJson);
        var oldflowControlJson = JSON.stringify(flowControlJson);
        var reg = new RegExp(flowId, 'g');
        oldflowControlJson = oldflowControlJson.replace(reg, flowJson.flowId);
        for (var i = 0; i < nodeIds.length; i++) {
          var newNodeId = uuid();
          var re = new RegExp(nodeIds[i], 'g');
          oldflowJson = oldflowJson.replace(re, newNodeId);
          oldflowControlJson = oldflowControlJson.replace(re, newNodeId);
        }
        flowJson = JSON.parse(oldflowJson);
        flowControlJson = JSON.parse(oldflowControlJson);
      }catch (e) {
        flowJson = undefined;
        flowControlJson = undefined;
      }
    }
    // 初始化分支流程
    if (!demo) {
      initFenzhi(flowJson);
      $('#start_node').click();
      demo.initNodeInfo(flowControlJson);
    }
    $('#isFreeFlow_3').click();
  } else {
    $('#isCanUpdate_div').show();
    $('#isFreeFlow').val('1');
    $('#isFreeFlow_1').attr('checked', true);
    $('#isFreeFlow_2').attr('checked', false);
    $('#give_freeflow_div').show();
    $('#give_group_div').hide();
    $('#given_div_info').show();
  }
}

function checkSaveInfo(type) { // type=save时为操作时   type=publish时为发布时
  if (!checkFormField()) {
    return false;
  }

  if (type == 'save' || type == 'publish') { // 保存时验证
    if ($('#qf_title').val() == '') { // 验证表单名称
      changeFormSet(1);// 填写设置页面
      $('#qf_title').addClass('popframeShake popframeError_input');
      setTimeout(function() { $('#qf_title').removeClass('popframeShake') }, 800);
      return false;
    } else{
      $('#qf_title').removeClass('popframeError_input');
    }
    if ($('#isTask').val() == '') {
      changeFormSet(1);// 填写设置页面
      _alert('提示信息', '请选择表单类型');
      return false;
    } else if ($('#isTask').val() == 0 || $('#isTask').val() == 1) { // 普通单或者任务单的时候也选中为自由流程
      $('#isFreeFlow').val('1');
      $('#isFreeFlow_1').attr('checked', true);
      $('#isFreeFlow_2').attr('checked', false);
    }
    // 固定流程时触发
    if ($('#isFreeFlow').val() == '2') {
      getFormFiledInfo();
      fixedFlow.submitData();
    } else if ($('#isFreeFlow').val() == '3') {

    }
  }
}
function update_flow_node_field_json() {
  // 分支流程的节点字段编辑信息
  var countData = [];
  $('.item_task_node').each(function(i, e) {
    countData.push($(e).data('nodeInfo'));
  });

  $('#flow_node_field_json').val(JSON.stringify(countData));
}

/**
 * 检查表单字段合法性
 * @returns {Boolean} false 不合法 true 合法
 */
function checkFormField() {
  var result = true;
  var formValue = JSON.parse(GoldenData.generateFormString(GoldenData.form));

  $(formValue).each(function(i, field) {
	    // 计算式为空的字段添加提示
    if (field._type == 'Fields::EquationField') {
      if (field.notes == '' || !field.calculator) {
        _alert('提示信息', '【' + field.label + '】计算式不能为空');
        result = false;
        return false;
      }
    }
    if (field._type == 'Fields::ChildField') {
      $(field.children).each(function(i, field) {
        if (field._type == 'Fields::EquationField') {
          if (field.notes == '' || !field.calculator) {
            _alert('提示信息', '【' + field.label + '】计算式不能为空');
            result = false;
            return false;
          }
        }
      });
    }
    if (!isVipSilver()) {
      var name = '';
      if (field._type == 'Fields::CRMCustomerField') {
        name = 'CRM客户字段';
        _alertVip('关联数据字段');
        result = false;
        return false;
      } else if (field._type == 'Fields::MEMBERCustomerField') {
        name = '通讯录成员字段';
      } else if (field._type == 'Fields::DEPTCustomerField') {
        name = '部门字段';
      } else if (field._type == 'Fields::DEPTCustomerField') {
        name = 'CRM客户字段';
      }
      if (name != '') {
        _alertVip('关联数据字段');
        result = false;
        return false;
      }
    }

    // if (!isVipGold(interfaceCode.INTERFACE_CODE_FORM) && field._type == "Fields::FORMREFCustomerField") {
    // 	_alertGoldVip("表单关联字段");
    // 	result = false;
    // 	result = false;
    // 	return false;
    // }

    if (field._type == 'Fields::FORMREFCustomerField') {
      if (!field.ref_id) {
        _alert('提示信息', '字段【' + field.label + '】关联表单不能为空！');
        result = false;
        return false;
      }

      if (!field.ref_cfg) {
        _alert('提示信息', '字段【' + field.label + '】关联表单不能为空！');
        result = false;
        return false;
      }

      if (field.ref_cfg) {
        var ref_cfg = field.ref_cfg;
        if (typeof ref_cfg == 'string') {
          ref_cfg = JSON.parse(ref_cfg);
        }
        if (!ref_cfg.show_fields || ref_cfg.show_fields.length == 0) {
          _alert('提示信息', '字段【' + field.label + '】显示字段不能为空！');
          result = false;
          return false;
        }

				 for (var i = 0; i < ref_cfg.show_fields.length; i++) {
                    	if (ref_cfg.show_fields[i] == '') {
                    		 _alert('提示信息', '字段【' + field.label + '】请选择关联字段！');
            result = false;
            return false;
                    	}
        }
        if (!ref_cfg.main_field) {
          _alert('提示信息', '字段【' + field.label + '】必须选择主字段！');
          result = false;
          return false;
        }
      }
    }


    if (field._type == 'Fields::Datasource') {
      if (!field.ref_type) {
        _alert('提示信息', '【' + field.label + '】请选择类型');
        result = false;
        return false;
      }

      if (!field.ref_url) {
        _alert('提示信息', '【' + field.label + '】链接地址不能为空');
        result = false;
        return false;
      }

      if (!field.ref_cfg) {
        _alert('提示信息', '【' + field.label + '】请配置字段');
        result = false;
        return false;
      }

      if (field.ref_cfg) {
        var ref_cfg = field.ref_cfg;
        if (typeof ref_cfg==='string') {
          ref_cfg = JSON.parse(ref_cfg);
        }
        if (!ref_cfg.datasource_fields || ref_cfg.datasource_fields.length == 0) {
          _alert('提示信息', '【' + field.label + '】请配置字段');
          result = false;
          return false;
        }

        var type = [];
        $(ref_cfg.datasource_fields).each(function(i, vo) {
          if (!vo.field_key) {
            _alert('提示信息', '【' + field.label + '】请选择字段');
            result = false;
            return false;
          }

          if (!vo.field_key) {
            _alert('提示信息', '【' + field.label + '】请选择字段类型');
            result = false;
            return false;
          }
          type.push(vo.field_type);

          if (!vo.field_name) {
            _alert('提示信息', '【' + field.label + '】请输入字段名称');
            result = false;
            return false;
          }
        });

        if (!result) { return false}


        if (type.indexOf('Id') < 0 && type.indexOf('IdShow') < 0) {
          _alert('提示信息', '【' + field.label + '】必须配置编号或编号(可见)');
          result = false;
          return false;
        }

        if (type.indexOf('MainField') < 0) {
          _alert('提示信息', '【' + field.label + '】必须配置主字段');
          result = false;
          return false;
        }

        if (type.indexOf('ParentId') < 0 && field.ref_type == 'DSCascadeDropDown') {
          _alert('提示信息', '【' + field.label + '】必须配置关联编号');
          result = false;
          return false;
        }
      }
    }
  });

	 // 生成script
  generateFormScript(get_GoldenData_options());
  return result;
}

/** 保存草稿 by tanwq 2016-4-20**/
function formSave() {
  // region start 临时删除
  // creat_template();
  // region end 临时删除
  var range = $('#range').val();
  if (range == '1') {
    $('#userCount').val('0');
  }
  clickSendRelevantStatus();
  if (range == '0') {
    changeFormSet(3);// 填写设置页面
    _alert('提示信息', '请选择目标对象');
    return;
  }
  var backReturn = checkSaveInfo('save');
  if (backReturn == false) {
    return;
  }
  if ($('#isTask').val() == '2') {
    if ($('#isFreeFlow').val() == '2' && $('#flowIds').val() == '') { // 固定流程
      changeFormSet(4);// 流程设置页面
      _alert('提示信息', '请选择固定流程');
      return;
    } else if ($('#isFreeFlow').val() == '3') {
      getFormFiledInfo();
      // 分支流程的保存
      update_flow_node_field_json();
      if (demo.addNodeInfo() && check_step2()) {
        $('#flowBranchJson').val(JSON.stringify(demo.exportData()));
      }else {
        return;
      }
    }else { // 自由流程
      var givenUserIds = $('#givenUserIds').val().split('|');
      var relativesMaxNum = parseInt($('#relativesMaxNum').val());
      var userLength = givenUserIds.length - 1;
      if (userLength > 1 && relativesMaxNum > 0 && userLength > relativesMaxNum) {
        changeFormSet(3);// 填写设置页面
        _alert('提示信息', '负责人不能超过所设置的人数');
        return;
      }
      if ($('#isFreeFlow').val() == '1' && $('#isDisableRelatives').is(':checked') == false && $('#givenUserIds').val() == '') {
        changeFormSet(3);// 填写设置页面
        _alert('提示信息', '不勾选“提单人可以自由选择负责人”时，必须添加默认负责人');
        return;
      }
    }
  }
  if ($('#deptIds').val() == '' && $('#userIds').val() == '' && range == '3') {
    changeFormSet(3);// 填写设置页面
    _alert('提示信息', '特定对象为空');
    return false;
  } else {
    $('#status').val('2');
    var choose_user_id = $('#userIds').val();
    if (choose_user_id.substring(choose_user_id.length - 1, choose_user_id.length) == '|') {
      $('#userIds').val(choose_user_id.substring(0, choose_user_id.length - 1));
    }
    $('#formField').val(generateChildFormString());
    if (operationType == 'update') {
      $('#myForm').attr('action', baseURL + '/form/formAction!ajaxUpdateForm.action');
    } else{
      $('#myForm').attr('action', baseURL + '/form/formAction!ajaxAdd.action');
    }
    for (var i = 0; i < _editors.values().length; i++) _editors.values()[i].sync();
    var regS = new RegExp(localport, 'g');

    $('#qf_content').val(ue.getContent());// 设置隐藏的文textarea
    if ($('#qf_content').val() != '') {
      $('#qf_content').val($('#qf_content').val().replace(regS, '@fileweb@'));
    };

    $(':button').attr('disabled', true);
    var c = new Dqdp();
    var b = {};
    b.dqdp_csrf_token = dqdp_csrf_token;
    showLoading('正在保存.....');
    if (c.submitCheck('myForm')) {
      $('#myForm').ajaxSubmit({
        dataType: 'json', 
        data: b, 
        async: true, 
        forceSync: true,
        success: function(a) {
          hideLoading();
          $(':button').attr('disabled', !1);
          if ('0' == a.code) {
            // 固定流程保存成功后把自由流程和分支流程设为禁用样式
            if ($('#isFreeFlow_2')[0].checked) {
              $('#isFreeFlow_1,#isFreeFlow_3').attr('disabled', true);
              $('.form-type-select label').eq(0).css({'color': '#bbb', 'cursor': 'default'});
              $('.form-type-select label').eq(2).css({'color': '#bbb', 'cursor': 'default'});
            }
            // 分支流程保存成功后把自由流程和固定流程设为禁用样式
            if ($('#isFreeFlow_3')[0].checked) {
              $('#isFreeFlow_1,#isFreeFlow_2').attr('disabled', true);
              $('.form-type-select label').slice(0, 2).css({'color': '#bbb', 'cursor': 'default'});
            }
            _alert('提交结果', a.desc, function(result) {
              // 设置状态和控制按钮显示与隐藏
              if (operationType != 'update') { // 不是编辑的时候
                $('#id').val(a.data.versionsId);
                operationType = 'update';// 将表单设置为编辑，防止下次点击保存后变成新增
              }
              GoldenData.formStringOrigin = generateChildFormString();
              try { // 因为新增的表单是没有没有字段信息的，所以会报错catch后重新初始化
                $('#form_design').html(formFiledDivHtmlInfo);
                renderChildForm(a.data.webHtml);
              } catch (e) {
                $('#form_design').html(formFiledDivHtmlInfo);
                var formJson = $.parseJSON('{\"description\":null,\"name\":null,\"token\":null,\"class_name\":\"Form\",\"ordered_fields\":[]}');
                renderChildForm(formJson);
                // 延时加载除去滚动条
                setTimeout('_resetFrameHeight()', 500);
              }
            });
                	}else { _alert('提交结果', a.desc)}
        },
        error: function() { hideLoading(); $(':button').attr('disabled', false); _alert('错误提示', '通讯故障') }
      });
    } else {
      $(':button').attr('disabled', false);
    }
  }
}
function tips_dialog(obj,e){
	if(!window.top.TrustAppData.form.isTrust){
		e.stopPropagation();
		var href = window.top.$('.form_app').find('a').attr('href');
		var tips = '尚未安装表单流程应用，无法正常选择人员，<a href="'+href+'" style="cursor: pointer">马上去安装 &gt;</a>'
		var position = $(obj).offset();
		var sroll = $(document).scrollTop();
		var content = $('<div class="tooltips" style="width:222px"><div class="tooltips-arrow" style="transform: rotate(180deg);top:60px;"></div><div class="tooltips-inner">'+tips+'</div></div>');
		var parentW = $(obj).outerWidth();
		$('body').children('.tooltips').remove();
		$('body').append(content);
		var top = -70;
		content.css({top:position.top+sroll+top+'px',left:position.left-(content.outerWidth()-parentW)/2+'px',})//(content.width()-parentW)/2
		$('body').click(function(){
			content.remove();
		});
		
	}
}
/** *发布***/
function publish(obj, e) {
  e.stopPropagation();
  creat_template();
  if (!window.top.TrustAppData.form.isTrust) {
    var href = window.top.$('.form_app').find('a').attr('href');
    var tips = '尚未安装表单流程应用，无法正常推送消息，<a href="' + href + '" style="cursor: pointer">马上去安装 &gt;</a>';
    var position = $(obj).offset();
    var sroll = $(document).scrollTop();
    var content = $('<div class="tooltips" style="width:222px"><div class="tooltips-arrow" style="transform: rotate(180deg);top:60px;"></div><div class="tooltips-inner">' + tips + '</div></div>');
    var parentW = $(obj).outerWidth();
    $('body').children('.tooltips').remove();
    $('body').append(content);
    var top = -70;
    content.css({top: position.top + sroll + top + 'px', left: position.left - (content.outerWidth() - parentW) / 2 + 'px' });// (content.width()-parentW)/2
    $('body').click(function() {
      content.remove();
    });
    return;
  }
  var backReturn = checkSaveInfo('publish');
  if (backReturn == false) {
    return;
  }
  var range = $('#range').val();
  $('#range').val(range);
  if (range == '1') {
    $('#userCount').val('0');
  }
  clickSendRelevantStatus();

  if ($('#isTask').val() == '2') {
    if ($('#isFreeFlow').val() == '2' && $('#flowIds').val() == '') { // 固定流程
      changeFormSet(4);// 流程设置页面
      _alert('提示信息', '请选择固定流程');
      return;
    } else if ($('#isFreeFlow').val() == '3') {
      getFormFiledInfo();
      update_flow_node_field_json();
      // 分支流程的保存
      if (demo.addNodeInfo() && check_step2()) {
        $('#flowBranchJson').val(JSON.stringify(demo.exportData()));
      }else {
        return;
      }
    } else{ // 自由流程
      var givenUserIds = $('#givenUserIds').val().split('|');
      var relativesMaxNum = parseInt($('#relativesMaxNum').val());
      var userLength = givenUserIds.length - 1;
      if (userLength > 1 && relativesMaxNum > 0 && userLength > relativesMaxNum) {
        changeFormSet(3);// 填写设置页面
        _alert('提示信息', '负责人不能超过所设置的人数');
        return;
      }
      if ($('#isFreeFlow').val() == '1' && $('#isDisableRelatives').is(':checked') == false && $('#givenUserIds').val() == '') {
        changeFormSet(3);// 填写设置页面
        _alert('提示信息', '不勾选“提单人可以自由选择负责人”时，必须添加默认负责人');
        return;
      }
    }
  }
  if ($('#isWriterRemind').attr('checked')) {
    var remindTime = $('#remindTime').val();
    if (remindTime == '' || remindTime == null) {
      changeFormSet(3);// 填写设置页面
      _alert('提示信息', '提醒时间不能为空');
      return;
    }
    var endTime = $('#endTime').val();
    var sTime2 = new Date(remindTime.toString().replace(/-/g, '/'));
    if (sTime2 < new Date()) {
      changeFormSet(3);// 填写设置页面
      _alert('提示信息', '提醒时间不能小于当前时间');
      return;
    }
    if (endTime != '' && endTime != null) {
      var eTime2 = new Date(endTime.toString().replace(/-/g, '/'));
      if (eTime2 < sTime2) {
        changeFormSet(3);// 填写设置页面
        _alert('提示信息', '结束重复只能是今天以后的时间');
        return;
      }
    }
  }
  if (range == '0') {
    changeFormSet(3);// 填写设置页面
    _alert('提示信息', '请选择目标对象');
    return;
  }

  if ($('#deptIds').val() == '' && $('#userIds').val() == '' && range == '3') {
    changeFormSet(3);// 填写设置页面
    _alert('提示信息', '特定对象为空');
    return false;
  } else {
    $('#status').val('1');
    var choose_user_id = $('#userIds').val();
    if (choose_user_id.substring(choose_user_id.length - 1, choose_user_id.length) == '|') {
      $('#userIds').val(choose_user_id.substring(0, choose_user_id.length - 1));
    }
    $('#formField').val(generateChildFormString());
    if (operationType == 'update') {
      $('#myForm').attr('action', baseURL + '/form/formAction!ajaxUpdateForm.action');
    } else{
      $('#myForm').attr('action', baseURL + '/form/formAction!ajaxAdd.action');
    } for (var i = 0; i < _editors.values().length; i++) _editors.values()[i].sync();
    var regS = new RegExp(localport, 'g');

    $('#qf_content').val(ue.getContent());// 设置隐藏的文textarea
    if ($('#qf_content').val() != '') {
      $('#qf_content').val($('#qf_content').val().replace(regS, '@fileweb@'));
    };

    $(':button').attr('disabled', true);
    var c = new Dqdp();
    var b = {};
    b.dqdp_csrf_token = dqdp_csrf_token;
    if (c.submitCheck('myForm')) {
      // if(promptInfo==1&&operationType=="update"&&isOldForm&&$("#isTask").val()=="2"&&$("#isFreeFlow").val()=="2"){//只有是旧表单为固定流程当前保存也为固定流程的时候且已经发布的状态下弹出提示框
      //	 _confirm("提示", "表单已升级，请在“流程设定”中将流程的“操作权限”勾选为可编辑，</br>否则用户提交表单后，负责人不可以编辑/修改", "去设置|暂不理会", {
      //		 ok:function(){
      //			 changeFormSet(4);
      //			 $(":button").attr("disabled",false);
      //			 return;
      //	     },fail:function(){
      //	    	 savePublish(b);
      //	     }
      //	 });
      //
      // }else{
      savePublish(b);
      // }
    } else {
      $(':button').attr('disabled', false);
    }
  }
}
function savePublish(b) {
  showLoading('正在发布.....');
  $('#myForm').ajaxSubmit({
    dataType: 'json', 
data: b, 
async: true, 
forceSync: true,
    success: function(a) {
      hideLoading();
      $(':button').attr('disabled', !1);
      var isPublish = promptInfo == 1 ? '保存成功':'发布成功';
      if ($('#status').val()) {
        if ('0' == a.code) {
          // 固定流程保存成功后把自由流程和分支流程设为禁用样式
          if ($('#isFreeFlow_2')[0].checked) {
            $('#isFreeFlow_1,#isFreeFlow_3').attr('disabled', true);
            $('.form-type-select label').eq(0).css({'color': '#bbb', 'cursor': 'default'});
            $('.form-type-select label').eq(2).css({'color': '#bbb', 'cursor': 'default'});
          }
          // 分支流程保存成功后把自由流程和固定流程设为禁用样式
          if ($('#isFreeFlow_3')[0].checked) {
            $('#isFreeFlow_1,#isFreeFlow_2').attr('disabled', true);
            $('.form-type-select label').slice(0, 2).css({'color': '#bbb', 'cursor': 'default'});
          }
          _alert('提交结果', isPublish, function(result) {
            GoldenData.formStringOrigin = generateChildFormString();
            if (promptInfo == 1) {
              try { // 因为新增的表单是没有没有字段信息的，所以会报错catch后重新初始化
                $('#form_design').html(formFiledDivHtmlInfo);
                renderChildForm(a.data.webHtml);
              } catch (e) {
                $('#form_design').html(formFiledDivHtmlInfo);
                var formJson = $.parseJSON('{\"description\":null,\"name\":null,\"token\":null,\"class_name\":\"Form\",\"ordered_fields\":[]}');
                renderChildForm(formJson);
                // 延时加载除去滚动条
                setTimeout('_resetFrameHeight()', 500);
              }
              setTimeout(function() {
                if ($('.sf-add-ziduanbox').length == 0) {
                  $('.sidebar').after('<div class="sf-add-ziduanbox"></div>');
                }
              }, 500);
            } else {
              document.location.href = baseURL + '/manager/form/list_new.jsp';
            }
          });
        }else { _alert('提交结果', a.desc)}
      }
    },
    error: function() { hideLoading(); $(':button').attr('disabled', false); _alert('错误提示', '通讯故障') }
  });
}
// 申报为模板
function addTemplate() {
  creat_template();

	 var TEXT = '分享的模板通过企微审核后，可在模板中心查看并使用<br>（模板仅保留“表单字段”信息，感谢您的添砖加瓦）';
  if (hasFormRef()) {
     	TEXT = '分享的模板通过企微审核后，可在模板中心查看并使用<br>存在的关联表单将一并分享<br>（模板仅保留“表单字段”信息，感谢您的添砖加瓦）';
  }

  _confirm('提示', TEXT, '分享|暂不分享', {ok: function() {
    doAddTemplate();
  }}, true);
}
function doAddTemplate() {
  var backReturn = checkSaveInfo('publish');
  if (backReturn == false) {
    return;
  }
  var range = $('#range').val();
  $('#range').val(range);
  if (range == '1') {
    $('#userCount').val('0');
  }
  var flag0 = document.getElementById('isApproval').checked;
  if (flag0 == true) {
    if ($('#isFreeFlow').val() == '2' && $('#flowIds').val() == '') { // 固定流程
      changeFormSet(4);// 填写设置页面
      _alert('提示信息', '请选择固定流程');
      return;
    }else { // 自由流程
      var givenUserIds = $('#givenUserIds').val().split('|');
      var relativesMaxNum = parseInt($('#relativesMaxNum').val());
      var userLength = givenUserIds.length - 1;
      if (userLength > 1 && relativesMaxNum > 0 && userLength > relativesMaxNum) {
        changeFormSet(3);// 填写设置页面
        _alert('提示信息', '负责人不能超过所设置的人数');
        return;
      }
    }
  }
  if (range == '0') {
    changeFormSet(3);// 填写设置页面
    _alert('提示信息', '请选择目标对象');
    return;
  }
  if ($('#deptIds').val() == '' && $('#userIds').val() == '' && range == '3') {
    changeFormSet(3);// 填写设置页面
    _alert('提示信息', '特定对象为空');
    return false;
  } else {
    $('#status').val('1');
    var choose_user_id = $('#userIds').val();
    if (choose_user_id.substring(choose_user_id.length - 1, choose_user_id.length) == '|') {
      $('#userIds').val(choose_user_id.substring(0, choose_user_id.length - 1));
    }
    $('#formField').val(generateChildFormString());
    $('#myForm').attr('action', baseURL + '/form/formAction!addFormTemplate.action');
    for (var i = 0; i < _editors.values().length; i++) _editors.values()[i].sync();
    var regS = new RegExp(localport, 'g');
    $('#qf_content').val(ue.getContent());// 设置隐藏的文textarea
    if ($('#qf_content').val() != '') {
      $('#qf_content').val($('#qf_content').val().replace(regS, '@fileweb@'));
    };

    $(':button').attr('disabled', true);
    var c = new Dqdp();
    var b = {};
    b.dqdp_csrf_token = dqdp_csrf_token;
    if (c.submitCheck('myForm')) {
      $('#myForm').ajaxSubmit({
        dataType: 'json',
 data: b, 
async: false, 
forceSync: true,
        success: function(a) {
          $(':button').attr('disabled', !1);
          if ('0' == a.code) {
            _top_alert('模版提交成功，请等待审核');
          }else {
            _top_alert(a.desc, false);
          }
        },
        error: function() { $(':button').attr('disabled', false); _alert('错误提示', '通讯故障') }
      });
    } else {
      $(':button').attr('disabled', false);
    }
  }
}

// 流程分支 的初始化代码
var property = {
  width: 460,
  height: 500,
  // toolBtns:["start","end","task","node","chat","state","plug","join","fork","complex"],
  toolBtns: ['task'],
  haveHead: false,
  headBtns: ['undo', 'redo'], // 如果haveHead=true，则定义HEAD区的按钮
  haveTool: true,
  haveGroup: false,
  useOperStack: true,
  haveMax: true
};
var remark = {
  cursor: '选择指针',
  direct: '转换连线',
  start: '开始结点',
  end: '结束结点',
  task: '任务结点'
  // node:"自动结点",
  // chat:"决策结点",
  // state:"状态结点",
  // plug:"附加插件",
  // fork:"分支结点",
  // "join":"联合结点",
  // complex:"复合结点",
  // group:"组织划分框编辑开关"
};
var demo;
function initFenzhi(json) {
  demo = $.createGooFlow($('#demo'), property);
  demo.setNodeRemarks(remark);
  demo.onItemDel = function(id, type) {
    if (type == 'node') {
      return confirm('确定要删除“' + this.getItemInfo(id, type).nodeName + '”节点吗?');
    } else{
      return confirm('确定要删除该连线吗?');
    }
  };
  var other = {};
  other['is_lading'] = 1;
  other['isCanEnd'] = false;
  other['isChoice'] = false;
  other['isQuery'] = false;
  other['isSign'] = false;
  other['hasChoiceNode'] = false;
  other['nodeType'] = 0;
  other['condition'] = [];
  other['isSoter'] = false;

  var other1 = {};
  other1['is_lading'] = 1;
  other1['isCanEnd'] = false;
  other1['isChoice'] = false;
  other1['isQuery'] = false;
  other1['isSign'] = false;
  other1['hasChoiceNode'] = false;
  other1['nodeType'] = 0;
  other1['condition'] = [];
  other1['isSoter'] = false;
  var jsondata = {'title': '分支流程设置',
    'nodes': {'start_node': {nodeId: uuid(), 'nodeName': '填写表单', 'left': 152, 'top': 20, 'type': 'start', 'width': 45, 'height': 24, 'nodeProperty': '0', 'other': other},
      'end_node': {nodeId: uuid(), 'nodeName': '结束节点', 'left': 152, 'top': 427, 'type': 'end', 'width': 45, 'height': 24, 'nodeProperty': '2', 'other': other1}},
    'lines': {},
    'areas': {},
    flowId: uuid()
  };
  demo.$max = 1;
  if (json) {
    jsondata = json;
    demo.$max = jsondata.max;
  }
  demo.loadData(jsondata);

  $('#flow_fenzhi_node').on('click', '.fixedFlow_edit .top span', fixedFlow.switchTab);
}
function ExportData() {
  demo.addNodeInfo();
  if (check_step2()) {
    // 发送请求数据
    $('#flowBranchJson').val(JSON.stringify(demo.exportData()));
  }
}
/** *验证是否为金卡vip**/
function checkIsGoldVip(obj, tip) {
  if ($(obj).is(':checked') && !isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
    $(obj).attr('checked', false);
    _alertGoldVip(tip);
  }
}
/** *验证是否为金卡vip**/
function checkIsVip(obj, tip) {
  if ($(obj).is(':checked') && !isVipSilver()) {
    $(obj).attr('checked', false);
    _alertVip(tip);
  }
}
/* 设置标题弹框*/
function title_set() {
  var titleTemplate = $('[name="tbFormControlPO.titleTemplate"]').val();
  var isBuildTitle = $('[name="tbFormControlPO.isBuildTitle"]').val();
  var isUpdaeTitle = $('[name="tbFormControlPO.isUpdaeTitle"]').val();
  var isBuildSort = $('[ name="tbFormControlPO.isBuildSort"]').val();
  var thtml = $('.form-title-input').html();
  var formFiled = JSON.parse(GoldenData.generateFormString(GoldenData.form));
  var $dialog = $('<div class="pop_wrap7" style="width: 600px; display: block;">'+
		'<div class="SS_tit"> <span>表单标题高级设置</span><i class="btnclose">×</i> </div>'+
		'<div class="form-dialog-tmain">'+
		'<div>表单标题<span class="c999">（微信端仅显示前100字）</span></div>'+
		'<div class="form-title-input" onpaste="preventPaste(event)" tabindex="1"  contenteditable="true" placeholder="输入标题内容或选择字段"></div>'+
		'<div class="c999">例：“审批单_年月日” 可自动生成“审批单_20171212”</div>'+
		'<div class="clearfix pb20 form-title-set">'+
		'<div class="fl">'+
		'<div style="padding:15px 0 8px">可选表单字段</div>'+
		'<div class="form-title-setl">'+
		'<ul>'+
		'<div  class="c999 pl10" >没有可选择字段</div>'+
		'</ul>'+
		'</div>'+
		'</div>'+
		'<div class="fl ml20">'+
		'<div style="padding:15px 0 8px">日期时间</div>'+
		'<div class="form-title-setr">'+
		'<ul>'+
		'<input type="button" attrid="yyyy_MM_dd_HH_mm_ss_E" value="年_月_日_时_分_秒_星期X">'+
		'<input type="button"  attrid="yyyy_MM_dd_HH_mm_ss" value="年_月_日_时_分_秒">'+
		'<input type="button"  attrid="yyyyMMdd HHmmss" value="年月日 时分秒">'+
		'<input type="button"  attrid="yyyyMMddHHmmss" value="年月日时分秒">'+
		'<input type="button"  attrid="yyyy/MM/dd HH:mm" value="年/月/日 时:分">'+
		'<input type="button"  attrid="yyyyMMddHHmm" value="年月日时分">'+
		'<input type="button"  attrid="yyyyMMdd" value="年月日">'+
		'<input type="button"  attrid="yyyy" value="年">'+
		'<input type="button"  attrid="E" value="星期X">'+

		'</ul>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'<div class="form-title-val" style="line-height:25px;">'+
		'<label><input type="checkbox" name="isBuildSort">自动生成标题序号</label><br>'+
		'<label><input type="checkbox" name="isBuildTitle">填单时生成标题<span class="c999">（勾选后标题无内容时，使用表单名称）</span></label><br>'+
		'<label><input type="checkbox" name="isUpdaeTitle">填单时可以修改标题</label>'+
		'</div>'+
		'</div>'+
		'<div class="SS_btn" style="margin-top:0;"> <input type="button" value="确定" class="btn orangeBtn twoBtn mr10 mb0"> </div>'+
		'</div>');
  $dialog.find('[name=isBuildTitle]').attr('checked', isBuildTitle==1);
  $dialog.find('[name=isUpdaeTitle]').attr('checked', isUpdaeTitle==1);
  $dialog.find('[name=isBuildSort]').attr('checked', isBuildSort==1);
  $dialog.find('.form-title-val input').on('click', function() {
    var name = $(this).attr('name');
    $('[name="tbFormControlPO.' + name + '"]').val(this.checked ? 1:0);
  });
  var arr = ['Fields::TextField', 'Fields::TextArea', 'Fields::NumberField', 'Fields::EmailField', 'Fields::TelephoneField', 'Fields::MobileField', 'Fields::DropDown'];// 'Fields::RadioButton',
  var $li = '<input type="button" attrid="create_user_name" value="提单人"><input type="button" attrid="create_user_dept" value="提单人部门">';
  for (var i = 0; i < formFiled.length; i++) {
    if (arr.indexOf(formFiled[i]._type) != -1) {
      $li += '<input type="button" attrid="' + formFiled[i]._id + '" value="' + formFiled[i].label + '">';
    }
  }
  if ($li == '') { $li = '<div  class="c999 pl10" >没有可选择字段</div>' };
  $dialog.find('.form-title-setl ul').html($li);
  $dialog.find('.form-title-setl input,.form-title-setr input').click(function(e) {
    e.preventDefault();
    if (!isVipSilver() && $(this).parents('.form-title-setl').length > 0) {
      _alertVipOnTrialLink('');
      return;
    }
    var len = $dialog.find('.form-title-input span').length;
    if (len >= 10) {
      _top_alert('模板字段不能超10个', false);
      return;
    }
    var text = $(this).val();
    var attrid = $(this).attr('attrid');
    $dialog.find('.form-title-input').focus();
    window.top.pasteHtmlAtCaret('<span attrid="' + attrid + '" contenteditable="false">' + text + '</span>&nbsp;');
  });
  $dialog.find('.btnclose').click(function() {
    window.top.$('#overlayDiv').hide();
    $dialog.remove();
  });
  $dialog.find('.SS_btn input').click(function() {
    var copy = $dialog.find('.form-title-input').clone();
    $('[name="tbFormDetailsPO.title"]').val(copy.text());
    $('.form-title-input').html(copy.html());

    copy.find('span').each(function(i, e) {
      $(e).replaceWith('{' + $(e).attr('attrid') + '}');
    });
    $('[name="tbFormControlPO.titleTemplate"]').val(copy.html().replace(/<br>/g, ''));
    $dialog.find('.btnclose').click();
  });

  $dialog.find('.form-title-input').html(thtml);
  window.top.$('#overlayDiv').show();
  window.top.$('body').append($dialog);
  window.top.$.getScript(baseURL + '/themes/manager/form/paste.js');
}
function creat_template() {
  var copy = $('.form-title-input').clone();
  $('[name="title"]').val(copy.text());
  copy.find('span').each(function(i, e) {
    $(e).replaceWith('{' + $(e).attr('attrid') + '}');
  });
  $('[name="title_template"]').val(delHtmlTag(copy.html()));
  function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, '');// 去掉所有的html标记
  }
}
function get_qyFlowNodeList() {
  function get_fixed() {
    var countData = [], nodeData = [];
    $('.fixedFlow_content li').each(function(i, el) {
      var data = $(el).data('nodep');
      if (data)countData.push(data);
    });
    $.each(countData, function(i, val) {
      nodeData.push({
        flowId: val.flowId,
        nodeId: val.id,
        nodeName: val.nodeName
      });
    });
    return nodeData;
  }
  function get_branch() {
    var data = demo.exportData(), nodeData = [];
    var flowId = data.flowId, nodes = data.nodes;
    for (var i in nodes) {
      if (i != 'end_node' && i != 'start_node') {
        nodeData.push({
          flowId: flowId,
          nodeId: nodes[i].nodeId,
          nodeName: nodes[i].nodeName
        });
      }
    }
    return nodeData;
  }
  var $list = $('#node_data_list'), $str = $('[name="qyFlowNodeCallbackList"]');
  var oldData = $list.data('nodeData');
  var isFreeFlow = $('#isFreeFlow').val(), nodeData = [];
  if (isFreeFlow == 2) {
		 nodeData = get_fixed();
    if (nodeData.length == 0) { _alert('提示', '请先在【流程设置】中选择流程'); return}
  } else if (isFreeFlow == 3) {
    nodeData = get_branch();
    if (nodeData.length == 0) { _alert('提示', '请先在【流程设置】中选择流程'); return}
  }else {
    _alert('提示', '请先在【流程设置】中选择流程');
    return;
  }
  var $dialog = $('<div class="pop_wrap7" style="width: 480px; display: block;">'+
		'<div class="SS_tit"> <span>请选择需要同步的审批节点</span><i class="btnclose">×</i> </div>'+
		'<div class="pop_wrap6_main clearfix">'+
		'<div class="select_list_r mt20" style="width:100%;">'+
		//+'<ul class="select_list">'
		//+'<li class="clearfix"><span>二级选项1</span><input value="二级选项1" class="ipt-cb" type="checkbox"></li>'
		//+'<li class="clearfix"><span>二级选项2</span><input value="二级选项2" class="ipt-cb" type="checkbox"></li>'
		//+'</ul>'
		'</div>'+
		'</div>'+
		'<div class="SS_btn" style="margin-top:0;"> <input type="button" value="确定" class="btn orangeBtn twoBtn mr10 mb0"></div>'+
		'</div>');
  var $ul = $('<ul class="select_list"></ul>');
  for (var i = 0; i < nodeData.length; i++) {
    $ul.append($('<li class="clearfix"><span>' + nodeData[i].nodeName + '</span><input id="' + nodeData[i].nodeId + '" class="ipt-cb" type="checkbox"></li>').data('nodeData', nodeData[i]));
  }
  if (oldData) {
    $.each(oldData, function(i, val) {
      $('#' + val.nodeId, $ul).attr('checked', 'checked');
    });
  }

  $dialog.find('.select_list_r').append($ul);
  $dialog.find('.btnclose').click(function() {
    window.top.$('#overlayDiv').hide();
    $dialog.remove();
  });
  $dialog.find('.SS_btn input').click(function() {
    var nodeData = [];
    $dialog.find('.select_list li>input:checked').parent('li').each(function() {
      nodeData.push($(this).data('nodeData'));
    });
    $list.data('nodeData', nodeData);
    append_node_item($list, $str);
    $dialog.find('.btnclose').click();
  });
  window.top.$('#overlayDiv').show();
  window.top.$('body').append($dialog);
}
function append_node_item(obj, $str) {
  var data = $(obj).data('nodeData');
  $(obj).html('');
  if (data.length > 0) {
    $str.val(JSON.stringify(data));
    $.each(data, function(i, val) {
      $(obj).append($('<span class="span-item"><span>' + val.nodeName + '</span><span class="close">×</span></span>').data('nodeData', val));
    });
    $(obj).on('click', '.close', function() {
      $(this).parent().remove();
      var nodeData = [];
      $(obj).find('.span-item').each(function(i, ele) {
        nodeData.push($(ele).data('nodeData'));
      });
      $str.val(JSON.stringify(nodeData));
      $(obj).data('nodeData', nodeData);
    });
  } else{
    $str.val('');
  }
}

function isVipSilver() {
  return true;
}
