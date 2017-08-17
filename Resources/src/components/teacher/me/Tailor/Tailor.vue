<template>
<div class="Tailor">
    <div class="TailorC">
        <ul class="showList">
            <li class="liImg">
                <img  src="static/teacher/images/Exemplar/m_ad1ic1.png"/>
            </li>
            <li class="liImg">
                <img  src="static/teacher/images/Exemplar/m_ad1ic2.png"/>
            </li>
            <li class="liImg">
                <img  src="static/teacher/images/Exemplar/m_ad1ic3.png"/>
            </li>
            <li class="liImg">
                <img  src="static/teacher/images/Exemplar/m_ad1ic4.png"/>
            </li>
            <li class="liImg">
                <img  src="static/teacher/images/Exemplar/m_ad1ic5.png"/>
            </li>
        </ul>
        <div class="clickDo">
            <div class="Swiper">
                <v-swiper></v-swiper>
            </div>
            <div class="Process">
                <div class="clickPPt">
                    <p class="buyRecord" @click="thisdo">购买记录</p>
                    <p class="clickWord">售价：2000金币</p>
                    <p class="ClickSub" @click="Customized">立即定制</p>
                </div>
                <div class="CProgreoss">
                    <p>支付成功，准备材料</p>
                    <p><img class="goico" src="/static/teacher/images/Exemplar/goico.png"/></p>
                    <p>等待确认，发送材料</p>
                    <p><img class="goico" src="/static/teacher/images/Exemplar/goico.png"/></p>
                    <p>制作完成，下载课件</p>
                    <p class="Ctel"><img class="p_pptico0" src="/static/teacher/images/Exemplar/p_pptico0.png"/>15764151078</p>
                    <p class="CTime"><img class="p_ppt1" src="/static/teacher/images/Exemplar/p_ppt1.png"/>周一至周日 8:00—20:00</p>
                </div>
            </div>
        </div>
    </div>
    <div class="Tshark">
        <!--使用卷-->
        <div class="Tcode">
            <p class="CMoney">
                <span class="Identification0 IdentificationAdd"></span>
                <span class="useCion">使用金币</span>
                <span class="useWord">2000金币</span>
            </p>
            <p class="Coupon">
                <span class="Identification1"></span>
                <span class="CouponCoupon">使用代金券</span>
                <span class="CouponWord">0张</span>
            </p>
            <p class="clickRight">
                <span class="Right" @click="showFion">确定</span>
                <span class="Cancle" @click="Delete">取消</span>
            </p>
            <span class="Delete" @click="Delete">X</span>
        </div>
        <!--填写信息-->
        <div class="WriteIfion">
            <p>我们怎样联系到您？</p>
            <p>手机：<input class="telPhone" type="text" v-model="telPhone"/></p>
            <p>QQ  ：<input class="qq" type="text" v-model="qq"/></p>
            <p>微信：<input class="weixin" type="text" v-model="WeiChat"/></p>
            <p>你对课件有什么要求吗？</p>
            <p><textarea class="isput" placeholder="最多输入200字" maxlength="200" v-model="isPut"></textarea></p>
            <div class="clickR" @click="subData">确认</div>
            <span class="Delete" @click="DeleteFion">x</span>
        </div>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
import Swiper from '../../../basic/Carousel .vue'
    export default {
        data () {
            return {
                'Tailor': '',
                'isTshark': false,
                'telPhone': '',
                    'qq': '',
                'WeiChat': '',
                'isPut': ''
            }
        },
        components: {
            'v-swiper': Swiper
        },
        methods: {
            thisdo () {
                console.log(this.$router)
                this.$router.push('/content/teacher/me/TailorRecorder')
            },
            Customized () {
                let Tshark = document.getElementsByClassName('Tshark')[0]
                let Tcode = document.getElementsByClassName('Tcode')[0]
                Tcode.style.display = 'block'
                Tshark.style.display = 'block'
                this.isTshark = true
            },
            showFion () {
                let Tcode = document.getElementsByClassName('Tcode')[0]
                let WriteIfion = document.getElementsByClassName('WriteIfion')[0]
                Tcode.style.display = 'none'
                WriteIfion.style.display = 'block'
            },
            Delete () {
                let Tshark = document.getElementsByClassName('Tshark')[0]
                let Tcode = document.getElementsByClassName('Tcode')[0]
                Tshark.style.display = 'none'
                Tcode.style.display = 'none'
                this.isTshark = false
            },
            DeleteFion () {
                let Tshark = document.getElementsByClassName('Tshark')[0]
                let WriteIfion = document.getElementsByClassName('WriteIfion')[0]
                Tshark.style.display = 'none'
                WriteIfion.style.display = 'none'
                this.isTshark = false
            },
            subData () {
                let Tshark = document.getElementsByClassName('Tshark')[0]
                let WriteIfion = document.getElementsByClassName('WriteIfion')[0]
                Tshark.style.display = 'none'
                WriteIfion.style.display = 'none'
                this.isTshark = false
                let parmas = {}
                parmas.mobile = this.telPhone
                parmas.qq = this.qq
                parmas.weixin = this.WeiChat
                parmas.requestDesc = this.isPut
                this.$http.post('/web/teacher/trade/saveUserRemarkInfo', parmas).then((response) => {
                    let data = response.body
                    console.log(data)
                })
            }
        }
    }
