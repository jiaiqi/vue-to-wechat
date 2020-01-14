<template>
<div class="proc-detail">
    <tab>
      <tab-item v-for="(item,index) in tabs" :key="index" :selected="item.value === 'procInfo'" @on-item-click="handler" :badgeLabel="item.len">{{ item.label }}</tab-item>
    </tab>
      <div>
        <div v-if="activeValue ==='procInfo'" style="margin-bottom:60px;" >
            <!-- <form-preview  :show-vertical-dividers="true" class="xs-container" :header-label="detailHeader.label" :header-value="detailHeader.value" :body-items="detailList"></form-preview> -->
              <xChildDetailPopup v-if="childDetailCfg !== null" :queryCfgs="childDetailCfg"></xChildDetailPopup>
          
        </div>
        
        <div  v-if="activeValue ==='procRecord'">
          <scroller lock-x scrollbarY  height="-142" >
                <div>
                  <timeline class="timeline-demo">
                    <timeline-item v-for="(item,index) in chartData" :key="index" :class="(item.state ==='未开始' ?  'vux-timeline-item-undone' : (item.state==='正在处理' ? 'vux-timeline-item-processing' :  (item.state === '已处理' ? 'vux-timeline-item-completed' : 'vux-timeline-item-undone')))">
                      <router-link tag="div" :to="{path:'/procRecordDetail',query:{proc_no:item.proc_no,step_no:item.step_no,id:item.id,proc_instance_no:proc_instance_no}}">
                      <h4  :class="item.state === '正在处理' ? 'recent' : ''"> {{item.step_name}}</h4>
                      <p  :class="item.state === '正在处理' ? 'recent' : ''">[{{item.state}}]</p>
                      </router-link>
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
          </scroller>
        </div>
          <!-- <load-more v-show="recordList.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more> -->
      </div>
    <tabbar>
      <tabbar-item>
        <!-- <div style="height:59px;line-height:59px;padding:0 0.4rem;">
          <span>Wechat</span>
        </div> -->
        <div slot="label" style="color:#0476f8;text-align:left;" class="proc-info">
          <p style="line-height:1.5rem;color:#2196F3"><span style="font-size:0.8rem;color:#999;">当前步骤:</span>{{procBasic.proHanleData.step_name}}[{{procBasic.proHanleData.state}}]</p>
          <p  style="line-height:1.2rem;color:#333;font-size:0.8rem"><span style="font-size:0.8rem;color:#999;">审批人:</span>{{procBasic.proHanleData._approval_user}}</p>
          </div>
      </tabbar-item>
      <x-button v-show="procBasic.proHanleData.step_no !== '2018_02_01'" :gradients="['#19D5FD','#1D62F0']" v-if="procBasic.proHanleData.authority && procBasic.mainData.proc_status !== '待重新提交' && procBasic.mainData.proc_status !== '待提交'" @click.native="showProcApproval = true" mini style="float:right" type="primary"> 审批</x-button>
      <x-button :gradients="['#19D5FD','#1D62F0']" v-if="procBasic.proHanleData.authority && (procBasic.mainData.proc_status === '待重新提交' || procBasic.mainData.proc_status === '待提交')" @click.native="updateStartProc" mini style="float:right" type="primary">重新提交</x-button>
    </tabbar>
    <div v-transfer-dom>
      <popup v-model="showProcApproval" position="bottom" :hide-on-blur=false @on-show="getProcStepForm(proc_instance_no)">
        <group style="min-height:60vh;" gutter="0">
          <cell title="意见:"></cell>
          <div style="padding:10px;">
            <checker v-model="approvalVal.proc_result" default-item-class="demo4-item" type="radio" :radioRequired=true selected-item-class="demo4-item-selected">
              <checker-item @on-item-click="onApproval"  v-for="(item,index) in procBasic.proHanleData.approval_options" :key="index" :value="item.value">{{item.disp}}</checker-item>
            </checker>
          </div>
          <cell v-show="approvalVal.proc_result ==='return'" title="退回步骤:"></cell>
          <div  v-show="approvalVal.proc_result ==='return'"  style="padding:10px;">
            <checker v-model="approvalVal.step_no" default-item-class="demo4-item" type="radio" :radioRequired=true selected-item-class="demo4-item-selected">
              <checker-item  v-for="(item,index) in procBasic.proHanleData.return_options" :key="index" :value="item.value">{{item.disp}}</checker-item>
            </checker>
          </div>
          
          <cell v-show="approvalVal.proc_result ==='turn'" title="转派人员:" :value="userList.userSelected.user_disp === '' ? '未选择':userList.userSelected.user_disp" is-link @click.native="showUserList=true"></cell>
          <x-textarea title="说明:" :max="200" placeholder="请输入说明" :show-counter="true" v-model="approvalVal.remark" :height="100" :rows="8" :cols="10" value=""></x-textarea>
          
          <div class="form-view-item" v-if="stepForm.length>0 && approvalVal.proc_result === 'pass'">
            <group label-min-width="4.5em" 
            v-if="stepForm.length>0" 
            label-margin-right="1em"
            v-for="(data,index) in stepForm" :key="index">
              <x-input 
                v-if ="data.updatable ===0  && data.in_update !== 2" 
                :title="data.label" 
                v-model="data.column"
                disabled>
              </x-input>
              <x-number 
                v-else-if ="data.col_type ==='Integer' || data.col_type ==='int'  && data.in_update !== 2" 
                :title="data.label" 
                :min="0" 
                :max="100"
                v-model="data.column" 
                placeholder="请输入" fillable>
              </x-number>
              <x-textarea 
                autosize 
                show-counter 
                v-else-if = "data.col_type ==='Note' ||data.col_type ==='MultilineText'" 
                :title="data.label" 
                v-model="data.column" 
                placeholder="请输入内容">
              </x-textarea >
            </group>
          </div>
        <!-- <reviewUpdateForm v-for="(item,index) in stepForm" 
        :key="index" v-if="stepForm.length > 0" 
        :pathQuery="item.bizCfgData" 
        :pageType="item.pageType" ref="reviewUpdate"></reviewUpdateForm> -->
        </group>
        <div style="padding: 15px;">
          <flexbox>
            <flexbox-item>
              <x-button @click.native="showProcApproval = false" type="warn"> 取消 </x-button>
            </flexbox-item>
            <flexbox-item>
               <x-button @click.native="approval" type="primary"> 提交审批 </x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </popup>
       <popup v-model="showUserList" class="checker-popup" position="right" @on-show="getUserList" width="65%">
        <div style="padding:10px 10px 40px 10px;">
          <p style="padding: 5px 5px 5px 2px;color:#888;">人员列表</p>
          <search
            @result-click="resultClick"
            @on-change="getUserList"
            v-model="userList.search"
            position="absolute"
            auto-scroll-to-top
            :auto-fixed=false
            top="46px"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            ref="search"></search>
          <checker
          v-model="userList.userSelected.user_no"
          default-item-class="demo5-item"
          selected-item-class="demo4-item-selected"
          type="radio" 
          :radioRequired=true>
            <checker-item v-for="(item,index) in userList.data" :key="index" :value="item.user_no" @on-item-click="onItemClick"> {{item.user_disp}} </checker-item>
          </checker>
        </div>
      </popup>
      <popup v-model="showChildDetail" position="bottom"  is-transparent >
        <div style="padding:6px;">

        <popup-header
        :right-text="'关闭'"
        :show-bottom-border="false"
        @on-click-right="showChildDetail = false"></popup-header>
        <xChildDetailPopup v-if="JSON.stringify(childItemCfg) !== {} && showChildDetail" :queryCfgs="childItemCfg"></xChildDetailPopup>
        </div>
      </popup>
    </div>
    <!-- <router-view></router-view> -->
