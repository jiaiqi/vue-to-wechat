<template>
    <scroller lock-x scrollbarY  height="-44" >
  <div class="nav-item">
        <div v-if="item.btns.length > 0 || item.childMenu.length > 0" v-for="(item,index) in navDatas" :key="index">
            <!-- 模块 -->
            <divider>{{item.menuInfo.menu_name}}</divider>
            <!-- <load-more :show-loading="false" :tip="item.menuInfo.menu_name" background-color="#fbf9fe"></load-more> -->
            <div v-if="item.btns.length > 0">
                <xNavItemLeaf  slot="content" :gridData="item.btns"></xNavItemLeaf>
            </div>
            <div v-if="item.childMenu.length > 0" v-for="(itema,indexa) in item.childMenu" :key="indexa">
                <card  >
                    <div slot="header" style="line-height:2rem;">
                       <span style="margin-left:0.5rem;border-left:4px solid rgb(146, 182, 199);padding-left:0.5rem;color:rgb(153, 158, 160);">{{itema.menuInfo.menu_name}}</span>
                    </div>
                    <div slot="content" class="card-demo-flex card-demo-content01">
                        <div v-if="!itema.isLeaf">
                            <xNavItemLeaf slot="content" :gridData="itema.btns"></xNavItemLeaf>
                        </div>
                    </div>
                </card>
            </div>
        </div>
  </div>
    </scroller>
</template>
<script>
import xNavItemLeaf from '../components/navLeafItem.vue'
import Emitter from '../assets/js/mixins/emitter.js'
import { Cell, Scroller, Group, XButton, Divider, Card, Grid, GridItem, GroupTitle, LoadMore } from 'vux'
export default {
  name: 'xNavItem',
  components: {
    Cell, Scroller, Group, XButton, Divider, Card, Grid, GridItem, GroupTitle, xNavItemLeaf, LoadMore
  },
  mixins: [Emitter],
  props: {
    firstData: null
  },
  computed: {
    count (e) {
      // let self = this
      if (typeof (e) === 'object') {
        // let obj = e.map((item) => {
        //   let a = {}
        //   a['key'] = item.value
        //   a['value'] = item.label
        //   return a
        // })
        // return obj
      }
    }
  },
  data () {
    return {
      navDatas: [],
      allMenus: []
    }
  },
  created () {
    // console.table(this.firstData)
    this.getAllMenus()
  },
  mounted () {
    // this.cols = srvCols.filter(item => )

  },
  updated () {
    // this.getMenus(this.firstData)
  },
  methods: {
    onItemClick () {

    },
    async getAllMenus () {
      let self = this
      let cond = [
            {'colName': 'is_view', 'ruleType': 'eq', 'value': '是'},
            {'colName': 'client_type', 'ruleType': '[like]', 'value': 'APP'}
            // {'colName': 'service_name', 'ruleType': 'notnull'}
      ]
      const allM = await self.selectUserMenu(cond)
      self.allMenus = allM
      // console.log('allM', allM)
      this.getMenus(this.firstData)
      return allM
    },
    async getMenus (e) {
      // this.getAllMenus()
      this.navDatas = await this.getMenuNewData(e)
    },
    async getMenuNewData (es) {
      let self = this
      let data = es
      data = await self.menuToarr(data)
      data = await self.getchildMenu(data)
      return data
    },
    async getchildMenu (d) {
      let self = this
      let res = d
      let alls = self.allMenus
      for (let i = 0; i < d.length; i++) {
        let cm = alls.filter(function (item) {
          if (item.parent_no === res[i].menuNo) {
            return item
          }
        })
        // console.log('cm', cm, alls)
        if (Array.isArray(cm)) {
          let btns = cm.filter(item => item.is_leaf === '是')
          let childs = cm.filter(item => item.is_leaf === '否')
          let cMenus = await self.menuToarr(childs)
          res[i].childMenu = await self.menuToarr(childs)

          if (cMenus.length > 0) {
            res[i].childMenu = await this.getchildMenu(res[i].childMenu)
          }
          // res[i].btns = self.menuSpliceArr(btns, 4)
          res[i].btns = btns
        }
      }
      // console.log('getchildMenu', res)
      return res
    },
    async menuToarr (r) {
      let rootMenu = r
      // console.log('menuToarr:=======', Array.isArray(rootMenu), rootMenu)
      if (Array.isArray(rootMenu)) {
        rootMenu = rootMenu.map((item) => {
          let menuItem = {
            menuNo: '',
            menuInfo: {},
            childMenu: [],
            isLeaf: Boolean,
            btns: []
          }
          menuItem.menuNo = item.menu_no
          menuItem.menuInfo = item
          if (item.is_leaf === '否') {
            menuItem.isLeaf = false
          } else {
            menuItem.isLeaf = true
          }
          return menuItem
        })

        // console.log('menuToarr:', rootMenu)
        return rootMenu
      } else {
        // console.log('false')
        return false
      }
    }
  },
  watch: {
    'navDatas': {
      handler: function (nVal, oVal) {
        if (nVal.length > 0) {
          this.dispatch('xNavs', 'on-nav-item', false)
        } else {
          this.dispatch('xNavs', 'on-nav-item', true)
        }
        // console.log('nVal1', nVal)
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.nav-item{
  // padding: 0 10px;
  background-color: #fff;
  .vux-divider {
    display: table;
    white-space: nowrap;
    height: auto;
    overflow: hidden;
    line-height: 1;
    text-align: center;
    padding: 10px 0;
    color: rgb(31, 30, 30);
    font-weight: bold;
  }
  .weui-panel__hd {
    border-left: 4px solid rgb(177, 201, 238);
  }
}
</style>


