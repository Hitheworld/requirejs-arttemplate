/**
 *   发布试卷  (未进行的考试  与   历史考试)
 *
 *   本地查看示例:http://127.0.0.1:3000/app/js/lib/DataTables-1.10.13/examples/ajax/null_data_source.html
 *
 *   npm install
 *   运行:npm run dev
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/releasepapers/releasepapers.html',
		'text!tplUrl/teaching/testcentres/releasepapers/releasepapers.NotCarriedTeaching.operation.html',
		'common',
		'api',
		'json!DataTables-1.10.13/i18n/Chinese.json',
		'datatables.net',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.releasepapers'
	],
	function (template,$,layui,layer,
	          releasepapersTpl,
	          NotCarriedTeachingOperationTpl,
	          common,api,Chinese) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");

			$(".teaching").css("position","relative");
			$(".teachingBox").css("background-color","#f6f6f6");
			$(".teachingBox").css("position","relative");
			$(".teaching-nav").show();
			$(".testcentres-nav").show();

			//数据源--未进行的考试--数据
			var NotCarriedTeachingDB = NotCarriedTeaching();
			var NotData = NotCarriedTeachingDB.resultObject.lists;

			//数据源--历史考试--数据
			var HistoryExamDB = HistoryExam();
			var HistoryData = HistoryExamDB.resultObject.lists;


			$("#testcentresHtml").html(template.compile( releasepapersTpl)({
				NotCarriedTeachingDB: NotCarriedTeachingDB
			}));



			//生成表格--未进行的考试
			var table = $('#NotCarriedTeaching').DataTable({
				data: NotData,  //对象数据
				columns: [
					{ data: 'examination' },
					{ data: 'name' },
					{ data: 'time' },
					{ data: 'grouping' },
					{ data: NotCarriedTeachingOperationTpl }
				],
				"searching": false,  //是否开启本地搜索功能
				"lengthChange": false, //是否允许最终用户改变表格每页显示的记录数
				"language": Chinese,   //国际化--中文
				"lengthChange": false,   //是否允许用户改变表格每页显示的记录数
				"pageLength": 10 ,   //改变初始的页面长度(每页显示的记录数)
				"columnDefs": [
					{ "width": "230px",className: "examination ", "targets": 0 },
					{ "width": "399px",className: "name", "targets": 1 },
					{ "width": "275px",className: "time", "targets": 2 },
					{ "width": "90px",className: "grouping", "targets": 3 },
					{ "width": "100px",className: "operation", "targets": 4 },
					{
					"targets": -1,
					"data": null,
					"defaultContent": NotCarriedTeachingOperationTpl
				}]
			});

			$('#NotCarriedTeaching tbody').on( 'click', 'button', function () {
				var data = table.row( $(this).parents('tr') ).data();
				alert( data[0] +"'s salary is: "+ data[ 5 ] );
			});


			//生成表格--历史考试
			var table = $('#HistoryExam').DataTable({
				data: HistoryData,  //对象数据
				columns: [
					{ data: 'examination' },
					{ data: 'name' },
					{ data: 'time' },
					{ data: 'papersNumber' },
					{ data: 'state' },
					{ data: 'grouping' },
					{ data: NotCarriedTeachingOperationTpl }
				],
				"searching": false,  //是否开启本地搜索功能
				"lengthChange": false, //是否允许最终用户改变表格每页显示的记录数
				"language": Chinese,   //国际化--中文
				"lengthChange": false,   //是否允许用户改变表格每页显示的记录数
				"pageLength": 10 ,   //改变初始的页面长度(每页显示的记录数)
				"columnDefs": [
					{ "width": "175px",className: "examination ", "targets": 0 },
					{ "width": "390px",className: "name", "targets": 1 },
					{ "width": "270px",className: "time", "targets": 2 },
					{ "width": "150px",className: "papersNumber", "targets": 3 },
					{ "width": "140px",className: "state", "targets": 4 },
					{ "width": "75px",className: "grouping", "targets": 5 },
					{
						"targets": -1,
						"data": null,
						"defaultContent": NotCarriedTeachingOperationTpl
					}]
			});


			//开始提示
			$(".J-open-start").on('click', function(){
				layer.confirm('确定要立即开始本次考试么？', {
					btn: ['确定','取消'] //按钮
				}, function(){
					layer.msg('开始成功', {icon: 1});
				}, function(){
					layer.msg('你已取消', {icon: 2});
				});
			});


		}

		//获取未进行的考试--数据
		var NotCarriedTeaching = function() {
			return common.TextrequestService('app/data/teaching-not-carriedTeaching.json','get', {});
		};


		//获取历史考试--数据
		var HistoryExam = function() {
			return common.TextrequestService('app/data/teaching-HistoryExam.json','get', {});
		};

		return {
			createPage: createPage
		}
	});