/********************************************徐扬******************************************************/
/********************************************作业报告******************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
function getParameter(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
var PageNum=Request.pno;//获取页码
//获取列表
GetHomeWorkList(PageNum)
function GetHomeWorkList(pageNum){
    var Pages=0;
    var SubData={};
    SubData.pageNum=pageNum;
    SubData.pageSize=15;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/homeworkList",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                Pages=AllData.pages;
                store.set('PaperSize',AllData.pages);
                CreatHomeWorkListHtml(AllData.list);
            }
        }
    });
};
setTimeout(function(){
    Paging(store.get('PaperSize'))
},1000)
function Paging(PageSize){
    var totalRecords = PageSize*15;
    var pageNo = getParameter('pno');
    if(!pageNo){pageNo = 1;}
    kkpager.total = PageSize;
    kkpager.totalRecords = PageSize*15;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        total :PageSize, //总数据条数
        totalRecords : totalRecords, //链接前部
        hrefFormer : 'workpaper_index', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("PageNum",n);
            GetHomeWorkList(n);

            return false;
        }
    },true);
};
//创建作业报告列表
function CreatHomeWorkListHtml(data){
    if(data.length>0){
        $('#NoData').html('');
        $('#NoData').hide();
        var $HomeWorkListHtml='';
        for(var i=0;i<data.length;i++){
            $HomeWorkListHtml+='<li data-id="'+data[i].id+'">';
            $HomeWorkListHtml+='<p>'+data[i].assignTime+'</p>';
            $HomeWorkListHtml+='<p>'+data[i].obj+'</p>';
            //视频
            if(data[i].type=='300'){
                $HomeWorkListHtml+='<p><img src="../../static/image/workpaper/w_typeico0.png" alt="">'+data[i].name+'</p>';
            }
            //文章
            else if(data[i].type=='401'||data[i].type=='402'||data[i].type=='403'){
                $HomeWorkListHtml+='<p><img src="../../static/image/workpaper/w_typeico1.png" alt="">'+data[i].name+'</p>';
            }
            //其他
            else{
                $HomeWorkListHtml+='<p>'+data[i].name+'</p>';
            }
            $HomeWorkListHtml+='<p>';
            //视频
            if(data[i].type=='300'){
                $HomeWorkListHtml+='<a href="../../../model/workpaper/workpaper_VideoReport.html?paperAssignId='+data[i].id+'" class="w_Looka0">查看</a>';
                $HomeWorkListHtml+='<a href="../../../model/workpaper/workpaper_VideoReport.html?paperAssignId='+data[i].id+'" class="w_Looka1">查看</a>';
            }
            //文章
            else if(data[i].type=='401'||data[i].type=='402'||data[i].type=='403'){
                $HomeWorkListHtml+='<a href="../../../model/workpaper/workpaper_ArtReport.html?paperAssignId='+data[i].id+'" class="w_Looka0">查看</a>';
                $HomeWorkListHtml+='<a href="../../../model/workpaper/workpaper_ArtReport.html?paperAssignId='+data[i].id+'" class="w_Looka1">查看</a>';
            }
            //其他
            else{
                $HomeWorkListHtml+='<a href="../../../model/workpaper/workpaper_OtherReport.html?paperAssignId='+data[i].id+'&name='+data[i].name+'&assignTime='+data[i].assignTime+'&type='+data[i].type+'" class="w_Looka0">查看</a>';
                $HomeWorkListHtml+='<a href="../../../model/workpaper/workpaper_OtherReport.html?paperAssignId='+data[i].id+'&name='+data[i].name+'&assignTime='+data[i].assignTime+'&type='+data[i].type+'" class="w_Looka1">查看</a>';
            }
            $HomeWorkListHtml+='</p>';
            $HomeWorkListHtml+='</li>';
        }
        $('#w_HomeWorkList').html($HomeWorkListHtml);
        HomeWorkListHtmlCss();
    }
    else {
        NoDataImg();
        $('#NoData').css({'height':'600px','line-height':'500px'});
        $('#NoData').show();
        $('#Paging').css('display','none');
        $('#w_PaperData').css('display','none');
        $('#w_HomeWorkList').css('display','none');
    }
};
//作业报告样式
function HomeWorkListHtmlCss(){
    $('#w_HomeWorkList li').hover(function(){
        var i=$(this).index();
        $(this).css('border',"1px solid #65B113").find('.w_Looka1').css({display:"block"});
        if(i>0){$('#w_HomeWorkList li').eq(i-1).css('border-bottom',"1px solid white")}
    },function(){
        var i=$(this).index();
        $(this).css('border',"").find('.w_Looka1').css({display:"none"});
        if(i>0){$('#w_HomeWorkList li').eq(i-1).css('border-bottom',"")}
    })
};
