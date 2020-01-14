<template>
  <div class="userInfo" v-show="onLogin">
    <div class="user-view">

      <div>
        <group  v-for="(value,key) in onLogin" :key="key">
          <cell v-if="onLogin && key === 'user_disp'"   :title="'用户姓名：'" :value="value !== null ? value : '-'"></cell>
          <cell v-else-if="onLogin && key === 'user_no'"   :title="'帐号：'" :value="value !== null ? value : '-'"></cell>
          <cell v-else-if="onLogin && key === 'email'"   :title="'邮箱：'" :value="value !== null ? value : '-'"></cell>
          <cell v-else-if="onLogin && key === 'mobile'"   :title="'手机：'" :value="value !== null ? value : '-'"></cell>
          <cell v-else-if="onLogin && key === 'real_name'"   :title="'姓名：'" :value="value !== null ? value : '-'"></cell>
          <cell v-else-if="onLogin && key === 'dept_no'"   :title="'部门编号：'" :value="value !== null ? value : '-'"></cell>
        </group>
      </div>
      <div style="padding:15px;">
        <x-button v-show="logined" @click.native="onCler" type="warn"> 解除绑定</x-button>
        <x-button v-show="!logined" @click.native="goLogin" type="warn"> 未登录</x-button>
      </div>

    </div>
  </div>
</template>
<script>
import { Badge, GroupTitle, Group, Cell, XButton } from 'vux'
import { mapGetters } from 'vuex'
import Emitter from '../../assets/js/mixins/emitter.js'
export default {
  name: 'userInfo',
  mixins: [Emitter],
  components: {
    Badge, Group, Cell, GroupTitle, XButton
  },
  computed: mapGetters([
    'onLogin',
    'logined'
  ]),
  created () {
    if (this.$store.getters.logined) {

    } else {

    }
  },
  updated () {
    if (this.$store.getters.logined) {

    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    onCler () {
      let self = this
      this.$vux.confirm.show({
        title: '操作提示',
        content: '确认要解绑当前帐号？',
        // 组件除show外的属性
        onCancel () {
          console.log(this) // 非当前 vm
          // console.log(_this) // 当前 vm
        },
        onConfirm () {
          let promise = new Promise((resolve, reject) => {
            let untied = self.$http.post(self.$api.untied)
            resolve(untied)
          })
          promise.then((e) => {
            console.log('untied', e)
            if (e.data.state === self.$api.byState) {
              console.log('untied.data', e.data)
              self.$vux.toast.show({
                text: e.data.resultMessage,
                // type: 'warn',
                isShowMask: true
              })
              let users = {}
              users['logined'] = false
              self.$store.dispatch({
                type: 'logined',
                amount: users
              })
              self.goLogin()
            } else {
              self.$vux.toast.show({
                text: e.data.resultMessage,
                type: 'warn',
                isShowMask: true
              })
            }
          })
        }
      })
    },
    goLogin () {
      let self = this
      // let a = this.$parent.$children
      // console.log(a)
      self.dispatch('app', 'tabbar', 0)
      this.$router.replace('/login')
    }
  }

}
</script>
<style lang="less">
.user-view{
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .weui-cells{
    margin-top: 0;
  }
}
</style>

