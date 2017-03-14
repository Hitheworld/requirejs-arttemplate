define(['template',
	'jquery',
	'layer',
	'common',
	'api',
	'jquery-cookie',
	'jquery.placeholder',
	'jquery.validate',
	'jquery.validate.zh',
	'jquery.form'
], function (template,$,layer,common,api) {

	function popupLogin() {

		//解决IE8下的placeholder
		//$('input').placeholder();

		//表单检验
		$("#LoginForm").validate({
			rules : {
				username : {
					required : true
				},
				password : {
					required : true
				}
			},
			messages : {
				username : {required : '请输入用户名'},
				password : {required : '请输入密码'}
			},
			errorElement : "p",
			submitHandler: function(){
				var username = $.trim($("#username").val());
				var password = $.trim($("#password").val());
				var LoginDB = Login(username, password);
				if(LoginDB.success){
					history.go(0); //刷新当面页
				}else {
					//var errorHTML = '<div class="error">{{LoginDB.errorMessage}}</div>';
					//$("#output").html(template.compile( errorHTML)({
					//	LoginDB: LoginDB
					//}));
					layer.alert("用户名或密码错误!")
					return false;
				}
				return false;
			}
		});


		//判断是否重复--手机号或者邮箱
		function isPhoneName(){
			var username = $("#username").val();
			console.log(username)
			if(username != "" ) {
				if( /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(username) ){
					$('p[name="isname"]').hide();
				}else {
					$('p[name="isname"]').html("请输入正确的手机号").css("color","#FF0000").show();
				}
			} else {
				$('p[name="isname"]').hide();
			}
		};


		function isEmailName(){
			var username = $("#username").val();
			console.log(username)
			if(username != "" ) {
				//判断是否是手机还是邮箱
				if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(username)) {
					$('p[name="isname"]').hide();
				}else {
					$('p[name="isname"]').html("请输入正确的邮箱").css("color","#FF0000").show();
				}
			} else {
				$('p[name="isname"]').hide();
			}
		};

		//手机与邮箱交互
		$("#username").bind("input propertychange", function(evt) {
			//邮箱
			if ($(this).val().indexOf("@") != "-1") {
				isEmailName();
				//手机
			} else {
				isPhoneName();
			}
		});

	}

	//
	var Login = function( username,password) {
		return common.requestService('login','POST', {
			username: username,
			password: password
		});
	};

	return {
		popupLogin: popupLogin
	}

});