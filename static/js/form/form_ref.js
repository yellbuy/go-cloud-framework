
/**
 * 表单关联字段
 */

var dataypes=dataypes;
var ref_cfg=ref_cfg;
var ref_id = ref_id;
var ref_title=ref_title;
var ref_url=ref_url;
var ref_type=ref_type;
var unique = unique;
function hasFormRef(){
	  var formValue= JSON.parse(GoldenData.generateFormString(GoldenData.form));
	  var has = false;
      $(formValue).each(function(i,field){
          if (field._type == "Fields::FORMREFCustomerField") {
        	  has = true;
              return false;
          }
      });
      return has = true;

}

function ref_cfg_tostring(ref_cfg){
	if(!ref_cfg){
		return "";
	}
	if(typeof ref_cfg != "string"){
		ref_cfg = JSON.stringify(ref_cfg);
	}
	return forHTML(ref_cfg);
}

               function selectDatatypes(t){
            	   $(t).parents("ul").find(".dataChoose").attr('checked',$(t).is(':checked'));
            	   
               }
               
               function subSelectDatatypes(t){
            	   var chooseAll =  $(t).parents("ul").find(".dataChooseAll");
            	   var sub = $(t).parents("ul").find(".dataChoose");
            	   var subChoose = $(t).parents("ul").find(".dataChoose:checked");
            	   chooseAll.attr("checked",  sub.length == subChoose.length);
               }
               
               
               // 加载表单字段（同步）
               function loadFormFields(id,fail){
            	   $.ajax({
   				    url: baseURL+ "/form/formAction!searchFormField.action?definitionVersionsId="+id,
   				    dataType: "json",
   				    async: false,	
   				    type: "POST",	
   				    success: function( result ) {

			    			formField[id]={};
				    			formFieldFilter[id]={};
				    			formAllField[id]={};
   				    	if ('0' == result.code) {
   				    		// 表单类型
   				    		formTypes[id]=result.data.isTask;
   				    		var ready = false;
   				    	if(result.data && result.data.webHtml&& result.data.webHtml.ordered_fields){

  				    			$(result.data.webHtml.ordered_fields).each(function(i,vo){
  				    				vo._type = vo._type.replace("Fields::","");
  				    				

  				    				// 只有这些种类字段，且不能是子表单字段，能进行关联
  				    				if("TextField|TextArea|RadioButton|CheckBox|DropDown|CascadeDropDown|NumberField|EquationField|EmailField|TelephoneField|MobileField|GeoField|CityField|DateField|TimeField|DateTimeField|RatingField|ImageField|StatisticsField|ImageRadioButton"
  				    						.indexOf(vo._type) > -1){
  				    					formField[id][vo._id]=vo.label;
  				    					ready = true;
  				    				}
  				    				
  				    				// 只有这些字段能作为筛选条件（图片和附件不支持，没有意义）
  				    				if("TextField|TextArea|RadioButton|CheckBox|DropDown|CascadeDropDown|NumberField|EquationField|EmailField|TelephoneField|MobileField|GeoField|CityField|DateField|TimeField|DateTimeField|RatingField|StatisticsField|ImageRadioButton"
  				    						.indexOf(vo._type) > -1){
  				    					formFieldFilter[id][vo._id]=vo;
  				    				}
  				    				formAllField[id][vo._id]=vo;
  				    			});
  				    			
  				    		}
	   				    	if(!ready){
	   				    		delete formField[id];
	   				    		_top_alert("该表单无可关联字段，请选择其它表单",false);
	   				    		return false;
	   				    	}
   				    	} else {
   				    		delete formField[id];
   				    		_top_alert( result.desc,false);
   				    		return false;
   							
   						}
   				    	
   				    	
   				    	}
   				    });
            	   
               }
               
               // 条件字段控制table.js用
               function controlFilterCondition(field,ref_id,value){
            	   var html="<option value=''>请选择</option>";
            	   var fieldType="---";
            	   if(field && formFieldFilter[ref_id] && formFieldFilter[ref_id][field]){
            		   fieldType = formFieldFilter[ref_id][field]._type;
            	   }
            	   var isNumber="NumberField|EquationField|DateField|TimeField|DateTimeField|RatingField|StatisticsField"
 						.indexOf(fieldType) > -1;
 						html=html.concat('<option '+ (value=="1"?"selected='selected'":"") + ' value="1">等于</option>');
 						html=html.concat('<option '+ (value=="2"?"selected='selected'":"") + ' value="2">不等于</option>');
            	   if(isNumber){
            		   html=html.concat('<option '+ (value=="3"?"selected='selected'":"") + ' value="3">大于</option>');
            		   html=html.concat('<option '+ (value=="4"?"selected='selected'":"") + ' value="4">大于等于</option>');
            		   html=html.concat('<option '+ (value=="5"?"selected='selected'":"") + ' value="5">小于等于</option>');
            		   html=html.concat('<option '+ (value=="6"?"selected='selected'":"") + ' value="6">小于</option>');
            	   }
            	   html=html.concat('<option '+ (value=="9"?"selected='selected'":"") + ' value="9">包含</option>');
					html=html.concat('<option '+ (value=="10"?"selected='selected'":"") + ' value="10">属于</option>');
					return html;
               }
               
               //选择关联表单弹框用
               function choseSelectForm(t,vid){
            	   if(!window.seleFormId){
            		   window.seleFormId=0;
            	   }
            	   
            	   var inputName = $(t).parents(".field").find("[name='field[ref_title]']");
            	   var inputId = $(t).parents(".field").find("[name='field[ref_id]']");
            	   var chosen={};
            	   if(inputId.val()!=""){
            		   chosen[inputId.val()]=inputName.val();
            	   }
            	   window.parent.loadSelectForm(vid,{
            		   chosen:chosen,
            			ok:function(data){
            				for(var id in data){
            					if(id==$("#id").val() && getParam("operationType")!="copy"){
            						_alert('提示','请勿关联当前表单！');
            						continue;
            					}
            					if(id==inputId.val()){
            						continue;
            					}else{
									//切换关联的表单
									rebuit_ref_cfg($(t).parents(".field"));
								}
            					
            					inputName.val(data[id]);
            					inputName.change();
                				inputId.val(id);
                				inputId.change();
                				// 加载字段
                				if(!formField[id]){
                					loadFormFields(id);
                				}
                				// 外部表单不显示权限控制
                				if(formTypes[id]=="3"){
                					$(t).parents(".field").parent().find(".datatypes").hide();
                				}else{
                					$(t).parents(".field").parent().find(".datatypes").show();
                				}
                				//显示div
								$(t).parents(".field").next().show();

            				}
            				return true;
            			}
            		   
            	   }).showDiv();
            	   
               }
               var formField={};
               var formFieldFilter={};
               var formTypes={}
               var formAllField={};
			//显示关联字段用
           function builtshow_fieldsOptions(formId,vo,show_fields){
        	   
        	   // 加载字段
				if(!formField[formId]){
					loadFormFields(formId);
				}
				var fields = formField[formId];
				return fields;
        	   
           }
			//显示过滤数据
          function builtfilter_fields(formId,ref_cfg){
        	   
        	   function escape_c(value){
				   var str = ''
				   switch(value){
					   case '1' : str = '等于';break;
					   case '2' : str = '不等于';break;
					   case '3' : str = '大于';break;
					   case '4' : str = '大于等于';break;
					   case '5' : str = '小于等于';break;
					   case '6' : str = '小于';break;
					   case '9' : str = '包含';break;
					   case '10' : str = '属于';break;
					   default :str = '';
				   }
				   return str;
			   }
        	   var html="";
        	   if(ref_cfg && typeof ref_cfg=="string" ){
        		   ref_cfg=JSON.parse(ref_cfg);
        	   }else if(!ref_cfg){
        		   return "";
        	   }
			   var fields = formField[formId];
        	   ref_cfg=ref_cfg.filter_fields;

        	   if(ref_cfg){
        		   for(var i = 0;i < ref_cfg.length;i++){

        			   html+='<input  type="text" readonly="readonly" class="full-width" value="'+fields[ref_cfg[i].filter_field]+','+escape_c(ref_cfg[i].filter_condition)+','+ref_cfg[i].filter_value+'" />'
        		   }
        	   }
        	   return html;
        	   
           }
			//显示关联字段
           function builtshow_fields(formId,ref_cfg){
        	   
        	   var html = "";
        	   if(ref_cfg && typeof ref_cfg=="string" ){
        		   ref_cfg=JSON.parse(ref_cfg);
        	   }else if(!ref_cfg){
        		   return "";
        	   }
        	   if(ref_cfg.show_fields){
        		   $(ref_cfg.show_fields).each(function(i,vo){
					   var fields =builtshow_fieldsOptions(formId,vo,ref_cfg.show_fields);
					   if(!fields[vo]){
						   return;
					   }
					   var fieldName = fields[vo];
        			   html = html.concat('<input  type="text" readonly="readonly" class="full-width" value="'+fieldName+'" />');
        			   
        		   });
        		   
        	   }
        	   return html;
           }
			//表单设计器显示关联字段，table.js用
			function builtshow_fields_table(model,formId,ref_cfg,tagName){
				var html = "";
				if(ref_cfg && typeof ref_cfg=="string" ){
					ref_cfg=JSON.parse(ref_cfg);
				}else if(!ref_cfg){
					return "";
				}
				if(ref_cfg.show_fields){
					$(ref_cfg.show_fields).each(function(i,vo){
						var fields =builtshow_fieldsOptions(formId,vo,ref_cfg.show_fields);
						var fieldName = fields[vo];
						if(!fieldName){
							//删除表单关联的关联字段id
							ref_cfg.show_fields.remove(vo);
							model.set('ref_cfg',ref_cfg);
							return;
						}
						html += '<'+tagName+' class="list-form-ref">'+(tagName=='tr'?'<td>':'')
							+'<div class="td-name">'+fieldName+'</div>'
							+'<div class="td-input"><input type="text" readonly></div>'
							+(tagName=='tr'?'</td>':'')+'</'+tagName+'>';
					});
				}
				return html;
			}

            function rebuit_ref_cfg(field){
            	var input = field.find("[name='field[ref_cfg]']");
				var options = field.find("[name='field[options]']");
            	var ref_cfg={};
				ref_cfg["main_field"]='';
				ref_cfg["show_fields"] = [];
				ref_cfg["filter_fields"] = [];
            	input.val(JSON.stringify(ref_cfg));
            	input.change();
				options.change();
				$('#refShowField,#refFilter').empty();
            }
            
