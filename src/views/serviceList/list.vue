<template>
  <div>
    <scroller lock-x scrollbar-y use-pullup use-pulldown height="-0" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
      <div>
    <search ref="search" v-model="searchValue" position="absolute" placeholder="只能输入String类型的查询" @on-cancel="clearSearch" @on-clear="clearSearch" @on-submit="getListData"></search>      
      <Group>
        <cell-box is-link border-intent v-for="(item,index) in list" :key="index" :link="{path:'/detail/'+serviceName+'/'+item.id}">
            <div class="cell-box-body" style="" @click.stop>
              <div class="cell-box-rows">
                  <span v-if = "item.column1 != null">{{item.column1.label}}：{{item.column1.value}}</span>
                  <span v-if = "item.column2 != null">{{item.column2.label}}：{{item.column2.value}}</span>
              </div>
              <div class="cell-box-rows">
                <span v-if = "item.column3 != null">{{item.column3.label}}：{{item.column3.value}}</span>
                <span>
                    <x-icon type="ios-checkmark"  class="cell-x-icon" @click="update(item.id)" ></x-icon>
                    <x-icon type="ios-minus-outline"  class="cell-x-icon" @click="deleteData(item.id)" ></x-icon>
                </span>
              </div>
            </div>
        </cell-box>
      </Group>
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import { Panel, Group, Radio, Scroller, Divider, Spinner, Cell, CellBox, Search } from 'vux'
import { mapGetters } from 'vuex'
export default {
  components: {
    Panel,
    Group,
    Radio,
    Scroller,
    Divider,
    Spinner,
    Cell,
    CellBox,
    Search
  },
  computed: mapGetters([
    'headrBar'
  ]),
  data () {
    return {
      list: [],
      footer: {
        title: '结尾',
        url: 'http://vux.li'
      },
      header: '表头',
      rownumber: 10,
      pageNo: 1,
      total: 0,
      searchValue: '',
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      serviceName: this.$route.params.serviceName
    }
  },
  created: function () {
    // 获取数据，
    this.getListData()
  },
  methods: {
    async getListData () {
      let self = this
      // self.$route.meta.title = '邮件模板列表'
      let headrlist = [
        {
          type: 'add',
          url: '/add/' + self.serviceName.replace('select', 'add')
        }
      ]
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: headrlist
      })
      let CallbackGoHome = function (response) {
        if (response.data.data !== '') {
          self.total = response.data.page.total
          let resNum = response.data.data.length
          // self.list = self.list.concat(response.data.data)
          let data = response.data.data
          let CallbackGoHome1 = function (response) {
            if (response.data.data !== '') {
              let data1 = response.data.data
              let list1 = []
              for (let key in data) {
                let map = {}
                for (let key1 in data1) {
                  if (data1[key1].columns === 'id') {
                    map.id = data[key][data1[key1].columns]
                  }
                  if (data1[key1].columns === 'create_user_disp') {
                    map.column3 = {
                      label: data1[key1].label,
                      value: data[key][data1[key1].columns]
                    }
                  }
                  if (key1 === '1') {
                    map.column1 = {
                      label: data1[key1].label,
                      value: data[key][data1[key1].columns]
                    }
                  }
                  if (key1 === '2') {
                    map.column2 = {
                      label: data1[key1].label,
                      value: data[key][data1[key1].columns]
                    }
                  }
                }
                list1.push(map)
              }
              if (self.pageNo === 1) { // 如果不是第一页就累加
                self.list = list1
              } else {
                self.list = self.list.concat(list1)
              }

              self.$vux.toast.show({
                type: 'text',
                text: '加载了' + resNum + '条'
              })
            }
          }

          let req1 = {
            serviceName: 'srvsys_service_columns_select',
            colNames: [
              'columns',
              'label'
            ],
            condition: [
              {
                'colName': 'service_name',
                'value': self.serviceName,
                'ruleType': 'eq'
              },
              {
                'colName': 'in_list',
                'value': '1',
                'ruleType': 'eq'
              }
            ],
            order: [
              {
                'colName': 'seq',
                'orderType': 'asc'
              }
            ]
          }
          self.crosAjaxData(self.$api.select, 'post', req1, CallbackGoHome1)
        }
      }
      let req = {
        serviceName: self.serviceName,
        colNames: ['*'],
        page: {
          'pageNo': self.pageNo,
          'rownumber': self.rownumber
        },
        condition: [],
        order: [
          {
            'colName': 'create_time',
            'orderType': 'desc'
          }
        ]
      }
      if (self.searchValue !== '') {
        let relationCondition = {}
        let req2 = {
          serviceName: 'srvsys_service_columns_select',
          colNames: [
            'columns'
          ],
          condition: [
            {
              colName: 'service_name',
              value: self.serviceName,
              ruleType: 'eq'
            },
            {
              colName: 'in_cond',
              value: '1',
              ruleType: 'eq'
            },
            {
              colName: 'col_type',
              value: 'String',
              ruleType: 'eq'
            }
          ],
          order: [
            {
              colName: 'seq',
              orderType: 'asc'
            }
          ]
        }
        const response = await this.$http.post(this.$api.select, req2)
        let list1 = response.data.data
        if (list1.length > 0) {
          relationCondition.relation = 'or'
          relationCondition.data = []
          for (let key in list1) {
            relationCondition.data.push({
              'colName': list1[key].columns,
              'value': self.searchValue,
              'ruleType': '[like]'
            })
          }
        }
        req.relation_condition = relationCondition
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGoHome)
    },
    clearSearch () {
      this.searchValue = ''
    },
    loadMore () {
      // 加载更多
      let self = this
      setTimeout(() => {
        self.pageNo += 1
        if (self.list.length >= self.total) {
          self.$vux.toast.show({
            text: '没有更多了',
            type: 'text',
            time: 2000,
            isShowMask: true
          })
        } else {
          self.$refs.scroller.donePullup()
          self.$vux.toast.show({
            type: 'text',
            text: '加载中'
          })
          setTimeout(() => {
            self.getListData()
          }, 10)
        }
      }, 1000)
    },
    refresh () {
      // 刷新
      setTimeout(() => {
        this.list = []
        this.rownumber = 10
        this.pageNo = 1
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              this.getListData()
            )
            this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    },
    // 修改
    update (val) {
      this.$router.push({ name: 'update', params: {serviceName: this.serviceName.replace('select', 'update'), id: val} })
    },
    deleteData (val) {
      let self = this
      self.$vux.toast.show({
        type: 'text',
        text: '要删除的是' + val
      })
    }
  }
}
</script>
<style lang="less">
.cell-box-body{
  display:flex;
  width:100%;
  padding-right:2em; 
  flex-direction: column;
  .cell-box-rows{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    span{
      color: #525252;
      font-size:0.8rem;
      padding: 0 0.4em;
    }
  }
  h1,h2,h3,h4,h5,h6{
    margin: 0.5em 0 0 0;
  }
  p{
    margin:  0.2em 0;
    color: #999
  }
}
.cell-x-icon {
  fill: green;
}
</style>