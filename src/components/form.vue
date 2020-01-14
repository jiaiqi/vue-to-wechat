<template>

  <div class="form-view-item">
      <div v-for="(itema, key) in fields" :key="key">
        <form-item v-if="fields.length > 0" :fromColData='itema'   
        v-show="onXifFun(itemVal,itema)" :key="key"></form-item>
      </div>
      <xChildLists v-show="childData.childService.length > 0" 
        v-for="(item,index) in childData.childService"  
        :key="index"   
        :childService="item" :pageType="pageType" ></xChildLists>
  </div>
</template>
<script>
import formItems from '@/components/formItems.vue'
import xChildLists from '@/components/childList.vue'
import Emitter from '../assets/js/mixins/emitter.js'
import { XInput, Scroller, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber } from 'vux'
export default {
  name: 'iForm',
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
    XNumber,
    formItems,
    'form-item': formItems,
    xChildLists
  },
  mixins: [Emitter],
  props: {
    pathQuery: Object,
    pageType: ''
  },
  data () {
    return {
      cols: [],
      itemVal: null,
      fields: [],
      childData: {
        childService: Array
      },
      vMainData: Array,
      validators: Object
      // srvCols: this.$store.getters.getSrvCol,
      // type: this.pathQuery.colType
    }
  },
  created () {
    this.getColV2(this.pathQuery.serviceName)
    let len = this.pathQuery.cols.validators
    if (len !== null) {
      this.validators = len[len.length - 1]
    }
    this.$on('on-form-blur', (event) => {
      let a = this.fields
      this.fields = a.map((item) => {
        if (item.columns === event.columns) {
          item.column = event.currentValue
          return item
        } else {
          return item
        }
      })
      // console.log('formitem新值', event)
      // this.fields.push(event)
    })
    this.$on('on-set-item', (event) => {
      console.log(event)
    })
    this.$on('currentValue-update', (event) => {
      // console.log('currentValue-update', event)

      if (this.itemVal !== null) {
        let a = this.itemVal
        let keys = Object.keys(a)
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] === event.columns) {
            a[keys[i]] = event.currentValue
            if (event.currentValue === undefined) {
              if (event.column !== undefined) {
                a[keys[i]] = event.column
              } else {
                a[keys[i]] = ''
              }
            } else {
              a[keys[i]] = event.currentValue
            }
          }
        }

        // this.onValidatorsFun()
      }
    })
    this.$on('on-form-item-valid', (colValids) => {
      let colValid = colValids
      let field = this.fields
      for (let i = 0; i < field.length; i++) {
        if (field[i].columns === colValid.columns) {
          this.fields[i]._valid = colValid.formValids.valid
        }
      }
    })
    this.$on('iForm-Item-Loaded', (load) => {
      if (load) {
        // this.dispatch('iFormPageUpdate', 'iForm-Loaded', true)
      }
    })
  },
  updated () {
    this.dispatch('iFormPageUpdate', 'iForm-Loaded', true)
  },
  mounted () {
    this.returnFields()
    // this.cols = srvCols.filter(item => )
    console.log(this.pathQuery.cols)
    if (this.pathQuery.cols.srv_cols !== 'undefined') {
      this.getCols(this.pathQuery.cols.srv_cols, this.pageType)
    }
  },
  beforeDestroy () {
    this.fields = []
  },
  methods: {
    getFromData (e) {
      let data = {}
      e.forEach((item) => {
        if (item.column) {
          data[item.columns] = item.column
        } else {
          data[item.columns] = ''
        }
      })
      this.itemVal = data
      return data
    },
    onXifFun (r, i) {
      /* eslint-disable */
      let self = this 
      let rowa = i
        if(rowa.hasOwnProperty('x_if')){
          let xif = rowa.x_if
          
        let row = r
          // val[row.columns]
          // if(row.columns)
          try {
            let ret = eval("var zz=" + xif + "(row); zz");
            // console.warn(`field ${i.columns} visible: ${ret}`)
            return ret;  
          } catch (error) {
            return true
          }
          
        }else{
          // console.warn(`field ${i.columns} visible: true`)
          return true
        }
      
    },
    async getColV2 (e) {
      let self = this
      self.vMainData = await self.getColData(e, 'select', 'detail')
      if (this.pageType === 'proc_step_form_update') {

      } else {
        self.childData.childService = self.vMainData.child_service
        self.childData.childService = self.childData.childService.filter((item) => {
          if (item.foreign_key.show_ui_child_table === '是') {
          // && item.foreign_key.foreign_key_type === '主子表'
            let pkey = {
              fk: '',
              pk: '',
              fkValue: '',
              foreignKeyType: '',
              pkTable: '',
              serviceName: '',
              sectionName: ''
            }
            pkey.fk = item.foreign_key.referenced_column_name
            pkey.pk = item.foreign_key.column_name
            pkey.fkValue = '_new'
            pkey.foreignKeyType = item.foreign_key.foreign_key_type
            pkey.pkTable = item.foreign_key.table_name
            pkey.serviceName = item.service_name
            pkey.sectionName = item.foreign_key.section_name
            item._foreignKey = pkey
            return item
          }
        })
      }

      // this.getData()
    },
    async getCols (co, pageType) {
      let self = this
      // console.log('props', co, pageType)
      self.cols = JSON.parse(JSON.stringify(co))
      let arr = self.cols.filter((item) => {
        if (pageType === 'add') {
          if (item.in_add === 1 && item.updatable !== 0) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        } else if (pageType === 'update') {
          if (item.in_update === 1 && item.updatable !== 0) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        } else if (pageType === 'apply') {
          if (item.in_add === 1 && item.updatable !== 0) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        } else if (pageType === 'proc_step_form_update') {
          if (item.in_update === 1) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        }
      })

      self.cols = arr
      // self.fields = JSON.parse(JSON.stringify(this.cols))
      self.fields = this.deepClone(this.cols)
      console.log('更新fields')
      self.fields = self.fields.map((item) => {
        item['_formItemValidators'] = self.getColValidators(item)
        return item
      })
      self.getFromData(self.fields)
    },
    getValidatorsVal (val, s, e) {
      let vl = this.getValidators(val, s, e)
      return vl
    },
    setRules () {
      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    returnFields () {
      let self = this
      let fieldValid = []
      let valids = []
      fieldValid = self.fields
      for (let i = 0; i < fieldValid.length; i++) {
        // console.log(fieldValid[i].label, fieldValid[i]._valid)
        if (fieldValid[i]._valid !== true && fieldValid[i]._valid !== undefined) {
          valids.push(fieldValid[i]._valid)
          // return item
        }
      }
      let olddata = JSON.parse(JSON.stringify(self.cols))
      let newData = JSON.parse(JSON.stringify(self.fields))
      let fids = []
      for (let j = 0; j < newData.length; j++) {
        for (let i = 0; i < olddata.length; i++) {
          if (newData[j].columns === olddata[i].columns && newData[j].column !== olddata[i].column) {
            fids.push(newData[j])
          } else {
          }
        }
      }
      // console.log('fieldValid:::', fieldValid, valids)
      let fields = {}
      fields['valid'] = !(valids.length > 0)
      fields['data'] = fids

      return fields
    },
    resetForm () {
      // this.
      if (this.pathQuery.cols.srv_cols !== 'undefined') {
        this.getCols(this.pathQuery.cols.srv_cols, this.pageType)
      }
      console.log(this.fields)
    },
    async onValidatorsFun(){
      await this.onFormValidators(this.itemVal,this.validators.in_table_validate)
    },
    async onFormValidators(val,fun){
      let ctx = val
      let self = this
      let vals = null
      if(fun !==""){
        try {
          let ret = await eval("var zz=" + fun + "(ctx); zz")
            let msg = ret
            let col = ret.cols
             
            // for(let j = 0; j<col.length;j++){
            //   let valid = {
            //     "colName":col[j],
            //     "valid":msg.valid,
            //     "msg":msg.msg
            //   }
            //   // self.broadcast('iFormItem', 'set-table-valid',valid)
            //   for(let i = 0;i<self.fields.length;i++){
            //     if(self.fields[i].columns === col[j]){
            //       self.fields[i]._tableValid = valid
            //       vals = valid
                 
            //     }else{
            //       self.fields[i]._tableValid = {
            //         "colName":"",
            //         "valid":"",
            //         "msg":""
            //       }
            //       vals = self.fields[i]._tableValid
            //     }
            //   }
            // }
            // col = col.filter((item) =>{
              
            //   return valid
            // })
            // self.
          // let ret = xxx(ctx)
          // console.warn(`field:: ${ctx.columns} visible: ${ret}`)
          
        // if(vals !== null){
        //   self.broadcast('iFormItem', 'set-table-valid',vals)
        // }
          return ret;  
        } catch (error) {
          return false
        }
      }    
    }
  },
  watch: {
    'cols': {
      handler: function (val, oldval) {
        let self = this
        this.broadcast('iFormItem', 'on-submit')
        this.fields = JSON.parse(JSON.stringify(this.cols))
        console.log('更新fields')
        this.fields = this.fields.map((item) => {
          item['_formItemValidators'] = self.getColValidators(item)
          return item
        })
      },
      deep: true   // 是否深度监听
    },
    "pathQuery":{
      handler: function (val, oldval) {
        let self = this
        // this.broadcast('iFormItem', 'on-submit')
        // this.fields = JSON.parse(JSON.stringify(this.cols))
        console.log('更新val',pathQuery)
      },
      deep: true   // 是否深度监听
    }
  }
}
</script>
<style lang="less">
.form-view-item{
  // padding: 8px;
  div{
    .weui-cells{

      &:before {
        border-top: 0px solid #D9D9D9!important;
      }
    }
  }
  .weui-cells__title {
    padding-left: 10px 15px;
    border-left: 2px solid #03A9F4;
    border-bottom:#D9D9D9;
    font-size: 17px;
  }
}
</style>


