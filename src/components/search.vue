<template>
  <div class="form-view">
    <group :title="'请选择查询条件'">
    <scroller lock-x scrollbarY  height="-120" >
      <div>
        <div v-for="(data, key) in cols" :key="key">
          <x-input v-if ="data.bx_col_type ==='string' || data.bx_col_type ==='email' || data.bx_col_type ==='note' ||data.bx_col_type ==='multilineText'" :title="data.label" v-model="data.column" :placeholder="'请输入' + data.label"></x-input>
          <x-number 
          v-else-if ="data.bx_col_type ==='integer' || data.bx_col_type ==='int' " :title="data.label" 
          v-model="data.column" placeholder="请输入Integer">
          </x-number>
          <x-input 
          v-else-if ="data.bx_col_type ==='float'" :title="data.label" v-model="data.column" placeholder="请输入Float"></x-input>
          <x-input :required="getValidatorsVal(data.validators,data.validators_message).required" 
          :isType="getValidatorsVal(data.validators,data.validators_message).isType" 
          v-else-if ="data.bx_col_type ==='money'" :title="data.label" v-model="data.column" placeholder="请输入Money"></x-input>
          <!-- <popup-radio v-else-if ="data.bx_col_type ==='enum'" :title="data.label" v-model="data.column"  :options="data.option_list_v2" placeholder="请选择枚举">
          </popup-radio> -->
          <div v-else-if ="data.bx_col_type ==='enum'" style="padding:10px 15px;">
            <div class="weui-label">{{data.label}}</div>
            <checker
              v-model="data.column"
              default-item-class="search-item"
              selected-item-class="search-item-selected"
              type="radio" 
              :radioRequired=false 
              >
              <checker-item v-for="(item,index) in data.option_list_v2" :key="index" :value="item.value"> {{item.label}} </checker-item>
            </checker>
          </div>
          <!-- <popup-picker v-else-if ="data.bx_col_type ==='dict'"  :data="data.option_list_v2" v-model="data.column" show-name placeholder="请选择字典">
            <p class='weui-label' slot="title">{{data.label}}</p>
          </popup-picker> -->
           <popup-radio v-else-if ="data.bx_col_type ==='dict'"  :title="data.label" :options="data.option_list_v2" v-model="data.column" placeholder="placeholder">
             <template slot-scope="props" slot="each-item">
              <p>
                <span style="color:#666;">{{props.label}}</span>
              </p>
            </template>
           </popup-radio>
          <div :name="data.columns" v-else-if ="data.bx_col_type ==='date' || data.bx_col_type ==='datetime'" >
            <calendar 
              :title="data.label+'开始:'" 
              :display-format="mulFormat"
              :end-date="data.endDate" 
              @on-select-single-date="selectDate"
              v-model="data.stateDate" placeholder="请选择开始日期" >
            </calendar>
            <calendar 
              :title="data.label+'结束:'"  
              :display-format="mulFormat"
              :start-date="data.stateDate"
              @on-select-single-date="selectDate"
              v-model="data.endDate" placeholder="请选择结束日期" >
            </calendar>
          </div>
          <!-- <div :name="data.columns" v-else-if ="data.bx_col_type ==='date' || data.bx_col_type ==='datetime'" >
            <calendar 
              :title="data.label+'开始:'" 
              :display-format="mulFormat"
              :end-date="data.endData" 
              @on-select-single-date="selectDate"
              v-model="data.stateDate" placeholder="开始日期" >
            </calendar>
            <calendar 
              :title="data.label+'结束:'" 
              :display-format="mulFormat"
              :start-date="data.stateData" 
              @on-select-single-date="selectDate"
               v-model="data.endDate" placeholder="结束日期" >
            </calendar>
          </div> -->
          
          <!-- <div :name="data.columns"  v-else-if ="data.bx_col_type ==='datetime' || data.bx_col_type ==='dateTime'" >
            <datetime  v-model="data.column[0]"  format="YYYY-MM-DD HH:mm" :title="data.label + '开始'" placeholder="请选择"></datetime>
            <datetime  v-model="data.column[1]"  format="YYYY-MM-DD HH:mm" :title="data.label + '结束'" placeholder="请选择"></datetime>
          </div> -->
          <x-input v-else :title="data.label" v-model="data.column" placeholder="暂时不认识的类型--"></x-input>
        </div>
      </div>
    </scroller>
    </group>
  </div>
