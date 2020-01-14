<template>
  <div :class="'tabItemView'">
   <div style="height:44px;">
  <sticky scroll-box="app" :offset="46" :check-sticky-support="false">
    <tab>
      <tab-item v-for="(item,index) in listData.tabs" :key="index" :selected="item.value === acted" @on-item-click="handler">{{item.label}}</tab-item>
    </tab>
  </sticky>
</div>
  
    
    <scroller :scrollbarY=false lock-x use-pullup use-pulldown 
    height="-90" 
    @on-pullup-loading="handler" 
    @on-pulldown-loading="refresh" 
    :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
    :pullup-config="{content:'上拉加载更多',downContent:'松开加载更多',upContent:'上拉加载更多',loadingContent:'加载中'}"
    v-model="status" ref="scroller">
      <div>
        <Group>
          <panel :list="listData.tabs[index].list" :type="itemData.type"></panel>
          <load-more v-show="listData.tabs[index].list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
        </Group>
        <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
            <span v-show="status.pullupStatus === 'default'"></span>
            <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
            <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, FormPreview, CellBox, Group, LoadMore, Scroller, Spinner, Panel } from 'vux'

export default {
  name: 'tabItemView',
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
    Group,
    LoadMore,
    Scroller,
    Spinner,
    Panel
  },
  props: ['itemData', 'tabFlex'],
  data () {
    return {
      acted: this.itemData.tabs[0].value,
      // tabs: this.itemData.tabs,
      serviceName: this.itemData.serviceName,
      index: 0,
      link: '/bxoa_issue_detail',
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      },
      listData: this.itemData,
      // list: this.itemData.list,
      // list: list(),
      rownumber: 10,
      pageNo: 1,
      total: 0,
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
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
            a['src'] = self.$api.downloadImg + item.list_img
            a['title'] = item.banner_title
            a['desc'] = item.remark
            a['url'] = '/detailplus/srvoa_news_columns_info_select/' + item.id
            return a
          })
          // let newItem = item.forEach((it, index) => {
          //   let b = {}
          //   item.src = self.getimgPaths(it.src)
          // })
          // item = self.getimgPaths(item)
          self.listData.tabs[index].list = item
          let val = self.listData.tabs[self.index]
          // for()
          if (pushList === false) {
            val.list = item
            val.len = val.list.length
            // console.log('更新完成：：：' + val.len)
            // self.getimgPaths(val.list, self.index)
          } else {
            // val.list = val.list.concat(item)
            val.list = val.list.length
            val.len = val.list.length
            // console.log('更新完成：：：' + val.len)
            // self.getimgPaths(val.list, self.index)
          }
          console.log('加载到：' + item)
          self.$vux.toast.show({
            type: 'text',
            text: '加载了' + resNum + '条',
            position: 'bottom',
            time: 300,
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
    loadData () {
      // 加载数据
      let self = this
      self.acted = this.listData.tabs[0].value
      // let DataType = this.listData.tabs.map((item) => { return item.label })
      // DataType.forEach((item, index) => {
      //   console.log('加载数据')
      // })
      let type = this.getTabsLabel(self.acted)
      self.getData(type, self.index, false)
    },
    loadMore () {
      // 加载更多
      let self = this
      let len = self.listData.tabs[self.index]
      setTimeout(() => {
        if (len.list.length >= self.total) {
          self.$vux.toast.show({
            text: '没有更多',
            type: 'text',
            time: 300,
            isShowMask: true
          })
          self.$refs.scroller.donePullup()
          self.status.pullupStatus = 'default'
        } else {
          self.pageNo += 1
          self.$refs.scroller.donePullup()
          self.$vux.toast.show({
            type: 'text',
            text: '加载中'
          })
          setTimeout(() => {
            let type = this.getTabsLabel(self.acted)
            this.getData(type, self.index)
            self.$refs.scroller.donePullup()
            self.status.pullupStatus = 'default'
          }, 10)
        }
      }, 300)
    },
    refresh () {
      // 刷新
      let self = this
      // console.log(label)
      setTimeout(() => {
        this.listData.tabs[this.index].list = []
        this.rownumber = 10
        this.pageNo = 1
        this.$nextTick(() => {
          setTimeout(() => {
            let type = this.getTabsLabel(this.acted)
            this.$refs.scroller.donePulldown(
              this.getData(type, self.index)
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 1000)
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
    }
    // 'itemData': {
    //   handler: function (val) {
    //     console.log('tabs更新了')
    //     this.loadData()
    //   },
    //   deep: true   // 是否深度监听
    // }
  }
}
</script>
<style lang="less">
.vux-no-group-title,.weui-cells{
  margin-top:0em;
}
.cell-box-body{
  display:flex;
  width:100%;
  padding-right:0.8em; 
  flex-direction: column;
  .cell-box-rows{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    span{
      color: #525252;
      font-size:0.8rem;
      padding: 0 0.4em;
    }
  }
  h1,h2,h3,h4,h5,h6{
    margin: 0.5em 0 0 0;
  }
  p{
    margin:  0.2em 0;
    color: #999
  }
}
</style>


