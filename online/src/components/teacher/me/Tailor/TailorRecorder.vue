<template>
<div class="TailorRecoder">
    <div class="m_MyGift">
        <!--头部-->
        <h2 class="m_PurchaseTit">购买记录</h2>
        <!--购买记录头部列表-->
        <div class="m_PurListTit">
            <span class="m_PurTimeT">时间</span>
            <span class="m_PurPrice">价格</span>
            <span class="m_PurStatus">状态</span>
        </div>
        <!--购买记录列表-->
        <ul class="m_GoldList">
            <li class="List" v-for="data in datas">
                <span class="m_PurTimeT">{{data.createTime}}</span>
                <span class="m_PurTimeT" v-if="data.payment.rebateId !== null">优惠券</span>
                <span class="m_PurTimeT" v-else="">{{data.amount}} 金币</span>
                <span class="m_PurPrice" v-if="data.status === '2'">待确认</span>
                <span class="m_PurPrice" v-if="data.status === '3'">制作中</span>
                <span class="m_PurPriceDownload" v-if="data.status === '4'" @click="Download(data.id)">下载</span>
            </li>
        </ul>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {
    data () {
        return {
            'TailorRecoder': '',
            'datas': ''
        }
    },
    mounted () {
        this.thisdo()
    },
    methods: {
        thisdo () {
            this.$http.post('/web/teacher/trade/queryPurList').then((response) => {
                let data = response.body
                this.datas = data.retData
                console.log(data)
            })
            let a = document.createElement('a')
//            a.setAttribute('href', data.retData)
//            a.setAttribute('download', '下载')
            console.log(a)
            a.onclick
        },
        Download (id) {
            let parmas = {}
            parmas.fileId = id
            this.$http.post('/web/common/baidu/view', parmas).then((response) => {
                let data = response.body
                console.log(data)
                let a = document.createElement('a')
                a.setAttribute('href', data.retData)
                a.setAttribute('download', '下载')
                a.onclick
            })
        }
    }
}
</script>
<style>
.TailorRecoder{
    width:960px;
    height: 550px;
    background: #fff;
    border-radius: 10px;
    margin:40px auto;
}
.Crumbs{
    float: none;
}
.Se_MainBox{
    padding-bottom: 30px;
}
.m_PurchaseTit{
    width:100%;
    height: 60px;
    font-size: 24px;
    text-align: center;
    line-height: 60px;
}
.m_PurListTit{
    width:100%;
    height:55px;
    background: #f6f6f6;
    color: #333;
}
.m_PurListTit span{
    display: inline-block;
    width:33%;
    text-align: center;
    font-size: 18px;
    line-height: 55px;
    color: #333;
}
.m_GoldList li{
    width:100%;
    height:40px ;
}
.m_GoldList li:nth-child(2n){
    background: #f6f6f6;
}
.m_GoldList li span{
    display: inline-block;
    width:33%;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
    color: #666;
}
</style>
