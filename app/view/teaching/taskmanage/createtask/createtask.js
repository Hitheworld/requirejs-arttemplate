/**
 *   创建作业
 *
 */
define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/taskmanage/createtask/createtask.html',
        'text!tplUrl/teaching/taskmanage/createtask/addTask.html',
        'common',
        'api',
        'json!DataTables-1.10.13/i18n/Chinese.json',
        'datatables.net',
        'jquery.ztree',
        'jquery.validate',
        'jquery.validate.zh',
        'css!font-awesome',
        'css!cssUrl/taskmanage.createtask',
        'css!cssUrl/teaching.testcentres.createtest',
        'css!cssUrl/tree.checkbox'
    ],
    function (template, $, layui, layer,
              createtestTpl,
              addTestPaperTpl,
              common, api, Chinese) {

        function createPage(page, childpage, pagenumber) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.releasetask").addClass("testcentres-this");

            $(".teaching").css("position", "relative");
            $(".teachingBox").css("background-color", "#f6f6f6");
            $(".teachingBox").css("position", "relative");
            $(".teaching-nav").show();
            $(".testcentres-nav").show();

            //数据源
            var GeneratedPaperDB = GeneratedPaper();
            var data = GeneratedPaperDB.resultObject.lists;


            $("#testcentresHtml").html(template.compile(createtestTpl)({}));

            $("#createtestForm").validate({
                rules: {
                    papername: {
                        required: true
                    },
                    paperwhenlong: {
                        required: true,
                        digits: true
                    },
                    papertraits: {
                        required: true
                    },
                    testScores: {
                        required: true,
                        digits: true
                    },
                    paperselete: {
                        required: true
                    }
                },
                messages: {
                    papername: {required: '请输入试卷名称'},
                    paperwhenlong: {required: '请输入试卷时长'},
                    papertraits: {required: '请选择试卷难度'},
                    testScores: {required: '请输入试卷分数'},
                    paperselete: {required: '请选择选择课程'}
                },
                errorElement: "p"
            });


            //添加试卷
            $(".J-add-testpaper").on('click', function () {
                layer.open({
                    type: 1,
                    title: "选择试卷 课程名称课程名称",
                    area: ['924px', '800px'], //宽高
                    content: template.compile(addTestPaperTpl)({})
                });

                var setting = {
                    check: {
                        enable: true
                    },
                    /*data: {
                     simpleData: {
                     enable: true
                     }
                     }*/
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onCheck: onCheck
                    }

                };

                if (true) {
                    var zNodes = [{
                        id: 1,
                        pId: 0,
                        name: "随意勾选 1",
                        open: false
                    }, {
                        id: 11,
                        pId: 1,
                        name: "随意勾选 1-1",
                        open: true
                    }, {
                        id: 111,
                        pId: 11,
                        name: "随意勾选 1-1-1"
                    }, {
                        id: 112,
                        pId: 11,
                        name: "随意勾选 1-1-2"
                    }, {
                        id: 12,
                        pId: 1,
                        name: "随意勾选 1-2",
                        open: true
                    }, {
                        id: 121,
                        pId: 12,
                        name: "随意勾选 1-2-1"
                    }, {
                        id: 122,
                        pId: 12,
                        name: "随意勾选 1-2-2"
                    }, {
                        id: 2,
                        pId: 0,
                        name: "随意勾选 2",
                        open: false
                    }, {
                        id: 21,
                        pId: 2,
                        name: "随意勾选 2-1"
                    }, {
                        id: 22,
                        pId: 2,
                        name: "随意勾选 2-2",
                        open: true
                    }, {
                        id: 221,
                        pId: 22,
                        name: "随意勾选 2-2-1"
                    }, {
                        id: 222,
                        pId: 22,
                        name: "随意勾选 2-2-2"
                    }, {
                        id: 23,
                        pId: 2,
                        name: "随意勾选 2-13"
                    }];

                    $(document).ready(function () {
                        $.fn.zTree.init($("#addTestPaper-box-header-div-set"), setting, zNodes);
                    });
                } else {
                    $("#addTestPaper-box-header-div-set").html("<span class='error'>" + courseChapterPointTreeDB.errorMessage + "</span>");
                }


                function onCheck(e, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj("addTestPaper-box-header-div-set"),
                        nodes = treeObj.getCheckedNodes(true),
                        v = '';
                    var kp = '';
                    for (var i = 0; i < nodes.length; i++) {
                        //v += nodes[i].name + ",";
                        //获取kpointIds名字
                        exam_range.push(nodes[i].name);
                        //获取kpointIds
                        kpointIds.push(nodes[i].id);
                    }
                    kpointIds = kpointIds.toString();
                    exam_range = exam_range.toString();
                    console.log(exam_range)
                }

                //生成表格
                var table = $('#addTestPaper').DataTable({
                    data: data,  //对象数据
                    columns: [
                        {data: 'testName'},
                        {data: 'testDifficulty'},
                        {data: 'testScore'},
                        {data: 'testTime'},
                        {data: '<a href="">预览试卷</a>'}
                    ],
                    "searching": false,  //是否开启本地搜索功能
                    "lengthChange": false, //是否允许最终用户改变表格每页显示的记录数
                    "language": Chinese,   //国际化--中文
                    "lengthChange": false,   //是否允许用户改变表格每页显示的记录数
                    "pageLength": 5,   //改变初始的页面长度(每页显示的记录数)
                    "columnDefs": [
                        {"width": "350px", className: "name", "targets": 0},
                        {"width": "75px", className: "difficulty", "targets": 1},
                        {"width": "65px", className: "testScore", "targets": 2},
                        {"width": "80px", className: "heat", "targets": 3},
                        {"width": "auto", className: "operation", "targets": 4},
                        {
                            "targets": -1,
                            "data": null,
                            "defaultContent": '<a href="#/teaching/testcentres/preview" target="_blank">预览试卷</a>'
                        }]
                });
            });


        }


        //获取生成的考试数据
        var GeneratedPaper = function () {
            return common.TextrequestService('app/data/teaching-testpaper-lists.json', 'get', {});
        };


        return {
            createPage: createPage
        }
    });