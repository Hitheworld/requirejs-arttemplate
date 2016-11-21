/**
 *   教学中心
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/teaching.html',
		'text!tplUrl/teaching/myclass/myclass.js',  //myclass
		'common',
		'api',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/teaching'
	],
	function (template,$,layui,layer,
	          teachingTpl,
			  myclass,
	          common,api) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心";
			$("#content").html(template.compile( teachingTpl)());
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			$(".personal_ul li").attr("class","").each(function(){
				if ($(this).text() == "合作模式") {
					$(this).attr("class","personal_this")
				}
			});

			//处理本页面与子页面
			this.TeachingRightContent = function(page,childpage,pagenumber){
				require( ['tplUrl/teaching/'+page+'/'+page], function (m) {
					m.createPage(page,childpage,pagenumber);
					if(childpage != undefined) {
						m.childCreatePage(page,childpage,pagenumber);
					}
				});
			};


			//$("#teachingHtml").html(template.compile( testcentresTpl)());
			//$("#testcentresHtml").html(template.compile( organizePaperTpl)());


		}

		return {
			createPage: createPage
		}
	});