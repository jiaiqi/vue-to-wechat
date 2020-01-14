<template>
  <div class="detail-plus">
    <xChildDetailPopup :queryCfgs="queryCfgs" :key="detaiKey"></xChildDetailPopup>
    
    <div class="tree-path" v-if="this.$route.query.pageType === 'treeDetail'">
      <span style="color:#03A9F4;padding:0 2px;width:2rem;    min-width: 2.8rem;" v-if="isTree">当前:</span>
      <div v-for="(item,index) in treePataData" :key="index" class="path-button">
        <x-button class="treeStepBtn" style="max-width:4rem;"  mini 
        plain 
        :type="index + 1  === treePataData.length ? 'default':'primary'" 
        :disabled="index + 1  === treePataData.length ? true:false" 
        @click.native="gotreeDetail(index)"
        >{{item.title}}</x-button>
        <x-icon type="ios-arrow-right" style="color:#525252" size="20"></x-icon>
      </div>
    </div>
    <!-- <scroller lock-x scrollbar-y use-pulldown height="-46"  ref="scroller" @on-pulldown-loading="refresh"  
    :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
    :pullup-config="{content:'上拉加载更多',downContent:'松开加载更多',upContent:'上拉加载更多',loadingContent:'加载中'}" >
      <div class="detail-view">
        <div class="detail-call">
          <div  v-for="(item,index) in list" :key="index" :class=" item.colType === 'note' ? 'detail-call-item flex-col':'detail-call-item flex-row'">
            <div v-if="item.section !== '' && item.section !== null" class="col-section">{{item.section}}</div>
            <div class="col-item">
              <label class="detail-call-label">{{item.label}}:</label>
              <div class="detail-call-value" v-if="item.colType !== 'note' && item.colType !== 'QrCode'  && item.colType !== 'filelist' && item.colType !== 'image'"><p>{{item.value === null ? '-' : item.value}}</p></div>
              <div class="detail-call-value" v-if="item.colType === 'note'" v-html="item.value" v-images-loaded="imageProgress"></div>
              <div class="detail-call-value" v-if="item.colType === 'qrcode'"><qrcode :value="item.value" type="img"></qrcode></div>
              <div class="detail-call-value" v-if="item.colType === 'filelist'"><a :href="file._url" v-for="(file,index) in item.value" :key="index">{{file.src_name}}</a></div>
              <div class="detail-call-value" v-if="item.colType === 'image' || item.colType === 'Image'"><img :src="file._url" v-for="(file,index) in item.value" :key="index" :alt="file.src_name"></img></div>
            </div>
          </div>
        </div>
        <xChildList v-for="(item,index) in childData.childService" :key="index" v-if="childData.childService.length>0" :childService="item" :pageType="'-'"></xChildList>
        
      </div>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller> -->
     <div v-transfer-dom>
      <popup v-model="showChildDetail" position="bottom" max-height="100%">
        <popup-header
        :right-text="'关闭'"
        :show-bottom-border="false"
        @on-click-right="showChildDetail = false"></popup-header>
        <xChildDetailPopup v-if="JSON.stringify(childItemCfg) !== {} && showChildDetail" :queryCfgs="childItemCfg"></xChildDetailPopup>
      </popup>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import xChildList from '@/components/childList.vue'
