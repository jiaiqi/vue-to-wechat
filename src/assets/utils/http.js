import axios from 'axios'
import store from '../../store/index'
// import * as types from './store/mutation_type'
import router from '../../router/index'

axios.defaults.timeout = 5000 // 超时时间
 // axios.defaults.baseURL = '';

 // http request 拦截器
axios.interceptors.request.use(
    config => {
      if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `token ${store.state.loginModule.token}`
      }
      return config
    },
    err => {
      return Promise.reject(err)
    })

 // http response 拦截器
axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
                    // 401 清除token信息并跳转到登录页面
            store.commit('loginOut')
            router.replace({
              path: 'login',
              query: {redirect: router.currentRoute.fullPath}
            })
        }
      }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
      return Promise.reject(error.response.data)  // 返回接口返回的错误信息
    })

export default axios
