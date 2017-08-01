/***************************邀请好友 By EchoVue 2017.05.18*****************************************/
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
                console.log(AllData)
                WxConfig(AllData)
            }
        }
    })
};
//微信响应配置
function WxConfig(data){
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
        var ShareUrl='http://www.wuhaodaoxue.com/appweb/weixin/model/inv/inv.html?openId='+$('#UserInfo').attr('data-OpenId');
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: '快来一起体验。让备课更轻松，学习更高效。', // 分享标题
            link: ShareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://www.wuhaodaoxue.com/appweb/weixin/static/images/inv/yaoqing.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                GiveTeaChance();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: '快来一起体验。让备课更轻松，学习更高效。', // 分享标题
            desc: '海量课件,轻松备课', // 分享描述
            link: ShareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://www.wuhaodaoxue.com/appweb/weixin/static/images/inv/yaoqing.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
            title: '快来一起体验。让备课更轻松，学习更高效。', // 分享标题
            desc: '海量课件,轻松备课', // 分享描述
            link: ShareUrl, // 分享链接
            imgUrl: 'http://www.wuhaodaoxue.com/appweb/weixin/static/images/inv/yaoqing.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareWeibo({
            title: '快来一起体验。让备课更轻松，学习更高效。', // 分享标题
            desc: '海量课件,轻松备课', // 分享描述
            link: ShareUrl, // 分享链接
            imgUrl: 'http://www.wuhaodaoxue.com/appweb/weixin/static/images/inv/yaoqing.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQZone({
            title: '快来一起体验。让备课更轻松，学习更高效。', // 分享标题
            desc: '海量课件,轻松备课', // 分享描述
            link: ShareUrl, // 分享链接
            imgUrl: 'http://www.wuhaodaoxue.com/appweb/weixin/static/images/inv/yaoqing.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });

};
//赠送用户机会
function GiveTeaChance() {
    var SubData={};
    //用户OpenId
    SubData.openId= $('#UserInfo').attr('data-OpenId');;
    SubData.type= '4';
    $.ajax({
        "type":"post",
        "url":" /api/wx/basic/addPriceNum",
        "dataType":"json",
        'data': SubData,
        success:function(data){

        }
    });
};
//获取公共OpenID
GetComOpenId();;
function GetComOpenId() {
    var UrlOpenId=Request.openId;
    if(!UrlOpenId){
        GetOpenId();
    }else {
        GetUserInfo(UrlOpenId);
    }
};
function GetOpenId(state) {
    var subData = {};
    subData.state = '3';
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
    });
};
//获取用户信息
function GetUserInfo(OpenId) {
    var subData = {};
    subData.openId = OpenId;
    $.ajax({
        "type":"post",
        "url":"/api/wx/getUserInfo",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            var Code=data.retCode;
            var AllData=data.retData;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                CreatUserInfo(AllData,OpenId)
            }
        }
    })
};
//创建用户信息
function CreatUserInfo(data,OpenId) {
    $('#UserName').html(data.userName);
    $('#Code').attr('src',data.qrcodeUrl);
    $('#UserInfo').attr('data-OpenId',OpenId);
    $('#Photo').attr('src',data.headImgUrl);
};






