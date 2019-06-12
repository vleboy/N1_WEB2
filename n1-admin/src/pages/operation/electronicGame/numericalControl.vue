<template>
  <div class="control">
    <div style="margin-bottom:1rem">
      <Select style="width:200px;" ref="resetSelect" clearable v-model="model1" size="small"> 
        <Option
          v-for="(item, index) in gameType"
          :value="item.name"
          :key="item.name"
          @click.native="selGame(item.code)"
        >{{item.name}}</Option>
      </Select>
    </div>  
    <div style="merchant">
      <Table :columns="columns0" :data="merchantList" size="small">
        <template
          slot-scope="{row, index}"
          slot="parentDisplayName"
        >{{`${row.parentDisplayName}(${row.parentSuffix})`}}
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="text" style="color:#20a0ff;cursor:pointer" @click="setGameConfig(row)">设置</Button>
          <Button type="text" style="color:#20a0ff;cursor:pointer" @click="addGameConfig(row)">新增</Button>
        </template>
      </Table>
    </div>

    
    <Modal v-model="modal1" :title="merchantId" footer-hide width="65">
      <div style="height:400px;over-flow:auto">
        <div>
      <Table :columns="columns1" :data="mysArr" style="margin-bottom: 1rem" size="small">
        <template slot-scope="{row, index}" slot="prizeOperate">
          <span style="cursor:pointer;color:#20a0ff" @click="prizeOperateConfig(row)">修改并启用配置</span>
        </template>
      </Table>
      </div>
      <div>
        <Table :columns="columns2" :data="noMysArr" size="small">
          <template slot-scope="{row, index}" slot="noOperate">
            <span style="cursor:pointer;color:#20a0ff" @click="prizeOperateConfig(row)">修改并启用配置</span>
          </template>
        </Table>
      </div>
      </div>
    </Modal>

    <!-- <Modal v-model="modal2" :title="merchantId" footer-hide width="65">
      <div style="height:400px;over-flow:auto">
        <div>
      <Table :columns="columns1" :data="mysArr" style="margin-bottom: 1rem" size="small">
        <template slot-scope="{row, index}" slot="prizeOperate">
          <span style="cursor:pointer;color:#20a0ff" @click="addPrizeOperateConfig(row)">修改并启用配置</span>
        </template>
      </Table>
      </div>
      <div>
        <Table :columns="columns2" :data="noMysArr" size="small">
          <template slot-scope="{row, index}" slot="noOperate">
            <span style="cursor:pointer;color:#20a0ff" @click="addPrizeOperateConfig(row)">修改并启用配置</span>
          </template>
        </Table>
      </div>
      </div>
      
    </Modal> -->


    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>

