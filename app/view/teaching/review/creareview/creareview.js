/**
 *   创建考试
 *   datatable中文文档:http://datatables.club/manual/data.html
 *
 *    https://datatables.net/extensions/select/examples/initialisation/checkbox.html
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/review/creareview/creareview.html',
		'text!tplUrl/teaching/review/creareview/creaReviewCourses.html',
		'text!tplUrl/teaching/review/creareview/resources_box.html',
		'text!tplUrl/teaching/review/creareview/Lists_video.html',
		'text!tplUrl/teaching/review/creareview/Lists_ppt.html',
		'text!tplUrl/teaching/review/creareview/Lists_audio.html',
		'text!tplUrl/teaching/review/creareview/Lists_plan.html',
		'text!tplUrl/teaching/review/creareview/Lists_picture.html',
		'text!tplUrl/teaching/review/creareview/Lists_problem.html',
		'text!tplUrl/teaching/review/creareview/audio.html',
		'text!tplUrl/teaching/review/creareview/video.html',
		'text!tplUrl/teaching/review/creareview/richtext.html',
		'common',
		'ckplayer',
		'audiojs',
		'jquery.ztree',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/review.creareview'
	],
	function (template,$,layui,layer,laypage,
	          createtestTpl,
	          createTestCoursesTpl,
	          resourcesBoxTpl,
	          videoListsTpl,
	          pptListsTpl,
	          audioListsTpl,
	          planListsTpl,
	          pictureListsTpl,
	          problemListsTpl,
	          audioTpl,
	          videoTpl,
	          richtextTpl,
	          common,CKobject, audiojs) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");

			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名

			//查询班级
			var findClassDB = findClass(teacherId);
			if( !findClassDB.success){
				layer.alert(findClassDB.errorMessage || "服务器异常!");
			};
			//弹出层的试卷数据源
			var kpointIds = new Array(),
				kpointIdsArr = new Array(),
				exam_range = new Array(),
				exam_rangeArr = new Array(),
				COURSERESOURCE_APPLY = 2,  // 课程资源--使用类型  0预习，1课堂，2复习
				COURSERESOURCE_PAGENUMBER = 1,  //  课程资源--第几页
				COURSERESOURCE_PAGESIZE = 6,  // 课程资源--每页显示条数---通用(除了常见问题与图片每个tab只有一个对象)
				COURSERESOURCE_PAGESIZE_RICHTEXT = 3,  // 课程资源-- 常见问题每页面显示条数
				COURSERESOURCE_TYPEID = 0;     // 默认显示视频的知识点下的资源

			var findCourseResourceDB = '';

			//修改时的数据
			var EditLoadDB = {
				resultObject: {
					squadId: "",
					courseId: "",
					paperTplName: "",
					groups: ""
				}
			};
			var ClassManagement = '';
			if( pageType == 'edit'){
				//修改加载的数据
				EditLoadDB = EditLoad(exampPaperId);
				if (!EditLoadDB.success){
					layer.alert(EditLoadDB.errorMessage  || "服务器出错！");
				}
			};



			var C = new CreareviewObj();
			C.tpl();



			/**
			 * 申明类
			 * @constructor
			 */
			function CreareviewObj(){
				var _seft = this;

				this.tpl = function(){
					$("#testcentresHtml").html(template.compile( createtestTpl)({
						Class:findClassDB,   //班级
						ClassManagement:exampPaperId,   //如果是从班级页面点击过来的，应选中该班级
						EditLoad: EditLoadDB,   //加载的修改数据
						pageType: pageType  //判断是否显示
					}));

					// 重载交互
					_seft.interaction();

					// 课程与知识点联动
					_seft.CreateZtter();
					if( pageType == 'edit'){
						$('.review-box').css("display","block");
					}
				};

				/**
				 *  新增子页面
				 */
				this.appendSubTpl = function (db, name) {
					console.log('传递过来的数据是:',db)
					$("#resourcesDom").append(template.compile( resourcesBoxTpl)({
						kpointId: db,
						name: name
					}));
					// 重载弹出窗交互
					_seft.popup(db);
				};

				/**
				 *  移出子页面
				 */
				this.removeSubTpl = function (db) {
					$(".tab-dom-"+db).remove();
				};


				/**
				 * 获取树的值
				 */
				this.getZTreeName = function(event, treeId, treeNode){
					var treeObj = $.fn.zTree.getZTreeObj("J-ztree"),
						nodes = treeObj.getCheckedNodes(true);
					kpointIds = treeNode.id.toString();
					exam_range = treeNode.name.toString();


					exam_rangeArr = [];
					kpointIdsArr = [];
					for(var i = 0; i < nodes.length; i++) {
						//获取kpointIds名字
						exam_rangeArr.push(nodes[i].name);
						//获取kpointIds
						kpointIdsArr.push(nodes[i].id);
					}
					kpointIdsArr = kpointIdsArr.toString();
					exam_range = exam_rangeArr.toString();
					console.log(exam_rangeArr,"树ID：",kpointIdsArr);

					console.log(exam_range,"树ID：",kpointIds);

					//判断是否选中了
					if(  !treeNode.checked ){
						console.log("没有选中");
						_seft.removeSubTpl(treeNode.id);
					}else {
						//选中了
						console.log("选中了");
						// 判断是否是重复的节点资源，如果是相同的资源就不增加子页面
						_seft.appendSubTpl(treeNode.id, treeNode.name);

						//获取知识点下的资源
						//重载更多分页与数据显示
						_seft.allToLoadMore(COURSERESOURCE_TYPEID, treeNode.id);

						// 重载弹出窗口交互
						_seft.clickInter( COURSERESOURCE_TYPEID );
					};
				};


				/**
				 * 树型结构
				 */
				this.zTreeDom = function(data){
					var setting = {
						check: {
							enable: true,
							autoCheckTrigger: true,
							chkboxType: { "Y": "", "N": "" }   //将不会有任何自动关联勾选的操作
						},
						data: {
							simpleData: {
								enable: true
							},
							key : {
								checked: "checked"
							}
						},
						callback: {
							onCheck: this.getZTreeName
						}
					};
					if(data.success){
						var zNodes = data.resultObject;

						$(document).ready(function() {
							$.fn.zTree.init($("#J-ztree"), setting, zNodes);
							var treeObj = $.fn.zTree.getZTreeObj("J-ztree");
							var nodes = treeObj.getCheckedNodes(true);
							for (var i=0, l=nodes.length; i < l; i++) {
								treeObj.checkNode(nodes[i], true, true,true);
							}
						});
						if( pageType == 'edit'){
							$('.J-toggle').click();
						}
					}else {
						$("#tree-combined").html("<span class='error'>"+data.errorMessage || "服务器出错！"+"</span>");
					}
				};

				/**
				 * 获取知识资源
				 */
				this.getKResources = function(typeId, kp_id , pageNumber){
					kpointIds = kpointIds.toString();

					//判断是否是常见问题---常见问题要每页面显示3个
					if ( typeId == 7 ){
						var findCourseResourceDB = findCourseResource(kp_id, typeId, COURSERESOURCE_APPLY, pageNumber, COURSERESOURCE_PAGESIZE_RICHTEXT);
					}else{
						var findCourseResourceDB = findCourseResource(kp_id, typeId, COURSERESOURCE_APPLY, pageNumber, COURSERESOURCE_PAGESIZE);
					}
					if(!findCourseResourceDB.success){
						layer.alert( findCourseResourceDB.errorMessage ||"服务器异常!");
						return false;
					};
					return findCourseResourceDB;
				};


				/**
				 * 加载更多
				 * @param re_type   资源类型
				 */
				this.allToLoadMore = function( re_type, kp_id ){
					window.appendimg = function(page){
						return '<li>\
									<a href="javascript:void(0);" data-id="0" class="J-view-video" >'+page+'</a>\
								</li>';
					};
					// 分页
					var modeldb = _seft.getKResources(re_type , kp_id ,COURSERESOURCE_PAGENUMBER);  //数据源
					if( re_type == 0 ){
						$('.video-view-' + kp_id).html(template.compile( videoListsTpl)({
							Lists: modeldb,
							kpointId: kp_id
						}));
					}
					if( re_type == 1 ){
						$('.audio-view-' + kp_id).html(template.compile( audioListsTpl)({
							Lists: modeldb,
							kpointId: kp_id
						}));
					}
					if( re_type == 2 ){
						$('.ppt-view-' + kp_id).html(template.compile( pptListsTpl)({
							Lists: modeldb,
							kpointId: kp_id
						}));
					}
					if( re_type == 3 ){
						$('.plan-view-' + kp_id).html(template.compile( planListsTpl)({
							Lists: modeldb,
							kpointId: kp_id
						}));
					}
					if( re_type == 4 ){
						//pageing('.picture-page', kp_id, modeldb.resultObject.totalPageCount,'');
						laypage({
							cont: $('.picture-page'+kp_id), //容器。值支持id名、原生dom对象，jquery对象,
							pages: modeldb.resultObject.totalPageCount, //总页数
							groups: 0, //连续分数数0
							first: false,
							last: false,
							jump: function(obj) {
								var redb = _seft.getKResources(re_type, kp_id, obj.curr);  //数据源
								$('.picture-view-' + kp_id).html(template.compile(pictureListsTpl)({
									Lists: redb,
									kpointId: kp_id
								}))
							}
						});
					}
					if( re_type == 7 ){
						//pageing('.problem-page', kp_id, modeldb.resultObject.totalPageCount,'');
						laypage({
							cont: $('.problem-page'+kp_id), //容器。值支持id名、原生dom对象，jquery对象,
							pages: modeldb.resultObject.totalPageCount, //总页数
							groups: 0, //连续分数数0
							first: false,
							last: false,
							jump: function(obj) {
								var redb = _seft.getKResources(re_type, kp_id, obj.curr);  //数据源
								$('.problem-view-' + kp_id).html(template.compile(problemListsTpl)({
									Lists: redb,
									kpointId: kp_id
								}))
							}
						});
					}
				};


				/**
				 * 交互
				 */
				this.interaction = function(){

					// 显示与隐藏
					$('.J-toggle').on('click', function(){
						$('.review-box').toggle();
					});

					// 关闭
					$('.J-review-close').on('click', function(){
						$('.review-box').hide();
					});

					//初始化获取班级id
					var squadId = $("#squadId option:checked").val();
					//查询该老师对应的课程下拉列表
					var findTeacherCoursesDB = findTeacherCourses(teacherId, squadId);
					if( !findTeacherCoursesDB.success){
						layer.alert(findTeacherCoursesDB.errorMessage || "服务器异常!");
					};
					$("#createTestCourses").html(template.compile( createTestCoursesTpl)({
						Courses: findTeacherCoursesDB,   //课程
						EditLoad: EditLoadDB,   //加载的修改数据
						pageType: pageType  //判断是否显示
					}));

					/**
					 * 获取知识点
					 * @type {*|jQuery}
					 */
					function getZtreeInit(){
						// 获取课程
						var courseId = $("#courseId option:checked").val();
						var arrue = [];
						$.each(EditLoadDB.resultObject.reviewPointList,function(i,a){
							if(!a.onlyShow){
								arrue.push(a.pointId);
							}
							//_seft.appendSubTpl(a.pointId);
							//重载更多分页与数据显示
							//_seft.allToLoadMore(COURSERESOURCE_TYPEID, a.pointId);
							// 重载弹出窗口交互
							//_seft.clickInter( COURSERESOURCE_TYPEID );
						});
						if (courseId != undefined && courseId != ""  && arrue.toString() != undefined) {
							var GetTreeDB = courseChapterPointTree(courseId,arrue.toString());
							if(!GetTreeDB.success){
								layer.alert( GetTreeDB.errorMessage ||"服务器异常!")
							};
							_seft.zTreeDom(GetTreeDB);
						}else {
							layer.alert('当前班级没有课程!');
							$('#J-ztree').html('当前班级没有课程');
						}
					};

					getZtreeInit();



					//班级选择与课程联动
					$("#squadId").change(function() {
						//获取班级
						var squadId = $("#squadId option:checked").val();
						//查询该老师对应的课程下拉列表
						var findTeacherCoursesDB = findTeacherCourses(teacherId, squadId);
						if ( findTeacherCoursesDB.resultObject == '') {
							layer.alert('当前班级没有课程!');
							$('#J-ztree').html('当前班级没有课程')
						}
						$("#createTestCourses").html(template.compile( createTestCoursesTpl)({
							Courses: findTeacherCoursesDB,   //课程
							EditLoad: EditLoadDB,   //加载的修改数据
							pageType: pageType  //判断是否显示
						}));
						if ( findTeacherCoursesDB.resultObject != '') {
							getZtreeInit();
							_seft.CreateZtter();
						}
					});

					$("#createtestForm").validate({
						rules : {
							reviewName : {
								required : true
							},
							squadId : {
								required : true
							},
							courseId : {
								required : true
							}
						},
						messages : {
							reviewName : {required : '请输入复习名称'},
							squadId : {required : '请选择班级'},
							courseId : {required : '请选择课程'}
						},
						errorElement : "p",
						submitHandler: function(){
							$('.save,.submit').attr("disabled","disabled");//按钮不可用

							var reviewName =  $.trim($("#reviewName").val()),  //班级：
								squadId =  $.trim($("#squadId").val()),  //班级：
								courseId =  $.trim($("#courseId").val()),    //课程
								publish =  $.trim($("#publish").val());  // 是否发布，取值：0（不发布）或1（发布）

							if( kpointIds== '' ){
								layer.alert("知识点不能为空!");
								return false;
							};

							if( kpointIds!= '' ){
								if (pageType == 'edit') {
									var saveReviewDB = saveReview(exampPaperId, reviewName, squadId, courseId, kpointIdsArr, publish );
								}else {
									var saveReviewDB = saveReview("", reviewName, squadId, courseId, kpointIdsArr, publish );
								}

								if(saveReviewDB.success){
									// 判断提示语是否是保存还是发布
									var markedWords = '';
									if( publish == 0 ) {
										markedWords = '保存成功!';
									}else {
										markedWords = '发布成功!';
									};
									var index = layer.alert(markedWords ,function(){
										layer.close(index);
										setTimeout(function(){
											history.back(-1);
										},1000);
									});
								}else {
									layer.alert(saveReviewDB.errorMessage || '服务器出错!');
									return false; //阻止默认提交
								}
							}
							return false; //阻止默认提交
						}
					});

				};


				/**
				 * 弹出窗交互
				 */
				this.popup = function(kpid){
					//资源数据
					$('.tab-title-'+kpid+' li').unbind().on('click', function(){
						//获取知识点下的资源
						var typeId =  $(this).data('type');
						var kp_id =  $(this).data('kpid');
						//重载更多分页与数据显示
						_seft.allToLoadMore(typeId, kp_id);

						// 重载弹出窗口交互
						_seft.clickInter( typeId );
					});

				};


				/**
				 * 课程与知识点的联动
				 * @param courseId
				 * @constructor
				 */
				this.CreateZtter = function (){
					$("#courseId").change(function() {
						var courseId = $("#courseId option:checked").val();
						if (courseId != undefined && courseId != "") {
							var GetTreeDB = courseChapterPointTree(courseId);
							if(!GetTreeDB.success){
								layer.alert( GetTreeDB.errorMessage ||"服务器异常!")
							};
							_seft.zTreeDom(GetTreeDB);

							// 重载弹出窗口交互
							_seft.clickInter( COURSERESOURCE_TYPEID );
						} else {
							layer.alert('当前班级没有课程!');
							$('#J-ztree').html('当前班级没有课程');
						}


						// 切换课程时，知识点资源的子页面清空
						$('#resourcesDom').html('');
					});
				};


				/**
				 * 弹出窗口交互事件
				 */
				this.clickInter = function( re_type ) {

					/*
					* //var videoList = ['http://movie.ks.js.cn/flv/2012/02/6-3.flv',
					 //	'http://movie.ks.js.cn/flv/2012/02/6-1.flv',
					 //	'http://movie.ks.js.cn/flv/2011/11/8-1.flv',
					 //	'http://movie.ks.js.cn/flv/2014/04/24-2.flv'];
					 var videoList = [];
					 var videoarr = new Array();//新建一个数组来存flash端视频地址，添加方法就像下面一样
					 // 视频数据源
					 if ( re_type == 0 ) {  // 如果是视频的话，就重新发起请求
					 findCourseResourceDB = _seft.getKResources(re_type);
					 var videoListsDB = findCourseResourceDB.resultObject.items;
					 // 把视频里的每一个对象的url装入数据里面
					 for (var v=0; v < videoListsDB.length; v++) {
					 videoList.push(videoListsDB[v].url);
					 };

					 console.log('A视频数组是:',videoList);
					 for(var i = 0; i < videoListsDB.length; i++){
					 videoarr.push(videoList[i]);
					 };
					 }

					 var nowD=0;//目前播放的视频的编号(在数组里的编号)
					 function playvideo(n){
					 nowD=n;
					 var flashvars={
					 f:videoarr[n],
					 i:'http://www.ckplayer.com/static/images/cqdw.jpg',//初始图片地址
					 c:1,   // c=1 调用ckplayer.xml来做配置
					 p:1,   //设置视频是否自动播放，0=默认暂停 1=默认播放  2=默认不加载视频
					 e:4,   // 播放结束时的动作: 3=调用视频推荐列表的插件 4=清除视频流并调用js功能,默认是：function playerstop(){}
					 loaded:'loadedHandler'
					 };
					 CKobject.embed('./app/assets/videoplayer/ckplayer.swf','video','ckplayer_a1','100%','100%',false,flashvars);
					 function playerstop(){
					 //只有当调用视频播放器时设置e=0或4时会有效果
					 alert('播放完成111');
					 };
					 };

					 // 弹出视频
					 $('.J-view-video').on('click', function(){
					 $('.J-view-video').removeClass('avite');
					 $(this).addClass('avite');
					 var id = $(this).data('id');
					 layer.open({
					 type: 1,
					 title: false,
					 scrollbar: false,
					 area: ['1200px', '800px'],
					 skin: 'layui-layer-rim', //加上边框
					 content: '<div id="video"></div>'
					 });
					 playvideo(id); //调用视频
					* */

					// 弹出视频
					$('.J-view-video').unbind().on('click', function(){
						$('.J-view-video').removeClass('avite');
						$(this).addClass('avite');
						var id = $(this).data('id');
						var kp_id =  $(this).data('kpid');

						var videoUrl = _seft.getKResources(COURSERESOURCE_TYPEID, kp_id, COURSERESOURCE_PAGENUMBER)

						if ( videoUrl.success ) {
							if ( videoUrl.resultObject.items != '' ) {

								layer.open({
									type: 1,
									title: false,
									scrollbar: false,
									shade: [0.6, '#000'],
									area: ['1200px', '800px'],
									skin: 'layui-layer-rim', //加上边框
									content: '<iframe id="viewVideo" name="viewVideo" src="./app/view/teaching/review/creareview/video-view.html?video='+videoUrl.resultObject.items[0].url+'"  scrolling="no" style="border:0;width:100%;height:100%;"></iframe>'
								});

							}else {
								layer.alert('<div class="nodeta"><span>没有可观看的视频资源</span></div>');
							}
						}
					});

					// ppt
					$('.J-view-ppt').unbind().on('click', function(){
						$('.J-view-ppt').removeClass('avite');
						$(this).addClass('avite');
						var url = $(this).data('url');
						//iframe层-父子操作
						layer.open({
							type: 2,
							title: false,
							scrollbar: false,
							area: ['1200px', '800px'],
							skin: 'layui-layer-rim', //加上边框
							content: url
						});
					});


					//音频
					$('.J-view-audio').unbind().on('click', function(){
						$('.J-view-audio').removeClass('avite');
						$(this).addClass('avite');
						var url = $(this).data('url');
						//iframe层-父子操作
						layer.open({
							type: 1,
							title: false,
							scrollbar: false,
							area:  ['1200px', '800px'],
							skin: 'layui-layer-rim', //加上边框
							content: audioTpl
						});

						$('audio').attr('src',url);
						audiojs.events.ready(function() {
							var as = audiojs.createAll();
						});
					});

					//图片
					$('.J-click-pic').unbind().on('click', function(){
						$('.J-click-pic').removeClass('avite');
						$(this).addClass('avite');
						var url = $(this).data('url');
						//iframe层-父子操作
						layer.open({
							type: 1,
							title: false,
							scrollbar: false,
							skin: 'layui-layer-rim', //加上边框
							area:  ['1200px', '800px'],
							content: '<img src="'+url+'" style="width: 100%;height: 100%;" />'
						});
					});

					//富文本-- 常见问题
					$('.J-view-richtext').unbind().on('click', function(){
						$('.J-view-richtext').removeClass('avite');
						$(this).addClass('avite');
						var url = $(this).data('url');
						var kp_id =  $(this).data('kpid');
						// 获取第几个问题
						var indexRic = $(this).data('ricindex')
						//iframe层-父子操作
						layer.open({
							type: 1,
							title: false,
							scrollbar: false,
							skin: 'layui-layer-rim', //加上边框
							area:  ['450px', '445px'],
							content:  template.compile( richtextTpl)({
								problems: _seft.getKResources(re_type, kp_id, COURSERESOURCE_PAGENUMBER),   //课程
								indexRic: indexRic
							})
						});
					});

				};
			};
			//* 结束类的申明



		};


		//查询该老师对应的班级下拉列表
		var findClass = function(teacherId) {
			return common.requestService('bxg/teaching/squad/noGraduateSquad','get', {
				teacherId: teacherId
			});
		};

		//查询该老师对应的课程下拉列表
		var findTeacherCourses = function(teacherId, squadId) {
			return common.requestService('bxg/teaching/squad/findCourse','get', {
				teacherId: teacherId,
				squadId:squadId
			});
		};

		//查询课程对应的章节知识点树
		var courseChapterPointTree = function(pointId,checkIds) {
			return common.requestService('bxg_anon/common/pointTree','get', {
				pointId: pointId,
				checkIds:checkIds
			});
		};

		// 查询课程资源
		var findCourseResource = function(treeId, type, apply, pageNumber, pageSize) {
			return common.requestService('bxg_anon/courseResource/findPage','get', {
				treeId: treeId,
				type: type,
				apply: apply,
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};

		//保存发布 添加复习
		var saveReview = function(id, reviewName, squadId, courseId, pointIds , publish) {
			return common.requestService('bxg/review/save','post', {
				id:id,
				reviewName: reviewName,  //复习名称
				squadId: squadId,    // 班级id
				courseId: courseId, //课程
				pointIds: pointIds, //知识点ids（逗号分隔，如：1,2,3,4）
				publish: publish, //是否发布，取值：0（不发布）或1（发布）
			});
		};



		//获取加载的修改数据
		var EditLoad = function(id) {
			return common.requestService('bxg/review/load','get', {
				id: id
			});
		};



		return {
			createPage: createPage
		}
	});