import xChildDetailPopup from '@/components/detail.vue'
import Emitter from '../../assets/js/mixins/emitter.js'
import imagesLoaded from 'vue-images-loaded' // 图片加载辅助
import { TransferDom, Popup, PopupHeader, FormPreview, Scroller, Divider, Spinner, Cell, CellBox, CellFormPreview, Group, Badge, Qrcode, XButton } from 'vux'
export default {
  name: 'XDetail',
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
    Qrcode,
    xChildList,
    TransferDom,
    Popup,
    xChildDetailPopup,
    XButton,
    PopupHeader
  },
  directives: {
    TransferDom, imagesLoaded
  },
  computed: {
    // childItemCfg (params) {

    // }
  },
  mixins: [Emitter],
  data () {
    return {
      showChildDetail: false,
      datas: {},
      vMainData: {},
      vMainDataList: {},
      treePataData: [],
      childData: {
        childService: Array

      },
      childItemCfg: {},
      list: [],
      header: {
        label: '详情',
        value: '¥2400.00',
        colType: ''
      },
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      serviceName: this.$route.query.serviceName,
      vData: [],
      isTree: false,
      queryCfgs: this.$route.query,
      detaiKey: ''
    }
  },
  created: async function () {
    // 获取数据，
    this.showLoading(true)
    // 监听子组件上报
    this.$on('get-data-ok', (e) => {
      console.log('get-data-ok')
      // this.resetScroller(e)
    })
    this.$on('update-child-detail', (e) => {
      let self = this
      console.log('update-child-detail', e)
      // this.resetScroller(e)
      self.updateTreePath(e)
    })
    this.$on('to-child-detail', (e) => {
      console.log('to-child-detail', e)
      // this.toChildDetail(e)
    })
    // self.queryCfgs = self.$route.query
    this.getColV2(this.$route.query.serviceName)
    // this.getData()
    if (this.$route.query.pageType === 'treeDetail') {
      this.isTree = true
      this.treePataData.push(this.$route.query)
      this.gotreeDetail(0)
    } else {
      this.isTrue = false
    }
  },
  methods: {
    imageProgress () {
      console.log('图片加载完毕')
      // this.$refs.scroller.reset()
    },
    updateTreePath (e) {
      this.treePataData.push(e)
    },
    gotreeDetail (index) {
      if (index < this.treePataData.length - 1) {
        this.treePataData = this.treePataData.slice(0, index + 1)
        this.queryCfgs = this.treePataData[index]
        this.detaiKey = this.queryCfgs.val
      } else {
        // this.treePataData = this.treePataData.slice(0, index)
        this.queryCfgs = this.treePataData[index]
        this.detaiKey = this.queryCfgs.val
      }
      console.log('----------------------------------------', index)
    },
    delete () {

    },
    toChildDetail (q) {
      this.childItemCfg = q
      this.showChildDetail = true
    },
    resetScroller (e) {
      // 重载滚动
      console.log('ok', e)
      if (e === 'ok') {
        // this.$refs.scroller.reset()
      }
    },
    async getColV2 (e) {
      let self = this
      self.queryCfgs = self.$route.query
      let c = [{
        colName: self.queryCfgs.key,
        value: self.queryCfgs.val,
        ruleType: 'eq'
      }]
      self.datas = await self.selectOne(this.queryCfgs.serviceName, c)
      self.vMainDataList = await self.getColData(e, 'select', 'list')
      if (self.vMainDataList.is_tree) {
        self.isTree = true
      } else {
        self.isTree = false
      }
      self.vMainData = await self.getColData(e, 'select', 'detail')
      self.childData.childService = self.vMainData.child_service
      if (self.childData.childService !== undefined) {
        self.childData.childService = self.childData.childService.filter((item) => {
          if (item.foreign_key.show_ui_child_table === '是') {
            let pkey = {
              fk: '',
              pk: '',
              fkValue: '',
              foreignKeyType: '',
              pkTable: '',
              serviceName: '',
              sectionName: ''
            }
            pkey.fk = item.foreign_key.referenced_column_name
            pkey.pk = item.foreign_key.column_name
            pkey.fkValue = self.datas[item.foreign_key.referenced_column_name]
            pkey.foreignKeyType = item.foreign_key.foreign_key_type
            pkey.pkTable = item.foreign_key.table_name
            pkey.serviceName = item.service_name
            pkey.sectionName = item.foreign_key.section_name
            pkey.child_table_readonly = item.foreign_key.child_table_readonly

            item._foreignKey = pkey
            return item
          }
        })
      }
      self.showLoading(false)
      // this.getData()
    },
    async getData () {
      // let id = this.$route.query.val
      let self = this
      // let flag = true
      let data = this.datas
      self.list = []
      console.log('子表数据加载', data)
      // self.datas = data
      let data1 = self.vMainData.srv_cols
      if (data1.length > 0) {
        data1 = data1.filter((item) => {
          if (item.in_detail === 1) {
            return item
          }
        })
      }
      self.colsData = data1
      for (let key1 in data1) {
        for (let key in data) {
          if (data1[key1].columns === key) {
            let item = {
              label: data1[key1].label,
              value: data[key],
              colType: data1[key1].bx_col_type,
              seq: data1[key1].seq,
              section: data1[key1].section,
              option_list_v2: data1[key1].option_list_v2
            }
            // data1[key1].bx_col_type === 'fk' ||
            if (data1[key1].bx_col_type === 'dict') {
              let options = data1[key1].option_list_v2
              let label = options.filter((item) => {
                if (item.value === data[key]) {
                  return item.label
                }
              })
              if (label.length > 0) {
                item.value = label[0].label
              }
              console.log('colType', item.colType)
            } else if (data1[key1].bx_col_type === 'fk') {
              console.log('data1[key1].option_list_v2', data1[key1].option_list_v2)
              let optionV2 = data1[key1].option_list_v2
              if (data[key] !== null || data[key] !== '') {
                let cond = [{
                  'colName': optionV2.refed_col,
                  'ruleType': 'eq',
                  'value': data[key]
                }]

                let val = await self.selectOne(optionV2.serviceName, cond)
                if (val !== undefined) {
                  item.value = val[optionV2.key_disp_col]
                }
                console.log(val)
              }
            } else if (data1[key1].bx_col_type === 'image' || data1[key1].bx_col_type === 'filelist') {
              item.value = await self.getImageUrl(data[key])
            }
            self.list.push(item)
            continue
          }
        }
      }
      self.$refs.scroller.reset()
      self.showLoading(false)
    },
    refresh () {
      setTimeout(() => {
        this.list = []
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              this.getData()
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    },
    fetchData (e, f) {
      let self = this
      console.log('路由更新', e, f, self.$route)
      self.detaiKey = self.$route.query.routeKey
      self.queryCfgs = self.$route.query
      // self.getColV2(self.$route.query.serviceName)
    },
    mounted () {

    }
  },

  watch: {
    // '$route': 'fetchData'
    'treePataData': function (n, o) {
      let len = n.length
      let index = len - 1
      // self.queryCfgs = n[len - 1]
      this.gotreeDetail(index)
      console.log(n)
    }
  },
  beforeRouteUpdate (to, form) {
    // this.fetchData(to, form)
  }
}
</script>
<style lang="less">
.detail-plus{
  height: 100vh;
  .tree-path{
    margin:5px;
    background-color:#fff;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    div.path-button{
      display: flex;
    overflow-x: auto;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .vux-x-icon{
          // margin-top: 10px;
        }
      .treeStepBtn{
        padding: 0 4px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        // margin-right: 10px;
      }
      &:last-child{
        margin-right: 0;
        .vux-x-icon{
          display:none;
        }
      }
    }
    // width:100vw;
  }
  .detail-view{
    padding: 6px;
    background: #f7f7f7;
    .childlistView{
      background: #fff;
    }
    .detail-call{
      background: #fff;
      .detail-call-item{
        padding: 0.5rem 0;
        line-height: 1.5rem;
        .col-section{
          line-height: 1.5rem;
          border-left:4px solid  rgb(63, 167, 252);
          padding: 0 4px;
          border-bottom: 1px solid #f7f7f7;
          margin-bottom: 0.5rem;
        }
        &.flex-col{
          // col-section">{{item.section}}</div>
          //     <div class="col-item
              .col-item{

          display: flex;
          flex-direction: column;
          height: auto;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          .detail-call-label{
              text-align:right;
              color: #999;
              width:5rem;
              font-size:1rem;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              line-height: 1.5rem;
              min-width: 5rem;
            }
            .detail-call-value{
              padding: 0.4em;
              font-size: 0.8rem;
              img,p img{
                width: 100%;
                height: auto;
              }
            }
              }
        }
        &.flex-row{
          
          .col-item{
            
          display: flex;
          flex-direction: row;
            .detail-call-label{
              text-align:right;
              color: #999;
              width:5rem;
              font-size:1rem;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              line-height: 1.5rem;
              min-width: 5rem;
            }
            .detail-call-value{
              padding-left: 0.4em;
              img,p img{
                width: 100%;
                height: auto;
              }
            }
          }
        }
      }
      
    }
  }

}


</style>
