<template>
  <div>
    <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
      <x-icon  type="ios-plus-empty" ></x-icon>
      <panel :show-vertical-dividers="true" class="xs-container":header="header" :footer="footer" :list="list" :type="type" >
      </panel>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
  </div>
</template>
<script>
import { Panel, Group, Radio, Scroller, Divider, Spinner, Cell } from 'vux'
import { mapGetters } from 'vuex'
export default {
  components: {
    Panel,
    Group,
    Radio,
    Scroller,
    Divider,
    Spinner,
    Cell
  },
  computed: mapGetters([
    'headrBar'
  ]),
  data () {
    return {
      type: '4',
      list: [],
      footer: {
        title: '结尾',
        url: 'http://vux.li'
      },
      header: '表头',
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
  created: function () {
    // 获取数据，
    this.getListData()
  },
  methods: {
    getListData () {
      let self = this
      let headrlist = [
        {
          type: 'add',
          url: '/bxsys_email_templ/add'
        }
      ]
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: headrlist
      })
      let CallbackGoHome = function (response) {
        if (response.data.data !== '') {
          self.total = response.data.page.total
          let resNum = response.data.data.length
          for (var i = 0; i < response.data.data.length; i++) {
            let map = {}
            map.title = response.data.data[i].template_name
            map.desc = response.data.data[i].template_subject
            map.url = {
              path: '/bxsys_email_templ/deatil/' + response.data.data[i].id,
              replace: false
            }
            map.meta = {
              source: response.data.data[i].template_name,
              date: response.data.data[i].create_time,
              other: response.data.data[i].template_no
            }
            self.list.push(map)
          }
          self.$vux.toast.show({
            type: 'text',
            text: '加载了' + resNum + '条'
          })
        }
      }
      let req = {
        serviceName: 'srvsys_email_template_select',
        colNames: [
          'id',
          'template_no',
          'template_name',
          'template_subject',
          'template_content',
          'create_time',
          'biz_col',
          'biz_expand_col',
          'create_user',
          'modify_time',
          'modify_user',
          'create_user_disp',
          'modify_user_disp'
        ],
        page: {
          'pageNo': self.pageNo,
          'rownumber': self.rownumber
        },
        condition: [],
        order: [
          {
            'colName': 'create_time',
            'orderType': 'desc'
          }
        ]
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGoHome)
    },
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
            self.getListData()
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
              this.getListData()
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    },
    // 新增
    add () {
      this.$router.push({ name: 'bxsys_email_templ_add', params: {} })
    }
  }
}
</script>
<style>
.vux-x-icon {
  fill: #F70968;
}
.cell-x-icon {
  display: block;
  fill: green;
}
</style>