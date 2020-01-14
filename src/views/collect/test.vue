<template>
  <div>
    <!-- <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0"  ref="scroller" @on-pulldown-loading="refresh"> -->
      <div class="detail-call">
        <div class="detail-call-item flex-col">
          <div class="collectTitle" >{{introduce.title !== "" ? introduce.title : "有你更精彩"}}</div>
          <div class="detail-call-value" style="padding:0;" v-if="'html_introduce' in introduce" v-html="introduce.html_introduce"></div>
            <!-- <x-button  type="primary" @click.native="onShare">分享</x-button> -->
            <div class="collectPage">
                <div class="sub-ok" v-if="isUserInfo">
                  <p>您已提交,感谢您的支持</p>
                </div>
                <fromView v-if="showChild" :pathQuery="addQuery" :pageType="addQuery.type" ref="iForms"></fromView>
                <div class="tipstext" v-show="!showChild">请在微信中打开链接</div>
                <div class="bottom-flex" v-if="pageBtns.length > 0 " style="padding:10px">
                    <flexbox :gutter="10">
                      <flexbox-item v-show="item.button_type === 'submit' || item.button_type === 'edit'" v-for="(item,index) in pageBtns" :key="index" >
                          <x-button  type="primary" @click.native="submitForm">{{item.button_name}}</x-button>
                      </flexbox-item>
                    </flexbox>
                </div>
            </div>
            <div class="detail-call-value"  style="padding:0;" v-if="'html_remarks' in introduce && introduce.html_remarks !==''" v-html="introduce.html_remarks"></div>
            <!-- <a class="banner-text" href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI1NjE2NzE1OA==&scene=110#wechat_redirect">百想科技提供技术支持</a> -->
        </div>
      </div>
<div v-transfer-dom>
      <confirm
      v-model="show6"
      :show-cancel-button="false"
      :title="'提示'"
      :hide-on-blur="true"
      @on-cancel="hideConfirm"
      @on-confirm="submint">
        <p style="text-align:center;">{{ '确认提交'}}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import fromView from '../../components/form.vue'
