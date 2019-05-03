var baseURL ="";
var booDqDpToken = false;
var dqdp_csrf_token="";
function AjaxSend(objectOfXMLHttpRequest) {
	try{
		var s_ajaxListener = new Object();
		s_ajaxListener.tempOpen = objectOfXMLHttpRequest.prototype.open;

		objectOfXMLHttpRequest.prototype.open = function (method,url,async,name,password) {
			if (!url) var url = '';
			if(url.indexOf("dqdp_csrf_token")==-1){
				booDqDpToken = true;//为了判断jquery是否启用了
				if(url.indexOf("?")==-1){
					url +="?dqdp_csrf_token=" + dqdp_csrf_token;
				}else{
					url +="&dqdp_csrf_token=" + dqdp_csrf_token;
				}
			}
			s_ajaxListener.tempOpen.apply(this, arguments);
		}
	}catch(err){
		alert(err);
	}
}
function pasteHtmlAtCaret(html) {
	var sel, range;
	if (window.getSelection) {
		// IE9 and non-IE
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();

			// Range.createContextualFragment() would be useful here but is
			// non-standard and not supported in all browsers (IE9, for one)
			var el = document.createElement("div");
			el.innerHTML = html;
			var frag = document.createDocumentFragment(), node, lastNode;
			while ( (node = el.firstChild) ) {
				lastNode = frag.appendChild(node);
			}
			range.insertNode(frag);

			// Preserve the selection
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	} else if (document.selection && document.selection.type != "Control") {
		// IE < 9
		document.selection.createRange().pasteHTML(html);
	}
}
var xmlHttp;
if (window.XMLHttpRequest)
{// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlHttp=XMLHttpRequest;
}
else
{// code for IE6, IE5
	xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
}
AjaxSend(xmlHttp);

try{
	try {
		if(window.$!=undefined) {
			$(document).ajaxSend(function (event, xhr, options) {
				dqdp_csrf_token_fun(event, xhr, options);
			});
			$(function () {
				$(document).ajaxSend(function (event, xhr, options) {
					dqdp_csrf_token_fun(event, xhr, options);
				});
			})
		}
	}catch(err){
		$(document).on('ajaxSend', function(e, xhr, options){
			dqdp_csrf_token_fun(e,xhr,options);
		})
		$(function(){
			$(document).on('ajaxSend', function(e, xhr, options){
				dqdp_csrf_token_fun(e,xhr,options);
			})
		})
	}
}catch(err){
	if(booDqDpToken){
		alert(err+"1");//如果内置方法起作用，而且$没启用
	}else{
		alert(err+"0");//如果内置方法不起作用，而且$没启用
	}

}


function dqdp_csrf_token_fun(event,xhr,options){
	var tmp = true;
	//请求的url
	var dataUrl = options.url;
	var datas;
	if("POST" == options.type) {
		//如果post请求data数据不为空
		if(null != options.data && typeof options.data == 'string') {
			var dataStr = options.data;
			datas = dataStr.split("&");
			$.each(datas, function (index) {
				var keyvalue = datas[index].split("=");
				if (keyvalue[0] == "dqdp_csrf_token") {
					tmp = false;
				}
			});
			if(dataUrl.indexOf("dqdp_csrf_token")!=-1){
				tmp = false;
			}
		}
		else{
			if(dataUrl.indexOf("dqdp_csrf_token")!=-1){
				tmp = false;
			}
		}
	}
	//如果是get请求
	else{
		if(dataUrl.indexOf("dqdp_csrf_token")!=-1){
			tmp = false;
		}
	}
	if (tmp) {
		//当然这里还要判断url是不是有？了
		var url = options.url;
		if(dataUrl.indexOf("?")!=-1){
			options.url = options.url + "&dqdp_csrf_token=";
		}
		else{
			options.url = options.url + "?dqdp_csrf_token=";
		}
	}
}
//系统的配置信息
var wxqyhConfigReadyFunctionArray = [];//系统配置的ready function数组
var wxqyhConfigReadyFunction = function(fun){
	if (wxqyhConfig.config_state > 0) {
		fun();
	}
	else {
		wxqyhConfigReadyFunctionArray.push(fun);
	}
};
var wxqyhConfig = {
	is_vip: false,//是否vip
	vip_grade:0,
	is_pay_vip:false, //是不是支付VIP
	is_authen_org:false, //是不是认证企业
	myInterfaceList:{ //金卡接口权限

	},
	vip_max_person:100,//VIP最大人数限制
	current_user_member:100, //当前通讯录人数
	follow_user_member:100, //关注人数
	is_over_vip_max_person:false,//是否超过VIP人数限制

	is_match_no_vip_notify:false,//是否符合非VIP提醒规则
	is_in_vip_black_list:false,//是否在VIP黑名单
	is_in_vip_white_list:false,//是否在VIP白名单
	user_follow_count:0,//关注人数
	free_user_follow_person_max:25,//免费用户的最大使用人数

	upload_image_max: 1,//上传图片大小控制
	upload_qydisk_image_silver_max: 5,//云盘银卡VIP图片大小控制
	upload_image_vip_max: 10,//金卡上传图片大小控制
	upload_voice_max: 2,//上传声音大小控制
	upload_video_max: 10,//上传视频大小控制
	upload_learnonline_video_gold_max: 1000,//在线学习金卡上传视音频大小控制
	upload_learnonline_video_sliver_max: 500,//在线学习VIP上传视音频大小控制
	upload_learnonline_video_max: 50,//在线学习普通用户上传视音频大小控制
	upload_learnonline_file_max: 50,//在线学习普通用户上传文档大小控制
	upload_learnonline_image_max: 10,//在线学习普通用户上传图片大小控制
	upload_file_max: 10,//上传文件大小控制
	upload_qydisk_file_sliver_max:20,//云盘银卡VIP文件大小控制
	upload_file_vip_max: 50,//金卡用户上传文件大小控制
	is_qiweiyun: true, //是否企微云平台，false表示私有化
	is_use_yongzhong: false, //是否使用永中云转换预览
	yongzhong_url: "", //永中预览url
	orgConfigInfo : {//机构的一些信息
		orgName:"",
		orgLogo:"",
		isCooperation:false,//是否合作商
		type:1,//合作商类型，1渠道，2金卡
		orgId:"",
		createTime:"",
		corpId:""
	},
	org_config:{}, //机构配置
	orgSettingInfo:{
		isShowOpenFooter:"1", //是否显示外部分享底部：1是；0关闭；默认开启
		isShowNotInstallAgent:"1",//是否显示未安装应用：1是；0关闭；默认开启
		isSendHelpMsg:"1",//修改发送欢迎消息;1是；1是；0关闭；默认开启
		isShowCompanysrv:"1" //是否显示企业服务 1是；0关闭；默认开启

	},
	qwHistory:{
		historyData:"",
		historyMonth:"",
		historyExit:"",
		historyTip:"",
		historyAgentCode:"",
	},
	ready:wxqyhConfigReadyFunction
};
function readyWxqyhConfigRun(){
	for (var i=0; i<wxqyhConfigReadyFunctionArray.length; i++) {
		wxqyhConfigReadyFunctionArray[i]();
	}
}
//初始化配置信息，isRefresh 是否强制刷新
function initWxqyhConfig(isRefresh) {
	var temp = sessionStorage.getItem("wxqyhConfig");
	if(!isRefresh && temp){//如果是顶级页面刷新，强制重新获取一次
		wxqyhConfig = JSON.parse(temp);
		wxqyhConfig.config_state = 1;//表示使用缓存
		wxqyhConfig.ready = wxqyhConfigReadyFunction;
		readyWxqyhConfigRun();
	}
	else{
		// $.ajax({
		// 	url:baseURL+"/vip/vipAction!wxqyhConfig.action",
		// 	type:"post",
		// 	dataType:"json",
		// 	success:function(result){
		// 		if(result.code=="0") {
		// 			wxqyhConfig = result.data;
		// 			sessionStorage.setItem("wxqyhConfig", JSON.stringify(wxqyhConfig));
		// 			wxqyhConfig.config_state = 1;//表示使用缓存
		// 			wxqyhConfig.ready = wxqyhConfigReadyFunction;
		// 			readyWxqyhConfigRun();
		// 		}
		// 		else if(result.code=="-1"){
		// 			_alert("提示","系统出现异常，请重试");
		// 			wxqyhConfig.config_state = -1;
		// 		}
		// 	},
		// 	error: function () {
		// 		_alert("提示","网络错误");
		// 		wxqyhConfig.config_state = -1;
		// 	}
		// });
	}
}
function _top_alert(msg,type,time,callBack){
	if(window!=window.top){
		window.top._top_alert(msg,type,time,callBack);
		return;
	}
	// 没有传time则默认定时器时间为3500ms
	var t = time || 3500;
	if(msg == ""|| msg == undefined)return;
	if($('body .qydisk_tips').length>0){$('body .qydisk_tips').remove();}
	var tips = $('<div class="qydisk_tips">'+msg+'</div>');
	if(type == false){
		tips.attr('style','background: #e45151 url('+baseURL+'/manager/images/ic_top_tips.png)15px -43px no-repeat;');
	}
	$('body').append(tips);
	tips.css('margin-left',-tips.width()/2);
	window.top.setTimeout(function(){
		$('body .qydisk_tips').remove();
	},t);
	if(callBack){callBack()}
}
//获取节点字段编辑信息的可见可编辑信息,分支流程最大化用
function get_node_field_info(){
	var countData = [];
	$('.item_task_node').each(function(i,e){
		countData.push($(e).data('nodeInfo'));
	});
	return countData;
}
var _browser=navigator.appName,_hrefLink="javascript:";try{jquery_ui_loded||_loadJqueryUI()}catch(e$$10){_loadJqueryUI()}function _loadJqueryUI(){writeCss(baseURL+"/static/js/jquery-ui-1.8/jquery-ui-1.8.custom.css");writeJs(baseURL+"/static/js/jquery-ui-1.8/jquery-ui-1.8.custom.min.js")}
function writeJs(a){var b=document,d=document.getElementsByTagName("head")[0],c=b.createElement("script");c.setAttribute("type","text/javascript");c.setAttribute("src",a);c.setAttribute("async",!0);c.onerror=function(){d.removeChild(c)};d.appendChild(c)}
function writeCss(a){var b=document,d=document.getElementsByTagName("head")[0],c=b.createElement("link");c.setAttribute("type","text/css");c.setAttribute("href",a);c.setAttribute("rel","stylesheet");c.setAttribute("async",!0);c.onerror=function(){d.removeChild(c)};d.appendChild(c)}try{var _browser_Version=navigator.appVersion.split(";")[1].replace(/[ ]/g,""),_hrefLink="MSIE6.0"==_browser_Version?"#":"javascript:"}catch(e$$13){_hrefLink="javascript:"}
function _rollbackFrameHeight(){var a=this.frameElement;if($(a).hasClass("not_resetFrameHeight")){return;};a&&(a.height=100,_heightSeted=!1)}var _heightSeted=!1;
//"http://api.map.baidu.com/api?v=2.0&ak=N8tEUoq1FsPdMmHFattStreQ"
function _resetFrameHeight(){
	// var a=this.frameElement ;
	// if($(a).hasClass("not_resetFrameHeight")){return;}
	// a&&(a.height=a.contentDocument?a.contentDocument.documentElement.scrollHeight:
	// 	"MSIE9.0"==_browser_Version?a.document.documentElement.scrollHeight:a.contentWindow.document.body.scrollHeight+0,_heightSeted=!0,a.setAttribute('scrolling','no'))
	// if(window!=window.top)
	// 	window.parent._resetFrameHeight();
}
// console.log(window.document)
// console.log(window.document.body)
$(function(){
    window.document.body.addEventListener("onresize",_resetFrameHeight);
});


function _doEmpty(){}var _pageInitSignl=0,eventAfterDraw=null,eventBeforDraw=null;
function Dqdp(){this.permissions=null;Dqdp.prototype.submitCheck=function(a){var a=$("#"+a+" [valid]"),b=!0,d=null;$.each(a,function(a,e){var f="",g=$(e).attr("valid"),h=$(e).val(),g=eval("("+g+")");g.must&&(_isNullValue(h)||_isNull(h))?(b=_appendErrorTip(e,g.tip+"不能为空"),f=g.tip+"不能为空"):_removeErrorTip(e);if(h){g.length&&_strlength(h)>g.length&&(f="只能输入"+g.length+"个字");switch(g.fieldType){case "datetime":f=checkDate(h,"yyyy-MM-dd HH:mm:ss");break;case "date":f=checkDate(h,"yyyy-MM-dd");
	break;case "certId":f=checkCertID(h);break;case "pattern":RegExp(g.regex,"g").test(h)||(f="格式不正确");break;case "func":eval(g.regex)||(f="格式不正确")}""==f?_removeErrorTip(e):_appendErrorTip(e,g.tip+f);""!=f&&(b=!1,d||(d=e))}});d&&d.focus();_resetFrameHeight();return b};Dqdp.prototype.initPage=function(){eventBeforDraw&&eventBeforDraw.call(eventBeforDraw,null);_initCMD();_resetFrameHeight();eventAfterDraw&&eventAfterDraw.call(eventAfterDraw,null)}}
