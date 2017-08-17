/**
 * Created by lc on 2017/8/14.
 */
var CorrecAnswer = new Vue({
	el : "#CorrecAnswer",
	data : {
		"datas" : "",
		"Lable" : ""
	},
	mounted : function () {
		this.thisdo()
	},
	methods : {
		thisdo : function () {
			var _this = this
			var parmas = {};
			parmas.questionId = Request.questionId;
			parmas.assignId = Request.assignId;
			$.ajax({
				type : "post",
				url : "/pad/teacher/correct/selectQueLabelByMongo",
				data : parmas,
				dataType : "json",
				success : function (data) {
					if (data.retCode == "0000") {
						_this.Data(data.retData);
					}
				},
				error : function (e) {
					console.log(e)
				}
			})
		},
		Data : function (retData) {
			console.log(retData)
			this.datas = retData.list
			setTimeout(function () {
				intMathJax()
			}, 1)
		}
	}
})
