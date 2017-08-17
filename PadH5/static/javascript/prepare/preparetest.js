/**
 * Created by zxl on 2017/8/9.
 */
var prepare = new Vue({
    el: '#prepare',
    data: {
        questions:[],
        testName:'',
        testId:'',
        selectedAnswer:[],
        subFlag:false//未提交
    },
    mounted:function(){
        this.getTest();
    },
    methods: {
        getTest: function() {
            var SubData = {};
            var that = this
            SubData.uuid = Request.uuid;
            SubData.resId = Request.resId
            //SubData.uuid = '795853cdfa64996efd12f75f41f3b799';
            //SubData.resId = 'ddf7f166befe4574baefdeb953f1dce2';
            $.ajax({
                type : "post",
                url : "/pad/teacher/prepare/video/video/test",
                dataType : "json",
                data:SubData,
                success : function(data){
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.testName = data.retData.testTitle
                        that.testId = data.retData.testId
                        var questionList = data.retData.questionList
                        for(var i=0;i<questionList.length;i++) {
                            var question = {}
                            question.id = questionList[i].id;
                            question.options = [];
                            if(questionList[i].optionA){
                                var option = {}
                                option.flag = 'A';
                                option.content = questionList[i].optionA;
                                option.index = i;
                                question.options.push(option);
                            }
                            if(questionList[i].optionB){
                                var option = {}
                                option.flag = 'B';
                                option.content = questionList[i].optionB;
                                option.index = i;
                                question.options.push(option);
                            }
                            if(questionList[i].optionC){
                                var option = {}
                                option.flag = 'C';
                                option.content = questionList[i].optionC;
                                option.index = i;
                                question.options.push(option);
                            }
                            if(questionList[i].optionD){
                                var option = {}
                                option.flag = 'D';
                                option.content = questionList[i].optionD;
                                option.index = i;
                                question.options.push(option);
                            }
                            question.answerFlag = questionList[i].answer;
                            question.order = (i+1)+ '、';
                            for(var j=0;j<questionList[i].list.length;j++) {
                                var questionType = questionList[i].list[j].questionType
                                if(questionType=='01') {
                                    question.content =  questionList[i].list[j].content.replace('【题干】','');
                                } else if(questionType=='03'){
                                    question.answer = questionList[i].list[j].content.replace('【答案】','');
                                } else if(questionType=='05'){
                                    question.analyse = questionList[i].list[j].content.replace('【解析】','');
                                }
                            }
                            that.questions.push(question);
                        }
                        that.selectedAnswer.length = that.questions.length
                    }
                }
            })
        },
        selectAnswer:function(e,flag,index){
            if(this.subFlag) {
                return
            }
            var children = e.currentTarget.parentNode.children
            for(var i = 0;i<children.length;i++) {
                children[i].classList.remove('on');
            }
            this.selectedAnswer[index] = flag
            var classList = e.currentTarget.classList
            classList.add('on')
        },
        submitTest:function() {
            var p_src = document.getElementsByClassName('p_src')
            for(var i=0;i<this.questions.length;i++) {
                if(this.selectedAnswer[i]&&this.questions[i].answerFlag == this.selectedAnswer[i]) {
                    p_src[i].childNodes[0].src = '../../static/images/prepare/right.png'
                    p_src[i].classList.remove('dino')
                } else {
                    p_src[i].childNodes[0].src = '../../static/images/prepare/wrong.png'
                    p_src[i].classList.remove('dino')
                }
            }
            $('.p_src').show();
            $('.p_labels').show();
            this.subFlag = true
        }
    }
});