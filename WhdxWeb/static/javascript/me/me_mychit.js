/**
 * Created by Renwencong on 2017/2/22 0022.
 */
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
/*************************查询可用的代金券列表***********************/
function queryRebateList(){
    $.ajax({
        url:"/web/teacher/trade/queryAllRebates",
        type:"post",
        dataType:"json",
        success:function(data){
            console.log(data);
            var list = data.retData;
            var htm = "";
            if(list.length<=0){
                htm+='<img class="m_noData" src="../../../static/image/kola/no.png">';
            }else{
                for(var i in list){
                    if(list[i].status === '1'){
                        htm+='<li>';
                        htm+='<i class="spriteImg c_optico1"></i>';
                        htm+='<div class="trade_div"><img class="tradeImg" src="../../static/image/me/m_adverico.png" alt="">';
                        htm+='<span class="data_span">有效期至'+list[i].endTime+'</span>'
                        htm+='</div>';
                        htm+='<input type="button" value="立即使用 " class="useNow bac65">';
                        htm+='</li>';
                    }else{
                        htm+='<li>';
                        htm+='<i class="spriteImg c_optico0"></i>';
                        htm+='<div class="trade_div"><img class="tradeImg" src="../../static/image/me/m_adverico.png" alt="">';
                        htm+='<span class="data_span">有效期至'+list[i].endTime+'</span>'
                        htm+='</div>';
                        htm+='<input type="button" value="立即使用 " class="useNow bacCC">';
                        htm+='</li>';
                    }
                }
            }
            $(".m_MyChit").html(htm);
            toPpt();
        }
    })
}
function toPpt(){
    $(".useNow").click(function(){
        if($(this).hasClass("bac65")){
            window.location.href = "me_ppt.html";
        }
    })
}
queryRebateList();