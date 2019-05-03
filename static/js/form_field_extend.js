var currentStatisticsFieldKey="";//记录当前被选中的统计字段id
var testNum=0;
var statisticRelation = [];//表单可选择的表单数据
function fieldExtendInfo(fieldObj){
	// var field = generateChildFormString();
	// field = JSON.parse(field);
	// if(fieldObj.type=="StatisticsField"){//如果当前点击的是统计字段时
	//     currentStatisticsFieldKey=fieldObj.id;
	// 	getStatisticsFieldInfo();
	// }
}
//获取有数字字段的关联字段和子表单
function get_GoldenData_fields(){
    GoldenData.fieldList.toJSON();
    var result = [];
    var list = $.merge(GoldenData.fieldList.where({'_type':'Fields::FORMREFCustomerField'}),GoldenData.fieldList.where({'_type':'Fields::ChildField'}));
    $.each(list,function(i,model){
        var children = model.get('children');
        var childs = [];
        $.each(children,function(i,e){
            if(e._type =='Fields::NumberField'||e._type == 'Fields::EquationField'){
                $.merge(childs,[{
                    _id: e._id,
                    label: e.label
                }]);
            }
        });
        if(model.get('_type')=='Fields::FORMREFCustomerField'){
            var id = model.get('ref_id');
            var ref_cfg = model.get('ref_cfg');
            if(typeof ref_cfg == 'string'){
                ref_cfg = JSON.parse(ref_cfg)
            }
            var show_fields = ref_cfg.show_fields;
            if(id){
                // 加载字段
                if(!formFieldFilter[id]){
                    loadFormFields(id);
                }
                if(formFieldFilter[id]){
                    // 过滤字段
                    for(var j in formFieldFilter[id]){
                        var childField=formFieldFilter[id][j];
                        if(childField._type.indexOf("NumberField")>-1||childField._type.indexOf("EquationField")>-1||childField._type.indexOf("StatisticsField")>-1){
                            if(show_fields.indexOf(childField._id)!=-1){
                                $.merge(childs,[{
                                    _id: childField._id,
                                    label: childField.label
                                }]);
                            }
                        }
                    }
                }
            }
        }
        if(childs.length == 0)return;
        $.merge(result,[{
            _id:model.get('_id'),
            label:model.get('label'),
            childs:childs
        }]);
    });
    return result;
}
function show_statisdics(calculator){
    var parentKey = '',childKey = '';
	if(calculator){
        parentKey = calculator.split('|')[0];
        childKey = calculator.split('|')[1]||'';
	}
    var fields = get_GoldenData_fields();
    statisticRelation = fields;
	var $html = $('<div><select class="input-small set-parent-key">'
        +'<option value="">请选择</option>'
        +'</select>'
        +'<select class="input-small set-child-key">'
        +'<option value="">请选择</option>'
      	+'</select></div>');
	var childs = [];
	$.each(fields,function(i,field){
        var option = '<option '+(parentKey == field._id? ' selected=selected ': '') +'value="'+field._id+'">'+field.label+'</option>'
        $html.find('select:eq(0)').append(option);
        if(field._id == parentKey){
            childs = field.childs;
        }
	});
    $.each(childs,function(i,field){
        var option = '<option '+(childKey == field._id? ' selected=selected ': '') +'value="'+field._id+'">'+field.label+'</option>'
        $html.find('select:eq(1)').append(option);
    });
	return $html.html();
}
// /***判断是否存在有未赋值id 的字段表***/
// function checkChildFieldIsNotUUID(field){
// 	var isExist=false;
//
// 	for(var i=0;i<field.length;i++){
// 		var fieldJson = field[i];
// 		//如果子表单字段为空，不做处理
// 		if((fieldJson._type == 'Fields::ChildField' || fieldJson._type == 'Fields::FORMREFCustomerField' ||fieldJson._type=='Fields::StatisticsField')&&fieldJson._id==undefined){
// 			isExist=true;
// 			break;
// 		}
// 	}
// 	return isExist;
// }
// /***给字段重新赋予id信息**/
// function getFieldUUIdInfo(){
// 	var field = generateChildFormString();
// 	field = JSON.parse(field);
// 	var data = {};
// 	data.fieldList = [];
// 	data.getJsonHtml = {};
// 	data.getJsonHtml.ordered_fields = [];
// 	if(field!=""){
// 		if(!checkChildFieldIsNotUUID(field)){
// 			return;
// 		}
// 		for(var i=0;i<field.length;i++){
// 			var fieldJson = field[i];
// 			//如果子表单字段为空，不做处理
// 			if(fieldJson._type == 'Fields::ChildField'|| fieldJson._type == 'Fields::FORMREFCustomerField'){if(!fieldJson.childForm)return;}
// 			var tem = {
// 				"itemKey": fieldJson._id?fieldJson._id:'fo'+uuid().replace(/-/g,''),//new uuid 或者id
// 				"itemName": fieldJson.label,//label
// 				"itemType": fieldJson._type.split('::')[1]//"_type": "Fields::TextField",
// 			}
// 			fieldJson._id = tem.itemKey;
// 			data.getJsonHtml.ordered_fields.push(fieldJson);
// 			if(fieldJson._type == 'Fields::ImageCheckBox'||fieldJson._type == 'Fields::SectionBreak')continue;
// 			data.fieldList.push(tem);
// 		}
// 	}
//
// 	if(data.fieldList&&data.fieldList.length>0){
// 		try{//每次赋予id时，填充新的html代码
// 			$("#form_design").html(formFiledDivHtmlInfo);
// 			renderChildForm(data.getJsonHtml);
// 		}catch(e){//没有字段时防止js报错
// 			$("#form_design").html(formFiledDivHtmlInfo);
// 			var formJson = $.parseJSON('{\"description\":null,\"name\":null,\"token\":null,\"class_name\":\"Form\",\"ordered_fields\":[]}');
// 			renderChildForm(formJson);
// 		}
// 		setTimeout(function(){
// 			if($('.sf-add-ziduanbox').length == 0){
// 				$('.sidebar').after('<div class="sf-add-ziduanbox"></div>');
// 			}
// 		},500);
//
// 	}
// }
//
// function getStatisticsFieldInfo(){
// 	getStatisticsMapInfo();
// 	var choiseVal=getAlrealyChoiseVal();
// 	if(!statisticsFieldMap.isEmpty()){
// 		var choiseVals="";
// 		var isChise=false;
// 		if(choiseVal!=""){
// 			choiseVals=choiseVal.split("|");
// 			isChise=true;
// 		}
// 		$("#form_design").find(".statistics_ui").each(function() {
// 			var obj = $(this).find("select");
// 			var childFieldHtml="<option value=''>请选择</option>";
// 			var choiseChildFieldVal="";
// 			//获取子表单字段信息
// 			for(var i=0;i<statisticsFieldMap.size();i++){
// 				var key=statisticsFieldMap.keySet()[i];
// 				var keys=key.split(":");
// 				if(isChise&&choiseVals.length>0&&keys[0]==choiseVals[1]){
// 					childFieldHtml+="<option value='"+keys[0]+"' selected='selected'>"+keys[1]+"</option>";
// 					choiseChildFieldVal=key;
// 				}else{
// 					childFieldHtml+="<option value='"+keys[0]+"'>"+keys[1]+"</option>";
// 				}
// 			}
// 			//获取到子表单字段下的数字字段信息
// 			$(obj[0]).html(childFieldHtml);
// 			childFieldHtml="<option value=''>请选择</option>";
// 			if(choiseChildFieldVal!=""){
// 				var childNumberField=statisticsFieldMap.get(choiseChildFieldVal);
// 				if(childNumberField&&childNumberField.length>0){
// 					for(var j=0;j<childNumberField.length;j++){
// 						var numberVal=childNumberField[j].split("|");
// 						if(isChise&&choiseVals.length>2&&numberVal[0]==choiseVals[2]){
// 							childFieldHtml+="<option value='"+numberVal[0]+"' selected='selected'>"+numberVal[1]+"</option>";
// 						}else{
// 							childFieldHtml+="<option value='"+numberVal[0]+"'>"+numberVal[1]+"</option>";
// 						}
// 					}
// 				}
// 			}
// 			$(obj[1]).html(childFieldHtml);
// 		});
// 	}
// }
// var statisticsFieldMap=new Map();//记录统计字段信息的map
// var statisticsFieldChoiseValList=new Array();//存放统计字段值信息
// // 获取子表单的数字以及计算式字段的Map信息
// function getStatisticsMapInfo(){
// 	var field = generateChildFormString();
// 	field = JSON.parse(field);
// 		if(field!=""){
// 			statisticsFieldMap=new Map();
// 			for(var i=0;i<field.length;i++){
// 				var fieldJson = field[i];
// 				//如果子表单字段为空，不做处理
// 				if(fieldJson._type == 'Fields::ChildField'|| fieldJson._type == 'Fields::FORMREFCustomerField'){//子表单
// 					var numberField=new Array();//加入子表单的数据字段信息
//
// 					if(fieldJson.children.length>0){//子表单的子字段
//
// 						for(var j=0;j<fieldJson.children.length;j++){
// 							var childField=fieldJson.children[j];
// 							if(childField._type.indexOf("NumberField")>-1||childField._type.indexOf("EquationField")>-1){
// 								numberField.push(childField._id+"|"+childField.label);
// 							}
// 						}
//
//
// 					}
//
// 					OUT:if(fieldJson._type == 'Fields::FORMREFCustomerField'){
// 						var id = fieldJson.ref_id;
// 						if(!id){
// 							break OUT;
// 						}
//
// 						// 加载字段
//         				if(!formFieldFilter[id]){
//         					loadFormFields(id);
//         				}
//         				if(formFieldFilter[id]){
//         					// 过滤字段
//         					for(var j in formFieldFilter[id]){
//     							var childField=formFieldFilter[id][j];
//     							if(childField._type.indexOf("NumberField")>-1||childField._type.indexOf("EquationField")>-1||childField._type.indexOf("StatisticsField")>-1){
//     								numberField.push(childField._id+"|"+childField.label);
//     							}
//     						}
//         				}
//
// 					}
//
// 					if(numberField.length>0){
// 						statisticsFieldMap.put(fieldJson._id+":"+fieldJson.label,numberField);
// 					}
// 				}
// 			}
// 		}
// }
// /****获取已经得到的值信息***/
// function getAlrealyChoiseVal(){
// 	var choiseVal="";
// 	if(statisticsFieldChoiseValList&&statisticsFieldChoiseValList.length>0){
// 		nindDelList=new Array();//需要删除的字段
// 		for(var i=0;i<statisticsFieldChoiseValList.length;i++){
// 			if(statisticsFieldChoiseValList[i].indexOf("undefined")>-1){
// 				nindDelList.push(statisticsFieldChoiseValList[i]);
// 			}
// 		}
// 		if(nindDelList.length>0){
// 			for(var i=0;i<nindDelList.length;i++){
// 				statisticsFieldChoiseValList.remove(nindDelList[i]);
// 			}
// 		}
// 		for(var i=0;i<statisticsFieldChoiseValList.length;i++){
// 			if(("first|"+statisticsFieldChoiseValList[i]).indexOf("first|"+currentStatisticsFieldKey+"|")>-1){
//                 choiseVal=statisticsFieldChoiseValList[i];
// 				break;
// 			}
// 		}
// 	}
// 	return choiseVal;
// }
//
// /***通过子表单获取里面的数字字段信息***/
// function getChildNumberFieldInfo(obj){
//     if($(obj).val()==""){
//       $(obj).siblings('select').eq(0).html("<option value=''>请选择</option>");
// 	  saveStatisticsFieldChoiseVal(true,$(obj).val());
//    }else{
//       var childFieldHtml="<option value=''>请选择</option>";
//       if(!statisticsFieldMap.isEmpty()){
//          var key="";
//          var isFind=false;
//          for(var i=0;i<statisticsFieldMap.size();i++){
//             key=statisticsFieldMap.keySet()[i];
//             var keys=key.split(":");
//             if(keys[0]==$(obj).val()){
//                isFind=true;
// 				break;
//             }
//          }
//          if(isFind){
//             var childNumberField=statisticsFieldMap.get(key);
//             if(childNumberField&&childNumberField.length>0){
//                var choiseVal=getAlrealyChoiseVal();
//                if(choiseVal!=""){
//                   choiseVal=choiseVal.split("|");
//                   if(choiseVal.length>1){
//                      choiseVal=choiseVal[2];
//                   }
//                }
//                for(var j=0;j<childNumberField.length;j++){
//                   var numberVal=childNumberField[j].split("|");
//                   if(numberVal[0]==choiseVal){
//                      childFieldHtml+="<option value='"+numberVal[0]+"' selected='selected'>"+numberVal[1]+"</option>";
//                   }else{
//                      childFieldHtml+="<option value='"+numberVal[0]+"'>"+numberVal[1]+"</option>";
//                   }
//                }
//             }
//          }
//       }
//       $(obj).siblings('select').eq(0).html(childFieldHtml);
// 	  saveStatisticsFieldChoiseVal(true,$(obj).val());
//    }
// }
// /***数字字段选择值信息时**/
// function saveStatisticsFieldInfo(obj){
//    saveStatisticsFieldChoiseVal(false,$(obj).val());
// }
// /**保存统计字段数据信息***/
// function saveStatisticsFieldChoiseVal(isChild,val){
// 	var fieldVal=getAlrealyChoiseVal();
// 	if(isChild){
// 		statisticsFieldChoiseValList.remove(fieldVal);
// 		if(val!=""){
// 			fieldVal=currentStatisticsFieldKey+"|"+val+"|";
// 			statisticsFieldChoiseValList.push(fieldVal);
// 		}
// 	}else{
// 		statisticsFieldChoiseValList.remove(fieldVal);
// 		var fieldVals=fieldVal.split("|");
// 		fieldVal=currentStatisticsFieldKey+"|";
// 		if(fieldVals.length>0){
// 			fieldVal+=fieldVals[1]+"|";
// 		}
// 		fieldVal+=val;
// 		statisticsFieldChoiseValList.push(fieldVal);
// 	}
// 	$("#statisticsFieldJson").val(JSON.stringify(statisticsFieldChoiseValList));
// }
// function initialStatisticsField(statisticsFieldList){
// 	if(statisticsFieldList&&statisticsFieldList.length>0){
// 		for(var i=0;i<statisticsFieldList.length;i++){
// 			statisticsFieldChoiseValList.push(statisticsFieldList[i].valueKey+"|"+statisticsFieldList[i].relationshipKey);
// 		}
// 		$("#statisticsFieldJson").val(JSON.stringify(statisticsFieldChoiseValList));
// 	}
// }
