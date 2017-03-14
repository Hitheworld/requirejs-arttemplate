/**
 *   预览作业
 *
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/taskmanage/taskview/taskview.html',
		'text!tplUrl/teaching/taskmanage/taskview/TaskPaper.html',
		'common',
		'jquery.hovertreescroll',
		'portamento',
		'css!font-awesome',
		'css!cssUrl/taskmanage.taskview'
	],
	function (template,$,layui,layer,
	          taskviewTpl,
	          paperTpl,
	          common) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//返回时刷新
			if (window.history && window.history.pushState) {
				$(window).on('popstate', function () {
					history.go(0);
				});
			};

			///数据源
			var TaskViewDB = TaskView(exampPaperId);

			if(!TaskViewDB.success){
				layer.alert(TaskViewDB.errorMessage);
			}


			$("#app").html(template.compile( taskviewTpl)({
				GeneratedPaper: TaskViewDB
			}));
			$("#paper").html(template.compile( paperTpl)({
				GeneratedPaper: TaskViewDB,
				danXuan: TaskViewDB.resultObject.danxuan.lists,
				duoXuan: TaskViewDB.resultObject.duoxuan.lists,
				panDuan: TaskViewDB.resultObject.panduan.lists
			}));

			//隐藏换题按钮
			$(".btn-Change").hide();

			//处理试卷中的图片
			common.initImageViewer($('.pagePaper-content'));

			//题库导航
			var t = $('.fixed').offset().top;
			var mh = $('.paper-main').height();
			var fh = $('.fixed').height();
			$(window).scroll(function(e){
				s = $(document).scrollTop();
				if(s > t - 10){
					$('.fixed').css({'position':'fixed','top':'10px'});
					if(s + fh > mh){
						$('.fixed').css('top',mh-s-fh+'px');
					}
				}else{
					$('.fixed').css('position','');
				}
			});


		}

		/**
		 *  预览作业
		 * @param homeworkTplId
		 * @returns {*}
		 * @constructor
		 */
		var TaskView = function(homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/viewHomeworkTpl','get', {
				homeworkTplId: homeworkTplId
			});
		};


		return {
			createPage: createPage
		}
	});