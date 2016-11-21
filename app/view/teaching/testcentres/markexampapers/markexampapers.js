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
        'api',
        'json!DataTables-1.10.13/i18n/Chinese.json',
        'datatables.net',
        'jquery.validate',
        'jquery.validate.zh',
        'css!font-awesome',
        'css!cssUrl/markexampapers'
    ],
    function (template,$,layui,layer,
              markexampapersTpl,markexampaperstableTpl,
              common,api,Chinese) {

        function createPage(page,childpage,pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
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

            var TestPaperDB = TestPaper();
            var data = TestPaperDB.resultObject.lists;

            //数据源---预览试卷
            var GeneratedPaperDB = GeneratedPaper();

            $("#testcentresHtml").html(template.compile(markexampapersTpl)({
                TestPaperDB: TestPaperDB
            }));



            //生成表格
            var table = $('#markexampapersTable').DataTable({
                data: data,  //对象数据
                columns: [
                    { data: 'name' },
                    { data: 'difficulty' },
                    { data: 'relatedCourses' },
                    { data: 'heat' },
                    { data: 'creationTime' },
                    { data: markexampaperstableTpl }
                ],
                "searching": false,  //是否开启本地搜索功能
                "lengthChange": false, //是否允许最终用户改变表格每页显示的记录数
                "language": Chinese,   //国际化--中文
                "lengthChange": false,   //是否允许用户改变表格每页显示的记录数
                "pageLength": 10 ,   //改变初始的页面长度(每页显示的记录数)
                "columnDefs": [
                    { "width": "348px",className: "name", "targets": 0 },
                    { "width": "153px",className: "difficulty", "targets": 1 },
                    { "width": "164px",className: "relatedCourses", "targets": 2 },
                    { "width": "152px",className: "heat", "targets": 3 },
                    { "width": "200px",className: "creationTime", "targets": 4 },
                    { "width": "auto",className: "operation", "targets": 5 },
                    {
                        "targets": -1,
                        "data": null,
                        "defaultContent": markexampaperstableTpl
                    } ]
            });

            $('#markexampapersTable tbody').on( 'click', 'button', function () {
                var data = table.row( $(this).parents('tr') ).data();
                alert( data[0] +"'s salary is: "+ data[ 5 ] );
            } );


        }

        //获取考试试卷数据
        var TestPaper = function() {
            return common.TextrequestService('../app/data/testpaper.json','get', {});
        };


        //获取生成的考试数据
        var GeneratedPaper = function() {
            return common.TextrequestService('../app/data/teaching-add-gpaper.json','get', {});
        };



        return {
            createPage: createPage
        }
    });