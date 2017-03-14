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
				"<a href='#/info/del/{{$value.id}}' data-id='{{$value.id}}' target='_blank'>" +
				"<div><img src='{{$value.image_url}}' alt=''>" +
				"<p><span>▶</span><span>{{$value.title}}</span>" +
				"</p></div></a>" +
				"{{/each}}";
			
			var infolists = "{{each resultObject.data}}" +
				"<li><div class='infoLists-item' data-id='{{$value.id}}'>" +
				"<a href='#/info/del/{{$value.id}}' data-id='{{$value.id}}' target='_blank'>" +
				"<div class='infoLists-pic'>" +
				"{{if $value.image_url}}"+
				"<img src='{{$value.image_url}}' alt='' />" +
				"{{else}}"+
				"<img src='' alt=''/>" +
				"{{/if}}"+
				"</div>" +
				"<div class='infoLists-cont'><p>{{$value.title | dataHtml:$value.title}}</p>" +
				"<p title='{{$value.content | dataHtml:$value.content}}'>{{$value.content | dataHtml:$value.content}}</p>" +
				"<div class='infoLists-footer'><span>{{$value.create_time}}</span>" +
				"<span>浏览:{{$value.page_view}}</span><span>小编:{{$value.author}}</span> </div> </div> </a></div>" +
				"</li>" +
				"{{/each}}";




			function afficheList (page) {
				common.ajaxRequest('bxg_anon/home/afficheList', "POST", {
					pageNumber:page,
					pageSize:5
				},function(data){
					if (data.resultObject.data.length != 0) {
						template.helper('dataHtml', function (date, format) {
							format = date.replace(/<[^>]+>/g,"");
							if (format == "" || format == null || format == undefined){
								return format = "";
							}
							return format;
						});
						$(".infoLists-contnet ul").append(template.compile(infolists)(data));
						$("#infoLists_btn_g").attr("data-page",parseInt(page)+(1));
						$(".infoLists-item a").unbind().on("click",function(){
							var _this = $(this);
							common.ajaxRequest("bxg_anon/home/updateAffiche","POST",{
								afficheId:_this.attr("data-id")
							},function(con){
							})
						})
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

			common.ajaxRequest('bxg_anon/home/hotAfficheList', "POST", {},function(data){
				template.helper('dataHtml', function (date, format) {
					format = date.replace(/<[^>]+>/g,"");
					if (format == "" || format == null || format == undefined){
						return format = "";
					}
					return format;
				});
				$(".indicatorContainer_dv").html(template.compile(indicatorCont)(data));
				$(".indicatorContainer_dv a").on("click",function(){
					var _this = $(this);
					common.ajaxRequest("bxg_anon/home/updateAffiche","POST",{
						afficheId:_this.attr("data-id")
					},function(con){

					})
				})
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

		return {
			createPage: createPage
		}
	});