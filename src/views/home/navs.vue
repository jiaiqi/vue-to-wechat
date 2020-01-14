<template>
<div>
    <xNavItems :firstData="topMenus"></xNavItems>
      <div v-transfer-dom>
        <loading :show="showLoading" text="加载中"></loading>
      </div>
</div>
</template>
<script>
import xNavItems from '../../components/navItem.vue'
import Emitter from '../../assets/js/mixins/emitter.js'
import { Divider, Card, TransferDomDirective as TransferDom, Loading } from 'vux'

export default {
  name: 'xNavs',
  directives: {
    TransferDom
  },
  mixins: [Emitter],
  components: {
    Card,
    Divider,
    xNavItems,
    Loading
  },
  data () {
    return {
      data: [],
      topMenus: [],
      showLoading: true
    }
  },
  created () {
    this.topMenus = this.$store.getters.selectByUser
    this.$on('on-nav-item', (event) => {
      // console.log('navs2', event)
      this.showLoading = event
      // this.fields.push(event)
    })
  }
}
</script>