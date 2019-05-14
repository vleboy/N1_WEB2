<template>
  <div class="sysConfig">
    <div class="search">
      <Select v-model="gameSeries" style="width:100px" @on-change='init'>
        <Option v-for="item in seriesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button class="reset" type="primary" @click="init">刷新</Button>
    </div>
    <Table :columns="columns1" :data="prizeList" size="small"></Table>
    <div v-if="gameSeries!='all'">
      <p class="robot_title">机器人系列</p>
      <Table :columns="columns2" :data="robotList" size="small"></Table>
    </div>
    <Spin size="large" fix v-if="spin">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <Modal v-model="editPrice" @on-ok="saveConfig" title="神秘大奖" id="editPrize">
      <Row class="modalrow">
        <Col span="8">
          <span>
            <span class="required">*</span>奖池初始金额
          </span>
        </Col>
        <Col span="8">
          <span>当前设置: &nbsp;{{cloneParams.bonusPoolInit}}</span>
        </Col>
        <Col span="8">
          <Row>
            <Col span="6">修改为</Col>
            <Col span="18">
              <Input v-model.number="rowParams.bonusPoolInit"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row class="modalrow">
        <Col span="8">
          <span>
            <span class="required">*</span>奖池基础掉落金额
          </span>
        </Col>
        <Col span="8">
          <span>当前设置: &nbsp;{{cloneParams.bonusHitMin}}</span>
        </Col>
        <Col span="8">
          <Row>
            <Col span="6">修改为</Col>
            <Col span="18">
              <Input v-model.number="rowParams.bonusHitMin"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row class="modalrow">
        <Col span="8">
          <span>
            <span class="required">*</span> 奖池必掉金额
          </span>
        </Col>
        <Col span="8">
          <span>当前设置: &nbsp;{{cloneParams.bonusHitMax}}</span>
        </Col>
        <Col span="8">
          <Row>
            <Col span="6">修改为</Col>
            <Col span="18">
              <Input v-model.number="rowParams.bonusHitMax"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row class="modalrow">
        <Col span="8">
          <span>
            <span class="required">*</span>下注抽取比例
          </span>
        </Col>
        <Col span="8">
          <span>当前设置: &nbsp;{{cloneParams.bonusPoolRate}}</span>
        </Col>
        <Col span="8">
          <Row>
            <Col span="6">修改为</Col>
            <Col span="18">
              <Input @on-keyup="validateRate()" v-model.number="rowParams.bonusPoolRate"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
       <Row class="modalrow">
        <Col span="8">
          <span>
            <span class="required">*</span>中奖比例
          </span>
        </Col>
        <Col span="8">
          <span>当前设置: &nbsp;{{`1/${cloneParams.bonusHitRate}`}}</span>
        </Col>
        <Col span="8">
          <Row>
            <Col span="6">修改为</Col>
            <Col span="18">
              <Input v-model.number="rowParams.bonusHitRate"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row class="modalrow">
        <Col span="8">
          <span>
            <span class="required">*</span> 机器人休眠值
          </span>
        </Col>
        <Col span="8">
          <span>当前设置: &nbsp;{{cloneParams.bonusRobotLimit}}</span>
        </Col>
        <Col span="8">
          <Row>
            <Col span="6">修改为</Col>
            <Col span="18">
              <Input v-model.number="rowParams.bonusRobotLimit"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
    <Modal
      v-model="editRobot"
      @on-ok="saveRobot"
      title="机器人"
      id="editRobot"
      @on-cancel="cancelRobot"
    >
      <p>
        <span class="required">*</span>机器人参数设置
      </p>
      <div class="modal_content">
        <Row class="modalrow">
          <Col span="12">
            <span>机器人ID:
              <Input style="width:150px" disabled v-model="robot.id"></Input>
            </span>
          </Col>
          <Col span="12" v-if="changeRobot">
            <span>状态:
              <RadioGroup v-model="robot.isActive">
                <Radio label="active">
                  <span>激活</span>
                </Radio>
                <Radio label="deactive">
                  <span>禁用</span>
                </Radio>
              </RadioGroup>
            </span>
          </Col>
        </Row>
        <Row class="modalrow">
          <Col span="12">
            <span>下注金额:
              <Input style="width: 150px" v-model.number="robot.bet"></Input>
            </span>
          </Col>
          <Col span="12">
            <span>下注间隔:
              <Input style="width: 150px" v-model.number="robot.betInterval"></Input>
            </span>
          </Col>
        </Row>
        <Row class="modalrow" v-for="(item,index) in timeList" :key="index">
          <Col span="12">
            <span>启用时间:
              <TimePicker
                type="time"
                :editable= false
                format="HH:mm"
                v-model="item.start"
                placeholder="选择时间"
                style="width: 150px"
              ></TimePicker>
            </span>
          </Col>
          <Col span="12">
            <span>停用时间:
              <TimePicker
                type="time"
                :editable= false
                format="HH:mm"
                v-model="item.end"
                placeholder="选择时间"
                style="width: 150px"
              ></TimePicker>
              <span class="del" @click="delTime(index)">删除</span>
            </span>
          </Col>
        </Row>
        <p class="addOne" @click="addTime">继续添加启用时段</p>
      </div>
    </Modal>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
