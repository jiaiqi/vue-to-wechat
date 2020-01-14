<template>
  <div  :class="formValids.valid?  'form-item-editer':'form-item-editer form-item-editer-err'">
    
    <!-- <group label-min-width="4.5em" label-margin-right="1em" :title="Fileddatas.section === '' ? '':Fileddatas.section"> -->
    <group label-min-width="4.5em" label-margin-right="1em">
      <div slot="title" class="weui-cells__title">
        <span>{{Fileddatas.label}}</span><span v-if="Fileddatas._formItemValidators.required" style="color:red;height:24px;line-height:1.4">* </span> <span class="err-msg" v-if="formValids.valid === false" style="height:1rem;color:red;font-size:0.8rem;width:100%;text-align:right;padding-bottom:4px;">{{Fileddatas._formItemValidators.msg}}<icon type="warn" style="font-size:0.8rem"></icon></span>
      </div>
      <x-input  
        v-if ="Fileddatas.updatable ===0"
        v-model="Fileddatas.column"
        disabled>
      </x-input> 
      <x-input :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        @focus="formValidators(Fileddatas.column,Fileddatas._formItemValidators)" 
        v-else-if ="Fileddatas.col_type ==='String' && Fileddatas.bx_col_type ==='string'" 
        v-model="Fileddatas.column"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ?Fileddatas.placeholder :'请输入内容'">
      </x-input>
      <x-input :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='email'" 
        is-type="email" 
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-input>
      <x-number 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.col_type ==='Integer' || Fileddatas.col_type ==='int' " 
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-number>
      <x-input  
        :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.col_type ==='Float'" 
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-input>
      <x-input 
        :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='money'" 
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-input>
      <x-input 
        :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='telno' || Fileddatas.bx_col_type === 'mobile'" 
        type="tel"
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-input>
      <x-input 
        :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='password'" 
        type="password"
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-input>
      <popup-radio  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='enum' || Fileddatas.bx_col_type ==='dict' || Fileddatas.col_type === 'Enum'" 
        v-model="Fileddatas.column" :title="Fileddatas.label"  
        :options="Fileddatas.option_list_v2" 
        :placeholder="'请选择'">
      </popup-radio>
      <cell 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)"
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='fk'" 
        v-model="Fileddatas.column === '' ? '请选择' : Fileddatas.column" 
        @click.native="fkPopupModel.showPopup=true" 
        is-link>
      </cell>
      <calendar  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='date' || Fileddatas.col_type ==='Date'"
        v-model="Fileddatas.column" 
        placeholder="请选择日期">
      </calendar>
      <datetime  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='year'" 
        format='YYYY'
        v-model="Fileddatas.column" 
        :min-year=1958 :max-year=2019
        :placeholder="'请选择' + Fileddatas.label">
      </datetime>
      <datetime  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='month'"
        format='MM'
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </datetime>
      <datetime  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        v-else-if ="Fileddatas.bx_col_type ==='time' || Fileddatas.col_type ==='Time'"
        format='HH:mm'
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </datetime>
      <cell 
        v-else-if ="Fileddatas.bx_col_type ==='user' || Fileddatas.col_type==='User'"
        @blur="handleBlur" 
        :value="Fileddatas.column" 
        @click.native="showUserList=true" 
        is-link>
      </cell>
      <datetime  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)"  
        @blur="handleBlur" 
        v-else-if ="Fileddatas.col_type ==='datetime' || Fileddatas.col_type ==='DateTime'" 
        v-model="Fileddatas.column" 
        format="YYYY-MM-DD HH:mm" 
        placeholder="请输选择日期时间">
        <!-- <p class='weui-label' slot="title">{{Fileddatas.label}}</p> -->
      </datetime>
      <x-textarea  
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        :max="Fileddatas._formItemValidators.max" 
        :min="Fileddatas._formItemValidators.min" 
        autosize 
        show-counter 
        v-else-if = "Fileddatas.col_type ==='Note' ||Fileddatas.col_type ==='MultilineText'" 
        v-model="Fileddatas.column" 
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null?Fileddatas.placeholder :'请输入内容'">
      </x-textarea >
      <uploader
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators)" 
        @blur="handleBlur" 
        :max="1"
        :images="Fileddatas._images"
        :handle-click="false"
        :show-header="false"
        :show-tip="true"
        :readonly="false"
        v-else-if = "Fileddatas.bx_col_type ==='image'" 
        :upload-url="this.$api.upload"
        :name="'file'"
        size="small"
        :autoUpload="false"
        :key="menuKey"
        @preview="previewMethod"
        @add-image="addImageMethod" 
        @remove-image="removeImageMethod" 
        @upload-image="uploadImage"
        :title="Fileddatas.label"
        ref="uploader"
      ></uploader>
      <checker 
        v-else-if="Fileddatas.bx_col_type ==='set'" 
        @input="handleInput(Fileddatas.columns,Fileddatas.column,Fileddatas._formItemValidators,Fileddatas)" 
        @blur="handleBlur"
        v-model="Fileddatas._selected" 
        type="checkbox" 
        default-item-class="demo2-item" 
        @on-change="onSetItem"
        selected-item-class="demo2-item-selected">
        <checker-item :value="item.value" v-for="(item, index) in Fileddatas.option_list_v2" :key="index" >{{item.value}}</checker-item>
      </checker>
      <x-input v-else  :title="Fileddatas.label" v-model="Fileddatas.column" placeholder="移动端不支持的类型"></x-input>
      <!-- <div class="err-msg" v-if="formValids.valid === false" style="height:1rem;color:red;font-size:0.8rem;width:100%;text-align:right;padding-bottom:4px;">{{Fileddatas._formItemValidators.msg}}<icon type="warn" style="font-size:0.8rem"></icon></div> -->
      <div v-transfer-dom>
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
              <checker-item v-for="(item,index) in userList.Fileddatas" :key="index" :value="item.user_no" @on-item-click="onItemClick"> {{item.user_disp}} </checker-item>
            </checker>
          </div>
        </popup>
        <popup 
        v-model="fkPopupModel.showPopup" 
        height="80%" 
        is-transparent :should-rerender-on-show="true"
        @on-show="getPopupList">
          <div style="width: 95%;background-color:#fff;margin:0 auto;border-radius:5px;padding-top:10px;">
            <p style="padding: 5px 5px 5px 2px;color:#888;text-align:center">查询并选择</p>
            <search
              @result-click="resultClick"
              @on-change="getPopupList"
              v-model="fkPopupModel.search"
              position="absolute"
              auto-scroll-to-top
              :auto-fixed=false
              top="46px"
              @on-focus="onFocus"
              @on-cancel="onCancel"
              ref="searchb"></search>
          <scroller lock-x scrollbar-y  ref="scrollerpull"  
          :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中'}" 
          :pullup-config="{content:'上拉加载更多',downContent:'松开加载更多',upContent:'上拉加载更多',loadingContent:'加载中'}">
                <group style="text-align:center">
                  <!-- <cell v-for="(item,index) in fkPopupModel.Fileddatas" :key="index" :title="item.label" :value="item.key"></cell> -->
                  <checker 
                  v-model="fkPopupModel.selected.key"
                  default-item-class="popups-item"
                  selected-item-class="popups-item-selected"
                  type="radio" 
                  :radioRequired=true>
                    <checker-item v-if="fkPopupModel.Fileddatas.length > 0"  v-for="(item,index) in fkPopupModel.Fileddatas" :key="index++" :value="item.key?  item.key : ''" @on-item-click="onPopupItemClick"> {{item.label}} </checker-item>
                  </checker>
                </group>
          </scroller>
          <!-- <div style="padding:20px 15px;">
            <x-button type="primary">Pay</x-button>
            <x-button @click.native="fkPopupModel.showPopup = false">Cancel</x-button>
          </div> -->
          <div v-transfer-dom>
            <previewer :list="imagePreviewer" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
          </div>
          </div>
        </popup>
      </div>
    </group>
  </div>
