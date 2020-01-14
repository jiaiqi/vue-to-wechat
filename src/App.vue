<template>
  <div id="app" style="height:100%;">
    <!-- <div v-for="(item,index) in loginMsg" :key="index" >
        <iframe v-for="(item,index) in item.listdomain" :key="index" :src="item + '/setssldomiancookie?BXSSOCOOKIEID=' + item.bxssocookieid" width="1200" height="300" frameborder="0" scrolling="auto" style="position:absolute;top: -300px;left: 0px;background:#333"></iframe>
    </div> -->
    <view-box ref="viewBox" :body-padding-top="headerShow ? '0px' : '0'" :body-padding-bottom="footerShow ? '0px' : '0'">
      <NavHeader v-show="headerShow" v-bind:title="title" v-bind:onLogin="onLogin"></NavHeader>
      <transition :name="transitionName">
        <router-view class="router-view "></router-view>
      </transition>
      <Footer v-show="footerShow" ref="footer"></Footer>
    </view-box>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中"></loading>
    </div>
  </div>
</template>

<script>
import NavHeader from './components/Header.vue'
import Footer from './components/Footer.vue'
import { Scroller, TransferDomDirective as TransferDom, Loading, ViewBox } from 'vux'
import { mapGetters } from 'vuex'
import Emitter from './assets/js/mixins/emitter.js'

export default {
  computed: {...mapGetters([
    'headerShow',
    'footerShow',
    'showLoading',
    'onLogin',
    'showMenus'
  ]),
    isShowBar () {
      if (this.entryUrl.indexOf('hide-tab-bar') > -1) {
        return false
      }
      return true
    },
    isShowNav () {
      if (this.entryUrl.indexOf('hide-nav') > -1) {
        return false
      }
      return true
    }},
  mixins: [Emitter],
  created () {
    // 监听子组件上报
    this.$on('tabbar', (e) => {
      console.log('接收到tabbar上报', e)
      this.$refs.footer.setIndex(e)
    })
  },
  directives: {
    TransferDom
  },

  methods: {
    setTitle (title) {
      this.title = title
    }
  },

  mounted () {
    if (!this.logined) {
      console.log(this.$store.getters.logined)
    }
  },
  name: 'app',
  components: {
    NavHeader,
    Footer,
    Scroller,
    Loading,
    ViewBox
  },
  data () {
    return {
      entryUrl: document.location.href,
      title: this.$route.meta.title || this.$route.query.title || '',
      mianCookie: '',
      logined: this.$store.getters.logined,
      loginMsg: this.$store.getters.getLoginMsg,
      getHeadrBar: this.$store.getters.getHeadrBar,
      showMs: this.$store.getters.showMenus,
      // showMenus: false,
      transitionName: '',
      routerKey: ''
      // showLoading: this.$store.getters.showLoading
      // AuthorState: this.$store.getters.getAuthorState
    }
  },
  watch: {
    $route (to, from) {
      // var path = to.path.substring(1)
      // this.headerChange(path)
      // this.footerChange(path)
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      this.routerKey = this.$route.query.routerKey || this.$route.name
      console.log('transitionName==============================b', this.transitionName, this.routerKey)
      if (to.meta.title) {
        this.title = to.meta.title
        document.title = to.meta.title
      } else if (this.$route.query.title) {
        this.title = this.$route.query.title
        document.title = to.meta.title
      }
    },
    logined: {
      handler (newName, oldName) {
        console.log('logined changed' + this.logined)
      },
      immediate: true,
      deep: true
    },
    loginMsg () {

    },
    AuthorState (val, oldval) {
      console.log('+++++' + val, oldval)
      // if (this.AuthorState === false) {
      //   this.$router.push('/login')
      // }
    },
    showLoading: {

      handler: function (n, old) {
        // let self = this
        // if (n) {
        //   self.$vux.loading.show({
        //     text: '加载中'
        //   })
        // } else {
        //   self.$vux.loading.hide()
        // }
      },
      immediate: true,
      deep: true
    }
  }

}
</script>

<style lang="less">
// @import '~vux/src/styles/reset.less';
@import './assets/style/less-theme.less';
// @import '~vux/src/styles/1px.less';
body {
  background-color: #ffffff;
  margin: 0;
  font-family:Helvetica
  // min-height:100vh;
}
html, body {
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
#app{
  // height:100vh;
  
    background:#f7f7f7;
  .router-view{
  }
  .weui-grids,.bx-list-panl{
    background-color: #fff;
  }
}
.vux-header .vux-header-right a.vux-header-more{
  float: right;
}
.vux-header {
  position: fixed;
    // color: #333;
    background-color: #f7fbff;
   .vux-header-left,  .vux-header-right ,.vux-header-title{
    color: rgb(61, 61, 61);
    .cell-x-icon {
        fill: white;
        margin-right: 0.5rem;
        &:last-child{
          margin-right: 0;
        }
    }
  }
  
  & .vux-header-left a, & .vux-header-left button, & .vux-header-right a, & .vux-header-right button {
    float: right;
    margin-right: 8px;
    color: #fff;
  }
  .vux-header-right {
    top: 8px !important;
    a.vux-header-more {
      right:0;
      &::after{
        line-height: 30px;
        top: 14px !important;
      }
    }
  }
  .vux-header-title-area, .vux-header-title {
    // margin-right:132px!important;
  }
}
	.slide-down-enter-active,
	.slide-down-leave-active{
		transition: .4s all ease;
		opacity:0.2;
		transform: translate3d(0,6em,0);
	}
	.slide-down-enter,
	.slide-down-leave{
		opacity:1;
		transform: translate3d(0,6em,0);
	}
.weui-tabbar {
  >a{
    text-decoration:none; 
    >p.weui-tabbar__label{
      margin: 0.2rem;
    }
  }

  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon>i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #0476f8;
  }
}
.form-view{
  .weui-cell__bd,.vux-datetime-value{
    border-bottom: 1px solid #999;
  }
}

   .search-item {
    background-color: #fff;
    border: 1px solid #3969a0;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-bottom: 5px;
    margin-right: 8px;
    line-height: 18px;
    border-radius: 15px;
    // width: 37%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top:5px;
  }
  .search-item-selected {
    background-color: #0476f8;
    border: 1px solid #0476f8;
    color: #fff;
  }
  .bottom-flex{
    position: initial;
    bottom: 0;
    right: 0;
    left: 0;
    background: -webkit-linear-gradient(bottom, #eff3f5 , transparent); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(top, #eff3f5, transparent); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(top, #eff3f5, transparent); /* Firefox 3.6 - 15 */
    background: linear-gradient(to top, #eff3f5 , transparent); /* 标准的语法（必须放在最后） */
  }
  .pages-view{
        display: flex;
    position: fixed;
    bottom: 5px;
    right: 5px;
    height: 46px;
    width: 46px;
    border-radius: 50%;
    border: 1px solid #2196F3;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;
    text-align: center;
    .page-number{
      color: rgb(21, 22, 22);
      border-bottom: 1px solid #333;
    }
  }
</style>
