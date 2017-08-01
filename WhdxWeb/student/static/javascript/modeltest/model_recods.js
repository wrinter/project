/**
 * Created by lgr on 2017/4/20.
 */
tbodytr = $(".tbodytr").clone(true);
function UserOpration(){
    //Tab切换
    $('.m_MsgBtn').on('click',function(){
        var ThisIndex=$(this).index();
        $(this).removeClass().addClass('m_MsgBtn m_Btnbg1');
        $(this).siblings().removeClass().addClass('m_MsgBtn m_Btnbg0');
        $('.m_MsgList').eq(ThisIndex).css("display",'block').siblings('.m_MsgList').css("display",'none');
    });
    $('.model_a').on('click',function(){
        $(this).attr("src","../../static/image/modetest/s_right.png").addClass("addobject");
        $(".model_b").attr("src","../../static/image/modetest/s_no.png").removeClass("addobject");
        var subjectId= $(this).attr("subjectId");
        sessionStorage.setItem('IsMsgType',0);
        getList();
        Paging(sessionStorage.getItem('SystemSize'),sessionStorage.getItem("SysMsgPageNum"))
    });
    $('.model_b').on('click',function(){
        $(this).attr("src","../../static/image/modetest/s_right.png").addClass("addobject");
        $(".model_a").attr("src","../../static/image/modetest/s_no.png").removeClass("addobject");
        var subjectId= $(this).attr("subjectId");
        sessionStorage.setItem('IsMsgType',1);
        getList();
        Paging(sessionStorage.getItem('SystemSize'),sessionStorage.getItem("EntryMsgPageNum"));
    });
}
var pageNum = 1;
getList();
sessionStorage.setItem('IsMsgType',0);
sessionStorage.setItem("SysMsgPageNum",1);
sessionStorage.setItem("EntryMsgPageNum",1);
setTimeout(function(){
    Paging(sessionStorage.getItem('SystemSize'),sessionStorage.getItem("SysMsgPageNum"));
    UserOpration();
},400);
//分页
function Paging(SystemSize,pageNo){
    if(pageNo>SystemSize){
        pageNo=SystemSize;
    }
    kkpager.total = SystemSize;
    kkpager.totalRecords = SystemSize*10;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        hrefFormer : 'message', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            if(sessionStorage.getItem('IsMsgType')==0||sessionStorage.getItem('IsMsgType')=='0'){
                sessionStorage.setItem("SysMsgPageNum",n);
                var pageNum = sessionStorage.getItem("SysMsgPageNum");
                getList(n);
            }else if(sessionStorage.getItem('IsMsgType')==1||sessionStorage.getItem('IsMsgType')=='1'){
                sessionStorage.setItem("EntryMsgPageNum",n);
                getList(n);
            }
        }
    },true);
};
function getList(pageNum){
    var subjectId = $(".addobject").attr("subjectid");
    var Pages=0;
    var tbody = $(".tbody");
    tbody.html("");
    if(pageNum == undefined){
        pageNum = 1;
    }
    var SubData={};
    SubData.subjectId = subjectId;
    SubData.status = 1;
    SubData.pageNum = pageNum;
    SubData.pageSize = 10;
    $.ajax({
        type : "post",
        url : "/web/student/modeltest/questionsRecord",
        data : SubData,
        async:false,
        success : function(data){
            $(".nothing").hide();//空白页消失
            if(data.retCode == "0000"){
                var tbody = $(".tbody");
                Pages = data.retData.pages;//总页数
                getTestlist(data);
                sessionStorage.setItem('SystemSize',Pages);
            }else{
                sessionStorage.setItem('SystemSize',1);
                if(!$(".tbody").html()){
                    $(".nothing").show();
                }else{
                    $(".nothing").hide();
                }
            }
        }
    });
    return Pages;
}
function  getTestlist(data){
    var tbody = $(".tbody");
    $(".tbody").html('');
    for(var i = 0;i<data.retData.list.length;i++){
        var newclone = tbodytr.clone(true);
        var Dtrue = data.retData.list[i];
        //判空
        for(var k in Dtrue){
            if(!Dtrue[k]){
                Dtrue[k]= "--";
            }
        }
        var paperName = Dtrue.paperName;
        var status = Dtrue.status;
        var id = Dtrue.id;
        var useTime = Dtrue.useTime;
        var userScore = Dtrue.userScore;
        var startTime = Dtrue.startTime;
        //分页参数
        newclone.find(".s_name").text(startTime);
        newclone.find(".s_time").text(useTime+"分钟");
        newclone.find(".s_userScore").text(userScore+"分");
        newclone.find(".s_status").find(".model_botton").attr("id",id).text("查看");
        newclone.find(".s_status").on("click",function(){
            var paperRecordid = $(this).find(".model_botton").attr("id");
            sessionStorage.setItem("paperRecordid",JSON.stringify(paperRecordid));
            window.open("model_Details.html");
        })
        newclone.appendTo(tbody);
    }
}//data