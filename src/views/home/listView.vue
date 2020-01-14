<template>
  <div class="listView">
    <!-- <tab>
      <tab-item v-for="(item,index) in listData.tabs" :key="index" :selected="item.value === acted" @on-item-click="handler">{{item.label}}</tab-item>
    </tab> -->
    <!-- <sticky v-if="colV2Data.tabs"> -->
      <!-- <tab>
        <tab-item v-for="(item,index) in colV2Data.tabs" :key="index" @on-item-click="handler">{{item.section}}</tab-item>
      </tab> -->
      <!-- <tabSelector v-if="colV2Data.tabs.length > 0" :tabsData="colV2Data.tabs"></tabSelector>
    </sticky> -->
    <scroller lock-x scrollbarY use-pullup use-pulldown height="-0" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller" 
    :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
    :pullup-config="{content:'上拉加载更多',downContent:'松开加载更多',upContent:'上拉加载更多',loadingContent:'加载中'}">
      <div class="bx-list-panl">
        <div class="bx-list-view" style="padding:10px;" v-for="(item,index) in listData.list" :key="index" @click="toDetail(item.key,item.title.value)">
          <flexbox :gutter="2"  class="bx-item-flex-view">
            <flexbox-item v-if="item.src !== '' && item.src !== undefined" class="bx-item-flex-img" style="max-width:65px;"> <img width="60px" :src="item.src" alt="" class="weui-media-box__thumb"></flexbox-item>
            <flexbox-item >
              <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-header">
                <flexbox-item :span="7/10">
                  <span class="">{{item.title.value}}</span>
                </flexbox-item>
                <flexbox-item style="text-align:right;" v-if="item.title.label !== ''">
                  <badge v-if="item.title.label" :text="item.title.label" style=""></badge>
                </flexbox-item>
              </flexbox>
              <flexbox :gutter="2" wrap="wrap"  class="bx-item-flex-content" v-for="(item,index) in item.content" :key="index">
                <flexbox-item v-for="(item,index) in item" :key="index">
                  <span :class="item.color" v-if="item.label !== ''" class="item-center-label">{{item.label}}:</span><span>{{item.value}}</span>
                </flexbox-item>
              </flexbox>
              <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-content">
                <flexbox-item :span="7/10" style="text-align:left">
                  <span v-if="item.footer.columns.label !== ''" class="item-center-label">{{item.footer.columns.label}}:</span>
                  <span>{{item.footer.columns.value}}</span>
                </flexbox-item>
              </flexbox>
              <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-footer">
                <flexbox-item class="bx-cell-btns">
                  <!-- <x-button type="primary" mini action-type="button">submit</x-button> -->
                 
                    <span  v-for="(btn,index) in footerBtns" :key="index" :class="btn.button_type === 'delete' ? 'color-danger' : 'color-primary'"  v-on:click.stop="onFooterBtn({buttonType:btn.button_type,data:item})">{{btn.button_name}}</span>
                  
                  <!-- <span class="color-primary" @click.native="onFooterBtn()">删除</span> -->
                  <span class="color-primary">{{item.footer.linkText}}</span>
                </flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
        </div> 
        <load-more v-show="listData.list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
        <div v-if="listData.list.length > 0" slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
            <span v-show="status.pullupStatus === 'default'"></span>
            <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
            <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
        
        <div v-transfer-dom>
          <popup v-model="showSearchView" class="checker-popup" position="right" :hide-on-blur=true width="80%" height="-120">
            <div style="padding:10px;min-height:100vh">
              <!-- <p style="padding: 5px 5px 5px 2px;color:#888;">请选择查询条件</p> -->
                <searchViewa v-if="query.length>0" :pathQuery="query" ref="searchView"></searchViewa>
              <div style="padding-top: 15px;">
                <flexbox>
                  <flexbox-item>
                    <x-button @click.native="hideSearchView" type="default"> 取消 </x-button>
                  </flexbox-item>
                  <flexbox-item>
                    <x-button @click.native="onReset" type="warn"> 重置 </x-button>
                  </flexbox-item>
                  <flexbox-item>
                    <x-button @click.native="onSearch" type="primary"> 确定 </x-button>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </popup>
        </div>
        <!-- <div v-transfer-dom>
          <div class="pages-view">
            <span class="page-number">{{pageNo}}</span>
            <span class="page-total">{{pageCount}}</span>
          </div>
        </div> -->
      </div>
    </scroller>
  </div>
</template>
<script>
import searchViewa from '../../components/search.vue'
import tabSelector from '../../components/tabSelector.vue'

