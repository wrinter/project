/**
 * Created by lgr on 2016/11/30.
 */
CheckBrower();
SystemRedMsg();
GetHtml("../../model/common/common.txt","#Header");
$(document).ready(function(){
    function getParameter(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    };
    var PageNum = Request.page != null ? Request.page : 1  ;//获取页码
    tbodytr = $(".tbodytr").clone(true);
    function getList(pageNum){
        var Pages=0;
        var tbody = $(".tbody");
        tbody.html("");
        $.ajax({
            type : "post",
            url : "/web/teacher/modeltest/completedHistory",
            data : {status:"1",pageNum:pageNum,pageSize:"15"},
            async:false,
            success : function(data){
                if(data.retCode == "0000"){
                    var tbody = $(".tbody");
                    Pages = data.retData.pages;//总页数
                    getTestlist(data);
                }else{
                    $(".nothing").show();
                    $(".tbody").hide();
                }
            },
            error : function(e){
                console.log(e)
            }
        });
        return Pages;
    }
    //分页
    $(function(){
        var totalPage=getList(PageNum);
        var totalRecords = totalPage*10;
        var pageNo = getParameter('page');
        if(!pageNo){pageNo = 1;}
        //生成分页
        //有些参数是可选的，比如lang，若不传有默认值
        kkpager.generPageHtml({
            pno : pageNo, //总页码
            total : totalPage, //总数据条数
            totalRecords : totalRecords, //链接前部
            hrefFormer : 'studies_record', //链接尾部
            hrefLatter : '.html',
            getLink : function(n){
                return this.hrefFormer + this.hrefLatter + "?page="+n;
            },
            mode : 'click',//默认值是link，可选link或者click
            click : function(n){
                this.selectPage(n);
                getList(n)
                return false;
            }
        });
    });
    function  getTestlist(data){
        var tbody = $(".tbody");
        $(".tbody").html('');
        if(data.retData.list.length == 0 || data.retData.list.length == "0"){
            $(".nothing").show();
            $(".tbody").hide();
            return false;
        }
        for(var i = 0;i<data.retData.list.length;i++){
            var newclone = tbodytr.clone(true);
            var Dtrue = data.retData.list[i];
            //判空
            for(var k in Dtrue){
                if(Dtrue[k] == null || Dtrue[k] == ""){
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
            newclone.find(".s_name").text(startTime+" "+paperName);
            newclone.find(".s_time").text(useTime+"分钟");
            //newclone.find(".s_userScore").text(userScore+"分");
            if(typeof(userScore) == "undefined"){
                newclone.find(".s_userScore").text("--分");
            }else{
                newclone.find(".s_userScore").text(userScore+"分");
            }
            newclone.find(".s_status").attr("id",id).text("查看");
            newclone.find(".s_status").on("click",function(){
                var paperRecordid = $(this).attr("id");
                sessionStorage.setItem("paperRecordid",JSON.stringify(paperRecordid));
                window.open("studies_details.html");
            })
            newclone.appendTo(tbody);
        }
    }
});