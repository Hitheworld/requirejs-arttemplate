/**
 *   查看考试
 *
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/viewtest/viewtest.html',
		'text!tplUrl/common/ViewPaper.html',
		'common',
		'api',
		'jquery.hovertreescroll',
		'portamento',
		'jquery.fs.boxer',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.viewtest'
	],
	function (template,$,layui,layer,
	          viewtestTpl,
	          paperTpl,
	          common,api) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");


			//数据源
			var ViewTestPaperDB = ViewTestPaper(exampPaperId);

			if(!ViewTestPaperDB.success){
				layer.alert(ViewTestPaperDB.errorMessage || '服务器出错!');
			}


			$("#app").html(template.compile( viewtestTpl)({
				viewTest: ViewTestPaperDB
			}));
			$("#paper").html(template.compile( paperTpl)({
				viewTest: ViewTestPaperDB,
				danXuan: ViewTestPaperDB.resultObject.questionsByType.danxuan.questions,
				duoXuan: ViewTestPaperDB.resultObject.questionsByType.duoxuan.questions,
				panDuan: ViewTestPaperDB.resultObject.questionsByType.panduan.questions
			}));

			//隐藏换题按钮
			$(".btn-Change").hide();

			//处理试卷中的图片
			$('.J-pic-click .J-boxer').boxer({
				requestKey: 'abc123'
			});
			$('.J-pic-click img').boxer({
				requestKey: 'abc123'
			});

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

		//获取生成的考试数据
		var ViewTestPaper = function(exampaperId) {
			return common.requestService('bxg/exam/view','get', {
				id: exampaperId
			});
		};


		return {
			createPage: createPage
		}
	});