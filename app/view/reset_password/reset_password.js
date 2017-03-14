define(['template',
        'jquery',
        'text!tplUrl/reset_password/reset_index.html',
        'text!tplUrl/reset_password/reset_password.html',
        'common',
        'layer',
        'layui',
        'css!layerCss',
        'css!layuiCss',
        'css!cssUrl/login',
        'api',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.form'
    ],
    function (template,$,reset_index,reset_password,common,layer,layui,api) {

        function createPage() {
            //$("#content").html(loginTpl);
            $("#app").html(reset_index);
            $(".myLogin").html(reset_password);

            //手机与邮箱交互
            $("#loginName").bind("input propertychange", function(evt) {
                //邮箱
                if ($(this).val().indexOf("@") != "-1") {
                    $(".verification_intended").unbind().click(function(){
                        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim($("#loginName").val()))) {
                            common.ajaxRequest('bxg_anon/common/checkEmail','POST', {
                                email:  $.trim($("#loginName").val())
                            },function(data){
                                if (data.success){
                                    $("#popup_login_dv_checkEmail").val(data.resultObject)
                                }
                            });
                            var wait=90;
                            $(this).css("display","none");
                            $(".verification_intended2").css("display","block").html(wait+"秒");
                            timeOut();
                            function timeOut(){
                                if(wait==0){
                                    $(".verification_intended").css("display","block");
                                    $(".verification_intended2").css("display","none");
                                }else{
                                    setTimeout(function(){
                                        wait--;
                                        $(".verification_intended2").html(wait+"秒");
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
                    $(".verification_intended").unbind().click(function(){
                        if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test($.trim($("#loginName").val()))) {
                            common.ajaxRequest('bxg_anon/common/checkMobile','POST', {
                                mobile:  $.trim($("#loginName").val())
                            },function(data){
                                if (data.success){
                                    $("#popup_login_dv_checkEmail").val(data.resultObject)
                                }
                            });
                            var wait=90;
                            $(this).css("display","none");
                            $(".verification_intended2").css("display","block").html(wait+"秒");
                            timeOut();
                            function timeOut(){
                                if(wait==0){
                                    $(".verification_intended").css("display","block");
                                    $(".verification_intended2").css("display","none");
                                }else{
                                    setTimeout(function(){
                                        wait--;
                                        $(".verification_intended2").html(wait+"秒");
                                        timeOut();
                                    },1000)
                                }
                            }
                        } else {
                            layer.msg('请输入正确的手机', {icon: 5});
                        }

                    });
                }
            });

            $(".popup_login_dv").validate({
                rules : {
                    loginName : {
                        required : true
                    },
                    oldPassword : {
                        required : true
                    },
                    verification:{
                        required : true
                    },
                    newPassword : {required : true,minlength: 6,words: true},
                    hhfd:{required:true,equalTo: "#newPassword"}
                },
                messages : {
                    loginName:{required : '请输入手机号或邮箱'},
                    verification:{
                        required : "请输入验证码"
                    },
                    oldPassword : {required : '请输入旧密码'},
                    newPassword : {required : '请输入新密码'},
                    hhfd:{required:'请输入确认密码',
                        equalTo:'请再次输入相同的值'}

                },
                errorElement : "p"
            });
            //$(".verification_intended").on("click",function(){
            //    if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim($("#register_name").val()))) {
            //        common.ajaxRequest('bxg_anon/common/checkEmail','POST', {
            //            email:  $.trim($("#register_name").val())
            //        },function(data){
            //            if (data.success){
            //                $("#popup_login_dv_checkEmail").val(data.resultObject)
            //                console.log(data.resultObject)
            //            }
            //        });
            //        var wait=10;
            //        $(this).css("display","none");
            //        $(".verification_intended2").css("display","block").html(wait);
            //        timeOut();
            //        function timeOut(){
            //            if(wait==0){
            //                $(".verification_intended").css("display","block");
            //                $(".verification_intended2").css("display","none");
            //            }else{
            //                setTimeout(function(){
            //                    wait--;
            //                    $(".verification_intended2").html(wait);
            //                    timeOut();
            //                },1000)
            //            }
            //        }
            //    } else if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test($.trim($("#register_name").val()))){
            //
            //    }else {
            //        layer.msg('请输入正确的邮箱或者手机', {icon: 5});
            //    }
            //
            //});
            $(".popup_login_dv").on("submit",function(){
                var verification_cu = $.trim($("#verification_cu").val());//验证码
                if ($(".popup_login_dv").valid()) {
                    if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim($("#loginName").val())) || /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test($.trim($("#loginName").val()))){
                        if (verification_cu == $("#popup_login_dv_checkEmail").val()){
                            $(".popup_login_dv").ajaxSubmit(
                                {
                                    url: 'bxg_anon/user/updatePwd',                 //默认是form的action
                                    //type: type,               //默认是form的method（get or post）
                                    dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
                                    //clearForm: true,          //成功提交后，清除所有表单元素的值
                                    //resetForm: true,          //成功提交后，重置所有表单元素的值
                                    target: '#output',          //把服务器返回的内容放入id为output的元素中
                                    //timeout: 3000,               //限制请求的时间，当请求大于3秒后，跳出请求
                                    //提交前的回调函数
                                    beforeSubmit: function (arr, $form, options) {
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
                                    success: function (data, status, xhr, $form) {
                                        //console.log("success",data,status,xhr,$form);
                                        if (data.success) {
                                            //history.go(0);
                                            //window.location.href = "#/home";
                                            layer.msg('重置成功', {icon: 1});
                                            setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                                window.location.href="#/login";
                                            } ,2000);
                                        }else {
                                            layer.msg(data.errorMessage, {icon: 5});
                                        }
                                    },
                                    error: function (xhr, status, error, $form) {
                                        //console.log("error",xhr, status, error, $form)
                                    },
                                    complete: function (xhr, status, $form) {
                                        //console.log("complete",xhr, status, $form)
                                    }
                                }
                            );
                        }else {
                            layer.msg('验证码错误', {icon: 5});
                        }

                    }else {
                        layer.msg('请输入正确的邮箱或者手机', {icon: 5});
                    }
                }
                return false; //阻止表单默认提交
            })
        }

        return {
            createPage: createPage
        }
    });