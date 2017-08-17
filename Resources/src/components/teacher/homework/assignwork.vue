<template>
  <div class="c_Main ">
    <!-- 布置作业 -->
    <div class="hj_Box">
      <!-- 章节 -->
      <div class="hj_Chapter">
        <v-section @ListenChild="RecieveChild"></v-section>
      </div>
      <!-- 作业类型 -->
      <div class="hj_Type">
        <dl>
          <dt>作业类型：</dt>
          <dd>
            <div class="h_Type_ul">
              <div>
                <div class="h_Type" v-for="type in types">
                  <router-link v-bind:to="type.link+'&id='+type.id+'&paperType='+type.paperType" class="needsetstorage">
                    <img :src="type.src" alt="type.title">
                  </router-link>
                </div>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <!-- 我的作业 -->
      <div class="hj_Mine">
        <dl>
          <dt>我的作业：</dt>
          <dd>
            <table class="h_Minework_table">
              <tr v-if="paperList.length>0"><th>名称</th><th>状态</th><th>布置对象</th><th>时间</th><th>　</th></tr>
              <tr v-else ><td colspan="5" style="font-size: 18px;padding-top: 30px;background-color: #fff;"><img class="nodata" src="/static/common/images/no.png"></td></tr>
              <tr v-for="paper in paperList">
                <td>
                  <router-link v-bind:to="'/content/teacher/homework/assignpaper?htype=mylist&id='+paper.id+'&status='+paper.status+'&paperType='+paper.paperType+'&paperId='+paper.paperId" class="needsetstorage"  data-target="mylist">
                    {{paper.aliasName}}
                  </router-link>
                </td>
                <td><span :class="{'green':paper.status!='2', 'gray':paper.status=='2'}">{{showStatus(paper.status)}}</span></td>
                <td>{{paper.objname}}</td>
                <td>{{paper.assignTime}}</td>
                <td>
                  <input class="myWork_del" value="删除" type="button" v-if="paper.status=='2'" @click="deletePaper(paper.id,paper.paperId)">
                </td>
              </tr>
            </table>
          </dd>
        </dl>
      </div>
    </div>
    <v-mark :MarkCon="markInfo"></v-mark>
  </div>
</template>
<script type="text/ecmascript-6">
  import section from '../../common/section'
  import mark from '../../common/Mark.vue'
  export default {
    data () {
      return {
        ThisSectionId:'',
        menuId:'',
        types:[],
        paperList:[],
        markInfo:{'Con': '','Random': ''},
        subjectId:''
      };
    },
    mounted() {
      window.localStorage.setItem('type','work')
      this.initType()
      this.getSubject()
    },
    methods: {
      RecieveChild (Id) {
        this.ThisSectionId = Id
        window.localStorage.setItem('knowledgeId', Id)
        this.getList()
      },
      initType () {
        this.menuId = window.localStorage.getItem('menuid')
        let para = {'menuId':this.menuId}
        this.$http.post('/web/teacher/paper/assign/types', para, {'emulateJSON': true}).then(function (response) {
          if (response.body.retCode === '0000') {
            let retData = response.body.retData
            let cList = retData[0].childsList
            for(let i = 0; i < cList.length; i++) {
              let obj = cList[i]
              if(obj.title === '课时练') {
                let type = {}
                type.id = obj.id
                type.title = obj.title
                type.paperType = '101'
                type.src = '/static/teacher/images/homework/h_Type_01.jpg'
                type.link = '/content/teacher/homework/assignpaper?htype=standard'
                this.types.splice(0,0,type)
              } else if (obj.title === '随堂检测') {
                let type = {}
                type.id = obj.id
                type.title = obj.title
                type.paperType = '105'
                type.src = '/static/teacher/images/homework/h_Type_06.jpg'
                type.link = '/content/teacher/homework/assignpaper?htype=standard'
                this.types.push(type)
              }else if (obj.title === '分层作业') {
                let list = obj.childsList.reverse()
                for(let j = 0; j<list.length; j++) {
                  let type = {}
                  type.id = list[j].id
                  type.title = list[j].title
                  type.paperType = '10' + (j+2)
                  type.src = '/static/teacher/images/homework/h_Type_0' + (j + 2) + '.jpg'
                  type.link = '/content/teacher/homework/assignpaper?htype=standard'
                  this.types.push(type)
                }
              } else if (obj.title === '模拟套卷') {
                let type = {}
                type.id = obj.id
                type.title = obj.title
                type.paperType = '202'
                type.src = '/static/teacher/images/homework/h_Type_07.jpg'
                type.link = '/content/teacher/homework/assignpaper?htype=standard'
                this.types.push(type)
              } else if (obj.title === '自主组卷') {
                let type = {}
                type.id = obj.id
                type.title = obj.title
                type.paperType = '116'
                type.src = '/static/teacher/images/homework/h_Type_05.jpg'
                type.link = '/content/teacher/homework/assignedit?htype=standard'
                this.types.push(type)
              } else if (obj.title === '听力测试') {
                let type = {}
                type.id = obj.id
                type.title = obj.title
                type.paperType = '203'
                type.src = '/static/teacher/images/homework/h_Type_08.jpg'
                type.link = '/content/teacher/homework/assignpaper?htype=standard'
                this.types.push(type)
              }
            }
          }
        })
      },
      getSubject () {
        this.$http.post('/web/teacher/center/baseinfo').then(function (response) {
          if (response.body.retCode === '0000') {
            this.subjectId = response.body.retData.subjectId
            window.localStorage.setItem('subjectId', this.subjectId)
          }
        })
      },
      getList () {
        let para = {'knowledgeId':this.ThisSectionId}
        this.$http.post('/web/teacher/paper/assign/paperslist', para, {'emulateJSON': true}).then(function (response) {
          if (response.body.retCode === '0000') {
            this.paperList = response.body.retData
          }
        })
      },
      showStatus (status) {
        if (status === '2') {
          return '未布置'
        } else {
          return '已布置'
        }
      },
      deletePaper (assignId, paperId) {
        let para = {}
        para.paperId = paperId
        para.assignId = assignId
        this.$http.post('/web/teacher/paper/assign/delete', para, {'emulateJSON': true}).then(function (response) {
          if (response.body.retCode === '0000') {
            this.markInfo.Con = '删除成功'
            this.getList()
          } else {
            this.markInfo.Con = '删除失败'
          }
        })
      }
    },
    components: {
      'v-section': section,
      'v-mark': mark
    }
  };
</script>
<style>
  @import '/static/common/css/publish/assignCommon.css'
</style>
