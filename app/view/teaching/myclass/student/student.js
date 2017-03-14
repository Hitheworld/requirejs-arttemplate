define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/myclass/student/student.html',
        'text!tplUrl/teaching/myclass/student/student_table.html',
        "text!tplUrl/teaching/myclass/Add_the_student.html",
        "text!tplUrl/teaching/myclass/Add_the_student2.html",
        "text!tplUrl/teaching/myclass/To_import_the_students.html",
        'common',
        'laypage',
        'api',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.form',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/myclass'
    ],
    function (template, $, layui, layer,
              studentTpl, student_tableTpl, Add_the_studentTpl,Add_the_student2Tpl,To_import_the_studentsTpl,
              common, laypage, api) {

        function createPage(page, childpage, pagenumber) {

            var optionhtml = "<option value=''>全部</option><option value='null'>无分组</option>" +
                "{{each resultObject.grouplist}}" +
                "<option data-id='{{$value.id}}' value='{{$value.group_name}}'>" +
            "{{$value.group_name}}组</option>{{/each}}";

            function studentList(group, curr, pageSize) {
                common.ajaxRequest('bxg/teaching/squad/studentList', "POST", {
                    squadId: pagenumber,
                    group: group || "",
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    $(".student_table_val").html(template.compile(student_tableTpl)(data));
                    $(".myClass_table tr:even").addClass("myClass_table_tr");
                    //显示分页
                    laypage({
                        cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                        pages: parseInt(data.resultObject.totPageCount), //总页数 parseInt(data.resultObject.totalpages)
                        curr: curr || 1, //当前页
                        skin: '#2cb82c',
                        jump: function (obj, first) { //触发分页后的回调
                            if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                studentList(group, obj.curr, pageSize);
                            }
                        }
                    });


                    var myclassname = data.resultObject.squad.squad_name;


                    //编辑学生
                    $(".compile_student").on("click", function (e) {
                        var eve = e || window.event,
                            strId = $(this).attr("data-id");
                        common.ajaxRequest("bxg/teaching/squad/editStudent", "POST", {
                            studentId: strId
                        }, function (data) {
                            if (data.success) {
                                layer.open({
                                    type: 1,
                                    title: '编辑学生',
                                    shade: [0.6, '#000'],
                                    area: ['500px', '510px'], //宽高
                                    shadeClose: false,//开启遮罩关闭
                                    content: Add_the_student2Tpl
                                });
                                $("#student_id").val(strId);
                                $("#login_name").val(data.resultObject.login_name);
                                $("#squad_id").val(data.resultObject.squad_id);
                                $("#Add_the_student_select_id1").append("<option data-id='' value=" + myclassname + ">" + myclassname + "</option>");
                                $("#name").val(data.resultObject.name);
                                $("#studentNo").val(data.resultObject.studentNo);
                                $("#mobile").val(data.resultObject.mobile);
                                $("#email").val(data.resultObject.email);
                                $("#qq").val(data.resultObject.qq);
                                common.syncRequest('bxg/teaching/squad/squadGroupList', "POST", {
                                    squadId: pagenumber
                                }, function (con) {
                                    var Add_the_student_select2 = $("#Add_the_student_select_id2");
                                    Add_the_student_select2.empty().append("<option data-id='' value=''>请选择</option>");
                                    $.each(con.resultObject, function (i, e) {
                                        Add_the_student_select2.append("<option>" + e.group_name + "</option>")
                                    });
                                    Add_the_student_select2.val(data.resultObject.group)
                                });
                                $("#Add_the_student_form").validate({
                                    rules: {
                                        squad_name: {
                                            required: true
                                        },
                                        name: {
                                            required: true,
                                            ABC:true
                                        },
                                        studentNo: {
                                            required: true,
                                            words:true,
                                            maxlength:30
                                        },
                                        mobile: {
                                            required: true,
                                            isMobile: true
                                        },
                                        email: {
                                            required: true,
                                            email: true,
                                            maxlength:30
                                        }

                                    },
                                    messages: {
                                        squad_name: {
                                            required: "请输入班级名称"
                                        },
                                        name: {
                                            required: "请输入学生姓名"
                                        },
                                        studentNo: {
                                            required: "请输入学号"
                                        },
                                        mobile: {
                                            required: "请输入手机号"
                                        },
                                        email: {
                                            required: "请输入邮箱"
                                        }

                                    },
                                    errorElement: "p"
                                });

                                $("#Add_the_student_form").on("submit", function () {
                                    if ($("#Add_the_student_form").valid()) {
                                        $(this).ajaxSubmit({
                                            url: 'bxg/teaching/squad/updateStudent',                 //默认是form的action
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
                                                    layer.closeAll();
                                                    layer.msg("更新成功", {icon: 1});
                                                    studentList(group, curr, pageSize);
                                                } else {
                                                    layer.msg(data.errorMessage, {icon: 5});
                                                }
                                            },
                                            error: function (xhr, status, error, $form) {
                                                //console.log("error",xhr, status, error, $form)
                                            },
                                            complete: function (xhr, status, $form) {
                                                //console.log("complete",xhr, status, $form)
                                            }
                                        })
                                    }
                                    return false; //阻止表单默认提交
                                })
                            }
                        })
                    });

                    //添加学生
                    $("#Add_the_student").unbind().on("click", function (e) {
                        layer.open({
                            type: 1,
                            title: '添加学生',
                            shade: [0.6, '#000'],
                            area: ['500px', '510px'], //宽高
                            shadeClose: false,//开启遮罩关闭
                            content: Add_the_student2Tpl
                        });
                        common.ajaxRequest('bxg/teaching/squad/squadGroupList', "POST", {
                            squadId: pagenumber
                        }, function (con) {
                            $("#squad_id").val(pagenumber);

                            //$("#Add_the_student_select_id1").append("<option data-id='' value=" + myclassname + ">" + myclassname + "</option>")
                            $("#Add_the_student_select_id1").val(myclassname);
                            var Add_the_student_select2 = $("#Add_the_student_select_id2");
                            Add_the_student_select2.empty().append("<option data-id='' value=''>请选择</option>");
                            $.each(con.resultObject, function (i, e) {
                                Add_the_student_select2.append("<option>" + e.group_name + "</option>")
                            });
                        });

                        $("#Add_the_student_form").validate({
                            rules: {
                                squad_name: {
                                    required: true
                                },
                                name: {
                                    required: true,
                                    ABC:true
                                },
                                studentNo: {
                                    required: true,
                                    words:true,
                                    maxlength:30
                                },
                                mobile: {
                                    required: true,
                                    isMobile: true
                                },
                                email: {
                                    required: true,
                                    email: true,
                                    maxlength:30
                                }

                            },
                            messages: {
                                squad_name: {
                                    required: "请输入班级名称"
                                },
                                name: {
                                    required: "请输入学生姓名"
                                },
                                studentNo: {
                                    required: "请输入学号"
                                },
                                mobile: {
                                    required: "请输入手机号"
                                },
                                email: {
                                    required: "请输入邮箱"
                                }

                            },
                            errorElement: "p"
                        });

                        $("#Add_the_student_form").on("submit", function () {
                            if ($("#Add_the_student_form").valid()) {
                                $(this).ajaxSubmit({
                                    url: 'bxg/teaching/squad/addStudent',                 //默认是form的action
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
                                            layer.closeAll();
                                            layer.msg("添加成功", {icon: 1});
                                            studentList(group, curr, pageSize);
                                        } else {
                                            layer.msg(data.errorMessage, {icon: 5});
                                        }
                                    },
                                    error: function (xhr, status, error, $form) {
                                        //console.log("error",xhr, status, error, $form)
                                    },
                                    complete: function (xhr, status, $form) {
                                        //console.log("complete",xhr, status, $form)
                                    }
                                })
                            }
                            return false; //阻止表单默认提交
                        })
                    });

                    //设置分组
                    $(".myClass_student_header2_dv").on("click", ".SetUpTheGroup", function (e) {
                        var _this = $(this),
                            str = _this.attr("data-type");
                        var cin = $(".student_table_val input:checkbox");
                        var arrue = [];
                        var i = 0;
                        for (var l = 0; l < cin.length; l++) {
                            if (cin[l].checked) {
                                i++;
                                arrue.push($(cin[l]).attr("data-id"))
                            }
                        }
                        if (i == 0) {
                            layer.msg('请选择学生', {icon: 5});
                        } else {
                            layer.confirm('确定要换组？', {
                                shade: [0.6, '#000'],
                                btn: ['确定', '取消'] //按钮
                            }, function (index) {
                                common.ajaxRequest("bxg/teaching/squad/updateStudentGroup", "POST", {
                                    group_name: str,
                                    studentIds: arrue.toString()
                                }, function (data) {
                                    if (data.success) {
                                        studentList(group, curr, pageSize);
                                        layer.close(index);
                                    }
                                })
                            }, function () {
                                layer.closeAll()
                            });
                        }
                    });

                    //删除分组
                    $(".SetUpTheGroup").unbind().on("click", ".myClass_student_header2_span1_X", function (e) {
                        var eve = e || window.event;
                        var _this = $(this);
                        eve.stopPropagation();
                        layer.confirm('确定要删除该分组？删除后，该分组下的学员将不属于任何分组。', {
                            shade: [0.6, '#000'],
                            btn: ['确定', '取消'] //按钮
                        }, function (index) {
                            common.ajaxRequest("bxg/teaching/squad/delSquadGroup", "POST", {
                                squadId: pagenumber,
                                group: _this.attr("data-type")
                            }, function (data) {
                                if (data.success) {
                                    layer.close(index);
                                    _this.parent().remove();
                                    common.ajaxRequest('bxg/teaching/squad/studentList', "POST", {
                                        squadId: pagenumber,
                                        group: "",
                                        pageNumber: 1,
                                        pageSize: 10
                                    }, function (con, state) {
                                        $("#myClass_student_header2_select").html(template.compile(optionhtml)(con));
                                    });
                                    studentList(group, curr, pageSize);
                                }else {
                                    layer.close(index);
                                    layer.msg('错误', {icon: 5});
                                }
                            })


                        }, function () {
                            layer.closeAll()
                        });
                    });

                    //添加分组
                    $("#AddGroup").unbind().on("click", function () {
                        var GroupName = $(".myClass_student_header2_dv>span").length;
                        if (GroupName < 6) {
                            common.ajaxRequest("bxg/teaching/squad/addSquadGroup", "POST", {
                                squadId: pagenumber
                            }, function (data) {
                                if (data.success) {
                                    $(".myClass_student_header2_dv").append("<span class='myClass_student_header2_span1 SetUpTheGroup'" +
                                        " data-type=" + data.resultObject + ">设为" + data.resultObject + "组<span class='myClass_student_header2_span1_X'" +
                                        " data-type=" + data.resultObject + ">×</span></span>");
                                    $("#myClass_student_header2_select").append("<option value=" + data.resultObject + ">" + data.resultObject + "组</option>");
                                    studentList(group, curr, pageSize);
                                }
                            })
                        } else {
                            layer.msg("最多6个分组", {icon: 5})
                        }
                    });

                    //删除学生
                    $(".Delete_the_student").on("click", function (e) {
                        var _this = $(this);

                        layer.confirm('确定要删除学生？', {
                            shade: [0.6, '#000'],
                            btn: ['确定', '取消'] //按钮
                        }, function (index) {
                            common.ajaxRequest("bxg/teaching/squad/deleteStudent", "POST", {
                                studentId: _this.attr("data-id"),
                                login_name: _this.attr("data-name")
                            }, function (data) {
                                if (data.success) {
                                    studentList(group, curr, pageSize);
                                    layer.close(index);
                                }else {
                                    layer.close(index);
                                    layer.msg('错误', {icon: 5});
                                }
                            })
                        }, function () {
                            layer.closeAll()
                        });
                    });

                    //筛选学生
                    $(".myClass_student_header1 span").on("click",function(e){
                        var eve = e || window.event;
                        var stu = $(".myClass_student_header1 span");
                        stu.removeClass("myClass_student_header1_this");
                        $(this).addClass("myClass_student_header1_this");
                        studentList($(this).attr("data-tpye"), 1, 10);
                    });

                    //重置密码
                    $(".Reset_Password").on("click",function(){
                        var _this = $(this);
                        layer.open({
                            shade: [0.6, '#000'],
                            content: "<div style='text-align: center'>确定要重置密码吗？<br/>重置后的密码为123456<br/><p style='color: red'>为保障账号的安全，学生应该尽快修改自己的密码。</p></div>"
                            ,btn: ['确定', '取消']
                            ,btn1: function(index, layero){
                                //按钮【按钮一】的回调
                                common.ajaxRequest("bxg/teaching/squad/resetPwd","POST",{
                                    loginName:_this.attr("data-id")
                                },function(con){
                                    if(con.success){
                                        layer.closeAll();
                                        layer.msg("密码重置成功", {icon: 1});
                                    }else {
                                        layer.close(index);
                                        layer.msg('重置失败', {icon: 5});
                                    }
                                })

                            },btn2: function(index, layero){
                                //按钮【按钮二】的回调
                                layer.close(index)
                            }
                        });
                    })
                });
            }

            //初始化
            common.ajaxRequest('bxg/teaching/squad/studentList', "POST", {
                squadId: pagenumber,
                group: "",
                pageNumber: 1,
                pageSize: 10
            }, function (data, state) {
                $(".myClass").html(template.compile(studentTpl)(data));
                studentList("", 1, 10);

                //批量添加学生

                $("#To_import_the_students").on("click", function (e) {
                    var eve = e || window.event,
                        strId = $(this).attr("data-type");
                    layer.open({
                        type: 1,
                        shade: [0.6, '#000'],
                        title: '批量导入学生',
                        area: ['500px', '300px'], //宽高
                        shadeClose: false,//开启遮罩关闭
                        content: To_import_the_studentsTpl
                    });

                    //var Add_the_student_select1 = $("#To_import_the_students_select");
                    //Add_the_student_select1.empty().append("<option>"+strId+"</option>");
                    $("#To_import_the_students_form").attr("action","bxg/common/importExcelTemplate?squadId="+pagenumber);

                    $(".download_template").click(function(){
                        window.open("bxg_anon/common/excelTemplateDownload");
                        //$("#To_import_the_students_xz").hide();
                        //$("#To_import_the_students_sc").show();
                        //$("#To_import_the_students_form button").css("display","block");
                    });
                    //$("#UpLoadFile").change(function(){
                    //    setTimeout(function(){
                    //        $(this).blur();
                    //    },200);
                    //});

                    $("#To_import_the_students_form").validate({
                        rules: {
                            //squad_name: {
                            //    required: true
                            //},
                            UpLoadFile: {
                                required: true
                            }
                        },
                        messages: {
                            //squad_name: {
                            //    required: "请选择班级"
                            //},
                            UpLoadFile: {
                                required: ""
                            }

                        },
                        errorElement: "p"
                    });

                    $("#To_import_the_students_form").on("submit",function(){
                        if ($("#To_import_the_students_form").valid()) {
                            var filepath = $("#UpLoadFile").val();
                            var extStart = filepath.lastIndexOf(".");
                            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                            if (ext != ".XLS" && ext != ".XLSX") {
                                layer.msg("仅限于xlsx,xls格式", {icon: 2});
                            } else {
                                if (filepath) {
                                    $(this).ajaxSubmit({
                                        //url: 'bxg/teaching/squad/addStudent',                 //默认是form的action
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
                                                layer.msg("添加成功", {icon: 1});
                                                setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                                    window.location.href = "#/teaching/myclass/Reading_class";
                                                } ,2000);
                                            }else {
                                                $("#To_import_the_students_err").text(data.errorMessage).css("display","block");
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
                            }

                        }
                        return false; //阻止表单默认提交
                    })
                });

                //下载学生名单
                $(".download_student").on("click",function(){
                    //common.ajaxRequest("bxg/teaching/squad/expStudent","POST",{
                    //    squadId:pagenumber
                    //},function(data){})
                    window.open("bxg/teaching/squad/expStudent?squadId="+pagenumber)
                });

                //筛选分组
                $("#myClass_student_header2_select").on("change", function () {
                    var select_this = $("#myClass_student_header2_select option:checked");
                    studentList(select_this.val(), 1, 10);
                });


            });
        }

        return {
            createPage: createPage
        }
    });