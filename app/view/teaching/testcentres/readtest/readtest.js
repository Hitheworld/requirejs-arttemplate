/**
 *   批阅试卷
 *
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/readtest/readtest.html',
		'common',
		'api',
		'jquery.hovertreescroll',
		'portamento',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.readtest'
	],
	function (template,$,layui,layer,
	          viewtestTpl,
	          common,api) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//数据源
			//数据源
			var GeneratedPaperDB = GeneratedPaper();
			console.log('添加数据是:',GeneratedPaperDB);

			$("#testcentresHtml").html(template.compile( viewtestTpl)({
				GeneratedPaper: GeneratedPaperDB,
				daiXuan: GeneratedPaperDB.resultObject.daiXuan.lists,
				duoXuan: GeneratedPaperDB.resultObject.duoXuan.lists,
				panDuan: GeneratedPaperDB.resultObject.panDuan.lists,
				tianKong: GeneratedPaperDB.resultObject.tianKong.lists,
				jianDa: GeneratedPaperDB.resultObject.jianDa.lists
			}));

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");



			//题库导航
			$('#sidebar').portamento({disableWorkaround: true});


		}

		//获取生成的考试数据
		var GeneratedPaper = function() {
			return common.requestService('../app/data/teaching-add-gpaper.json','get', {});
		};

		return {
			createPage: createPage
		}
	});