function _redraw(a,b,c){eventBeforDraw&&eventBeforDraw.call(eventBeforDraw,null);0<arguments.length?(1==arguments.length?(_initElementValue(a,!1),_buildEditor(a,!1)):(_initElementValue(a,b),_buildEditor(a,b)),_filtePermission(a),_showOn(a),_rebuildSelect(a),_rebuildDictInputByAttr("checkbox",a),_rebuildDictInputByAttr("radio",a),_bindDictParent(a),_bindEvent(),_undisabled(a)):_initCMD();eventAfterDraw&&eventAfterDraw.call(eventAfterDraw,null);if(c){c();}}
function _initCMD(){_initElementValue();_filtePermission();_showOn();_rebuildSelect();_rebuildDictInputByAttr("checkbox");_rebuildDictInputByAttr("radio");_bindDictParent();_buildEditor();_bindEvent();_undisabled()}function _regEventBeforDraw(a){eventBeforDraw=a}function _regEventAfterDraw(a){eventAfterDraw=a}function _showOn(a){var b=$(1==arguments.length?"#"+a+" [showOn]":"[showOn]");$.each(b,function(b,d){var c=$(d);try{eval(c.attr("showOn"))?c.show():c.hide()}catch(e){c.hide()}})}
function _bindEvent(){var a=$("[keySearch]");$.each(a,function(){this.onkeyup=function(){13==(event?event:window.event?window.event:null).keyCode&&eval($(this).attr("keySearch"))}})}function _appendErrorTip(a,b){null==$(".error",$(a).parent()).html()&&$(a).parent().append("<p class='error'><font color='red'>("+b+")</font></p>");return!1}function _removeErrorTip(a){null!=$(".error",$(a).parent()).html()&&$(".error",$(a).parent()).remove();return!1}
function _getDictDesc(a,b,d){var c=_dqdp_dict[a];if(b)for(var e=b.split("."),f=0;f<e.length;f++)for(var g in c)for(var h in c[g])h==e[f]&&(c=c[g][h].child);if(3==arguments.length)for(g in c)for(h in c[g])if(h==d)return c[g][h].desc;return c}
function _undisabled(a){var b=$(1==arguments.length?"#"+a+"  [_disabled]":"[_disabled]");$.each(b,function(a,c){$(c).attr("disabled","true"==$(c).attr("_disabled")?!0:!1)});b=$(1==arguments.length?"#"+a+"  [_readonly]":"[_readonly]");$.each(b,function(a,c){$(c).attr("readonly","true"==$(c).attr("_readonly")?!0:!1)})}
function _bindDictParent(a){var b=$(1==arguments.length?"#"+a+"  [parentDict]":"[parentDict]");$.each(b,function(a,c){var b=$(this),f=$("#"+b.attr("parentDict"));$(f).live("change",function(){for(var a="",d="",f=$(b);void 0!=f.attr("parentDict")&&null!=f.attr("parentDict")&&""!=f.attr("parentDict");){f=$("#"+f.attr("parentDict"));a=f.val()+(0<a.length?".":"")+a;if(""==a)break;if(void 0==f.attr("parentDict")||""==f.attr("parentDict")||null==f.attr("parentDict"))var d=f.attr("dictType"),j=f.attr("dictItem"),
	a=j+(""==j?"":".")+a}!_isNullValue(a)&&""!=a?(f=$(this).attr("param"),_isNullValue(f)?c.setDictData(_getDictDesc(d,a)):(a=_doGetDataSrc(baseURL+"/dictmgr/dictmgr!queryDictByParent.action","searchValue['_value']="+a+"&searchValue['_dictType']="+d+"&"+f),null!=a&&c.setDictData(a[d])),d=b.attr("defaultValue"),!_isNullValue(d)&&""!=d&&b.attr("value",d)):c.setDictData(null)});f.change()})}
function _rebuildSelect(a){var b=$(1==arguments.length?"#"+a+"  select":"select");$.each(b,function(a,c){var b=$(c),f=b.attr("dictType"),g=b.attr("dictItem"),h=b.attr("param"),i=b.attr("defaultValue");$.extend(c,{setDictData:function(a){_cleanSelect(b);b.html("");if(null!=a){var c=b.attr("defaultTip"),c=_isNullValue(c)?"<option value=''>请选择</option>":""==c?"":"<option value=''>"+c+"</option>";b.append(c);for(var d in a)for(var f in a[d])b.append("<option value='"+f+"'"+(f==i?"selected":"")+">"+a[d][f].desc+
	"</option>")}}});_isNullValue(f)||(_isNullValue(h)?this.setDictData(_getDictDesc(f,g)):(g=_doGetDataSrc(baseURL+"/dictmgr/dictmgr!queryDict.action","searchValue['_dictType']="+f+"&"+h),null!=g&&this.setDictData(g[f])))})}function _isNullValue(a){return void 0==a||null==a}function _cleanSelect(a){$.each($("[parentDict="+a.attr("id")+"]"),function(a,d){var c=$(d);_cleanSelect(c);try{d.setDictData(null)}catch(e){}})}
function _filtePermission(a){var b=$(1==arguments.length?"#"+a+"  [permission]":"[permission]");for(var a=0;a<b.length;a++){var c= b[a];var d=$(c).attr("permission");""==d||_dqdp_permissions[d]||("true"==$(c).attr("readonlyWhenNoPermission")?$(c).attr("readonly","readonly"):$(c).remove())}}
function _rebuildDictInputByAttr(a,b){var d=$(1!=arguments.length?"#"+b+" :"+a:":"+a);$.each(d,function(){var b=$(this),d=b.attr("dictType"),f=b.attr("dictItem"),g=b.attr("defaultValue"),h=b.attr("name"),i=b.attr("param");if(!d)return!0;g&&""!=g&&(g=g.split(","));this.setDictData=function(d){if(null!=d){var e=$(b.parent()),f=b.attr("onclick");$("[name='"+h+"']").remove();for(var i in d){for(var m in d[i])var n="";for(var o in g)g[o]==m&&(n="checked='checked'");e.append("<input style='padding-right: 3px' type=\""+
	a+'" '+(null==f?"":'onclick="'+f+'"')+'name="'+h+"\" value='"+m+"' "+n+">"+d[i][m].desc+"&nbsp;&nbsp;")}}};_isNullValue(i)?null!=d&&this.setDictData(_getDictDesc(d,f)):(f=_doGetDataSrc(baseURL+"/dictmgr/dictmgr!queryDict.action","searchValue['_dictType']="+d+"&"+i),null!=f&&this.setDictData(f[d]));null!=g&&b.val(g)})}var _eleTemplateStore=new HashMap;
function _resetElement(a){if(1>arguments.length)for(var b=_eleTemplateStore.keys(),d=0;d<b.length;d++)$("#"+b[d]).html(_eleTemplateStore.get(b[d]));else b=_eleTemplateStore.get(a),null!=b&&void 0!=b&&""!=b&&$("#"+a).html(b)}function _destoryPage(){_eleTemplateStore.clear()}$(window).unload(function(){_destoryPage()});var _editors=new HashMap;
function _buildEditor(a,b){var d=null,d=0<arguments.length?$("#"+a+(b?" ":"")+"[editor]"):$("[editor]");$.each(d,function(){var a=$(this),b=a.text(),d=eval("("+a.attr("editor")+")"),g=KindEditor.create("#"+a.attr("id"),d.param);g.html(b);d.readonly&&g.readonly();_editors.put(a.attr("id"),g)})}
function _initElementValue(a,b){var d=null,d=0<arguments.length?$("#"+a+(b?" ":"")+"[dataSrc]"):$("[dataSrc]");$.each(d,function(a){var b=$(this),d=b.attr("id");if(null==d||void 0==d)b.attr("id","_id_div_"+a),d=b.attr("id");_resetElement(d);_eleTemplateStore.put(d,b.html());var a=b.attr("dataSrc"),c=[];_isNull(a)||(-1<a.indexOf("local:")?(a=eval(a.substr(6,a.length)),c.push(a),_doEleValueDispathc(b,a,c),_resetFrameHeight()):$.ajax({type:"post",data:{dqdp_csrf_token:dqdp_csrf_token},url:a,dataType:"json",
	async:!1,success:function(a){"0"==a.code?(a=a.data,c.push(a),_doEleValueDispathc(b,a,c),_resetFrameHeight()):_alert("错误提示",a.desc)},error:function(){_alert("错误提示","通讯故障")}}))});_showOn(a);try{_resetFrameHeight(document.documentElement.scrollHeight)}catch(c){}}var _varReg=/@(\{|\%7B)([^@]*?(@(\{|\%7B)[^@].*?(\}|\%7D)|.)*?)(\}|\%7D)/,_expReg=/^#(.*?)#/,_jSmartSupport=!1;
function _replaceVar(a,b,d){for(var c=a.html(),e;null!=(e=_varReg.exec(c));){var f;if(null!=(f=_expReg.exec(e[2]))){_jSmartSupport||($("<script><\/script>").attr({src:baseURL+"/js/3rd-plug/jsrender/jsrender.js",type:"text/javascript",id:"load"}).appendTo($("head").remove("#loadscript")),_jSmartSupport=!0);for(var g=f[1];null!=(f=_varReg.exec(g));)var h=_replaceHTMLVar(f[2],b,d),g=g.replace(f[0],h);$.templates("xxx","{{"+g+"}}");f=$.render.xxx(b)}else f=_replaceHTMLVar(e[2],b,d);c=c.replace(e[0],f)}c!=
a.html()&&a.html(c)}function _replaceHTMLVar(a,b,d){for(var c;null!=(c=_varReg.exec(a));)var e=_replaceHTMLVar(c[2],b,d),a=a.replace(c[0],e);var f,a=a.split(".");for(c=0;c<a.length;c++)if(f=""==a[c]?d[d.length-c-2]:0==c?b[a[c]]:f[a[c]],null==f||void 0==f)f="";return f}
function _doEleValueDispathc(a,b,d){$("[listSourceBackup=false]",a).remove();var c=$("[name]",a);$.each(c,function(){for(var a=$(this),c=a.attr("name"),g;null!=(g=_varReg.exec(c));){var h=_replaceHTMLVar(g[2],b,d),c=c.replace(g[0],h);alert(c)}var c=c.split("."),i;for(g=0;g<c.length;g++)if(i=""==c[g]?d[d.length-g-2]:0==g?b[c[g]]:i[c[g]],null==i||void 0==i)i="";if(null==i||void 0==i||"array"!=$.type(i))_doElementValueSet(this,i);else if(c=a.parent(),"true"==c.attr("listSourceBackup")&&"true"!=a.attr("listSourceBackup"))a.remove();
else if("SELECT"==a[0].tagName)_doElementValueSet(a[0],i);else if(void 0!=a.attr("merge")&&!_isNull(a.attr("merge")))_doElementValueSet(a[0],i.join(a.attr("merge")));else{h=a.attr("class");g=null;null!=h&&-1<h.indexOf("|")&&(g=h.split("|"));for(h=0;h<i.length;h++){void 0==i[h]._index&&(i[h]._index=""+(h+1));var j=a.clone();j.html(j.html().replace("\\#_rpa_\\#","@{"));j.attr("listSourceBackup","false");if(0<$("[name]",j).length||-1<j.html().indexOf("@{")){for(var l=[],k=0;k<d.length;k++)l[k]=d[k];
	l.push(i[h]);_doEleValueDispathc(j,i[h],l)}else _doElementValueSet(j[0],i[h]);c.append(j);null!=g&&j.attr("class",g[h%g.length]);j.show()}a.remove()}});_replaceVar(a,b,d)}
function _doElementValueSet(a,b){if ($.type(b)=="object"||$.type(b) == "array"){b=JSON.stringify(b);}var d=$(a);if("INPUT"==a.tagName||"TEXTAREA"==a.tagName||"SELECT"==a.tagName)if("TEXTAREA"==a.tagName&&d.attr("editor"))d.html(b);else{switch(d.attr("type")){case "radio":case "checkbox":d.val()==b?d.attr("checked",!0):d.removeAttr("checked");d.attr("defaultValue",b);break;default:if(null==b||void 0==b)b=d.attr("defaultValue");d.attr("value",b)}if("SELECT"==a.tagName)if("array"==$.type(b)){d.html("");for(var c=0;c<b.length;c++){var e=d.attr("keyForSelect"),e=b[c][e],
	f=b[c][d.attr("descForSelect")];d.append("<option value='"+e+"'"+(e==d.attr("defaultValue")?"selected":"")+">"+f+"</option>")}}else""!=(d.attr("defaultTip")||!_isNullValue(b))&&d.attr("defaultValue",b); if (a.tagName == "TEXTAREA") d.text(b);}else"IMG"==a.tagName?d.attr("src",d.attr("src")+b):(c=d.attr("charLength"),null==b||void 0==b?b=d.attr("defaultValue"):void 0!=c&&null!=c&&""!=c&&(d.attr("title",b),b=_getStrByLen(b,c)),d.text(b))}
