
/**
 * Created by wcd on 2016/12/26.
 */
SystemRedMsg();
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
var getWorkList=function () {};
getWorkList.prototype={
    constructor:getWorkList,//确定原型链
    init:function(){
       this.getPages("1");
       this.paging();
    },
    getList:function(list){
        var That=this;
        var li="";

        if(list.length>0){
            $('#NoData').html('');
            $('#NoData').hide();
            for(var k in list){
                li+="<li class='listLi' id='"+list[k].id+"'>";
                li+="<ul class='workList'>";
                li+="<li class='assignTime'>";
                li+="<span>"+list[k].assignTime+"</span>";
                li+="<span style='margin-left:2px;'>"+That.getWeek(list[k].assignTime)+"</span>";
                li+="</li>";
                li+="<li class='Title' title='"+list[k].title+"'>"+list[k].title+"</li>";
                li+="<li class='classes'>"+list[k].correctObj+"</li>";
                li+="<li class='subAndCorrectBox'>";
                li+="<div class='submitWork'>";
                li+="<span class='_name'>提交</span>";
                li+="<div class='s_progressBar'>";
                li+="<span class='s_progress "+list[k].id+"s_progress'>";
                li+="</span>";
                li+="</div>";
                li+="<span class='submitStu'>"+list[k].submitNum+"</span>";
                li+="<span class='line'>/</span>";
                li+="<span class='totalStu'>"+list[k].allNum+"</span>";
                li+="</div>";
                li+="<div class='correctWork'>";
                li+="<span  class='_name'>批改</span>";
                li+="<div class='c_progressBar'>";
                li+="<span class='c_progress "+list[k].id+"c_progress'>";
                li+="</span>";
                li+="</div>";
                li+="<span class='correctStu'>"+list[k].correctNum+"</span>";
                li+="<span class='line'>/</span>";
                li+="<span class='totalStu'>"+list[k].allNum+"</span>";
                li+="</div>";
                li+="<div class='deadlineTime'>";
                li+="<span>截止时间：</span>";
                li+="<span>"+list[k].endTime+"</span>";

                li+="</div>";
                li+="</li>";
                li+="<li class='end_li'>";
                if(list[k].endFlag=='yes'){
                    li+="<span class='end_flag'></span>";
                }else{
                    if(list[k].submitNum!=list[k].allNum){
                        li+="<span class='sendMessage' noSubmitList='"+list[k].noSubmitId+"'>催作业</span>";
                    }
                }
                if(list[k].correctNum==list[k].allNum){
                    li+="<li class='clickIn _look cup' hasselectable='"+list[k].hasSelectAble+"'>查看</li>";
                }else{
                    li+="<li class='clickIn _correct cup' submitNum='"+list[k].submitNum+"' correctNum='"+list[k].correctNum+"' allNum='"+list[k].allNum+"' hasselectable='"+list[k].hasSelectAble+"'>批改</li>";
                }
                li+="</ul>";
                li+="</li>";
            }
            $("#workList").html(li);
            $("#workList").show();
            this.clickTo();
            this.sendMessage();
            this.closeMessage();
        }
        else {
            NoDataImg();
            $("#workList").hide();
            $("#kkpager").hide();
            $('#NoData').show();
        }

    },
    getWeek:function(day){//通过日期，改为周几
        var arrDay=day.split("-");
        var x;
        var Day=new Date(arrDay[0],parseInt(arrDay[1]-1),arrDay[2]);
        switch (Day.getDay()){
            case 0:
                x="周日";
                break;
            case 1:
                x="周一";
                break;
            case 2:
                x="周二";
                break;
            case 3:
                x="周三";
                break;
            case 4:
                x="周四";
                break;
            case 5:
                x="周五";
                break;
            case 6:
                x="周六";
                break;
        }
       return x;//返回周几
    },
    getPages:function(pagesNum){
        var param={};
        var Pages=0;
        var that=this;
        param.type=2;
        param.pageNum=pagesNum;
        param.pageSize=5;
        $.ajax({
            type: "post",
             url: "/web/teacher/correct/selectCorrect",
            dataType: "json",
            data: param,
            async: false,//同步加载。解决undifind
            success:function(data){
                if(data.retCode="0000"){
                    Pages =data.retData.pages;
                    that.getList(data.retData.list);
                    that.setWid(data.retData.list);
                }
            }
        });
        return Pages;
    },
    paging:function(){//分页
        var _that=this;
        var PageNum=Request.pno;//获取页码
        var totalPage=this.getPages(PageNum);
        var totalRecords = totalPage*2;
        var pageNo = this.getParameter('pno');
        if(!pageNo){pageNo = 1;}
        //生成分页
        //有些参数是可选的，比如lang，若不传有默认值
        kkpager.generPageHtml({
            pno : pageNo, //总页码
            total : totalPage, //总数据条数
            totalRecords : totalRecords, //链接前部
            hrefFormer : 'homework_correct_index', //链接尾部
            hrefLatter : '.html',
            getLink : function(n){
                return this.hrefFormer + this.hrefLatter + "?pno="+n;
            },
            mode : 'click',//默认值是link，可选link或者click
            click : function(n){
                this.selectPage(n);
                _that.getPages(n);
                return false;
            },lang				: {
                firstPageText: '首页',
                firstPageTipText: '首页',
                lastPageText: '尾页',
                lastPageTipText: '尾页',
                prePageText: '上一页',
                prePageTipText: '上一页',
                nextPageText: '下一页',
                nextPageTipText: '下一页',
                totalPageBeforeText: '共',
                totalPageAfterText: '页',
                currPageBeforeText: '当前第',
                currPageAfterText: '页',
                totalInfoSplitStr: '/',
                totalRecordsBeforeText: '共',
                totalRecordsAfterText: '条数据',
                gopageBeforeText: ' 转到',
                gopageButtonOkText: '确定',
                gopageAfterText: '页',
                buttonTipBeforeText: '第',
                buttonTipAfterText: '页'

            }
        });
    },
    getParameter:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    },
    clickTo:function(){
        $(".clickIn").click(function(){
            var submitNum = $(this).siblings(".subAndCorrectBox").find(".submitWork").find(".submitStu").html();
            var allName = $(this).siblings(".subAndCorrectBox").find(".submitWork").find(".totalStu").html();
            var hasSelectAble = $(this).attr("hasselectable");
            if(allName === "0"){
                $('#c_ErrorMsg').html('班级暂无学生').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(submitNum==="0"){
                $('#c_ErrorMsg').html('暂无学生提交').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(hasSelectAble === 'no'){
                $('#c_ErrorMsg').html('系统已批改完，请去报告查看').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else{
                var Id=$(this).parents(".listLi").attr("id");
                store.set("correctAllNum",$(this).attr("allNum"));
                store.set("correctSubmitNum",$(this).attr("submitNum"));
                store.set("correctCorrectNum",$(this).attr("correctNum"));
                window.location.href="test_correct_correcting.html?id="+Id;
            }
        });
        //homework_correct_correcting.html
    },
    sendMessage:function(){
        $(".sendMessage").click(function(){
            var ids = $(this).attr("noSubmitList");
            $.ajax({
                url:"/web/teacher/correct/urgeHomework",
                type:"post",
                dataType:"json",
                data:{"ids":ids},
                success:function(data){
                    if(data.retCode == "0000"){
                        $('#NoIdentify').fadeIn(200);
                    }
                }
            });
        })
    },
    closeMessage:function(){
        $(".GoPayClose").click(function(){
            $('#NoIdentify').fadeOut(200);
        })
    },
    setWid:function(list){
        for(var k in list){
            $("."+list[k].id+"s_progress").css("width",list[k].submitNum/list[k].allNum*100+"%");
            $("."+list[k].id+"c_progress").css("width",list[k].correctNum/list[k].allNum*100+"%");
        }
    }
}
$(function() {
    new getWorkList().init();//实例化
});
