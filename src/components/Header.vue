<template>
<div style="    height: 46px;">
  <x-header :right-options="{showMore: getHeadrBar.showMenus}" @on-click-more="clickMore" :left-options="{showBack: showLeftBack}">{{title}}
     <!-- <x-button><x-icon v-if="data.type === 'search'" type="ios-search-strong"  class="cell-x-icon" ></x-icon></x-button> -->
    <!-- <router-link v-for="(data, key) in getHeadrBar.buttons" v-if="data.type === 'add'" :key="key" slot="right" :to="data.url">       
        <x-icon v-if="data.type === 'add'" type="ios-plus"  class="cell-x-icon"></x-icon>
    </router-link>
     -->
      <x-icon v-for="(data) in getHeadrBar.buttons" :key="data.type" v-if="data.type === 'add'" type="ios-plus-outline" slot="right" @click.native="goPage(data.cfg)"  class="cell-x-icon" size="30"></x-icon>
      <x-icon v-for="(data) in getHeadrBar.buttons" :key="data.type" v-if="data.type === 'search'" type="ios-search-strong" slot="right"  @click.native="setShowSearch" class="cell-x-icon" size="30"></x-icon>

  </x-header>
      <div v-transfer-dom>
      <actionsheet theme="android" :menus="getHeadrBar.menus" @on-click-menu="clickMenu" v-model="showMenusa" show-cancel @on-after-hide="afterHide"></actionsheet>
    </div>
</div>
</template>
<script>
import { XHeader, Actionsheet, TransferDom, ButtonTab, ButtonTabItem } from 'vux'
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters([
    'showMenus',
    'showLeftBack',
    'getHeadrBar'
  ]),

  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Actionsheet,
    ButtonTab,
    ButtonTabItem,
    TransferDom
  },
  data () {
    return {
      // title: this.pageTitle
      showMenusa: false
    }
  },
  methods: {
    clickMenu: function (key, item) {
      console.log(key, item)
    },
    clickMore: function () {
      this.showMenusa = true
    },
    afterHide: function () {
      this.$store.dispatch({type: 'hideMenus'})
    },
    setShowSearch: function () {
      let self = this
      self.$store.commit('setShowSearch', true)
    },
    goPage (e) {
      this.$router.push(e)
    }
  },
  props: {
    title: {
      type: String,
      required: true
    }
  }

}
</script>
<style>
.cell-x-icon {
  fill: green;
}

</style>