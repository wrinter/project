/**
 * Created by Echonessy on 2017/8/14.
 */
var ThisVue = new Vue({
    el: '#Main',
    data: {
        ThisTab:0,
        TabImg0:'/static/images/paper/00.png',
        TabImg1:'/static/images/paper/1.png',
        TabImg2:'/static/images/paper/2.png',
        StudentData:'',
        AnalyzeData:'',
        ThisType:'',
        ThisUuid:'',
        CanvasData:''
    },
    mounted:function(){
        this.StudentAjax()
        this.AnalyzeAjax()
        this.GetOrder()
    },
    methods:{
        TabEvent:function (index) {
            this.ThisTab = index
            switch (index) {
                case 0:
                    this.TabImg0 = '/static/images/paper/00.png'
                    this.TabImg1 = '/static/images/paper/1.png'
                    this.TabImg2 = '/static/images/paper/2.png'
                    break;
                case 1:
                    this.TabImg0 = '/static/images/paper/0.png'
                    this.TabImg1 = '/static/images/paper/11.png'
                    this.TabImg2 = '/static/images/paper/2.png'
                    break;
                case 2:
                    this.TabImg0 = '/static/images/paper/0.png'
                    this.TabImg1 = '/static/images/paper/1.png'
                    this.TabImg2 = '/static/images/paper/22.png'
                    break;
            }
        },
        // 获取学生列表
        StudentAjax:function () {
            var SubData = {};
            var that = this
            SubData.paperAssignId = Request.paperAssignId;
            // SubData.paperAssignId = '02ed4e84f25e44ea880256090e26bb4d';
            SubData.type = Request.type;
            SubData.type = '101';
            $.ajax({
                type : "post",
                url : "/pad/teacher/paper/report/studentDetails",
                dataType : "json",
                data:SubData,
                success : function(data){
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.StudentData = data.retData.submitList
                    }
                }
            })
        },
        // 获取分析
        AnalyzeAjax:function () {
            var SubData = {};
            var that = this
            SubData.paperAssignId = Request.paperAssignId;
            // SubData.paperAssignId = '02ed4e84f25e44ea880256090e26bb4d';
            $.ajax({
                type : "post",
                url : "/pad/teacher/paper/report/comprehensiveAnalysis",
                dataType : "json",
                data:SubData,
                success : function(data){
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.AnalyzeData = data.retData
                    }
                }
            })
        },
        // 获取题目
        GetOrder:function () {
            var SubData = {};
            var that = this
            SubData.paperAssignId = Request.paperAssignId;
            // SubData.paperAssignId = '02ed4e84f25e44ea880256090e26bb4d';
            SubData.uuid = Request.uuid;
            // SubData.uuid = 'b7b1b4ab1006281621ab31fb8e72eddd';
            this.ThisUuid = SubData.uuid
            SubData.type = Request.type;
            // SubData.type = '101';
            this.ThisType = SubData.type
            $.ajax({
                type : "post",
                url : "/pad/teacher/paper/report/getQuestionsError",
                dataType : "json",
                data:SubData,
                success : function(data){
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.RefactorData(data.retData)
                    }
                }
            })
        },
        RefactorData:function (data) {
            $("#Title").html(data.paperName)
            var QuestionData=data.questionLines;
            var QuestionDataArr=[];//保存全部题目数据的集合
            for(var j=0;j<QuestionData.length;j++){
                var GroupData=QuestionData[j].questionGroup;//小题目集合
                var Obj = {}
                Obj.LineName = QuestionData[j].lineName
                Obj.paperAssignId = Request.paperAssignId;
                // Obj.paperAssignId = '02ed4e84f25e44ea880256090e26bb4d';
                Obj.uuid = Request.uuid;
                // Obj.uuid = 'b7b1b4ab1006281621ab31fb8e72eddd';
                Obj.type = Request.type;
                // Obj.type = '101';
                var GroupQue = []
                for(var i=0;i<GroupData.length;i++){
                    var GroupObj = {}
                    //正常题型
                    if(GroupData[i].groupCode==null){
                        var ThisQue = GroupData[i].questions[0]
                        GroupObj.correctNum = ThisQue.correctNum
                        GroupObj.questionId = ThisQue.questionId
                        GroupObj.percent = Number(ThisQue.errorRate.split('%')[0])
                        GroupQue.push(GroupObj);
                    }
                    //组合题
                    else {
                        for(var n=0;n<GroupData[i].questions.length;n++){
                            var InObj = {}
                            var ThisQue = GroupData[i].questions[n]
                            InObj.correctNum = ThisQue.correctNum
                            InObj.questionId = ThisQue.questionId
                            InObj.percent = Number(ThisQue.errorRate.split('%')[0])
                            GroupQue.push(InObj);
                        }
                    }
                }
                Obj.GroupQue = GroupQue
                QuestionDataArr.push(Obj)
            }
            this.CreatCanvasData(QuestionDataArr)
        },
        // 创建canvas
        CreatCanvasData:function (data) {
            var CanvasArr = []
            for(var j=0;j<data.length;j++) {
                var ThisGroup = data[j].GroupQue;
                var SingleCanvas = []
                var Obj = {}
                for (var i=0;i<ThisGroup.length;i++) {
                    var CanvasDom = document.createElement('canvas');
                    CanvasDom.width = 80;
                    CanvasDom.height = 80;
                    var Percent = parseInt(ThisGroup[i].percent)
                    var Context = CanvasDom.getContext('2d')  //获取画图环境，指明为2d
                    var CenterX = CanvasDom.width/2  //Canvas中心点x轴坐标
                    var CenterY = CanvasDom.height/2  //Canvas中心点y轴坐标
                    var Rad = Math.PI*2/100 //将360度分成100份，那么每一份就是rad度
                    //绘制白色外圈
                    Context.save();
                    Context.beginPath();
                    Context.lineWidth = 3; //设置线宽
                    Context.strokeStyle = "#E8E8E8";
                    Context.arc(CenterX, CenterY, CenterX-3 , 0, Math.PI*2, false);
                    Context.stroke();
                    Context.closePath();
                    Context.restore();
                    //绘制5像素宽的运动外圈
                    Context.save();
                    Context.strokeStyle = "#30C3A6"; //设置描边样式
                    Context.lineWidth = 4; //设置线宽
                    Context.lineCap = 'round';
                    Context.beginPath(); //路径开始
                    Context.arc(CenterX, CenterY, CenterX-3 , -Math.PI/2, -Math.PI/2 + Percent*Rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
                    Context.stroke(); //绘制
                    Context.closePath(); //路径结束
                    Context.restore();
                    //百分比文字绘制
                    Context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
                    Context.fillStyle = "#656565"; //设置描边样式
                    Context.font = "24px '黑体'"; //设置字体大小和字体
                    Context.textAlign='center';//文本水平对齐方式
                    Context.textBaseline='middle';//文本垂直方向，基线位置
                    Context.fillText(Percent+"%", CenterX, CenterY);//绘制字体，并且指定位置
                    Context.restore();
                    var InObj = {}
                    InObj.Num = ThisGroup[i].correctNum
                    InObj.questionId = ThisGroup[i].questionId
                    var BaseData = CanvasDom.toDataURL()
                    InObj.CanvasUrl = BaseData
                    SingleCanvas.push(InObj)
                }
                Obj.Canvas = SingleCanvas
                Obj.paperAssignId = data[j].paperAssignId
                Obj.uuid = data[j].uuid
                Obj.type = data[j].type
                Obj.LineName = data[j].LineName
                CanvasArr.push(Obj)
            }
            this.CanvasData = CanvasArr
        },
        // 时间转换
        ComTime:function (value) {
            var theTime = parseInt(value);// 秒
            if(theTime<0) {theTime = 0}
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            var Result;//最终时间
            if(value==null||value==''||value=='--'){
                Result='- -';
            }else {
                if(theTime > 60) {
                    theTime1 = parseInt(theTime/60);
                    theTime = parseInt(theTime%60);
                    if(theTime1 > 60) {
                        theTime2 = parseInt(theTime1/60);
                        theTime1 = parseInt(theTime1%60);
                    }
                }
                if(parseInt(theTime)<10){
                    var Sec = "0"+parseInt(theTime);
                }else {
                    var Sec =parseInt(theTime);
                }
                if(parseInt(theTime1)<10){
                    var Min = "0"+parseInt(theTime1);
                }else {
                    var Min =parseInt(theTime1);
                }
                if(parseInt(theTime2)<10){
                    var Hour = "0"+parseInt(theTime2);
                }else {
                    var Hour =parseInt(theTime2);
                }
                Result=Hour+':'+Min+':'+Sec;
            }
            return Result;
        },
        // 判断是否为空
        isEmptyObject:function(obj) {
            if (obj[0]) {
                return true
            } else if (obj === '') {
                return false
            } else {
                return false
            }
        }
    }
})

