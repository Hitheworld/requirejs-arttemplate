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
    function (template, $, layui, layer,
              markthetestsTpl,
              common, laypage, api, Chinese) {

        function createPage(page, childpage, pagenumber, pageType) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            if (window.history && window.history.pushState) {
                $(window).on('popstate', function () {
                    history.go(0);
                });
            };
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.markexampapers").addClass("testcentres-this");

            var markthetestshtml1 = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.studentName}}</td>" +
                "<td>{{$value.jjTime}}</td>" +
                "<td>{{$value.durationStr}}</td>" +
                "<td>{{$value.score}}</td>" +
                "<td>{{$value.groupName}}</td>" +
                "<td>" +
                "{{if $value.status == '2'}}" +
                "待批阅" +
                "{{else if $value.status == '3'}}" +
                "待发布" +
                "{{else if $value.status == '4'}}" +
                "已发布" +
                "{{else if $value.status == '0'}}" +
                "未交卷" +
                "{{else if $value.status == '1'}}" +
                "未交卷" +
                "{{else if $value.status == '5'}}" +
                "未交卷" +
                "{{/if}}" +
                "</td>" +
                "<td>" +
                "{{if $value.status == '2'}}" +
                "<a title='批阅试卷' href='#/teaching/testcentres/readtest/{{$value.examId}}/{{$value.studentId}}'><img src='./app/assets/images/myclass/030.png' alt=''></a>" +
                "{{else if $value.status == '3'}}" +
                "<a class='issue' title='发布' data-id='{{$value.studentId}}'><img src='./app/assets/images/myclass/031.png' alt=''></a>" +
                "<a title='修改' style='margin-left: 5px' href='#/teaching/testcentres/readtest/{{$value.examId}}/{{$value.studentId}}'><img src='./app/assets/images/myclass/030.png' alt=''></a>"+
                "{{else if $value.status == '4'}}" +
                "<a title='查看' target='_blank' href='#/teaching/testcentres/lookreadtest/{{$value.examId}}/{{$value.studentId}}'><img class='chankan' src='./app/assets/images/myclass/029.png' alt=''></a>" +
                "<a title='下载' style='margin-left: 5px' href='bxg/downloadDoc/downloadStudentExampaper?examId={{$value.examId}}&studentId={{$value.studentId}}'><img src='./app/assets/images/myclass/014.png' alt=''></a>" +
                "{{else if $value.status == '0'}}" +
                "--" +
                "{{else if $value.status == '1'}}" +
                "--" +
                "{{else if $value.status == '5'}}" +
                "--" +
                "{{/if}}" +
                "</td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";

            function markthetests(sort, status, pageNumber, pageSize) {
                common.ajaxRequest("bxg/examMark/findMarkExamPage", "POST", {
                    exam_id: pagenumber,
                    sort: sort || "",
                    status: status || "",
                    pageNumber: pageNumber || 1,
                    pageSize: pageSize
                }, function (data) {
                    if (data.success) {
                        $("#markexampapersTable_tbody").html(template.compile(markthetestshtml1)(data));
                        $(".myClass_table tr:even").addClass("myClass_table_tr");
                        //显示分页
                        laypage({
                            cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                            pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                            curr: pageNumber || 1, //当前页
                            skin: '#2cb82c',
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    markthetests(sort, status, obj.curr, pageSize);
                                }
                            }
                        });
                        $(".issue").on("click", function (e) {
                            debugger
                            var _this = $(this);
                            //询问框
                            layer.confirm('确定要向该学员发布成绩么？成绩发布后，学员可立即查看到成绩', {
                                shade: [0.6, '#000'],
                                btn: ['确定', '取消'] //按钮
                            }, function (index) {
                                common.ajaxRequest("bxg/examMark/publish", "POST", {
                                    studentId: _this.attr("data-id"),
                                    examId: pagenumber
                                }, function (con) {
                                    if (con.success){
                                        layer.close(index);
                                        markthetests(sort, status,pageNumber, pageSize);
                                        layer.msg('发布成功', {icon: 1});
                                    }else {
                                        layer.msg(con.errorMessage, {icon: 5});
                                    }
                                });
                            }, function (index) {
                                layer.close(index)
                            });
                        });
                        $(".chankan").hover(function(){
                            $(this).attr("src","./app/assets/images/myclass/042.png")
                        },function(){
                            $(this).attr("src","./app/assets/images/myclass/029.png")
                        });

                        $(".Batch_release").unbind().on("click", function (e) {
                            var _this = $(this);
                            //询问框
                            layer.confirm('确定要向该班级发布成绩么？成绩发布后，学员可立即查看到成绩', {
                                shade: [0.6, '#000'],
                                btn: ['确定', '取消'] //按钮
                            }, function (index) {
                                common.ajaxRequest("bxg/exam/publish", "POST", {
                                    id: pagenumber
                                }, function (con) {
                                    layer.close(index);
                                    if (con.success){
                                        markthetests(sort, status, pageNumber, pageSize);
                                        layer.msg('发布成功', {icon: 1});
                                    }else {
                                        layer.msg(con.errorMessage, {icon: 5});
                                    }
                                });
                            }, function (index) {
                                layer.close(index)
                            });
                        });

                        $("#markexampapersTable_sort").unbind().on("click",function(){
                            var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                            var _this = $(this);
                            if (_this.attr("data-type") == "") {
                                $("#markexampapersTable_sort").attr("data-type","desc");
                                $("#markexampapersTable_sort i").css("color","");
                                $("#markexampapersTable_sort .fa-caret-down").css("color","#36b773");
                                markthetests("desc", select_this1.val(), 1, 9);
                            }else if (_this.attr("data-type") == "desc"){
                                $("#markexampapersTable_sort").attr("data-type","asc");
                                $("#markexampapersTable_sort i").css("color","");
                                $("#markexampapersTable_sort .fa-caret-up").css("color","#36b773");
                                markthetests("asc", select_this1.val(), 1, 9);
                            }else if (_this.attr("data-type") == "asc") {
                                $("#markexampapersTable_sort").attr("data-type","desc");
                                $("#markexampapersTable_sort i").css("color","");
                                $("#markexampapersTable_sort .fa-caret-down").css("color","#36b773");
                                markthetests("desc", select_this1.val(), 1, 9);
                            }
                        })

                    }
                });
            }


            common.ajaxRequest("bxg/examMark/findMarkExam", "POST", {
                exam_id: pagenumber
            }, function (data) {
                if (data.success) {
                    $("#testcentresHtml").html(template.compile(markthetestsTpl)(data));
                    if (common.isnull(pageType)) {
                        $(".markthetests_header_span_a").attr("href","#/teaching/testcentres/markexampapers");
                    }else {

                    }
                    $("#markexampapers-peper-difficulty").on("change", function () {
                        var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                        markthetests("", select_this1.val(), 1, 9);
                    });
                    $("#Download_the_student_test_paper").on("click",function(){
                        var _this = $(this);
                        common.ajaxRequest("bxg/downloadDoc/downloadZipValidate","POST",{
                            examId:_this.data("id")
                        },function(con){
                            if (con.success){
                                if (con.resultObject.canDownload){
                                    window.location.href = "bxg/downloadDoc/downloadStuExamZip?examId="+_this.data("id");
                                }else {
                                    layer.msg(con.resultObject.msg, {icon: 5});
                                }
                            }else {
                                layer.msg(con.errorMessage, {icon: 5});
                            }
                        })
                    })
                }
            });

            markthetests("", "", 1, 9)


        }


        return {
            createPage: createPage
        }
    });