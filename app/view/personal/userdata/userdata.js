define(['template',
        'jquery',
        'text!tplUrl/personal/userdata/userdata.html',
        'text!tplUrl/personal/userdata/change_password.html',
        'text!tplUrl/personal/userdata/change_Email.html',
        'text!tplUrl/personal/userdata/change_phone.html',
        'common',
        'layer',
        'layui',
        'api',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.form'
    ],
    function (template, $, userdataTpl, change_password, change_Email, change_phone, common, layer, layui, api) {

        function createPage() {
            $(".personal_ul li").attr("class", "").each(function () {
                if ($(this).text() == "个人资料") {
                    $(this).attr("class", "personal_this")
                }
            });
            
            var emailHtml = "<div class='change_email'><form id='change_email_form2' method='post'>" +
                "<div class='layui-form-item'><label class='layui-form-label'>输入验证码</label>" +
                "<div class='layui-input-block'>" +
                "<input type='text' name='user' id='email_id'  placeholder='请输入验证码' class='layui-input'></div></div>" +
                "<div class='layui-form-item'><button class='layui-btn' type='submit' id='change_email_btn2'>立即提交</button>" +
                "</div></form></div>";

            common.syncRequest('bxg/user/personData', "GET", {teacherId: $(".home-user-name").attr("data-id")}, function (data, state) {
                $("#personal").html(template.compile(userdataTpl)(data));
                if (data.resultObject[0].login_type) {
                    $("#nick_name").val(data.resultObject[0].nick_name);
                    $("#email").val(data.resultObject[0].login_name);
                    $("#qq").val(data.resultObject[0].qq);
                } else {
                    $("#nick_name").val(data.resultObject[0].nick_name);
                    $("#mobile").val(data.resultObject[0].login_name);
                    $("#qq").val(data.resultObject[0].qq);
                }

            });

            //表单检验
            $("#userDataForm").validate({
                rules: {
                    nick_name: {required: true,maxlength:20},
                    mobile: {required: true, isMobile: true},
                    email: {required: true, email: true},
                    QQ: {required: true}
                },
                messages: {
                    nick_name: {required: '请输入用户名'},
                    mobile: {required: '请输入手机号'},
                    email: {required: '请输入邮箱'},
                    QQ: {required: '请输入QQ号'}
                },
                errorElement: "p"
            });
            $("#userDataForm").on("submit", function () {

                if ($("#userDataForm").valid()){
                    $(this).ajaxSubmit(
                        {
                            url: 'bxg/user/updateTeacher',                 //默认是form的action
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
                                console.log(data)
                                if (data.success) {
                                    //history.go(0);
                                    //window.location.href = "#/home";
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
                }


                return false; //阻止表单默认提交
            });

            //修改密码
            $(".change_password_btn").on("click", function () {
                layer.open({
                    type: 1,
                    title: false,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['500px', '416px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: change_password
                });
                //表单检验
                $("#change_password_form").validate({
                    rules : {
                        oldPassword : {
                            required : true
                        },
                        newPassword : {required : true},
                        hhfd:{required:true,equalTo: "#newPassword"}
                    },
                    messages : {
                        oldPassword : {required : '请输入旧密码'},
                        newPassword : {required : '请输入新密码'},
                        hhfd:{required:'请输入确认密码',
                            equalTo:'请再次输入相同的值'}

                    },
                    errorElement : "span"
                });

                $("#change_password_jiu").val($("#nick_name").val())


                $("#change_password_form").on("submit", function () {
                    if ($("#change_password_form").valid()){
                        $(this).ajaxSubmit(
                            {
                                url: 'bxg/user/updatePwd',                 //默认是form的action
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
                                        layer.msg('修改成功', {icon: 1});
                                        setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                            layer.closeAll()
                                        } ,2000);
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
                    }

                    return false; //阻止表单默认提交
                });

                //$("#change_password_form").ajaxSubmit(
                //    {
                //        url: 'bxg/user/updatePwd',                 //默认是form的action
                //        //type: type,               //默认是form的method（get or post）
                //        dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
                //        //clearForm: true,          //成功提交后，清除所有表单元素的值
                //        //resetForm: true,          //成功提交后，重置所有表单元素的值
                //        target: '#output',          //把服务器返回的内容放入id为output的元素中
                //        //timeout: 3000,               //限制请求的时间，当请求大于3秒后，跳出请求
                //        //提交前的回调函数
                //        beforeSubmit: function (arr, $form, options) {
                //            //formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]
                //            //jqForm:   jQuery对象，封装了表单的元素
                //            //options:  options对象
                //            //比如可以再表单提交前进行表单验证
                //            //console.log("beforeSubmit",arr,$form,options);
                //            //console.log("数据是:",arr[0].value != '' );
                //            //if(arr[0].value != '' || !arr[1].value != ''){
                //            //	return false;
                //            //}
                //        },
                //        //提交成功后的回调函数
                //        success: function (data, status, xhr, $form) {
                //            //console.log("success",data,status,xhr,$form);
                //            console.log(data)
                //
                //            if (data.success) {
                //                //history.go(0);
                //                //window.location.href = "#/home";
                //                return false
                //            }
                //        },
                //        error: function (xhr, status, error, $form) {
                //            //console.log("error",xhr, status, error, $form)
                //        },
                //        complete: function (xhr, status, $form) {
                //            //console.log("complete",xhr, status, $form)
                //        }
                //    }
                //);



            });


            //手机号
            $(".change_phone_btn").on("click", function () {
                layer.open({
                    type: 1,
                    title: '验证手机号',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['500px', '416px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: change_Email
                });

                $("#change_email_form").validate({
                    rules: {
                        email: {required: true,email: true}
                    },
                    messages: {
                        email: {required: '请输入邮箱'}
                    },
                    errorElement: "p"
                });

                $("#change_email_form").on("submit", function () {

                    if ($("#change_email_form").valid()){
                        var email = $("#change_Email").val();
                        $(this).ajaxSubmit(
                            {
                                url: 'bxg/common/checkEmail',                 //默认是form的action
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
                                        var emailyanzhengma = data.resultObject;
                                        layer.closeAll();
                                        layer.open({
                                            type: 1,
                                            title: '邮箱验证',
                                            skin: 'layui-layer-rim', //加上边框
                                            area: ['500px', '416px'], //宽高
                                            shadeClose: true,//开启遮罩关闭
                                            content: emailHtml
                                        });
                                        $("#change_email_form2").validate({
                                            rules: {
                                                user: {required: true}
                                            },
                                            messages: {
                                                user: {required: '请输入验证码'}
                                            },
                                            errorElement: "p"
                                        });
                                        $("#change_email_form2").on("submit", function () {
                                            if ($("#change_email_form2").valid()){
                                                debugger
                                                if ($.trim($("#email_id").val()) == emailyanzhengma){
                                                    layer.msg('验证成功', {icon: 1});
                                                    setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                                        layer.closeAll()
                                                        $("#mobile").val(email)
                                                    } ,2000);
                                                }else {
                                                    layer.msg('请输入正确的验证码', {icon: 5});
                                                }
                                            }
                                            return false; //阻止表单默认提交
                                        });
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
                    }


                    return false; //阻止表单默认提交
                });

                //$("#change_email_btn").on("click", function () {
                //    common.ajaxRequest('bxg/common/checkEmail', "GET", {email: $("#change_Email").val()}, function (data) {
                //        console.log(data)
                //    })
                //})
            });
        }

        return {
            createPage: createPage
        }
    });