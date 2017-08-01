<template>
<div class="Recruit">
    <v-header></v-header>
    <div  class="recr">
        <div class="ContentRecruit">

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
                Recruit: ''
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
                parmas.code = 'recruitment_keys'
                this.$http.post('/web/common/pcSysAlert', parmas).then((response) => {
                    this.Recruit = response.body.retData
                    this.Recruit = this.Recruit.replace(/&lt;/g, '<')
                    this.Recruit = this.Recruit.replace(/&gt;/g, '>')
                    this.Recruit = this.Recruit.replace(/&quot;/g, '"')
                    this.Recruit = this.Recruit.replace(/&amp;quot;/g, '"')
                    this.Recruit = this.Recruit.replace(/&amp;nbsp;/g, '')
                    this.Recruit = this.Recruit.replace(/&amp;nbsp;/g, '')
                    let ContentRecruit = document.getElementsByClassName('ContentRecruit')[0]
                    ContentRecruit.innerHTML = this.Recruit
                }, (response) => {
                    console.log(response)
                })
            }
        }
    }
</script>
<style>
    .recr{float: left;width: 100%;background: #ecedf0;}
    .ContentRecruit{width: 960px;min-height: 730px; margin: 30px auto;overflow: hidden;background: white;border-radius: 10px;background: white;box-sizing: border-box;border: 1px solid #ccc;padding: 30px 75px 125px 75px;}

</style>
