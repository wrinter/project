<template>
  <div class="Echo_ImgMain">
    <div class="Echo_UpImgBox">
      <input type="file" value="上传" accept="image" id="Echo_Up" class="Echo_Index0" @change="UpdateFile">
      <p class="Echo_Index1" >选择文件</p>
      <p class="Echo_Txt0">支持jpg、png、bmp等格式图片且文件小于5M</p>
    </div>
    <div class="Echo_ImgBox">
      <img :src="ThisUrl" id="EchoImg" alt="">
    </div>
    <v-Mark :MarkCon = 'ThisMark'></v-Mark>
    <!--<img :src="ThisResult" alt="">-->
    <div class="Echo_PreViewTxt">
        <p>180px*180px</p>
        <p>100px*100px</p>
        <p>60px*60px</p>
    </div>
    <div class="Echo_PreView">
      <div class="Echo_Big preview"><img :src="ThisUrl" alt=""></div>
      <div class="Echo_Mid preview"><img :src="ThisUrl" alt=""></div>
      <div class="Echo_Sml preview"><img :src="ThisUrl" alt=""></div>
    </div>
    <div class="Echo_Result">
      <p @click="GetResult">确定</p>
      <p @click="Cancel">取消</p>
    </div>

  </div>
</template>

<script>
  import Mark from '../common/Mark'
  import Cropper from 'cropperjs'
  export default {
    data () {
      return {
        EchoCropper: '',
        ThisUrl: '/static/common/images/user.jpg',
        ThisResult: '',
        ThisMark: {Con:'', Random:''}
      }
    },
    components: {
      'v-Mark': Mark
    },
    mounted () {
      this.InitCropper()
    },
    methods: {
      // 初始化
      InitCropper () {
        let ThisImg = document.getElementById('EchoImg')
        var previews = document.querySelectorAll('.preview')
        let That = this
        this.EchoCropper = new Cropper(ThisImg, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea:0.5,
          ready: function () {
            That.croppable = true
          },
          crop: function (e) {
            var data = e.detail;
            var cropper = this.cropper;
            var imageData = cropper.getImageData();
            var previewAspectRatio = data.width / data.height;
            That.Each(previews, function (elem) {
              var previewImage = elem.getElementsByTagName('img').item(0);
              var previewWidth = elem.offsetWidth;
              var previewHeight = previewWidth / previewAspectRatio;
              var imageScaledRatio = data.width / previewWidth;
              elem.style.height = previewHeight + 'px';
              previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
              previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
              previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
              previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
            });
          }
        })
      },
      // 遍历
      Each (arr, callback) {
        var length = arr.length;
        var i;
        for (i = 0; i < length; i++) {
          callback.call(arr, arr[i], i, arr);
        }
        return arr;
      },
      // 获取Url
      getObjectURL (file) {
        var url = null
        if (window.createObjectURL !== undefined) { // basic
          url = window.createObjectURL(file)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        return url
      },
      // 更新图片
      UpdateFile (e) {
        let files = e.target.files || e.dataTransfer.files
        this.ThisMark.Random = Math.random()
        this.ThisMark.Con = ''
        if (!files.length) return
        if (!this.CheckType(files[0])) {
          this.ThisMark.Con = '图片格式不正确请重新选择'
        } else if (!this.CheckSize(files[0])) {
          this.ThisMark.Con = '请选择小于5M的图片'
        }
        if (this.CheckSize(files[0]) && this.CheckType(files[0])) {
          this.ThisUrl = this.getObjectURL(files[0]);
          // 每次替换图片要重新得到新的url
          if (this.EchoCropper) {
            this.EchoCropper.replace(this.ThisUrl);
          }
        }
        document.getElementById('Echo_Up').value = ''
      },
      CheckSize (e) {
        let ThisSize = e.size
        let LimitSize = 1024 * 1024 * 5;// 5M
        if (ThisSize > LimitSize) {
          return false
        } else {
          return true
        }
      },
      CheckType (e) {
        let ThisType = e.type
        let pat = /^image\/\w+$/ // 验证格式
        console.log(ThisType)
        if (pat.test(ThisType)) {
          return true
        } else {
          return false
        }
      },
      Cancel () {
        this.$emit('ListenCancel', true)
      },
      GetResult () {
        this.ThisResult = this.EchoCropper.getCroppedCanvas().toDataURL()
        this.$emit('ListenChild', this.ThisResult)
      }
    }
  }
</script>

<style>
  @import "/static/common/css/cropper/cropper.css";
  img {  max-width:none; }
  .Echo_ImgMain{overflow: hidden;margin: 0 auto;width: 840px;}
  .Echo_ImgBox{ width: 400px;height: 400px;float: left;border-radius: 10px;border: 1px solid #ccc;overflow: hidden;}
  .Echo_PreView,.Echo_PreViewTxt{float: right;width: 180px;text-align: center;}
  .Echo_PreViewTxt>p{font-size: 18px;color: #333;text-align: center;width: 100%;margin: 0 auto 20px auto;}
  .Echo_PreViewTxt>p:nth-child(1){line-height: 180px;}
  .Echo_PreViewTxt>p:nth-child(2){line-height: 100px;}
  .Echo_PreViewTxt>p:nth-child(3){line-height: 60px;}
  .preview{border: 1px solid #ccc;overflow: hidden;border-radius: 100%;margin: 0 auto 20px auto;clear: both;}
  .Echo_Big{width: 180px;height: 180px;}
  .Echo_Mid{width: 100px;height: 100px;}
  .Echo_Sml{width: 60px;height: 60px;}
  .cropper-view-box, .cropper-face {  border-radius: 50%;  }
  .Echo_UpImgBox{position: relative;padding-left: 180px;height: 90px;width: 100%;float: left;}
  .Echo_Index0,.Echo_Index1{font-size: 16px;color: #333;line-height: 40px;text-align: center; position: absolute;width: 165px;height: 40px;z-index: 2;left: 0;top: 0;bottom: 0;margin: auto;border: 0;outline: none;cursor: pointer;}
  .Echo_Index1{z-index: 1;border-radius: 10px; box-sizing: border-box;border: 1px solid #ccc;background: url("/static/common/images/photo/m_btnbg.jpg")0 0 repeat;}
  .Echo_Index0{opacity: 0;filter: alpha(opacity = 0)}
  .Echo_Txt0{float: left;line-height: 90px;font-size: 16px;color: #999;}
  .Echo_Result{float: left;width: 100%;height: 45px;margin-top: 40px;text-align: center;}
  .Echo_Result p{display: inline-block;height: 45px;margin: 0 10px;color: white;width: 180px;border-radius: 10px;line-height: 45px;font-size: 16px;cursor: pointer;}
  .Echo_Result p:nth-child(1){background: #58C1E4;}
  .Echo_Result p:nth-child(1):hover{background: #0fa7db;}
  .Echo_Result p:nth-child(2){background: #ccc;}
</style>