function _alert(a,b,d){var c=$("#id_dialog"),e=null;2<arguments.length&&null!=d&&(e=d);c[0]||($(document.body).append("<div id=\"id_dialog\" style='width: 427px'><div>"),c=$("#id_dialog"));c.html("<table   border='0' cellspacing='0' cellpadding='0'><tr><td><table  border='0' align='center' cellpadding='0' cellspacing='0'><tr><td rowspan='2' valign='top' class='tipsImg'><img src='"+baseURL+"/themes/default/images/icon/iconTips.png' /></td><td valign='top' >"+b+"</td></tr><tr><td align='center' valign='middle'></td></tr></table></td></tr></table>").dialog({resizable:!1,
	overflow:"hidden",position:"center",modal:!0,title:a,minHeight:180,minWidth:320,buttons:{"关闭":function(){$(this).dialog("close");e&&e.call(e,null,null)}}});_resetFrameHeight()}function _pageGo(a,b,d){a=Number(a);b=Number(b);a<b?_alert("错误提示","超出最大页数"):1>b?_alert("错误提示","超出最小页数"):eval(d+"("+b+")")}$(document).ready(function(){_rollbackFrameHeight();(new Dqdp).initPage();_resetFrameHeight();});
function _doCheck(a,b){$.each($("[name="+b+"]"),function(b,c){$(c).attr("disabled")||("checked"==$(a).attr("checked")?$(c).attr("checked","checked"):$(c).removeAttr("checked"))})}function _doGetChooseRow(a){var b="";$.each($("#"+a).find("[name=ids]"),function(a,c){"checked"==$(this).attr("checked")&&(0<b.length&&(b+=","),b+=$(c).val())});return b}
function _doEdit(){var a=_doGetChooseRow("ids");if(0==a.length)return _alert("提示","请选择要编辑的数据"),!1;if(-1<a.indexOf(","))return _alert("错误提示","请不要选择多条数据"),!1;document.location.href=$("#"+$divId).attr("editUrl")+"?dqdp_csrf_token="+dqdp_csrf_token+"&id="+a}function _doAdd(a){document.location.href=$("#"+a).attr("addUrl")+"?dqdp_csrf_token="+dqdp_csrf_token}
function _doSignlDel(a, b, d, t,f) {$("#" + a + " [name=ids][value=" + b + "]").attr("checked", "true");$("#" + a + " [name=ids][value!=" + b + "]").removeAttr("checked");if (3 == arguments.length) _doDel(a, d); else if (4 == arguments.length) _doDel(a, d, t); else if (5 == arguments.length) _doDel(a, d, t,f); else _doDel(a);}
function _doSignlEdit(a,b){$("#"+a+" [name=ids][value="+b+"]").attr("checked","true");$("#"+a+" [name=ids][value!="+b+"]").removeAttr("checked");var d=_doGetChooseRow(a);if(0==d.length)return _alert("提示","请选择要编辑的数据"),!1;document.location.href=$("#"+a).attr("editUrl")+"?dqdp_csrf_token="+dqdp_csrf_token+"&id="+d}
function _doSignlView(a,b){$("#"+a+" [name=ids][value="+b+"]").attr("checked","true");$("#"+a+" [name=ids][value!="+b+"]").removeAttr("checked");var d=_doGetChooseRow(a);if(0==d.length)return _alert("提示","请选择要查看的数据"),!1;document.location.href=$("#"+a).attr("viewUrl")+"?dqdp_csrf_token="+dqdp_csrf_token+"&id="+d}
function _doCommonSubmit(a,b,d,e){$(":button").attr("disabled",!0);for(var c=0;c<_editors.values().length;c++)_editors.values()[c].sync();c=new Dqdp;if(!b||null==b)b={};b.dqdp_csrf_token=dqdp_csrf_token;c.submitCheck(a)?$("#"+a).ajaxSubmit({dataType:"json",data:b,async:!1,forceSync:!0,success:function(a){$(":button").attr("disabled",!1);if(e&&e=="new"){"0"==a.code?_top_alert(a.desc,true,3500,d.ok):_alert("提交结果",a.desc,d.fail)}else{"0"==a.code?_alert("提交结果",a.desc,d.ok):_alert("提交结果",a.desc,d.fail)}},error:function(){$(":button").attr("disabled",!1);_alert("错误提示","通讯故障",d.error)}}):$(":button").attr("disabled",
	!1)}

function _doGetDataSrc(url,reqdata){
	var data=null;
	if(!reqdata||null==reqdata)
		reqdata={};
	reqdata.dqdp_csrf_token=dqdp_csrf_token;
	$.ajax({type:"get",url:url,data:reqdata,dataType:"json",async:!1,
		success:function(res){ 0==res.errcode ? data=res.data : _alert("错误提示",res.errmsg) },
		error:function(){_alert("错误提示","通讯故障")}});
	// alert(data);
	return data
}
function ListTable(a){this.data=a.data;this.title=a.title;this.trStyle=a.trStyle;this.trevent=a.trevent;this.operations=a.operations;this.checkableColumn=a.checkableColumn;ListTable.prototype.setTitle=function(a){this.title=a};ListTable.prototype.setData=function(a){this.data=a};ListTable.prototype.createList=function(b){for(var d="<thead> <tr>",c=0;c<this.title.length;c++)d=""!=this.checkableColumn&&this.title[c].isCheckColunm?d+("<th width="+this.title[c].width+'><input type="checkbox" onclick="_doCheck(this,\'ids\')"></th>'):
	this.title[c].isOperationColumn?d+("<th width="+this.title[c].width+"> 操作 </th>"):d+("<th width="+this.title[c].width+">"+this.title[c].showName+"</th>");var d=d+"</tr> </thead>",e="<tbody >";if(null==this.data||void 0==this.data||1>this.data.length)e+='<tr  class="'+this.trStyle[c%2]+'" ><td colspan="'+this.title.length+'">查询结果为空</td></tr>';else for(c=0;c<this.data.length;c++){void 0==this.data[c]._index&&(this.data[c]._index=""+(c+1));for(var f=this.data[c],e=e+('<tr  class="'+this.trStyle[c%2]+
	'" '),e=e+">",g=0;g<this.title.length;g++)if(this.title[g].isCheckColunm)var h=this.title[g].checkAble,h=h?h.call(h,c,f)?"":"disabled='true'":"",e=e+('<td class="tc" width='+this.title[g].width+'><input type="checkbox" name="ids" '+h+' value="'+this.data[c][a.checkableColumn]+'"></td>');else if(this.title[g].isOperationColumn)e+='<td class="tdOpera  tc"  width='+this.title[g].width+">",$.each(this.operations,function(a,b){if((!b.permission||_dqdp_permissions[b.permission])&&(!b.condition||b.condition.call(b.condition,
		c,f)))e+='<a href="'+_hrefLink+'">'+b.name+"</a>&nbsp;&nbsp;"}),e+="</td>";else{var h=this.title[g].name,i=this.data[c];if ($.type(i[h])=="object"||$.type(i[h]) == "array"){i[h]=JSON.stringify(i[h]);} var j=this.title[g].emptyValue;_isNullValue(j)&&(j="&nbsp;");_isNullValue(i[h])?e+='<td class="tc" dataType="data">'+j+"</td>":(!this.title[g].noSafe&&"string"==typeof i[h]&&(i[h]=i[h].replace('"',"&quot;"),i[h]=i[h].replace("<","&lt;"),i[h]=i[h].replace(">","&gt;")),j=this.title[g].href&&(!this.title[g].linkPermission||_dqdp_permissions[this.title[g].linkPermission]),e+='<td class="tc" dataType="data">'+
	(j?'<a type="link" titleIndex="'+g+'" href="'+_hrefLink+'">':"")+_getListShowByType(this.title[g].length?_getStrByLen(i[h],this.title[g].length):i[h],this.title[g].showType)+(j?"</a>":"")+"</td>")}e+="</tr>"}e+="</tbody>";$("#"+b).html('<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">'+d+e+"</table>");if(!(null==this.data||void 0==this.data||1>this.data.length)){var l=this.title;$.each(this.data,function(a,d){var c=$("#"+b).find("tr:eq("+(a+1)+") [type=link]");$.each(c,
	function(a,b){var c=$(b),e=l[c.attr("titleIndex")].href;c.click(function(){e.call(e,a,d)})})});var k=this.trevent;$.each(this.data,function(a,d){for(var c in k){var e=k[c];$("#"+b).find("tr:eq("+(a+1)+")").bind(c,function(){e.call(e,a,d)})}});k=this.operations;$.each(this.data,function(a,d){var c=$("#"+b).find("tr:eq("+(a+1)+") td:last-child a");$.each(c,function(a,b){$(this).click(function(){$.each(k,function(a,c){c.name==$(b).text()&&k[a].event.call(k[a].event,a,d)})})})});try{_resetFrameHeight(document.documentElement.scrollHeight)}catch(p){}}}}
function _getListShowByType(a,b){switch(b){case "image":return a=a.replace(" ",""),0>a.indexOf("http://")&&0>a.indexOf("https://")&&(a=baseURL+"/"+a),void 0==b?"<img src='' alt=''/>":"<img src='"+a+"' alt=''/>";default:return void 0==a?"&nbsp;":a}}
function Pager(a){this.totalPages=a.totalPages;this.currentPage=a.currentPage;this.funcName=a.funcName;Pager.prototype.createPageBar=function(a){if(1>this.totalPages){$("#"+a).html('<a href="#" >上一页</a>|<a href="#" >下一页</a>|&nbsp;共0页<span class="font048"></span>');try{_resetFrameHeight(document.documentElement.scrollHeight)}catch(d){}}else{var c;c=""+('<a href="javascript:'+this.funcName+"("+(this.currentPage-1)+')" >上一页</a>|');c+='<a href="javascript:'+this.funcName+"("+(this.currentPage+1)+')" >下一页</a>|';
	c+="&nbsp;共"+this.totalPages+'页<span class="font048">第 <input class="form24px border999" type="text" id="id_'+a+'_page" value="'+this.currentPage+'"/> 页</span>';c+='<input class="btnQuery" type="button" value="转到" onclick="var goPage=$(\'#id_'+a+"_page').val();if(!_checkPager("+this.totalPages+",goPage))return;"+this.funcName+'(goPage)"/>';$("#"+a).html(c);try{_resetFrameHeight(document.documentElement.scrollHeight)}catch(e){}}}}
