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
		'text!tplUrl/teaching/testcentres/readtest/readtest2.html',
		'common',
		'api',
		'jquery.hovertreescroll',
		'portamento',
		'jquery.fs.boxer',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.readtest'
	],
	function (template,$,layui,layer,
	          viewtestTpl,readtest2Tpl,
	          common,api) {

		function createPage(page,childpage,examId, studentId) {
			document.title = "博学谷·院校-教师端考试中心-批阅试卷";
			//返回时刷新
			if (window.history && window.history.pushState) {
				$(window).on('popstate', function () {
					history.go(0);
				});
			}

			common.ajaxRequest("bxg/examMark/findMarkExamPaper","POST",{
				exam_id:examId,
				student_id:studentId
			},function(data){
				if (data.success){
					//处理与过滤HTML标签
					template.helper('dataHtml', function (date, format) {
						format = date.replace(/<[^>]+>/g,"");
						return format;
					});

					$("#app").html(template.compile(readtest2Tpl)({
						GeneratedPaper: data,
						danXuan: data.resultObject.danxuan.lists,
						duoXuan: data.resultObject.duoxuan.lists,
						panDuan: data.resultObject.panduan.lists,
						tianKong: data.resultObject.tiankong.lists,
						jianDa: data.resultObject.jianda.lists
					}));

					var arr = [
						data.resultObject.tiankong.lists.length,
						data.resultObject.jianda.lists.length,
						data.resultObject.danxuan.lists.length,
						data.resultObject.duoxuan.lists.length,
						data.resultObject.panduan.lists.length
					];
					var arr2 = ["tianKongdv","jianDadv","danXuandv","duoXuandv","panDuandv"];
					for (var i = 0; i < arr.length; i++) {
						if (arr[i] > 0) {
							$(".readtest-tab-title li[data-type="+arr2[i]+"]").addClass("readtest-tab-title-this");
							//$(".readtest-tab-title li:nth-child("+i+")")
							//console.log(i)
							$("#"+arr2[i]).css("display","block");
							break;
						}
					}

					$(".history_back").attr("href","#/teaching/testcentres/markthetests/"+examId);

					$(".grade").on("blur",function(){
						var _this = $(this);
						var mark_score = $.trim(_this.val());
						if (mark_score != "") {
							if(parseInt(mark_score) >= 0){
								if (parseInt(mark_score) <= _this.attr("data-score")) {
									common.ajaxRequest("bxg/examMark/markExamPaper","POST",{
										student_id:studentId,
										question_id:_this.attr("data-id"),
										exam_id:examId,
										mark_score:mark_score
									},function(con){
										if (con.success) {

										}
									});
								}else {
									layer.msg("分数不能大于总分数", {icon: 5});
									_this.val("0");
								}
							}else {
								layer.msg("分数不能小于0", {icon: 5});
								_this.val("0");
							}
						}else {
							layer.msg("分数不能为空", {icon: 5});
						}
					});

					$(".nextbit").on("click",function(){
						common.ajaxRequest("bxg/examMark/finishExamMark","POST",{
							exam_id:examId,
							student_id:studentId
						},function(con){
							if (con.success){
								if (con.resultObject.stutus) {
									window.location.href = "#/teaching/testcentres/readtest/"+examId+"/"+con.resultObject.studentId;
									history.go(0);
								}else {
									window.location.href = "#/teaching/testcentres/markthetests/"+examId;
									history.go(0);
								}
							}
						})
					});
					common.initImageViewer($(".paper-main"));
					$(".readtest-tab-title li").on("click",function(){
						var _this = $(this);
						$(".readtest-tab-title li").removeClass("readtest-tab-title-this");
						_this.addClass("readtest-tab-title-this");
						$(".pagePaper").css("display","none");
						$("#"+_this.data("type")).css("display","block");
					});

					//$(".pagePaper-top").on("click",function(){
					//	var _this = $(this);
					//	if (_this.next().is(":hidden")) {
					//		_this.removeClass("pagePaper-top-false");
					//		_this.addClass("pagePaper-top-true");
					//		_this.next().css("display", "block");
					//		_this.find("img").attr("src","./app/assets/images/myclass/038.png")
					//	} else {
					//		_this.removeClass("pagePaper-top-true");
					//		_this.addClass("pagePaper-top-false");
					//		_this.next().css("display", "none");
					//		_this.find("img").attr("src","./app/assets/images/myclass/039.png")
					//	}
					//});

					$(".box-nav > a").on("click",function(){
						var _this = $(this);
						var isid = _this.data("id");
						$(".readtest-tab-title li").removeClass("readtest-tab-title-this")
						$(".readtest-tab-title li").each(function(){
							if ($(this).data("type") == isid) {
								$(this).addClass("readtest-tab-title-this");
							}
						});
						$(".pagePaper").css("display","none");
						$("#"+isid).css("display","block");
						setTimeout(function(){
							var t = $(window).scrollTop();
							$('body').animate({'scrollTop' : (t-110)+'px'}, 10)
						},1100)
					});
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
					var fh = $('.fixed').height();
					var t2 = $('.readtest-tab-title').offset().top;
					var fh2 = $('.readtest-tab-title').height();
					$(window).scroll(function(e){
						var mh = $('.paper-main').height();
						var s = $(document).scrollTop();
						if(s > t - 75){
							$('.fixed').css({'position':'fixed','top':'75px'});
							//if(s + fh > mh){
							//	$('.fixed').css('top',mh-s-fh+'px');
							//}
						}else{
							$('.fixed').css('position','');
						}
						if(s > t2){
							$("#history_back").css("display","block");
							$('.readtest-tab-title').css({'position':'fixed','top':'0px',"width":"1200px","box-shadow": "0 2px 5px #ccc"});
							//if(s + fh2 > mh){
							//	$('.readtest-tab-title').css('top',mh-s-fh2+'px');
							//}
						}else{
							$('.readtest-tab-title').css({'position':'',"width":"100%","box-shadow": "0 1px 0 #ccc"});
							$("#history_back").css("display","none");
						}
					});
				}
			})





		}

		return {
			createPage: createPage
		}
	});