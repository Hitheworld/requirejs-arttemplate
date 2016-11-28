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

            var Already_graduating_class_html = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items as i index}}" +
                "<tr><td data-id='{{i.id}}'>{{i.squad_name}}</td><td>{{i.stuCount}}</td><td>{{i.cosCount}}</td>" +
                "<td>{{i.end_time}}</td><td>{{i.create_time}}</td><td>" +
                "<button class='layui-btn' ><a href='#/teaching/myclass/student/{{i.id}}' style='color: #fff'>查看学生</a></button>" +
                "<button class='layui-btn set_course' data-id='{{i.id}}'>查看课程</button>" +
                "<button class='layui-btn Add_the_student_form_delete'>删除</button> </td></tr>" +
                "{{/each}}" +
                "{{else}}" +
                "" +
                "{{/if}}";

            var Already_graduating_class_html2 = "{{if success}}" +
                    "<table border='1' class='set_course_table'><tr><th>课程名称</th><th>合作时间</th><th>逾期时间</th></tr>" +
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
                        $(".myClass_table_val").html(template.compile(Already_graduating_class_html)(data));
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
                    }


                    $(".Add_the_student_form_delete").on("click", function () {
                        //询问框
                        layer.confirm('确定要删除该班级？删除操作，不可恢复！', {
                            btn: ['重要', '奇葩'] //按钮
                        }, function () {
                            layer.msg('删除成功', {icon: 1});
                        }, function () {
                            layer.closeAll()
                        });
                    });
                    $(".set_course").on("click", function (e) {
                        var eve = e || window.event;
                        common.ajaxRequest("bxg/teaching/squad/squadToCourse", "POST", {
                            squadId: $(eve.target).attr("data-id"),
                            teacherId: $(".home-user-name").attr("data-id")
                        }, function (data) {
                            layer.open({
                                type: 1,
                                title: '查看课程',
                                area: ['500px', '370px'], //宽高
                                shadeClose: true,//开启遮罩关闭
                                content:template.compile(Already_graduating_class_html2)(data)
                            });
                        });
                    })
                });
            }

            overSquadList(1, 5);
        }


        return {
            createPage: createPage
        }
    });