define(['template',
        'jquery',
        'text!tplUrl/login/login.html',
        'text!tplUrl/login/login_popup.html',
        'common',
        'layer',
        'layui',
        'api',
        'jquery-cookie',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.form',
        'css!layerCss',
        'css!layuiCss',
        'css!cssUrl/login'
    ],
    function (template, $, loginTpl, login_popup, common, layer, layui, api) {

        function createPage() {
            //$("#content").html(loginTpl);
            $("#content").html(loginTpl);
            $(".myLogin").html(login_popup);

            //表单检验
            $("#popup_login_form").validate({
            	rules : {
                    username : {
                        required : true
                    },
                    password : {required : true}
            	},
            	messages : {
            		username : {required : '请输入用户名'},
                    password : {required : '请输入密码'}
            	},
            	errorElement : "span"
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

            $("#popup_login_form").on("submit", function () {
                //common.ajaxRequest("login", "POST", {
                //    username: "online",
                //    password: "123456"
                //}, function (data) {
                //
                //});
                if ($("#popup_login_form").valid()){
                    $(this).ajaxSubmit(
                        {
                            url: 'login',                 //默认是form的action
                            //type: type,               //默认是form的method（get or post）
                            dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
                            method: "post",
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
                                //console.log("beforeSubmit",arr,$form,options);
                                //console.log("数据是:",arr[0].value != '' );
                                //if(arr[0].value != '' || !arr[1].value != ''){
                                //	return false;
                                //}
                            },
                            //提交成功后的回调函数
                            success: function(data,status,xhr,$form){
                                //console.log("success",data,status,xhr,$form);
                                if(data.success){
                                    history.go(0);
                                    window.location.href = "#/home";
                                }else {
                                    layer.msg('请输入正确的账号和密码', {icon: 5});
                                }
                            },
                            error: function(xhr, status, error, $form){
                                //console.log("error",xhr, status, error, $form)
                            },
                            complete: function(xhr, status, $form){
                                //console.log("complete",xhr, status, $form)
                            }
                        }
                    );
                }


                return false; //阻止表单默认提交
            });
        }

        return {
            createPage: createPage
        }
    });