/**
 * Created by lgr on 2016/12/15.
 */
$(document).ready(function(){
    function Chinese(){};
    Chinese.prototype = {
        init : function (){
            this.article();
        },
        article : function (){
            var _this = this;
            var paperAssignId = JSON.parse(sessionStorage.getItem("paperAssignId"));
            $.ajax({
                type : "post",
                url : "/api//teacher/paper/report/articleReport",
                data : {paperAssignId:paperAssignId},
                dataType :"json",
                success : function(data){
                    console.log(data)
                    var chinese_list = $(".chinese_list");
                    if(data.retCode == "0000"){
                        //判斷是否有數據
                        var name = data.retData.name;
                        var tilte = $("title").text(name);
                        //if(data.retData.userReportList== null){
                        //    window.location.href = "../notice/nothing.html";
                        //    return false;
                        //}
                        for(var i = 0; i<data.retData.userReportList.length;i++){
                            var Dtrue = data.retData.userReportList[i];
                            var useTime = Dtrue.useTime;
                            var userName = Dtrue.userName;
                            var date = Dtrue.date;
                            var usetime = parseInt(useTime);
                            if(useTime == "--"){
                                time = "--";
                            }else{
                                var time = _this.time(usetime);
                            }
                            var $chinese_li = $("<div class='chinese_li'><div class='chinese_time'>"+userName+"</div><div class='chinese_time'>"+time+"</div></div>")
                            chinese_list.append($chinese_li);
                        }
                    }else{
                        javascript:bc.emptyPage();//空白页
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        time : function(value){
            var theTime = parseInt(value);// 秒
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
                if(parseInt(theTime)<9){
                    var Sec = "0"+parseInt(theTime);
                }else {
                    var Sec =parseInt(theTime);
                }
                if(parseInt(theTime1)<9){
                    var Min = "0"+parseInt(theTime1);
                }else {
                    var Min =parseInt(theTime1);
                }
                if(parseInt(theTime2)<9){
                    var Hour = "0"+parseInt(theTime2);
                }else {
                    var Hour =parseInt(theTime2);
                }
                Result=Hour+':'+Min+':'+Sec;
            }

            return Result;
        }
    }

        var $Chinese = new Chinese();
        $Chinese.init();

})