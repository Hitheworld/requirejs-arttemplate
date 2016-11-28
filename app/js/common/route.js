define(['template','jquery','layer','route','common','api',
	'text!tplUrl/common/noPermissions.html',
	'text!tplUrl/common/login/popup.login.html',
	'text!tplUrl/index/user.header.html',
	'popupLogin'
], function (template,$,layer,route,common,api,
             noPermissionsTpl,
             popupLoginTpl,
             userTpl,
             popupLogin
) {
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
	    var teaching = function(page,childpage,pageType,exampPaperId) {
		    require( ['app/view/teaching/teaching.js'], function (m) {
			    m.createPage(page,childpage,pageType,exampPaperId);
			    if(page != undefined){
				    m.TeachingRightContent(page,childpage,pageType,exampPaperId);
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
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---注册
	    Path.map("#/signin").to(function(){
		    signin();
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

		//路由---注册成功
		Path.map("#/RegisterSuccess").to(function(){
			RegisterSuccess();
		}).enter(clearPanel).exit(function(){
			history.go(0); //退出的时候刷新页面
		});

		//路由---忘记密码
		Path.map("#/reset_password").to(function(){
			reset_password();
		}).enter(clearPanel).exit(function(){
			history.go(0); //退出的时候刷新页面
		});

	    //路由---首页
	    Path.map("#/home").to(function(){
		    home();
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---精品课程列表
	    Path.map("#/course/:pagination/:pagenumber").to(function(){
		    course(this.params['pagination'],this.params['pagenumber']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---精品课程详情
	    Path.map("#/course/del/:pagination/:courseId").to(function(){
		    courseDel(this.params['pagination'],this.params['courseId']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---扩展资源列表
	    Path.map("#/resources/:pagenumber").to(function(){
		    resourcesLists(this.params['pagenumber']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---扩展资源详情
	    Path.map("#/resources/del/:resourceId").to(function(){
		    resourcesDel(this.params['resourceId']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---资讯列表
	    Path.map("#/info/:pagenumber").to(function(){
		    infoLists(this.params['pagenumber']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---资讯详情
	    Path.map("#/info/del/:infoId").to(function(){
		    infoDel(this.params['infoId']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---教学中心主页
	    Path.map("#/teaching/:page/:childpage(/:pageType)(/:exampPaperId)").to(function(){
		    teaching(this.params['page'],this.params['childpage'],this.params['pageType'],this.params['exampPaperId']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---展示页
	    Path.map("#/cooperate").to(function(){
		    cooperate();
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由---个人中心
	    Path.map("#/personal/:type(/:pagenumber)").to(function(){
			personalHome(this.params['type'],this.params['pagenumber']);
	    }).enter(clearPanel).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由测试---
	    Path.map("#/users").to(function(){
		    alert("Users!");
	    }).exit(function(){
		    history.go(0); //退出的时候刷新页面
	    });

	    //路由--- 404
	    Path.rescue(function(){
		    error404();
	    });

	    //初始化路由配置
	    Path.root("#/home");
	    Path.listen();


	    /**
	     * 个人中心
	     * 正式 sessionUser
	     * 本地测试  localLogin?username=351982312@qq.com
	     */
	    common.ajaxRequest('bxg/user/localLogin?username=351982312@qq.com', "GET", {}, function (data, state) {

		    var logout = api.BATHPATH +'logout';
		    $("#header-user").html(template.compile(userTpl)({
			    logout: logout,
			    user: data
		    }));

		    new AccessPermission().init();
		    /**
		     * 权限访问
		     */
		    function AccessPermission(){

			    var seft = this;

			    this.init = function(){
				    seft.filter();  //初始化
			    };


			    /**
			     *  过滤器
			     *  拦截访问权限页面
			     */
			    this.filter = function(){
				    var url = window.location.hash; //获取'#'后面的值

				    /**
				     * 兼容indexOf
				     */
				    if (!Array.prototype.indexOf)
				    {
					    Array.prototype.indexOf = function(elt /*, from*/)
					    {
						    var len = this.length >>> 0;

						    var from = Number(arguments[1]) || 0;
						    from = (from < 0)
							    ? Math.ceil(from)
							    : Math.floor(from);
						    if (from < 0)
							    from += len;

						    for (; from < len; from++)
						    {
							    if (from in this &&
								    this[from] === elt)
								    return from;
						    }
						    return -1;
					    };
				    }

				    //放行的路径
				    var uri = (url.indexOf("#/home") != -1 ) || (url.indexOf("#/course")!=  -1 ) || (url.indexOf("#/resources")!=  -1 ) ||
					    (url.indexOf("#/login") != -1 ) ||  (url.indexOf("#/signin") != -1) ||  (url.indexOf("#/info") != -1);
				    if(!uri ){
					    seft.permissions();  //权限访问
				    };
			    };

			    /**
			     * 权限说明
			     */
			    this.permissions = function(){
				    var login_name = data.resultObject.login_name;
				    if(data.success) {
					    if( login_name == '' || login_name == undefined ){
						    $("#app").html( template.compile( noPermissionsTpl)({}));
						    layer.open({
							    type: 1,
							    title: false,
							    skin: 'layui-layer-rim', //加上边框
							    area: ['500px', '500px'], //宽高
							    content: popupLoginTpl
						    });
						    //加载弹窗登录js文件;
						    popupLogin.popupLogin();
					    }
				    }else {
					    layer.alert(data.errorMessage);
				    }
			    };
		    }

	    });

    }

	return {
		Route: Route
	}

});