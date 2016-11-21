
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/myclass/student/student.html',
        'text!tplUrl/teaching/myclass/student/student_table.html',
        'common',
        'api',
        'css!cssUrl/myclass'
    ],
    function (template,$,layui,layer,
              studentTpl,student_tableTpl,
              common,api) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            $(".myClass").html(template.compile(studentTpl)())
            common.ajaxRequest('./app/data/myTable.json', "GET", {}, function (data, state) {
                $(".student_table_val").html(template.compile(student_tableTpl)(data))
            });


        }



        return {
            createPage: createPage
        }
    });