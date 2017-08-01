/**
 * Created by lgr on 2016/12/7.
 */
$(document).ready(function(){
    //日历表
    function getDay(){};
    getDay.prototype = {
        init : function (){
            var uuid = Request.uuid;//获取栏目id
            isSign();
            $.ajax({
                type : "post",
                url : "/api/user/singin",
                data : {uuid:uuid},
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        isSign();
                    }else{
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        //    判断签到
            function isSign(){
                var uuid = Request.uuid;//获取栏目id
                var parmas = {};
                if(uuid){
                    parmas.uuid =  uuid;
                }else{
                    parmas.uuid =  "6739cff77a0bad5f2b76d81ef0232391";
                }
                $.ajax({
                    type : "post",
                    url : "/api/user/singinCount",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        console.log(data)
                        if(data.retCode == "0000"){
                            var singinedDays = data.retData.singinedDays;
                            if(data.retData.singined == "no"){
                                $(".click_sign").text("已连续签到"+singinedDays+"天");
                                if(singinedDays >= 7){
                                    $(".m_calendar_bttonclick").click(function(){
                                        window.location.href = "me_lottery.html"
                                    })
                                }
                            }else{
                                $(".click_sign").text("已连续签到"+singinedDays+"天");
                                if(singinedDays >= 7){
                                    $(".m_calendar_bttonclick").click(function(){
                                        window.location.href = "me_lottery.html"
                                    })
                                }
                            }
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            }
        }
    }
    var $getDay = new getDay();
    $getDay.init();
})