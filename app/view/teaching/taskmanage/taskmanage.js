/**
 *   考试管理
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/taskmanage/taskmanage.html',
		'common',
		'api',
		'jquery.validate',
		'jquery.validate.zh',
		'css!cssUrl/teaching.testcentres'
	],
	function (template,$,layui,layer,
	          taskmanageTpl,
	          common,api) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心";
			$("#teachingHtml").html(template.compile( taskmanageTpl)());
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//console.log("子页面",type,'子孙页面',subtype)

			//处理子页面
			this.childCreatePage = function(page,childpage,pagenumber){
				require( ['tplUrl/teaching/'+page+'/'+childpage+'/'+childpage], function (m) {
					m.createPage(page,childpage,pagenumber);
				});
			}

		}

		return {
			createPage: createPage
		}
	});