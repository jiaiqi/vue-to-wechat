<template>
  <tabbar ref="tabbar">
      <tabbar-item selected link="/index" @on-item-click="getIndex()">
        <img slot="icon" src="../assets/img/tabbar/home.png">
        <img slot="icon-active" src="../assets/img/tabbar/homeon.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item link="/userInfo" @on-item-click="getIndex()">
        <img slot="icon" src="../assets/img/tabbar/user.png">
        <img slot="icon-active" src="../assets/img/tabbar/useron.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
</template>
<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'xFooter',
  components: {
    Tabbar,
    TabbarItem
  },
  created () {
    let a = this
    console.log('a', a)
  },
  updated () {
    let a = this.$refs.Tabbar
    console.log('a', a)
  },
  methods: {
    getIndex () {
      let self = this
      let b = self.$refs.tabbar
      console.log('a', b)
    },
    setIndex (index) {
      let self = this
      self.$refs.tabbar.currentIndex = index
      self.$refs.tabbar.index = index
      console.log('tabbar设置为', self.$refs.tabbar.currentIndex, self.$refs.tabbar.index)
      // b.currentIndex = index
      // b.index = index
      // Tabbar.$emit('on-item-click', index)
    }
  }
}
</script>
<style lang="less">
</style>


