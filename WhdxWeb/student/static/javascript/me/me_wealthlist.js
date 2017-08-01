/********************************************个人中心金币记录By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
$('#m_wealth').html(Request.wealth);
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
//获取金币记录列表
GetFinanceLog(1)
//获取总页码
function GetFinanceLog(n){
    var Pages='';
    var SubData={};
    SubData.pageNum=n;
    SubData.pageSize=10;
    $.ajax({
        type:"post",
        url:"/web/student/center/financelog",
        dataType: "json",
        data: SubData,
        success: function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                Pages=AllData.pages;
                store.set('PageSize',Pages);
                CreatFinanceLogList(AllData.list);
            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }

        }
    });
};
setTimeout(function(){
    Paging();
},200)

//创建金币记录列表
function CreatFinanceLogList(data){
    var $FinanceLogList='';
    if(data.length>0){
        $('#m_Nolist').css('display','none');
        for(var i=0;i<data.length;i++){
            $FinanceLogList+='<li>';
            $FinanceLogList+='<span>'+data[i].createTime+'</span>';//时间
            if(data[i].label==''||data[i].label==null){
                $FinanceLogList+='<span>赠送</span>';//名称
            }else {
                $FinanceLogList+='<span>'+data[i].label+'</span>';//名称
            }
            if(data[i].wealth>0){
                $FinanceLogList+='<span>金币 &nbsp;+'+data[i].wealth+'</span>';//金币数量
            }else {
                $FinanceLogList+='<span>金币 &nbsp;'+data[i].wealth+'</span>';//金币数量
            }

            if(data[i].remarks==''||data[i].remarks==null){
                $FinanceLogList+='<span>暂无</span>';//备注
            }else {
                $FinanceLogList+='<span>'+data[i].remarks+'</span>';//备注
            }
            $FinanceLogList+='</li>';
        }
    }
    else {
        $('#m_Nolist').css('display','block');
    }
    $('#m_ConList').html($FinanceLogList);

};

//分页
function Paging(){
    var totalRecords = store.get('PageSize')*10;
    var pageNo = getParameter('pno');
    if(!pageNo){pageNo = 1;}
    store.set("PageNum",pageNo);
    kkpager.total = store.get('PageSize');
    kkpager.totalRecords = store.get('PageSize')*10;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        total : store.get('PageSize'), //总数据条数
        totalRecords : totalRecords, //链接前部
        hrefFormer : 'me_wealthlist', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("PageNum",n);
            GetFinanceLog(n);
            return false;
        }
    },true);
};













