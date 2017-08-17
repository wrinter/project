<template>
  <transition name="el-fade-in" >
    <div class="Echo_Mark" v-if="ShowMark" v-html="MarkCon.Con"></div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        ShowMark: false
      }
    },
    props : {
      MarkCon : Object
    },
    watch: {
      MarkCon :{
        handler: 'Mark',
        deep: true
      }
    },
    mounted () {
      console.log(this.MarkCon)
      this.Mark()
    },
    methods: {
      Mark () {
        console.log(this.MarkCon.Con)
        if (this.MarkCon.Con) {
          let Time = null;
          if (Time) { clearTimeout(Time) }
          this.ShowMark = true
          let That = this
          Time = setTimeout(function () {
            That.ShowMark = false
          }, 2000)
        }
      }
    }
  }
</script>

<style>
  .Echo_Mark{position: fixed;left: 0;right: 0;bottom: 0;top: 0;margin: auto;width: 350px;height: 100px;line-height: 100px; border-radius: 10px; z-index: 99;background: black; background: rgba(0,0,0,0.6);text-align: center;font-size: 26px;color: white;}

</style>
