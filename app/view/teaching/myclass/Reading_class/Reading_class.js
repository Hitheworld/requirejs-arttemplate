
define(['template',
        'jquery',
        'layui',
        'layer',
        "text!tplUrl/teaching/myclass/Create_a_class.html",
        'text!tplUrl/teaching/myclass/Reading_class/Reading_class.html',
        'text!tplUrl/teaching/myclass/set_course.html',
        "text!tplUrl/teaching/myclass/Add_the_student.html",
        'common',
        'laypage',
        'api',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/teaching.testcentres',
        'css!cssUrl/myclass'
    ],
    function (template,$,layui,layer,
              Create_a_classTpl,Reading_classTpl,set_courseTpl,Add_the_studentTpl,
              common,laypage,api) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            $(".layui-tab-title li").attr("class","").each(function(){
                if ($(this).text() == "在读班级") {
                    $(this).attr("class","layui-this")
                }
            });
            $(".layui-tab-content").html(Reading_classTpl);

            var Reading_class_html = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items as i index}}<tr><td data-id='{{i.id}}'>{{i.squad_name}}</td>" +
                "<td>{{i.stuCount}}</td><td>{{i.cosCount}}</td><td>{{i.end_time}}</td><td>{{i.create_time}}</td><td>" +
                "{{if i.stuCount > 0}}" +
                "<button class='layui-btn'><a href='#/teaching/myclass/student/{{i.id}}' style='color: #fff'>管理学生</a></button>" +
                "<button class='layui-btn set_course' data-id='{{i.id}}'>设置课程</button>" +
                "<button class='layui-btn compile' data-id='{{i.id}}'>编辑</button></td></tr>" +
                "{{else}}" +
                "<button class='layui-btn Add_the_student' data-name='{{i.squad_name}}' data-id='{{i.id}}'>添加学生</button>" +
                "<button class='layui-btn set_course' data-id='{{i.id}}'>设置课程</button>" +
                "<button class='layui-btn deleteSquad' data-id='{{i.id}}'>删除</button></td></tr>" +
                "{{/if}}" +
                "{{/each}}{{else}}暂无数据{{/if}}";

            function studyingSquadList ( curr, pageSize) {
                common.ajaxRequest('bxg/teaching/squad/studyingSquadList', "POST", {
                    teacherId:$(".home-user-name").attr("data-id"),
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    if (data.success){
                        $(".myClass_table_val").html(template.compile(Reading_class_html)(data));
                        //显示分页
                        laypage({
                            cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                            pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                            curr: curr || 1, //当前页
                            skin: '#2cb82c',
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    studyingSquadList(obj.curr, pageSize);
                                }
                            }
                        });
                    }

                    //设置课程
                    $(".set_course").on("click",function(e){
                        var eve = e || window.event;
                        var squadId  = $(eve.target).attr("data-id");
                        common.ajaxRequest("bxg/teaching/squad/courseListBySquad","POST",{
                            squadId:squadId,
                            teacherId:$(".home-user-name").attr("data-id")
                        },function(con){
                            layer.open({
                                type: 1,
                                title: '设置课程',
                                area: ['500px', 'auto'], //宽高
                                shadeClose: true,//开启遮罩关闭
                                content:template.compile(set_courseTpl)(con)
                            });

                            $(".set_course_btn").on("click",function(){
                                var cin = $(".set_course_table_val input:checkbox");
                                var arrue = [];
                                for(var l=0; l<cin.length; l++){
                                    if (cin[l].checked){
                                        arrue.push($(cin[l]).attr("data-id"))
                                    }
                                }
                                //询问框
                                layer.confirm('确定要将选中课程与该班级关联么？', {
                                    btn: ['确定','取消'] //按钮
                                }, function(index){
                                    common.ajaxRequest("bxg/teaching/squad/setCourseToSquad","POST",{
                                        squadId:squadId,
                                        teacherId:$(".home-user-name").attr("data-id"),
                                        courseIds:arrue.toString()
                                    },function(setCourseToSquaddata){
                                        if(data.success){
                                            layer.closeAll();
                                            layer.msg('关联成功', {icon: 1});
                                        }else {
                                            layer.msg('关联失败', {icon: 5});
                                        }
                                    })
                                }, function(index){
                                    layer.close(index);
                                });

                            })
                        });
                    });

                    //删除该班级
                    $(".deleteSquad").on("click",function(e){
                        var eve = e || window.event;
                        //询问框
                        layer.confirm('确定要删除该班级？删除操作，不可恢复！', {
                            btn: ['确定','取消'] //按钮
                        }, function(){
                            common.ajaxRequest("bxg/teaching/squad/deleteSquad","POST",{
                                squadId:$(eve.target).attr("data-id")
                            },function(data){
                                if(data.success){
                                    studyingSquadList(curr, pageSize);
                                    layer.msg('删除成功', {icon: 1});
                                }else {
                                    layer.msg('删除失败', {icon: 5});
                                }
                            });
                        }, function(){
                            layer.closeAll()
                        });
                    });

                    //编辑班级
                    $(".compile").on("click",function(e){
                        var eve = e || window.event;
                        var Create_a_class_id = $(eve.target).attr("data-id");
                        common.ajaxRequest("bxg/teaching/squad/editSquad","POST",{
                            squadId:$(eve.target).attr("data-id")
                        },function(data){
                            if (data.success){
                                layer.open({
                                    type: 1,
                                    title: '编辑班级',
                                    area: ['500px', 'auto'], //宽高
                                    shadeClose: true,//开启遮罩关闭
                                    content:Create_a_classTpl
                                });
                                $("#Create_a_class_id").val(Create_a_class_id);
                                $("#squad_name").val(data.resultObject.squad_name);
                                $("#start").val(data.resultObject.end_time);
                                $("#department_id").val(data.resultObject.department_id);
                                $("#department_name").val(data.resultObject.department_name);
                                $("#subject_id").val(data.resultObject.subject_id);
                                $("#subject").val(data.resultObject.subject);

                                $("#department_name").bind("input propertychange",function(e){
                                    if ($.trim($("#department_name").val())) {
                                        common.ajaxRequest('bxg/common/departMentList', "POST", {
                                            departmentName:$.trim($("#department_name").val())
                                        },function(con){
                                            $("#Create_a_class_select1").empty();
                                            for (var i = 0; i < con.resultObject.length; i++) {
                                                $("#Create_a_class_select1").append("<li data-id=" + con.resultObject[i].id + ">" + con.resultObject[i].departmentName + "</li>")
                                            }
                                            //选择事件---选择学校
                                            var oSelect = $("#department_name");
                                            var oSub = $("#Create_a_class_select1");
                                            var aLi = $("#Create_a_class_select1 li");
                                            oSelect.on('click', function(event){
                                                oSub.toggle();
                                                //阻止事件冒泡
                                                return false;
                                            });
                                            for (i = 0; i < aLi.length; i++)
                                            {
                                                //鼠标划过
                                                aLi[i].onmouseover = function ()
                                                {
                                                    this.className = "hover"
                                                };
                                                //鼠标离开
                                                aLi[i].onmouseout = function ()
                                                {
                                                    this.className = "";
                                                };
                                                //鼠标点击
                                                aLi[i].onclick = function ()
                                                {
                                                    var v = this.innerHTML;
                                                    //console.log(v)
                                                    oSelect.val(v);
                                                    $("#department_id").val($(this).attr("data-id"));
                                                }
                                            }

                                            aLi.on("click",function(e){
                                                var eve = e || window.event;
                                                oSelect.val($(this).html())
                                            });
                                            $(document).on('click', function(){
                                                oSub.hide();
                                            });
                                        });
                                    }
                                });

                                $("#subject").bind("input propertychange",function(e){
                                    if ($.trim($("#subject").val())) {
                                        common.ajaxRequest('bxg/common/subjectList', "POST", {
                                            subjectName:$.trim($("#subject").val())
                                        },function(con){
                                            $("#Create_a_class_select2").empty();
                                            for (var i = 0; i < con.resultObject.length; i++) {
                                                $("#Create_a_class_select2").append("<li data-id=" + con.resultObject[i].id + ">" + con.resultObject[i].departmentName + "</li>")
                                            }
                                            //选择事件---选择学校
                                            var oSelect = $("#subject");
                                            var oSub = $("#Create_a_class_select2");
                                            var aLi = $("#Create_a_class_select2 li");
                                            oSelect.on('click', function(event){
                                                oSub.toggle();
                                                //阻止事件冒泡
                                                return false;
                                            });
                                            for (i = 0; i < aLi.length; i++)
                                            {
                                                //鼠标划过
                                                aLi[i].onmouseover = function ()
                                                {
                                                    this.className = "hover"
                                                };
                                                //鼠标离开
                                                aLi[i].onmouseout = function ()
                                                {
                                                    this.className = "";
                                                };
                                                //鼠标点击
                                                aLi[i].onclick = function ()
                                                {
                                                    var v = this.innerHTML;
                                                    //console.log(v)
                                                    oSelect.val(v);
                                                    $("#subject_id").val($(this).attr("data-id"));
                                                }
                                            }

                                            aLi.on("click",function(e){
                                                var eve = e || window.event;
                                                oSelect.val($(this).html())
                                            });
                                            $(document).on('click', function(){
                                                oSub.hide();
                                            });
                                        });
                                    }
                                });


                                $("#Create_a_class_form").validate({
                                    rules: {
                                        squad_name: {
                                            required: true
                                        },
                                        end_time: {
                                            required: true,
                                            dateISO:true
                                        },
                                        department_name:{
                                            required: true
                                        },
                                        subject:{
                                            required: true
                                        }

                                    },
                                    messages: {
                                        squad_name: {
                                            required: "请输入班级名称"
                                        },
                                        end_time: {
                                            required: "请输入毕业时间"
                                        },
                                        department_name:{
                                            required: "请输入院系"
                                        },
                                        subject:{
                                            required: "请输入专业"
                                        }
                                    },
                                    errorElement: "p"
                                });
                                //日历控件---开始时间
                                var start = {//example 1 opts
                                    'targetId':'start',//时间写入对象的id
                                    'triggerId': 'start',//触发事件的对象id
                                    'alignId':'start',//日历对齐对象
                                    'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
                                    'hms':'off'
                                };
                                xvDate(start);

                                $("#Create_a_class_form").on("submit",function(){
                                    if ($("#Create_a_class_form").valid()) {
                                        $(this).ajaxSubmit({
                                            url: 'bxg/teaching/squad/updateSquad',                 //默认是form的action
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
                                                    layer.msg("修改成功", {icon: 1});
                                                    setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                                        layer.closeAll();
                                                    } ,2000);
                                                }else {
                                                    layer.msg('错误', {icon: 5});
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
                                layer.alert("请登录!")
                            }
                        });
                    });

                    //添加学生
                    $(".Add_the_student").on("click", function (e) {
                        var eve = e || window.event;
                        layer.open({
                            type: 1,
                            title: '添加学生',
                            area: ['500px', '613px'], //宽高
                            shadeClose: true,//开启遮罩关闭
                            content: Add_the_studentTpl
                        });
                        common.ajaxRequest('bxg/teaching/squad/squadGroupList', "POST", {
                            squadId: $(eve.target).attr("data-id")
                        }, function (con) {
                            $("#squad_id").val($(eve.target).attr("data-id"));
                            $("#Add_the_student_select_id1").append("<option data-id='' value=" + $(eve.target).attr("data-name") + ">" + $(eve.target).attr("data-name") + "</option>")
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
                                            studyingSquadList(curr, pageSize);
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
                });
            }

            studyingSquadList (1,5);
        }



        return {
            createPage: createPage
        }
    });