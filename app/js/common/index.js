define([
	'template',
	'jquery',
	'layer',
	'common',
	'api',
	'text!tplUrl/index/index.html',
	'text!tplUrl/common/noPermissions.html',
	'text!tplUrl/common/login/popup.login.html',
	'text!tplUrl/index/user.header.html',
	'popupLogin'
], function (template,
             $,
             layer,
             common,
             api,
             indexTpl,
             noPermissionsTpl,
             popupLoginTpl,
             userTpl,
             popupLogin
) {
	function Index() {

		//数据源
		var UserDB = MyUser();
		if(!UserDB.success){
			layer.alert(UserDB.errorMessage || "服务器异常!")
		};

		$("#app").html(template.compile( indexTpl)({
			user: UserDB
		}));
		var logout = api.BATHPATH +'logout';
		$("#header-user").html(template.compile(userTpl)({
			logout: logout,
			user: UserDB
		}));

		//过滤器--没有认证通过的老师
		//....

		new AccessPermission().__init__();

		/**
		 * 权限访问
		 */
		function AccessPermission(){

			var seft = this;

			this.__init__ = function(){
				seft.filter();  //初始化
			};


			/**
			 *  过滤器
			 *  拦截访问权限页面
			 */
			this.filter = function(){
				var url = window.location.hash; //获取'#'后面的值
				var urlHerf = window.location.href; //获取url

				/**
				 * 兼容indexOf
				 */
				if (!Array.prototype.indexOf){
					Array.prototype.indexOf = function(elt /*, from*/){
						var len = this.length >>> 0;
						var from = Number(arguments[1]) || 0;
						from = (from < 0)
							? Math.ceil(from)
							: Math.floor(from);
						if (from < 0)
							from += len;
						for (; from < len; from++){
							if (from in this &&
								this[from] === elt)
								return from;
						}
						return -1;
					};
				}

				//放行的路径
				var uri = (url.indexOf("#/home") != -1 ) || (urlHerf.indexOf("index.html") != -1 ) || (url.indexOf("#/course")!=  -1 )
					|| (url.indexOf("#/resources")!=  -1 ) || (url.indexOf("#/cooperation")!=  -1 ) ||
					(url.indexOf("#/login") != -1 ) ||  (url.indexOf("#/sigin") != -1) ||  (url.indexOf("#/info") != -1)
					||  (url.indexOf("#/tangbohu") != -1) ||  (url.indexOf("#/teachtraining") != -1) || ( url.indexOf("#/RegisterSuccess") != -1) ||( url.indexOf("#/reset_password") != -1) ||( url.indexOf("#/activity/adsense") != -1) ||( url.indexOf("#/teaimprove") != -1);
				if(!uri ){
					seft.permissions();  //权限访问
				};
			};

			/**
			 * 权限说明
			 */
			this.permissions = function(){
				var login_name = UserDB.resultObject.login_name;
				if(UserDB.success) {
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
					layer.alert(UserDB.errorMessage || "服务器异常!");
				}
			};
		};



	};

	//个人中心
	/**
	 * 个人中心
	 * 正式 sessionUser
	 * 本地测试  localLogin?username=18911268384
	 */
	var MyUser = function() {
		return common.requestService('bxg_anon/user/sessionUser?_t='+Math.random(),'get', {});
	};

	return {
		Index: Index
	};

});