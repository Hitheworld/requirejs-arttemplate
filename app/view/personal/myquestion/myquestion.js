define(['template',
		'jquery',
		'text!tplUrl/personal/myquestion/myquestion.html',
		'text!tplUrl/personal/myquestion/myquestion_content.html',
		'common',
		'layer',
		'layui',
		'laypage',
		'api',
		'css!layerCss',
		'css!layuiCss',
		'css!laypageCss',
		'css!cssUrl/personal'
		],
	function (template,$,myquestionTpl,myquestion_content,common,layer,layui,laypage,api) {

		function createPage() {
			$(".personal_ul li").attr("class","").each(function(){
				if ($(this).text() == "我的提问") {
					$(this).attr("class","personal_this")
				}
			});

			//处理与过滤HTML标签
			template.helper('dataHtml', function (date, format) {
				format = date.replace(/<[^>]+>/g,"");
				return format;
			});

			$("#personal").html(myquestionTpl);
			$(".my_open > div").click(function(){
				if($(".my_open ul").is(":hidden")) {
					$(".my_open ul").css("display", "block");
				} else {
					$(".my_open ul").css("display", "none");
				}
			});

			$(".my_open ul li").on("click", function () {
				$(".my_open > div > div").text($(this).text());
				$(".my_open ul").css("display", "none");
				switch ($(this).attr("data-tpye")) {
					case "1":
						AddMyQuestion($(this).attr("data-tpye"), 1, 10);
						break;
					case "2":
						AddMyQuestion($(this).attr("data-tpye"), 1, 10);
						break;
					default:
						AddMyQuestion($(this).attr("data-tpye"), 1, 10);
				}
			});


			function AddMyQuestion(type, curr, pageSize) {
				//我的消息
				console.log(type, curr, pageSize)
				common.ajaxRequest("bxg/user/myAsk", "POST", {
					status: type,
					pageNumber: curr || 1,
					pageSize: pageSize,
					loginName:$(".home-user-name").attr("data-name")
				}, function (data, state) {
					if (data.resultObject.items.length == 0) {
						$('#page').css("display","none")
					}else {
						$('#page').css("display","block")
					}
					$(".myquestion_content").html(template.compile(myquestion_content)(data));
					if(data.success){
						//显示分页
						laypage({
							cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
							pages:parseInt(data.resultObject.totalPageCount), //总页数 parseInt(data.resultObject.totalpages)
							curr: curr ||1, //当前页
							skin: '#2cb82c',
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									AddMyQuestion(type,obj.curr,pageSize);
								}
							}
						});
					}
				});
			}

			AddMyQuestion("2", 1, 10);

		}

		return {
			createPage: createPage
		}
	});