function _checkPager(a,b){return!/^\d+$/.test(b)?(_alert("错误提示","页数格式不正确"),!1):b>a?(_alert("错误提示","超出最大页"),!1):!0}
var regYyyy_mm_dd_A=/^(\d{4})-(\d{1,2})-(\d{1,2})$/,regDateTime=/^(\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/,regChineseY_m_d=/^(\d{4})年(\d{1,2})月(\d{1,2})$/,regSlashY_m_d=/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,regSlashYmd=/^(\d{4})(\d{1,2})(\d{1,2})$/,sDateFormatA="yyyy-mm-dd",sDateFormatB="yyyy年mm月dd日",sDateFormatC="yyyy/mm/dd",MONTH_LENGTH=[31,28,31,30,31,30,31,31,30,31,30,31],LEAP_MONTH_LENGTH=[31,29,31,30,31,30,31,31,30,31,30,31];
function _isNull(a){"object"==typeof a&&(a=a.toString());return""==a||""==a.replace(/\s+/g,"")?!0:!1}function checkCertID(a){var b=!0,a=a.replace(/(^\s+)|(\s+$)/g,"");if(""==a)return"身份证号格式错误";if(15==a.length||18==a.length)15==a.length?(year="19"+a.substring(6,8),month=a.substring(8,10),day=a.substring(10,12)):(year=a.substring(6,10),month=a.substring(10,12),day=a.substring(12,14)),b=checkDate(year+month+day,"yyyymmdd");else return"不应为"+a.length+"位，请纠正\n";return""==b?"":"身份证号中的日期错误"}
function checkDate(a,b){if(""!=a){var d=null;null==b&&(b=sDateFormatA);if("yyyy-mm-dd"==b)d=regYyyy_mm_dd_A;else if("yyyy年mm月dd日"==b)d=regChineseY_m_d;else if("yyyy/mm/dd"==b)d=regSlashY_m_d;else if("yyyymmdd"==b)d=regSlashYmd;else if("yyyy-MM-dd HH:mm:ss"==b)d=regDateTime;else return"正确的格式应为:"+b+"!\n";if(!d.test(a))return"应为日期类型!";var c=a.match(d),d=c[1],e=c[2],c=c[3];return 1>d||9999<d||1>e||12<e||1>c||c>getMonthDay(e-1,d)?"中的日期有误!":""}return""}
function checkTime(a,b){var d=document.getElementsByName(a)[0].value,c=document.getElementsByName(b)[0].value,d=d.replace("-","/"),c=c.replace("-","/"),d=new Date(d),c=new Date(c),e=new Date,e=e.getFullYear()+"/"+(e.getMonth()+1)+"/"+e.getDate(),e=new Date(e);return d.getTime()<e.getTime()?"开始时间不能早于当天":c.getTime()<e.getTime()?"结束时间不能早于当天":d.getTime()>c.getTime()?"开始时间不能早于结束时间":!0}function getMonthDay(a,b){return isLeapYear(b)?LEAP_MONTH_LENGTH[a]:MONTH_LENGTH[a]}
function isLeapYear(a){return 0==a%4&&(0!=a%100||0==a%400)}function _strlength(a){return a.length;/*for(var b=a.length,d=b,c=0;c<b;c++)(0>a.charCodeAt(c)||255<a.charCodeAt(c))&&d++;return d*/}function _getStrByLen(a,b){if(""==a)return"";for(var d=_strlength(a),c="",e=0,f=0;e<b;f++){e++;(0>a.charCodeAt(f)||255<a.charCodeAt(f))&&e++;if(e>d)break;if(e<=b+1&&(c+=a.charAt(f),e>b||e==b&&b!=d))c+="......"}return c}
function DqdpSelect(a){this.data=a.data;this.selectValue=a.selectValue;this.selectName=a.selectName;DqdpSelect.prototype.createSelect=function(a){for(var d=this.selectName,c=this.selectValue,e=this.data,f=0;f<e.length;f++)$("#"+a).append("<option value='"+e[f][c]+"'>"+e[f][d]+"</option>")}}
function HashMap(){var a=0,b={};this.put=function(d,c){this.containsKey(d)||a++;b[d]=c};this.get=function(a){return this.containsKey(a)?b[a]:null};this.remove=function(d){this.containsKey(d)&&delete b[d]&&a--};this.containsKey=function(a){return a in b};this.containsValue=function(a){for(var c in b)if(b[c]==a)return!0;return!1};this.values=function(){var a=[],c;for(c in b)a.push(b[c]);return a};this.keys=function(){var a=[],c;for(c in b)a.push(c);return a};this.size=function(){return a};this.clear=
	function(){a=0;b={}}}
jQuery.fn.floatdiv=function(a){var b=!1;$.browser.msie&&"6.0"==$.browser.version&&($("html").css("overflow-x","auto").css("overflow-y","hidden"),b=!0);$("body").css({margin:"0px",padding:"0 10px 0 10px",border:"0px",height:"100%",overflow:"auto"});return this.each(function(){var d;if(void 0==a||a.constructor==String)switch(a){case "rightbottom":d={right:"0px",bottom:"0px"};break;case "leftbottom":d={left:"0px",bottom:"0px"};break;case "lefttop":d={left:"0px",top:"0px"};break;case "righttop":d={right:"0px",
	top:"0px"};break;case "middle":var c=0,e;self.innerHeight?(d=self.innerWidth,e=self.innerHeight):document.documentElement&&document.documentElement.clientHeight?(d=document.documentElement.clientWidth,e=document.documentElement.clientHeight):document.body&&(d=document.body.clientWidth,e=document.body.clientHeight);d=d/2-$(this).width()/2;c=e/2-$(this).height()/2;d={left:d+"px",top:c+"px"};break;default:d={right:"0px",bottom:"0px"}}else d=a;$(this).css("z-index","9999").css(d).css("position","fixed");
	b&&(void 0!=d.right&&(null==$(this).css("right")||""==$(this).css("right"))&&$(this).css("right","18px"),$(this).css("position","absolute"))})};


//宽度自适应
$(function(){
	var container =  $('#container').width();
	var aside_first =  $('#aside_first').width();
	var chooseDept = $('#chooseDept').width();
	// var left_w =  $('#left_w').width();
	// var right_w = chooseDept - left_w -99;
	var mian = $('#container').width() - $('#aside_first').width() - 20;
	//alert(container);
	initWxqyhConfig(window.top == window.self);//如果是顶级页面刷新，强制重新获取一次
	//$('#right_w').width(right_w);
})

//高度自适应
$(function(){
	var container = $('#container').height();
	var main = $('#main').height();

	var cPage_h = $('.cPage').height()+200;
	if (container < cPage_h) {
		$('#container').height(cPage_h);
	}

	$('body').on('mouseover','.tipsBox',function(e){
		var $div=$(this).children('.tipsItemBelow');
		var left=$(this).offset().left;
		var right=$('body').width()-left;
		var top = $(this).offset().top
		if($div.length){
			if($div.hasClass('bottomRight')){
                right = -10;
                top = top+10;
			}
			if(left+325>$('body').width()){
				$div.addClass('right');
				$div.css({'top':top-$(document).scrollTop()+32,'left':'initial','right':right+10});
			}else{
				$div.removeClass('right');
				$div.css({'top':top-$(document).scrollTop()+32,'left':left-26})
			}
		}else {
			$div=$(this).children('.tipsItem');
			if(left+325>$('body').width()){
				$div.addClass('right');
				$div.css({'top':$(this).offset().top-3-$(document).scrollTop(),'left':'initial','right':right+10});
			}else{
				$div.removeClass('right');
				$div.css({'top':$(this).offset().top-3-$(document).scrollTop(),'left':left+24})
			}
		}
		$div.show();
	});
	$('body').on('mouseleave','.tipsBox',function(){
		$(this).children('.tipsItem,.tipsItemBelow').hide();
	});
	//表单关联的运算符提示
	$('body').on('mouseenter','.dropdown-tip-tog.fa-question-circle',function(e){
		var position = $(this).offset();
		var sroll = $(document).scrollTop();
		var content = $(e.target).next().clone();
		content.css({
			position:'fixed',
			top:position.top+30-sroll,
			left:position.left-20,
		});
		content.addClass('tip-box-formref');
		$('body').children('.tip-box-formref').remove();
		$('body').append(content.show());
	}).on('mouseleave','.dropdown-tip-tog.fa-question-circle',function(e){
		$('body').children('.tip-box-formref').remove();
	});
	$('body').on('mouseenter','.dropdown-tip-toggle',function(){
		var tips = $(this).attr('dropdown-tip-toggle').replace(/##/g,'<br>');
		var position = $(this).offset();
		var sroll = $(document).scrollTop();
		var content = $('<div class="tooltips"><div class="tooltips-arrow"></div><div class="tooltips-inner">'+tips+'</div></div>');
		var parentW = $(this).outerWidth();
		$('body').children('.tooltips').remove();
		$('body').append(content);
		var top = 33;
		if($(this).hasClass('nav-form-button')){
			top = 60;
		}
		content.css({top:position.top+sroll+top+'px',left:position.left-(content.outerWidth()-parentW)/2+'px',})//(content.width()-parentW)/2
	}).on('mouseleave','.dropdown-tip-toggle',function(e){
		$('body').children('.tooltips').remove();
	});
})

$(window).on('load click',function(e){
	if($(e.target).hasClass('set_choices_quota')||$(e.target).hasClass('add_multiple_choices'))return;
	setTimeout(function(){
		_resetFrameHeight();
	},300)
})
//正在加载中
function _showLoading(type){
	if(1==1){
		window.top.$('.loadingMask').show();
	}else{
		window.top.$('#main').append($('<div class="loadingBg_text" style="background: url('+baseURL+'/manager/images/logoloading.gif) no-repeat scroll center center ;height: 100px;left: 600px;padding-bottom: 20px;position: absolute;text-align: center; top: 180px;width: 250px;z-index: 1101;"></div>'));
	}
};
function _hideLoading(){
	window.top.$('.loadingBg_text').fadeOut(100);
	window.top.$('.loadingBg_text').remove();
	setTimeout(function(){window.top.$('.loadingMask').hide()},500);
};
$(window).on('load',function(){
	_hideLoading();
})
$(function(){
	$('body').on('click','.aloading',function(){
		_showLoading(1);
	});
	$('.tabs-primary a').on('click',function(){
		if(window==window.top){
			_showLoading();
		}
	})
	/*开关*/
	$(".on-off").on("click", function(){
		var obj = $(this);
		var beforeClick = obj.attr("beforeClick");
		if(beforeClick){
			if(!eval(beforeClick+"("+obj.hasClass("off")+")")){
				return;
			}
		}
		if(obj.hasClass("off")){
			onOffSetOn(obj);
		}else{
			onOffSetOff(obj);
		}
	});
})
//开关开
function onOffSetOn(targetObj){
	targetObj.removeClass("off");
	targetObj.addClass("on");
	var value = targetObj.attr("onvalue");
	$(targetObj.parent().find("input:last")).val(value?value:1);
	var callback = targetObj.attr("callback");
	if(callback){
		eval(callback+"(true)");
	}
}
//开关关
function onOffSetOff(targetObj){
	targetObj.removeClass("on");
	targetObj.addClass("off");
	var value = targetObj.attr("offvalue");
	$(targetObj.parent().find("input:last")).val(value?value:0);
	var callback = targetObj.attr("callback");
	if(callback){
		eval(callback+"(false)");
	}
}

/**
 * 给单选按钮、开关等赋值
 * @param name
 * @param value
 * @private
 */
function _setElementValue(name,value){
	if(!value){
		return;
	}
	var c=$("[name='"+name+"']");
	$.each(c,function(){
		var targetObj = $(this);
		if(targetObj.attr("kind")){
			switch (targetObj.attr("kind")) {
				case "radio":
					if (targetObj.val() == value)
						targetObj.parent().trigger("click");//模拟执行id=a的事件
					break;
				case "on-off":;
					targetObj = targetObj.prev();
					if (targetObj.attr("onvalue") == value)//开
						onOffSetOn(targetObj);
					else if(targetObj.attr("offvalue") == value)//关
						onOffSetOff(targetObj);
					break;
				default:
					break;
			}
		}
	});
}
var secretImg="/themes/default/images/qw/secret.jpg";//默认保密图片
var noCoverImg="/manager/images/img271,123.png";//默认的没有封面的图片
var coverImg="";//原来的封面图片，//这里必定是上传的


//编辑器字数过多的提示修改
function editorWordLengthTips(){
	////(正文只能输入6个英文字符或一半长度的汉字)，可能是内容中样式字符太多，请点击编辑器顶部的【橡皮擦】按钮清除样式后重试。
	var $editorTips=$("#qf_content").next().next().children("font").eq(0);
	if($editorTips.length>0 && $editorTips.html()!="" && $editorTips.html().indexOf("个字")>=0){
		if($editorTips.html().indexOf("点击编辑器顶部的【橡皮擦】按钮清除样式后重试")<0){
			$editorTips.html($editorTips.html().substring(0,$editorTips.html().length-1)+"，可能是内容中样式字符太多，请全选，点击编辑器顶部的【橡皮擦】按钮清除样式后重试。)");
		}
	}
}

//基本js定义
//定义时间格式化(maquanyang 2015-10-20)
Date.prototype.Format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}
//分享
var share_isloadqrcodejs = false;
function share(shareUrl,title,type,callback,isTask){
	var typeString = {
		'form':"表单",
		'productinfo':"知识百科",
		'news':"新闻公告"
	};
    var isInnerForm=false;
    if(isTask&&isTask!=3){//判断是否分享内部单
        isInnerForm=true;
    }
	var shareTitle = '我在@企微云平台 上创建了' + typeString[type] +'，邀请大家来填写！';
	var shareToOutSide = isInnerForm?'':'<div class="" style="margin-left:200px">' +
							'<div class="">分享到其他:</div>' +
							'<div class="shareImgList"><a target="_blank" href="http://v.t.sina.com.cn/share/share.php?appkey=&url='+encodeURIComponent(shareUrl)+'&title='+shareTitle+'" class="xinlang"></a>' +
								'<a target="_blank" href="http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(shareUrl)+'&title='+shareTitle+'" class="qq"></a>' +
								'<a target="_blank" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(shareUrl)+'&title='+shareTitle+'" class="qzone"></a></div>' +
							'</div>'; //如果分享的是内部资料，不显示
	//如果是内部单分享，添加修改一些样式
	var wxQRCode = isInnerForm?'w120 ma':'';
	var textAlign = isInnerForm?'tcenter':'';
	var fl = isInnerForm?'':'fl';
	title = '将 '+ filterString(title) + ' 分享到' + (isInnerForm?'内部':'外部');
	//title = title+" @企微云平台 ";
	var tmp='<div class="pop_wrap1 shareForm" style="display: block; width: 580px">'
		+'<div class="SS_tit">' + title + '<i>×</i></div>'
		+'<div class="SS_main mt30">'
		+'<div class="SS_item">复制地址给好友:</div>'
		+'<div class="SS_item shareForm_item">'
		+'	<input type="text" id="url" value="'+shareUrl+'" readonly="readonly">'
		+'<a target="_blank" href="'+shareUrl+'">打开</a>'
		+'</div>'
		+'<div class="SS_item overflow" style="height:auto;margin-top:20px">'
		+'<div class="'+ fl + '">'
		+'<div class="' +textAlign + '">微信，企业微信扫码分享</div>'
		+'<div class="shareImgList ' + wxQRCode + '" id="qrcode">'
		+'<canvas width="120" height="120" style="display: none;"></canvas>'
		+'</div>'
		+'</div>'
		+shareToOutSide
		+'</div>'
		+'</div>'
		+'<div class="SS_btn tac">'
		+'	<input type="button" value="取消" id="SS_qx" class="btn twoBtn">'
		+'</div>'
		+'</div>';
	with(window.top){
		$('.overlay').show();
		$('body').append(tmp);
		$('.SS_tit i,#SS_qx').on('click',function(){
			$(this).parents('.shareForm').remove();
			window.top.$('.overlay').hide();
		});
		window.top.setQrcode = function(){
			var qrcode = new QRCode(document.getElementById("qrcode"), {
				width : 120,//设置宽高
				height : 120
			});
			qrcode.makeCode(shareUrl);
		}
		window.top.loadJS = function (url, success) {
			var domScript = document.createElement('script');
			domScript.src = url;
			success = success || function(){};
			domScript.onload = domScript.onreadystatechange = function() {
				if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
					success();
					this.onload = this.onreadystatechange = null;
					this.parentNode.removeChild(this);
				}
			}
			document.getElementsByTagName('head')[0].appendChild(domScript);
		}
		if(share_isloadqrcodejs){
			setQrcode();
		}else{
			loadJS(baseURL+'/themes/qw/js/qrcode.js',function(){
				share_isloadqrcodejs = true;
				setQrcode();
			});
		}
		if(callback){
			callback(shareUrl);
		}
	}
}

