/**
 *   组织作业
 *
 *   本地查看示例:http://127.0.0.1:3000/app/js/lib/DataTables-1.10.13/examples/ajax/null_data_source.html
 *
 *   datatable中文文档:http://datatables.club/manual/data.html
 *
 *   npm install
 *   运行:npm run dev
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/taskmanage/organizetask/organizetask.html',
		'text!tplUrl/teaching/taskmanage/organizetask/organizetask.operation.html',
		'common',
		'api',
		'json!DataTables-1.10.13/i18n/Chinese.json',
		'datatables.net',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.hovertreescroll',
		'portamento',
		'css!font-awesome',
		'css!cssUrl/taskmanage.organizetask'
	],
	function (template,$,layui,layer,
	          organizeTaskTpl,
	          organizeTaskOperationTpl,
	          common,api,Chinese) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.organizetask").addClass("testcentres-this");

			$(".teaching").css("position","relative");
			$(".teachingBox").css("background-color","#f6f6f6");
			$(".teachingBox").css("position","relative");
			$(".teaching-nav").show();
			$(".testcentres-nav").show();


			//数据源
			var TestPaperDB = TestPaper();
			var data = TestPaperDB.resultObject.lists;

			//数据源---预览试卷
			var GeneratedPaperDB = GeneratedPaper();

			$("#testcentresHtml").html(template.compile( organizeTaskTpl)({
				TestPaperDB: TestPaperDB
			}));




			//处理子孙页面
			//this.subPageCreatePage = function(page,childpage,pagenumber){
			//	require( ['tplUrl/teaching/'+page+'/'+childpage+'/'+pagenumber+'/'+pagenumber], function (m) {
			//		m.createPage(page,childpage,pagenumber);
			//	});
			//}

			//生成表格
			var table = $('#organizepaperTable').DataTable({
				data: data,  //对象数据
				columns: [
					{ data: 'name' },
					{ data: 'relatedCourses' },
					{ data: 'difficulty' },
					{ data: 'creationTime' },
					{ data: 'heat' },
					{ data: organizeTaskOperationTpl }
				],
				"searching": false,  //是否开启本地搜索功能
				"lengthChange": false, //是否允许最终用户改变表格每页显示的记录数
				"language": Chinese,   //国际化--中文
				"lengthChange": false,   //是否允许用户改变表格每页显示的记录数
				"pageLength": 10 ,   //改变初始的页面长度(每页显示的记录数)
				"columnDefs": [
					{ "width": "348px",className: "name", "targets": 0 },
					{ "width": "153px",className: "difficulty", "targets": 1 },
					{ "width": "164px",className: "relatedCourses", "targets": 2 },
					{ "width": "152px",className: "heat", "targets": 3 },
					{ "width": "200px",className: "creationTime", "targets": 4 },
					{ "width": "auto",className: "operation", "targets": 5 },
					{
					"targets": -1,
					"data": null,
					"defaultContent": organizeTaskOperationTpl
				} ]
			});

			$('#organizepaperTable tbody').on( 'click', 'button', function () {
				var data = table.row( $(this).parents('tr') ).data();
				alert( data[0] +"'s salary is: "+ data[ 5 ] );
			} );

		}

		//获取考试试卷数据
		var TestPaper = function() {
			return common.TextrequestService('app/data/testpaper.json','get', {});
		};


		//获取生成的考试数据
		var GeneratedPaper = function() {
			return common.TextrequestService('app/data/teaching-add-gpaper.json','get', {});
		};

		return {
			createPage: createPage
		}
	});