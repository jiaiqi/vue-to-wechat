<template>
  <div>
    <scroller lock-x scrollbar-y  :height="queryCfgs.pageType === 'procDetail' ? '-140' : queryCfgs.pageType === 'treeDetail' || queryCfgs.pageType === 'childDetail' ? '-85' : '-60'"  ref="scroller" 
    :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
    :pullup-config="{content:'上拉加载更多',downContent:'松开加载更多',upContent:'上拉加载更多',loadingContent:'加载中'}" >
      <div class="child-detail-view">
        <div class="detail-call">
          <div  v-for="(item,index) in list" :key="index" :class=" item.colType === 'note' ? 'detail-call-item flex-col':'detail-call-item flex-row'">
            <div v-if="item.section !== '' && item.section !== null" class="col-section">{{item.section}}</div>
            <div class="col-item">
              <label class="detail-call-label">{{item.label}}:</label>
              <div class="detail-call-value" v-if="item.colType !== 'note' && item.colType !== 'QrCode'  && item.colType !== 'filelist' && item.colType !== 'image'"><p>{{item.value === null ? '-' : item.value}}</p></div>
              <div class="detail-call-value" v-if="item.colType === 'note'" v-html="item.value" v-images-loaded="imageProgress"></div>
              <div class="detail-call-value" v-if="item.colType === 'qrcode'"><qrcode :value="item.value" type="img"></qrcode></div>
              <div class="detail-call-value" v-if="item.colType === 'filelist'"><a :href="file._url" v-for="(file,index) in item.value">{{file.src_name}}</a></div>
              <div class="detail-call-value" v-if="item.colType === 'image' || item.colType === 'Image'"><img :src="file._url" v-for="(file,index) in item.value" :alt="file.src_name"></img></div>
            </div>
          </div>
        </div>
        <xChildLists v-if="childData.childService.length > 0" v-for="(item,index) in childData.childService" :key="index"  :childService="item" :pageType="pageType" :keyDatas="datas"></xChildLists>
      </div>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
      </scroller>
  </div>
</template>
<script>
import xChildLists from '@/components/childList.vue'
import Emitter from '../assets/js/mixins/emitter.js'
import imagesLoaded from 'vue-images-loaded' // 图片加载辅助
import { FormPreview, Scroller, Divider, Spinner, Cell, CellBox, CellFormPreview, Group, Badge, Qrcode } from 'vux'
export default {
  name: 'xChildDetail',
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
    xChildLists
  },
  props: {
    queryCfgs: {}
  },
  mixins: [Emitter],
  data () {
    return {
      datas: {},
      colsData: Array,
      vMainData: {},
      childData: {
        childService: Array

      },
      pageType: this.queryCfgs.pageType,
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
      serviceName: this.queryCfgs.serviceName
    }
  },
  directives: {
    imagesLoaded
  },
  created: function () {
    // 获取数据，
    if (this.queryCfgs.pageType === 'procDetail') {
      console.log('scroller', this.$refs.scroller)
      // this.$refs.scroller.height = '-140'
    } else {
      console.log('scroller', this.$refs.scroller)
      // this.$refs.scroller.height = '-76'
    }
    // 监听子组件上报
    this.$on('refresh', (e) => {
      if (e) {
        this.getColV2(this.queryCfgs.serviceName)
        console.log('refresh', e)
        this.$refs.scroller.reset()
      }
    })

    if (JSON.stringify(this.queryCfgs) !== {}) {
      this.getColV2(this.queryCfgs.serviceName)
      // this.getData()
      console.log('detail加载完毕')
      return true
    } else {
      return false
    }
  },
  mounted: function () {
    // this.dispatch('XDetail', 'mounted-ok', 'ok')
    this.dispatch('XProcDetail', 'mounted-ok', 'ok')
  },
  methods: {
    delete () {

    },
    imageProgress () {
      console.log('图片加载完毕')
      this.$refs.scroller.reset()
    },
    resetScroller (e) {
      // 重载滚动
    //   console.log('ok', e)
    //   if (e === 'ok') {
    //     this.$refs.scroller.reset()
    //   }
    },
    async getColV2 (e) {
      let self = this
      let c = [{
        colName: self.queryCfgs.key,
        value: self.queryCfgs.val,
        ruleType: 'eq'
      }]
      // c.push(this.conds)
      self.datas = await self.selectOne(this.queryCfgs.serviceName, c)
      self.vMainData = await self.getColData(e, 'select', 'detail')
      self.childData.childService = self.vMainData.child_service
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
          item._foreignKey = pkey
          return item
        }
      })
      self.getData()
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
      let dataCol = Object.keys(data)
      // for (let key1 in data1) {
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < dataCol.length; j++) {
        // for (let key in data) {
          if (data1[i].columns === dataCol[j]) {
            let item = {
              label: data1[i].label,
              value: data[data1[i].columns],
              colType: data1[i].bx_col_type,
              seq: data1[i].seq,
              section: data1[i].section,
              option_list_v2: data1[i].option_list_v2
            }
            // data1[key1].bx_col_type === 'fk' ||
            if (data1[i].bx_col_type === 'dict') {
              let options = data1[i].option_list_v2
              let label = options.filter((item) => {
                if (item.value === data[data1[i].columns]) {
                  return item.label
                }
              })
              if (label.length > 0) {
                item.value = label[0].label
              }
              console.log('colType', item.colType)
            } else if (data1[i].bx_col_type === 'fk') {
              // console.log('data1[key1].option_list_v2', data1[key1].option_list_v2)
              let optionV2 = data1[i].option_list_v2
              if (data[data1[i].columns] !== null || data[data1[i].columns] !== '') {
                let cond = [{
                  'colName': optionV2.refed_col,
                  'ruleType': 'eq',
                  'value': data[data1[i].columns]
                }]

                let val = await self.selectOne(optionV2.serviceName, cond)
                if (val !== undefined) {
                  item.value = val[optionV2.key_disp_col]
                }
                console.log(val)
              }
            } else if (data1[i].bx_col_type === 'image' || data1[i].bx_col_type === 'filelist') {
              item.value = await self.getImageUrl(data[data1[i].columns])
            }
            if (self.list.length < self.colsData.length) {
              self.list.push(item)
            }
          }

          self.showLoading(false)
          continue
        }
      }
      // let CallbackGoHome = function (response) {
      //   if (response.data.data && response.data.data.length > 0) {

      //   }
      // }
      // let req = {
      //   serviceName: self.queryCfgs.serviceName,
      //   colNames: [
      //     '*'
      //   ],
      //   condition: [
      //     {
      //       colName: this.queryCfgs.key,
      //       value: this.queryCfgs.val,
      //       ruleType: 'eq'
      //     }
      //   ]
      // }
      // this.crosAjaxData(this.$api.select, 'post', req, CallbackGoHome)
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
    }
  },
  watch: {
    '$route': function (to, from) {
// 监听子组件上报
      this.$router.go(0)
    },
    'list': function (nv, ov) {
      if (nv.length > 0) {
        // console.log('nv', nv)
        // this.$refs.scroller.reset()
      }
    }
  },
  beforeRouteUpdate () {

  }
}
</script>
<style lang="less">
.child-detail-view{
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
        
        flex-direction: column;
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
            display: flex;
            flex-direction: column;
            img,p img{
              width: 100%;
              height: auto;
            }
            a{
              text-decoration: none;
              color:rgb(23, 153, 240);
              &:focus{
                color:rgb(21, 160, 253);
              }
            }
          }
        }
      }
    }
    
  }
}

</style>
