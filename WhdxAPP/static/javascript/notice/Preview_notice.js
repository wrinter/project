/**
 * Created by lichao on 2016/12/15.
 */
$(document).ready(function(){
    //Anmite("#indicatorContainer1",100);
    //Anmite("#indicatorContainer2",80);
    //Anmite("#indicatorContainer3",60);
    //Anmite("#indicatorContainer4",40);
    //Anmite("#indicatorContainer5",20);
    //Anmite("#indicatorContainer6",10);
    function Anmite(id,val){
        var radialObj = $(id).radialIndicator({
            barColor: {
                0: '#e6e6e6',
                10: '#72c7e6',
                20: '#f7e48b',
                40: '#f57c47',
                70:'#ef6767',
                100:'#ef6767'
            },
            radius:100,
            barWidth:20,
            percentage: true
        }).data('radialIndicator');
        //Using Instance
        radialObj.animate(val);
    }
    function Preview(){};
    Preview.prototype = {
        init : function(){
            this.Ajax();
        },
        Ajax : function(){
            var _this = this;
            var Preview_main = $(".Preview_main");
            Preview_main.css("visibility","hidden");
            var paperAssignId = JSON.parse(sessionStorage.getItem("paperAssignId"));
            var type = JSON.parse(sessionStorage.getItem("type"));
            var parmas = {};
            parmas.paperAssignId = paperAssignId;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/api/teacher/paper/report/videoReport",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var errorRate = data.retData.errorRate;
                        var ids = data.retData.ids;
                        var Preview_basic = $(".Preview_basic");
                        var Preview_test_con = $(".Preview_test_con");
                        //var Dtrue = data.retData.basicKnowledge;
                        //var testTitle = Dtrue.testTitle;
                        //var testId = Dtrue.testId;
                        //Preview_basic.text(testTitle)//导学案
                        //for(var i = 0 ; i < Dtrue.questionList.length;i++){
                        //    Num++;
                        //    var qDtrue = Dtrue.questionList[i];
                        //    var id = qDtrue.id;
                        //    var optionA = qDtrue.optionA;
                        //    var optionB = qDtrue.optionB;
                        //    var optionC = qDtrue.optionC;
                        //    var optionD = qDtrue.optionD;
                        //    var answer = qDtrue.answer;
                        //    var groupCode = qDtrue.groupCode;//组合题会用到
                        //    var questionData = qDtrue.iquestionDatad;//组合题会用到
                        //    var CCtrue = data.retData.correctProportion;
                        //    var deliverTotal = data.retData.deliverTotal;
                        //    var notDoneNameList = data.retData.notDoneNameList.length;
                        //    if( notDoneNameList == 0 ){
                        //        //var P_tnumup = CCtrue[id].split("/");
                        //        $(".Preview_test_allsend").show();
                        //        $(".Preview_test_nosend").hide();
                        //        //var P_testnum = $("<div class='P_testnum'><span class='P_tnumup'>"+P_tnumup[0]+"</span>/"+P_tnumup[1]+"</div>")
                        //    }
                        //    if( deliverTotal != 0 || CCtrue == {}){
                        //        if(CCtrue[id] == "undefined" || CCtrue[id] == undefined){
                        //            var $Preview_test_list = $("<div class='Preview_test_list'>");
                        //            var P_test = $("<div class='P_test'>");
                        //        }else{
                        //            var P_tnumup = CCtrue[id].split("/");
                        //            var $Preview_test_list = $("<div class='Preview_test_list'>");
                        //            var P_test = $("<div class='P_test'>");
                        //            var P_testnum = $("<div class='P_testnum'><span class='P_tnumup'>"+P_tnumup[0]+"</span>/"+P_tnumup[1]+"</div>")
                        //        }
                        //    }else{
                        //        var $Preview_test_list = $("<div class='Preview_test_list'>");
                        //        var P_test = $("<div class='P_test'>");
                        //    }
                        //    var $optionul = $("<div class='optionul'></div>")
                        //    if(answer == "A"){
                        //        var $optionchooseA = $("<div class='optionchoose p1 chooseselecd' option='A'>"+optionA+"</div>").appendTo($optionul);
                        //    }else{
                        //        var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($optionul);
                        //    }
                        //    if(answer == "B"){
                        //        var $optionchooseB = $("<div class='optionchoose p1 chooseselecd' option='B'>"+optionB+"</div>").appendTo($optionul);
                        //    }else{
                        //        var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($optionul);
                        //    }
                        //    if(answer == "C"){
                        //        var $optionchooseC = $("<div class='optionchoose p1 chooseselecd' option='C'>"+optionC+"</div>").appendTo($optionul);
                        //    }else{
                        //        var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($optionul);
                        //    }
                        //    if(answer == "D"){
                        //        var $optionchooseD = $("<div class='optionchoose p1 chooseselecd' option='D'>"+optionD+"</div>").appendTo($optionul);
                        //    }else{
                        //        var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($optionul);
                        //    }
                        //    var $combination = $("<div class='s_xpcombination'></div>");//组合题区
                        //    var $optionslove = $("<div class='s_xpslove  p1' style='display: block'></div>");//答案区域
                        //    //组合题
                        //    if(!groupCode){
                        //    }else{
                        //        $questionData = $("<div class='s_xpquestionData p1'>"+Num+"、"+questionData+"</div>").appendTo($combination);
                        //    }
                        //    P_test.append($optionul);
                        //    P_test.append($combination);
                        //    P_test.append($optionslove);
                        //    $Preview_test_list.append(P_test);
                        //    $Preview_test_list.append(P_testnum);
                        //    //$Preview_test_list.append(P_testnum);
                        ////    题干之类的
                        //    for(var j = 0 ; j< qDtrue.list.length;j++){
                        //        var lDtrue = qDtrue.list[j];
                        //        var content = lDtrue.content.replace("【题干】",Num+"、").replace("【</span><span>题干</span><span>】",Num+"、").replace("【<span>题干</span>】",Num+"、");
                        //        var questionType = lDtrue.questionType;
                        //        if(questionType == "01"){
                        //            var $questionType = $("<div class='s_xpquestionType p1' questionType='01'>"+content+"</div>").insertBefore($optionchooseA);
                        //        }
                        //    }
                        ////    组合题
                        //    //判断是否组合体
                        //    if(!groupCode){
                        //
                        //    }else{
                        //        for(var m=0;m<qDtrue.prepares.length;m++){
                        //            var pDtrue = qDtrue.prepares[m];
                        //            var optionA = pDtrue.optionA;
                        //            var optionB = pDtrue.optionB;
                        //            var optionC = pDtrue.optionC;
                        //            var optionD = pDtrue.optionD;
                        //            var userAnswer = pDtrue.userAnswer;
                        //            var answer = pDtrue.answer;
                        //            var id = pDtrue.id;
                        //            var myuserScore = pDtrue.userScore;
                        //            //question里面的
                        //            var $optionul = $("<div class='p1 s_xpoption' userAnswer='"+userAnswer+"' id='"+id+"' data_answer='"+answer+"'myuserScore='"+myuserScore+"' ></div>");
                        //            var $optionAa = $("<div class='p1 optionchoose optionA"+m+"' option='A' >"+optionA+"</div>");
                        //            var $optionBb = $("<div class='p1 optionchoose optionB' option='B' >"+optionB+"</div>");
                        //            var $optionCc = $("<div class='p1 optionchoose optionC' option='C' >"+optionC+"</div>");
                        //            var $optionDd = $("<div class='p1 optionchoose optionD"+m+"' option='D' >"+optionD+"</div>");
                        //            var $solvecont = $("<div class='p1 s_xpslove' style='display: block;color:#ca0d0d'></div>");
                        //            $optionul.append($optionAa);
                        //            $optionul.append($optionBb);
                        //            $optionul.append($optionCc);
                        //            $optionul.append($optionDd);
                        //            $combination.append($optionul);
                        //            $combination.append($solvecont);
                        //            //list 2
                        //            for(var n=0;n<pDtrue.list.length;n++){
                        //                var content = pDtrue.list[n].content.replace("【题干】","").replace("【</span><span>题干</span><span>】","").replace("【<span>题干</span>】","");
                        //                var questionType = pDtrue.list[n].questionType;
                        //                if( questionType == "01"){
                        //                    var $cont = $("<div class='s_xpquestionType p1'questionType='01' n='"+n+"'>"+content+"</div>").insertBefore($(".optionA"+m+""));
                        //                }
                        //            }
                        //        }
                        //    }
                        //    Preview_test_con.append($Preview_test_list)
                        //}
                        //预习测试
                        Preview_main.css("visibility","visible");
                        var Preview_conul = $(".Preview_conul");
                        var errorRate = data.retData.errorRate;
                        for(var k = 0 ; k < data.retData.ids.length ; k++){
                            var etrue = data.retData.ids[k];
                            var dtrueidlength = data.retData.ids.length;//试题长度
                            var prent = errorRate[etrue];
                            var lastnum = parseInt(prent);//百分比
                            var $sideContent = $("<div class='sideContent' Dtrueid='"+etrue+"' lastnum = '"+lastnum+"' k='"+k+"'>");
                            var $span = $("<div class='prg-cont rad-prg' id='indicatorContainer"+k+"' ></div><span class='prg_titlenum'>"+(k+1)+"</span>").appendTo($sideContent)
                            Preview_conul.append($sideContent);
                            Anmite('#indicatorContainer'+k,lastnum);
                        }
                        var sideContentwidth = parseInt(2.3*($(".sideContent").length));
                        Preview_conul.css({"width":sideContentwidth+"rem"});
                        sessionStorage.setItem("ids",JSON.stringify(ids));
                        sessionStorage.setItem("errorRate",JSON.stringify(errorRate));
                        //题目详情统计
                        $(".sideContent").click(function(){
                            var dtrueid = $(this).attr("Dtrueid");
                            var k = $(this).attr("k");
                            sessionStorage.setItem("dtrueidlength",JSON.stringify(dtrueidlength));
                            sessionStorage.setItem("k",JSON.stringify(k));
                            window.location.href = "Preview_noticedetices.html?id="+paperAssignId+"&type="+type+"&dtrueid="+dtrueid;
                        });
                    //    未完成名单
                        var Preview_nosedwordname = $(".Preview_nosedwordname");
                        var notDoneNameList = data.retData.notDoneNameList;
                        var canvas_areanoall = $(".canvas_areanoall");
                        var canvas_areaallword = $(".canvas_areaallword");
                        if(notDoneNameList.length != 0){
                            var arrangementTotal = data.retData.arrangementTotal;
                            var deliverTotal = data.retData.deliverTotal;
                            var nototal = parseInt(arrangementTotal - deliverTotal);
                            canvas_areanoall.text(deliverTotal+"人");
                            canvas_areaallword.text(arrangementTotal+"人")
                            var num = parseInt(nototal/arrangementTotal*360);
                            $(".Preview_nosedword_num").text(nototal);
                            _this.cavas(num);
                            for(var c = 0 ; c < notDoneNameList.length; c++){
                               var $span = $("<span>"+notDoneNameList[c]+" </span>").appendTo(Preview_nosedwordname)
                            }
                        }else{
                            $(".Preview_test_allsend").show();
                            $(".Preview_test_nosend").hide();
                        }
                    }else{
                        javascript:bc.emptyPage();//空白页
                    }
                    intMathJax();//公式
                },
                error : function(e){
                    console.log(e)
                }
            })
        },

        cavas : function(num){
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext('2d');
            var deg = Math.PI / 180;
            context.fillStyle = "#65b113";
            sector(context, 400, 400, 400, 0 * deg, num* deg);
            function sector(ctx, x, y, radius, sDeg, eDeg) {
                // 初始保存
                ctx.save();
                // 位移到目标点
                ctx.translate(x, y);
                ctx.beginPath();
                // 画出圆弧
                ctx.arc(0, 0, radius, sDeg, eDeg);
                // 再次保存以备旋转
                ctx.save();
                // 旋转至起始角度
                ctx.rotate(eDeg);
                // 移动到终点，准备连接终点与圆心
                ctx.moveTo(radius, 0);
                // 连接到圆心
                ctx.lineTo(0, 0);
                // 还原
                ctx.restore();
                // 旋转至起点角度 
                ctx.rotate(sDeg);
                // 从圆心连接到起点
                ctx.lineTo(radius, 0);
                ctx.closePath();
                // 还原到最初保存的状态
                ctx.restore();
                ctx.fill();
            }
        }
    }
    var $Preview = new Preview();
    $Preview.init();
    $Preview.cavas();
});
