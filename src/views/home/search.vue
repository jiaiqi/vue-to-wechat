<template>
    <div v-transfer-dom>
      <popup v-model="showUserList" class="checker-popup" position="right" @on-show="getUserList" width="65%">
        <div style="padding:10px 10px 40px 10px;">
          <p style="padding: 5px 5px 5px 2px;color:#888;">人员列表</p>
          <!-- <search
            @result-click="resultClick"
            @on-change="getUserList"
            v-model="userList.search"
            position="absolute"
            auto-scroll-to-top
            :auto-fixed=false
            top="46px"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            ref="search"></search> -->
            <searchView :pathQuery="query"></searchView>
          <!-- <checker
          v-model="userList.userSelected.user_no"
          default-item-class="demo5-item"
          selected-item-class="demo4-item-selected"
          type="radio" 
          :radioRequired=true>
            <checker-item v-for="(item,index) in userList.data" :key="index" :value="item.user_no" @on-item-click="onItemClick"> {{item.user_disp}} </checker-item>
          </checker> -->
        </div>
      </popup>
    </div>
</template>
<script>
import searchView from '../../components/search.vue'
import { XButton, Popup, Group, Scroller, TransferDom, Flexbox, FlexboxItem, Search } from 'vux'
export default {
  components: {
    searchView, XButton, Popup, Group, Scroller, TransferDom, Flexbox, FlexboxItem, Search
  },
  data () {
    return {
      query: this.$route.query,
      showUserList: false,
      userList: {
        search: '',
        data: [],
        userSelected: {
          user_disp: '',
          user_no: ''
        }
      }
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
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
    }
  },
  watch: {

  }
}
</script>
