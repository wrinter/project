/**
 * Created by Administrator on 2016/11/17 0017.
 */
SystemRedMsg();
CheckBrower();
var examcommon = {

    //地区列表
    areaHtm:function(areaList){
        var areaHtm="";
        for(var i=0;i<areaList.length;i++){
            areaHtm+="<li class='fc66 fs18' areaid='"+areaList[i].id+"'>"+areaList[i].shortName+"</li> ";
        }
        return areaHtm;
    },

    //年份列表
    yearHtm:function(){
        var yearHtm = "";
        var today = new Date();
        for(var i=0;i<5;i++){
            yearHtm+="<li class='fc66 fs18' yearid='"+(today.getFullYear()-i)+"'>"+(today.getFullYear()-i)+"</li> ";
        }
        return yearHtm;
    },

    //类型列表
    catlogHtm:function(catlogList){
        var catlogHtm = "";
        for(var i=0;i<catlogList.length;i++){
            catlogHtm+="<li class='fc66 fs18";
            if(catlogList[i].label === "单元"){
                catlogHtm+=" fn_special";
            }
            catlogHtm+="' catlogid='"+catlogList[i].value+"'>"+catlogList[i].label+"</li> ";
        }
        return catlogHtm;
    },

    //单元列表
    knowledgeHtm:function(knowledgeList){
        var knowledgeHtm = "";
        for(var i in knowledgeList){
            knowledgeHtm+="<li class='fc66 fs18' knowledgeId='"+knowledgeList[i].knowledgeId+"'>"+knowledgeList[i].name+"</li> ";
        }
        return knowledgeHtm;
    },

    //分页数据的主方法
    bulidPage:function(startPage,pages){
        //if(pages<=1){
        //    return "";
        //}
        var pageHtm = "<li pageid='1'>首页</li>&nbsp;";
        for(var i=0;i<pages;i++){
            pageHtm += "<li class='";
            if((i+1)===Number(startPage)){
                pageHtm += "change_page";
            }
            pageHtm += "' pageid='"+(i+1)+"'>"+(i+1)+"</li>";
        }
        pageHtm += "&nbsp;<li pageid='"+pages+"'>尾页</li>"
        return pageHtm;
    },

    //分页
    Paging:function(SystemSize,pageNo){
        if(pageNo>SystemSize){
            pageNo=SystemSize;
        }
        kkpager.total = SystemSize;
        kkpager.totalRecords = SystemSize*5;
        kkpager.generPageHtml({
            pno : pageNo, //总页码
            hrefFormer : 'message', //链接尾部
            hrefLatter : '.html',
            mode : 'click',//默认值是link，可选link或者click
            click : function(n){
                this.selectPage(n);
                if(store.get('IsMsgType')==0||store.get('IsMsgType')=='0'){
                    store.set("SysMsgPageNum",n);
                    main(1);
                    /*GetSystemList()*/
                }else if(store.get('IsMsgType')==1||store.get('IsMsgType')=='1'){
                    store.set("EntryMsgPageNum",n);
                    main(1);
                    /*GetEntryList();*/
                }
            }
        },true);
    },

    //地区的点击事件
    areaclick:function(){
        $(".fn_area li").click(function(){
            $(".fn_area li").removeClass("change_area");
            $(this).addClass("change_area");
            main(1);
        });
    },

    //年份的点击事件
    yearclick:function(){
        $(".fn_year li").click(function(){
            $(".fn_year li").removeClass("change_year");
            $(this).addClass("change_year");
            main(1);
        });
    },

    //单元的点击事件
    elementclick:function(){
        $(".fn_special").click(function(){
            $(".condition_knowledge").show();
            $(".fn_knowledge").show();
        });
    },

    //文档预览的点击事件
    selectcheckarticle:function(){
        $(".checkarticle").click(function(m){
            var bo = examcommon.queryordownload($(this).attr("resourseId"),"query");
            if(!bo){
                alert("数据异常");
                return;
            }
            store.set('documentarticle', $(this).parent().find(".hiddeninput").val());
            stopBubble(m);
        });
        $(".dimension_ul").click(function(m){
            var bo = examcommon.queryordownload($(this).find(".checkarticle").attr("resourseId"),"query");
            if(!bo){
                alert("数据异常");
                return;
            }
            store.set('documentarticle', $(this).find(".hiddeninput").val());
            var href = "articledetails.html";
            var a = $("<a href='"+href+"' target='_blank'>Apple</a>").get(0);
            var e = document.createEvent('MouseEvents');
            e.initEvent( 'click', true, true );
            a.dispatchEvent(e);
            stopBubble(m);
        });
    },

    //鼠标浮动展示下载按钮以及所需金币
    onfloat:function(){
        $(".dimension_ul").hover(function(){
            $(this).css("border-top","1px solid #65B113");
            $(this).css("border-bottom","1px solid #65B113");
            $(this).css("z-index","2");
            $(this).find(".download_li").show();
        },function(){
            $(this).css("border-top","1px solid #cccccc");
            $(this).css("border-bottom","1px solid #cccccc");
            $(this).find(".download_li").hide();
            $(this).css("z-index","1");
        });
    },

    //下载的点击方法
    download:function(){
        $(".fn_download").click(function(m){
            stopBubble(m);
            //判断该用户是否认证
            examcommon.NewDownload($(this));
        });
    },
    //执行下载
    doDownload:function(obj){
        //下载次数加1
        var id = obj.attr("resourseId");
        var type = obj.attr("downloadType");
        var bo = examcommon.queryordownload(id,"download");
        if(!bo){
            alert("数据异常");
            return;
        }
        //执行下载
        $.ajax({
            type:"POST",
            data:{
                "objectKey":obj.attr("objectkey"),
                "bucketName":obj.attr("bucketname")
            },
            url:"../../web/common/baidudownload",
            success:function(data){
                $('#s_container').html('');
                var  s_container = document.getElementById('s_container');
                var a = document.createElement("a");
                a.setAttribute("href",data);
                a.setAttribute("target","_blank");
                a.setAttribute("download","下载");
                a.setAttribute("id","download");
                $('#s_container').empty();
                s_container.appendChild(a);
                a.click();
            }
        });
    },
    //新下载
    NewDownload:function(obj) {
        var SubData={};
        SubData.resourceId=obj.attr("resourseId");
        SubData.type=obj.attr("downloadType");
        SubData.resType='5';
        $.ajax({
            "type": "post",
            "url": "/web/teacher/download/obtain",
            "dataType": "json",
            "data":SubData,
            success: function (data) {
                var AllData=data.retData;//总数据
                var Codenum = parseInt(AllData);
                if(Codenum==1){
                    examcommon.doDownload(obj);
                }
                else if(Codenum==2){
                    $('#p_LessMoney').fadeIn(200);
                    examcommon.LessMoney();
                }else {
                    $('#NoIdentify').fadeIn(200);
                    examcommon.NoIdentify();
                }
            }
        });
    },
    //用户金币不够弹窗操作
    LessMoney:function(){
        $('#GoIdentifyClose').on('click',function(){
            $('#NoIdentify').fadeOut(200);
        })
    },
    //用户认证弹窗操作
    NoIdentify:function(){
        $('#GoIdentifyClose').on('click',function(){
            $('#NoIdentify').fadeOut(200);
        })
    },
    //类型的点击事件
    catlogclick:function(){
        $(".fn_catlog li").click(function(){
            $(".fn_catlog li").removeClass("change_catlog");
            $(this).addClass("change_catlog");
            if($(this).hasClass("fn_special")){
                $(".condition_knowledge").show();
                $(".fn_knowledge").show();
            }else{
                $(".condition_knowledge").hide();
                $(".fn_knowledge").hide();
                $(".fn_knowledge li").removeClass("change_knowledge");
                $(".fn_knowledge li:nth-child(1)").addClass("change_knowledge");
            }
            main(1);
        });
    },
    //单元的点击事件
    knowledgeclick:function(){
        $(".fn_knowledge li").click(function(){
            $(".fn_knowledge li").removeClass("change_knowledge");
            $(this).addClass("change_knowledge");
            main(1);
        });
    },
    //下载或阅览时相应的字段加1
    queryordownload:function(id,str){
        var bo = true;
        $.ajax({
            type:"POST",
            data:{
                "id":id,
                "flag":str
            },
            url:"/web/common/queryordownnum",
            success:function(data){
                if(data.retCode!="0000"){
                    bo = false;
                }
            }
        });
        return bo;
    },

};















