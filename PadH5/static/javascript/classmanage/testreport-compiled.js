/**
 * Created by zxl on 2017/8/8.
 */
var test = new Vue({
    el: '#test',
    data: {
        testDetail: [],
        className: '',
        testName: '',
        avgScore: ''
    },
    mounted: function () {
        this.getTestDetails();
    },
    methods: {
        getTestDetails: function () {
            var SubData = {};
            var that = this;
            //SubData.paperAssignId = Request.paperAssignId;
            SubData.paperAssignId = '08fff5a27cfb4df380d7812a10a69bfe';
            $.ajax({
                type: "post",
                url: "/pad/teacher/class/report/test/details",
                dataType: "json",
                data: SubData,
                success: function (data) {
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.className = data.retData[0].className;
                        that.testName = data.retData[0].paperName;
                        that.testDetail = [];
                        var scores = 0;
                        for (var i = 0; i < data.retData.length; i++) {
                            var td = {};
                            td.name = data.retData[i].name;
                            td.score = data.retData[i].score;
                            td.shouldTime = data.retData[i].shouldTime;
                            td.totalTime = data.retData[i].totalTime;
                            td.showTime = that.toTime(td.totalTime);
                            that.testDetail.push(td);
                            scores += parseInt(td.score);
                        }
                        that.avgScore = scores / data.retData.length;
                    }
                }
            });
        },
        toTime: function (value) {
            var theTime = parseInt(value); // 秒
            var hour = 0; //时
            var minute = 0; // 分
            var second = 0; //秒
            var result;
            if (value == null || value == '') {
                result = '- -';
                return result;
            } else {
                if (parseInt(theTime) > 60) {
                    minute = parseInt(theTime / 60);
                    second = parseInt(theTime % 60);
                } else {
                    hour = 0;
                    minute = 0;
                    second = theTime;
                }
                if (parseInt(minute) > 60) {
                    hour = parseInt(minute / 60);
                    minute = parseInt(minute % 60);
                } else {
                    hour = 0;
                }
                hour = this.showTime(hour);
                minute = this.showTime(minute);
                second = this.showTime(second);
                result = hour + ':' + minute + ':' + second;
                return result;
            }
        },
        showTime: function (value) {
            var showStr = "";
            if (parseInt(value) < 10) {
                showStr = "0" + value;
            } else {
                showStr = value;
            }
            return showStr;
        }
    }
});

//# sourceMappingURL=testreport-compiled.js.map