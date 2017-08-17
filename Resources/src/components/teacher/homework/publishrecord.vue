<template>
  <div>
    <div class="m_table">
      <div class="m_title">
        <div class="fl">名称</div>
        <div class="fl">状态</div>
        <div class="fl">布置对象</div>
        <div  class="fl">布置时间 </div>
        <div  class="fl">&nbsp;&nbsp;</div>
      </div>
      <div class="m_allRecords">
        <ul class="m_records" v-for="temp in recordList">
          <router-link v-bind:to="'/content/teacher/homework/notebook'">
            <li class="fl m_toPreview">{{temp.aliasName}}</li>
          </router-link>
          <!--<a href="me_pubAndPrint.html?paperId=3f9c302ebbca4e44901586a358f042df&amp;paperType=119&amp;assignId=403235213ba141ed865b919511390560">-->
          <!--</a>-->
          <li class="fl m_status">{{temp.isPublish}}</li>
          <li class="fl m_grade">{{temp.classId}}</li>
          <li class="fl m_pubTime">{{temp.assignTime}}</li>
          <li class="m_del spriteImg p_delico0 fr" v-if="temp.status=='2'" @click="deleteRecord(temp.id)"></li>
        </ul>
      </div>
    </div>
    <v-mark :MarkCon="markInfo"></v-mark>
  </div>
</template>
<script type="text/ecmascript-6">
  import mark from '../../common/Mark.vue'
    export default {
      data() {
        return{
          recordList:[],
          markInfo:{'Con':'','Random':''}
        };
      },
      mounted() {
        this.getRecord()
      },
      methods:{
        getRecord() {
          this.$http.post('/web/teacher/center/wrongbook/paper/record').then(function(response) {
            let retCode = response.body.retCode
            if(retCode === '0000') {
              this.recordList = []
              let retData = response.body.retData
              for(let i=0;i<retData.length;i++) {
                let record = {}
                record.id = retData[i].id
                record.classId = retData[i].classId
                record.status = retData[i].status
                record.paperResId = retData[i].paperResId
                record.aliasName = retData[i].aliasName
                let date = new Date(retData[i].assignTime);
                let Y=date.getFullYear();
                let M=date.getMonth();
                let D=date.getDate();
                let H=date.getHours();
                let m=date.getMinutes();
                record.assignTime = Y+'-'+M+'-'+D+' '+H+':'+m;
                if(retData[i].status === '2') {
                  record.isPublish = '未布置'
                } else {
                  record.isPublish = '已布置'
                }
                this.recordList.push(record)
              }
            }
          })
        },
        deleteRecord(id) {
          let para = {'paperAssignId':id}
          this.$http.post('/web/teacher/center/wrongbook/paper/delete', para, {'emulateJSON': true}).then(function(response) {
            let retCode = response.body.retCode
            if(retCode === '0000') {
              this.markInfo.Con = '删除成功'
              this.getRecord()
            }
          })
        }
      },
      components:{
        'v-mark':mark
      }
    };
</script>
<style>
  .m_toPreview{cursor:pointer;}
  @media screen and (max-width:1366px) {
    .m_table {
      width: 900px;
      height: auto;
      min-height: 600px;
      margin: 0 auto;
      margin-top: 85px;
      border-radius: 10px;
      border: 1px solid #ccc;
      background: #fff;
      text-align: center;
      overflow: hidden;
    }

    .m_table .m_title {
      height: 60px;
      line-height: 60px;
      overflow: hidden;
      border-bottom: 1px solid #ccc;
    }

    .m_table .m_title > div {
      width: 200px;
      font-size: 16px;
      font-family: "微软雅黑";
      color: #333;
    }

    .m_table .m_records {
      width: 900px;
      height: 36px;
      line-height: 36px;
    }

    .m_table .m_records  li {
      color: #666;
      font-size: 14px;
      font-family: "微软雅黑";
      height: 36px;
      width: 200px;
    }

    .m_table .m_records  li:first-child {
      text-decoration: underline;
    }

    .m_table ul:nth-child(2n) {
      background: #f6f6f6;
    }

    .m_table .m_records .m_del {
      width: 24px;
      height: 24px;
      margin-right: 70px;
      margin-top: 8px;
      overflow: hidden;
      cursor: pointer;
    }
  }

  @media screen and (min-width:1366px){
    .m_table {
      width: 1000px;
      height: auto;
      min-height: 600px;
      margin: 0 auto;
      margin-top: 36px;

      border-radius: 10px;
      border: 1px solid #ccc;
      background: #fff;
      text-align: center;
    }

    .m_table .m_title {
      height: 60px;
      line-height: 60px;
      overflow: hidden;
      border-bottom: 1px solid #ccc;
    }

    .m_table .m_title > div {
      width: 200px;
      font-size: 16px;
      font-family: "微软雅黑";
      color: #333;
    }

    .m_table .m_records {
      width: 1000px;
      height: 36px;
      line-height: 36px;
    }

    .m_table .m_records  li {
      color: #666;
      font-size: 14px;
      font-family: "微软雅黑";
      height: 36px;
      width: 200px;
    }

    .m_table .m_records  li:first-child {
      text-decoration: underline;
    }

    .m_table ul:nth-child(2n) {
      background: #f6f6f6;
    }

    .m_table .m_records .m_del {
      width: 24px;
      height: 24px;
      margin-right: 108px;
      margin-top: 8px;
      overflow: hidden;
    }
  }

  @media screen and (min-width: 1600px){
    .c_Main {
      min-height: 874px !important;
    }
    .m_table {
      width: 1200px;
      height: auto;
      min-height: 600px;
      margin: 0 auto;
      margin-top: 36px;

      border-radius: 10px;
      border: 1px solid #ccc;
      background: #fff;
      text-align: center;
    }

    .m_table .m_title {
      height: 60px;
      line-height: 60px;
      overflow: hidden;
      border-bottom: 1px solid #ccc;
    }

    .m_table .m_title > div {
      width: 240px;
      font-size: 18px;
      font-family: "微软雅黑";
      color: #333;
    }

    .m_table .m_records {
      width: 1200px;
      height: 40px;
      line-height: 40px;
    }

    .m_table .m_records  li {
      color: #666;
      font-size: 14px;
      font-family: "微软雅黑";
      height: 40px;
      width: 240px;
    }

    .m_table .m_records  li:first-child {
      text-decoration: underline;
    }

    .m_table ul:nth-child(2n) {
      background: #f6f6f6;
    }

    .m_table .m_records .m_del {
      width: 24px;
      height: 24px;
      margin-right: 108px;
      margin-top: 8px;
      overflow: hidden;
    }
  }
</style>
