/**
 *   查看批阅试卷
 *
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/teaching/testcentres/lookreadtest/lookreadtest.html',
		'text!tplUrl/teaching/testcentres/lookreadtest/iconOperation.html',
		'common',
		'api',
		'json!DataTables-1.10.13/i18n/Chinese.json',
		'datatables.net',
		'jquery.hovertreescroll',
		'portamento',
		'radialIndicator',
		'css!font-awesome',
		'css!cssUrl/lookreadtest'
	],
	function (template,$,layui,layer,
	          lookreadtestTpl,
	          iconOperationTpl,
	          common,api,Chinese) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-组织试卷";

			//数据源
			//数据源
			var GeneratedPaperDB = GeneratedPaper(),
				infoData = GeneratedPaperDB.resultObject;
			console.log('添加数据是:',GeneratedPaperDB);

			$("#testcentresHtml").html(template.compile( lookreadtestTpl)({
				GeneratedPaper: GeneratedPaperDB,
				daiXuan: GeneratedPaperDB.resultObject.daiXuan.lists,
				duoXuan: GeneratedPaperDB.resultObject.duoXuan.lists,
				panDuan: GeneratedPaperDB.resultObject.panDuan.lists,
				tianKong: GeneratedPaperDB.resultObject.tianKong.lists,
				jianDa: GeneratedPaperDB.resultObject.jianDa.lists
			}));


			$('#indicatorContainer').radialIndicator({
				barBgColor:"#f0f0f0",
				barColor:"#39b674",
				fontColor:"#39b674",
				radius:70,
				barWidth : 5,
				initValue:60
			});
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");



			//题库导航
			$('#sidebar').portamento({disableWorkaround: true});


			//{ data: 'daiXuan' },
			//{ data: 'duoXuan' },
			//{ data: 'panDuan' },
			//{ data: 'tianKong' },
			//{ data: 'jianDa' }
			//生成表格---学生得分信息表
			var table = $('#studentInfo-table').DataTable({
				data: infoData,  //对象数据
				columns: [
					{ data: iconOperationTpl },
					{ data: 'yesSubject' },
					{ data: 'wrongSubject' },
					{ data: 'notSubject' },
					{ data: 'studentTotalScore' },
					{ data: 'jianDa' }
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
						"defaultContent": iconOperationTpl
					} ]
			});


		}

		//获取生成的考试数据
		var GeneratedPaper = function() {
			return common.requestService('../app/data/teaching-add-gpaper.json','get', {});
		};

		return {
			createPage: createPage
		}
	});