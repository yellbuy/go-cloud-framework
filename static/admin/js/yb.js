
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  var $radio = $('input[type=radio],input[type=checkbox]', this);
  $.each($radio, function() {
    if (!o.hasOwnProperty(this.name)) {
      o[this.name] = '0';
    }
  });
  return o;
};
/**
 * ajax post submit请求
 * <form class = "form-horizontal">
 * <button target-form="form-horizontal" type="submit" class="ajax-post">确定</button>
 * confirm,
 */
function ajaxpostForLaytable() {
  var table = layui.table;
  var target, query, form;
  var target_form = $(this).attr('target-form');
  var target_field = $(this).attr('target-field') || 'id';
  var target_para = $(this).attr('target-para') || 'ids';
  var that = this;
  var nead_confirm = false;
  if (($(this).attr('type') == 'submit') || (target = $(this).attr('href')) || (target = $(this).attr('url'))) {
    // 获取表格选中行
    var checkStatus = table.checkStatus(target_form); // test即为基础参数id对应的值
    if (checkStatus.data.length == 0) {
      alert('请选择待操作的记录');
      return false;
    }
    target = target || form.get(0).action;
    if (!target) {
      return false;
    }

    if ($(this).hasClass('confirm')) {
      if (!confirm('确认要执行该操作吗?')) {
        return false;
      }
    }

    query = checkStatus.data.map(function(item, index, array) {
      // var obj={};
      // obj[target_para]=item[target_field];
      return item[target_field];
    });
    const req = {};
    req[target_para] = query.join(',');
    $(that).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
    $.post(target, req).success(function(data) {
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
        if (data.errcode == 1001) {
          $.each(data.errmsg, function(i, n) {
            toastr.error(n);
          });
        } else {
          toastr.error(data.errmsg);
        }
        console.log(data);

        setTimeout(function() {
          $(that).removeClass('disabled').prop('disabled', false);
          if (data.data) {
            location.href = data.data;
          } else {
            toastr.clear();
          }
        }, 1500);
      }
    }).error(function(e, code, msg) {
      $(that).removeClass('disabled').prop('disabled', false);
      alert('删除失败，请重试：' + msg);
    });
  }
  return false;
}
$(document).on('click', '.ajax-post-laytable', ajaxpostForLaytable);
