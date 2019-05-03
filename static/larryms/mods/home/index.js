layui.define(['jquery', 'fullpages', 'countup', 'swiper'], function(exports) {

	var $ = layui.$,
		fullpages = layui.fullpages,
		countup = layui.countup,
		larryms = layui.larryms,
		swiper = layui.swiper;

	var myFullpage = new fullpage('#fullpage', {
		sectionsColor: ['#1BBC9B', '#C63D0F', '#7E8F7C'],
		anchors: ['home', 'introduce', 'getgrant', 'info'],
		onLeave: function(origin, destination, direction) {
			// if (destination.index === 1) {
			// 	destination.item.classList.add('load-background');
			// }
		},
		loopHorizontal: true,
		afterLoad: function(origin, destination, direction) {
			if (destination.index == 2) {

				$('#caseleft').addClass('LarryLeft');

			} else {
				$('#caseleft').removeClass('LarryLeft');
			}
			if (destination.index == 3) {

				$('#footer').addClass('fixed');
				$('#l1').addClass('pt-page-rotateCarouselBottomIn').show();
				$('#l2').addClass('pt-page-rotateCarouselBottomIn').show();
				$('#l3').addClass('pt-page-rotateCarouselBottomIn').show();
			} else {
				$('#footer').removeClass('fixed');
				$('#l1').removeClass('pt-page-rotateCarouselBottomIn').hide();
				$('#l2').removeClass('pt-page-rotateCarouselBottomIn').hide();
				$('#l3').removeClass('pt-page-rotateCarouselBottomIn').hide();
			}

			if (destination.index == 1) {
				// 数字动画
				var one = new countup('one', 0, $('#one').text()),
					two = new countup('two', 0, $('#two').text());
				one.start();
				two.start();
			}

			if (destination.index == 2) {
				$('#g1').addClass('pt-page-rotateCubeLeftIn').show();
				$('#g2').addClass('pt-page-rotateCarouselTopIn pt-page-delay100').show();
				$('#g3').addClass('pt-page-rotateCarouselBottomIn pt-page-delay200').show();
			} else {
				$('#g1').removeClass('pt-page-rotateCubeLeftIn').hide();
				$('#g2').removeClass('pt-page-rotateCarouselTopIn pt-page-delay100').hide();
				$('#g3').removeClass('pt-page-rotateCarouselBottomIn pt-page-delay200').hide();
			}
		},
		afterSlideLoad: function(section, origin, destination, direction) {
			var loadedSlide = this;
			if (destination.index == 0) {
				$('.larry-slide .larryms-title').addClass('pt-page-rotateCarouselTopIn');
				$('.larry-slide .larryms-title-box').addClass('pt-page-rotateCarouselBottomIn');
			} else {
				$('.larry-slide .larryms-title').removeClass('pt-page-rotateCarouselTopIn');
				$('.larry-slide .larryms-title-box').removeClass('pt-page-rotateCarouselBottomIn');
			}

			if (destination.index == 1) {
				$('#s1').addClass('pt-page-rotatePullTop').show();
				$('#s2').addClass('pt-page-rotateCarouselTopIn pt-page-delay100').show();
				$('#s3').addClass('pt-page-rotateCarouselBottomIn pt-page-delay200').show();
			} else {
				$('#s1').removeClass('pt-page-rotatePullTop').hide();
				$('#s2').removeClass('pt-page-rotateCarouselTopIn pt-page-delay100').hide();
				$('#s3').removeClass('pt-page-rotateCarouselBottomIn pt-page-delay200').hide();
			}

			if (destination.index == 2) {
				$('#special').addClass('pt-page-rotateInNewspaper').show();
			} else {
				$('#special').removeClass('pt-page-rotateInNewspaper').hide();
			}
		}
	});

	var timer = '';
	var timer1 = '';
	setTimeout(function() {
		timer1 = setInterval(function() {
			myFullpage.moveSlideRight();
		}, 4000);
	}, 1000);

	$('.section1').mouseenter(function() {
		clearInterval(timer1);
		clearInterval(timer);
	});
	$('.section1').mouseleave(function() {
		timer = setInterval(function() {
			myFullpage.moveSlideRight();
		}, 4000);
	});

	$('#getDownload').on('click', function() {
		var url = $(this).data('url'),
			getUrl = $(this).data('href');
		$.post(getUrl, {}, function(res) {
			if (res.code == 200) {
				location.href = url;
			} else if (res.code == 0) {
				larryms.confirm('您当前未登录社区，需要先登录才能获得下载,点击确定即可前往登录入口，点击取消可以继续浏览', {}, function() {
					location.href = '/login.html';
				});
			}
		});
		return false;
	});
	document.addEventListener('DOMContentLoaded', function() {
		function audioAutoPlay() {
			var audio = document.getElementById('larry_audio');
			audio.play();
			document.addEventListener("WeixinJSBridgeReady", function() {
				audio.play();
			}, false);
		}
		audioAutoPlay();
	});
	document.addEventListener('touchstart', function() {
		function audioAutoPlay() {
			var audio = document.getElementById('larry_audio');
			audio.play();
		}
		audioAutoPlay();
	});
	$('#larryms_svg').on('click', function() {
		if ($('#larry_audio').get(0).paused) {
			$('#larry_audio').get(0).play();
			$(this).addClass('layui-anim-loop');
		} else {
			$('#larry_audio').get(0).pause();
			$(this).removeClass('layui-anim-loop');
		}
	});


	exports('index', {});
});