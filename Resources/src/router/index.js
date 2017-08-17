/**
 * Created by Echonessy on 2017/7/21.
 */
import Vue from 'vue'
import Router from 'vue-router'
// 路由列表
// 登录入口
import login from '@/components/login'
// 注册
import register from '@/components/basic/register/register'
// 忘记密码
import forgetPass from '@/components/basic/login/forgetPass'
// 内容入口
import content from '@/components/content'
// 批改作业列表
import correctworklist from '@/components/teacher/homework/correctworklist'
// 批改作业
import correctwork from '@/components/teacher/homework/correctwork'
// 批改作业列表
import correcttestlist from '@/components/teacher/test/correcttestlist'
// 批改作业
import correcttest from '@/components/teacher/test/correcttest'
// 错题本
import notebook from '@/components/teacher/homework/notebook'
// 布置错题
import publishbook from '@/components/teacher/homework/publishbook'
// 布置记录
import publishrecord from '@/components/teacher/homework/publishrecord'
// 浏览布置错题
import previewbook from '@/components/teacher/homework/previewbook'
// 打印错题
import printbook from '@/components/teacher/homework/printbook'
// 班级管理
import classmain from '@/components/teacher/classmanage/classmain'
// 班级管理
import classinfo from '@/components/teacher/classmanage/classinfo'
// 测试
import ttest from '@/components/common/test'
// 班级管理
import teachermanage from '@/components/teacher/classmanage/teachermanage'
// 教师美文
import tessay from '@/components/teacher/chinese/essay'
// 教师国学
import tchinese from '@/components/teacher/chinese/chinese'
// 教师期刊
import tmagazine from '@/components/teacher/chinese/magazine'
// 教师走遍英美
import tengbook from '@/components/teacher/eng/engbook'
// 教师走遍英美文章
import tengart from '@/components/teacher/eng/engart'
// 教师拓展学习
import texpand from '@/components/teacher/expand/expand_index'
// 文章
import tarticle from '@/components/teacher/chinese/article'
// 拓展学习文章
import texarticle from '@/components/teacher/expand/exarticle'
// 名师指点
import tartvideo from '@/components/teacher/chinese/video'
// 备课中心英语音频
import tengaudio from '@/components/teacher/prepare/engaudio'
// 备课中心视频
import video from '@/components/teacher/prepare/video'
// 备课中心视频播放
import videoplay from '@/components/teacher/prepare/videoplay'
// 预习测试
import preparetest from '@/components/teacher/prepare/preparetest'
// 教师首页
import tindex from '@/components/teacher/index/index'
// 教师消息
import tmsg from '@/components/teacher/msg/msg'
// 头像组件
import tuserphoto from '@/components/teacher/userphoto/userphoto'
// 布置作业
import assignwork from '@/components/teacher/homework/assignwork'
import assignpaper from '@/components/teacher/homework/assignpaper'
import assignedit from '@/components/teacher/homework/assignedit'
// 布置测试
import assigntest from '@/components/teacher/test/assigntest'
import assigntestpaper from '@/components/teacher/test/assignpaper'
import assigntestedit from '@/components/teacher/test/assignedit'
import simulatepaper from '@/components/teacher/test/simulatepaper'
// 关于我们
import aboutUs from '@/components/teacher/about1.0/aboutUs'
// 企业合作
import company from '@/components/teacher/about1.0/company'
// 校园合作
import school from '@/components/teacher/about1.0/school'
// 人才招聘
import Recruit from '@/components/teacher/about1.0/Recruit'
// 反馈意见
import ideas from '@/components/teacher/about1.0/ideas'
// 帮助中心
import Help from '@/components/teacher/about1.0/helpCenter'
// 备课中心典例
import Exemplar from '@/components/teacher/LessonCenter/Exemplar'
// 备课中心课件
import CoursewareList from '@/components/teacher/LessonCenter/CoursewareList'
// 备课中心预览页
import CoursewareView from '@/components/teacher/LessonCenter/CoursewareView'
// 私人定制
import Tailor from '@/components/teacher/me/Tailor/Tailor'
// 私人定制记录
import TailorRecorder from '@/components/teacher/me/Tailor/TailorRecorder'
// 学业模考
import AcademicIndex from '@/components/teacher/Academic/AcademicIndex'
// 学业模考试题
import AcademicDo from '@/components/teacher/Academic/AcademicDo'
Vue.use(Router)
let routes = [
  {path: '/', name: '五好导学', component: login},
  {path: '/register', name: '注册', component: register},
  {path: '/forgetPass', name: '忘记密码', component: forgetPass},
  {path: '/aboutUs', name: '关于我们', component: aboutUs},
  {path: '/company', name: '企业合作', component: company},
  {path: '/school', name: '校园合作', component: school},
  {path: '/Recruit', name: '人才招聘', component: Recruit},
  {path: '/ideas', name: '意见反馈', component: ideas},
  {path: '/helpCenter', name: '帮助中心', component: Help},
  {
    path: '/content',
    name: '内容路由区',
    component: content,
    children: [
      {
        path: '/content/teacher/LessonCenter/Exemplar',
        name: '典例',
        component: Exemplar,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '典例'}]
        }
      },
      {
        path: '/content/teacher/LessonCenter/CoursewareList',
        name: '课件',
        component: CoursewareList,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '课件'}]
        }
      },
      {
        path: '/content/teacher/LessonCenter/CoursewareView',
        name: '课件预览',
        component: CoursewareView,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '课件预览'}]
        }
      },
      {
        path: '/content/teacher/me/Tailor',
        name: '私人定制',
        component: Tailor,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '私人定制'}]
        }
      },
      {
        path: '/content/teacher/me/TailorRecorder',
        name: '私人定制记录',
        component: TailorRecorder,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {
            name: '私人定制',
            path: '/content/teacher/me/Tailor'
          }, {name: '私人定制记录'}]
        }
      },
      {
        path: '/content/teacher/Academic/AcademicIndex',
        name: '学业模考',
        component: AcademicIndex,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '学业模考'}]
        }
      },
      {
        path: '/content/teacher/Academic/AcademicDo',
        name: '学业模考试题',
        component: AcademicDo,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {
            name: '学业模考',
            path: '/content/teacher/Academic/AcademicIndex'
          }, {name: '开始做题'}]
        }
      },
      {
        path: '/content/teacher/homework/correctwork',
        name: '批改作业',
        component: correctwork,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '批改作业'}
          ]
        }
      },
      {
        path: '/content/teacher/homework/correctworklist',
        name: '批改作业列表',
        component: correctworklist,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '批改作业'}
          ]
        }
      },
      {
        path: '/content/teacher/homework/notebook',
        name: '错题本',
        component: notebook,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '错题本'}
          ]
        }
      },
      {
        path: '/content/teacher/homework/publishbook',
        name: '布置错题',
        component: publishbook,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '错题本', path: '/content/teacher/homework/notebook'},
            {name: '布置错题'}
          ]
        }
      },
      {
        path: '/content/teacher/homework/publishrecord',
        name: '布置记录',
        component: publishrecord,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '错题本', path: '/content/teacher/homework/notebook'},
            {name: '布置记录'}
          ]
        }
      },
      {
        path: '/content/teacher/homework/assignwork',
        name: '布置作业',
        component: assignwork,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置作业'}
          ]
        }
      },
      {
        path: '/content/teacher/homework/assignpaper',
        name: '布置作业',
        component: assignpaper,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置作业', path: '/content/teacher/homework/assignwork'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/homework/assignedit',
        name: '布置作业',
        component: assignedit,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置作业', path: '/content/teacher/homework/assignwork'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/test/correcttest',
        name: '批改测试',
        component: correcttest,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '批改测试'}
          ]
        }
      },
      {
        path: '/content/teacher/test/correcttestlist',
        name: '批改测试列表',
        component: correcttestlist,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '批改测试'}
          ]
        }
      },
      {
        path: '/content/teacher/test/assigntest',
        name: '布置测试',
        component: assigntest,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置测试'}
          ]
        }
      },
      {
        path: '/content/teacher/test/assignpaper',
        name: '布置测试',
        component: assigntestpaper,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置测试', path: '/content/teacher/test/assigntest'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/test/assignedit',
        name: '布置测试',
        component: assigntestedit,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置测试', path: '/content/teacher/homework/assigntest'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/test/simulatepaper',
        name: '布置测试',
        component: simulatepaper,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '布置测试', path: '/content/teacher/homework/assigntest'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/classmanage/classmain',
        name: '班级管理',
        component: classmain,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '班级管理'}
          ]
        }
      },
      {
        path: '/content/teacher/classmanage/classinfo',
        name: '班级信息',
        component: classinfo,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '班级管理', path: '/content/teacher/classmanage/classmain'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/classmanage/teachermanage',
        name: '班级科目',
        component: teachermanage,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '班级管理', path: '/content/teacher/classmanage/classmain'},
            {name: '', path: '/content/teacher/classmanage/classinfo'},
            {name: ''}
          ]
        }
      },
      {
        path: '/content/teacher/chinese/chinese',
        name: '国学',
        component: tchinese,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '国学'}
          ]
        }
      },
      {
        path: '/content/teacher/chinese/essay',
        name: '美文',
        component: tessay,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '美文'}
          ]
        }
      },
      {
        path: '/content/teacher/chinese/magazine',
        name: '期刊',
        component: tmagazine,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '期刊'}
          ]
        }
      },
      {
        path: '/content/teacher/msg/msg',
        name: '消息',
        component: tmsg,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '消息'}
          ]
        }
      },
      {
        path: '/content/teacher/expand/expand_index',
        name: '拓展学习',
        component: texpand,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '拓展学习'}
          ]
        }
      },
      {
        path: '/content/teacher/eng/engbook',
        name: '走遍英美',
        component: tengbook,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '走遍英美'}
          ]
        }
      },
      {
        path: '/content/teacher/eng/engart',
        name: '走遍英美阅读',
        component: tengart,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '走遍英美', path: '/content/teacher/eng/engbook'},
            {name: '文章阅读'}
          ]
        }
      },
      {
        path: '/content/teacher/chinese/tartvideo',
        name: '名师指点',
        component: tartvideo,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '名师指点'}
          ]
        }
      },
      {
        path: '/content/teacher/prepare/engaudio',
        name: '备课中心',
        component: tengaudio,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '音频'}
          ]
        }
      },
      {
        path: '/content/teacher/prepare/video',
        name: '备课中心',
        component: video,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '视频'}
          ]
        }
      },
      {
        path: '/content/teacher/prepare/videoplay',
        name: '视频播放',
        component: videoplay,
        meta: {
          flagname: '教师',
          showcrumbs: true,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '视频', path: '/content/teacher/prepare/video'},
            {name: '视频播放'}
          ]
        }
      },
      {
        path: '/content/common/test',
        name: '测试',
        component: ttest,
        meta: {
          flagname: '教师',
          showcrumbs: false,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '音频'}
          ]
        }
      },
      {
        path: '/content/teacher/userphoto/userphoto',
        name: '头像',
        component: tuserphoto,
        meta: {
          flagname: '教师',
          showcrumbs: false,
          crumbs: [
            {name: '首页', path: '/content/teacher/index/index'},
            {name: '音频'}
          ]
        }
      },
      {
        path: '/content/teacher/index/index',
        name: '首页',
        component: tindex,
        meta: {
          flagname: '教师',
          showcrumbs: false,
          crumbs: []
        }
      }
    ]
  },
  {
    path: '/content/teacher/chinese/article',
    name: '文章',
    component: tarticle
  },
  {
    path: '/content/teacher/expand/exarticle',
    name: '拓展学习文章',
    component: texarticle
  },
  {
    path: '/content/teacher/homework/previewbook',
    name: '浏览布置错题',
    component: previewbook
  },
  {
    path: '/content/teacher/homework/printbook',
    name: '打印错题',
    component: printbook
  },
  {
    path: '/content/teacher/prepare/preparetest',
    name: '预习测试',
    component: preparetest
  }
]
const router = new Router({
  routes
})
export default router
