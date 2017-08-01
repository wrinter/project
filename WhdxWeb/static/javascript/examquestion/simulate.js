/**
 * Created by renwencong on 2016/11/9 0008.
 */
var flag=true;
//获取页面头部
GetHtml("../common/common.txt","#header");
CheckBrower();
//进页面自动加载的方法
bulidHtm();
SystemRedMsg();
//获取三年模拟api的数据
function main(startNum){
    $.ajax({
        type:"POST",
        data:{
            "areaId":$(".change_area").attr("areaid"),
            "year":$(".change_year").attr("yearid"),
            "pageNum":$(".change_page").attr("pageid"),
            "catlog":$(".change_catlog").attr("catlogid"),
            "knowledgeId":$(".change_knowledge").attr("knowledgeid"),
            "pageSize":"15",
            "pageNum":startNum
        },
        url:"/web/teacher/examquestion/simulate",
        dataType:"json",
        success:function(data){
            //验证数据
            if(data.retCode!="0000"){
                alert(data.retMsg);
                return;
            }

            //三年模拟的数据列表
            var reseHtm = selectData(data);
            $(".r_dimension").empty();
            $(".r_dimension").append(reseHtm);
            examcommon.onfloat();

            //预览
            examcommon.selectcheckarticle();

            //分页数据
            store.set('SystemSize',data.retData.pages);
            if(data.retData.pages>0){
                Paging(store.get('SystemSize'),startNum);
                $('.Paging').show();
            }else {
                $('.Paging').hide();
            }
            examcommon.download();
        }
    });
}

//渲染页面的主要方法
function bulidHtm(){
    $.ajax({
        type:"POST",
        url:"/web/teacher/examquestion/simulate",
        dataType:"json",
        data:{
            "pageSize":"15"
        },
        success:function(data){
            //验证数据
            if(data.retCode!="0000"){
                alert(data.retMsg);
                return;
            }
            //地区列表
            var areaHtm = examcommon.areaHtm(data.retData.areaList);
            $(".fn_area").append(areaHtm);
            examcommon.areaclick();
            //年份列表
            var yearHtm = "";
            var today = new Date();
            for(var i=0;i<3;i++){
                yearHtm+="<li class='fc66 fs18' yearid='"+(today.getFullYear()-i)+"'>"+(today.getFullYear()-i)+"</li> ";
            }
            $(".fn_year").append(yearHtm);
            examcommon.yearclick();
            //类型列表
            var catlogHtm = examcommon.catlogHtm(data.retData.catlogList);
            $(".fn_catlog").append(catlogHtm);
            examcommon.catlogclick();
            //单元列表
            var knowledgeHtm = examcommon.knowledgeHtm(data.retData.konwledgeList);
            $(".fn_knowledge").append(knowledgeHtm);
            examcommon.knowledgeclick();
            //三年模拟的数据列表
            var reseHtm = selectData(data);
            $(".r_dimension").append(reseHtm);
            examcommon.onfloat();
            examcommon.download();
            //预览
            examcommon.selectcheckarticle();
            //分页数据
            store.set('SystemSize',data.retData.pages);
            if(data.retData.pages>0){
                Paging(store.get('SystemSize'),1);
                $('.Paging').show();
            }else {
                $('.Paging').hide();
            }
            $('.GoPayClose').click(function(){
                $('#p_LessMoney').fadeOut(200);
            });
        }
    });
}

//获取三年模拟数据列表的主方法
function selectData(data){
    var resePage = data.retData.resePage;
    var reseHtm = "";
    if(resePage.length>0){
        $('#NoData').html('')
        for(var i=0;i<resePage.length;i++){
            resePage[i].downloadtype = "practiceQuestionDownlaod";
            reseHtm+="<ul class='dimension_ul'><li class='dimension_li fs18'><div class='e_wordico spriteImg fl'></div><a target='_blank' href='articledetails.html' class='checkarticle'>"+resePage[i].title+"</a>" +
                "<input class='hiddeninput' type='hidden' value='"+JSON.stringify(resePage[i])+"'>" +
                "</li><li class='dimension_li fs18 fc66'>" +
                "<span class='fl'>教材："+resePage[i].pressName+"&nbsp;&nbsp;&nbsp;&nbsp;</span>";
            reseHtm+="<p class='fl fn_rig'><img src='../../../static/image/examquestion/down.png' alt=''>下载量："+resePage[i].downNum+"</p>"
            if(resePage[i].createTime!=null){
                reseHtm+="<p class='fl fc66 fn_rig'><img src='../../../static/image/examquestion/time.png' alt=''> "+resePage[i].createTime+"</p><p class='fl fc66 fontsize mr20'>3金币</p>";

            }else {
                reseHtm+="<p class='fl fc66 fn_rig'><img src='../../../static/image/examquestion/time.png' alt=''></p><p class='fl fc66 fontsize mr20'>3金币</p>";

            }

            if(resePage[i].isAnalysis==="1"){
                reseHtm+="<span class='fl mr20'>全解全析</span></li>";
            }else{
                reseHtm+="</li>";
            }
            reseHtm+="<li class='download_li'><div class='fn_download' downloadType='practiceQuestionDownlaod'  resourseId='"+resePage[i].resourseId+"' objectkey='"+resePage[i].objectKey+"' bucketname='"+resePage[i].bucketName+"'>下载</div></li></ul>";
        }
        return reseHtm;
    }
    else {
        reseHtm+='<div class="NoData" id="NoData"></div>';
        reseHtm+='<img src="../../static/image/kola/no.png" class="NoDataImg" alt="">';
        reseHtm+='</div>';
        return reseHtm;
    }
}

//分页
function Paging(SystemSize,pageNo){
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
                main(n)
        }
    },true);
};