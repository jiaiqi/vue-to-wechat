// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue' // Vue
import VueRouter from 'vue-router' // 路由模块组件
import FastClick from 'fastclick' // import VueRouter from 'vue-router'
import App from './App' // 应用入口
import router from './router/index.js' // routes路由配置清单
import { ToastPlugin, LoadingPlugin, AlertPlugin, ConfirmPlugin } from 'vux' // 解构全局导入vux组件
import api from '@/api/api.js' // 导入api清单
import axios from 'axios' // axios
// import https from './assets/utils/http'
import stores from './store/index.js'
import common from './assets/utils/common.js' // 公共插件方法
import VueResource from 'vue-resource' // 导入VueResource
import imagesLoaded from 'vue-images-loaded' // 图片加载辅助
// import AsyncValidator from 'async-validator'

import VueJsonp from 'vue-jsonp'

Vue.prototype.$api = api    // api挂载到vue的proto对象上原型属性
Vue.prototype.$ajax = axios // 挂载axios到vue.proto对象上原型属性

axios.defaults.withCredentials = true // 设置请求头带cookies

Vue.use(common)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueJsonp)
Vue.use(imagesLoaded)
// Vue.use(AsyncValidator)

Vue.http.options.xhr = { withCredentials: true }// vueresource请求跨域
Vue.http.interceptors.push((request, next) => {
  request.credentials = true
  next()
})
// let se = this
router.beforeEach((to, from, next) => {
  if (to.path === '/home' || to.path === '/userInfo') {
    stores.commit('showFooter')
    stores.commit('hideLeftBack')
  } else {
    stores.commit('hideFooter')
    stores.commit('showLeftBack')
  }
  if (to.path === '/login') {
    stores.commit('hideHeader')
  } else {
    stores.commit('showHeader')
  }
  if (to.meta.title) {
    document.title = to.meta.title
  } else if (to.query.title) {
    document.title = to.query.title
  } else {
    document.title = '-'
  }
  next()
})
router.afterEach((to, from) => {
  // stores.commit('hideLoading')
  console.log(to, from)

  // this.$vux.toast.hide()
})
// axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
//
axios.interceptors.request.use(function (config) {  // 配置发送请求的信息
  // Vue.$vux.loading.show({
  //   text: '加载中'
  // })

  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) { // 配置请求回来的信息
  // 对响应数据全局处理
  if (response.data.resultCode) {
    if (response.data.resultCode === api.refuseCode) {
      // 请求错误码0111
      // Vue.$vux.toast.show({
      //   text: response.data.resultMessage,
      //   time: 5000,
      //   type: 'warn',
      //   isShowMask: true
      // })
      // self.$routr.push('/login')
      // this.showLoading(false)
      let users = {}
      users['logined'] = false
      stores.commit('setLogined', {
        amount: users
      })
      stores.commit('setAuthorState', false)
      console.log('=============未登陆===========' + response.data.resultMessage)
    }
  }
  return response
}, function (error) {
  // console.log('=============未登陆===========2')
  Vue.$vux.toast.show({
    text: '请求地址错误',
    time: 5000,
    type: 'warn',
    isShowMask: true
  })
  return Promise.reject(error)
})

FastClick.attach(document.body)

Vue.config.productionTip = false

// 封装ajax方法
Vue.prototype.crosAjaxData = function (url, method, jsonData, succFun, asyncFlag) {
  let self = this
  if (asyncFlag === '' || asyncFlag === null || asyncFlag === undefined) {
    asyncFlag = true
  }
  self.$ajax({
    url: url,
    method: method,
    data: JSON.stringify(jsonData),
    // emulateJSON: true,
    // 设置请求头
    // async: asyncFlag,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }).then((response) => {
    if (response.resultCode) {
      if (response.resultCode === this.$api.refuseCode) {
        // 请求失败
        let a = response.resultMessage
        // this.$vux.loading.show({
        //   text:
        // })
        console.log(a)
        self.$routr.push('/home')
      }
    } else {
      if (succFun != null) {
        let succFunc = succFun
        succFunc(response)
      }
    }
  }, function (error) { // 对响应错误做点什么
    stores.commit('setAuthorState', false)
    let users = {}
    users['logined'] = false
    stores.commit('setLogined', {
      amount: users
    })
    return Promise.reject(error)
  }
  )
}
Vue.prototype.crosAjaxParams = function (url, method, jsonData, succFun, asyncFlag) {
  if (asyncFlag === '' || asyncFlag === null || asyncFlag === undefined) {
    asyncFlag = true
  }
  this.$ajax({
    url: url,
    method: method,
    params: JSON.stringify(jsonData),
    // emulateJSON: true,
    // 设置请求头
    // async: asyncFlag,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }).then(function (response) {
    if (succFun != null) {
      let succFunc = succFun
      succFunc(response)
    }
  }, function () {
    // 请求失败回调
    console.log('请求失败请检查后台服务器地址是否正确' + url)
    console.log('错误信息2')
  })
}
// const userInfo = {}
// Vue.prototype.$userInfo = userInfo
/* eslint-disable no-new */
new Vue({
  data () {
    return {
      userInfo: stores.getters.onLogin,
      logined: stores.getters.logined,
      isLoading: stores.getters.showLoading
    }
  },
  router: router,
  store: stores,
  // https: https,
  directives: {
    imagesLoaded
  },
  mounted () {
    if (this.logined) {
      // this.$router.push('/home')
    } else {
      // this.$router.push('/vxlogin') // 取消返回登录页
      // this.$router.push('/bxsys_email_templ')
    }
  },
  methods: {
    // getShowLoading () {
    //   return stores.getters.showLoading
    // }
  },
  computed: {
    getShowLoading () {
      return stores.getters.showLoading
    },
    getLogined () {
      return stores.getters.logined
    }
  },
  watch: {
    '$route' (to, from, next) {
      // this.getShowLoading()
    },
    getShowLoading (newValue, oldValue) {
      // if (newValue) {
      //   this.$vux.toast.show({
      //     text: '加载中...'
      //   })
      // } else {
      //   this.$vux.toast.hide()
      // }
    },
    getLogined (val, oldval) {
      let self = this
      this.logined = val
      if (val) {
        // self.$router.push('/home')
        console.log('登录成功：进入主页')
      } else {
        self.$router.push('/home')
      }
    }
  },
  render: h => h(App)
}).$mount('#app-box')
