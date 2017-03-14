/**
 *   查看批阅试卷
 *
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/lookreadtest/lookreadtest.html',
		'text!tplUrl/teaching/testcentres/lookreadtest/iconOperation.html',
		'common',
		'jquery.hovertreescroll',
		'portamento',
		'jquery.fs.boxer',
		'radialIndicator',
		'css!font-awesome',
		'css!viewerCss',
		'css!cssUrl/lookreadtest'
	],
	function (template,$,layui,layer,
	          lookreadtestTpl,
	          iconOperationTpl,
	          common) {

		function createPage(page,childpage,examId,studentId) {
			if (window.history && window.history.pushState) {
				$(window).on('popstate', function () {
					history.go(0);
				});
			};

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			common.ajaxRequest("bxg/examMark/viewPublishedExamPaper","POST",{
				exam_id:examId,
				student_id:studentId
			},function(data){
				if (data.success){
					//处理与过滤HTML标签
					template.helper('dataHtml', function (date, format) {
						format = date.replace(/<[^>]+>/g,"");
						return format;
					});
					$("#app").html(template.compile(lookreadtestTpl)({
						GeneratedPaper: data,
						danXuan: data.resultObject.danxuan.lists,
						duoXuan: data.resultObject.duoxuan.lists,
						panDuan: data.resultObject.panduan.lists,
						tianKong: data.resultObject.tiankong.lists,
						jianDa: data.resultObject.jianda.lists
					}));
					$(".myClass_table tr:even").addClass("myClass_table_tr");

					$('#indicatorContainer').radialIndicator({
						barBgColor:"#f0f0f0",
						barColor:"#39b674",
						fontColor:"#39b674",
						percentage:false,
						fontSize:35,
						radius:70,
						barWidth : 6,
						initValue:99.9//data.resultObject.studentTotalScore//(data.resultObject.studentTotalScore/data.resultObject.testScore)*100
					});
					//$("img").click(function(){
					//	$(this).viewer();
					//})

					common.initImageViewer($(".paper-main"));
					//隐藏换题按钮
					$(".btn-Change").hide();

					//处理试卷中的图片
					//$('.J-pic-click .J-boxer').boxer({
					//	requestKey: 'abc123'
					//});
					//$('.J-pic-click img').boxer({
					//	requestKey: 'abc123'
					//});
					//题库导航
					var t = $('.fixed').offset().top;
					var mh = $('.paper-main').height();
					var fh = $('.fixed').height();
					$(window).scroll(function(e){
						var s = $(document).scrollTop();
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
			});
		}


		return {
			createPage: createPage
		}
	});