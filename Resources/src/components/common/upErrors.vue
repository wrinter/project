<template>
<div class="upErrors">
    <div class="p_reloadfalse">
        <span class="p_success_dele"></span>
        <span class="p_name"></span>
    </div>

    <div class="p_wrong">
        <span class="p_wrongtitle">报错</span>
        <ul class="p_wrongselect">
            <li class="p_errortype" v-for="(data,index) in datas" @click="select(data.value,index)">{{data.label}}</li>
        </ul>
        <textarea class="p_wrongresaon" maxlength="100" placeholder="请输入错误原因(请输入100字以内)" v-model="value"></textarea>
        <div class="p_sendcl">
            <span class="p_cesend" @click="thisdo">确定</span>
            <span class="p_cecancel" @click="Delete">取消</span>
        </div>
        <i class="spriteImg c_ruleico fl p_cedelte" @click="Delete"></i>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {
    data () {
        return {
            Errors: '',
            datas: '',
            selectValue: '',
            value: ''
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData () {
            this.$http.post('/web/common/report/error').then((response) => {
                let data = response.body
                this.datas = data.retData
                console.log(data)
            })
        },
        select (value, index) {
            this.selectValue = value
            let Errortype = document.getElementsByClassName('p_errortype')
            for (let i = 0; i < Errortype.length; i++) {
                Errortype[i].style.background = '#fff'
                Errortype[i].style.color = '#333'
            }
            Errortype[index].style.background = '#f39c12'
            Errortype[index].style.color = '#fff'
        },
        thisdo () {
            let questionId = sessionStorage.getItem('questionId')
            console.log(questionId)
            let parmas = {}
            parmas.errorType = this.selectValue
            parmas.errorResean = this.value
            parmas.questionId = questionId
            if (parmas.errorType === '') {
                alert('请选择错误类型...')
                return false
            }
            if (parmas.errorResean === '') {
                alert('请填写错误原因...')
                return false
            }
            this.$http.post('/web/teacher/paper/assign/savequestionerror', parmas).then((response) => {
                let data = response.body
                console.log(data)
                this.Delete()
            })
        },
        Delete () {
            let upErrors = document.getElementsByClassName('upErrors')[0]
            let Wrongresaon = document.getElementsByClassName('p_wrongresaon')[0]
            let Errortype = document.getElementsByClassName('p_errortype')
            for (let i = 0; i < Errortype.length; i++) {
                Errortype[i].style.background = '#fff'
                Errortype[i].style.color = '#333'
            }
            this.selectValue = ''
            Wrongresaon.value = ''
            upErrors.style.display = 'none'
        }
    }
}
</script>
<style>
    .upErrors{
        display: block;
        position:fixed ;
        width:100%;
        height: 100%;
        top:0;
        left:0;
        background: rgba(0,0,0,0.3);
        z-index: 9999;
        display: none;
    }
    .p_wrong{
        width: 690px;
        height: 470px;
        background: #fff;
        left: 50%;
        top: 50%;
        margin-left: -345px;
        margin-top: -235px;
        border-radius: 15px;
        position: relative;
    }
    .p_wrongtitle{
        display: block;
        width: 100%;
        height: 64px;
        text-align: center;
        line-height: 64px;
        font-size: 24px!important;
        color: #65b113;
    }
    .p_wrongselect{
        width: 555px;
        min-height: 130px;
        margin-left: 40px!important;
    }
    .p_wrongselect li{
        float: left;
        width: 150px;
        height: 45px;
        border-radius: 10px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        margin-right: 30px!important;
        margin-top: 10px!important;
        line-height: 45px;
        cursor: pointer;
        text-align: center;
    }
    .p_wrongresaon{
        display: block;
        width: 540px;
        height: 135px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-sizing: border-box;
        resize: none;
        text-indent: 10px;
        outline: none;
        font-size: 18px!important;
        line-height: 36px;
        color: #333;
        margin-left: 40px!important;
        padding: 0px 10px;
    }
    .p_sendcl{
        width: 100%;
        height: 45px;
        margin-top: 30px!important;
    }
    .p_cesend{
        display: block;
        width: 240px;
        height: 45px;
        background: #65b113;
        color: #fff;
        border-radius: 10px;
        font-size: 18px!important;
        line-height: 45px;
        text-align: center;
        margin-left: 65px!important;
        float: left;
        cursor: pointer;
    }
    .p_cecancel{
        display: block;
        width: 240px;
        height: 45px;
        background: #999999;
        color: #fff;
        border-radius: 10px;
        font-size: 18px!important;
        line-height: 45px;
        text-align: center;
        margin-left: 30px!important;
        float: left;
        cursor: pointer;
    }
    .p_cedelte{
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }
    /*报错*/
    .p_loadcon li,.p_loadcon li div,.p_loadcon li,.p_loadcon li p{line-height: 30px;}
    .selected{
        background: #f39c12;
        color: #fff;
    }
</style>
