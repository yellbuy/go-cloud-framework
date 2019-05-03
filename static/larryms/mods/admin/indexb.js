/**
 * @name : larryMS框架后台界面主文件
 * @author larry
 * @QQ: 313492783
 * @site : www.larryms.com
 * @Last Modified time: 2018-08-10 15:50:06
 */
var larryTab;
layui.define(['jquery', 'configure', 'larryTab', 'form', 'admin'], function(exports) {
  var $ = layui.$,
    configure = layui.configure,
    layer = layui.layer,
    laytpl = layui.laytpl,
    larryms = layui.larryms,
    form = layui.form,
    admin = layui.admin,
    $win = $(window),
    $body = $('body'),
    $larrymsElemBox = $('#larry_layout'),
    Themestyles = configure.basePath + 'lib/templets/style/theme.css',
    ThemeUrl = 'lib/templets/themeNoneTab';
  larryTab = layui.larryTab({
    tab_elem: '#larry_tab',
    tabMax: 30,
    spreadOne: true
    //,isPageEffect:configure.animations //去掉此处注释可以让全局配置文件控制动画生效
  });
  //此段代码实际项目中可删除，仅用于布局风格切换，于项目无实际意义
  // var clearIdentifiy = layui.data('switchs');
  // if(JSON.stringify(clearIdentifiy) != "{}"){
  //      //清除switchs表
  //      layui.data('switchs',null);
  //      // 执行缓存清理
  //      larryms.cleanCached.clearAll();
  //      top.location.reload(true);
  // }

  var _initialize = function() {
    if (layui.data('larryms').topMenuSet === undefined) {
      layui.data('larryms', {
        key: 'topMenuSet',
        value: true
      });
    }
    //菜单初始化
    larryTab.menuSet({
      type: 'POST',
      url: layui.cache.menusUrl,
      data: layui.cache.menuData,
      left_menu: '#larryms_left_menu',
      leftFilter: 'LarrySide',
      // top_menu: configure.topMenuSet !== false ? '#larryms_top_menu' : false //让全局配置文件优先
      top_menu: layui.data('larryms').topMenuSet !== false ? '#larryms_top_menu' : false
    });
    larryTab.menu();

    //如果页面开启缓存
    if (larryTab.config.gobal_caches) {
      var $pages = $('#larry_tab_content').children('.layui-tab-item'),
        group = $pages.data('group'),
        id = $pages.data('id');
      //执行菜单定位
      if (id !== 'larry-undefined') {
        larryTab.navPosition(id, group);
      }
    }


  };
  //主框架菜单Tab相关操作
  if (window.top == window.self) {
    _initialize();
  }

  //让主体框架页面支持响应式适配
  window.onresize = function() {
    admin.responeDevice();
  }
  //系统锁屏控制
  var locks = layui.data('larryms').lockscreen,
    sysSet = layui.data('larryms').systemSet;
  if (locks === 'locked') {
    //锁屏
    lockSys();
  }
  if (sysSet) {
    if (sysSet.fullScreen == true) {
      var fScreenIndex = layer.alert('按ESC退出全屏', {
        title: '进入全屏提示信息',
        skin: 'layui-layer-lan',
        closeBtn: 0,
        anim: 4,
        offset: '100px'
      }, function() {
        larryms.fullScreen.entry();
        layer.close(fScreenIndex);
      });
    }
  }

  // 菜单折叠
  $('#menufold').on('click', function() {
    if ($('#larry_layout').hasClass('larryms-fold')) {
      $('#larry_layout').addClass('larryms-unfold').removeClass('larryms-fold');
      $(this).children('i').addClass('larry-fold7').removeClass('larry-unfold');
    } else {
      $('#larry_layout').addClass('larryms-fold').removeClass('larryms-unfold');
      $(this).children('i').addClass('larry-unfold').removeClass('larry-fold7');
    }
  });

  // 主题设置
  $('#larryTheme').on('click', function() {
    if ($('#larrymsThemes').length > 0) {
      return false;
    }
    var index = layer.open({
      type: 1,
      id: 'larry_theme_R',
      title: false,
      anim: Math.ceil(Math.random() * 6),
      offset: 'r',
      closeBtn: false,
      shade: 0.2,
      shadeClose: true,
      skin: 'layui-anim layui-anim-rl larryms-layer-right',
      area: '320px',
      success: function(layero, index) {
        layui.link(Themestyles);
        larryms.htmlRender(ThemeUrl, layero);
      },
    });
  });


  var msgFlag = false;
  //消息查看
  $('#msgBox').on('click', function() {
    if (!msgFlag) {
      $('.dropdown-menu-list').show().removeClass('pt-page-moveToTopFade').addClass('pt-page-moveFromTop');
      msgFlag = true;
    } else {
      closeMsg(msgFlag);
      msgFlag = false;
    }
    $('#viewMsg').on('click', function() {
      closeMsg(msgFlag);
      msgFlag = false;
    });
    $('.msg-box .msg-item').on('click', function() {
      // 打开消息中心页面
      // 此处可根据业务逻辑自定义传参，下面仅供演示参考
      // var data = {
      //   href: $(this).data('url'),
      //   id: $(this).data('id'),
      //   font: 'larry-icon',
      //   icon: $(this).data('icon'),
      //   group: $(this).data('group'),
      //   title: '消息中心',
      //   addType: 'page'
      // };
      // larryTab.tabAdd(data);
      closeMsg(msgFlag);
      msgFlag = false;
    });
  });
  //清除所有
  $('#clearMsg').on('click', function() {
    closeMsg(msgFlag);
    msgFlag = false;
    $('#msgNums').text('').hide(800);
    $('#msgNums').removeClass().addClass('larry-badge-dot').show(800);
    larryms.noticeAllClose();
  });

  function closeMsg(msgFlag) {
    $('.dropdown-menu-list').removeClass('pt-page-moveFromTop').addClass('pt-page-moveToTopFade').fadeOut(300);
  }



  //清除缓存
  $('#clearCached').off('click').on('click', function() {
    larryms.cleanCached.clearAll();
    layer.alert('缓存清除完成!本地存储数据也清理成功！', {
      icon: 1,
      title: '系统提示',
      end: function() {
        top.location.reload(); //刷新
      }
    });
  });
  // 退出系统
  $('#logout').off('click').on('click', function() {
    var url = $(this).data('url');

    larryms.confirm('确定退出系统吗?', {

    }, function(res) {
      //此为后端写法之一
      // $.get(url, function(res) {
      //   if (res.code == 200) {
      //     larryms.msg(res.msg);
      //     top.location.href = res.url;
      //   }
      // });
      //前端展示就直接跳转到登录页了
      top.location.href = url;
    }, function() {
      layer.msg('成功返回系统', {
        time: 1000,
        btnAlign: 'c',
      });
    })
  });

  $('#lock').mouseover(function() {
    // layer.tips('请按Alt+L快速锁屏！', $(this), {
    //   tips: [2, '#FF5722'],
    //   time: 1500
    // });
  });
  $('#lock').off('click').on('click', function() {
    lockSys();
  });

  //锁屏
  function lockSys() {



    var img = $('#user_photo').attr('src'),
      name = $('#uname').text();
    locksInterface({
      Display: 'block',
      UserPhoto: img,
      UserName: name
    });
    // 设置锁屏状态存入本地 或后台数据库状态 根据实际需要选择
    //1、仅本地锁屏解锁
    layui.data('larryms', {
      key: 'lockscreen',
      value: 'locked'
    });
    //2、连接数据库
    // 在larryCMS2.0中体现
    startTimer();
  }
  //解锁
  function unlockSys() {
    //验证锁屏密码
    var img = $('#user_photo').attr('src'),
      name = $('#uname').text();
    if ($('#unlock_pass').val() === 'larry') {

      locksInterface({
        Display: 'none',
        UserPhoto: img,
        UserName: name
      });

    } else {
      layer.tips('模拟锁屏，输入密码：larry 解锁', $('#unlock'), {
        tips: [2, '#FF5722'],
        time: 1000
      });
      return;
    }

  }

  // 键盘按键监听
  $(document).keydown(function() {
    return key(arguments[0]);
  });

  function key(e) {
    var keynum;
    if (window.event) {
      keynum = e.keyCode;
    } else if (e.which) {
      keynum = e.which;
    }
    if (e.altKey && keynum == 76) {
      lockSys();
    }
  }

  // 锁屏界面
  function locksInterface(options) {
    var id = 'larry_lock_screen',
      lockScreen = document.createElement('div'),
      interface = laytpl(['<div class="lock-screen" style="display: {{d.Display}};">',
        '<div class="lock-wrapper" id="lock-screen">',
        '<div id="time"></div>',
        '<div class="lock-box">',
        '<img src="{{d.UserPhoto}}" alt="">',
        '<h1>{{d.UserName}}</h1>',
        '<form action="" class="layui-form lock-form">',
        '<div class="layui-form-item">',
        '<input type="password" id="unlock_pass" name="lock_password" lay-verify="pass" placeholder="锁屏状态，请输入密码解锁" autocomplete="off" class="layui-input"  autofocus="">',
        '</div>',
        '<div class="layui-form-item">',
        '<span class="layui-btn larry-btn" id="unlock">立即解锁</span>',
        '</div>',
        '</form>',
        '</div>',
        '</div>',
        '</div>'
      ].join('')).render(options),
      lockElem = document.getElementById(id);

    //主体框架中加载锁屏界面
    lockScreen.id = id;
    lockScreen.innerHTML = interface;

    lockElem && $body[0].removeChild(lockElem);
    if (options.Display !== 'none') {
      $body[0].appendChild(lockScreen);
    } else {
      $('#larry_lock_screen').empty();
    }
    $('#unlock').off('click').on('click', function() {
      unlockSys();
      layui.data('larryms', {
        key: 'lockscreen',
        value: 'unlock'
      });
    });
    $('#unlock_pass').keypress(function(e) {
      if (window.event && window.event.keyCode == 13) {
        $('#unlock').click();
        return false;
      }
    });
  }

  function startTimer() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    $('#time').html(h + ":" + m + ":" + s);
    t = setTimeout(function() {
      startTimer()
    }, 500);
  }
  // 用户首次进入demo页触发
  $(top.document.body).one('click', function() {
    if (!$(this).hasClass('notice-trigger')) {
      noticeDemo();
      $(this).addClass('notice-trigger');
    }
  });

  function noticeDemo() {
    setTimeout(function() {
      larryms.notice({
        msg: '消息通知：点我在选项卡中打开百度Echarts页面！',
        url: '/html/library/charts/echarts.html'
      }, {
        action: 3,
        navid: 75,
        navgroup: 1,
        navtitle: "百度Echarts",
        navfont: "larry-icon",
        navicon: "larry-moxing"
      });
    }, 5000);

    setTimeout(function() {
      larryms.notice({
        msg: '重要消息：点我在新窗口查看，也可以右上角点X无视！',
        url: 'https://www.larryms.com/cates/5.html',
        msgtype: 'danger'
      }, {
        action: 4
      });
    }, 9000);
    setTimeout(function() {
      larryms.notice({
        msg: '您收到1条测试消息，请点击查看!',
        url: '/html/use/notice.html',
        msgtype: 'custom',
        color: '#fff',
        bgcolor: '#1E9FFF'
      }, {
        action: 3,
        navid: 89,
        navgroup: 0,
        navtitle: "消息推送功能",
        navfont: "larry-icon",
        navicon: "larry-info",
        font: 'fa',
        icon: 'fa-flag-checkered'
      });
    }, 13000);

    setTimeout(function() {
      larryms.notice({
        msg: 'LarryMS框架演示中默认关闭了Tab选项卡的加载动画，Tab选项卡切换刷新等功能，可在浏览一遍之后，通过主题设置中开启默认关闭的设置，对比效果。本月2.0.9版本将是重量级更新【如tree组件、模板系列等】！',
        msgtype: 'custom',
        color: '#fff',
        bgcolor: '#01CED1'
      }, {
        hide: 'click',
        font: 'fa',
        icon: 'fa-universal-access'
      });
    }, 18000);
    setTimeout(function() {
      larryms.notice({
        msg: '我没有声音，我可以自动隐藏！',
        msgtype: 'success'
      }, {
        audio: false
      });
    }, 25000);
  }


  exports('indexb', {});
});