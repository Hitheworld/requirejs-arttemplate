/**
 *   考试管理
 */
define(['template',
        'jquery',
        'text!tplUrl/teaching/myclass/myclass.html',
        "text!tplUrl/teaching/myclass/Create_a_class.html",
        "text!tplUrl/teaching/myclass/Add_the_student.html",
        "text!tplUrl/teaching/myclass/To_import_the_students.html",
        'common',
        'layer',
        'layui',
        'api',
        'jquery.validate',
        'jquery.validate.zh',
        'css!cssUrl/teaching.testcentres',
        'css!cssUrl/myclass'
    ],
    function (template, $,
              myclassTpl, Create_a_classTpl, Add_the_studentTpl, To_import_the_studentsTpl,
              common, layer, layui, api) {

        function createPage(page, childpage, pagenumber) {
            document.title = "博学谷·院校-教师端我的班级";
            $("#teachingHtml").html(myclassTpl);
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            $(".teaching").css("position", "relative");
            $(".teachingBox").css("background-color", "#f6f6f6");
            $(".teachingBox").css("position", "relative");
            $(".teaching-nav").show();
            $(".testcentres-nav").show();

            $("#Create_a_class").on("click", function () {
                layer.open({
                    type: 1,
                    title: '创建班级',
                    area: ['500px', '466px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: Create_a_classTpl
                });
                common.ajaxRequest('bxg/common/collegesList', "GET", {}, function (data) {
                    $("#Create_a_class_select1").empty();
                    for (var i = 0; i < data.resultObject.length; i++) {
                        $("#Create_a_class_select1").append("<li data-id=" + data.resultObject[i].id + ">" + data.resultObject[i].collegeName + "</li>")
                    }
                    //选择事件---选择学校
                    var oSelect = $(".J-school1");
                    var oSub = $("#Create_a_class_select1");
                    var aLi = $("#Create_a_class_select1 li");
                    oSelect.on('click', function(event){
                        oSub.toggle();
                        //阻止事件冒泡
                        return false;
                    });
                    for (i = 0; i < aLi.length; i++)
                    {
                        //鼠标划过
                        aLi[i].onmouseover = function ()
                        {
                            this.className = "hover"
                        };
                        //鼠标离开
                        aLi[i].onmouseout = function ()
                        {
                            this.className = "";
                        };
                        //鼠标点击
                        aLi[i].onclick = function ()
                        {
                            var v = this.innerHTML;
                            //console.log(v)
                            oSelect.val(v);
                        }
                    }

                    aLi.on("click",function(e){
                        var eve = e || window.event;
                        oSelect.val($(this).html())
                    });
                    $(document).on('click', function(){
                        oSub.hide();
                    });
                });

                $("#department_name").bind("input propertychange",function(e){
                    if ($.trim($("#department_name").val())) {
                        common.ajaxRequest('bxg/common/departMentList', "GET", {
                            departmentName:$.trim($("#department_name").val())
                        },function(data){
                            console.log(data)
                        });
                    }
                });

                $("#Create_a_class_form").validate({
                    rules: {
                        squad_name: {
                            required: true
                        },
                        end_time: {
                            required: true
                        }

                    },
                    messages: {
                        squad_name: {
                            required: "请输入班级名称"
                        },
                        end_time: {
                            required: "请输入毕业时间"
                        }
                    },
                    errorElement: "p"
                });

            });


            $("#Add_the_student").on("click", function () {
                layer.open({
                    type: 1,
                    title: '添加学生',
                    area: ['500px', '613px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: Add_the_studentTpl
                });
                $(".layui-btn-primary").click();
            });

            $("#To_import_the_students").on("click", function () {
                layer.open({
                    type: 1,
                    title: '批量导入学生',
                    area: ['500px', '277px'], //宽高
                    shadeClose: true,//开启遮罩关闭
                    content: To_import_the_studentsTpl
                });
                $(".layui-btn-primary").click();
            });


            //处理子页面
            this.childCreatePage = function (page, childpage, pagenumber) {
                require(['tplUrl/teaching/' + page + '/' + childpage + '/' + childpage], function (m) {
                    m.createPage(page, childpage, pagenumber);
                    if (pagenumber != undefined) {
                        m.subPageCreatePage(page, childpage, pagenumber);
                    }
                });
            }

        }

        return {
            createPage: createPage
        }
    });