<template>
<div>
  <tab>
      <tab-item v-for="(item,index) in tabs" :key="index" :selected="item.value === 'procInfo'" @on-item-click="handler" :badgeLabel="item.len">{{ item.label }}</tab-item>
    </tab>
    <scroller lock-x scrollbarY  height="-142" >
      <div>
        <div v-if="activeValue ==='procInfo'">
            <form-preview  :show-vertical-dividers="true" class="xs-container" :header-label="detailHeader.label" :header-value="detailHeader.value" :body-items="detailList"></form-preview>
          
        </div>
        <div  v-if="activeValue ==='procRecord'">
          <timeline class="timeline-demo">
            <timeline-item v-for="(item,index) in chartData" :key="index" :class="(item.state ==='未开始' ?  'vux-timeline-item-undone' : (item.state==='正在处理' ? 'vux-timeline-item-processing' :  (item.state === '已处理' ? 'vux-timeline-item-completed' : 'vux-timeline-item-undone')))">
              <router-link tag="div" :to="{path:'/procRecordDetail',query:{proc_no:item.proc_no,step_no:item.step_no,id:item.id,proc_instance_no:proc_instance_no}}">
              <h4  :class="item.state === '正在处理' ? 'recent' : ''"> {{item.step_name}}</h4>
              <p  :class="item.state === '正在处理' ? 'recent' : ''">[{{item.state}}]</p>
              </router-link>
              <!-- <x-button mini type="primary">Go to</x-button> -->
            </timeline-item>
          </timeline>
          <Group>
            <cell-box style="margin-top:0;" border-intent v-for="item in recordList" :key="item.id" :link="{path:'/recordDetail',query:{proc_no:item.proc_no,step_no:item.step_no,id:item.id,proc_instance_no:item.proc_instance_no}}">
                <div class="cell-box-body" style="">
                  <h4>步骤名称：{{item.step_no_name}}</h4>
                  <p>处理结果：{{item.proc_result}}</p>
                  <div class="cell-box-rows"><span>数据状态：{{item.data_status}}</span><span>创建用户：{{item.create_user_disp}}</span></div>
                  <div class="cell-box-rows"><span>审核人：{{item.create_user}}</span><span>审核时间：{{item.create_time}}</span></div>
                </div>
            </cell-box>
          </Group>
        </div>
          <load-more v-show="recordList.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
      </div>
    </scroller>
    
      <div class="bottom-flex-proc" v-if="procBasic.proHanleData.authority" style="padding:5px 15px;">
        <x-button @click.native = "approval()" type="primary"> 审批</x-button>
      </div>
