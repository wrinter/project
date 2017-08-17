<template>
  <div class="Com_Out">
    <div class="Com_In">
      <v-canvas></v-canvas>
    </div>
  </div>
</template>

<script>
  import Canvas from '../common/testcanvas'
  export default {
    components: {
      'v-canvas': Canvas
    }
  }
</script>

<style>
  .Com_Out{width: 900px;margin: 0 auto;}
  .Com_In{float: left;margin-left: 300px;}
</style>
