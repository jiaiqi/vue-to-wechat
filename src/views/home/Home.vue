<template>
  <scroller
    lock-x
    :lockY="!homeScrollY"
    id="home-view"
    use-pulldown
    :scrollbarY="false"
    scrollbar-y
    height="-106"
    ref="scroller"
    @on-pulldown-loading="refresh"
    @on-scroll="homeScroll"
  >
    <div class="home">
      <SwiperView :baseList="swiperList"></SwiperView>
      <!-- <group-title>{{onLogin.user_disp ? onLogin.user_disp + selectedMenu : '未登陆' + selectedMenu}}</group-title> -->
      <!-- <group>
        <popup-radio title="功能栏目" :options="pMenuData" v-model="selectedMenu">
        </popup-radio>
      </group> -->
      <!-- <swiper height="190px" dots-position="center" class="menu-btn-panl">
        <swiper-item class="black" v-for="(item,index) in menuActionPage" :key="index">  shortcutMenu-->

      <group>
        <cell
          title="快捷入口"
          value="全部"
          is-link
          @click.native="onClickMenuAll"
        ></cell>
      </group>
      <grid
        :show-lr-borders="false"
        :show-lb-borders="false"
        :show-vertical-dividers="false"
        :cols="4"
      >
        <grid-item
          v-if="value.app_dest_page === 'list'"
          :link="{
            path: '/listView',
            query: {
              serviceName: value.service_name,
              templateCfg: value.app_temp_col_map,
              title: value.menu_name,
              pageType: value.app_dest_page
            }
          }"
          :label="value.menu_name"
          v-for="(value, index) in shortcutMenu"
          :key="index"
        >
          <img
            slot="icon"
            v-if="value.icon !== null"
            :src="value.icon === null ? noneIcon : imgUrl + value.icon"
          />
          <span v-if="value.icon === null" slot="icon" class="text-icon">
            {{ value.menu_name.substr(0, 1) }}
          </span>
        </grid-item>
        <grid-item
          v-if="value.app_dest_page === 'list-proc'"
          :link="{
            path: '/proclist',
            query: {
              serviceName: value.service_name,
              templateCfg: value.app_temp_col_map,
              title: value.menu_name,
              pageType: value.app_dest_page
            }
          }"
          :label="value.menu_name"
          v-for="(value, index) in shortcutMenu"
          :key="index"
        >
          <img
            slot="icon"
            v-if="value.icon !== null"
            :src="value.icon === null ? noneIcon : imgUrl + value.icon"
          />
          <span v-if="value.icon === null" slot="icon" class="text-icon">
            {{ value.menu_name.substr(0, 1) }}
          </span>
        </grid-item>
        <grid-item
          v-if="value.app_dest_page === '' || value.app_dest_page === null"
          :label="value.menu_name"
          v-for="(value, index) in shortcutMenu"
          :key="index"
          @click.native="onNone(value.menu_name)"
        >
          <!-- <img v-if="value.icon !== null" slot="icon" src="../assets/img/icons/init/icon-init.png"> -->
          <span v-if="value.icon === null" slot="icon" class="text-icon-none">
            {{ value.menu_name.substr(0, 1) }}
            <!-- <span class="icon-tips" text="未开放">未开放</span> -->
          </span>
          <span slot="label">{{ value.menu_name }}</span>
        </grid-item>
        <grid-item
          v-if="shortcutMenu.length === 7"
          @click.native="onClickMenuAll"
        >
          <img slot="icon" src="../../assets/img/icons/more.png" />
          <span slot="label">全部</span>
        </grid-item>
      </grid>
      <!-- </swiper-item>
      </swiper> -->
      <TabItemView :itemData="tabItemData"></TabItemView>
    </div>
    <div
      slot="pullup"
      class="xs-plugin-pullup-container xs-plugin-pullup-up"
      style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;"
    >
      <span v-show="status.pullupStatus === 'default'"></span>
      <span
        class="pullup-arrow"
        v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'"
        :class="{ rotate: status.pullupStatus === 'up' }"
        >↑</span
      >
      <span v-show="status.pullupStatus === 'loading'"
        ><spinner type="ios-small"></spinner
      ></span>
    </div>
  </scroller>
