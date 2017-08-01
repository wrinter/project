/**
 * Created by lichao on 2017/2/10.
 */
$(document).ready(function(){
    var Presenttation = {
        init : function(){
            this.getPaper();
            this.click();
        },
        getPaper : function(){
            var _this = this;
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
                    SubData.pageSize=15;
                    $.ajax({
                        type : "post",
                        url : "/web/student/homework/write/queryHwListByUser",
                        data : SubData,
                        async:false,
                        success : function(data){
                            if(data.retCode == "0000"){
                                var tbody = $(".tbody");
                                Pages = data.retData.pages;//总页数
                                //if(Pages == "1" || Pages == 1){
                                //    $(".Paging").hide();
                                //}
                                getTestlist(data);
                            }else{
                                $(".Presention,.Paging").hide();
                                $(".donohomeworkmain,.donohomework").fadeIn();
                            }
                        },
                        error : function(e){
                            console.log(e)
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
                        hrefFormer : 'DH_Presentation', //链接尾部
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
                        $(".donohomeworkmain,.donohomework").fadeIn();
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
                        var arrangementDate = Dtrue.arrangementDate;
                        var status = Dtrue.status;
                        if(status == "7"){
                            newclone.find(".tendtimeupdate").show();
                            newclone.find(".Presention_see").text("补做");
                        }
                        newclone.find(".tbodytime").text(arrangementDate);
                        newclone.find(".tbodysubject").text(subjectName);
                        newclone.find(".tbodyhomework").text(typeName);
                        newclone.find(".tbodyname").text(paperName).attr("title",paperName);
                        newclone.find(".tbodyendtime").text(deadline);
                        newclone.find(".Presention_see").attr({"type":type,"id":id});
                        //去完成
                        newclone.find(".Presention_see").on("click",function(){
                            var type = $(this).attr("type");
                            var id = $(this).attr("id");
                            var sub = {};
                            sub.type = type;
                            sub.id = id;
                            //var navigator = _this.Browser();
                            sessionStorage.setItem("sub",JSON.stringify(sub));//储存id
                            if(type == 300){
                                window.location.href = "DH_video.html?id="+id+"&navigator="+navigator;
                            }else if(type == 401 || type == 402){
                                //window.open("DH_lettres.html");
                                window.location.href = "DH_lettres.html?id="+id;
                            }else if(type == 403){
                                window.location.href = "DH_EnglishLetters.html?id="+id;
                            }else if(type == 203){
                                window.location.href = "DH_homework.html?id="+id+"&navigator="+navigator;
                            }else {
                                window.location.href = "DH_homework.html?id="+id+"&navigator="+navigator;
                            }
                        })
                        newclone.appendTo(tbody);
                    }
                }
            }
            //_this.mouseover();
        },
        Browser : function(){
            var _this = this;
            function getExplorerInfo() {
                var explorer = window.navigator.userAgent.toLowerCase();
                //ie 
                if (explorer.indexOf("msie") >= 0) {
                    var ver = explorer.match(/msie ([\d.]+)/)[1];
                    return { type: "IE", version: ver };
                }
                //firefox 
                else if (explorer.indexOf("firefox") >= 0) {
                    var ver = explorer.match(/firefox\/([\d.]+)/)[1];
                    return { type: "Firefox", version: ver };
                }
                //Chrome
                else if (explorer.indexOf("chrome") >= 0) {
                    var ver = explorer.match(/chrome\/([\d.]+)/)[1];
                    return { type: "Chrome", version: ver };
                }
                //Opera
                else if (explorer.indexOf("opera") >= 0) {
                    var ver = explorer.match(/opera.([\d.]+)/)[1];
                    return { type: "Opera", version: ver };
                }
                //Safari
                else if (explorer.indexOf("Safari") >= 0) {
                    var ver = explorer.match(/version\/([\d.]+)/)[1];
                    return { type: "Safari", version: ver };
                }
            }
            if(getExplorerInfo().type == "undefined" || getExplorerInfo().type == undefined || getExplorerInfo().type == null){
                Browserword = "Chrome";
            }else{
                var Browserword = getExplorerInfo().type;
                var Browser = getExplorerInfo().version;
                Browserword = Browserword;
            }
            return Browserword;
        },
        mouseover : function(){
            $(".tbodyul").hover(function(){
                $(this).css({"border-bottom":"1px solid #49b9df"});
                $(this).prev(".tbodyul").css({"border-top":"1px solid #49b9df"});
            })
        },
        click : function(){
            $(".domstdo").on("click",function(){
                window.location.href="../mustdo/mustdo_index.html";
            })
        }
    }

    Presenttation.init();
})