//仅仅微信打开的分享
var onlyWeixin_share_isloadqrcodejs = false;
function onlyWeixinShare(shareUrl, title, callback) {
	//title = title+" @企微云平台 ";
	var tmp = '<div class="pop_wrap1 shareForm" style="display: block; width: 580px">'
		+ '<div class="SS_tit">分享到外部<i>×</i></div>'
		+ '<div class="SS_main mt30">'
		+ '<div class="SS_item">复制地址给好友:</div>'
		+ '<div class="SS_item shareForm_item">'
		+ '	<input type="text" id="url" value="' + shareUrl + '" readonly="readonly">'
			//+'<a target="_blank" href="'+shareUrl+'">打开</a>'
		+ '</div>'
		+ '<div class="SS_item overflow" style="height:auto;margin-top:20px">'
		+ '<div class="">'
		+ '<div class="">微信扫码分享:</div>'
		+ '<div class="shareImgList" id="qrcode" style="padding-left: 185px">'
		+ '<canvas width="120" height="120" style="display: none;"></canvas>'
		+ '</div>'
		+ '</div>'
			/*+'<div class="" style="margin-left:200px">'
			 +'	<div class="">分享到其他:</div>'
			 +'	<div class="shareImgList"><a target="_blank" href="http://v.t.sina.com.cn/share/share.php?appkey=&url='+encodeURIComponent(shareUrl)+'&title='+title+'" class="xinlang"></a>'
			 +'<a target="_blank" href="http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(shareUrl)+'&title='+title+'" class="qq"></a>'
			 +'<a target="_blank" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(shareUrl)+'&title='+title+'" class="qzone"></a></div>'
			 +'</div>'*/
		+ '</div>'
		+ '</div>'
		+ '<div class="SS_btn tac">'
		+ '	<input type="button" value="取消" id="SS_qx" class="btn twoBtn">'
		+ '</div>'
		+ '</div>';
	with (window.top) {
		$('.overlay').show();
		$('body').append(tmp);
		$('.SS_tit i,#SS_qx').on('click', function () {
			$(this).parents('.shareForm').remove();
			window.top.$('.overlay').hide();
		});
		window.top.setQrcode = function () {
			var qrcode = new QRCode(document.getElementById("qrcode"), {
				width: 120,//设置宽高
				height: 120
			});
			qrcode.makeCode(shareUrl);
		}
		window.top.loadJS = function (url, success) {
			var domScript = document.createElement('script');
			domScript.src = url;
			success = success || function () {
				};
			domScript.onload = domScript.onreadystatechange = function () {
				if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
					success();
					this.onload = this.onreadystatechange = null;
					this.parentNode.removeChild(this);
				}
			}
			document.getElementsByTagName('head')[0].appendChild(domScript);
		}
		if (onlyWeixin_share_isloadqrcodejs) {
			setQrcode();
		} else {
			loadJS(baseURL + '/themes/qw/js/qrcode.js', function () {
				onlyWeixin_share_isloadqrcodejs = true;
				setQrcode();
			});
		}
		if (callback) {
			callback(shareUrl);
		}
	}
}

function htmlEncode(str) {
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
}

