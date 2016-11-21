define(['template',
	'jquery',
	'api',
	'jquery-cookie',
	'jquery.placeholder',
	'jquery.validate',
	'jquery.validate.zh',
	'jquery.form'
], function (template,$,api) {

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
			errorElement : "p"
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

		/**
		 * 351982312@qq.com
		 * 123456
		 */
		$('#LoginForm').on("submit",function() {
			$(this).ajaxSubmit(
				{
					url: 'login',                 //默认是form的action
					type: "POST",               //默认是form的method（get or post）
					dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
					//clearForm: true,          //成功提交后，清除所有表单元素的值
					//resetForm: true,          //成功提交后，重置所有表单元素的值
					target: '#output',          //把服务器返回的内容放入id为output的元素中
					//timeout: 3000,               //限制请求的时间，当请求大于3秒后，跳出请求
					//提交前的回调函数
					beforeSubmit: function(arr,$form,options){
						//formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]
						//jqForm:   jQuery对象，封装了表单的元素
						//options:  options对象
						//比如可以再表单提交前进行表单验证
						console.log("beforeSubmit",arr,$form,options);
						//清空前后空格
						arr[0].value = $.trim(arr[0].value);
						arr[1].value = $.trim(arr[1].value);
					},
					//提交成功后的回调函数
					success: function(data,status,xhr,$form){
						console.log("success",data,status,xhr,$form);
						var errorHTML = '<div class="error">{{errorMessage}}</div>';
						$("#output").html(template.compile( errorHTML)(data));
						if(data.success){
							history.go(0); //刷新当面页
						}
					},
					error: function(xhr, status, error, $form){
						console.log("error",xhr, status, error, $form);
						//var errorHTML = '{{errorMessage}}';
						//$("#output").html(template.compile( errorHTML)(error));
					},
					complete: function(xhr, status, $form){
						console.log("complete",xhr, status, $form)
					}
				}
			);
			return false; //阻止表单默认提交
		});

	}

	return {
		popupLogin: popupLogin
	}

});