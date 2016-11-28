define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/myclass/student/student.html',
        'text!tplUrl/teaching/myclass/student/student_table.html',
        "text!tplUrl/teaching/myclass/Add_the_student.html",
        'common',
        'laypage',
        'api',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/myclass'
    ],
    function (template, $, layui, layer,
              studentTpl, student_tableTpl, Add_the_studentTpl,
              common, laypage, api) {

        function createPage(page, childpage, pagenumber) {
            function studentList(group, curr, pageSize) {
                common.ajaxRequest('bxg/teaching/squad/studentList', "POST", {
                    squadId: pagenumber,
                    group: group || "",
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    $(".student_table_val").html(template.compile(student_tableTpl)(data))
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

                    //添加学生
                    var myclassname = data.resultObject.squad.squad_name;
                    $("#Add_the_student").unbind().on("click", function () {
                        layer.open({
                            type: 1,
                            title: '添加学生',
                            area: ['500px', '613px'], //宽高
                            shadeClose: true,//开启遮罩关闭
                            content: Add_the_studentTpl
                        });
                        common.ajaxRequest('bxg/teaching/squad/squadGroupList', "POST", {
                            squadId: pagenumber
                        }, function (con) {
                            $("#squad_id").val(pagenumber);
                            $("#Add_the_student_select_id1").append("<option data-id='' value=" + myclassname + ">" + myclassname + "</option>")
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
                                    required: true
                                },
                                password: {
                                    required: true
                                },
                                studentNo: {
                                    required: true
                                },
                                mobile: {
                                    required: true,
                                    isMobile: true
                                },
                                email: {
                                    required: true,
                                    email: true
                                }

                            },
                            messages: {
                                squad_name: {
                                    required: "请输入班级名称"
                                },
                                name: {
                                    required: "请输入学生姓名"
                                },
                                password: {
                                    required: "请输入密码"
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
                                            layer.msg('错误', {icon: 5});
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

                    //编辑学生
                    $(".compile_student").on("click", function (e) {
                        var eve = e || window.event,
                            strId = $(eve.target).attr("data-id");
                        common.ajaxRequest("bxg/teaching/squad/editStudent", "POST", {
                            studentId: strId
                        }, function (data) {
                            if (data.success) {
                                layer.open({
                                    type: 1,
                                    title: '编辑学生',
                                    area: ['500px', '613px'], //宽高
                                    shadeClose: true,//开启遮罩关闭
                                    content: Add_the_studentTpl
                                });
                                $("#student_id").val(strId);
                                $("#login_name").val(data.resultObject.login_name);
                                $("#squad_id").val(data.resultObject.squad_id);
                                $("#Add_the_student_select_id1").append("<option data-id='' value=" + myclassname + ">" + myclassname + "</option>");
                                $("#name").val(data.resultObject.name);
                                $("#password").val(data.resultObject.password);
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
                                            required: true
                                        },
                                        password: {
                                            required: true
                                        },
                                        studentNo: {
                                            required: true
                                        },
                                        mobile: {
                                            required: true,
                                            isMobile: true
                                        },
                                        email: {
                                            required: true,
                                            email: true
                                        }

                                    },
                                    messages: {
                                        squad_name: {
                                            required: "请输入班级名称"
                                        },
                                        name: {
                                            required: "请输入学生姓名"
                                        },
                                        password: {
                                            required: "请输入密码"
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
                                                    layer.msg('错误', {icon: 5});
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

                    //设置分组
                    $(".myClass_student_header2_dv").on("click", ".SetUpTheGroup", function (e) {
                        var eve = e || window.event,
                            str = $(eve.target).attr("data-type");
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
                    $(".SetUpTheGroup").on("click", ".myClass_student_header2_span1_X", function (e) {
                        var eve = e || window.event;
                        eve.stopPropagation();
                        layer.confirm('确定要删除分组？', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index) {
                            common.ajaxRequest("bxg/teaching/squad/delSquadGroup", "POST", {
                                squadId: pagenumber,
                                group: $(eve.target).attr("data-type")
                            }, function (data) {
                                if (data.success) {
                                    layer.close(index);
                                    $(eve.target).parent().remove();
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

                    //删除学生
                    $(".Delete_the_student").on("click", function (e) {
                        var eve = e || window.event;

                        layer.confirm('确定要删除学生？', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index) {
                            common.ajaxRequest("bxg/teaching/squad/deleteStudent", "POST", {
                                studentId: $(eve.target).attr("data-id"),
                                login_name: $(eve.target).attr("data-name")
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
                        $(eve.target).addClass("myClass_student_header1_this");
                        studentList($(eve.target).attr("data-tpye"), 1, 10);
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

                //下载学生名单
                $(".download_student").on("click",function(){
                    //common.ajaxRequest("bxg/teaching/squad/expStudent","POST",{
                    //    squadId:pagenumber
                    //},function(data){})
                    window.open("bxg/teaching/squad/expStudent?squadId="+pagenumber)
                });
                //添加分组
                $("#AddGroup").on("click", function () {
                    var GroupName = $(".myClass_student_header2_dv>span").length;
                    if (GroupName < 6) {
                        common.ajaxRequest("bxg/teaching/squad/addSquadGroup", "POST", {
                            squadId: pagenumber
                        }, function (data) {
                            if (data.success) {
                                $(".myClass_student_header2_dv").append("<span class='myClass_student_header2_span1 SetUpTheGroup' data-type=" + data.resultObject + ">设为" + data.resultObject + "组</span>");
                                $("#myClass_student_header2_select").append("<option value=" + data.resultObject + ">" + data.resultObject + "组</option>")
                            }
                        })
                    } else {
                        layer.msg("最多6个分组", {icon: 5})
                    }
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