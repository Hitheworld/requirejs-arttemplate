define(['template',
		'jquery',
		'layer',
		'layui',
		'text!tplUrl/signin/signin.html',
		'text!tplUrl/signin/register_popup.html',
		'common',
		'api',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.form',
		'css!layerCss',
		'css!layuiCss',
		'css!cssUrl/signin'
	],
	function (template,$,layer,layui,loginTpl,register_popup,common,api) {

		function createPage() {


			//验证码
			var CodeDB = checkCode();
			$("#content").html(template.compile( loginTpl)());
			$(".myRegister").html(template.compile( register_popup)({
				checkCode: CodeDB
			}));


			//检验
			var  login_name = $.trim($("#register_name").val()),
				nick_name = $.trim($("#username").val()),
				password = $.trim($("#pwd").val());
			$("#signinFrom").validate({
				rules : {
					login_name : {
						required : true
					},
					nick_name : {
						required : true,
						maxlength: 20,
						ABC123: true
					},
					password : {
						required : true,
						minlength: 8,
						words: true
					},
					verification:{
						required : true,
						minlength: 4
					},
					agree : {
						required : true
					}

				},
				messages : {
					login_name : {
						required : "请输入手机号或者邮箱地址"
					},
					nick_name : {
						required : "请输入昵称"
					},
					password : {
						required :  "请输入密码"
					},
					verification:{
						required : "请输入验证码"
					},
					agree: {
						required :  "请务必勾选同意协议"
					}
				},
				errorElement : "p"
			});



			//function iPhoneVerify() {
			//	var iPhone = $("#register_name");
			//	if ($.trim(iPhone.val()).length > 0) {
			//		if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test($.trim(iPhone.val()))) {
			//			//if ($(".register_message1").attr("data-type") == "yes") {
			//			//	return true;
			//			//}
			//			common.ajaxRequest("bxg/user/isExists","POST",{login_name:$.trim(iPhone.val())},function(data){
			//				if (!data.resultObject) {
			//					$(".register_message1").attr("data-type","yes").text("手机号正确").css({color:"#68c04a"});
			//					return true;
			//				} else {
			//					$(".register_message1").attr("data-type","no").text("手机号重复").css({color:"red"});
			//					return false;
			//				}
			//			})
			//		}else {
			//			$(".register_message1").attr("data-type","no").text("请输入有效的手机号").css({color:"red"});
			//			return false;
			//		}
			//	}else {
			//		$(".register_message1").attr("data-type","no").text("手机号不能为空").css({color:"red"});
			//		return false;
			//	}
			//}
			//function email_checkVerify() {
			//	var email_check = $("#register_name");
			//	if($.trim(email_check.val()).length > 0) {
			//		if($.trim(email_check.val()).length < 4 || $.trim(email_check.val()).length > 16) {
			//			$(".register_message1").attr("data-type", "no").text("请输入4-16个字符");
			//			return false;
			//		} else {
			//			if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim(email_check.val()))) {
			//				$(".register_message1").attr("data-type", "yes").text("");
			//				common.ajaxRequest("bxg/user/isExists","POST",{login_name:$.trim(email_check.val())},function(data){
			//					if (!data.resultObject) {
			//						$(".register_message1").attr("data-type","yes").text("邮箱正确").css({color:"#68c04a"});
			//						return true;
			//					} else {
			//						$(".register_message1").attr("data-type","no").text("该邮箱已被注册").css({color:"red"});
			//						return false;
			//					}
			//				});
			//			} else {
			//				$(".register_message1").attr("data-type", "no").text("请输入正确的邮箱");
			//				return false;
			//			}
			//		}
			//	} else {
			//		$(".register_message1").attr("data-type", "no").text("请输入邮箱");
			//		return false;
			//	}
			//}


			//判断是否重复--手机号或者邮箱
			function isPhoneName(){
				var isLoginName = $("#register_name").val();
				console.log("当前名是:",isLoginName)
				var isExistsLoginNameDB = isExistsLoginName(isLoginName);
				var  login_name = $.trim($("#register_name").val());
				if (isExistsLoginNameDB.success) {

					if(login_name != "" ) {
						if( /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(isLoginName) ){
							if (!isExistsLoginNameDB.resultObject ) {
								$('p[name="isname"]').html("该手机可以注册").css("color","#44bd7d").show();
							}else {
								$('p[name="isname"]').html("该手机已经注册").show();
							}
						}else {
							$('p[name="isname"]').html("请输入正确的手机号").css("color","#FF0000").show();
						}
					} else {
						$('p[name="isname"]').hide();
					}

				}
			};


			function isEmailName(){
				var isLoginName = $("#register_name").val();
				console.log("当前名是:",isLoginName)
				var isExistsLoginNameDB = isExistsLoginName(isLoginName);
				var  login_name = $.trim($("#register_name").val());
				if (isExistsLoginNameDB.success) {

					if(login_name != "" ) {
						//判断是否是手机还是邮箱
						if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(isLoginName)) {
							if (!isExistsLoginNameDB.resultObject ) {
								$('p[name="isname"]').html("该邮箱可以注册").css("color","#44bd7d").show();
							}else {
								$('p[name="isname"]').html("该邮箱已经注册").show();
							}

						}else {
							$('p[name="isname"]').html("请输入正确的邮箱").css("color","#FF0000").show();
						}
					} else {
						$('p[name="isname"]').hide();
					}

				}
			};


			//手机与邮箱交互
			$("#register_name").bind("input propertychange", function(evt) {
				//邮箱
				if ($(this).val().indexOf("@") != "-1") {
					$(".verification_ipt").html("<input type='text' class='verification' name='verification' id='verification_cu' placeholder='请输入验证码'>" +
						"<span class='verification_intended layui-btn'>发送验证码</span><span class='verification_intended2' style='display:none; '></span>");
					isEmailName();
					$(".verification_intended").click(function(){
						if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim($("#register_name").val()))) {
							common.ajaxRequest('bxg/common/checkEmail','POST', {
								email:  $.trim($("#register_name").val())
							},function(data){
								if (data.success){
									$("#popup_login_dv_checkEmail").val(data.resultObject)
								}
							});
							var wait=10;
							$(this).css("display","none");
							$(".verification_intended2").css("display","block").html(wait);
							timeOut();
							function timeOut(){
								if(wait==0){
									$(".verification_intended").css("display","block");
									$(".verification_intended2").css("display","none");
								}else{
									setTimeout(function(){
										wait--;
										$(".verification_intended2").html(wait);
										timeOut();
									},1000)
								}
							}
						} else {
							layer.msg('请输入正确的邮箱', {icon: 5});
						}

					});
				//手机
				} else {
					$(".verification_ipt").html("");
					$(".verification_ipt + p").css("display","none");
					isPhoneName();
				}
			});


			//提交注册信息
			$('#signinFrom').on("submit",function() {
				var  login_name = $.trim($("#register_name").val()),
					nick_name = $.trim($("#username").val()),
					password = $.trim($("#pwd").val()),
					agree = $.trim($("#agree:checked").val()),
					verification_cu = $.trim($("#verification_cu").val());//验证码
				console.log("用户名:", login_name, "名称:", nick_name, "密码:", password,"是否勾选中:", agree);
				if ( login_name != "" &&　nick_name　!= ""  && password !="" && agree != "") {
					if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim($("#register_name").val()))){
						if (verification_cu == $("#popup_login_dv_checkEmail").val()){
							var signinDB = SigninPost(login_name, nick_name, password);
							if ( signinDB.success) {
								window.location.href="#/RegisterSuccess";
							} else {
								layer.alert("邮箱错误");
								return false; //阻止表单默认提交
							}
						} else {
							layer.msg('验证码错误', {icon: 5});
						}
					} else if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test($.trim($("#register_name").val()))){
						var signinDB = SigninPost(login_name, nick_name, password);
						if ( signinDB.success) {
							window.location.href="#/RegisterSuccess";
						} else {
							layer.alert("手机号错误");
							return false; //阻止表单默认提交
						}
					}else {
						return false;
					}

				}


				return false; //阻止表单默认提交
			});


		};


		//申请注册
		var SigninPost = function(login_name, nick_name, password ) {
			return common.requestService('bxg/user/regist','post', {
				login_name:  login_name,
				nick_name: nick_name,
				password: password
			});
		};


		//判断手机号或者邮箱号是否重复
		var isExistsLoginName = function( login_name ) {
			return common.requestService('bxg/user/isExists','post', {
				login_name:  login_name
			});
		};


		//验证码
		var checkCode = function() {
			return  'bxg/common/checkCode';
		};


		return {
			createPage: createPage
		}
	});