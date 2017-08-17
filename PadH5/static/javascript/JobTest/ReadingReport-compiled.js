/**
 * Created by lc on 2017/8/9.
 */
var ReadingReport = new Vue({
	el: '#ReadingReport',
	data: {
		"addColor": "addColor",
		"datas": ""
	},
	mounted: function () {
		this.getData();
	},
	methods: {
		ComTime: function (data) {
			return ToComTime(data);
		},
		getData: function () {
			var _this = this;
			var parmas = {};
			parmas.paperAssignId = Request.paperAssignId;
			$.ajax({
				type: "post",
				url: "/pad/teacher/paper/report/articleReport",
				data: parmas,
				dataType: "json",
				success: function (data) {
					console.log(data);
					if (data.retCode == "0000") {
						_this.Data(data.retData);
					}
				},
				error: function (e) {
					console.log(e);
				}
			});
		},
		Data: function (retData) {
			// 题目
			$("title").text(retData.name);
			// 列表
			this.datas = retData.userReportList;
			console.log(retData);
		}
	}
});

//# sourceMappingURL=ReadingReport-compiled.js.map