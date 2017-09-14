<template>
    <div class="Se_MainBox">
      <div class="Se_Box" v-if="Level>0 && isEmptyObject(Section.Child)" v-for="(Section,Level) in ParallelData" >
        <div class="Se_Title">{{Section.Name}} : </div>
        <ul class="Se_List">
          <li :class="{'Fc65':SecData.Class==true}" :title="SecData.name+SecData.alias" v-for="(SecData,SecIndex) in Section.Child" @click="SelectSec(Level,SecIndex,SecData)">{{SecData.name}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
  export default{
    data: function () {
      return {
        SecData: [],
        TransformData: '',
        ParallelData: '',
        Levels: 0,
        LastCode: '', // 记录上次记住节点的Id
        ThisCode: '', // 记录上次记住节点的数据
        ParentArr: [] // 记录上次记住节点的父级Id集合
      }
    },
    mounted () {
      this.GetSecData()
    },
    methods: {
      GetSecData  () {
        let Subdata = {}
        Subdata.menuId = '5d26dv1ea59e11e6s0f576304dec7eb7'
        this.$http.post('/web/common/teacher/knowledgetree?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.InitData(response.body.retData)
          }
        })
      },
      GetLastCodeAjax () {
        let Subdata = {}
        Subdata.menuId = '5d26dv1ea59e11e6s0f576304dec7eb7'
        this.$http.post('/web/common/teacherandstudent/lastcode?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          let Last = response.body.retData
          if (response.body.retCode === '0000') {
            if (this.isEmptyObject(Last)) {
              this.AboutLast(Last)
            } else {
              this.NotLast()
            }
          }
        })
      },
      InitData (data) {
        this.TransformToData(data)
        this.SecData = data
        if (this.TransformData.length > 0) {
          this.CreatLevel()
          this.CreatParallelData()
          this.GetLastCodeAjax()
        }
      },
      // 节点选择
      SelectSec (Level, SecIndex, ThisData) {
        this.ResetClass(Level, SecIndex)
        this.UpDatePara(ThisData.id, Level)
        this.SaveLastCode()
        this.$emit('ListenChild', this.LastCode)
      },
      // 保存记录
      SaveLastCode () {
        let Subdata = {}
        Subdata.menuId = '5d26dv1ea59e11e6s0f576304dec7eb7'
        Subdata.lastCode = this.LastCode
        this.$http.post('/web/common/teacherandstudent/savelastcode?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
            let data = response.body
            console.log(data)
        })
      },
      // 没有上次记录的情况
      NotLast () {
        this.UpDatePara(this.ParallelData[1].Child[0].id, 1)
        this.ParallelData[1].Child[0].Class = true
      },
      // 重置样式
      ResetClass (Level, SecIndex) {
        for (let i = 0; i < this.ParallelData[Level].Child.length; i++) {
          this.ParallelData[Level].Child[i].Class = false
        }
        this.ParallelData[Level].Child[SecIndex].Class = true
      },
      // 节点遍历重组平行数据层
      UpDatePara (ParentId, Level) {
        // 记录该章节知识点的数据层以及该节点递归父级节点数据
        let OldArr = this.ParallelData
        // 平行数据层重置，切换的时候从总数据重新组合数据
        this.CreatParallelData()
        let IdSplitArr = []
        // 如果当前的id是合并的需要拆分
        if (ParentId.indexOf('-') > 0) {
          IdSplitArr = ParentId.split('-')
        } else {
          IdSplitArr[0] = ParentId
        }
        // 将之前的数据组合到新的数据层里面，新的平行数据只组合该节点之后的数据
        for (let i = 0; i < Level + 1; i++) {
          this.ParallelData[i] = OldArr[i]
        }
        // 循环节点之后的子节点，循环重新组合
        for (let i = Level + 1; i < this.ParallelData.length; i++) {
          let ThisChild = this.ParallelData[i].Child // 当前元素
          let Child = []
          // 下一级的第一个默认为父级
          if (i > Level + 1) {
            // 如果当前子节点的id是合并的需要拆分
            let thisId = this.ParallelData[i - 1].Child[0].id
            if (thisId.indexOf('-') > 0) {
              IdSplitArr = thisId.split('-')
            } else {
              IdSplitArr[0] = thisId
            }
          }
          for (let j = 0; j < ThisChild.length; j++) {
            ThisChild[j].Class = false
            // 当前的父级Id 如果当前的父级Id和上一层的Id相同，则重构数组
            let ChildParId = ThisChild[j].parentId
            for (let k = 0; k < IdSplitArr.length; k++) {
              if (ChildParId === IdSplitArr[k]) {
                Child.push(ThisChild[j])
                Child[0].Class = true
              } else {
              }
              this.ParallelData[i].Child = Child
            }
          }
        }
        this.UpDateLastCode()
      },
      // 更新最后一级的选中的Id
      UpDateLastCode () {
        // 取最后一次节点
        // 记录最后一级的层级数
        let LastLevel = 1
        // 首先获取最后一级位于哪一层
        for (let i = 1; i < this.ParallelData.length; i++) {
          let NextChild = this.ParallelData[i].Child // 当前元素
          // 非最后一层级
          if (!this.isEmptyObject(NextChild)) {
            LastLevel = i - 1
          } else {
            LastLevel = this.ParallelData.length - 1
          }
        }
        // 通过Class属性，匹配选中的id
        let LastData = this.ParallelData[LastLevel].Child
        for (let i = 0; i < LastData.length; i++) {
          if (LastData[i].Class) {
            this.LastCode = LastData[i].id
          }
        }
      },
      // 查找当前节点数据
      GetLastData (LastId) {
        for (let i = 0; i < this.TransformData.length; i++) {
          if (this.TransformData[i].id === LastId) {
            this.ThisCode = this.TransformData[i]
          }
        }
      },
      // 创建上次记录节点的递归关系
      GetParentArr (LastData) {
        // 获取当前的层级数
        let ThisLevel = LastData.level
        let ThisParent = LastData.parentId
        // 若改节点非总数据层的最后一级，则之后的数据层要清空Child
        for (let i = ThisLevel + 1; i < this.ParallelData.length; i++) {
          this.ParallelData[i].Child = []
        }
        let IdSplitArr = []
        // 初始化最后一级
        this.ParentArr[ThisLevel] = ThisParent
        // 从最后一层往第一层循环
        for (let i = ThisLevel - 1; i > 0; i--) {
          let NowChild = this.ParallelData[i].Child
          for (let j = 0; j < NowChild.length; j++) {
            if (NowChild[j].id.indexOf('-') > 0) {
              IdSplitArr = NowChild[j].id.split('-')
            } else {
              IdSplitArr[0] = NowChild[j].id
            }
            for (let k = 0; k < IdSplitArr.length; k++) {
              // 如果当前的id是合并的需要拆分
              if (IdSplitArr[k] === ThisParent) {
                this.ParentArr[i] = NowChild[j].parentId
                ThisParent = NowChild[j].parentId
              }
            }
          }
        }
      },
      // 通过最后一级Id重组数据
      AboutLast (LastId) {
        this.$emit('ListenChild', LastId)
        // 查找当前节点数据
        this.GetLastData(LastId)
        // 创建上次记录节点的递归关系
        this.GetParentArr(this.ThisCode)
        for (let i = 1; i < this.ParallelData.length; i++) {
          let ThisChild = this.ParallelData[i].Child
          let Arr = [] // 临时数组，存放匹配的数据
          for (let j = 0; j < ThisChild.length; j++) {
            if (ThisChild[j].id === this.ThisCode.id) {
              ThisChild[j].Class = true
            }
            if (ThisChild[j].parentId === this.ParentArr[i]) {
              let IdSplitArr = []
              // 如果当前的Id是合并的，则需要拆开
              if (ThisChild[j].id.indexOf('-') > 0) {
                IdSplitArr = ThisChild[j].id.split('-')
              } else {
                IdSplitArr[0] = ThisChild[j].id
              }
              for (let k = 0; k < IdSplitArr.length; k++) {
                if (IdSplitArr[k] === this.ParentArr[i + 1]) {
                  ThisChild[j].Class = true
                }
              }
              Arr.push(ThisChild[j])
            }
          }
          this.ParallelData[i].Child = Arr
        }
        // 如果有合并的一级，需要重构二级
        let DoubleId = []
        for (let i = 0; i < this.ParallelData[1].Child.length; i++) {
          if (this.ParallelData[1].Child[i].Class) {
            if (this.ParallelData[1].Child[i].id.indexOf('-') > 0) {
              DoubleId = this.ParallelData[1].Child[i].id.split('-')
            } else {
              DoubleId[0] = this.ParallelData[1].Child[i].id
            }
          }
        }
        let SecNewArr = []
        for (let i = 0; i < this.TransformData.length; i++) {
          for (let j = 0; j < DoubleId.length; j++) {
            if (DoubleId[j] === this.TransformData[i].parentId) {
              SecNewArr.push(this.TransformData[i])
            }
          }
        }
        this.ParallelData[2].Child = SecNewArr
      },
      // 创建层级数,获取最大层级数
      CreatLevel () {
        let LevelArr = []
        LevelArr.push(this.TransformData[0].level)
        // 从平行数据层遍历每一个levle值存到数组里
        for (let i = 1; i < this.TransformData.length; i++) {
          LevelArr.push(this.TransformData[i].level)
        }
        LevelArr = LevelArr.sort()
        let ThisArr = []
        ThisArr.push(LevelArr[0])
        // 将数组排序进行去重，得到最终的数据结构层
        for (let j = 1; j < LevelArr.length; j++) {
          if (LevelArr[j] !== LevelArr[j - 1]) {
            ThisArr.push(LevelArr[j])
          }
        }
        this.Levels = ThisArr
      },
      // 树形结构转平行结构总数据
      TransformToData (RetData) {
        let newArray = [] // 单节点递归解析
        function RecursiveData (data, level) {
          var newObj = {}
          newObj.id = data.knowledgeId
          newObj.alias = data.alias
          newObj.name = data.name
          newObj.parentId = data.parentId
          newObj.levelName = data.levelName
          newObj.level = level
          newObj.Class = false
          newArray.push(newObj)
          if (data.childrens) {
            // 递归
            level++
            for (var i = 0; i < data.childrens.length; i++) {
              RecursiveData(data.childrens[i], level)
            }
          }
          return newArray
        }
        let newArrays = [] // 拼接单节点数据
        for (let i = 0; i < RetData.length; i++) {
          let Level = 1
          newArrays = RecursiveData(RetData[i], Level)
        }
        this.TransformData = newArrays
      },
      // 平行结构分级(总数据层)
      CreatParallelData () {
        let ThisArr = []
        // 根据总结构层数进行数据分层，这里获取的是总数据层的总数据，囊括所有节点
        for (let i = 0; i < this.Levels.length; i++) {
          let Child = []
          for (let j = 0; j < this.TransformData.length; j++) {
            let Obj = {}
            // 根据层级对应解析对应的层级节点
            if (this.TransformData[j].level === this.Levels[i]) {
              Child.push(this.TransformData[j])
              Obj.Child = Child
              Obj.Name = this.TransformData[j].levelName
              ThisArr[this.Levels[i]] = Obj
            }
          }
        }
        this.ParallelData = ThisArr
      },
      // 判断是否为空
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
  .Se_MainBox{overflow: hidden;width: 100%;margin: 0 auto;box-sizing: border-box;background: white;color: #333;}
  .Se_Box{float: left;width: 100%;box-sizing: border-box;}
  .Se_Title{float: left;width: 50px;height: 100%;line-height: 30px;  height: 30px; }
  .Se_List{float: right;}
  .Se_List li{float: left; cursor: pointer;  padding: 0 10px;  width: 100px; line-height: 30px;  height: 30px;  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;}
  .Se_List li:hover{color: #65b113;}
  .Fc65{color: #65b113;}
  @media screen and (max-width:1365px){
    /*.Se_MainBox{width: 900px;}*/
    .Se_List{width: 770px;}
    .Se_List li,.Se_Title {font-size: 14px;}
  }
  @media screen and (min-width:1366px){
    /*.Se_MainBox{width: 1000px;}*/
    .Se_List{width: 800px;}
    .Se_List li,.Se_Title {font-size: 16px;}
  }
  @media screen and (min-width:1600px){
    /*.Se_MainBox{width: 1200px;}*/
    .Se_List{width: 800px;}
    .Se_List li,.Se_Title {font-size: 16px;}
  }
</style>
