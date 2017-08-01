ChangeUserPhoto();
function ChangeUserPhoto(){
  $(function () {
    'use strict';
    (function () {
      var $image = $('#Main_img');
      var Option={
        aspectRatio: 1.4/1,
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
            $('#CanvasBox canvas').attr('id','CanvasMain');
          var IsSizeW=$('#CanvasMain').attr('width');
            if(IsSizeW>3000){
              getPicture(result.toDataURL('image/jpeg',0.2));
            }else if(IsSizeW>2000){
              getPicture(result.toDataURL('image/jpeg',0.3));
            }else if(IsSizeW>1000){
              getPicture(result.toDataURL('image/jpeg',0.4));
            }else if(IsSizeW>500){
              getPicture(result.toDataURL('image/jpeg',0.5));
            }else if(IsSizeW>400){
              getPicture(result.toDataURL('image/jpeg',0.6));
            }else if(IsSizeW>300){
              getPicture(result.toDataURL('image/jpeg',0.7));
            }else if(IsSizeW>200){
              getPicture(result.toDataURL('image/jpeg',0.8));
            }else {
              getPicture(result.toDataURL('image/jpeg',1));
            }
            //sessionStorage.setItem("url",JSON.stringify(result.toDataURL()));
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
                $('#inputImage').click();
              }
            }else {
              $inputImage.val('');
            }
          }
        });
      } else {
        $inputImage.parent().remove();


      }
    }());
  });
};
function getPicture (url){
          var src = $(".cropper-view-box").find("img").attr("src");
          var src = src.split("/");
          console.log(src.length)
          if(src[src.length-1] == "picture.png"){
            $("#c_ErrorMsg").html("请选择正确照片").fadeIn(200);Disappear("#c_ErrorMsg");
            return false;
          }
          var sub = JSON.parse(sessionStorage.getItem("sub"));
          var menuId = JSON.parse(localStorage.getItem("menuId"));
          var parmas = {};
          parmas.id = sub.id;
          parmas.subjectId = menuId;
          parmas.loginId = $(".task_upsend").attr("loginId");
          parmas.file = url;
          $.ajax({
            type : "post",
            url : "/web/student/homework/write/uploadFiles",
            data : parmas,
            dataType : "json",
            beforeSend : function(){
              $("#c_ErrorMsg").html("正在提交...").fadeIn(200);
            },
            success : function(data){
              console.log(data);
              if(data.retCode == "0000"){
                Disappear("#c_ErrorMsg");
                var add = sessionStorage.setItem("add",1);
                window.location.reload();
              }else{
                Disappear("#c_ErrorMsg");
                $('#c_ErrorMsg').html('提交失败').fadeIn(200);  Disappear("#c_ErrorMsg");
              }
            },
            error : function(e){
              console.log(e)
            }
          })
}