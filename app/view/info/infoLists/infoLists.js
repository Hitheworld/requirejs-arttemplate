/**
 *  资讯列表
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/info/infoLists/infoLists.html',
		'common',
		'api',
		'radialIndicator',
		'css!cssUrl/infoLists'
	],
	function (template,$,layui,layer,laypage,
	          infoListsTpl,
	          common,api) {

		function createPage(pagenumber) {
			document.title = "博学谷·院校-教师端扩展资源";
			//数据源
			$("#content").html(infoListsTpl);
			//设置导航的active
			//$(".home-header .home-nav .home-nav-li a").removeClass("active");
			//$(".home-header .home-nav .home-nav-li a.course").addClass("active");
			
			var indicatorCont = "{{each resultObject}}" +
				"<a href='#/info/del/{{$value.id}}'>" +
				"<div><img src='{{$value.image_url}}' alt=''>" +
				"<p><span>▶</span><span>{{$value.title}}</span>" +
				"</p></div></a>" +
				"{{/each}}";
			
			var infolists = "{{each resultObject.data}}" +
				"<li><div class='infoLists-item'>" +
				"<a href='#/info/del/{{$value.id}}'>" +
				"<div class='infoLists-pic'><img src='{{$value.image_url}}' /></div>" +
				"<div class='infoLists-cont'><p>{{$value.title}}</p><p>{{$value.content}}</p>" +
				"<div class='infoLists-footer'><span>{{$value.create_time}}</span>" +
				"<span>浏览:{{$value.page_view}}</span><span>小编:{{$value.author}}</span> </div> </div> </a></div></li>" +
				"{{/each}}";



			function afficheList (page) {
				common.syncRequest('bxg/home/afficheList', "POST", {
					pageNumber:page,
					pageSize:5
				},function(data){
					if (data.resultObject.data.length != 0) {
						$(".infoLists-contnet ul").append(template.compile(infolists)(data));
						$("#infoLists_btn_g").attr("data-page",parseInt(page)+(1))
					} else {
						layer.alert("没有更多了！")
					}
				});
			}

			afficheList(1);
			$("#infoLists_btn_g").click(function(){
				//var num = parseInt($("#infoLists_btn_g").attr("data-page"))+(1);
				//$("#infoLists_btn_g").attr("data-page",num);
				afficheList($("#infoLists_btn_g").attr("data-page"));
			});

			common.ajaxRequest('bxg/home/hotAfficheList', "POST", {},function(data){
				console.log(data+"--");
				$(".indicatorContainer_dv").html(template.compile(indicatorCont)(data));
			});

			//判断是否显示分页
			//if(resourcesListsDB.success){
			//	//显示分页
			//	laypage({
			//		cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
			//		pages: resourcesListsDB.resultObject.totalpages, //通过后台拿到的总页数
			//		curr: resourcesListsDB.resultObject.currentpage || 1, //当前页
			//		skin: '#2cb82c', //配色方案
			//		jump: function(obj, first){ //触发分页后的回调
			//			console.log(obj)
			//			if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
			//				resourcesLists(obj.curr);
			//				window.location.href= "#/resources/"+obj.curr;
			//			}
			//		}
			//	});
			//}



		}

		//获取扩展资源资源分类数据
		var resourcesNavs = function() {
			return common.requestService('../app/data/resourcesNav.json','get', {});
		};

		//获取扩展资源列表数据
		var resourcesLists = function(curr,sort,style) {
			return common.requestService('../app/data/resourcesList.json','get', {});
		};


		return {
			createPage: createPage
		}
	});