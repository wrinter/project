/**
 * Created by Administrator on 2016/12/7.
 */
//获取id
function getUrl(){
    var url =window.location.href;
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u= u[1].replace(/id=/,"");
        return u ;
    }
}
var post_id=getUrl().split("&")[0];
var to_uuid=getUrl().split("&")[1].split("=")[1];
//获取文章详情
getArticle();
function getArticle(){
    $.ajax({
        type: "post",
        url: "/api/teacher/catlogarticle/article",
        data: {
            "id": post_id,
            "uuid": to_uuid
        },
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                var str='';
                str=data.retData.content;
                str=str.replace(/\&lt;/g,'<');
                str=str.replace(/\&gt;/g,'>');
                str=str.replace(/\&quot;/g,'"');
                str=str.replace(/\&amp;nbsp;/g, "");
                $(".prepare_details_main").html(str);//课件介绍文本
            }
        }
    });
}
