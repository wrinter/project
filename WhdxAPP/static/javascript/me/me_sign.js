/**
 * Created by lichao on 2017/1/17.
 */
$(document).ready(function(){
    //日历表
    function getDay(){};
    getDay.prototype = {
        init : function (){
            isSign();
            function Sign(){
                var uuid = Request.uuid;//获取栏目id
                var parmas = {};
                if(uuid){
                    parmas.uuid =  uuid;
                }else{
                    parmas.uuid =  "f3dde4429bd51e1c04bf34bb240cbb2b";
                }
                $.ajax({
                    type : "post",
                    url : "/api/user/singin",
                    data : parmas,
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
            }
            //    判断签到
            function isSign(){
                var uuid = Request.uuid;//获取栏目id
                var parmas = {};
                if(uuid){
                    parmas.uuid =  uuid;
                }else{
                    parmas.uuid =  "f3dde4429bd51e1c04bf34bb240cbb2b";
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
                            var gold = data.retData.gold;
                            if(data.retData.singined == "no"){
                                $(".kolo_word").text("+"+gold);
                                $(".color").text(singinedDays);
                                //if(singinedDays >= 7){
                                //    $(".m_calendar_bttonclick").click(function(){
                                //        window.location.href = "me_lottery.html"
                                //    })
                                //}
                                Sign();
                            }else{
                                $(".kolo_word").text("+"+gold);
                                $(".color").text(singinedDays);
                                //if(singinedDays >= 7){
                                //    $(".m_calendar_bttonclick").click(function(){
                                //        window.location.href = "me_lottery.html"
                                //    })
                                //}
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
