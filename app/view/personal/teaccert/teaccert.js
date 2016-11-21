define(['template',
		'jquery',
		'text!tplUrl/personal/teaccert/teaccert.html',
		'text!tplUrl/personal/teaccert/edit.teaccert.html',
		'text!tplUrl/personal/teaccert/success.teaccert.html',
		'common',
		'layer',
		'laypage',
		'layui',
		'api',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.form',
		'css!font-awesome',
		'css!cssUrl/personal.edit.teaccert',
		'css!cssUrl/personal.success.teaccert'
],
	function (template,$,teaccertTpl,editTeaccertTpl,successTeaccertTpl,common,layer,laypage,layui,api) {

		function createPage() {
			$(".personal_ul li").attr("class","").each(function(){
				if ($(this).text() == "教师资格认证") {
					$(this).attr("class","personal_this")
				}
			});
			$("#personal").html(teaccertTpl);
			common.syncRequest('bxg/user/certification', "GET", {
				teacherId:$(".home-user-name").attr("data-id")
			}, function (data, state) {
				if (data.resultObject[0].indenty_status != 2) {
					$("#teaccert").html(template.compile(successTeaccertTpl)(data));
					$(".success-teaccert-pic img").attr("src",data.resultObject[0].certification_img);
					$("#name").val(data.resultObject[0].name);
					if (data.resultObject[0].sex == 0) {
						$("#sex").text("女");
					}else {
						$("#sex").text("男");
					}

					$("#college_name").text(data.resultObject[0].college_name);
					$("#department_name").text(data.resultObject[0].department_name);
					$("#subject").text(data.resultObject[0].subject);
					$("#job_title").text(data.resultObject[0].job_title);
				} else {
					$("#teaccert").html(template.compile(editTeaccertTpl)(data));
					$("#teacher_id").val($(".home-user-name").attr("data-id"));
					$("#name").val(data.resultObject[0].name);
					if (data.resultObject[0].sex == 0) {
						$("#sex:eq(0)").attr("checked","checked");
					}else {
						$("#sex:eq(1)").attr("checked","checked");
					}
					var college_name2 = data.resultObject[0].college_name;
					$("#college_name").val(data.resultObject[0].college_name);
					var department_name2 = data.resultObject[0].department_name;
					$("#department_name").val(data.resultObject[0].department_name);
					$("#subject").val(data.resultObject[0].subject);
					$("#job_title").val(data.resultObject[0].job_title);
					$("#LAY_demo_upload").attr("src",data.resultObject[0].certification_img);
					common.ajaxRequest('bxg/common/collegesList', "GET",{},function(data){
						$(".school-selete1").empty();
						var arrue = data.resultObject;
						for (var i = 0; i < data.resultObject.length;i++) {
							if (data.resultObject[i].collegeName == college_name2) {
								$("#college_id").val(data.resultObject[i].id)
							}
							$(".school-selete1").append("<li data-id="+data.resultObject[i].id+">"+ data.resultObject[i].collegeName+"</li>")
						}


						//选择事件---选择学校
						var oSelect = $(".J-school1");
						var oSub = $(".school-selete1");
						var aLi = $(".school-selete1 li");
						var i = 0;
						oSelect.on('click', function(event){
							oSub.toggle();
							//阻止事件冒泡
							return false;
						});
						for (i = 0; i < aLi.length; i++)
						{
							//鼠标划过
							aLi[i].onmouseover = function ()
							{
								this.className = "hover"
							};
							//鼠标离开
							aLi[i].onmouseout = function ()
							{
								this.className = "";
							};
							//鼠标点击
							aLi[i].onclick = function ()
							{
								var v = this.innerHTML;
								//console.log(v)
								oSelect.val(v);
								$("#college_name").val($(this).attr("data-id"));
							}
						}

						aLi.on("click",function(e){
							var eve = e || window.event;
							oSelect.val($(this).html())
						});
						$(document).on('click', function(){
							oSub.hide();
						});

						//$("#college_name").on("input propertychange",function(e){
						//	var eve = e || window.event;
						//	var str = $(eve.target).val();
						//	if (!Array.prototype.indexOf)
						//	{
						//		Array.prototype.indexOf = function(elt /*, from*/)
						//		{
						//			var len = this.length >>> 0;
						//			var from = Number(arguments[1]) || 0;
						//			from = (from < 0)
						//				? Math.ceil(from)
						//				: Math.floor(from);
						//			if (from < 0)
						//				from += len;
						//			for (; from < len; from++)
						//			{
						//				if (from in this &&
						//					this[from] === elt)
						//					return from;
						//			}
						//			return -1;
						//		};
						//	}
						//	for (var i = 0; i < arrue.length;i++) {
						//		if (arrue[i].collegeName.indexOf(str) != "-1") {
						//			$("#school-selete1 li").empty();
						//			var flow = layui.flow;
						//			flow.load({
						//				elem: '#school-selete1',
						//				scrollElem:'#school-selete1' //滚动条所在元素，一般不用填，此处只是演示需要。
						//				, done: function (page, next) { //到达临界点（默认滚动触发），触发下一页
						//					//模拟插入
						//					setTimeout(function(){
						//						var lis = [];
						//						for(var i = 0; i < 4; i++){
						//							lis.push('<li>'+ arrue[i].collegeName +'</li>')
						//						}
						//						next(lis.join(''), page > 10 ? 0 : 8);
						//					}, 500);
                        //
						//				}
						//			})
						//			console.log(arrue[i].collegeName);
						//			//aLi.append("<li data-id="+arrue[i].id+">"+ arrue[i].collegeName+"</li>")
						//		}
						//	}
						//})
					});
					common.ajaxRequest('bxg/common/departMentList', "GET",{},function(data){

						$(".school-selete2").empty();
						for (var i = 0; i < data.resultObject.length;i++) {
							if (data.resultObject[i].departmentName == department_name2) {
								$("#department_id").val(data.resultObject[i].id)
							}
							$(".school-selete2").append("<li data-id="+data.resultObject[i].id+">"+ data.resultObject[i].departmentName+"</li>")
						};
						//选择事件---选择学校
						var oSelect2 = $(".J-school2");
						var oSub2 = $(".school-selete2");
						var aLi2 = $(".school-selete2 li");
						var i2 = 0;
						oSelect2.on('click', function(event){
							oSub2.toggle();
							//阻止事件冒泡
							return false;
						});
						for (i2 = 0; i2 < aLi2.length; i2++)
						{
							//鼠标划过
							aLi2[i2].onmouseover = function ()
							{
								this.className = "hover"
							};
							//鼠标离开
							aLi2[i2].onmouseout = function ()
							{
								this.className = "";
							};
							//鼠标点击
							aLi2[i2].onclick = function ()
							{
								var v = this.innerHTML;
								//console.log(v)
								oSelect2.val(v);
								$("#department_id").val($(this).attr("data-id"));
							}
						}
						$(document).on('click', function(){
							oSub2.hide();
						});
					})

					$("#Myform").validate();
					$("#UpLoadFile").change(function(){
						var filepath = $(this).val();
						var extStart = filepath.lastIndexOf(".");
						var ext = filepath.substring(extStart, filepath.length).toUpperCase();
						if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
							layer.msg("图片限于bmp,png,gif,jpeg,jpg格式", {icon: 2});
						} else {
							if (filepath) {
								console.log(filepath);
								$("#Myform").attr("action","bxg/common/upCertificationImg");
								$("#Myform").submit();
							}
						}
					});
					$("#Myform").on("submit",function(){
						$(this).ajaxSubmit(function(message){
							$("#LAY_demo_upload").attr("src",message.resultObject);
							$("#UpLoadFile_hidden").val(message.resultObject)
						})
						return false;
					});
				}

				//$(".mynews_content_span").on("click",function(){
				//	layer.open({
				//		type: 1,
				//		title: '消息详情',
				//		area: ['500px', '508px'], //宽高
				//		shadeClose: true,//开启遮罩关闭
				//		content: template.compile(mynews_alert)({content:$(this).attr("data-content")})
				//	});
				//});
			});







			//加载更多--展开所教专业
			$("#J-open-major").on('click', function(){
				$(".layui-input-block").css("max-height","100%");
			});



			//表单检验
			$("#signupForm").validate({
				rules : {
					name : {required : true},
					college_name : {required : true},
					department_name : {required : true},
					subject : {required : true},
					job_title : {required : true}
				},
				messages : {
					name : {required : '请输入用户名'},
					college_name : {required : '请输入学校名称'},
					department_name : {required : "请输入院系"},
					subject : {required : "请输入专业"},
					job_title : {required : "请输入职务"}
				},
				errorElement : "p"
			});


			//表单系列化
			$('#signupForm').submit(function(){
				if ($("#Myform").valid()){
					$(this).ajaxSubmit(
						{
							url: 'bxg/user/addOrUpdateTeacher',                 //默认是form的action
							//type: type,               //默认是form的method（get or post）
							dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
							method: "post",
							//clearForm: true,          //成功提交后，清除所有表单元素的值
							//resetForm: true,          //成功提交后，重置所有表单元素的值
							target: '#output',          //把服务器返回的内容放入id为output的元素中
							//timeout: 3000,               //限制请求的时间，当请求大于3秒后，跳出请求
							//提交前的回调函数
							beforeSubmit: function(arr,$form,options){
								//formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]
								//jqForm:   jQuery对象，封装了表单的元素
								//options:  options对象
								//比如可以再表单提交前进行表单验证
								//console.log("beforeSubmit",arr,$form,options);
								//console.log("数据是:",arr[0].value != '' );
								//if(arr[0].value != '' || !arr[1].value != ''){
								//	return false;
								//}
							},
							//提交成功后的回调函数
							success: function(data,status,xhr,$form){
								//console.log("success",data,status,xhr,$form);
								if(data.success){
									layer.msg("修改成功", {icon: 1});
								}else {
									layer.msg(data.success, {icon: 5});
								}
							},
							error: function(xhr, status, error, $form){
								//console.log("error",xhr, status, error, $form)
							},
							complete: function(xhr, status, $form){
								//console.log("complete",xhr, status, $form)
							}
						}
					);
				}

				//系列化表单数据
				//var data = $(this).serialize();
				//if(!data.username || !data.sex || !data.school || !data.file){
				//	return false;
				//}
				//console.log(data,data.username);

				//反系列化表单
				//data.split('&').forEach(function(param){
				//	param = param.split('=');
				//	var name = param[0],
				//		val = param[1];
				//
				//	$('form [name=' + name + ']').val(val);
				//	console.log(name,val)
				//});
				return false;
			});



		}

		return {
			createPage: createPage
		}
	});