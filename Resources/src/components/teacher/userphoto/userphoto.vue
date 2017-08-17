<template>
  <div>
    <v-photo @ListenChild="RecieveChild" @ListenCancel="ChildCancle"></v-photo>
  </div>
</template>

<script>
  import photo from '../../common/photo.vue'
  export default {
    components: {
      'v-photo': photo
    },
    methods : {
      RecieveChild (BaseUrl) {
        console.log(BaseUrl)
      },
      ChildCancle (result) {
        console.log(result)
      }
    }
  }
</script>

<style>
</style>