</template>
<script>
import Emitter from '../assets/js/mixins/emitter.js'
import Uploader from 'vux-uploader'

import { Previewer, Cell, XInput, Scroller, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber, Icon, TransferDom, Popup, Checker, CheckerItem, Search } from 'vux'
export default {
  name: 'iFormItem',
  components: {
    Previewer, Cell, XInput, Scroller, Group, XButton, XTextarea, PopupRadio, PopupPicker, Calendar, Datetime, XNumber, Icon, Uploader, TransferDom, Popup, Checker, CheckerItem, Search
  },
  computed: {
    // formValidators: function (reg, val) {
    //   console.log('校验信息', reg, val)
    // }
    fkSelectList: async function (e) {
      let cond = []
      let a = {
        'colName': e.key_disp_col,
        'value': '',
        'ruleType': 'like'
      }
      cond.push(a)
      let d = await this.selectOne(e.serviceName, cond)
      console.log(d)
      return d
    }
  },
  directives: {
    TransferDom
  },
  props: {
    fromColData: {}
  },
  mixins: [Emitter],
  data () {
    return {
      oldColData: {},
      Fileddatas: {},
      currentValue: '',
      formValids: {
        valid: Boolean,
        msg: ''
      },
      _tableValid: this.fromColData._tableValid,
      menuKey: new Date().getTime(),
      showUserList: false,
      userList: {
        search: '',
        Fileddatas: [],
        userSelected: {
          user_disp: '',
          user_no: ''
        }
      },
      setList: [],
      fkPopupModel: {
        showPopup: false,
        search: '',
        Fileddatas: [],
        selected: {
          key: '',
          label: ''
        }
      },
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.weui-uploader__file')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      imagePreviewer: []
      // srvCols: this.$store.getters.getSrvCol,
      // type: this.pathQuery.colType
    }
  },
  created () {
    this.toCols()
    this.$on('on-submit', this.onSubmit)
    if (this.fromColData.bx_col_type === 'fk') {
      this.getPopupList()
    }
    this.$on('remove', this.removeImageMethod)
    this.$on('set-table-valid', (event) => {
      if (event.colName === this.Fileddatas.columns) {
        this.setTableValid(event)
        console.log(event)
      }
    })
  },
  mounted () {
    /// 如果没有传入 prop，则无需校验，也就无需缓存
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this)
    }
    // this.formValidators(this.fromColData.column, this.fromColData._formItemValidators)
  },
  beforeDestroy () {
    // this.dispatch('iForm', 'on-form-item-remove', this)
  },
  methods: {
    onCancel () {

    },
    onFocus () {

    },
    resultClick () {

    },
    openFile () {

    },
    success (src, ele) {
      console.log('success load', src)
      const span = ele.parentNode.querySelector('span')
      ele.parentNode.removeChild(span)
    },
    error (src, ele, msg) {
      console.log('error load', msg, src)
      const span = ele.parentNode.querySelector('span')
      span.innerText = 'load error'
    },

    onXifFun (r, xif) {
      /* eslint-disable */ 
      let row = r
      // let fun = (new Function(xif))()
      // console.log('xifFun===:::>'+ eval(xif))
      return eval(xif)
    },
    onSetItem (item) {
      console.log('onset',item)
      let self = this
      item = item.filter((item) =>{ return item !== ""})
      console.log('onset',item)
      self.Fileddatas.column = item.join(',')
      // self.dispatch('iForm', 'on-set-item', self.Fileddatas.column)
    },
    onItemClick (value, disabled) {
      // 人员选择
      console.log(value, disabled)
      if (!this.disabled) {
        this.showUserList = false
        let obj = this.userList.Fileddatas
        let turnUser = obj.filter(item => item.user_no === value)
        this.userList.userSelected = turnUser[0]
        this.Fileddatas.column = turnUser[0].user_no
        this.fromColData.column = turnUser[0].user_no
        // console.log(turnUser)
      }
    },
    onPopupItemClick (value, disabled) {
      // 人员选择
      console.log(value, disabled)
      if (!this.disabled) {
        this.fkPopupModel.showPopup = false
        let obj = this.fkPopupModel.Fileddatas
        let turnUser = obj.filter(item => item.key === value)
        this.fkPopupModel.selected = turnUser[0]
        this.Fileddatas.column = turnUser[0].key
        this.fromColData.column = turnUser[0].key
        // console.log(turnUser)
      }
    },
    getPopupList (pin) {
      let self = this
      let options = this.fromColData.option_list_v2
      let CallbackGo = function (response) {
        if (response.data !== '') {
          let sData = response.data.data
          // self.fkPopupModel.Fileddatas = sData
          self.fkPopupModel.data = sData.map((item) => {
            let a = {}
            a.label = item[options.key_disp_col]
            a.key = item[options.refed_col]
            return a
          })
        }
      }
      let req = {}
      if (this.fromColData.bx_col_type === 'fk') {
        req.serviceName = options.serviceName
        req.colNames = [options.refed_col, options.key_disp_col]
        req.condition = [{
          'colName': options.key_disp_col,
          'ruleType': 'like',
          'value': self.fkPopupModel.search
        }]
      }
      req.page = {
        pageNo: 1,
        rownumber: 20
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
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
    handleInput (columns, val, regs,data) {
      let self = this
      
      setTimeout(()=>{
        let a = {
          columns: self.Fileddatas.columns,
          currentValue: self.Fileddatas.column
        }
        self.formValidators(self.Fileddatas.column, regs)
        this.dispatch('iForm', 'on-form-blur', a)
        this.dispatch('iForm','currentValue-update', a)
      },40)
      // console.log(this)
    },
    async toCols () {
      let self = this
      self.oldColData = self.fromColData
      self.Fileddatas = self.deepClone(self.oldColData)
      if (self.Fileddatas.column === undefined || self.Fileddatas.column === null) {
        self.Fileddatas.column = ''
      }

      self.dispatch('iForm', 'iForm-Item-Loaded', true)
      // this.Fileddatas = JSON.parse(JSON.stringify(this.oldColData))
      if (!('column' in self.Fileddatas)) { self.Fileddatas.column = '' }
      let isType = self.oldColData._formItemValidators
      self.Fileddatas._formItemValidators = isType
      if (self.Fileddatas.bx_col_type === 'enum' || self.Fileddatas.col_type === 'Enum') {
        self.Fileddatas.option_list_v2 = self.Fileddatas.option_list_v2.map((item) => {
          let a = {}
          a.key = item.value
          a.value = item.label
          return a
        })
      } else if (self.Fileddatas.bx_col_type === 'dict') {
        self.Fileddatas.option_list_v2 = self.Fileddatas.option_list_v2.map((item) => {
          let a = {}
          a.key = item.value
          a.value = item.label
          return a
        })
      } else if (self.Fileddatas.bx_col_type === 'image') {
        if (self.Fileddatas.column !== '' && self.Fileddatas.column !== undefined) {
          let res = await self.getImageUrl(self.Fileddatas.column)
          let imgUrl = {
            url: res[0]._url
          }
          let imgPre = {
            src: res[0]._url
          }
          self.imagePreviewer.push(imgPre)
          self.Fileddatas['_images'] = []
          self.Fileddatas._images.push(imgUrl)
          self.handleInput(self.Fileddatas.columns, self.Fileddatas.column, self.Fileddatas._formItemValidators)
          self.$refs.uploader.images.push(imgUrl)
        }
      } else if (self.Fileddatas.bx_col_type === 'set') {
        let selected = self.Fileddatas.column
        selected = selected.split(',')
        self.Fileddatas['_selected'] = selected
      }
    },

    handleBlur (event) {
      console.log('失去焦点', event)
      setTimeout(function () {
        window.scrollTo(0, 0)
      }, 100)
      // window.scrollTo(0, 0)
      // this.dispatch('iForm', 'on-form-blur', this.currentValue)
    },
    setRules () {
      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    showMessage (text) {
      // console.log(text)
      // window.alert(text)
    },
    onSubmit () {
      this.formValidators(this.Fileddatas.column, this.Fileddatas._formItemValidators)
    },
    onReset () {
      this.Fileddatas = Object.assign({}, this.fromColData)
      this.userList.userSelected = {
        user_disp: '',
        user_no: ''
      }
      this.fkPopupModel.selected = {
        label: '',
        key: ''
      }
    },
    formValidators (vals, regs) {
      // console.log('reg', vals, regs)
      let reg = regs
      let msgs = regs.msg === '' ? '信息有误' : regs.msg
      let val = vals === undefined ? '' : vals
      if (regs.required && reg.isType(val).valid && val.length > 0) {
        this.formValids = {valid: true}
        return this.formValids
      } else if (regs.required === false && reg.isType(val).valid) {
        this.formValids = reg.isType(val)
        return this.formValids
      } else {
        this.formValids = {valid: false, msg: msgs}
        return this.formValids
      }
      
    },
    addImageMethod () {
      console.log('添加图片')
    },
    uploadImage (res) {
      // let fData = new FormData(res)
      // let formdatas = {
      //   filePath: res.get('photo'),
      //   name: 'file',
      //   formData: {
      //     'serviceName': 'srv_bxfile_service',
      //     'interfaceName': 'add',
      //     'file': res
      //   }
      // }
      let self = this

      this.$http.post(self.$api.upload, res).then((res) => {
        console.log('', res, res.body)
        let imgUrl = {
          url: self.$api.getFilePath + res.body.fileurl
        }
        let imgPre = {
          src: self.$api.getFilePath + res.body.fileurl
        }
        self.imagePreviewer.push(imgPre)
        self.Fileddatas.column = res.body.file_no
        self.handleInput(self.Fileddatas.columns, self.Fileddatas.column, self.Fileddatas._formItemValidators)
        // self.$refs.uploader.images.push(imgUrl)
        if ('_images' in self.Fileddatas) {
          self.Fileddatas._images.push(imgUrl)
        } else {
          self.Fileddatas['_images'] = []
          self.Fileddatas._images.push(imgUrl)
        }
      })
    },
    removeImageMethod (e) {
      let self = this
      self.imagePreviewer.shift()
      console.log('用户点击了删除')
      self.menuKey = +1
    },
    previewMethod (e) {
      this.$refs.previewer.show(0)
      console.log('previewMethod', e)
    },
    logIndexChange (arg) {
      console.log(arg)
    },
    setTableValid:function(e){
      let self = this
      self._tableValid = e
      // console.log("setTableValid",self._tableValid,self.Fileddatas._formItemValidators)
      if(!self._tableValid.valid && self._tableValid.valid !== undefined && self._tableValid.valid !== ""){
        // console.log(self._tableValid,self.Fileddatas._formItemValidators)
          self.Fileddatas._formItemValidators.required = true
        }else{
          self.Fileddatas._formItemValidators.required = false
        }
    },
  },
  watch: {
    formValids: {
      handler: function (val, oldval) {
        // console.log('formValids更新1', val)
        let b = {
          columns: this.fromColData.columns,
          formValids: this.formValids
        }
        this.dispatch('iForm', 'on-form-item-valid', b)
      },
      deep: true   // 是否深度监听
    },
    Fileddatas: {
      handler: function (val, oldval) {
        // let self = this
        this.dispatch('iForm','currentValue-update', val)
        // console.log(val)
        if (val._images && val._images.length === 0) {
          this.imagePreviewer = []
        }
      },
      deep: true   // 是否深度监听
    },
    
    fromColData: {
      handler: function (newV, oldV) {
        let self = this
        // console.log('formitem更新2', newV)
        // self.Fileddatas.column = newV.column
        // self.Fileddatas = JSON.parse(JSON.stringify(self.oldColData))
        // if ('column' in newV) {
        //   console.log('formitem更新', oldV, newV)
        //   self.Fileddatas.column = newV.column
        // } else {
        //   self.Fileddatas.column = newV.column
        // }
        self._tableValid = self.fromColData._tableValid
        self.toCols()
        // this.dispatch('iForm', 'on-form-item-valid', b)
      },
      deep: true   // 是否深度监听
    },
    _tableValid:{
      handler: function (newV, oldV) {
        let self = this
        if(!newV.valid){

        }
        // self.Fileddatas.column = newV.column
        // self.Fileddatas = JSON.parse(JSON.stringify(self.oldColData))
        // if ('column' in newV) {
        //   console.log('formitem更新', oldV, newV)
        //   self.Fileddatas.column = newV.column
        // } else {
        //   self.Fileddatas.column = newV.column
        // }
        self.toCols()
        // this.dispatch('iForm', 'on-form-item-valid', b)
      },
      deep: true   // 是否深度监听
    }
  }
}
</script>
<style lang="less">
.form-view-item{

  .vux-checker-box{
    padding: 0 10px;
  }
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
  .demo2-item {
    background-color: #ddd;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-bottom: 5px;
    margin-right: 8px;
    line-height: 18px;
    border-radius: 15px;
    min-width: 2rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top:5px;
  }
  .demo2-item-selected {
    background-color: rgb(9, 194, 33);
    color: #fff;
  }
  .popups-item {
    background-color: #ddd;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-bottom: 5px;
    margin-right: 8px;
    line-height: 18px;
    border-radius: 15px;
    width: 37%;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    margin-top:5px;
  }
  .popups-item-selected {
    background-color: rgb(9, 194, 33);
    color: #fff;
  }
.form-item-editer.form-item-editer-err{
  color: rgb(248, 95, 95);
  .vux-cell-primary,.weui-cell__primary,.weui-cell__bd{
    border-bottom: 1px solid rgb(248, 95, 95);
    ::-webkit-input-placeholder { /* WebKit browsers */
      color: rgb(248, 95, 95);
      font-size: 1rem;
    }

    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: rgb(248, 95, 95);
      font-size: 1rem;
    }

    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: rgb(248, 95, 95);
      font-size: 1rem;
    }  
  }
}
</style>


