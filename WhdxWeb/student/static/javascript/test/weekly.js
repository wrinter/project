/**
 * Created by lichao on 2017/2/7.
 */
$(document).ready(function(){
    var weekly = {
        init : function(){
            var weekId = JSON.parse(sessionStorage.getItem("weekId"));
            if(weekId == "undefined"){

            }
            var id = Request.id;
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            if(id){
                this.getWeekly(id);//获取周报
            }else{
                this.getWeekly(weekId);//获取周报
            }
        },
        getWeekly : function(id){
            var _this = this;
            var weeklysubject = $(".weeklysubject").clone(true);
            var wsubject = $(".wsubject");
            wsubject.html("");
            var parmas = {}
            if(id){
                parmas.id = id
            }else{
                parmas.id = "58abf71d19c74f670132eb84";
            }
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/getUserWeekData",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    var weeklyname = $(".weeklyname");
                    if(data.retCode == "0000"){
                        var endDate = data.retData.endDate.replace("23:59:59","");
                        var startDate = data.retData.startDate.replace("00:00:00","");
                        var id = data.retData.id;
                        weeklyname.attr("id",id).text(""+startDate+"——"+endDate+"作业周报")
                        _this.weeklyData(data,weeklysubject);//拆分数据周报
                    }else{
                        $(".weekly").hide();
                        $(".nothing").show();
                    }
                },
                error :function(e){
                    console.log(e)
                }
            })
        },
        weeklyData : function(data,weeklysubject){//周报数据拆分
            var _this = this;
            var wprogess = $(".wprogess");
            var wsubstraningclickmoney = $(".wsubstraningclickmoney");
            var wtrainingword = $(".wtrainingword");
            for(var i = 0 ; i < data.retData.subjectWeekDatas.length ; i++){
                var newclone = weeklysubject.clone(true);
                var Dtrue = data.retData.subjectWeekDatas[i];
                var subjectName = Dtrue.subjectName;
                var subjectId = Dtrue.subjectId;
                var knowledgeDesc = Dtrue.knowledgeDesc;
                var status = Dtrue.status;
                var subjectId = Dtrue.subjectId;
                if(status == "0"){
                    newclone.find(".wsubstraningclickmoney").attr("status",status).text("5金币");
                }else if( status == "1" || status == "2" ||status == "3"){
                    newclone.find(".wsubstraningclickmoney").attr("status",status).text("已购买");
                }else if( status == "-1"){
                    newclone.find(".wsubstraningclick").hide();
                }
                if(knowledgeDesc){
                    wtrainingword.text(knowledgeDesc);//补偿训练
                }else{
                    wtrainingword.text("暂无知识点");//补偿训练
                }
                sessionStorage.setItem("subjectId",JSON.stringify(subjectId));
                newclone.find(".subjectname").text(subjectName);
                newclone.find(".wtrainingword").text(knowledgeDesc);//知识点
                newclone.find(".wsubstraningclickword").attr("subjectId",subjectId);
                for(var j = 0 ; j < Dtrue.knowledgeWeekDatas.length ; j++){
                    var kDtrue = Dtrue.knowledgeWeekDatas[j];
                    var accuracy = kDtrue.accuracy
                    var accuracys = kDtrue.accuracy+"%";
                    var knowledgeName = kDtrue.knowledgeName;
                    var promptText = kDtrue.promptText;
                    var $wprogess = $("<span class='wprogess'></span>").appendTo(newclone.find(".wsubbg"));
                    var $ico = $("<span class='wprogerssname' title='"+accuracys+"' style='width:"+accuracys+"'></span>").appendTo($wprogess);
                    var $knownId = $("<span class='wKnowledge'>"+knowledgeName+"</span>").appendTo($wprogess);
                    var $comeon = $("<span class='wtipic'>"+promptText+"</span>").appendTo($wprogess);
                }
                newclone.appendTo(".wsubject");
            }
            $(".weeklyname").attr("subjectId",subjectId);//存学科
            _this.Compensation();//补偿训练
        },
        Compensation : function (){//补偿训练
            $(".wsubstraningclickword").on("click",function(){
                var status = $(this).siblings(".wsubstraningclickmoney").attr("status");
                var subjectId = $(this).attr("subjectId");
                var parmasC = {};
                parmasC.id = $(".weeklyname").attr("id");
                parmasC.subjectId = subjectId;
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
                        success : function(data){
                            console.log(data)
                            if(data.retCode == "0000"){
                                var usable = data.retData.usable;
                                if(!usable){
                                    $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                                    return false;
                                }
                                if(usable >= 5){
                                    var parmasC = {};
                                    parmasC.id = $(".weeklyname").attr("id");
                                    parmasC.subjectId = subjectId;
                                    parmasC.type = "1";
                                    sessionStorage.setItem("parmasC",JSON.stringify(parmasC));
                                    //$('#c_ErrorMsg').html('-5金币!').fadeIn(200);  Disappear("#c_ErrorMsg");
                                    window.open("training.html");
                                }else{
                                    $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                                }
                            }
                        },
                        error : function(e){
                            console.log(e)
                        }
                    })
                }
            })
        }
    }
    weekly.init();
})
