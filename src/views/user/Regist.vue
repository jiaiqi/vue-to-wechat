<template>
  <div class="regist">
    <flexbox orient="vertical" align="center">
      <flexbox-item>
          <group title="请按照要求填写帐号信息" label-width="5.5em" label-margin-right="0.5em" label-align="justify">
              <x-input title="手机号" name="mobile" placeholder="请输入手机号" v-model="mobile" keyboard="number" is-type="china-mobile" required></x-input>
              <x-input title="验证码" type="text" placeholder="请输入验证码" v-model="code" required>
                  <x-button slot="right" type="primary" mini :disabled="getCode.disabled" @click.native="handleGetCode" style="width: 100px;">{{getCode.txt}}</x-button>
              </x-input>
              <x-input title="密码" type="password" placeholder="请设置登录密码" v-model="password" :min="6" :max="16" required></x-input>
              <x-input title="重复密码" type="password" placeholder="确认密码" v-model="passwordC" :min="6" :max="16" required></x-input>
          </group>
          <divider> 注册后，您的微信账号和手机号都可以登录</divider>
          <box gap="10px 25px">
              <x-button type="primary" @click.native="handleRegist">注册</x-button>
          </box>
      </flexbox-item>
      <flexbox-item :order="99" style="align-self:flex-end">
            <divider style="position:fixed; bottom:0;"><router-link to="/Login">已有账号？去登录</router-link></divider>
      </flexbox-item>
    </flexbox>
        
    </div>
</template>
<script>
import { XInput, Box, Group, XButton, Divider, Flexbox, FlexboxItem } from 'vux'
export default {
  name: 'regist',
  components: {
    XInput,
    Box,
    Group,
    XButton,
    Divider,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      mobile: '', // 手机号
      code: '', // 验证码
      password: '', // 密码
      passwordC: '', // 确认密码
      getCode: {
        txt: '获取验证码',
        disabled: false
      }
    }
  },
  methods: {

  }
}
</script>
<style scoped lang="less">
.vux-flexbox{
 height: 90vh;
}
</style>