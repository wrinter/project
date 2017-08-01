/**
 * Created by lgr on 2017/1/3.
 */
$(document).ready(function(){
    function Deitails(){};
    Deitails.prototype = {
        init : function(){
            var paperAssignId = Request.id;//获取栏目id
            var type = Request.type;//获取课时id
            var dtrueidlength = JSON.parse(sessionStorage.getItem("dtrueidlength"));//当前试题的长度
            var uuid = JSON.parse(sessionStorage.getItem("uuid"));//uuid
            var errorRate = JSON.parse(sessionStorage.getItem("errorRate"));//题目
            var ids = JSON.parse(sessionStorage.getItem("ids"));//所有id
            var k = JSON.parse(sessionStorage.getItem("k"));//获取当前题号；
            var tilei = parseInt(k);
            var dtrueid = Request.dtrueid;//获取当前题的dtrueid
            this.getTest(paperAssignId,type,uuid,dtrueid);
            this.getCss();
        },
        getCss : function(){
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
        },
        clickTest : function(idslength,dtrueid,tilei,ids,errorRate,type,uuid,paperAssignId,newcloneD){
            var _this = this;
            var P_rutopscroll = $(".Echo_List");
            for(var i = 0 ; i < idslength ; i++){
                var Dtrue = ids[i];
                var prent = errorRate[Dtrue];
                $clicktest = $("<li class='idslength_li EchoNav' prent='"+prent+"' Dtrueid ='"+Dtrue+"'>"+(i+1)+"</li>").appendTo(P_rutopscroll);
            }
            var IsDefultIndex = parseInt(tilei);
            var lastlist = $("<li class='EchoLine'><img src='../../static/image/notice/d.png' alt=''></li>").appendTo(P_rutopscroll);
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
                    NavCenter(Index)
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
            var paperAssignId = Request.id;//获取栏目id
            var type = Request.type;//获取课时id
            var dtrueidlength = JSON.parse(sessionStorage.getItem("dtrueidlength"));//当前试题的长度
            var uuid = JSON.parse(sessionStorage.getItem("uuid"));//uuid
            var errorRate = JSON.parse(sessionStorage.getItem("errorRate"));//题目
            var ids = JSON.parse(sessionStorage.getItem("ids"));//所有id
            var k = JSON.parse(sessionStorage.getItem("k"));//获取当前题号；
            var tilei = parseInt(k);
            var dtrueid = Request.dtrueid;//获取当前题的dtrueid
            var $n_testpaper = $(".P_testpaper");
            var swiper = $(".swiper-wrapper");
            $n_testpaper.html("");
            swiper.html("");
            var parmas = {}
            parmas.paperAssignId = paperAssignId;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/api//teacher/paper/report/videoTitleDetails",
                data :parmas,
                dataType :"json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var swiper = $(".swiper-wrapper");
                        for(var i = 0 ;i < data.retData.questionList.length ; i++) {
                            Num++;
                            var Dtrue = data.retData.questionList[i];
                            for (var k in Dtrue) {
                                if (!Dtrue[k]) {
                                    Dtrue[k] = ""
                                }
                            }
                            var answer = Dtrue.answer;
                            var groupCode = Dtrue.groupCode;
                            var userAnswer = Dtrue.userAnswer;
                            var questionData = Dtrue.questionData;
                            var id = Dtrue.id;
                            var optionA = Dtrue.optionA;
                            var optionB = Dtrue.optionB;
                            var optionC = Dtrue.optionC;
                            var optionD = Dtrue.optionD;
                            var $swiper_slide = $("<div class='swiper-slide' >").appendTo(swiper);
                            var $P_testpaper = $("<div class='P_testpaper'></div>");
                            var $P_answer = $("<div class='P_answer'></div>");
                            var $option = $("<div class='s_xpoption p1'userAnswer='"+userAnswer+"'  style='position:relative'></div>");
                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($option);
                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($option);
                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($option);
                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($option);
                            var $combination = $("<div class='s_xpcombination'></div>");
                            $P_testpaper.append($option);
                            $P_testpaper.append($combination);
                            $swiper_slide.append($P_testpaper);
                            $swiper_slide.append($P_answer);
                            $option.find(".optionchoose").each(function(){
                                var num = $(this).attr("option")
                                if(answer == num){
                                    $(this).css({"color":"#65b113"})
                                }
                            })
                            for(var j = 0;j<Dtrue.list.length;j++){
                                var lDture = Dtrue.list[j];
                                var questionId = lDture.questionId;
                                var questionType = lDture.questionType;
                                var content = lDture.content.replace("【题干】",Num+"、").replace("【答案】","").replace("【解析】","");
                                if(questionType == "01"){
                                    var $questionType = $("<div class='s_xpquestionType p1' questionType='01'>"+content+"</div>").insertBefore($optionchooseA);
                                }
                                if(questionType == "03"){
                                    var $P_answerslove = $("<div class='P_answerslove'><span class='P_answername'>答案</span><span class='P_rigthanswer'>"+content+"</span></div>").appendTo($P_answer);
                                }
                                if(questionType == "05"){
                                    var $P_analysis_errorp = $("<div class='P_analysis_errorp'>[解析]</div><div class='P_analysis_errorname'><span class='P_analysis_errname'>"+content+"</span></div>").appendTo($P_answer);
                                }
                            }
                        }
                        _this.clickTest(dtrueidlength,dtrueid,tilei,ids,errorRate,type,uuid,paperAssignId,newcloneD);
                    }else{
                        //判斷是否有數據
                        javascript:bc.emptyPage();//空白页
                    }
                    intMathJax();//公式
                },
                error : function(e){
                    console.log(e)
                }
            })
        }

    }
    var $Deitails = new Deitails();
    $Deitails.init();
});
