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
            $(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");
            $(".teaching").css("position", "relative");
            $(".teachingBox").css("background-color", "#f6f6f6");
            $(".teachingBox").css("position", "relative");
            $(".teaching-nav").show();
            $(".testcentres-nav").show();

            var markexampapershtml = "<option value=''>全部</option>" +
                "{{each resultObject}}" +
                "<option data-id='{{$value.id}}'>{{$value.squadName}}</option>" +
                "{{/each}}";
            var markexampapershtml1 = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.squadName}}</td>" +
                "<td>{{$value.paperTplName}}</td>" +
                "<td>{{$value.difficulty}}</td>" +
                "<td>{{$value.jjCounts}}</td>" +
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
                "<button class='layui-btn'><a href='#/teaching/testcentres/markthetests/{{$value.id}}'>批阅试卷</a></button>" +
                "{{else if $value.status == 3}}" +
                "<button class='layui-btn' data-id='{{{{$value.id}}}}'>发布</button>" +
                "<button class='layui-btn'><a href='#/teaching/testcentres/markthetests/{{$value.id}}'>查看</a></button>" +
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
                        $("#markexampapersTable_tbody").html(template.compile(markexampapershtml1)(data));
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

                    }
                });
            }

            $("#testcentresHtml").html(template.compile(markexampapersTpl)());


            common.ajaxRequest("bxg/examMark/findTeacherSquadList", "POST", {
                teacherId: $(".home-user-name").attr("data-id")
            }, function (data) {
                $("#markexampapers-peper-difficulty").html(template.compile(markexampapershtml)(data)).on("change",function(){
                    var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                    markexampapers(select_this1.attr("data-id"),$("#markexampapers-course-difficulty").val(), 1, 9);
                });

                $("#markexampapers-course-difficulty").on("change",function(){
                    var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                    var select_this2 = $("#markexampapers-course-difficulty option:checked");
                    markexampapers(select_this1.attr("data-id"),select_this2.val(), 1, 9);
                })
            });



            markexampapers("","",1,9)

        }

        return {
            createPage: createPage
        }
    });