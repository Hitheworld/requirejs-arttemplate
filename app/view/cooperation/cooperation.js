/**
 *  合作
 */
define(['template',
        'jquery',
        'text!tplUrl/cooperation/cooperation.html',
        'text!tplUrl/cooperation/cooperation_alert.html',
        'text!tplUrl/common/login/popup.login.html',
        'text!tplUrl/course/details/popup.successful.html',
        'text!tplUrl/course/details/popup.review.html',
        'text!tplUrl/course/details/popup.faill.html',
        'popupLogin',
        'common',
        'layer',
        'layui',
        'css!cssUrl/cooperation'
    ],
    function (template,$,cooperationTpl,cooperation_alertTpl,
              popupLoginTpl,successfulTpl,reviewTpl,faillTpl,popupLogin,
              common,layer,layui,api) {

        function createPage() {

            $("#content").html(template.compile(cooperationTpl)({}));

            $(".cooperation_button").unbind().on("click",function(){
                var _this = $(this);
                if (teacherId == undefined) {
                    //页面层
                    layer.open({
                        type: 1,
                        title: false,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['500px', '500px'], //宽高
                        content: popupLoginTpl
                    });

                    //加载弹窗登录js文件;
                    popupLogin.popupLogin();
                }else {
                    if (indenty_status == "2") {//2
                        common.ajaxRequest("bxg/home/courseList","POST",{},function(data){
                            if (data.success) {
                                layer.open({
                                    type: 1,
                                    title: '合作申请单',
                                    area: ['500px', '300px'], //宽高
                                    shadeClose: false,//开启遮罩关闭
                                    scrollbar:false,
                                    content: cooperation_alertTpl
                                });
                                $("#pattern").val(_this.data("id"));
                                $("#pattern2").val(_this.data("type"));
                                var cooperation_alert_select = $("#cooperation_alert_select");
                                cooperation_alert_select.empty().append("<option data-id='' value=''>请选择</option>");
                                $.each(data.resultObject,function(i,e){
                                    cooperation_alert_select.append("<option data-id="+e.id+">"+e.name+"</option>")
                                });
                                cooperation_alert_select.change(function(){
                                    var aai = $("#cooperation_alert_select option:checked");
                                    $("#course_id").val(aai.attr("data-id"));
                                });
                                $("#cooperation_alert_form").validate({
                                    rules: {
                                        cooperation_alert_select: {
                                            required: true
                                        }
                                    },
                                    messages: {
                                        cooperation_alert_select: {
                                            required: "请选择"
                                        }

                                    },
                                    errorElement: "p"
                                });
                                $("#cooperation_alert_form").on("submit",function(){
                                    if ($("#cooperation_alert_form").valid()) {
                                        $(this).ajaxSubmit({
                                            url: 'bxg/course/addTeacherToCourse',                 //默认是form的action
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
                                                    layer.closeAll();
                                                    layer.msg('合作申请提交成功，工作人员会在2日之内联系你');
                                                }else {
                                                    layer.msg(data.errorMessage, {icon: 5});
                                                }
                                            },
                                            error: function(xhr, status, error, $form){
                                                //console.log("error",xhr, status, error, $form)
                                            },
                                            complete: function(xhr, status, $form){
                                                //console.log("complete",xhr, status, $form)
                                            }
                                        })
                                    }
                                    return false; //阻止表单默认提交
                                })
                            }else {
                                layer.msg('错误', {icon: 5});
                            }
                        });

                    }else if (indenty_status == "1") {
                        layer.alert('教师资格审核中，工作人员会在2日之内给出审核结果', {
                            icon: 1,
                            title: '操作提示',
                            btn:["我知道了"]
                        })
                    }else if (indenty_status == "0"){//0
                        //询问框
                        layer.confirm('合作之前,你需要先完成教师资格认证', {
                            title: '操作提示',
                            btn: ['取消','去认证'] //按钮
                        }, function(index){
                            layer.close(index)
                        }, function(index){
                            layer.close(index);
                            window.location.href = "#/personal/teaccert";
                        });
                    }else {
                        layer.msg('错误', {icon: 5});
                    }
                }
            })

        }

        //获取教师

        var indenty_status = $(".home-user-name").data("indenty_status");
        var teacherId = $(".home-user-name").data("id");
        console.log("教师ID是:",teacherId);

        return {
            createPage: createPage
        }
    });