import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, FormPreview, CellBox, Popup, Group, LoadMore, Scroller, Spinner, Panel, Badge, Flexbox, FlexboxItem, TransferDom } from 'vux'
// import { mapGetters } from 'vuex'
export default {
  name: 'listView',
  computed: {
    count () {
      let self = this
      return self.$store.getters.getShowSearch
    },
    pageCount () {
      let self = this
      return Math.ceil(self.total / self.rownumber)
    }
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem,
    FormPreview,
    CellBox,
    Popup,
    Group,
    LoadMore,
    Scroller,
    Spinner,
    Panel,
    Badge,
    Flexbox,
    FlexboxItem,
    searchViewa,
    tabSelector
  },
  directives: {
    TransferDom
  },
  props: ['itemData'],
  responseData: [],
  data () {
    return {
      // acted: this.itemData.tabs[0].value,
      // tabs: this.itemData.tabs,
      // serviceName: this.itemData.serviceName,
      showSearchView: this.$store.getters.getShowSearch,
      index: 0,
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      },
      // listData: this.itemData,
      // list: this.itemData.list,
      // list: list(),
      isTree: false,
      rownumber: 10,
      pageNo: 1,
      total: 0,
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      pageType: this.$route.query.pageType,
      listCfgs: {
        // menu返回的list配置json Data示例
        serviceName: 'srvoa_news_columns_info_select',
        type: '1',  // 模版编号 list list-proc
        pageType: '',
        content: {
          p_key: 'id',
          Comp_img: 'list_img',  // 前端定义的 >>>  标识名称：‘columnName’
          Comp_title: 'banner_title',
          Comp_title_label: 'banner_type',
          Comp_subtitle: 'remark',
          Comp_content_row_left: 'create_user_disp',
          Comp_content_row_right: 'banner_columns',
          Comp_footer: 'create_time'
        }
      },
      listData: {
        // 表格数据接口格式
        // serviceName: 'srvoa_news_columns_info_select',
        serviceName: this.$route.query.serviceName,  // router params
        type: '1',
        list: [
          {
            src: '-',
            // src: '',
            title: {
              label: '-',
              value: '-'
            },
            content: [
              [
                {
                  label: '-',
                  value: '-',
                  color: 'color-danger'
                }
              ], [
                {
                  label: '-',
                  value: '-'
                },
                {
                  label: '-',
                  value: '-'
                }
              ]
            ],
            footer: {
              linkText: '',
              btns: {
                show: false,
                config: []
              },
              columns: {
                label: '',
                value: '-'
              }
            },
            url: '/component/cell'
          }
        ]
      },
      colV2Data: {},
      // condList:
      showPopup1: false,
      query: '',
      conds: [],
      footerBtns: []
    }
  },
  created () {
    let self = this
    self.showLoading(true)
    let templateCfg = this.$route.query.templateCfg
    // console.log('模版配置' + templateCfg)
    if (templateCfg === '' || templateCfg === null || templateCfg === undefined) {
      self.$vux.alert.show({
        title: '提示',
        content: '页面配置信息为空?',
        onShow () {
          console.log('登录失败：请重新登陆')
        },
        onHide () {
          self.$router.go(-1)
        }
      })
    } else {
      // 模版配置转json
      templateCfg = templateCfg.replace(/\s+/g, '')
      this.listCfgs.serviceName = this.$route.query.serviceName
      this.listCfgs.content = JSON.parse(templateCfg)
      this.listCfgs.pageType = this.$route.query.pageType
      this.query = this.$route.query.serviceName
      if ('cond' in this.$route.query) {
        if (this.$route.query.cond.length > 0) {
          this.conds = JSON.parse(this.$route.query.cond)
        } else {
          this.conds = []
        }
      } else {
        this.conds = []
      }
      // console.log(this.listCfgs)
    }
  },
  mounted () {
    let self = this
    let headrlist = [
      // {
      //   type: 'add',
      //   url: '/add/' + this.$route.query.serviceName + '/add',
      //   cfg: ''
      // },
      // {
      //   type: 'search',
      //   url: '',
      //   cfg: ''
      // }
    ]
    self.$store.dispatch({
      type: 'setHeadrBar',
      data: headrlist
    })
    this.getColV2()// 请求 V2
    // this.loadListData(this.listData.serviceName, this.conds)
    // this.getColV2()
  },
  beforeDestroy () {
    this.$store.dispatch({
      type: 'setHeadrBar',
      data: {
        buttons: [],
        menus: [],
        showMenus: false
      }
    })
  },
  methods: {
    async getColV2 () {
      let self = this
      let colvw = await this.getColData(this.listData.serviceName, 'select', 'list')
      // this.colV2Data = colvw
      console.log('colvw=========', colvw)
      if (colvw.is_tree) {
        let prtNo = colvw.parent_no_col
        // let no = colvw.no
        this.conds = [{
          'colName': prtNo,
          'ruleType': 'isnull'
        }]
        self.isTree = colvw.is_tree
        self.colV2Data = JSON.parse(JSON.stringify(colvw))
        self.getGridButton(self.colV2Data.gridButton, self.colV2Data.service_name, self.conds)
        self.footerBtns = self.getFooterBtns(self.colV2Data.rowButton)
        this.loadListData(this.listData.serviceName, this.conds)
      } else {
        self.isTree = colvw.is_tree
        self.colV2Data = JSON.parse(JSON.stringify(colvw))
        self.getGridButton(self.colV2Data.gridButton, self.colV2Data.service_name, self.conds)
        self.footerBtns = self.getFooterBtns(self.colV2Data.rowButton)
        this.loadListData(this.listData.serviceName, this.conds)
      }
    },
    loadListData: function (serviceName, cond) {
      // 请求数据
      // console.log('getData:===' + t)
      let self = this
      let CallbackGo = async function (response) {
        if (response.data.data !== '') {
          let rData = JSON.parse(JSON.stringify(response.data.data))
          rData = rData.filter((item) => {
            if (item.src !== null && item.src !== '' && item.src !== undefined) {
              item.src = self.getImageUrl(item.src)
              return item
            } else { return item }
          })
          // self.total = response.data.page.total
          // let resNum = response.data.data.length
          self.total = response.data.page.total
          console.log('rep>>>' + rData)
          let reqData = []
          reqData = await self.toListDataCtr(rData, self.listCfgs) // data构造方法参数一,原始data；参数二配置data
          for (let i = 0; i < reqData.length; i++) {
            if (reqData[i].src !== null && reqData[i].src !== '' && reqData[i].src !== undefined) {
              let src = await self.getImageUrl(reqData[i].src)
              if (src.length > 0) { reqData[i].src = src[0]._url } else { reqData[i].src = '' }
            }
          }
          if (self.pageNo > 1) {
            self.listData.list = self.listData.list.concat(reqData)
          } else {
            self.listData.list = reqData
          }
          console.log(self.listData)
          self.showLoading(false)
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = serviceName
      req.colNames = ['*']
      if (cond) {
        req.condition = cond
      } else {
        req.condition = []
      }
      req.order[0].colName = 'id'
      req.order[0].orderType = 'desc'
      req['page'] = {
        pageNo: self.pageNo,
        rownumber: self.rownumber
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    toDetail (id, title) {
      if (this.isTree) {
        this.$router.push({path: '/detailplus/' + id, query: {serviceName: this.listData.serviceName, key: this.listCfgs.content.p_key, val: id, title: title, pageType: 'treeDetail', routerKey: this.listData.serviceName}})
      } else {
        this.$router.push({path: '/detailplus/' + id, query: {serviceName: this.listData.serviceName, key: this.listCfgs.content.p_key, val: id, title: title, pageType: 'detail', routerKey: this.listData.serviceName}})
      }
    },
    getimgPaths (arr, index) {
      // 查询图片路径
      let self = this
      // let path = ''
      let ilist = self.listData.tabs[index].list
      // let s = JSON.parse(JSON.stringify(arr))
      let fileNo = arr.map(function (item) {
        return item.src
      })
      let CallbackGoimg = function (response) {
        if (response.data.data !== '') {
          let datas = response.data.data
          for (let j = 0; j < datas.length; j++) {
            for (let i = 0; i < ilist.length; i++) {
              if (ilist[i].src === datas[j].file_no && 'src' in self.listData.tabs[index].list[i]) {
                self.listData.tabs[index].list[i].src = self.$api.getFilePath + datas[j].fileurl
              }
            }
          }
        }
      }
      let req = this.selectRequestObjs()
      req.colNames = ['file_no', 'fileurl']
      req.serviceName = 'srvsys_file_select'
      req.condition[0].colName = 'file_no'
      req.condition[0].ruleType = 'in'
      req.condition[0].value = fileNo.join()
      req.order[0].colName = 'create_time'
      req.order[0].orderType = 'asc'
      self.crosAjaxData(self.$api.select, 'post', req, CallbackGoimg)
    },
    getData (t, index, pushList) {
      // 请求数据
      console.log('getData:===' + t)
      let self = this
      let CallbackGo = function (response) {
        if (response.data.data !== '') {
          // console.log(response.data.data)
          let rData = response.data.data
          let resNum = response.data.data.length
          self.total = response.data.page.total
          // if()
          let item = rData.map(function (item) {
            let a = {}
            a['src'] = item.list_img
            a['title'] = item.banner_title
            a['desc'] = item.remark
            a['url'] = '/detail/srvoa_news_columns_info_select/' + item.id
            return a
          })
          let val = self.listData.tabs[self.index]
          // for()
          if (pushList === false) {
            val.list = item
            val.len = val.list.length
            console.log('更新完成：：：' + val.len)
            self.getimgPaths(val.list, self.index)
          } else {
            val.list = val.list.concat(item)
            val.len = val.list.length
            console.log('更新完成：：：' + val.len)
            self.getimgPaths(val.list, self.index)
          }
          console.log('加载到：' + item)
          self.$vux.toast.show({
            type: 'text',
            text: '加载了' + resNum + '条',
            position: 'bottom',
            isShowMask: true
            // time: true
          })
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = this.serviceName
      req.colNames = ['*']
      req.condition = []
      let rulea = {
        colName: 'online',
        ruleType: 'eq',
        value: '已上线'
      }
      let ruleb = {
        colName: 'banner_type',
        ruleType: 'eq',
        value: t
      }
      req.condition.push(rulea)
      req.condition.push(ruleb)
      req.order[0].colName = 'create_time'
      req.order[0].orderType = 'desc'
      req['page'] = {
        pageNo: self.pageNo,
        rownumber: self.rownumber
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    getTabsLabel (v, n) {
      let list = this.listData.tabs
      let lab = ''
      if (n === false) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].lable === v) {
            lab = list[i].value
          }
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          if (list[i].value === v) {
            lab = list[i].label
          }
        }
      }
      return lab
    },
    handler (index) {
      // 选择tab
      let tabsValue = this.listData.tabs
      let value = tabsValue[index].value
      console.log(value)
      this.index = index
      this.acted = value
      this.getData(this.getTabsLabel(this.acted), index, false)
    },
    loadMore () {
      let self = this
      setTimeout(() => {
        // if (self.listData.list.length >= self.total) {
        if (self.listData.list.length === self.total) {
          self.pageNo = self.pageCount
          self.$vux.toast.show({
            text: '没有更多了',
            type: 'text',
            time: 2000,
            isShowMask: true
          })
          self.$refs.scroller.donePullup()
          self.status.pullupStatus = 'default'
        } else {
          self.pageNo += 1
          self.$vux.toast.show({
            type: 'text',
            text: '加载中'
          })
          setTimeout(() => {
            this.loadListData(this.listData.serviceName, this.conds)

            self.$refs.scroller.donePullup()
            self.status.pullupStatus = 'default'
          }, 10)
        }
      }, 1000)
    },
    refresh () {
      setTimeout(() => {
        this.list = []
        this.rownumber = 10
        this.pageNo = 1
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              this.loadListData(this.listData.serviceName, this.conds)
            )
            // this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    },
    hideSearchView () {
      this.$store.dispatch({
        type: 'setShowSearch',
        amount: false
      })
    },
    onReset () {
      this.$refs.searchView.onReset()
    },
    onSearch () {
      let a = this.$refs.searchView.getModels()
      let b = a.filter((item) => {
        if ('column' in item && (('stateData' in item && 'endData' in item) || (typeof (item.column) === 'object' && item.column[0] !== '' && item.column[0] !== '') || item.column !== '')) {
          return item
        }
      })
      let conds = b.map(item => {
        let a = {}
        if (item.bx_col_type === 'enum') {
          a.colName = item.columns
          a.ruleType = 'eq'
          a.value = item.column
          return a
        } else if (typeof (item.column) === 'object' && (item.bx_col_type === 'date' || item.bx_col_type === 'datetime')) {
          if (item.stateDate && item.endDate && item.stateDate !== '' && item.endDate !== '') {
            a.colName = item.columns
            a.ruleType = 'between'
            a.value = []
            a.value.push(item.stateDate)
            a.value.push(item.endDate)
            // a.value[1] =
            return a
          }
        } else {
          a.colName = item.columns
          a.ruleType = '[like]'
          a.value = item.column
            // a.value[1] =
          return a
        }
      })
      if ('cond' in this.$route.query) {
        this.conds = this.$route.query.cond.concat(conds)
      } else {
        this.conds = conds
      }
      this.loadListData(this.listData.serviceName, this.conds)
      this.$store.dispatch({
        type: 'setShowSearch',
        amount: false
      })
      console.log('查询条件是：', conds)
    },
    onFooterBtn (e) {
      let self = this
      let obj = e
      let srvN = self.listCfgs.serviceName
      if (obj.buttonType === 'delete') {
        let len = srvN.lastIndexOf('_')
        let srv = srvN.slice(0, len) + '_delete'
        let conds = []
        let cond = {
          'colName': 'id',
          'ruleType': 'in',
          'value': obj.data.id
        }
        conds.push(cond)
        self.$vux.confirm.show({
          title: '确认操作',
          content: '是否确认删除' + obj.data.key,
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            console.log('plugin cancel')
          },
          async onConfirm () {
            let msg = await self.deleteRow(srv, conds)
            // [{"serviceName":"srvplm_qrcode_html_delete","condition":[{"colName":"id","ruleType":"in","value":"23"}]}]
            if (msg[0].response) {
              let len = msg[0].response.effect_rows
              self.$vux.toast.show({
                type: 'text',
                text: '删除成功' + len + '条'
              })
              self.refresh()
            }
            console.log('plugin confirm', msg[0])
          }
        })
        console.log('我点击了删除', obj.data.key)
      } else if (obj.buttonType === 'edit') {
        let len = self.listCfgs.serviceName
        let srv = len.replace('select', 'update')
        // let conds = []
        // let cond = {
        //   'colName': self.listCfgs.content.p_key,
        //   'releType': 'eq',
        //   'value': obj.key
        // }
        self.$router.push({path: '/update', query: {serviceName: srv, key: self.listCfgs.content.p_key, title: obj.data.title.value, value: obj.data.key, pageType: 'update'}})
      }
    }
  },
  watch: {
    'list': {
      handler: function (val) {
        // let self = this
        this.tabs.map((value, index, arr) => {
          val.map((item, key, obj) => {
            if (value.value === key) {
              // this.tabs[index]['len'] = item.length.toString()
            }
          })
        })
      }
    },
    'count': {
      handler: function (val) {
        let self = this
        self.showSearchView = val
      },
      deep: true   // 是否深度监听
    },
    'showSearchView': {
      handler: function (val) {
        let self = this
        if (val === false) {
          self.$store.dispatch({
            type: 'setShowSearch',
            amount: false
          })
        }
      },
      deep: true   // 是否深度监听
    }
  }
}
</script>

<style lang="less">
@basic-color-primary: #409EFF;
// $--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default; /* 53a8ff */
@basic-color-primary-gray:#5c7a98;
@basic-color-success: #67c23a;
@basic-color-warning: #e6a23c;
@basic-color-danger: #f56c6c;
@basic-color-info: #909399;
@basic-color-black: #333333;
.color-primary{
  color: @basic-color-primary
}
.color-primary-gray{
  color: @basic-color-primary-gray
}
.color-success{
  color: @basic-color-success
}
.color-danger{
  color: @basic-color-danger
}
.color-info{
  color: @basic-color-info
}
.color-black{
  color: @basic-color-black;
}
.listView{
  .bx-list-panl{
    .bx-list-view{
      border-bottom: 1px solid #eee;
      &:last-child{
        border-width: 0;
      }
      .bx-item-flex-view{
        align-items: flex-start;
        line-height: 2;
        // .bx-item-flex-img{
        // }
        .bx-item-flex-header{
          .vux-flexbox-item{
            font-size: 1rem;
            color: #333333;
            line-height: 1.8;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            span.vux-badge{
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  max-width:90%;
                  overflow: hidden;
            }
          }
        }
        .bx-item-flex-content{
          .vux-flexbox-item{
            text-align: left;
            font-size: 0.8rem;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span{
              font-size: 0.8rem;
              // line-height: 0.8rem;
              color: #999999;
              padding-right: 0.4rem;
              &:last-child{
                padding-right: 0;
              }
            }
            .item-center-label{
              color:#333;
            }
            &:first-child{
              text-align: left!important;
            }
            &:last-child{
              text-align:right
            }
          }
        }
        .bx-item-flex-footer{
          text-align: right;
          >.vux-flexbox-item{
            text-align: right;
            font-size: 0.8rem;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child{
              padding-right: 20px;
            }
          }
          .bx-cell-btns {
            line-height: initial;
            span{
              padding: 4px;
              margin: 0 5px;
            }
          }
          &::after{
            content: " ";
            display: inline-block;
            height: 6px;
            width: 6px;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: relative;
            /* top: -2px; */
            position: absolute;
            /* top: 50%; */
            right: 16px;
          }
        }
      }
    }
  }

}


.vux-no-group-title{
  margin-top:0em;
}
.weui-cells{
  margin-top:0em!important;
}

</style>


