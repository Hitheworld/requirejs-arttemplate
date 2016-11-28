/**
 *   创建考试
 *
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/testcentres/Thepublishedpapers/Thepublishedpapers.html',
        'common',
        'laypage',
        'api',
        'json!DataTables-1.10.13/i18n/Chinese.json',
        'datatables.net',
        'jquery.validate',
        'jquery.validate.zh',
        'css!font-awesome',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/markexampapers'
    ],
    function (template,$,layui,layer,
              ThepublishedpapersTpl,
              common,laypage,api,Chinese) {

        function createPage(page,childpage,pagenumber) {
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");
            $(".teaching").css("position","relative");
            $(".teachingBox").css("background-color","#f6f6f6");
            $(".teachingBox").css("position","relative");
            $(".teaching-nav").show();
            $(".testcentres-nav").show();

            var Thepublishedpapershtml = "<option value=''>全部</option>" +
                "{{each resultObject}}" +
                "<option data-id='{{$value.id}}'>{{$value.squadName}}</option>" +
                "{{/each}}";
            var Thepublishedpapershtml1 = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.squadName}}</td>" +
                "<td>{{$value.paperTplName}}</td>" +
                "<td>{{$value.difficulty}}</td>" +
                "<td>{{$value.jjCounts}}</td>" +
                "<td>" +
                "<button class='layui-btn'><a href='#/teaching/testcentres/markthetests/{{$value.id}}'>查看</a></button>" +
                "</td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";


            $("#testcentresHtml").html(ThepublishedpapersTpl);

            function Thepublishedpapers(squad_id,pageNumber,pageSize){
                common.ajaxRequest("bxg/examMark/findPublishedPage", "POST", {
                    login_name: $(".home-user-name").attr("data-name"),
                    squad_id:squad_id || "",
                    pageNumber:pageNumber || 1,
                    pageSize:pageSize
                }, function (data) {
                    if (data.success) {
                        $("#markexampapersTable_tbody").html(template.compile(Thepublishedpapershtml1)(data));
                        //显示分页
                        laypage({
                            cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                            pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                            curr: pageNumber || 1, //当前页
                            skin: '#2cb82c',
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    Thepublishedpapers(squad_id, obj.curr, pageSize);
                                }
                            }
                        });

                    }
                });
            }

            common.ajaxRequest("bxg/examMark/findTeacherSquadList", "POST", {
                teacherId: $(".home-user-name").attr("data-id")
            }, function (data) {
                $("#markexampapers-peper-difficulty").html(template.compile(Thepublishedpapershtml)(data)).on("change",function(){
                    var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                    Thepublishedpapers(select_this1.attr("data-id"), 1, 9);
                });
            });

            Thepublishedpapers("",1,1)
        }



        return {
            createPage: createPage
        }
    });