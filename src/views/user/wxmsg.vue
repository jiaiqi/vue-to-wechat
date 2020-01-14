<template>
  <div class="wxmsg" >
     <card :header="{title:msg.title}" :footer="{title:'通知时间：' + msg.send_time}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div v-html="msg.body_content" class="msg-body"></div>
      </div>
    </card>
    </div>
</template>
<script>
import { Card, Group } from 'vux'
export default {
  components: {
    Card, Group
  },
  data () {
    return {
      msg: {
        body_content: '<div style="min-width:90%;padding:20px 20px;text-align:center;margin:0 auto;border:1px solid #fff;">\r\n\t<ul style="text-align:left;border:1px solid #3399cc;padding:10px;background-color:#f7ffff;">\r\n\t\t<li style="list-style:none;">\r\n\t\t\t<h5><span style="min-width:60px;padding:5px 10px;color:#888;font-size:12px;">任务编号：</span><span style="color:#006699;">VR201901290005</span></h5>\r\n\t\t</li>\r\n\t\t<li style="list-style:none;">\r\n\t\t\t<h5><span style="min-width:60px;padding:5px 10px;color:#888;font-size:12px;">任务名称：</span><span style="color:#006699;">fdfdf</span></h5>\r\n\t\t</li>\r\n\t\t<li style="list-style:none;">\r\n\t\t\t<h5><span style="min-width:60px;padding:5px 10px;color:#888;font-size:12px;">提交人：</span><span style="color:#006699;">管理员/admin</span></h5>\r\n\t\t</li>\r\n\t\t<li style="list-style:none;">\r\n\t\t\t<h5><span style="min-width:60px;padding:5px 10px;color:#888;font-size:12px;">责任人：</span><span style="color:#006699;">王永宏/11000003</span></h5>\r\n\t\t</li>\r\n\t\t<li style="list-style:none;">\r\n\t\t\t<h5><span style="min-width:60px;padding:5px 10px;color:#888;font-size:12px;">起止时间：</span><span style="color:#006699;">2019-01-29 10:32:27至2019-01-30 10:32:27</span></h5>\r\n\t\t</li>\r\n\t\t<li style="list-style:none;">\r\n\t\t\t<p><span style="min-width:60px;padding:5px 10px">请您点击链接，进入系统处理，地址：</span><a href="http://IT.vanxvm.com">http://IT.vanxvm.com</a></p>\r\n\t\t</li>\r\n\t</ul>\r\n</div>',
        title: '您有一条待审批的任务',
        send_time: '2019/01/31 06:22'
      }
    }
  },
  created () {
    this.$store.commit('hideLeftBack')
    let id = this.$route.query.id
    this.getMsgBody(id)
  },
  methods: {
    async getMsgBody (e) {
      let self = this
      let req = {
        'serviceName': 'srvsys_wx_msg_body_select',
        'colNames': [
          '*'
        ],
        'condition': [
          {
            'colName': 'id',
            'value': e,
            'ruleType': 'eq'
          }
        ]
      }
      let msgbody = await this.$http.post(this.$api.select, req)
      if (msgbody.body.data.length > 0) {
        self.msg = msgbody.body.data[0]

        self.showLoading(false)
      } else {
        console.error('消息获取失败')
      }
    }
  }
}
</script>
<style lang="less">
.wxmsg{
  .weui-panel{

    .weui-panel__hd{
      font-size:1rem;
      color: #333;
      
        text-align: center;
      font-weight: 600;
    }
    .weui-panel__ft{
      a{
        text-decoration: none;
      }
    }
    .msg-body ul{
      li:last-child{
        display: none;
      }
    }
  }
}
</style>