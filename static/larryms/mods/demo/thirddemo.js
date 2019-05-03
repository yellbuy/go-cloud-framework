layui.define(['jquery', 'code', 'larryms'], function(exports) {
	var $ = layui.$,
		larryms = layui.larryms,
		code = layui.code;
	layui.code({
		skin: 'notepad',
		about: false,
		elem: ".layui-code",
		encode: true
	});
	layui.code({
		about: false,
		elem: ".larry-code",
		encode: true
	});
	if (layui.cache.identified == 'qrcode') {
		layui.use('qrcode', function() {
			var qrcode = layui.qrcode,
				urls = $('#url').val();

			function makeEWM(url) {
				var qrcodes = new qrcode($('#qrcode')[0], {
					width: 300,
					height: 300
				});
				qrcodes.makeCode(url);
			}
			makeEWM(urls);
			$('#makeqrcode').on('click', function() {
				var tempUrl = $('#url').val();
				$('#qrcode').empty();
				makeEWM(tempUrl);
			});
		});
	} else if (layui.cache.identified == 'geetest') {
		layui.use('geetest', function() {
			var geetest = layui.geetest;
			var handlerEmbed = function(captchaObj) {
				captchaObj.appendTo("#embed-captcha");
			};
			// 初始化极验验证码
			$.ajax({
				url: layui.cache.startcpathUrl, // 加随机数防止缓存
				type: "get",
				dataType: "json",
				success: function(data) {
					initGeetest({
						gt: data.gt,
						challenge: data.challenge,
						new_captcha: data.new_captcha,
						product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
						offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
						// 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
					}, handlerEmbed);
				}
			});
		});
	} else if (layui.cache.identified == 'pdfobject') {
		layui.use('pdfobject', function() {
			var pdfobject = layui.pdfobject;

			pdfobject.embed('./resource/sample-3pp.pdf', '#pdfBox');
		});

	} else if (layui.cache.identified == 'ckplayer') {
		layui.use('ckplayer', function() {
			var ckplayer = layui.ckplayer,
				videoObject = {
					container: '.video', //“#”代表容器的ID，“.”或“”代表容器的class
					variable: 'player', //该属性必需设置，值等于下面的new chplayer()的对象
					//flashplayer:true,//如果强制使用flashplayer则设置成true
					video: [
						['http://img.ksbbs.com/asset/Mon_1703/05cacb4e02f9d9e.mp4', 'video/mp4', '中文标清', 0],
						['http://img.ksbbs.com/asset/Mon_1703/d0897b4e9ddd9a5.mp4', 'video/mp4', '中文高清', 0],
						['http://img.ksbbs.com/asset/Mon_1703/eb048d7839442d0.mp4', 'video/mp4', '英文高清', 10],
						['http://img.ksbbs.com/asset/Mon_1703/d30e02a5626c066.mp4', 'video/mp4', '英文超清', 0],
					], //视频地址
					autoplay: true,
					loop: true

				};
			var player = new ckplayer(videoObject);
		});
	} else if (layui.cache.identified == 'cropper') {
		layui.use('cropperdemo', function() {
			var cropperdemo = layui.cropperdemo;
			larryms.plugin('bundle.min.js');
		});
	} else if (layui.cache.identified == 'md5') {
		layui.use(['md5', 'base64'], function() {
			var md5 = layui.md5,
				base64 = layui.base64;
			$('#md5Btn').on('click', function() {
				var input = $('#input1').val();
				if (!input) {
					larryms.msg('请输入待加密字符串');
				} else {
					$('#output1').text($.md5(input));
				}
			});

			$('#base64Btn').on('click', function() {
				var input = $('#input2').val();
				if (!input) {
					larryms.msg('请输入待编码内容');
				} else {
					$('#output2').text($.base64.encode(input));
				}
			});
		});
	} else if (layui.cache.identified == 'wangEditor') {
		layui.use('wangEditor', function() {
			var wangEditor = layui.wangEditor;
			var editor = new wangEditor('#editor');
			editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
			editor.customConfig.uploadImgServer = '/upload' // 上传图片到服务器
			editor.customConfig.fontNames = [
				'宋体',
				'微软雅黑',
				'Arial',
				'Tahoma',
				'Verdana'
			];
			editor.create();
		});
	} else if (layui.cache.identified == 'ueditor') {
		layui.use('ueditor', function() {
			var ueditor = layui.ueditor;

			var ue = UE.getEditor('editor', {
				initialFrameWidth: null
			});
			ue.ready(function() {
				ue.setHeight(230);
			});
		});
	} else if (layui.cache.identified == 'neditor') {
		layui.use('neditor', function() {
			var neditor = layui.neditor;

			var ue = UE.getEditor('editor', {
				initialFrameWidth: null
			});
			ue.ready(function() {
				ue.setHeight(230);
			});
		});
	} else if (layui.cache.identified == 'tinymce') {
		layui.use('tinymce', function() {
			var tinymce = layui.tinymce;

			tinymce.init({
				selector: '#editor',
				language: 'zh_CN',
				theme: 'modern',
				mobile: {
					theme: 'mobile',
					plugins: ['autosave', 'lists', 'autolink']
				},
				branding: false,
				toolbar: "insertfile undo redo | styleselect fontselect fontsizeselect | bold italic | forecolor | backcolor | alignleft aligncenter alignright alignjustify | bullist | numlist | outdent | indent  | image flipv fliph | media | blockquote | removeformat | subscript | superscript | searchreplace | table tabledelete tablecellprops tablemergecells tablesplitcells tableinsertrowbefore tableinsertrowafter | print preview fullpage | code | anchor | fullscreen |",
				plugins: [
					"advlist autolink lists link image charmap print preview anchor hr",
					"searchreplace visualblocks code wordcount fullscreen insertdatetime",
					"insertdatetime media table contextmenu paste imagetools",
					"save table contextmenu directionality paste textcolor"
				],
				height: "300"

			});

		});
	} else if (layui.cache.identified == 'ckeditor') {
		layui.use('ckeditor', function() {
			var ckeditor = layui.ckeditor;
			ckeditor.create(document.querySelector('#editor'), {
				heading: {
					options: [{
						model: 'paragraph',
						title: 'Paragraph',
						class: 'ck-heading_paragraph'
					}, {
						model: 'heading1',
						view: 'h2',
						title: 'Heading 1',
						class: 'ck-heading_heading1'
					}, {
						model: 'heading2',
						view: 'h3',
						title: 'Heading 2',
						class: 'ck-heading_heading2'
					}, {
						model: 'heading3',
						view: 'h4',
						title: 'Heading 3',
						class: 'ck-heading_heading3'
					}]
				},
				fontFamily: {
					options: [
						'default',
						'Arial, Helvetica, sans-serif',
						'Courier New, Courier, monospace',
						'Georgia, serif',
						'Lucida Sans Unicode, Lucida Grande, sans-serif',
						'Tahoma, Geneva, sans-serif',
						'Times New Roman, Times, serif',
						'Trebuchet MS, Helvetica, sans-serif',
						'Verdana, Geneva, sans-serif'
					]
				},
				alignment: {
					options: ['left', 'center', 'right', 'justify']
				}
			});

		});
	}else if(layui.cache.identified =='print'){
		layui.use('printJS',function(){
			var printJS = layui.printJS;
			$('.imgGallery div a').on('click',function(){
				 var img = $(this).siblings('img').attr('src'),
				 	 title = $(this).siblings('img').data('tit');
				 printJS({printable: img, type: 'image', header: title});
			});
			$('#htmlPrint').on('click',function(){
				printJS({printable: 'printJS-top', type: 'html', header: '标题可自定义：这里打印了页面头部文字区域'});
			});
			$('#pdfPrint').on('click',function(){
				printJS('./html/library/thirdjs/resource/sample-3pp.pdf');
			});
			$('#formPrint').on('click',function(){
				Print('#printJs-form');
			});
		});
	}else if(layui.cache.identified == 'clipboard'){
		layui.use('clipboard',function(){
			var clipboard = layui.clipboard;
			$('.icon_lists').find('li').each(function(k, v) {
				$(v).attr('data-clipboard-text', $(v).children('.fontclass').text());
			});
			var btns = document.querySelectorAll('li');
			var clipboard = new clipboard(btns);
			clipboard.on('success', function(e) {
				larryms.message('已成功复制' + e.text+'到剪贴板', 'success');
			});
		});
	}
	exports('thirddemo', {});
})