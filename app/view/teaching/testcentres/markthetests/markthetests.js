define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/testcentres/markthetests/markthetests.html',
        'common',
        'laypage',
        'api',
        'json!DataTables-1.10.13/i18n/Chinese.json',
        'datatables.net',
        'jquery.validate',
        'jquery.validate.zh',
        'css!font-awesome',
        'css!cssUrl/markexampapers'
    ],
    function (template,$,layui,layer,
              markthetestsTpl,
              common,laypage,api,Chinese) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");

            var markthetestshtml1 = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.studentName}}</td>" +
                "<td>{{$value.jjTime}}</td>" +
                "<td>{{$value.duration}}</td>" +
                "<td>{{$value.score}}</td>" +
                "<td>{{$value.groupName}}</td>" +
                "<td>" +
                "{{if $value.status == 2}}" +
                "待批阅" +
                "{{else if $value.status == 3}}" +
                "待发布" +
                "{{else if $value.status == 4}}" +
                "已发布" +
                "{{else if $value.status == 0}}" +
                "未交卷" +
                "{{/if}}" +
                "</td>" +
                "<td>" +
                "{{if $value.status == 2}}" +
                "<button class='layui-btn'><a href='#/teaching/testcentres/readtest/{{$value.examId}}/{{$value.studentId}}'>批阅试卷</a></button>" +
                "{{else if $value.status == 3}}" +
                "<button class='layui-btn' data-id='{{{{$value.id}}}}'>发布</button>" +
                "{{else if $value.status == 4}}" +
                "<button class='layui-btn'><a href='#/teaching/testcentres/markthetests/{{$value.id}}'>查看</a></button>" +
                "{{else if $value.status == 0}}" +
                    "--"+
                "{{else if $value.status == 1}}" +
                "考试中"+
                "{{/if}}" +
                "</td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";

            function markthetests (sort,status,pageNumber,pageSize) {
                common.ajaxRequest("bxg/examMark/findMarkExamPage", "POST", {
                    exam_id: pagenumber,
                    sort:sort || "",
                    status:status || "",
                    pageNumber:pageNumber || 1,
                    pageSize:pageSize
                }, function (data) {
                    if (data.success) {
                        $("#markexampapersTable_tbody").html(template.compile(markthetestshtml1)(data));
                        //显示分页
                        laypage({
                            cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                            pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                            curr: pageNumber || 1, //当前页
                            skin: '#2cb82c',
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    markthetests(sort,status, obj.curr, pageSize);
                                }
                            }
                        });

                    }
                });
            }


            common.ajaxRequest("bxg/examMark/findMarkExam", "POST", {
                exam_id: pagenumber
            }, function (data) {
                if (data.success) {
                    $("#teachingHtml").html(template.compile(markthetestsTpl)(data));
                    $("#markexampapers-peper-difficulty").on("change",function(){
                        var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                        markthetests("",select_this1.val(), 1, 9);
                    })
                }
            });

            markthetests("","",1,9)
        }


        return {
            createPage: createPage
        }
    });