</div>
</template>
<script>
import { Timeline, TimelineItem, XButton, Tab, TabItem, FormPreview, Group, LoadMore, CellBox, Scroller, Flow, FlowState, FlowLine } from 'vux'
const list = () => [
  {
    label: '基本信息',
    value: 'procInfo'
  }, {
    label: '流程记录',
    value: 'procRecord'
  }
]
export default {
  name: 'taskList',
  components: {
    Timeline, TimelineItem, XButton, Tab, TabItem, FormPreview, Group, LoadMore, CellBox, Scroller, Flow, FlowState, FlowLine
  },
  data () {
    return {
      proc_instance_no: this.$route.query.proc_instance_no, // 流程实例编号
      proc_no: '', // 流程编号
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      },
      detailHeader: {
        label: '当前状态',
        value: ''
      },
      procBasic: {}, // vue 流程配置信息
      detailList: [],
      recordList: [],
      chartData: [],
      recordData: [],
      tabs: list(),
      activeValue: 'procInfo'

    }
  },
  created () {
    this.getProcBasic(this.$route.query.proc_instance_no)
  },
  mounted () {
    if (this.activeValue === 'procInfo') {
      this.getData()
    } else {
      this.getChart()
      this.getRecord()
    }
  },
  methods: {
    async getData () { // 流程详情
      let self = this
      let params = {
        'serviceName': 'srvprocess_record_select',
        'colNames': [
          '*'
        ],
        'condition': [
          {
            'colName': 'proc_instance_no',
            'value': self.proc_instance_no,
            'ruleType': 'eq'
          }
        ]
      }
      const response = await self.$http.post(this.$api.select, params)// 获取proc_no
      self.recordData = response.data.data
      if (self.recordData.length > 0) {
        self.proc_no = self.recordData[0].proc_no
        params = {
          'serviceName': 'srvprocess_defined_select',
          'colNames': [
            '*'
          ],
          'condition': [
            {
              'colName': 'proc_no',
              'value': self.proc_no,
              'ruleType': 'eq'
            }
          ]
        }
        const response1 = await self.$http.post(this.$api.select, params)// 获取bxprocess_defined 配置的service_name
        if (response1.data.data.length > 0) {
          let serviceName = response1.data.data[0].service_name
          params = {
            'serviceName': 'srvsys_service_select',
            'colNames': [
              '*'
            ],
            'condition': [
              {
                'colName': 'service_name',
                'value': serviceName,
                'ruleType': 'eq'
              }
            ]
          }
          const response2 = await self.$http.post(this.$api.select, params)// 获取service 的main_table
          if (response2.data.data.length > 0) {
            let mainTable = response2.data.data[0].main_table
            let service = mainTable.replace('bx', 'srv') + '_select'// 通过的main_table获取select的service
            params = {
              serviceName: service,
              queryMethod: 'selectOne',
              colNames: [
                '*'
              ],
              condition: [
                {
                  colName: 'proc_instance_no',
                  value: self.proc_instance_no,
                  ruleType: 'eq'
                }
              ]
            }
            const response3 = await self.$http.post(this.$api.select, params)// 获取对应service 的数据
            params = {
              serviceName: 'srvsys_service_columns_select',
              colNames: [
                'columns',
                'label'
              ],
              condition: [
                {
                  'colName': 'service_name',
                  'value': service,
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
            const response4 = await self.$http.post(this.$api.select, params)// 获取对应service 的column和label
            if (response3.data.data.length > 0 && response4.data.data.length) {
              let data = response3.data.data[0]
              let data1 = response4.data.data
              for (let key in data) {
                for (let key1 in data1) {
                  if (key === data1[key1].columns) {
                    if (key === 'proc_status') {
                      self.detailHeader.label = data1[key1].label
                      self.detailHeader.value = data[key]
                    } else {
                      self.detailList.push({
                        label: data1[key1].label,
                        value: data[key]
                      })
                    }
                    continue
                  }
                }
              }
              console.log(self.detailList)
            }
          }
        }
      }
    },
    getProcBasic (pin) {
      // 查询流程配置信息 mainData | proCharData | proHanleData | proc_basic | serivce_name
      let self = this
      let CallbackGo = function (response) {
        if (response.data !== '') {
          let sData = response.data
          self.procBasic = sData
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = 'srvprocess_basic_cfg_select'
      req.colNames = ['*']
      req.condition = [{
        'colName': 'proc_instance_no',
        'ruleType': 'eq',
        'value': self.proc_instance_no
      }]
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    getChart () { // 流程图
      let self = this
      let CallbackGo = function (response) {
        if (response.data.data !== '') {
          let sData = response.data.data
          self.chartData = sData
        }
      }
      let req = this.selectRequestObjs()
      req.serviceName = 'srvprocess_chart_select'
      req.colNames = ['*']
      req.condition = [{
        'colName': 'proc_instance_no',
        'ruleType': 'eq',
        'value': self.proc_instance_no
      }]
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    getRecord () { // 流程记录
      let self = this
      let CallbackGo = function (response) {
        if (response.data.data !== '') {
          self.recordList = response.data.data
        }
      }
      let req = {
        serviceName: 'srvprocess_record_select',
        colNames: [
          '*'
        ],
        condition: [
          {
            'colName': 'proc_instance_no',
            'value': self.proc_instance_no,
            'ruleType': 'eq'
          }
        ],
        order: [
          {
            'colName': 'id',
            'orderType': 'asc'
          }
        ]
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    approval () {

    },
    handler (index) {
      let tabsValue = list()
      let value = tabsValue[index].value
      console.log(value)
      this.index = index
      this.activeValue = value
      if (value === 'procInfo') {
        this.getData()
      } else {
        this.getChart()
        this.getRecord()
      }
    }
  }
}
</script>
<style lang="less">
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
// :class="item.state ==='未开始' ?  'vux-timeline-item-undone' : 'item.state==='正在处理' ? 'vux-timeline-item-processing' :  'item.state === '已处理' ? 'vux-timeline-item-completed' : 'vux-timeline-item-undone'"
.timeline-demo {
  .vux-timeline-item-completed{
    .vux-timeline-item-head-first {
        // width: 20px;
        // height: 20px;
        // left: -4px;
        // top: 5px;
        width: 10px;
        height: 10px;
        left: 1px;
        top: 4px;
    }
    .vux-timeline-item-color {
        background-color: #04BE02;
        i.vux-timeline-item-checked {
          display: none
        }
    }
    .vux-timeline-item-tail{
      position: absolute;
        content: '';
        height: 100%;
        width: 2px;
        left: 5px;
        top: 5px;
        background-color: #04BE02;
    }
  }
  .vux-timeline-item-processing{
      .vux-timeline-item-head, .vux-timeline-item-head-first {
          position: absolute;
          content: '';
          z-index: 99;
          border-radius: 99px;
      }
    .vux-timeline-item-head,.vux-timeline-item-head-first {
        width: 20px;
        height: 20px;
        left: -4px;
        top: 5px;
    }
    .vux-timeline-item-color {
        background-color: #04BE02;
        i.vux-timeline-item-checked {
          display: none
        }
    }
    .vux-timeline-item-tail{
      position: absolute;
        content: '';
        height: 100%;
        width: 2px;
        left: 5px;
        top: 5px;
        background-color: rgb(131, 131, 131);
    }
  }
  .vux-timeline-item-undone{
    .vux-timeline-item-color {
        background-color: rgb(131, 131, 131);
        i.vux-timeline-item-checked {
          display: none
        }
    }
    .vux-timeline-item-tail{
      position: absolute;
        content: '';
        height: 100%;
        width: 2px;
        left: 5px;
        top: 5px;
        background-color: rgb(131, 131, 131);
    }
  }
	p {
		color: #888;
		font-size: 0.8rem;
	}
	h4 {
		color: #666;
		font-weight: normal;
	}
	.recent {
    font-weight: 600;
		color: rgb(212, 115, 3)
  }
  h4.recent{
    font-weight: 600;
		color: #666
  }
  .vux-timeline-item-checked.weui-icon-success-no-circle::before {
      font-size: 14px;
      position: absolute;
      left: 3px;
      top: 3px;
      margin: 0!important;
      color: #FFF;
  }
}
.bottom-flex-proc{
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background: -webkit-linear-gradient(bottom, #eff3f5 , transparent); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(top, #eff3f5, transparent); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(top, #eff3f5, transparent); /* Firefox 3.6 - 15 */
    background: linear-gradient(to top, #eff3f5 , transparent); /* 标准的语法（必须放在最后） */
}
</style>