</div>
</template>
<script>
import xChildDetailPopup from '@/components/detail.vue'
import reviewUpdateForm from '@/components/form.vue'
import Emitter from '../../assets/js/mixins/emitter.js'
import imagesLoaded from 'vue-images-loaded' // 图片加载辅助
import { Timeline, TimelineItem, XButton, Tab, TabItem, FormPreview, Popup, PopupHeader, LoadMore, CellBox, Scroller, Flow, FlowState, FlowLine, TransferDom, Flexbox, FlexboxItem, Checker, CheckerItem, Cell, Search, Sticky, Tabbar, TabbarItem, XInput, Group, XTextarea, XNumber } from 'vux'
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
  name: 'XProcDetail',
  mixins: [Emitter],
  directives: {
    TransferDom, imagesLoaded
  },
  components: {
    Timeline, TimelineItem, XButton, Tab, TabItem, FormPreview, Popup, PopupHeader, LoadMore, CellBox, Scroller, Flow, FlowState, FlowLine, Flexbox, FlexboxItem, Checker, CheckerItem, Cell, Search, xChildDetailPopup, Sticky, Tabbar, TabbarItem, reviewUpdateForm, XInput, Group, XTextarea, XNumber
  },
  data () {
    return {
      stepForm: [],
      proc_instance_no: this.$route.params.proc_instance_no, // 流程实例编号
      proc_no: '', // 流程编号
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      },
      childDetailCfg: null,
      detailHeader: {
        label: '当前状态',
        value: ''
      },
      procBasic: {proHanleData: {authority: false}}, // vue 流程配置信息
      detailList: [],
      recordList: [],
      chartData: [],
      recordData: [],
      tabs: list(),
      activeValue: 'procInfo',
      showProcApproval: false,
      approvalVal: {
        proc_result: '',
        remark: '',
        turn_user_no: '',
        step_no: ''
      },
      showUserList: false,
      userList: {
        search: '',
        data: [],
        userSelected: {
          user_disp: '',
          user_no: ''
        }
      },
      showChildDetail: false,
      childItemCfg: {}
    }
  },
  created () {
    let self = this
    self.$on('to-child-detail', (e) => {
      console.log('to-child-detail', e)
      self.toChildDetail(e)
    })
    self.$on('mounted-ok', (e) => {
      console.log('mounted-ok', e)
      if (e === 'ok') {
        // self.$refs.scrollerinfo.reset()
      }
      // this.toChildDetail(e)
    })
    self.$on('refreshProc', (e) => {
      if (e) {
        self.getProcBasic(self.$route.params.proc_instance_no)
      }
    })
    self.getProcBasic(self.$route.params.proc_instance_no)
  },
  mounted () {
    if (this.activeValue === 'procInfo') {
      // this.getData()
    } else {
      this.getChart()
      this.getRecord()
    }
  },
  methods: {
    async updateStartProc () {
      let self = this
      let params = []
      this.$vux.confirm.show({
        title: '操作提示',
        content: '确定要重新提交？',
        // 组件除show外的属性
        onCancel () {
          console.log(this) // 非当前 vm
          // console.log(_this) // 当前 vm
        },
        async onConfirm () {
          const responsec = await self.getColData(self.procBasic.proc_basic.select_service, 'update', 'update')
          let cols = responsec.srv_cols
          cols = cols.filter(item => item.in_update === 1)
          let data = {}
          cols = cols.map((item) => {
            data[item.columns] = ''
            return item
          })

          console.log('responsec', responsec, cols, data)
          let cond = [{
            'colName': 'proc_instance_no',
            'ruleType': 'eq',
            'value': self.proc_instance_no
          }]
          const responsea = await self.selectOne(self.procBasic.proc_basic.select_service, cond)
          if (responsea !== '') {
            console.log('responsea.data', responsea)
          }
          let keys = Object.keys(data)
            // eslint-disable-next-line
            for (let x in keys) {

              data[keys[x]] = responsea[keys[x]]
              // console.log('data', x, keys)
            }
          console.log('data', data)
          let reqs = {
            'serviceName': self.procBasic.proc_basic.update_service,
            'condition': [{
              'colName': 'proc_instance_no',
              'ruleType': 'eq',
              'value': self.proc_instance_no
            }],
            'proc_instance_no': self.proc_instance_no,
            'data': []
          }
          reqs.data.push(data)
          params.push(reqs)
          const responseb = await self.$http.post(self.$api.startProc, params)
          if (responseb.data.resultCode === 'SUCCESS') {
            self.$vux.toast.show({
              text: responseb.data.resultMessage,
                // type: 'warn',
              isShowMask: true
            })
            self.broadcast('xChildDetail', 'refresh', true)
            self.getProcBasic()
            self.getData()
          } else {
            self.$vux.toast.show({
              text: responseb.data.resultMessage,
                // type: 'warn',
              isShowMask: true
            })
          }
        }
      })
    },
    toChildDetail (q) {
      this.childItemCfg = q
      this.showChildDetail = true
    },
    toUpdate () {
      this.$router.push({path: '/update', query: {serviceName: this.procBasic.proc_basic.update_service, key: 'proc_instance_no', value: this.$route.params.proc_instance_no, srvType: 'update', pageType: 'add', proc_instance_no: this.$route.params.proc_instance_no}})
    },
    onCancel () {

    },
    onFocus () {

    },
    resultClick () {

    },
    onApproval (value, disabled) {
      let self = this
      console.log(value)
      if (!this.disabled) {
        if (value === 'return') {
          let step = self.procBasic.proHanleData.return_options
          if (step.length === 1) { self.approvalVal.step_no = step[0].value }
          console.log('step', step)
        } else if (value !== 'turn') {
          this.approvalVal.turn_user_no = ''
        } else if (value !== 'return') {
          this.approvalVal.step_no = ''
        }
      }
    },
    onItemClick (value, disabled) {
      // 人员选择
      console.log(value, disabled)
      if (!this.disabled) {
        this.showUserList = false
        let obj = this.userList.data
        let turnUser = obj.filter(item => item.user_no === value)
        this.userList.userSelected = turnUser[0]
        this.approvalVal.turn_user_no = turnUser[0].user_no
        // console.log(turnUser)
      }
    },
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
      console.log('response.data.data', response.data.data)
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
              console.log('showLoading', self.detailList)
            }
          }
        }
      }
    },
    getUserList (pin) {
      // 查询流程配置信息 mainData | proCharData | proHanleData | proc_basic | serivce_name
      let self = this
      let CallbackGo = function (response) {
        if (response.data !== '') {
          let sData = response.data.data
          self.userList.data = sData
        }
      }
      let req = {}
      req.serviceName = 'srvsys_user_select'
      req.colNames = ['user_no', 'user_disp']
      req.condition = [{
        'colName': 'user_disp',
        'ruleType': 'like',
        'value': self.userList.search
      }]
      req.page = {
        pageNo: 1,
        rowNumber: 50
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    getProcBasic (pin) {
      // 查询流程配置信息 mainData | proCharData | proHanleData | proc_basic | serivce_name
      let self = this
      let CallbackGo = function (response) {
        if (response.data !== '') {
          let sData = response.data
          self.procBasic = sData
          self.childDetailCfg = {
            serviceName: sData.proc_basic.select_service,
            key: 'proc_instance_no',
            val: self.proc_instance_no,
            pageType: 'procDetail'
          }
          console.log('self.childDetailCfg', self.childDetailCfg)
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
    async getProcStepForm (procNo) {
      // let pN = procNo
      let charts = this.deepClone(this.procBasic.proCharData)
      charts = charts.filter((item) => item.authority === true && item.step_no === '2018_04')
      charts = charts[0].biz_cfg_data
      charts = charts.filter((item) => item.type === 'form' && item.update_service === 'srvvx_task_review_update')
      let chartsCol = []
      let oldData
      for (let i = 0; i < charts.length; i++) {
        let cs = await this.getColData(charts[i].type === 'form' && charts[i]._type_form === 'update' ? charts[i].select_service : charts[i].select_service, charts[i]._type_form, charts[i]._type_form)
        let cons = []
        let cond = {
          'colName': 'proc_instance_no',
          'value': charts[i].proc_instance_no,
          'ruleType': 'eq'
        }
        cons.push(cond)
        oldData = await this.selectOne(charts[i].select_service, cons)
        let colLen = cs.srv_cols
        let keys = Object.keys(oldData)
        for (let j = 0; j < colLen.length; j++) {
          for (let n = 0; n < keys.length; n++) {
            if (colLen[j].columns === keys[n]) {
              if (oldData[keys[n]] !== null && oldData[keys[n]] !== undefined) {
                colLen[j].column = oldData[keys[n]]
              } else {
                if (colLen[j].columns === 'completion_degree') {
                  colLen[j].column = 0
                } else {
                  // colLen[j].column = ''
                }
              }
            }
          }
        }

        this.stepForm = colLen
      }
      // this.stepForm = chartsCol

      console.log('charts', charts, chartsCol, oldData)
    },
    getChart () { // 流程图
      let self = this
      let CallbackGo = function (response) {
        if (response.data.data !== '') {
          let sData = response.data.data
          self.chartData = sData
          self.getProcStepForm(self.proc_instance_no)
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
      // 提交审批
      let self = this
      let CallbackGo = function (response) {
        if (response.data.state === 'SUCCESS') {
          self.showProcApproval = false
          self.broadcast('xChildDetail', 'refresh', true)
          self.getProcBasic()
          self.getData()
          self.$vux.toast.show({
            type: 'text',
            text: response.data.resultMessage
          })
          self.handler()
          self.approvalVal = {
            proc_result: '',
            remark: '',
            turn_user_no: '',
            step_no: ''
          }
          console.log(response.data.data, response.data)
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.data.resultMessage
          })
        }
      }
      let reqs = []
      let req = {
        proc_instance_no: this.$route.params.proc_instance_no,
        step_no: this.procBasic.proHanleData.step_no,
        data: []
      }
      let obj = self.approvalVal
      // eslint-disable-next-line
      // obj = obj.filter(item => item.value !=='')

      let a
      for (a in obj) {
        // eslint-disable-next-line
        if (obj[a] === '') {
          // eslint-disable-next-line
          delete obj[a]
        }
      }
      let len = Object.keys(obj)
      if (len.length > 0) {
        req.data.push(obj)
        if (self.approvalVal.proc_result === 'pass' && self.stepForm.length > 0) {
          let childDataList = []
          let d = {
            'serviceName': 'srvvx_task_review_update',
            'condition': []
          }
          let data = self.stepForm
          let ds = {}
          for (let p = 0; p < data.length; p++) {
            if (data[p].column !== null && data[p].column !== undefined) {
              ds[data[p].columns] = data[p].column
            }
          }
          let c = {
            'colName': 'id',
            'ruleType': 'in',
            'value': ds.id
          }
          let cdata = this.deepClone(ds)
          delete cdata.id
          if (self.procBasic.proHanleData.authority === true) {
            cdata.review_user = self.procBasic.proHanleData._approval_user_no
            // let date = new Date()
            // cdata.review_time = date
          }

          let keys = Object.keys(cdata)
          if (keys.length >= 5) {
            d.data = [cdata]
            d.condition.push(c)
            childDataList.push(d)
            let procdata = req.data[0]
            procdata['child_data_list'] = childDataList
            // reqs[0].data[0]['child_data_list'] = childDataList

            reqs.push(req)
            console.log(reqs)
            self.crosAjaxData(self.$api.approval, 'post', reqs, CallbackGo)
          } else {
            self.$vux.toast.show({
              type: 'text',
              text: '评审信息不完整'
            })
          }
        } else {
          reqs.push(req)
          this.crosAjaxData(self.$api.approval, 'post', reqs, CallbackGo)
        }
      } else {
        self.$vux.toast.show({
          type: 'text',
          text: '请填写审批意见'
        })
      }
    },
    handler (index) {
      let tabsValue = list()
      if (index) {
        let value = tabsValue[index].value
        console.log(value)
        this.index = index
        this.activeValue = value
        if (value === 'procInfo') {
          this.detailList = []
          this.getData()
        } else {
          this.getChart()
          this.getRecord()
        }
      } else {
        index = 0
        let value = tabsValue[index].value
        console.log(value)
        this.index = index
        this.activeValue = value
        if (value === 'procInfo') {
          this.detailList = []
          this.getData()
        } else {
          this.getChart()
          this.getRecord()
        }
      }
    }
  }
}
</script>
<style lang="less">

  .proc-detail{
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

    
  }
  .demo4-item {
        background-color: #ddd;
        color: #222;
        font-size: 14px;
        padding: 5px 10px;
        margin-bottom: 5px;
        margin-right: 8px;
        line-height: 18px;
        border-radius: 15px;
      }
      .demo5-item {
        background-color: #ddd;
        color: #222;
        font-size: 14px;
        padding: 5px 10px;
        margin-bottom: 5px;
        margin-right: 8px;
        line-height: 18px;
        border-radius: 15px;
        width: 37%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top:5px;
      }
      .demo4-item-selected {
        background-color: rgb(9, 194, 33);
        color: #fff;
      }
      .proc-info p{
            // overflow: hidden;
            // text-overflow:ellipsis;
            // white-space: nowrap;
      }
</style>


