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

		function createPage(page,childpage,pageType, exampPaperId) {
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
			var TestPaperDB = TestPaper(login_name, courseId, pageNumber, pageSize);
			var data = TestPaperDB.resultObject.items;


			function OrganizetaskClass(){
				var seft = this;
				this.__init__ = function(){
					seft.Template();
					seft.interaction();
					seft.pageing(TestPaperDB.resultObject.totalPageCount);
				};

				this.Template = function(){
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
					seft.pageing(TestPaperDB.resultObject.totalPageCount);
				};

				this.interaction = function(){
					//删除
					$(".J-delete").on('click', function(){
						var examepaperId =  $(this).data("id");

						layer.confirm('确定要删除此试卷作业吗？', {
							shade: [0.6, '#000'],
							btn: ['确定','取消'] //按钮
						}, function(){
							var DeleteTaskDB = DeleteTask(examepaperId);
							if(DeleteTaskDB.success){
								var pubIndex = layer.alert("发布试卷成功!" ,function(){
									layer.clone(pubIndex);
									setInterval(function(){
										//刷新操作
										history.go(0);
									},1000);
								});
							}else {
								layer.alert(DeleteTaskDB.errorMessage  || "服务器出错！");
							}
							layer.msg('删除成功', {icon: 1},function(){
								//刷新操作
								history.go(0);
							});
						}, function(){
							layer.msg('你已取消', {icon: 2});
						});
					});

					//难度选择  --- 课程选择
					$("#difficulty,#courseId").change(function() {
						difficulty = $("#difficulty option:checked").val();
						courseId = $("#courseId option:checked").val();
						//数据源
						var TestPaperDB = TestPaper(login_name, courseId, pageNumber, pageSize);
						var data = TestPaperDB.resultObject.items;
						$("#table").html(template.compile( tableTpl)({
							TestPaperDB: TestPaperDB,
							TestPager: data
						}));
						//奇偶行色
						$(".table-tr:odd").addClass("odd");
						$(".table-tr:even").addClass("even");
						seft.pageing(TestPaperDB.resultObject.totalPageCount);
					});
				};

				this.pageing = function(totalPageCount){
					laypage({
						cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
						pages: totalPageCount, //通过后台拿到的总页数
						curr: 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								//数据源
								var TestPaperDB = TestPaper(login_name, courseId, obj.curr, pageSize);
								var data = TestPaperDB.resultObject.items;
								$("#table").html(template.compile( tableTpl)({
									TestPaperDB: TestPaperDB,
									TestPager: data
								}));
								//奇偶行色
								$(".table-tr:odd").addClass("odd");
								$(".table-tr:even").addClass("even");
								seft.interaction();
							}
						}
					});
				};

			};

			/**
			 * 实例化对象
			 * @type {OrganizetaskClass}
			 */
			var Organizetask = new OrganizetaskClass();
			Organizetask.__init__();





		}

		/**
		 * 获取考试试卷数据---作业
		 * @param login_name
		 * @param courseId
		 * @param pageNumber
		 * @param pageSize
		 * @returns {*}
		 * @constructor
		 */
		var TestPaper = function(login_name, courseId, pageNumber, pageSize) {
			return common.requestService('bxg/homeworkTpl/findHomeworkTplPage','get', {
				login_name: login_name,
				courseId: courseId,
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};


		/**
		 * 查询该老师对应的课程下拉列表
		 * @param teacherId
		 * @returns {*}
		 */
		var findTeacherCourses = function(teacherId) {
			return common.requestService('bxg/homeworkTpl/findHomeworkAllCourses','get', {
				teacherId: teacherId
			});
		};


		/**
		 * 删除考试数据--作业
		 * @param examepaperId
		 * @returns {*}
		 * @constructor
		 */
		var DeleteTask = function(homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/deleteHomeworkTpl','get', {
				homeworkTplId: homeworkTplId
			});
		};

		return {
			createPage: createPage
		}
	});