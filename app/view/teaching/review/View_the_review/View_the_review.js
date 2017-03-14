/**
 *   预习/复习
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaching/review/View_the_review/View_the_review.html',
        'text!tplUrl/teaching/review/View_the_review/View_the_review_List1.html',
        'text!tplUrl/teaching/review/View_the_review/View_the_review_List2.html',
        'common',
        'radialIndicator',
        'css!font-awesome',
        'css!cssUrl/teaching.review.View_the_review'
    ],
    function (template,$,layui,layer,laypage,
              View_the_reviewTpl,View_the_review_List1Tpl,View_the_review_List2Tpl,
              common) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端教学中心-预习/复习";

            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.organizepaper").addClass("testcentres-this");

            var login_name = $(".home-user-name").data("name");//教师登录名
            var teacherId = $(".home-user-name").data("id");//教师登录名

            var courseviewdata = courseview(pagenumber);
            var viewPointsProgressDATA = viewPointsProgress(pagenumber);
            console.log(viewPointsProgressDATA)

            $("#testcentresHtml").html(template.compile(View_the_reviewTpl));
            $(".View_the_review_Syllabus_content").html(template.compile(View_the_review_List1Tpl)({
                CVD:courseviewdata.resultObject,
                VPP:viewPointsProgressDATA.resultObject,
                VPP2:viewPointsProgressDATA
            }));

            var findStudentProgressPageDATA = findStudentProgressPage(pagenumber,1,12);
            $(".View_the_review_Syllabus2_content").html(template.compile(View_the_review_List2Tpl)({
                CVD:courseviewdata.resultObject,
                CTP:findStudentProgressPageDATA,
                CTPS:findStudentProgressPageDATA.resultObject.items
            }));
            $.each(findStudentProgressPageDATA.resultObject.items,function(i,e){
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
            laypage({
                cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                pages: findStudentProgressPageDATA.resultObject.totalPageCount, //通过后台拿到的总页数
                curr: findStudentProgressPageDATA.resultObject.currentPage || 1, //当前页
                skin: '#2cb82c', //配色方案
                jump: function(obj, first){ //触发分页后的回调
                    if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                        //数据源
                        var Check_the_preview_PreviewStuList = findStudentProgressPage(pagenumber,obj.curr,12);
                        $(".View_the_review_Syllabus2_content").html(template.compile(View_the_review_List2Tpl)({
                            CVD:courseviewdata.resultObject,
                            CTP:Check_the_preview_PreviewStuList,
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
                    }
                }
            });

        }

        var courseview = function (id) {
            return common.requestService('bxg/review/view','get', {
                id: id
            });
        };

        var viewPointsProgress = function (id) {
            return common.requestService('bxg/review/viewPointsProgress','get', {
                id: id
            });
        };

        var findStudentProgressPage = function (id,pageNumber,pageSize) {
            return common.requestService('bxg/review/findStudentProgressPage','get', {
                id: id,
                pageNumber:pageNumber,
                pageSize:pageSize
            });
        };

        return {
            createPage: createPage
        }
    });