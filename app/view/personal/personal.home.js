define(['template',
		'jquery',
		'text!tplUrl/personal/personal.home.html',
		'text!tplUrl/personal/personal_intro_dv.html',
		'common',
		'layer',
		'layui',
		'api',
		'jquery.form',
		'css!layerCss',
		'css!layuiCss',
		'css!cssUrl/personal'
	],
	function (template,$,
	          personalHomeTpl,personal_intro_dvTpl,
			  common,layer,layui,api) {

		function createPage(type,uid) {
			$("#content").html(personalHomeTpl);
			common.ajaxRequest('bxg/user/personCenter', "GET", {teacherId:$(".home-user-name").attr("data-id")}, function (data, state) {
				$(".personal_intro").html(template.compile(personal_intro_dvTpl)(data));
				if (parseInt(data.resultObject[0].isMsg) > 0) {
					$(".personal_ul>li>span").css("display","block");
				}else {
					$(".personal_ul>li>span").css("display","none");
				}
				$("#UpLoadFiletou").change(function(){
					var filepath = $(this).val();
					var extStart = filepath.lastIndexOf(".");
					var ext = filepath.substring(extStart, filepath.length).toUpperCase();
					if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
						layer.msg("图片限于bmp,png,gif,jpeg,jpg格式", {icon: 2});
					} else {
						if (filepath) {
							$("#MyModal").attr("action","bxg/common/upPersonalImg");
							$("#MyModal").submit();
						}
					}
				});
				$("#MyModal").on("submit",function(){
					$(this).ajaxSubmit(function(message){
						$(".personal_picModal_img").attr("src",message.resultObject);
						$(".home-user-box img").attr("src",message.resultObject)
					});
					return false;
				});
				$(".personal_ul li").attr("class", "").each(function () {
					if ($(this).attr("data-url") == type) {
						$(this).attr("class", "personal_this")
					}
				});
			});



			this.rightContent = function(type,uid){
				require( ['tplUrl/personal/'+type+'/'+type], function (m) {
					m.createPage(type,uid);
				});
			}
		}

		return {
			createPage: createPage
		}
	});