/***************************中奖纪录 By EchoVue 2017.05.18*****************************************/

//获取微信配置
GetJsConfig()
function GetJsConfig() {
    var subData = {};
    subData.url =encodeURIComponent(window.location.href.split('#')[0]);
    $.ajax({
        "type":"post",
        "url":"/api/wx/getJsConfig",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var Code=data.retCode;
            var AllData=data.retData;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                WxConfig(AllData)
            }
        }
    })
};
//微信响应配置
function WxConfig(data) {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp:data.timestamp , // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
    wx.ready(function(){
        wx.hideOptionMenu();
        //获取公共OpenID
        GetComOpenId();
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });

};

function GetComOpenId() {
    var UrlOpenId=Request.openId;
    var LocalOpenId=store.get('openId');//查看缓存是否存有Openid
    if(!UrlOpenId){
        if(!LocalOpenId){
            GetOpenId();
        }else {
            GetUserInfo(LocalOpenId);
        }
    }else {
        store.set('openId',UrlOpenId);//存缓存
        GetUserInfo(UrlOpenId);
    }
}
function GetOpenId() {
    var subData = {};
    subData.state = '4';
    $.ajax({
        "type":"post",
        "url":"/api/wx/getUserOpenId",
        "dataType":"json",
        "data":subData,
        success:function (data) {
            var Code=data.retCode;
            var ThisUrl=data.retData;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                window.location.href=ThisUrl;
            }
        }
    })
};
//查询抽奖规则以及剩余抽奖机会列表
function GetUserInfo(OpenId) {
    var subData = {};
    subData.openId = OpenId;
    $.ajax({
        "type":"post",
        "url":"/api/wx/draw/getAwardInfo",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var Code=data.retCode;
            var AllData=data.retData.myRecordList;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                CreatWinList(AllData)
            }
        }
    })
};
//创建中奖列表
function CreatWinList(data) {
    var $Html='';
    if(!isEmptyObject(data)){
        for(var i=0;i<data.length;i++){
            var ThisData=data[i];
            var isAward=parseInt(ThisData.isAward);
            $Html+='<li data-id="'+ThisData.id+'">';
            $Html+='<span>'+ThisData.createDate+'</span>';
            $Html+='<span>获得了'+ThisData.awardName+'</span>';
            if(isAward==0){
                $Html+='<span class="fcFF">未发送</span>';
            }else {
                $Html+='<span class="fc56">已发送</span>';
            }
            $Html+='</li>';
        }
        $("#MyLuck").html($Html);
    }else {
        $Html='<li class="bacF4">暂无中奖</li>'
        $("#MyLuck").html($Html);
    }
};