<template>
<div class="add-view">
  
  <scroller lock-x scrollbarY  height="-46" >
    <div>
      <fromView v-if="showChild" :pathQuery="query" :pageType="query.type" ref="iForms"></fromView>
      
      <div class="bottom-flex" v-if="pageBtns.length > 0" style="padding:10px">
        <flexbox :gutter="10">
          <flexbox-item v-for="(item,index) in pageBtns" :key="index">
            <x-button v-if="item.button_type === 'reset'" type="warn" @click.native="onReset">{{item.button_name}}</x-button>
            <x-button v-else-if="item.button_type === 'submit'" type="primary" @click.native="submitForm">{{item.button_name}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    </scroller>
</div>
</template>
<script>
import fromView from '../../components/form.vue'
import Emitter from '../../assets/js/mixins/emitter.js'
import { XButton, Flexbox, FlexboxItem, Divider, Scroller } from 'vux'
export default {
  components: {
    fromView, XButton, Flexbox, FlexboxItem, Divider, Scroller
  },
  name: 'iFormPage',
  data () {
    return {
      query: {
        serviceName: this.$route.query.serviceName,
        type: this.$route.query.pageType,
        cols: {
          srv_cols: []
        }
      },
      showChild: false,
      pageBtns: [],
      foreignKey: this.$route.query.foreignKey
    }
  },
  mixins: [Emitter],
  created () {
    this.getCols()
  },
  mounted () {
    this.$on('on-form-valid', this.onFormItemValid)
  },
  methods: {
    async getCols () {
      let self = this
      self.query.cols = await self.getColData(self.$route.query.serviceName, 'add', 'add')
      self.pageBtns = self.query.cols.formButton
      self.pageBtns = self.pageBtns.filter((item) => {
        if (item.permission === true) {
          return item
        }
      })
      this.showChild = true
    },
    onReset () {
      // this.broadcast('iFormItem', 'on-reset')
      this.$refs.iForms.resetForm()
      console.log('重置')
    },
    submitForm () {
      let self = this
      this.broadcast('iFormItem', 'on-submit')
      let a = this.$refs.iForms.returnFields() // 调用form校验方法
      if (!a.valid) {
        self.$vux.toast.show({
          text: '信息有误',
          type: 'text',
          time: 800,
          isShowMask: true
        })
      } else if (a.data.length === 0) { // 是否又需要提交的数据
        self.$vux.toast.show({
          text: '没有需要提交的信息',
          type: 'text',
          time: 800,
          isShowMask: true
        })
      } else {
        self.$vux.confirm.show({
          title: '确认操作',
          content: '是否确认提交',
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            console.log('plugin cancel')
          },
          async onConfirm () {
            self.submint(a.data)
            console.log('plugin confirm')
          }
        })
      }
      console.log(a)
    },
    onFormItemValid () {

    },
    async submint (nData) {
      let self = this
      let params = [
        {
          'serviceName': self.query.cols.service_name,
          'queryMethod': 'add',
          'data': [
          ]
        }
      ]
      if (this.query.type === 'add') {
        // eslint-disable-next-line
        let data = []
        let a = {}
        data = nData.map((item) => {
          a[item.columns] = item.column
        })
        if (this.foreignKey.length > 0) {
          a[this.foreignKey[0].colName] = this.foreignKey[0].value

          console.log('key', this.foreignKey[0])
        }
        params[0].data.push(a)
        const response = await self.$http.post(self.$api.add, params)// 新增
        if (response.body.state === 'SUCCESS') {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
          if (response.body.response[0].response.ids[0]) {
            // self.$router.push({ name: 'bxoa_issue' })
            this.$router.push({path: '/detailplus', query: {serviceName: self.query.serviceName, key: 'id', val: response.body.response[0].response.ids[0]}})
          }
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
        }
      } else if (this.query.type === 'apply') {
        // eslint-disable-next-line
        let datas = []
        let a = {}
        datas = nData.map((item) => {
          if (item.column === '') {
            item.column = null
          }
          a[item.columns] = item.column
        })
        params[0].data.push(a)
        const response = await self.$http.post(self.$api.startProc, params)// 流程开启
      // const response = await self.$http.post(self.$api.startProc, params) //新增
        if (response.body.state === 'SUCCESS') {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
          self.$router.go(-1)
          // self.$router.push({ name: 'bxoa_issue' })// 流程列表
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
        }
      }
    }
  },
  watch: {

  }
}
</script>
<style lang="less">
.add-view{
  padding: 0px;
}
</style>

