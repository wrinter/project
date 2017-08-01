<template>
    <div class="company">
        <v-header></v-header>
        <div class="company">
            <div  class="Content">
                <h1 class="Title">填写企业信息</h1>
                <ul class="List">
                    <li>
                        <span>公司名称：</span>
                        <input type="text" class="subData"  id="Name" data-name = "name" @blur="blurDo" :class="isDataName === true ? Rborder : ''" v-model="DataName" >
                    </li>
                    <li>
                        <span>联系人姓名：</span>
                        <input type="text" class="subData"  id="UserName" data-name = "linkName" @blur="blurDo" :class="isDataLinkName === true ? Rborder : ''" v-model="DataLinkName">
                    </li>
                    <li>
                        <span>联系人职务：</span>
                        <input type="text" class="subData" id="UserDuty" data-name = "linkPosition" @blur="blurDo" :class="isDataLinkPosition === true ? Rborder : ''" v-model="DataLinkPosition">
                    </li>
                    <li>
                        <span>联系电话：</span>
                        <input type="text" class="subData" id="UserTell" data-name = "linkPhone" @blur="blurDo" :class="isDataLinkPhone === true ? Rborder : ''" v-model="DataLinkPhone">
                    </li>
                    <li>
                        <span>主营业务：</span>
                        <textarea  id="Business" data-name = "mainBusiness" class="subData" :class="isDatamainBusiness === true ? Rborder : ''" placeholder="请描述公司主营业务,限50字" maxlength="50" @blur="blurDo" v-model="DatamainBusiness"></textarea>
                    </li>
                    <li>
                        <span>合作意向：</span>
                        <textarea  id="Purpose" data-name = "cooperation" class="subData" :class="isDatacooperation === true ? Rborder : ''" placeholder="请填写合作意向，限200字" maxlength="200" @blur="blurDo" v-model="Datacooperation"></textarea>
                    </li>
                </ul>
                <div style="clear: both;"></div>
                <input type="button" value="提交" class="SubBtn" @click="thisdo">
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
                Rborder: 'Rborder',
                Company: '',
                DataName: '',
                isDataName: false,
                DataLinkName: '',
                isDataLinkName: false,
                DataLinkPosition: '',
                isDataLinkPosition: false,
                DataLinkPhone: '',
                isDataLinkPhone: false,
                DatamainBusiness: '',
                isDatamainBusiness: false,
                Datacooperation: '',
                isDatacooperation: false
            }
        },
        components: {
            'v-header': Head,
            'router-footer': footer
        },
//        created () {
//            this.blurDo()
//        },
        methods: {
            thisdo () {
                var userBusinessPartersRes = this.parmsData()
                if (userBusinessPartersRes === false) {
                    return false
                }
                var parmas = JSON.stringify(userBusinessPartersRes)
                console.log(parmas)
                this.$http.post('/web/common/bottom/addBusinessParters', parmas).then((response) => {
                    let data = response.body
                    console.log(data)
                })
            },
            parmsData () {
                let userBusinessPartersRes = {}
                let is = true
                let subData = document.getElementsByClassName('subData')
                for (let i = 0; i < subData.length; i++) {
                    let dataName = subData[i].getAttribute('data-name')
                    let DataName = subData[i].value
//                  没有内容的时候变红
                    if (DataName === '') {
                        subData[i].focus()
                        subData[i].style.border = '1px solid #e41414'
                        is = false
                        return false
                    }
                    userBusinessPartersRes[dataName] = DataName
                }
                if (is === false) {
                    return false
                }
                userBusinessPartersRes.type = '1'
                return userBusinessPartersRes
            },
            blurDo () {
                let DataName = this.DataName
                let DataLinkName = this.DataLinkName
                let DataLinkPosition = this.DataLinkPosition
                let DataLinkPhone = this.DataLinkPhone
                let DatamainBusiness = this.DatamainBusiness
                let Datacooperation = this.Datacooperation
                if (DataName) {
                    this.isDataName = true
                } else {
                    this.isDataName = false
                }
                if (DataLinkName) {
                    this.isDataLinkName = true
                } else {
                    this.isDataLinkName = false
                }
                if (DataLinkPosition) {
                    this.isDataLinkPosition = true
                } else {
                    this.isDataLinkPosition = false
                }
                if (DataLinkPhone) {
                    this.isDataLinkPhone = true
                } else {
                    this.isDataLinkPhone = false
                }
                if (DatamainBusiness) {
                    this.isDatamainBusiness = true
                } else {
                    this.isDatamainBusiness = false
                }
                if (Datacooperation) {
                    this.isDatacooperation = true
                } else {
                    this.isDatacooperation = false
                }
            }
        }
    }
</script>
<style>
    .company{float: left;width: 100%;background: #ecedf0;}
    .Content{width: 960px; margin: 30px auto;overflow: hidden;background: white;border-radius: 10px;padding: 0 75px 125px 75px; box-sizing: border-box;border: 1px solid #ccc;}
    .Content:before,.Content:after{clear: both;}
    .Title{float: left;width: 100%;height: 100px;color: #323232;font-weight: bold; font-size: 24px;text-align: left; line-height: 100px;}
    .List,.List>li{float: left;width: 100%;box-sizing: border-box;}
    .List>li{margin-bottom: 20px;line-height: 32px;color: #323232;}
    .List>li>span{float: left;width: 120px;text-align: left;font-size: 16px;color: #323232;line-height: 32px;}
    .List>li>input{float: left;width: 290px;padding-left: 10px; height: 32px;border: 1px solid #ccc; box-sizing: border-box;outline:none; text-align: left;font-size: 16px;color: #323232;line-height: 30px;}
    .List>li>textarea{float: left;width: 520px;resize:none; padding: 10px; height: 150px;border: 1px solid #ccc; box-sizing: border-box;outline:none; text-align: left;font-size: 16px;color: #323232;line-height: 24px;}
    .SubBtn{cursor: pointer; width: 290px;height: 38px;background: url("/static/common/com/btnbg.jpg")0 0 repeat;border: 0;outline: none;color: white;text-align: center;line-height: 38px;font-size: 16px;border-radius: 19px;margin:50px auto 80px auto;display: block; }
    .Rborder{border:1px solid #ccc!important;}
</style>
