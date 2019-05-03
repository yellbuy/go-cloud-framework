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
      if (data.status == 0) {
        if (data.url) {
          toastr.success(data.message + ' 页面即将自动跳转~');
        } else {
          toastr.success(data.message||"操作成功");
        }
        setTimeout(function() {
          if (data.url) {
            location.href = data.url;
          } else if ($(that).hasClass('no-refresh')) {
            toastr.clear();
          } else {
            location.reload();
          }
        }, 1500);
      } else {
        toastr.error(data.message);
        setTimeout(function() {
          if (data.url) {
            location.href = data.url;
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
      query = form.serializeObject();
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
      query = form.serializeObject();
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
        query = form.serializeObject();
        // alert(query)
      }
    } else {
      if ($(this).hasClass('confirm')) {
        if (!confirm('确认要执行该操作吗?')) {
          return false;
        }
      }
      query = form.find('input,select,textarea').serializeObject();
    }
    $(that).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
    $.post(target, query).success(function(data) {
      // alert(JSON.stringify(data))
      // console.log(data)
      // return false;
      if (data.status == 0) {
        if (data.url) {
          toastr.success(data.message + ' 页面即将自动跳转~');
        } else {
          toastr.success(data.message||"操作成功");
          //location.reload();
        }
        setTimeout(function() {
          $(that).removeClass('disabled').prop('disabled', false);
          if (data.url) {
            location.href = data.url;
          } else if ($(that).hasClass('no-refresh')) {
            toastr.clear();
          } else {
            location.href = document.referrer;
            //history.go(-1);
            // location.reload();
          }
        }, 1500);
      } else {
        if (data.status == 1001) {
          $.each(data.message, function (i, n) {
            toastr.error(n);
          });
        } else {
          toastr.error(data.message);
        }

        setTimeout(function() {
          $(that).removeClass('disabled').prop('disabled', false);
          if (data.data) {
            if ((typeof data.data === 'string') && data.data.constructor == String) {
              location.href = data.data;
            } else {
              for (var key in data.data) {
                // 验证失败信息
                alert(data.data[key]);
                return;
              }
            }
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
