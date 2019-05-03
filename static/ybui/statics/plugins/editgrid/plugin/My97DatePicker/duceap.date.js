(function($){
    /** 日期转换 yangjy 2015-10-10 **/
    var getDateFromStr=function(strDate) {
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
        return date;
    }
    var getDate=function(value,dateMat){

        try{
            if(!value)return "";
            //if(value.indexOf("-")>=0){     /** 日期转换 yangjy 2015-10-10 **/
            //var  dateValue=getDateFromStr(value);
            //    return  dateValue.pattern(dateMat);
            //}
            //支持后台date 日期类型，返回2015-5-1 12:22:55.22 毫秒级日期
            var _value=value;
            if(_value.indexOf(".")>0){
                _value=_value.split(".")[0].replace(/[^0-9]/ig,"");
            }
            if(dateMat=="HH:mm:ss"){
                // todo 临时解决 时分秒6位塞值
                var hour=_value.slice(0,2);
                var minute=_value.slice(2,4);
                var second=_value.slice(4,6);
                dateMat=dateMat.replace("HH",hour).replace("mm",minute).replace("ss",second);
                return dateMat;
            }
            var year=_value.slice(0,4);
            var month=_value.slice(4,6);
            var day=_value.slice(6,8);
            var hour=_value.slice(8,10);
            var minute=_value.slice(10,12);
            var second=_value.slice(12,14);
            if(!dateMat) return year+"-"+month+"-"+day;
            //  yyyy-MM-dd HH:mm:ss
            dateMat.match("yyyy")&&(dateMat=dateMat.replace("yyyy",year));
            dateMat.match("MM")&&(dateMat=dateMat.replace("MM",month));
            dateMat.match("dd")&&(dateMat=dateMat.replace("dd",day));
            dateMat.match("HH")&&(dateMat=dateMat.replace("HH",hour));
            dateMat.match("mm")&&(dateMat=dateMat.replace("mm",minute));
            dateMat.match("ss")&&(dateMat=dateMat.replace("ss",second));
            return dateMat;

        }catch(error) {
            return value;
        }

    }
    var outerProps2innerProps=function(props,$this){
        props=props?props:{};
        if(props.onChange){
            var _onpicking=props.onpicking;
            props.onpicking=function(dp){
                _onpicking&&_onpicking(dp);
                if(dp.cal.getDateStr()== dp.cal.getNewDateStr() ) return;
                props.onChange(dp.cal.getNewDateStr(),$this);
            }
        }
    }
    $.fn.dateDp=function(props){
        var $jPanel=$(this);
        $jPanel.addClass("Wdate");
        outerProps2innerProps(props,$jPanel);
        //去掉 日期图标
        //if(props.Wdate=='false') $jPanel.removeClass("Wdate");
        //塞值时 设置默认格式
        if($jPanel.attr("value")&&($jPanel.attr("value").length!=0)){
            var value=getDate($jPanel.attr("value"),props.dateFmt);
            $jPanel.attr("value",value);
        }
        $jPanel.click(function(target){
            //focus->click 防止日期在验证获得焦点时报错
            WdatePicker(props?props:{});
        });
        // readonly 移除三角点击事件
        ($jPanel.attr("readonly")=="readonly")&&($jPanel.unbind("focus").unbind("click"));

        /**  **/
        $jPanel.attr("dptype","date");
        $jPanel.data("data",$jPanel);
        $jPanel._val=$jPanel.val;
        $jPanel.setValue=function(value){
            var dateFmt=(props.dateFmt)?(props.dateFmt):"yyyy-MM-dd";
            $jPanel._val(getDate(value,dateFmt));
        }
        $jPanel.val=function(value){
            var dateFmt=(props.dateFmt)?(props.dateFmt):"yyyy-MM-dd";
            if(arguments.length<=0)return $jPanel._val().replace(/[^0-9]/ig,"");
            $jPanel._val(getDate(value,dateFmt));
        }
        $jPanel.text=function(){
            return $jPanel._val();
        }
        $jPanel.text4val=function(val){
            return getDate(val,props.dateFmt);
        }
        $jPanel.readonly=function(read){
            if(read){
                $jPanel.attr("readonly","readonly").addClass("readonly");
                $jPanel.unbind("focus").unbind("click");
            }else{
                $jPanel.removeAttr("readonly").removeClass("readonly");
                $jPanel.click(function(target){
                    //focus->click 防止日期在验证获得焦点时报错
                    WdatePicker(props?props:{});
                });
            }
        }
        $jPanel.disabled=function(dis){
            if(dis){
                $jPanel.attr("disabled","disabled").addClass("disabled");
                $jPanel.unbind("focus").unbind("click");
            }else{
                $jPanel.removeAttr("disabled").removeClass("disabled");
                $jPanel.unbind("click").click(function(target){
                    //focus->click 防止日期在验证获得焦点时报错
                    WdatePicker(props?props:{});
                });
            }
        }

        $jPanel.data("date",$jPanel) ;//yangjy 2015-10-15  $.fn.setFormObject塞值时可用
        return $jPanel;
    }
})(jQuery);