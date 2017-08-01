/**************************个人中心修改头像重构BY徐扬*****************************************/
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
$('#m_CloseChangePhoto').on('click',function(){
    window.location.href="../../../model/me/me_index.html";
})
var $inputImage = $('#inputImage'),
    URL = window.URL || window.webkitURL,
    blobURL;
if(!URL){
    $('#c_ErrorMsg').html('浏览器暂不支持图像编辑,请升级浏览器').css('width','500px').fadeIn(200);Disappear("#c_ErrorMsg");
}
//更换头像
ChangeUserPhoto();
function ChangeUserPhoto(){
    $(function () {
        'use strict';
        (function () {
            var $image = $('#Main_img');
            var Option={
                aspectRatio: 1 / 1,
                preview: '.img-preview',
                crop: function (data) {}
            };
            $image.cropper(Option);
            $(document.body).on('click', '[data-method]', function () {
                var data = $(this).data(),
                    $target,
                    result;
                if (data.method) {
                    data = $.extend({}, data);
                    if (typeof data.target !== 'undefined') {
                        $target = $(data.target);
                        //异常捕获
                        if (typeof data.option === 'undefined') {
                            try {
                                data.option = JSON.parse($target.val());
                            } catch (e) {
                                console.log(e.message);
                            }
                        }
                    }
                    result = $image.cropper(data.method, data.option);
                    if (data.method === 'getCroppedCanvas') {
                        $('#CanvasBox').html(result);
                        SubUserPhoto(result.toDataURL('image/jpeg',0.6));
                    }
                    //异常捕获
                    if ($.isPlainObject(result) && $target) {
                        try {
                            $target.val(JSON.stringify(result));
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                }
            })
            var $inputImage = $('#inputImage'),
                URL = window.URL || window.webkitURL,
                blobURL;
            if (URL) {
                $inputImage.change(function () {
                    var files = this.files,
                        file;
                    if (files && files.length) {
                        file = files[0];
                        var IsSize=1024*1024*5;//5M
                        if (/^image\/\w+$/.test(file.type)) {
                            if(file.size<IsSize){
                                blobURL = URL.createObjectURL(file);
                                $image.one('built.cropper', function () {
                                    URL.revokeObjectURL(blobURL);
                                }).cropper('reset', true).cropper('replace', blobURL);
                                $inputImage.val('');
                            }else {
                                $inputImage.val('');
                                $('#c_ErrorMsg').html('请选择小于5M的图片').fadeIn(200); Disappear("#c_ErrorMsg");
                            }
                        } else {
                            $inputImage.val('');
                            $('#c_ErrorMsg').html('图片格式不正确请重新选择').fadeIn(200); Disappear("#c_ErrorMsg");
                        }
                    }
                });
            } else {
                $inputImage.parent().remove();
            }
        }());
    });
};
//提交头像
function SubUserPhoto(Url){
    $('#c_ErrorMsg').html('保存中....').fadeIn(200);
    var formData = {};
    formData.file = Url;
    formData.userType = '1';
    $.ajax({
        type:"post",
        url:"/web/user/update/headimgbase64",
        data:formData,
        dataType:'json',    //返回类型，有json，text，HTML。
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                store.set('UserHeadImgSrc',data.retData);
                $('#UserHeadImg').attr('src',data.retData);
                $('#c_ErrorMsg').html('保存成功').fadeIn(200); Disappear("#c_ErrorMsg");
                GoldAnimate(data.retGold);
                setTimeout(function(){

                    window.location.href="../../../model/me/me_index.html";
                },2000)
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200); Disappear("#c_ErrorMsg");
            }

        },
    });
};
//更换头像数据重置
function UserPhotoUpReset(){
    $('.cropper-canvas img').attr('src','');
    $('.cropper-view-box img').attr('src','');
    $('.img-preview').html('');
    $('#CanvasBox').html('');
    $('.cropper-container').remove();
}