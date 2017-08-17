<template>
  <div>
    <div style="clear: both;"></div>
    <div class="EnA_Main">
      <div class="EnA_SecBox">
        <v-section @ListenChild="RecieveChild"></v-section>
        <div class="Se_Box" v-if="isEmptyObject(ThisCategory)">
          <div class="Se_Title">栏目 : </div>
          <ul class="Se_List">
            <li :class="{'Fc65':data.Class==true}" v-for="(data,index) in ThisCategory" @click="CateEvt(data,index)">{{data.Name}}</li>
          </ul>
        </div>
      </div>
      <v-word :WordId="ThisWordId" v-if="isEmptyObject(ThisWordId)"></v-word>
      <v-listen :ListenId="ThisListenId" v-if="isEmptyObject(ThisListenId)"></v-listen>
      <v-book :BookId="ThisBookId" v-if="isEmptyObject(ThisBookId)"></v-book>
    </div>
  </div>
</template>
<script>
  import section from '../../common/section'
  import word from '../../basic/prepare/word'
  import listen from '../../basic/prepare/listen'
  import book from '../../basic/prepare/book'
  export default{
    data () {
      return {
        ThisSectionId: '',
        ThisCategory: '',
        ThisCateId: '',
        ThisWordId: '',
        ThisListenId: '',
        ThisBookId: ''
      }
    },
    components: {
      'v-section': section,
      'v-word': word,
      'v-listen': listen,
      'v-book': book
    },
    methods: {
      RecieveChild (Id) {
        this.ThisSectionId = Id
        this.GetCateData(Id)
      },
      // 获取栏目
      GetCateData (Id) {
        let Subdata = {}
        Subdata.menuId = localStorage.getItem('menuid')
        Subdata.knowledgeList = Id
        this.$http.post('/web/teacher/prepare/voice/category?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.ThisCategory = response.body.retData
            this.ResetData()
            this.GetCateId()
            this.DefultId()
          }
        })
      },
      // 数据重组
      ResetData () {
        let Arr = []
        for (let i = 0; i < this.ThisCategory.length; i++) {
          let Obj = {}
          Obj.Name = this.ThisCategory[i].type === '6' ? '单词' : this.ThisCategory[i].categoryName
          Obj.id = this.ThisCategory[i].id
          Obj.type = this.ThisCategory[i].type
          Obj.orderNum = this.ThisCategory[i].orderNum
          Obj.Class = false
          Arr.push(Obj)
          // 默认第一个
          Arr[0].Class = true
        }
        this.ThisCategory = Arr
      },
      // 重置iD
      ResetId () {
        this.ThisWordId = ''
        this.ThisListenId = ''
        this.ThisBookId = ''
      },
      // 默认Id
      DefultId () {
        this.ResetId()
        if (this.isEmptyObject(this.ThisCategory)) {
          let DefaultData = this.ThisCategory[0]
          this.ToId(DefaultData)
          console.log(DefaultData.id)
        }
      },
      ToId (data) {
        if (data.type === '6') {
          this.ThisWordId = this.ThisCateId
        } else if (data.type === '2') {
          this.ThisListenId = this.ThisCateId
        } else if (data.type === '4') {
          this.ThisBookId = this.ThisCateId
        }
      },
      // 栏目点击事件
      CateEvt (data, index) {
        this.ResetClass()
        this.ThisCategory[index].Class = true
        this.GetCateId()
        this.ResetId()
        this.ToId(data)
        console.log()
      },
      // 获取栏目Id
      GetCateId () {
        for (let i = 0; i < this.ThisCategory.length; i++) {
          if (this.ThisCategory[i].Class) {
            this.ThisCateId = this.ThisCategory[i].id
          }
        }
      },
      // 重置Class数据
      ResetClass () {
        for (let i = 0; i < this.ThisCategory.length; i++) {
          this.ThisCategory[i].Class = false
        }
      },
      isEmptyObject (obj) {
        if (obj[0]) {
          return true
        } else if (obj === '') {
          return false
        } else {
          return false
        }
      }
    }
  }
</script>

<style>
  .EnA_Main{overflow: hidden;margin: 40px auto;border-radius: 10px;background: white; padding: 30px;box-sizing: border-box;}
  .EnA_SecBox{float: left;width: 100%;padding-bottom: 30px; box-sizing: border-box; border-bottom: 1px solid #ccc;}
  .Fc65{color: #65b113;}
  @media screen and (max-width:1365px){
    .EnA_Main{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .EnA_Main{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .EnA_Main{width: 1200px;}
  }
</style>
