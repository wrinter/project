/**
 * Created by lc on 2017/8/17.
 */
var volume = new Vue({
	el: "#TestPaper",
	data: {
		"datas": "",
		"paperTime": '',
		"paperScore": 0
	},
	mounted: function () {
		this.getData();
	},
	methods: {
		getData: function () {
			var _this = this;
			var parmas = {};
			parmas.paperId = "0d230f43465c44728645011a3dc62bb7";
			parmas.uuid = "tong";
			$.ajax({
				type: "post",
				url: "/pad/teacher/paper/assign/paperinfo",
				data: parmas,
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
			var _this = this;
			// const
			var TestPaperTitleWord = $(".TestPaperTitleWord");
			var TestPaperTime = $(".TestPaperTime");
			var TestPaperScore = $(".TestPaperScore");
			// paperId存值
			TestPaperTitleWord.attr("paperId", retData.paperId);
			TestPaperTitleWord.text(retData.paperName);
			_this.paperTime = retData.testTime;
			_this.paperScore = retData.score;
			this.datas = retData.questionLines;
			console.log(retData);
			setTimeout(function () {
				_this.Label();
				intMathJax();
			}, 1);
		},
		Label: function () {
			var label = document.getElementsByTagName("label");
			for (var i = 0; i < label.length; i++) {
				var Num = i + 1;
				label[i].innerHTML = Num + "、";
			}
		},
		View: function (event) {
			var TestPaperLookUp = event.currentTarget;
			var analyse = event.currentTarget.parentNode.nextElementSibling;
			if (TestPaperLookUp.classList.contains("down")) {
				TestPaperLookUp.classList.remove("down");
				TestPaperLookUp.classList.add('up');
				TestPaperLookUp.children[1].src = '../../static/images/wrongnote/down.png';
				analyse.classList.add('dino');
			} else {
				TestPaperLookUp.classList.remove("up");
				TestPaperLookUp.classList.add('down');
				TestPaperLookUp.children[1].src = '../../static/images/wrongnote/up.png';
				analyse.classList.remove('dino');
			}
		}
	}
});

//# sourceMappingURL=volume-compiled.js.map