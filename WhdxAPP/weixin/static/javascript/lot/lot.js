/***************************抽奖 By EchoVue 2017.05.18*****************************************/
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
            var codenum =parseInt(data.retCode.substr(0, 1));
            var Code=data.retCode;
            var AllData=data.retData;
            var awardList=AllData.awardList;
            var awardRecords=AllData.awardRecords;
            var myRecordList=AllData.myRecordList;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                CreatWinList(awardRecords.list);
                CreatUserInfo(AllData,OpenId);
                GetAwardRuleTips(AllData.awardRuleTips);
                GetChanceTips(AllData.presentChanceTips);

            }
        }
    })
};
//创建抽奖列表
function CreatWinList(data) {
    var $Html='';
    if(!isEmptyObject(data)){
       for(var i=0;i<data.length;i++){
           var ThisData=data[i];
           $Html+='<li data-userId="'+ThisData.userId+'">';
           $Html+='<span>'+ThisData.userName+'</span>';
           $Html+='<span>获得了'+ThisData.prizeName+'</span>';
           $Html+='<span>'+ThisData.createDate+'</span>';
           $Html+='</li>';
       }
       $("#WinList").html($Html);
    }
};
//创建用户信息
function CreatUserInfo(data,OpenId) {
    $("#Chance").html(data.presentChance);
    $("#Pointer").attr({'data-OpenId':OpenId,'data-Chance':data.presentChance});
};
//用户抽奖
window.onload=function () {
    StartOpration();
}
function StartOpration(){
    $('#Pointer').off('click');
    $('#Pointer').on('click',function(){
        var Chance=$(this).attr('data-Chance');
        var Status=$(this).attr('data-status');
        var OpenId=$(this).attr('data-OpenId');
        if(Chance<=0){
            $("#Chance").html(0);
            $("#Pointer").attr({'data-OpenId':OpenId,'data-Chance':0});
            alert('抽奖机会已用完~');
        }else {
            if(Status==false||Status=='false'){
                var $Animata='@keyframes Roll {0%{transform:rotate(0deg)}100%{transform:rotate('+360+'deg)}}';
                $('#NewStyle').html($Animata);
                $('#Turn').css({'animation':'Roll 0.'+3+'s linear infinite'});
                $('#Pointer').attr('data-status','true');
                GetluckyDraw(OpenId);
            }
        }
    });
};
//转盘转动机制
function StartRoll(Grade){
    var Index=4;//初速度
    var GoToWhere;//最终转向角度
    var $Animata='@keyframes Roll {0%{transform:rotate(0deg)}100%{transform:rotate('+360+'deg)}}';
    $('#NewStyle').html($Animata);
    $('#Turn').css({'animation':'Roll 0.'+Index+'s linear infinite'});
    var TurnTime=null;
    var ShowTime=null;
    if(TurnTime){clearInterval(TurnTime);}
    if(ShowTime){clearTimeout(ShowTime);}
    TurnTime=setInterval(function(){
        Index+=1;
        if(Index>=5){
            switch (Grade){
                case 0:GoToWhere=210;break;//没有中奖
                case 1:GoToWhere=30;break;//一等奖
                case 2:GoToWhere=150;break;//二等奖
                case 3:GoToWhere=90;break;//三等奖
            }
            var $Animata='@keyframes RollEnd {0%{transform:rotate(0deg);} 100%{transform:rotate('+GoToWhere+'deg);}}';
            $('#NewStyle').html($Animata);
            $('#Turn').css({'animation':''});
            $('#Turn').css({'transform':'rotate('+GoToWhere+'deg)'});
            ShowTime= setTimeout(function(){
                CreatWinBox(Grade)
            },100)
            clearInterval(TurnTime);
        }
        else {
            $('#Turn').css({'animation':'Roll  0.'+Index+'s linear infinite'});
        }
    },800)
};
//创建中奖盒子
function CreatWinBox(data) {
    var OpenId=$('#Pointer').attr('data-OpenId');;
    var Status=parseInt(data);
    var LuckName='';
    $('#Pointer').attr('data-status','false');
    switch (data){
        case 0:LuckName='没有中奖';break;//没有中奖
        case 1:LuckName='一等奖';break;//一等奖
        case 2:LuckName='二等奖';break;//二等奖
        case 3:LuckName='三等奖';break;//三等奖
    }
    if(Status>0){
        $('body').css('overflow','hidden');
        $("#WinMain").fadeIn(150);
        $("#IsWin").html('您获得');
        $("#WinGrade").html(LuckName);
    }
    $("#CloseWIn").off('click')
    $("#CloseWIn").on('click',function () {
        $('body').css('overflow','auto');
        $("#WinMain").fadeOut(150);
    })
};
//获取抽奖信息
function GetluckyDraw(OpenId) {
    var subData = {};
    subData.openId = OpenId;
    $.ajax({
        "type":"post",
        "url":"/api/wx/draw/luckyDraw",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            var AllData=data.retData;
            if(codenum==0){
                $("#Chance").html(AllData.presentChance);
                $("#Pointer").attr({'data-OpenId':OpenId,'data-Chance':AllData.presentChance});
                CheckluckyDraw(AllData);
            }else {
                alert(data.retMsg);
                $("#Chance").html(0);
                $("#Pointer").attr({'data-OpenId':OpenId,'data-Chance':0});
                $("#Turn").css({'animation':''});
                $('#Turn').css({'transform':'rotate('+0+'deg)'});
            }
        }
    })
};
//抽奖判断
function CheckluckyDraw(data) {
    var presentChance=parseInt(data.presentChance);
    var Grade=parseInt(data.state);
    if(presentChance<=0){
        $('#Pointer').attr('data-status','false');
        StartRoll(0);
    }
    else {
        StartRoll(Grade);
    }
};
//重构规则数据
function ResetRuleData(data) {
    var NewData=[];
    data=data.replace(/\&amp;/g,' ').replace(/\&lt;/g,'<').replace(/\&gt;/g,'>').replace(/\&quot;/g,'"').replace(/\&quot;/g,'"').replace(/\&nbsp;/g, "").replace(/\&#39;/g,"'");
    if(data.indexOf('</p>')!=-1){
        var Arr=[];
        var Result=data.split('</p>');
        for(var i=0;i<Result.length;i++){
            var Obj={};
            var ThisData=Result[i];
            ThisData= ThisData.replace(/<[^>]+>/g,"");
            if(ThisData==''||ThisData==null){}
            else {NewData[i]=ThisData;}
        }
    }
    console.log(NewData)
    return NewData;
};
//获取用户规则
function GetAwardRuleTips(data) {
    var NewData=ResetRuleData(data);
    var Html='';
    for(var i=0;i<NewData.length;i++){
        // Html+='<li><div class="NumBox"><span class="Role">'+(i+1)+'</span></div><div class="RuleConBox">'+NewData[i]+'</div></li>';
        Html+='<li><div class="RuleConBox">'+NewData[i]+'</div></li>'
    }
    $("#AwardRuleTips").html(Html)
};
//创建抽奖机会规则
function GetChanceTips(data) {
    var NewData=ResetRuleData(data);
    var Html='';
    for(var i=0;i<NewData.length;i++){
        // Html+='<li><div class="NumBox"><span class="Role">'+(i+1)+'</span></div><div class="RuleConBox">'+NewData[i]+'</div></li>';
        Html+='<li><div class="RuleConBox">'+NewData[i]+'</div></li>'
    }
    $("#ChanceTips").html(Html)
};
//用户一般操作
UserDefultOp()
function UserDefultOp() {
    $(".Ruleclose").on('click',function () {
        $(this).parents('.WinMain').fadeOut(150);
        BodyShow()
    });
    //用户规则弹窗
    $("#ARTBtn").on('click',function () {
        $('#AwardRuleTipsMian').fadeIn(150);
        BodyHidden()
    });
    //抽奖机会弹窗
    $("#CTBtn").on('click',function () {
        $('#ChanceTipsMain').fadeIn(150);
        BodyHidden()
    });
};




