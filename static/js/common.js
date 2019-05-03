String.prototype.trim = function (char, type) {
  if (char) {
    if (type == 'left') {
      return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
    } else if (type == 'right') {
      return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
    }
    return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
  }
  return this.replace(/^\s+|\s+$/g, '');
};
if(typeof Array.prototype.forEach != 'function'){
    Array.prototype.forEach = function(callback){
        for(var i=0;i<this.length;i++){
            callback.apply(this,[this[i],i,this]);
        }
    };
}
String.prototype.toText = function (html) {
  if(!html){
    return "";
  }
  html = html.replace(/<[^>]+>/g,"");
  return html;
};
function formatFileSize(size){
  var val=0;
  if(size<1024){
    return size + ' B';
  }
  if(size < 1024*1024){
    val = size/1024;
    return val.toFixed(3) + ' K';
  }
  val = size/1024/1024;
  return val.toFixed(3) + ' M';
}
var articleLogEnum = {
  opt_type:{view:1,like:2,collect:3,join:10,comment:100},
  comment_type:{for_article:0,for_user:1,for_comment:2}
}
function isInt(inputData) {
  // isNaN(inputData)不能判断空串或一个空格
  // 如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
  if (parseInt(inputData).toString() == 'NaN') {
    // alert(“请输入数字……”);
    return false;
  } else {
    return true;
  }
}

function isFloat(inputData) {
  // isNaN(inputData)不能判断空串或一个空格
  // 如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
  if (parseFloat(inputData).toString() == 'NaN') {
    // alert(“请输入数字……”);
    return false;
  } else {
    return true;
  }
}
function getSubStr(s, l) {
  var i = 0, len = 0;
  for (i; i < s.length; i++) {
    if (s.charAt(i).match(/[^\x00-\xff]/g) != null) {
      len += 2;
    } else {
      len++;
    }
    if (len > l) { break }
  } return s.substr(0, i);
};
// 格式化时间
function filterTime(val) {
  if (val < 10) {
    return '0' + val;
  } else {
    return val;
  }
}


function initTable(table, options) {
  var defoptions = {
    cellMinWidth: 95,
    even: true,
    request: {
      pageName: 'page', // 页码的参数名称，默认：page
      limitName: 'limit' // 每页数据量的参数名，默认：limit
    },
    response: {
      statusName: 'errcode', // 数据状态的字段名称，默认：code
      msgName: 'errmsg', // 状态信息的字段名称，默认：msg
      countName: 'count' // 数据总数的字段名称，默认：count
    },
    limit: 30,
    limits: [10, 20, 30, 40, 50]
  };
  var tb = table.render($.extend({}, defoptions, options));
  return tb;
}

layui.use(['form', 'layer',"jquery"], function() {
  var form = layui.form;
  var layer = layui.layer;
  var $=layui.jquery;
    
  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  form.on('submit(ajax-form-submit)', function(data) {
    // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
    // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
    // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
    var that = data.elem;
    var form = data.form;
    var target = $(that).attr('href') || $(that).attr('url');
    if (!target) {
      target = form.action;
    }

    var nead_confirm = $(that).hasClass('confirm');
    if (target) {
      if ($(that).hasClass('confirm')) {
        layer.confirm('确认要执行该操作吗?', {icon: 3, title: '温馨提示'}, function(index) {
          layer.close(index);
          submitData(that,layer, target, data.field);
        });
      } else {
        submitData(that,layer, target, data.field);
      }
    }
    return false;
  });
});

// ajax post 提交表单
/**
 *
 *
 */
function submitData(that, layer, target, data) {
  $(that).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
  var index = layer.msg('数据提交中，请稍候...', {icon: 16, time: false, shade: 0.8});
  $.post(target, data).success(function(res) {
    layer.close(index);
    $(that).removeClass('disabled').prop('disabled', false);
    if (res.status == 0) {
      layer.msg('操作成功！');
      // parent.layer.closeAll("iframe");
      if (res.data.url) {
        location.href = res.data.url;
      } else {
        location.reload();
      }
    } else if (res.status == 1001) {
      for (var key in res.message) { return layer.alert(res.message[key]) }
    } else {
      layer.alert(res.message);
    }
  }).error(function(xhr, errorText, errorType) {
    $(that).removeClass('disabled').prop('disabled', false);
    layer.alert('网络状况不佳，请稍后重试。', {icon: 5, title: '温馨提示'});
  });
}
// ajax get 加载对话框
/**
 *
 *
 */
function loadDialog(url, query, options, isFull) {
  // var layer = parent.layer === undefined ? layui.layer : parent.layer;
  var opts = $.extend({
    title: '窗口',
    type: 1,
    area: ['90%', '90%'],
    maxmin: true,
    success: function(layero, index) {
      
    }}, options);
  $.get(url, query, function(html) {
    opts.content = html;
    var index = layui.layer.open(opts);
    if (isFull) {
      layui.layer.full(index);
      // 改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
      $(window).on('resize', function() {
        layui.layer.full(index);
      });
    }
  });
}

