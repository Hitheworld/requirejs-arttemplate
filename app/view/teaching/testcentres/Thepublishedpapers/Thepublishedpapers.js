/**
 *   创建考试
 *
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/testcentres/Thepublishedpapers/Thepublishedpapers.html',
        'text!tplUrl/teaching/testcentres/Thepublishedpapers/downloadDoc.html',
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
              ThepublishedpapersTpl,downloadDocTpl,
              common,laypage,api,Chinese) {

        function createPage(page,childpage,pagenumber) {
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.markexampapers").addClass("testcentres-this");

            var Thepublishedpapershtml = "<option value=''>全部</option>" +
                "{{each resultObject}}" +
                "<option data-id='{{$value.id}}'>{{$value.squadName}}</option>" +
                "{{/each}}";
            var Thepublishedpapershtml1 = "{{if resultObject.items.length != 0}}" +
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
                "<td>" +
                "<a title='查看' href='#/teaching/testcentres/markthetests/{{$value.id}}/Thepublishedpapers'><img src='./app/assets/images/myclass/029.png' alt=''></a>" +
                "</td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";

            var downloadDocAddHtml = '{{each resultObject.items}}\
                <tr>\
                    <td>{{$value.squadName}}</td>\
                    <td>共{{$value.examNum}}次考试</td>\
                    <td><a title="下载" href="bxg/downloadDoc/exportSquadScoreExcel?squadId={{$value.squadId}}"><img class="img_src" src="./app/assets/images/myclass/040.png" alt=""></a></td>\
                </tr>\
                {{/each}}';


            $("#testcentresHtml").html(ThepublishedpapersTpl);

            function Thepublishedpapers(squad_id,pageNumber,pageSize){
                common.ajaxRequest("bxg/examMark/findPublishedPage", "POST", {
                    login_name: $(".home-user-name").attr("data-name"),
                    squad_id:squad_id || "",
                    pageNumber:pageNumber || 1,
                    pageSize:pageSize
                }, function (data) {
                    if (data.success) {
                        if (data.resultObject.items.length != 0) {
                            $(".Temporarily_no_data").css("display","none");
                            $("#paperHtml").css("display","block");
                            $("#markexampapersTable_tbody").html(template.compile(Thepublishedpapershtml1)(data));
                            $(".myClass_table tr:even").addClass("myClass_table_tr");
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
                        } else {
                            $(".Temporarily_no_data").css("display","block");
                            $("#paperHtml").css("display","none")
                        }
                    }
                });
            }
            function downloadDocAdd (pageNumber,pageSize) {
                common.ajaxRequest("bxg/examMark/findDownloadPage","POST",{
                    pageNumber:pageNumber,
                    pageSize:pageSize
                },function(data){
                    if (data.success){
                        if (data.resultObject.items.length != 0) {
                            $(".downloadDoc_table_val").html(template.compile(downloadDocAddHtml)(data));
                            $(".myClass_table tr:even").addClass("myClass_table_tr");
                            //显示分页
                            laypage({
                                cont: $('#page2'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                                curr: pageNumber || 1, //当前页
                                skin: '#2cb82c',
                                jump: function (obj, first) { //触发分页后的回调
                                    if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                        downloadDocAdd(obj.curr, pageSize);
                                    }
                                }
                            });
                            $(".img_src").hover(function(){
                                $(this).attr("src","./app/assets/images/myclass/041.png")
                            },function(){
                                $(this).attr("src","./app/assets/images/myclass/040.png")
                            })
                        } else {

                        }
                    }
                })
            }

            common.ajaxRequest("bxg/examMark/findTeacherSquadList", "POST", {
                teacherId: $(".home-user-name").attr("data-id")
            }, function (data) {
                $("#markexampapers-peper-difficulty").html(template.compile(Thepublishedpapershtml)(data)).on("change",function(){
                    var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                    Thepublishedpapers(select_this1.attr("data-id"), 1, 10);
                });
            });
            $("#downloadDocClick").on("click",function(){
                layer.open({
                    type: 1,
                    title: '下载成绩',
                    area: ['800px', '650px'], //宽高
                    shade:0.6,
                    shadeClose: true,//开启遮罩关闭
                    content: downloadDocTpl
                });
                downloadDocAdd(1,5)
            });
            Thepublishedpapers("",1,10)
        }



        return {
            createPage: createPage
        }
    });