/**
 *   考试管理
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/testcentres.html',
		'common',
		'api',
		'jquery.validate',
		'jquery.validate.zh',
		'css!cssUrl/teaching.testcentres'
	],
	function (template,$,layui,layer,
	          testcentresTpl,
	          common,api) {

		function createPage(page,childpage,pageType,exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心";
			$("#teachingHtml").html(template.compile( testcentresTpl)());
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置左则导航的active
			$(".teaching-nav-li").removeClass("layui-this");
			$(".teaching-nav-li.testcentres").addClass("layui-this");


			//console.log("子页面",type,'子孙页面',subtype)

			//处理子页面
			this.childCreatePage = function(page,childpage,pageType,exampPaperId){
				require( ['tplUrl/teaching/'+page+'/'+childpage+'/'+childpage], function (m) {
					m.createPage(page,childpage,pageType,exampPaperId);
				});
			}

		}

		return {
			createPage: createPage
		}
	});