// ajax get 加载对话框
/**
 *
 *
 */
function loadIframeDialog(url, options, isFull) {
  var layer = layui.layer;
  var opts = $.extend({
    title: '窗口',
    content: url,
    type: 2,
    area: ['90%', '90%'],
    maxmin: true,
    success: function(layero, index) {
      setTimeout(function() {
        layui.layer.tips('请点击此处关闭返回', '.layui-layer-setwin .layui-layer-close', {
          tips: 3
        });
      }, 500);
    }}, options);
  var index = layer.open(opts);
  if (isFull) {
    layer.full(index);
    // 改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
    $(window).on('resize', function() {
      layer.full(index);
    });
  }
}

// 删除数据，单条或多条
function delData(url, data, success) {
  data = data || {};
  layer.confirm('数据删除后将不可再恢复，您确定要执行删除吗？', {icon: 3, title: '操作确认'}, function(index) {
    layer.close(index);
    $.post(url, data, function(data, status) {
      if (status = 'success' && data.status == 0) {
        if (success) {
          success(data, status);
        }
      } else {
        top.layer.alert(data.message, {icon: 5, title: '温馨提示'});
      }
    });
  });
}

// 批量选中的删除
function delCheckedData(url, tableId, filter, success) {
  layui.use(['table'], function() {
    var table = layui.table;
    if (success === undefined) {
      success = filter;
      filter = undefined;
    }
    var checkStatus = table.checkStatus(tableId),
      rowData = checkStatus.data,
      ids = [];
    if (rowData.length > 0) {
      for (var i in rowData) {
        if (filter) {
          var val = filter(rowData[i]);
          if (!val) {
            ids.push(val);
          }
        } else {
          ids.push(rowData[i].Id);
        }
      }
      delData(url, {ids: ids}, function(data, status) {
        if (success) {
          success(data, status);
        }
      });
    } else {
      layer.msg('请选择需要删除的记录', {icon: 3, title: '温馨提示'});
    }
  });
}

// 删除数据，单条或多条
function ajaxData(url, data, success) {
  data = data || {};
  $.post(url, data, function(data, status) {
    if (status = 'success' && data.errcode == 0) {
      if (success) {
        success(data, status);
      }
    } else {
      top.layer.alert(data.errmsg, {icon: 5, title: '温馨提示'});
    }
  });
}

// 批量选中的删除
function ajaxCheckedData(url, tableId, filter, success) {
  layui.use(['table'], function() {
    var table = layui.table;
    if (success === undefined) {
      success = filter;
      filter = undefined;
    }
    var checkStatus = table.checkStatus(tableId),
      rowData = checkStatus.data,
      ids = [];
    if (rowData.length > 0) {
      for (var i in rowData) {
        if (filter) {
          var val = filter(rowData[i]);
          if (!val) {
            ids.push(val);
          }
        } else {
          ids.push(rowData[i].id);
        }
      }
      ajaxData(url, {ids: ids}, function(data, status) {
        if (success) {
          success(data, status);
        }
      });
    } else {
      layer.msg('请选择需要操作的记录', {icon: 3, title: '温馨提示'});
    }
  });
}


/*
 *  方法:Array.remove(dx)
 *  功能:根据元素值删除数组元素.
 *  参数:元素值
 *  返回:在原数组上修改数组
 *  作者：pxp
 */
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i;
    }
  }
  return -1;
};

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

/*
*  方法:Array.remove(dx)
*  功能:根据元素位置值删除数组元素.
*  参数:元素值
*  返回:在原数组上修改数组
*  作者：pxp
*/
Array.prototype.removeAt = function(dx) {
  if (isNaN(dx) || dx > this.length) {
    return false;
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] != this[dx]) {
      this[n++] = this[i];
    }
  }
  this.length -= 1;
};
/**
 * Created by arter on 2015/12/7.
 */

// ajax get请求
/**
 * <a href="#" class="confirm ajax-get text-info" >删除</a></td>
 *
 */
$(document).on('click', '.ajax-get', function() {
  var target;
  var that = this;
  if ($(this).hasClass('confirm')) {
    if (!confirm('确认要执行该操作吗?')) {
      return false;
    }
  }
  if ((target = $(this).attr('href')) || (target = $(this).attr('url'))) {
    $.get(target).success(function(data) {
      if (data.errcode == 0) {
        if (data.data.url) {
          toastr.success(data.data.name + ' 页面即将自动跳转~');
        } else {
          toastr.success(data.data.name);
        }
        setTimeout(function() {
          if (data.data.url) {
            location.href = data.data.url;
          } else if ($(that).hasClass('no-refresh')) {
            toastr.clear();
          } else {
            location.reload();
          }
        }, 1500);
      } else {
        toastr.error(data.errmsg);
        setTimeout(function() {
          if (data.data) {
            location.href = data.data;
          } else {
            toastr.clear();
          }
        }, 1500);
      }
    });
  }
  return false;
});

