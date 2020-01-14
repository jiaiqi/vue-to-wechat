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
      proc_no: this.$route.query.proc_no,
      step_no: this.$route.query.step_no,
      id: this.$route.query.id,
      proc_instance_no: this.$route.query.proc_instance_no, // 流程实例编号
      header: {
        label: '详情',
        value: '详情'
      },
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      }
    }
  },
  created: function () {
    if (this.proc_no == null) { // 如果没有proc_no说明是从流程图过来的需要先获取proc_no，
      this.getProcNo()
    } else {
      this.getData()
    }
  },
  methods: {
    getProcNo () {
      let self = this
      let CallbackGoHome = function (response) {
        if (response.data.data.length > 0) {
          self.proc_no = response.data.data[0].proc_no
          self.id = response.data.data[0].id
          self.getData()
        }
      }
      let params = {
        'serviceName': 'srvprocess_record_select',
        queryMethod: 'selectOne',
        'colNames': [
          '*'
        ],
        'condition': [
          {
            'colName': 'proc_instance_no',
            'value': self.proc_instance_no,
            'ruleType': 'eq'
          },
          {
            'colName': 'step_no',
            'value': self.step_no,
            'ruleType': 'eq'
          }
        ],
        order: [
          {
            'colName': 'create_time',
            'orderType': 'desc'
          }
        ]
      }
      self.crosAjaxData(self.$api.select, 'post', params, CallbackGoHome)
    },
    getData () {
      let self = this
      let CallbackGoHome = function (response) {
        let map = {}
        if (response.data.data.length > 0 && response.data.data[0].biz_select_service != null) { // 如果流程引擎表中有service则获取该service否则只获取最简单procress_record表中简单的数据
          map = {
            'colName': 'proc_instance_no',
            'value': self.proc_instance_no,
            'ruleType': 'eq'
          }
          self.getRecordDetail(response.data.data[0].biz_select_service, map)
        } else {
          map = {
            'colName': 'id',
            'value': self.id,
            'ruleType': 'eq'
          }
          self.getRecordDetail('srvprocess_record_select', map)
        }
      }
      let params = {
        'serviceName': 'srvprocess_engine_select',
        'colNames': [
          '*'
        ],
        'condition': [
          {
            'colName': 'proc_no',
            'value': self.proc_no,
            'ruleType': 'eq'
          },
          {
            'colName': 'step_no',
            'value': self.step_no,
            'ruleType': 'eq'
          }
        ]
      }
      self.crosAjaxData(this.$api.select, 'post', params, CallbackGoHome)
    },
    getRecordDetail (serviceName, map) {
      let self = this
      let flag = true
      let CallbackGoHome = function (response) {
        if (response.data.data.length > 0) {
          let data = response.data.data[0]
          if (map.colName === 'id') { // 如果显示的是procress_record的数字则只显示 proc_result,create_user,create_time,remark,file_no字段
            self.header.label = '意见'
            self.header.value = data.proc_result
            self.list.push(
              {
                label: '处理人',
                value: data.create_user
              },
              {
                label: '处理时间',
                value: data.create_time
              },
              {
                label: '说明',
                value: data.remark
              },
              {
                label: '附件',
                value: data.file_no
              }
            )
          } else {
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
                  'value': serviceName,
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
      }
      let req = {
        serviceName: serviceName,
        colNames: [
          '*'
        ],
        condition: [
          map
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