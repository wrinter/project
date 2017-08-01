/**
 * Created by lc on 2017/6/27.
 */
Ajax();
function Ajax(){
    $.ajax({
        type : "post",
        url : "/web/user/check/timeout",
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                var Data = data.retData;
                if(Data == null){
                    $(".RegBtn,.LoginBtn").show();
                }
            }else if(data.retCode == "9301"){
                var Data = data.retData;
                if(Data == "1"){
                    $(".RegBtn,.LoginBtn").hide();
                }
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
