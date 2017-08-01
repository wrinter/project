/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
/************************************************金币*******************************************************/
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
$('#m_MyGoldNum1').html(Request.Gold)
/*获取金币*/
GetUserGold(1);
function GetUserGold(n){
    var Pages='';
    var SubData={};
    SubData.pageNum=n;
    SubData.pageSize=15;
    $.ajax({
        "type":"post",
        "url":"/web/user/financelog",
        "dataType":"json",
        data: SubData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                Pages=AllData.pages;
                console.log(Pages)
                store.set('PageSize',Pages);
                CreatUserGold(data);
            }
        }
    });
};
setTimeout(function(){
    Paging();
},200)

function CreatUserGold(data){
    var $html='';
    for(var i=0;i<data.retData.list.length;i++){
        $html+='<li>';
        $html+='<span class="m_GoldTime w25">'+data.retData.list[i].createTime+'</span>';
        if(data.retData.list[i].label==null||data.retData.list[i].label==''){
            $html+='<span class="m_GoldFrom w25">赠送</span>';
        }
        else {
            $html+='<span class="m_GoldFrom w25">'+data.retData.list[i].label+'</span>';
        }
        $html+='<span class="m_GoldInfo w25">'+data.retData.list[i].wealth+'</span>';
        $html+='<span class="m_GoldInfo w25">'+data.retData.list[i].remarks+'</span>';
        $html+='</li>';
    }
    $('#m_GoldList').html($html);
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
        hrefFormer : 'me_mygold', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            GetUserGold(n);
            store.set("PageNum",n);
            return false;
        }
    },true);
};


