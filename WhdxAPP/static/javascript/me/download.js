/**
 * Created by lgr on 2017/1/2.
 */
$(document).ready(function(){
    $(".dwonloadtecher").click(function(){
        window.location.href = "http://wuhaodaoxuewang.com:88/app/t.html";
    })
})
function ShareRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs) {
        $('body,html').html("暂时不支持IOS版本，更多详情<a href='http://www.bcbook.cn/'>五好导学网</a>") ;
        window.location.href="http://www.bcbook.cn";
    }else if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM){
        $('#DownloadMain').css('display','none');
        $('#Main').html("正在跳转到下载地址...<br/>如果是微信访问，请点击右上角选择从浏览器打开") ;
       setTimeout(function(){
           $('#Main').html('');
           $('#DownloadMain').css('display','block');
       },1000)
    }else {
        $('body,html').html("请使用手机访问，或者请前往官方<a href='http://www.bcbook.cn/'>五好导学网</a>") ;
        window.location.href="http://www.bcbook.cn";
    }
}
// ShareRedirect();

// GetAppDownLoad(2)
// GetAppDownLoad(3)
function GetAppDownLoad(type) {
    var SubData={}
    SubData.appType=type;
    $.ajax({
        "type": "post",
        "url": "/api/user/appVersion",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            console.log(AllData)
            if (codenum == 0){
                var Url=AllData.downloadUrl;
                if(type==1){
                    $("#Teacher").attr('href',Url);
                }else if(type==2){
                    $("#Student").attr('href',Url);
                }else {
                    $("#Parents").attr('href',Url);
                }
            }
            else {

            }
        }
    });
}
