<template>
  <div class="logs">
    <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
      <panel :show-vertical-dividers="true" class="xs-container" :footer="footer" :list="list" type="5" @on-img-error="onImgError"></panel>
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
    <!-- <scroller lock-x scrollbar-y  class="xs-container" ref="scroller"></scroller> -->
  </div>
</template>

<i18n>
Switch the type:
  zh-CN: 切换样式
List of content with image:
  zh-CN: 图文组合列表
More:
  zh-CN: 查看更多
</i18n>
<script>
import { Panel, Group, Radio, Scroller, Divider, Spinner } from 'vux'

export default {
  name: 'logs',
  components: {
    Panel,
    Group,
    Radio,
    Scroller,
    Divider,
    Spinner
  },
  methods: {
    loadMore () {
      let self = this
      setTimeout(() => {
        self.pageNo += 1
        if (self.list.length >= self.total) {
          self.$vux.toast.show({
            text: '没有更多了',
            type: 'text',
            time: 2000,
            isShowMask: true
          })
        } else {
          self.$refs.scroller.donePullup()
          self.$vux.toast.show({
            type: 'text',
            text: '加载中'
          })
          setTimeout(() => {
            self.getData()
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
              this.getData()
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    },
    onImgError (item, $event) {
      console.log(item, $event)
    },
    getData () {
      let self = this
      let CallbackGo = function (response) {
        if (response.data.data !== '') {
          let sData = response.data.data
          let resNum = response.data.data.length
          self.total = response.data.page.total
          let item = sData.map(function (item) {
            let a = {}
            // a['title'] = item.service_name
            a['desc'] = item.description
            a['title'] = item.service_name
            a['id'] = item.id
            a['meta'] = {
              source: item.operate_result,
              date: item.create_time,
              other: item.request_type
            }
            return a
          })
          self.list = self.list.concat(item)
          self.$vux.toast.show({
            type: 'text',
            text: '加载了' + resNum + '条'
          })
        }
      }
      let req = this.selectRequestObjs() // 请求参数初始化
      req.serviceName = 'srvsys_operate_log_select'
      req.colNames = ['id', 'operate_result', 'service_name', 'description', 'request_type', 'create_user', 'create_time']
      req.condition = []
      req.order[0].colName = 'create_time'
      req.order[0].orderType = 'desc'
      req['page'] = {
        'pageNo': this.pageNo,
        'rownumber': this.rownumber
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    }
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      list: [],
      footer: {
        title: 'more',
        url: 'http://vux.li'
      },
      rownumber: 10,
      pageNo: 1,
      total: 0,
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.weui-panel{
  overflow: hidden;
}
.weui-media-box {
  padding: 15px 0px;
}
</style>
