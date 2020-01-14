<template>
 <div>
   <iframe :src="url" ></iframe>
   <!-- <v-html-panel :url.asyc="url1"></v-html-panel> -->
 </div>
</template>
<style scoped>
 p{color:red}
</style>
<script>
 export default{
   data () {
     return {
       url: '',
       codeUrl: '/vxAuthor?code=081JpYpb2fu7IO0an3sb2yrbqb2JpYpy&state=e77879dab5f4497083b8957366575d58',
       wxCode: {}
     }
   },
   mounted () {
    //  this.url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx78d1d4139f97ffca&redirect_uri=http%3A%2F%2Fwww.100xsys.cn%2Fwxhome&response_type=code&scope=snsapi_base&state=3cec93b69a7c4d1199da0069e325efd7#wechat_redirect'
    //  this.getAuthorized(this.$route.path)
    //  this.$router.push(this.codeUrl)
   },
   created () {
     if (this.$route.query.code) {
       let code = this.$route.query.code
       let state = this.$route.query.state
       console.log(code, state)
       this.wxCode['code'] = code
       this.wxCode['state'] = state
       console.log(this.wxCode)
       this.saveWxUser(this.wxCode)
     }
   },
   methods: {
 
   }
 }
</script>