import wx from 'weixin-js-sdk'
import Emitter from '../../assets/js/mixins/emitter.js'
import { FormPreview, Confirm, Scroller, Divider, Spinner, Cell, CellBox, TransferDom, CellFormPreview, Group, Badge, XButton, Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    FormPreview,
    Scroller,
    Divider,
    Spinner,
    Cell,
    CellBox,
    CellFormPreview,
    Group,
    Badge,
    fromView,
    XButton,
    Flexbox,
    FlexboxItem,
    Confirm
  },
  mixins: [Emitter, wx],
  directives: {
    TransferDom
  },
  data () {
    return {
      list: [],
      show6: false,
      key: this.$route.query.id,
      isContent: false,
      isUserInfo: false,
      introduce: Object,
      data: '',
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      authorized: false, // 是否获取到openid
      showChild: false,
      pageBtns: [],
      addQuery: {
        serviceName: this.$route.query.serviceName,
        type: 'add',
        cols: {
          srv_cols: []
        }
      },
      foreignKey: [],
      isWeixin: this.isWeixinCient(),
      isAuthOpenid: false,
      userInfo: Object,
      openid: ''
    }
  },
  created: function () {
    // 获取数据，
    this.$store.commit('hideLeftBack')
    this.$store.commit('hideHeader')
    this.$on('remove-image', (e) => {
      console.log('删除了', e)
    })
    // console.log('query:' + this.$route.query.id)
    // this.getSignature()
    if (this.$route.query.id) {
      this.isContent = true
      this.key = this.$route.query.id

      // this.getInfo(this.key)
      // if (!this.authorized) {
      //   this.getInfo(this.key)
      // } else {
      //   this.getAuthorized()
      // }
    } else {
      // console.log('请检查参数是否正确')
      this.key = 1
      this.isContent = true
    }
  },
  mounted: function () {
    let self = this
    let isWeixinCient = this.isWeixinCient()
    let code = this.$route.query.code
    let state = this.$route.query.state
    let wxCode = {}
    wxCode['code'] = code
    wxCode['state'] = state
    // 未授权的进入授权
    if (isWeixinCient) {
      if (code) {
          // 判断是否是授权重定向
        // console.log(wxCode)

        self.getOpenid(wxCode.code)
        // this.getSignature()
      } else if (!self.authorized) {
        self.getAuthorized()
      }
    } else {
      // this.getInfo(this.key)
      if (self.$store.getters.getOpenId !== '') {
        // self.getUserInfo(self.$store.getters.getOpenId)
        self.getInfo(this.key)
      } else {
        self.getInfo(this.key)
      }
      // self.getSignature()
    }
  },
  updated: function () {

  },
  methods: {
    hideConfirm () {
      this.show6 = false
    },
    async getAuthorized (wxCode) {
      // 根据path是否有code进行业务逻辑处理
      let self = this
      let isUrl = window.location.href
      let reqData = ''
      let req = {
        'callbackurl': isUrl,
        'app_no': '000004',
        'scope': 'snsapi_userinfo'

      }
      let CallbackGetinfo = await function (response) {
        if (response.status === 200 && response.data.url) {
          reqData = response.data.url
          self.openUrl = reqData
          self.authorized = true
          window.location.href = reqData  // 跳转回调
        } else {
          self.authorized = false
        }
      }
      await this.crosAjaxData(this.$api.ssoAuthor, 'post', req, CallbackGetinfo)
    },
    async getOpenid (code) {
      let self = this
      let req = {
        'code': code,
        'app_no': '000004'
      }
      self.$http.post(self.$api.getOpendId, req).then((res) => {
        // console.log('openid:', res)
        // // //// alert('getOPENID', res)
        if (res.data.state === 'SUCCESS') {
          // console.log('openid:', res.data.openid)
          // //// alert(res.data.openid)
          self.openid = res.data.openid
          if (res.data.openid && res.data.openid !== '') {
            self.isAuthOpenid = true
            self.$store.commit('setOpenId', res.data.openid)

            self.getSignature()
            self.getInfo(this.key)
            // self.getUserInfo(res.data.openid)
            // window.location.href = 'http://wx.100xsys.cn/collect'
          } else {
            self.isAuthOpenid = false
          }
        } else {
          window.location.href = window.location.origin + '/collect?id=' + self.id
        }
        // console.log(self.$store.getters.getOpenId)
        // //// alert('OPENID:' + self.$store.getters.getOpenId)
      })
      // await this.crosAjaxData(url, 'get', '', CallbackFun)
    },
    getOldData (openid) {
      let self = this
      let srv = this.addQuery.serviceName.replace('update', 'select')
      let cons = []
      let cond = {
        'colName': 'openid',
        'value': openid,
        'ruleType': 'eq'
      }
      cons.push(cond)
      // let data
      let promise = new Promise((resolve, reject) => {
        let s = self.selectOne(srv, cons)
        resolve(s)
      })
      promise.then((e) => {
        let data = e
        let scols = this.deepClone(this.addQuery.cols.srv_cols)
        let colKeys = Object.keys(data)
        for (let i = 0; i < colKeys.length; i++) {
          for (let j = 0; j < scols.length; j++) {
            if (colKeys[i] === scols[j].columns) {
              if (data[colKeys[i]] === null) {
                scols[j].column = ''
              } else {
                scols[j].column = data[colKeys[i]]
              }
            }
          }
        }
        this.addQuery.cols.srv_cols = this.deepClone(scols)
        this.showChild = true
        console.log('data', data)
        data = e
      })
      // let data =  this.selectOne(srv, cons)
    },
    async getUserInfo (openid) {
      let self = this
      let req = self.selectRequestObjs()
      req.serviceName = self.introduce.submit_service
      req.serviceName = req.serviceName.replace(/add/, 'select') // 'srvoa_alumni_registration_select'
      req.condition = [{
        colName: 'openid',
        ruleType: 'eq',
        value: openid
      }, {
        colName: 'collect_no',
        ruleType: 'eq',
        value: self.introduce.collect_no
      }]
      // req.condition[0].colName = 'openid'
      // req.condition[0].ruleType = 'eq'
      // req.condition[0].value = openid
      // req.condition[1].colName = 'collect_no'
      // req.condition[1].ruleType = 'eq'
      // req.condition[1].value = self.introduce.collect_no
      req.order[0].colName = 'create_time'
      req.order[0].orderType = 'asc'
      if (openid) {
        self.$http.post(self.$api.select, req).then((res) => {
          console.log(res.data)
          // //// alert('GETuSERinfo:' + JSON.stringify(res.data))
          if (res.data.data.length > 0) {
            self.isUserInfo = true
            self.userInfo = res.data.data[0]
          } else {
            self.isUserInfo = false
          }
          return self.isUserInfo
          // self.isUserInfo
        })
      } else {
        return false
      }
    },
    getSignature () {
      let self = this
      // let url = window.location.href
      // url = url.split(url.lastIndexOf('&'))
      let req = {
        'app_no': '000004', // 百想助理的公共号 app_no 为000004
        'page_url': window.location.href   // http://wx.100xsys.cn/collect?id=1&title=%E8%A5%BF%E5%AE%89%E4%BA%A4%E5%A4%A7%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%A0%A1%E5%8F%8B%E5%BD%95
        // 'page_url': 'http://wx.100xsys.cn/collect?id=1&title=%E8%A5%BF%E5%AE%89%E4%BA%A4%E5%A4%A7%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%A0%A1%E5%8F%8B%E5%BD%95'   // http://wx.100xsys.cn/collect?id=1&title=%E8%A5%BF%E5%AE%89%E4%BA%A4%E5%A4%A7%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%A0%A1%E5%8F%8B%E5%BD%95
      }

      // // alert('getSignature:' + JSON.stringify(req))
      self.$http.post(self.$api.getSignature, req).then((res) => {
        if (res.data.state === 'SUCCESS') {
          // //// alert('getSignature:res' + res.data.cfgData)
          let resData = res.data.cfgData

          wx.config({
            debug: false, // 调试阶段建议开启
            appId: resData.appId, // APPID
            timestamp: resData.timestamp, // 上面main方法中拿到的时间戳timestamp
            nonceStr: resData.noncestr, // 上面main方法中拿到的随机数nonceStr
            signature: resData.signature, // 上面main方法中拿到的签名signature
                // 需要调用的方法接口
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo', 'onMenuShareQQ', 'onMenuShareQZone']
          })
          let url = window.location.href
          // eslint-disable-next-line
          // url = url.replace(/\&/g, '%26')
          wx.ready(() => {
            let textData = self.introduce
            wx.updateAppMessageShareData(
              {
                'imgUrl': textData._imageSrc, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
                'desc': textData.list_desc, // 摘要,如果分享到朋友圈的话，不显示摘要。
                'title': textData.title + '邀请您', // 分享卡片标题
                'link': url, // 分享出去后的链接，这里可以将链接设置为另一个页面。
                // 'link': encodeURIComponent(window.location.href), // 分享出去后的链接，这里可以将链接设置为另一个页面。
                'success': function () { // 分享成功后的回调函数
                  // //// alert('分享成功')
                },
                'cancel': function () {
            // 用户取消分享后执行的回调函数
                  // //// alert('分享失败')
                }}
            )// 分享给好友
            wx.updateTimelineShareData(
              {
                'imgUrl': textData._imageSrc, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
                'desc': textData.list_desc, // 摘要,如果分享到朋友圈的话，不显示摘要。
                'title': textData.title + '邀请您', // 分享卡片标题
                'link': url, // 分享出去后的链接，这里可以将链接设置为另一个页面。
                'success': function () { // 分享成功后的回调函数
                  // //// alert('分享成功')
                },
                'cancel': function () {
            // 用户取消分享后执行的回调函数
                  // //// alert('分享失败')
                }}
            )// 分享到朋友圈
            wx.onMenuShareWeibo({
              'imgUrl': textData._imageSrc, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
              'desc': textData.list_desc, // 摘要,如果分享到朋友圈的话，不显示摘要。
              'title': textData.title + '邀请您', // 分享卡片标题
              'link': encodeURIComponent(url), // 分享出去后的链接，这里可以将链接设置为另一个页面。
              'success': function () { // 分享成功后的回调函数
                // //// alert('分享成功')
              },
              'cancel': function () {
            // 用户取消分享后执行的回调函数
                // //// alert('分享失败')
              }}
            )// 分享给手机QQ
          })
          wx.error(function (res) {
            // console.err('err=====>', res)
          })
        } else {
          // console.log('res', res)
        }
      })
    },
    async getInfo (key, srvType) {
      let self = this
      // let isUserInfo = self.isUserInfo
      let CallbackGo = async function (response) {
        if (response.data.data.length > 0) {
          console.log(response.data.data)
          let data = response.data.data[0]
          if (data.title) {
            document.title = data.title
          }
          self.introduce = data
          let openid = self.$store.getters.getOpenId
          if (openid !== '') {
            self.getUserInfo(openid)
            // console.error('isUserInfo:::' + isUserInfo)
            let imgurl = ''
            if (data.list_icon !== '') {
              imgurl = await self.getImageUrl(data.list_icon)
              data._imageSrc = imgurl[0]._url
            }
            if (self.isUserInfo) {
              // self.addQuery.serviceName = self.introduce.submit_service
              self.addQuery.serviceName = self.introduce.submit_service.replace('add', 'update')
              self.addQuery.type = 'update'
              self.addQuery.cols = await self.getColData(self.addQuery.serviceName, 'update', 'update')
              let userdata = self.userInfo
              let scols = self.deepClone(self.addQuery.cols.srv_cols)
              let colKeys = Object.keys(userdata)
              for (let i = 0; i < colKeys.length; i++) {
                for (let j = 0; j < scols.length; j++) {
                  if (colKeys[i] === scols[j].columns) {
                    if (userdata[colKeys[i]] === null) {
                      scols[j].column = ''
                    } else {
                      scols[j].column = userdata[colKeys[i]]
                    }
                  }
                }
              }
              self.addQuery.cols.srv_cols = self.deepClone(scols)
              self.showChild = true
              console.log('userdata', userdata)
            // data = e
              self.$store.commit('hideLoading')
              self.pageBtns = self.addQuery.cols.formButton
              self.pageBtns = self.pageBtns.filter((item) => {
                if (item.permission === true) {
                  return item
                }
              })
            } else {
// self.addQuery.serviceName = self.introduce.submit_service
              self.addQuery.serviceName = self.introduce.submit_service.replace('add', 'add')
              self.addQuery.type = 'add'
              self.addQuery.cols = await self.getColData(self.addQuery.serviceName, 'add', 'add')
              let userdata = self.userInfo
              let scols = self.deepClone(self.addQuery.cols.srv_cols)
              let colKeys = Object.keys(userdata)
              for (let i = 0; i < colKeys.length; i++) {
                for (let j = 0; j < scols.length; j++) {
                  if (colKeys[i] === scols[j].columns) {
                    if (userdata[colKeys[i]] === null) {
                      scols[j].column = ''
                    } else {
                      scols[j].column = userdata[colKeys[i]]
                    }
                  }
                }
              }
              self.addQuery.cols.srv_cols = self.deepClone(scols)
              self.showChild = true
              console.log('userdata', userdata)
            // data = e
              self.$store.commit('hideLoading')
              self.pageBtns = self.addQuery.cols.formButton
              self.pageBtns = self.pageBtns.filter((item) => {
                if (item.permission === true) {
                  return item
                }
              })
            }

            self.showChild = true
            self.$store.commit('                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ')
          } else {
            self.$store.commit('hideLoading')
            self.$vux.toast.show({
              text: '请在微信中打开链接',
              type: 'text',
              time: 800,
              isShowMask: true
            })
          }
        }
      }
      let req = {
        serviceName: 'srvoa_page_info_collect_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'id',
            value: self.key,
            ruleType: 'eq'
          }
        ]
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    getData (key) {
      let self = this
    //   let flag = true
      let column = this.$route.query.col
      let CallbackGoHome = function (response) {
        if (response.data.data.length > 0) {
          // console.log(response.data.data)
          let data = response.data.data[0]
          self.data = data[column]
        }
      }
      let req = {
        serviceName: self.sn,
        colNames: [
          self.col
        ],
        condition: [
          {
            colName: self.key,
            value: self.val,
            ruleType: 'eq'
          }
        ]
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGoHome)
    },

    onReset () {
      // this.broadcast('iFormItem', 'on-reset')
      this.$refs.iForms.resetForm()
      // console.log('重置')
    },
    async submitForm () {
      let self = this
      await this.broadcast('iFormItem', 'on-submit')
      self.$refs.iForms.onValidatorsFun()
      let a = await self.$refs.iForms.returnFields()
      if (!a.valid) {
        // debugger
        a = await self.$refs.iForms.returnFields()
      } else if (a.data.length === 0) {
        self.$vux.toast.show({
          text: '没有需要提交的信息',
          type: 'text',
          time: 800,
          isShowMask: true
        })
      } else {
        self.show6 = true
        // self.$vux.confirm.show({
        //   title: '确认操作',
        //   content: '是否确认提交',
        //   onShow () {
        //     // console.log('plugin show')
        //   },
        //   onHide () {
        //     // console.log('plugin hide')
        //   },
        //   onCancel () {
        //     // console.log('plugin cancel')
        //   },
        //   onConfirm () {
        //     // alert('1=>' + JSON.stringify(a))
        //     if (a.data) {
        //       // alert('2=>' + JSON.stringify(a))
        //       self.submint(a.data)
        //     // console.log('plugin confirm')
        //     }
        //   }
        // })
      }
    },
    async submint (e) {
      let self = this
      let nData = e
      if (!nData) {
        self.$refs.iForms.onValidatorsFun()
        nData = await self.$refs.iForms.returnFields()
      } else {
        nData = e
      }
      if (nData.data) { nData = nData.data }
      let params = [
        {
          'serviceName': self.addQuery.cols.service_name,
          'data': [
          ]
        }
      ]
      // alert('3=>' + JSON.stringify(nData))
      if (self.addQuery.type === 'add') {
        // eslint-disable-next-line
        let data = []
        let a = {}
        data = nData.map((item) => {
          if (item.column !== '') {
            a[item.columns] = item.column
          }
        })
        let opid = self.$store.getters.getOpenId
        if (opid !== '') {
          a['openid'] = opid
          if (self.foreignKey.length > 0) {
            a[self.foreignKey[0].colName] = self.foreignKey[0].value

            // console.log('key', self.foreignKey[0])
          }
          if (self.introduce.collect_no !== null && self.introduce.collect_no !== undefined) {
            a['collect_no'] = self.introduce.collect_no
          } else {
            a['collect_no'] = ''
          }
          params[0].data.push(a)
          // alert('4=>' + JSON.stringify(params))
          const response = await self.$http.post(self.$api.add, params)// 新增
          // alert('5=>' + JSON.stringify(response))
          if (response.body.state === 'SUCCESS') {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultMessage
            })
            let id = self.$store.getters.getOpenId
            self.getUserInfo(id)
            window.location.href = window.location.origin + '/collect?id=' + self.key
          } else {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultMessage
            })
          }
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: '未获取到微信授权'
          })
        }
      } else if (this.addQuery.type === 'update') {
// eslint-disable-next-line
        let data = []
        let a = {}
        data = nData.map((item) => {
          a[item.columns] = item.column
        })
        let opid = self.$store.getters.getOpenId
        if (opid !== '') {
          a['openid'] = opid
          if (self.foreignKey.length > 0) {
            a[self.foreignKey[0].colName] = self.foreignKey[0].value

            // console.log('key', self.foreignKey[0])
          }
          params[0].data.push(a)
          params[0].condition = [{
            'colName': 'openid',
            'ruleType': 'eq',
            'value': opid
          }]
          // alert('6=>' + JSON.stringify(params))
          const response = await self.$http.post(self.$api.update, params)// 新增
          // alert('7=>' + JSON.stringify(response))
          if (response.body.state === 'SUCCESS') {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultMessage
            })
            let id = self.$store.getters.getOpenId
            self.getUserInfo(id)
            window.location.href = window.location.origin + '/collect?id=' + self.key
          } else {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultMessage
            })
          }
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: '未获取到微信授权'
          })
        }
      } else if (this.addQuery.type === 'apply') {
        // eslint-disable-next-line
        let datas = []
        let a = {}
        datas = nData.map((item) => {
          if (item.column === '') {
            item.column = null
          }
          a[item.columns] = item.column
        })
        params[0].data.push(a)
        const response = await self.$http.post(self.$api.startProc, params)// 流程开启
      // const response = await self.$http.post(self.$api.startProc, params) //新增
        if (response.body.state === 'SUCCESS') {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
          self.$router.go(-1)
          // self.$router.push({ name: 'bxoa_issue' })// 流程列表
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
        }
      }
    },
    refresh () {
      setTimeout(() => {
        this.list = []
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              this.getInfo(this.key)
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    }
  }
}
</script>
<style lang="less">
.detail-call{
  .footer {
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 100vw;
    font-size: 8px;
    color: #748992;
}
  // padding: 6px;
  .detail-call-item{
    // padding: 0.3rem 0;
    line-height: 1.2rem;
    .banner-text{
          line-height: 3rem;
    color: #ad5e5c;
    font-size: 0.8rem;
    text-align: center;
    background: #87110f;
    }
    &.flex-col{
      display: flex;
      flex-direction: column;
      .detail-call-label{
        text-align:left;
      }
    }
    span{
        margin: 3rem auto;
    }
    &.flex-row{
      display: flex;
      flex-direction: row;
      
    }
    .detail-call-label{
      text-align:right;
      color: #999;
      min-width:4rem;
      font-size:0.8rem;
    }
    .detail-call-value{
      padding-left: 0.4em;
      img{
        width: 100%;
        height: auto;
        margin: 0 auto;
      }
      p{
        // padding: 4px;
        line-height: 1.2;
      }
      table{
            max-width: 100%;
            overflow-x: auto;
            overflow: hidden;
          }
    }
  }
  .collectTitle{
    line-height: 2.4rem;
    font-size: 1.2rem;
    background: #87110f;
    color: #fff;
    text-align: center;
  }
      .collectPage{
          border:1px dashed #87110f;
          border-width: 2px 1px 2px 1px;
          border-radius: 0px;
          .vux-flex-row {
              flex-direction: row;
              justify-content: center;
          }
          .sub-ok {
              text-align: center;
              padding: 20px;
              color: #03A9F4;
          }
          .form-view-item .weui-cells__title {
              padding-left: 10px 15px;
              border-left: 0px solid #03A9F4;
              border-bottom: #D9D9D9;
              color: #610908;
          }
          .tipstext{
            text-align: center;
            line-height: 3rem;
            color: #03A9F4;
          }
          .weui-input {
              color: #525252;
          }
          input::-webkit-input-placeholder,textarea::-webkit-input-placeholder { /* WebKit browsers */ 
            color: #cecaca; 
          } 
          input:-moz-placeholder,textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
            color: #cecaca; 
          } 
          input::-moz-placeholder,textarea::-moz-placeholder { /* Mozilla Firefox 19+ */ 
            color: #cecaca; 
          } 
          input:-ms-input-placeholder,textarea:-ms-input-placeholder { /* Internet Explorer 10+ */ 
            color: #cecaca; 
          } 
      }
}
</style>
