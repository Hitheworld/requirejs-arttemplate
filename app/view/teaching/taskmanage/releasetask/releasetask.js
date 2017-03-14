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
		'text!tplUrl/teaching/taskmanage/releasetask/releasetask.html',
		'text!tplUrl/teaching/taskmanage/releasetask/releasetask-NotTable.html',
		'text!tplUrl/teaching/taskmanage/releasetask/releasetask-HistoryTable.html',
		'common',
		'xvCalendar',
		'jquery-ui-timepicker-zh-CN',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/taskmanage.releasetask'
	],
	function (template,$,layui,layer,laypage,
	          releaseTaskTpl,
	          NotTableTpl,
	          HistoryTableTpl,
	          common) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.releasetask").addClass("testcentres-this");

			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名
			//获取班级id--初始化
			var squadId = $("#stayHomeworkClass option:checked").val();
			var pageNumber = 1, pageSize = 9;
			var TYPE_POST = 2; //不变,后台必传参数
			var squadId = $.trim($("#completedHomeworkClass").val()) || "";   //班级
			var nameLike = $.trim($("#completedHomeworkName").val()) || "";   //搜索的内容
			var publishTimeFrom = $.trim($("#startTime").val()) || "";   //开始时间
			var publishTimeTo = $.trim($("#endTime").val()) || "";   //结束时间

			//该教师下的班级
			var findClassDB = findClass(teacherId);

			//数据源
			var NotCarriedDB = NotCarried(TYPE_POST,squadId, pageNumber, pageSize);
			var HistoryExamDB = HistoryExam(TYPE_POST,squadId,nameLike,publishTimeFrom,publishTimeTo, pageNumber, pageSize);
			if(!NotCarriedDB.success){
				layer.alert(NotCarriedDB.errorMessage || '服务器异常!');
				return false;
			}
			if(!HistoryExamDB.success){
				layer.alert(HistoryExamDB.errorMessage || '服务器异常!');
				return false;
			}



			/**
			 * 实例化对象
			 * @type {ReleasePapersPage}
			 */
			var pageRele = new ReleasePapersPage();
			pageRele.init(NotCarriedDB, HistoryExamDB);


			if( pageType == "completed"){
				$(".completedHomework-tab").addClass("layui-this");
				$(".completedHomework-cont").addClass("layui-show");

				$(".stayHomework-tab").removeClass("layui-this");
				$(".stayHomework-cont").removeClass("layui-show");
			}

			if( pageType == "stay"){
				$(".completedHomework-tab").removeClass("layui-this");
				$(".completedHomework-cont").removeClass("layui-show");

				$(".stayHomework-tab").addClass("layui-this");
				$(".stayHomework-cont").addClass("layui-show");
			}

			/**
			 * 创建发布试装对象
			 * @constructor
			 */
			function ReleasePapersPage(){
				var seft = this;
				this.init = function(notData, historyExamData){
					seft.initTpl(notData, historyExamData);
					seft.paging(NotCarriedDB.resultObject.totalPageCount, HistoryExamDB.resultObject.totalPageCount);
				};


				/**
				 * 数据渲染
				 * @param notData
				 * @param historyExamData
				 */
				this.initTpl = function(notData, historyExamData){

					var NotCarriedData = notData.resultObject.items;
					var HistoryExamData = historyExamData.resultObject.items;

					$("#testcentresHtml").html(template.compile( releaseTaskTpl)({
						findClass: findClassDB,
						NotCarried: NotCarriedData,
						HistoryExam: HistoryExamData
					}));
					//获取未进行的考试--数据
					$("#NotCarried").html(template.compile( NotTableTpl)({
						NotCarriedDB: NotCarriedDB,
						NotCarried: NotCarriedData
					}));

					//获取历史考试--数据
					$("#HistoryExam").html(template.compile( HistoryTableTpl)({
						HistoryExamDB: HistoryExamDB,
						HistoryExam: HistoryExamData
					}));
					//奇偶行色
					$(".table-tr:odd").addClass("odd");
					$(".table-tr:even").addClass("even");
					seft.paging(NotCarriedDB.resultObject.totalPageCount, HistoryExamDB.resultObject.totalPageCount);
					seft.interaction();
				};


				/**
				 * 分页
				 * @param notData
				 * @param historyExamData
				 */
				this.paging = function(notDataTotalPageCount, historyExamDataTotalPageCount){
					laypage({
						cont:  $('#page1'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
						pages: notDataTotalPageCount, //通过后台拿到的总页数
						curr: 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								//数据源
								//获取班级id--初始化
								var squadId = $("#stayHomeworkClass option:checked").val();
								var notData = NotCarried(TYPE_POST,squadId, obj.curr, pageSize);
								if(!notData.success){
									layer.alert(notData.errorMessage || '服务器异常!');
									return false;
								}
								var UpdateData = notData.resultObject.items;
								$("#NotCarried").html(template.compile( NotTableTpl)({
									NotCarriedDB: notData,
									NotCarried: UpdateData
								}));
								//奇偶行色
								$(".table-tr:odd").addClass("odd");
								$(".table-tr:even").addClass("even");
								seft.interaction();
							}
						}
					});
					laypage({
						cont:  $('#page2'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
						pages: historyExamDataTotalPageCount, //通过后台拿到的总页数
						curr: 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								//数据源
								var historyExamData = HistoryExam(TYPE_POST,squadId,nameLike,publishTimeFrom,publishTimeTo, obj.curr, pageSize);
								if(!historyExamData.success){
									layer.alert(historyExamData.errorMessage || '服务器异常!');
									return false;
								}
								var UpdateData = historyExamData.resultObject.items;
								$("#HistoryExam").html(template.compile( HistoryTableTpl)({
									HistoryExamDB: historyExamData,
									HistoryExam: UpdateData
								}));
								//奇偶行色
								$(".table-tr:odd").addClass("odd");
								$(".table-tr:even").addClass("even");
								seft.interaction();
							}
						}
					});
				};


				/**
				 * 交互
				 */
				this.interaction = function(){
					if( pageType == 'completed'){
						$("ul.layui-tab-title li").removeClass("layui-this");
						$(".layui-tab-content .layui-tab-item").removeClass("layui-show");
						$("ul.layui-tab-title .completedHomework-tab").addClass("layui-this");
						$(".layui-tab-content .completedHomework-cont").addClass("layui-show");
					};

					//未结束作业--下拉发送请求  --班级选择
					$("#stayHomeworkClass").change(function() {
						var squadId = $("#stayHomeworkClass option:checked").val();
						//数据源
						var NotCarriedDB = NotCarried(2,squadId, pageNumber, pageSize);
						if(!NotCarriedDB.success){
							layer.alert(NotCarriedDB.errorMessage || '服务器异常!');
							return false;
						}
						var UpdateData = NotCarriedDB.resultObject.items;
						$("#NotCarried").html(template.compile( NotTableTpl)({
							NotCarriedDB: NotCarriedDB,
							NotCarried: UpdateData
						}));
						//奇偶行色
						$(".table-tr:odd").addClass("odd");
						$(".table-tr:even").addClass("even");
						seft.paging(NotCarriedDB.resultObject.totalPageCount, HistoryExamDB.resultObject.totalPageCount);
					});

					//已结束作业 --- 点击提交数据交互
					//日历控件---开始时间与结束时间
					//var startTimeDate = {//example 1 opts
					//	'targetId':'startTime',//时间写入对象的id
					//	'triggerId': 'startTime',//触发事件的对象id
					//	'alignId':'startTime',//日历对齐对象
					//	'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
					//	'hms':'on'
					//},
					//	endTimeDate = {//example 1 opts
					//		'targetId':'endTime',//时间写入对象的id
					//		'triggerId': 'endTime',//触发事件的对象id
					//		'alignId':'endTime',//日历对齐对象
					//		'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
					//		'hms':'on'
					//	};
					//xvDate(startTimeDate);
					//xvDate(endTimeDate);

					$( "#startTime" ).datetimepicker({
						showSecond: true,
							timeFormat: 'hh:mm:ss'
					});
					$( "#endTime" ).datetimepicker({
						showSecond: true,
							timeFormat: 'hh:mm:ss'
					});

					$("#completedHomeworkClass").change(function() {
						var squadId = $("#completedHomeworkClass option:checked").val();  //班级
						var publishTimeFrom =  $.trim($("#startTime").val()) || '';  //开始时间
						var publishTimeTo =  $.trim($("#endTime").val()) || '';  //结束时间
						var nameLike = $.trim($("#completedHomeworkName").val()) || '';  //搜索内容

						HistoryExamDB = HistoryExam(TYPE_POST,squadId,nameLike,publishTimeFrom,publishTimeTo, pageNumber, pageSize);
						var HistoryExamData = HistoryExamDB.resultObject.items;
						//获取历史考试--数据
						$("#HistoryExam").html(template.compile( HistoryTableTpl)({
							HistoryExamDB: HistoryExamDB,
							HistoryExam: HistoryExamData
						}));
						//奇偶行色
						$(".table-tr:odd").addClass("odd");
						$(".table-tr:even").addClass("even");
						seft.paging(NotCarriedDB.resultObject.totalPageCount, HistoryExamDB.resultObject.totalPageCount);
					});

					//提交
					$("#completedHomeworkForm").on('submit' ,function(){
						var squadId = $("#completedHomeworkClass option:checked").val();  //班级
						var publishTimeFrom =  $.trim($("#startTime").val());  //开始时间
						var publishTimeTo =  $.trim($("#endTime").val());  //结束时间
						var nameLike = $.trim($("#completedHomeworkName").val());  //搜索内容

						HistoryExamDB = HistoryExam(TYPE_POST,squadId,nameLike,publishTimeFrom,publishTimeTo, pageNumber, pageSize);
						var HistoryExamData = HistoryExamDB.resultObject.items;
						//获取历史考试--数据
						$("#HistoryExam").html(template.compile( HistoryTableTpl)({
							HistoryExamDB: HistoryExamDB,
							HistoryExam: HistoryExamData
						}));
						//奇偶行色
						$(".table-tr:odd").addClass("odd");
						$(".table-tr:even").addClass("even");
						seft.paging(NotCarriedDB.resultObject.totalPageCount, HistoryExamDB.resultObject.totalPageCount);
						return false; //阻止默认提交
					});



					//历史考试----发布
					$(".J-publish").on('click', function(){
						var examepaperId =  $(this).data("id");
						layer.confirm('你确定要现在发布么？', {
							shade: [0.6, '#000'],
							btn: ['确定','取消'] //按钮
						}, function(){
							var PublishPostDB = PublishPost(examepaperId);
							if(PublishPostDB.success){
								var pubIndex = layer.alert("发布作业成功!" ,function(){
									layer.clone(pubIndex);
									setInterval(function(){
										//刷新操作
										history.go(0);
									},1000);
								});
							}else {
								layer.alert(PublishPostDB.errorMessage  || "服务器出错！");
							}
							layer.msg('发布成功', {icon: 1},function(){
								//刷新操作
								history.go(0);
							});
						}, function(){
							layer.msg('你已取消', {icon: 2});
						});
					});

					//删除
					$(".J-tips-del").on('click', function(){
						var examepaperId =  $(this).data("id");
						layer.confirm('确定要删除此作业试卷么？', {
							shade: [0.6, '#000'],
							btn: ['确定','取消'] //按钮
						}, function(){
							var deleteDB = DeletePaper(examepaperId);
							if(deleteDB.success){
								layer.msg('删除成功!', {icon: 1},function(){
									//刷新操作
									history.go(0);
								});
							}else {
								layer.alert(deleteDB.errorMessage);
							}
						}, function(){
							layer.msg("你已取消操作", {icon: 2});
						});

					});

				};

			}


		}


		//查询该老师对应的班级下拉列表
		var findClass = function(teacherId) {
			return common.requestService('bxg/teaching/squad/noGraduateSquad','get', {
				teacherId: teacherId
			});
		};

		/**
		 *  未结束作业
		 * @param statusLt
		 * @param pageNumber
		 * @param pageSize
		 * @returns {*}
		 * @constructor
		 */
		//获取考试试卷数据
		var NotCarried = function(statusLt,squadId, pageNumber, pageSize) {
			return common.requestService('bxg/homework/list','get', {
				statusLt: statusLt,  // 状态(0:未开始考试，1：考试中，2:考试结束，待批阅。3：已批阅，待发布，4：已发布)
				squadId: squadId,
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};



		/**
		 *  已结束作业
		 * @param statusGE
		 * @param HistoryExam
		 * @param pageSize
		 * @returns {*}
		 * @constructor
		 */
		//获取考试试卷数据
		var HistoryExam = function(statusGE,squadId,nameLike,publishTimeFrom,publishTimeTo, pageNumber, pageSize) {
			return common.requestService('bxg/homework/list','post', {
				statusGE: statusGE,  // 状态(0:未发布，1：已发布，作业中，2:作业结束）
				squadId: squadId,   //班级
				nameLike: nameLike,   //搜索的作业名称
				publishTimeFrom: publishTimeFrom,  //发布的开始时间
				publishTimeTo: publishTimeTo,  //发布的结束时间
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};


		//历史考试---发布
		var PublishPost = function(examepaperId) {
			return common.requestService('bxg/homework/publish','post', {
				id: examepaperId
			});
		};


		//删除考试数据
		var DeletePaper = function(examepaperId) {
			return common.requestService('bxg/homework/del','get', {
				id: examepaperId
			});
		};


		return {
			createPage: createPage
		}
	});