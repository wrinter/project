/**
 * Created by Administrator on 2017/4/12.
 */
$(function() {
    GetHtml("../../model/common/Head.txt","#Com_Head");//引入导航
    CheckBrower();
    function List(){}
    List.prototype = {
        init : function(){
            this.getWeekData();
            this.getReportData();
            this.Weekreport();//点击周报
        },
        getWeekData:function(){
            $.ajax({
                type: "post",
                url: "/web/student/homework/view_report/last_weekly",
                async: false,
                success: function (data) {
                    showLastWeek(data);
                }
            });
        },
        getReportData:function(){
            var pageNum = Request.page != null ? Request.page : 1  ;//获取页码
            this.getList(pageNum);
            paging(pageNum);
        },
        getList:function(pageNum) {
            var SubData = {};
            SubData.pageNo = pageNum;
            SubData.pageSize = 10;
            $.ajax({
                type: "post",
                url: "/web/student/homework/view_report/report_list",
                data: SubData,
                async: false,
                success: function (data) {
                    showList(data);
                }
            });
        },
        Weekreport : function(){
            $(".Presention_listtheme").on("click",function(){
                var id = $(this).attr("id");
                if(id == undefined){

                }else{
                    sessionStorage.setItem("weekId",id);
                }
                //window.location.href = "weekly.html";
                window.open("weekly.html")
            })
        }
    }
    function showList(data){
        if (data.retCode == "0000") {
            var content = $(".r_content");
            var ultemp = $('.r_content ul').eq(0);
            var ulTempC =  ultemp.clone(true);
            content.html('');
            list.pages = data.retData.pages;//总页数
            if (data.retData.list.length == 0) {
                $('.r_head').hide();
                $('.r_content').hide();
                $(".Presention,.Paging").hide();
                $(".r_noData").fadeIn();
            } else {
                $('.r_head').show();
                $('.r_content').show();
                for (var i = 0; i < data.retData.list.length; i++) {
                    var temp = data.retData.list[i];
                    for (var k in temp) {
                        if (!temp[k]) {
                            temp[k] = "--";
                        }
                    }
                    var newclone = ulTempC.clone(true);
                    newclone.find(".r_assign").text(temp.arrangementTime);
                    newclone.find(".r_typeName").text(temp.subjectName);
                    newclone.find(".r_workType").text(temp.typeName);
                    newclone.find(".r_workName").text(temp.paperName).attr("title",temp.paperName);
                    newclone.find(".r_check").attr({"type":temp.type,"id":temp.id,"status":temp.status,"paperId":temp.paperId});
                    newclone.attr({"type":temp.type,"id":temp.id,"status":temp.status,"paperId":temp.paperId});
                    //待批改
                    if (temp.status == "4") {
                        newclone.find(".r_wait").show();
                    }else{
                        newclone.find(".r_wait").hide();
                    }
                    //查看
                    newclone.find(".r_check").on("click",function(e){
                        var type = $(this).attr("type");
                        var id = $(this).attr("id");
                        var paperId = $(this).attr("paperId");
                        toCheck(type,id,paperId);
                        stopBubble(e);
                    });
                    newclone.appendTo(content);

                }
                $('.r_body').unbind('click').on('click',function(){
                    var type = $(this).attr("type");
                    var id = $(this).attr("id");
                    var paperId = $(this).attr("paperId");
                    toCheck(type,id,paperId);
                });
            }
        }else{
            $(".Presention,.Paging").hide();
        }
    }
    function toCheck(type,id,paperId){
        var sub = {};
        sub.type = type;
        sub.id = id;
        sessionStorage.setItem("sub",JSON.stringify(sub));//储存id
        if(type == 300){
            window.location.href = "videoreport.html?id="+id;
        }else if(type == 401 || type == 402){
            window.location.href = "readreport.html?id="+id+"&paperId="+paperId;
        }else if(type == 403){
            window.location.href = "readtimereport.html?id="+id+"&paperId="+paperId;
        }else if(type == 203){
            window.location.href = "auditionreport.html?id="+id;
        }else if(type == 900){
            window.location.href = "weekreport.html?id="+id;
        }else {
            window.location.href = "testreport.html?id="+id+"&type="+type;
        }
    }
    function showLastWeek(data){
        if(data.retCode=="0000"){
            if(data.retData==null){
                $('.r_more').hide();
                $('.r_name').addClass('r_cname').removeClass('r_name');
                $('.r_cname').html('过去一周还未做作业呢！');
            }else{
                var startDate = data.retData.startDate;
                var endDate = data.retData.endDate;
                var weekStr = "一周大数据:"+formatDate(startDate)+"--"+formatDate(endDate)+"作业周报";
                $('.r_name').html(weekStr);
                $('.r_name').attr('id',data.retData.id);
                $('.r_more').show();
            }
        }
    }
    function paging(PageNum){
        var totalPage=list.pages;
        var totalRecords = totalPage*10;
        var pageNo = getParameter('page');
        if(!pageNo){pageNo = 1;}
        //生成分页
        //有些参数是可选的，比如lang，若不传有默认值
        kkpager.generPageHtml({
            pno : pageNo, //总页码
            total : totalPage, //总数据条数
            totalRecords : totalRecords, //链接前部
            hrefFormer : 'reportlist', //链接尾部
            hrefLatter : '.html',
            getLink : function(n){
                return this.hrefFormer + this.hrefLatter + "?page="+n;
            },
            mode : 'click',//默认值是link，可选link或者click
            click : function(n){
                this.selectPage(n);
                list.getList(n)
                return false;
            }
        });
    }
    function getParameter(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    };
    //周报
    $('.r_name').click(function(){
        var id = this.id;
        if(id!=""){
            sessionStorage.setItem("weekId",id);
            window.open('weekreport.html');
        }
    });
    $('.r_more').on('click',function(){
        window.open('weeklist.html');
    });
    list = new List();
    list.init();
});