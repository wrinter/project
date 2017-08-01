/**
 * Created by lichao on 2017/2/7.
 */
$(document).ready(function(){
    var List = {
        init : function(){
            this.getData();
            this.isShow();
            this.Weekreport();//点击周报
        },
        getData : function(){
            var tbodyul = $(".tbodyul").clone(true);
            qiong();
            function qiong(){
                function getParameter(name){
                    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r!=null) return unescape(r[2]); return null;
                };
                var PageNum = Request.page != null ? Request.page : 1  ;//获取页码
                function getList(pageNum){
                    var Pages=0;
                    var SubData={};
                    SubData.pageNo=pageNum;
                    SubData.pageSize=10;
                    $.ajax({
                        type : "post",
                        url : "/web/student/homework/report/queryReportList",
                        data : SubData,
                        async:false,
                        success : function(data){
                            if(data.retCode == "0000"){
                                var tbody = $(".tbody");
                                Pages = data.retData.pages;//总页数
                                getTestlist(data);
                            }else{
                                $(".Presention,.Paging").hide();
                                $(".donohomeworkmain,.lookhomework").fadeIn();
                            }
                        }
                    });
                    return Pages;
                }
                //分页
                pageNum(PageNum);
                function pageNum(PageNum){
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
                        hrefFormer : 'Presentation', //链接尾部
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
                };
                function  getTestlist(data){
                    var tbody = $(".tbody");
                    $(".tbody").html('');
                    if(data.retData.list.length == 0){
                        $(".Presention,.Paging").hide();
                        $(".donohomeworkmain,.lookhomework").fadeIn();
                    }
                    for(var i = 0 ; i < data.retData.list.length; i++ ){
                        var Dtrue = data.retData.list[i];
                        var newclone = tbodyul.clone(true);
                        //判断是否为空
                        for(var k in Dtrue){
                            if(!Dtrue[k]){
                                Dtrue[k] = "--";
                            }
                        }
                        var arrangementDate = Dtrue.arrangementDate;
                        var deadline = Dtrue.deadline;
                        var id = Dtrue.id;
                        var type = Dtrue.type;
                        var subjectName = Dtrue.subjectName;
                        var paperName = Dtrue.paperName;
                        var typeName = Dtrue.typeName;
                        var status = Dtrue.status;
                        var paperId = Dtrue.paperId;
                        newclone.find(".tbodytime").text(arrangementDate);
                        newclone.find(".tbodysubject").text(subjectName);
                        newclone.find(".tbodyhomework").text(typeName);
                        newclone.find(".tbodyname").text(paperName).attr("title",paperName);
                        //newclone.find(".tbodyendtime").text(deadline);
                        newclone.find(".Presention_see").attr({"type":type,"id":id,"status":status,"paperId":paperId});
                        //待批改
                        if(status == "4"){
                            newclone.find(".Presention_nocorrect").show();
                        }
                        //去完成
                        newclone.find(".Presention_see").on("click",function(){
                            var type = $(this).attr("type");
                            var id = $(this).attr("id");
                            var paperId = $(this).attr("paperId");
                            var sub = {};
                            sub.type = type;
                            sub.id = id;
                            sessionStorage.setItem("sub",JSON.stringify(sub));//储存id
                            if(type == 300){
                                window.location.href = "test_video.html?id="+id;
                            }else if(type == 401 || type == 402){
                                window.location.href = "test_lettres.html?id="+id+"&paperId="+paperId;
                            }else if(type == 403){
                                window.location.href = "test_EnglishLetters.html?id="+id+"&paperId="+paperId;
                            }else if(type == 203){
                                window.location.href = "task_English.html?id="+id;
                            }else if(type == 900){
                                window.location.href = "weekly.html?id="+id;
                            }
                            else {
                                window.location.href = "task_homwork.html?id="+id;
                            }
                        })
                        newclone.appendTo(tbody);
                    }
                }
            }
        },
        isShow : function(){
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/showUserWeekData",
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var flag = data.retData.flag
                        if(flag){
                            var endDate = data.retData.userWeekData.endDate.replace("23:59:59","");
                            var id = data.retData.userWeekData.id;
                            var startDate = data.retData.userWeekData.startDate.replace("00:00:00","");
                            $(".Presention_listtheme").attr("id",id).text("一周大数据："+startDate+"——"+endDate+"作业周报");
                        }else{
                            $(".Presention_listtheme").hide();//确定周报展现
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
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
    List.init();
})
