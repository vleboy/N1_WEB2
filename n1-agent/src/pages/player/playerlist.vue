<template>
  <div class="p-playerlist">
    <div class="propList-search">
      <Row class="row -search-row">
        
        <Col span="2" :offset="level ? '2' : '4'">玩家ID</Col>
        <Col span="4">
        <Input v-model="searchInfo.userId" placeholder="请输入"></Input>
        </Col>

        <Col span="2" >玩家账号</Col>
        <Col span="4">
        <Input v-model="searchInfo.userName" placeholder="请输入"></Input>
        </Col>

        <Col span="2" v-if="level">游戏状态</Col>
        <Col span="4" v-if="level" >
        <Select v-model="searchInfo.gameId" clearable placeholder="请选择游戏状态" style="text-align: left">
          <Option v-for="(item, index) in gameTypeList" :value="item.code" :key="index">{{ item.name }}</Option>
        </Select>
        </Col>

        <Col span="4">
        <div class="btns">
          <Button type="primary" @click="getSearch(true)">搜索</Button>
          <Button type="ghost" @click="getSearch(false)">重置</Button>
        </div>
        </Col>

      </Row>
      <Row class="row " v-if="!level">
        <Col span="2" offset="4">游戏状态</Col>
        <Col span="4">
        <Select v-model="searchInfo.gameId" clearable placeholder="请选择游戏状态" style="text-align: left">
          <Option v-for="(item, index) in gameTypeList" :value="item.code" :key="index">{{ item.name }}</Option>
        </Select>
        </Col>

        <Col span="2">直属代理</Col>
        <Col span="4">
          <Input v-model="searchInfo.merchantName" placeholder="请输入代理昵称"></Input>
        </Col>

      </Row>
    </div>

    <div class="playerform">
      <!--<Row style="margin-bottom: 2rem">-->
        <!--<Col :span="3">-->
          <!--<Button type="primary" @click="openAdd()">创建玩家</Button>-->
        <!--</Col>-->
        <!--<Col :span="21" style="text-align: right">-->
          <!--<Button type="primary" @click="allChangeState(0)">批量锁定</Button>-->
          <!--<Button type="primary" @click="allChangeState(1)">批量解锁</Button>-->
        <!--</Col>-->
      <!--</Row>-->
      <Table :columns="columns" :data="getItems"></Table>
      <div style="text-align: right;margin:2rem 0">
        <Page :total="playerList.length"
              show-elevator
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"></Page>
      </div>
    </div>

    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <playerRecharge v-if="isOpenModal" ref="childMethod" :dataProp="balanceInfo" @closeModal="closeRechargeModal"></playerRecharge>
  </div>
</template>

