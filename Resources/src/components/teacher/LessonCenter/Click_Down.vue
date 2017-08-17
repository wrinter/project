<template>
<div class="click_down">
    <div class="Wrap">
        <div class="clickDown" @click="thisdo">
            <div class="clickWord">下载</div>
            <span class="DownWord">1金币</span>
        </div>
        <div class="Error" @click="upErrors">
            <span class="SeeError">发现错误？</span>
            <span class="clickError">请报错</span>
        </div>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {
    data () {
        return {
            clickDown: ''
        }
    },
    props: {
        clickDown: String
    },
    methods: {
        post (url) {
            let temp = document.createElement('form')
            temp.action = url
            temp.method = 'post'
            temp.style.display = 'none'
            // var opt = document.createElement("input")
            // opt.value = params
            // temp.appendChild(opt)
            document.body.appendChild(temp)
            temp.submit()
            return temp
        },
        thisdo () {
            let id = this.clickDown
            let url = '/web/teacher/prepare/exemplarsDownload?resQuestionId=' + id
            this.post(url)
        },
        upErrors () {
            let id = this.clickDown
            sessionStorage.setItem('questionId', id)
            let upErrors = document.getElementsByClassName('upErrors')[0]
            upErrors.style.display = 'block'
        }
    }
}
</script>
<style>
.click_down{
    position: absolute;
    right:20px;
    top:40px;
    display: none;
}
.Wrap{
    display: block;
    width: 100px;
    height: 35px;
    border-radius: 10px;
    background: #65b113;
    line-height: 35px!important;
    text-align: center;
    color: #fff;
    font-size: 14px!important;
    cursor: pointer;
}
.DownWord{
    color: #ff7043;
    text-align: center;
    font-size: 14px;
}
.Error{
    display: block;
    width: 100px;
    font-size: 12px!important;
    line-height: 10px;
}
.SeeError{
    color: #333;
}
.clickError{
    color: #49b9df;
}
</style>
