/********************************************个人中心投稿列表By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
//获取投稿记录列表
GetUpList(1);
function GetUpList(n){
    var Pages='';
    var SubData={};
    SubData.pageNum=n;
    SubData.pageSize=10;
    $.ajax({
        type:"post",
        url:"/web/student/center/contribute/upload/list",
        dataType: "json",
        data:SubData,
        success: function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                Pages=AllData.pages;
                store.set('ConTriPageSize',Pages);
                CreatUpList(AllData.list);
            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }

        }
    });
};
setTimeout(function(){
    Paging();
},200)
//分页
function Paging(){
    var totalRecords = store.get('ConTriPageSize')*10;
    var pageNo = getParameter('pno');
    if(!pageNo){pageNo = 1;}
    store.set("ConTriPageNum",pageNo);
    kkpager.total = store.get('ConTriPageSize');
    kkpager.totalRecords = store.get('ConTriPageSize')*10;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        total : store.get('ConTriPageSize'), //总数据条数
        totalRecords : totalRecords, //链接前部
        hrefFormer : 'me_conlist', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("ConTriPageNum",n);
            GetUpList(n);
            return false;
        }
    },true);
};
//创建投稿记录列表
function CreatUpList(data){
    var $UpListHtml='';
    if(data.length>0){
        $('#m_Nolist').css('display','none');
        for(var i=0;i<data.length;i++){
            $UpListHtml+='<li data-id="'+data[i].id+'">';//投稿Id
            $UpListHtml+='<span title="'+data[i].title+'">'+data[i].title+'</span>';//标题
            $UpListHtml+='<span>'+data[i].createTime+'</span>';//创建时间
            if(data[i].status==0||data[i].status=='0'){
                $UpListHtml+='<span>未审核</span>';
            }else if(data[i].status==1||data[i].status=='1'){
                $UpListHtml+='<span>审核中</span>';
            }else if(data[i].status==2||data[i].status=='2'){
                $UpListHtml+='<span>审核通过</span>';
            }else {
                $UpListHtml+='<span>审核未通过</span>';
            }
            if(data[i].rewardGold==0){
                $UpListHtml+='<span >— —</span>';
            }else {
                $UpListHtml+='<span >金币+'+data[i].rewardGold+'</span>';
            }

            if(data[i].status==2||data[i].status=='2'||data[i].status==3||data[i].status=='3'){
                $UpListHtml+='<span><i class="ArrowsFont m_DelIco">&#xe65f;</i></span>';
            }else {
                $UpListHtml+='<span>— —</span>';
                //$UpListHtml+='<span><i class="ArrowsFont m_DelIco">&#xe65f;</i></span>';
            }
            $UpListHtml+='</li>';
        }
    }
    else {
        $('#m_Nolist').css('display','block');
    }
    $('#m_ConList').html($UpListHtml);
    DelOpration();
};
//删除记录
function DelRecord(contributionId){
    var SubData={};
    SubData.contributionId=contributionId;
    $.ajax({
        type:"post",
        url:"/web/student/center/contribute/upload/delete",
        dataType: "json",
        data:SubData,
        success: function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                GetUpList();
                setTimeout(function(){
                    Paging();
                },200)

            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }

        }
    });
};
//删除操作
function DelOpration(){
    $('.m_DelIco').on('click',function(){
        var contributionId=$(this).parents('li').attr('data-id');
        DelRecord(contributionId);
    })
};













