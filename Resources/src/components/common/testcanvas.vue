<template>
  <div >
    <div >
      <canvas  width="500" height="200"
               @mousedown="CanMouseDown($event)"
               @mousemove="CanMouseMove($event)"
               @mouseup="CanMouseUp($event)"
               class="Can_Main" id="Com_Canvas"></canvas>
    </div>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        lastX : '',
        lastY : '',
        MousePressed: false
      }
    },
    methods: {
      CanMouseDown (e) {
        let ctx = document.getElementById('Com_Canvas')
        this.MousePressed = true
        let X = e.pageX - ctx.offsetLeft
        let Y = e.pageY - ctx.offsetTop
        this.Draw(X, Y, false)
      },
      CanMouseMove (e) {
        let ctx = document.getElementById('Com_Canvas')
        if (this.MousePressed) {
          let X = e.pageX - ctx.offsetLeft
          let Y = e.pageY - ctx.offsetTop
          this.Draw(X, Y, true)
        }
      },
      CanMouseUp (e) {
        this.MousePressed = false
      },
      Draw (x, y, isDown) {
        let ctx = document.getElementById('Com_Canvas').getContext('2d')
        if (isDown) {
          ctx.beginPath();
          ctx.strokeStyle = 'red'
          ctx.lineWidth = 5;
          ctx.lineJoin = 'round'
          ctx.moveTo(this.lastX, this.lastY)
          ctx.lineTo(x, y)
          ctx.closePath()
          ctx.stroke();
        }
        this.lastX = x;
        this.lastY = y;
      }
    }
  }
</script>

<style>
  .Can_Main{border:2px solid black;background: black}
  .Com_Out{width: 900px;margin: 0 auto;}
  .Com_In{float: left;margin-left: 300px;}
</style>
