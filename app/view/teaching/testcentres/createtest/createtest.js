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
		'text!tplUrl/teaching/testcentres/createtest/createtest.html',
		'text!tplUrl/teaching/testcentres/createtest/addTestPaper.html',
		'common',
		'api',
		'json!DataTables-1.10.13/i18n/Chinese.json',
		'datatables.net',
		'dataTables.select',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.createtest'
	],
	function (template,$,layui,layer,
	          createtestTpl,
	          addTestPaperTpl,
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

			//数据源
			var GeneratedPaperDB = GeneratedPaper();
			var data = GeneratedPaperDB.resultObject.lists;


			$("#testcentresHtml").html(template.compile( createtestTpl)({

			}));

			$("#createtestForm").validate({
				rules : {
					papername : {
						required : true
					},
					paperwhenlong : {
						required : true,
						digits: true
					},
					papertraits : {
						required : true
					},
					testScores : {
						required : true,
						digits: true
					},
					paperselete : {
						required : true
					}
				},
				messages : {
					papername : {required : '请输入试卷名称'},
					paperwhenlong : {required : '请输入试卷时长'},
					papertraits : {required : '请选择试卷难度'},
					testScores : {required : '请输入试卷分数'},
					paperselete : {required : '请选择选择课程'}
				},
				errorElement : "p"
			});


			//添加试卷
			$(".J-add-testpaper").on('click', function(){
				layer.open({
					type: 1,
					title: "选择试卷 课程名称课程名称",
					skin: 'layui-layer-rim', //加上边框
					area: ['925px','820px'], //宽高
					content: template.compile( addTestPaperTpl)({

					})
				});


				//生成表格
				var table = $('#addTestPaperTable').DataTable({
					data: data,  //对象数据
					columns: [
						{ data: null },
						{ data: 'testName' },
						{ data: 'testDifficulty' },
						{ data: 'testScore' },
						{ data: 'testTime' },
						{ data: null }
					],
					"searching": false,  //是否开启本地搜索功能
					"lengthChange": false, //是否允许最终用户改变表格每页显示的记录数
					"language": Chinese,   //国际化--中文
					"lengthChange": false,   //是否允许用户改变表格每页显示的记录数
					"pageLength": 8 ,   //改变初始的页面长度(每页显示的记录数)
					"columnDefs": [
						{
							"width": "80px",
							"orderable": false,
							"className": 'select-checkbox',
							"targets": 0,
							"defaultContent": ""
						},
						{ "width": "230px",className: "name", "targets": 1 },
						{ "width": "155px",className: "difficulty", "targets": 2 },
						{ "width": "130px",className: "testScore", "targets": 3 },
						{ "width": "155px",className: "heat", "targets": 4 },
						{ "width": "30px",className: "operation", "targets": 5 },
						{
							"targets": -1,
							"data": null,
							"defaultContent": '<a href=""><i class="fa fa-search" aria-hidden="true"></i></a>'
						}
					],
					"select": {
						"style": 'os',
						"selector": 'td:first-child'
					}
				});
			});




		}



		//获取生成的考试数据
		var GeneratedPaper = function() {
			return common.TextrequestService('../app/data/teaching-testpaper-lists.json','get', {});
		};



		return {
			createPage: createPage
		}
	});