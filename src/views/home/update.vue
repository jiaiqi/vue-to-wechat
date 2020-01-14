<template>
<div class="add-view">
  
  <scroller lock-x scrollbarY  height="-46" ref="scrollerUpdate">
    <div>
      <fromView v-if="showChild" :pathQuery="query" :pageType="query.type" ref="iForms"></fromView>
      <div class="bottom-flex" v-if="pageBtns" style="padding:10px">
        <flexbox :gutter="10">
          <flexbox-item v-for="(item,index) in pageBtns" :key="index">
            <x-button v-if="item.button_type === 'reset'" type="warn" @click.native="onReset">{{item.button_name}}</x-button>
            <x-button v-else-if="item.button_type === 'edit'" type="primary" @click.native="submitForm">{{item.button_name}}</x-button>
            <x-button v-else-if="item.button_type === 'submit' || this.query.type === 'add'" type="primary" @click.native="submitForm('add')">{{item.button_name}}</x-button>
          </flexbox-item>
          
          <flexbox-item :key="index" v-if="this.query.type === 'add'">
            <x-button type="primary" @click.native="submitForm">保存草稿</x-button>
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
  name: 'iFormPageUpdate',
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
      pageBtns: []
    }
  },
  mixins: [Emitter],
  created () {
    let self = this
    this.$on('iForm-Loaded', (load) => {
      if (load) {
        self.$refs.scrollerUpdate.reset()
      }
    })

    this.getCols()
  },
  mounted () {
    this.$on('on-form-valid', this.onFormItemValid)
  },
  methods: {
    async getCols () {
      let self = this
      // if()
      if (self.$route.query.srvType) {
        self.query.cols = await self.getColData(self.$route.query.serviceName, this.$route.query.srvType, this.$route.query.pageType)
      } else {
        self.query.cols = await self.getColData(self.$route.query.serviceName, this.$route.query.pageType, this.$route.query.pageType)
      }
      self.pageBtns = self.query.cols.formButton
      self.pageBtns = self.pageBtns.filter((item) => {
        if (item.permission === true) {
          return item
        }
      })
      this.getOldData()
    },
    onReset () {
      // this.broadcast('iFormItem', 'on-reset')
      this.$refs.iForms.resetForm()
      console.log('重置')
    },
    submitForm (etype) {
      let self = this
      this.broadcast('iFormItem', 'on-submit')

      let a = this.$refs.iForms.returnFields()
      if (etype) {
        a.valid = true
      }
      if (!a.valid) {
        self.$vux.toast.show({
          text: '信息有误',
          type: 'text',
          time: 800,
          isShowMask: true
        })
      } else if (a.data.length === 0) {
        if (a.valid) {
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
              if (etype) {
                self.submint(a.data, etype)
              } else {
                self.submint(a.data)
              }
              console.log('plugin confirm')
            }
          })
        } else {
          self.$vux.toast.show({
            text: '没有需要提交的信息',
            type: 'text',
            time: 800,
            isShowMask: true
          })
        }
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
            if (etype) {
              self.submint(a.data, etype)
            } else {
              self.submint(a.data)
            }
            console.log('plugin confirm')
          }
        })
      }
      console.log(a)
    },
    getOldData () {
      let self = this
      let srv = this.query.serviceName.replace('update', 'select')
      let cons = []
      let cond = {
        'colName': this.$route.query.key,
        'value': this.$route.query.value,
        'ruleType': 'eq'
      }
      cons.push(cond)
      // let data
      let promise = new Promise((resolve, reject) => {
        let s = self.selectOne(srv, cons)
        resolve(s)
      })
      promise.then((e) => {
        let data = e
        let scols = this.deepClone(this.query.cols.srv_cols)
        let colKeys = Object.keys(data)
        for (let i = 0; i < colKeys.length; i++) {
          for (let j = 0; j < scols.length; j++) {
            if (colKeys[i] === scols[j].columns) {
              if (data[colKeys[i]] === null) {
                scols[j].column = ''
              } else {
                scols[j].column = data[colKeys[i]]
              }
            }
          }
        }
        this.query.cols.srv_cols = this.deepClone(scols)
        this.showChild = true
        console.log('data', data)
        data = e
      })
      // let data =  this.selectOne(srv, cons)
    },
    async submint (nData, etype) {
      let self = this
      let params = []
      if (this.query.type === 'update') {
        params[0] =
        {
          'serviceName': self.query.cols.service_name,
          'queryMethod': 'update',
          'condition': [{'colName': this.$route.query.key, 'value': this.$route.query.value, 'ruleType': 'eq'}],
          'data': [
          ]
        }
        // eslint-disable-next-line
        let data = []
        let a = {}
        data = nData.map((item) => {
          a[item.columns] = item.column
        })
        params[0].data.push(a)
        const response = await self.$http.post(self.$api.add, params)// 新增
        if (response.body.state === 'SUCCESS') {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultCode
          })
          // let srv = this.query.serviceName.replace('update', 'select')
          // this.$router.replace({path: '/detailplus/' + this.$route.query.value, query: {serviceName: srv, key: 'id', val: this.$route.query.value, pageType: 'detail'}})
          this.$router.go(-1)
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
        } else {
          self.$vux.toast.show({
            type: 'text',
            text: response.body.resultMessage
          })
        }
      } else if (this.query.type === 'add') {
        if (etype) {
          params[0] =
          {
            'serviceName': self.query.cols.service_name,
            'queryMethod': 'update',
            'condition': [{'colName': 'proc_instance_no', 'value': this.$route.query.proc_instance_no, 'ruleType': 'eq'}],
            'proc_instance_no': this.$route.query.proc_instance_no,
            'data': [
            ]
          }
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
            // self.$router.go(-1)

            this.$router.pureplacesh({path: '/procdetail', query: {proc_instance_no: this.$route.query.proc_instance_no}})
          } else {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultMessage
            })
          }
        } else {
          params[0] =
          {
            'serviceName': self.query.cols.service_name,
            'queryMethod': 'update',
            'condition': [{'colName': 'proc_instance_no', 'value': this.$route.query.proc_instance_no, 'ruleType': 'eq'}],
            'proc_instance_no': this.$route.query.proc_instance_no,
            'data': [
            ]
          }

        // eslint-disable-next-line
        let data = []
          let a = {}
          data = nData.map((item) => {
            a[item.columns] = item.column
          })
          params[0].data.push(a)
          const response = await self.$http.post(self.$api.saveDraft, params)// 新增
          if (response.body.state === 'SUCCESS') {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultCode
            })
          // let srv = this.query.serviceName.replace('update', 'select')
            this.$router.replace({path: '/procdetail', query: {proc_instance_no: this.$route.query.proc_instance_no}})
        // self.$router.push({ name: 'list', params: { serviceName: self.serviceName } })//普通列表
          } else {
            self.$vux.toast.show({
              type: 'text',
              text: response.body.resultMessage
            })
          }
        }
      } else {
        self.$vux.toast.show({
          type: 'text',
          text: '无法识别的提交信息'
        })
      }
    }
  },
  watch: {
    'query': {
      handler: function (newV, oldV) {
        // let self = this
        // this.getOldData()
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.add-view{
  // padding: 10px;
}
</style>

