/**
 * Created by lc on 2017/8/9.
 */
var PreviewReport = new Vue({
	el : "#PreviewReport",
	data : {
		"addColor" : "addColor",
		"datas" : "",
		"errorRate" : "",
		"notDoneNameList" : ""
	},
	mounted : function () {
		this.getData()
	},
	methods : {
		getData : function () {
			var _this = this
			var parmas = {}
			//parmas.paperAssignId = 'f336a8c44b424c63ba3493c8e61cd56a'
			 parmas.paperAssignId = Request.paperAssignId;
			$.ajax({
				type : "post",
				url : "/pad/teacher/paper/report/videoReport",
				data : parmas,
				dataType : "json",
				success : function (data) {
					if (data.retCode == "0000") {
						_this.Data(data.retData)
					}
				},
				error : function (e) {
					console.log(e)
				}
			})
		},
		Data : function (retData) { // 数据层
			// 标题
			$("title").text(retData.title)
			// 错误率
			this.errorRate = retData.errorRate
			// 试题
			var Datas = retData.previewTest.questionList
			this.datas = Datas
			// 未交名单
			this.notDoneNameList = retData.notDoneNameList
			//console.log(this.notDoneNameList)
			//console.log(retData)
			//console.log(this.errorRate)
			setTimeout(function () {
				intMathJax()
			}, 1)
		},
		Cancle : function () {
			$(".PreviewMask").fadeOut()
		}
	}
})