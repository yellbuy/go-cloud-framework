
layui.use(['layer','form',"jquery"], function(){
    $=layui.jquery;
    
    var verifyCode = new GVerify({id:"v_container",width:116,height:36});
    document.getElementById("btnRefreshVerifyCode").onclick = function(){
        verifyCode.refresh();
    }   
    var layer = layui.layer; //弹层
    var form = layui.form;
    
    if(error_info){
        layer.msg(error_info,{time:2000,offset: '100px'});
    }
    form.on("submit",function(data) {
        var res = verifyCode.validate(document.getElementById("captcha").value);
        if(res){
            return true;
        }else{
            layer.msg("验证码错误",{time:2000,offset: '100px'});
            return false;
        }
    });
})