//URL识别
function checkURL(obj,repalceSpace){
	if(!obj || obj==null){
		return "";
	}
	var str = obj;
	if(repalceSpace){
		//替换转义
		str=htmlEncode(str);
		//替换空格
		str=str.replace(/\n\n/g,'<br>').replace(/\n/g,'<br>').replace(/\u3000/g,'&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\u0020/g,'&nbsp;&nbsp;');
	}
	str = str.replace(/([rl("]?[rl(']?[rl(]?[=]?['"]?)(http(s)?\:\/\/[a-zA-Z0-9]+.[a-zA-Z0-9]+[a-zA-Z0-9\$\%\#\&\/\?\-\=\.\_\;\:]+)/gi,function(match,first,second,pos,origin){
		if(first == '="' || first == "='"|| first == "rl('"|| first == "rl('"||first == "rl("){//判断url是否为元素中的属性值
			return match;
		}else {
			return first+"<a class='URLlink' href='"+second+"'><span>网页链接</span></a>";
		}
	});
	/*//电话号码替换
	 str = str.replace(/(\d{5,15})(\d+)/g,function(s) {
	 if (s.length > 15) {
	 return s;
	 } else {
	 return "<a href='tel:" + s + "'>" + s + "</a>";
	 }
	 });
	 //替换空格
	 if('ontouchstart' in window){
	 str=str.replace(/\u3000/g,'&nbsp;&nbsp;').replace(/\u0020/g,'&nbsp;').replace(/\n/g,'<br>');
	 }else{
	 str=str.replace(/\u3000/g,'&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\u0020/g,'&nbsp;&nbsp;').replace(/\n/g,'<br>');
	 }*/
	return str;
}
function tis(str){//提示框
	var $div=$('<div id="PromptBox" style="display:block">'+str+'</div>');
	window.top.$('body').append($div);
	setTimeout(function(){
		window.top.$('#PromptBox').fadeOut('2000');
		window.top.$('#PromptBox').remove();
	}, 2500)
}
//textarea剩余字数
/*判断输入字符的长度*/
/*判断输入字符的长度*/
$(document).ready(function(){
	$("body").on("focus","textarea.textareaNum,input.inputNum,textarea.cancela",function(){
		//$('textarea.textareaNum,input.inputNum,textarea.cancela').focus(function(){
		$(this).bind("click keyup",function(){
			var thisareawid=$(this).width();
			var thispro=$(this).attr('valid');
			if(thispro==undefined){}
			else{
				var objpro=(new Function("return " + thispro))();
				var max=objpro.length;
				if(max==undefined){}
				else{
					var num2=$(this).val().length;
					if(num2<max){
						if($(this).next().hasClass('aa')){
							$(this).next().html(num2.toString()+'/'+max);
							$(this).next().css('color','#999');
							if($(this).prop('tagName')=='TEXTAREA'){
								$(this).next().html("您已输入"+num2.toString()+'/'+max+"个字");
								$(this).next().css('color','#999');
							}

						}
						else{
							$(this).attr('maxlength',max);
							$(this).parent().css('position','relative');
							if($(this).prop('tagName')=='INPUT'){
								var thisinputwid=$(this)[0].offsetWidth;
								var thisinputhid=$(this)[0].offsetHeight;
								if(max<100){
									$(this).width(thisinputwid);
									$(this).css({paddingRight:"46px","box-sizing":"border-box",paddingLeft:"4px",height:thisinputhid+"px"});
									$(this).after('<span class="aa" style="font-size:12px;position:absolute;line-height:'+thisinputhid+'px"></span>');
									$(this).next().css('left',thisareawid-31)
								}
								else{
									$(this).width(thisinputwid);
									$(this).css({paddingRight:"65px","box-sizing":"border-box",paddingLeft:"10px",height:thisinputhid+"px"});
									$(this).after('<span class="aa" style="font-size:12px;position:absolute;line-height:'+thisinputhid+'px"></span>');
									$(this).next().css('left',thisareawid-45)
								}
							}
							if($(this).prop('tagName')=='TEXTAREA'){
								if($(this).next().hasClass('form-des')){
									$(this).next().html("您已输入"+num2.toString()+'/'+max+"个字");
									$(this).next().css('color','#999');
									$(this).next().css('font-size','12px');
								}
								else{
									$(this).after('<span class="aa" style="position:absolute;"></span>');
									$(this).next().css('left',"0px");
									$(this).next().css('bottom','-20px');
                                    $(this).next().css('font-size','12px');
                                    $(this).next().html("您已输入"+num2.toString()+'/'+max+"个字");
									$(this).next().css('color','#999');
									if($(this).hasClass('cancela')){
										$(this).next().css('left','0px');
										$(this).next().css('top','20px');
									}
									/*$(this).next().html(num2.toString()+'/'+max);
									 $(this).next().css('color','#333');*/
								}
								$(this).next().html("您已输入"+num2.toString()+'/'+max+"个字");
								$(this).next().css('color','#999');
							}
						}
					}
					else{

						$(this).next().html(num2.toString()+'/'+max);
						$(this).next().css('color','red');
						if($(this).prop('tagName')=='TEXTAREA'){
							$(this).next().html("您已输入"+num2.toString()+'/'+max+"个字");
							$(this).next().css('color','red');
						}

					}
				}
			}
		})
	})
})


//设置导出时间长度
var exportDaysDesc="";
function exportDaysLimit(sTime,eTime){
	var starTime = new Date(sTime.replace(/-/g,"/"));
	var endTime = new Date(eTime.replace(/-/g,"/"));
	var days=Math.floor((endTime.getTime()-starTime.getTime())/(24*60*60*1000));
	if(days>62){//用31日当做一个月,注意修改提示消息的文字
		exportDaysDesc="不要一次性导出跨度超过二个月的记录";
		return false;
	}
	return true;
}

function exportDaysLimitByMonthCounts(sTime,eTime,monthCounts){
	var starTime = new Date(sTime.replace(/-/g,"/"));
	var endTime = new Date(eTime.replace(/-/g,"/"));
	var days=Math.floor((endTime.getTime()-starTime.getTime())/(24*60*60*1000));
	if(days>(31*monthCounts)){//用31日当做一个月,注意修改提示消息的文字
		var cnCounts="";
		if(monthCounts==1){
			cnCounts="一";
		}else if(monthCounts==2){
			cnCounts="二";
		}else if(monthCounts==3){
			cnCounts="三";
		}else if(monthCounts==4){
			cnCounts="四";
		}else if(monthCounts==5){
			cnCounts="五";
		}else if(monthCounts==6){
			cnCounts="六";
		}else if(monthCounts==7){
			cnCounts="七";
		}else if(monthCounts==8){
			cnCounts="八";
		}else{
			cnCounts="二";//默认两个月
		}
		exportDaysDesc="不要一次性导出跨度超过"+cnCounts+"个月的记录";
		return false;
	}
	return true;
}

//获取地址栏参数
function getParam(paramName){
	paramValue = "";
	isFound = false;
	if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=")>1){
		arrSource = decodeURIComponent(window.location.search).substring(1,window.location.search.length).split("&");
		i = 0;
		while (i < arrSource.length && !isFound){
			if (arrSource[i].indexOf("=") > 0){
				if (arrSource[i].split("=")[0].toLowerCase()==paramName.toLowerCase()){
					paramValue = arrSource[i].split("=")[1];
					isFound = true;
				}
			}
			i++;
		}
	}
	return paramValue;
}

function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

//删除加入的数字显示标签,obj(input或textarea)
function removeSpanNum(obj){
	if(undefined != obj){
		if($(obj).next().hasClass('aa')){
			//$(obj).next().remove();
			//$(obj).css('paddingRight','0px');
			$(obj).next().html("");
		}
	}
}
$('body').on('mouseleave','#myContactTree ul li>a',function(){
	$(this).find('.contactAction').hide();
}).on('mouseenter','#myContactTree ul li>a',function(){
	$(this).find('.contactAction').show();
})

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
function numMulti(num1, num2) {
	var baseNum = 0;
	try {
		baseNum += num1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		baseNum += num2.toString().split(".")[1].length;
	} catch (e) {
	}
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
	} else {
		return this.replace(reallyDo, replaceWith);
	}
}

/***显示操作按钮***/
function showBut(obj){
	var top=$(obj).find('.czIcon').offset().top;
	var right =$(window).width()-$(obj).find('.czIcon').offset().left;
	if($(obj).children('.czItem').children().length){
        $(obj).children('.czItem').css({'top':top,'right':right,'display':'flex'});
	}else {
        $(obj).children('.czItem').hide();
	}

};
function hideBut(obj){
	$(obj).children('.czItem').hide();

}
$(function () {
	$('body').on('mouseenter', '.tableFixed .cz', function () {
		var right = $(this).width() + 10;
		var top = $(this).offset().top + 10;
		if ($('.lasttdpop').text() === '') {
			$('.lasttdpop').css('display', 'none');
			return;
		}
		$('.lasttdpop', $(this)).css({'display': 'block', 'right': right, 'top': top, 'position': 'fixed'});
	});
});

$('body').on('mouseleave', '.tableFixed .cz', function () {
	$(this).find(".lasttdpop").css('display', 'none');
});
function showPopFrame(url){
	if(window.top.$('#popframe').length==0){
		window.top.$('body').append('<iframe id="popframe" src='+url+' style="width:100%;height:100%;position: fixed;top: 0;left: 0;z-index:1000" frameborder="0" scrolling="no" allowtransparency="true"></iframe>')
	}else{
		window.top.$('#popframe').show();
		window.top.$('#popframe')[0].contentWindow.loadframe();
	}
};

loadJs(baseURL+"/themes/manager/js/vip_manager.js"); //加载VIP判断信息
/**
 * 加载省市区代码，并回调
 * @param callback
 */
function loadDistpicker_data(callback){
	if(!$().distpicker){
		if(window.distpicker_data_callback == undefined){
			window.distpicker_data_callback=[];
			if(callback)window.distpicker_data_callback.push(callback);
			loadJs(baseURL+"/open/distpicker_data.jsp");
		}
		else{if(callback)window.distpicker_data_callback.push(callback);}
    	
	}else{
		if(callback)callback();
	}
	
}
$(function(){
	if($(window.top.document).find("#imMsgBox .modal-del").length>0){
		$(window.top.document).find("#imMsgBox .modal-del")[0].onclick=null;
		$(window.top.document).find("#imMsgBox .modal-del")[0].onclick=function(){
			var obj = $(window.top.document);
			obj.find('#imMsgBox').hide();
			if(obj.find('#overlayDiv').css("z-index")=="1104"){
				obj.find('#overlayDiv').css("z-index",1100)
			}else{
				obj.find('#overlayDiv').hide();
			}
		}
	}
})
var imMsgCallback;
function _alert(title, msg, callback, btnName){
	var obj = $(window.top.document);
	imMsgCallback = callback;
	obj.find('#imMsgBoxTitle').html(title);
	obj.find('#imMsgBoxMsg').html(msg);
	if(btnName){
		obj.find('#imMsgBoxEnterBut').html(btnName);
	}
	else{
		obj.find('#imMsgBoxEnterBut').html("确定");
	}
	if(obj.find('#overlayDiv').is(":hidden")){
		obj.find('#overlayDiv').show();
	}else{
		obj.find('#overlayDiv').css({"z-index":1104});
	}
	obj.find("#imMsgBox").show();
	obj.find("#imMsgBox").css('top',top+'px');
	obj.find('#imMsgBoxEnterBut')[0].onclick=null;
	obj.find('#imMsgBoxEnterBut')[0].onclick=function(){
		obj.find('#imMsgBox').hide();
		if(obj.find('#overlayDiv').css("z-index")=="1104"){
			obj.find('#overlayDiv').css("z-index",1100)
		}else{
			obj.find('#overlayDiv').hide();
		}
		obj.find('.loadingMask').hide();
		if (imMsgCallback)imMsgCallback.call(imMsgCallback, null, null);
	};
};
function _confirm(title, msg, button, callback,flag){
	imMsgCallback = callback;
	var obj = $(window.top.document).find('#confirmDivBox');
	obj.find('#confirmDivBoxTitle').html(title);
	obj.find('#confirmDivBoxMsg').html(msg);
	obj.find('#confirmDivBoxOk').html("确定");
	obj.find('#confirmDivBoxFail').html("取消");
	if(button && button != null && button != ""){
		var split = button.split("|");
		obj.find('#confirmDivBoxOk').html(split[0]);
		obj.find('#confirmDivBoxFail').html(split[1]);
	}
	$(window.top.document).find('#overlayDiv').show();
	obj.show();
	obj.css('top', top + 'px');
	obj.find('#confirmDivBoxOk').unbind("click");
	obj.find('#confirmDivBoxOk').bind("click",
		function() {
			obj.find('#confirmDivBoxFail').unbind("click").removeClass('writeBtn').addClass('orangeBtn');
			obj.find('#confirmDivBoxOk').unbind("click").removeClass('orangeBtn').addClass('writeBtn');;
			obj.find('#confirmDivBoxClose').unbind("click");
			obj.hide();
			$(window.top.document).find('#overlayDiv').hide();
			imMsgCallback.ok &&	imMsgCallback.ok.call(imMsgCallback.ok, null, null);
		}
	);
	obj.find('#confirmDivBoxFail').unbind("click");
	obj.find('#confirmDivBoxFail').bind("click",
		function() {
			obj.find('#confirmDivBoxFail').unbind("click").removeClass('writeBtn').addClass('orangeBtn');
			obj.find('#confirmDivBoxOk').unbind("click").removeClass('orangeBtn').addClass('writeBtn');;
			obj.find('#confirmDivBoxClose').unbind("click");
			obj.hide();
			$(window.top.document).find('#overlayDiv').hide();
			imMsgCallback.fail && imMsgCallback.fail.call(imMsgCallback.fail, null, null);
		}
	);
	obj.find('#confirmDivBoxClose').unbind("click");
	obj.find('#confirmDivBoxClose').bind("click",
		function() {
			obj.find('#confirmDivBoxFail').unbind("click").removeClass('writeBtn').addClass('orangeBtn');;
			obj.find('#confirmDivBoxOk').unbind("click").removeClass('orangeBtn').addClass('writeBtn');;
			obj.find('#confirmDivBoxClose').unbind("click");
			obj.hide();
			$(window.top.document).find('#overlayDiv').hide();
			imMsgCallback.fail && imMsgCallback.fail.call(imMsgCallback.fail, null, null);
		}
	);
	if(flag){
		obj.find('#confirmDivBoxOk').removeClass('writeBtn').addClass('orangeBtn');
		obj.find('#confirmDivBoxFail').removeClass('orangeBtn').addClass('writeBtn');
	}
}
// 根据数组里的具体内容，返回下标
function getByValue(arr, val) {
	var a;
	for(var i=0; i<arr.length; i++) {
		if(arr[i] == val) {
			a = i;
			break;
		}
	}
	return a;
}

//对有区号的电话号码处理方法
var distnums= ['010','021','022','023','0852' ,'0853','0310','0311','0312','0313','0314','0315','0316','0317','0318','0319','0335','0570','0571','0572','0573','0574','0575','0576','0577','0578','0579','0580','024','0410','0411','0412','0413','0414','0415','0416','0417','0418','0419','0421','0427','0429' ,'027','0710','0711','0712','0713','0714','0715','0716','0717','0718','0719','0722','0724','0728','025','0510','0511','0512','0513','0514','0515','0516','0517','0517','0518','0519','0523','0470','0471','0472','0473','0474','0475','0476','0477','0478','0479','0482','0483','0790','0791','0792','0793','0794','0795','0796','0797','0798','0799','0701','0350','0351','0352','0353','0354','0355','0356','0357','0358','0359','0930','0931','0932','0933','0934','0935','0936','0937','0938','0941','0943','0530','0531','0532','0533','0534','0535','0536','0537','0538','0539','0450','0451','0452','0453','0454','0455','0456','0457','0458','0459','0591','0592','0593','0594','0595','0595','0596','0597','0598','0599','020','0751','0752','0753','0754','0755','0756','0757','0758','0759','0760','0762','0763','0765','0766','0768','0769','0660','0661','0662','0663','028','0810','0811','0812','0813','0814','0816','0817','0818','0819','0825','0826','0827','0830','0831','0832','0833','0834','0835','0836','0837','0838','0839','0840','0730','0731','0732','0733','0734','0735','0736','0737','0738','0739','0743','0744','0745','0746','0370','0371','0372','0373','0374','0375','0376','0377','0378','0379','0391','0392','0393','0394','0395','0396','0398','0870','0871','0872','0873','0874','0875','0876','0877','0878','0879','0691','0692','0881','0883','0886','0887','0888','0550','0551','0552','0553','0554','0555','0556','0557','0558','0559','0561','0562','0563','0564','0565','0566','0951','0952','0953','0954','0431','0432','0433','0434','0435','0436','0437','0438','0439','0440' ,'0770','0771','0772','0773','0774','0775','0776','0777','0778','0779' ,'0851','0852','0853','0854','0855','0856','0857','0858','0859' ,'029','0910','0911','0912','0913','0914','0915','0916','0917','0919' ,'0971','0972','0973','0974','0975','0976','0977' ,'0890','0898','0899','0891','0892','0893'];
function telchangeAddDash(obj){
	if(obj!=null && obj!=""){
		for(var i=0;i<distnums.length;i++)
		{
			if(obj.value.indexOf("-")<0 && obj.value.indexOf(distnums[i])==0 && obj.value!=distnums[i]){
				var reg=new RegExp("^"+distnums[i]);
				$(obj).val(obj.value.replace(reg,distnums[i]+"-"));
			}
		}
	}
}

function changeDash(obj){
	if(obj!=null && obj!=""){
		for(var i=0;i<distnums.length;i++)
		{
			if(obj.indexOf("-")<0 && obj.indexOf(distnums[i])==0 && obj!=distnums[i]){
				var reg=new RegExp("^"+distnums[i]);
				obj=obj.replace(reg,distnums[i]+"-");
			}
		}
	}
	return obj;
}

//微信端后台页面获取地址头:后台用，非外部
function getImgURLHead(URL){
	if(URL.indexOf("manager/images/")>=0 || URL.indexOf("themes/default/images/")>=0 || URL.indexOf("/upload/img/birthday/")>=0 || URL.indexOf("/upload/img/zhounian/")>=0){
		return baseURL;
	}else{
		return compressURL;
	}
}


function _doDownLoad(id, url, fileName){
	var index = url.lastIndexOf(".");
	var fileType = url.substring(index);
	window.location.href=fileDownURL+downFileURL+encodeURIComponent(url)+"&fileFileName="+encodeURIComponent(fileName+fileType);
}
//通讯录高级搜索条件默认值
var superBigOrg = false;

var wxqyh_iswechatapp = null;//是否微信手机客户端打开
/**
 * 判断是否微信打开
 * @returns {Boolean}
 */
function isWeChatApp(){
	if(wxqyh_iswechatapp == null){
		var ua = navigator.userAgent.toLowerCase();
		if((ua.match(/MicroMessenger/i)=="micromessenger" && ua.indexOf("wxwork")==-1 && ua.indexOf("windowswechat")==-1)
			|| (ua.indexOf("wxwork")>0 && ua.indexOf("micromessenger")==-1)) {
			wxqyh_iswechatapp = true;
		}
		else{
			wxqyh_iswechatapp = false;
		}
	}
	return wxqyh_iswechatapp;
}


var wxqyh_corpId="";//corpId

/*本系列框架中,一些用得上的小功能函数,一些UI必须使用到它们,用户也可以单独拿出来用*/
function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}


/**
 * 保持session心跳
 * @param linkTime 单位：毫秒，重新请求间隔，默认300000（5分钟）
 * @param maxSessionCounts 最大请求次数，默认30次
 */
function continueSession(linkTime, maxSessionCounts){
	if(!linkTime){
		linkTime = 300000; //默认5分钟请求一次
	}
	if(!maxSessionCounts){
		maxSessionCounts = 30 ;
	}
	var continueSessionCounts = 0,myContinueSession;
	myContinueSession = setInterval(function(){
		//console.log(continueSessionCounts);
		if(continueSessionCounts>maxSessionCounts){
			clearInterval(myContinueSession);
			//console.log(continueSessionCounts);
		}else{
			$.ajax({
				url : baseURL+"/cooperation/cooperationAction!continueSession.action",
				type : "POST",
				dataType : "json",
				success : function(result) {
					continueSessionCounts = continueSessionCounts + 1;
				},
				error : function() {
					continueSessionCounts = continueSessionCounts + 1;
				}
			});
		}
	},linkTime); //每5分钟执行一次
}

/*二维码弹窗*/
function showQRcode(codeHtml,website,close){
	$('body',window.top.document).append(codeHtml);
	$('#overlayDiv',window.top.document).show();
	$('#code-main-img',window.top.document).qrcode({width: 180, height: 180, text: website});

	$('.guide-close',window.top.document).click(function () {
		$('.overlay',window.top.document).hide();
		$('.code-pop',window.top.document).remove();
		if(close=='reload'){
			parent.location.reload();
		}
	});
}

//预览图片方法
function doImgPreview(imgURL){
	var h=$(window.top).height()-80;
	var w=$(window.top).width()-180;
	$('#overlayDiv',window.top.document).show();
	$('body',window.top.document).append('<img class="browseImg" src="'+imgURL+'" style="z-index:2000;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);max-width:'+w+'px;max-height:'+h+'px;">');
	$('body',window.top.document).one('click',function(){
		$('.browseImg',window.top.document).remove();
		$('#overlayDiv',window.top.document).hide();
	});
}