/////////////////////////////////////////// 数据源
            
            /**
             * 数据源类型change时间
             */
            function changeRef_type(t){
            	warpComponent("."+$(t).val(),".DS");
            	if($(t).val() == ""){
	          		  return false;
	          	}
            	openUrl_ds(t);
            }

            /**
             * 数据源url，检测，此url必须按《企微云平台表单流程集成开发说明书.docx》开发
             * @param t
             */
            function openUrl_ds(t){
            	
            	var dictType=$(t).parents(".field").find('.ref_url').val();
            	var ref_type=$(t).parents(".field").find('.ref_type').val();
            	if(ref_type == "" || dictType==""){
	          		  return false;
	          	}
            	
            	
            	var _id = $(t).parent().find('._id').val()
            	// "DatasourceType":DatasourceType,
            	var ref_cfg={datasource_dict:[],datasource_fields:[]};
            	
            	// 是否继续检测
            	var isContinue = true;
            	var cfgInput = $(t).parents(".field").find("[name='field[ref_cfg]']");
            /**	
            	// ACAO
            	if(dictType.toLowerCase().indexOf("https://") == 0){
            		 $.ajax({
        				    url: dictType,
        				    dataType: "json",
        				    type: "POST",	
        				    success: function( result ) {
        				    	isContinue = false;
        				    	if ('0' == result.code) {
        				    		var data = result.data;
        				    		if(data instanceof Array && data.length > 0){
        				    			var dictx = {};
        				    			for(var x in data[0]){
        				    				dictx[x]=x;
        				    				ref_cfg["datasource_dict"].push(x);
        				    			}
        				    			putDict(dictType,dictx);
        				    			ref_cfg["datasourceType"]="ACAO";
        				    			cfgInput.val(JSON.stringify(ref_cfg)).change();
        				    			appendshow_fields_ds($(t).parents(".field").next());
        				    		}else{
           				    			_alert("提示", "链接地址无效");
           				    		}
        				    	} else if(result.desc){
        							_alert("提示", "检测链接失败："+result.desc);
        						} else {
        							_alert("提示", "链接地址无效");
        						}
        				    	
        				    	
        				    	},error:function(){
        				    		_alert("提示", "链接地址不支持跨站访问");
        				    	}
        				    });
            	}
            	if(!isContinue){
            		return;
            	}
            	// JSONP
            	if(dictType.toLowerCase().indexOf("https://") == 0){
           		 $.ajax({
       				    url: dictType,
       				    dataType: "jsonp",
       				    type: "POST",	
       				    success: function( result ) {
       				    	isContinue = false;
       				    	if ('0' == result.code) {
       				    		var data = result.data;
       				    		if(data instanceof Array && data.length > 0){
       				    			var dictx = {};
       				    			for(var x in data[0]){
       				    				dictx[x]=x;
       				    				ref_cfg["datasource_dict"].push(x);
       				    			}
       				    			putDict(dictType,dictx);
       				    			ref_cfg["datasourceType"]="JSONP";
       				    			cfgInput.val(JSON.stringify(ref_cfg)).change();
       				    			appendshow_fields_ds($(t).parents(".field").next());
       				    		}else{
       				    			_alert("提示", "链接地址无效");
       				    		}
       				    	} else if(result.desc){
       							_alert("提示", "检测链接失败："+result.desc);
       						} else {
       							_alert("提示", "链接地址无效");
       						}
       				    	
       				    	
       				    	},error:function(){
    				    		_alert("提示", "链接地址无效");
    				    	}
       				    });
           	}
            	if(!isContinue){
            		return;
            	}
            	**/
            	
            	
            	// PROXY
            	var url = dictType;
            	if(dictType.indexOf("?") < 0){
            		url =dictType+"?"; 
            	}
            	url+="&corpId="+window.corpId+"&id="+_id+"&page=1&pageSize=1";
//            	if(dictType.toLowerCase().indexOf("http://") == 0){
           		 $.ajax({
       				    url: baseURL + "/open/openFormAction.action",
       				    data:{"url":url},
       				    dataType: "json",
       				    type: "POST",	
       				    success: function( data ) {
//       				    	if ('0' == result.code) {
//       				    		var data = result.data;
       				    		
       				    		if(data instanceof Array && data.length > 0){
       				    			var dictx = {};
       				    			for(var x in data[0]){
       				    				dictx[x]=x;
       				    				ref_cfg["datasource_dict"].push(x);
       				    			}
       				    			putDict(dictType,dictx);
       				    			ref_cfg["datasourceType"]="PROXY";
       				    			cfgInput.val(JSON.stringify(ref_cfg)).change();
       				    			appendshow_fields_ds($(t).parents(".field").next());
       				    		}else{
       				    			_alert("提示", "链接地址无效");
       				    		}
       				    		
//       				    	} else if(result.desc){
//       							_alert("提示", "检测链接失败："+result.desc);
//       						} else {
//       							_alert("提示", "链接地址无效");
//       						}
       				    	
       				    	
       				    	},error:function(){
    				    		_alert("提示", "链接地址无效");
    				    	}
       				    });
//           	}
           	
           	
            }
            /**
             * 数据源配置字段HTML构造
             * @param ref_cfg
             * @param dictType
             * @param _id
             * @returns {String}
             */
            function builtshow_fields_ds(ref_cfg,dictType,ref_type){
            	
            	if(!dictType){
            		//_alert("提示","请先填写链接地址");
            		return "";
            	}
            	
         	   // 不能出现
            	//if(!datasourceType[dictType]){
            	//	openUrl_ds(dictType,_id);
            	//}
            	
            	if(!dict[dictType]){
            		dict[dictType]={};
            		for(var i in ref_cfg["datasource_dict"]){
            			
            			var key = ref_cfg["datasource_dict"][i];
            			if(typeof key !="string"){
            				continue;
            			}
            			dict[dictType][key]=key;
            		}
            	}
            	
            	
         	   var html = "";
         	   if(ref_cfg && typeof ref_cfg=="string" ){
         		   ref_cfg=JSON.parse(ref_cfg);
         	   }else if(!ref_cfg){
         		   return "";
         	   }
         	   if(ref_cfg.datasource_fields) {

				   var show_fields = [];
				   var field_type = [];
				   $(ref_cfg.datasource_fields).each(function (i, vo) {
					   show_fields.push(vo.field_key);
					   field_type.push(vo.field_type);
				   });


				   $(ref_cfg.datasource_fields).each(function (i, vo) {

					   html += '<div class="data-source-item ellipsis">' + vo.field_name + ',' + vo.field_key + ',' + transferre(vo.field_type) + '</div>'

				   });
				   function transferre(type) {
					   var str = '';
					   switch (type) {
						   case 'Id' : str = '主键';break;
						   case 'IdShow' : str = '主键（显示在应用端）';break;
						   case 'MainField' : str = '主字段';break;
						   case 'ParentId' : str = '关联主键';break;
						   case 'ShowField' : str = '显示字段';break;//ParentId
						   case 'ImageField' : str = '图片';break;
					   }
						return str;
				   }
			   }
         	   return html;
            }

		/**
		 * 添加数据源配置字段
		 * @param t
		 * @returns {Boolean}
		 */
		function appendshow_fields_ds(t){
			var input = t.prev().find("[name='field[ref_cfg]']");
			var input2 = t.prev().find("[name='field[ref_url]']");
			if(input2.val()==""){
				_alert("提示","请先填写链接地址");
				return false;
			}

			if(input.val()==""){
				_alert("提示","链接地址无效");
				return false;
			}

			var ref_cfg=input.val();
			ref_cfg=JSON.parse(ref_cfg);

			ref_cfg.datasource_fields.push({field_key:"",field_type:"",field_name:""});
			input.val(JSON.stringify(ref_cfg)).change();
			t.find(".showField").html(builtshow_fields_ds(ref_cfg,input2.val(),t.prev().find(".ref_type").val()));
			//  rebuitshow_fields_ds(t);
		}


		var dict = {};
		function putDict(type,value){
			dict[type]=value;
		}
		//关联字段的代码
		function builtshow_fieldsOptions_final(vo,show_fields,dictType){
			var fields = dict[dictType];
			var html="<option value=''>请选择</option>";
			if(fields)for(var id in fields){
				if(show_fields.indexOf(id) > -1){
					if(id == vo){
						html=html.concat("<option selected='selected' value='"+id+"'>"+fields[id]+"</option>");
					}
				}
				else html=html.concat("<option value='"+id+"'>"+fields[id]+"</option>");
			}
			return html;

		}

		function builtshow_fields_final(ref_cfg,dictType){

			var html = "";
			if(ref_cfg && typeof ref_cfg=="string" ){
				ref_cfg=JSON.parse(ref_cfg);
			}else if(!ref_cfg){
				return "";
			}
			if(ref_cfg.show_fields){
				$(ref_cfg.show_fields).each(function(i,vo){


					html = html.concat('	<li class="choice">'
						+'<label class="inline" style="width:200px;display:inline-block;">'
						+'<label class="hide"></label>'
						+'<select onchange="rebuitshow_fields_final($(this).parents(\'.field\'),\''+dictType+'\')" style="width:190px;" class="show_fields input-small" >'
						+ builtshow_fieldsOptions_final(vo,ref_cfg.show_fields,dictType)
						+'</select>'
						+'        </label>'
						+'        <span class="actions">'
						+'    <a class="icon remove-small-gray prevent-default " onclick="removeShowField_final(this,\''+dictType+'\')" href="javascript:void(0)" tabindex="-1">删除</a>'
						+'  </span>'
						+'    </li>');

				});

			}
			return html;
		}



		function appendshow_fields_final(t,dictType){

			var html='	<li class="choice">'
				+'<label class="inline" style="width:200px;display:inline-block;">'
				+'<label class="hide"></label>'
				+'<select onchange="rebuitshow_fields_final($(this).parents(\'.field\'),\''+dictType+'\')" style="width:190px;" class="show_fields input-small"></select>'
				+'        </label>'
				+'        <span class="actions">'
				+'    <a class="icon remove-small-gray prevent-default " onclick="removeShowField_final(this,\''+dictType+'\')" href="javascript:void(0)" tabindex="-1">删除</a>'
				+'  </span>'
				+'    </li>';
			var li = $(html);
			$(t).find("ul").append(li);
			li.find("select").change();
		}

		function rebuitshow_fields_final(t,dictType){
			var selects = $(t).find("select");
			var show_fields=[];
			selects.each(function(i,vo){
				show_fields[show_fields.length]=this.value;
			});
			selects.each(function(i,vo){
				$(this).html(builtshow_fieldsOptions_final(this.value,show_fields,dictType));
			});

			var input = t.find("[name='field[ref_cfg]']");

			var ref_cfg={};
			ref_cfg["show_fields"]=[];
			t.find("select.show_fields").each(function(){
				ref_cfg["show_fields"].push($(this).val());
			});

			input.val(JSON.stringify(ref_cfg));
			input.change();
		}



		function removeShowField_final(t,dictType){
			var li = $(t).parents('.field');
			$(t).parents('li').remove();
			rebuitshow_fields_final(li,dictType);
		}


