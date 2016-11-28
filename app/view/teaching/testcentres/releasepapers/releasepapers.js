/**
 *   发布试卷  (未进行的考试  与   历史考试)
 *
 *   本地查看示例:http://127.0.0.1:3000/app/js/lib/DataTables-1.10.13/examples/ajax/null_data_source.html
 *
 *   npm install
 *   运行:npm run dev
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/testcentres/releasepapers/releasepapers.html',
		'text!tplUrl/teaching/testcentres/releasepapers/releasepapers-NotTable.html',
		'text!tplUrl/teaching/testcentres/releasepapers/releasepapers-HistoryTable.html',
		'common',
		'api',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.releasepapers'
	],
	function (template,$,layui,layer,laypage,
	          releasepapersTpl,
	          NotTableTpl,
	          HistoryTableTpl,
	          common,api) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");

			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名
			var pageNumber = 1, pageSize = 3;
			var TYPE_POST = 2; //不变,后台必传参数

			//数据源
			var NotCarriedDB = NotCarried(TYPE_POST, pageNumber, pageSize);
			var HistoryExamDB = HistoryExam(TYPE_POST, pageNumber, pageSize);
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

			/**
			 * 创建发布试装对象
			 * @constructor
			 */
			function ReleasePapersPage(){
				var seft = this;
				this.init = function(notData, historyExamData){
					seft.initTpl(notData, historyExamData);
					seft.paging(notData, historyExamData);
				};


				/**
				 * 数据渲染
				 * @param notData
				 * @param historyExamData
				 */
				this.initTpl = function(notData, historyExamData){

					var NotCarriedData = notData.resultObject.items;
					var HistoryExamData = historyExamData.resultObject.items;

					$("#testcentresHtml").html(template.compile( releasepapersTpl)({
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
						HistoryExamDB: NotCarriedDB,
						HistoryExam: HistoryExamData
					}));
					//奇偶行色
					$(".table-tr:odd").addClass("odd");
					$(".table-tr:even").addClass("even");
					seft.paging(notData, historyExamData);
					seft.interaction();
				};


				/**
				 * 分页
				 * @param notData
				 * @param historyExamData
				 */
				this.paging = function(notData, historyExamData){
					laypage({
						cont:  $('#page1'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
						pages: notData.resultObject.totalPageCount, //通过后台拿到的总页数
						curr: 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								//数据源
								var notData = NotCarried(2, obj.curr, pageSize);
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
						pages: historyExamData.resultObject.totalPageCount, //通过后台拿到的总页数
						curr: 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								//数据源
								var historyExamData = HistoryExam(2, obj.curr, pageSize);
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
					//开始提示
					$(".J-open-start").on('click', function(){
						var examepaperId =  $(this).data("id");
						layer.confirm('确定要立即开始本次考试么？', {
							btn: ['确定','取消'] //按钮
						}, function(){
							var BeginGetDB = BeginGet(examepaperId);
							layer.msg('开始成功', {icon: 1},function(){
								//刷新操作
								history.go(0);
							});
						}, function(){
							layer.msg('你已取消', {icon: 2});
						});
					});

					//历史考试----发布
					$(".J-publish").on('click', function(){
						var examepaperId =  $(this).data("id");
						layer.confirm('确定要立即开始本次考试么？', {
							btn: ['确定','取消'] //按钮
						}, function(){
							var PublishPostDB = PublishPost(examepaperId);
							if(PublishPostDB.success){
								var pubIndex = layer.alert("发布试卷成功@!" ,function(){
									layer.clone(pubIndex);
									setInterval(function(){
										//刷新操作
										history.go(0);
									},1000);
								});
							}else {
								layer.alert(PublishPostDB.errorMessage  || "服务器出错！");
							}
							layer.msg('开始成功', {icon: 1},function(){
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
						layer.confirm('确定要删除此考试试卷么？', {
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

		/**
		 *  未结束的考试
		 * @param statusLt
		 * @param pageNumber
		 * @param pageSize
		 * @returns {*}
		 * @constructor
		 */
		//获取考试试卷数据
		var NotCarried = function(statusLt, pageNumber, pageSize) {
			return common.requestService('bxg/exam/list','get', {
				statusLt: statusLt,  // 状态(0:未开始考试，1：考试中，2:考试结束，待批阅。3：已批阅，待发布，4：已发布)
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};



		/**
		 *  已结束的考试
		 * @param statusGE
		 * @param HistoryExam
		 * @param pageSize
		 * @returns {*}
		 * @constructor
		 */
		//获取考试试卷数据
		var HistoryExam = function(statusGE, pageNumber, pageSize) {
			return common.requestService('bxg/exam/list','get', {
				statusGE: statusGE,  // 状态(0:未开始考试，1：考试中，2:考试结束，待批阅。3：已批阅，待发布，4：已发布)
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};

		//立即开始
		var BeginGet = function(examepaperId) {
			return common.requestService('bxg/exam/begin','post', {
				id: examepaperId
			});
		};


		//历史考试---发布
		var PublishPost = function(examepaperId) {
			return common.requestService('bxg/exam/publish','post', {
				id: examepaperId
			});
		};


		//删除考试数据
		var DeletePaper = function(examepaperId) {
			return common.requestService('bxg/exam/del','get', {
				id: examepaperId
			});
		};


		return {
			createPage: createPage
		}
	});