</template>
<script>
import { Cell, XInput, Scroller, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber, Checker, CheckerItem, InlineCalendar } from 'vux'
export default {
  // name: 'searchView',
  components: {
    Cell, XInput, Scroller, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber, Checker, CheckerItem, InlineCalendar
  },
  props: ['pathQuery'],
  computed: {
    count (e) {
      // let self = this
      if (typeof (e) === 'object') {
        let obj = e.map((item) => {
          let a = {}
          a['key'] = item.value
          a['value'] = item.label
          return a
        })
        return obj
      }
    }
  },
  data () {
    return {
      cols: [],
      srvCols: this.$store.getters.getSrvCol,
      serviceName: this.pathQuery,
      mulDatas: {
        startDate: '',
        mulDatas: [],
        buildSlotFn: () => ''
      },
      mulFormat: function (value, type) {
        if (type === 'array' && value.length === 2) {
          return value.join('至')
        } else {
          return value.length ? value : ''
        }
      },
      disablePast: function (value, type) {
        // 禁用多去日期
        let self = this.$data.mulDatas
        if (self.length === 0) {
          if (value < this.mulDatas[0]) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      disableDateFunction (data) {
        console.log('date', data)
        // if (date.formatedDate === '2017-10-16') {
        //   return true
        // }
      },
      selectDate (date) {
        console.log('date---', date)
      }
    }
  },
  created () {
    this.getCols()
  },
  mounted () {
    // this.cols = srvCols.filter(item => )
  },
  methods: {
    onCalenderChange (data) {
      console.log('change', data)
    },
    async getCols () {
      let self = this
      // this.getColData(this.pathQuery.serviceName, this.pathQuery.colType, this.pathQuery.pageType)
      let c = await self.getColData(this.serviceName, 'select', 'list')
      this.cols = JSON.parse(JSON.stringify(c.srv_cols))
      this.cols = this.cols.filter(item => item.in_cond_def === 1)
      this.cols = this.cols.map((item) => {
        if ((item.bx_col_type === 'date' || item.bx_col_type === 'datetime') && item.in_cond_def === 1) {
          item.column = ['', '']
          return item
        } else if (item.bx_col_type === 'enum') {
          item.option_list = item.option_list_v2.map(item => item.value)
          return item
        } else {
          item.column = ''
          return item
        }
      })
      // console.log('当前cols', this.cols)
      // if (typeof (this.cols) === 'object') {
      //   if (this.type === 'add') {
      //     this.cols = this.cols.filter(item => item.in_add === 1)
      //   } else if (this.type === 'update') {
      //     this.cols = this.cols.filter(item => item.in_update === 1)
      //   }
      // }
    },
    getValidatorsVal (val, s, e) {
      let vl = this.getValidators(val, s, e)
      return vl
    },
    getModels () {
      let cols = this.cols
      let cs = cols.filter((item) => {
        if (('column' in item && item.column !== undefined && (item.column.length > 0 && item.column[0] !== '')) || ('stateDate' in item && 'endDate' in item && item.stateDate !== '' && item.endDate !== '')) {
          console.log('col长度', item.column.length)
          return item
        }
      })
      return cs
    },
    onReset () {
      this.getCols()
      // this.cols = this.cols.map((item) => {
      //   if (typeof (item.column) === 'object') {
      //     item.column = []
      //     return item
      //   } else {
      //     item.column = ''
      //     return item
      //   }
      // })
    },
    useCustomFn (val) {
      this.buildSlotFn = val ? (line, index, data) => {
        return /8/.test(data.date) ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : '<div style="height:19px;"></div>'
      } : () => ''
    }
  },
  watch: {
    srvCols: {
      handler: function (val, oldval) {
        console.log('col更新', val)
      },
      deep: true   // 是否深度监听
    }
  }
}
</script>
<style lang="less">
</style>


