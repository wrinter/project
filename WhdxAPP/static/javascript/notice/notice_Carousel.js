/**
 * Created by lgr on 2016/12/8.
 */
$(document).ready(function(){
	function Test() {
	}
	Test.prototype = {
        init : function(){
            var paperAssignId = Request.id;//获取栏目id
            var type = Request.type;//获取课时id
            var uuid = Request.uuid;//获取课时uuid
            var i = Request.Num;//获取课时Num
            var errorRate = JSON.parse(sessionStorage.getItem("errorRate"));//题目
            var tilei = parseInt(i);
            var dtrueid = Request.dtrueid;//获取当前题的dtrueid
            this.getTest(paperAssignId,type,uuid,dtrueid);
            this.getCss();
        },
        getCss : function(){//公共样式
            $.ajax({
                type:"post",
                url:"/api/common/commonStyle",
                dataType:"json",
                success:function(data){
                    if(data.retCode == "0000"){
                        var retData = data.retData;
                        $("head").append(retData);
                    }
                },
                error:function(e){
                    console.log(e)
                }
            })
        },//公共样式
        clickTest : function(data,newcloneD){
            var _this = this;
            var i = Request.Num;//获取课时Num//获取当前题号；
            var uuid = Request.uuid;//获取课时uuid//uuid
            var paperAssignId = Request.id;//获取栏目id
            var type = Request.type;//获取课时id
            var tilei = parseInt(i);
            var n_rutopscroll = $(".Echo_List");
            var Num = 0;
            for(var i = 0 ; i < data.retData.paper.questionLines.length ; i++){
                var Dtrue = data.retData.paper.questionLines[i];
                for(var j = 0 ; j < Dtrue.questionGroup.length ; j++){
                    var qDtrue = Dtrue.questionGroup[j];
                    var groupCode = qDtrue.groupCode;
                    var isSplite = qDtrue.isSplite;
                    if(groupCode && isSplite == "0"){//不可拆分
                        Num++;
                        var questionId = qDtrue.questionId;
                        var $clicktest = $("<li class='idslength_li EchoNav' Num='"+Num+"'  Dtrueid ='"+questionId+"'>"+Num+"</li>").appendTo(n_rutopscroll);
                    }else if(groupCode && isSplite == "1"){//可拆分
                        for(var k = 0 ; k < qDtrue.questions.length;k++){
                            Num++;
                            var uDtrue = qDtrue.questions[k];
                            var questionId = uDtrue.questionId;
                            var $clicktest = $("<li class='idslength_li EchoNav' Num='"+Num+"'  Dtrueid ='"+questionId+"'>"+Num+"</li>").appendTo(n_rutopscroll);
                        }
                    }else{//普通题
                        for(var k = 0 ; k < qDtrue.questions.length;k++){
                            Num++;
                            var uDtrue = qDtrue.questions[k];
                            var questionId = uDtrue.questionId;
                            //var lastnum = parseInt(lastnum);
                            var $clicktest = $("<li class='idslength_li EchoNav' Num='"+Num+"'  Dtrueid ='"+questionId+"'>"+Num+"</li>").appendTo(n_rutopscroll);
                        }
                    }
                }
            }
            var lastlist = $("<li class='EchoLine'><img src='../../static/image/notice/d.png' alt=''></li>").appendTo(n_rutopscroll);
            var IsDefultIndex = parseInt(tilei-1);
            DefultCss();
            function DefultCss() {
                $('#Echo_List').css('width',($('.EchoNav').size())*2+'rem');//用来动态获取Ul宽度
            }
            GoSwiper(IsDefultIndex)//默认从第三页开始。注意swiper下标从0开始
            function GoSwiper(IsDefultIndex) {
                var mySwiper = new Swiper('.swiper-container',{
                    initialSlide:IsDefultIndex,//用来定位题号，Swiper定义其实页面
                    preloadImages:false,
                    //Swiper滑动结束执行回调函数
                    onSlideChangeStart: function(swiper){
                        NavCenter(swiper.activeIndex)
                    }
                });
                $('.EchoNav').on('click',function () {
                    var Index=$(this).index();
                    NavCenter(Index);
                    mySwiper.slideTo(Index, 200, false);//Swiper翻页
                    $(".EchoNav").eq(Index).css({"background":"#65b113","color":"#fff"});
                    $(".EchoNav").eq(Index).siblings(".EchoNav").css({"background":"#fff","color":"#333"});
                })
            }
            //用来调节Ul滑动
            function NavCenter(NavIndex) {
                var NavPosition= parseInt($('.EchoNav').eq(NavIndex).position().left);//用来记录当前序号的位置，保持序号和箭头的位置一致
                var DownLeft=$('.EchoLine').animate({"left":NavPosition},300);//当滑动的时候，改变箭头位置
                var WinHalf=$(window).width()/2;//屏幕的一半。用来控制序号滑动居中
                var ScroolLeft;//用来存放外层的ScroolLeft；
                //根据当前序号的位置来判断是否超过半屏，如果超过半屏滑动题号需要居中
                if (NavPosition <=WinHalf ) {
                    ScroolLeft = 0;
                }else {
                    ScroolLeft = NavPosition-WinHalf;//如果当前的序号超过一半的时候说明当前题号的offsetleft>屏幕的一半
                }
                $('.Echo_Out').animate({'scrollLeft':ScroolLeft+"px"},300);//这个控制外层的scrollLeft用来调节序号位置
                $(".EchoNav").eq(NavIndex).css({"background":"#65b113","color":"#fff"});
                $(".EchoNav").eq(NavIndex).siblings(".EchoNav").css({"background":"","color":"#333"});
            }
            $(".EchoNav").eq(IsDefultIndex).css({"background":"#65b113","color":"#fff"});
        },
        getTest : function(paperAssignId,type,uuid,dtrueid){
            var _this = this;
            var d = $("#d");//
            var newcloneD = d.clone(true);
            d.remove();
            var n_rutopscroll = $(".n_rutopscroll");
            var swiper = $(".swiper-wrapper");
            swiper.html("");
            var parmas = {};
            parmas.paperAssignId = paperAssignId;
            parmas.type = type;
            parmas.uuid = uuid;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/api/teacher/paper/report/titleDetailsStatistics",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data);
                    var p = n_rutopscroll.html();
                    var swiper = $(".swiper-wrapper");
                    //var swiper = $(".n_testpaper");
                    if(data.retCode == "0000"){
                        var answerStatistics = data.retData.answerStatistics;
                        var need = data.retData.need;
                        var doError = data.retData.doError;
                        for(var i = 0; i< data.retData.paper.questionLines.length;i++) {
                            for (var j = 0; j < data.retData.paper.questionLines[i].questionGroup.length; j++) {
                                var qDtrue = data.retData.paper.questionLines[i].questionGroup[j];
                                var groupCode = qDtrue.groupCode;
                                var isSplite = qDtrue.isSplite;
                                if (groupCode && isSplite == "0") {//不可拆分
                                    var questionId = qDtrue.questionId;
                                        Num++;
                                        //var Num = JSON.parse(sessionStorage.getItem("Num"));
                                        var content = qDtrue.content;
                                        if(content){
                                            var content = qDtrue.content.replace("【材料】",Num+"、").replace("【</span><span>材料</span><span>】",Num+"、").replace("【题干】",Num+"、");
                                        }
                                        var $swiper_slide = $("<div class='swiper-slide' Num = '"+Num+"'>").appendTo(swiper);
                                        var $n_mary = $("<div class='n_mary'></div>").appendTo($swiper_slide);
                                        var $n_rucon = $("<div class='n_rucon'></div>").appendTo($n_mary);
                                        var $answer = $("<div class='n_answer'></div>").appendTo($n_mary);
                                        if(content){
                                            var $content = $("<div class='n_content'>"+content+"</div>").appendTo($n_rucon);
                                        }
                                        for(var k = 0 ; k < qDtrue.questions.length;k++){
                                            var Dtrue = qDtrue.questions[k];
                                            for(var m in Dtrue){
                                                if(!Dtrue[m]){
                                                    Dtrue[m] = ""
                                                }
                                            }
                                            var questionId = Dtrue.questionId;
                                            var lnOrder = Dtrue.lnOrder;
                                            var questionTitle = Dtrue.questionTitle.replace("【题干】","").replace("【</span><span>题干</span><span>】","").replace("【<span>题干</span>】","");
                                            var optionA = Dtrue.optionA;
                                            var optionB = Dtrue.optionB;
                                            var optionC = Dtrue.optionC;
                                            var optionD = Dtrue.optionD;
                                            var groupCode = Dtrue.groupCode;
                                            var answer = Dtrue.answer;
                                            var content = Dtrue.content;
                                            var questionTypeId = Dtrue.questionTypeId;
                                            var selectableType = Dtrue.selectableType;
                                            var $option = $("<div class='s_xpoption p1' questionId='"+questionId+"'  data_answer='"+answer+"' myscore='0' style='position: relative'></div>");
                                            var $questionTitle = $("<div class='questionTitle'>"+questionTitle+"</div>").appendTo($option);
                                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($option);
                                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($option);
                                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($option);
                                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($option);
                                            var $combination = $("<div class='s_xpcombination'></div>");
                                            $n_rucon.append($option);
                                        }
                                        //答案部分解析
                                        var $n_answer_name = $("<div class='n_answer_name'>答案统计</div>");
                                        var $n_answer_con = $("<div class='n_answer_con'>");
                                        //if(selectableType == "1" || selectableType == "2" ){
                                        //    if(answerStatistics[questionId]){
                                        //        var $n_answer_x = $("<div class='n_answer_x'>").appendTo($n_answer_con);
                                        //        if(answer == "A"){
                                        //            var $n_answer_chooseA = $("<span class='n_answer_choose A n_answer_seled'>A<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                        //        }else{
                                        //            var $n_answer_chooseA = $("<span class='n_answer_choose A'>A<span class='n_answer_noseled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                        //        }
                                        //        if(answer == "B"){
                                        //            var $n_answer_chooseB = $("<span class='n_answer_choose B n_answer_seled'>B<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                        //        }else{
                                        //            var $n_answer_chooseB = $("<span class='n_answer_choose B'>B<span class='n_answer_noseled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                        //        }
                                        //        if(answer == "C"){
                                        //            var $n_answer_chooseC = $("<span class='n_answer_choose C n_answer_seled'>C<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].C+"</span></span>").appendTo($n_answer_x);
                                        //        }else{
                                        //            var $n_answer_chooseC = $("<span class='n_answer_choose C'>C<span class='n_answer_noseled'>"+answerStatistics[questionId].C+"</span></span>").appendTo($n_answer_x);
                                        //        }
                                        //        if(answer == "D"){
                                        //            var $n_answer_chooseD = $("<span class='n_answer_choose D n_answer_seled'>D<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].D+"</span></span>").appendTo($n_answer_x);
                                        //        }else{
                                        //            var $n_answer_chooseD = $("<span class='n_answer_choose D'>D<span class='n_answer_noseled'>"+answerStatistics[questionId].D+"</span></span>").appendTo($n_answer_x);
                                        //        }
                                        //    }
                                        //}else{
                                        //    if(answerStatistics[questionId]){
                                        //        var $n_answer_s = $("<div class='n_answer_s'>").appendTo($n_answer_con);
                                        //        var $n_answer_seled = $("<span class='n_answer_slove n_answer_seled'>正确<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId]["0"]+"</span></span>").appendTo($n_answer_s);
                                        //        var $n_answer_seledy = $("<span class='n_answer_slove n_answer_seledy'>半对<span class='n_answer_noseled n_answer_seledy'>"+answerStatistics[questionId]["2"]+"</span></span>").appendTo($n_answer_s);
                                        //        var $n_answer_seledr = $("<span class='n_answer_slove n_answer_seledr'>错误<span class='n_answer_noseled n_answer_seledr'>"+answerStatistics[questionId]["1"]+"</span></span>").appendTo($n_answer_s);
                                        //    }
                                        //    if(typeof answerStatistics[questionId] == "undefined"){
                                        //        var $n_answer_s = $("<div class='n_answer_s'>").appendTo($n_answer_con);
                                        //        var $n_answer_seled = $("<span class='n_answer_slove n_answer_seled'>正确<span class='n_answer_noseled n_answer_seled'>无</span></span>").appendTo($n_answer_s);
                                        //        var $n_answer_seledy = $("<span class='n_answer_slove n_answer_seledy'>半对<span class='n_answer_noseled n_answer_seledy'>无</span></span>").appendTo($n_answer_s);
                                        //        var $n_answer_seledr = $("<span class='n_answer_slove n_answer_seledr'>错误<span class='n_answer_noseled n_answer_seledr'>无</span></span>").appendTo($n_answer_s);
                                        //    }
                                        //}
                                        var $n_answersolve = $("<div class='n_answersolve'></div>");//做错的人
                                        if(typeof need[questionId] == "undefined"){//没有需讲人的时候
                                            var $n_answer_mannum= $("<div class='n_answer_mannum'>[需讲人数]<span class='n_answer_pnum'>无</span></div>").appendTo($n_answersolve);
                                        }else{
                                            var $n_answer_mannum= $("<div class='n_answer_mannum'>[需讲人数]<span class='n_answer_pnum'>"+need[questionId]+"</span></div>").appendTo($n_answersolve);
                                        }
                                        var $n_answer_error = $("<div class='n_answer_error'>").appendTo($n_answersolve);
                                        var $n_answer_errorp = $("<div class='n_answer_errorp'>[做错的人]</div>").appendTo($n_answer_error);
                                        var $n_answer_errorname = $("<div class='n_answer_errorname'>").appendTo($n_answer_error);
                                        var doErrorlength = doError[questionId];
                                        if(typeof doErrorlength == "undefined"){
                                            var $n_answer_errname = $("<span class='n_answer_errname'>无</span>").appendTo($n_answer_errorname);
                                        }else{
                                            if(doErrorlength.length>0){
                                                for(var h = 0 ; h < doErrorlength.length; h++){
                                                    var $n_answer_errname = $("<span class='n_answer_errname'>"+doErrorlength[h]+"</span>").appendTo($n_answer_errorname);
                                                }
                                            }
                                        }
                                        for(var d = 0 ;d < qDtrue.labels.length; d++){
                                            var lDtrue = qDtrue.labels[d];
                                            var content = lDtrue.content.replace("【答案】","").replace("【解析】","");
                                            var questionIdd = lDtrue.questionId;
                                            var questionType = lDtrue.questionType;
                                            if(questionType== "03"){
                                                var $n_analysis_mannum = $("<div class='n_analysis_mannum'><div class='n_solvebu'>[答案]</div><div class='n_analysis_pnum'>"+content+"</div></div>");
                                            }
                                            if(questionType== "05"){
                                                var $n_analysis_error = $("<div class='n_analysis_error'><div class='n_analysis_errorp'>[解析]</div>" +
                                                    "<div class='n_analysis_errorname'><span class='n_analysis_errname'>"+content+"</span></div>" +
                                                    "</div>");
                                            }
                                        }
                                        //解析
                                        var $n_analysissolve = $("<div class='n_analysissolve'>");
                                        //分析区域
                                        $n_analysissolve.append($n_analysis_mannum);
                                        $n_analysissolve.append($n_analysis_error);
                                        //    答案区域
                                        $n_answer_con.append($n_answersolve);
                                        $answer.append($n_answer_name);
                                        $answer.append($n_answer_con);
                                        $answer.append($n_analysissolve);
                                }else if(groupCode && isSplite == "1"){
                                    //var Num = JSON.parse(sessionStorage.getItem("Num"));
                                    var content = qDtrue.content;
                                    for(var k = 0 ; k < data.retData.paper.questionLines[i].questionGroup[j].questions.length;k++){
                                        Num++;
                                        var Dtrue = data.retData.paper.questionLines[i].questionGroup[j].questions[k];
                                        for(var m in Dtrue){
                                            if(!Dtrue[m]){
                                                Dtrue[m] = ""
                                            }
                                        }
                                        if(content){
                                            var content = qDtrue.content.replace("【材料】",Num+"、").replace("【</span><span>材料</span><span>】",Num+"、").replace("【题干】",Num+"、")
                                        }
                                        var questionId = Dtrue.questionId;
                                        var lnOrder = Dtrue.lnOrder;
                                        var questionTitle = Dtrue.questionTitle.replace("【题干】",Num+"、").replace("【</span><span>题干</span><span>】",Num+"、").replace("【</span><span>题干</span><span>】",Num+"、").replace("【<span>题干</span>】",Num+"、");
                                        var optionA = Dtrue.optionA;
                                        var optionB = Dtrue.optionB;
                                        var optionC = Dtrue.optionC;
                                        var optionD = Dtrue.optionD;
                                        var groupCode = Dtrue.groupCode;
                                        var answer = Dtrue.answer;
                                        var content = Dtrue.content;
                                        var questionTypeId = Dtrue.questionTypeId;
                                        var selectableType = Dtrue.selectableType;
                                        //if(questionId === dtrueid){
                                            //材料
                                            var $swiper_slide = $("<div class='swiper-slide' Num = '"+Num+"'>").appendTo(swiper);
                                            var $n_rucon = $("<div class='n_rucon'></div>").appendTo($swiper_slide);
                                            var $answer = $("<div class='n_answer'></div>").appendTo($swiper_slide);
                                            if(content){
                                                var $content = $("<div class='n_content'>"+content+"</div>").appendTo($n_rucon);
                                            }
                                            var $option = $("<div class='s_xpoption p1' questionId='"+questionId+"'  data_answer='"+answer+"' myscore='0' style='position: relative'></div>").appendTo($n_rucon);
                                            //var $content = $("<div class='n_content'>"+content+"</div>").appendTo($option);
                                            var $questionTitle = $("<div class='questionTitle'>"+questionTitle+"</div>").appendTo($option);
                                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($option);
                                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($option);
                                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($option);
                                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($option);
                                            var $combination = $("<div class='s_xpcombination'></div>");
                                            //组合题
                                            //答案部分解析
                                            var $n_answer_name = $("<div class='n_answer_name'>答案统计</div>");
                                            var $n_answer_con = $("<div class='n_answer_con'>");
                                            if( selectableType == "1" || selectableType == "2"){
                                                if(answerStatistics[questionId]){
                                                    var $n_answer_x = $("<div class='n_answer_x' data_useanswer = '"+answer+"'>").appendTo($n_answer_con);
                                                    if(answer == "A"){
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A n_answer_seled'>A<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A'>A<span class='n_answer_noseled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                    if(answer == "B"){
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B n_answer_seled'>B<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B'>B<span class='n_answer_noseled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                    if(optionC == "" || optionC == null){//两个选项

                                                    }else{
                                                        if(answer == "C"){
                                                            var $n_answer_chooseC = $("<span class='n_answer_choose C n_answer_seled'>C<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].C+"</span></span>").appendTo($n_answer_x);
                                                        }else{
                                                            var $n_answer_chooseC = $("<span class='n_answer_choose C'>C<span class='n_answer_noseled'>"+answerStatistics[questionId].C+"</span></span>").appendTo($n_answer_x);
                                                        }
                                                    }
                                                    if(optionD == "" || optionD == null){//三个选项

                                                    }else{
                                                        if(answer == "D"){
                                                            var $n_answer_chooseD = $("<span class='n_answer_choose D n_answer_seled'>D<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].D+"</span></span>").appendTo($n_answer_x);
                                                        }else{
                                                            var $n_answer_chooseD = $("<span class='n_answer_choose D'>D<span class='n_answer_noseled'>"+answerStatistics[questionId].D+"</span></span>").appendTo($n_answer_x);
                                                        }
                                                    }
                                                }
                                            }else if(selectableType == "3"){
                                                if(answerStatistics[questionId]){
                                                    var $n_answer_x = $("<div class='n_answer_x' data_useanswer = '"+answer+"'>").appendTo($n_answer_con);
                                                    if(answer == "A"){
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A n_answer_seled'>√<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A'>√<span class='n_answer_noseled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                    if(answer == "B"){
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B n_answer_seled'>×<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B'>×<span class='n_answer_noseled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                }
                                            }else{
                                                if(answerStatistics[questionId]){
                                                    var $n_answer_s = $("<div class='n_answer_s'>").appendTo($n_answer_con);
                                                    var $n_answer_seled = $("<span class='n_answer_slove n_answer_seled'>正确<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId]["0"]+"</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledy = $("<span class='n_answer_slove n_answer_seledy'>半对<span class='n_answer_noseled n_answer_seledy'>"+answerStatistics[questionId]["2"]+"</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledr = $("<span class='n_answer_slove n_answer_seledr'>错误<span class='n_answer_noseled n_answer_seledr'>"+answerStatistics[questionId]["1"]+"</span></span>").appendTo($n_answer_s);
                                                }
                                                if(typeof answerStatistics[questionId] == "undefined"){
                                                    var $n_answer_s = $("<div class='n_answer_s'>").appendTo($n_answer_con);
                                                    var $n_answer_seled = $("<span class='n_answer_slove n_answer_seled'>正确<span class='n_answer_noseled n_answer_seled'>无</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledy = $("<span class='n_answer_slove n_answer_seledy'>半对<span class='n_answer_noseled n_answer_seledy'>无</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledr = $("<span class='n_answer_slove n_answer_seledr'>错误<span class='n_answer_noseled n_answer_seledr'>无</span></span>").appendTo($n_answer_s);
                                                }

                                            }
                                            var $n_answersolve = $("<div class='n_answersolve'></div>");//做错的人
                                            if(typeof need[questionId] == "undefined"){//没有需讲人的时候
                                                var $n_answer_mannum= $("<div class='n_answer_mannum'>[需讲人数]<span class='n_answer_pnum'>无</span></div>").appendTo($n_answersolve);
                                            }else{
                                                var $n_answer_mannum= $("<div class='n_answer_mannum'>[需讲人数]<span class='n_answer_pnum'>"+need[questionId]+"</span></div>").appendTo($n_answersolve);
                                            }
                                            var $n_answer_error = $("<div class='n_answer_error'>").appendTo($n_answersolve);
                                            var $n_answer_errorp = $("<div class='n_answer_errorp'>[做错的人]</div>").appendTo($n_answer_error);
                                            var $n_answer_errorname = $("<div class='n_answer_errorname'>").appendTo($n_answer_error);
                                            var doErrorlength = doError[questionId];
                                            if(typeof doErrorlength == "undefined"){
                                                var $n_answer_errname = $("<span class='n_answer_errname'>无</span>").appendTo($n_answer_errorname);
                                            }else{
                                                if(doErrorlength.length>0){
                                                    for(var h = 0 ; h < doErrorlength.length; h++){
                                                        var $n_answer_errname = $("<span class='n_answer_errname'>"+doErrorlength[h]+"</span>").appendTo($n_answer_errorname);
                                                    }
                                                }
                                            }
                                            for(var d = 0 ;d < Dtrue.labels.length; d++){
                                                var lDtrue = Dtrue.labels[d];
                                                var content = lDtrue.content.replace("【答案】","").replace("【解析】","");
                                                var questionIdd = lDtrue.questionId;
                                                var questionType = lDtrue.questionType;
                                                if(questionType== "03"){
                                                    var $n_analysis_mannum = $("<div class='n_analysis_mannum'><div class='n_solvebu'>[答案]</div><div class='n_analysis_pnum'>"+content+"</div></div>");
                                                }
                                                if(questionType== "05"){
                                                    var $n_analysis_error = $("<div class='n_analysis_error'><div class='n_analysis_errorp'>[解析]</div>" +
                                                        "<div class='n_analysis_errorname'><span class='n_analysis_errname'>"+content+"</span></div>" +
                                                        "</div>");
                                                }
                                            }
                                            //解析
                                            var $n_analysissolve = $("<div class='n_analysissolve'>");
                                            //分析区域
                                            $n_analysissolve.append($n_analysis_mannum);
                                            $n_analysissolve.append($n_analysis_error);
                                            //    答案区域
                                            $n_answer_con.append($n_answersolve);
                                            $answer.append($n_answer_name);
                                            $answer.append($n_answer_con);
                                            $answer.append($n_analysissolve);
                                        //}
                                    }
                                }else{//普通题
                                    //var Num = JSON.parse(sessionStorage.getItem("Num"));
                                    for(var k = 0 ; k < data.retData.paper.questionLines[i].questionGroup[j].questions.length;k++){
                                        Num++;
                                        var Dtrue = data.retData.paper.questionLines[i].questionGroup[j].questions[k];
                                        for(var m in Dtrue){
                                            if(!Dtrue[m]){
                                                Dtrue[m] = ""
                                            }
                                        }
                                        var questionId = Dtrue.questionId;
                                        var lnOrder = Dtrue.lnOrder;
                                        var questionTitle = Dtrue.questionTitle.replace("【题干】",Num+"、").replace("【</span><span>题干</span><span>】",Num+"、").replace("【<span>题干</span>】",Num+"、");
                                        var optionA = Dtrue.optionA;
                                        var optionB = Dtrue.optionB;
                                        var optionC = Dtrue.optionC;
                                        var optionD = Dtrue.optionD;
                                        var groupCode = Dtrue.groupCode;
                                        var answer = Dtrue.answer;
                                        var content = Dtrue.content;
                                        var questionTypeId = Dtrue.questionTypeId;
                                        var selectableType = Dtrue.selectableType;
                                        //if(questionId == dtrueid){
                                            var $swiper_slide = $("<div class='swiper-slide' Num = '"+Num+"'>").appendTo(swiper);
                                            var $n_rucon = $("<div class='n_rucon'></div>").appendTo($swiper_slide);
                                            var $answer = $("<div class='n_answer'></div>").appendTo($swiper_slide);
                                            var $option = $("<div class='s_xpoption p1' questionId='"+questionId+"'  data_answer='"+answer+"' myscore='0' style='position: relative'></div>");
                                            var $content = $("<div class='n_content'>"+content+"</div>").appendTo($option);
                                            var $questionTitle = $("<div class='questionTitle'>"+questionTitle+"</div>").appendTo($option);
                                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($option);
                                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($option);
                                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($option);
                                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($option);
                                            var $combination = $("<div class='s_xpcombination'></div>");
                                            //组合题
                                            //if(groupCode){
                                            //    $contentz = $("<div class='contentz_content'>"+content+"</div>");
                                            //}
                                            //答案部分解析
                                            var $n_answer_name = $("<div class='n_answer_name' useanswer = '"+answer+"'>答案统计</div>");
                                            var $n_answer_con = $("<div class='n_answer_con'>");
                                            if(selectableType == "1" || selectableType == "2"){
                                                if(answerStatistics[questionId]){
                                                    var $n_answer_x = $("<div class='n_answer_x' data_useanswer = '"+answer+"'>").appendTo($n_answer_con);
                                                    if(answer == "A"){
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A n_answer_seled' data_option='A'>A<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A' data_option='A'>A<span class='n_answer_noseled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                    if(answer == "B"){
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B n_answer_seled' data_option='B'>B<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B' data_option='B'>B<span class='n_answer_noseled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                    if(optionC == "" || optionC == null){//两个选项

                                                    }else{
                                                        if(answer == "C"){
                                                            var $n_answer_chooseC = $("<span class='n_answer_choose C n_answer_seled' data_option='C'>C<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].C+"</span></span>").appendTo($n_answer_x);
                                                        }else{
                                                            var $n_answer_chooseC = $("<span class='n_answer_choose C' data_option='C'>C<span class='n_answer_noseled'>"+answerStatistics[questionId].C+"</span></span>").appendTo($n_answer_x);
                                                        }
                                                    }
                                                    if(optionD == "" || optionD == null){//三个选项

                                                    }else{
                                                        if(answer == "D"){
                                                            var $n_answer_chooseD = $("<span class='n_answer_choose D n_answer_seled' data_option='D'>D<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].D+"</span></span>").appendTo($n_answer_x);
                                                        }else{
                                                            var $n_answer_chooseD = $("<span class='n_answer_choose D' data_option='D'>D<span class='n_answer_noseled'>"+answerStatistics[questionId].D+"</span></span>").appendTo($n_answer_x);
                                                        }
                                                    }

                                                }
                                            }else if(selectableType == "3"){
                                                if(answerStatistics[questionId]){
                                                    var $n_answer_x = $("<div class='n_answer_x' data_useanswer = '"+answer+"'>").appendTo($n_answer_con);
                                                    if(answer == "A"){
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A n_answer_seled'>√<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseA = $("<span class='n_answer_choose A'>√<span class='n_answer_noseled'>"+answerStatistics[questionId].A+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                    if(answer == "B"){
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B n_answer_seled'>×<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }else{
                                                        var $n_answer_chooseB = $("<span class='n_answer_choose B'>×<span class='n_answer_noseled'>"+answerStatistics[questionId].B+"</span></span>").appendTo($n_answer_x);
                                                    }
                                                }
                                            }else{
                                                if(answerStatistics[questionId]){
                                                    var $n_answer_s = $("<div class='n_answer_s'>").appendTo($n_answer_con);
                                                    var $n_answer_seled = $("<span class='n_answer_slove n_answer_seled'>正确<span class='n_answer_noseled n_answer_seled'>"+answerStatistics[questionId]["0"]+"</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledy = $("<span class='n_answer_slove n_answer_seledy'>半对<span class='n_answer_noseled n_answer_seledy'>"+answerStatistics[questionId]["2"]+"</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledr = $("<span class='n_answer_slove n_answer_seledr'>错误<span class='n_answer_noseled n_answer_seledr'>"+answerStatistics[questionId]["1"]+"</span></span>").appendTo($n_answer_s);
                                                }
                                                if(typeof answerStatistics[questionId] == "undefined"){
                                                    var $n_answer_s = $("<div class='n_answer_s'>").appendTo($n_answer_con);
                                                    var $n_answer_seled = $("<span class='n_answer_slove n_answer_seled'>正确<span class='n_answer_noseled n_answer_seled'>无</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledy = $("<span class='n_answer_slove n_answer_seledy'>半对<span class='n_answer_noseled n_answer_seledy'>无</span></span>").appendTo($n_answer_s);
                                                    var $n_answer_seledr = $("<span class='n_answer_slove n_answer_seledr'>错误<span class='n_answer_noseled n_answer_seledr'>无</span></span>").appendTo($n_answer_s);
                                                }

                                            }
                                            var $n_answersolve = $("<div class='n_answersolve'></div>");//做错的人
                                            if(typeof need[questionId] == "undefined"){//没有需讲人的时候
                                                var $n_answer_mannum= $("<div class='n_answer_mannum'>[需讲人数]<span class='n_answer_pnum'>无</span></div>").appendTo($n_answersolve);
                                            }else{
                                                var $n_answer_mannum= $("<div class='n_answer_mannum'>[需讲人数]<span class='n_answer_pnum'>"+need[questionId]+"</span></div>").appendTo($n_answersolve);
                                            }
                                            var $n_answer_error = $("<div class='n_answer_error'>").appendTo($n_answersolve);
                                            var $n_answer_errorp = $("<div class='n_answer_errorp'>[做错的人]</div>").appendTo($n_answer_error);
                                            var $n_answer_errorname = $("<div class='n_answer_errorname'>").appendTo($n_answer_error);
                                            var doErrorlength = doError[questionId];
                                            if(typeof doErrorlength == "undefined"){
                                                var $n_answer_errname = $("<span class='n_answer_errname'>无</span>").appendTo($n_answer_errorname);
                                            }else{
                                                if(doErrorlength.length>0){
                                                    for(var h = 0 ; h < doErrorlength.length; h++){
                                                        var $n_answer_errname = $("<span class='n_answer_errname'>"+doErrorlength[h]+"</span>").appendTo($n_answer_errorname);
                                                    }
                                                }
                                            }
                                            //解析
                                            var $n_analysissolve = $("<div class='n_analysissolve'>");
                                            for(var d = 0 ;d < Dtrue.labels.length; d++){
                                                var lDtrue = Dtrue.labels[d];
                                                var content = lDtrue.content.replace("【答案】","").replace("【解析】","").replace("【参考范文】","").replace("【</span><span>参考范文</span><span>】","");
                                                var questionIdd = lDtrue.questionId;
                                                var questionType = lDtrue.questionType;
                                                if(questionType== "03"){
                                                    var $n_analysis_mannum = $("<div class='n_analysis_mannum'><div class='n_solvebu'>[答案]</div><div class='n_analysis_pnum'>"+content+"</div></div>").appendTo($n_analysissolve);
                                                }
                                                if(questionType== "05" ||questionType== "18"){
                                                    var $n_analysis_error = $("<div class='n_analysis_error'><div class='n_analysis_errorp'>[解析]</div>" +
                                                        "<div class='n_analysis_errorname'><span class='n_analysis_errname'>"+content+"</span></div>" +
                                                        "</div>").appendTo($n_analysissolve);
                                                }
                                            }
                                            //    答案区域
                                            $n_answer_con.append($n_answersolve);
                                            $answer.append($n_answer_name);
                                            $answer.append($n_answer_con);
                                            $answer.append($n_analysissolve);
                                            $n_rucon.append($option);
                                        //}
                                        //    多选行列
                                        _this.Right();//多选题的处理
                                    }
                                }
                            }
                        }
                        //_this.Caoular(newcloneD);
                        _this.clickTest(data,newcloneD);

                    }else{
                        bc.emptyPage();//空白页
                    }
                    intMathJax();//公式
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Right : function(){
            var n_answer_choose = $(".n_answer_choose");
            n_answer_choose.each(function(){
                var myanswer = $(this).parent(".n_answer_x").attr("data_useanswer");
	            if(myanswer == 'undefined' || myanswer == undefined){
		            var userAnswerlength = 0;
	            }else{
		            var userAnswerlength = myanswer.length;
	            }
                if(userAnswerlength > 1){
                    for(var i = 0 ; i < userAnswerlength ; i++){
                        var userAnswerknwon = myanswer[i];
                        if($(this).attr("data_option") === userAnswerknwon){
                            $(this).addClass("addcolor").css({color:"#65B113"});
                            $(this).find("span").addClass("addcolor").css({color:"#65B113"});
                        }
                    }
                }else{
                    //if(myanswer === $(this).attr("option")){
                    //    $(this).css({color:"#49b9df"});
                    //}
                }
            })
        }
    };
    var $Test = new Test();
    $Test.init();
});
