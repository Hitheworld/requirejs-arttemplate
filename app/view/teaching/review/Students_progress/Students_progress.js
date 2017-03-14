/**
 *   预习/复习
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaching/review/Students_progress/Students_progress.html',
        'common',
        'css!font-awesome',
        'css!cssUrl/teaching.review.View_the_review'
    ],
    function (template,$,layui,layer,laypage,
              Students_progressTpl,
              common) {

        function createPage(page,childpage,pagenumber) {

            var arropud = pagenumber.split("-");

            document.title = "博学谷·院校-教师端教学中心-预习/复习";

            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.organizepaper").addClass("testcentres-this");

            var login_name = $(".home-user-name").data("name");//教师登录名
            var teacherId = $(".home-user-name").data("id");//教师登录名

            //数据源
            var Students_progress_list = findStudentCourseProgress(arropud[0],arropud[1],arropud[2]);


            $("#testcentresHtml").html(template.compile(Students_progressTpl)(Students_progress_list));
            $(".Students_progress_return").attr("href","#/teaching/review/Check_the_preview/"+arropud[0]+"-0")

        }


        var findStudentCourseProgress = function (squadId,courseId,studentId) {
            return common.requestService('bxg/preview/findStudentCourseProgress','get', {
                squadId: squadId,//班级ID
                courseId:courseId,//课程ID
                studentId:studentId
            });
        };

        return {
            createPage: createPage
        }
    });