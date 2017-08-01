/**
 * Created by zxl on 2017/5/5.
 */
$(function() {
    GetHtml("../../model/common/Head.txt", "#Com_Head");//引入导航
    CheckBrower();
    var pageNum = Request.page != null ? Request.page : 1  ;//获取页码
    var pages=0;//总页数
    getList(pageNum);
    paging(pageNum);
    function getList(pageNum) {
        var SubData = {};
        SubData.pageNo = pageNum;
        SubData.pageSize = 10;
        $.ajax({
            type: "post",
            url: "/web/student/homework/view_report/weekly_list",
            data:SubData,
            async: false,
            success: function (data) {
                showList(data);
            }
        });
    }
    function showList(data) {
        if (data.retCode == "0000") {
            var list = data.retData.list;
            pages = list.pages;
            var r_content = $('.r_content');
            if (list != null && list.length > 0) {
                var r_body= $('.r_body');
                var r_bodyC = r_body.clone(true);
                r_content.empty();
                for (var i = 0; i < list.length; i++) {
                    var temp = list[i];
                    for (var k in temp) {
                        if (!temp[k]) {
                            temp[k] = "--";
                        }
                    }
                    var newclone = r_bodyC.clone(true);
                    newclone.find(".r_assign").text(temp.endDate);
                    var startDate = temp.startDate;
                    var endDate = temp.endDate;
                    var weekStr = formatDate(startDate)+"——"+formatDate(endDate)+"作业周报";
                    newclone.find(".r_workName").text(weekStr).attr("title", weekStr);
                    newclone.find(".r_check").attr({
                        "id": temp.id
                    });
                    newclone.attr("id",temp.id);
                    newclone.appendTo(r_content);
                }
                //查看
                $(".r_check").on("click",function(e){
                    var id = $(this).attr("id");
                    sessionStorage.setItem("weekId",id);
                    window.open('weekreport.html');
                    stopBubble(e);
                });
                $('.r_body').click(function(){
                    var id = $(this).attr("id");
                    sessionStorage.setItem("weekId",id);
                    window.open('weekreport.html');
                });
            }
        }
    }
    function formatDate(inDate) {
        var da = new Date(inDate);
        return (da.getMonth() + 1) + '月' + da.getDate() + '日';
    }
    function paging(PageNum){
        var totalPage=pages;
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
                getList(n);
                return false;
            }
        });
    }
    function getParameter(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    };
});