import { httpRequest, getMerchants } from "@/service/index";
import { numGameList } from "@/config/getGameType";
export default {
  created() {
    this.getGameList()
    this.getMerchantList();
  },
  data() {
    return {
      model1: '全部游戏',
      gameId: '',
      spinShow: false,
      modal1: false,
      merchantId: '',
      merchantList:[],
      userId: '',
      gameType: [],
      dataList: [],
      mysArr: [],
      noMysArr: [],
      columns0: [
        {
          title: "序号",
          type: "index",
          align: "center",
          maxWidth: 80
        },
        {
          title: "商户ID",
          key: "displayId",
          sortable: true,
          align: "center"
        },
        {
          title: "商户标识",
          key: "sn",
          sortable: true,
          align: "center"
        },
        {
          title: "商户昵称",
          key: "displayName",
          sortable: true,
          align: "center"
        },
        {
          title: "上级线路商",
          slot: "parentDisplayName",
          sortable: true,
          align: "center"
        },
        {
          title: "玩家数量",
          key: "playerCount",
          align: "center"
        },
        {
          title: "操作",
          slot: "operate",
          align: "center"
        },
      ],
      columns1: [
        {
          title: "游戏系列-神秘大奖版",
          align: 'center',
          key: "gameType",
        },
        {
          title: "数值配表",
          key: "option",
          align: 'center',
          minWidth: 600,

          render: (h, params) => {
            return h(
              "RadioGroup",
              {
                props: {
                  value: params.row.killRateLevel
                },
                on: {
                  "on-change": val => {
                    params.row.killRateLevel = val;
                  }
                }
              },
              [
                h(
                  "Radio",
                  {
                    props: {
                      label: 0
                    }
                  },
                  "配置0-默认配置"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 1
                    }
                  },
                  "配置1-88%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 2
                    }
                  },
                  "配置2-90%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 3
                    }
                  },
                  "配置3-92%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 4
                    }
                  },
                  "配置4-94%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 5
                    }
                  },
                  "配置5-96%"
                )
              ]
            );
          }
        },
        {
          title: "操作",
          slot: "prizeOperate",
          align: "center"
        }
      ],
      columns2: [
        {
          title: "游戏系列-无大奖版",
          key: "gameType",
          align: 'center'
        },
        {
          title: "数值配表",
          key: "option",
          align: "center",
          minWidth: 600,
          render: (h, params) => {
            return h(
              "RadioGroup",
              {
                props: {
                  value: params.row.killRateLevel
                },
                on: {
                  "on-change": val => {
                    params.row.killRateLevel = val;
                  }
                }
              },
              [
                h(
                  "Radio",
                  {
                    props: {
                      label: 0
                    }
                  },
                  "配置0-默认配置"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 1
                    }
                  },
                  "配置1-88%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 2
                    }
                  },
                  "配置2-90%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 3
                    }
                  },
                  "配置3-92%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 4
                    }
                  },
                  "配置4-94%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 5
                    }
                  },
                  "配置5-96%"
                )
              ]
            );
          }
        },
        {
          title: "操作",
          slot: "noOperate",
          align: "center",
        }
      ],
    };
  },
  methods: {
    /* 神秘大奖系列 */
    //修改游戏配置
    prizeOperateConfig(row) {
      console.log(row);
      
      this.$Modal.confirm({
        title: '操作',
        content: '确定修改并启用配置？',
        onOk: () => {
          httpRequest(
            "post",
            "/setGameConfig",
            { gameId: row.gameId,parent:this.userId,config:{killRateLevel:row.killRateLevel}},
            "test"
          )
            this.$Message.info('操作成功');
        },
        onCancel: () => {
            this.$Message.info('操作取消');
        }
      })
    },
     

    addPrizeOperateConfig(row) {

    }, 

     //获取游戏配置
     getGameData() {
      console.log(this.gameId);
       
      this.spinShow = true
      this.mysArr = []
      this.noMysArr = []
      let params = {}
      if (this.gameId != '') {
        params = {
          gameId: this.gameId,
          //parent: this.userId
          parent: this.userId
        }
      } else {
        params = {
          gameType: 'all',
          parent: this.userId
        }
      }
      httpRequest(
        "post",
        "/getGameConfig",
        params,
        "test"
      ).then(res => {
        this.spinShow = false
        if (res.code == 0) {
          res.config.forEach(item => {
          if (item.gameType.indexOf("_") != -1) {
            this.mysArr.push(item);//有神秘大奖系列
          } else {
            this.noMysArr.push(item);//无神秘大奖系列
          }
        })
        }
      })
    },

    //获取游戏配置模板
    getAllGameData() {
      this.mysArr = []
      this.noMysArr = []
      httpRequest(
        "post",
        "/getGameConfig",
        {gameType: 'all'},
        "test"
      ).then(res => {
        this.spinShow = false
        if (res.code == 0) {
          res.config.forEach(item => {
          if (item.gameType.indexOf("_") != -1) {
            this.mysArr.push(item);//有神秘大奖系列
          } else {
            this.noMysArr.push(item);//无神秘大奖系列
          }
        })
        }
      })
    },


    /* 商户列表 */
    getMerchantList() {
      this.spinShow = false
      let params = {
        query: '',
        isH5: true,
        isTest: 0,
        sortkey: "createdAt",
        sort: "desc"
      };
      getMerchants(params).then(res => {
        this.merchantList = res.payload;
        this.spinShow = false;
      });
    },

    //显示修改游戏配置
    setGameConfig(row) {
      this.modal1 = true
      this.userId = row.userId
      this.merchantId = row.displayName

      this.getGameData()
    },

    //显示新增游戏配置
    addGameConfig(row) {
       this.modal1 = true
       this.userId = row.userId
       this.merchantId = row.displayName

       this.getAllGameData()   
    },

    //选择游戏
    selGame(code) {
      this.gameId = code;
    },
    //获取游戏
    getGameList() {
      this.gameType = numGameList();
    },
  },
  computed: {
   
  }
};
</script>


<style lang="less" scoped>

</style>