/**
         * -------------------------表单脚本器---------------------------
         */
        // +=归档
        var plusEqTemplateArchive='if(form["${formrefKey}"])for(var i = 0;i < form["${formrefKey}"].length;i++){\n'
		+'form["${formrefKey}"][i]["${refKey}"]+=form["${formrefKey}"][i]["${childKey}"];\n'
		+'}\n';

        // +=删除
         var plusEqTemplateDelete='if(form["${formrefKey}"])for(var i = 0;i < form["${formrefKey}"].length;i++){\n'
            +'<%if(forbidMinus){%>if(form["${formrefKey}"][i]["${refKey}"] < form["${formrefKey}"][i]["${childKey}"]){\n'
            +'	throw "回滚失败，${{formrefName}}的${{refName}}不足";\n'
            +'}<%}%>\n'
    		+'	form["${formrefKey}"][i]["${refKey}"]-=form["${formrefKey}"][i]["${childKey}"];\n'
    		+'}\n';


         // -=归档
         var minusEqTemplateArchive='if(form["${formrefKey}"])for(var i = 0;i < form["${formrefKey}"].length;i++){\n'
             +'<%if(forbidMinus){%>if(form["${formrefKey}"][i]["${refKey}"] < form["${formrefKey}"][i]["${childKey}"]){\n'
             +'throw "归档失败，${{formrefName}}的${{refName}}不足";\n'
             +'}<%}%>\n'
     		+'form["${formrefKey}"][i]["${refKey}"]-=form["${formrefKey}"][i]["${childKey}"];\n'
     		+'}\n';

 		 // -=提交验证库存
 		 var minusEqTemplateCommit='<%if(forbidMinus){%>if(form["${formrefKey}"])for(var i = 0;i < form["${formrefKey}"].length;i++){\n'
             +'if(form["${formrefKey}"][i]["${refKey}"] < form["${formrefKey}"][i]["${childKey}"]){\n'
             +'throw "提交失败，${{formrefName}}的${{refName}}不足";\n'
             +'}\n'
     		+'}\n<%}%>';

 		 // -=删除回库存
        var minusEqTemplateDelete='if(form["${formrefKey}"])for(var i = 0;i < form["${formrefKey}"].length;i++){\n'
		+'form["${formrefKey}"][i]["${refKey}"]+=form["${formrefKey}"][i]["${childKey}"];\n'
		+'}\n';
        // = 归档
         var setEqTemplateArchive='if(form["${formrefKey}"])for(var i = 0;i < form["${formrefKey}"].length;i++){\n'
     		+'form["${formrefKey}"][i]["${refKey}"]=form["${formrefKey}"][i]["${childKey}"];\n'
    		+'}\n';

         // 当前更新到push到目标的子
         // 当前更新到目标的主
         // 关联的push到当前的子
         var keys="单行文字|多行文字|下拉框|单项选择|多项选择|数字|两级下拉框|邮箱|电话|手机|省市区|日期|时间|评分|微信扫码|图片".split("|");


         function setEq2(opt){
        	 var setEqTemplateArchive2 = "var curr={};\n";
           for(var i = 0; i<keys.length;i++){
        	 if(opt[keys[i]])setEqTemplateArchive2+='curr["'+opt["表单关联_子"+keys[i]].id+'"]=form["'+opt[keys[i]].id+'"];\n';
         }

         setEqTemplateArchive2+='for(var i = 0;i < form["'+opt["表单关联"].id+'"].length;i++){\n';
         setEqTemplateArchive2+='form["'+opt["表单关联"].id+'"][i]["'+opt["表单关联_子表单"].id+'"].push(curr);\n';
         setEqTemplateArchive2+='var X={};\n';
     		  for(var i = 0; i<keys.length;i++){
     			 if(opt[keys[i]])setEqTemplateArchive2+='form["'+opt["表单关联"].id+'"][i]["'+opt["表单关联_"+keys[i]].id+'"]=form["'+opt[keys[i]].id+'"];\n';
     			if(opt[keys[i]] && opt["关"+keys[i]])setEqTemplateArchive2+='X["'+opt["子"+keys[i]].id+'"]=form["'+opt["表单关联"].id+'"][i]["'+opt["关"+keys[i]].id+'"];\n';

     		  }
         if(opt["子表单"])setEqTemplateArchive2+='form["'+opt["子表单"].id+'"].push(X);\n'
         setEqTemplateArchive2+='}\n';



        	 return setEqTemplateArchive2;
         }

        /**
         * 关联字段脚本处理[option1,option2,option3,option4...]
         *
         * @param list
         */
        function generateFormScript(list){
        	if(!list){
    			return;
    		}
        	var textarea=$("[name='tbFormControlPO.isScript']");
        	textarea.val(list.length > 0?1:0)
        	
//        	if(!window.Et){
//				loadJs(baseURL+"/js/3rd-plug/et/easy.templatejs.min.js");
//				Et.tmplSettings={
//						// 脚本表达式 开始结束标记 <% JS script %>
//						scriptBegin:"<%",
//						scriptEnd:"%>",
//						// 输出表达式开始结束标记 ${name}
//						outBegin:"${",
//						outEnd:"}",
//						// 转义输出表达式开始结束标记 ${{name}}
//						escapeOutBegin:"${{",
//						escapeOutEnd:"}}"
//					};
//			}
//
//        	var formScript={
//        			// 提交脚本
//        			"formCommit":"",
//        			// 归档脚本
//        			"formArchive":"",
//        			// 删除脚本
//        			"formDelete":""};
//
//        	$(list).each(function(i,option){
//        		switch(option.type){
//        		/**
//        		 * += plusEq
//        		 * -= minusEq
//        		 * = setEq
//        		 * option={
//        		 * "formrefKey":"表单关联key",
//        		 * "formrefName":"表单关联字段名称",
//        		 * "refKey":"被关联字段key如库存",
//        		 * "refName":"被关联字段名称",
//        		 * "childKey":"关联字段key如入库数量",
//        		 * "childName":"关联字段名称",
//        		 * "forbidMinus":"是否禁止扣成负数"}
//        		 */
//        		case "plusEq":
//        			formScript["formArchive"]=formScript["formArchive"].concat(Et.template(plusEqTemplateArchive,option));
//        			formScript["formDelete"]=formScript["formDelete"].concat(Et.template(plusEqTemplateDelete,option));
//        			break;
//        		case "minusEq":
//        			formScript["formArchive"]=formScript["formArchive"].concat(Et.template(minusEqTemplateArchive,option));
//        			formScript["formCommit"]=formScript["formCommit"].concat(Et.template(minusEqTemplateCommit,option));
//        			formScript["formDelete"]=formScript["formDelete"].concat(Et.template(minusEqTemplateDelete,option));
//        			break;
//        		case "setEq":
//        			formScript["formArchive"]=formScript["formArchive"].concat(Et.template(setEqTemplateArchive,option));
//        			break;
//        		}
//        	});
//
//        	var textarea=$("[name='formScripts']");
//        	if(textarea.length == 0){
//        		textarea = $("<textarea style=\"display:none;\" name='formScripts'></textarea>");
//        		form.append(textarea);
//        	}
//        	textarea.val(JSON.stringify(formScript));

        }
