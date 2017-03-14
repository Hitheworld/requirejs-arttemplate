/**
 *   预习/复习
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaching/review/Check_the_preview/Check_the_preview.html',
        'text!tplUrl/teaching/review/Check_the_preview/Check_the_preview_list1.html',
        'text!tplUrl/teaching/review/Check_the_preview/Check_the_preview_list2.html',
        'common',
        'radialIndicator',
        'css!font-awesome',
        'css!cssUrl/teaching.review.View_the_review'
    ],
    function (template,$,layui,layer,laypage,
              Check_the_previewTpl,Check_the_preview_list1Tpl,Check_the_preview_list2Tpl,
              common) {

        function createPage(page,childpage,pagenumber) {
            var arropud = pagenumber.split("-");
            console.log(arropud)
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
            var Check_the_preview_CourseList = findTeacherCourseList(arropud[0]);

            console.log(Check_the_preview_CourseList);


            $("#testcentresHtml").html(template.compile(Check_the_previewTpl)({
                CTPC:Check_the_preview_CourseList.resultObject,
                CTPClIST:Check_the_preview_CourseList.resultObject.courseList
            }));

            $("#Check_the_preview_select").on("change", function () {
                var select_this = $("#Check_the_preview_select option:checked");
                var Check_the_preview_ProgressList = findCourseTreeProgress(arropud[0],select_this.val());
                var Check_the_preview_PreviewStuList = findPreviewStuProgress(arropud[0],select_this.val(),1,12);
                $(".View_the_review_Syllabus_content").html(template.compile(Check_the_preview_list1Tpl)({
                    CTPP:Check_the_preview_ProgressList.resultObject
                }));

                $(".View_the_review_Syllabus2_content").html(template.compile(Check_the_preview_list2Tpl)({
                    CTPSL:Check_the_preview_PreviewStuList.resultObject,
                    CTPS:Check_the_preview_PreviewStuList.resultObject.items
                }));
                $.each(Check_the_preview_PreviewStuList.resultObject.items,function(i,e){
                    $('#View_the_review_Syllabus2_content_dv_'+i).radialIndicator({
                        barBgColor:"#f0f0f0",
                        barColor:"#39b674",
                        fontColor:"#39b674",
                        percentage:true,
                        radius:32,
                        barWidth : 5,
                        initValue: e.progress
                    });
                });
                $(".View_the_review_Syllabus2_content_dv").unbind().click(function(){
                    var _this = $(this);
                    window.location.href = "#/teaching/review/Students_progress/"+_this.data("url");
                });

                laypage({
                    cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                    pages: Check_the_preview_PreviewStuList.resultObject.totalPageCount, //通过后台拿到的总页数
                    curr: Check_the_preview_PreviewStuList.resultObject.currentPage || 1, //当前页
                    skin: '#2cb82c', //配色方案
                    jump: function(obj, first){ //触发分页后的回调
                        if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                            //数据源
                            var Check_the_preview_PreviewStuList = findPreviewStuProgress(arropud[0],select_this.val(),obj.curr,12);
                            $(".View_the_review_Syllabus2_content").html(template.compile(Check_the_preview_list2Tpl)({
                                CTPSL:Check_the_preview_PreviewStuList.resultObject,
                                CTPS:Check_the_preview_PreviewStuList.resultObject.items
                            }));
                            $.each(Check_the_preview_PreviewStuList.resultObject.items,function(i,e){
                                $('#View_the_review_Syllabus2_content_dv_'+i).radialIndicator({
                                    barBgColor:"#f0f0f0",
                                    barColor:"#39b674",
                                    fontColor:"#39b674",
                                    percentage:true,
                                    radius:32,
                                    barWidth : 5,
                                    initValue: e.progress
                                });
                            });
                            $(".View_the_review_Syllabus2_content_dv").unbind().click(function(){
                                var _this = $(this);
                                window.location.href = "#/teaching/review/Students_progress/"+_this.data("url");
                            });
                        }
                    }
                });
            });
            setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                $('#Check_the_preview_select>option:nth-child(2)').attr("selected",true).change();
            } ,500);
            if (arropud[1]) {
                $(".layui-tab-title>li:nth-child(2)").click();
                setTimeout(function(){  //防止页面快速刷新时看不到提示语;
                    $('#Check_the_preview_select>option:nth-child(2)').attr("selected",true).change();
                } ,1000);
            }
        }

        var findTeacherCourseList = function (squadId) {
            return common.requestService('bxg/preview/findTeacherCourseList','get', {
                squadId: squadId
            });
        };

        var findCourseTreeProgress = function (squadId,courseId) {
            return common.requestService('bxg/preview/findCourseTreeProgress','get', {
                squadId: squadId,//班级ID
                courseId:courseId//课程ID
            });
        };

        var findPreviewStuProgress = function (squadId,courseId,pageNumber,pageSize) {
            return common.requestService('bxg/preview/findPreviewStuProgress','get', {
                squadId: squadId,//班级ID
                courseId:courseId,//课程ID
                pageNumber:pageNumber || 1,
                pageSize:pageSize || 10
            });
        };

        return {
            createPage: createPage
        }
    });