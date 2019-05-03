/*
 * @Author: linyue
 * @Date:   2016-09-19 14:22:59
 * @Last Modified by:   linyue
 * @Last Modified time: 2016-09-23 17:49:49
 */
var  baseURL ="";
var SelectionPlugIn;
var ConfiData = "";
var targetDept = "";
var targetUser = "";
var item_id = null;
$(function() {
	makeSelectEnt();
	var window_top = $(window.top.document);
	var chooseType = $("#chooseType").val();
	if (chooseType && chooseType == "1") {
		$("#chooseUserDivId").hide();
	}
	if (window_top.find("#pop_wrap6").length == 0) {//判断选人模块已经初始化
		SelectionPlugIn = new selectionPlugIn();
	} else if (!SelectionPlugIn) {//判断选人模块在其他功能模块页面已经初始化
		window_top.find("#pop_wrap6").remove();
		SelectionPlugIn = new selectionPlugIn();
	}
    SelectionPlugIn.firstOpen = true;
	$('body').on("click", ".label_radio", function() {
		$(this).addClass('active').siblings('.label_radio').removeClass('active');
		$(this).children('input').attr('checked', 'true');
		if ($(this).children('input').hasClass('radio_specified')) {//选择特定对象
			$(this).siblings(".range").val("3");
			$(this).parent().siblings(".chooseDeptAndUs").show();

		} else if ($(this).children('input').hasClass('radio_all')) {//选择所有人
			$(this).siblings(".range").val("1");
			$(this).parent().siblings(".chooseDeptAndUs").hide();
		}
	});
	$("body").on("click", ".addDeptUser", function() {
		var targetDept_n = "";
		var targetUser_n = "";
		var obj=$(this);
        var judgeType = "";//判断选人类型
		if (SelectionPlugIn.firstOpen) {//判断当前页面是否第一次打开选人弹框
            SelectionPlugIn.firstOpen = false;
			//SelectionPlugIn.groupInit();
            SelectionPlugIn.deptinit();
			SelectionPlugIn.searchUserDept("searchCreator", "2");
		}
		item_id = obj.parents(".chooseDeptAndUs").parent().attr("id");
		var callback = getCallback(item_id);
		// alert(id);
		layer.open({
            title:'选择人员',
            type: 2, 
            // btn: ['确定','取消'], //按钮
            area: ['95%', '95%'],
			content: "/base/org/membselect/?id=", 
			//这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
            // yes: function(index, layero){
            //     var arr = $(window.frames[0].document).find("input[type='checkbox']:checked");
            //     var personArr=[];
            //     arr.each(function(index,val){
            //         var id = $(val).data('id');
            //         var name = $(val).data('name');
            //         personArr.push({id:id,name:name});
            //     });
            
            //     layer.close(index); //如果设定了yes回调，需进行手工关闭
            //     createTeamworkers(personArr);
			// }
			success: function(layero, index){
			  	// var body = layer.getChildFrame('body', index);
			  	console.log(layero);
			  	var name = layero.find('iframe')[0]['name'];
				//var win = window[name].frames;
				var win = window[name];
				console.log(win);
				win.setCallback(obj, callback, submitMembSelect);
				console.log(callback);
			  
				// iframeWin.setCallback(callback); 
				// console.log(body.html()) //得到iframe页的body内容
				// body.find('input').val('Hi，我是从父页来的')
			}
		});
		
		// loadIframeDialog("/tenant/common/addressbook/membSelect/?id=", {title: '选择人员',
		// btn: ['确定','取消'], //按钮
		// yes: function(index, layero){
		// 	var arr = $(window.frames[0].document).find("input[type='checkbox']:checked");
		// 	var personArr=[];
		// 	arr.each(function(index,val){
		// 		var id = $(val).data('id');
		// 		var name = $(val).data('name');
		// 		personArr.push({id:id,name:name});
		// 	});
		
		// 	layer.close(index); //如果设定了yes回调，需进行手工关闭
		// 	createTeamworkers(personArr);
		// },
        //     end: function(index, layero){
        //         //do something
        //         //mainTable.reload();
        //     }},false);
	
		//SelectionPlugIn.deptinit();
		// SelectionPlugIn.tagInit();
		if ($(this).parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".ConfiIndex").length != 0) {//是否配置选人的序号
			var ConfiIndex = $(this).parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".ConfiIndex").val();
			if (!ConfiIndex || ConfiIndex == "") {//选人序号是否被重置
				var itemId = $(this).parents(".chooseDeptAndUs").parent().attr("id");
				for (var t = 0; t < ConfiData.length; t++) {
					if (ConfiData[t].itemId == itemId) {//当前选人模块id是否相符
						ConfiIndex = t;
					}
				}
			}
			if (ConfiData[ConfiIndex].hasOwnProperty("batchNum")) {//判断是否配置了批量导入是上限
				window_top.find(".pop_wrap6 .batchNum").val(ConfiData[ConfiIndex].batchNum);
				window_top.find("#ready-s").html("0/" + ConfiData[ConfiIndex].batchNum);
			} else {
				window_top.find(".pop_wrap6 .batchNum").val("100");
				window_top.find("#ready-s").html("0/100");
			}
			if (ConfiData[ConfiIndex].hasOwnProperty("userRestriction")) {//是否配置选人上限
				window_top.find(".pop_wrap6 .userRestriction").val(ConfiData[ConfiIndex].userRestriction);
				if(ConfiData[ConfiIndex].userRestriction==1){
					window_top.find(".pop_wrap6 .tab_batch").hide();
					window_top.find(".pop_wrap6 .select_main_group .select_list_r_top").hide();
				}
			} else {
				window_top.find(".pop_wrap6 .userRestriction").val("1000");
			}
			if (ConfiData[ConfiIndex].hasOwnProperty("deptRestriction")) {//是否配置选部门上限
				window_top.find(".pop_wrap6 .deptRestriction").val(ConfiData[ConfiIndex].deptRestriction);
			} else {
				window_top.find(".pop_wrap6 .deptRestriction").val("500");
			}
			if (ConfiData[ConfiIndex].hasOwnProperty("tagRestriction")) {//是否配置选标签上限
				window_top.find(".pop_wrap6 .tagRestriction").val(ConfiData[ConfiIndex].tagRestriction);
			} else {
				window_top.find(".pop_wrap6 .tagRestriction").val("500");
			}
			if (ConfiData[ConfiIndex].hasOwnProperty("targetDept")) {//是否配置选部门范围
				targetDept_n = ConfiData[ConfiIndex].targetDept;
                judgeType += "4";
			}
			if (ConfiData[ConfiIndex].hasOwnProperty("targetUser")) {//是否配置选人员范围
				targetUser_n = ConfiData[ConfiIndex].targetUser;
                judgeType += "4";
			}
		}
		if (targetDept_n != targetDept || targetUser_n != targetUser) {//当前选人与上次选人范围是否一致
			targetDept = targetDept_n;
			targetUser = targetUser_n;
			SelectionPlugIn.deptinit();
		}
		var deptIds = obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".deptIds").val();
		var tagIds = obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".tagIds").val();
		var userIds = obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".userIds").val();
		window_top.find(".pop_wrap6 .deptSet").val(deptIds);
		window_top.find(".pop_wrap6 .tagSet").val(tagIds);
		window_top.find(".pop_wrap6 .PersonnelSet").val(userIds);
		var deptset = obj.parent().siblings(".selected").children(".append_item").clone();
		var tagset = obj.parent().siblings(".selected").find(".tagList .append_item").clone();
		var userset = obj.parent().siblings(".selected").find(".personnelList .append_item").clone();
		window_top.find(".pop_wrap6 .selected .append_item").remove();
		window_top.find(".pop_wrap6 .selected .personnelList").prepend(userset);
		window_top.find(".pop_wrap6 .selected .tagList").prepend(tagset);
		window_top.find(".pop_wrap6 .selected").prepend(deptset);

		if (obj.siblings(".selectedDept").length != 0) {//是否可以选部门
			judgeType += "1";
		}
		if (obj.siblings(".selectedTag").length != 0) {//是否可以选标签
			judgeType += "2";
		}
		if (obj.siblings(".selectedUser").length != 0) {//是否可以选人员
			judgeType += "3";
		}
		if(judgeType.indexOf("1")==-1){
			SelectionPlugIn.toUser = 1;
		}else{
			SelectionPlugIn.toUser = "";
		}
		SelectionPlugIn.judgeType(judgeType);
		SelectionPlugIn.submit_choose(obj);
		window_top.find(".pop_wrap6 .SS_tit i").unbind().bind("click",function() {
			SelectionPlugIn.close_pop_wrap6();
			var id = obj.parents(".chooseDeptAndUs").parent().attr("id");
			for (var i = 0; i < ConfiData.length; i++) {
				if (ConfiData[i].itemId == id) {
					if (ConfiData[i].callback && ConfiData[i].callback.submit) {
						ConfiData[i].callback.submit();
					}
					break;
				}
			}
		});
		SelectionPlugIn.selected_init();
		window_top.find(".overlay").eq(0).show();
		window_top.find(".pop_wrap6").css({
			top: $(window.top).scrollTop() + 50
		});
		if (window_top.find(".pop_wrap6 .personnelList .append_item").length == 0 && window_top.find(".pop_wrap6 .selected>.append_item").length == 0&&window_top.find(".pop_wrap6 .tagList .append_item").length == 0 ) {//是否已有选择人员，部门，标签
			window_top.find(".pop_wrap6 .P_search").width("520px").css({
				"margin-top": "0px"
			}).attr("placeholder", "输入搜索条件");
		} else {
			window_top.find(".pop_wrap6 .P_search").width("1px").css({
				"margin-top": "8px"
			}).removeAttr("placeholder");
		}
		window_top.find(".pop_wrap6").show();
	});
	$("body").on("click",".chooseDeptAndUs .clearSelected",function(){
		$(this).hide();
		$(this).parent().siblings(".selected").remove();
		$(this).siblings(".selectedDept").text(0);
		$(this).siblings(".selectedTag").text(0);
		$(this).siblings(".selectedUser").text(0);
		var deptIds = $(this).parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".deptIds");
		var tagIds = $(this).parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".tagIds");
		var userIds = $(this).parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".userIds");
		var itemid = $(this).parents(".chooseDeptAndUs").parent().attr("id");
		for(var i =0;i<ConfiData.length;i++) {
			if (ConfiData[i].itemId == itemid) {//判断当前选人模块id是否相符
				if (ConfiData[i].callback&&ConfiData[i].callback.remove) {//判断是否配置移除已选的回调函数
					ConfiData[i].callback.remove({userId:userIds.val(),deptId:deptIds.val(),tagId:tagIds.val()});
				}
				break;
			}
		}
		deptIds.val("");
		tagIds.val("");
		userIds.val("");
	})
})

// 获取回调函数，-----此为新增方法
function getCallback(id){
	var callback;
	var deptset = $(".pop_wrap6 .selected>.append_item");
	var tagset = $(".pop_wrap6 .selected>.tagList>.append_item");
	var userset = $(".pop_wrap6 .selected>.personnelList>.append_item");
    for (var i = 0; i < ConfiData.length; i++) {
        if (ConfiData[i].itemId == id) {
            if (ConfiData[i].callback&&ConfiData[i].callback.submit) {
                var userlist = [];
                var taglist = [];
                var deptlist = [];
                deptset.each(function(t) {
                    var obj = {
                        "deptId": $(this).find("input").val(),
                        "deptName": $(this).text().substring(0, $(this).text().length - 1)
                    };
                    deptlist.push(obj);
                });
                tagset.each(function(t) {
                    var obj = {
                        "tagId": $(this).find("input").val(),
                        "tagName": $(this).text().substring(0, $(this).text().length - 1)
                    };
                    taglist.push(obj);
                });
                userset.each(function(t) {
                    var obj = {
                        "userId": $(this).find("input").val(),
                        "personName": $(this).text().substring(0, $(this).text().length - 1),
                        "headPic": $(this).find("img").attr("src")
                    };
                    userlist.push(obj);
                });
                data = {
                    "userList": userlist,
                    "tagList": taglist,
                    "deptList": deptlist
                }
                callback = ConfiData[i].callback.submit;
            }
            break;
        }
    }
    return callback;
}
// 提交人员选择函数，-----此为新增方法
function submitMembSelect(obj, callback, data){
	callback && callback(data);
	if (!data.userList || data.userList.length == 0) {
		obj.parent().siblings(".selected").remove();
		obj.siblings(".clearSelected").hide();
	} else {
		obj.parent().siblings(".selected").remove();
		obj.siblings(".clearSelected").show();
		obj.parent().after('<div class="selected"></div>');
		//obj.parent().siblings(".selected").append(deptset);
		//obj.parent().siblings(".selected").append('<div class="tagList"></div>');
		//obj.parent().siblings(".selected").find(".tagList").append(tagset);
		obj.parent().siblings(".selected").append('<div class="personnelList"></div>');
		var personnelList = obj.parent().siblings(".selected").find(".personnelList");
		for(var i=0;i<data.userList.length;i++){
			var user = data.userList[i];
			console.log(user)
			var el='<div class="append_item"><img src="'+user.headPic+'">'+user.personName+'<input type="hidden" data-name="'+user.personName+'" value="'+user.userId+'"><span class="close">×</span></div>';
			personnelList.append(el);
		}
		$("#" + item_id + " .selectedUser").html(data.userList.length);
		//obj.parent().siblings(".selected").find(".personnelList").append(userset);
	}
}

