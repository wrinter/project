/****************************************Created by 徐扬 on 2016/12/22.*****************************************/
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
//用户预充值
function GetUserPrePayInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/user/userPrePayInfo",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;//总数据
            var AllactiveList=AllData.activeList;//支付选项
            var AllpayTypeList=AllData.payTypeList;//支付方式
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatUserInfoHtml(AllData)
                CreatActiveListHtml(AllactiveList);//创建支付选项列表
                CreatPayTypeListHtml(AllpayTypeList)
            }
        }
    });
}
GetUserPrePayInfo();
//创建用户信息表
function CreatUserInfoHtml(data){
    var $UserHtml='';
        $UserHtml+='<span class="fs18">当前账户：</span>';
        $UserHtml+='<span class="fs24" data-Userid="'+data.userId+'">'+data.userName+'（余额：'+data.wealth+'金币）</span>';
    $('#m_UserInfo').html($UserHtml)
};
//创建支付选项列表
function CreatActiveListHtml(data){
    var $ActiveList='';
    for(var i=0;i<data.length;i++){
        $ActiveList+='<li data-id="'+data[i].id+'" data-price="'+data[i].price+'"  data-activeTitle="'+data[i].activeTitle+'" data-status="'+data[i].status+'" >';
        $ActiveList+='<p class="fs18 mt255 fc66">'+data[i].price+'元</p>';
        $ActiveList+='<p class="fs24 fc65">'+data[i].wealth+'金币</p>';
        $ActiveList+='<i class="spriteImg p_yesico m_checkimg dino"></i>';
        $ActiveList+='</li>'; 
    }
    $('#ActiveList').html($ActiveList).find('li').eq(0).addClass('m_AmountChoice m_IsChoice').find('.m_checkimg').css('display','block');
    $('#m_SumPay').html(data[0].price);
    IsChoiceCss();
};
//创建支付方式
function CreatPayTypeListHtml(data){
    var $PayTypeListHtml='';
    for(var i=0;i<data.length;i++){
        $PayTypeListHtml+='<li data-payType="'+data[i].value+'">';
        if(data[i].value=='wxpay'){
            $PayTypeListHtml+='<i class="spriteImg p_wxico fl m1040"></i>';
        }
        if(data[i].value=='alipay'){
            $PayTypeListHtml+='<i class="spriteImg p_zfbico fl m3040"></i>';
        }
        $PayTypeListHtml+='<span class="fc33 fl">'+data[i].label+'</span>';
        $PayTypeListHtml+='<i class="spriteImg p_yesico m_checkimg dino"></i>';
        $PayTypeListHtml+='</li>';
    }
    $('#PayTypeList').html($PayTypeListHtml).find('li').eq(0).addClass('m_TypeChoice m_IsChoice').find('.m_checkimg').css('display','block');;
    IsChoicePayTypeCss();

};
//选中支付金额
var payActiveId=0;//支付金额的id
var amount=0;//支付的金额
function IsChoiceCss(){
    $('#ActiveList li').on('click',function(){
        $(this).addClass('m_AmountChoice');
        $(this).addClass('m_IsChoice').find('.m_checkimg').css('display','block');
        $(this).siblings().removeClass('m_IsChoice').find('.m_checkimg').css('display','none');
        $(this).siblings().removeClass('m_AmountChoice');
        amount=$(this).attr('data-price');
        $('#m_SumPay').html(amount)
        return amount;
    });
};
//选中支付方式
var IspayType='';
function IsChoicePayTypeCss(){
    $('#PayTypeList li').on('click',function(){
        $(this).addClass('m_IsChoice m_TypeChoice').find('.m_checkimg').css('display','block');
        $(this).siblings().removeClass('m_IsChoice m_TypeChoice').find('.m_checkimg').css('display','none');
    })
};
//生成充值订单
var OrderId='';
function CreatChargeOrder(payActiveId,amount){
    var SubData={};
    SubData.payActiveId=payActiveId;
    SubData.amount=amount;
    SubData.channel='web';
    $.ajax({
        "type": "post",
        "url": "/web/user/generateChargeOrder",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                OrderId=AllData.chargeOrderId;
                var payType=$('.m_TypeChoice').attr('data-payType')
                OrderPayment(payType,amount,OrderId);
            }
        }
    });
};
//订单支付
function OrderPayment(payType,payAmount,orderId){
    var PayData={};
    PayData.orderId=orderId;
    PayData.payAmount=payAmount;
    PayData.payType=payType;
    PayData.channel='web';
    $.ajax({
        "type": "post",
        "url": "/web/user/orderPayment",
        "dataType": "json",
        "data": PayData,
        beforeSend:function () {
            $('#c_ErrorMsg').html('提交中，即将为您跳转').fadeIn(200);  Disappear("#c_ErrorMsg");
        },
        success:function (data) {
            $('#c_ErrorMsg').fadeOut(1)
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                //判断是否请求成功
                if(AllData.rtnType=='Y'||AllData.rtnType=='y'){
                    //支付宝支付
                    if(payType=='alipay'){
                        $('#ApplyPayUrl').html(AllData.alipayHtml);
                        setTimeout(function(){
                            IsCheckApplyStatusTimer=setInterval(IsCheckApplyStatus,3000);
                        },3000)
                    }
                    //微信支付
                    if(payType=='wxpay'){
                        $('#m_WeiXinCode').html('').qrcode({
                            render    : "canvas",//也可以替换为table
                            width   : 250,
                            height  : 250,
                            text      : AllData.codeUrl
                        });
                        $('#WeiXin').fadeIn(200);
                        setTimeout(function(){
                            CheckStatusTimer=setInterval(getOrderInfo,3000);
                        },3000)
                        $('#m_WeiXinClose').on('click',function(){
                            $('#WeiXin').fadeOut(200);
                        })
                    }
                }
                else {
                    $('#c_ErrorMsg').html('提交失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        }
    });
};
setInterval(function(){
    if($('.m_IsChoice').length==2){
        $('#m_PayBtn').css("background",'#65B113');
    }
},1);
//支付
$('#m_PayBtn').on('click',function(){
    if($('.m_IsChoice').length==2){
        var payActiveId=$('.m_AmountChoice').attr('data-id');
            amount=$('.m_AmountChoice').attr('data-price');
        $(this).css("background",'#65B113');
        CreatChargeOrder(payActiveId,amount);
    }
});
var CheckStatusTimer=null;
//检测微信支付成功状态
function getOrderInfo(){
    var SubData={};
    SubData.chargeOrderId=OrderId;
    $.ajax({
        "type": "post",
        "url": "/web/user/getOrderInfo",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData.status==1){
                    clearInterval(CheckStatusTimer);
                    $('#c_ErrorMsg').html('支付成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                    $('#WeiXin').fadeOut(200);
                    GetUserPrePayInfo();
                }
            }
        }
    });
};
var IsCheckApplyStatusTimer=null;
//检测支付宝支付成功状态
function IsCheckApplyStatus(){
    var act=Request.act;
    if(act=="success"){
        clearInterval(IsCheckApplyStatusTimer);
        $('#c_ErrorMsg').html('支付成功').fadeIn(200);  Disappear("#c_ErrorMsg");
        GetUserPrePayInfo();
    }
}

