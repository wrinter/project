<template>
    <div class="CourseOffice" style="color: #fff">
        <a class="a" :href=" 'http://ow365.cn/?i='+officeWebId+'&n=5&furl='+url " ></a>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
    data () {
        return {
            'CourseOffice': '',
            'path': '',
            'url': '',
            'officeWebId': ''
        }
    },
    props: {
        PPTid: String
    },
    mounted () {
        this.thisdo()
    },
    methods: {
        thisdo () {
            let PPTid = this.PPTid
            console.log(PPTid)
            let parmas = {}
            parmas.resourseId = PPTid
            this.$http.post('/web/common/office/onlineViewRes', parmas).then((response) => {
                let data = response.body
                console.log(data)
                let officeWebId = data.retData.officeWebId
                let url = data.retData.url
                this.officeWebId = officeWebId
                this.url = url
                let Curl = {}
                Curl.officeWebId = officeWebId
                Curl.url = url
                this.$emit('Curl', Curl)
            })
        }
    }
}
</script>
<style>
</style>
