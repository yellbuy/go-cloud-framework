/**
 * editGrid 1.0
 * Created by yrm-yanh on 2015/12/6
 * email: 562848040@qq.com
 */

(function($,window){

    /* 表格外层模板 */
    var $domNodeHtml = '<div class="edit-grid" ><div>';

    /** 无数据tr模板 **/
    var gridTrHtml4NoneData = '<tr ><td>无数据</td></tr>';

    /* 表格行单元格td模板 */
    var gridRowTd='<td class="e-grid-row-cell">' +
                    '<div class="e-grid-row-cell-inner" align="center"></div>'+
                    '</td>';

    /** 基本结构模板 **/
    var gridTml=
        '<div class="e-panel-wrap">' +
            '<table class="edit-table"><thead></thead><tbody class="validationEngineContainer"></tbody><tfoot><tr></tr></tfoot></table>' +
        '</div>' +
        '<div class="e-panel-bar">' +
            '<div class="e-panel-bar-inner clearfix">' +
            '<div class="e-bar-group"><div class="e-bar-selectOption"></div></div>' +
            '<div class="e-bar-group e-bar-message"><span class="e-bar-text"></span></div>' +
            '<div class="e-bar-group e-bar-pagination"><div class="pagination" targettype="navTab"></div></div></div>' +
        '</div>';

    /* 表格翻页模板 */
    var pagination=
        '<ul>'+
            '<li class="j-first">'+
            '<a class="first" href="javascript:;"><span>首页</span></a>'+
            '<span class="first"><span>首页</span></span>'+
        '</li>'+
        '<li class="j-prev">'+
            '<a class="previous" href="javascript:;"><span>上一页</span></a>'+
            '<span class="previous"><span>上一页</span></span>'+
        '</li>#pageNumFrag#'+
        '<li class="j-next">'+
            '<a class="next" href="javascript:;"><span>下一页</span></a>'+
            '<span class="next"><span>下一页</span></span>'+
        '</li>'+
        '<li class="j-last">'+
            '<a class="last" href="javascript:;"><span>末页</span></a>'+
            '<span class="last"><span>末页</span></span>'+
        '</li>'+
        '<li class="jumpto">' +
            '<input class="textInput" type="text" size="4" value="#currentPage#" />'+
            '<a href="javascript:;" class="goto">确定</a></li>'+
        '</ul>';

    /* 表格行数据临时id */
    var KEY_NAME="eGridTmpID";

    var CMP_WIDTH_DIFF=10; //由于边距作用，用于调节实际生成控件宽度补差

    /* 控件需要解析的属性，todo 随需要再新增....
    * _class == class
    * */
    var cmpParam=["name","_class"];

    /*工具类*/
    var util={
        /* 参数解析 */
        initPluginDp:function($dom,options){
            var flitParam=["gridProps","param","cmpProps"];
            if(!options)options=[];
            var $this=$dom,
                props={};
            $.each(options,function(index,value){
                if(!$this.attr(value))return;
                props[value]=$this.attr(value);
                if($.inArray(value,flitParam)>=0){
                    try{
                        if(value=="param"){
                            props[value]=props[value].replace(new RegExp(" ","gm"),"");
                            (props[value].match("class:"))&&(props[value]=props[value].replace("class:","_class:"))
                        }
                        props[value]=eval("({"+props[value]+"})");
                    }catch (e){
                        //todo 修改对话框样式
                        alert("参数解析出错!");
                        return
                    }
                    $this.removeAttr(value);
                }
            });
            var dataProps=$this.data();
            $.extend(props,dataProps);//增加 data-属性 书写方式
            return props;
        },
        /*生成唯一id*/
        uuid:function(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        },
        /*将options属性转成对象*/
        optionsObj:function(options){
            var _options=options.split(","),
                optionsObj={}; //用"," 拆分option选项
            //var options=options.pop(options.length-1);
            $.each(_options,function(index,item){
                var value=item.split(":")[0]||"";//用":"拆分item，取得真实值/显示值(value,html);
                var html=item.split(":")[1]||"";
                optionsObj[value]=html;
            });
            return optionsObj;
        },
        /* 为控件附加属性 */
        initParam:function(cmpDiv,param){
            $.each(cmpParam,function(index,item){
                if(param[item]){
                    (item=="_class")?cmpDiv.addClass(param[item]):cmpDiv.attr(item,param[item]);
                }
            })
        }
    }

    /*表格默认设置*/
    var defaultSetting={
        widthTh:{},//存储设置自定义宽度字段
        addBtn:true, //新增行按钮
        delBtn:true, //删除按钮
        editRowObj:{},  //存储编辑行控件 dom 对象
        editRowId:'',//当前编辑行id
        editState:false,//表格是否处于编辑状态，默认false
        rowDraggable:false,//是否允许行拖拽，默认false
        rowHeight:36, //默认行高
        currentPage:1,//当前页数，默认第一页
        pageSize:10,//每页显示数量，默认10
        pageSizeOption:[10,20,30,40,50], //下拉框每页显示数量设置
        rowNumbers:true, //是否显示行序号，默认显示
        operateCol:true,//是否显示操作列，默认显示
        usePager:true,//是否显示分页，默认显示
        data: null,   //初始化数据
        /*
         新增前事件,暂时没有返回参数。需调用组件方法生成唯一id，并将数据存入id对应数据对象。
         return false 不执行表格默认新增操作；true 继续执行表格新增操作
         * */
        postParam:{
            _metaData:[], //源数据
            _condition:[], //查询条件
            _sort:[] //排序字段
        },
        handlers:{}, //自定义事件存储对象
        beforeAdd:null,
        beforeEdit:null,//编辑前事件，返回当前行数据对象。return false 不执行表格编辑操作；true 继续表格编辑操作
        beforeSave:null, //保存前事件，返回当前行数据对象。return false 不执行表格保存操作；true 继续表格保存操作
        afterSave:null, //保存后事件
        beforeDelete:null,//删除前事件，返回当前行数据对象。return false 不执行表格删除操作；true 继续表格删除操作
        afterDelete:null,//删除后事件
        beforeCancel:null, //撤销前事件，返回当前行数据对象。return false 不执行表格撤销操作；true 继续表格撤销操作
        afterReady:null //表格初始化完成回调，返回表格grid对象
    }

    /**  控件接口 **/
    var CmpInterface = function ($grid, dpProps) {}
    var cmpFn = CmpInterface.prototype;
    //默认文本框
    cmpFn["common"] = {
        component: function (obj) {
            var $inputDiv =$("<input type='text' class='textInput'/>");
            util.initParam($inputDiv,obj.param);
            $inputDiv.width(obj.cmpDiv.width()- CMP_WIDTH_DIFF);
            obj.cmpDiv.append($inputDiv);

            /** 长度限制 **/
            var $cmp = $inputDiv.find("input");
            if (obj.param.maxLength) util.maxLength($cmp, obj.param.maxLength);

            $cmp.readonly = function (flag) {
                $cmp.attr("readonly", flag);
            };
            return $cmp;
        },

        /* 设置显示文本 */
        setText: function (obj) {
            obj.contentDiv.html(obj.value).attr("title",obj.value);
        },
        /* 获取真实值 */
        getValue: function (obj) {
            return obj.contentDiv.find("input").val();
        },
        /* 设置真实值 */
        setValue: function (obj) {
            obj.contentDiv.find("input").val(obj.value);
        }
    }
    /* ============= 通用原生html控件接入 ================ */
    cmpFn["text"] = $.extend({}, cmpFn["common"]);
    cmpFn["radio"] = $.extend({}, cmpFn["common"], {
        component: function (obj) {
            var $inputDiv =$("<input type='radio' class='textInput'/>");
            util.initParam($inputDiv,obj.param);
            $inputDiv.width(obj.cmpDiv.width()- CMP_WIDTH_DIFF);
            obj.cmpDiv.append($inputDiv);
            return $inputDiv;
        },

        setText: function (obj) {
            var _radio =$("<input type='radio'  disabled='disabled' />"),
                optionsObj=util.optionsObj(obj.props.cmpProps.options);
            if (obj.value == optionsObj.check) _radio.attr("checked", "true")
            _radio.attr("name",obj.props.param.name); //增加name属性用作radio互斥
            obj.contentDiv.append(_radio);
        },
        getValue: function (obj) {
            var optionsObj=util.optionsObj(obj.props.cmpProps.options),
                _radio=obj.contentDiv.find("input");
            if(_radio[0].checked)return optionsObj.check
            return optionsObj.uncheck
        },
        setValue: function (obj) {
            var optionsObj=util.optionsObj(obj.props.cmpProps.options);
            if (obj.value == optionsObj.check) obj.cmp.attr("checked", "true")
        }
    });
    cmpFn["checkbox"] = $.extend({}, cmpFn["common"], {
        component: function (obj) {
            var $inputDiv =$("<input type='checkbox' class='textInput'/>");
            util.initParam($inputDiv,obj.param);
            $inputDiv.width(obj.cmpDiv.width() - CMP_WIDTH_DIFF);
            obj.cmpDiv.append($inputDiv);
            return $inputDiv;
        },
        setText: function (obj) {
            var _checkbox =$("<input type='checkbox'  disabled='disabled'  />"),
                optionsObj=util.optionsObj(obj.props.cmpProps.options);
            if (obj.value == optionsObj.check) _checkbox.attr("checked", "true")
            obj.contentDiv.append(_checkbox);
        },
        getValue: function (obj) {
            var optionsObj=util.optionsObj(obj.props.cmpProps.options),
                _radio=obj.contentDiv.find("input");
            if(_radio[0].checked)return optionsObj.check
            return optionsObj.uncheck
        },
        setValue: function (obj) {
            var optionsObj=util.optionsObj(obj.props.cmpProps.options);
            if (obj.value == optionsObj.check) obj.cmp.attr("checked", "true")
        }
    });
    cmpFn["select"] = $.extend({}, cmpFn["common"], {
        component: function (obj) {
            var $inputDiv =$("<select class='select'></select>");
            util.initParam($inputDiv,obj.param);
            $inputDiv.width(obj.cmpDiv.width()- CMP_WIDTH_DIFF);
            var optionsObj=util.optionsObj(obj.cmpProps.options);
            for(var i in optionsObj){
                $inputDiv.append("<option value='"+i+"'>"+optionsObj[i]+"</option>");
            }
            obj.cmpDiv.append($inputDiv);
            return $inputDiv;
        },
        setText: function (obj) {
            var optionsObj=util.optionsObj(obj.props.cmpProps.options),
                value=optionsObj[obj.value]||"";
            obj.contentDiv.html(value).attr("title",value);
        },
        getValue: function (obj) {
            return obj.contentDiv.find("select").val()
        },
        setValue: function (obj) {
            obj.cmp[0].value=obj.value;
        }
    });
    cmpFn["textarea"] = $.extend({}, cmpFn["common"], {
        component: function (obj) {
            var $inputDiv =$("<textarea class='textInput' style='height:28px;' ></textarea>");
            util.initParam($inputDiv,obj.param);
            $inputDiv.width(obj.cmpDiv.width()- CMP_WIDTH_DIFF);
            obj.cmpDiv.append($inputDiv);
            return $inputDiv;
        },
        setText: function (obj) {
            obj.contentDiv.html(obj.value).attr("title",obj.value);
        },
        getValue: function (obj) {
            return obj.contentDiv.find("textarea").val();
        },
        setValue: function (obj) {
            obj.contentDiv.find("textarea").html(obj.value);
        }
    });
    /* ============= 编辑表格定义类型 ================ */
    cmpFn["readonly"] = $.extend({}, cmpFn["common"], {
        component: function (obj) {
            var $inputDiv =$("<label></label>");
            $inputDiv.attr("name",obj.param.name);//todo
            obj.cmpDiv.append($inputDiv);
            return $inputDiv;
        },
        setText: function (obj) {
            obj.contentDiv.html(obj.value).attr("title",obj.value);
        },
        getValue: function (obj) {
            return obj.contentDiv.find("label").html();
        },
        setValue: function (obj) {
            obj.contentDiv.find("label").html(obj.value);
        }
    });
    cmpFn["operateBtn"] = $.extend({},{
        setDisplayStateBtn: function (obj) {
            var editBtn=$('<a href="#" class="a-icon a-edit" id="edit" title="编辑"/>'),
                deleteBtn=$('<a href="#" class="a-icon a-delete" id="delete" title="删除"/>');
            obj.contentDiv.empty();
            obj.contentDiv.append(editBtn);
            if(obj.props.delBtn)obj.contentDiv.append(deleteBtn)
        },
        setOperateStateBtn:function(obj){
            var saveBtn=$('<a href="#" class="a-icon a-save" id="save" title="保存"/>'),
                cancelBtn=$('<a href="#" class="a-icon a-cancel" id="cancel" title="撤销"/>'),
                deleteBtn=$('<a href="#" class="a-icon a-delete" id="delete" title="删除"/>');
            obj.contentDiv.empty();
            obj.contentDiv.append(saveBtn).append(cancelBtn).append(deleteBtn);
        }
    });
    /*============== 自定义组件接入 ================
    //控件操作对象
    * var paramObj = {
         value: "", //当前控件值
         props: prop , //列参数 prop:{param:{},cmpProps:{},text:"",width:""}
         contentDiv: contentDiv, //显示内容外层div
         cmp: cmp, //控件dom节点
         cmpDiv: cmpDiv //控件所在外层div
      };
      //控件生成时对象，主要为列参数，
      var componentObj={
        cmpDiv : //控件所在外层div
        cmpProps : //控件参数
        param : //列属性
        text :  //列名
        width : //列宽
      }
    * */
    cmpFn["duceap.date"] = $.extend({}, cmpFn["common"], {
        component: function (componentObj) {
            var props = $.extend({}, componentObj.cmpProps),
                $input =$('<input type="text" class="textInput" />'),
                width = (componentObj.width||componentObj.cmpDiv.width()) - CMP_WIDTH_DIFF ;
            util.initParam($input,componentObj.param);
            $input.width(width);
            componentObj.cmpDiv.append($input);
            return $input.dateDp(props);
        },
        setText: function (paramObj) {
            /* 将真实值20160415按控件定义是dateFmt转化为文本显示值2016-04-16 */
            var text = paramObj.cmp.text4val(paramObj.value);
            paramObj.contentDiv.html(text).attr("title",text);
        },
        /* 获取真实值 */
        getValue: function (paramObj) {
            //获取文本显示值，转为纯数字
            var value=paramObj.cmp.val().replace(/[^0-9]/ig,"");
            return value
        },
        /* 设置真实值 */
        setValue: function (paramObj) {
            paramObj.cmp.setValue(paramObj.value);
        }
    });
    cmpFn["duceap.dropDownRadio"] = $.extend({}, cmpFn["common"], {
        component: function (componentObj) {
            var width = (componentObj.width||componentObj.cmpDiv.width()) - CMP_WIDTH_DIFF,
                props = $.extend({}, componentObj.cmpProps, {name:componentObj.param.name});
            var $input =$('<input type="text" class="textInput"/>').width(width);
            util.initParam($input,componentObj.param);
            componentObj.cmpDiv.append($input);
            return $input.dropDownRadioDp(props);
        },
        setText: function (paramObj) {
            var text = paramObj.cmp.text4val(paramObj.value);
            paramObj.contentDiv.html(text).attr("title",text);
        },
        /* 获取真实值 */
        getValue: function (paramObj) {
            var text=paramObj.cmp.find(".ffb-input").val();
            return paramObj.cmp.val4text(text);
        },
        /* 设置真实值 */
        setValue: function (paramObj) {
            paramObj.cmp.setValue(paramObj.value);
        }
    });
    cmpFn["duceap.dropDownTree"] = $.extend({}, cmpFn["common"], {
        component: function (componentObj) {
            var width = (componentObj.width||componentObj.cmpDiv.width()) - CMP_WIDTH_DIFF,
                props = $.extend({}, componentObj.cmpProps, {width: width,name:componentObj.param.name});
            var $input =$('<input type="text" class="textInput"/>');
            util.initParam($input,componentObj.param);
            componentObj.cmpDiv.append($input);
            var treeObj=$input.dropDownTreeDp(props);
            treeObj.load(props);
            return treeObj
        },
        setText: function (paramObj) {
            var text = paramObj.cmp.text4val(paramObj.value);
            paramObj.contentDiv.html(text).attr("title",text);
        },
        /* 获取真实值 */
        getValue: function (paramObj) {
            var text=paramObj.cmp.find(".combo-text").val();
            return paramObj.cmp.val4text(text);
        },
        /* 设置真实值 */
        setValue: function (paramObj) {
            paramObj.cmp.setValue(paramObj.value);
        }
    });

    $.extend(CmpInterface.prototype, {
        filterProps: function (obj) {
            obj.props.cmpDiv=obj.cmpDiv;
            return obj.props;
        },
        getCmpObj: function (obj) {
            return CmpInterface.prototype[obj.param.type] || CmpInterface.prototype["common"]; //获取控件对象
        }
    });

    /*分页栏对象*/
    function PageBarObj($grid, config){
        this.$grid=$grid;
        this.config=config;
        this.pageBar=$(".e-panel-bar-inner",this.$grid); //分页栏dom节点
    }
    PageBarObj.prototype={
        /*初始化分页栏*/
        initPageBar:function(total,isUpdate){
            var _total=total||0;
            if(!isUpdate)this._initPageSelect();
            this._setPageMessage(_total);
            this._initPageGroup(_total);
        },

        /*构建分页栏 页数选择select下拉框部分*/
        _initPageSelect:function(){
            var selectPage=$(".e-bar-selectOption",this.pageBar),
                select=$("<select class='e-bar-select'></select>");
            $.each(this.config.pageSizeOption,function(index,item){
                var option=$("<option></option>");
                option.html(item);
                select.append(option);
            });
            selectPage.append(select);
        },
        /*构建分页栏信息提示部分*/
        _setPageMessage:function(total){
            var textMessage=$(".e-bar-text",this.pageBar),
                message="显示从 {{start}} 到 {{end}} ，总{{total}}条。每页显示:{{numPerPage}}";
            var start=(this.config.currentPage==1)?1:(this.config.currentPage-1)*this.config.pageSize,
                end=start+this.config.pageSize-1;
            (total<end)&&(end=total);
            (total==0)&&(start==total);
            message=message.replace("{{start}}",start).replace("{{end}}",end)
                .replace("{{total}}",total).replace("{{numPerPage}}",this.config.pageSize);
            textMessage.html(message);
        },
        /* 构建分页栏翻页部分*/
        _initPageGroup:function(total){
            var pageBar=$(".pagination",this.pageBar),
                options={currentPage:this.config.currentPage,numPerPage:this.config.pageSize,totalCount:total};
            this.opts = $.extend({
                totalCount:0,
                numPerPage:10,
                pageNumShown:10,
                currentPage:1
            }, options);
            this.initPagination(pageBar);
        },

        /* 分页栏翻页部分方法 begin */
        numPages:function() {
            return Math.ceil(this.opts.totalCount/this.opts.numPerPage);
        },
        getInterval:function(){
            var ne_half = Math.ceil(this.opts.pageNumShown/2);
            var np = this.numPages();
            var upper_limit = np - this.opts.pageNumShown;
            var start = this.getCurrentPage() > ne_half ? Math.max( Math.min(this.getCurrentPage() - ne_half, upper_limit), 0 ) : 0;
            var end = this.getCurrentPage() > ne_half ? Math.min(this.getCurrentPage()+ne_half, np) : Math.min(this.opts.pageNumShown, np);
            return {start:start+1, end:end+1};
        },
        getCurrentPage:function(){
            var currentPage = parseInt(this.opts.currentPage);
            if (isNaN(currentPage)) return 1;
            return currentPage;
        },
        hasPrev:function(){
            return this.getCurrentPage() > 1;
        },
        hasNext:function(){
            return this.getCurrentPage() < this.numPages();
        },
        initPagination:function(pageBar){
            var _pagination=this,
                setting = {
                    first$:"li.j-first", prev$:"li.j-prev", next$:"li.j-next", last$:"li.j-last", nums$:"li.j-num>a", jumpto$:"li.jumpto",
                    pageNumFrag:'<li class="#liClass#"><a href="javascript:;">#pageNum#</a></li>'
                };
            var $this = pageBar;
            var pc = _pagination;//new Pagination(options);
            var interval = pc.getInterval();

            var pageNumFrag = '';
            for (var i=interval.start; i<interval.end;i++){
                pageNumFrag += setting.pageNumFrag.replace("#pageNum#", i).replace("#liClass#", i==pc.getCurrentPage() ? 'selected j-num' : 'j-num');
            }
            $this.html(
                pagination.replace("#pageNumFrag#", pageNumFrag)
                    .replace("#currentPage#", pc.getCurrentPage())).find("li"); //.hoverClass()

            var $first = $this.find(setting.first$);
            var $prev = $this.find(setting.prev$);
            var $next = $this.find(setting.next$);
            var $last = $this.find(setting.last$);

            if (pc.hasPrev()){
                $first.add($prev).find(">span").hide();
            } else {
                $first.add($prev).addClass("disabled").find(">a").hide();
            }

            if (pc.hasNext()) {
                $next.add($last).find(">span").hide();
            } else {
                $next.add($last).addClass("disabled").find(">a").hide();
            }
        }
        /* 分页栏翻页部分方法 end */
    }

    /** 表格展示对象  **/
    var GridShowObj = function ($grid, config) {
        this.$grid = $grid;
        this.config = config;
        this.cmpIt = CmpInterface.prototype;
    }
    $.extend(GridShowObj.prototype, {
        /** 创建表结构，初始化表头和表尾 **/
        initTable: function () {
            /** 创建表基本结构 **/
            this.$grid.html(gridTml);

            /** 创建表头基本结构 **/
            this._initHeadTh();
            this._initFootTh();
        },
        /* 初始化表头 */
        _initHeadTh: function () {
            var config = this.config,
                thProps = this.config.thProps,
                tr=$("<tr></tr>"),
                th=$("<th><div align='center'></div></th>"),
                editTable=$(".edit-table",this.$grid);
            /* 首先创建序号列 */
            if(config.rowNumbers){
                var indexTh= th.clone();
                indexTh.attr("colName","e-order").addClass("e-order");
                $("div",indexTh).html("序号");
                tr.append(indexTh);
            }
            /* 创建内容列 */
            $.each(thProps, function (index, prop) {
                if(prop.param.type=="hide") return //存在隐藏列属性，不进行创建
                var _th=th.clone();
                $("div",_th).html(prop.text);
                _th.attr("colName",prop.param.name||"").addClass("e-grid-hd-cell");
                if(prop.width){_th.css("width",prop.width);}
                tr.append(_th);
            });
            /*添加默认操作列*/
            if(config.operateCol){
                var operateTh=th.clone();
                operateTh.attr("colName","e-operateCol").css("width",80);
                if(config.addBtn){
                    var addBtn=$("<a href='#' class='a-icon a-add imgAdd' id='add' title='增加'/></a>");
                    $("div",operateTh).append(addBtn);
                }
                tr.append(operateTh);
            }
            $("thead",editTable).append(tr);
            $.each($("th",tr),function(index,item){
                $(item).css("width",$(item).width());
            })
        },
        /* 初始化表尾 */
        _initFootTh: function () {
            var thProps = this.config.thProps,
                tableFooter = this.$grid.find("tfoot tr"),
                tableHeader=$("thead",this.grid),
                td=$("<td><div align='center' class='e-edit-row' ></div></td>");
            tableFooter.hide();
            $.each(thProps, function (index, prop) {
                if(prop.param.type=="hide") return //存在隐藏列属性，不进行创建
                var headerTd=$("[colName='"+prop.param.name+"']",tableHeader),
                    _td=td.clone();
                $("div",_td).css("width",headerTd.width()).attr("name",prop.param.name);
                tableFooter.append(_td);
            });

        },

        /* 展示指定数组对象表格行数据 */
        showRows: function (data) {
            var _this = this;
            $("tbody tr",this.$grid).remove();
            this.$grid.find("tbody>tr").remove();

            /**  无数据 **/
            if (data.length <= 0) {
                _this.showRow4NoneData();
                return
            }
            $.each(data, function (index, rowData) {
                _this.showRow(index,rowData);
            });
        },
        /* 无数据显示 */
        showRow4NoneData: function () {
            var tr = $(gridTrHtml4NoneData);
            $("td",tr).attr("colspan", $("thead th",this.$grid).length);
            this.$grid.find("tbody").append(tr);
        },
        /* 显示指定行数据 */
        showRow: function (index,rowData) {
            var _this = this,
                thProps = this.config.thProps,
                tr=$('<tr id='+rowData[KEY_NAME]+'></tr>'),
                $foot = this.$grid.find("tfoot"),
                cmpMap = $foot.data("cmpMap") || {};
            //隔行变色
            if(index%2!=0)tr.addClass("e-row-bg")
            /* 创建序号字段 */
            if(_this.config.rowNumbers){
                var orderTd=$(gridRowTd).clone();
                orderTd.addClass("e-order");
                $(".e-grid-row-cell-inner",orderTd).html(index+1);
                tr.append(orderTd);
            }
            /* 创建内容字段
            * 通过控件自身setText方法，设置显示文本。
            * 解决下拉框、下拉树等自定义组件塞值 显示值/真实值 需要相互转换的问题
            * */
            $.each(thProps, function (index, prop) {
                if(prop.param.type=="hide") return
                var td=$(gridRowTd).clone();
                $("div",td).attr({"name":prop.param.name})
                    .css("width",$("[colname='"+prop.param.name+"']",_this.$grid).width());
                tr.append(td);
                var paramObj = {
                    value: rowData[prop.param.name],
                    props: prop ,
                    contentDiv: $("div",td),
                    cmp: cmpMap[prop.param.name]
                };
                var cmpObj = _this.cmpIt.getCmpObj(prop); //获取控件对象
                cmpObj.setText(paramObj);

            });
            /* 创建操作列字段 */
            if(_this.config.operateCol){
                var td=$('<td name="operateCell" class="e-grid-row-operate-cell">' +
                        '<div class="e-grid-row-cell-inner"></div></td>');
                var colWidth=$(".e-grid-hd-operate-cell",this.$grid).outerWidth();
                td.width(colWidth);
                var paramObj = {
                    props: _this.config ,
                    contentDiv: $("div",td)
                };
                var cmpObj = _this.cmpIt["operateBtn"]; //获取控件对象
                cmpObj.setDisplayStateBtn(paramObj);
                tr.append(td);
            }
            $("tbody",this.$grid).append(tr);
        }

    });

    /** 编辑行对象  **/
    var EditRowObj = function ($grid, config) {
        this.$grid = $grid; //表格控件根节点
        this.config = config; //表格控件属性
        this.cmpMap = {};  //字段名和控件对象的键值对
        this.cmpInterface = CmpInterface.prototype;
    }
    $.extend(EditRowObj.prototype, {
        /*初始化编辑行控件*/
        initComponent: function () {
            var thProps = this.config.thProps,
                tfoot = this.$grid.find("tfoot"),
                _this = this;

            $.each(thProps, function (index, prop) {
                if(prop.param.type=="hide") return //存在隐藏列属性，不进行创建
                var $div =$("div[name='" + prop.param.name + "']",tfoot);
                var paramObj = _this.cmpInterface.filterProps({cmpDiv: $div, props: prop});//参数组装
                var cmpObj = _this.cmpInterface.getCmpObj(paramObj); //获取控件对象
                var component = cmpObj.component(paramObj); //初始化控件对象
                _this.cmpMap[prop.param.name] = component;
            });
            tfoot.data("cmpMap", _this.cmpMap);
        },
        /* 隐藏编辑行*/
        hideComponent: function () {
            if(!this.config.editState)return
            var editRow=$("tbody #"+this.config.editRowId,this.$grid),
                componentDivs=$("tfoot .e-edit-row",this.$grid); //编辑行 控件div
            $.each(componentDivs,function(index,item){
                var componentName=$(item).attr("name"),
                    contentDiv=$(".e-grid-row-cell-inner[name='"+componentName+"']",editRow);
                //将单元格内控件替换回原始编辑行中
                $(item).empty();
                $(item).append(contentDiv.children());
            });
            if(this.config.operateCol){
                var paramObj = {
                    props: this.config ,
                    contentDiv: $(".e-grid-row-operate-cell div",editRow)
                };
                var cmpObj = this.cmpInterface["operateBtn"]; //获取控件对象
                cmpObj.setDisplayStateBtn(paramObj);
            }
            //this.setValue(this.config.editRowId,{});
            this.config.editRowId="";//更新当前编辑行id
            this.config.editState=false;//更新表格编辑状态
        },
        /*显示指定编辑行*/
        showComponent: function (id) {
            var componentDivs=$("tfoot .e-edit-row",this.$grid), //编辑行 控件div
                contentRow=$("tbody #"+id,this.$grid); // 显示div内容行

            $.each(componentDivs,function(index,item){
                var componentName=$(item).attr("name"),
                    contentDiv=$(".e-grid-row-cell-inner[name='"+componentName+"']",contentRow);
                //将编辑行中控件替换到对应内容单元格
                contentDiv.empty();
                contentDiv.append($(item).children());
            });
            if(this.config.operateCol){
                var paramObj = {
                    props: this.config ,
                    contentDiv: $(".e-grid-row-operate-cell div",contentRow)
                };
                var cmpObj = this.cmpInterface["operateBtn"]; //获取控件对象
                cmpObj.setOperateStateBtn(paramObj);
            }
            this.config.editRowId=id;//更新当前编辑行id
            this.config.editState=true;//更新表格编辑状态
        },
        /*给指定编辑行塞值*/
        setValue: function (id, rowData) {
            var _this = this,
                thProps = this.config.thProps,
                tr=$("tbody tr#"+id,this.$grid); // 显示div内容行
            $.each(thProps, function (index, prop) {
                if(prop.param.type=="hide") return
                var contentDiv = tr.find("div[name='" + prop.param.name + "']");
                var paramObj = {
                    value: rowData[prop.param.name]||"",
                    props: prop ,
                    contentDiv: contentDiv,
                    cmp: _this.cmpMap[prop.param.name]
                };
                var cmpObj = _this.cmpInterface.getCmpObj(prop); //获取控件对象
                cmpObj.setValue(paramObj);
            });
        },
        /*获取指定编辑行数据*/
        getValue: function (id) {
            var _this = this,
                thProps = this.config.thProps,
                editRow = $("tbody tr#" + id,this.$grid),
                rowData = {};
            $.each(thProps, function (index, prop) {
                if(prop.param.type=="hide")return //存在隐藏列属性，不进行创建
                var name = prop.param.name,
                    contentDiv = editRow.find("div[name='" + name + "']"),
                    paramObj = {
                        props: prop ,
                        contentDiv: contentDiv,
                        cmp: _this.cmpMap[prop.param.name]
                    },
                    cmpObj = _this.cmpInterface.getCmpObj(prop); //获取控件对象
                rowData[name] = cmpObj.getValue(paramObj);
            });
            return rowData;
        },
        /* 编辑行验证 */
        validateForm: function () {
            var $form =$("tbody",this.$grid);
            //第一次验证时进行初始化
            if (!$form.attr("validate")) {
                $form.validationEngine("attach",{
                    promptPosition: 'topRight',
                    scroll: false
                });
                $form.attr("validate", true);
            }
            if (!$form.validationEngine("validate")) return false;
            return true;
        },
        /* todo 获取编辑行控件对象 */
        getCmpObj: function () {
            return this.$grid.find("tfoot").data("cmpMap");
        }
    });

    /** 表格数据对象 **/
    var GridDataObj = function ($grid, config) {
        this.$grid = $grid;
        this.config = config;
        this.loadParam={
            url:config.url,
            postParam:[
                {name:"_condition",value:JSON.stringify(config.postParam._condition)},
                {name:"_metadata",value:JSON.stringify(config.postParam._metaData)},
                {name:"_sort",value:JSON.stringify(config.postParam._sort)}
            ],
            callback:config.callback
        }
        $.extend(this.config, {
            dataMap: {}, //表格数据对象
            dataKeys: [] //表格数据对象映射数组
        });
    }
    $.extend(GridDataObj.prototype, {

        /* 数据加载 */
        load: function (url, param, callback) {
            /** 根据参数类型，来确定参数，覆盖之前的参数 **/
            var loadParam = {};
            $.each(arguments, function (index, item) {
                if ($.isFunction(item))loadParam["callback"] = item;
                if (typeof  item == "string")loadParam["url"] = item;
                if (typeof  item == "object")loadParam["postParam"] = item;
            });
            $.extend(this.loadParam, loadParam);
            if (!this.loadParam.url) {
                this._createDataStore(this.config.data||[]);
                this.onChange();
                return;
            }
            var _this = this;
            $.post(this.loadParam.url, this.loadParam.postParam, function (data) {
                _this._createDataStore(data.result);
                _this.onChange();
                _this.loadParam.callback && _this.loadParam.callback(_this.getView(), this);
            }, "json");
        },
        /* 获取当前显示的数据*/
        getView: function () {
            var viewData = [],
                start=(this.config.currentPage-1)*this.config.pageSize,
                end=start+this.config.pageSize,
                keys = this.dataKeys.slice(start, end),
                dataMap = this.dataMap;
            $.each(keys, function (index, key) {
                dataMap[key][KEY_NAME] = key;
                viewData.push(dataMap[key]);
            });
            return viewData;
        },
        /* 获取表格数据 */
        getData: function () {
            var viewData = [];
            var dataMap = this.dataMap;
            $.each(this.dataKeys, function (index, key) {
                var dataTemp = $.extend({},dataMap[key]);
                delete dataTemp[KEY_NAME];
                viewData.push(dataTemp);
            });
            return viewData;
        },
        /* 数据改变方法 */
        onChange: function () {
            $(".edit-table",this.$grid).trigger("viewChange", [this.getView(), this]);
        },
        /* 刷新 */
        refresh: function () { this.onChange();},
        /* 创建数据缓存 */
        _createDataStore: function (data, postParam) {
            var _this = this;
            _this.dataMap = {};
            _this.dataKeys = [];
            $.each(data, function (index, item) {
                var temId="e-temId-"+util.uuid(6,16); //生成临时数据id对应唯一对象
                _this.dataMap[temId] = item;
                _this.dataKeys.push(temId);
            });
            this.recordCount = _this.dataKeys.length;
        },
        /* 唯一值数据,目前用于处理radio互斥 */
        _uniqueData: function (id, rowData) {
            var _this = this;
            $.each(this.config.uniqueObjects, function (index, obj) {
                if (rowData[obj.name] != obj.check)return;//当前行没有选择，则不执行
                /** 其他没选择的行重置为没选择的值 **/
                for (var key in _this.dataMap) {
                    var rowDataTemp = _this.dataMap[key];
                    if (key == id)continue;
                    rowDataTemp[obj.name] = obj.uncheck;
                }
            })

        },
        /* 获取行数据 */
        getRow: function (key) {
            return {key: key, value: this.dataMap[key]};
        },
        /* 更新行数据 */
        updateRow: function (rowData, key) {
            $.extend(this.dataMap[key], rowData);
            this._uniqueData(key, rowData);
            this.onChange();
            return {key: key, value: rowData};
        },
        /* 新增行 todo 数据插入，始终在首位 */
        addRow: function (rowData) {
            var key="e-temId-"+util.uuid(6,16);
            this.dataMap[key] = rowData;
            this.dataKeys.unshift(key);
            this.onChange();
            return {key: key, value: rowData};
        },
        /* 删除行 */
        deleteRow: function (key) {
            delete this.dataMap[key];
            for (var i = 0; i < this.dataKeys.length; i++) {
                if (this.dataKeys[i] != key)continue;
                this.dataKeys.splice(i, 1);
                break;
            }
            this.onChange();
        },

        /** 分页 **/
        goTo: function (pageNumber) {
            this.config.currentPage=pageNumber;
            this.onChange();
        },
        next: function () {
            this.goTo(this.config.currentPage + 1);
        },
        previous: function () {
            this.goTo(this.config.currentPage - 1);
        },
        first: function () {
            this.goTo(1);
        },
        last: function () {
            var pageCount=parseInt(this.config.dataKeys.length/this.config.pageSize);
            if(this.config.dataKeys.length%this.config.pageSize!=0)pageCount+=1
            this.goTo(pageCount);
        },
        changePageSize: function (pageSize) {
            this.config.pageSize = pageSize;
            this.onChange();
        },
        /* 拖动完成，更新当前数据在数据数组dataKeys中索引 */
        changeIndex: function (id, index) {
            var oldIndex=this.dataKeys.indexOf(id),
                currentIndex=index,//当前行拖动完成序列索引
                newIndex=0;
            newIndex=(this.config.currentPage==1)?currentIndex:((this.config.currentPage-1)*this.config.pageSize+currentIndex);
            if(oldIndex==newIndex) return
            /* 先删除旧索引处元素，再往新索引处插入该元素 */
            else if(oldIndex>newIndex){
                this.dataKeys.splice(oldIndex,1);
                this.dataKeys.splice(newIndex+1,0,id);
            }
            /* 先往新索引处插入该元素，再删除旧索引处元素 */
            else{
                this.dataKeys.splice(newIndex+1,0,id);
                this.dataKeys.splice(oldIndex,1);
            };
            this.onChange();
        }
    });

    /** 拖动改变顺序 **/
    var DragRender = function ($grid, config) {
        this.$grid = $grid;
        this.config = config;
    }
    $.extend(DragRender.prototype, {
        bindRowDrag: function (callback) {
            var tbody=$(".edit-table tbody",this.$grid);
            tbody.dragsort({
                dragSelector: "td.e-order",
                dragBetween: false,
                placeHolderTemplate: "<tr></tr>",
                dragSelectorExclude: "input, textarea, select",
                scrollContainer:".edit-table tbody",
                dragEnd: function () {
                    callback && callback({id: this.attr("id"), index: this.index(), tr:this});
                }
            });
        }
    });

    /** 编辑表格主类  **/
    var EditGrid = function ($grid,gridProps) {
        /** 表格外部传参数 **/
        var outerProps = util.initPluginDp($grid,["name","gridProps"]);
        this.outerProps = $.extend({}, defaultSetting, outerProps);
        gridProps&&($.extend(true,this.outerProps, {gridProps:gridProps}))
        /** 表格列外部传参数 **/
        this.outerProps.thProps = this.initThProps($grid);

        /** 外部参数转内部参数 **/
        this.innerProps = this.outerProps2innerProps(this.outerProps);
        /** table替换为div **/
        this.$grid = $($domNodeHtml);
        $grid.replaceWith(this.$grid);

        this.gridRender = new GridShowObj(this.$grid, this.innerProps);
        this.editRender = new EditRowObj(this.$grid, this.innerProps);
        this.dataStore = new GridDataObj(this.$grid, this.innerProps);
        this.dragRender = new DragRender(this.$grid, this.innerProps);
    }
    $.extend(EditGrid.prototype, {

        /** 对象入口函数**/
        main: function (callback) {
            this.initStruct();//（1）创建html基本结构
            this.bindEvent();//（2）绑定事件，回调外部接口
            this.requestData();//（3）初始化请求数据
            this.afterInit();//（4）渲染后执行
            callback&&callback(this);
            return this.$grid;
        },

        /* 初始化表格列参数 */
        initThProps: function ($grid) {
            var thProps = [],
                uniqueObjects = [];
            $grid.find("thead th").each(function (index, th) {
                var thProp = util.initPluginDp($(th),["param", "cmpProps", "width" ]);
                thProp.text = $(th).html();
                thProps.push(thProp);
                if (thProp.param.type == "radio") {
                    var uniqueObj = {
                        name: thProp.param.name,
                        options:util.optionsObj(thProp.cmpProps.options)
                    };
                    uniqueObjects.push(uniqueObj);
                }
            });
            this.outerProps.uniqueObjects = uniqueObjects;
            return thProps;
        },

        /** 外部参数统一转化为 内部可使用的参数  **/
        outerProps2innerProps: function (outerProps) {
            var postParam=["_condition","_sort"],
                innerProps = {},
                gridProps =outerProps.gridProps;
            delete outerProps.gridProps
            $.each(postParam,function(index,item){
                if(gridProps[item]){
                    outerProps.postParam[item]=JSON.stringify(gridProps[item]);
                    delete gridProps[item]
                }
            })
            $.each(outerProps.thProps,function(index,thProp){
                outerProps.postParam._metaData.push({"name":thProp.param.name,"displayName":thProp.text});
            });
            innerProps= $.extend(outerProps,gridProps);
            return innerProps;
        },

        /** 初始化控件渲染的html结构 **/
        initStruct: function () {
            this.$grid.attr("name", this.innerProps.name); //把未渲染前table的name值移到现在div上
            this.gridRender.initTable();  //创建表的基本结构
            this.editRender.initComponent(); //创建编辑控件
            //创建分页栏
            if(this.innerProps.usePager){
                this.pageBarRender = new PageBarObj(this.$grid, this.innerProps);
                this.pageBarRender.initPageBar();
            }
        },

        /*初始化上传事件*/
        bindEvent: function () {
            var _this = this,
                editTable=$(".edit-table",this.$grid),
                pageBar=$(".e-panel-bar",this.$grid);
            /** 表格展示：改变dataStore的分页和数据信息，触发显示事件，通过监听显示事件，调用进行显示 **/
            editTable.on("viewChange", function (event, pageData, data) {
                if (_this.innerProps.usePager)_this.pageBarRender.initPageBar(data.dataKeys.length,true);//更新分页信息
                _this.gridRender.showRows(pageData);
            });

            /** 表格分页：通过捕获分页按钮的事件，隐藏编辑框，改变dataStore的分页数据，触发显示事件 **/
            pageBar.on("click","a", function (event, data, pageData) {
                var type = "",
                    tar = event.target.tagName.toLowerCase();
                switch (tar) {
                    case "span":
                        var _target=$(event.target).closest("a",pageBar);
                        type=_target.attr("class");
                        break;
                    case "a": type=$(event.target).attr("class"); break;
                    default :break;
                }
                switch (type) {
                    case "first":
                    {
                        _this.dataStore.first();//首页
                        break;
                    }
                    case "previous":
                    {
                        _this.dataStore.previous();//上一页
                        break;
                    }
                    case "next":
                    {
                        _this.dataStore.next();//下一页
                        break;
                    }
                    case "last":
                    {
                        _this.dataStore.last();//末页
                        break;
                    }
                    case "goto":
                    {
                        //确定按钮，指定页数跳转
                        var inputPage = $(event.target).siblings().val();
                        inputPage = parseInt(inputPage);
                        _this.dataStore.goTo(inputPage);
                        break;
                    }
                    default :break;
                }
            });

            $("select.e-bar-select",pageBar).on("change",function(){
                _this.dataStore.changePageSize(parseInt(this.value));
            })

            /** 编辑表格：增、删、改、保存、取消 **/
            editTable.on("click", "table a", function (event, data, pageData) {
                var $target = $(event.target),
                    id = $target.closest("tr").attr("id");
                switch (event.target.id){
                    case "add":_this._addRow();break;
                    case "edit":_this._editRow(id);break;
                    case "save": _this._saveRow(id);break;
                    case "delete" :{
                        //todo 修改对话框样式
                        if(confirm("确定删除？")){
                            _this._deleteRow(id);
                        }
                        break;
                    }
                    case "cancel":_this._cancelRow(id);break;
                    default :break;
                }
            });

            /* 表格双击编辑事件 */
            editTable.on("dblclick",function(event){
                if(!_this.innerProps.operateCol) return
                var _target=$(event.target).closest("tr"),
                    id = _target.attr("id");
                //存在编辑行，先对编辑行进行保存
                if(_this.innerProps.editState){
                    var isSave = _this._saveRow(_this.innerProps.editRowId);
                    if(!isSave) return
                }
                _this._editRow(id);
            });

            /* 自定义回调事件绑定 */
            var eventArray=["beforeAdd","beforeEdit","beforeSave","afterSave",
                            "beforeDelete","afterDelete","beforeCancel","afterReady"];
            $.each(eventArray,function(index,item){
                _this.innerProps[item]&&this.on(item,this.innerProps[item]);
            })

            /** 表格大小改变响应  **/
            $(window).on("resize", function (event) {
                //todo
            });
        },

        /** 根据业务id和业务类型，向后台请求数据 **/
        requestData: function () {
            this.gridRender.showRow4NoneData();
            this.dataStore.load();
        },

        /* 初始化完成操作 */
        afterInit: function () {
            /** 获取数据时调用的接口 **/
            this.$grid.data("editGrid", this.$grid);
            this.$grid.dataObj = this.dataStore;

            /** 设置拖动行 **/
            this.innerProps.rowDraggable && this._bindRowDrag();
        },

        /* 绑定行拖拽效果 */
        _bindRowDrag: function () {
            var _this=this;
            var callback = function (obj) {
                //存在编辑行，先对编辑行进行保存
                if(_this.innerProps.editState){
                    var isSave = _this._saveRow(_this.innerProps.editRowId);
                    if(!isSave) return
                }
                _this.dataStore.changeIndex(obj.id, obj.index);
            }
            this.dragRender.bindRowDrag(callback);
        },

        /* 编辑行 */
        _editRow: function (id) {
            var rowMap = this.dataStore.getRow(id);
            /** （0）编辑前 **/
            if(!this.fire("beforeEdit",rowMap)) return;
            //存在编辑行，先对编辑行进行保存
            if(this.innerProps.editState){
                var isSave = this._saveRow(this.innerProps.editRowId);
                if(!isSave) return
            }
            /** （3）显示行组件 **/
            this.editRender.showComponent(id);
            /** （4）为行组件塞值 **/
            this.editRender.setValue(id, rowMap.value);
        },
        /*删除行*/
        _deleteRow: function (id) {
            if(this.innerProps.editState){
                var isSave = this._saveRow(this.innerProps.editRowId);
                if(!isSave) return
            }
            if(!this.fire("beforeDelete",this.dataStore.getRow(id).value)) return;
            /** 从前端缓存中删除数据 **/
            this.dataStore.deleteRow(id);
            if(!this.fire("afterDelete",this.dataStore.getRow(id).value)) return;
        },
        /*保存行*/
        _saveRow: function (id) {
            if (!id)id = this.innerProps.editRowId;
            /** （1）验证是否通过 **/
            if (!this.editRender.validateForm())return false;
            /** （2）获取行控件数据 **/
            var rowData = this.editRender.getValue(id);
            if(!this.fire("beforeSave",rowData)) return false;
            /** （3）隐藏组件 **/
            this.editRender.hideComponent();
            /** （4）更新缓存数据 **/
            this.dataStore.updateRow(rowData, id);
            if(!this.fire("afterSave",rowData)) return false;

            return true;
        },
        /*取消行编辑*/
        _cancelRow: function (id) {
            /** （1）取数据回塞 **/
            var rowMap = this.dataStore.getRow(id);
            this.editRender.setValue(id, rowMap.value);
            /** （2）验证 **/
            if (!this.editRender.validateForm())return false;
            if(!this.fire("beforeCancel",rowMap.value)) return false;
            /** （3）隐藏组件 **/
            this.editRender.hideComponent();
            /** （4）刷新 **/
            this.dataStore.refresh();
        },
        /*新增行*/
        _addRow: function () {
            /** （0）添加前 **/
            if(!this.fire("beforeAdd")) return;
            /** 编辑状态，先保存当前编辑行 **/
            if(this.innerProps.editState){
                var isSave = this._saveRow(this.innerProps.editRowId);
                if(!isSave) return
            }

            /** （3）新增数据 **/
            var rowMap = this.dataStore.addRow({});
            /** （4）显示行组件 **/
            this.editRender.showComponent(rowMap.key);
            /** （5）为行组件塞值 **/
            this.editRender.setValue(rowMap.key, rowMap.value);
        },

        /* 自定义事件绑定 */
        on:function(type,handler){
            if(typeof this.innerProps.handlers[type]=="undefined"){
                this.innerProps.handlers[type]=[];
            }
            this.innerProps.handlers[type].push(handler);
        },

        /* 自定义事件触发 */
        fire:function(type,data){
            var isContinue;
            if(this.innerProps.handlers[type] instanceof Array){
                var handlers=this.innerProps.handlers[type];
                $.each(handlers,function(){
                    isContinue=this(data);
                })
            }else{
                isContinue=true;
            }
            return isContinue;
        },

        /*控件销毁方法*/
        destroy:function(){
            this.handlers={};//清空事件
        }
    });

    /* 编辑表格入口函数 */
    $.fn.editGrid=function(gridProps){
        var $grid=this;
        var editGrid= new EditGrid($grid,gridProps);
        editGrid.main(function(gridObj){
            addReturnFn(gridObj);
        });
        return editGrid.$grid;
    }

    /* 增加返回函数,供外部调用 */
    var addReturnFn=function (editGrid) {
        var _this = editGrid;
        _this.$grid.load = function (param, url, callBack) {
            _this.editRender.hideComponent();
            _this.dataStore.load(param, url, callBack);
        };
        /* 新增行
         * rowData：行数据对象
         * rowData={"name1":"xx","name2":"xx2"}
          * */
        _this.$grid.addRow = function (rowData) {
            _this.dataStore.addRow(rowData);
        };
        /* 更新行数据，
        * rowData：行数据对象,id：数据对应id,即tr的id (e-temId-xxxxxx)
        * rowData={"name1":"xx","name2":"xx2"} id:"e-temId-16984A"
        * */
        _this.$grid.updateRow = function (rowData, id) {
            _this.dataStore.updateRow(rowData, id);
        };
        /* 获取行数据
         * id：数据对应id,即tr的id (e-temId-xxxxxx)
          * */
        _this.$grid.getRowData = function (id) {
            return _this.dataStore.getRow(id);
        };
        /* 获取表格数据 */
        _this.$grid.getData = function () {
            return _this.dataStore.getData();
        };
        /* 删除一行
         * id：数据对应id,即tr的id (e-temId-xxxxxx)
          * */
        _this.$grid.deleteRow = function (id) {
            return _this.dataStore.deleteRow(id);
        };
        _this.$grid.getCmp = function() {
            return _this.editRender.cmpMap;
        }
    }

})(jQuery,window);