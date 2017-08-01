/**
 * Created by wcd on 2016/12/14.
 */
SystemRedMsg();
var extendLearning_detail=function(){};
extendLearning_detail.prototype={
    constructor:extendLearning_detail,//确定原型链
    init:function(){
        this.getDetail();//获取文章详情
    },
    getDetail:function(){//获取文章详情
        var param={};
        param.id=Request.id;
        var that=this;
        $.ajax({
            type: "post",
            url: "/web/shareresource/toartical ",
            dataType: "json",
            data:param,
            success:function(data){
                var codenum = parseInt(data.retCode.substr(0, 1));
                //判断你是否成功
                if (codenum == 0) {
                    console.log(data);
                    var d_list=data.retData;
                    var li="";
                    li+="<div class='detailTitle'>"+d_list.title;
                    li+="</div>";
                    var str=d_list.content;
                    str=str.replace(/\&lt;/g,'<');
                    str=str.replace(/\&gt;/g,'>');
                    str=str.replace(/\&quot;/g,'"');
                    str=str.replace(/\&amp;nbsp;/g, "");
                    li+="<div class='d_content'>"+str+"</div>";
                    $(".learnDetail").html(li);
                }
                proAndNext(data.retData.id);
            }
        });
    }
}
/*分享*/
$('#c_Share').hover(function(){
    $(this).find('.p_shareico ').removeClass('p_shareico ').addClass('p_yetshareico');
},function(){
    $(this).find('.p_yetshareico').removeClass('p_yetshareico ').addClass('p_shareico');
})
$('#c_Share').on('click',function(){
    $('#Share').fadeIn(150);
    Share(window.location.href);
    //AddShare();
});
browserRedirect();
function GoNoClass(){
    $('.AllNoHasClas').fadeIn(200)
    $('.GoClassClose').on('click',function(){$('.AllNoHasClas').fadeOut(200)});
};
function AddShare(){
    var ArticleData={};
    ArticleData.resId=Request.id;
    $.ajax({
        "type": "post",
        "url": "/web/common/res/share",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
        }
    });

};

/*上一篇/下一篇*/
/*创建文章列表数组*/
function CreatArtArr(a){
    var ArtTitle={};
    var TitleId=[];
    var TitleName=[];
    var title=a;
    for(var k=0;k<title.length;k++){
        TitleId.push(title.eq(k).find('.id').html());
        TitleName.push(title.eq(k).find('.name').html());
    }
    ArtTitle.ArtId=TitleId;
    ArtTitle.ArtName=TitleName;
    store.set('ArtTitle',ArtTitle);
};




function proAndNext(extendId){
    console.log()
    var extendList = store.get('ArtTitle');
    if(extendList.length>0){
        for(var i in extendList){
            if(extendId === extendList[i].id){
                if(extendList[Number(i)-1]!=null){
                    var doc = document.createElement("a");
                    doc.setAttribute("href","extendLearning_detail.html?id="+extendList[Number(i)-1].id);
                    doc.appendChild(document.createTextNode(extendList[Number(i)-1].name));
                    $("#up").append(doc);
                }else{
                    $("#up").hide();
                    $("#m030").hide();
                }
                if(extendList[Number(i)+1]!=null){
                    var doc = document.createElement("a");
                    doc.setAttribute("href","extendLearning_detail.html?id="+extendList[Number(i)+1].id);
                    doc.appendChild(document.createTextNode(extendList[Number(i)+1].name));
                    $("#go").append(doc);
                }else{
                    $("#go").hide();
                    $("#m030").hide();
                }
                return;
            }
        }
    }
}
$(function() {
    new extendLearning_detail().init();//实例化
})