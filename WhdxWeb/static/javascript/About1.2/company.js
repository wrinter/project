/********************************************企业合作**Created by Echonessy on 2017/6/1.****************************************************/
ShowWeixinCode();
$(".SubBtn").on("click",function(){
    company();
})
$('.NavLogo').click(function(){
    window.location.href='/index.html';
})
function company(){
    var name = $("#Name").val();
    var linkName = $("#UserName").val();
    var linkPhone = $("#UserTell").val();
    var linkPosition = $("#UserDuty").val();
    var mainBusiness = $("#Business").val();
    var cooperation = $("#Purpose").val();
    var subData = $(".subData");
    var userBusinessPartersRes = {};
    var is = true;
    subData.each(function(){
        var data_name = $(this).attr("data-name");
        var value = $(this).val();
        userBusinessPartersRes[data_name] = value;
        //没有填写的内容变红
        if(value == ""){
            $(this).focus();
            $(this).css("border","1px solid #e41414")
            is = false;
            return false;
        }
    })
    userBusinessPartersRes.type = "1";
    if(is == false){
        return false;
    }
    var parmas = JSON.stringify(userBusinessPartersRes);
    $.ajax({
        type : "post",
        url : "/web/common/bottom/addBusinessParters",
        data : parmas,
        dataType : "json",
        async : false,
        contentType: "application/json;charset=utf-8",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                $('#c_ErrorMsg').html('提交成功!').fadeIn(200);  Disappear("#c_ErrorMsg");
                //subData.val("");
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//没有填写的内容
$(".subData").blur(function(){
    var value = $(this).val();
    if(value != ""){
        $(this).css("border","1px solid #ccc");
        $(this).parent("li").find(".subData").css("border","1px solid #ccc");
    }
})