</script>
<style>
    .TailorC{
        width:900px;
        min-height: 500px;
        margin:40px auto;
    }
    .Crumbs{
        float: none;
    }
    .Se_MainBox{
        padding-bottom: 30px;
    }
    .showList{
        width:100%;
        height: 114px;
        margin-bottom: 50px;
    }
    .liImg{
        width: 153PX;
        height: 114px;
        overflow: hidden;
        border-radius: 10px;
        float: left;
        margin-top: 4px;
        margin-right: 2%;
        margin-left: 9px;
        box-sizing: border-box;
        padding: 5px;
        background: white;
        border: 1px solid #ccc;
    }
    .liImg img{
        width: 100%;
        height: 100%;
    }
    /*轮播区域*/
    .clickDo{
        width:100%;
        height: 434px;
        background: #fff;
        border-radius: 10px;
    }
    .Swiper{
        background: #fff;
        width:60%;
        height: 434px;
        float: left;
        border-radius: 10px;
    }
    .Process{
        width:40%;
        height: 434px;
        float: left;
    }
    .clickWord{
        font-size: 18px;
        text-align: center;
        margin-top: 15px;
    }
    .clickPPt{
        border-bottom: 1px solid #f4f4f4;
        width: 100%;
        min-height: 30px;
        height: 44%;
    }
    .ClickSub{
        display: block;
        width:50%;
        height: 50px;
        border-radius: 10px;
        margin: 20px auto;
        cursor: pointer;
        text-align: center;
        font-size: 24px;
        color: white;
        background: #CA0D0D;
        line-height: 50px;
        border: 0;
        outline: none;
    }
    .buyRecord{
        font-size: 14px;
        color: #65b113;
        line-height: 40px;
        text-align: right;
        margin-right: 30px;
        cursor: pointer;
    }
    .CProgreoss{
        text-align: center;
        margin-top: 10px;
    }
    .CProgreoss p{
        color: #666;
        font-size: 16px;
    }
.goico{
    display: inline-block!important;
    width:18px;
    height: 28px;
    vertical-align: middle!important;
}
    .p_pptico0,.p_ppt1{
        display: inline-block!important;
        width:32px;
        height: 28px;
        vertical-align: middle!important;
    }
    .Ctel{
        display: block;
        width:170px;
        height: 34px;
        margin: 20px 0 0 100px;
        text-align: left;
    }
    .CTime{
        display: block;
        width:250px;
        height: 34px;
        margin: 10px 0 0 100px;
        text-align: left;
    }
    .Ctel img,.CTime img{
        margin-right: 10px;
    }
    /*使用金币*/
    .Tshark{
        display: block;
        width:100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        position: fixed;
        top:0;
        z-index: 6666;
        display: none;
    }
    .Tcode{
        width: 640px;
        height: 340px;
        background: white;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 10px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
    }
    .CMoney,.Coupon{
        width:400px;
        height: 40px;
        margin:65px auto 0;
        font-size: 24px;
        color: #333;
    }
    .Coupon{
        margin:30px auto 0;
    }
    .Identification0,.Identification1{
        display: inline-block;
        width:20px;
        height:20px;
        border-radius: 10px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }
    .IdentificationAdd{
        display: inline-block;
        width:20px;
        height:20px;
        border-radius: 10px;
        background: #65b113;
        box-sizing: border-box;
        border: 0;
    }
    .useCion,.CouponCoupon{
        display: inline-block;
        width: 130px;
        text-align: left;
        line-height: 32px;
        margin-left: 45px;
    }
    .useWord,.CouponWord{
        display: inline-block;
        width: 130px;
        text-align: left;
        line-height: 32px;
        margin-left: 45px;
    }
    .clickRight{
        width:400px;
        height: 40px;
        margin: 30px auto 0;

    }
    .Right{
         display: inline-block;
         width:190px;
         height: 40px;
         background: #65b113;
         color: #fff;
         text-align: center;
         line-height: 40px;
         border-radius: 10px;
        letter-spacing: 2px;
        cursor: pointer;
     }
    .Cancle{
        display: inline-block;
        width:190px;
        height: 40px;
        background: #ccc;
        color: #fff;
        text-align: center;
        line-height: 40px;
        border-radius: 10px;
        margin-left: 15px;
        letter-spacing: 2px;
        cursor: pointer;
    }
    .Delete{
        position: absolute;
        right: 20px;
        top:20px;
        cursor: pointer;
    }
    /*填写信息*/
    .WriteIfion{
        width:900px;
        height: 550px;
        background: #fff;
        border-radius: 10px;
        position: fixed;
        left: 0;
        right: 0;
        top:0;
        bottom: 0;
        margin:auto;
        font-size: 14px;
        color: #666;
        display: none;
    }
    .WriteIfion p {
        width: 100%;
        min-height: 45px;
        line-height: 45px;
        vertical-align: middle!important;
        text-indent: 80px;
        margin-bottom: 10px;
    }
    .WriteIfion p:first-child{
        margin-top: 30px;
    }
    .WriteIfion p:nth-of-type(5){
        margin: 0px;
    }
    input{
        display: inline-block;
        width:200px;
        height: 35px;
        border:1px solid #ccc;
        border-radius: 5px;
        outline: none;
        text-indent: 10px;
    }
    .isput{
        width:450px;
        height: 145px;
        border-radius: 10px;
        resize: none;
        padding: 10px;
        outline: none;
    }
    .WriteIfion p:nth-of-type(6){
        margin-bottom: 0;
    }
    .clickR{
        width:200px;
        height: 45px;
        border-radius: 10px;
        color: #fff;
        line-height: 45px;
        text-align: center;
        background: #65b113;
        margin:0 auto;
        cursor: pointer;
    }
    .Delete{
        position: absolute;
        right: 20px;
        top:20px;
        font-size: 24px;
        font-weight: 100;
    }
</style>