</template>
<script>
import { Grid, GridItem, GroupTitle, Swiper, SwiperItem, Divider, Group, PopupRadio, Scroller, Spinner, XButton, Cell, LoadMore, Panel, Tab, TabItem } from 'vux'
// import NewsItem from './Item.vue'
import SwiperView from '../../components/SwiperView.vue'
import TabItemView from '../../components/TabItemView.vue'

import noneIcon from '../../assets/img/icons/init/icon-init.png'
import imgNotLoaded from '../../assets/img/404/imgNotLoaded.png'

import { mapGetters } from 'vuex'
export default {
  computed: mapGetters([
    'onLogin',
    'selectByUser'
  ]),
  data () {
    return {
      openUrl: '',
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      noneIcon: noneIcon,
      userData: {},
      homeScrollY: true,
      imgUrl: this.$api.getImg,
      selectedMenu: '',
      butText: '更多',
      selectedMenuData: Object,
      // actionMenuData: [],
      menuActionPage: [],
      pMenuData: [],
      swiperList: [ {
        url: 'javascript:',
        img: imgNotLoaded,
        title: '…'
      }, {
        url: 'javascript:',
        // img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
        title: '…'
      }, {
        url: 'javascript:',
        // img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg', // 404
        title: '…'
      } ],
      tabFlex: '',
      tabItemData: {
        tabs: [
          // lab 基本配置
          {
            label: '新闻栏目',
            value: 'scientific_research',
            len: '',
            list: [
              {
                // src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
                // fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                title: '…',
                desc: '…',
                url: '/component/cell'
              },
              {
                // src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
                // fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                title: '…',
                desc: '…',
                url: '/component/cell'
              },
              {
                // src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg',
                title: '…',
                desc: '…',
                url: {
                  path: '/component/radio',
                  replace: false
                }
              }
            ]
          }, {
            label: '公告栏目',
            value: 'talent_training',
            len: '',
            list: [ {
              // src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
              title: '…',
              desc: '…',
              url: '/component/cell'
            }, {
              // src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
              title: '…',
              desc: '…',
              url: '/component/cell'
            }, {
              // src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg',
              title: '…',
              desc: '???',
              url: {
                path: '/component/radio',
                replace: false
              }
            }
            ]
          }
        ],
        // serviceName: 'srvoa_news_columns_info_select',
        serviceName: '',
        type: '1'
      },
      shortcutMenu: Array
    }
  },
  components: {
    Grid,
    GridItem,
    GroupTitle,
    Swiper,
    SwiperItem,
    Divider,
    Group,
    PopupRadio,
    SwiperView,
    Scroller,
    Spinner,
    XButton,
    Cell,
    LoadMore,
    TabItemView,
    Panel,
    Tab,
    TabItem
  },
  methods: {
    onClickMenuAll () {
      this.$router.push({ path: '/navs' })
    },
    onNone (label) {
      let self = this
      self.$vux.confirm.show({
        title: '提示',
        content: '[' + label + ']暂未开放',
        showCancelButton: false,
        onShow () {
        },
        onHide () {
        },
        onCancel () {
        },
        onConfirm (msg) {
        }
      })
    },
    homeScroll (pos) {
      this.scrollTop = pos
      if (this.scrollTop > 160) {
        this.homeScrollY = false
      } else {
        this.homeScrollY = true
      }
    },
    refresh () {
      setTimeout(() => {
        this.list = []
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              // this.selectBanner()
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 200)
    },
    async getAuthorized (wxCode) {
      // 根据path是否有code进行业务逻辑处理
      let self = this
      let isUrl = window.location.protocol + '//' + window.location.host
      let reqData = ''
      let req = [
        {
          'data': [
            {
              'app_no': 'APPNO20200107181133',
              'redirect_uri': 'http://test1.100xsys.cn/home'
            }
          ],
          'serviceName': 'srvwx_public_page_authorization'
        }
      ]

      let CallbackGetinfo = await function (response) {
        if (response.data.response[ 0 ].response.authUrl) {
          console.log('reqData:', response.data.response[ 0 ].response.authUrl)

          window.location.href = response.data.response[ 0 ].response.authUrl
        }
        if (response.status === 200 && response.data.url) {
          reqData = response.data.url
          self.openUrl = reqData
          console.log('reqData:', reqData)
          window.location.href = reqData
        }
      }
      await this.crosAjaxData(this.getUrl('wx', 'srvwx_public_page_authorization', 'operate'), 'post', req, CallbackGetinfo)
    },
    async saveWxUser (e) {
      let self = this
      let req = e
      req = [
        {
          'data': [
            {
              'code': e.code,
              'app_no': 'APPNO20200107181133'
            }
          ],
          'serviceName': 'srvwx_app_login_verify'
        }
      ]
      let url = this.getUrl('wx', 'srvwx_app_login_verify', 'operate')
      const response = await this.$http.post(url, req)
      // const response = await this.$http.post(this.$api.savewxuser, req)
      if (response.data.resultCode === "SUCCESS" && response.data.response[ 0 ].response) {
        let resData = response.data.response[ 0 ].response
        console.log('loginResopnse:', resData)
        let loginMsg = {
          'bx_auth_ticket': resData.bx_auth_ticket,
          'expire_time': resData.expire_time
        }
        self.$store.dispatch({
          type: 'setLoginMsg',
          amount: loginMsg
        })
        let users = {}
        self.$store.commit('setAuthorState', true)
        users[ 'logined' ] = true

        console.log('self.$api.bindLogin', self.$api.bindLogin, response.body.resultCode, self.$api.authorizedLoginSuccess)
        if (response.body.resultCode === self.$api.bindLogin) {
          console.log('授权成功，请前往登录')
          this.$router.push('/login')
        } else if (response.body.resultCode === self.$api.authorizedLoginSuccess) {
          let users = {}
          self.$store.commit('setAuthorState', true)
          users[ 'logined' ] = true
          users[ 'user_info' ] = {}
          users.user_info[ 'user_no' ] = response.body.user_no
          self.$store.dispatch({
            type: 'setLogined',
            amount: users
          })
          // this.refresh()
          // this.getUserInfo()
          this.$router.push('/home')
          console.log('saveWxUser---授权成功')
        }
      } else {
        self.$store.commit('setAuthorState', false)
        console.log('授权失败')
      }
      // if (response.body.state === self.$api.byState) {
      //   let loginMsg = {}
      //   // 保存登录返回信息
      //   loginMsg[ 'bxssocookieid' ] = response.data.bxssocookieid
      //   loginMsg[ 'listdomain' ] = response.data.listdomain
      //   self.$store.dispatch({
      //     type: 'setLoginMsg',
      //     amount: loginMsg
      //   })
      //   console.log('response\n\n', response, self.$api.byState)

      //   if (response.body.resultCode === self.$api.bindLogin) {
      //     console.log('授权成功，请前往登陆')
      //     this.$router.push('/login')
      //   } else if (response.body.resultCode === self.$api.authorizedLoginSuccess) {
      //     let users = {}
      //     self.$store.commit('setAuthorState', true)
      //     users[ 'logined' ] = true
      //     users[ 'user_info' ] = {}
      //     users.user_info[ 'user_no' ] = response.body.user_no
      //     self.$store.dispatch({
      //       type: 'setLogined',
      //       amount: users
      //     })

      //     this.refresh()
      //     this.getUserInfo()
      //     this.$router.push('/home')
      //     console.log('授权成功')
      //   }
      // } else {
      //   self.$store.commit('setAuthorState', false)
      //   console.log('授权失败')
      // }
    },
    getCodeState (e) {
      let data = this.$http.post(e)
      return data
    },
    getUserInfo () {
      let self = this
      let req = {
        urlGetInfo: this.$api.getUserInfo,
        data: {
        }
      }
      let CallbackGetinfo = function (response) {
        if (response.data !== '') {
          let users = {}
          users[ 'logined' ] = true
          users[ 'user_info' ] = {}
          users.user_info[ 'user_no' ] = response.data.user_no
          users.user_info[ 'dept_no' ] = response.data.dept_no
          users.user_info[ 'email' ] = response.data.email
          users.user_info[ 'mobile' ] = response.data.mobile
          users.user_info[ 'user_disp' ] = response.data.user_disp
          users.user_info[ 'real_name' ] = response.data.real_name
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

      self.getShortcutMenu()
      self.selectMenu()
    },
    popupClick (e) {
      console.log(e)
    },
    async getShortcutMenu () {
      let self = this
      let cond = [
        { 'colName': 'shortcut_flag', 'ruleType': 'eq', 'value': '是' }
      ]
      let cm = await self.selectUserMenu(cond)
      if (cm.length > 8) {
        self.shortcutMenu = cm.slice(0, 7)
      } else {
        self.shortcutMenu = cm
      }
      console.log('cm1', cm)
    },
    selectMenu () {
      // 查询用户菜单
      let self = this
      let CallbackGoHome = function (response) {
        if (response.data.data !== '') {
          self.$store.dispatch({
            type: 'selectByUser',
            amount: response.data.data
          })
        }
        self.showLoading(false)
      }
      let req = this.selectRequestObjs()
      req.serviceName = 'srvsys_user_menu_select'
      req.condition[ 0 ].colName = 'parent_no'
      req.condition[ 0 ].ruleType = 'isnull'
      req.order[ 0 ].colName = 'seq'
      req.order[ 0 ].orderType = 'asc'
      let condb = {
        'colName': 'client_type',
        'ruleType': '[like]',
        'value': 'APP'
      }

      req.condition.push(condb)
      this.crosAjaxData(this.$api.selectByUser, 'post', req, CallbackGoHome)
    },
    getactMenus () {
      // 处理渲染 ‘value’ 报错问题
      if ('value' in this.pMenuData) {
        return this.pMenuData[ 0 ].value
      } else {
        return '功能栏目'
      }
    },
    getNewsType () {
      // 加载新闻分类
      console.log('======================1')
      let self = this
      let CallbackGo = function (response) {
        function arrayUnique2 (arr, name) {
          let hash = {}
          return arr.reduce(function (item, next) {
            // eslint-disable-next-line
            hash[ next[ name ] ] ? '' : hash[ next[ name ] ] = true && item.push(next)
            return item
          }, [])
        }
        if (response.data.data !== '') {
          let Obj = response.data.data
          let tabs = Obj.map(function (item) {
            let a = {}
            a[ 'label' ] = item.banner_type
            a[ 'value' ] = item.banner_columns
            a[ 'len' ] = 0
            a[ 'list' ] = []
            return a
          })
          tabs = arrayUnique2(tabs, 'value')
          // console.log('======================')
          console.log(tabs)
          self.tabItemData.tabs = tabs
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = 'srvoa_news_columns_info_select'
      req.colNames = [ 'banner_type', 'banner_columns' ]
      req.condition[ 0 ].colName = 'online'
      req.condition[ 0 ].ruleType = 'eq'
      req.condition[ 0 ].value = '已上线'
      req.order[ 0 ].colName = 'create_time'
      req.order[ 0 ].orderType = 'asc'
      // self.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    getimgPath (arr) {
      // 查询图片路径
      let self = this
      let path = ''
      let fileNo = arr.map(function (item) {
        return item.img
      })
      let CallbackGoimg = function (response) {
        if (response.data.data !== '') {
          let s = JSON.parse(JSON.stringify(arr))
          for (let j = 0; j < s.length; j++) {
            let imgpath = response.data.data[ j ]
            if (s[ j ].img === imgpath.file_no) {
              self.swiperList[ j ].img = self.$api.getFilePath + imgpath.fileurl
            }
          }
        }
        return path
      }
      let req = this.selectRequestObjs()
      req.colNames = [ 'file_no', 'fileurl' ]
      req.serviceName = 'srvsys_file_select'
      req.condition[ 0 ].colName = 'file_no'
      req.condition[ 0 ].ruleType = 'in'
      req.condition[ 0 ].value = fileNo.join()
      req.order[ 0 ].colName = 'create_time'
      req.order[ 0 ].orderType = 'asc'
      // self.crosAjaxData(self.$api.select, 'post', req, CallbackGoimg)
    },
    selectBanner () {
      // 查询轮播图
      let self = this
      let CallbackGo = function (response) {
        if (response.data.data !== '') {
          let Obj = response.data.data
          console.log(response.data.data)
          let arr = []
          Obj.forEach(function (item) {
            if (item.banner_img != null) {
              let r = {}
              r[ 'url' ] = '/detailplus/srvoa_news_columns_info_select/' + item.id
              r[ 'img' ] = self.$api.getFilePath + item.banner_img
              r[ 'title' ] = '[' + item.banner_type + ']' + item.banner_title
              arr.push(r)
            }
          })
          self.swiperList = arr
          // self.getimgPath(arr)
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = 'srvoa_news_columns_info_select'
      req.condition[ 0 ].colName = 'online'
      req.condition[ 0 ].ruleType = 'eq'
      req.condition[ 0 ].value = '已上线'
      req.order[ 0 ].colName = 'create_time'
      req.order[ 0 ].orderType = 'asc'
      // self.crosAjaxData(this.$api.select, 'post', req, CallbackGo)

      // this.getNewsType()
    },
    isWeixinCient () {
      // 判断是否当前环境是微信
      let ua = navigator.userAgent.toLowerCase()
      let isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin) { return true } else { return false }
    }

  },
  watch: {
    selectByUser: {
      handler: function (val, oldVal) {
        let self = this
        let menus = self.$store.getters.selectByUser
        // console.log(menus)
        let datas = this.getKeyOrValue(menus, 'path', 'menu_name', 'menu_no', 'icon')
        if (datas.length > 0) {
          if (this.pMenuData.length === 0) {
            this.pMenuData = datas
            this.selectedMenu = this.pMenuData[ 0 ].key
            console.log('>>>>' + this.pMenuData)
          }
        }
      },
      deep: true   // 是否深度监听
    },
    selectedMenu: {
      // 点击加载菜单
      handler: function (val) {
        let self = this
        this.selectedMenuData = this.pMenuData.filter(item => item.key === val)
        let CallbackGoHomea = function (response) {
          if (response.data.data !== '') {
            self.actionMenuData = response.data.data
            // 十个一页
            let menuList = self.menuSpliceArr(response.data.data, 8)
            self.menuActionPage = menuList
          }
        }
        let req = this.selectRequestObjs()
        req.serviceName = 'srvsys_user_menu_select'
        req.condition[ 0 ].colName = 'parent_no'
        req.condition[ 0 ].ruleType = 'notnull'
        req.order[ 0 ].colName = 'seq'
        req.order[ 0 ].orderType = 'asc'
        if (req.condition[ 0 ].colName !== 'path') {
          let cond = {}
          cond[ 'colName' ] = 'path'
          cond[ 'ruleType' ] = 'like]'
          cond[ 'value' ] = self.selectedMenu
          let condb = {
            'colName': 'client_type',
            'ruleType': '[like]',
            'value': 'APP'
          }
          let condc = {
            'colName': 'service_name',
            'ruleType': 'notnull',
            'value': ''
          }
          req.condition.push(cond)
          req.condition.push(condb)
          req.condition.push(condc)
        }
        this.crosAjaxData(this.$api.selectByUser, 'post', req, CallbackGoHomea)
      },
      deep: true
      // immediate: true
    },
    openUrl: {
      handler: function (val, oldVal) {
        // let self = this
        console.log(val)
      },
      deep: true   // 是否深度监听
    }
  },

  created () {
    // this.$router.push('/vxAuthor')
    this.showLoading(true)
  },
  mounted () {
    let self = this
    this.isWeixinCient()
    this.$store.dispatch({
      type: 'setIsWeixinCient',
      amount: this.isWeixinCient()
    })
    let code = this.$route.query.code
    let state = this.$route.query.state
    let AuthorState = this.$store.getters.getAuthorState
    let isWeixinCient = this.isWeixinCient()
    let wxCode = {}
    wxCode[ 'code' ] = code
    wxCode[ 'state' ] = state
    console.log('wxCode', wxCode)
    let logined = this.$store.getters.logined
    console.log('登录状态', logined)
    if (AuthorState) {
      // 已授权的进入首页
      self.refresh()
      self.getUserInfo()
    } else {
      // 未授权的进入授权
      if (isWeixinCient) {
        if (code) {
          // 判断是否是授权重定向
          console.log('wxCode', wxCode)
          this.saveWxUser(wxCode)
        } else {
          this.getAuthorized(wxCode)   // 获取授权
        }
      } else {
        if (logined) {
          self.refresh()
          self.getUserInfo()
        } else {
          self.$router.push('/login')
        }
      }
    }
  }
}
</script>


<style lang="less">
a {
  text-decoration: none;
}
.home {
  .weui-grid__icon {
    width: 2.4rem;
    height: 2.4rem;
    margin: 0 auto;
    display: flex;
    .text-icon {
      height: 100%;
      width: 100%;
      // background: rgb(39, 99, 230);
      background: -webkit-linear-gradient(
        bottom,
        #214bbd,
        #3e91ff
      ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        top,
        #214bbd,
        #3e91ff
      ); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        top,
        #214bbd,
        #3e91ff
      ); /* Firefox 3.6 - 15 */
      background: linear-gradient(
        to top,
        #214bbd,
        #3e91ff
      ); /* 标准的语法（必须放在最后） */
      color: #fff;
      text-align: center;
      border-radius: 4px;
      line-height: 2.4rem;
      font-size: 1.8rem;
    }
    .text-icon-none {
      height: 100%;
      width: 100%;
      // background: rgb(39, 99, 230);
      background: -webkit-linear-gradient(
        bottom,
        #7484b1,
        #8ebfff
      ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        top,
        #7484b1,
        #8ebfff
      ); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        top,
        #7484b1,
        #8ebfff
      ); /* Firefox 3.6 - 15 */
      background: linear-gradient(
        to top,
        #7484b1,
        #8ebfff
      ); /* 标准的语法（必须放在最后） */
      color: #fff;
      text-align: center;
      border-radius: 4px;
      line-height: 2.4rem;
      font-size: 1.8rem;
    }
  }
  .vux-label {
    font-size: 1.2rem;
    font-weight: bold;
  }
  // .tabItemView{
  //   height: calc(100% - 80px)
  // }
  .vux-tab-wrap.tab-flex {
    position: absolute;
    top: 46px;
  }
  .weui-cells {
    margin-top: 0;
  }
  .weui-grid:after {
    border-bottom: 0px solid #d9d9d9;
  }
  .weui-grid__icon {
    width: 42px;
    height: 42px;
    img {
      display: block;
      width: 100%;
      height: 100%;
      /* box-shadow: 1px 1px 3px red; */
      -webkit-filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3));
      filter: drop-shadow(1px 1px 1px rgba(26, 20, 43, 0.404));
    }
  }
  .weui-grid {
    padding: 10px 10px;
  }
  .demo3-slot {
    text-align: center;
    padding: 8px 0;
    color: #888;
  }
  .vux-cell-value {
    color: #188cf8;
    // font-weight: bold;
    // background-color: #188cf8;
    border-left: 4px solid #67df04;
    padding-left: 8px;
  }
}
// @import './assets/style/less-theme.less';
.grid-View {
  .weui-grid__label {
    display: block;
    text-align: center;
    color: #000000;
    font-size: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
