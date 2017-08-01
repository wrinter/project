import Vue from 'vue'
import Router from 'vue-router'
// 路由列表

// 登录入口
import login from '@/components/login'
// 内容入口
import content from '@/components/content'
// 教师国学
import tchinese from '@/components/teacher/chinese/chinese'
// 教师美文
// import tessay from '@/components/teacher/chinese/essay'
// 文章
import tarticle from '@/components/teacher/chinese/article'
// 名师指点
import tartvideo from '@/components/teacher/chinese/video'
// 教师首页
import tindex from '@/components/teacher/index/index'
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
  {
    path: '/content',
    name: '内容路由区',
    component: content,
    children: [
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
      // {
      //  path: '/content/teacher/chinese/essay',
      //  name: '美文',
      //  component: tessay,
      //  meta: {
      //    flagname: '教师',
      //    showcrumbs: true,
      //    crumbs: [
      //      {name: '首页', path: '/content/teacher/index/index'},
      //      {name: '美文'}
      //    ]
      //  }
      // },
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
{path: '/content/teacher/index/index', name: '首页', component: tindex, meta: {flagname: '教师', showcrumbs: false, crumbs: []}},
{path: '/content/teacher/LessonCenter/Exemplar', name: '典例', component: Exemplar, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '典例'}]}},
{path: '/content/teacher/LessonCenter/CoursewareList', name: '课件', component: CoursewareList, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '课件'}]}},
{path: '/content/teacher/LessonCenter/CoursewareView', name: '课件预览', component: CoursewareView, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '课件预览'}]}},
{path: '/content/teacher/me/Tailor', name: '私人定制', component: Tailor, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '私人定制'}]}},
{path: '/content/teacher/me/TailorRecorder', name: '私人定制记录', component: TailorRecorder, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '私人定制', path: '/content/teacher/me/Tailor'}, {name: '私人定制记录'}]}},
{path: '/content/teacher/Academic/AcademicIndex', name: '学业模考', component: AcademicIndex, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '学业模考'}]}},
{path: '/content/teacher/Academic/AcademicDo', name: '学业模考试题', component: AcademicDo, meta: {flagname: '教师', showcrumbs: true, crumbs: [{name: '首页', path: '/content/teacher/index/index'}, {name: '学业模考', path: '/content/teacher/Academic/AcademicIndex'}, {name: '开始做题'}]}}
    ]
  },
  {path: '/aboutUs', name: '关于我们', component: aboutUs},
  {path: '/company', name: '企业合作', component: company},
  {path: '/school', name: '校园合作', component: school},
  {path: '/Recruit', name: '人才招聘', component: Recruit},
  {path: '/ideas', name: '意见反馈', component: ideas},
  {path: '/helpCenter', name: '帮助中心', component: Help},
  {
    path: '/content/teacher/chinese/article',
    name: '文章',
    component: tarticle
  }
]
const router = new Router({
  routes
})
export default router

/**/
