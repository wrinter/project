/**
 * Created by Renwencong on 2017/2/22 0022.
 */
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
/************************************************私人订制*******************************************************/
function Radio(a,b){
    $(a).on('click',function(){
        $(this).removeClass('p_useico0').addClass('p_useico1');
        $(b).removeClass('p_useico1').addClass('p_useico0');
    })
};
/*遮罩层淡入淡出*/
FadeOut('#m_PptPayClose',"#m_PptPay");
FadeOut('#m_ChoCancel',"#m_PptPay");
FadeOut('#m_ClosPay',"#m_PayMsg");
/*大图轮播*/
var num=0;
var PptTime=null;
PptTime=setInterval(function(){
    $('#m_Advert').find('img').eq(num).fadeIn(1000).siblings().fadeOut(1);
    num++;if(num>4){num=0;}
},3000)
$('#m_AdverList li').hover(function(){num=$(this).index();}, function(){});
document.addEventListener('click',function(e){
    if(e.target.className.indexOf("m_AreaSelect")==-1){
        $(".arealist").slideUp();
    }
});
$('#c_rClose').on('click',function(){
    $('#m_UpBox').fadeOut(200);
});

//点击进入ppt界面，初始化参数
function init(){
    $.ajax({
        url:"/web/teacher/trade/init",
        type:"post",
        dataType:"json",
        success:function(data){
            console.log(data);
            store.set("pptPrice",data.retData.pptPrice);
            $(".fn_ppt_price").html(data.retData.pptPrice);
            if(data.retData.rebateCount == '0'){
                $(".fn_rebate").hide();
                $(".if_zero").html("0");
            }else{
                $(".fn_rebate_count").html(data.retData.rebateCount);
                $(".fn_rebate_time").html(data.retData.rebateOutTime);
                /*私人订制支付方式单选*/
                Radio('#m_UsePpt0','#m_UsePpt1');
                Radio('#m_UsePpt1','#m_UsePpt0');
            }
        }
    })
}

//立即定制
function generateNoPayOrder(){
    //立即定制
    $("#m_OrderBtn").click(function(){
        $("#m_UsePpt0").removeClass('p_useico0').addClass('p_useico1');
        $("#m_UsePpt1").removeClass('p_useico1').addClass('p_useico0');
        $("#m_PptPay").fadeIn(200);
        queryRebateList();
        addPayInfo();
    })

    //立即使用
    $("#p_QuickUse").click(function(){
        $("#m_UsePpt1").removeClass('p_useico0').addClass('p_useico1');
        $("#m_UsePpt0").removeClass('p_useico1').addClass('p_useico0');
        $.ajax({
            url:"/web/teacher/trade/generateNoPayOrder",
            /*data:param,*/
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.retCode == '1101'){
                    $('#c_ErrorMsg').html('服务异常').fadeIn(200);  Disappear("#c_ErrorMsg");
                    return;
                }
                console.log(data);
                store.set("pptOrder",data.retData);
                $("#m_PptPay").fadeIn(200);
                queryRebateList();
                addPayInfo();
            }
        })
    })
}

//查询可用的代金券列表
function queryRebateList(){
    $.ajax({
        url:"/web/teacher/trade/queryRebateList",
        type:"post",
        dataType:"json",
        success:function(data){
            console.log(data);
            var list = data.retData;
            store.set("pptRebate",list[0]);
        }
    })
}

//使用金币或代金券点击确认
function addPayInfo(){
    $("#m_GO").off("click");
    $('#m_GO').on('click',function(){
        $('#m_PptPay').css('display','none');
        var param = {},pptRebate = store.get("pptRebate"),a = $(".p_useico1").attr("id");
        param.allAmount = 2000;
        if(a === "m_UsePpt0"){
            param.orderType = 1;
            param.amount = param.allAmount;
        }else if(a === "m_UsePpt1"){
            param.orderType = 2;
            param.rebateId = pptRebate.id;
            param.amount = pptRebate.rebateWealth;
        }
        $.ajax({
            url:"/web/teacher/trade/addPayInfo",
            data:param,
            type:"post",
            dataType:"json",
            success:function(data){
                console.log(data);
                store.set("pptOrder",data.retData);
                if(data.retCode === "3001"){
                    $("#m_PayMsg").fadeIn(200);
                }else{
                    $('#m_UpBox').fadeIn(200);
                }
            }
        })
    })
}
saveUserRemarkInfo();
//保存用户描述信息
function saveUserRemarkInfo(){
	$('#m_GoOn').off("click");
    $('#m_GoOn').on('click',function(){
        var m_PhoneTel = $("#m_PhoneTel").val(),QQ = $("#QQ").val(),weixin = $("#weixin").val(),remarks = $("#m_TextIn").val(),orderInfo = {};
        if(m_PhoneTel == ''){
            $('#c_ErrorMsg').html('请输入手机号').fadeIn(200);  Disappear("#c_ErrorMsg");
            return false;
        }else{
            if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(m_PhoneTel))){
                $('#c_ErrorMsg').html('手机号有误！').fadeIn(200);  Disappear("#c_ErrorMsg");
                return false;
            }
        }
        orderInfo.id = store.get("pptOrder").id
        orderInfo.mobile = m_PhoneTel;
        orderInfo.qq = QQ;
        orderInfo.weixin = weixin;
        orderInfo.requestDesc = remarks;
        $.ajax({
            url: "/web/teacher/trade/saveUserRemarkInfo",
            data: orderInfo,
            type: "post",
            dataType: "json",
            success: function (data) {
                console.log(data);
                $('#m_UpBox').hide();
                $('#c_ErrorMsg').html('定制成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                setTimeout(function(){location.reload();},1000);
            }
        });
    });
}

$(function(){
    init();
    generateNoPayOrder();
})