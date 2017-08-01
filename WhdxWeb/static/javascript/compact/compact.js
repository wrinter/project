/******************************用户协议 By 徐扬 2017.05.09********************************/
CheckBrower();//检测浏览器版本
AppDowload();
function AppDowload() {
    $('#First_Dowload').on('click',function () {
        window.location.href='../../index.html?AppDoload='+true;
    })
}
function GetContent() {

}
// 获取用户协议
GetContent()
function GetContent(){
    var SubData={};
    SubData.code='content';
    $.ajax({
        "type": "post",
        "url": "/web/common/pcSysAlert ",
        "dataType":'json',
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            CreatArtBox(AllData);
        }
    });
};
// 创建文章盒子，将文章插到页面中
function CreatArtBox(data){
    var $ArtHtml='';
    if(typeof(data)!='undefined'){
        var content=data;
        content=content.replace(/\&lt;/g,'<')
        content=content.replace(/\&gt;/g,'>')
        content=content.replace(/\&quot;/g,'"')
        content=content.replace(/\&amp;quot;/g,'"')
        content=content.replace(/\&amp;nbsp;/g, "");
        content=content.replace(/\&amp;#39;/g,"'");
        $('#ArtBox').html(content);
    }
    else {
        $('#ArtBox').html('暂无数据');
    }
};
