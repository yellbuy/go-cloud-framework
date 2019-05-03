/**
 * Created by 陈熠 on 2017/6/21
 * email   :  228112142@qq.com
 */
(function ($) {
    /* 入口函数 */
    $.fn.Hupload = function () {
        //当前对象
        var $div = this;
        //获取参数
        cyProps = $div.attr("cyProps");
        if (!cyProps) {
            return
        }
        cyProps = cyProps ? cyProps : "";
        //将参数转为json
        cyProps = eval("({" + cyProps + "})");
        Hupload.renderData($div, cyProps);
    };
    /*默认配置*/
    var cyProps = {};
    /*方法对象*/
    var Hupload = {
        /**chenyi 2017/11/18 上传**/
        uploadInit: function (cyProps) {
            //上传控件id
            var uploadId = cyProps.uploadId;
            //上传地址
            var url = cyProps.url || "/getData/uploads/";
            //上传按钮名称
            var btnName = cyProps.btnName || '上传文件';
            //是否显示删除按钮
            var deleteBtn = cyProps.deleteBtn || 'true';

            $("#" + uploadId).Huploadify({
                auto: true,
                fileTypeExts: '*.*',
                multi: false,
                formData: {relationId: uploadId},
                fileObjName: 'uploadFile',
                fileSizeLimit: 99999999999,
                showUploadedPercent: false,
                buttonText: btnName,
                uploader: url,
                onUploadSuccess: function (file, data) {
                    var Data = JSON.parse(data);
                    Data.img=Data.url;
                    var fileType = file.type.split("/") || "";
                    //如果是图片显示图片，如果不是图片，显示系统默认图片
                    if (fileType[0] != "image") {
                        Data.img = "/statics/img/notImg.png"
                    }
                    if (Data.code == '0') {
                        //是否显示删除按钮
                        var $deleteBtn="";
                        if(deleteBtn=="true"){
                            $deleteBtn='<i class="fa fa-trash-o" fileId="' + Data.fileId + '" onclick="removeHImg(this)">&nbsp;</i>';
                        }

                        $("#" + uploadId + "_show").append('<div class="float-left"> ' +
                            '<img src="' + Data.img + '" class="layui-upload-img"> ' +
                            '<div style="margin-bottom: 10px;width:120px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;">' + $deleteBtn+'' +
                            '<span onclick="downloadFile(\'' + Data.url + '\')" class="click-span" title="' + file.name + '" >' + file.name + '</span>' +
                            '</div> </div>');
                        parent.layer.msg("添加成功", {icon: 1});
                    } else {
                        parent.layer.msg(Data.msg, {icon: 5});
                    }
                },
                onUploadError: function (file, response) {
                    var _data = JSON.parse(response);
                    parent.layer.msg(_data.msg, {icon: 5});
                 }
            });
        },
        /**chenyi 2017/11/18 文件回填**/
        showFile: function (cyProps) {
            //是否显示删除按钮
            var deleteBtn = cyProps.deleteBtn || 'true';
            //上传控件id
            var uploadId = cyProps.uploadId;
            if(uploadId){
                $.ajax({
                    type: "POST",  //提交方式
                    url: "/getData/getFile/" + uploadId,//路径
                    dataType: "json",
                    success: function (result) {//返回数据根据结果进行相应的处理
                        if (result.code == '0') {
                            var list = result.fileList;
                            for (var i = 0; i < list.length; i++) {
                                list[i].img= list[i].url;
                                //是否显示删除按钮
                                var $deleteBtn="<i></i>";
                                if(deleteBtn=="true"){
                                    $deleteBtn='<i class="fa fa-trash-o" fileId="' + list[i].id + '" onclick="removeHImg(this)">&nbsp;</i>';
                                }
                                if (list[i].fileType != "image") {
                                    list[i].img = "/statics/img/notImg.png";
                                }
                                $("#" + uploadId + "_show").append('<div class="float-left"> ' +
                                    '<img src="' + list[i].img + '" class="layui-upload-img"> ' +
                                    '<div style="margin-bottom: 10px;width:120px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;">' + $deleteBtn+
                                    '<span onclick="downloadFile(\'' + list[i].url + '\')" class="click-span" title="' + list[i].fileName + '" >' + list[i].fileName + '</span>' +
                                    '</div> </div>');
                            }

                        }
                    }
                });
            }

        },

        /**组件渲染 by chenyi 2017/7/20*/
        renderData: function ($div, cyProps) {

            var $div = $div;
            //上传控件id
            cyProps.uploadId=cyProps.uploadId?cyProps.uploadId:$t.getUUID();
            var _uploadId = cyProps.uploadId;
            if(!_uploadId){return false;}
            //是否显示上传按钮
            var uploadBtn = cyProps.uploadBtn || 'true';
            //是否需要表单提交
            var _name = cyProps.name || '';
            if(_name!=""){
                $div.after(' <input type="hidden" value="'+_uploadId+'"  name="'+_name+'" >');
            }
            $div.attr("id", _uploadId);
            $div.after('<div class="layui-upload-list" id="' + _uploadId + '_show"></div>');
            if(uploadBtn=="true"){
                //上传按钮渲染
                Hupload.uploadInit(cyProps);
            }
            //文件回填
            Hupload.showFile(cyProps);
        }
    }

})(jQuery);
/**chenyi 2017/11/18 删除**/
function removeHImg(obj) {
    confirm("确认删除图片?",function(){
        var fileId = $(obj).attr("fileId");
        $.ajax({
            type: "POST",  //提交方式
            url: "/getData/deleteFile/" + fileId,//路径
            dataType: "json",
            success: function (result) {//返回数据根据结果进行相应的处理
                if (result.code == '0') {
                    $(obj).parents(".float-left").remove();
                    parent.layer.msg('删除成功 !', {icon: 1});
                }
            },
            error: function () {
                parent.layer.msg("系统繁忙", {icon: 5});
            }
        });
    });

}
/**chenyi 2017/11/18 文件下载**/
function downloadFile(sUrl) {
    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;
        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}
window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
$(document).ready(function () {
    var Huploads = $("[cyType='HuploadTool']");
    for (var i = 0; i < Huploads.length; i++) {
        $(Huploads[i]).Hupload();
    }
});