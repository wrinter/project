/********************************************关于我们**Created by Echonessy on 2017/6/1.****************************************************/
ShowWeixinCode();
$('.NavLogo').click(function(){
    window.location.href='/index.html';
})
getArticle();
function getArticle(){
    var parmas = {};
    parmas.code = "about_us_keys"
    $.ajax({
        type : "post",
        url : "/web/common/pcSysAlert",
        data : parmas,
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                var str = data.retData;
                str=str.replace(/\&lt;/g,'<')
                str=str.replace(/\&gt;/g,'>')
                str=str.replace(/\&quot;/g,'"')
                str=str.replace(/\&amp;quot;/g,'"')
                str=str.replace(/\&amp;nbsp;/g, "");
                str=str.replace(/\&amp;#39;/g,"'");
                $(".Content").html(str)
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
css();
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            console.log(data)
            if(data.retCode == "0000"){
                var retData = data.retData;
                $("head").append(retData);
            }
        },
        error:function(e){
            console.log(e)
        }
    })
}