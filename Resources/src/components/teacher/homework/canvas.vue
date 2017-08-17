<template>
    <canvas :id="item.fileId+'canvas'" class="Canvas"  :style="{ backgroundImage: 'url(' + item.imgSrc + ')' }" @mousedown="canvasDown($event)"
            @mouseup="canvasUp($event)"
            @mousemove="canvasMove($event)" width="700" height="478">
    </canvas>
</template>
<script type="text/ecmascript-6">
    export default {
      props:['item'],
      data() {
        return {
          canvas:null,
          cxt:null,
          x:0,//记录鼠标移动是的X坐标
          y:0,//记录鼠标移动是的Y坐标
          clickDrag:[],//把点击、拖动的鼠标坐标添加到数组里
          cPushArray:[],//用来存储canvas图片路径
          cStep:-1,//用来记录当前画了多少次，为返回上一步和前进上一步做准备
          w:0,
          h:0,
          drawFlag:false
        };
      },
      mounted() {
        this.init()
      },
      methods:{
        init() {
          let id = this.item.fileId + 'canvas'
          this.canvas = document.getElementById(id)
          if (this.canvas.getContext) {
          } else {
            alert("您的浏览器不支持 canvas 标签");
            return;
          } //判断是否支持canvas
          this.cxt = this.canvas.getContext('2d');
          this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式
          this.cxt.lineWidth = 5;//线条的宽度
          this.w = this.canvas.width;//取画布的宽
          this.h = this.canvas.height;//取画布的高
          if(this.item.fileId === this.$parent.fileId) {
            let markList = this.$parent.marksList
            let that = this
            if(markList.length>0) {
              for(let i=0;i<markList.length;i++) {
                if(this.item.fileId == markList[i].imgPosition) {
                  let result = new Image()
                  result.src = markList[i].markPic
                  result.onload = function() {
                    that.cxt.drawImage(result, 0, 0,that.w,that.h)
                  }
                  this.cPushArray.push(markList[i].markPic);
                }
              }
            }
          }
        },
        canvasDown(e) {
          this.drawFlag = true
          let X = e.pageX - this.$parent.offsetLeft
          let Y = e.pageY - this.$parent.offsetTop
          this.drawPoint(X, Y, false)
        },
        canvasUp(e) {
          this.drawFlag = false;
          this.cPushArray.push(this.canvas.toDataURL());
          let pro = {};
          pro.answerPicId = this.item.fileId;
          pro.fileStr = this.cPushArray[this.cPushArray.length - 1];
          pro.flag = "2";
          let imgArray = this.$parent.imgArray
          if (imgArray.length > 0) {
            let b = true;
            for (var i in imgArray) {
              if (imgArray[i].answerPicId === pro.answerPicId) {
                imgArray[i] = pro
                b = false;
              }
            }
            if (b) {
              imgArray.push(pro)
            }
          } else {
            imgArray.push(pro)
          }
        },
        canvasMove(e) {
          if(this.drawFlag) {
            let X = e.pageX - this.$parent.offsetLeft
            let Y = e.pageY - this.$parent.offsetTop
            this.drawPoint(X, Y, true)
          }
        },
        drawPoint (a,b,flag) {
          if (flag&&this.$parent.pen) {
            this.cxt.beginPath();
            this.cxt.strokeStyle = 'red'
            this.cxt.lineWidth = 5;
            this.cxt.lineJoin = 'round'
            this.cxt.moveTo(this.x, this.y)
            this.cxt.lineTo(a, b)
            this.cxt.closePath()
            this.cxt.stroke()
          }
          this.x = a
          this.y = b
        },
        goBack() {
          this.canvas.width = this.w
          this.canvas.height = this.h
          if(this.item.fileId === this.$parent.fileId) {
            this.cPushArray.pop();
            let imgArray = this.$parent.imgArray
            if (imgArray.length > 0) {
              for (let i in imgArray) {
                if (imgArray[i].answerPicId === this.item.fileId) {
                  imgArray.splice(i, 1);
                }
              }
            }
            let img = new Image()
            if (this.cPushArray.length-1 >= 0) {
              img.src = this.cPushArray[this.cPushArray.length - 1];
            }
            let that = this
            img.onload = function () {
              that.cxt.drawImage(img, 0, 0);
            };
            if(this.cPushArray.length>0) {
              var pro = {};
              pro.answerPicId = this.item.fileId;
              pro.fileStr = this.cPushArray[this.cPushArray.length - 1];
              pro.flag = "2";
              if (imgArray.length > 0) {
                let b = true;
                for (let i in imgArray) {
                  if (imgArray[i].answerPicId === pro.answerPicId) {
                    imgArray[i] = pro;
                    b = false;
                  }
                }
                if (b) {
                  imgArray.push(pro);
                }
              } else {
                imgArray.push(pro);
              }
            }
          }
        }
      }
    };
</script>
<style>
  .Canvas {
    width: 700px;
    height: 478px;
    overflow: hidden;
    background-repeat:no-repeat;
    background-position: center;
    background-size: auto 100%;
    background-size: cover;
  }
</style>