//获取关联表单的options
function get_GoldenData_options(){
	var result = [];
	$.each(GoldenData.fieldList.where({'_type':'Fields::FORMREFCustomerField'}),function(i,model){
		$.merge(result,model.get('options')||[]);
	});
	return result;
}

// 规则列表
var ruleMap = {
		"TextField":"|TextArea|RadioButton|DropDown|CascadeDropDown|NumberField|EmailField|TelephoneField|MobileField|GeoField|CityField|RatingField|ImageRadioButton|EquationField|StatisticsField|",
		"TextArea":"|TextField|RadioButton|DropDown|CascadeDropDown|NumberField|EmailField|TelephoneField|MobileField|GeoField|CityField|RatingField|ImageRadioButton|EquationField|StatisticsField|",
		"RadioButton":"|DropDown|",
		"DropDown":"|RadioButton|",
		"NumberField":"|RatingField|EquationField|StatisticsField|"
};
/**
 * 更新规则器
 * @param tar_type 目标字段类型
 * @param src_type 源字段类型
 */
function childrenSelectLogic(tar_type,src_type){
	if(tar_type == "EquationField"){
		return false;
	}
	if(tar_type == src_type){
		return true;
	}
	if(ruleMap[tar_type]){
		return ruleMap[tar_type].indexOf("|"+src_type+"|") > -1;
	}
	return false;
}