//提交之前根据按顺序设置name的值如，list[i].userName
function formatName(s,fun){
	$.each(s,function(i,vo){
		$(this).attr("name",fun(i));
	})
}

/**
 * 动态加载js,js文件跨站时，无法同步加载，请使用callback参数
 * @param a
 * @param callback
 */

function loadJs(a,callback) {
	// /**var script = $('<script  type="text/javascript"></script>').attr("src",a);;
	//  $(document.head).append(script);**/


	// if(a.indexOf("?") > 0){
	// 	a = a +"&jsVer="+jsVer;
	// }else{
	// 	a = a +"?jsVer="+jsVer;
	// }

	// $.ajax({
	// 	url: a,
	// 	type: "GET",
	// 	dataType: "script",
	// 	async: false,
	// 	global: false,
	// 	cache:true,
	// 	"throws": true,
    //     success:function(){
    //     	if(callback)callback();
    //     }
	// });

}
/**
 * 获取url中的参数
 * @sqh
 */
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
/**
 * 获取本机的项目访问路径，包括域名+项目名
 * 如 https://qy.do1.com.cn/wxqyh
 * @sqh
 */
function getLocalURL(){
	var curWwwPath = window.document.location.href;
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	return curWwwPath.substring(0, pos) + baseURL;
}

// 获取所有权限
function _hasPermission($validPerms, $allPerms) {
	if($validPerms.indexOf("|")> -1) {
		var tempPerms = $validPerms.split("|");
		var result = false;
		for (var i = 0; i < tempPerms.length;i++) {
			result = result || $allPerms[tempPerms[i]];
		}
		return result;
	}
	if($validPerms.indexOf("&") > -1) {
		var tempPerms = $validPerms.split("&");
		var result = false;
		for (var i = 0; i < tempPerms.length;i++) {
			result = result && $allPerms[tempPerms[i]];
		}
		return result;
	}
	return $allPerms[$validPerms];
}

$(document).ready(function(){
	wxqyhConfig.ready(function(){
		if(wxqyhConfig.is_qiweiyun && showQw()){
			$(".oemClass").show();
		}else{
			$(".oemClass").hide();
		}
	});
});
//是否显示历史库元素
function isShowQwHisotry(){
	if(agentCode=="groupsend") {
		agentCode = "dynamic";
	}
	var qwHistoryAgentCode=wxqyhConfig.qwHistory.historyAgentCode;
	if(qwHistoryAgentCode!=undefined && qwHistoryAgentCode!="" && qwHistoryAgentCode!="undefined" && qwHistoryAgentCode.indexOf(agentCode)<0){
		return false;
	}
	var qwHistoryData=wxqyhConfig.qwHistory.historyData;
	var historyExit=wxqyhConfig.qwHistory.historyExit;
	if(qwHistoryData && qwHistoryData!="true" && historyExit.indexOf(wxqyhConfig.orgConfigInfo.createTime.substring(0,4))>-1){
		return true;
	}else{
		return false;
	}
}

//根据应用获取编辑器的最大字符数
function getUeditorMaxWords(agentCode){
	if("dynamic"==agentCode || "productinfo"==agentCode){
		if(window.top.isVipGold()){
			return goldVipContentLen;
		}
		if(window.top.isVipSilver()){
			return silverVipContentLen;
		}
	}
	return noVipContentLen;
}

// 判断应用有没有托管：
// 判断多个应用，则以逗号分隔。在 head.jsp 有个全局变量 TrustAppData = isTrustApp("form,sale");
function isTrustApp(agentCode) {
    var data = {};
    var isTrue = (agentCode.indexOf(',') === -1);   // 单个应用为true,多个应用为false
    var url = isTrue ? baseURL + "/application/application!ajaxIsTrustAgent.action" : baseURL + "/application/application!ajaxIsTrustAgentList.action";
    var postData = isTrue ? {agentCode: agentCode} : {agentCodes: agentCode};
    $.ajax({
        async: false,
        url: url,
        data: postData,
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.code === "0") {
                // 单个应用判断，返回如："data":{"isTrust":true, "agentName":"新闻公告"}}
                isTrue ? (data = result.data) : computeResult(result);
            }
        }
    });
    function computeResult(result) {
        $.each(result.data.list, function (i, val) {
            data[val.agentCode] = val;
        });
    }

    return data;
}

/**
 * HTML格式化输出
 */
function forHTML(s){
	if(typeof s == "string"){
		return s.replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll('\'','&#39;').replaceAll(' ','&#32;').replaceAll('\t','&#9;').replaceAll('\n','&#13;');
	}
	if(typeof s == "object"){
		for(var k in s){
			s[k]=forHTML(s[k]);
		}
		return s;
	}
	return s;
}
/**
 * 控件切换
 */
function warpComponent(show,hide){
	$(hide).find("select,input,button,textarea").attr("disabled",true);
	$(hide).hide();
	
	$(show).find("select,input,button,textarea").attr("disabled",false);
	$(show).show();
}
/**
 * 过滤字符串的非法字符
 * @type {string}
 */
function filterString(s){
	s = s.replaceAll('<','').replaceAll('>','');
	return s;
}
var userAgent = navigator.userAgent.toLowerCase();
//Figure out what browser is being used
jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

//设置机构配置
function setOrgConfig(configKey,configValue,callback){
	$.ajax({
		url : baseURL +"/operationlog/operationlogAction!setOrgConfigsetOrgConfig.action",
		data:{
			"configKey":configKey,
			"configValue":configValue
		},
		type : "post",
		dataType : "json",
		success : function(result) {
			if (result.code == "0") {
				if(callback)callback();
			}
		},
		error : function() {
			_alert("错误提示", "系统繁忙！");
		}
	});
}

/**
 * 参考java String.format 
 * 用法1："Hello {0}!".format("World");
 * 用法2："Hello {name}!".format({name:"World"});
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
　　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

// 百度编辑器上传跨域图片 @author:zengjiaying @time2017-11-06
function uploadCrossImg(agentCode,el,vipGoldArg) {
    var agentCodeUpper = 'INTERFACE_CODE_'+agentCode.toUpperCase();
	var regS = new RegExp(localport,"g");
	var content = ue.getContent();
    if (( vipGoldArg && isVipGold(interfaceCode[vipGoldArg]) ) ||
		(interfaceCode[agentCodeUpper] && isVipGold(interfaceCode[agentCodeUpper]))){
        changeCrossImg();
    }

    //处理图片
	function changeCrossImg() {
        var $img = $(content).find('img');
		var otherSide = /statics.xiumi.us(.)+|img.xiumi.us(.)+/;	// 秀米图片
        $.each($img, function (index, val) {
            var url = $(val).attr('src');
            if(otherSide.test(url)){
            	$.ajax({
                url: baseURL + "/fileupload/fileUploadMgrAction!uploadImgByURL.action",
                data: {
                    "oriURLArray": url,
                    "agentCoe": agentCode
                },
                type: "POST",
                async: false,
                dataType: "json",
                success: function (result) {
                    if (result.code !== "0") {
                        _alert("错误提示", result.desc);
                    } else if (result.data.imgUploadResutVOList[0].success) {
                        content = content.replace(url, "@fileweb@"+result.data.imgUploadResutVOList[0].newURL);
                    }
                }
            });
            }
        });

    }

    $(el).val(content);
    //替换上传文件的地址
    if($(el).val()!=""){
        $(el).val($(el).val().replace(regS,"@fileweb@"));
    }
}



/**
 * Created by YangJiaMing on 2017/2/6.
 * 金额输入input限制的javascript代码
 */

/**
 * 输入金额的时候触发的事件
 * @param input 显示的输入框
 * @param realInput 保存真实值的隐藏域
 */
function onInputMoney(input, realInput) {
    var pos = $(input)[0].selectionEnd;//获取光标位置
    var val = $(input).val();

    var money = moneyFilter(val);//1.过滤非法输入
    $(realInput).val(money);//2.将值传递给保存真实值的隐藏域

    //3.格式化显示
    var newVal = toThousands(money);
    $(input).val(newVal);

    //4.修正光标位置
    var newPos = calculateNewPos(val, newVal, pos);
    setTimeout(function () {
        $(input)[0].setSelectionRange(newPos, newPos);//设置光标位置
    }, 0);//放到setTimeout里是为了兼容Chrome的bug
}


/**
 * 将金额格式化为每3位整数一组的形式
 * 如: 12,123,456,789.99
 * @param num 金额
 * @returns {string} 格式化后的金额
 */
function toThousands(num) {
    var str = num.toString();
    var list = str.split(".");
    var intPart = list[0];
    var decPart = list[1];

    if (intPart.length > 1) {
        //整数去前导0
        intPart = intPart.replace(/(^0+)/, '')
    }

    if (intPart > 3) {
        //整数部分加','
        intPart = intPart.replace(/\B(?=(\d{3})+$)/g, ',');
    }

    var result = intPart;
    if (list.length > 1) {
        if (intPart.length == 0) {
            //小数点前没有0,我们自动加上0
            result = '0';
        }
        //加上小数点
        result += '.';

        if (decPart != undefined && decPart.length > 0) {
            //加上小数
            result += decPart;
        }
    }
    return result;
}


/**
 * 计算新的光标位置
 * @param val 输入框的val
 * @param newVal 处理过的val
 * @param pos 光标位置
 * @returns {number} 新的光标位置
 */
function calculateNewPos(val, newVal, pos) {
    var temp = val.substring(0, pos);
    temp = moneyFilter(temp);
    var j = 0;
    for (var i = 0; i < temp.length; i++) {
        while (temp[i] != newVal[j] && j < newVal.length) {
            j++;
        }
        j++;
    }
    return j;
}

/**
 * 过滤掉除数字和小数点以外的字符
 * @param str 一条字符串
 * @returns {string} 过滤后的字符串
 */
function moneyFilter(str) {
    //过滤掉非法字符(也会过滤掉',')
    var items = str.match(/\d+|\.|。/g);
    var num;
    if (items == null) {
        return '';
    } else {
        num = items.join('');
    }

    var result = "", dec = "";
    num = num.replace(/。/g, '.');//兼容中文输入法
    var list = num.split(".");

    if (list[0].length > 10) {
        //double的有效位数是15,小数位分了两位,故整数位限制为13位
        result = list[0].substring(0, 10);
    } else {
        result = list[0];
    }

    if (list.length > 1) {
        //小数限制为两位
        if (list[1].length > 2) {
            dec = list[1].substring(0, 2);
        } else {
            dec = list[1];
        }

        //加上小数点
        result = result + '.';

        if (dec.length > 0) {
            //加上小数
            result = result + dec;
        }
    }

    return result;
}

/**
 * 将金额转成万为单位，保留两位小数
 * @param num 金额
 * @returns {string} 转换后的金额
 */
function toTenThousands(num) {
    var str = num.toString();
    var list = str.split(".");
    var intPart = list[0];

    if (intPart.length > 1) {
        //整数去前导0
        intPart = intPart.replace(/(^0+)/, '')
    }

    if (intPart.length < 3) {
        //小于100块钱，直接忽略
        return 0;
    }
    intPart = intPart.substring(0, intPart.length - 2);
    if (intPart.length < 3) {
        intPart = "0." + intPart;
    } else {
        intPart = intPart.substring(0, intPart.length - 2) + '.' + intPart.substring(intPart.length - 2, intPart.length)
    }

    return toThousands(intPart);
}

var showHistoryDeptCondition;

//要换为新的提示方式，4个参数都必须传入
function _doDel(a, b, t,f) {var msg = t || "删除数据后将无法恢复，确认要删除吗？";var d = _doGetChooseRow(a);if (0 == d.length) return _alert("提示", "请选择要删除的数据"), !1;_confirm("提示",msg, null, {ok: function() {(1 == arguments.length ? (_doCommonPost($("#" + a).attr("delUrl"), "ids=" + d), doSearch(1)) : _doCommonPost($("#" + a).attr("delUrl"), "ids=" + d, b,f))}});}

function _doCommonPost(a, b, d,f) {
    if (!b || null == b)
        b = {};
    b.dqdp_csrf_token = dqdp_csrf_token;
    $.ajax({
        type: "POST",
        url: a,
        data: b,
        async: !1,
        success: function(a) {
            if(f == "new"){
            	var flag=a.code=='0'?true:false;
                _top_alert(a.desc,flag,2000);
            }
            else{
                _alert("提交结果", a.desc);
            }
            2 < arguments.length && ("0" == a.code && d && d.ok && d.ok.call(d.ok, null, null),
            "0" != a.code && d && d.fail && d.fail.call(d.fail, null, null))
        },
        error: function() {
            _alert("错误提示", "通讯故障");
            d.fail.call(d.fail, null, null)
        },
        dataType: "json"
    })
}

function checkValOfValid(obj,max) {
    var inputVal = $(obj).val();
    if(inputVal!=""&&inputVal.substr(0,1)==0){
        $(obj).val("0");
    }else{
        $(obj).val(inputVal.replace(/\D/g,''));
    }
    if(inputVal>max){
        $(obj).val(max);
    }
}

