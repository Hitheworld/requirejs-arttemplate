define(['jquery','route'], function ($,route) {
    function Route() {
	    var Path = route;
	    /**
	     * 路由配置
	     */
	    function clearPanel(){
		    //你可以把一些代码在这里做花式DOM的过渡，如淡入淡出或幻灯片。
		    //$("body").fadeOut(1000);
	    }

	    //页面配置
	    //登录
	    var login = function() {
		    require( ['app/view/login/login.js'], function (m) {
			    m.createPage();
		    });
	    }

	    //注册
	    var signin = function() {
		    require( ['app/view/signin/signin.js'], function (m) {
			    m.createPage();
		    });
	    };

		//注册成功
		var RegisterSuccess = function() {
			require( ['app/view/RegisterSuccess/RegisterSuccess.js'], function (m) {
				m.createPage();
			});
		};

		//忘记密码
		var reset_password = function() {
			require( ['app/view/reset_password/reset_password.js'], function (m) {
				m.createPage();
			});
		};

	    //首页
	    var home = function() {
		    require( ['app/view/home/home.js'], function (m) {
			    m.createPage();
		    });
	    };

	    //精品课程
	    var course = function(pagination,pagenumber) {
		    require( ['app/view/course/course.js'], function (m) {
			    m.createPage(pagination,pagenumber);
		    });
	    };

	    //精品课程-详情
	    var courseDel = function(courseId, pagination) {
		    require( ['app/view/course/course.del.js'], function (m) {
			    m.createPage(courseId, pagination);
		    });
	    };


	    //扩展资源列表页
	    var resourcesLists = function(pagenumber) {
		    require( ['app/view/resources/resourcesLists/resourcesLists.js'], function (m) {
			    m.createPage(pagenumber);
		    });
	    };

	    //扩展资源详情页
	    var resourcesDel = function(resourceId) {
		    require( ['app/view/resources/resourcesDel/resourcesDel.js'], function (m) {
			    m.createPage(resourceId);
		    });
	    };


	    //资讯列表页
	    var infoLists = function(pagenumber) {
		    require( ['app/view/info/infoLists/infoLists.js'], function (m) {
			    m.createPage(pagenumber);
		    });
	    };

	    //资讯详情页
	    var infoDel = function(infoId) {
		    require( ['app/view/info/infoDel/infoDel.js'], function (m) {
			    m.createPage(infoId);
		    });
	    };

	    //教学中心
	    var teaching = function(page,childpage,pagenumber) {
		    require( ['app/view/teaching/teaching.js'], function (m) {
			    m.createPage(page,childpage,pagenumber);
			    if(page != undefined){
				    m.TeachingRightContent(page,childpage,pagenumber);
			    }
		    });
	    };

	    //展示页
	    var cooperate = function() {
		    require( ['app/view/cooperate/cooperate.js'], function (m) {
			    m.createPage();
		    });
	    };

	    //个人中心
	    var personalHome = function(type,pagenumber) {
		    require( ['app/view/personal/personal.home.js'], function (m) {
			    m.createPage(type,pagenumber);
			    m.rightContent(type,pagenumber);
		    });
	    };


	    //404页
	    var error404 = function() {
		    require( ['app/view/404/404.js'], function (m) {
			    m.createPage();
		    });
	    };

	    /**
	     *
	     */
		    //路由---登录
	    Path.map("#/login").to(function(){
		    login();
	    }).enter(clearPanel);

	    //路由---注册
	    Path.map("#/signin").to(function(){
		    signin();
	    }).enter(clearPanel);

		//路由---注册成功
		Path.map("#/RegisterSuccess").to(function(){
			RegisterSuccess();
		}).enter(clearPanel);

		//路由---忘记密码
		Path.map("#/reset_password").to(function(){
			reset_password();
		}).enter(clearPanel);

	    //路由---首页
	    Path.map("#/home").to(function(){
		    home();
	    }).enter(clearPanel);

	    //路由---精品课程列表
	    Path.map("#/course/:pagination/:pagenumber").to(function(){
		    course(this.params['pagination'],this.params['pagenumber']);
	    }).enter(clearPanel);

	    //路由---精品课程详情
	    Path.map("#/course/del/:pagination/:courseId").to(function(){
		    courseDel(this.params['pagination'],this.params['courseId']);
	    }).enter(clearPanel);

	    //路由---扩展资源列表
	    Path.map("#/resources/:pagenumber").to(function(){
		    resourcesLists(this.params['pagenumber']);
	    }).enter(clearPanel);

	    //路由---扩展资源详情
	    Path.map("#/resources/del/:resourceId").to(function(){
		    resourcesDel(this.params['resourceId']);
	    }).enter(clearPanel);

	    //路由---资讯列表
	    Path.map("#/info/:pagenumber").to(function(){
		    infoLists(this.params['pagenumber']);
	    }).enter(clearPanel);

	    //路由---资讯详情
	    Path.map("#/info/del/:infoId").to(function(){
		    infoDel(this.params['infoId']);
	    }).enter(clearPanel);

	    //路由---教学中心主页
	    Path.map("#/teaching/:page/:childpage(/:pagenumber)").to(function(){
		    teaching(this.params['page'],this.params['childpage'],this.params['pagenumber']);
	    }).enter(clearPanel);

	    //路由---展示页
	    Path.map("#/cooperate").to(function(){
		    cooperate();
	    }).enter(clearPanel);

	    //路由---个人中心
	    Path.map("#/personal/:type(/:pagenumber)").to(function(){
			personalHome(this.params['type'],this.params['pagenumber']);
	    }).enter(clearPanel);

	    //路由测试---
	    Path.map("#/users").to(function(){
		    alert("Users!");
	    }).exit(function(){
		    error404();
	    });

	    //路由--- 404
	    Path.rescue(function(){
		    error404();
	    });

	    //初始化路由配置
	    Path.root("#/home");
	    Path.listen();

    }

	return {
		Route: Route
	}

});