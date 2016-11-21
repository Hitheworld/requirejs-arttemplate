
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/myclass/Already_graduating_class/Already_graduating_class.html',
        'text!tplUrl/teaching/myclass/set_course.html',
        'common',
        'api',
        'css!cssUrl/myclass'
    ],
    function (template,$,layui,layer,
              Already_graduating_classTpl,set_courseTpl,
              common,api) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            $(".layui-tab-title li").attr("class","").each(function(){
                if ($(this).text() == "已毕业班级") {
                    $(this).attr("class","layui-this")
                }
            });
            common.syncRequest('./app/data/myTable.json', "GET", {}, function (data, state) {
                $(".myClass_table_val").html(template.compile(Already_graduating_classTpl)(data))
            });

            $(".Add_the_student_form_delete").on("click",function(){
                //询问框
                layer.confirm('确定要删除该班级？删除操作，不可恢复！', {
                    btn: ['重要','奇葩'] //按钮
                }, function(){
                    layer.msg('删除成功', {icon: 1});
                }, function(){
                    layer.closeAll()
                });
            })
            $(".set_course").on("click",function(){
                layer.open({
                    type: 1,
                    title: '查看课程',
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