///构造新增和编辑页面的选人入口
function makeSelectEnt(num) {
	var index = num || 0;
	if (ConfiData != "") {//判断是否有选人配置
		var str = ""
		for (var i = index; i < ConfiData.length; i++) {
			$("#" + ConfiData[i].itemId + " .form-id-num-wrap").remove();
			$("#" + ConfiData[i].itemId + " .chooseDeptAndUs").remove();
			str = "";
			if (ConfiData[i].viewPosition == "right") {//判断选人入口的位置
				str += '<div class="form-field form-id-num-wrap">';
			} else {
				str += '<div class="form-id-num-wrap">';
			}
			if (ConfiData[i].hasOwnProperty("radioAllIpt_id")) {//是否配置选人入口按钮id
				var radioName = "a1";
				if (ConfiData[i].hasOwnProperty("radioName")) {//是否配置选人入口按钮name
					radioName = ConfiData[i].radioName;
				}
				str += '<div class="label_radio active">' + '<input type="radio" id="' + ConfiData[i].radioAllIpt_id + '"name="' + radioName + '" class="radio_all" checked="checked"><label for="' + ConfiData[i].radioAllIpt_id + '" id="' + ConfiData[i].radioAllLab_id + '">所有人</label>' + '</div>' + '<div class="label_radio">' + '<input type="radio" id="' + ConfiData[i].radioSpecifiedIpt_id + '"name="' + radioName + '" class="radio_specified"><label for="' + ConfiData[i].radioSpecifiedIpt_id + '" id="' + ConfiData[i].radioSpecifiedLab_id + '"> 特定对象</label>' + '</div>';
			}
			if (ConfiData[i].hasOwnProperty("deptDataId")) {//是否配置存选部门input的id
				if (ConfiData[i].hasOwnProperty("deptDataName")) {//是否配置存选部门input的name
					str += '<input type="hidden" id="' + ConfiData[i].deptDataId + '" name="' + ConfiData[i].deptDataName + '" class="deptIds">';
				} else {
					str += '<input type="hidden" id="' + ConfiData[i].deptDataId + '" name="' + ConfiData[i].deptDataId + '" class="deptIds">';
				}
			}
			if (ConfiData[i].hasOwnProperty("tagDataId")) {//是否配置存选标签input的id
				if (ConfiData[i].hasOwnProperty("tagDataName")) {//是否配置存选标签input的name
					str += '<input type="hidden" id="' + ConfiData[i].tagDataId + '" name="' + ConfiData[i].tagDataName + '" class="tagIds">';
				} else {
					str += '<input type="hidden" id="' + ConfiData[i].tagDataId + '" name="' + ConfiData[i].tagDataId + '" class="tagIds">';
				}
			}
			if (ConfiData[i].hasOwnProperty("userDataId")) {//是否配置存选人input的id
				if (ConfiData[i].hasOwnProperty("userDataName")) {//是否配置存选人input的name
					str += '<input type="hidden" id="' + ConfiData[i].userDataId + '" name="' + ConfiData[i].userDataName + '" class="userIds">';
				} else {
					str += '<input type="hidden" id="' + ConfiData[i].userDataId + '" name="' + ConfiData[i].userDataId + '" class="userIds">';
				}
			}
			if (ConfiData[i].hasOwnProperty("range")) {//是否配置rang
				var range_name = ConfiData[i].range;
				if (ConfiData[i].hasOwnProperty("rangeName")) {
					range_name = ConfiData[i].rangeName;
				}
				if (ConfiData[i].hasOwnProperty("rangeNum")) {
					str += '<input type="hidden" id="' + ConfiData[i].range + '" name="' + range_name + '" class="range" value="' + ConfiData[i].rangeNum + '">';
				} else {
					str += '<input type="hidden" id="' + ConfiData[i].range + '" name="' + range_name + '" class="range">';
				}
			}
			str += '<input type="hidden" class="ConfiIndex" value="' + i + '"></div>';
			if (ConfiData[i].viewPosition == "right") {//判断选人入口的位置
				if (ConfiData[i].hasOwnProperty("radioAllIpt_id")) {
					str += '<div id="' + ConfiData[i].viewId + '" style="display: none" class="form-field chooseDeptAndUs">';
				} else {
					str += '<div id="' + ConfiData[i].viewId + '" class="form-field chooseDeptAndUs">';
				}
			} else {
				if (ConfiData[i].hasOwnProperty("radioAllIpt_id")) {
					str += '<div id="' + ConfiData[i].viewId + '" style="display: none" class="chooseDeptAndUs">';
				} else {
					str += '<div id="' + ConfiData[i].viewId + '" class="chooseDeptAndUs">';
				}
			}
			str += '<div class="clear-fix">' + '<span class="addDeptUser">添加</span>已选'
			if (ConfiData[i].hasOwnProperty("deptDataId")) {
				str += '<span class="orange ml5 selectedDept">0</span> 部门';
			}
			if (ConfiData[i].hasOwnProperty("tagDataId")) {
				if (ConfiData[i].hasOwnProperty("deptDataId")) {
					str += '，<span class="orange selectedTag">0</span> 标签'
				} else {
					str += '<span class="orange selectedTag ml5">0</span> 标签'
				}
			}
			if (ConfiData[i].hasOwnProperty("userDataId")) {
				if (ConfiData[i].hasOwnProperty("deptDataId") || ConfiData[i].hasOwnProperty("tagDataId")) {
					str += '，<span class="orange selectedUser">0</span> 成员'
				} else {
					str += '<span class="orange selectedUser ml5">0</span> 成员'
				}
			}
			str += '<span class="clearSelected none">清空已选</span></div></div>';
			$("#" + ConfiData[i].itemId).append(str);
			if (ConfiData[i].hasOwnProperty("userRestriction")) {//是否配置选人上限
				if(ConfiData[i].userRestriction==1){//是否配置选人上限为1
					$("#" + ConfiData[i].itemId + " .chooseDeptAndUs").addClass("chooseDeptAndUs_one");
					$("#" + ConfiData[i].itemId + " .chooseDeptAndUs").addClass("clearfix");
					$("#" + ConfiData[i].itemId + " .chooseDeptAndUs .clearSelected").remove();
					var htmlStr = $("#" + ConfiData[i].itemId + " .clear-fix>span")
					$("#" + ConfiData[i].itemId + " .clear-fix").html(htmlStr).addClass("fl");
					$("#" + ConfiData[i].itemId + " .clear-fix>span").hide();
					$("#" + ConfiData[i].itemId + " .addDeptUser").show();
				}
			}
			if (ConfiData[i].hasOwnProperty("enterStyle")) {//是否配置入口按钮样式
					$("#" + ConfiData[i].itemId + " .addDeptUser").text(ConfiData[i].enterStyle.text);
					$("#" + ConfiData[i].itemId + " .addDeptUser").css(ConfiData[i].enterStyle.css);
			}
			if (ConfiData[i].hasOwnProperty("rangeNum")) {
				if (ConfiData[i].rangeNum == 3) {
					$("#" + ConfiData[i].itemId + " .form-id-num-wrap .active").removeClass("active")
						.find(".radio_all").removeAttr("checked").end()
						.siblings(".label_radio").addClass("active").find(".radio_specified").attr("checked", "checked");
					$("#" + ConfiData[i].itemId + " .chooseDeptAndUs").show();
				}
			}
		}
	}
}
//构造编辑页面输出时的选人呈现
function makeSelectOutput(id, userData, deptData, tagData) {
	$('#'+id).find(".selected").remove();
	$('#'+id).find(".selectedDept").text(0);
	$('#'+id).find(".selectedTag").text(0);
	$('#'+id).find(".selectedUser").text(0);
	var deptIds = $('#'+id).find(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".deptIds");
	var tagIds = $('#'+id).find(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".tagIds");
	var userIds = $('#'+id).find(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".userIds");
	var selSum = 0;
	deptIds.val("");
	tagIds.val("");
	userIds.val("");
	var id = id;
	var userData = userData || "";
	var deptData = deptData || "";
	var tagData = tagData || "";
	var obj = $("#" + id + " .radio_specified").parent('div');
	if (obj.length != 0) {//是否配置所有人、特定人按钮
		$(obj).addClass('active');
		$(obj).siblings(".active").removeClass("active")
		$("#" + id + " .radio_specified").attr('checked', 'true');
		$("#" + id + " .chooseDeptAndUs").show();
	}
	//范围
	$("#" + id + " .range").val(3);
	$("#" + id + " .chooseDeptAndUs .selected").remove();
	//输出选择部门
	if (deptData && deptData != null && deptData != "") {//部门数据是否为空
		selSum = deptData.length;
		$("#" + id + " .chooseDeptAndUs").append('<div class="selected"><div class="personnelList"></div><div class="tagList"></div></div>');
		//$("#DepartmentList").show();
		$("#" + id + " .selectedDept").html(deptData.length);
		var tempDeptIds = "";
		for (var i = 0; i < deptData.length; i++) {
			SelectionPlugIn.addChoose_init(id, deptData[i].deptId, deptData[i].deptName);
			tempDeptIds = tempDeptIds + deptData[i].deptId + "|";
		}
		tempDeptIds = tempDeptIds.substring(0, tempDeptIds.length - 1);
		$("#" + id + " .deptIds").val(tempDeptIds);
	}
	//输出选择标签
	if (tagData && tagData != null && tagData != "") {//标签数据是否为空
		selSum += tagData.length;
		if ($("#" + id + " .chooseDeptAndUs").find(".selected").length == 0) {
			$("#" + id + " .chooseDeptAndUs").append('<div class="selected"><div class="personnelList"></div><div class="tagList"></div></div>');
		}
		//$("#DepartmentList").show();
		$("#" + id + " .selectedTag").html(tagData.length);
		var tempTagIds = "";
		for (var i = 0; i < tagData.length; i++) {
			SelectionPlugIn.addChoose_init(id, tagData[i].tagId, tagData[i].tagName,"tag");
			tempTagIds = tempTagIds + tagData[i].tagId + "|";
		}
		tempTagIds = tempTagIds.substring(0, tempTagIds.length - 1);
		$("#" + id + " .tagIds").val(tempTagIds);
	}
	//输出选择的人员
	if (userData && userData != null && userData != "") {//人员数据是否为空
		selSum += userData.length;
		if ($("#" + id + " .chooseDeptAndUs").find(".selected").length == 0) {
			$("#" + id + " .chooseDeptAndUs").append('<div class="selected"><div class="personnelList"></div><div class="tagList"></div></div>');
		}
		var userNames = "";
		var personId = "";
		var pics = "";
		$("#" + id + " .selectedUser").html(userData.length);
		for (var i = 0; i < userData.length; i++) {
			personId = personId + userData[i].userId + "|";
			userNames = userNames + userData[i].personName + "|";
			pics = pics + userData[i].headPic + "|";
			SelectionPlugIn.addChoose_init(id, userData[i].userId, userData[i].personName, userData[i].headPic);
		}
		personId = personId.substring(0, personId.length - 1);
		$("#" + id + " .userIds").val(personId);
	}
	if(selSum>0){
		$('#'+id).find(".clearSelected").show();
	}
}
//选人弹窗部分
function selectionPlugIn() {
	var that = this;
	var window_top = $(window.top.document);
	var deptNodes;
	var tagList;
	this.type = "";
	that.vip = false;
	that.toUser = "";
	//弹窗组装
	selectionPlugIn.prototype.pop_wrap6 = function() {
		var pop_wrap6 = '<div class="pop_wrap6" id="pop_wrap6" style="display:none">' +
			'<input type="hidden" class="deptSet"/>' +
			'<input type="hidden" class="tagSet"/>' +
			'<input type="hidden" class="PersonnelSet"/>' +
			'<input type="hidden" class="deptRestriction" value="500"/>' +
			'<input type="hidden" class="tagRestriction" value="500"/>' +
			'<input type="hidden" class="userRestriction" value="1000"/>' +
			'<div class="SS_tit">' +
			'<span>选择特定对象</span><i>×</i>' +
			'</div>' +
			'<div class="pop_wrap6_main">' +
			'<div class="SS_main_top">' +
			'<div class="selected"><div class="tagList"></div><div class="personnelList"></div>' +
			'<input type="text" placeholder="输入搜索条件" class="P_search ss_searchCreator">' +
			'<input type="hidden" class="currPage">' +
			'</div>' +
			'</div>' +
			'<div class="tab">' +
			'<span class="tab_dept active">部门</span>' +
			'<span class="tab_tag">标签</span>' +
			'<span class="tab_group">标签人员</span>' +
			'<span class="tab_user">特定人员</span>' +
			'<span class="tab_batch">批量导入</span>' +
			'<span class="tab_senior" style="    margin: 0;float: right;">高级筛选</span>' +
				//部门
			'</div><div class="select_main_dept">' +
			'<div class="nav_tit">' +
			'<input type="hidden" class="">' +
			'</div>' +
			'<ul class="select_list">' +
			'</ul></div>' +
				//标签
			'<div class="select_main_tag clearfix" style="display: none;">' +
			'<div class="nav_tit" style="cursor:pointer">请选择标签<span class="c999">（标签可在通讯录管理）</span></div><ul class="select_list">' +
			'</ul></div>' +
				//公共群组
			'<div class="select_main_group clearfix" style="display: none;">' +
			'<ul class="select_list select_list_l">' +
			'</ul>' +
			'<div class="select_list_r">' +
			'<div class="select_list_r_top clearfix">全选<span class="ipt-cb input-cb" onclick="selectAll(this)"></span><input type="hidden" class="active_groupId"/><input type="hidden" class="active_group_maxpage"/><input type="hidden" class="active_group_pageIndex"/></div>' +
			'<ul class="select_list"></ul></div></div>' +
				//特定人员
			'<div class="select_main_user clearfix" style="display: none;">' +
			'<div class="select_main_user_l"><div class="nav_tit" style="cursor:pointer" onclick="openDeptPersonnel(this)"></div><div class="select_list_l"><ul class="select_list">' +
			'</ul></div></div>' +
			'<div class="select_list_r">' +
			'<div class="select_list_r_top clearfix"><input type="hidden" class="active_groupId"/><input type="hidden" class="active_group_maxpage"/><input type="hidden" class="active_group_pageIndex"/></div>' +
			'<ul class="select_list"></ul></div></div>' +
				//批量导入
			'<div class="select_main_batch clearfix" style="display: none;">' +
			'<div class="welcome-point mt10" style="display:none">' +
			'<span class="fl" >' +
			//getVipHtml2("批量导入") +
			'</span>' +
			'</div>' +
			'<input type="hidden" class="batchNum" value="100">' +
			'<div class="add-sel-content clearfix">' +
			'<div class="add-sel-ctl">' +
			'<div class="pb5 clearfix">' +
			'<span class="add-sel-lt">请输入账号（每个一行）</span>' +
			'<span id="ready-s" class="add-sel-rt">0/100</span>' +
			'</div>' +
			'<textarea class="add-sel-ta" placeholder="请在这里输入或批量粘贴"></textarea>' +
			'</div>' +
			'<div class="add-sel-ctc">' +
			'<input type="button" value="导入 &gt;" class="add-sel-btn">' +
			'</div>' +
			'<div class="add-sel-ctr clearfix">' +
			'<div class="pb5 clearfix">' +
			'<div class="add-sel-rt"><span>?<div><p>导入失败可能因为以下原因：</p>· 账号不存在通讯录中<br>· 账号中存在空格等错误字符<br>· 账号之间没有换行<br>· 选人超出上限<b><em></em></b></div></span></div>' +
			'</div>' +
			'<div class="add-sel-list">' +
			'<div class="add-sel-list-t clearfix"><span class="add-sel-list-t-l active">成功<span class="orange ml5">0</span></span><span class="add-sel-list-t-r">失败<span class="orange ml5">0</span></span></div>' +
			'<ul class="batch_success"></ul><ul class="batch_fail" style="display:none"></ul></div></div></div>' +
			'</div>' +
				//高级筛选
			'<div class="select_main_senior clearfix" style="display: none;">' +
			'<div class="select_main_senior_l select_list select_list_l">' +
			'<form action="' +'/contact/selectUserMgrAction!ajaxSearch.action?searchValue.deptId=" method="post" onsubmit="return false;" templateid="default" dqdpcheckpoint="query_form">' +
			'<p>姓名(精确)</p>' +
			'<input class="w220" type="text" placeholder="姓名精确搜索" name="searchValue.exactName" />' +
			'<p>拼音</p>' +
			'<input class="w220" type="text" placeholder="拼音搜索" name="searchValue.pinyin" />' +
			'<p>手机号</p>' +
			'<input class="w220" type="text" placeholder="手机号搜索" name="searchValue.mobile" />' +
			'<p>账号</p>' +
			'<input class="w220" type="text" placeholder="请输入" name="searchValue.wxUserId" />' +
			'<p>职位</p>' +
			'<input class="w220" type="text" placeholder="请输入" name="searchValue.position" />' +
			'<p>性别</p>' +
			'<select name="searchValue.sex"><option value="">全部</option><option value="1">男</option><option value="2">女</option></select>' +
			'<p>关注情况</p>' +
			'<select name="searchValue.userStatus"><option value="">全部</option><option value="2">已关注</option><option value="0">未关注</option><option value="1">已取消关注</option></select>' +
			'<p>阳历生日</p>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.startBirthday" id="sss_startBirthday" onfocus="WdatePicker({dateFmt:\'MM-dd\',onpicked:function(){$(\'#sss_endBirthday\').focus();}})">' +
			'<span class="pl5 pr5">至</span>' +
			'<input placeholder="请选择" readonly="readonly" style="width:96px;" type="text" name="searchValue.endBirthday" id="sss_endBirthday" onfocus="WdatePicker({dateFmt:\'MM-dd\',minDate:\'#F{$dp.$D(\\\'sss_startBirthday\\\')||\\\'12-31\\\'}\'})">' +
			'<p>农历生日</p>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.startLunarCalendar" id="sss_startLunarCalendar" onfocus="WdatePicker({dateFmt:\'MM-dd\',onpicked:function(){$(\'#sss_endLunarCalendar\').focus();}})">' +
			'<span class="pl5 pr5">至</span>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.endLunarCalendar" id="sss_endLunarCalendar" onfocus="WdatePicker({dateFmt:\'MM-dd\',minDate:\'#F{$dp.$D(\\\'sss_startLunarCalendar\\\')||\\\'12-31\\\'}\'})">' +
			'<p>入职时间</p>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.startEntryTime" id="sss_startEntryTime" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\',onpicked:function(){$(\'#sss_endEntryTime\').focus();}})">' +
			'<span class="pl5 pr5">至</span>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.endEntryTime" id="sss_endEntryTime" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\',minDate:\'#F{$dp.$D(\\\'sss_startEntryTime\\\')}\'})">' +
			'<p>创建时间</p>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.startTimes" id="sss_startCJtime" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\',onpicked:function(){$(\'#sss_endCJtime\').focus();}})">' +
			'<span class="pl5 pr5">至</span>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.endTime" id="sss_endCJtime" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\',minDate:\'#F{$dp.$D(\\\'sss_startCJtime\\\')}\'})">' +
			'<p>取消关注时间</p>' +
			'<input placeholder="请选择" readonly="readonly" type="text" name="searchValue.reStartFollowTimes" id="sss_startRFtime" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\',onpicked:function(){$(\'#sss_endRFtime\').focus();}})">' +
			'<span class="pl5 pr5">至</span>' +
			'<input placeholder="请选择" class="mb50" readonly="readonly" type="text" name="searchValue.reEndFollowTimes" id="sss_endRFtime" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\',minDate:\'#F{$dp.$D(\\\'sss_startRFtime\\\')}\'})">' +
			'</form>' +
			'</div>' +
			'<div class="select_list_r">' +
			'<div class="select_list_r_top clearfix">' +
			'<span>筛选结果<span class="orange ml5 mr5 senior_sum">0</span>个</span>' +
			'<input type="hidden" class="active_group_maxpage"/>' +
			'<input type="hidden" class="active_group_pageIndex"/>' +
			'</div>' +
			'<ul class="select_list"></ul></div>' +
			'<div class="btn_div"><input type="button" value="重置" class="btn twoBtn mr10 mb0 senior_reset"><input type="button" value="筛选" class="btn orangeBtn twoBtn mr10 mb0 senior_enter" onclick="senior_ent()"></div>' +
			'</div>' +
			'</div>' +
			'<div class="SS_btn">' +
			'<input type="button" value="确定" class="btn orangeBtn twoBtn mr10 mb0">' +
			'</div>' +
			'</div>';
		window_top.find("body").append(pop_wrap6);
		window_top.find(".pop_wrap6 .selected").click(function() {
			$(this).find(".P_search").focus();
		});
		
		window_top.find(".pop_wrap6 .tab span").each(function(i) {
			if ($(this).hasClass("tab_dept")) {//是否选择部门
				$(this).click(function() {
					selected_dept_init();
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					window_top.find(".select_main_dept").show().siblings().not(".SS_main_top,.tab").hide();
					window_top.find(".select_list_r .select_list").children().remove();
					window_top.find("body").removeAttr("onmousewheel");
				})
			} else if ($(this).hasClass("tab_group")) {//是否选择群组
				$(this).click(function() {
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					window_top.find(".select_main_group").show().siblings().not(".SS_main_top,.tab").hide();
					window_top.find(".select_main_group .select_list_r .active_group_pageIndex").val(1);
					window_top.find(".select_main_group .select_list_r .select_list").off();
					window_top.find(".select_list_r .select_list").children().remove();
					var id = window_top.find(".select_main_group .select_list_r").find(".active_groupId").val();
					screenGroupPersonnel(id, ".select_main_group", 1);
					window_top.find("body").removeAttr("onmousewheel");
				})
			} else if ($(this).hasClass("tab_user")) {//是否选择人员
				$(this).click(function() {
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					window_top.find(".select_main_user").show().siblings().not(".SS_main_top,.tab").hide();
					window_top.find(".select_main_user .select_list_r .active_group_pageIndex").val(1);
					window_top.find(".select_main_user .select_list_r .select_list").off();
					window_top.find(".select_list_r .select_list").children().remove();
					usersinit();
					window_top.find("body").removeAttr("onmousewheel");
				})
			} else if ($(this).hasClass("tab_batch")) {//是否选择批量导入
				$(this).click(function() {
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					window_top.find(".select_main_batch").show().siblings().not(".SS_main_top,.tab").hide();
					window_top.find(".select_list_r .select_list").children().remove();
					window_top.find("body").removeAttr("onmousewheel");
					if (that.vip) {} else {//vip判断
						if (window.top.isCoop && window.top.coopType == 1) {
							//渠道商需要隐藏
							window_top.find(".pop_wrap6 .welcome-point").hide();
						} else {
							window_top.find(".pop_wrap6 .welcome-point").show();
						}
						window_top.find(".pop_wrap6 .add-sel-ta").attr("disabled", "disabled")
						window_top.find(".pop_wrap6 .add-sel-btn").attr("disabled", "disabled").css({
							"border": "1px solid red",
							"background": "#f7f7f7"
						})
					};
				})
			} else if ($(this).hasClass("tab_senior")) {//是否选择高级搜索
				$(this).click(function() {
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					window_top.find(".select_main_senior").show().siblings().not(".SS_main_top,.tab").hide();
					window_top.find(".select_list_r .select_list").children().remove();
					window_top.find("body").removeAttr("onmousewheel");
				})
			} else if ($(this).hasClass("tab_tag")) {//是否选择标签
				$(this).click(function() {
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					window_top.find(".select_main_tag").show().siblings().not(".SS_main_top,.tab").hide();
					window_top.find(".select_list_r .select_list").children().remove();
					window_top.find("body").removeAttr("onmousewheel");
				})
			}
		})
	}

	//初始弹窗
	this.pop_wrap6();
	/* 获取企业名称 */
	selectionPlugIn.prototype.deptinit = function() {
		window_top.find(".select_main_dept .select_list").html("");
		window_top.find(".select_main_user .select_list_l .select_list").html("");
		$.ajax({
			url: baseURL + '/contact/contactAction!getRootNodeByUser.action',
			type: 'post',
			dataType: 'json',
			data: {
				"orgId": $("#orgid").val()
			},
			success: function(result) {
				if ('0' == result.code) {
					var orgNodes = result.data.orgList[0].nodeName;
					window_top.find(".nav_tit").not(".select_main_tag .nav_tit").html('<span><span>' + orgNodes + '</span></span>');
					deptInit();
				} else {
					_alert("提示", result.desc);
				}
			}
		});
	};
	/*初始化部门*/
    function deptInit() {
        $.ajax({
            url: baseURL + "/department/departmentAction!listOrgNodeByParent.action",
            type: 'post',
            dataType: 'json',
            data: {
            	"agentCode":agentCode,
                "deptIds": targetDept
            },
            success: function (result) {
                if ('0' == result.code) {
                    deptNodes = result.data.orgList;
                    screenDept(deptNodes, ".select_main_dept ", 1);
                    screenDept(deptNodes, ".select_main_user .select_list_l ", 2);
                    if (window_top.find(".pop_wrap6 .deptSet").val() != "") {//是否已选部门
                        var deptIds = window_top.find(".pop_wrap6 .deptSet").val().split("|");
                        var oli = window_top.find(".pop_wrap6 .select_main_dept .select_list li");
                        oli.each(function() {
                            if (deptIds.indexOf($(this).find(".deptId").val()) != -1) {
                                $(this).find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
                            }
                        })
                    }
                    window_top.find(".pop_wrap6 .select_main_user .select_list_r").find(".active_groupId").val("");
                } else {
                    _alert("提示", result.desc);
                }
            },
			error:function(){
                _alert("提示","网络异常");
			}
        })
    }
	/*初始化部门呈现*/
	function screenDept(Dept, param, pd) {//pd:1为初始化部门的组织结构，2为初始化人员的组织结构
		var init_liststr = screenDept_f(Dept, pd);
		window_top.find(".pop_wrap6 " + param + ".select_list").html("").append(init_liststr);
		window_top.find(".pop_wrap6 " + param + ".select_list .listInfo").mouseover(function() {
			$(this).siblings(".jstree-wholerow").addClass("hover");
		})
		window_top.find(".pop_wrap6 " + param + ".select_list .listInfo").mouseout(function() {
			$(this).siblings(".jstree-wholerow").removeClass("hover");
		})
	}
    function screenDept_f(Dept, pd) {//pd:1为初始化部门的组织结构，2为初始化人员的组织结构
        var init_liststr = "";
        for (var i = 0; i < Dept.length; i++) {
            var thisId = Dept[i].nodeId;
            var hasChildrent = Dept[i].hasChildrent;//是否有子部门
            if (hasChildrent != 0) {//是否有子级部门
                if (pd == 1) {//pd:1为初始化部门的组织结构，2为初始化人员的组织结构
                    init_liststr += '<li class="clearfix"><div class="jstree-wholerow">&nbsp;</div><div class="listInfo" onclick="opendept(this,event)"><i class="arrow-right';
                } else {
                    init_liststr += '<li class="clearfix"><div class="jstree-wholerow">&nbsp;</div><div class="listInfo" onclick="opendept(this,event);openDeptPersonnel(this)"><i class="arrow-right';
                }

                init_liststr += '"></i><img src="' + baseURL + '/manager/images/dept_icon01.png" alt="">' +
                    '<span class="deptName">' + Dept[i].nodeName + '</span>' +
                    '<input type="hidden" class="deptId" value="' + thisId + '">'
                if (pd == 1) {//pd:1为初始化部门的组织结构，2为初始化人员的组织结构
                    init_liststr += '<span class="ipt-cb input-cb"></span>'
                }
                init_liststr += '</div><ul style="display:none; padding-left: 25px;">'
                /*var sz = [thisId]
                screenDept_f(Dept, sz, pd);*/
                init_liststr += '</ul>'
            } else {
                if (pd == 1) {//pd:1为初始化部门的组织结构，2为初始化人员的组织结构
                    init_liststr += '<li class="clearfix"><div class="jstree-wholerow">&nbsp;</div><div class="listInfo"><i class="';
                } else {
                    init_liststr += '<li class="clearfix"><div class="jstree-wholerow">&nbsp;</div><div class="listInfo"onclick="openDeptPersonnel(this)"><i class="';
                }

                init_liststr += '"></i><img src="' + baseURL + '/manager/images/dept_icon01.png" alt="">' +
                    '<span class="deptName">' + Dept[i].nodeName + '</span>' +
                    '<input type="hidden" class="deptId" value="' + thisId + '">'
                if (pd == 1) {//pd:1为初始化部门的组织结构，2为初始化人员的组织结构
                    init_liststr += '<span class="ipt-cb input-cb"></span>'
                }
                init_liststr += '</div>'
            }
            init_liststr += '</li>'
        }
        return init_liststr;
    }
	/* 部门点击事件 */
	function opendept(obj, event) {
		if(!$(event.target).hasClass("ipt-cb")){
			if ($(obj).find("i").attr("class") == "arrow-right") {
				$(obj).siblings("ul").show();
				$(obj).find("i").attr("class", "arrow-down");
			} else {
				$(obj).siblings("ul").hide();
				$(obj).find("i").attr("class", "arrow-right");
			}
			var nodeId = $(obj).find(".deptId").val();

			//加载子部门
			if($(obj).siblings("ul").find("li").length==0){
                $.ajax({
                    url: baseURL + "/department/departmentAction!listOrgNodeByParent.action",
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "agentCode":agentCode,
                        "deptIds": targetDept,
						"nodeId":nodeId
                    },
                    success: function (result) {
                        if ('0' == result.code) {
                            deptNodes = result.data.orgList;
                            var deptStr = screenDept_f(deptNodes, 1);
                            var userStr = screenDept_f(deptNodes, 2);
                            var oul = window_top.find(".pop_wrap6 .select_main_dept .select_list input[value='"+nodeId+"']").parent().siblings("ul");
                            window_top.find(".pop_wrap6 .select_main_user .select_list_l input[value='"+nodeId+"']").parent().siblings("ul").html(userStr);
                            oul.html(deptStr);
                            var deptIds = window_top.find(".pop_wrap6 .deptSet").val().split("|");
                            var oli = oul.find("li");
                            oli.each(function() {
                                if (deptIds.indexOf($(this).find(".deptId").val()) != -1) {
                                    $(this).children(".listInfo").find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
                                }
                            })
                        } else {
                            _alert("提示", result.desc);
                        }
                    },
                    error:function(){
                        _alert("提示","网络异常");
                    }
                })
			}
		}
	}
	window.top.opendept = opendept;

	/**/
	function selected_dept_init() {
		var deptIds = window_top.find(".pop_wrap6 .deptSet").val().split("|");
		var oli = window_top.find(".pop_wrap6 .select_main_dept .select_list li");
		oli.each(function() {
			if (deptIds.indexOf($(this).find(".deptId").val()) != -1) {
				$(this).children(".listInfo").find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
			}
		})
	}
	/* 选择或取消选择部门和人员 */
	selectionPlugIn.prototype.chooseDeptAndUser = function() {
		window_top.find("body .pop_wrap6").on("click",".select_list .ipt-cb",function(event){
			event.stopPropagation();
			if($(this).siblings(".deptId").length!=0){
				chooseDept($(this))
			}else if($(this).siblings(".userId").length!=0){
				choosePersonnel($(this))
			}else{
				chooseTag($(this))
			}
		})
	};
	this.chooseDeptAndUser();
	/* 选择或取消选择部门 */
	function chooseDept(obj) {
		var deptSet = window_top.find(".pop_wrap6 .deptSet");
		if (obj.hasClass("input-cb")) {//部门未选择
			if (window_top.find(".pop_wrap6 .selected>.append_item").length >= window_top.find(".pop_wrap6 .deptRestriction").val()) {
				_top_alert('部门选择超出上限(' + window_top.find(".pop_wrap6 .deptRestriction").val() + ')', false);
				return;
			}
			obj.removeClass("input-cb");
			obj.addClass("input-cb-on");
			var deptSet_val = window_top.find(".pop_wrap6 .deptSet").val();
			if(deptSet_val.indexOf(obj.siblings(".deptId").val())==-1){
                if (deptSet_val) {
                    deptSet_val += "|" + obj.siblings(".deptId").val();
                } else {
                    deptSet_val += obj.siblings(".deptId").val();
                }
                deptSet.val(deptSet_val);
                addChoose(obj.siblings(".deptId").val(), obj.siblings(".deptName").text())
			}
		} else {//部门已选择
			/*obj.removeClass("input-cb-on");
			obj.addClass("input-cb");*/
			var deptSet_val = window_top.find(".pop_wrap6 .deptSet").val();
            var oli = window_top.find(".pop_wrap6 .select_main_dept .select_list li");
            var selectDeptId = obj.siblings(".deptId").val();
            oli.each(function() {
                if ($(this).children(".listInfo").find(".deptId").val()== selectDeptId) {
                    $(this).children(".listInfo").find(".ipt-cb").removeClass("input-cb-on").addClass("input-cb");
                }
            })
			var str = deptSet_val.split("|");
			var index = str.indexOf(selectDeptId);
			if (index > -1) {//部门已选择
				str.splice(index, 1);
			}
			str = str.join("|");
			deptSet.val(str);
			if (str == "" && window_top.find(".pop_wrap6 .PersonnelSet").val() == "") {
				search_input_not();
			}
			window_top.find(".pop_wrap6 .selected>.append_item input[value=" + selectDeptId + "]").parent().remove();
		}
	}
	/* 选择或取消选择人员 */
	function choosePersonnel(obj) {
		var PersonnelSet = window_top.find(".pop_wrap6 .PersonnelSet");
		if (obj.hasClass("input-cb")) {//人员未选择
			var userRestriction_num = window_top.find(".pop_wrap6 .userRestriction").val();
			if (window_top.find(".pop_wrap6 .selected>.personnelList .append_item").length >= userRestriction_num&&userRestriction_num!=1) {
				_top_alert('人员选择超出上限(' + window_top.find(".pop_wrap6 .userRestriction").val() + ')', false);
				return;
			}
			if(userRestriction_num==1){
				window_top.find(".pop_wrap6 .PersonnelSet").val("");
				window_top.find(".pop_wrap6 .personnelList").html("");
				obj.parents(".select_list").find(".input-cb-on").addClass("input-cb").removeClass("input-cb-on");
			}
			obj.removeClass("input-cb");
			obj.addClass("input-cb-on");
			var deptSet_val = window_top.find(".pop_wrap6 .PersonnelSet").val();
			if (deptSet_val) {
				deptSet_val += "|" + obj.siblings(".userId").val();
			} else {
				deptSet_val += obj.siblings(".userId").val();
			}
			PersonnelSet.val(deptSet_val);
			addChoose(obj.siblings(".userId").val(), obj.siblings(".userName").text(), obj.siblings("img").attr("src"))
		} else {//人员已选择
			obj.removeClass("input-cb-on");
			obj.addClass("input-cb");
			var deptSet_val = window_top.find(".pop_wrap6 .PersonnelSet").val();
			var str = deptSet_val.split("|");
			var index = str.indexOf(obj.siblings(".userId").val());
			if (index > -1) {//人员已选择
				str.splice(index, 1);
			}
			str = str.join("|");
			PersonnelSet.val(str);
			if (str == "" && window_top.find(".pop_wrap6 .deptSet").val() == "") {
				search_input_not();
			}
			window_top.find(".pop_wrap6 .personnelList .append_item input[value=" + obj.siblings(".userId").val() + "]").parent().remove();
		}
	}
	/*添加已选择部门、人员、标签到预览框*/
	function addChoose(id, name, img) {//img：不传是部门，“tag”为标签，其他是人员
		var addType;
		var imgUrl = "";
		if (img) {
			if (img == "tag") {
				addType = "tag";
				imgUrl = (baseURL + "/manager/images/tag_icon02.png");
			} else {
				addType = "personnel";
				imgUrl = img;
			}
		} else {
			addType = "dept";
			imgUrl = (baseURL + "/manager/images/dept_icon.png");
		}
		if (window_top.find(".pop_wrap6 .personnelList .append_item").length == 0 && window_top.find(".pop_wrap6 .selected>.append_item").length == 0) {
			search_input_on()
		}
		var name = name;
		var id = id;
		var addstr = '<div class="append_item"><img src="' + imgUrl + '">' + name + '<input type="hidden" data-name="'+name+'" value="' + id + '"><span class="close">×</span></div>';
		if (addType == "dept") {
			window_top.find(".pop_wrap6 .tagList").before(addstr);
		} else if (addType == "tag") {
			window_top.find(".pop_wrap6 .tagList").append(addstr);
		} else {
			window_top.find(".pop_wrap6 .personnelList").append(addstr);
		}
	}
	/*删除已选择部门*/
	selectionPlugIn.prototype.removeChoosedept = function(id, _obj) {
		var id = id;
		var obj = window_top.find(".pop_wrap6 .select_list input[value=" + id + "]").siblings(".ipt-cb");
		var deptSet;
		obj.removeClass("input-cb-on");
		obj.addClass("input-cb");
		var str;
		try {
			if (_obj.parents(".selected").parent().hasClass("SS_main_top")) {//当前是弹框还是选人入口
				deptSet = window_top.find(".pop_wrap6 .deptSet");
			} else {
				deptSet = _obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".deptIds");
				var num = _obj.parents(".chooseDeptAndUs").find(".selectedDept").text();
				var num1 = _obj.parents(".chooseDeptAndUs").find(".selectedTag").text();
				var num2 = _obj.parents(".chooseDeptAndUs").find(".selectedUser").text();
				_obj.parents(".chooseDeptAndUs").find(".selectedDept").text(num - 1);
				var itemid = _obj.parents(".chooseDeptAndUs").parent().attr("id");
				for(var i =0;i<ConfiData.length;i++) {
					if (ConfiData[i].itemId == itemid) {
						if (ConfiData[i].callback&&ConfiData[i].callback.remove) {//判断是否配置移除已选的回调函数
							ConfiData[i].callback.remove({deptId:id});
						}
						break;
					}
				}
				if (num - 1 == 0 && num2 == 0 && num1 == 0) {//是否已经清空选择
					_obj.parents(".chooseDeptAndUs").find(".clearSelected").hide();
					_obj.parents(".selected").remove();
				}
			}
		} catch (err) {
			deptSet = window_top.find(".pop_wrap6 .deptSet");
		}
		str = deptSet.val().split("|");
		var index = str.indexOf(id);
		if (index > -1) {
			str.splice(index, 1);
		}
		str = str.join("|");
		deptSet.val(str);
		if (str == "" && window_top.find(".pop_wrap6 .PersonnelSet").val() == "" && window_top.find(".pop_wrap6 .tagSet").val() == "") {
			search_input_not();
		}
	}
	/*删除已选择标签*/
	selectionPlugIn.prototype.removeChoosetag = function(id, _obj) {
		var id = id;
		var obj = window_top.find(".pop_wrap6 .select_main_tag .select_list input[value=" + id + "]").siblings(".ipt-cb");
		var tagSet;
		obj.removeClass("input-cb-on");
		obj.addClass("input-cb");
		var str;
		try {
			if (_obj.parents(".selected").parent().hasClass("SS_main_top")) {//当前是弹框还是选人入口
				tagSet = window_top.find(".pop_wrap6 .tagSet");
			} else {
				tagSet = _obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".tagIds");
				var num = _obj.parents(".chooseDeptAndUs").find(".selectedDept").text();
				var num1 = _obj.parents(".chooseDeptAndUs").find(".selectedTag").text();
				var num2 = _obj.parents(".chooseDeptAndUs").find(".selectedUser").text();
				_obj.parents(".chooseDeptAndUs").find(".selectedTag").text(num1 - 1);
				var itemid = _obj.parents(".chooseDeptAndUs").parent().attr("id");
				for (var i = 0; i < ConfiData.length; i++) {
					if (ConfiData[i].itemId == itemid) {
						if (ConfiData[i].callback && ConfiData[i].callback.remove) {//判断是否配置移除已选的回调函数
							ConfiData[i].callback.remove({tagId: id});
						}
						break;
					}
				}
				if (num1 - 1 == 0 && num2 == 0 && num == 0) {//是否已经清空选择
					_obj.parents(".chooseDeptAndUs").find(".clearSelected").hide();
					_obj.parents(".selected").remove();
				}
			}
		} catch (err) {
			tagSet = window_top.find(".pop_wrap6 .tagSet");
		}
		str = tagSet.val().split("|");
		var index = str.indexOf(id);
		if (index > -1) {
			str.splice(index, 1);
		}
		str = str.join("|");
		tagSet.val(str);
		if (str == "" && window_top.find(".pop_wrap6 .PersonnelSet").val() == "" && window_top.find(".pop_wrap6 .deptSet").val() == "") {
			search_input_not();
		}
	}
	/*删除已选择人员*/
	selectionPlugIn.prototype.removeChoosepersonnel = function(id, _obj) {
		var id = id;
		var obj = window_top.find(".pop_wrap6 .select_list_r .select_list input[value=" + id + "]").siblings(".ipt-cb");
		var PersonnelSet;
		obj.removeClass("input-cb-on");
		obj.addClass("input-cb");
		var str;
		try {
			if (_obj.parents(".selected").parent().hasClass("SS_main_top")) {//当前是弹框还是选人入口
				PersonnelSet = window_top.find(".pop_wrap6 .PersonnelSet");
			} else {
				PersonnelSet = _obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".userIds");
				var num = _obj.parents(".chooseDeptAndUs").find(".selectedUser").text();
				var num1 = _obj.parents(".chooseDeptAndUs").find(".selectedTag").text();
				var num2 = _obj.parents(".chooseDeptAndUs").find(".selectedDept").text();
				_obj.parents(".chooseDeptAndUs").find(".selectedUser").text(num - 1);
				var itemid = _obj.parents(".chooseDeptAndUs").parent().attr("id");
				for(var i =0;i<ConfiData.length;i++) {
					if (ConfiData[i].itemId == itemid) {
						if (ConfiData[i].callback&&ConfiData[i].callback.remove) {//判断是否配置移除已选的回调函数
							ConfiData[i].callback.remove({userId:id});
						}
						break;
					}
				}
				if (num - 1 == 0 && num2 == 0 && num1 == 0) {//是否已经清空选择
					_obj.parents(".chooseDeptAndUs").find(".clearSelected").hide();
					_obj.parents(".selected").remove();
				}
			}
		} catch (err) {
			PersonnelSet = window_top.find(".pop_wrap6 .PersonnelSet");
		}
		str = PersonnelSet.val().split("|");
		var index = str.indexOf(id);
		if (index > -1) {
			str.splice(index, 1);
		}
		str = str.join("|");
		PersonnelSet.val(str);
		if (str == "" && window_top.find(".pop_wrap6 .deptSet").val() == "" && window_top.find(".pop_wrap6 .tagSet").val() == "") {
			search_input_not();
		}
	}

	//视图框的已选绑定删除事件
	selectionPlugIn.prototype.viewDelSelected = function() {
		window_top.find(".pop_wrap6").on("click",".selected>.append_item .close",function() {
			that.removeChoosedept($(this).siblings("input").val(), $(this));
			$(this).parent().remove();
		})
		window_top.find(".pop_wrap6").on("click",".tagList .append_item .close",function() {
			that.removeChoosetag($(this).siblings("input").val(), $(this));
			$(this).parent().remove();
		})
		window_top.find(".pop_wrap6").on("click",".personnelList .append_item .close",function() {
			that.removeChoosepersonnel($(this).siblings("input").val(), $(this));
			$(this).parent().remove();
		})
		$("body").on("click",".chooseDeptAndUs .selected>.append_item .close",function() {
			that.removeChoosedept($(this).siblings("input").val(), $(this));
			$(this).parent().remove();
		})
		$("body").on("click",".chooseDeptAndUs .tagList .append_item .close",function() {
			that.removeChoosetag($(this).siblings("input").val(), $(this));
			$(this).parent().remove();
		})
		$("body").on("click",".chooseDeptAndUs .personnelList .append_item .close",function() {
			that.removeChoosepersonnel($(this).siblings("input").val(), $(this));
			$(this).parent().remove();
		})
	}
	that.viewDelSelected();

	/* 获取标签列表 */
	selectionPlugIn.prototype.tagInit = function() {
		window_top.find(".pop_wrap6 .select_main_tag .select_list_l .select_list").html("");
		$.ajax({
			url: baseURL + '/tag/tagAction!searchTagGroupPage.action?agentCode=' + agentCode,
			type: 'post',
			dataType: 'json',
			data: {
				"orgId": $("#orgid").val()
			},
			success: function(result) {
				if ('0' == result.code) {
					tagList = result.data.tagList;
					var init_liststr = '';
					if(tagList&&tagList.length>0){
						screenGroup(tagList);
						for (var i = 0; i < tagList.length; i++) {
							init_liststr += '<li class="clearfix"><div class="jstree-wholerow">&nbsp;</div><div class="listInfo">' +
								'<img src="' + baseURL + '/manager/images/tag_icon01.png" alt="">' +
								'<span class="tagName ellipsis">' + tagList[i].tagName + '</span>' +
								'<input type="hidden" class="tagId" value="' + tagList[i].id + '">' +
								'<span class="ipt-cb input-cb"></span></div></li>'
						}
					}
					window_top.find(".pop_wrap6 .select_main_tag .select_list").html(init_liststr);
					window_top.find(".pop_wrap6 .select_main_tag .select_list_l .select_list .listInfo").mouseover(function() {
						$(this).siblings(".jstree-wholerow").addClass("hover");
					})
					window_top.find(".select_main_tag .select_list_l .select_list .listInfo").mouseout(function() {
						$(this).siblings(".jstree-wholerow").removeClass("hover");
					})
					//chooseTag()
					if (window_top.find(".pop_wrap6 .tagSet").val() != ""&&that.type.indexOf("2")!=-1) {//是否已选标签
						var deptIds = window_top.find(".pop_wrap6 .tagSet").val().split("|");
						var oli = window_top.find(".pop_wrap6 .select_main_tag .select_list li");
						oli.each(function() {
							if (deptIds.indexOf($(this).find(".tagId").val()) != -1) {
								$(this).find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
							}
						})
					}
					if(that.type.indexOf("1")==-1&&that.type.indexOf("2")==-1){//没有选部门和选标签是时候加载标签人员
						var id = window_top.find(".pop_wrap6 .select_main_group .select_list_r").find(".active_groupId").val();
						screenGroupPersonnel(id, ".select_main_group", 1);
					}
				} else {
					_alert("提示", result.desc);
				}
			}
		});
	}
	/* 选择或取消选择标签 */
	function chooseTag(obj) {
		var tagSet = window_top.find(".pop_wrap6 .tagSet");
		if (obj.hasClass("input-cb")) {//未选择标签
			if (window_top.find(".pop_wrap6 .selected .tagList .append_item").length >= window_top.find(".pop_wrap6 .tagRestriction").val()) {
				_top_alert('标签选择超出上限(' + window_top.find(".pop_wrap6 .tagRestriction").val() + ')', false);
				return;
			}
			obj.removeClass("input-cb");
			obj.addClass("input-cb-on");
			var tagSet_val = window_top.find(".pop_wrap6 .tagSet").val();
			if (tagSet_val) {
				tagSet_val += "|" + obj.siblings(".tagId").val();
			} else {
				tagSet_val += obj.siblings(".tagId").val();
			}
			tagSet.val(tagSet_val);
			addChoose(obj.siblings(".tagId").val(), obj.siblings(".tagName").text(), "tag")
		} else {//已选择标签
			obj.removeClass("input-cb-on");
			obj.addClass("input-cb");
			var tagSet_val = window_top.find(".pop_wrap6 .tagSet").val();
			var str = tagSet_val.split("|");
			var index = str.indexOf(obj.siblings(".tagId").val());
			if (index > -1) {//已选择标签
				str.splice(index, 1);
			}
			str = str.join("|");
			tagSet.val(str);
			if (str == "" && window_top.find(".pop_wrap6 .PersonnelSet").val() == "" && window_top.find(".pop_wrap6 .deptSet").val() == "") {
				search_input_not();
			}
			window_top.find(".pop_wrap6 .selected .tagList .append_item input[value=" + obj.siblings(".tagId").val() + "]").parent().remove();
		}
	}

	/*初始化组织呈现*/
	function screenGroup(group) {
		var liststr = "";
		for (var i = 0; i < group.length; i++) {
			liststr += '<li class="clearfix" onclick="openGroup(this)">';
			liststr += '<img src="' + baseURL + '/manager/images/tag_icon01.png" alt="">' +
				'<span class="groupName">' + group[i].tagName + '</span>' +
				'<input type="hidden" class="groupId" value="' + group[i].id + '"></li>'
		}
		window_top.find(".pop_wrap6 .select_main_group .select_list_l").html(liststr);
		window_top.find(".pop_wrap6 .select_main_group .select_list_l li").eq(0).addClass("on");
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_groupId").val(group[0].id);
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_group_pageIndex").val(1);
	}
	/*组织人员筛选呈现*/
	function screenGroupPersonnel(id, param, pd) { //pd=1:第一次加载数据
		if(!id){
			return
		}
		var pageIndex = window_top.find(".select_main_group .select_list_r .active_group_pageIndex").val();
		$.ajax({
			url: baseURL + '/tag/tagAction!searchTagGroupRefPage.action?agentCode=' + agentCode + '&tagId=' + id,
			type: 'post',
			dataType: 'json',
			data: {
				page: pageIndex,
				'dqdp_csrf_token': dqdp_csrf_token,
				toUser:that.toUser
			},
			success: function(result) {
				if ('0' == result.code) {
					var groupNodes_p = result.data.pager.pageData;
					if (pd == 1&&groupNodes_p.length!=0) {//pd=1:第一次加载数据
						window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list").children().remove();
						window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list").off();
						maxPage = result.data.pager.totalPages;
						window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_group_maxpage").val(maxPage);
						DropDownLoading(id, maxPage, screenGroupPersonnel, param);
					}
					var PersonnelSet_val = window_top.find(".pop_wrap6 .PersonnelSet").val().split("|");
					var deptSet_val = window_top.find(".pop_wrap6 .deptSet").val().split("|");
					var str = "";
					for (var i = 0; i < groupNodes_p.length; i++) {
						if(groupNodes_p[i].menberType==1){
							str += '<li class="clearfix">';
							str += '<img src="' + groupNodes_p[i].headPic + '" alt="">' +
								'<span class="userName">' + groupNodes_p[i].name + '</span>' +
								'<input type="hidden" class="userId" value="' + groupNodes_p[i].menberId + '">'
							var selected = false;
							for (var j = 0; j < PersonnelSet_val.length; j++) {
								if (PersonnelSet_val[j] == groupNodes_p[i].menberId) {//是否已选
									selected = true;
									break;
								}
							}
							if (selected) {
								str += '<span class="ipt-cb input-cb-on"></span></li>'
							} else {
								str += '<span class="ipt-cb input-cb"></span></li>'
							}
						}else{
							str += '<li class="clearfix">';
							str += '<img src="' + baseURL + '/manager/images/dept_icon.png" alt="">' +
								'<span class="deptName">' + groupNodes_p[i].name + '</span>' +
								'<input type="hidden" class="deptId" value="' + groupNodes_p[i].menberId + '">'
							var selected = false;
							for (var j = 0; j < deptSet_val.length; j++) {
								if (deptSet_val[j] == groupNodes_p[i].menberId) {//是否已选
									selected = true;
									break;
								}
							}
							if (selected) {
								str += '<span class="ipt-cb input-cb-on"></span></li>'
							} else {
								str += '<span class="ipt-cb input-cb"></span></li>'
							}
						}
					}
					window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list").append(str);
					//choosePersonnel();
				} else {
					_alert("提示", result.desc);
				}
				window_top.find("body").removeAttr("onmousewheel");
			}
		})
	}
	/* 组织点击事件 */
	function openGroup(obj) {
		var id = $(obj).find(".groupId").val();
		var pageIndex = window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_group_maxpage").val();
		$(obj).siblings().removeClass("on");
		$(obj).addClass("on");
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list_r_top .ipt-cb").addClass("input-cb");
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list_r_top .ipt-cb").removeClass("input-cb-on");
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_groupId").val(id);
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_group_pageIndex").val(1);
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list").children().remove();
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list").off();
		screenGroupPersonnel(id, ".select_main_group", 1);
	}
	window.top.openGroup = openGroup;
	/*初始化人员*/
	function usersinit() {
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .active_group_pageIndex").val(1);
		var id = window_top.find(".pop_wrap6 .select_main_user .select_list_r").find(".active_groupId").val();
		screenDeptPersonnel(id, ".select_main_user", 1);
	}
	/*部门人员筛选呈现*/
	function screenDeptPersonnel(id, param, pd) { //pd=1:第一次加载数据
		var pageIndex = window_top.find(".select_main_user .select_list_r .active_group_pageIndex").val();
		$.ajax({
			url: baseURL + '/contact/selectUserMgrAction!ajaxSearch.action?agentCode=' + agentCode + '&searchValue.isSettingUser=0&searchValue.deptId=' + id,
			type: 'post',
			dataType: 'json',
			data: {
				page: pageIndex,
				'dqdp_csrf_token': dqdp_csrf_token,
				"searchValue.deptIds": targetDept,
				"searchValue.userIds": targetUser
			},
			success: function(result) {
				if ('0' == result.code) {
					var groupNodes_p = result.data.pageData;
					if (groupNodes_p) {
						if (pd == 1) {//pd=1:第一次加载数据
							window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list").children().remove();
							window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list").off();
							maxPage = result.data.maxPage;
							window_top.find(".pop_wrap6 .select_main_user .select_list_r .active_group_maxpage").val(maxPage);
							DropDownLoading(id, maxPage, screenDeptPersonnel, param);
						}
						var PersonnelSet_val = window_top.find(".pop_wrap6 .PersonnelSet").val().split("|");
						var str = "";
						for (var i = 0; i < groupNodes_p.length; i++) {
							str += '<li class="clearfix">';
							str += '<img src="' + groupNodes_p[i].headPic + '" alt="">' +
								'<span class="userName">' + groupNodes_p[i].personName + '</span>' +
								'<input type="hidden" class="userId" value="' + groupNodes_p[i].userId + '">'
							var selected = false;
							for (var j = 0; j < PersonnelSet_val.length; j++) {
								if (PersonnelSet_val[j] == groupNodes_p[i].userId) {//是否已选
									selected = true;
									break;
								}
							}
							if (selected) {//是否已选
								str += '<span class="ipt-cb input-cb-on"></span></li>'
							} else {
								str += '<span class="ipt-cb input-cb"></span></li>'
							}
						}
						window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list").append(str);
						//choosePersonnel();
					}
				} else {
					_alert("提示", result.desc);
				}
				window_top.find("body").removeAttr("onmousewheel");
			}
		})
	}
	/*部门点击事件*/
	function openDeptPersonnel(obj) {
		var id = $(obj).find(".deptId").val();
		if (id == undefined) {//是否已选部门
			id = "";
		}
		window_top.find(".select_main_user .select_list_l .on").removeClass("on");
		$(obj).siblings(".jstree-wholerow").addClass("on");
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list_r_top .ipt-cb").addClass("input-cb");
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list_r_top .ipt-cb").removeClass("input-cb-on");
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .active_groupId").val(id);
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .active_group_pageIndex").val(1);
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list").children().remove();
		window_top.find(".pop_wrap6 .select_main_user .select_list_r .select_list").off();
		screenDeptPersonnel(id, ".select_main_user", 1);
	}
	window.top.openDeptPersonnel = openDeptPersonnel;
	/*组织人员全选*/
	function selectAll(obj) {
		var selectAll = true;
		if ($(obj).hasClass("input-cb")) {//是否已全选群组人员
			selectAll = true;
		} else {
			selectAll = false;
		}
		var id = window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_groupId").val();
		var ipt_cb = window_top.find(".pop_wrap6 .select_list_r .select_list .input-cb");
		$.ajax({
			url: baseURL + "/tag/tagAction!searchTagGroupRefAll.action?tagId=" + id,
			type: "get",
			async: false,
			dataType: "json",
			data: {
				toUser:that.toUser,
			},
			success: function(result) {
				if (result.code == "0") {
					var users = result.data.persons;
					if (selectAll) {//是否已全选群组人员
						var PersonnelSet = window_top.find(".pop_wrap6 .PersonnelSet").val();
						var deptSet = window_top.find(".pop_wrap6 .deptSet").val();
						var str = "";
						var idarray = [];
						var deptstr = "";
						var deptidarray = [];
						for (var i = 0; i < users.length; i++) {
							if(users[i].menberType=="1"){//判断是不是人员
								var selected = false;
								if (PersonnelSet.indexOf(users[i].menberId)!=-1) {
									selected = true;
								}
								if (!selected) {
									idarray.push(users[i]);
									str += "|" + users[i].menberId;
								}
							}else{
								var selected = false;
								if (deptSet.indexOf(users[i].menberId)!=-1) {
									selected = true;
								}
								if (!selected) {
									deptidarray.push(users[i]);
									deptstr += "|" + users[i].menberId;
								}
							}
						}
						if (window_top.find(".pop_wrap6 .selected>.personnelList .append_item").length + idarray.length > window_top.find(".pop_wrap6 .userRestriction").val()) {
							_top_alert('人员选择超出上限(' + window_top.find(".pop_wrap6 .userRestriction").val() + ')', false);
							return;
						}
						if (window_top.find(".pop_wrap6 .selected>.append_item").length + deptidarray.length > window_top.find(".pop_wrap6 .deptRestriction").val()) {
							_top_alert('部门选择超出上限(' + window_top.find(".pop_wrap6 .deptRestriction").val() + ')', false);
							return;
						}
						$(obj).addClass("input-cb-on");
						$(obj).removeClass("input-cb");
						ipt_cb.addClass("input-cb-on");
						ipt_cb.removeClass("input-cb");
						for (var k = 0; k < idarray.length; k++) {
							addChoose(idarray[k].menberId, idarray[k].name, idarray[k].headPic);
						}
						for (var k = 0; k < deptidarray.length; k++) {
							addChoose(deptidarray[k].menberId, deptidarray[k].name);
						}
						if (PersonnelSet == "") {
							str = str.substring(1);
						}
						if (deptSet == "") {
							deptstr = deptstr.substring(1);
						}
						window_top.find(".pop_wrap6 .PersonnelSet").val(PersonnelSet + str);
						window_top.find(".pop_wrap6 .deptSet").val(deptSet + deptstr);
					} else {
						$(obj).addClass("input-cb");
						$(obj).removeClass("input-cb-on");
						for (var i = 0; i < users.length; i++) {
							if(users[i].menberType=="1") {//判断是不是人员
								window_top.find(".pop_wrap6 .personnelList .append_item input[value=" + users[i].menberId + "]").parent().remove();
								that.removeChoosepersonnel(users[i].menberId);
							}else{
								window_top.find(".pop_wrap6 .SS_main_top .selected>.append_item input[value=" + users[i].menberId + "]").parent().remove();
								that.removeChoosedept(users[i].menberId);
							}
						}
					}
				}
			},
			error: function() {

			}
		})
	}
	window.top.selectAll = selectAll;
	/* 下拉加载 */
	function DropDownLoading(id, maxPage, func, param) {
		var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
		var nScrollTop = 0; //滚动到的当前位置
		var $frame = window_top.find(".pop_wrap6 " + param + " .select_list_r .select_list");
		$frame.on("scroll", function() {
			var nDivHight = $frame.height();
			nScrollHight = $(this)[0].scrollHeight;
			nScrollTop = $(this)[0].scrollTop;
			if (nScrollTop/(detectZoom()/100) + nDivHight >= nScrollHight) {
				// 触发事件，这里可以用AJAX拉取下页的数数据
				var pageIndex = window_top.find(".pop_wrap6 " + param + " .select_list_r .active_group_pageIndex").val();
				pageIndex++;
				window_top.find(".pop_wrap6 " + param + " .select_list_r .active_group_pageIndex").val(pageIndex);
				window_top.find("body").attr("onmousewheel", "return false;");
				if (maxPage >= pageIndex) {//是否最后一页
					func(id, param, 2);
				} else {
					if (window_top.find(".pop_wrap6 " + param + " .select_list_r_bottom").length == 0 && Math.ceil(($frame.find("li").length) / 10) >= maxPage) {
						window_top.find(".pop_wrap6 " + param + " .select_list_r .select_list").append('<div class="select_list_r_bottom">没有更多了</div>');
					}
					window_top.find("body").removeAttr("onmousewheel");
				}
			};
		});
	}

	//=================================搜索人员或部门=============================
	/**
	 * @param param：搜素inputId
	 */
    window_top.searchUser = '';//搜索关键词，用于搜人不重复搜索
    window_top.searchDept = '';//搜索关键词，用于搜部门不重复搜索
    selectionPlugIn.prototype.searchTime=null;
	selectionPlugIn.prototype.searchUserDept = function(param) {
        window_top.find('.ss_' + param).on('blur', function() {
            window.top.searchUser = '';
            window.top.searchDept = '';
        })
		window_top.find('.ss_' + param).on('focus', function() {
			window_top.find('.ss_' + param).trigger('input');
		})
		window_top.find('.ss_' + param).on('input', function() {
            window_top.find('.dropQuery').html('');
            window_top.find('.dropQuery').hide();
            window_top.find(".pop_wrap6 .P_search").width("150px");
			clearTimeout(that.searchTime);
			(function(obj){
                that.searchTime = setTimeout(function(){
                    that.searchUserDeptFuc(obj);
                },1000)
			})(this)
		});
        window_top.on('click', function(e) {
            if(e.target.className.indexOf("ss_searchCreator")!=-1){
                return
            }
            window_top.find('.dropQuery').hide();
            if (window_top.find(".pop_wrap6 .personnelList .append_item").length == 0 && window_top.find(".pop_wrap6 .selected>.append_item").length == 0&&window_top.find(".pop_wrap6 .tagList .append_item").length == 0) {
                search_input_not();
            }else if(window_top.find('.ss_searchCreator').val().length>0){
                window_top.find(".pop_wrap6 .P_search").width("150px");
			} else {
                search_input_on();
            }
        })
	}
    selectionPlugIn.prototype.searchUserDeptFuc = function(obj){
        var _this = obj;
        window_top.find('.dropQuery').html('');
        window_top.find('.dropQuery').hide();
        if(_this.value == ""){
            window.top.searchDeptPd = '';
            window.top.searchUser = '';
            return;
		}
        if (window.top.searchUser==_this.value) {
            return;
        };
        window.top.searchUser = _this.value;
        window.top.searchDept = '';
        window_top.find(".pop_wrap6 .currPage").val(1);
        if (that.type == '1') {//只有部门
            searchDept(_this, 1);
        }else if(that.type.indexOf("3")!=-1){//可以选择人员
            screenUserDept(_this, 1, 1);
        }else if(that.type.indexOf("2")!=-1&&that.type.indexOf("3")==-1){//可以选择标签、人员
            searchDept(_this, 1);
        }
	}
	/*搜索结果数据加载*/
	function screenUserDept(_this, pd, page) { //pd=1:绑定一次搜索结果下拉加载事件；pd=2:重置下拉框内容
		$.ajax({
			url: baseURL + '/contact/selectUserMgrAction!ajaxSearch.action?agentCode=' + agentCode,
			type: "post",
			data: {
				"searchValue.personName": _this.value,
				"pageSize": 10,
				"page": page,
				"searchValue.deptIds": targetDept,
				"searchValue.userIds": targetUser
			},
			dataType: "json",
			success: function(result) {
				if (result.code == 0) {
					var userList = result.data.pageData;
					if (userList) {
						if (pd != 2) {//pd=1:绑定一次搜索结果下拉加载事件；pd=2:重置下拉框内容
							window_top.find('.dropQuery').html('');
							window_top.find('.dropQuery').hide();
						}
						if (userList && userList.length > 0) {
							if (!window_top.find('.dropQuery').length) { //计算下拉菜单
								var scrollTop = window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop;
								var top = window_top.find(".pop_wrap6 .SS_tit").height() + window_top.find(".pop_wrap6 .SS_main_top").height() + 20;
								var w = $(_this).parent().width() + 10;
								$(window.top.document.body).find(".pop_wrap6").append('<ul class="dropQuery" style="position:absolute;top:' + top + 'px;left:20px;width:' + w + 'px;"></ul>');
							} else {
								var top = window_top.find(".pop_wrap6 .SS_tit").height() + window_top.find(".pop_wrap6 .SS_main_top").height() + 20;
								window_top.find('.dropQuery').css({
									"top": top + "px"
								})
								window_top.find('.dropQuery').show();
							};
							$.each(userList, function() { //添加下拉菜单
								var userValue = this.userId;
								window_top.find('.dropQuery').append('<li> <img src=' + this.headPic + '>' + this.personName + '<input type="hidden" value="' + userValue + '" data-name="'+this.personName+'"/></li>');
							});
							var maxPage = result.data.maxPage;
							if (pd == 1) {//pd=1:绑定一次搜索结果下拉加载事件；pd=2:重置下拉框内容
								screenDownLoading(_this, maxPage, screenUserDept)
							}
							if (maxPage == 1) {//是否只有10条数据以内
								searchDept(_this);
							}

						}
					} else {
						window_top.find('.dropQuery').html('');
						window_top.find('.dropQuery').hide();
						searchDept(_this, 1);
					}
				}
			},
			error: function() {

			}
		});
	}
	/*搜索部门*/
	window.top.searchDeptPd = '';//记录搜部门的内容
    window.top.searchDeptDelay = true;//判断是否延迟
    window.top.searchDeptLength = 1;//记录搜索结果条数
	function searchDept(obj, pd) { //pd为“1”时构造下拉框
		if (that.type.indexOf("1") != -1&&window.top.searchDeptDelay) {
            searchDeptFuc(obj, pd);
		}else if(that.type.indexOf("2") != -1){
			searchTag(obj, pd);
		}
	}
	/*搜索部门方法*/
	function searchDeptFuc(obj, pd){
        window_top.find(".pop_wrap6 .dropQuery").off();
        var obj_val = window_top.find('.ss_searchCreator').val();
        var str = "";
        if((window.top.searchDeptPd!=obj_val||window.top.searchDept!=obj_val)&&((obj_val.indexOf(window.top.searchDeptPd)==0&&window.top.searchDeptLength>0)||obj_val.indexOf(window.top.searchDeptPd)!=0||window.top.searchDeptPd=='')){
            window.top.searchDeptDelay=false;
            window.top.searchDeptPd = obj_val;
            $.ajax({
                url: baseURL + '/department/departmentAction!searchDepartByCondition.action?agentCode=' + agentCode,
                type: "post",
                data: {
                    "condition": obj_val,
                    "isNeedParent": 0
                },
                dataType: "json",
                success: function (result) {
                    window.top.searchDeptDelay = true;
                    if (result.code == 0) {
                        var deptNodes = result.data.orgList;
                        window.top.searchDeptLength = deptNodes.length;
                        for (var i = 0; i < deptNodes.length; i++) {
                            str += '<li class="dept"><img src="' + baseURL + '/manager/images/dept_icon.png">' + deptNodes[i].nodeName + '<input type="hidden" value="' + deptNodes[i].nodeId + '" data-name="' + deptNodes[i].nodeName + '" /></li>'
                        }
                        if (str != "" && pd == 1) {//是否构造下拉框
                            if (!window_top.find('.dropQuery').length) { //计算下拉菜单
                                var scrollTop = window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop;
                                var top = window_top.find(".pop_wrap6 .SS_tit").height() + window_top.find(".pop_wrap6 .SS_main_top").height() + 20;
                                var w = $(obj).parent().width() + 10;
                                window_top.find(".pop_wrap6").append('<ul class="dropQuery" style="position:absolute;top:' + top + 'px;left:20px;width:' + w + 'px;"></ul>');
                            } else {
                                var top = window_top.find(".pop_wrap6 .SS_tit").height() + window_top.find(".pop_wrap6 .SS_main_top").height() + 20;
                                window_top.find('.dropQuery').css({
                                    "top": top + "px"
                                })
                                window_top.find('.dropQuery').show();
                            };
                        }
                        window_top.find('.dropQuery').append(str);
                        if(window.top.searchDeptPd!=window_top.find('.ss_searchCreator').val()){
                            searchDeptFuc(obj, pd)
                        }
                        /*window.top.searchDept=window.top.searchDeptPd;
                        if(window.top.searchDept!=window.top.searchDeptPd||window_top.find('.dropQuery').find("li").length==0){
                        }*/
                        searchTag(obj, pd);
                    }else{
                    	_alert("提示",result.desc)
					}
                },
                error:function(){
                    window.top.searchDeptPd = '';
                    window.top.searchDeptDelay = true;
				}
            })
        }
	}
	/*搜索标签*/
	function searchTag(obj, pd) { //pd为“1”时构造下拉框
		if (that.type.indexOf("2") != -1) {
			window_top.find(".pop_wrap6 .dropQuery").off();
			var obj_val = $(obj).val();
			var str = "";
			for (var i = 0; i < tagList.length; i++) {
				if (tagList[i].tagName.indexOf(obj_val) != -1) {
					str += '<li class="tag"><img src="' + baseURL + '/manager/images/tag_icon02.png">' + tagList[i].tagName + '<input type="hidden" value="' + tagList[i].id + '" /></li>'
				}
			}
			if (str != "" && pd == 1) {//是否构造下拉框
				if (!window_top.find('.dropQuery').length) { //计算下拉菜单
					var scrollTop = window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop;
					var top = window_top.find(".pop_wrap6 .SS_tit").height() + window_top.find(".pop_wrap6 .SS_main_top").height() + 20;
					var w = $(obj).parent().width() + 10;
					window_top.find(".pop_wrap6").append('<ul class="dropQuery" style="position:absolute;top:' + top + 'px;left:20px;width:' + w + 'px;"></ul>');
				} else {
					var top = window_top.find(".pop_wrap6 .SS_tit").height() + window_top.find(".pop_wrap6 .SS_main_top").height() + 20;
					window_top.find('.dropQuery').css({
						"top": top + "px"
					})
					window_top.find('.dropQuery').show();
				};
			}
			window_top.find('.dropQuery').append(str);
		}
	}
	/* 搜索的下拉加载 */
	/*获取浏览器缩放比例*/
	function detectZoom (){
		var ratio = 0,
			screen = window.screen,
			ua = navigator.userAgent.toLowerCase();

		if (window.devicePixelRatio !== undefined) {
			ratio = window.devicePixelRatio;
		}
		else if (~ua.indexOf('msie')) {
			if (screen.deviceXDPI && screen.logicalXDPI) {
				ratio = screen.deviceXDPI / screen.logicalXDPI;
			}
		}
		else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
			ratio = window.outerWidth / window.innerWidth;
		}

		if (ratio){
			ratio = Math.round(ratio * 100);
		}

		return ratio;
	};
	function screenDownLoading(_this, maxPage, func) {
		var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
		var nScrollTop = 0; //滚动到的当前位置
		var $frame = window_top.find(".pop_wrap6 .dropQuery");
		$frame.off().on("scroll", function() {
			var nDivHight = $frame.height();
			nScrollHight = $(this)[0].scrollHeight - 10;
			nScrollTop = $(this)[0].scrollTop;
			if (nScrollTop/(detectZoom()/100) + nDivHight >= nScrollHight) {
				// 触发事件，这里可以用AJAX拉取下页的数数据
				var pageIndex = window_top.find(".pop_wrap6 .currPage").val();
				pageIndex++;
				window_top.find(".pop_wrap6 .currPage").val(pageIndex);
				if (maxPage >= pageIndex) {//是否到最后一页
					func(_this, 2, pageIndex);
				} else if (maxPage == pageIndex - 1) {
					searchDept(_this);
				}
			};
		});
	}
	window_top.find("body .pop_wrap6").on('click', '.dropQuery li', function() { //点击下拉菜单选择人
		var _this = window_top.find(".pop_wrap6 .ss_searchCreator");
		if (window_top.find(".pop_wrap6 .personnelList .append_item").length == 0 && window_top.find(".pop_wrap6 .selected>.append_item").length == 0) {
			search_input_on()
		}
		if ($(this).hasClass("dept")) {
			$(_this).val("");
			if (window_top.find(".pop_wrap6 .selected>.append_item").length >= window_top.find(".pop_wrap6 .deptRestriction").val()) {
				_top_alert('部门选择超出上限(' + window_top.find(".pop_wrap6 .deptRestriction").val() + ')', false);
				return;
			}
			var id = $(this).find('input').val();
			var deptSet = window_top.find(".pop_wrap6 .deptSet").val();
			var PersonnelSet_val = window_top.find(".pop_wrap6 .deptSet").val().split("|");
			var selected = true;
			var str = "";
			for (var i = 0; i < PersonnelSet_val.length; i++) {
				if (id == PersonnelSet_val[i]) {
					selected = false;
					break;
				}
			}
			if (selected) {
				window_top.find(".pop_wrap6 .personnelList").before('<div class="append_item">' + $(this).html() + '<span class="close">×</span></div>');
				var obj = window_top.find(".pop_wrap6 .select_main_dept .select_list").find("input[value=" + id + "]").siblings(".ipt-cb");
				obj.removeClass("input-cb");
				obj.addClass("input-cb-on");
				str += "|" + id;
				if (deptSet == "") {
					str = str.substring(1);
				}
				window_top.find(".pop_wrap6 .deptSet").val(deptSet + str);
			}
		}else if ($(this).hasClass("tag")) {
			$(_this).val("");
			if (window_top.find(".pop_wrap6 .selected>.tagList .append_item").length >= window_top.find(".pop_wrap6 .tagRestriction").val()) {
				_top_alert('标签选择超出上限(' + window_top.find(".pop_wrap6 .deptRestriction").val() + ')', false);
				return;
			}
			var id = $(this).find('input').val();
			var tagSet = window_top.find(".pop_wrap6 .tagSet").val();
			var PersonnelSet_val = window_top.find(".pop_wrap6 .tagSet").val().split("|");
			var selected = true;
			var str = "";
			for (var i = 0; i < PersonnelSet_val.length; i++) {
				if (id == PersonnelSet_val[i]) {
					selected = false;
					break;
				}
			}
			if (selected) {
				window_top.find(".pop_wrap6 .tagList").append('<div class="append_item">' + $(this).html() + '<span class="close">×</span></div>');
				var obj = window_top.find(".pop_wrap6 .select_main_tag .select_list").find("input[value=" + id + "]").siblings(".ipt-cb");
				obj.removeClass("input-cb");
				obj.addClass("input-cb-on");
				str += "|" + id;
				if (tagSet == "") {
					str = str.substring(1);
				}
				window_top.find(".pop_wrap6 .tagSet").val(tagSet + str);
			}
		} else {
			$(_this).val("");
			var userRestriction_num = window_top.find(".pop_wrap6 .userRestriction").val();
			var id = $(this).find('input').val();
			if(userRestriction_num==1){
				window_top.find(".pop_wrap6 .PersonnelSet").val($(this).find('input').val());
				window_top.find(".pop_wrap6 .pop_wrap6_main>div").not(".select_main_dept").find(".select_list .input-cb-on").addClass("input-cb").removeClass("input-cb-on");
				window_top.find(".pop_wrap6 .personnelList").html('<div class="append_item">' + $(this).html() + '<span class="close">×</span></div>');
				var obj = window_top.find(".pop_wrap6 .select_list_r .select_list input[value=" + id + "]").siblings(".ipt-cb");
				obj.removeClass("input-cb");
				obj.addClass("input-cb-on");
			}else{
				if (window_top.find(".pop_wrap6 .selected>.personnelList .append_item").length >= userRestriction_num) {
					_top_alert('人员选择超出上限(' + window_top.find(".pop_wrap6 .userRestriction").val() + ')', false);
					return;
				}
				var PersonnelSet = window_top.find(".pop_wrap6 .PersonnelSet").val();
				var PersonnelSet_val = window_top.find(".pop_wrap6 .PersonnelSet").val().split("|");
				var selected = true;
				var str = "";
				for (var i = 0; i < PersonnelSet_val.length; i++) {
					if (id == PersonnelSet_val[i]) {
						selected = false;
						break;
					}
				}
				if (selected) {
					window_top.find(".pop_wrap6 .personnelList").append('<div class="append_item">' + $(this).html() + '<span class="close">×</span></div>');
					var obj = window_top.find(".pop_wrap6 .select_list_r .select_list input[value=" + id + "]").siblings(".ipt-cb");
					obj.removeClass("input-cb");
					obj.addClass("input-cb-on");
					str += "|" + id;
					if (PersonnelSet == "") {
						str = str.substring(1);
					}
					window_top.find(".pop_wrap6 .PersonnelSet").val(PersonnelSet + str);
				}
			}
		}
	});
	//搜索框样式-已选择人员
	function search_input_on() {
		window_top.find(".pop_wrap6 .P_search").width("1px").css({
			"margin-top": "8px"
		}).removeAttr("placeholder");
	}
	//搜索框样式-未选择人员
	function search_input_not() {
		window_top.find(".pop_wrap6 .P_search").width("520px").css({
			"margin-top": "0px"
		}).attr("placeholder", "输入搜索条件");
	}
	//判断弹窗是否显示部门、标签、人员:1-有部门，2-有标签，3-有人员，4-去掉按标签选人、去掉批量选人
	selectionPlugIn.prototype.judgeType = function(str) {
		that.type = str;
		if (str.indexOf("1") != -1) {
			window_top.find(".pop_wrap6 .select_main_dept").show();
			if (str.indexOf("2") == -1) {
				window_top.find(".pop_wrap6 .tab span").eq(1).hide();
			}
			if (str.indexOf("3") == -1) {
				window_top.find(".pop_wrap6 .tab span").eq(2).hide().end().eq(3).hide().end().eq(4).hide().end().eq(5).hide();
			}
            if (str.indexOf("4") != -1) {
                window_top.find(".pop_wrap6 .tab span").eq(2).hide().end().eq(4).hide();
            }
		} else if (str.indexOf("2") != -1) {
			window_top.find(".pop_wrap6 .tab span").eq(0).hide().end().eq(1).addClass("active");
			window_top.find(".pop_wrap6 .select_main_dept").hide();
			window_top.find(".pop_wrap6 .select_main_tag").show();
			if (str.indexOf("3") == -1) {
				window_top.find(".pop_wrap6 .tab span").eq(2).hide().end().eq(3).hide().end().eq(4).hide().end().eq(5).hide();
			}
            if (str.indexOf("4") != -1) {
                window_top.find(".pop_wrap6 .tab span").eq(2).hide().end().eq(4).hide();
			}
		} else if (str.indexOf("4") != -1) {
            window_top.find(".pop_wrap6 .tab span").hide();
            window_top.find(".pop_wrap6 .tab span").eq(5).show().end().eq(3).show().addClass("active");
            window_top.find(".pop_wrap6 .select_main_dept").hide();
            window_top.find(".pop_wrap6 .select_main_user").show();
            var id = window_top.find(".pop_wrap6 .select_main_user .select_list_r").find(".active_groupId").val();
            screenDeptPersonnel(id, ".select_main_user", 1);
        } else if (str.indexOf("3") != -1) {
            window_top.find(".pop_wrap6 .tab span").eq(0).hide().end().eq(1).hide().end().eq(2).addClass("active");
            window_top.find(".pop_wrap6 .select_main_dept").hide();
            window_top.find(".pop_wrap6 .select_main_group").show();
            var id = window_top.find(".pop_wrap6 .select_main_group .select_list_r").find(".active_groupId").val();
            if(id&&id!=""){
                screenGroupPersonnel(id, ".select_main_group", 1);
            }
        }
	}
	//关闭窗口
	that.close_pop_wrap6 = function() {
		window_top.find(".pop_wrap6 .tab span").removeClass("active");
		window_top.find(".pop_wrap6 .tab span").show().eq(0).addClass("active") //.end().eq(1).show().end().eq(2).show();
		window_top.find(".pop_wrap6 .select_main_dept").show();
		window_top.find(".pop_wrap6 .select_main_dept").show().siblings().not(".SS_main_top,.tab").hide();
		window_top.find(".pop_wrap6 .select_list ul").hide();
		window_top.find(".pop_wrap6 .select_list .arrow-down").addClass("arrow-right").removeClass("arrow-down");
		window_top.find(".pop_wrap6 .input-cb-on").addClass("input-cb").removeClass("input-cb-on");
		window_top.find(".pop_wrap6 .select_list_l .on").removeClass("on");
		window_top.find(".pop_wrap6 .select_main_group .select_list_l li").eq(0).addClass("on");
		window_top.find(".pop_wrap6 .select_list_r").find(".active_groupId").val("");
		window_top.find(".pop_wrap6 .select_main_group .select_list_r .active_groupId").val(window_top.find(".select_main_group .select_list_l li:first-child input").val());
		window_top.find(".pop_wrap6 .select_list_r .select_list").children().remove();
		window_top.find(".pop_wrap6 .select_list_r .active_group_pageIndex").val(1);
		window_top.find(".pop_wrap6 .select_list_r .select_list").off();
		window_top.find(".pop_wrap6 .tab_batch").show();
		window_top.find(".pop_wrap6 .select_main_group .select_list_r_top").show();
		window_top.find('.pop_wrap6 .add-sel-ta').val("");
		window_top.find('.pop_wrap6 .add-sel-list ul').html("");
		window_top.find('.pop_wrap6 .add-sel-list-t .orange').html("0");
		window_top.find("body").removeAttr("onmousewheel");
		window_top.find(".pop_wrap6").hide();
		window_top.find(".overlay").hide();
	};
	//提交选人
	that.submit_choose = function(obj) {
		window_top.find(".pop_wrap6 .SS_btn input").off().on("click", function() {
			var deptIds = window_top.find(".pop_wrap6 .deptSet").val();
			var tagIds = window_top.find(".pop_wrap6 .tagSet").val();
			var userIds = window_top.find(".pop_wrap6 .PersonnelSet").val();
			obj.siblings(".selectedDept").text(window_top.find(".pop_wrap6 .selected>.append_item").length);
			obj.siblings(".selectedTag").text(window_top.find(".pop_wrap6 .selected>.tagList>.append_item").length);
			obj.siblings(".selectedUser").text(window_top.find(".pop_wrap6 .selected>.personnelList>.append_item").length);
			obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".deptIds").val(deptIds);
			obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".tagIds").val(tagIds);
			obj.parents(".chooseDeptAndUs").siblings(".form-id-num-wrap").find(".userIds").val(userIds);
			var deptset = window_top.find(".pop_wrap6 .selected>.append_item");
			var tagset = window_top.find(".pop_wrap6 .selected>.tagList>.append_item");
			var userset = window_top.find(".pop_wrap6 .selected>.personnelList>.append_item");
			var id = obj.parents(".chooseDeptAndUs").parent().attr("id");
			var data = "";
			var callback = null;
			for (var i = 0; i < ConfiData.length; i++) {
				if (ConfiData[i].itemId == id) {
					if (ConfiData[i].callback&&ConfiData[i].callback.submit) {
						var userlist = [];
						var taglist = [];
						var deptlist = [];
						deptset.each(function(t) {
							var obj = {
								"deptId": $(this).find("input").val(),
								"deptName": $(this).text().substring(0, $(this).text().length - 1)
							};
							deptlist.push(obj);
						});
						tagset.each(function(t) {
							var obj = {
								"tagId": $(this).find("input").val(),
								"tagName": $(this).text().substring(0, $(this).text().length - 1)
							};
							taglist.push(obj);
						});
						userset.each(function(t) {
							var obj = {
								"userId": $(this).find("input").val(),
								"personName": $(this).text().substring(0, $(this).text().length - 1),
								"headPic": $(this).find("img").attr("src")
							};
							userlist.push(obj);
						});
						data = {
							"userList": userlist,
							"tagList": taglist,
							"deptList": deptlist
						}
						callback = ConfiData[i].callback.submit;
					}
					break;
				}
			}
			if (deptIds == "" && userIds == "" && tagIds == "") {
				obj.parent().siblings(".selected").remove();
				obj.siblings(".clearSelected").hide();
			} else {
				obj.parent().siblings(".selected").remove();
				obj.siblings(".clearSelected").show();
				obj.parent().after('<div class="selected"></div>');
				obj.parent().siblings(".selected").append(deptset);
				obj.parent().siblings(".selected").append('<div class="tagList"></div>');
				obj.parent().siblings(".selected").find(".tagList").append(tagset);
				obj.parent().siblings(".selected").append('<div class="personnelList"></div>');
				obj.parent().siblings(".selected").find(".personnelList").append(userset);
			}

			that.close_pop_wrap6();
			callback&&callback(data);
			_resetFrameHeight();
		})

	};
	//批量导入
	window_top.find('.pop_wrap6 .add-sel-btn').on('click', function() {
		var texta = $.trim(window_top.find('.pop_wrap6 .add-sel-ta').val());
		if (texta == '') {
			return;
		};
		var cc = []; //超出字符
		var sxcz = window_top.find(".pop_wrap6 .userRestriction").val() - window_top.find(".pop_wrap6 .selected>.personnelList .append_item").length;
		texta = texta.replace(/\n/g, '##');
		window_top.find('.pop_wrap6 .add-sel-ta').val('');
		window_top.find('.pop_wrap6 #ready-s').html('0/' + window_top.find(".pop_wrap6 .batchNum").val());
		$.ajax({
			url: baseURL + '/contact/selectUserMgrAction!getEffectiveUsersFromData.action',
			data: {
				'param': texta,
				agentCode: agentCode,
				batchNum: window_top.find(".pop_wrap6 .batchNum").val()
			},
			type: 'post',
			dataType: 'json',
			success: function(result) {
				if (result.code == '0') {
					window_top.find('.pop_wrap6 .add-sel-list .batch_success').html('<li class="add-sel-li"><textarea readonly="readonly"></textarea></li>');
					window_top.find('.pop_wrap6 .add-sel-list .batch_fail').html('<li class="add-sel-li"><textarea readonly="readonly"></textarea></li>');
					window_top.find('.pop_wrap6 .add-sel-list-t .orange').html("0");
					//添加成功的用户
					var legalList = result.data.legalList;
					if (sxcz < window_top.find(".pop_wrap6 .batchNum").val()) {//导入是否超出上限
						cc = legalList.slice(sxcz, legalList.length);
						if(sxcz<legalList.length){
                            legalList.length = sxcz;
						}
					}
					if (legalList.length > 0) {//添加成功
						var PersonnelSet = window_top.find(".pop_wrap6 .PersonnelSet").val();
						var PersonnelSet_val = window_top.find(".pop_wrap6 .PersonnelSet").val().split("|");
						var str = "";
						var successstr = "";
						if (PersonnelSet == "") {//是否已选人员
							for (var i = 0; i < legalList.length; i++) {

								addChoose(legalList[i].userId, legalList[i].personName, legalList[i].headPic);
								str += "|" + legalList[i].userId;
								var wxUserId = legalList[i].wxUserId;
								successstr += wxUserId + "\r\n";
							}
							str = str.substring(1);
						} else {
							for (var i = 0; i < legalList.length; i++) {
								var selected = false;
								for (var j = 0; j < PersonnelSet_val.length; j++) {
									if (PersonnelSet_val[j] == legalList[i].userId) {
										selected = true;
										break;
									}
								}
								if (!selected) {
									addChoose(legalList[i].userId, legalList[i].personName, legalList[i].headPic);
									str += "|" + legalList[i].userId;
								}
								var wxUserId = legalList[i].wxUserId;
								successstr += wxUserId + "\r\n";
							}
						}
						window_top.find('.pop_wrap6 .add-sel-list .batch_success .add-sel-li textarea').val(successstr);
						window_top.find(".pop_wrap6 .PersonnelSet").val(PersonnelSet + str);
						var len = legalList.length;
						window_top.find('.pop_wrap6 .add-sel-list-t-l span').html(len);
					}
					//添加失败的
					var wrongList = result.data.wrongList;
					var failstr = "";
					if (wrongList.length > 0) {
						for (var i = 0; i < wrongList.length; i++) {
							var wxUserwrongId = wrongList[i].wxUserId;
							//window_top.find('.pop_wrap6 .add-sel-list .batch_fail .add-sel-li').append(wxUserwrongId+"\r\n");
							failstr += wxUserwrongId + "\r\n";
						}
					}
					var illegalList = result.data.illegalList;
					illegalList = illegalList.concat(cc);
					if (illegalList.length > 0) {
						for (var i = 0; i < illegalList.length; i++) {
							var wxUserillegalId = illegalList[i].wxUserId;
							//window_top.find('.pop_wrap6 .add-sel-list .batch_fail .add-sel-li').append(wxUserillegalId+"\r\n");
							failstr += wxUserillegalId + "\r\n";
						}
					}
					window_top.find('.pop_wrap6 .add-sel-list .batch_fail .add-sel-li textarea').val(failstr);
					var wrongList = result.data.wrongList;
					var illegalList = result.data.illegalList;
					var filter = wrongList.length + illegalList.length + cc.length;
					window_top.find('.pop_wrap6 .add-sel-list-t-r span').html(filter);
				} else {
					_alert("提示信息", result.code);
				}
			},
			error: function() {
				_alert("提示信息", "网络异常");
			}
		});
	});
	window_top.find('.pop_wrap6 .add-sel-ta').on('input', function() {
		var strlen = window_top.find(".pop_wrap6 .batchNum").val();
		var val = $(this).val();
		var arry = val.split(/\n/g);
		var len = '0';
		if (arry == null) {
			if (val != '') len = 1;
		} else {
			len = arry.length;
			if (len > strlen) {
				arry.length = strlen;
				var str = arry.join("\r\n");
				len = strlen;
				$(this).val(str);
			}
		}
		window_top.find('#ready-s').html(len + '/' + strlen);

	});
	window_top.find(".pop_wrap6 .add-sel-list-t-l").on("click", function() {
		window_top.find(".pop_wrap6 .add-sel-list-t-r").removeClass("active");
		window_top.find(".pop_wrap6 .add-sel-list-t-l").addClass("active");
		window_top.find('.pop_wrap6 .add-sel-list .batch_fail').hide();
		window_top.find('.pop_wrap6 .add-sel-list .batch_success').show();
	});
	window_top.find(".pop_wrap6 .add-sel-list-t-r").on("click", function() {
		window_top.find(".pop_wrap6 .add-sel-list-t-l").removeClass("active");
		window_top.find(".pop_wrap6 .add-sel-list-t-r").addClass("active");
		window_top.find('.pop_wrap6 .add-sel-list .batch_success').hide();
		window_top.find('.pop_wrap6 .add-sel-list .batch_fail').show();
	});
	//高级筛选重置
	$('.pop_wrap6 .senior_reset', window.top.document).on('click', function() { //重置
		$('.pop_wrap6 .select_main_senior_l', window.top.document).find('input').val('');
		$('.pop_wrap6 .select_main_senior_l', window.top.document).find('select').val('');
	});
	//高级筛选按钮点击
	function senior_ent() {
		window_top.find(".pop_wrap6 .select_main_senior .active_group_pageIndex").val("1");
		window_top.find(".pop_wrap6 .select_main_senior .select_list_r .select_list").children().remove();
		window_top.find(".pop_wrap6 .select_main_senior .select_list_r .select_list").off();
		screenSeniorPersonnel("", ".select_main_senior", 1);
	}
	//高级筛选结果呈现
	function screenSeniorPersonnel(id, param, pd) {
		var pageIndex = window_top.find(".pop_wrap6 .select_main_senior .active_group_pageIndex").val();
		if (pd == 1) {
			window_top.find(".pop_wrap6 .select_main_senior .select_list_r .senior_sum").html(0)
		};
		window_top.find(".pop_wrap6 .select_main_senior form").ajaxSubmit({
			dataType: 'json',
			data: {
				page: pageIndex,
				pageSize: 10,
				dqdp_csrf_token: dqdp_csrf_token,
				agentCode: agentCode,
				"searchValue.deptIds": targetDept,
				"searchValue.userIds": targetUser
			},
			async: false,
			success: function(result) {
				if ("0" == result.code) {
					var groupNodes_p = result.data.pageData;
					if (groupNodes_p) {
						if (pd == 1) {
							window_top.find(".pop_wrap6 .select_main_senior .select_list_r .select_list").children().remove();
							window_top.find(".pop_wrap6 .select_main_senior .select_list_r .select_list").off();
							maxPage = result.data.maxPage;
							window_top.find(".pop_wrap6 .select_main_senior .select_list_r .active_group_maxpage").val(maxPage);
							window_top.find(".pop_wrap6 .select_main_senior .select_list_r .senior_sum").html(result.data.totalRows);
							DropDownLoading(id, maxPage, screenSeniorPersonnel, param);
						}
						var PersonnelSet_val = window_top.find(".PersonnelSet").val().split("|");
						var str = "";
						for (var i = 0; i < groupNodes_p.length; i++) {
							str += '<li class="clearfix">';
							str += '<img src="' + groupNodes_p[i].headPic + '" alt="">' +
								'<span class="userName">' + groupNodes_p[i].personName + '</span>' +
								'<input type="hidden" class="userId" value="' + groupNodes_p[i].userId + '">'
							var selected = false;
							for (var j = 0; j < PersonnelSet_val.length; j++) {
								if (PersonnelSet_val[j] == groupNodes_p[i].userId) {
									selected = true;
									break;
								}
							}
							if (selected) {
								str += '<span class="ipt-cb input-cb-on"></span></li>'
							} else {
								str += '<span class="ipt-cb input-cb"></span></li>'
							}
						}
						window_top.find(".pop_wrap6 .select_main_senior .select_list_r .select_list").append(str);
						//choosePersonnel();
					}
				} else {
					_alert("提示", result.desc);
				}
				window_top.find("body").removeAttr("onmousewheel");
			},
			error: function() {
				_alert("信息提示层", "网络异常");
			}
		});
	}

	window.top.senior_ent = senior_ent;
	//初始化已选
	that.selected_init = function() {
		if (that.type.indexOf("1") == -1 && that.type.indexOf("2") == -1) {
			var userIds = window_top.find(".pop_wrap6 .PersonnelSet").val();
			var oli = window_top.find(".pop_wrap6 .select_main_group .select_list_r .select_list li");
			oli.each(function() {
				if (userIds.indexOf($(this).find(".userId").val()) != -1) {
					$(this).find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
				}
			})
		} else {
			var deptIds = window_top.find(".pop_wrap6 .deptSet").val().split("|");
			var oli = window_top.find(".pop_wrap6 .select_main_dept .select_list li");
			oli.each(function() {
				if (deptIds.indexOf($(this).find(".deptId").val()) != -1) {
					$(this).children(".listInfo").find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
				}
			})
		}
		if (that.type.indexOf("2") != -1) {
			var tagIds = window_top.find(".pop_wrap6 .tagSet").val();
			var oli = window_top.find(".pop_wrap6 .select_main_tag .select_list li");
			oli.each(function() {
				if (tagIds.indexOf($(this).find(".tagId").val()) != -1) {
					$(this).find(".ipt-cb").removeClass("input-cb").addClass("input-cb-on");
				}
			})
		}
	};
	/*编辑页面已选择部门或人员的初始化输出*/
	that.addChoose_init = function(param, id, name, img) {
		var addType;
		var imgUrl = "";
		if (img) {
			if (img == "tag") {
				addType = "tag";
				imgUrl = baseURL + "/manager/images/tag_icon02.png";
			} else {
				addType = "personnel";
				imgUrl = img;
			}
		} else {
			addType = "dept";
			imgUrl = baseURL + "/manager/images/dept_icon.png";
		}
		var name = name;
		var id = id;
        var addstr = '<div class="append_item"><img src="' + imgUrl + '">' + name + '<input type="hidden" data-name="' + name + ' "value="' + id + '"><span class="close">×</span></div>';
		if (addType == "dept") {
			$("#" + param + " .personnelList").before(addstr);
		} else if (addType == "tag") {
			$("#" + param + " .tagList").append(addstr);
		} else {
			$("#" + param + " .personnelList").append(addstr);
		}
	}
}