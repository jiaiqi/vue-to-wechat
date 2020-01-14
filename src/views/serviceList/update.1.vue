<template>
  <div>
      <group v-for="(data, key) in updateData" :key="key">
        <x-input v-if ="data.col_type ==='String'" :title="data.label" v-model="data.colValue"></x-input>
        <x-textarea  v-else-if ="data.col_type ==='Note'" :title="data.label" v-model="data.colValue"></x-textarea >
        <x-input v-else-if ="data.col_type ==='Email'" :title="data.label" v-model="data.colValue" placeholder="请输入Email"></x-input>
        <x-number v-else-if ="data.col_type ==='Integer' || data.col_type ==='int' " :title="data.label" v-model="data.colValue" placeholder="请输入Integer"></x-number>
        <x-input v-else-if ="data.col_type ==='Money'" :title="data.label" v-model="data.colValue" placeholder="请输入Money"></x-input>
        <popup-radio v-else-if ="data.col_type ==='Enum'" :title="data.label"  :options="data.options" v-model="data.colValue" placeholder="请选择枚举"></popup-radio>
        <popup-picker v-else-if ="data.col_type ==='Dict'"  :title="data.label" :data="data.options" v-model="data.colValue" show-name placeholder="请选择字典">></popup-picker>
        <calendar v-else-if ="data.col_type ==='Date'" :title="data.label" v-model="data.colValue" placeholder="请选择日期"></calendar>
        <datetime v-else-if ="data.col_type ==='datetime'" :title="data.label" v-model="data.column" format="YYYY-MM-DD HH:mm" placeholder="请输选择日期时间"></datetime>
        <x-textarea v-else-if = "data.col_type ==='Note' ||data.col_type ==='MultilineText'" :title="data.label" v-model="data.colValue" placeholder="请输入内容"></x-textarea >
        <x-input v-else  :title="data.label" v-model="data.colValue" placeholder="暂时不认识的类型"></x-input>
      </group>
      <div style="padding:15px;">
        <x-button @click.native = 'update()' type="primary"> 编辑</x-button>
      </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber } from 'vux'
export default {
  components: {
    XInput,
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
      updateData: [],
      listData: [],
      optionlist: [],
      serviceName: this.$route.params.serviceName
    }
  },
  created: function () {
    // 获取数据，
    this.getData()
  },
  methods: {
    async getData () {
      let id = this.$route.params.id
      let self = this
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: []
      })
      self.updateData = []
      // let CallbackGoHome = function (response) {
      //   if (response.data.data.length > 0) {
      //     let data = response.data.data[0]
      //     let CallbackGoHome1 = function (response) {
      //       if (response.data.data !== '') {
      //         let data1 = response.data.data
      //         for (let key in data) {
      //           for (let key1 in data1) {
      //             if (key === data1[key1].columns) {
      //               data1[key1].colValue = data[key]
      //               continue
      //             }
      //           }
      //         }
      //         self.updateData = data1
      //       }
      //     }
      //   }
      // }
      let req = {
        serviceName: self.serviceName.replace('update', 'select'),
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
      let req1 = {
        serviceName: 'srvsys_service_columns_select',
        colNames: [
          '*'
        ],
        condition: [
          {
            'colName': 'service_name',
            'value': self.serviceName,
            'ruleType': 'eq'
          },
          {
            'colName': 'in_update',
            'value': '1',
            'ruleType': 'eq'
          }
        ],
        order: [
          {
            colName: 'seq',
            orderType: 'asc'
          }
        ]
      }
      // this.crosAjaxData(this.$api.select, 'post', req, CallbackGoHome)
      const response = await this.$http.post(this.$api.select, req)
      const response1 = await this.$http.post(this.$api.select, req1)
      if (response1.data.data !== '' && response.data.data.length > 0) {
        let data = response.data.data[0]
        self.listData = response1.data.data
        for (let key1 in self.listData) {
          if (self.listData[key1].col_type === 'Enum') { // 判断是不是枚举
            await self.getEnumData(key1)
          }
          if (self.listData[key1].col_type === 'Dict') { // 判断是不是字典
            await self.getDictData(key1)
          }
          for (let key in data) {
            if (key === self.listData[key1].columns) {
              if (self.listData[key1].col_type === 'Dict') { // 判断是不是字典
                self.listData[key1].colValue = []
                self.listData[key1].colValue.push(data[key])
              } else {
                self.listData[key1].colValue = data[key]
              }
              continue
            }
          }
        }
        self.updateData = self.listData
      }
    },
     // 获取枚举数据
    async getEnumData (i) {
      let self = this
      var params = {
        'serviceName': 'srv_enum_data_service_select',
        'colNames': [
          '*'
        ],
        'condition': [
          {
            'colName': 'table_name',
            'value': self.listData[i].table_name,
            'ruleType': 'eq'
          },
          {
            'colName': 'column_name',
            'value': self.listData[i].columns,
            'ruleType': 'eq'
          }
        ]
      }
      const response1 = await self.$http.post(this.$api.select, params)
      self.listData[i].options = []
      var enumData = response1.body.data[0].enumdata
      enumData = enumData.replace('enum(', '').replace(')', '').replace(new RegExp(/'/g), '')
      // enumData = enumData.replace('enum(', '').replace(')', '')
      for (var j = 0; j < enumData.split(',').length; j++) {
        self.listData[i].options.push({'key': j, 'value': enumData.split(',')[j]})
      }
    },
    // 获取字典数据
    async getDictData (i) {
      let self = this
      let dictType = JSON.parse(self.listData[i].option_list.replace(new RegExp(/'/g), '"')).dict_type
      // let dictType = JSON.parse(self.listData[i].option_list).dict_type
      var params = {
        'serviceName': 'srvsys_dict_select',
        'colNames': [
          'dict_no',
          'value'
        ],
        'condition': [
          {
            'colName': 'dict_type',
            'value': dictType,
            'ruleType': 'eq'
          }
        ]
      }
      const response = await self.$http.post(this.$api.select, params)
      self.listData[i].options = []
      var dictList = response.body.data
      let data = []
      for (var j = 0; j < dictList.length; j++) {
        data.push({'name': dictList[j].value, 'value': dictList[j].dict_no})
      }
      self.listData[i].options.push(data)
    },
    update () {
      let self = this
      self.$vux.toast.show({
        type: 'text',
        text: '点击了编辑'
      })
    }
  }
}
</script>