<template>
  <div>
    <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0"  ref="scroller" @on-pulldown-loading="refresh">
      <form-preview  :show-vertical-dividers="true" class="xs-container" :header-label="header.label" :header-value="header.value" :body-items="list"></form-preview>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
  </div>
</template>
<script>
import { FormPreview, Scroller, Divider, Spinner } from 'vux'
export default {
  components: {
    FormPreview,
    Scroller,
    Divider,
    Spinner
  },
  data () {
    return {
      list: [],
      header: {
        label: '详情',
        value: '¥2400.00'
      },
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      serviceName: this.$route.params.serviceName
    }
  },
  created: function () {
    // 获取数据，
    this.getData()
  },
  methods: {
    getData () {
      let id = this.$route.params.id
      let self = this
      let flag = true
      let CallbackGoHome = function (response) {
        if (response.data.data.length > 0) {
          let data = response.data.data[0]
          let CallbackGoHome1 = function (response) {
            if (response.data.data !== '') {
              let data1 = response.data.data
              for (let key in data) {
                for (let key1 in data1) {
                  if (key === data1[key1].columns) {
                    if (flag) {
                      self.header.label = data1[key1].label
                      self.header.value = data[key]
                      flag = false
                    } else {
                      self.list.push({
                        label: data1[key1].label,
                        value: data[key]
                      })
                    }
                    // if (key1 === '0') {
                    //   self.header.label = data1[key1].label
                    //   self.header.value = data[key]
                    // } else {
                    //   self.list.push({
                    //     label: data1[key1].label,
                    //     value: data[key]
                    //   })
                    // }
                    continue
                  }
                }
              }
            }
          }
          let req1 = {
            serviceName: 'srvsys_service_columns_select',
            colNames: [
              'columns',
              'label'
            ],
            condition: [
              {
                'colName': 'service_name',
                'value': self.serviceName,
                'ruleType': 'eq'
              },
              {
                'colName': 'in_detail',
                'value': '1',
                'ruleType': 'eq'
              }
            ],
            order: [
              {
                'colName': 'seq',
                'orderType': 'asc'
              }
            ]
          }
          self.crosAjaxData(self.$api.select, 'post', req1, CallbackGoHome1)
        }
      }
      let req = {
        serviceName: self.serviceName,
        colNames: [
          '*'
        ],
        condition: [
          {
            colName: 'id',
            value: id,
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