<template>
    <div class="ideas">
        <v-header></v-header>
        <div  class="Content">
            <h1 class="Title">意见反馈</h1>
            <div class="relation">如果在使用过程中有任何疑问和建议，您可以通过以下方式联系我们 ：</div>
            <div class="r_word email">1、发送邮件都我们的邮箱 : baichuan@bcbook.cn</div>
            <div class="r_word qq">2、QQ客服 ：<a href="tencent://message/?uin=3582840438&amp;site=qq&amp;menu=yes"><img class="clickqq" src="static/common/com/talk.png" /></a></div>
            <div class="wrinte">直接提交您的建议 : </div>
            <textarea class="writeideas subData" data-name="info" id="writeideas" placeholder="您的每一条建议教育专家都视若珍宝，您的信任和鼓励是我们不断进步的动力。" :class="isideas === true ? Rborder : ''" @blur="blurdo" v-model="ideas"></textarea>
            <div class="remine">请留下您的联系方式便于我们跟踪改进 : </div>
            <input class="remineword subData" id="remineword" data-name="linkNumber" type="text" placeholder="手机号/QQ号" :class="isiphone === true ? Rborder : ''" @blur="blurdo" v-model="iphonewords">
            <div style="clear: both;"></div>
            <input type="button" value="提交" class="SubBtn" @click="thisdo">
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
              Rborder: 'Rborder',
              ideas: '',
              isideas: false,
              iphonewords: '',
              isiphone: false
          }
        },
        components: {
            'v-header': Head,
            'router-footer': footer
        },
        methods: {
            blurdo () {
                let ideas = this.ideas
                let iphonewords = this.iphonewords
                if (ideas) {
                    this.isideas = true
                } else {
                    this.isideas = false
                }
                if (iphonewords) {
                    this.isiphone = true
                } else {
                    this.isiphone = false
                }
            },
            thisdo () {
                let userSuggestion = {}
                userSuggestion.info = this.ideas
                userSuggestion.linkNumber = this.iphonewords
                if (userSuggestion.info === '') {
                    let writeideas = document.getElementById('writeideas')
                    writeideas.style.border = '1px solid #e41414'
                    writeideas.focus()
                    return false
                }
                if (userSuggestion.linkNumber === '') {
                    let remineword = document.getElementById('remineword')
                    remineword.style.border = '1px solid #e41414'
                    remineword.focus()
                    return false
                }
                var parmas = JSON.stringify(userSuggestion)
                this.$http.post('/web/common/bottom/addSuggestion', parmas).then((response) => {
                    let data = response.body
                    console.log(data)
                })
            }
        }
    }
</script>
<style>
    .ideas{float: left;width: 100%;background: #ecedf0;}
    .Content{margin: 30px auto;width: 960px; overflow: hidden;background: white;border-radius: 10px;padding: 0 75px 125px 75px; box-sizing: border-box;border: 1px solid #ccc;}
    .Content:before,.Content:after{clear: both;}
    /*内容*/
    .relation{
        margin-bottom:10px;
        font-weight: 600;
        color: #323232;
        font-size: 16px;
    }
    .r_word{
        font-size: 14px;
        line-height: 34px;
        color: #636363;
    }
    .wrinte{
        margin-top: 50px;
        font-weight: 600;
        color: #323232;
        font-size: 16px;
    }
    .writeideas{
        display: inline-block;
        width:656px;
        height:242px;
        resize: none;
        margin-top:20px;
        font-size: 14px;
        padding: 8px 14px;
        color: #aaa;
        line-height: 24px;
        outline: none;
    }
    .remine{
        margin-top: 50px;
        font-weight: 600;
        color: #323232;
        font-size: 16px;
    }
    #remineword{
        display: block;
        width:290px;
        height: 32px;
        font-size: 14px;
        outline: none;
        text-indent: 10px;
        margin-top: 20px;
        border: 1px solid #ccc;
    }
    .clickqq{
        cursor: pointer;
        vertical-align: middle;
    }
    .Title{float: left;width: 100%;height: 100px;color: #323232;font-weight: bold; font-size: 24px;text-align: left; line-height: 100px;}
    .SubBtn{cursor: pointer; width: 290px;height: 38px;background: url("/static/common/com/btnbg.jpg")0 0 repeat;border: 0;outline: none;color: white;text-align: center;line-height: 38px;font-size: 16px;border-radius: 19px;margin:80px auto 80px auto;display: block; }
    .Rborder{border:1px solid #ccc!important;}
</style>
