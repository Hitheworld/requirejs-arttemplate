
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/myclass/Reading_class/Reading_class.html',
        'text!tplUrl/teaching/myclass/set_course.html',
        'common',
        'api',
        'css!cssUrl/myclass'
    ],
    function (template,$,layui,layer,
              Reading_classTpl,set_courseTpl,
              common,api) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            $(".layui-tab-title li").attr("class","").each(function(){
                if ($(this).text() == "在读班级") {
                    $(this).attr("class","layui-this")
                }
            });
            common.ajaxRequest('bxg/teaching/squad/squadList', "GET", {
                teacherId:$(".home-user-name").attr("data-id")
            }, function (data, state) {
                console.log(data)
                $(".myClass_table_val").html(template.compile(Reading_classTpl)(data))
            });

            $(".set_course").on("click",function(){
                layer.open({
                    type: 1,
                    title: '设置课程',
                    area: ['500px', '370px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: set_courseTpl
                });
                $(".layui-btn-primary").click();
            })
        }



        return {
            createPage: createPage
        }
    });