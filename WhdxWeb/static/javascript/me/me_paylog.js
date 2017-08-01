/**
 * Created by Renwencong on 2017/2/22 0022.
 */
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
/*************************私人定制ppt购买记录**************************/
var paylog = {
    log:function(){
        $.ajax({
            url:"/web/teacher/trade/queryPurList",
            type:"post",
            dataType:"json",
            success:function(data){
                console.log(data);
                var list = data.retData,htm = '';
                if(list.length==0){
                    $(".m_GoldList").html('<img src="../../static/image/kola/no.png" class="NoDataImg" alt="">');
                }else{
                    for(var i in list){
                        if(list[i].status === '1'){
                            continue;
                        }
                        htm += '<li id="'+list[i].resFileId+'">';
                        htm += '<span class="m_PurTimeT">'+list[i].createTime+'</span>';
                        if(list[i].payment.rebateId === null){
                            htm += '<span class="m_PurPrice">'+list[i].amount+'金币</span>';
                        }else{
                            htm += '<span class="m_PurPrice">优惠券</span>';
                        }
                        if(list[i].status === '2'){
                            htm += '<span class="m_PurStatus">待确认</span>';
                        }else if(list[i].status === '3'){
                            htm += '<span class="m_PurStatus">制作中</span>';
                        }else if(list[i].status === '4'){
                            htm += '<span class="fn_download m_PurStatus cup fc58">下载</span>';
                        }
                        htm += '</li>';
                    }
                    $(".m_GoldList").html(htm);
                    paylog.downloadClick();
                }
            }
        })
    },

    //下载点击事件
    downloadClick:function(){
        $(".fn_download").click(function(){
            var fileId = $(this).parent().attr("id");
            $.ajax({
                url:"/web/common/baidu/view",
                type:"post",
                dataType:"json",
                data:{"fileId":fileId},
                success:function(data){
                    console.log(data);
                    var a = document.createElement("a");
                    a.setAttribute("href",data.retData);
                    a.setAttribute("download","下载");
                    a.click();
                }
            })
        })
    }
}
$(function(){
    paylog.log();
})