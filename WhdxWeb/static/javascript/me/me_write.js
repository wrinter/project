CheckBrower();
/******************************获取导航*******************************/
SystemRedMsg();
GetHtml("../../model/common/common.txt","#Header");
$(document).ready(function(){
//    上传资料模块

//    上传资料
    $(".m_upload").on("click",function(){
        $("form").show();
        $(".m_list_contont").hide();
        $(this).removeClass("m_uploadselet");
        $(".m_list").removeClass("m_listselet");
    });
//    获取学科
    subject();
    function subject(){
        $.ajax({
            type:"post",
            url:"/web/common/subject",
            dataType: "json",
            success: function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                var AllData=data.retData;
                if(codenum==0){
                    CreatSubject(AllData)
                }

            }
        });
    };
    function CreatSubject(data){
        var $SubjectHtml='';
        for(var i=0;i<data.length;i++){
            $SubjectHtml+='<li class="m_sublist" data-value="'+data[i].value+'">'+data[i].label+'</li>';
        }
        $('#Subject').html($SubjectHtml);
        $('.m_sublist').on('click',function(e){
            stopBubble(e)
            var value = $(this).attr("data-value");
            var lable = $(this).html();
            $('#m_subchoseinput').html(lable).attr({"data-name":value});
            $('#Subject').slideToggle(150);
            great();
        })
    }
    //    选择学科
    $("#Submain").on("click",function(e){
        stopBubble(e)
        $("#Subject").slideToggle(150);
        $("#material").hide();
        $(this).closest(".m_subchose").attr("isinput",'true');
        //获取教材
    });
    //    获取教材
    function great(){
        var value = $("#m_subchoseinput").attr("data-name");
        if(!value){return false;}
        var SubData={}
        SubData.subjectId=value;
        $.ajax({
            type:"post",
            url:"/web/common/material",
            data:SubData,
            dataType: "json",
            success: function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                var AllData=data.retData;
                if(codenum==0){
                    CreatMaterial(AllData)
                }
            }
        });
    };
    function CreatMaterial(data){
        $('#materialShow').html('暂无学科').attr({"data-book":'',"data-id":'',"data-subjectId":'',"data-grade":'',"data-pressId":''});;
        var $MaterialHtml='';
        for(var i=0;i<data.length;i++){
            $MaterialHtml+='<li id="'+data[i].id+'" book="'+data[i].book+'" grade="'+data[i].grade+'" subjectId="'+data[i].subjectId+'" pressId="'+data[i].pressId+'"  class="m_classlist m_classlistc">'+data[i].name+'</li>';
        }
        $('#material').html($MaterialHtml);
        if(data.length>0){
            $('#materialShow').html(data[0].name).attr({"data-book":data[0].book,"data-id":data[0].id,"data-subjectId":data[0].subjectId,"data-grade":data[0].grade,"data-pressId":data[0].pressId});;
        }else {
            $('#materialShow').val('暂无教材');
        }
        ChoiceMater();
    }
    function ChoiceMater(){
        $('.m_classlist').on('click',function(e){
            stopBubble(e);
            var value = $(this).attr("value");
            var lable = $(this).html();
            var book=$(this).attr('book');
            var id=$(this).attr('id');
            var subjectId=$(this).attr('subjectId');
            var grade=$(this).attr('grade');
            var pressId=$(this).attr('pressId');
            var name=$(this).html();
            $('#materialShow').html(name).attr({"data-book":book,"data-id":id,"data-subjectId":subjectId,"data-grade":grade,"data-pressId":pressId});;
            $('#material').slideToggle(150);
        });
    }
    $('#materialMain').on('click',function(e){
        stopBubble(e)
        $(this).closest(".m_classchose").attr("isinput",'true');
        $("#Subject").hide();
        $("#material").slideToggle(150);
    });
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("GoDown")==-1){
            $(".GoUp").slideUp(150);
        }
    });
    //GetType()
    function GetType(){
        $.ajax({
            "type": "post",
            "url": "/web/teacher/center/contribute/type",
            "dataType": "json",
            success: function (data) {
                var AllData=data.retData;//总数据
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){

                }else{
                    $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        });
    };
//    选择类型
    $(".m_typecl").on("click",function(){
        $(".m_typecl").attr("isinput",'true');
        $(this).addClass("m_typeadd").siblings(".m_typecl").removeClass("m_typeadd");
    });
    //    标题
    $(".m_captin_select").on("keyup",function(){
        if(!$(this).val()){
            $(this).attr("isinput","false");
        }else{
            $(this).attr("isinput",'true');
        }

    });
    var time=null;
    time=setInterval(function(){
        if($(".m_captin_select").val().length>0 && $(".m_typecl").attr("isinput") == "true" && $("#materialShow").attr("data-id") != undefined && $("#m_subchoseinput").attr('data-name') != undefined&&$("#fileBox").is(':hidden')){
            $('#SubBtn').css({"background":"#65b113","color":"#fff"}).addClass("Can");
        }else{
            $('#SubBtn').css({"background":"#ccc","color":"#fff"}).removeClass("Can");
        }
    },1);
//    提交数据
    $(".m_buttoncl").on("click",function(){
        //类型
        var m_typeadd = $(".m_typeadd").text();
        if(!m_typeadd){
            return false;
        }
        //学科
        var m_subject = $(".m_subchoseinput").val();
        var m_subjectname = $(".m_subchoseinput").attr("name");
        var m_subjectretcode = $(".m_subchoseinput").attr("retcode");
        if(!m_subject||!m_subjectname||!m_subjectretcode){
            return false;
        }
    //    册次
        var m_class = $(".m_classchoseinput").val();
        var m_classname = $(".m_classchoseinput").attr("name");
        //var m_classretcode = $(".m_classchoseinput").attr("retcode");
        if(!m_class||!m_classname){
            return false;
        }
    //    标题
        var m_title = $(".m_captin_select").val();
        if(!m_title){
            return false;
        }
    //    简介
        var m_brief = $(".m_briefcl").val();
    //    ajax
    })

//    列表模块

//    上传列表
    $(".m_list").on("click",function(){
        $("form").hide();
        $(".m_list_contont").show();
        $(this).addClass("m_listselet");
        $(".m_upload").addClass("m_uploadselet");
    });
//    上传规则模块
    $(".m_rule").on("click",function(){
        $(".m_rulecl_shark").show();
    });
    $(".m_rule_dele").on("click",function(){
        $(".m_rulecl_shark").hide();
    });

    /***********************************************By 徐扬***********************************************/
    function STS(a,b,c){
        var bosConfig = {
            credentials: {
                ak: a, // STS服务器下发的临时ak
                sk: b // STS服务器下发的临时sk
            },
            sessionToken: c,  // STS服务器下发的sessionToken
            endpoint: 'http://bj.bcebos.com'
        };
        var client = new baidubce.sdk.BosClient(bosConfig);
    }
    function GetBaiduToken(){
        $.ajax({
            "type": "post",
            "url": "/web/common/baidu/token",
            "dataType": "json",
            success: function (data) {
                var AllData=data.retData;//总数据
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){
                    var AK=AllData.accessKeyId;
                    var SK=AllData.secretAccessKey;
                    var ST=AllData.sessionToken;
                    var BK=AllData.bucketName;
                    var Qd=AllData.endpointQd;
                    Up(AK,SK,ST,BK,Qd);
                    STS(AK,SK,ST);
                }else{
                    $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        });
    }
    GetBaiduToken();
    function Up(ak,sk,sessionToken,bucketName,endpointQd){
        var __uuid = 0;
        var __isEmpty = true;
        var __isApplication = typeof window.process !== 'undefined' && typeof window.require === 'function';
        if (__isApplication) {
            $('.alert').hide();
            $('#forkme').hide();
        }
        function noop() {
        }
        if (typeof localStorage === 'undefined') {
            var localStorage = {
                getItem: noop,
                setItem: noop,
                removeItem: noop
            };
        }
        function toUrl(object) {
            var url = 'bc-user' + encodeURIComponent(object).replace(/%2F/gi, '/');
            return url;
        }
        function getIdByName(name) {
            return 'f' + (__uuid ++);
        }
        function getRowById(rowId) {
            return {
                setIgnore: function (ignored) {
                    if (ignored) {
                        $('#' + rowId).addClass('ignored');
                    }
                    else {
                        $('#' + rowId).removeClass('ignored');
                    }
                },
                setProgress: function (progress) {
                    $('#m_ProUpProIn').css('height', (progress * 100).toFixed(2) + '%');
                    $('#m_ProNumber').html((progress * 100).toFixed(1) + '%');
                },
                setStatus: function (type, ok) {
                    var container = $('#' + rowId + ' .f-status');
                    container.html('<span class="glyphicon glyphicon-' + type + '"></span>');
                    if (ok === true) {
                        container.css('color', 'green');
                    }
                    else if (ok === false) {
                        container.css('color', 'red');
                    }
                    else {
                        container.css('color', '#333');
                    }
                },
                setTime: function (time) {
                    var container = $('#' + rowId + ' .f-time');
                    container.html(time);
                },
                setUrl: function (url) {
                    if (__isApplication) {
                        return;
                    }
                    var container = $('#' + rowId + ' .f-name');
                    var name = container.html();
                    container.html('<a href="' + url + '" target="_blank">' + name + '</a>');
                },
                clearActions: function (uuid, force) {
                    var container = $('#' + rowId + ' .f-actions');
                    if (!force && __isApplication) {
                        container.html('<a href="javascript:;" data-cmd="download" data-fid="' + uuid + '">下载</a>');
                    } else {
                        container.html('-');
                    }
                },
                setErrorMessage: function (errorMessage) {
                    var errorHtml = '<div class="alert alert-danger" role="alert">' + errorMessage + '</div>';
                    var container = $('#' + rowId + ' .f-name');
                    container.append(errorHtml);
                }
            };
        }
        function getDefaultTextProgress() {
            return '0.00%';
        }
        function getDefaultCssProgress() {
            return '<div class="m_ProUpProIn"></div><div class="m_ProNumber"></div>';
        };
        function IsGetUpload(fileFullPath){
            var SubData={};
            SubData.fileFullPath=fileFullPath;
            SubData.fileName=$('.m_upname').html();
            SubData.fileType=$('.m_typeadd').attr('data-type');
            SubData.introduction=$('.m_briefcl').val();
            SubData.materialId=$('.m_classchoseinput').attr('data-id');
            SubData.subjectId=$('#m_subchoseinput').attr('data-name');
            SubData.title=$('.m_captin_select').val();
            $.ajax({
                "type": "post",
                "url": "/web/teacher/center/contribute/upload",
                "dataType": "json",
                'data': JSON.stringify(SubData),
                'contentType':"application/json;charset=utf-8",
                success: function (data) {
                    var AllData=data.retData;//总数据
                    var codenum = parseInt(data.retCode.substr(0, 1));
                    if (codenum == 0){
                        GoldAnimate(data.retGold);
                        store.set("UploadPageNum",1);
                        GetUploadList();
                        setTimeout(function(){
                            Paging();
                            $('#UpLIst').click();
                        },2000)
                    }else{
                        $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                }
            });
        };
        var uploadedInfo = {};
        function saveUploadedFile(uuid, options) {
            uploadedInfo[uuid] = options;
        };
        var uploader = new baidubce.bos.Uploader({
            browse_button: '#file',
            multi_selection: false,
            bos_bucket: bucketName,
            bos_endpoint: endpointQd,
            bos_multipart_parallel: 5,
            bos_multipart_min_size:1024*1024*5000,
            chunk_size: '8mb',
            bos_ak: ak,
            bos_sk: sk,
            uptoken: sessionToken,
            max_file_size: '10Gb',
            init: {
                PostInit: function () {
                    // uploader 初始化完毕之后，调用这个函数
                },
                FileFiltered: function (_, files) {
                    // 如果文件因为某些原因被过滤了，调用这个函数
                },
                FilesAdded: function (_, files) {
                    var arr=[];
                    arr.push(files);
                    // 当文件被加入到队列里面，调用这个函数
                    {
                        var file = arr[0][0];
                        var IsSizeBy0=1024*1024*20;//20M
                        var IsSizeBy1=1024*1024*200;//200M
                        var filename=file.name;
                        var pos = filename.lastIndexOf(".");
                        var lastname = filename.substring(pos+1,filename.length);
                        var AudioType=(lastname=="3gpp"||lastname=="ac3"||lastname=="au"||lastname=="mp2"||lastname=="mp3"||lastname=="mp4"||lastname=="mpeg"||lastname=="mpg"||lastname=="rmvb");//音频视频
                        var TestType=(lastname=="txt"||lastname=="doc"||lastname=="dot"||lastname=="ppt"||lastname=="pptx"||lastname=="docx"||lastname=="dotx"||lastname=="xls"||lastname=="xlsx"||lastname=="pps"||lastname=="ppsx");//试题
                        if(TestType){
                            if(file.size>IsSizeBy0){
                                $('#c_ErrorMsg').html('请选择小于20M的文档').fadeIn(200);  Disappear("#c_ErrorMsg");
                            }
                            else {
                                CreatHtml();
                            }
                        }
                        else if(AudioType){
                            if(file.size>IsSizeBy1){
                                $('#c_ErrorMsg').html('请选择小于200M的视频音频').fadeIn(200);  Disappear("#c_ErrorMsg");
                            }
                            else {
                                CreatHtml();
                            }
                        }
                        else {
                            if(file.size>IsSizeBy1){
                                $('#c_ErrorMsg').html('请选择小于200M的其他文件').fadeIn(200);  Disappear("#c_ErrorMsg");
                            }
                            else {
                                CreatHtml();
                            }
                        }
                        function CreatHtml(){
                            $('#test').css('display','block');
                            $('#fileBox').css('display','none');
                            var id = getIdByName(file.name);
                            file.__id = id;
                            var $Html="";
                            $Html+='<div class="m_upsuccess" id="' + id + '">';
                            $Html+='<i class="spriteImg m_upimg_03 fl m_upimg"></i>';
                            $Html+='<span class="m_upname">' + (file.name) + '</span>';
                            //重新上传
                            $Html+='<div class="fl " id="again">';
                            $Html+='<i class="spriteImg m_upreload fl m_upreloadc NewUp" ></i>';
                            $Html+='<span class="m_uploadword NewUp cup" >重新上传</span>';
                            $Html+='<i class="spriteImg m_updelete fl m_upremove" id="Del"></i>';
                            $Html+='</div>';
                            $Html+='</div>';
                            if (__isEmpty) {
                                __isEmpty = false;
                                $('#test').html($Html);
                            }
                            else {
                                $('#test').html($Html);
                            }
                            $('#SubBtn').attr('disabled', false);
                            //重新上传
                            $('.NewUp').on('click',function(e){
                                $('#fileBox').css('display','block')
                                $('#test').css('display','none');
                                $('#file').val('').click();
                            });
                            $('#Del').on('click',function(e){
                                $('#fileBox').css('display','block')
                                $('#test').css('display','none');
                                $('#file').val('')
                            });
                        }
                    }
                },
                BeforeUpload: function (_, file) {
                    // 当某个文件开始上传的时候，调用这个函数
                    $('#again').css('display','none');
                    $('#fileBox').css('display','none');
                },
                UploadProgress: function (_, file, progress, event) {
                    // 文件的上传进度
                    var row = getRowById(file.__id);
                    row.setProgress(progress);
                },
                //更换路径
                Key: function (_, file) {
                    var date = new Date();
                    var FirstUrl = $('.m_typeadd').html();
                    var SecUrl =$('#m_subchoseinput').html();
                    var ThrUrl =$('#materialShow').html();
                    var deferred = baidubce.sdk.Q.defer();
                    var delay = ~~(2 + Math.random() * 5);    // (2, 7);
                    setTimeout(function () {
                        var key = FirstUrl + '/' + SecUrl + '/' + ThrUrl + '/' + file.name;
                        deferred.resolve(key);
                    }, delay * 100);
                    return deferred.promise;
                },
                FileUploaded: function (_, file, info) {
                    // 文件上传成功之后，调用这个函数
                    $('#test').css('display','none');
                    $('#fileBox').css('display','block');
                    $('#m_ProUpPro').fadeOut(150);
                    $('#c_ErrorMsg').html('上传成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                    $('#m_ProUpProIn').css('height', 0 + '%');
                    $('#file').val('');
                    $('#m_ProNumber').html(0 + '%');
                    $('#SubBtn').attr('disabled', true);
                    var bucket = info.body.bucket;
                    var object = info.body.object;
                    var url = object;
                    IsGetUpload(url);
                },
                UploadPartProgress: function (_, file, progress, event) {
                    // 分片上传的时候，单个分片的上传进度
                    var row = getRowById(file.__id);
                    row.setProgress(progress);
                },
                Error: function (_, error, file) {
                    // 如果上传的过程中出错了，调用这个函数
                    $('#Error').css('display','block');
                    $('#c_ErrorMsg').html('上传失败，请重试').fadeIn(200); Disappear("#c_ErrorMsg");
                    setTimeout(function(){window.location.reload();},2000);
                },
                UploadComplete: function () {
                    // 队列里面的文件上传结束了，调用这个函数
                }
            }
        });
        $('#SubBtn').click(function () {
            if($(this).hasClass("Can")){
                $('#m_ProUpPro').fadeIn(150);
                var arr=[];
                arr.push(uploader._files[uploader._files.length-1]);
                uploader._files=arr;
                uploader.start();
                return false;
            }
        });
    };
});

function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
function Paging(){
    var pageNo=store.get("UploadPageNum");
    var SystemSize=store.get('UploadPageSize');
    if(pageNo>SystemSize){
        pageNo=SystemSize;
    }
    kkpager.total = SystemSize;
    kkpager.totalRecords = SystemSize*10;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        hrefFormer : 'me_write', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("UploadPageNum",n);
            GetUploadList();
            return false;
        }
    },true);
};
store.set("UploadPageNum",1);
GetUploadList();
setTimeout(function () {
    Paging();
},200)
function GetUploadList(){
    var SubData={}
    SubData.pageNum=store.get("UploadPageNum");;
    SubData.pageSize=15;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/center/contribute/upload/list",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatUploadList(AllData.list);
                store.set('UploadPageSize',AllData.pages);
            }else{
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
function CreatUploadList(data){
    var $UploadList='';
    if(data.length>0){
        $("#kkpager").css('display','block');
        $('#NoListImg').css('display','none');
        for(var i=0;i<data.length;i++){
            $UploadList+='<li data-id="'+data[i].id+'" data-materialId="'+data[i].materialId+'"  data-subjectId="'+data[i].subjectId+'"   >';
            $UploadList+='<span class="fc33">'+data[i].title+'</span>';
            $UploadList+='<span  class="fc66">'+data[i].createTime+'</span>';
            if(data[i].status==0||data[i].status=="0"){
                $UploadList+='<span class="fc66">未审核</span>';
            }
            else if(data[i].status==1||data[i].status=="1"){
                $UploadList+='<span class="fc66">审核中</span>';
            }
            else if(data[i].status==2||data[i].status=="2"){
                $UploadList+='<span class="fc66">审核通过</span>';
            }
            else{
                $UploadList+='<span class="fc66">审核未通过</span>';
            }
            if(data[i].rewardGold==0||data[i].rewardGold==null){
                $UploadList+='<span >— —</span>';
            }else {
                $UploadList+='<span >+'+data[i].rewardGold+'</span>';
            }
            //审核中不可删除
            if(data[i].status==0||data[i].status=='0'||data[i].status==1||data[i].status=='1'){
                $UploadList+='<span class="fc66">— —</span>';
            }
            else {
                $UploadList+='<span class="canDel cup"><img src="../../../static/image/me/u_del0.png" alt=""></span>';
            }
            $UploadList+='</li>';
        }
    }else {
        $("#kkpager").css('display','none');
        $('#NoListImg').css('display','block');
    }
    $('#UpListCon').html($UploadList);
    DelateUpLoad()
};
//删除投稿记录
function GetDelateUpLoad(contributionId){
    var SubData={};
    SubData.contributionId=contributionId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/center/contribute/upload/delete",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                GetUploadList();
            }else{
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
function DelateUpLoad(){
    $('.canDel').hover(function(){
        $(this).find('img').attr('src','../../../static/image/me/u_del1.png')
    },function(){
        $(this).find('img').attr('src','../../../static/image/me/u_del0.png')
    })
    $('.canDel').on('click',function(){
        var contributionId=$(this).parents('li').attr('data-id');
        GetDelateUpLoad(contributionId);
        setTimeout(function () {
            Paging();
        },200)
    })
}
