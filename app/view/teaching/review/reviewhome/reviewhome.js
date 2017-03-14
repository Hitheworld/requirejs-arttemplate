/**
 *   预习/复习
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/review/reviewhome/reviewhome.html',
		'text!tplUrl/teaching/review/reviewhome/reviewhome-table.html',
		'common',
		'css!font-awesome',
		'css!cssUrl/reviewhome'
	],
	function (template,$,layui,layer,laypage,
	          reviewhomeTpl,
	          reviewhometableTpl,
	          common) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.organizepaper").addClass("testcentres-this");


			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名
			var REVIEW_PAGENUMBER = 1, REVIEW_PAGESIZE = 10;

			//数据源
			var PreviewReviewDB = findPreviewReviewPage( REVIEW_PAGENUMBER, REVIEW_PAGESIZE);
			var data = PreviewReviewDB.resultObject.items;

			$("#testcentresHtml").html(template.compile( reviewhomeTpl)({
				PRDB: PreviewReviewDB,
				lists: data
			}));

			$("#table").html(template.compile( reviewhometableTpl)({
				PRDB: PreviewReviewDB,
				lists: data
			}));
			//奇偶行色
			$(".table-tr:odd").addClass("odd");
			$(".table-tr:even").addClass("even");


			pageing(PreviewReviewDB.resultObject.totalPageCount);
			function pageing(totalPageCount){
				laypage({
					cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
					pages: totalPageCount, //通过后台拿到的总页数
					curr: 1, //当前页
					skin: '#2cb82c', //配色方案
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							//数据源
							var PreviewReviewDB = findPreviewReviewPage( obj.curr, REVIEW_PAGESIZE);
							var data = PreviewReviewDB.resultObject.items;
							$("#table").html(template.compile( reviewhometableTpl)({
								PRDB: PreviewReviewDB,
								lists: data
							}));
							//奇偶行色
							$(".table-tr:odd").addClass("odd");
							$(".table-tr:even").addClass("even");
						}
					}
				});
			};


		};

		//获取进入预习/复习列表分页
		var findPreviewReviewPage = function(pageNumber, pageSize) {
			return common.requestService('bxg/preview/findPreviewReviewPage','get', {
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};

		return {
			createPage: createPage
		}
	});