/**
 * Created by zxl on 2017/8/9.
 */
var wrongnote = new Vue({
    el: '#wrongnote',
    data: {
        questions: []
    },
    mounted: function () {
        this.getWrongNote(1);
        this.touch();
        this.getStyle();
    },
    methods: {
        getWrongNote: function (page) {
            var SubData = {};
            var that = this;
            SubData.uuid = Request.uuid;
            SubData.knowLedgeList = Request.code;
            //SubData.uuid = 'ca5dcb55adb70750b69fd2c89c6db278';
            //SubData.knowLedgeList = '';
            SubData.pageNum = page;
            SubData.pageSize = 10;
            $.ajax({
                type: "get",
                url: "/pad/teacher/center/wrongbook",
                dataType: "json",
                data: SubData,
                success: function (data) {
                    var Code = data.retCode;
                    if (Code == '0000') {
                        var list = data.retData.list;
                        var startOrder = that.questions.length;
                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                var question = {};
                                if (list[i].groupCode) {
                                    if (list[i].isSplite == '0') {
                                        question.groupCode = list[i].groupCode;
                                        startOrder++;
                                        question.order = startOrder + '、';
                                        question.subs = [];
                                        question.questionId = list[i].questionId;
                                        question.content = list[i].content.replace('【材料】', '');
                                        for (var k = 0; k < list[i].questions[0].labels.length; k++) {
                                            var questionType = list[i].questions[0].labels[k].questionType;
                                            if (questionType == '03') {
                                                question.answer = list[i].questions[0].labels[k].content.replace('【答案】', '');
                                            } else if (questionType == '05') {
                                                question.analyse = list[i].questions[0].labels[k].content.replace('【解析】', '');
                                            } else if (questionType == '07') {
                                                question.diff = list[i].questions[0].labels[k].content.replace('【难度】', '');
                                            }
                                        }
                                        for (var j = 0; j < list[i].questions.length; j++) {
                                            var sub = {};
                                            sub.questionId = list[i].questions[j].questionId;
                                            sub.questionTitle = list[i].questions[j].questionTitle.replace('【题干】', '');
                                            sub.options = [];
                                            if (list[i].questions[j].optionA) {
                                                sub.options.push(list[i].questions[j].optionA);
                                            }
                                            if (list[i].questions[j].optionB) {
                                                sub.options.push(list[i].questions[j].optionB);
                                            }
                                            if (list[i].questions[j].optionC) {
                                                sub.options.push(list[i].questions[j].optionC);
                                            }
                                            if (list[i].questions[j].optionD) {
                                                sub.options.push(list[i].questions[j].optionD);
                                            }
                                            question.subs.push(sub);
                                        }
                                        that.questions.push(question);
                                    } else {
                                        startOrder++;
                                        question.isSplite = list[i].isSplite;
                                        question.order = startOrder + '、';
                                        question.content = list[i].content.replace('【材料】', '');
                                        question.questionId = list[i].questions[0].questionId;
                                        question.questionTitle = list[i].questions[0].questionTitle.replace('【题干】', '');
                                        question.options = [];
                                        if (list[i].questions[0].optionA) {
                                            question.options.push(list[i].questions[0].optionA);
                                        }
                                        if (list[i].questions[0].optionB) {
                                            question.options.push(list[i].questions[0].optionB);
                                        }
                                        if (list[i].questions[0].optionC) {
                                            question.options.push(list[i].questions[0].optionC);
                                        }
                                        if (list[i].questions[0].optionD) {
                                            question.options.push(list[i].questions[0].optionD);
                                        }
                                        for (var k = 0; k < list[i].questions[0].labels.length; k++) {
                                            var questionType = list[i].questions[0].labels[k].questionType;
                                            if (questionType == '03') {
                                                question.answer = list[i].questions[0].labels[k].content.replace('【答案】', '');
                                            } else if (questionType == '05') {
                                                question.analyse = list[i].questions[0].labels[k].content.replace('【解析】', '');
                                            } else if (questionType == '07') {
                                                question.diff = list[i].questions[0].labels[k].content.replace('【难度】', '');
                                            }
                                        }
                                        that.questions.push(question);
                                    }
                                } else {
                                    startOrder++;
                                    question.order = startOrder + '、';
                                    question.questionId = list[i].questions[0].questionId;
                                    question.questionTitle = list[i].questions[0].questionTitle.replace('【题干】', '');
                                    question.options = [];
                                    if (list[i].questions[0].optionA) {
                                        question.options.push(list[i].questions[0].optionA);
                                    }
                                    if (list[i].questions[0].optionB) {
                                        question.options.push(list[i].questions[0].optionB);
                                    }
                                    if (list[i].questions[0].optionC) {
                                        question.options.push(list[i].questions[0].optionC);
                                    }
                                    if (list[i].questions[0].optionD) {
                                        question.options.push(list[i].questions[0].optionD);
                                    }
                                    for (var k = 0; k < list[i].questions[0].labels.length; k++) {
                                        var questionType = list[i].questions[0].labels[k].questionType;
                                        if (questionType == '03') {
                                            question.answer = list[i].questions[0].labels[k].content.replace('【答案】', '');
                                        } else if (questionType == '05') {
                                            question.analyse = list[i].questions[0].labels[k].content.replace('【解析】', '');
                                        } else if (questionType == '07') {
                                            question.diff = list[i].questions[0].labels[k].content.replace('【难度】', '');
                                        }
                                    }
                                    that.questions.push(question);
                                }
                            }
                        } else {
                            $(window).unbind('scroll');
                        }
                    }
                }
            });
        },
        touch: function () {
            var that = this;
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
                var scrollHeight = $(document).height(); //当前页面的总高度
                var windowHeight = $(this).height(); //当前可视的页面高度
                if (scrollTop + windowHeight >= scrollHeight) {
                    //距离顶部+当前高度 >=文档总高度 即代表滑动到底部
                    var page = that.questions.length / 10;
                    if (parseInt(page) == page) {
                        that.getWrongNote(page + 1);
                    } else {
                        $(window).unbind('scroll');
                    }
                } else if (scrollTop <= 0) {//滚动条距离顶部的高度小于等于0

                }
            });
        },
        checkAnalyse: function (e) {
            var tar = e.currentTarget;
            var analyse = e.currentTarget.nextElementSibling;
            if (this.contains(tar.classList, 'down')) {
                tar.classList.remove('down');
                tar.classList.add('up');
                tar.children[0].children[1].src = '../../static/images/wrongnote/up.png';
                analyse.classList.remove('dino');
            } else {
                tar.children[0].children[1].src = '../../static/images/wrongnote/down.png';
                analyse.classList.add('dino');
                tar.classList.remove('up');
                tar.classList.add('down');
            }
        },
        // 判断数组是否含有某个元素
        contains: function (arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        getStyle: function () {
            $.ajax({
                type: "post",
                url: "/pad/common/commonStyle",
                dataType: "json",
                success: function (data) {
                    var Code = data.retCode;
                    if (Code == '0000') {
                        $("head").append(data.retData);
                    }
                }
            });
        }
    }
});

//# sourceMappingURL=wrongnote-compiled.js.map