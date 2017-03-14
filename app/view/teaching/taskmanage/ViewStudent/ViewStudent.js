/**
 *   发布作业
 *
 *
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaching/taskmanage/ViewStudent/ViewStudent.html',
        'text!tplUrl/teaching/taskmanage/ViewStudent/ViewStudent.operation.html',
        'common',
        'api',
        'datatables.net',
        'jquery.validate',
        'jquery.validate.zh',
        'jquery.hovertreescroll',
        'portamento',
        'css!font-awesome',
        'css!cssUrl/myclass',
        'css!cssUrl/markexampapers'
    ],
    function (template,$,layui,layer,laypage,
              ViewStudentTpl,
              ViewStudentOperationTpl,
              common,api) {

        function createPage(page,childpage,pageType, exampPaperId) {
            //返回时刷新
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
            $(".testcentres-tab-title li.releasetask").addClass("testcentres-this");

            var ViewStudenthtml1 = "{{if resultObject.items.length != 0}}" +
                "{{each resultObject.items}}" +
                "<tr>" +
                "<td>{{$value.stuName}}</td>" +
                "<td>{{$value.jjTime}}</td>" +
                "<td>{{$value.correctPercent}}%</td>" +
                "<td>{{$value.group}}</td>" +
                "<td>" +
                "{{if $value.status == '2'}}" +
                "已完成" +
                "{{else if $value.status == '3'}}" +
                "未作答" +
                "{{else if $value.status == '0'}}" +
                "未开始" +
                "{{else if $value.status == '1'}}" +
                "作业中" +
                "{{/if}}" +
                "</td>" +
                "<td>" +
                "{{if $value.status == '2'}}" +
                "<a title='查看' target='_blank' href='#/teaching/taskmanage/ViewJob/{{$value.homeworkId}}/{{$value.stuId}}'><img src='./app/assets/images/myclass/029.png' alt=''></a>" +
                "{{else if $value.status == '3'}}" +
                "--" +
                "{{else if $value.status == '0'}}" +
                "--" +
                "{{else if $value.status == '1'}}" +
                "--" +
                "{{/if}}" +
                "</td>" +
                "</tr>" +
                "{{/each}}" +
                "{{else}}暂无数据" +
                "{{/if}}";


            function ViewStudent(group,stuName, status, pageNumber, pageSize) {
                common.ajaxRequest("bxg/homework/findSquadHomeworkPage", "POST", {
                    homeworkId: exampPaperId,
                    group: group || "",
                    status: status || "",
                    stuName:stuName || "",
                    pageNumber: pageNumber || 1,
                    pageSize: pageSize
                }, function (data) {
                    if (data.success) {
                        $("#ViewStudentTable_tbody").html(template.compile(ViewStudenthtml1)(data));
                        $(".myClass_table tr:even").addClass("myClass_table_tr");
                        //显示分页
                        laypage({
                            cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                            pages: parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
                            curr: pageNumber || 1, //当前页
                            skin: '#2cb82c',
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    ViewStudent(group,stuName, status, obj.curr, pageSize)
                                }
                            }
                        });
                    }
                });
            }


            common.ajaxRequest("bxg/homework/findSquadHomeworkListHead", "POST", {
                homeworkId: exampPaperId
            }, function (data) {
                if (data.success) {
                    $("#testcentresHtml").html(template.compile(ViewStudentTpl)(data));
                    common.ajaxRequest('bxg/homework/findHomeworkGroupList', "POST",{
                        homeworkId: exampPaperId
                    },function(con){
                        var ViewStudent_group = $(".ViewStudent_group");
                        ViewStudent_group.empty().append("<option data-id='' value=''>全部</option>");
                        $.each(con.resultObject,function(i,e){
                            ViewStudent_group.append("<option value="+e.group+">"+e.group+"</option>")
                        });
                        $("#markexampapers-peper-difficulty").on("change", function () {
                            var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                            var select_this2 = $(".ViewStudent_group option:checked");
                            ViewStudent(select_this2.val(),"",select_this1.val(),1,9)
                        });
                        $(".ViewStudent_group").on("change", function () {
                            var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                            var select_this2 = $(".ViewStudent_group option:checked");
                            ViewStudent(select_this2.val(),"",select_this1.val(),1,9)
                        });
                        $(".ViewStudent_input_button").on("click",function(){
                            var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                            var select_this2 = $(".ViewStudent_group option:checked");
                            ViewStudent(select_this2.val(),$(".ViewStudent_input").val(),select_this1.val(),1,9)
                        })
                        ViewStudent("","","",1,9)
                    });
                }
            });


        }

        return {
            createPage: createPage
        }
    });