// 所有页面路由配置清单

import Vue from 'vue'
import VueRouter from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Regist from '@/views/user/Regist'
import Login from '@/views/user/Login'
import UserInfo from '@/views/user/UserInfo'
import Home from '@/views/home/Home'
import list from '@/views/serviceList/list'
import detail from '@/views/serviceList/detail'
import detailplus from '@/views/home/detailPlus'
// import add from '@/views/serviceList/add'
import add from '@/views/home/add'
// import update from '@/views/serviceList/update'
import update from '@/views/home/update'
import procRecordDetail from '@/views/proc/recordDetail'
import procApproval from '@/views/proc/procApproval'

import Logs from '@/views/logs/Logs'
import procList from '@/views/proc/procList'
import procDetail from '@/views/proc/procDetail'
import listView from '@/views/home/listView'
import vxAuthor from '@/views/user/author'
import qrcodeinfo from '@/views/qrcodeInfo/qrcodeinfo'
import search from '@/views/home/search'
import navs from '@/views/home/navs'
import refresh from '@/views/home/refresh'
import wxmsg from '@/views/user/wxmsg'
import collect from '@/views/collect/collectAdd'
import test from '@/views/collect/test'

// import Logs from '@/views/logs/Logs'

// const Logs = r => require.ensure([], () => r(require('../views/logs/logs')), 'logs')
// const TaskList = r => require.ensure([], () => r(require('../views/task/TaskList')), 'TaskList')
// const TaskDetail = r => require.ensure([], () => r(require('../views/task/TaskDetail')), 'TaskDetail')

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history', // 切换路径模式，变成 history 模式/ hash
  scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/vxAuthor',
      name: 'vxAuthor',
      component: vxAuthor,
      meta: {
        title: '授权'
      }
    },
    {
      path: '/regist',
      name: 'Regist',
      component: Regist,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/bxsys_log',
      name: 'Logs',
      component: Logs,
      meta: {
        title: '系统日志'
      }
    },
    {
      path: '/proclist',
      name: 'proclist',
      component: procList,
      meta: {

      }
    },
    {
      path: '/procRecordDetail',
      name: 'procRecordDetail',
      component: procRecordDetail,
      meta: {
        // title: '流程状态'
      }
    },
    {
      path: '/procdetail/:proc_instance_no',
      name: 'procdetail',
      component: procDetail,
      meta: {
        // title: '流程详情'
      },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'childProcDetail/:proc_instance_no',
          component: procDetail,
          meta: {
            title: '流程详情'
          }
        }
      ]
    },
    {
      path: '/procApproval',
      name: 'procApproval',
      component: procApproval,
      meta: {
        // title: '流程详情'
      }
    },
    {
      path: '/home',
      redirect: '/home'
    },
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/list/:serviceName',
      name: 'list',
      component: list,
      meta: {
        title: '列表'
      }
    },
    {
      path: '/detail/:serviceName/:id',
      name: 'detail',
      component: detail,
      meta: {
        title: '详情'
      }
    },
    {
      path: '/detailplus/:id',
      name: 'detailplus',
      component: detailplus,
      meta: {
        // title: '详情'
      },
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'childDetail/:id',
          component: detailplus
        }
      ]
    },
    // {
    //   path: '/add/:serviceName/:pageType',
    //   name: 'add',
    //   component: add,
    //   meta: {
    //     title: '新增'
    //   }
    // },
    {
      path: '/add',
      name: 'add',
      component: add,
      meta: {
        // title: '新增'
      }
    },
    // {
    //   path: '/update/:serviceName/:id',
    //   name: 'update',
    //   component: update,
    //   meta: {
    //     title: '编辑'
    //   }
    // },
    {
      path: '/update',
      name: 'update',
      component: update,
      meta: {
        // title: '编辑'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        title: '编辑测试模版'
      }
    },
    {
      // path: '/listView/:serviceName/:id',
      path: '/listView',
      name: 'listView',
      component: listView
    },
    {
      path: '/qrcodeinfo',
      name: 'qrcodeinfo',
      component: qrcodeinfo,
      meta: {
        title: '二维码信息'
      }
    },
    {
      path: '/navs',
      name: 'navs',
      component: navs,
      meta: {
        title: '全部功能'
      }
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: refresh,
      meta: {
        // title: '全部功能'
      }
    },
    {
      path: '/wxmsg/',
      name: 'wxmsg',
      component: wxmsg,
      meta: {
        title: '通知详情',
        showBack: false,
        header: true,
        tabs: false
      }
    },
    {
      path: '/collect/',
      name: 'collect',
      component: collect,
      meta: {
        showBack: false,
        header: true,
        tabs: false
      }
    },
    {
      path: '/test/',
      name: 'test',
      component: test,
      meta: {
        showBack: false,
        header: true,
        tabs: false
      }
    }
  ]
})
export default router
