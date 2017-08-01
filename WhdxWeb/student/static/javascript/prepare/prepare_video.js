/***************************************判断浏览器*******************************************/
CheckBrower();
/***********************面向对象****************************/
var defaultSelect = []
var subjectList = []
var getVideo=function () {};
getVideo.prototype={
    constructor:getVideo,//确定原型链
    init:function(){
        this.subjectSel();
        this.GetLastid()
        this.autoDo();
    },
    //页面进入自动执行
    autoDo:function(cFlag){
        var that = this;
        var subject = {};
        var subjectId = $(".fn_sub.change").attr("val");
        subject.subjectId = subjectId;
        subject.menuId = store.get('menuId');
        $.ajax({
            type:"post",
            url:"/web/student/common/knowledge",
            data:subject,
            "async":false,
            dataType: "json",
            success:function(data){
                var list = data.retData;
                if(list!=null&&list.length>0){
                    var flag = true,knowledgeId = "",num=0;
                    if(cFlag=='click'){
                        while(flag) {
                            if (list[0].childrens.length > 0) {
                                that.sellist(list, "auto",cFlag);
                                num++;
                                list = list[0].childrens;
                            } else {
                                knowledgeId = list[0].knowledgeId;
                                flag = false;
                                that.sellist(list, "auto",cFlag);
                                store.set("lastPrepareId", knowledgeId);
                                that.getViedoCategory(knowledgeId, subject.subjectId);
                            }
                        }
                    }else{
                        that.getChapters(list);
                    }
                }else{
                    $('.videoBox').html("<div class='noData'><img class='noImg' src='../../static/image/kola/no.png'></div>");
                }

            }
        })
    },
    getChapters:function(list){
        var changeData = store.get('changeData');
        this.sellist(list, "auto", '');
        if(changeData == undefined||changeData == '') {
            for (var i = 0; i < list.length; i++) {
                for (var key in defaultSelect) {
                    if (list[i].knowledgeId == defaultSelect[key]) {
                        var children = list[i].childrens;
                        if (children != null && children.length > 0) {
                            this.getChapters(children);
                        } else {
                            knowledgeId = list[i].knowledgeId;
                            store.set("lastPrepareId", knowledgeId);
                            this.SaveLastId(knowledgeId)
                            this.getViedoCategory(knowledgeId, $(".fn_sub.change").attr("val"));
                            break;
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < list.length; i++) {
                for (var key in changeData) {
                    if (list[i].knowledgeId == changeData[key]) {
                        var children = list[i].childrens;
                        if (children != null && children.length > 0) {
                            this.getChapters(children);
                        } else {
                            knowledgeId = list[i].knowledgeId;
                            store.set("lastPrepareId", knowledgeId);
                            this.getViedoCategory(knowledgeId, $(".fn_sub.change").attr("val"));
                            break;
                        }
                    }
                }
            }
        }
    },
    GetLastid: function(){
        var SubData={};
        SubData.menuId=store.get('menuId');
        var that = this
        $.ajax({
            "type": "post",
            "url": "/web/common/teacherandstudent/lastcode",
            "dataType": "json",
            "data": SubData,
            success: function (data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){
                    //是否含有上次记录
                    if(data.retData==''||data.retData==null){
                        store.set('selectedSubject','');
                        store.set('changeData','');
                    }else {
                        that.setDefault(data.retData)
                    }
                }
            }
        });
    },
    SaveLastId: function(LastId){
        var SubData={};
        SubData.menuId=store.get('menuId');
        SubData.lastCode=LastId;
        $.ajax({
            "type": "post",
            "url": "/web/common/teacherandstudent/savelastcode",
            "dataType": "json",
            "data": SubData,
            success: function (data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){

                }
            }
        });
    },
    setDefault: function(lastCode) {
        for(var i=0;i<subjectList.length;i++){
            var subjectId = subjectList[i].value
            var subject = {}
            subject.subjectId = subjectId;
            subject.menuId = store.get('menuId');
            $.ajax({
                type: "post",
                url: "/web/student/common/knowledge",
                data: subject,
                "async": false,
                dataType: "json",
                success: function (data) {
                    var retData = data.retData
                    var changData = {}
                    getDefault(retData,'')
                    function getDefault(sets,id){
                        for(var j=0;j<sets.length;j++) {
                            if(sets[j].childrens.length==0){
                                if(retData[j].knowledgeId == lastCode){
                                    changData['0'] = subjectId
                                    if(id=='1') {
                                        changData['1'] = retData[j].parentId
                                        changData['2'] = lastCode
                                    }else if(id==''){
                                        changData['1'] = lastCode
                                    }else{
                                        changData['1'] = id
                                        changData['2'] = retData[j].parentId
                                        changData['3'] = lastCode
                                    }
                                    store.set('changeData',changData);
                                }
                            }else{
                                getDefault(sets[j].childrens,sets[j].parentId)
                            }
                        }
                    }
                }
            })
        }
    },
    //学科
    subjectSel:function(){
        var that = this;
        $.ajax({
            type:"post",
            url:"/web/student/center/getSubjectList",
            "async":false,
            dataType: "json",
            success:function(data){
                var htm = '';
                subjectList = data.retData;
                for(var i in data.retData){
                    htm += '<span class="fn_sub ';
                    var changeSub = store.get('selectedSubject');
                    if(changeSub == undefined||changeSub == '') {
                        changeSub = '01'
                        defaultSelect.push('01')
                        store.set('changeData','');
                    }
                    if(data.retData[i].value==changeSub){
                        htm += 'change';
                    }
                    htm +='" mycla="mathematics" val="'+data.retData[i].value+'">'+data.retData[i].label+'</span>';
                }
                $("#fn_subject_div").append(htm);
                that.subjectAll();
            }
        });
    },
    //章、节
    subjectAll:function(){
        var that=this;
        $(".p_loadtexttitle .fn_sub").click(function(){
            if($(this).hasClass("change")){
                return;
            }else{
                $(this).parent().find("span").removeClass("change");
                $(this).addClass("change");
                $(".videoBox").html("");
            }
            store.set('selectedSubject',$(this).attr('val'));
            $(this).parent().parent().nextAll().remove();
            var subject = {};
            subject.subjectId = $(this).attr("val");
            that.autoDo('click');
        });
    },
    sellist:function(list,flag,cFlag){
        var that=this;
        var li = "";
        li = "<li><label>"+list[0].levelName+"：</label><div>";
        var changeList = store.get('changeData');
        for(var i=0; i<list.length; i++){
            li+="<span id='"+list[i].knowledgeId+"' class='fn_par ";
            if(cFlag=='click'){
                if(i==0&&flag=="auto"){
                    li+="change";
                }
            }else{
                if(changeList) {
                    for(var key in changeList){
                        if(list[i].knowledgeId==changeList[key]){
                            li+="change";
                            break;
                        }
                    }
                } else {
                    if(i==0) {
                        li+="change";
                        defaultSelect.push(list[i].knowledgeId)
                    }
                }
            }
            if(list[i].alias==''||list[i].alias==null){
                li+="' level='"+list[i].level+"' parent='"+JSON.stringify(list[i].childrens)+"' title='"+list[i].name+"'>"+list[i].name+"</span>";
            }else {
                li+="' level='"+list[i].level+"' parent='"+JSON.stringify(list[i].childrens)+"'  title='"+list[i].name+'  '+list[i].alias+"'  >"+list[i].name+"</span>";
            }
        }
        li+="</div></li>";
        $(".p_loadtexttitle").append(li);
        $(".fn_par").click(function(){
            if(!$(this).hasClass("change")){
                $(".p_loadcon").html("");
                $(this).parent().parent().nextAll().remove();
                $(this).parent().find("span").removeClass("change");
                $(this).addClass("change");
                if(JSON.parse($(this).attr("parent")).length>0){
                    that.clickSellist(JSON.parse($(this).attr("parent")),$(this).attr("level"),"auto");
                }else{
                    var knowledgeId = $(this).attr("id");
                    store.set("lastPrepareId",knowledgeId);
                    that.SaveLastId(knowledgeId)
                    var subjectId = $("span.fn_sub.change").attr("val");
                    that.getViedoCategory(knowledgeId,subjectId);
                }
                that.storeChange();
            }
        })
    },
    storeChange:function(){
        var changeData = {};
        $('.change').each(function(){
            var val = $(this).attr('val');
            var id = $(this).attr('id');
            var level = $(this).attr('level');
            if(val!=undefined){
                changeData['0'] = val;
            }else if(id!=undefined){
                changeData[level]=id;
            }
        });
        store.set('changeData',changeData);
    },
    clickSellist:function(list,level,flag){
        var that = this;
        var list = list,level = level,flag = flag,pan = false,li = "",knowledgeId="",subjectId = "";
        do{
            li = "<li><label>"+ list[0].levelName +"：</label><div>";
            for(var i=0; i<list.length; i++){
                li+="<span id='"+list[i].knowledgeId+"' class='fn_par ";
                if(i==0&&flag=="auto"){
                    li+="change";
                }
                li+="' level='"+list[i].level+"' parent='"+JSON.stringify(list[i].childrens)+"'title='"+list[i].name+"'>"+list[i].name+"</span>";
            }
            li+="</div></li>";
            $(".p_loadtexttitle").append(li);
            if(list[0].childrens.length>0) {
                level = list[0].level;
                list = list[0].childrens;
                pan = true;
                li = "";
            }else {
                pan = false;
                knowledgeId = list[0].knowledgeId;
                that.SaveLastId(knowledgeId)
                subjectId = $("span.fn_sub.change").attr("val");
            }
        }while(pan);
        that.getViedoCategory(knowledgeId,subjectId);
        $(".fn_par").click(function(){
            if(!$(this).hasClass("change")){
                $(".p_loadcon").html("");
                $(this).parent().parent().nextAll().remove();
                $(this).parent().find("span").removeClass("change");
                $(this).addClass("change");
                if(JSON.parse($(this).attr("parent")).length>0){
                    that.clickSellist(JSON.parse($(this).attr("parent")),$(this).attr("level"),"" + "auto");
                }else{
                    var knowledgeId = $(this).attr("id");
                    store.set("lastPrepareId",knowledgeId);
                    that.SaveLastId(knowledgeId)
                    var subjectId = $("span.fn_sub.change").attr("val");
                    that.getViedoCategory(knowledgeId,subjectId);
                }
                that.storeChange();
            }
        })
    },
    getViedoCategory:function(knowledgeId,subjectId){//栏目ID+知识点ID --->获取相应的视频
        var param={};
        param.subjectId = subjectId;
        param.menuId=store.get("menuId");
        //param.knowledgeList=knowledgeId;
        var that=this;
        $.ajax({
            type: "post",
            url: "/web/student/prepare/category",
            data:param,
            "async":false,
            dataType: "json",
            success:function(data){
                var category=data.retData;
                var li="";
                var subType;
                for(var k in category){
                    subType=category[k].subType;
                    store.set("category"+k,category[k].id);
                    if(subType=='09'){
                        li+="<div class='video video"+k+"'>";
                        that.getVideoList(store.get("category"+k),knowledgeId,subType,category[k].title,"video"+k);
                        li+="</div>";
                    }
                }
                for(var k in category){
                    subType=category[k].subType;
                    store.set("category"+k,category[k].id);
                    if(subType==10||subType=='10'){
                        li+="<div class='video video"+k+"'>";
                        that.getVideoList(store.get("category"+k),knowledgeId,subType,category[k].title,"video"+k);
                        li+="</div>";
                    }
                }
                for(var k in category){
                    subType=category[k].subType;
                    store.set("category"+k,category[k].id);
                    if(subType==11||subType=='11'){
                        li+="<div class='video video"+k+"'>";
                        that.getVideoList(store.get("category"+k),knowledgeId,subType,category[k].title,"video"+k);
                        li+="</div>";
                    }
                }
                for(var k in category){
                    subType=category[k].subType;
                    store.set("category"+k,category[k].id);
                    if(subType==12||subType=='12'){
                        li+="<div class='video video"+k+"'>";
                        that.getVideoList(store.get("category"+k),knowledgeId,subType,category[k].title,"video"+k);
                        li+="</div>";
                    }
                }
                $(".videoBox").html(li);
            }
        });
    },
    getVideoList:function(categoryId,knowledgeId,subType,categoryTitle,videoK){
        var param={};
        param.categoryId=categoryId;
        param.knowledgeList=knowledgeId;
        var that=this;
        $.ajax({
            type: "post",
            url: "/web/student/prepare/video/list",
            data:param,
            dataType:"json",
            success:function(data){
                var _list=data.retData;
                var _li="";
                var ListLength=0
                if(data.retData==null){
                    ListLength=0;
                }else {
                    ListLength=_list.length;
                }
                if(_list!=null){
                    _li+="<div class='iconAndCategoryTitle'>";
                    _li+="<img src='../../static/image/prepare/vico.png' alt='' class='p_Vico'>";
                    _li+="<p class='categoryTitle fl' id='"+categoryId+"'>"+categoryTitle+"</p>";
                    _li+="</div>";
                    var totalSize =_list.length ;//获取总数据
                    var pageSize = 3;//每页显示4条数据
                    var currentPage = 1;//当前为第一页
                    var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
                    var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
                    if(document.body.offsetWidth>1600){
                        scrollWidth=1092;
                    }else if(document.body.offsetWidth>1366&&document.body.offsetWidth<1600){
                        scrollWidth=910;
                    }else {
                        scrollWidth=817;
                    }
                    if(totalSize>3){
                        _li+="<i class='p_spriteImg p_leftico p_left fl mt80 mb80'></i>";
                        _li+="<i class='p_spriteImg p_right p_hoverRightico fr mt80 mb80'></i>";
                    }else {
                        _li += "<i class='p_spriteImg p_leftico p_left fl mt80 mb80' style='display: none'></i>";
                        _li += "<i class='p_spriteImg p_rightico  p_right fr mt80 mb80' style='display: none'></i>";
                    }
                }

                if(ListLength>0) {
                     _li += "<div class='v_listBox'>";
                     _li += "<ul class='v_list'>";
                    for (var _k in _list) {
                        _li += "<li>";
                        _li += "<a href='prepare_video_prepareVideoPlay.html?id=" + _list[_k].resId + "&categoryId=" + categoryId + "'>";
                        _li += "<div class='videoImgBox'><img src='" + _list[_k].thumbnail + "'><p class='playico dino'><img src='../../../static/image/prepare/video_pre.png' alt=''></p><p class='videoName '>" + _list[_k].resName + "</p></div>";
                        _li += "</a></li>";
                    }
                    _li += "</ul>";
                    _li += "</div>";
                }else{
                    _li += "<div class='v_listBox'>";
                    _li += "<ul class='v_list'><img class='noImg' src='../../static/image/kola/no.png'>";
                    _li += "</ul>";
                    _li += "</div>";
                }

                //-------------------------li 长度>3,轮播----------------------------------
                if(totalSize>3){
                    /*单击向右的箭头*/
                    $(".videoBox").on("click",".p_right",function(){
                        if(currentPage==totalPage){
                            return false;
                        }else if(currentPage==totalPage-1){
                            $(this).removeClass("p_hoverRightico").addClass("p_rightico");
                            $(this).siblings(".p_left").removeClass("p_lefttico").addClass("p_hoverLeftico");
                            $(this).siblings(".v_listBox").find(".v_list").animate({left:(currentPage)*(-scrollWidth)},200);
                            currentPage++;
                        } else {
                            $(this).removeClass("p_rightico").addClass("p_hoverRightico");
                            $(this).siblings(".p_left").removeClass("p_lefttico").addClass("p_hoverLeftico");
                            $(this).siblings(".v_listBox").find(".v_list").animate({left:(currentPage)*(-scrollWidth)},200);
                            currentPage++;
                        }
                    });
                    $(".videoBox").on("click",".p_left",function(){
                        if(currentPage==1){
                            $(this).siblings(".p_right").removeClass("p_rightico").addClass("p_hoverRightico");
                            $(this).siblings(".p_left").removeClass("p_hoverLeftico");
                            return false;
                        }else if(currentPage==2){
                            $(this).removeClass("p_hoverLeftico");
                            $(this).siblings(".p_right").removeClass("p_rightico").addClass("p_hoverRightico");
                            currentPage--;
                            $(this).siblings(".v_listBox").find(".v_list").animate({left:((currentPage-1)*(-scrollWidth))},200)
                        }
                        else {
                            $(this).siblings(".p_right").removeClass("p_rightico").addClass("p_hoverRightico");
                            currentPage--;
                            $(this).siblings(".v_listBox").find(".v_list").animate({left:((currentPage-1)*(-scrollWidth))},200)
                        }
                    });
                }
                //添加 老师
                if(subType=="09"||subType=="10"){
                    _li+="<div class='prepareVideoLi prepareAddTeacher'>";
                    var param={};
                    param.categoryId=categoryId;
                    param.knowledgeList=knowledgeId;
                    $.ajax({
                        type: "post",
                        url: "/web/student/prepare/video/teacher",
                        data:param,
                        dataType: "json",
                        success:function(data){
                            var t_list=data.retData;
                            var Li="";
                            if(t_list){
                                Li+="<a href='prepare_video_videoPlay_aboutTeacher.html?id="+t_list.id+"&categoryId="+categoryId+"'>";
                                Li+="<div class='t_photoAndName'>";
                                Li+="<img id='t_photo' class='t_photo' src=''>";
                                that.loadImg(t_list.resFileId);
                                Li+= "<p class='teacherName'>"+t_list.name+"</p>";
                                Li+="</div>";
                                Li+= "<div class='teacherSynopsis'><div>"+t_list.synopsis+"</div></div>";
                                Li+="</a>";
                            }

                            $(".prepareVideoLi").html(Li);
                        }
                    });
                    _li+="</div>";
                }
                $("."+videoK).html(_li);
                $('.videoImgBox').hover(function(){
                    $(this).find('.playico').stop(true).fadeIn(100);
                },function(){
                    $(this).find('.playico').stop(true).fadeOut(100);

                })
            }
        });
    },
    loadImg:function(fileId){//从百度上获取头像
       var param={};
       param.fileId=fileId;
        $.ajax({
            type: "post",
            url: "/web/common/baidu/view",
            data: param,
            success:function (data) {
                var t_photoSrc= data.retData;
                $(".t_photo").attr("src",t_photoSrc);
            }
        });
    }
}
$(function() {
    new getVideo().init();//实例化
});




