/**
 *   考试管理
 */
define(['template',
        'jquery',
        'text!tplUrl/teaching/myclass/myclass.html',
        "text!tplUrl/teaching/myclass/Create_a_class.html",
        "text!tplUrl/teaching/myclass/Add_the_student.html",
        "text!tplUrl/teaching/myclass/To_import_the_students.html",
        'common',
        'layer',
        'layui',
        'api',
        'jquery.form',
        'jquery.validate',
        'jquery.validate.zh',
        'xvCalendar',
        'css!cssUrl/teaching.testcentres',
        'css!cssUrl/myclass'
    ],
    function (template, $,
              myclassTpl, Create_a_classTpl, Add_the_studentTpl, To_import_the_studentsTpl,
              common, layer, layui, api) {

        function createPage(page, childpage, pagenumber) {
            document.title = "博学谷·院校-教师端我的班级";
            $("#teachingHtml").html(myclassTpl);
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            $(".teaching").css("position", "relative");
            $(".teachingBox").css("background-color", "#f6f6f6");
            $(".teachingBox").css("position", "relative");
            $(".teaching-nav").show();
            $(".testcentres-nav").show();

            $("#Create_a_class").on("click", function () {
                layer.open({
                    type: 1,
                    title: '创建班级',
                    area: ['500px', 'auto'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: Create_a_classTpl
                });

                $("#department_name").bind("input propertychange",function(e){
                    if ($.trim($("#department_name").val())) {
                        common.ajaxRequest('bxg/common/departMentList', "POST", {
                            departmentName:$.trim($("#department_name").val())
                        },function(data){
                            $("#Create_a_class_select1").empty();
                            for (var i = 0; i < data.resultObject.length; i++) {
                                $("#Create_a_class_select1").append("<li data-id=" + data.resultObject[i].id + ">" + data.resultObject[i].departmentName + "</li>")
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
                        },function(data){
                            $("#Create_a_class_select2").empty();
                            for (var i = 0; i < data.resultObject.length; i++) {
                                $("#Create_a_class_select2").append("<li data-id=" + data.resultObject[i].id + ">" + data.resultObject[i].departmentName + "</li>")
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
                            url: 'bxg/teaching/squad/addSquad',                 //默认是form的action
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
                                    layer.msg("创建成功", {icon: 1});
                                    setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                        history.go(0);
                                        window.location.href = "#/teaching/myclass/Reading_class";
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

            });


            $("#Add_the_student").on("click", function () {
                layer.open({
                    type: 1,
                    title: '添加学生',
                    area: ['500px', '613px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: Add_the_studentTpl
                });
                common.ajaxRequest('bxg/teaching/squad/noGraduateSquad', "POST",{
                    teacherId:$(".home-user-name").attr("data-id")
                },function(data){
                    if (data.success) {
                        var Add_the_student_select1 = $("#Add_the_student_select_id1");
                        Add_the_student_select1.empty().append("<option data-id='' value=''>请选择</option>");
                        $.each(data.resultObject,function(i,e){
                            Add_the_student_select1.append("<option data-id="+e.id+">"+e.squad_name+"</option>")
                        });
                        Add_the_student_select1.change(function(){
                            var aai = $("#Add_the_student_select_id1 option:checked");
                            $("#squad_id").val(aai.attr("data-id"));
                            common.ajaxRequest('bxg/teaching/squad/squadGroupList', "POST",{
                                squadId:aai.attr("data-id")
                            },function(con){
                                var Add_the_student_select2 = $("#Add_the_student_select_id2");
                                Add_the_student_select2.empty().append("<option data-id='' value=''>请选择</option>");
                                $.each(con.resultObject,function(i,e){
                                    Add_the_student_select2.append("<option>"+e.group_name+"</option>")
                                });
                            })
                        })
                    }
                });

                $("#Add_the_student_form").validate({
                    rules: {
                        squad_name: {
                            required: true
                        },
                        name: {
                            required: true
                        },
                        password:{
                            required: true
                        },
                        studentNo:{
                            required: true
                        },
                        mobile:{
                            required: true,
                            isMobile: true
                        },
                        email:{
                            required: true,
                            email:true
                        }

                    },
                    messages: {
                        squad_name: {
                            required: "请输入班级名称"
                        },
                        name: {
                            required: "请输入学生姓名"
                        },
                        password:{
                            required: "请输入密码"
                        },
                        studentNo:{
                            required: "请输入学号"
                        },
                        mobile:{
                            required: "请输入手机号"
                        },
                        email:{
                            required: "请输入邮箱"
                        }

                    },
                    errorElement: "p"
                });

                $("#Add_the_student_form").on("submit",function(){
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
                                    layer.msg("添加成功", {icon: 1});
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
            });

            $("#To_import_the_students").on("click", function () {
                layer.open({
                    type: 1,
                    title: '批量导入学生',
                    area: ['500px', '277px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: To_import_the_studentsTpl
                });
                $(".download_template").click(function(){
                    window.open("bxg/common/excelTemplateDownload")
                })
            });


            //处理子页面
            this.childCreatePage = function (page, childpage, pagenumber) {
                require(['tplUrl/teaching/' + page + '/' + childpage + '/' + childpage], function (m) {
                    m.createPage(page, childpage, pagenumber);
                    if (pagenumber != undefined) {
                        m.subPageCreatePage(page, childpage, pagenumber);
                    }
                });
            }

        }

        return {
            createPage: createPage
        }
    });