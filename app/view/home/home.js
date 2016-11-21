/**
 *  认证
 *  判断indenty_status  字段是否认证
 *   0---- 新注册教师  --- 教师资格认证、堂播虎下载  (没有登录的跳转到登录页面,链接)
 *   1---- 认证待审核 -- 教师资格认证、堂播虎下载
 *   2---- 审核通过  -- 我的班级、我的课程
 *   3---- 拒绝通过  -- 教师资格认证、堂播虎下载
 */
define(['template',
	'jquery',
	'text!tplUrl/home/home.html',
	'common',
	'api'
],
function (template,$,homeTpl,common,api) {
	
	function createPage() {
		document.title = "博学谷·院校-教师端首页";
		//设置导航的active
		$(".home-header .home-nav .home-nav-li a").removeClass("active");
		$(".home-header .home-nav .home-nav-li a.home").addClass("active");

		//banner
		var bannerDB = banner();
		//精品课程
		var CourseDB = topCourse();

		//咨询公告
		var afficheDB = affiche();

		//数据源---博问答
		var askAndAnswerDB = askAndAnswer();
		//数据源---教学扩展资源
		var extendResourceDB = extendResource();

		//合作院校模块
		var collegesDB = colleges();
		//我要合作
		var myJoinDB = myJoin();

		//处理与过滤HTML标签
		template.helper('dataHtml', function (date, format) {
			format = date.replace(/<[^>]+>/g,"");
			return format;
		});

		//个人中心判断是否是认证的字段
		var indenty_status = $(".home-user-name").data("indenty_status");
		$("#content").html(template.compile( homeTpl)({
			indenty_status: indenty_status,  //个人中心
			banner: bannerDB,    //banner
			Course: CourseDB,  //精品课程
			affiche: afficheDB, //咨询公告
			extendResource: extendResourceDB,    //教学扩展资源
			askAndAnswer: askAndAnswerDB,    //博问答
			colleges: collegesDB ,     //合作院校模块
			myJoin: myJoinDB    //我要合作
		}));

		//...的处理
		$('.ellipsis').each(function(){
			var maxwidth= 30;
			if($(this).text().length>maxwidth){
				$(this).text($(this).text().substring(0,maxwidth));
				$(this).html($(this).html()+'...');
			}
		});


		//轮播图加载
		common.index_banner("cy_cont","cy_prev","cy_next","cy_circle",3000);
		//合作院校模块
		common.index_banner2("cy_banner2_banner_cont","cy_banner2_banner_prev","cy_banner2_banner_next","",4500);

	}

	//轮播图加载
	var banner = function() {
		return common.requestService('bxg/home/banner','get', {});
	};


	//咨询公告
	var affiche = function() {
		return common.requestService('bxg/home/affiche','get', {});
	};

	//精品课程
	var topCourse = function() {
		return common.requestService('bxg/home/topCourse','get', {});
	};

	//教学扩展资源
	var extendResource = function() {
		return common.requestService('bxg/home/extendResource','get', {});
	};

	//博问答---获取博问答数据
	var askAndAnswer = function() {
		return common.requestService('bxg/home/askAndAnswer','get', {});
	};


	//合作院校模块
	var colleges = function() {
		return common.requestService('bxg/home/colleges','get', {});
	};


	//我要合作接口
	var myJoin = function() {
		return common.requestService('bxg/home/myJoin','get', {});
	};

	return {
		 createPage: createPage
	}
});