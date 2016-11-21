define(['template',
		'jquery',
		'text!tplUrl/personal/mypoints/mypoinst.html',
		'text!tplUrl/personal/mypoints/poinst_1.html',
		'text!tplUrl/personal/mypoints/poinst_2.html',
		'text!tplUrl/personal/mypoints/myTable.html',
		'common',
		'layer',
		'layui',
		'laypage',
		'api',
		'xvCalendar',
		'css!cssUrl/personal'
],
	function (template,$,mypointsTpl,poinst_1Tpl,poinst_2Tpl,myTableTpl,common,layer,layui,laypage,api) {

		function createPage() {
			$(".personal_ul li").attr("class","").each(function(){
				if ($(this).text() == "我的积分") {
					$(this).attr("class","personal_this")
				}
			});
			$("#personal").html(mypointsTpl);

			$(".layui-tab-title li").on("click",function(e){
				var eve = e || window.event;
				if ($(eve.target).text() == "我的积分"){
					common.ajaxRequest('bxg/user/integral', "GET", {}, function (data, state) {
						$(".layui-tab-content").html(template.compile(poinst_1Tpl)(data));
						//日历控件---开始时间
						var startdate = {//example 1 opts
								'targetId':'startdate',//时间写入对象的id
								'triggerId': 'startdate',//触发事件的对象id
								'alignId':'startdate',//日历对齐对象
								'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
								'hms':'on'
							},
							enddate = {
								'targetId':'enddate',//时间写入对象的id
								'triggerId': 'enddate',//触发事件的对象id
								'alignId':'enddate',//日历对齐对象
								'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
								'hms':'on'
							};
						xvDate(startdate);
						xvDate(enddate);
						addmypoints($(".poinst_get_dv1_p2 select").val(),$("#startdate").val(),$("#enddate").val(),1,10);
						$("#myquestion_btn").on("click",function(){
							addmypoints($(".poinst_get_dv1_p2 select").val(),$("#startdate").val(),$("#enddate").val(),1,10);
							//console.log($(".poinst_get_dv1_p2 select").val()+"==="+$("#startdate").val()+"==="+$("#enddate").val())
						});
					});
				} else {
					$(".layui-tab-content").html(poinst_2Tpl)
				}
			});

			$(".layui-tab-title li:eq(0)").click();
			function addmypoints(type,startTime,endTime,pageNumber,pageSize){
				common.ajaxRequest('bxg/user/integralDetail', "GET", {
					type:type,
					startTime:startTime,//开始
					endTime:endTime,//结束
					pageNumber:pageNumber,
					pageSize:pageSize
				}, function (data, state) {
					$(".myTable").html( template.compile(myTableTpl)(data))
					if(data.success){
						//显示分页
						laypage({
							cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
							pages:parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
							curr: pageNumber ||1, //当前页
							skin: '#2cb82c',
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									addmypoints(type,startTime,endTime,obj.curr,pageSize);
								}
							}
						});
					}
				});
			}

			addmypoints("","","",1,10)
		}

		return {
			createPage: createPage
		}
	});