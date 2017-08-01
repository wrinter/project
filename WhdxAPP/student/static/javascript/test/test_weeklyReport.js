/**
 * Created by lgr on 2017/5/8.
 */
$(document).ready(function(){
    var Week = {
        init : function(){
            this.weeklyReport();
        },
        weeklyReport : function(){//获取数据
            var _this = this;
            var parmas = {};
            parmas.id = Request.id;
            $.ajax({
                type : "post",
                url : "/api/student/homework/report/getUserWeekData",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        _this.Data(data);
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },//获取数据
        Data : function(data){//数据层
            var _this = this;
            var object = {};
            var objList = [];
            var every = [];
            var endDate = data.retData.endDate;
            var startDate = data.retData.startDate;
            var subjectWeekDatas = data.retData.subjectWeekDatas;
            for(var i = 0;i<subjectWeekDatas.length;i++){
                var subjectId = subjectWeekDatas[i].subjectId;
                var subjectName = subjectWeekDatas[i].subjectName;
                var accuracy = subjectWeekDatas[i].averageDailyAccuracy;
                var obj = {
                    subjectId : subjectId,
                    subjectName : subjectName,
                    accuracy : accuracy
                }
                objList.push(obj);
            }//学科
            object = {
                subject : objList
            };
            _this.ClickSubject(object,data);
        },//重构学科
        ClickSubject : function(data,subjectData){
            var _this = this;
            var r_ClickRain = $(".r_ClickRain");
            var r_Buy = $(".r_Buy");
            var r_AnalyList = $(".r_AnalyList");
            for(var i = 0;i<data.subject.length;i++){
                var Dtrue = data.subject[i];
                var accuracy = Dtrue.accuracy;
                var subjectId = Dtrue.subjectId;
                var subjectName = Dtrue.subjectName;
                var subjectIdfirst = data.subject[0].subjectId;
                var accuracyfirst = data.subject[0].accuracy;
                var Weekly_objName = $("<li class='Weekly_objName' accuracy='"+accuracy+"' subjectId='"+subjectId+"'><span>"+subjectName+"</span></li>");
                $('.Weekly_object').append(Weekly_objName);
                $('.Weekly_object').css({"width":2.5*(data.subject.length)+"rem"})
                Weekly_objName.click(function(){
                    var r_score = $(".r_score");
                    var subjectId = $(this).attr("subjectId");
                    var accuracy = $(this).attr("accuracy");
                    var $Shape = $("<img class='Shape' src='../../static/image/reportNew/Shape.png' />").appendTo($(this));
                    $(this).siblings(".Weekly_objName").find(".Shape").remove();
                    r_AnalyList.css("max-height","3.63rem");//知识点显示
                    r_ClickRain.unbind("click");//失去绑定
                    r_Buy.hide();//已购买三个字消失
                    _this.subjectData(subjectId,subjectData,accuracy);
                })//点击换学科
            }
            var Weekly_object = $(".Weekly_object");
            Weekly_object
            var $Shape = $("<img class='Shape' src='../../static/image/reportNew/Shape.png' />").appendTo($(".Weekly_objName").first());
            _this.subjectData(subjectIdfirst,subjectData,accuracyfirst);//默认第一个
        },//显示学科
        Chart : function (xData,yData){
            var myChart = echarts.init(document.getElementById("main"));
        // 指定图表的配置项和数据
        option = {
//			 title: {
//			        text: '正确率',
//			        left: 'center',
//
//			 },
//            tooltip: {
//                trigger: 'item',
//                formatter: '{a} <br/>{b} : {c}'
//            },
            legend: {
                left: 'left',
                data: []
            },
            xAxis: {
                name: '日期',
                type: 'category',
                splitLine: {show: false},
                data: xData,
                gridLineWidth: 0,
                axisTick : {
                    show : false
                },
                nameTextStyle : {
                    fontSize: 12
                },
                axisLabel: {
                    interval:0,
                    rotate:0
                }//文字倾斜
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: '正确率',
                min : '0',
                max : '100',
                interval : 20,//间隔20
                axisLabel : {//加%
                    formatter: '{value} %'
                },
                gridLineWidth: 0,
                axisTick : {//是否显示坐标轴刻度
                    show : false
                },
                axisLine : {
                    lineStyle : {
                        color : '#666'
                    }
                },
                nameTextStyle : {
                    fontSize: 12
                }
            },
            series: [
                {
                    name : '正确率',
                    type : 'line',
                    data : yData,
                    color : '#49b9df',
                    symbolSize : 10,
                    itemStyle : {
                        normal : {
                            width : 5,
                            color : "#49b9df" //图标颜色
                        }
                    },
                    lineStyle : {
                        normal : {
                            width : 5,  //连线粗细
                            color : "#49b9df"  //连线颜色
                        }
                    },
                },

            ],
        };
        myChart.setOption(option);
        },
        subjectData : function(subjectId,subjectData,accuracy){
            var _this = this;
            var r_score = $(".r_score");
            r_score.text(accuracy+"%");
            var r_ClickRain = $(".r_ClickRain");
            var r_Buy = $(".r_Buy");
            var subjectWeekDatas = subjectData.retData.subjectWeekDatas;
            //百分比
            var num = accuracy * 3.6;
            if(num>180){
                $(".r_pcircle").find('.right').css('transform', "rotate(180deg)");
                $(".r_pcircle").find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
            }else{
                $(".r_pcircle").find('.left').css('transform', "rotate(" + num + "deg)");
            }
            var Known = {}
            for(var i = 0 ; i<subjectWeekDatas.length;i++){
                var Dtrue = subjectWeekDatas[i];
                var subjectI = Dtrue.subjectId;
                if(subjectId == subjectI){
                    var status = Dtrue.status;
                    var knowledgeWeekDatas = Dtrue.knowledgeWeekDatas;
                    var everyDayAccuracys = Dtrue.everyDayAccuracys;
                    var obj = {
                        status : status,
                        knowledgeWeekDatas : knowledgeWeekDatas,
                        everyDayAccuracys : everyDayAccuracys
                    }
                    r_ClickRain.attr("status",status);
                    if(status == "-1"){
                        r_ClickRain.hide();
                    }else if(status == "0"){
                        _this.GoCover();//点击进入补偿训练
                    }else{
                        r_Buy.show();
                        _this.GoCover();//点击进入补偿训练
                    }
                }
            }
            Known = {
                Known : obj
            }
            _this.Known(Known);
            _this.EveryClick(Known)//每天
        },
        EveryClick : function(Known){
            var _this = this;
            var xAxis = [];
            var yAxis = [];
            for(var i = 0;i<Known.Known.everyDayAccuracys.length;i++){
                var Dtrue = Known.Known.everyDayAccuracys[i];
                var data = Dtrue.data;
                var accuracy = Dtrue.accuracy;
                xAxis.push(_this.Time(data));
                yAxis.push(accuracy);
            }
            xAxis.push("日期");
            yAxis.push(null);
            _this.Chart(xAxis,yAxis);
        },
        Time : function(date){
            var date = new Date(date);//如果date为10位不需要乘1000
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
            return M+D;
        },
        Known : function(Known){
            var  _this = this;
            var r_AnalyList = $(".r_AnalyList");
            var r_ShowList = $(".r_ShowList");
            var r_ClickRain = $('.r_ClickRain');
            var r_Buy = $('.r_Buy');
            r_AnalyList.html("");
            var length = Known.Known.knowledgeWeekDatas.length;
            if(length<=3){
                r_ShowList.hide();
                r_AnalyList.css({"min-height":"1.21rem","max-height":"3.63rem"});
            }else{
                r_ShowList.show();
                r_ShowList.text("显示剩余"+(length-3)+"个知识点")
                _this.clickKnown();
            }
            for(var i = 0;i<Known.Known.knowledgeWeekDatas.length;i++){
                var Dtrue = Known.Known.knowledgeWeekDatas[i];
                var errorRate = Dtrue.errorRate;
                var knowledgeName = Dtrue.tagName;
                var r_ListName = $("<li class='r_ListName'><span class='r_KnownName'>"+knowledgeName+"</span><span class='r_KnownNumber'>"+errorRate+"%</span></li>").appendTo(r_AnalyList);
            }
        },//知识点分析
        clickKnown : function (){
            var r_ShowList = $(".r_ShowList");
            var r_AnalyList = $(".r_AnalyList");
            r_ShowList.click(function(){
                r_AnalyList.css({"min-height":"3.63rem","max-height":"1000rem"});
                $(this).hide();
            })
        },//显示更多的数据
        GoCover : function (){
            $('.r_ClickRain').on('click',function(){
                var status=$(this).attr('status');
                var id = Request.id;
                var subjectId = $(".Shape").parent(".Weekly_objName").attr("subjectid");
                var type = "1";
                var parmas = {};
                parmas.id = Request.id;
                parmas.status = status;
                parmas.subjectId = subjectId;
                parmas.type = type;
                //console.log(status)
                javascript:bc.CreatCover(status,id,subjectId,type);
            });
        }//进入补偿训练
    }
    Week.init();
})
