/**
 *   预览试卷
 *
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/preview/preview.html',
		'text!tplUrl/common/paper.html',
		'common',
		'api',
		'jquery.hovertreescroll',
		'portamento',
		'jquery.fs.boxer',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.preview'
	],
	function (template,$,layui,layer,
	          previewrTpl,
	          paperTpl,
	          common,api) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-查看试卷";

			//数据源
			var GeneratedPaperDB = GeneratedPaper(exampPaperId);

			if(!GeneratedPaperDB.success){
				layer.alert(GeneratedPaperDB.errorMessage);
			}


			$("#app").html(template.compile( previewrTpl)({
				GeneratedPaper: GeneratedPaperDB
			}));
			$("#paper").html(template.compile( paperTpl)({
				GeneratedPaper: GeneratedPaperDB,
				danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
				duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
				panDuan: GeneratedPaperDB.resultObject.panduan.lists,
				tianKong: GeneratedPaperDB.resultObject.tiankong.lists,
				jianDa: GeneratedPaperDB.resultObject.jianda.lists
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
		var GeneratedPaper = function(exampaperId) {
			return common.requestService('bxg/examPaper/viewExamPaper','get', {
				exampaperId: exampaperId
			});
		};

		return {
			createPage: createPage
		}
	});