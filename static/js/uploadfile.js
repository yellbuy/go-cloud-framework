/**
 * 上传媒体文件
 * 20150208
 * sunqinghai
 */
  //上传图片完成后的通知
    function wxqyh_showfile(mediaInfos,ulobj,name){
    	if(name==undefined || name ==""){
    		name = "mediaIds";
    	}
    	var _test="";
    	var temp;
    	for(var i=0;i<mediaInfos.length;i++){
    		temp = mediaInfos[0];
    		_test+="<li title=\""+temp.fileName+"\"><input type=\"hidden\" name=\""+name+"\" value=\""+temp.id+"\" />"+
        		"<span onclick=\"doDownloadFile('"+temp.url+"','"+temp.fileName+"');\">"+temp.fileName+"</span><i onclick=\"doDelFileLi(this);\"></i></li>";
    	}
    	ulobj.append(_test);
       	_resetFrameHeight();
    }
    /**
     * 删除li
     * @param $this  点击的a标签的对象
     */
    function doDelFileLi($this){
    	var mediaId = $($($this).siblings("input")[0]).val();
    	if(mediaId){
        	$.ajax({
        		url:baseURL+"/fileupload/fileUploadMgrAction!doDelFile.action?mediaId="+mediaId+'&groupId='+wxqyh_uploadfile.groupId+"&dqdp_csrf_token="+ dqdp_csrf_token,
        		type:"GET",
        		dataType:"json",
        		success:function(result){
                    if('0'!=result.code){
                    	_alert("错误提示", result.desc);
                    }
                    else{
                    	$($this).parent().remove();
                    }
        		},
                error: function () { _alert("错误提示",  "网络连接失败，请检查网络连接");}
        	});
    	}
    	else{
        	$($this).parent().remove();
    	}
    }
    /**
     * 显示媒体文件
     * @param mediaInfos  文件的list
     */
    function previewFiles(mediaInfos,ulId,name){
    	if(!mediaInfos || mediaInfos.length==0){
    		return;
    	}
    	if(ulId==undefined || ulId ==""){
    		ulId = "medialist";
    	}
    	if(name==undefined || name ==""){
    		name = "mediaIds";
    	}
    	var temp;
    	var _test="";
    	for(var i=0;i<mediaInfos.length;i++){
    		temp = mediaInfos[i];
    		_test+="<li title=\""+temp.fileName+"\"><input type=\"hidden\" name=\""+name+"\" value=\""+temp.id+"\" />"+
        		"<span onclick=\"doDownloadFile('"+temp.url+"','"+temp.fileName+"');\">"+temp.fileName+"</span><i onclick=\"doDelFileLi(this);\"></i></li>";
    	}
       	$("#"+ulId).prepend(_test);
       	_resetFrameHeight();
    }

    /**
     * 上传媒体文件
     * @param fileElementId
     * @param mediaName
     * @param ulobj
     */
    function wxqyh_uploadFile(fileElementId,mediaName,ulobj){
    	showLoading("正在上传.....");
        $.ajaxFileUpload({
            url:baseURL+'/fileupload/fileUploadMgrAction!doUploadFile.action'+"?dqdp_csrf_token="+ dqdp_csrf_token,//需要链接到服务器地址
            data:{
				"corpId":wxqyh_corpId,
            	'agent':agentCode
            },
            secureuri:false,
            fileElementId:fileElementId,                        //文件选择框的id属性
            dataType: 'json',                                              //服务器返回的格式，可以是json
            success: function (data) {
                if('0'==data.code){
                	//显示上传的文件
                	wxqyh_showfile([data.data.mediaInfo],ulobj,mediaName);
                	hideLoading();
                }else{
                	hideLoading();
                	_alert("错误提示", data.desc);
                }
            	
            	//上传完成后都需要重新绑定一下事件
            	wxqyh_uploadfile.unbind();
            	wxqyh_uploadfile.init(wxqyh_uploadfile.limitSize);
            },
            error: function () {
            	hideLoading();
            	_alert("错误提示",  "网络连接失败，请检查网络连接");
            	//上传完成后都需要重新绑定一下事件
            	wxqyh_uploadfile.unbind();
            	wxqyh_uploadfile.init(wxqyh_uploadfile.limitSize);
        	}
        });
    }
    /**
     * 上传图片
     * @param fileElementId
     * @param mediaName
     * @param ulobj
     */
    function wxqyh_uploadImage(fileElementId,ulobj){
    	showLoading("正在上传.....");
        $.ajaxFileUpload({
            url:baseURL+'/fileupload/fileUploadMgrAction!doUploadImageJudge.action'+"?dqdp_csrf_token="+ dqdp_csrf_token,//需要链接到服务器地址
            data:{
            	'agent':agentCode
            },
            secureuri:false,
            fileElementId:fileElementId,                        //文件选择框的id属性
            dataType: 'json',                                              //服务器返回的格式，可以是json
            success: function (data) {
                if('0'==data.code){
                	//显示上传的文件
                	$("#"+fileElementId).next().val(data.data.imgurl);
                	$("#"+fileElementId).parent().parent().find("img").attr("src",compressURL+data.data.imgurl);
                	//wxqyh_showfile([data.data.mediaInfo],ulobj,mediaName);
                	hideLoading();
                }else{
                	hideLoading();
                	_alert("错误提示", data.desc);
                }
            	
            	//上传完成后都需要重新绑定一下事件
            	wxqyh_uploadfile.unbind();
            	wxqyh_uploadfile.init(wxqyh_uploadfile.limitSize);
            },
            error: function () {
            	hideLoading();
            	_alert("错误提示",  "网络连接失败，请检查网络连接");
            	//上传完成后都需要重新绑定一下事件
            	wxqyh_uploadfile.unbind();
            	wxqyh_uploadfile.init(wxqyh_uploadfile.limitSize);
        	}
        });
    }
    /**
     * 下载媒体文件
     * @param url 文件路径
     * @param fileName
     * @param ulobj
     */
    function doDownloadFile(url,fileName){
		window.location.href=fileDownURL+downFileURL+encodeURIComponent(url)+"&fileFileName="+encodeURIComponent(fileName)+"&dqdp_csrf_token="+ dqdp_csrf_token;
    }

    /*
    	判断上传文件大小
    	@param ulobj 上传文件元素
    	@param size 规定的上传文件大小
     */
    function fileSizeJudpe(obj,size){
    	var baseSize = 1048576;
    	var file = obj.get(0).files[0];
        if (file) {
            if (file.size > size*baseSize){//10485760
                _alert("错误提示",  "文件大小不能超过"+size+"M，请重新选择");
                obj.val('');
                return false;
            }
            return true;
        }
	}
    
    var wxqyh_uploadfile = 
    {
        agent: "",
        groupId: "",
        limitSize: '',
        maxSize: '',
		init: function(limitSize) {
            wxqyh_uploadfile.limitSize = limitSize ? limitSize : 10;
            wxqyh_uploadfile.maxSize = limitSize*1024*1024;
            $('.uploadFileInput').bind('change', function() {
               	//显示上传中的层
        		//showLoading('图片上传中...');
            	var ulobj = $(this);
            	var file = ulobj.get(0).files[0];
            	if($(this).hasClass("onlyBtn")){//只有单按钮上传图片
            		if(!fileSizeJudpe(ulobj,2)){
            			return;
					}
                	var fileElementId = ulobj.attr("id");
                	ulobj = ulobj.prev();
                	wxqyh_uploadImage(fileElementId,ulobj);
            	}else if($(this).hasClass("onlyAudio")){
					if(file){
						var path = ulobj.get(0).value;
						var fileExt = path.substr(path.lastIndexOf(".")).toLowerCase();//获得文件后缀名
						if(fileExt==""||".mp3.".indexOf(fileExt+".")<0){
							_alert("错误提示","只能上传mp3格式的文件");
							$(this).val("");
							return;
						}
						if(!fileSizeJudpe(ulobj,2)){
							return;
						}
						$(this).parent().next().find("i").trigger("click");
					}else{
						_alert("错误提示","文件为空，请重新选择");
						return;
					}
					var mediaName = ulobj.attr("fileName");
					var fileElementId = ulobj.attr("id");
					ulobj = ulobj.parent().next();
					wxqyh_uploadFile(fileElementId,mediaName,ulobj);
				}else{
            		if (file) {
                    	var path = ulobj.get(0).value;
                    	var fileExt = path.substr(path.lastIndexOf(".")).toLowerCase();//获得文件后缀名
                    	if(fileExt=="" || ".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip.".indexOf(fileExt+".")<0){
                        	_alert("错误提示",  "只能上传txt,xml,pdf,doc,ppt,xls,docx,pptx,xlsx,mp3,wma,amr,mp4,rar,zip；如需上传其它格式文件请先将其压缩后再上传");
                        	return;
                    	}
                        if(!fileSizeJudpe(ulobj,wxqyh_uploadfile.limitSize)){
                    		ulobj.attr('value','');
                    		return;
						}
                    }
                    else{
                    	_alert("错误提示","文件为空，请重新选择");
                    	return;
                    }
                	var mediaName = ulobj.attr("fileName");
                	var fileElementId = ulobj.attr("id");
					if (ulobj.parent() && ulobj.parent().hasClass("xfile")) {//新上传样式
						ulobj = ulobj.parent().prev();
					}
					else {//旧的上传样式
						ulobj = ulobj.prev();
					}
                	wxqyh_uploadFile(fileElementId,mediaName,ulobj);
            	}
            });
        },
        unbind: function() {
	        $('.uploadFileInput').unbind('change');
	    }
    };
    /**
     * 判断是否校友会或者企业微信用户
     * @param obj
     */
    function judgeClient(obj){
    	var ua = navigator.userAgent.toLowerCase();
    	var url = window.location.href;
        if((ua.match(/MicroMessenger/i)=="micromessenger" && url.indexOf("wxqyh") >= 0)) {
        	return false;
        }
    	$("#aLink").click();
    	return true;
	}

/**
 * 下载文件，传入名字和自动获取后缀
 * @param url
 * @param fileName
 */
function doDown(url,fileName){
	var strName=url.substring(url.lastIndexOf("."));
	doDownloadFile(url,"einvoice_"+fileName+strName);
}
		