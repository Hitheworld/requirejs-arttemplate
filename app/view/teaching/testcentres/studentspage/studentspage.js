define(['template',
        'jquery',
        'layui',
        'layer',
        'text!tplUrl/teaching/testcentres/studentspage/studentspage.html',
        'text!tplUrl/teaching/testcentres/studentspage/studentsTable.html',
        'common',
        'laypage',
        'css!font-awesome',
        'css!cssUrl/studentspage'
    ],
    function (template, $, layui, layer,
              markthetestsTpl,
              studentsTableTpl,
              common, laypage) {

        function createPage(page, childpage, pagenumber, pageType) {
            document.title = "博学谷·院校-教师端考试中心-发布试卷";

            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

            //设置头部导航
            $(".testcentres-tab-title li").removeClass("testcentres-this");
            $(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");

	        var findMarkExamDB = findMarkExam(pagenumber);

            function markthetests(sort, status, pageNumber, pageSize) {
                common.ajaxRequest("bxg/examMark/findMarkExamPage", "POST", {
                    exam_id: pagenumber,
                    sort: sort || "",
                    status: status || "",
                    pageNumber: pageNumber || 1,
                    pageSize: pageSize
                }, function (data) {
                    if (data.success) {
                        $("#markexampapersTable_tbody").html(template.compile(studentsTableTpl)({
	                        studentsTable:data,
	                        status: findMarkExamDB.resultObject.status
                        }));
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
                            var _this = $(this);
                            //询问框
                            layer.confirm('确定要向该学员发布成绩么？成绩发布后，学员可立即查看到成绩', {
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

                        $(".Batch_release").unbind().on("click", function (e) {
                            var _this = $(this);
                            //询问框
                            layer.confirm('确定要向该班级发布成绩么？成绩发布后，学员可立即查看到成绩', {
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
                    $("#testcentresHtml").html(template.compile(markthetestsTpl)({
	                    findMarkExam:data
                    }));
                    $("#markexampapers-peper-difficulty").on("change", function () {
                        var select_this1 = $("#markexampapers-peper-difficulty option:checked");
                        markthetests("", select_this1.val(), 1, 9);
                    });
                }
            });

            markthetests("", "", 1, 9)


        };


	    var findMarkExam = function(exam_id){
		    return common.requestService('bxg/examMark/findMarkExam','get', {
			    exam_id: exam_id
		    });
	    };


	    var findMarkExamPage = function(exam_id,sort,status,pageNumber,pageSize){
		    return common.requestService('bxg/examMark/findMarkExamPage','get', {
			    exam_id: exam_id,
			    sort: sort,
			    status: status,
			    pageNumber: pageNumber,
			    pageSize: pageSize
		    });
	    };


	    var publish = function(studentId, examId){
		    return common.requestService('bxg/examMark/publish','post', {
			    studentId: studentId,
			    examId: examId
		    });
	    };


        return {
            createPage: createPage
        }
    });