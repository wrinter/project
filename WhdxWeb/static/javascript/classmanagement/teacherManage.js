/**
 * Created by Administrator on 2017/3/20.
 */
SystemRedMsg();
$(function() {
    GetHtml('../common/common.txt', '#header');//引入导航
    CheckBrower();
    var classId = store.get('nowClassId');//取LocalStorage传递的班级id
    var headTeacherId = store.get('headTeacherId');//取LocalStorage传递的班主任id
    var c_grade = store.get('c_grade');//取LocalStorage传递的班级名称用于面包屑导航
    var teacherId = store.get('teacherId');
    $('#c_Crum1').append('<li><a href="classInfo.html" class="fl ">' + c_grade + '</a><i class="spriteImg c_Crumgoico c_Crumgo"></i></li><li class="fc65">' + store.get("teacherName") + '</li>');
    $(".teacherName").html(store.get("c_grade"));//次导航的老师名字
   /***********************报告类**************************/
    function report(classId,teacherId){
        this.classId = classId;
        this.teacherId = teacherId;
    }
    report.prototype={
        init:function(){
            this.getReportList();
            this.getTestList();
        },
        getReportList:function(){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/report/work",
                data: {'classId':this.classId,'teacherId':this.teacherId},
                dataType: "json",
                success: function (data) {
                    showReport(data);
                }
            });

        },
        getNoSubmit:function(){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/report/unsubmit",
                data: {'classId':this.classId,'teacherId':this.teacherId},
                dataType: "json",
                success: function (data) {
                    showNoSubmit(data);
                }
            });

        },
        getTestList:function(){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/report/test",
                data: {'classId':this.classId,'teacherId':this.teacherId},
                dataType: "json",
                success: function (data) {
                    showTest(data);
                }
            });

        },
        getReportDetails:function(id){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/report/work/details",
                data: {'paperAssignId':id},
                dataType: "json",
                success: function (data) {
                    showReportDetails(data);
                }
            });
        },
        getTestDetails:function(id){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/report/test/details",
                data: {'paperAssignId':id},
                dataType: "json",
                success: function (data) {
                    showTestDetails(data);
                }
            });
        }

    }
    /******************************报告类初始化********************************/
    var selfReport = new report(classId,teacherId);
    selfReport.init();
    /******************************前台渲染********************************/
    function showReport(data){
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            var nowdata = data.retData;
            $html = '';
            if(nowdata.length>0){
                $("#c_HomeName").html(nowdata[0].aliasName);
                for(var k in nowdata){
                    $html+="<li class='fs18 HomeShowLi' id='"+nowdata[k].id+"'>"+nowdata[k].aliasName+"</li>";
                }
                $("#c_Homeshow").html($html);
                //刚进页面时，默认第一个
                selfReport.getReportDetails(nowdata[0].id);
                //下拉框
                $('#c_HomeText').on('click',function(){$('#c_Homeshow').slideToggle(200);});
                $("#c_Homeshow").on("click",".HomeShowLi",function(){
                    $("#c_HomeName").html($(this).html());
                    selfReport.getReportDetails($(this).attr("id"));
                })
                selfReport.getNoSubmit();

            }else{
                $html += '<div id="noData" class="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>';
                $('.c_HomeMain').html($html);
            }
        }
    }
    function showNoSubmit(data){
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            var $html = "";
            var nowData = data.retData;
            if(nowData.length>0){
                $html+="<p>累计未交名单</p>";
                $html+=" <ul id='c_NoHomeName'>";
                    for(var k in nowData){
                        $html+="<li>";
                        $html+="<span>"+nowData[k].userName+"</span>";
                        $html+="<span>（"+nowData[k].unSubmitNum+"）</span>";
                        $html+="</li>";
                    }
                $html+="</ul>";
            }else{
                $html += '<div id="noData" class="NoData"><img src="../../static/image/classmanagement/no.jpg" class="NoImg" alt=""></div>';
            }
            $('.c_NoHomeName').html($html);
        }
    }
    function showTest(data) {
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            var $html = "";
            var nowData = data.retData;
            if (nowData.length > 0) {
                var li="";
                $("#c_HomeSelectName").html(data.retData[0].aliasName);
                for(var k in data.retData){
                    li+="<li class='fs18 HomeSelectShowLi' id='"+data.retData[k].id+"'>"+data.retData[k].aliasName+"</li>";
                }
                $("#c_HomeSelectshow").html(li);
                //刚进页面时，默认第一个
                selfReport.getTestDetails(data.retData[0].id);
                //下拉框
                $('#c_HomeSelect').on('click',function(){$('#c_HomeSelectshow').slideToggle(200);});
                $("#c_HomeSelectshow").on("click",".HomeSelectShowLi",function(){
                    $("#c_HomeSelectName").html($(this).html());
                    selfReport.getTestDetails($(this).attr("id"));
                });

            } else {
                $html += '<div class="c_Title"><h1 class="fl fs24 fc33">测试报告</h1></div>';
                $html += '<div id="noData" class="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>';
                $('.c_HomeReport').html($html);
            }
        }
    }
    function showReportDetails(data){
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            var nowData = data.retData;
            var submittedSize = nowData.submittedSize,unSubmittedSize = nowData.unSubmitList.length;
            $unContent = "";
            if(unSubmittedSize==0){
                $unContent+="<span style='font-size:18px;'>全部提交</span>";
                $('.c_allSubmit').html($unContent);
                $(".c_noSubmitNames").hide();
                $('.c_allSubmit').show();
            }else{
                if(document.body.offsetWidth>1600){
                    $unContent+="<span style='font-size:18px;'>未交</span>";
                    $unContent+="<span style='color:#ca0e0d;font-size:18px;'>"+data.retData.unSubmitList.length+"人：</span>";
                }else if(document.body.offsetWidth<1600 &document.body.offsetWidth>1366){
                    $unContent+="<span style='font-size:16px;'>未交</span>";
                    li+="<span style='color:#ca0e0d;font-size:16px;'>"+data.retData.unSubmitList.length+"人：</span>";
                }else if(document.body.offsetWidth<1366){
                    $unContent+="<span style='font-size:14px;'>未交</span>";
                    $unContent+="<span style='color:#ca0e0d;font-size:14px;'>"+data.retData.unSubmitList.length+"人：</span>";
                }
                for(var k in data.retData.unSubmitList){
                    $unContent+="<span class='c_noNames'>"+data.retData.unSubmitList[k].userName+"</span>";

                } if(data.retData.unSubmitList.length>3){
                    $unContent+="<i class='fr downShow spriteImg s_Dico'></i>";
                }
                var i=0;
                $(".c_noSubmitNames").on("click",".downShow",function(){
                    i++;
                    if(i%2==1){
                        $(".c_noSubmitNames").css({"height":"auto"});
                        $(this).css({"transform": "rotate(180deg)"});
                    }else{
                        $(".c_noSubmitNames").css({"height":"30px"});
                        $(this).css({"transform": "rotate(0deg)"});
                    }

                });
                $('.c_noSubmitNames').html($unContent);
                $(".c_noSubmitNames").show();
                $('.c_allSubmit').hide();
            }

            var pieData = [];
            pieData.push({value:unSubmittedSize,name:"未交"},{value:submittedSize, name:'已交'});
            showPie(pieData);
        }
    }
    function showTestDetails(data){
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            var nowData = data.retData;
            var $html='';
            if(nowData.length>0){
                var avgScore = 0;
                $html += '<tr><th>序号</th><th>姓名</th><th>成绩</th><th>用时</th></tr>';
                for(var i=0;i<nowData.length;i++){
                    var j = i+1;
                    $html += '<tr><td>' + j + '</td>'
                          + '<td>' + nowData[i].name + '</td>'
                          + '<td>' + nowData[i].score + '</td>';
                    var tTime = ToTime(nowData[i].totalTime);
                    if(nowData[i].shouldTime<nowData[i].totalTime){
                        $html += '<td class="changeColor">' + tTime + '</td>';
                    }else{
                        $html += '<td>' + tTime + '</td>';
                    }
                    $html += '</tr>';
                    avgScore += nowData[i].score;
                }
                avgScore = Math.round(avgScore/nowData.length);
                var _li = '';
                function numTwo(shi,ge) {//平均分为两位数时
                    _li+="<i class='fl num _"+shi+"'></i>";
                    _li+="<i class='fl num _"+ge+"'></i>";
                }
                function numThree(bai,shi,ge){//平均分为三位数时
                    _li+="<i class='fl num _"+bai+"'></i>";
                    _li+="<i class='fl num _"+shi+"'></i>";
                    _li+="<i class='fl num _"+ge+"'></i>";
                }
                if(avgScore<100 & avgScore>=0){
                    numTwo(Math.floor(avgScore/10),avgScore%10);
                }
                if(avgScore>=100){
                    numThree(Math.floor(avgScore/100),Math.floor(avgScore%100/10),avgScore%10);
                }
                $(".score").html(_li);
                $('.t_table').html($html);
                $('.c_testCon').show();
                $('.c_noData').hide();
            }else{
                $('.c_testCon').hide();
                $html += '<div id="noData" class="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>';
                $('.c_noData').html($html);
                $('.c_noData').show();
            }
        }

    }
    function showPie(data){
        var myChart = echarts.init(document.getElementById('c_echart'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'bottom',
                data:['已交','未交']
            },
            color:[
                '#FC5555', '#5FCFF9'
            ],
            series: [
                {
                    name:'作业提交情况',
                    type:'pie',
                    radius: ['50%', '80%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '24',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data
                }
            ]
        };
        myChart.setOption(option);
    }
    //转换秒数
    function ToTime(value) {
        var theTime = parseInt(value);// 秒
        var hour = 0;//时
        var minute = 0;// 分
        var second = 0;//秒
        var result;
        if(value==null||value==''){
            result='- -';
            return result;
        }else {
            if(parseInt(theTime) > 60) {
                minute = parseInt(theTime/60);
                second = parseInt(theTime%60);
            }else{
                hour = 0;
                minute = 0;
                second = theTime;
            }
            if(parseInt(minute) > 60) {
                hour = parseInt(minute/60);
                minute = parseInt(minute%60);
            }else{
                hour = 0;
            }
            hour = showTime(hour);
            minute = showTime(minute);
            second = showTime(second);
            result = hour + ':' + minute + ':' + second;
            return result;
        }

    }
    function showTime(value){
        var showStr = "";
        if(parseInt(value)<10){
            showStr = "0" + value;
        }else{
            showStr = value;
        }
        return showStr;
    }

});