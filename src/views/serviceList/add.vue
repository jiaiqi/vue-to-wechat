<template>
  <div>
    <!-- <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0"  ref="scroller"></scroller> -->
    
    <scroller lock-x scrollbarY height="-98"  ref="scroller" :scroll-bottom-offset="300"  @on-scroll-bottom="scrollToY">
      <div class="form-view">
        <group >
          <div v-for="(data, key) in addData" :key="key" >
            <x-input v-if ="data.col_type ==='String'" :title="data.label" v-model="data.column" 
            :max="getValidatorsVal(data.validators,data.validators_message).max" 
            :min="getValidatorsVal(data.validators,data.validators_message).min" 
            :required="getValidatorsVal(data.validators,data.validators_message).required" 
            :isType="getValidatorsVal(data.validators,data.validators_message).isType"
            placeholder="请输入内容"></x-input>
            <x-input v-else-if ="data.col_type ==='Email'" is-type="email" :title="data.label" v-model="data.column" placeholder="请输入Email"></x-input>
            <x-number 
            v-else-if ="data.col_type ==='Integer' || data.col_type ==='int' || data.bx_col_type === 'double'" :title="data.label" 
            v-model="data.colValue" placeholder="请输入Integer">
            </x-number>
            <x-input :required="getValidatorsVal(data.validators,data.validators_message).required" 
            :isType="getValidatorsVal(data.validators,data.validators_message).isType" 
            v-else-if ="data.col_type ==='Float'" :title="data.label" v-model="data.column" placeholder="请输入Float"></x-input>
            <x-input :required="getValidatorsVal(data.validators,data.validators_message).required" 
            :isType="getValidatorsVal(data.validators,data.validators_message).isType" 
            v-else-if ="data.col_type ==='Money'" :title="data.label" v-model="data.column" placeholder="请输入Money"></x-input>
            <popup-radio v-else-if ="data.col_type ==='Enum'" :title="data.label"  :options="data.options" placeholder="请选择枚举">
            </popup-radio>
            <popup-picker v-else-if ="data.col_type ==='Dict'"  :data="data.options" v-model="data.column" show-name placeholder="请选择字典">
              <p class='weui-label' slot="title">{{data.label}}</p>
            </popup-picker>
            <calendar v-else-if ="data.col_type ==='Date'" :title="data.label" v-model="data.column" placeholder="请选择日期"></calendar>
            <datetime :required="getValidatorsVal(data.validators,data.validators_message).required" v-else-if ="data.col_type ==='datetime' || data.col_type ==='DateTime'" 
            v-model="data.column" format="YYYY-MM-DD HH:mm" placeholder="请输选择日期时间">
            <p class='weui-label' slot="title">{{data.label}}</p>
            </datetime>
            <x-textarea autosize :max="getValidatorsVal(data.validators,data.validators_message).max" show-counter v-else-if = "data.col_type ==='Note' ||data.col_type ==='MultilineText'" :title="data.label" v-model="data.column" placeholder="请输入内容"></x-textarea >
            <x-input v-else  :title="data.label" v-model="data.column" placeholder="暂时不认识的类型"></x-input>
          </div>
        </group>
      </div>
    </scroller>
      <div v-show="scrollToY()" class="bottom-flex" style="padding:5px 15px;">
        <x-button  @click.native = "add()" type="primary"> 新增</x-button>
      </div>
  </div>
</template>
<script>

