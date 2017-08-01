/********************************************个人中心投稿By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
UeserOpration();
function UeserOpration(){
    //显示上传
    $('.m_UpBtn').on('click',function(){
        $('#m_UpMain').fadeIn(150);
        store.set('UpFileType',$(this).attr('data-type'));
        store.set('UpFileTypeName',$(this).attr('data-name'));
    });
    //关闭上传
    $('#m_SeacherClose').on('click',function(){
        $('#m_UpMain').fadeOut(150);
    });
    //空白区域下拉上去
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("m_SelectBox")==-1){
            $(".m_SelectList").slideUp(150);
        }
    });
    //出现下拉
    $('.m_SelectBox').on('click',function(e){
        stopBubble(e);
        $(this).find('.m_SelectList').slideToggle(150);
        $(this).parents('.m_UpLineBox').siblings('.m_UpLineBox').find('.m_SelectList').slideUp(50);
    });
    //检测是否能点击提交样式
    setInterval(function(){
        var File=($('#file').val()==null||$('#file').val()=='');//是否有文件
        var Title=($('#m_FileTitle').val().length>0);//是否有标题
        if(File==false&&Title){
            $('#m_SubMitBtn').removeClass().addClass('m_SubMitBtn1 Can');
        }else {
            $('#m_SubMitBtn').removeClass().addClass('m_SubMitBtn0');
        }
    },1);
    $('#m_FileTitle').on('click',function(){
        $('#m_UpErrorTxt').css('display','');
    });
};
//获取投稿类型
GetUpType();
function GetUpType(){
    $.ajax({
        type:"post",
        url:"/web/student/center/contribute/type",
        dataType: "json",
        success: function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){

            }
        }
    });
};
//获取学科
GetSubject();
function GetSubject(){
    $.ajax({
        type:"post",
        url:"/web/common/subject",
        dataType: "json",
        success: function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatSubject(AllData);
                GetMaterial();
            }

        }
    });
};
//创建学科
function CreatSubject(data){
    var $SubjectHtml='';
    if(data.length>0){
        $('#Sub').html(data[0].label).attr({"data-value":data[0].value,title:data[0].label});
        for(var i=0;i<data.length;i++){
            $SubjectHtml+='<li class="m_SubOption" title="'+data[i].label+'"  data-value="'+data[i].value+'">'+data[i].label+'</li>';
        }
    }
    else {
        $('#Sub').html('暂无学科');
        $SubjectHtml+='<li class="m_SubOption">暂无学科</li>';
    }
    $('#m_SubList').html($SubjectHtml);
    $('.m_SubOption').on('click',function(e){
        stopBubble(e)
        var value = $(this).attr("data-value");
        var lable = $(this).html();
        $('#Sub').html(lable).attr({"data-value":value});
        $('#m_SubList').slideUp(150);
        GetMaterial();
    })
};
//获取教材
function GetMaterial(){
    var value = $("#Sub").attr("data-value");
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
                CreatMaterial(AllData);
            }
        }
    });
};
//创建教材
function CreatMaterial(data){
    var $MaterialHtml='';
    if(data.length>0){
        $('#Material').html(data[0].name).attr({"data-id":data[0].id,title:data[0].name});
        for(var i=0;i<data.length;i++){
            $MaterialHtml+='<li class="m_MaterialOption" title="'+data[i].name+'" data-id="'+data[i].id+'">'+data[i].name+'</li>';
        }
    }else {
        $('#Material').html('暂无教材');
        $MaterialHtml+='<li class="m_MaterialOption">暂无教材</li>';
    }
    $('#MaterialList').html($MaterialHtml);
    $('.m_MaterialOption').on('click',function(e){
        stopBubble(e)
        var id = $(this).attr("data-id");
        var name = $(this).html();
        $('#Material').html(name).attr({"data-id":id});
        $('#MaterialList').slideUp(150);
    })

};
//STS服务器下发的sessionToken
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
};
//获取ak，sk
function GetBaiduToken(){
    $.ajax({
        "type": "post",
        "url": "/web/common/baidu/token",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                Up(AllData.accessKeyId,AllData.secretAccessKey,AllData.sessionToken,AllData.bucketName);
                STS(AllData.accessKeyId,AllData.secretAccessKey,AllData.sessionToken);
            }else{
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });

};
GetBaiduToken();
function Up(ak,sk,sessionToken,bucketName){
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
        SubData.fileName=$('#m_NewFileName').html();
        SubData.fileType=store.get('UpFileType');
        SubData.introduction=$('#m_Intro').val();
        SubData.materialId=$('#Material').attr('data-id');
        SubData.subjectId=$('#Sub').attr('data-value');
        SubData.title=$('#m_FileTitle').val();
        $.ajax({
            "type": "post",
            "url": "/web/student/center/contribute/upload",
            "dataType": "json",
            'data': JSON.stringify(SubData),
            'contentType':"application/json;charset=utf-8",
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
    var uploadedInfo = {};
    function saveUploadedFile(uuid, options) {
        uploadedInfo[uuid] = options;
    };
    var uploader = new baidubce.bos.Uploader({
        browse_button: '#file',
        multi_selection: false,
        bos_bucket: bucketName,
        bos_endpoint: 'http://bj.bcebos.com',
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
                        $('#m_FileCon').css('display','block');
                        $('#m_FileBox').css('display','none');
                        var id = getIdByName(file.name);
                        file.__id = id;
                        var $Html="";
                        $Html+='<div class="m_FileNameBox" id="' + id + '">';
                        $Html+='<img src="../../static/image/me/m_wjico.png" alt="" class="m_Fileico0">';
                        $Html+='<span id="m_NewFileName">' + (file.name) + '</span>';
                        $Html+='</div>';
                        //重新上传
                        $Html+='<img src="../../static/image/me/m_resetico.png" alt="" id="again" class="m_Resetico">';
                        $Html+='<img src="../../static/image/me/m_delico.png" alt="" id="Del" class="m_Delico">';
                        if (__isEmpty) {
                            __isEmpty = false;
                            $('#m_FileCon').html($Html);
                        }
                        else {
                            $('#m_FileCon').html($Html);
                        }
                        $('#SubBtn').attr('disabled', false);
                        //重新上传
                        $('#again').on('click',function(e){
                            $('#m_FileBox').css('display','block')
                            $('#m_FileCon').css('display','none');
                            $('#file').val('').click();
                        });
                        $('#Del').on('click',function(e){
                            $('#m_FileBox').css('display','block')
                            $('#m_FileCon').css('display','none');
                            $('#file').val('')
                        });
                    }
                }
            },
            BeforeUpload: function (_, file) {
                // 当某个文件开始上传的时候，调用这个函数
                $('#again').css('display','none');
                $('#m_FileBox').css('display','none');
            },
            UploadProgress: function (_, file, progress, event) {
                // 文件的上传进度
                var row = getRowById(file.__id);
                row.setProgress(progress);
            },
            //更换路径
            Key: function (_, file) {
                var date = new Date();
                var FirstUrl = store.get('UpFileTypeName');
                var SecUrl =$('#Sub').html();
                var ThrUrl =$('#Material').html();
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
                $('#m_FileCon').css('display','none');
                $('#m_FileBox').css('display','block');
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
                $('#m_UpErrorTxt').css('display','');
                $('#m_NoFileErrorTxt').css('display','');
                $('#m_UpMain').fadeOut(150);
            },
            UploadPartProgress: function (_, file, progress, event) {
                // 分片上传的时候，单个分片的上传进度
                var row = getRowById(file.__id);
                row.setProgress(progress);
            },
            Error: function (_, error, file) {
                // 如果上传的过程中出错了，调用这个函数
                $('#c_ErrorMsg').html('上传失败，请重试').fadeIn(200); Disappear("#c_ErrorMsg");
                setTimeout(function(){window.location.reload();},2000);
            },
            UploadComplete: function () {
                // 队列里面的文件上传结束了，调用这个函数
            }
        }
    });
    $('#m_SubMitBtn').click(function () {
        if($(this).hasClass("Can")){
            $('#m_ProUpPro').fadeIn(150);
            var arr=[];
            arr.push(uploader._files[uploader._files.length-1]);
            uploader._files=arr;
            uploader.start();
            return false;
        }else {
            if($('#m_FileTitle').val().length==0){
                $('#m_UpErrorTxt').css('display','block');
            }
            else {
                $('#m_UpErrorTxt').css('display','');
            }
            if($('#file').val()==null||$('#file').val()==''){
                $('#m_NoFileErrorTxt').css('display','block');
            }else {
                $('#m_NoFileErrorTxt').css('display','');
            }
        }
    });
};













