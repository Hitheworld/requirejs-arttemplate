/**
 *   组织作业
 *
 *   本地查看示例:http://127.0.0.1:3000/app/js/lib/DataTables-1.10.13/examples/ajax/null_data_source.html
 *
 *   datatable中文文档:http://datatables.club/manual/data.html
 *
 *   npm install
 *   运行:npm run dev
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/taskmanage/organizetask/organizetask.html',
		'text!tplUrl/teaching/taskmanage/organizetask/organizeTaskTable.html',
		'common',
		'api',
		'json!DataTables-1.10.13/i18n/Chinese.json',
		'datatables.net',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.hovertreescroll',
		'portamento',
		'css!font-awesome',
		'css!cssUrl/taskmanage.organizetask'
	],
	function (template,$,layui,layer,laypage,
	          organizeTaskTpl,
	          tableTpl,
	          common,api,Chinese) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.organizetask").addClass("testcentres-this");

			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名
			var courseId = null,difficulty = null, pageNumber = 1, pageSize = 10;


			//课程数据源
			var CoursesDB = findTeacherCourses(teacherId);

			//数据源
			var TestPaperDB = TestPaper(login_name, difficulty, courseId, pageNumber, pageSize);
			var data = TestPaperDB.resultObject.items;

			$("#testcentresHtml").html(template.compile( organizeTaskTpl)({
				TestPaperDB: TestPaperDB,
				TestPager: data,
				Courses: CoursesDB
			}));

			$("#table").html(template.compile( tableTpl)({
				TestPaperDB: TestPaperDB,
				TestPager: data
			}));
			//奇偶行色
			$(".table-tr:odd").addClass("odd");
			$(".table-tr:even").addClass("even");
			page();

			//删除
			$(".J-delete").on('click', function(){
				var examepaperId =  $(this).data("id");
				var deleteDB = DeletePaper(examepaperId);
				if(deleteDB.success){
					layer.alert(deleteDB.resultObject.message);
					//history.go(0)
				}else {
					layer.alert(deleteDB.errorMessage);
				}
			});

			//难度选择  --- 课程选择
			$("#difficulty,#courseId").change(function() {
				difficulty = $("#difficulty option:checked").val();
				courseId = $("#courseId option:checked").val();
				//数据源
				var TestPaperDB = TestPaper(login_name, difficulty, courseId, pageNumber, pageSize);
				var data = TestPaperDB.resultObject.items;
				$("#table").html(template.compile( tableTpl)({
					TestPaperDB: TestPaperDB,
					TestPager: data
				}));
				//奇偶行色
				$(".table-tr:odd").addClass("odd");
				$(".table-tr:even").addClass("even");
				page();
			});

			function page(){
				laypage({
					cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
					pages: TestPaperDB.resultObject.totalPageCount, //通过后台拿到的总页数
					curr: 1, //当前页
					skin: '#2cb82c', //配色方案
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							//数据源
							var TestPaperDB = TestPaper(login_name, difficulty, courseId, obj.curr, pageSize);
							var data = TestPaperDB.resultObject.items;
							$("#table").html(template.compile( tableTpl)({
								TestPaperDB: TestPaperDB,
								TestPager: data
							}));
							//奇偶行色
							$(".table-tr:odd").addClass("odd");
							$(".table-tr:even").addClass("even");
						}
					}
				});
			}



		}

		//获取考试试卷数据
		var TestPaper = function(login_name, difficulty, courseId, pageNumber, pageSize) {
			return common.requestService('bxg/examPaper/findExamPaperPage','get', {
				login_name: login_name,
				difficulty: difficulty,
				courseId: courseId,
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};


		//查询该老师对应的课程下拉列表
		var findTeacherCourses = function(teacherId) {
			return common.requestService('bxg/examPaper/findTeacherCourses','get', {
				teacherId: teacherId
			});
		};


		//删除考试数据
		var DeletePaper = function(examepaperId) {
			return common.requestService('bxg/examPaper/deleteExamePaper','get', {
				examepaperId: examepaperId
			});
		};

		return {
			createPage: createPage
		}
	});