// const list = {
//   gameType: "moneytree",
//   bonusPool: 0,
//   bonusHitMin: 10000,
//   bonusHitMax: 20000,
//   bonusPoolRate: 0.0004,
//   bonusRobotLimit: 15000,
//   bonusRobots: [
//     {
//       id: 952700,
//       isActive: true,
//       bet: 25,
//       betInterval: 5000,
//       workTimes: [
//         {
//           start: "17:00",
//           end: "18:00"
//         },
//         {
//           start: "6:00",
//           end: "8:00"
//         }
//       ]
//     },
//     {
//       id: 952800,
//       isActive: true,
//       bet: 25,
//       betInterval: 5000,
//       workTimes: [
//         {
//           start: "17:00",
//           end: "18:00"
//         }
//       ]
//     }
//   ]
// };
export default {
  name: "sysConfig",
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      editPrice: false,
      robot: {
        isActive: "deactive",
        id: "",
        bet: "",
        betInterval: ""
      },
      editRobot: false,
      changeRobot: false,
      gameSeries: "moneytree",
      spin: false,
      robotId: "",
      timeList: [{}],
      rowParams: {
        bonusPoolInit: 0,
        bonusHitMin: 0,
        bonusHitMax: 0,
        bonusPoolRate: 0,
        bonusRobotLimit: 0,
        bonusHitRate:0,
      },
      cloneParams: {
        bonusPoolInit: 0,
        bonusHitMin: 0,
        bonusHitMax: 0,
        bonusPoolRate: 0,
        bonusRobotLimit: 0,
        bonusHitRate:0,
      },
      seriesList: [
        {
          value: "all",
          align: 'center',
          label: "全部"
        },
        {
          value: "moneytree",
          align: 'center',
          label: "摇钱树系列"
        }
      ],
      columns1: [
        {
          title: "游戏系列",
          align: 'center',
          key: "gameType"
        },
        {
          title: "当前奖池金额",
          align: 'center',
          key: "bonusPool"
        },
        {
          title: "奖池初始金额",
          align: 'center',
          key: "bonusPoolInit"
        },
        {
          title: "奖池基础掉落金额",
          align: 'center',
          key: "bonusHitMin"
        },
        {
          title: "奖池必掉金额",
          align: 'center',
          key: "bonusHitMax"
        },
        {
          title: "机器人数量",
          align: 'center',
          key: "",
          render: (h, params) => {
            let bonusRobots = params.row.bonusRobots;
            return h("span", bonusRobots.length);
        }
        },
        {
          title: "下注抽取比例",
          align: 'center',
          key: "bonusPoolRate"
        },
         {
          title: "中奖比例",
          align: 'center',
          key: "bonusHitRate",
          render:(h,params)=>{
            return h('span',`1/${params.row.bonusHitRate}`)
          }
        },
        {
          title: "机器人注入奖池金额",
          align: 'center',
          key: "bonusRobotInput",
          minWidth: 50
        },
        {
          title: "机器人休眠值",
          align: 'center',
          key: "bonusRobotLimit"
        },
        {
          title: "操作",
          minWidth: 25,
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#20a0ff"
                  },
                  on: {
                    click: () => {
                      this.rowParams = this.cloneObj(params.row)
                      this.cloneParams=this.cloneObj(params.row)
                      this.editPrice = true;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#20a0ff"
                  },
                  on: {
                    click: () => {
                      this.rowParams = params.row;
                      this.editRobot = true;
                    }
                  }
                },
                "添加机器人"
              )
            ]);
          }
        }
      ],
      prizeList: [],
      columns2: [
        {
          title: "机器人ID",
          align: 'center',
          key: "id"
        },
        {
          title: "状态",
          key: "isActive",
          align: 'center',
          render: (h, params) => {
            let status = params.row.isActive;
            let color = status ? "#20a0ff" : "#f5141e";
            let text = status ? "启用" : "禁用";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "下注金额",
          align: 'center',
          key: "bet"
        },
        {
          title: "下注间隔(秒)",
          align: 'center',
          key: "betInterval"
        },
        {
          title: "启用时段",
          align: 'center',
          key: "",
          render: (h, params) => {
            let work = params.row.workTimes;
            return h(
              "div",
              work.map(item => {
                return h(
                  "p",
                  {
                    style: {
                      textAlign: "center",
                      backgroundColor: "#e4e8f1",
                      borderRadius: " 4px",
                      height: "26px",
                      lineHeight: "26px"
                    }
                  },
                  `${item.start||''}--${item.end||''}`
                );
              })
            );
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#20a0ff"
                  },
                  on: {
                    click: () => {
                      this.editRobot = true;
                      this.changeRobot = true;
                      this.handleRowbot(params.row);
                    }
                  }
                },
                "编辑"
              ),
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "text",
              //       size: "small"
              //     },
              //     style: {
              //       color: "#20a0ff"
              //     },
              //     on: {
              //       click: () => {}
              //     }
              //   },
              //   "禁用"
              // ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#20a0ff"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "是否删除机器人",
                        onOk: () => {
                          let robotList = this.robotList;
                          let id = params.row.id;
                          robotList.map((item, index) => {
                            if (item.id == id) {
                              robotList.splice(index, 1);
                            }
                          });
                          let list = this.prizeList[0];
                          list.bonusRobots = robotList;
                          httpRequest(
                            "post",
                            "/setBonusConfig",
                            { gameType: list.gameType, config: list },
                            "prize"
                          ).then(res => {
                            if (res.code == 0) {
                              this.$Message.success("修改成功");
                              this.init();
                            }
                          });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      robotList: []
    };
  },
  // computed: {
  // },
  // watch: {},
  created() {
    this.init();
  },
  methods: {
    handleRowbot(row) {
      this.robot = this.cloneObj(row);
      this.robotId = row.id;
      this.robot.isActive = row.isActive == true ? "active" : "deactive";
      this.timeList = this.cloneObj(row.workTimes)
    },
    saveConfig() {
      let params = this.rowParams;
      if(params.bonusPoolInit>=params.bonusHitMax||params.bonusHitMin>=params.bonusHitMax){
        return this.$Message.warning('奖池初始金额与奖池基础掉落金额必须小于奖池必掉金额')
      }
      if(params.bonusPoolRate>=1){
        return this.$Message.warning('下注抽取比例小于1')
      }
      if(!Number.isInteger(params.bonusHitRate) || params.bonusHitRate<1){
        return this.$Message.warning('输入值需大于0的整数')
      }
       if(params.bonusRobotLimit>=params.bonusHitMax){
        return this.$Message.warning('机器人休眠值必须小于奖池必掉金额')
      }
      httpRequest(
        "post",
        "/setBonusConfig",
        { gameType: params.gameType, config: params },
        "prize"
      ).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
          this.init();
        }
      });
    },
    isNumber(val){
      const reg=/^\d+$/
      if(!reg.test(val)){
        return this.$Message.warning('需输入数字')
      }
    },
    validateRate(){
      if(this.rowParams.bonusPoolRate>1){
        return this.$Message.warning('比例不能大于1')
      }
    },
    addTime() {
      this.timeList.push({});
    },
    delTime(index) {
      this.timeList.splice(index, 1);
    },
    cloneObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    saveRobot() {
      let Crobot=this.robot
      if(Crobot.bet<0.01||Crobot.bet>5000){
         return this.$Message.warning('机器人下注金额范围为：0.01至5000');
        }
      if(Crobot.betInterval<1||Crobot.betInterval>60){
         return this.$Message.warning('机器人下注间隔范围为：1至60')
      }
      if (this.changeRobot) {
        let id = this.robotId;
        let prizeList = this.cloneObj(this.prizeList);
        for (let item of prizeList) {
          for (let i = 0; i < item.bonusRobots.length; i++) {
            let robotItem = item.bonusRobots[i];
            if (robotItem.id == id) {
              let robot = this.cloneObj(this.robot);
              robot.isActive = robot.isActive == "active" ? true : false;
              robot.workTimes = this.timeList;
              item.bonusRobots[i] = robot;
            }
          }
        }
        let configItem = prizeList[0];
        let params = {
          gameType: configItem.gameType,
          config: configItem
        };
        httpRequest("post", "/setBonusConfig", params, "prize").then(res => {
          if (res.code == 0) {
            this.$Message.success("修改成功");
            this.init();
            this.cancelRobot()
          }
        });
      } else {
        let params = this.rowParams;
        let robot = this.cloneObj(this.robot);
        let id = Math.floor(Math.random() * 1000000);
        robot.id = id;
        robot.isActive = robot.isActive == "active" ? true : false;
        robot.workTimes = this.timeList;
        params.bonusRobots.push(robot);
        httpRequest(
          "post",
          "/setBonusConfig",
          { gameType: params.gameType, config: params },
          "prize"
        ).then(res => {
          if (res.code == 0) {
            this.$Message.success("添加成功");
            this.init()
            this.cancelRobot()
          }
        });
      }
    },
    cancelRobot() {
      this.robot = {
        isActive: "deactive",
        id: "",
        bet: "",
        betInterval: ""
      };
      this.timeList = [{}];
      if (this.changeRobot) {
        this.changeRobot = false;
      }
    },
    init() {
      this.spin = true;
      httpRequest(
        "post",
        "/getBonusConfig",
        {
          gameType: this.gameSeries
        },
        "prize"
      )
        .then(res => {
          if (res.code == 0) {
            this.prizeList = res.config;
            let robotList = [];
            for (let item of this.prizeList) {
              robotList.push(...item.bonusRobots);
            }
            this.robotList = robotList;
          }
        })
        .finally(() => {
          this.spin = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.sysConfig {
  min-height: 87vh;
  .robot_title {
    font-size: 14px;
    font-weight: bold;
    margin: 10px auto;
  }
}
.required {
  color: red;
}
.modalrow {
  line-height: 32px;
  padding-bottom: 5px;
}
.del {
  color: red;
  padding-left: 5px;
  cursor: pointer;
}
.modal_content {
  border: 1px solid #ccc;
  padding: 5px;
}
.addOne {
  border: 1px solid #f2f2f2;
  height: 28px;
  padding-top: 8px;
  text-align: center;
  cursor: pointer;
}
.search {
  margin-bottom: 10px;
}
.reset {
  float: right;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
/deep/ .ivu-table-cell {
  padding: 0;
}  
</style>
