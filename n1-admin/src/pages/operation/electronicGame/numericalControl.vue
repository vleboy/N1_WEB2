<template>
  <div class="control">
    <div style="margin-bottom:1rem">
      <Select style="width:200px;" ref="resetSelect" clearable v-model="model1" size="small"> 
        <Option
          v-for="(item, index) in gameType"
          :value="item.displayName"
          :key="item.displayName"
          @click.native="selGame(item.gameId)"
        >{{item.displayName}}</Option>
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
        </template>
      </Table>
    </div>

    
    <Modal v-model="modal1" :title="merchantId" width="65" @on-ok="ok">
      <div style="height:400px;overflow:auto">
        <div>
      <Table :columns="columns1" :data="mysArr" style="margin-bottom: 1rem" size="small">
        
      </Table>
      </div>
      <div>
        <Table :columns="columns2" :data="noMysArr" size="small">
          
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
import _ from "lodash";
export default {
  created() {
    this.getGameList()
    this.getMerchantList();
  },
  data() {
    return {
      configs:[],
      model1: '全部游戏',
      gameId: '',
      spinShow: false,
      modal1: false,
      merchantId: '',
      merchantList:[],
      mysArr: [],
      noMysArr: [],
      testGameList: [
        { displayName: '塔罗之谜-神秘大奖', gameId: '70001', gameType: '243_bonus',killRateLevel: 0},
      ],
      gameConfigList:[
        { gameId: '70001', ownerId:'NULL!', displayName: '塔罗之谜-神秘大奖', gameType: '243_bonus',killRateLevel: 0,},
        { gameId: '90001', ownerId:'NULL!', displayName: '塔罗之谜',  gameType: '243' ,killRateLevel: 0},
        { gameId: '70002', ownerId:'NULL!', displayName: '小厨娘-神秘大奖',  gameType: '243_bonus',killRateLevel: 0 },
        { gameId: '90002', ownerId:'NULL!', displayName: '小厨娘',  gameType: '243' ,killRateLevel: 0},
        { gameId: '70003', ownerId:'NULL!', displayName: '祥龙献瑞-神秘大奖',  gameType: '243_bonus',killRateLevel: 0 },
        { gameId: '90003', ownerId:'NULL!', displayName: '祥龙献瑞',  gameType: '243' ,killRateLevel: 0},
        { gameId: '70004', ownerId:'NULL!', displayName: '四方神兽-神秘大奖',  gameType: '243_bonus',killRateLevel: 0 },
        { gameId: '90004', ownerId:'NULL!', displayName: '四方神兽',  gameType: '243' ,killRateLevel: 0},
        { gameId: '70005', ownerId:'NULL!', displayName: '财神进宝-神秘大奖',  gameType: '243_bonus',killRateLevel: 0 },
        { gameId: '90005', ownerId:'NULL!', displayName: '财神进宝',  gameType: '243' ,killRateLevel: 0},
        { gameId: '70006', ownerId:'NULL!', displayName: '福运亨通-神秘大奖',  gameType: '243_bonus',killRateLevel: 0 },
        { gameId: '90006', ownerId:'NULL!', displayName: '福运亨通',  gameType: '243' ,killRateLevel: 0},
        { gameId: '70007', ownerId:'NULL!', displayName: '熊猫传奇-神秘大奖',  gameType: 'panda_bonus',killRateLevel: 0 },
        { gameId: '90007', ownerId:'NULL!', displayName: '熊猫传奇',  gameType: 'panda' ,killRateLevel: 0},
        { gameId: '70010', ownerId:'NULL!', displayName: '财源广进-神秘大奖',  gameType: 'panda_bonus',killRateLevel: 0 },
        { gameId: '90008', ownerId:'NULL!', displayName: '财源广进',  gameType: 'panda' ,killRateLevel: 0},
        { gameId: '70011', ownerId:'NULL!', displayName: '珠光宝气-神秘大奖',  gameType: 'panda_bonus',killRateLevel: 0 },
        { gameId: '90009', ownerId:'NULL!', displayName: '珠光宝气',  gameType: 'panda' ,killRateLevel: 0},
        { gameId: '70012', ownerId:'NULL!', displayName: '锦鲤-神秘大奖',  gameType: 'panda_bonus',killRateLevel: 0 },
        { gameId: '90010', ownerId:'NULL!', displayName: '锦鲤',  gameType: 'panda' ,killRateLevel: 0},
        { gameId: '70013', ownerId:'NULL!', displayName: '金狮送福-神秘大奖',  gameType: 'panda_bonus',killRateLevel: 0 },
        { gameId: '90011', ownerId:'NULL!', displayName: '金狮送福',  gameType: 'panda' ,killRateLevel: 0},
        { gameId: '70014', ownerId:'NULL!', displayName: '幸运钱庄-神秘大奖',  gameType: 'panda_bonus',killRateLevel: 0 },
        { gameId: '90012', ownerId:'NULL!', displayName: '幸运钱庄',  gameType: 'panda' ,killRateLevel: 0},
        { gameId: '70022', ownerId:'NULL!', displayName: '年年有余-神秘大奖',  gameType: 'tree_bonus',killRateLevel: 0 },
        { gameId: '90013', ownerId:'NULL!', displayName: '年年有余',  gameType: 'tree' ,killRateLevel: 0},
        { gameId: '70024', ownerId:'NULL!', displayName: '猪年大吉-神秘大奖',  gameType: 'tree_bonus',killRateLevel: 0 },
        { gameId: '90014', ownerId:'NULL!', displayName: '猪年大吉',  gameType: 'tree' ,killRateLevel: 0},
        { gameId: '70026', ownerId:'NULL!', displayName: '财神到-神秘大奖',  gameType: 'tree_bonus',killRateLevel: 0 },
        { gameId: '90015', ownerId:'NULL!', displayName: '财神到',  gameType: 'tree' ,killRateLevel: 0},
        { gameId: '70028', ownerId:'NULL!', displayName: '老寿星-神秘大奖',  gameType: 'tree_bonus',killRateLevel: 0 },
        { gameId: '90016', ownerId:'NULL!', displayName: '老寿星',  gameType: 'tree' ,killRateLevel: 0},
        { gameId: '70030', ownerId:'NULL!', displayName: '凤舞朝阳-神秘大奖',  gameType: 'tree_bonus',killRateLevel: 0 },
        { gameId: '90017', ownerId:'NULL!', displayName: '凤舞朝阳',  gameType: 'tree' ,killRateLevel: 0},
        { gameId: '70032', ownerId:'NULL!', displayName: '鲤跃龙门-神秘大奖',  gameType: 'tree_bonus',killRateLevel: 0 },
        { gameId: '90018', ownerId:'NULL!', displayName: '鲤跃龙门',  gameType: 'tree' ,killRateLevel: 0},
      ],
      userId: '',
      gameType: [],

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
          title: '游戏名',
          align: 'center',
          key: 'displayName'
        },
        {
          title: "数值配表",
          key: "option",
          align: 'center',
          minWidth: 600,
          render: (h, params) => {
            var vm = this
            return h(
              "RadioGroup",
              {
                props: {
                  value: params.row.killRateLevel
                },
                
                on: {
                  "on-change": val => {
                    /* console.log(params.row);
                    console.log(params.index)
                    console.log(vm._data.configs) */
                    params.row.killRateLevel = val;
                    //vm._data.configs[params._index] = params.row;
                    vm._data.gameConfigs.map(item => {
                      if (params.row.gameId == item.gameId) {
                        item.killRateLevel = params.row.killRateLevel
                      }
                    })
                  },
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
      ],
      columns2: [
        {
          title: "游戏系列-无大奖版",
          key: "gameType",
          align: 'center'
        },
        {
          title: '游戏名',
          align: 'center',
          key: 'displayName'
        },
        {
          title: "数值配表",
          key: "option",
          align: "center",
          minWidth: 600,
          render: (h, params) => {
            var vm = this
            return h(
              "RadioGroup",
              {
                props: {
                  value: params.row.killRateLevel
                },
                on: {
                  "on-change": val => {
                    params.row.killRateLevel = val;
                    //vm._data.configs[params.index] = params.row;
                    vm._data.gameConfigs.map(item => {
                      if (params.row.gameId == item.gameId) {
                        item.killRateLevel = params.row.killRateLevel
                      }
                    })
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
      ],
      gameConfigs:[]
      
    };
  },
  methods: {
// 只有当接口返回空才能用模板填充
    getTemplate(parent){
      return this.gameConfigList.map(item=>{
        item.ownerId = parent
        return item
      })
    },
    /* 神秘大奖系列 */
    //修改游戏配置
    ok(row) {
      
      for (let i = 0; i < this.configs.length; i++) {
        for (var k in this.configs[i]) {
          if(k=='_index'){
            delete this.configs[i][k];
          }
          if (k=='_rowKey') {
            delete this.configs[i][k];
          }
        }
      }
      httpRequest(
        "post",
        "/setGameConfig",
        /* {config:[{
            gameId: row.gameId,
            ownerId:this.userId,
            displayName:'',
            gameType:'',
            killRateLevel:1

        },{}]}, */
        {config: this.gameConfigs},
        "test"
      )
        this.$Message.info('操作成功');
    },

     //获取游戏配置
     getGameData() {
      this.spinShow = true
      this.mysArr = []
      this.noMysArr = []
      let params = {}
      if (this.gameId != '') {
        params = {
          gameId: this.gameId,
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
          if (res.config.length == 0) {
            //第一次数据为空
            this.configs = this.getTemplate(this.userId)
            this.gameConfigs = _.cloneDeep(this.configs)
            this.configs.forEach(item => {
              if (item.gameType.indexOf("_") != -1) {
                this.mysArr.push(item);//有神秘大奖系列
              } else {
                this.noMysArr.push(item);//无神秘大奖系列
              }
            })
          } else {
            this.configs = res.config
            this.gameConfigs = _.cloneDeep(this.configs)
            this.configs.forEach(item => {
              if (item.gameType.indexOf("_") != -1) {
                this.mysArr.push(item);//有神秘大奖系列
              } else {
                this.noMysArr.push(item);//无神秘大奖系列
              }
            })
          }
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
    /* mysArr() {
      let mys = [] 
      this.gameConfigList.forEach(item => {
        if (item.gameType.indexOf("_") != -1) {
          mys.push(item)
        }
      })
      return mys
    },
    noMysArr() {
      let noMys = []
      this.gameConfigList.forEach(item => {
        if (item.gameType.indexOf("_") == -1) {
          noMys.push(item)
        }
      })
      return noMys
    }, */
  }
};
</script>


<style lang="less" scoped>

</style>

