/**
 *   考试管理
 */
define(['template',
        'jquery',
        'text!tplUrl/teaching/myclass/myclass.html',
        "text!tplUrl/teaching/myclass/Create_a_class.html",
        "text!tplUrl/teaching/myclass/Add_the_student.html",
        "text!tplUrl/teaching/myclass/To_import_the_students.html",
        "text!tplUrl/teaching/myclass/To_import_the_students2.html",
        "text!tplUrl/teaching/myclass/relevance_class.html",
        "text!tplUrl/teaching/myclass/join_the_class.html",
        'common',
        'layer',
        'layui',
        'api',
        'laypage',
		'jquery-ui-timepicker-zh-CN',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.form',
        'xvCalendar',
        'css!cssUrl/teaching.testcentres',
        'css!cssUrl/myclass'
    ],
    function (template, $,
              myclassTpl, Create_a_classTpl, Add_the_studentTpl, To_import_the_studentsTpl,To_import_the_students2Tpl,
              relevance_classTpl,join_the_classTpl,
              common, layer, layui, api,laypage) {

        function createPage(page, childpage, pagenumber) {
            document.title = "博学谷·院校-教师端我的班级";
            $("#teachingHtml").html(myclassTpl);
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            var join_the_class_html = '{{if resultObject.items.length != 0}}\
            {{each resultObject.items}}\
                <tr>\
                <td><input name="Fruit" type="radio" value="{{$value.id}}" data-name="{{$value.squad_name}}" />{{$value.squad_name}}</td>\
                <td>{{$value.stuCount}}</td>\
                <td>{{$value.end_time}}</td>\
                <td>{{$value.create_time}}</td>\
                </tr>\
                {{/each}}\
                {{else}}\
                暂无数据\
                {{/if}}';

            function join_the_class_add (college_id,department_id,subject_id,pageNumber,pageSize) {
                common.ajaxRequest("bxg/assoSquad/list","POST",{
                    college_id:college_id,
                    department_id:department_id,
                    subject_id:subject_id,
                    pageNumber:pageNumber,
                    pageSize:pageSize
                },function(data){
                    if (data.success){
                        if (data.resultObject.items.length != 0) {
                            $(".join_the_class_table_val").html(template.compile(join_the_class_html)(data));
                            $(".join_the_class_table_val tr").on("click",function(){
                                var _this = $(this);
                                _this.find("input").get(0).checked=true;
                            });
                            $(".myClass_table tr:even").addClass("myClass_table_tr");
                        } else {

                        }
                    }
                })
            }

            $("#open_a_class").on("click",function(e){
                if ($(".open_a_class").is(":hidden")) {
                    $(".open_a_class").css("display", "block");
                } else {
                    $(".open_a_class").css("display", "none");
                }
            });
            $(".open_a_class").hover(function(){},function(){$(".open_a_class").css("display", "none");});
            $(".Create_a_class").on("click", function () {
                layer.open({
                    type: 1,
                    skin:"Add_the_student_form_style",
                    title: '创建班级',
                    area: ['500px', '530px'], //宽高
                    shade:0.6,
                    shadeClose: false,//开启遮罩关闭
                    content: Create_a_classTpl
                });

                $("#department_name").bind("input propertychange",function(e){
                    if ($.trim($("#department_name").val())) {
                        common.ajaxRequest('bxg_anon/common/departMentList', "POST", {
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
                        common.ajaxRequest('bxg_anon/common/subjectList', "POST", {
                            subjectName:$.trim($("#subject").val())
                        },function(data){
                            $("#Create_a_class_select2").empty();
                            for (var i = 0; i < data.resultObject.length; i++) {
                                $("#Create_a_class_select2").append("<li data-id=" + data.resultObject[i].id + ">" + data.resultObject[i].subject_name + "</li>")
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
                            required: true
                        },
                        department_name:{
                            required: true
                        },
                        subject:{
                            required: true
                        },
                        grade:{
                            required: true
                        },
                        education:{
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
                        },
                        grade:{
                            required: "请选择年级"
                        },
                        education:{
                            required: "请选择学历"
                        }
                    },
                    errorElement: "p"
                });

                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var year = date.getFullYear();
                var month = date.getMonth() + 1,month2 = date.getMonth() + 1;
                var day = date.getDate();
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var yearST = year + 1;
                for (var o = 0;o < 6; o++) {
                    yearST--;
                    $(".join_the_class_select1").append("<option value="+yearST+">"+yearST+"级</option>")
                }

                //日历控件---开始时间
                var start = {//example 1 opts
                    'targetId':'start',//时间写入对象的id
                    'triggerId': 'start',//触发事件的对象id
                    'alignId':'start',//日历对齐对象
                    'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
                    'hms':'off',
                    'min':date.getFullYear() + seperator1 + month + seperator1 + strDate
                };
                xvDate(start);

                $(".join_the_class_select1,.join_the_class_select2").on("change",function(){
                    var aai = $(".join_the_class_select1 option:checked").val();
                    var aaj = $(".join_the_class_select2 option:checked").val();
                    if (!common.isnull(aai) && !common.isnull(aaj)){
                        if (aaj == "1"){
                            $("#start").val((parseInt(aai)+3)+"-"+7).blur();
                        }else {
                            $("#start").val((parseInt(aai)+4)+"-"+7).blur();
                        }
                    }
                });

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
                                    layer.closeAll();
                                    layer.msg("创建成功", {icon: 1});
                                    setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                        history.go(0);
                                        window.location.href = "#/teaching/myclass/Reading_class";
                                    } ,2000);
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

            });
            $(".relevance_class").on("click",function(){
                layer.open({
                    type: 1,
                    skin:"Add_the_student_form_style",
                    title: '关联班级',
                    area: ['500px', '370px'], //宽高
                    shade:0.6,
                    shadeClose: false,//开启遮罩关闭
                    content: relevance_classTpl
                });
                var mySchoolDB = mySchool();
                $("#teacher_id").val($(".home-user-name").attr("data-id"));
                $("#college_id").val(mySchoolDB.resultObject.id);
                $("#pattern2").val(mySchoolDB.resultObject.collegeName);
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
                    $("#subject_id").val($(eve.target).attr("data-id"));
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
                $("#department_name2").on("input propertychange", function (e) {
                    if ($.trim($("#department_name2").val())) {
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
                $("#relevance_class_form").validate({
                    rules: {
                        department_name:{
                            required: true
                        },
                        subject:{
                            required: true
                        }

                    },
                    messages: {
                        department_name:{
                            required: "请选择院系"
                        },
                        subject:{
                            required: "请选择专业"
                        }
                    },
                    errorElement: "p"
                });
                $("#relevance_class_form").on("submit",function(){
                    if ($("#relevance_class_form").valid()) {
                        $(this).ajaxSubmit({
                            url: 'bxg/assoSquad/list',                 //默认是form的action
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
                                    var index = layer.open({
                                        type: 1,
                                        skin:"Add_the_student_form_style",
                                        title: '加入班级',
                                        area: ['1000px', '800px'], //宽高
                                        shade:0.6,
                                        shadeClose: false,//开启遮罩关闭
                                        content: join_the_classTpl
                                    });
                                    var d = {},tdr = $('#relevance_class_form').serializeArray();
                                    $.each(tdr, function() {
                                        d[this.name] = this.value;
                                    });
                                    $(".join_the_class_table_val").html(template.compile(join_the_class_html)(data));
                                    $(".join_the_class_table_val tr").on("click",function(){
                                        var _this = $(this);
                                        _this.find("input").get(0).checked=true;
                                    });
                                    $(".myClass_table tr:even").addClass("myClass_table_tr");
                                    $(".join_the_class_last_step").click(function(){
                                        layer.close(index);
                                    });
                                    $(".join_the_class_lest").on("click",function(){
                                        var scv = $(".join_the_class_table_val input[name=Fruit]:checked").val();
                                        var scd = $(".join_the_class_table_val input[name=Fruit]:checked").data("name");
                                        if (!common.isnull(scv)){
                                            common.ajaxRequest("bxg/assoSquad/apply","POST",{
                                                apply_asso_squad:scv
                                            },function(data){
                                                if (data.success){
                                                    layer.closeAll();
                                                    layer.msg("欢迎加入"+scd+",加入班级需要创建者的同意,请耐心等待", {icon: 1});
                                                    setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                                        history.go(0);
                                                        window.location.href = "#/teaching/myclass/Reading_class";
                                                    } ,2000);
                                                }
                                            })
                                        }else {
                                            layer.msg('请选择班级', {icon: 5});
                                        }
                                    });
                                    laypage({
                                        cont: $('#page2'), //容器。值支持id名、原生dom对象，jquery对象,
                                        pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                                        curr: data.resultObject.currentPage || 1, //当前页
                                        skin: '#2cb82c',
                                        jump: function (obj, first) { //触发分页后的回调
                                            if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                                join_the_class_add(d.college_id,d.department_id,d.subject_id,obj.curr,10);
                                            }
                                        }
                                    });
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
            });
            $("#Add_the_student").on("click", function () {
                layer.open({
                    type: 1,
                    title: '添加学生',
                    area: ['500px', '570px'], //宽高
                    shade:0.6,
                    shadeClose: false,//开启遮罩关闭
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
                        studentNo:{
                            required: true,
                            words:true,
                            maxlength:30
                        },
                        mobile:{
                            required: true,
                            isMobile: true
                        },
                        email:{
                            required: true,
                            email:true,
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
                                    layer.closeAll();
                                    layer.msg("添加成功", {icon: 1});
                                    setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                                        history.go(0);
                                    } ,2000);
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
            });

            $("#To_import_the_students").on("click", function () {
                layer.open({
                    type: 1,
                    title: '批量导入学生',
                    area: ['500px', '360px'], //宽高
                    shade:0.6,
                    shadeClose: false,//开启遮罩关闭
                    content: To_import_the_students2Tpl
                });
                common.ajaxRequest('bxg/teaching/squad/noGraduateSquad', "POST",{
                    teacherId:$(".home-user-name").attr("data-id")
                },function(data){
                    if (data.success) {
                        var Add_the_student_select1 = $("#To_import_the_students_select");
                        Add_the_student_select1.empty().append("<option data-id='' value=''>请选择</option>");
                        $.each(data.resultObject,function(i,e){
                            Add_the_student_select1.append("<option data-id="+e.id+">"+e.squad_name+"</option>")
                        });
                        Add_the_student_select1.change(function(){
                            var aai = $("#To_import_the_students_select option:checked");
                            $("#To_import_the_students_form").attr("action","bxg/common/importExcelTemplate?squadId="+aai.attr("data-id"));
                        })
                    }
                });

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
                                                history.go(0);
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

        var mySchool = function () {
            return common.requestService('bxg/user/mySchool','get', {

            });
        };

        return {
            createPage: createPage
        }
    });