import Emitter from '../../assets/js/mixins/emitter.js'
import { XInput, Scroller, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber } from 'vux'
export default {
  components: {
    XInput,
    Scroller,
    Group,
    XButton,
    XTextarea,
    PopupRadio,
    PopupPicker,
    Calendar,
    Datetime,
    XNumber
  },
  data () {
    return {
      addData: [],
      listData: [],
      serviceName: '',
      addType: ''
    }
  },
  mixins: [Emitter],
  created: function () {
    // 获取数据，
    let ser = this.$route.params.serviceName
    let l = ser.lastIndexOf('_select')
    this.serviceName = ser.slice(0, l) + '_add'
    this.addType = this.$route.params.addType
    this.getData()
  },
  methods: {
    getValidatorsVal (val, s, e) {
      let vl = this.getValidators(val, s, e)
      return vl
    },
    scrollToY () {
      console.log('显示')
      return true
    },
    async getData () {
      let self = this
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: []
      })
      let req = {
        serviceName: 'srvsys_service_columns_select',
        colNames: [
          '*'
        ],
        condition: [
          {
            colName: 'service_name',
            value: self.serviceName,
            ruleType: 'eq'
          },
          {
            colName: 'in_add',
            value: '1',
            ruleType: 'eq'
          }
        ],
        order: [
          {
            colName: 'seq',
            orderType: 'asc'
          }
        ]
      }
      const response = await this.$http.post(this.$api.select, req)
      if (response.data.data.length > 0) {
        self.listData = response.data.data
        for (let i = 0; i < self.listData.length; i++) {
          if (self.listData[i].col_type === 'Enum') { // 判断是不是枚举
            await self.getEnumData(i)
          }
          if (this.listData[i].col_type === 'Dict') { // 判断是不是字典
            await this.getDictData(i)
          }
        }
        self.addData = self.listData
      }
    },

    async add () {
      let self = this
      let params = [
        {
          'serviceName': self.serviceName,
          'queryMethod': 'add',
          'data': [
            // {
            //   'issue_name': '杨博申测试1',
            //   'issue_type': '需求',
            //   'issue_source': 'VANXVM',
            //   'issue_level': '重要',
            //   'issue_pri': '高',
            //   'issue_desc': '<p>杨博申测试1</p>',
            //   'keyword': '杨博申测试1',
            //   'subsystem': 'oa_mgmt',
            //   'remark': '杨博申测试1',
            //   'auto_task_gen': '否',
            //   'executor_user': 'yangbs',
            //   'start_time': '2018-9-19 18:21:00',
            //   'end_time': '2018-9-19 18:21:00',
            //   'plan_effort': 2
            // }
          ]
        }
      ]
      if (this.addType === 'add') {
        let map = {}
        for (let key in self.addData) {
          map[self.addData[key].columns] = self.addData[key].column
          console.info(map[self.addData[key].columns] + ':' + self.addData[key].column)
        }
        params[0].data = []
        params[0].data.push(map)
        const response = await self.$http.post(self.$api.add, params)// 新增
        if (response.body.state === 'SUCCESS') {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
          if (response.body.response[0].response.ids[0]) {
            // self.$router.push({ name: 'bxoa_issue' })
            this.$router.push({path: '/detailplus', query: {serviceName: this.$route.params.serviceName, key: 'id', val: response.body.response[0].response.ids[0]}})
          }
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
        }
      } else if (this.addType === 'procAdd') {
        let map = {}
        for (let key in self.addData) {
          map[self.addData[key].columns] = self.addData[key].column
          console.info(map[self.addData[key].columns] + ':' + self.addData[key].column)
        }
        params[0].data = []
        params[0].data.push(map)
        const response = await self.$http.post(self.$api.startProc, params)// 流程开启
      // const response = await self.$http.post(self.$api.startProc, params) //新增
        if (response.body.state === 'SUCCESS') {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
          self.$router.push({ name: 'bxoa_issue' })// 流程列表
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
        }
      }
    }
  }
}
</script>
<style lang="less">
.bottom-flex{
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background: -webkit-linear-gradient(bottom, #eff3f5 , transparent); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(top, #eff3f5, transparent); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(top, #eff3f5, transparent); /* Firefox 3.6 - 15 */
    background: linear-gradient(to top, #eff3f5 , transparent); /* 标准的语法（必须放在最后） */
}
.form-view{
  a{
    text-decoration:none;
  }
  .weui-cells{
    margin-top:0;
  }
  .weui-label {
    width: 105px;
    color:#46575f;
    font-size:0.9rem;
  }
  .weui-cell__bd,.weui-cell__ft {
    border-bottom: 1px solid rgb(171, 212, 245);
    font-size:1rem;
    // &.weui-cell__primary{
    //   // border-color: #139ce0;
    // }
  }
  
    .vux-cell-bd{
      width:4rem;
      .vux-label {
        color:#46575f;
        font-size:0.9rem;
      }
    }
}
</style>
