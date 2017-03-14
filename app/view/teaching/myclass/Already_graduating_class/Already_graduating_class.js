define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaching/myclass/Already_graduating_class/Already_graduating_class.html',
        'common',
        'api',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/myclass'
    ],
    function (template, $, layui, layer, laypage,
              Already_graduating_classTpl,
              common, api) {

        function createPage(page, childpage, pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            $(".layui-tab-title li").attr("class", "").each(function () {
                if ($(this).text() == "已毕业班级") {
                    $(this).attr("class", "layui-this")
                }
            });
            $(".layui-tab-content").html(Already_graduating_classTpl);

            common.ajaxRequest('bxg/teaching/squad/studyingSquadList', "POST", {
                teacherId: $(".home-user-name").attr("data-id"),
                pageNumber: 1,
                pageSize: 5
            }, function (data, state) {
                if (data.success) {
                    if (data.resultObject.items.length == 0) {
                        $("#Add_the_student").attr("disabled","disabled").css("background-color","#ccc");
                        $("#To_import_the_students").attr("disabled","disabled").css("background-color","#ccc");
                    }
                }
            });

            var Already_graduating_class_html = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items as i index}}" +
                "<tr><td data-id='{{i.id}}'>{{i.squad_name}}</td><td>{{i.stuCount}}</td><td>{{i.cosCount}}</td>" +
                "<td>{{i.end_time}}</td><td>{{i.create_time}}</td><td>" +
                "<a href='#/teaching/myclass/student/{{i.id}}' title='查看学生' style='color: #fff'><span id='cha1'><img src='./app/assets/images/myclass/006.png' id='cha' alt=''></span></a>" +
                "<a class='set_course' title='查看课程' data-id='{{i.id}}'><span id='kan1'><img src='./app/assets/images/myclass/004.png' id='kan' alt=''></span></a>" +
                "<a class='Add_tde_student_form_delete' data-id='{{i.id}}' title='删除'><span id='shan1'><img src='./app/assets/images/myclass/008.png' id='shan' alt=''></span></a> </td></tr>" +
                "{{/each}}" +
                "{{else}}" +
                "" +
                "{{/if}}";

            var Already_graduating_class_html2 = "{{if success}}" +
                    "<table class='set_course_table'><tr><td>课程名称</td><td>合作时间</td><td>逾期时间</td></tr>" +
                        "<tbody class='set_course_table_val'>" +
                        "{{each resultObject}}" +
                            "<tr>" +
                                "<td>{{$value.name}}</td>" +
                                "<td>{{$value.begin_time}}</td>" +
                                "<td>{{$value.end_time}}</td>" +
                            "</tr>" +
                        "{{/each}} " +
                        "</tbody>" +
                    "</table> {{else}}暂无数据{{/if}}"
                ;

            function overSquadList(curr, pageSize) {
                common.ajaxRequest('bxg/teaching/squad/overSquadList', "POST", {
                    teacherId: $(".home-user-name").attr("data-id"),
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    if (data.success) {
                        if (data.resultObject.items.length == 0){
                            $(".layui-tab-content").html("<div class='Temporarily_no_data'><img src='./app/assets/images/myclass/025.png' alt='das'><p>去创建班级吧 ~</p></div>");
                        }else {
                            $(".myClass_table_val").html(template.compile(Already_graduating_class_html)(data));
                            $(".myClass_table tr:even").addClass("myClass_table_tr");
                            //显示分页
                            laypage({
                                cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: parseInt(data.resultObject.totalpages), //总页数 parseInt(data.resultObject.totalpages)
                                curr: curr || 1, //当前页
                                skin: '#2cb82c',
                                jump: function (obj, first) { //触发分页后的回调
                                    if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                        overSquadList(obj.curr, pageSize);
                                    }
                                }
                            });
                            $(".Add_tde_student_form_delete").on("click", function () {
                                var _this = $(this);
                                //询问框
                                layer.confirm('确定要删除该班级？删除操作，不可恢复！', {
                                    shade: [0.6, '#000'],
                                    btn: ['确定', '取消'] //按钮
                                }, function (index) {
                                    common.ajaxRequest("bxg/teaching/squad/delSquad","POST",{
                                        squadId:_this.attr("data-id")
                                    },function(data){
                                        layer.close(index);
                                        if(data.success){
                                            overSquadList(curr, pageSize);
                                            layer.msg('删除成功', {icon: 1});
                                        }else {
                                            layer.msg('删除失败', {icon: 5});
                                        }
                                    });
                                }, function () {
                                    layer.closeAll()
                                });
                            });
                            $(".set_course").on("click", function (e) {
                                var _this = $(this);
                                common.ajaxRequest("bxg/teaching/squad/squadToCourse", "POST", {
                                    squadId: _this.attr("data-id"),
                                    teacherId: $(".home-user-name").attr("data-id")
                                }, function (data) {
                                    layer.open({
                                        type: 1,
                                        title: '查看课程',
                                        area: ['500px', '370px'], //宽高
                                        shade:0.6,     //遮罩颜色
                                        shadeClose: false,//开启遮罩关闭
                                        content:template.compile(Already_graduating_class_html2)(data)
                                    });
                                });
                            });
                            //图标变换
                            var cha1=document.getElementById("cha1"),cha=document.getElementById("cha");
                            //console.log("cha1");
                            cha.onmouseover =function(){
                                this.src="./app/assets/images/myclass/007.png";
                            };
                            cha.onmouseout=function(){
                                this.src="./app/assets/images/myclass/006.png";
                            };
                            //删除
                            var shan1=document.getElementById("shan1"),shan=document.getElementById("shan");
                            //console.log("shan");
                            shan.onmouseover =function(){
                                //alert("555");
                                this.src="./app/assets/images/myclass/001.png";
                            };
                            shan.onmouseout=function(){
                                this.src="./app/assets/images/myclass/008.png";
                            };
                            //查看
                            var　kan1=document.getElementById("kan1"),kan=document.getElementById("kan");
                            //console.log("shan");
                            kan.onmouseover =function(){
                                //alert("555");
                                this.src="./app/assets/images/myclass/005.png";
                            };
                            kan.onmouseout=function(){
                                this.src="./app/assets/images/myclass/004.png";
                            };
                        }
                    }
                });
            }

            overSquadList(1, 5);
            $("#open_a_class").attr("disabled","disabled").css("background-color","#ccc");
            $("#Add_the_student").attr("disabled","disabled").css("background-color","#ccc");
            $("#To_import_the_students").attr("disabled","disabled").css("background-color","#ccc");
        }


        return {
            createPage: createPage
        }
    });