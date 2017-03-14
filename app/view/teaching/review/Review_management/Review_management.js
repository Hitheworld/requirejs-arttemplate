/**
 *   预习/复习
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaching/review/Review_management/Review_management.html',
        'common',
        'css!font-awesome',
        'css!cssUrl/teaching.review.View_the_review'
    ],
    function (template,$,layui,layer,laypage,
              Review_managementTpl,
              common) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端教学中心-预习/复习";

            var Review_managementhtml = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.reviewName}}</td>" +
                "<td>{{$value.courseName}}</td>" +
                "<td>{{$value.knowledgeCount}}</td>" +
                "<td>{{$value.createTime}}</td>" +
                "<td>{{$value.statusText}}</td>" +
                "<td><div class='operation-icon'>" +
                "{{if $value.status == 0}}" +
                "<a class='J-publish issue' title='发布' data-id='{{$value.id}}'><i class='icon-editor-loht' aria-hidden='true'></i></a>" +
                "<a title='编辑' href='#/teaching/review/creareview/edit/{{$value.id}}'><i class='icon-editor-loh' aria-hidden='true'></i></a>" +
                "<a title='删除' class='deleteSquad' href='javascript:void(0)' data-id='{{$value.id}}'><i class='fa fa-trash-o' aria-hidden='true'></i></a>" +
                "{{else if $value.status == 1}}" +
                "<a title='查看' href='#/teaching/review/View_the_review/{{$value.id}}'><i class='fa fa-search' aria-hidden='true'></i></a>" +
                "<a title='删除' class='deleteSquad' href='javascript:void(0)' data-id='{{$value.id}}'><i class='fa fa-trash-o' aria-hidden='true'></i></a>" +
                "{{/if}}" +
                "</div></td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";

            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.organizepaper").addClass("testcentres-this");

            var login_name = $(".home-user-name").data("name");//教师登录名
            var teacherId = $(".home-user-name").data("id");//教师登录名

            var Check_the_preview_CourseList = findTeacherCourseList(pagenumber);

            function Review_managementfun (squadId,courseId,status,pageNumber,pageSize) {
                var Review_managementdata = Review_managementList(squadId,courseId,status,pageNumber,pageSize);
                if (Review_managementdata.resultObject.items.length != 0) {
                    $(".Temporarily_no_data").css("display","none");
                    $("#paperHtml").css("display","block");
                    $("#Review_managementTable_tbody").html(template.compile(Review_managementhtml)(Review_managementdata));
                    $(".myClass_table tr:even").addClass("myClass_table_tr");
                    laypage({
                        cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                        pages: Review_managementdata.resultObject.totalPageCount, //通过后台拿到的总页数
                        curr: pageNumber || 1, //当前页
                        skin: '#2cb82c', //配色方案
                        jump: function(obj, first){ //触发分页后的回调
                            if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                                Review_managementfun(squadId,courseId,status,obj.curr,pageSize)
                            }
                        }
                    });
                    //发布
                    $(".issue").on("click", function (e) {
                        var _this = $(this);
                        //询问框
                        layer.confirm('确定要发布复习么？', {
                            shade:0.6,
                            btn: ['确定', '取消'] //按钮
                        }, function (index) {
                            common.ajaxRequest("bxg/review/publish", "POST", {
                                id: _this.attr("data-id")
                            }, function (con) {
                                if (con.success){
                                    layer.close(index);
                                    Review_managementfun (squadId,courseId,status,pageNumber,pageSize);
                                    layer.msg('发布成功', {icon: 1});
                                }
                            });
                        }, function (index) {
                            layer.close(index)
                        });
                    });
                    //删除
                    $(".deleteSquad").on("click",function(e){
                        var _this = $(this);
                        //询问框
                        layer.confirm('确定要删除该复习？删除操作，不可恢复！', {
                            shade:0.6,
                            btn: ['确定','取消'] //按钮
                        }, function(index){
                            common.ajaxRequest("bxg/review/del","POST",{
                                id:_this.attr("data-id")
                            },function(data){
                                if(data.success){
                                    layer.close(index);
                                    Review_managementfun (squadId,courseId,status,pageNumber,pageSize);
                                    layer.msg('删除成功', {icon: 1});
                                }else {
                                    layer.msg('删除失败', {icon: 5});
                                }
                            });
                        }, function(index){
                            layer.close(index)
                        });
                    });
                }else {
                    $(".Temporarily_no_data").css("display","block");
                    $("#paperHtml").css("display","none")
                }

            }

            $("#testcentresHtml").html(template.compile(Review_managementTpl)(Check_the_preview_CourseList));
            $(".Review_management_a").unbind().click(function(){
                location.href = '#/teaching/review/creareview/class/'+pagenumber
            });

            $("#Review_management_select1").on("change", function () {
                var select_this1 = $("#Review_management_select1 option:checked");
                var select_this2 = $("#Review_management_select2 option:checked");
                Review_managementfun(pagenumber,select_this2.val(),select_this1.val(),1,5)
            });
            $("#Review_management_select2").on("change", function () {
                var select_this1 = $("#Review_management_select1 option:checked");
                var select_this2 = $("#Review_management_select2 option:checked");
                Review_managementfun(pagenumber,select_this2.val(),select_this1.val(),1,5)
            });

            Review_managementfun(pagenumber,"","",1,5)
        }

        var findTeacherCourseList = function (squadId) {
            return common.requestService('bxg/preview/findTeacherCourseList','get', {
                squadId: squadId
            });
        };

        var Review_managementList = function (squadId,courseId,status,pageNumber,pageSize) {
            return common.requestService('bxg/review/list','get', {
                squadId: squadId,
                courseId:courseId,
                status:status,
                pageNumber:pageNumber,
                pageSize:pageSize
            });
        };

        return {
            createPage: createPage
        }
    });