<template>
    <div class="Com_Footer">
        <div class="FooterCon">
            <div class="FooterLeft">
                <ul class="FooterNav">
                    <li v-for="tim in tims" @click="thisdo(tim.value)">{{tim.label}}</li>
                </ul>
                <p class="Copyright">Copyright ©2017 山东百川图书有限公司  All Rights Reserved. 鲁ICP备16038439号-2</p>
            </div>
            <div class="FooterRight">
                <ul class="FooterIcoBox">
                    <li class="cup">
                        <html xmlns:wb="http://open.weibo.com/wb"></html>
                        <wb:follow-button uid="6159972840" type="red_1" width="67" height="24" class="Weibofocus"></wb:follow-button>
                        <img src="static/common/com/weibo.png" alt="">
                    </li>
                    <li class="cup">
                        <img src="static/common/com/weixin.png" alt="" class="Footer_Weixin">
                        <img src="static/common/com/weicode.png" alt="" class="Footer_Weicode">
                    </li>
                    <li><a href="https://tieba.baidu.com/f?kw=%E4%BA%94%E5%A5%BD%E5%AF%BC%E5%AD%A6&fr=wwwt" target="_blank"><img src="static/common/com/tieba.png" alt=""></a></li>
                    <li><img src="static/common/com/qqShow.png" alt=""></li>
                </ul>
                <ul class="FooterInfo">
                    <li>客服QQ：3582840438</li>
                    <li>教师招募群：248247263</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
    data () {
        return {
            'tims': ''
        }
    },
    created () {
        this.getData()
    },
    methods: {
        getData () {
            this.$http.post('/web/common/bottom/menu').then((response) => {
                let data = response.body
                console.log(data)
                this.tims = data.retData
            })
        },
        thisdo (value) {
            if (value === 'about_us_keys') {
//                this.$router.push('/company')
                let url = window.location.href
                window.location.href = url.replace(this.$route.path, '/aboutUs')
            }
            if (value === '02') { // 公司
//                this.$router.push('/aboutUs')
                let url = window.location.href
                window.location.href = url.replace(this.$route.path, '/company')
            }
            if (value === '03') { // 学校
                let url = window.location.href
                window.location.href = url.replace(this.$route.path, '/school')
            }
            if (value === 'recruitment_keys') { // 人才招聘
                let url = window.location.href
                window.location.href = url.replace(this.$route.path, '/Recruit')
            }
            if (value === '05') { // 帮助中心
                let url = window.location.href
                window.location.href = url.replace(this.$route.path, '/helpCenter')
            }
            if (value === '06') { // 意见反馈
                let url = window.location.href
                window.location.href = url.replace(this.$route.path, '/ideas')
            }
        }
    }
}
</script>
<style>
    /*底部*/
    .Com_Footer{float: left;width: 100%;height: 120px;background: #1c1c1c;font-family: 'microsoft yahei';}
    .FooterCon:before,.FooterCon:after{clear: both;}
    .FooterCon{width: 1000px;height: 120px;margin: auto;text-align: center;}
    .FooterLeft{float: left;width: 600px;height: 120px;box-sizing: border-box; }
    .FooterNav{float: left;width: 100%;margin-left: -20px;margin-top: 38px;}
    .FooterNav>li{float: left;border-right:1px solid #404040;text-align: center; width: 95px;box-sizing: border-box; height: 15px;line-height: 15px;font-size: 14px;color: #959595;}
    .FooterNav>li:last-child{border-right: 0;}
    .FooterNav>li{width: 95px;box-sizing: border-box; height: 15px;line-height: 15px;font-size: 14px;color: #959595;cursor: pointer}
    .FooterNav>li:hover{color:#00ce9e; }
    .Copyright{float: left;margin-top: 5px; text-align: left;width: 100%;font-size: 14px;color: #636363;line-height: 22px;font-family: 'microsoft yahei';}
    .FooterRight{float: right;height: 120px;width: 330px;box-sizing: border-box; }
    .FooterIcoBox{float: left;width: 170px;box-sizing: border-box; height: 32px;margin-top: 44px;}
    .FooterIcoBox>li{float: left;margin-right: 10px;text-align: left;line-height: 32px;position: relative;}
    .FooterInfo{float: right;width: 160px;font-size: 14px;margin-top: 38px;}
    .FooterInfo>li{float: left;width: 100%;font-size: 14px;color: white;font-family: 'microsoft yahei';line-height: 22px;text-align: left;}
    .Footer_Weicode{position: absolute;width: 114px;max-width: none;top: -124px;left: -42px;display: none;}
    .Weibofocus{opacity: 0;filter: alpha(opacity=0); width: 32px!important;height: 32px!important;position: absolute;}
    .Weibofocus>iframe{width: 32px!important;}
</style>
