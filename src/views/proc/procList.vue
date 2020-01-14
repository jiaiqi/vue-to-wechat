<template>
  <div>
    <div class="listView">
    <tab>
      <tab-item v-for="(item,index) in tabs" :key="index" :selected="item.value === acted" @on-item-click="handler" :badgeLabel="item.len.toString()">{{ item.label }}</tab-item>
    </tab>
    <scroller lock-x scrollbarY use-pullup use-pulldown height="-0" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" 
    :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
    :pullup-config="{content:'上拉加载更多',downContent:'松开加载更多',upContent:'上拉加载更多',loadingContent:'加载中'}"
    v-model="status" ref="scroller">
      <div class="listView">
        <div class="bx-list-panl">
            <div class="bx-list-view" style="padding:10px;" v-for="(item,index) in list[acted]" :key="index" @click="toDetail(item)">
              <flexbox :gutter="2"  class="bx-item-flex-view">
                <flexbox-item v-if="item.src !== '' && item.src !== undefined" class="bx-item-flex-img" style="max-width:65px;"> <img width="60px" :src="item.src" alt="" class="weui-media-box__thumb"></flexbox-item>
                <flexbox-item >
                  <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-header">
                    <flexbox-item >
                      <span class="">{{item.title.value}}</span>
                    </flexbox-item>
                    <flexbox-item style="text-align:right;" v-if="item.title.label !== ''">
                      <badge :text="item.title.label"></badge>
                    </flexbox-item>
                  </flexbox>
                  <flexbox :gutter="2" wrap="wrap"  class="bx-item-flex-content" v-for="(item,index) in item.content" :key="index">
                    <flexbox-item v-for="(item,index) in item" :key="index">
                      <span :class="item.color" v-if="item.label !== ''" class="item-center-label">{{item.label}}:</span><span>{{item.value}}</span>
                    </flexbox-item>
                  </flexbox>
                  <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-content">
                    <flexbox-item style="text-align:left">
                      <span v-if="item.footer.columns.label !== ''" class="item-center-label">{{item.footer.columns.label}}:</span>
                      <span>{{item.footer.columns.value}}</span>
                    </flexbox-item>
                  </flexbox>
                  <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-footer">
                  <flexbox-item class="bx-cell-btns">
                      <span  v-for="(btn,index) in footerBtns" :key="index" >
                        <span v-if="getDispExps(btn,item.data)" 
                        :class="btn.button_type === 'deletedraft' || btn.button_type === 'closeproc' ?'color-danger' :'color-danger'"
                        v-on:click.stop="onFooterBtn({buttonType:btn.button_type,data:item})"
                        >{{btn.button_name}}</span>
                      </span>
                      <span class="color-primary">{{item.footer.linkText}}</span>
                  </flexbox-item>
                </flexbox>
                </flexbox-item>
              </flexbox>
          </div>
        </div>
      </div>
      <load-more v-show="list[acted].length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
        
        <div v-transfer-dom>
          <popup v-model="showSearchView" class="checker-popup" position="right" :hide-on-blur=true width="80%" height="-120">
            <div style="padding:10px;min-height:100vh">
              <!-- <p style="padding: 5px 5px 5px 2px;color:#888;">请选择查询条件</p> -->
                <searchViewb v-if="query.length>0" :pathQuery="query" ref="searchView"></searchViewb>
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
    </scroller>
    <!-- <Group>
     
      <cell-box style="margin-top:0;" border-intent v-for="(item,index) in list[acted]" :key="index" :link="{path:'/procdetail',query:{proc_instance_no: item.proc_instance_no}}">
          <div class="cell-box-body" style="">
            <h4>{{item.issue_name}}</h4>
            <p>{{item.issue_no}}</p>
            <div class="cell-box-rows"><span>状态：{{item.proc_status}}</span><span>处理人：{{item.handle_user}}</span></div>
            <div class="cell-box-rows"><span>创建人：{{item.create_user}}</span><span>创建时间：{{item.create_time}}</span></div>
          </div>
      </cell-box>
    </Group> -->
    </div>
  </div>
