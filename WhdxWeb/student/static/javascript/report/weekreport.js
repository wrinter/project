/**
 * Created by zxl on 2017/4/18.
 */
function Report(id){
    this.id=id;
    this.subjects={};
    this.compensatePrice=0;
}
$(function() {
    GetHtml("../../model/common/Head.txt", "#Com_Head");//引入导航
    CheckBrower();
    Report.prototype = {
        getWeekData: function () {
            $.ajax({
                type: "post",
                url: "/web/student/homework/report/getUserWeekData",
                data: {'id':this.id},
                dataType: "json",
                success: function (data) {
                    showData(data);
                }
            });
        },
        getCompensatePrice: function(){
        $.ajax({
            type : "post",
            url : "/student/compensation/compensation/getPrice",
            dataType : "json",
            success : function(data) {
                if(data.retCode=='0000'){
                    report.compensatePrice = data.retData;
                }
            }
        });
    }
    };

    var report=new Report(sessionStorage.getItem("weekId"));
    report.getWeekData();
    report.getCompensatePrice();
    function showData(data) {
        if (data.retCode == "0000") {
            var subjectWeekDatas = data.retData.subjectWeekDatas;
            var r_subject = $('.r_subject'),r_wTitle=$('.r_wTitle'),$subject="";
            var tStr = '一周大数据 : '+formatDate(data.retData.startDate)+"——"+formatDate(data.retData.endDate)+"作业周报";
            r_wTitle.html(tStr);
            if (null != subjectWeekDatas && subjectWeekDatas.length > 0) {
                for (var i = 0; i < subjectWeekDatas.length; i++) {
                    var subjectId = subjectWeekDatas[i].subjectId;
                    var subjectName = subjectWeekDatas[i].subjectName;
                    var everyDayAccuracys = subjectWeekDatas[i].everyDayAccuracys;
                    var knowledgeWeekDatas = subjectWeekDatas[i].knowledgeWeekDatas;
                    var xData = [], yData = [], knowledge = [];
                    for (var j = 0; j < everyDayAccuracys.length; j++) {
                        var day = everyDayAccuracys[j].data;
                        xData.push(timetrans(day));
                        yData.push(everyDayAccuracys[j].accuracy);
                    }
                    for (var j = 0; j < knowledgeWeekDatas.length; j++) {
                        knowledge.push({
                            'knowledgeName': knowledgeWeekDatas[j].tagName,
                            'errorRate': knowledgeWeekDatas[j].errorRate
                        });
                    }
                    report.subjects[subjectId] = {
                        'subjectName': subjectName,
                        'xData': xData,
                        'yData': yData,
                        'knowledge': knowledge,
                        'avgAccuracy': subjectWeekDatas[i].averageDailyAccuracy,
                        'status': subjectWeekDatas[i].status
                    };
                    $subject += "<li class='r_noslectedTab' subjectId='"+subjectId+"'>"+subjectName+"</li>";
                }
                r_subject.html($subject);
                $('.r_subject> :first-child').addClass('r_selectedTab').removeClass('r_noslectedTab');
                var pad = ($('.r_Main').width()-subjectWeekDatas.length*60)/2;
                r_subject.css('padding-left',pad);
                r_subject.css('padding-right',pad);
                showSubject(subjectWeekDatas[0].subjectId);
                $('.r_subject li').on('click',function(){
                    var subjectId = $(this).attr('subjectId');
                    showSubject(subjectId);
                    $(this).addClass('r_selectedTab').removeClass('r_noslectedTab');
                    $(this).siblings().addClass('r_noslectedTab').removeClass('r_selectedTab');
                });
            }
        }
    }
    function timetrans(date){
        var date = new Date(date);//如果date为10位不需要乘1000
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        return M+D;
    }
    function showCharts(xData,yData){
        var myChart = echarts.init(document.getElementById("r_echarts"));
        // 指定图表的配置项和数据
        option = {
			    title: {
			        text: '作业正确率趋势图',
			        left: 'center',
                    bottom:'-1%',
                    textStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontSize: 14,
                        fontFamily:'regular'
                    }
			    },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}%'
            },
            legend: {
                left: 'left',
                data: []
            },
            xAxis: {
                name: '日期',
                nameLocation:'end',
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
                nameGap:5
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: '15%',
                top:'10%',
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
                    fontSize: 12,
                }

            },
            series: [
                {
                    name : '正确率',
                    type : 'line',
                    data : yData,
                    color : '#49b9df',
                    itemStyle : {
                        normal : {
                            width : 5,
                            color : "#49b9df" //图标颜色
                        }
                    },
                    symbolSize:10,
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
    }

    function showSubject(subjectId){
        var subject = report.subjects[subjectId];
        $('.r_score').html(subject.avgAccuracy);
        showCircle('.r_pcircle',subject.avgAccuracy/100);
        showCharts(subject.xData,subject.yData);
        var $html="<ul class='r_khead clearfix'><li>知识点名称</li><li>错误率</li></ul>";
        for(var i=0;i<subject.knowledge.length;i++) {
            $html += "<ul class='r_kbody clearfix'><li>"
                + subject.knowledge[i].knowledgeName + "</li><li>"
                + subject.knowledge[i].errorRate + '%' + "</li></ul>";
        }
        $('#r_table').html($html);
        if(subject.status=="-1"){
            $('.r_train').hide();
        }else{
            $('.r_compensate').attr('status',subject.status);
            if(subject.status=="0"){
                $('.r_need').html('需要花费');
                var money = report.compensatePrice + '金币';
                $('.r_money').html(money);
                $('.r_money').show();
            }else{
                $('.r_need').html('已购买');
                $('.r_money').hide();
            }
        }
        $(".r_compensate").unbind('click').on("click",function(){
            var status = $(this).attr("status");
            var parmasC = {};
            parmasC.id = sessionStorage.getItem('weekId');
            parmasC.subjectId = $('.r_selectedTab').attr('subjectId');
            parmasC.type = "1";
            sessionStorage.setItem("parmasC",JSON.stringify(parmasC));
            if(status == "3" || status == "2"){
                window.open("trainingDetails.html");
                return false;
            }
            if(status == "1"){
                window.open("training.html");
                return false;
            }
            if(status == "0"){
                $.ajax({
                    type : "post",
                    url : "/web/user/finance",
                    dataType : "json",
                    success : function(data){
                        console.log(data);
                        if(data.retCode == "0000"){
                            var usable = data.retData.usable;
                            if(!usable){
                                $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                                return false;
                            }
                            if(usable >= 5){
                                window.open("training.html");
                            }else{
                                $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                            }
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                });
            }
        });
    }
    $(window).resize(function(){
        var pad = ($('.r_Main').width()-$('.r_subject').children().length*60)/2;
        $('.r_subject').css('padding-left',pad);
        $('.r_subject').css('padding-right',pad);
    });
});


