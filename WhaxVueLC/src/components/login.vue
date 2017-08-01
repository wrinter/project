<template>
  <div>
    <!--<v-FloorAnim></v-FloorAnim>-->
    <v-logbox></v-logbox>
  </div>
</template>

<script>
  import logbox from '@/components/common/logbox'
  import FloorAnim from '@/components/basic/FloorAnim'
  export default{
    components: {
      'v-logbox': logbox,
      'v-FloorAnim': FloorAnim
    }
}
</script>

<style>

</style>
