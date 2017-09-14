<template>
<div class="aboutUs">
    <v-header></v-header>
    <div  class="about">
        <div class="ContentUs">

        </div>
    </div>
    <router-footer></router-footer>
</div>
</template>
<script type="text/ecmascript-6">
    import Head from './header'
    import footer from '../../common/bottom'
    export default {
        data () {
            return {
                AboutUsData: ''
            }
        },
        components: {
            'v-header': Head,
            'router-footer': footer
        },
        created () {
            this.thisdo()
        },
        methods: {
            thisdo () {
                let parmas = {}
                parmas.code = 'about_us_keys'
                this.$http.post('/web/common/pcSysAlert', parmas).then((response) => {
                    let data = response.body
                    console.log(data)
                    this.AboutUsData = data.retData
                    this.AboutUsData = this.AboutUsData.replace(/&lt;/g, '<')
                    this.AboutUsData = this.AboutUsData.replace(/&gt;/g, '>')
                    this.AboutUsData = this.AboutUsData.replace(/&quot;/g, '"')
                    this.AboutUsData = this.AboutUsData.replace(/&amp;quot;/g, '"')
                    this.AboutUsData = this.AboutUsData.replace(/&amp;nbsp;/g, '')
                    this.AboutUsData = this.AboutUsData.replace(/&amp;nbsp;/g, '')
                    let ContentUs = document.getElementsByClassName('ContentUs')[0]
                    ContentUs.innerHTML = this.AboutUsData
                })
            }
        }
    }
</script>
<style>
    .about{float: left;width: 100%;background: #ecedf0;}
    .ContentUs{width: 960px;min-height: 730px; margin: 30px auto;overflow: hidden;background: white;border-radius: 10px;background: white;box-sizing: border-box;border: 1px solid #ccc;padding: 30px 75px 125px 75px;}

</style>
