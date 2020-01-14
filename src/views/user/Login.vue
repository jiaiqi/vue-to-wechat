<template>
  <div class="login">
    <iframe :src="this.$api.ssoAuthor" width="1200" height="300" frameborder="0" scrolling="auto" style="position:absolute;top: -300px;left: 0px;background:#333"></iframe>
    <flexbox orient="vertical" align="center">
      <box gap="3rem 1rem">
        <!-- <img height="100" src="../../assets/bxsyslogo.png"/> -->
        <img height="100" :src="logoUrl"/>
        <h3></h3>
      </box>
      <flexbox-item v-show="AuthorState === false">
        <group label-align="justify" style="padding:2rem;" class="vux-1px">
            <x-input name="mobile" placeholder="请输入手机号" v-model="username" required></x-input>
            <x-input type="password" placeholder="请输入密码" v-model="password" :min="6" :max="16" required></x-input>
        </group>
        <box gap="10px 25px">
            <x-button type="primary" @click.native="handleLogin">登录</x-button>
        </box>
        <!-- <divider><router-link to="/regist">没有帐号？去注册</router-link></divider> -->
      </flexbox-item>
      <divider v-if="sysCfg.login_copyright">{{sysCfg.login_copyright}} | {{sysCfg.login_beian_1}}</divider>
    </flexbox>
    </div>
</template>
<script>
import { XInput, Box, Group, XButton, Divider, Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'
export default {
  name: 'login',
  computed: mapGetters([
    'userInfo'
  ]),
  components: {
    XInput,
    Box,
    Group,
    XButton,
    Divider,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      username: '', // 手机号
      code: '', // 验证码
      password: '', // 密码
      passwordC: '', // 确认密码
      getCode: {
        txt: '获取验证码',
        disabled: false
      },
      AuthorState: false,
      callUrl: '',
      sysCfg: Object,
      logoUrl: ''
    }
  },
  created () {
    this.getViewCfg()
  },
  mounted () {
    // this.getAuthorLogin()
    this.showLoading(false)
  },
  methods: {
    getViewCfg () {
      let self = this
      let promise = new Promise((resolve, reject) => {
        let sysCfg = this.selectOne('srvsys_view_cfg_select', [])
        resolve(sysCfg)
      })
      promise.then((e) => {
        console.log('done!', e)
        self.$store.commit('sysViewCfg', e)
        self.sysCfg = self.$store.getters.getSysViewCfg
        self.pageTitle = self.sysCfg.main_page_title
        window.document.title = self.pageTitle
        self.getLogoUrl(self.sysCfg.login_log)
      })

      return promise
    },
    getLogoUrl (no) {
      let self = this
      let promise = new Promise((resolve, reject) => {
        let sysCfg = self.getImageUrl(no)
        resolve(sysCfg)
      })
      promise.then((e) => {
        if (e.length > 0) {
          self.logoUrl = e[0]._url
        }
      })
    },
    handleLogin () {
      let self = this
      let isWeixin = self.isWeixinCient()
      if (this.username === '' || this.password === '') {
        this.$vux.toast.show({
          text: '请输入完整的帐号信息',
          type: 'warn',
          isShowMask: true
        })
      } else {
        this.$vux.loading.show({
          text: '登录中...'
        })
        let req = {
          urlGetInfo: this.$api.getUserInfo,
          data: {
            user_no: this.username,
            pwd: this.password
          }
        }
        // urlLogin: this.$api.toLogin,
        if (isWeixin) {
          req.urlLogin = this.$api.loginAuthor  // 微信登陆授权toLogin
        } else {
          req.urlLogin = this.$api.toLogin
        }
        this.$http.post(req.urlLogin, req.data).then((response) => {
          // 登陆回调跳转
          if (response.data.state === 'SUCCESS') {
            let loginMsg = {}
            // 保存登录返回信息
            loginMsg['bxssocookieid'] = response.data.bxssocookieid
            loginMsg['listdomain'] = response.data.listdomain
            console.log(loginMsg)
            self.$store.dispatch({
              type: 'setLoginMsg',
              amount: loginMsg
            })
            self.$store.commit('setAuthorState', true)
            let CallbackGetinfo = function (response) {
              if (response.data !== '') {
                let users = {}
                users['logined'] = true
                users['user_info'] = {}
                users.user_info['user_no'] = response.data.user_no
                users.user_info['dept_no'] = response.data.dept_no
                users.user_info['email'] = response.data.email
                users.user_info['mobile'] = response.data.mobile
                users.user_info['user_disp'] = response.data.user_disp
                users.user_info['real_name'] = response.data.real_name
                self.$store.dispatch({
                  type: 'setLogined',
                  amount: users
                })
                // self.$userInfo = response.data
                self.$vux.loading.hide()
                self.$router.push('/home')
                // self.$store.dispatch
              }
            }
            self.crosAjaxData(req.urlGetInfo, 'post', req.data, CallbackGetinfo)
          } else {
            let msg = response.data.resultMessage
            self.$store.commit('setAuthorState', false)
            this.$vux.loading.hide()
            this.$vux.toast.show({
              text: msg
            })
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
body{
  margin: 0;
}
.login{
  background-color: #06de96;
}
.vux-flexbox{
 height: 100vh;
}
</style>