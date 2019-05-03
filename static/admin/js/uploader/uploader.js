layui.use(['larry','upload', 'form'], function(){
  var $ = layui.jquery
  ,upload = layui.upload
  ,form = layui.form;
  //单图片上传
  var uploadInst = upload.render({
      elem: '#btn_photopic'
      ,url: '/upload'
      ,before: function(obj){
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result){
              $('#img_photopic').attr('src', result); //图片链接（base64）
          });
      }
      ,done: function(res){
          //如果上传失败
          if(res.errcode > 0){
              return layer.msg('上传失败');
          }
          //上传成功
          layer.msg(res.errmsg);
          document.getElementById("photopicurl").href = res.data.src; 
          document.getElementById("photopic").value= res.data.src;			
      }
      ,error: function(){
          //显示失败状态，并实现重传
          var demoText = $('#TishiText');
          demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
          demoText.find('.demo-reload').on('click', function(){
          uploadInst.upload();
          });
      }
  });

//多图片上传
upload.render({
elem: '#manypics'
,url: '/upload'
,multiple: true  //true 是多张 false 单张
,before: function(obj){
}
,done: function(res){
  if(res.data.errcode>0){
    return layer.msg('上传失败');
  }
  var data=res.data;
  var html='<div class="imgContainer" id="manyImg_'+data.id+'">';
  html=html+'<a href="'+data.src+'" target="_blank">';
  html=html+'<img src="'+data.src+'" class="layui-upload-img" width="75" height="75">';
  html=html+'</a><p onclick="removeImg('+data.id+')" class="imgDelete">删除</p></div>';
  $('#manypicslist').append(html);
  var pics=$("#pics").val();
  if(pics){
    pics=pics+",";
  } 
  pics=pics+data.id;
  $("#pics").val(pics);
}
  ,error: function(){
      return layer.msg('系统错误');
  }
});


});

function removeImg(imgid){   //多图片删除
  $('#manyImg_'+imgid).remove();
  var pics=$("#pics").val();
  if(pics){
    var res="";
    var picArr=pics.split(",");
    picArr.forEach(function(val){
      if(val != imgid){
        if(res){
          res=res+",";
        }
        res=res+val;
      }
    });
    $("#pics").val(res);
  }
  
}

//单图片删除
var $hover_wx = $('.upload_photopic .js-upload-hover');
$('.upload_photopic').mouseover(function() {
  if(document.getElementById("photopic").value=="" || document.getElementById("photopic").value=="images/photo_defalut.png"){
      $hover_wx.hide();
  }else{
      $hover_wx.show();
  }
}).mouseout(function() {
  $hover_wx.hide();
});
$(".delete-photopic").click(function() {
  document.getElementById("img_photopic").src= "images/photo_defalut.png";
  document.getElementById("photopic").value= "";
  $hover_wx.hide();
});
