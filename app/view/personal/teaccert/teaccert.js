define(['template',
        'jquery',
        'text!tplUrl/personal/teaccert/teaccert.html',
        'text!tplUrl/personal/teaccert/edit.teaccert.html',
        'text!tplUrl/personal/teaccert/success.teaccert.html',
        'common',
        'layer',
        'laypage',
        'layui',
        'api',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.form',
        'css!font-awesome',
        'css!cssUrl/personal.edit.teaccert',
        'css!cssUrl/personal.success.teaccert'
    ],
    function (template, $, teaccertTpl, editTeaccertTpl, successTeaccertTpl, common, layer, laypage, layui, api) {

        function createPage() {
            $(".personal_ul li").attr("class", "").each(function () {
                if ($(this).text() == "教师资格认证") {
                    $(this).attr("class", "personal_this")
                }
            });
            $("#personal").html(teaccertTpl);
            common.syncRequest('bxg/user/certification', "GET", {
                teacherId: $(".home-user-name").attr("data-id")
            }, function (data, state) {
                if (data.resultObject[0].indenty_status == 2) {
                    $("#teaccert").html(template.compile(successTeaccertTpl)(data));
                    if (!common.isnull(data.resultObject[0].certification_img)){
                        $(".success-teaccert-pic img").attr("src", data.resultObject[0].certification_img);
                    }
                    $("#username").text(data.resultObject[0].name);
                    if (data.resultObject[0].sex == 0) {
                        $("#sex").text("女");
                    } else {
                        $("#sex").text("男");
                    }
                    $("#college_id").val(data.resultObject[0].college_id);
                    $("#college_name").text(data.resultObject[0].college_name);
                    $("#department_id").val(data.resultObject[0].department_id);
                    $("#department_name").text(data.resultObject[0].department_name);
                    $("#subject").text(data.resultObject[0].subject);
                    $("#job_title").text(data.resultObject[0].job_title);
                } else {
                    $("#teaccert").html(template.compile(editTeaccertTpl)(data));
                    $("#teacher_id").val($(".home-user-name").attr("data-id"));
                    $("#name").val(data.resultObject[0].name);
                    if (data.resultObject[0].sex == 0) {
                        $("#sex0")[0].checked = true;
                    } else {
                        $("#sex1")[0].checked = true;
                    }
                    var college_name2 = data.resultObject[0].college_name;
                    $("#college_id").val(data.resultObject[0].college_id);
                    $("#college_name").val(data.resultObject[0].college_name);
                    var department_name2 = data.resultObject[0].department_name;
                    $("#department_id").val(data.resultObject[0].department_id);
                    $("#department_name").val(data.resultObject[0].department_name);
                    $("#subject").val(data.resultObject[0].subject);
                    $("#job_title").val(data.resultObject[0].job_title);
                    if (!common.isnull(data.resultObject[0].certification_img)){
                        $("#LAY_demo_upload").attr("src", data.resultObject[0].certification_img);
                    }

                    $("#UpLoadFile_hidden").val(data.resultObject[0].certification_img);
                    $("#college_name").on('click', function () {
                        $("#school-selete1").empty();
                        $(".college_name_dv1").css("display", "block");
                        $("#college_name").css("display", "none");
                        $("#college_name2").val("").focus();
                        //阻止事件冒泡
                        return false;
                    });
                    $(".J-school2").on("click",function(){
                        $(".school-selete2").empty();
                        $(".college_name_dv2").css("display", "block");
                        $(".J-school2").css("display", "none");
                        $("#department_name2").val("").focus();
                        //阻止事件冒泡
                        return false;
                    });
                    $(".J-school3").on("click",function(){
                        $(".school-selete3").empty();
                        $(".college_name_dv3").css("display", "block");
                        $(".J-school3").css("display", "none");
                        $("#subject2").val("").focus();
                        //阻止事件冒泡
                        return false;
                    });
                    //$(".college_name_dv1").hover(function () {
                    //}, function () {
                    //    $(".college_name_dv1").css("display", "none");
                    //    $("#college_name").css("display", "block");
                    //});
                    //$(".college_name_dv2").hover(function () {
                    //}, function () {
                    //    $(".college_name_dv2").css("display", "none");
                    //    $("#department_name").css("display", "block");
                    //});
                    //$(".college_name_dv3").hover(function () {
                    //}, function () {
                    //    $(".college_name_dv3").css("display", "none");
                    //    $("#subject").css("display", "block");
                    //});
                    $("#college_name2").blur(function(){
                        setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                $(".college_name_dv1").css("display", "none");
                                $("#college_name").css("display", "block");
                        } ,500);
                    });
                    $("#department_name2").blur(function(){
                        setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                            $(".college_name_dv2").css("display", "none");
                            $("#department_name").css("display", "block");
                        } ,500);
                    });
                    $("#subject2").blur(function(){
                        setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                            $(".college_name_dv3").css("display", "none");
                            $("#subject").css("display", "block");
                        } ,500);
                    });
                    $(".school-selete1").on("click","li", function (e) {
                        var eve = e || window.event;
                        $("#college_id").val($(eve.target).attr("data-id"));
                        $(".college_name_dv").css("display", "none");
                        $("#college_name").css("display", "block").val($(eve.target).html()).blur();
                    });
                    $(".school-selete2").on("click","li", function (e) {
                        var eve = e || window.event;
                        $("#department_id").val($(eve.target).attr("data-id"));
                        $(".college_name_dv").css("display", "none");
                        $(".J-school2").css("display", "block").val($(eve.target).html()).blur();
                    });
                    $(".school-selete3").on("click","li", function (e) {
                        var eve = e || window.event;
                        $(".college_name_dv").css("display", "none");
                        $(".J-school3").css("display", "block").val($(eve.target).html()).blur();
                    });
                    $("#college_name2").on("input propertychange", function (e) {
                        if ($.trim($("#college_name2").val())) {
                            console.log($("#college_name2").val());
                            common.ajaxRequest('bxg_anon/common/collegesList', "POST", {
                                collegeName:$.trim($("#college_name2").val())
                            },function(con){
                                if (con.success) {
                                    for (var i = 0; i < con.resultObject.length; i++) {
                                        $("#school-selete1").append("<li data-id=" + con.resultObject[i].id + " title="+con.resultObject[i].collegeName+">" + con.resultObject[i].collegeName + "</li>")
                                    }
                                }
                            })
                        }
                    });
                    //$("#college_name2").on("blur",function(){
                    //    $(".college_name_dv1").css("display", "none");
                    //    $("#college_name").css("display", "block");
                    //});
                    $("#department_name2").on("input propertychange", function (e) {
                        if ($.trim($("#department_name2").val())) {
                            console.log($("#department_name2").val());
                            common.ajaxRequest('bxg_anon/common/departMentList', "POST", {
                                departmentName:$.trim($("#department_name2").val())
                            },function(con){
                                if (con.success) {
                                    for (var i = 0; i < con.resultObject.length; i++) {
                                        $(".school-selete2").append("<li data-id=" + con.resultObject[i].id + " title="+con.resultObject[i].departmentName+">" + con.resultObject[i].departmentName + "</li>")
                                    }
                                }
                            })
                        }
                    });
                    //$("#department_name2").on("blur",function(){
                    //    $(".college_name_dv2").css("display", "none");
                    //    $("#department_name").css("display", "block");
                    //});
                    $("#subject2").on("input propertychange", function (e) {
                        if ($.trim($("#subject2").val())) {
                            console.log($("#subject2").val());
                            common.ajaxRequest('bxg_anon/common/subjectList', "POST", {
                                subjectName:$.trim($("#subject2").val())
                            },function(con){
                                if (con.success) {
                                    for (var i = 0; i < con.resultObject.length; i++) {
                                        $(".school-selete3").append("<li data-id=" + con.resultObject[i].id + " title="+con.resultObject[i].subject_name+">" + con.resultObject[i].subject_name + "</li>")
                                    }
                                }
                            })
                        }
                    });
                    //$("#subject2").on("blur",function(){
                    //    $(".college_name_dv3").css("display", "none");
                    //    $("#subject").css("display", "block");
                    //});


                    $("#Myform").validate();
                    $("#UpLoadFile").change(function () {
                        var filepath = $(this).val();
                        var extStart = filepath.lastIndexOf(".");
                        var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                        if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                            layer.msg("图片限于bmp,png,gif,jpeg,jpg格式", {icon: 2});
                        } else {
                            if (filepath) {
                                console.log(filepath);
                                $("#Myform").attr("action", "bxg_anon/common/upCertificationImg");
                                $("#Myform").submit();
                            }
                        }
                    });
                    $("#Myform").on("submit", function () {
                        $(this).ajaxSubmit(function (message) {
                            $("#LAY_demo_upload").attr("src", message.resultObject);
                            $("#UpLoadFile_hidden").val(message.resultObject)
                        });
                        return false;
                    });
                }

                //$(".mynews_content_span").on("click",function(){
                //	layer.open({
                //		type: 1,
                //		title: '消息详情',
                //		area: ['500px', '508px'], //宽高
                //		shadeClose: true,//开启遮罩关闭
                //		content: template.compile(mynews_alert)({content:$(this).attr("data-content")})
                //	});
                //});
            });


            //加载更多--展开所教专业
            $("#J-open-major").on('click', function () {
                $(".layui-input-block").css("max-height", "100%");
            });


            //表单检验
            $("#signupForm").validate({
                rules: {
                    name: {required: true},
                    college_name: {required: true},
                    department_name: {required: true},
                    subject: {required: true},
                    job_title: {required: true},
                    certification_img:{required: true}
                },
                messages: {
                    name: {required: '请输入用户名'},
                    college_name: {required: '请输入学校名称'},
                    department_name: {required: "请输入院系"},
                    subject: {required: "请输入专业"},
                    job_title: {required: "请输入职务"},
                    certification_img:{required: "请上传图片"}
                },
                errorElement: "p"
            });


            //表单系列化
            $('#signupForm').submit(function () {
                if ($("#signupForm").valid()) {
                    if ($("#college_id").val() != "" && $("#department_id").val() != "") {
                        if (!common.isnull($("#UpLoadFile_hidden").val())) {
                            $(this).ajaxSubmit(
                                {
                                    url: 'bxg/user/addOrUpdateTeacher',                 //默认是form的action
                                    //type: type,               //默认是form的method（get or post）
                                    dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
                                    method: "post",
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
                                            layer.msg("提交成功", {icon: 1});
                                        } else {
                                            layer.msg(data.success, {icon: 5});
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
                    } else {
                        layer.msg("请选择学校和院系", {icon: 5});
                    }
                }

                //系列化表单数据
                //var data = $(this).serialize();
                //if(!data.username || !data.sex || !data.school || !data.file){
                //	return false;
                //}
                //console.log(data,data.username);

                //反系列化表单
                //data.split('&').forEach(function(param){
                //	param = param.split('=');
                //	var name = param[0],
                //		val = param[1];
                //
                //	$('form [name=' + name + ']').val(val);
                //	console.log(name,val)
                //});
                return false;
            });


        }

        return {
            createPage: createPage
        }
    });