<template>
  <div class="nav-item-leaf">
    <grid :cols="4"  :show-vertical-dividers="false" :show-lr-borders="false">
        <!-- <grid-item :label="item.menu_name" v-for="(btns,indexa) in item" :key="indexa"> -->
        <grid-item v-if="item.app_dest_page === 'list' && (item.app_temp_col_map !== null )" :label="item.menu_name" v-for="(item,index) in gridData" :key="index" :link="{path: '/listView', query: {serviceName: item.service_name,templateCfg:item.app_temp_col_map,title:item.menu_name,pageType:item.app_dest_page}}">
          <img v-if="item.icon !== null" slot="icon" src="../assets/img/icons/init/icon-init.png">
          <span  v-if="item.icon === null" slot="icon" class="text-icon">
              {{item.menu_name.substr(0, 1)}}
            </span>
          <span slot="label">{{ item.menu_name}}</span>
        </grid-item>
        <grid-item v-if="item.app_dest_page === 'list-proc' && (item.app_temp_col_map !== null )" :label="item.menu_name" v-for="(item,index) in gridData" :key="index" :link="{path: '/proclist', query: {serviceName: item.service_name,templateCfg:item.app_temp_col_map,title:item.menu_name,pageType:item.app_dest_page}}">
          <img v-if="item.icon !== null" slot="icon" src="../assets/img/icons/init/icon-init.png">
          <span  v-if="item.icon === null" slot="icon" class="text-icon">
              {{item.menu_name.substr(0, 1)}}
            </span>
          <span slot="label">{{ item.menu_name}}</span>
        </grid-item>
        <grid-item v-if="item.app_dest_page === '' || item.app_dest_page === null || item.app_temp_col_map === null || item.app_temp_col_map === ''" :label="item.menu_name" v-for="(item,index) in gridData" :key="index" @click.native="onNone(item.menu_name)">
          <img v-if="item.icon !== null" slot="icon" src="../assets/img/icons/init/icon-init.png">
          <span  v-if="item.icon === null" slot="icon" class="text-icon-none">
              {{item.menu_name.substr(0, 1)}}
              <!-- <span class="icon-tips" text="未开放">未开放</span> -->
            </span>
          <span slot="label">{{ item.menu_name}}</span>
        </grid-item>
    </grid>
  </div>
</template>
<script>
import { Cell, Scroller, Group, XButton, Divider, Card, Grid, GridItem, GroupTitle, Badge } from 'vux'
export default {
  name: 'xNavItemLeaf',
  components: {
    Cell, Scroller, Group, XButton, Divider, Card, Grid, GridItem, GroupTitle, Badge
  },
  props: {
    gridData: null
  },
  computed: {
  },
  data () {
    return {
      data: []
    }
  },
  created () {
    // console.log(this.gridData)
    // this.getMenus(this.gridData)
  },
  mounted () {
    // this.cols = srvCols.filter(item => )
  },
  updated () {
    // this.getMenus(this.firstData)
  },
  methods: {
    onNone (label) {
      let self = this
      self.$vux.confirm.show({
        title: '提示',
        content: '[' + label + ']暂未开放',
        showCancelButton: false,
        onShow () {
        },
        onHide () {
        },
        onCancel () {
        },
        onConfirm (msg) {
        }
      })
    }
  }
//   watch: {
//   }
}
</script>
<style lang="less">
.nav-item-leaf{
  .weui-grids:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 0px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
  .weui-grid{
    height: 24.9vw;
    &:after {
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 0px solid #D9D9D9;
      color: #D9D9D9;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .weui-grid__icon {
    width: 2.4rem;
    height: 2.4rem;
    margin: 0 auto;
    display: flex;
    .text-icon{
      height: 100%;
      width: 100%;
      // background: rgb(39, 99, 230);
      background: -webkit-linear-gradient(bottom, #214bbd , #3e91ff); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(top, #214bbd , #3e91ff); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(top, #214bbd , #3e91ff); /* Firefox 3.6 - 15 */
      background: linear-gradient(to top, #214bbd , #3e91ff); /* 标准的语法（必须放在最后） */
      color:#fff;
      text-align: center;
      border-radius: 4px;
      line-height: 2.4rem;
      font-size: 1.8rem;
    }
    .text-icon-none{
      height: 100%;
      width: 100%;
      // background: rgb(39, 99, 230);
      background: -webkit-linear-gradient(bottom, #7484b1 , #8ebfff); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(top, #7484b1 , #8ebfff); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(top, #7484b1 , #8ebfff); /* Firefox 3.6 - 15 */
      background: linear-gradient(to top, #7484b1 , #8ebfff); /* 标准的语法（必须放在最后） */
      color:#fff;
      text-align: center;
      border-radius: 4px;
      line-height: 2.4rem;
      font-size: 1.8rem;
    }
    .icon-tips{

    }
  }
}
</style>


