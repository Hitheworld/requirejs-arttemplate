/* Simplified Chinese translation for the jQuery Timepicker Addon /
/ Written by Will Lu */
define(['jquery','jquery-ui-timepicker'
	],
	function ($,regional) {
		$.timepicker.regional['zh-CN'] = {
			timeOnlyTitle: '选择时间',
			timeText: '时间',
			hourText: '小时',
			minuteText: '分钟',
			secondText: '秒钟',
			millisecText: '微秒',
			microsecText: '毫秒',
			timezoneText: '时区',
			currentText: '当前时间',
			closeText: '确定',
			timeFormat: 'HH:mm',
			amNames: ['AM', 'A'],
			pmNames: ['PM', 'P'],
			isRTL: false
		};
		$.timepicker.setDefaults($.timepicker.regional['zh-CN']);
});