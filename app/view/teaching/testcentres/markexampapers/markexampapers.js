/**
 *   创建考试
 *
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/testcentres/markexampapers/markexampapers.html',
        'text!tplUrl/teaching/testcentres/markexampapers/markexampaperstable.html',
        'common',
        'laypage',
        'api',
        'jquery.validate',
        'jquery.validate.zh',
        'css!font-awesome',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/markexampapers'
    ],
    function (template, $, layui, layer,
              markexampapersTpl, markexampaperstableTpl,
              common,laypage, api) {

        function createPage(page, childpage, pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.markexampapers").addClass("testcentres-this");


            var markexampapershtml = "<option value=''>全部</option>" +
                "{{each resultObject}}" +
                "<option data-id='{{$value.id}}'>{{$value.squadName}}</option>" +
                "{{/each}}";
            var markexampapershtml1 = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.squadName}}</td>" +
                "<td>{{$value.paperTplName}}</td>" +
                "<td><div class='facility-value' style='margin-top: 23px; margin-left: 0px;'><ul>" +
                "{{if $value.difficulty == 'A'}}" +
                "<li class='value-active'></li>" +
                "<li class='value'></li>" +
                "<li class='value'></li>" +
                "<li class='value'></li>" +
                "{{else if $value.difficulty == 'B'}}" +
                "<li class='value-active'></li>" +
                "<li class='value-active'></li>" +
                "<li class='value'></li>" +
                "<li class='value'></li>" +
                "{{else if $value.difficulty == 'C'}}" +
                "<li class='value-active'></li>" +
                "<li class='value-active'></li>" +
                "<li class='value-active'></li> " +
                "<li class='value'></li>" +
                "{{else if $value.difficulty == 'D'}}" +
                "<li class='value-active'></li>" +
                "<li class='value-active'></li>" +
                "<li class='value-active'></li>" +
                "<li class='value-active'></li>{{/if}}" +
                "</ul></div></td>" +
                "<td>{{$value.ykCounts}}/{{$value.jjCounts}}</td>" +
                "<td>{{$value.waitMarkCounts}}</td>" +
                "<td>" +
                "{{if $value.status == 2}}" +
                "待批阅" +
                "{{else if $value.status == 3}}" +
                "待发布" +
                "{{/if}}" +
                "</td>" +
                "<td>" +
                "{{if $value.status == 2}}" +
                "<a title='批阅试卷' href='#/teaching/testcentres/markthetests/{{$value.id}}/markexampapers'><img src='./app/assets/images/myclass/030.png' alt=''></a>" +
                "{{else if $value.status == 3}}" +
                "<a class='Batch_release' title='发布' data-id='{{$value.id}}'><img src='./app/assets/images/myclass/031.png' alt=''></a>" +
                "<a title='查看' style='margin-left: 5px' href='#/teaching/testcentres/markthetests/{{$value.id}}/markexampapers'><img src='./app/assets/images/myclass/029.png' alt=''></a>" +
                "{{/if}}" +
                "</td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";

            function markexampapers (squad_id,status,pageNumber,pageSize) {
                common.ajaxRequest("bxg/examMark/findWaitPublishPage", "POST", {
                    login_name: $(".home-user-name").attr("data-name"),
                    squad_id:squad_id || "",
                    status:status || "",
                    pageNumber:pageNumber || 1,
                    pageSize:pageSize
                }, function (data) {
                    if (data.success) {
                        if (data.resultObject.items.length != 0) {
                            $(".Temporarily_no_data").css("display","none");
                            $("#paperHtml").css("display","block");
                            $("#markexampapersTable_tbody").html(template.compile(markexampapershtml1)(data));
                            $(".myClass_table tr:even").addClass("myClass_table_tr");
                            //$(".markexampapers-header").css("display","block");
                            //显示分页
                            laypage({
                                cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                                curr: pageNumber || 1, //当前页
                                skin: '#2cb82c',
                                jump: function (obj, first) { //触发分页后的回调
                                    if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                        markexampapers(squad_id,status, obj.curr, pageSize);
                                    }
                                }
                            });
                            $(".Batch_release").on("click", function (e) {
                                var _this = $(this);
                                //询问框
                                layer.confirm('确定要向该班级发布成绩么？成绩发布后，学员可立即查看到成绩', {
                                    btn: ['确定', '取消'] //按钮
                                }, function (index) {
                                    common.ajaxRequest("bxg/exam/publish", "POST", {
                                        id: _this.attr("data-id")
                                    }, function (con) {
                                        if (con.success){
                                            layer.close(index);
                                                markexampapers (squad_id,status,pageNumber,pageSize);
                                            layer.msg('发布成功', {icon: 1});
                                        }
                                    });
                                }, function (index) {
                                    layer.close(index)
                                });
                            })
                        }else {
                            $(".Temporarily_no_data").css("display","block");
                            $("#paperHtml").css("display","none")
                        }
                    }
                });
            }

            $("#testcentresHtml").html(template.compile(markexampapersTpl)());


            common.ajaxRequest("bxg/examMark/findTeacherSquadList", "POST", {
                teacherId: $(".home-user-name").attr("data-id")
            }, function (data) {
                $("#markexampapers-peper-difficulty").html(template.compile(markexampapershtml)(data)).on("change",function(){
                    var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                    markexampapers(select_this1.attr("data-id"),$("#markexampapers-course-difficulty").val(), 1, 10);
                });

                $("#markexampapers-course-difficulty").on("change",function(){
                    var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                    var select_this2 = $("#markexampapers-course-difficulty option:checked");
                    markexampapers(select_this1.attr("data-id"),select_this2.val(), 1, 10);
                })
            });



            markexampapers("","",1,10)

        }

        return {
            createPage: createPage
        }
    });