// 处理级别嵌套数据 @zengjiaying
var QW_changeListData = function (data) {
    this.changeListData = {};    // 重新排列列表数据
    this.firstList = [];	// 存放一级的id
    this.renderData(data.children);
};
QW_changeListData.prototype.renderData = function renderData(data) {
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var parentData = this.changeListData[data[i]['parentId']];
            var parentLevel = parentData ? (parentData['level'] + 1) : 1;
            this.changeListData[data[i]['id']] = data[i];
            this.changeListData[data[i]['id']]['level'] = parentLevel;
            if(parentLevel==1){this.firstList.push(data[i]['id'])}
            this.renderData(data[i].children);
        }
    }
};

// 动态加载js @zengjiaying
function QW_loadJScript(url,el) {
    if($('body').children('script'+el).length==0){
        var script = document.createElement("script");
        script.id=el;
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    }
}

//直接输出url返回的json对象
function getUrlJson(url,param){
var re = null;
	$.ajax({
		url:url,
        type:'POST',
        data:param,
        cache:false,
        async:false,
        dataType:'json',
        success: function(result){
        	re = result.data;
        },
            error:function () {
                re = null;
            }});
     return re;
}

function initSelect(map,select){
	var ops = select.options;
	for(var key in map){
		ops[ops.length] = new Option(map[key],key);
	}
}

//直接输出url返回的json对象
function getUrlJson(url,param){
var re = null;
	$.ajax({
		url:url,
        type:'POST',
        data:param,
        cache:false,
        async:false,
        dataType:'json',
        success: function(result){
        	re = result.data;
        },
            error:function () {
                re = null;
            }});
     return re;
}

function initSelect(map,select){
	var ops = select.options;
	for(var key in map){
		ops[ops.length] = new Option(map[key],key);
	}
}

//后台左侧应用入口文字，超出6个中文且前三个文字为“企微云”时，自动截取掉（不显示）。
function beyondSubstr(agentName){
    if(agentName.length > 6 && agentName.substr(0,3) == '企微云'){
        agentName = agentName.substr(3);
    }
    return agentName;
}

/*
手机号获取验证码 by:zengjiaying 2018-03-28
@phoneEL 手机号输入框
@codeEl	 验证码输入框
*/
function QW_sendSmsCode (phoneEl,codeEl) {
    var num = 60
    // 校验手机号码是否填写、是否正确
    phoneEl.on({
        blur: function () {
            if (!(/^1\d{10}$/).test(phoneEl.val())) {
                _top_alert('请输入正确的手机号码',false);
                codeEl.addClass('disabled')
                return false;
            }
            codeEl.removeClass('disabled')
        },
        change: function() {
            if ((/^1\d{10}$/).test(phoneEl.val())) {
                codeEl.removeClass('disabled')
            }
        }
    })
    codeEl.on('click',function () {
        if($(this).hasClass('disabled')) {return}
        if (!phoneEl.val()) {
            _top_alert('请先输入手机号码',false);
            codeEl.addClass('disabled')
            return false;
        }
        if (!(/^1\d{10}$/).test(phoneEl.val())) {
            _top_alert('请输入正确的手机号码',false);
            codeEl.addClass('disabled')
            return false;
        }
        // 按钮文字“60s后重新获取”，不可点击
        codeEl.text('60s后重新获取')
        codeEl.addClass('disabled')
        getSmsCode(phoneEl.val())

        // 计时器
        var countdown = setInterval(function(){
            num = num - 1
            codeEl.text(num+'s后重新获取')
            if(num == 0){
                codeEl.text('点击重新获取')
                codeEl.removeClass('disabled')
                clearInterval(countdown)
                num = 60
            }
        },1000)
    })

    // 验证码获取，成功和失败处理
    function getSmsCode(phone,successCb,failCb) {
        $.ajax({
            url:baseURL+"/sms/sendsmsAction!sendSmsCode.action",
            type:"POST",
            data:{"smsVerCode.mobile":phoneEl.val()},
            dataType:"json",
            success:function(result){
                if(result.code !== "0") {
                    _top_alert(result.desc,false);
                    failCb ? failCb() : ''
                    return
                }
                successCb ? successCb() : ''
            },
            error:function(){
                _alert("", "系统繁忙！");
            }
        });
    }
}

/*获取手机号码*/
function QW_getUserMobile(userId,cb) {
    $.get(baseURL+ '/managesetting/managesettingMgrCtl/getUserInfo.do',{userId:userId},function(result){
        if(result.data){
            cb(result.data.mobile)
        }
    },'json')
}



//模糊搜索组件

//为去抖与节流声明的变量
var input_timer;

/**
 * 点击输入框显示下拉菜单,并清空关键字
 * 如果下拉菜单不存在，生成它，若存在，则显示
 * 为下拉菜单输入框添加input事件（去抖）
 * 可配置项：
 * @param searchDataObj.left               弹出层的left值 （选填/默认自动计算）
 * @param searchDataObj.top                弹出层的top值  （选填/默认自动计算）
 * @param searchDataObj.targetId           向后台提交表单时该字段对应的输入框ID (选填/默认'targetId')
 * @param searchDataObj.url                接口url        （必填）
 * @param searchDataObj.param              接口参数       （必填）
 * @param searchDataObj.outParam           接口返回参数的格式，主要是id和人名 ( 选填，默认为id：id, userName:userName)
 * @param searchDataObj.choseType          选择类型：0 为单选，1 为多选       ( 选填，默认为0)
 */
function initSlideSearch(searchDataObj) {
    $('.search-slidedown').on('click',function(){
        $('.qx_btn').filter('[onclick*=hideContainer]').click();
        var id = this.id;
        var inputId = id + '_input';
        var wrap_height = searchDataObj.top || $(this).parents('.searchSlidedownWrap').height() + 10;          //弹出层距离外层距离
        var wrap_width = searchDataObj.left || $(this).parent('.searchSelectDown').position().left;             //弹出层距离左边距离（改）
        var slideDownContainer = $(this).parents('.searchSlidedownWrap').find('.slideDownContainer');
        var mutilChoseHtml = searchDataObj.choseType == 1 ? '' : 'class="radio_type" disabled="disabled"';
        if (slideDownContainer.length == 0) {
            var header = '<div class="slideDownHeader"><input class="borderNone lh28" id = "' + inputId + '" type="text" placeholder="在此输入关键字" maxlength="100"><input class="submitSearchBtn borderNone lh28" type="button"></div>';
            var body = '<div class="slideDownBody"></div>';
            var footer = '<div class="slideDownFooter"><label class="multiChose_wrap"><input type="checkbox" ' + mutilChoseHtml + ' onclick="checkAllInBox(this)">全选</label><span class="qx_btn ml15"onclick="hideContainer(this);">取消</span><span class="enter_btn" onclick="getChooseRow(this)">确定</span></div> ';
            $(this).parents('.searchSlidedownWrap').append('<div class="slideDownContainer" style="top: ' + wrap_height + 'px; left: ' + wrap_width + 'px;">' + header + body + footer +'</div>');
            slideDownContainer = $(this).parents('.searchSlidedownWrap').find('.slideDownContainer');

            //配置参数
            //触发input事件的输入框对象（不需要填，默认）
            searchDataObj.self = $('#' + inputId)[0];

            //监听输入框输入
            $('#' + inputId).on('input', function () {
                if ($.trim(this.value) == "") {
                    return;
                }
                //搜索字段赋值
                searchDataObj.param[''+searchDataObj.searchValue] = $(this).val();
                clearTimeout(input_timer);
                input_timer = setTimeout(function(){SearchSlideDown(searchDataObj);},1000);
            });
        }
        $('#'+inputId).val('');
        slideDownContainer.show();
    });
}

/**
 * 对应字段的输入框内输入关键字后，执行异步模糊查询，并且展示结果供选择
 * @author lzw （from zjy）
 */
function SearchSlideDown(dataObj){
	//参数
    var _this = dataObj.self,
		targetId = dataObj.targetId || 'targetId',
		usedInterface = dataObj.url,
		param = dataObj.param,
		outParam = dataObj.outParam || {
            'id': 'id',
            'userName': 'userName',
        },
		choseType = dataObj.choseType || 0;
    var user_lock=true;
    if (!user_lock) {
        return;
    }
    var appendHtml = $(_this).parents('.slideDownContainer').find('.slideDownBody');
    var footer = $(_this).parents('.slideDownContainer').find('.slideDownFooter');
    appendHtml.empty();
    appendHtml.append('<div class="fbbb">搜索中</div>');
    footer.css('border-top','1px solid #ccc');
    user_lock = false;
    $.ajax({
        url: baseURL + usedInterface,
        type: "post",
        data: param,
        dataType: "json",
        success: function (result) {
            user_lock = true;
            var dataList;
            if (result.code == 0) {
                appendHtml.empty();
				dataList = result.data.pageData;
				//返回的数据格式
				var dataFormat = outParam || {'id':'id', 'userName':'userName'};
                if (dataList && dataList.length > 0) {
                    $.each(dataList, function () {//添加下拉菜单
                        appendHtml.append('<div class="fontNoWrap" textId = "' + targetId + '"><input type="checkbox" name="ids" value="' + this[dataFormat.id] +'"><span>' + this[dataFormat.userName] + '</span></div>');
                    });
                    appendHtml.off('click', 'div').on('click', 'div', function (e) {
                        var ids = $(this).find("input[name='ids']");
                        if(choseType == 1) {     //多选的情况
                            if(ids[0] !== e.target) {
                                ids.prop('checked', !ids.prop('checked'));
                            }
                        } else if(choseType == 0) {       //单选
                            $(this).siblings('div').find('input[name="ids"]').prop('checked', false);
                            if(ids[0] !== e.target){
                                ids.prop('checked', !ids.prop('checked'));
                            }
                        }
                    });
                    $(_this).parents('.searchSlidedownWrap').off('click', '.close').on('click', '.close', function () {
                        $(this).parents('.append_item').remove();
                        $(_this).parents('.searchSlidedownWrap').find('.search-slidedown').show();
                        $('#'+targetId).val('');
                    });
                }else{
                    appendHtml.append('<div class="h55 tac fbbb lh55">没有找到相关内容</div>');
                }
            }
        },
        error: function () {
            user_lock = true;
        }
    });
}

/**
 * [点击下拉菜单的确定键，把所有被选中的id都写入对应的隐藏input中，并显示选择结果]
 * @param _this 该确定键对象
 */
function getChooseRow(_this) {
    var slideDownSpan = $(_this).parents('.searchSlidedownWrap').find('.search-slidedown');
    var slideDownContainer = $(_this).parents('.slideDownContainer');
    var chooseRows = slideDownContainer.find('input[name="ids"]:checked');
    var count = 0;
    var name = '';
    var userId = '';
    var textId = '';
    if(chooseRows.length == 0){
        return;
    }
    chooseRows.each(function(){
        count ++;
        userId += $(this).val() + ',';
        if(count == 1){
            name = $(this).closest('div')[0].innerText;
            textId = $(this).closest('div').attr('textId');
        }
    });
    userId = userId.substring(0,userId.length-1);
    if(count > 1){
        name += ' 等'+count+'项';
    }
    slideDownSpan.before('<div class="append_item"><span class="close"></span>' + name + '</div>');
    slideDownSpan.hide();
    $('#'+textId).val(userId);
    hideContainer(_this);
}

/**
 * [点击取消，隐藏下拉框。第三行是把footer的上边框移除，防止再次显示时边框重叠]
 * @param _this 下拉框的任一后代元素
 */
function hideContainer(_this){
    var slideDownContainer = $(_this).parents('.slideDownContainer');
    slideDownContainer.find('.slideDownBody').empty();
    slideDownContainer.hide();
    slideDownContainer.find('.slideDownFooter').css('border-top','');
    slideDownContainer.find('.slideDownFooter').find('input').eq(0).removeAttr('checked');
}

/**
 * [点击全选]
 * @param _this 该全选checkbox对象
 */
function checkAllInBox(_this) {
    if($(_this).parents('.slideDownContainer').find('.slideDownBody').find('input').length <= 0){
        return;
    }
    var isChecked = $(_this).is(':checked');
    var checkBoxes = $(_this).parents('.slideDownContainer').find('input[name="ids"]');
    if(isChecked){
        checkBoxes.each(function () {
            $(this).attr('checked','checked');
        });
    }else {
        checkBoxes.each(function () {
            $(this).removeAttr('checked');
        });
    }
}
//模糊搜索组件end

/**
 * 过滤特殊字符
 * @param str 需要被过滤的字符串
 * @param isJsProto （默认不填）是否需要进一步做转义(在js中拼接已经有转义引号\'的情况下)
 */
function checkHtmlProto(str, isJsProto) {
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&/g,"&amp;")
		.replace(/</g,"&lt;")
		.replace(/>/g,"&gt;")
		.replace(/ /g,"&nbsp;");
    if(isJsProto) {
    	s = s.replace(/\\/g, "\\\\")
			.replace(/\'/g,"\\&apos;")
            .replace(/\"/g,"\\&quot;");
	} else {
        s = s.replace(/\'/g,"&apos;")
            .replace(/\"/g,"&quot;");
	}
    return s;
}
