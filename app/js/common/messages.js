/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */

define(['jquery', 'jquery.validate'], function ($) {
//	// DOM Ready
	$(function () {
		//以字母开头--包含中文
		$.validator.addMethod("ABC123", function(value, element) {
			var abc = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9]+$/;
			return this.optional(element) || (abc.test(value));
		}, "请输入2个字以上并以字母开头的字符");

		//包含字母、数字、特殊字符 --起码其中两种组合
		$.validator.addMethod("words", function(value, element) {
			var abce = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
			return this.optional(element) || (abce.test(value));
		}, "请输入包含字母、数字、特殊字符起码其中两种组合");

		// QQ号码验证
		$.validator.addMethod("qq", function(value, element) {
			var tel = /^[1-9]\d{4,9}$/;
			return this.optional(element) || (tel.test(value));
		}, "qq号码格式错误");

		// 身份证号码验证
		$.validator.addMethod("isIdCardNo", function(value, element) {
			return this.optional(element) || idCardNoUtil.checkIdCardNo(value);
		}, "请正确输入您的身份证号码");

		//护照编号验证
		$.validator.addMethod("passport", function(value, element) {
			return this.optional(element) || checknumber(value);
		}, "请正确输入您的护照编号");

		// 手机号码验证
		$.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");

		// 电话号码验证
		$.validator.addMethod("isTel", function(value, element) {
			var tel = /^\d{3,4}-?\d{7,9}$/; //电话号码格式010-12345678
			return this.optional(element) || (tel.test(value));
		}, "请正确填写您的电话号码");

		// 联系电话(手机/电话皆可)验证
		$.validator.addMethod("isPhone", function(value,element) {
			var length = value.length;
			var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
			var tel = /^\d{3,4}-?\d{7,9}$/;
			return this.optional(element) || (tel.test(value) || mobile.test(value));

		}, "请正确填写您的联系电话");

		// 邮政编码验证
		$.validator.addMethod("isZipCode", function(value, element) {
			var tel = /^[0-9]{6}$/;
			return this.optional(element) || (tel.test(value));
		}, "请正确填写您的邮政编码");

		$.extend($.validator.messages, {
			required: "这是必填字段",
			remote: "请修正此字段",
			email: "请输入有效的电子邮件地址",
			url: "请输入有效的网址",
			date: "请输入有效的日期",
			dateISO: "请输入有效的日期 (YYYY-MM-DD)",
			number: "请输入有效的数字",
			digits: "只能输入数字",
			creditcard: "请输入有效的信用卡号码",
			equalTo: "你的输入不相同",
			extension: "请输入有效的后缀",
			maxlength: $.validator.format("最多可以输入 {0} 个字符"),
			minlength: $.validator.format("最少要输入 {0} 个字符"),
			rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
			range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
			max: $.validator.format("请输入不大于 {0} 的数值"),
			min: $.validator.format("请输入不小于 {0} 的数值")
		});

	});
});