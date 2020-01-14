<template>
  <div>
    <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0"  ref="scroller" @on-pulldown-loading="refresh">
      <div class="detail-call">
        <div class="detail-call-item flex-col">
          <div class="detail-call-value" v-html="data"></div>
          <span v-if="data.length === 0">暂无信息</span>
        </div>
      </div>
      <!-- <form-preview  :show-vertical-dividers="true" class="xs-container" :header-label="header.label" :header-value="header.value" :body-items="list"></form-preview> -->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
  </div>
</template>
<script>
import { FormPreview, Scroller, Divider, Spinner, Cell, CellBox, CellFormPreview, Group, Badge } from 'vux'
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
    Badge
  },
  data () {
    return {
      list: [],
    //   serviceName: this.$route.query.serviceName,
    //   id: this.$route.query.ctxid,
    //   column: this.$route.query.column,
      sn: this.$route.query.sn,
      val: this.$route.query.val,
      col: this.$route.query.col,
      key: this.$route.query.key,
      isContent: false,
      data: '',
    //   header: {
    //     label: '详情',
    //     value: '¥2400.00',
    //     colType: ''
    //   },
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      }
    }
  },
  created: function () {
    // 获取数据，

    this.$store.commit('hideLeftBack')
    console.log('query:' + this.$route.query.sn, this.$route.query.val, this.$route.query.col, this.$route.query.key)
    if (this.$route.query.sn && this.$route.query.val && this.$route.query.col && this.$route.query.key) {
      this.isContent = true
      this.getData()
    } else {
      console.log('请检查参数是否正确')
      this.isContent = false
    }
  },
  methods: {
    getData () {
      let self = this
    //   let flag = true
      let column = this.$route.query.col
      let CallbackGoHome = function (response) {
        if (response.data.data.length > 0) {
          console.log(response.data.data)
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
  padding: 6px;
  .detail-call-item{
    padding: 0.3rem 0;
    line-height: 1.2rem;
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
      }
      p{
        // padding: 4px;
        line-height: 1.2;
      }
    }
  }
  
}
</style>
