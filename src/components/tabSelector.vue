<template>
    <div class="tabs-selector">
        <tab :animate="false" :line-width="1">
        <!-- <tab-item v-for="(item,index) in tabsData" :key="index" @on-item-click="handler">{{item.section}}</tab-item> -->
        <tab-item v-for="(item,index) in tabsData" :key="index" disabled>
            
            <span>Selected: {{ selected }}</span>
            <select v-model="selected" class="selector" style="width: 50px;">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
            </select>
        </tab-item>
      </tab>
      <div v-transfer-dom>
    <!-- <popup v-model="showPopup" position="top" max-height="50%" width="30%" :show-mask="false" :is-transparent="true" :popup-style="{'top':'98px','width':'200px','-webkit-box-shadow':' 0px 0px 6px #d8d8d8','box-shadow': '0px 0px 6px #d8d8d8','background':'#ffffff'}">
        <group>
          <cell v-for="i in 20" :key="i" :title="i"></cell>
        </group>
        <div style="padding: 15px;">
          <x-button @click.native="showPopup = false" plain type="primary"> Close Me </x-button>
        </div>
      </popup> -->
      </div>
    </div>
</template>
<script>
import {Group, Cell, Tab, TabItem, Popup, XButton, TransferDom} from 'vux'
export default {
  name: 'xTabsSelector',
  data () {
    return {
      showPopup: false,
      tabs: [],
      selected: ''
    }
  },
  directives: {
    TransferDom
  },
  props: {
    tabsData: Array
  },
  components: { Group, Cell, Popup, Tab, TabItem, XButton, TransferDom },
  methods: {
    handler: function () {
      this.showPopup = true
      console.log('handler2')
    },
    onselect: function (e) {
    //   this.showPopup = true
      console.log('onselect2', e)
    }
  }
}
</script>
<style lang="less">
.tabs-selector{
    .vux-tab.vux-tab-no-animate .vux-tab-item.vux-tab-selected {
        background: none;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
        color: #FF9900;
        border-bottom: 3px solid #e5e5e5;
    }
    .selector{
        width: 100%;
        border-width: 0;
    }
    .vux-tab .vux-tab-item{
        padding-bottom: 1px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    select option:hover { 
        background-color: #f80; 
        color: #fff; 
    }}
</style>