</template>
<script>
import searchViewb from '../../components/search.vue'
import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, FormPreview, CellBox, Popup, Group, LoadMore, Scroller, Spinner, Flexbox, FlexboxItem, Badge, TransferDom } from 'vux'
const list = () => [
  // lab 基本配置
  {
    label: '我的全部',
    value: 'myall',
    len: '',
    pageNo: 1,
    row: 10
  }, {
    label: '我的申请',
    value: 'mine',
    len: '',
    pageNo: 1,
    row: 10
  }, {
    label: '待我处理',
    value: 'wait',
    len: '',
    pageNo: 1,
    row: 10
  }, {
    label: '我已处理',
    value: 'processed',
    len: '',
    pageNo: 1,
    row: 10
  }
]
export default {
  name: 'taskList',
  computed: {
    count () {
      let self = this
      return self.$store.getters.getShowSearch
    }
  },

  directives: {
    TransferDom
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
    Flexbox,
    FlexboxItem,
    Badge,
    searchViewb
  },
  data () {
    return {
      showSearchView: this.$store.getters.getShowSearch,
      acted: 'myall',
      tabs: list(),
      index: 0,
      link: '/bxoa_issue_detail',
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      },
      list: {
        myall: [],
        mine: [],
        wait: [],
        processed: []
      },
      rownumber: 10,
      pageNo: 1,
      total: 0,
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      listCfgs: {
        // menu返回的list配置json Data示例
        serviceName: 'srvoa_news_columns_info_select',
        type: '1',  // 模版编号 list list-proc
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
            src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
            // src: '',
            title: {
              label: '军事',
              value: '乌镇峰会传来5G春讯 在商用门口在商用门在商用门'
            },
            content: [
              [
                {
                  label: '摘要',
                  value: '今年的乌镇互联网大会有点不一样。今年的乌镇互联网大会有点不一样。因……',
                  color: 'color-danger'
                }
              ], [
                {
                  label: '时间',
                  value: '2018/11/10 14:262018/11/10 14:26'
                },
                {
                  label: '记者',
                  value: '李兴彩'
                }
              ]
            ],
            footer: {
              linkText: '详情222',
              btns: {
                show: false,
                config: []
              },
              columns: {
                label: '创建时间',
                value: '2018/11/10 14:262018/11/10 14:26'
              }
            },
            url: '/component/cell'
          }
        ]
      },
      colV2Data: {},
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
        },
        onHide () {
          self.$router.go(-1)
        }
      })
    } else {
      templateCfg = templateCfg.replace(/\s+/g, '')
      this.listCfgs.serviceName = this.$route.query.serviceName
      this.listCfgs.content = JSON.parse(templateCfg)
      this.query = this.$route.query.serviceName
    }
  },
  mounted () {
    this.getColV2()
    this.loadProcData(this.listCfgs.serviceName)
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
    toDetail (e) {
      let key = e.key
      // this.$router.push({name: 'procdetail', params: {proc_instance_no: key}})
      this.$router.push({path: '/procdetail/' + key, query: {title: e.title.value}})
      // if (e.data.proc_status === '待提交' || e.data.proc_status === '待重新提交') {
      //   let val = e.data.id
      //   this.$router.push({path: '/update', query: {serviceName: this.listCfgs.serviceName, key: 'id', value: val, srvType: 'update', pageType: 'add', proc_instance_no: e.data.proc_instance_no}})
      // } else {
      //   let key = e.key
      //   this.$router.push({path: '/procdetail', query: {proc_instance_no: key}})
      // }
    },
    getDispExps (item, e) {
      let result = false
      // eslint-disable-next-line
      let data = e
      try {
        let dispExps = item.disp_exps
        if (dispExps !== undefined && dispExps !== '' && dispExps !== null) {
          // eslint-disable-next-line
          result = eval(dispExps)
        }
      } catch (err) {
        console.error('按钮表达式执行错误')
      }
      return result
    },
    getData (e, cond) {
      let self = this
      let CallbackGo = async function (response) {
        if (response.data.data !== '') {
          // let sData = response.data.data
          let rData = JSON.parse(JSON.stringify(response.data.data))
          let resNum = response.data.data.length
          for (let index in self.tabs) {
            if (self.tabs[index].value === e) {
              self.tabs[index].len = response.data.page.total
              // self.tabs[index].len = response.data.data.length
            }
          }
          // console.log(sData, resNum)
          // self.total = response.data.page.total
          let reqData = []
          reqData = await self.toListDataCtr(rData, self.listCfgs) // data构造方法参数一,原始data；参数二配置data
          if (self.tabs[self.index].pageNo > 1) {
            self.list[e] = self.list[e].concat(reqData)
            self.$refs.scroller.reset()
          } else {
            self.list[e] = reqData
            self.$refs.scroller.reset()
          }
          self.$vux.toast.show({
            type: 'text',
            text: '加载了' + resNum + '条'
          })
          self.showLoading(false)
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = this.listCfgs.serviceName
      req.colNames = ['*']
      req.condition = []
      if (cond) {
        req.condition = cond
      }
      req['proc_data_type'] = e
      req.order[0].colName = 'create_time'
      req.order[0].orderType = 'desc'
      req['page'] = {
        'pageNo': this.tabs[this.index].pageNo,
        'rownumber': this.rownumber
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    handler (index) {
      let tabsValue = list()
      let self = this
      let value = tabsValue[index].value
      // // console.log(value)
      // this.pageNo = 1
      // this.rownumber = 10
      // this.total = 0
      this.index = index
      this.acted = value
      // self.list[self.acted] = []
      // this.getData(this.acted)
      self.$refs.scroller.reset({
        top: 0
      })
    },
    getColV2: function () {
      let self = this
      let CallbackGoV = function (response) {
        if (response.data.state === self.$api.byState) {
          console.log(response.data.data)
          self.colV2Data = JSON.parse(JSON.stringify(response.data.data))
          self.getGridButton(self.colV2Data.gridButton)
          self.footerBtns = self.getFooterBtns(self.colV2Data.rowButton)
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = 'srvsys_service_columnex_v2_select'
      req.colNames = ['*']
      req.condition = []
      let condObj = {}
      condObj['colName'] = 'service_name'
      condObj['ruleType'] = 'eq'
      condObj['value'] = this.listData.serviceName
      req.condition[0] = JSON.parse(JSON.stringify(condObj))
      condObj['colName'] = 'use_type'
      condObj['ruleType'] = 'eq'
      condObj['value'] = 'proclist'
      req.condition[1] = JSON.parse(JSON.stringify(condObj))
      req.order[0].colName = 'seq'
      req.order[0].orderType = 'asc'
      self.crosAjaxData(self.$api.select, 'post', req, CallbackGoV)
    },
    loadProcData () {
      let self = this
      let headrlist = [
        {
          type: 'add',
          url: '/add/' + this.$route.query.serviceName + '/procAdd'
        }
      ]
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: headrlist
      })
      let procDataType = list().map((item) => { return item.value })
      procDataType.forEach((item, index) => {
        this.getData(item)
      })
    },
    loadMore () {
      let self = this
      let l = this.list[this.acted].length
      setTimeout(() => {
        if (l === self.tabs[self.index].len) {
          self.$vux.toast.show({
            text: '没有更多了',
            type: 'text',
            time: 2000,
            isShowMask: true
          })

          self.$refs.scroller.donePullup()
          self.status.pullupStatus = 'default'
        } else {
          self.tabs[self.index].pageNo += 1
          self.$refs.scroller.donePullup()
          self.$vux.toast.show({
            type: 'text',
            text: '加载中'
          })
          setTimeout(() => {
            this.getData(this.acted)

            self.$refs.scroller.donePullup()
            self.status.pullupStatus = 'default'
          }, 10)
        }
      }, 1000)
    },
    refresh () {
      setTimeout(() => {
        this.list[this.acted] = []
        this.tabs[this.index].pageNo = 1
        // this.rownumber = 10
        // this.pageNo = 1
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              this.getData(this.acted)
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
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
      let self = this
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
      self.conds = conds
      self.getData(this.acted, conds)
      self.$store.dispatch({
        type: 'setShowSearch',
        amount: false
      })
      console.log('查询条件是：', conds)
    }
  },
  watch: {
    'list': {
      handler: function (val) {
        // let self = this
        this.tabs.map((value, index, arr) => {
          val.map((item, key, obj) => {
            if (value.value === key) {
              this.tabs[index]['len'] = item.length.toString()
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span{
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
        padding-right: 20px;
        font-size: 0.8rem;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

.vux-no-group-title,.weui-cells{
  margin-top:0em;
}
.vux-tab .vux-tab-item {
    padding-right: 1rem;
}
</style>


