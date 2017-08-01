/**
 * Created by lichao on 2017/5/4.
 */
$(document).ready(function(){
    var parmas = {};
    parmas.id = Request.id;
    $.ajax({
        type : "post",
        url : "/api/student/homework/report/getUserPaperPKInfo",
        data : parmas,
        dataType : "json",
        success : function(data){
            if(data.retCode == "0000"){
                Data(data)
            }
        },
        error : function(e){
            console.log(e)
        }
    })
    //數據層
    function Data(data){
        var class_uName = $(".class_uName");//对手名字
        var Dtrue = data.retData;
        var have = Dtrue.have;////是否具有PK对手（false：没有；true：有）
        if(have){
            ShowData(data);
        }else{
            ShowData(data);
            class_uName.text("暂无目标");
        }

    }
    //数据层展现
    function ShowData(data){
        var classWord = $(".classWord");
        var class_meHead = $(".class_meHead");
        var class_meName = $(".class_meName");//我的名字
        var class_uName = $(".class_uName");//對方的名字
        var nodo = $(".nodo");//nodo
        var classPrecentMe = $(".classPrecentMe");//正确率
        var classTimetMe = $(".classTimetMe");//我的时间
        var class_uHead = $(".class_uHead");//对手头像
        var class_uName = $(".class_uName");//对手名字
        var classPrecentU = $(".classPrecentU");//对手的百分比
        var classTimeU = $(".classTimeU");//对手的时间
        var Dtrue = data.retData;
        var have = Dtrue.have;////是否具有PK对手（0：没有；1：有）
        var headImg = Dtrue.headImg;//我的頭像
        var isComplete = Dtrue.isComplete;//我是否已做（0 未做 1 未批改 2 已批改）
        var isPkComplete = Dtrue.isPkComplete;//PK对手是否已做（0 未做 1 未批改 2 已批改）
        var pkHeadImg = Dtrue.pkHeadImg;//對手的頭像
        var pkScore = Dtrue.pkScore;//PK对手得分
        var pkTotalScore = Dtrue.pkTotalScore;//對手總分
        var pkTotalTime = Dtrue.pkTotalTime;//對手縂時間
        var userName = Dtrue.userName;//我的名稱
        var pkUserName = Dtrue.pkUserName;//對手名稱
        var result = Dtrue.result;//结果（0：用户胜利；1：PK对手胜利；2：平）
        var score = Dtrue.score;//我的得分
        var time = Dtrue.time;
        var totalScore = Dtrue.totalScore;//我的總分
        var totalTime = Dtrue.totalTime;//我的縂時間
        var type = Dtrue.type;
        var type = type.substr(0,1);
        if(type == "2"){
            classWord.text("得分");
        }
        class_meName.text(userName);//myName
        if(headImg==""){
        }else{
            class_meHead.css({"background":"url("+headImg+")","background-size":"cover"});
        }
        if(isComplete == "0" ){
            class_meHead.find(".nodo").show();
        }else if(isComplete== "1"){//等待批改
            class_meHead.find(".nocorrect").show();
            classTimetMe.text(ToComTime(totalTime));
            classPrecentMe.text("?");
        }else if(isComplete == ""){

        }else{
            if(type == "1"){
                var partent = parseInt(score*100/totalScore);
                classPrecentMe.text(partent+"%");
            }else{
                classPrecentMe.text(score+"分");
            }
            classTimetMe.text(ToComTime(totalTime));
        }
        //存在对手
        if(have){
            //对手
            if(pkHeadImg==""){//PK对手头像
            }else{
                class_uHead.css({"background":"url("+pkHeadImg+")","background-size":"cover"});
            }
            if(pkUserName){
                class_uName.text(pkUserName);//PK对手名字
            }else{
                class_uName.text("暂无目标");//PK对手名字
            }
            if(isPkComplete == "0"){
                class_uHead.find(".nodo").show();
            }else if(isPkComplete == "1"){
                class_uHead.find(".nocorrect").show();
                classTimeU.text(ToComTime(pkTotalTime));
                classPrecentU.text("?");
            }else if(isPkComplete == ""){

            }else{
                if(type == "1"){
                    var partent = parseInt(pkScore*100/pkTotalScore);
                    classPrecentU.text(partent+"%");//PK对手正确率
                }else{
                    classPrecentU.text(pkScore+"分");//PK对手正确率
                }
                classTimeU.text(ToComTime(pkTotalTime));
            }
        }
        //    PK
        if(isPkComplete=="2" && isComplete=="2"){
            if(result == null || result == ""){
            }else{
                var result = Number(result);
            }
            switch(result){
                case 0 : class_meHead.find(".win").show();break;
                case 1 : class_uHead.find(".win").show();break;
                case 2 : $(".class_meHead,.class_uHead").find(".blance").show();break;
            }
        }
    }
    //隐藏班级目标
    $(".classDelete").click(function(){
        $(".shark").hide();
    })
})
function show(){
    $(".shark").show();
    //alert("12312");
}