// todo
$('.todo').click(function(e) {
  e.preventDefault();
  toastr.info('功能开发中，敬请期待...');
});
$('.cw-cf').click(function() {
  var href = $(this).attr('href');
  console.log(href);
  swal({
    title: '确定清空回收站?',
    text: '清空后不可恢复，请谨慎操作!',
    html: true,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: '确定!',
    cancelButtonText: '算了',
    closeOnConfirm: false }, function() {
    $.get(href).success(function(data) {
      console.log(data);
      if (data.errcode == 0) {
        swal({title: data.data.name, text: '', type: 'success'}, function() {
          location.reload();
        });
      } else {

      }
    });
  });
  return false;
});
/**
 * ajax post submit请求
 * <form class = "form-horizontal">
 * <button target-form="form-horizontal" type="submit" class="ajax-post">确定</button>
 * confirm,
 */
function ajaxpost() {
  var target, query, form;
  var target_form = $(this).attr('target-form');
  var that = this;
  var nead_confirm = false;
  if (($(this).attr('type') == 'submit') || (target = $(this).attr('href')) || (target = $(this).attr('url'))) {
    form = $('.' + target_form);
    if ($(this).attr('hide-data') === 'true') { // 无数据时也可以使用的功能
      form = $('.hide-data');
      query = form.serialize();
    } else if (form.get(0) == undefined) {
      return false;
    } else if (form.get(0).nodeName == 'FORM') {
      // 表单验证
      if ($('[data-validate="parsley"]')) {
        $('[data-validate="parsley"]').parsley().validate();
        if ($('[data-validate="parsley"]').parsley().isValid() !== true) {
          return false;
        }
      }
      if ($(this).hasClass('confirm')) {
        if (!confirm('确认要执行该操作吗?')) {
          return false;
        }
      }
      if ($(this).attr('url') !== undefined) {
        target = $(this).attr('url');
      } else {
        target = form.get(0).action;
      }
      query = form.serialize();
    } else if (form.get(0).nodeName == 'INPUT' || form.get(0).nodeName == 'SELECT' || form.get(0).nodeName == 'TEXTAREA') {
      form.each(function(k, v) {
        if (v.type == 'checkbox' && v.checked == true) {
          nead_confirm = true;
        }
      });
      if (nead_confirm && $(this).hasClass('confirm')) {
        if (!confirm('确认要执行该操作吗?')) {
          return false;
        }
      }

      if ($(form).hasClass('sort')) {
        var arr = [];
        form.each(function(k, v) {
          var obj = {};
          obj.id = $(v).attr('data-id');
          obj.sort = $(v).val();
          arr.push(obj);
        });
        query = {sort: JSON.stringify(arr)};
      } else {
        // alert(1)
        query = form.serialize();
        // alert(query)
      }
    } else {
      if ($(this).hasClass('confirm')) {
        if (!confirm('确认要执行该操作吗?')) {
          return false;
        }
      }
      query = form.find('input,select,textarea').serialize();
    }
    $(that).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
    $.post(target, query).success(function(data) {
      // alert(JSON.stringify(data))
      // console.log(data)
      // return false;
      if (data.errcode == 0) {
        if (data.data.url) {
          toastr.success(data.data.name + ' 页面即将自动跳转~');
        } else {
          toastr.success(data.data.name);
        }
        setTimeout(function() {
          $(that).removeClass('disabled').prop('disabled', false);
          if (data.data.url) {
            location.href = data.data.url;
          } else if ($(that).hasClass('no-refresh')) {
            toastr.clear();
          } else {
            location.reload();
          }
        }, 1500);
      } else {
        if (data.errmsg == 'validate error') {
          $.each(data.data, function(i, n) {
            toastr.error(n);
          });
          // return false;
        } else {
          toastr.error(data.errmsg);
        }

        setTimeout(function() {
          $(that).removeClass('disabled').prop('disabled', false);
          if (!$.isPlainObject(data.data) && data.data) {
            location.href = data.data;
          } else {
            toastr.clear();
          }
        }, 1500);
      }
    });
  }
  return false;
}
$(document).on('click', '.ajax-post', ajaxpost);

// 企微云
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

function _alert(title, msg){
  if(!msg){
    msg=title;
    title="温馨提示";
  }
  top.layer.alert(msg, {icon: 5, title: title});
}

$(function () {
  moment.locale('zh-CN');
});

function printArea(obj){
  //打开一个新窗口newWindow
  var newWindow=window.open("打印","_blank");
  //要打印的div的内容
  var docStr = obj.innerHTML;
  //打印内容写入newWindow文档
  newWindow.document.write(docStr);
  //关闭文档
  newWindow.document.close();
  //调用打印机
  newWindow.print();
  //关闭newWindow页面
  newWindow.close();
}