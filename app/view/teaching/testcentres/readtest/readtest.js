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

		function createPage(page,childpage,examId, studentId) {
			document.title = "博学谷·院校-教师端考试中心-批阅试卷";


			common.ajaxRequest("bxg/examMark/findMarkExamPaper","POST",{
				exam_id:examId,
				student_id:studentId
			},function(data){
				if (data.success){
					$("#app").html(template.compile(viewtestTpl)({
						GeneratedPaper: data,
						danXuan: data.resultObject.danxuan.lists,
						duoXuan: data.resultObject.duoxuan.lists,
						panDuan: data.resultObject.panduan.lists,
						tianKong: data.resultObject.tiankong.lists,
						jianDa: data.resultObject.jianda.lists
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
			})





		}

		return {
			createPage: createPage
		}
	});