<script type="text/ecmascript-6">
  import { httpRequest } from '@/service/index'
  import dayjs from "dayjs";
  import { formatUserName, unFormatUserName, thousandFormatter } from '@/config/format'
  import playerRecharge from '@/components/player/playerRecharge'
  export default {
    components:{ playerRecharge },
    data () {
      return {
        nowSize: 20,
        nowPage: 1,
        pageSize: 100,
        currentPage: 1,
        showSearch: false,
        isOpenModal: false,
        isFetching: false,
        isLastMessage: false, // 主要判断是否是后台返回最后一次信息
        playerList: [],
        playerStatus: ['已锁定', '正常'],
        checkedArray: [],
        names: [],
        GameListEnum: [
        {code: "0",name: '离线'},
        {code: '1', name: '大厅'},
        { company: "NA", code: "70000", name: "H5电子游戏" },
        { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" },
        { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        { company: "TTG", code: "1010000", name: "TTG电子游戏" },
        { company: "PNG", code: "1020000", name: "PNG电子游戏" },
        { company: "MG", code: "10300000", name: "MG电子游戏" },
        { company: "HABA", code: "1040000", name: "HABA电子游戏" },
        { company: "AG", code: "1050000", name: "AG真人游戏" },
        { company: "SA", code: "1060000", name: "SA真人游戏" },
        { company: "SA", code: "1110000", name: "SA捕鱼游戏" },
        { company: "PG", code: "1090000", name: "PG电子游戏" },
        { company: "YSB", code: "1130000", name: "YSB体育游戏" },
        { company: "RTG", code: "1140000", name: "RTG电子游戏" },
        { company: "SB", code: "1080000", name: "SB电子游戏" },
        { company: "SB", code: "1120000", name: "SB真人游戏" },
        { company: "DT", code: "1150000", name: "DT电子游戏" },
        { company: "PP", code: "1160000", name: "PP电子游戏" }
      ],
        searchInfo: {
          gameId:'',
          userName:'',
          userId:'',
          merchantName:''
        },
        balanceInfo: {},
        gameTypeList: [],
        playerListStorage: [],
        playerListStartKey: '',
        columns: [
          {
            title: '玩家ID',
            align: 'center',
            key: 'userId',
            maxWidth: 80
          },
          {
            title: '玩家账号',
            align: 'center',
            key: 'userName'
          },
          {
            title: '所属代理',
            align: 'center',
            key: 'merchantName',
            render: (h,params)=>{
              return h('Button',{
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color:'#20a0ff'
                },
                on: {
                  click: () => {
                    this.jumpAgentDetail(params.row)
                  }
                }
              },params.row.merchantName)
            }
          },
          {
            title: '玩家昵称',
            align: 'center',
            key: 'nickname',
            render: (h,params) => {
              return h('span', params.row.nickname === 'NULL!' ? '-' : params.row.nickname)
            }
          },
          {
            title: '状态',
            align: 'center',
            key: 'state',
            maxWidth: 85,
            render: (h,params) => {
              return h('Tag', {
                props: {
                  type: 'border',
                  color: params.row.state ? 'green' : 'red'
                }
              },this.playerStatus[params.row.state])
            }
          },
          {
            title: '游戏状态',
             maxWidth: 85,
            align: 'center',
            key: 'gameState',
            render: (h,params) => {
              return h('Tag', {
                props: {
                  type: 'border',
                  color: (params.row.gameState==3||params.row.gameState==2) ? 'green' : ''
                }
              },params.row.gameStateName)
            }
          },
          {
            title: '点数',
            align: 'center',
            key: 'balance',
            render: (h,params) => {
              return h('span', thousandFormatter(params.row.balance))
            }
          },
          {
            title: "注册时间",
            align: 'center',
            key: "createdAt",
            sortable: true,
            render: (h, params) => {
              return h(
                "span",
                dayjs(params.row.createdAt).format("YYYY-MM-DD")
              );
            }
          },
          {
            title: '最近登录时间',
            align: 'center',
            key: 'joinTime',
            render: (h, params) => {
              return h("span", 
              params.row.joinTime ? dayjs(params.row.joinTime).format("YYYY-MM-DD HH:mm:ss") : '');
            }
          },
          // {
          //   title: '备注',
          //   key: '',
          //   render: (h, params) => {
          //     let remark = params.row.remark;
          //     if (remark != "NULL!") {
          //       return h(
          //         "Tooltip",
          //         {
          //           props: {
          //             content: remark
          //           }
          //         },
          //         [
          //           h("Icon", {
          //             props: {
          //               type: "search",
          //               color: "#20a0ff"
          //             }
          //           })
          //         ]
          //       );
          //     } else {
          //       return h("span", "暂无");
          //     }
          //   }
          // },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color:'#20a0ff'
                  },
                  on: {
                    click: () => {
                      this.playDetail(params.row)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color:'#20a0ff'
                  },
                  on: {
                    click: () => {
                      this.changeStatus(params.row)
                    }
                  }
                }, params.row.state ? '停用' : '开启'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color:'#20a0ff'
                  },
                  on: {
                    click: () => {
                      this.openModal(0,params.row)
                    }
                  }
                },'存点'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color:'#20a0ff'
                  },
                  on: {
                    click: () => {
                      this.openModal(1,params.row)
                    }
                  }
                },'提点'),
              ]);
            }
          }
        ],
        level: +localStorage.level
      }
    },
    created () {
      this.level &&  this.getPlayList()
      this.getGameTypeList()
    },
    computed: {
      getItems () {
        if (this.nowPage === 1) {
          return this.playerList.slice(0, this.nowSize)
        } else {
          return this.playerList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
        }
      },
      optionOne_label () {
        var name = localStorage.loginUsername.split('_')[1]
        var x = ''
        if (localStorage.loginUsername.split('_')[0] === 'Agent') {
          x = '【平台管理员】'
        } else {
          x = localStorage.loginUsername.split('_')[0]
        }
        return x + ' ' + name
      } // 管理员姓名
    },
    methods: {
      playDetail (row) {
        localStorage.setItem('playerName', row.userName)
        this.$router.push({
          name:'playDetail',
          query:{
            name:row.userName
          }
        })
      },
      getPlayList () {
        if(this.isFetching) return
        this.isFetching = true
        this.searchInfo.startKey = this.playerListStartKey
        this.searchInfo.pageSize = this.pageSize
        httpRequest('post','/player/list',this.searchInfo)
        .then(result => {
            this.isLastMessage = result.list < this.pageSize
            this.playerList = result.list
            this.playerListStartKey = result.startKey
            this.playerListStorage.length && (this.playerList = this.playerListStorage.concat(this.playerList))
          }
        ).finally(()=>{
          this.isFetching = false
        })
      },
      changeStatus (row) {
        this.$Modal.confirm({
          title: "提示!",
          content: `<p>是否${row.state ? '停用' : '启用'}该玩家？</p>`,
          onOk: () => {
            httpRequest('post','/player/forzen',{
              userName: row.userName,
              state: row.state ? 0 : 1
            }).then(res => {
              this.$Message.success('状态改变成功')
              row.state = row.state ? 0 : 1 // 本地修改状态
            });
          }
        });
      }, // 更改玩家状态
      openAdd () {
        this.$router.push({
          name:'addPlayer'
        })
      }, // 打开创建玩家
      openModal (bool, row) {
        let rows = JSON.parse(JSON.stringify(row))
        this.isOpenModal = true
        this.balanceInfo = {
          userName: rows.userName,
          parentName: rows.merchantName,
          remark: '',
          balance: rows.balance,
          points: '',
          fromUserId: rows.parent,
          isSave: bool
        }
        setTimeout(()=>{
          this.$refs.childMethod.openRechargeModal()
        },0)
      },
      closeRechargeModal () {
        this.initData()
        this.getPlayList()
      },
      getNowpage (page) {
        this.nowPage = page
        if((page == Math.ceil(this.playerList.length/this.nowSize) && !this.isFetching) && (page != 1) && !this.isLastMessage) {
          this.playerListStorage = JSON.parse(JSON.stringify(this.playerList))
          this.getPlayList()
        }
      },
      getSearch (bool) {
        !bool && (this.searchInfo = {
          gameId:'',
          userName:'',
          nickname:'',
          merchantName:'',
          msn:''
        })
        this.initData()
        this.getPlayList()
      },
      jumpAgentDetail (row) {
//        console.log(row)
        this.$router.push({
          name: 'agentDetail',
          query:{
            userId : row.parent,
            username : row.merchantName,
            parent : row.parent
          }
        })
      },
      getGameTypeList () {
        /* httpRequest('post','/gameBigType',{
          companyIden: -1
        },'game').then(
          result => {
            for (let item of result.payload) {
              if (item.code != '10000') {
                this.gameTypeList.push(item)
              }
            }
            this.gameTypeList.unshift({
              code: '0',
              name: '离线'
            },{
              code: '1',
              name: '大厅'
            })
          }
        ) */
         this.gameTypeList = this.GameListEnum
      },
      initData () {
        this.playerList = []
        this.playerListStorage = [];
        this.playerListStartKey = '';
        this.currentPage = 1
      }
    }
  }
</script>

<style scpoed type="text/less" lang="less">
  .p-playerlist {
    min-height: 89vh;
    .propList{
      padding:1rem 2rem;
    }
    .-list-btn{
      padding: 16px 0;
    }
    .-search-row{
      padding-bottom:10px;
    }
    .propList-search{
      line-height: 32px;
      text-align: center;
      padding-bottom: 6px;
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
    /deep/ .ivu-table-cell {
      padding: 0;
    }
  }
</style>
