<template>
  <div class="warn">
    <div class="head">
      <div class="left">
        <span class="title">管理员直管接入商 </span>
        <span class="endtime">统计截止时间:{{countTime}}</span>
        <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='changeSource'>
          <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
          <Radio label="1">测试</Radio>
          <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
        </RadioGroup>
      </div>
       <div class="search">
        <Input v-model.trim="sn" placeholder="请输入接入商标识" style="width: 150px"></Input>
        <Button type="primary" @click="searchSn">搜索</Button>
        <Button type="primary" class="searchbtn" @click="reset">刷新</Button>
      </div>
    </div>
    <Table :columns="columns" :data="warnList" size="small"></Table>
    <div class="childLists" v-for="(item,index) in childList" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
      </p>
      <Table :columns="columns" :data="item" size="small"></Table>
    </div>
    <Modal v-model="pointModal" title="预警点数" :width='450' @on-ok="changePoint" @on-cancel='cancel'>
      <p class='gameTitle'>{{gameType}}游戏</p>
      <p class="current">当前值 {{winloseAmount}}/{{topAmount}}</p>
      <Row class="current">
        <Col span="8"> 设定值:{{winloseAmount}}/
        </Col>
        <Col span="12">
        <Input v-model="newAmount" :number='true' size="small" placeholder="请输入"></Input>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="opreateModal" :width='450' @on-ok="handleOpreate">
      <div class="open" v-if="open">
        <p slot="header" class="modalHead">启用</p>
        <p class="content">确认要启用该接入商的{{gameType}}游戏吗？</p>
      </div>
      <div class="close" v-else>
        <p slot="header" class="modalHead">停用</p>
        <p class="content">确认要停用该接入商的{{gameType}}游戏吗？</p>
        <p class="red content">
          告警: 停用后,该接入商下的所有玩家都无法进入游戏,已在游戏中的玩家会被系统T出游戏。
        </p>
      </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import { configOne, queryUserStat, userChangeStatus } from "@/service/index";
import dayjs from "dayjs";
export default {
  data() {
    return {
      endTime: "",
      open: false,
      opreateModal: false,
      pointModal: false,
      companyList: [],
      gameType: "",
      opreate: null,
      userId: "",
      role: "", //
      source: "1",
      sn:'',
      spinShow: false,
      topAmount: null,
      winloseAmount: null,
      newAmount: null,
      childList: [[]],
      columns: [
        {
          title: "序号",
          type: "index",
          maxWidth: 60
        },
        {
          title: "类型",
          key: "role",
          maxWidth: 80,
          sortable: true,
          render: (h, params) => {
            return h("span", this.types(params.row.role));
          }
        },
        {
          title: "接入商标识",
          key: "",
          maxWidth: 120,
          render: (h, params) => {
            if (params.row.role == "10") {
              return h("span", params.row.suffix);
            } else {
              return h("span", params.row.sn);
            }
          }
        },
        {
          title: "接入商昵称",
          key: "displayName",
          sortable: true,
          maxWidth: 160,
          render: (h, params) => {
            if (params.row.role == "10") {
              return h(
                "span",
                {
                  style: {
                    cursor: "pointer",
                    color: "#20a0ff"
                  },
                  on: {
                    click: async () => {
                      let userId = params.row.userId;
                      this.spinShow = true;
                      let level = params.row.level;
                      let showList = await this.getNextLevel(
                        this.childList,
                        userId
                      );
                      showList = _.filter(showList, function(o) {
                        return o.length;
                      });
                      let len = showList.length;
                      if (len > 0) {
                        while (len--) {
                          if (showList[len][0].level > level + 1) {
                            showList.splice(len, 1);
                          }
                        }
                      }
                      this.childList = showList;
                    }
                  }
                },
                params.row.displayName
              );
            } else {
              return h("span", params.row.displayName);
            }
          }
        },
        {
          title: "接入商",
          key: "",
          align: 'center',
          render: (h, params) => {
            if (params.row.companyList) {
              let companyList = params.row.companyList || [];
              return h(
                "div",
                companyList.map(item => {
                  return h(
                    "p",
                    {
                      style: {
                        textAlign: "center",
                        margin: "5px 0",
                        backgroundColor: "#e4e8f1",
                        borderRadius: " 4px",
                        // width: "80%",
                        height: "26px"
                      }
                    },
                    item.company
                  );
                })
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "游戏状态",
          key: "",
          align: 'center',
          render: (h, params) => {
            if (params.row.companyList) {
              let companyList = params.row.companyList || [];
              return h(
                "div",
                companyList.map(item => {
                  let text = "";
                  let color = "";
                  if (item.status == 1) {
                    text = "正常";
                    color = "#0c0";
                  } else {
                    text = "已停用";
                    color = "#f30";
                  }
                  return h(
                    "p",
                    {
                      style: {
                        textAlign: "center",
                        margin: "5px 0",
                        backgroundColor: "#e4e8f1",
                        borderRadius: " 4px",
                        // width: "80%",
                        color: color,
                        height: "26px"
                      }
                    },
                    text
                  );
                })
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "游戏点数消耗分布",
          key: "",
          align: 'center',
          render: (h, params) => {
            if (params.row.companyList) {
              let companyList = params.row.companyList || [];
              return h(
                "div",
                companyList.map(item => {
                  let text =
                    item.winloseAmount.toFixed(2) + "/" + item.topAmount;
                  let width = 0;
                  let color = "#fff";
                  if (
                    item.winloseAmount < item.topAmount &&
                    item.winloseAmount > 0 &&
                    item.topAmount > 0
                  ) {
                    width =
                      (100 * item.winloseAmount / item.topAmount).toFixed(2) +
                      "%";
                    if (item.winloseAmount / item.topAmount > 0.8) {
                      color = "red";
                    } else {
                      color = "#0c0";
                    }
                  } else if (
                    item.winloseAmount > 0 &&
                    item.topAmount > 0 &&
                    item.winloseAmount > item.topAmount
                  ) {
                    (width = "100%"), (color = "red");
                  }
                  return h(
                    "div",
                    {
                      style: {
                        margin: "8px 0px",
                        border: "1px solid rgb(0, 0, 0)",
                        borderRadius: "5px",
                        textAlign: "center",
                        height: "24px"
                      }
                    },
                    [
                      h("span", text),
                      h("div", {
                        style: {
                          width: width,
                          backgroundColor: color,
                          marginTop: "-18px",
                          borderRadius: "5px",
                          height: "22px"
                        }
                      })
                    ]
                  );
                })
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            let permission = this.permission;
            if (
              permission.includes("接入商停启用") &&
              permission.includes("设定接入商告警上限")
            ) {
              let companyList = params.row.companyList || [];
              return h(
                "div",
                companyList.map(item => {
                  let text = "";
                  let open = false;
                  let opreate = null;
                  if (item.status == 1) {
                    text = "停用";
                    opreate = 0;
                  } else {
                    text = "启用";
                    open = true;
                    opreate = 1;
                  }
                  return h(
                    "p",
                    {
                      style: {
                        margin: "5px 0",
                        height: "26px",
                        lineHeight: "26px"
                      }
                    },
                    [
                      h(
                        "span",
                        {
                          style: {
                            color: "#20a0ff",
                            cursor: "pointer",
                            marginRight: "5px"
                          },
                          on: {
                            click: () => {
                              this.winloseAmount = item.winloseAmount;
                              this.topAmount = item.topAmount;
                              this.gameType = item.company;
                              this.pointModal = true;
                              this.companyList = params.row.companyList;
                              this.userId = params.row.userId;
                              this.role = params.row.role;
                            }
                          }
                        },
                        "设定点数告警上限"
                      ),
                      h(
                        "span",
                        {
                          style: {
                            color: "#20a0ff",
                            cursor: "pointer",
                            marginRight: "5px"
                          },
                          on: {
                            click: () => {
                              this.opreateModal = true;
                              this.gameType = item.company;
                              this.open = open;
                              this.opreate = opreate;
                              this.companyList = params.row.companyList;
                              this.userId = params.row.userId;
                              this.role = params.row.role;
                            }
                          }
                        },
                        text
                      )
                    ]
                  );
                })
              );
            } else if (permission.includes("接入商停启用")) {
              let companyList = params.row.companyList || [];
              return h(
                "div",
                companyList.map(item => {
                  let text = "";
                  let open = false;
                  let opreate = null;
                  if (item.status == 1) {
                    text = "停用";
                    opreate = 0;
                  } else {
                    text = "启用";
                    open = true;
                    opreate = 1;
                  }
                  return h(
                    "p",
                    {
                      style: {
                        margin: "5px 0",
                        height: "26px",
                        lineHeight: "26px"
                      }
                    },
                    [
                      h(
                        "span",
                        {
                          style: {
                            color: "#20a0ff",
                            cursor: "pointer",
                            marginRight: "5px"
                          },
                          on: {
                            click: () => {
                              this.opreateModal = true;
                              this.gameType = item.company;
                              this.open = open;
                              this.opreate = opreate;
                              this.companyList = params.row.companyList;
                              this.userId = params.row.userId;
                              this.role = params.row.role;
                            }
                          }
                        },
                        text
                      )
                    ]
                  );
                })
              );
            } else if (permission.includes("设定接入商告警上限")) {
              let companyList = params.row.companyList || [];
              return h(
                "div",
                companyList.map(item => {
                  return h(
                    "span",
                    {
                      style: {
                        color: "#20a0ff",
                        cursor: "pointer",
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.winloseAmount = item.winloseAmount;
                          this.topAmount = item.topAmount;
                          this.gameType = item.company;
                          this.pointModal = true;
                          this.companyList = params.row.companyList;
                          this.userId = params.row.userId;
                          this.role = params.row.role;
                        }
                      }
                    },
                    "设定点数告警上限"
                  );
                })
              );
            } else {
              return h("span", "");
            }
          }
        }
      ],
      warnList: []
    };
  },
  computed: {
    countTime() {
      if (this.endTime == 0 || this.endTime == "") {
        return dayjs(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return dayjs(this.endTime).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    },
  },
  methods: {
    async init() {
      this.spinShow = true;
      let req1 = configOne({
        code: "roundLast"
      });
      let params = { parent: "01", isTest: +this.source,sn:this.sn };
      if(!this.sn){
        delete params.sn
      }
      let req2 = queryUserStat(params);
      let [config, userStat] = await this.axios.all([req1, req2]);
      if (config && config.code == 0) {
        this.endTime = config.payload.lastAllAmountTime;
      }
      if (userStat && userStat.code == 0) {
        this.warnList = userStat.payload;
      }
      this.childList = [];
      this.spinShow = false;
    },
    cancel() {
      this.newAmount = null;
    },
    changeSource(value) {
      this.init();
    },
     searchSn(){
      this.init()
    },
    reset() {
      if (this.permission.includes("正式数据")) {
        this.source = '0';
      }
      this.sn=''
      this.init();
    },
    changePoint() {
      let point = parseInt(this.newAmount);
      this.newAmount = null;
      let companyList = this.companyList;
      for (let item of companyList) {
        if (item.company == this.gameType) {
          item.topAmount = point;
        }
      }
      userChangeStatus({
        companyList,
        userId: this.userId,
        role: this.role
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.init();
        }
      });
    },
    async getNextLevel(showList, userId) {
      return new Promise((resolve, reject) => {
        queryUserStat({ parent: userId ,isTest: +this.source}).then(res => {
          showList.push(res.payload);
          showList = _.uniqWith(showList, _.isEqual);
          resolve(showList);
          this.spinShow = false;
        });
      });
    },
    handleOpreate() {
      let opreate = this.opreate;
      let companyList = this.companyList;
      for (let item of companyList) {
        if (item.company == this.gameType) {
          item.status = opreate;
        }
      }
      userChangeStatus({
        companyList,
        switch: opreate,
        userId: this.userId,
        role: this.role
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.init();
        }
      });
    },
    types(value) {
      switch (value) {
        case "10":
          return "线路商";
          break;
        case "100":
          return "商户";
          break;
      }
    }
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = '0';
    }
    this.init();
  }
};
</script>
<style lang="less" scoped>
.warn {
  min-height: 89vh;
  .head {
    overflow: hidden;
    padding-bottom: 12px;
    .left {
      float: left;
      .title {
        font-size: 26px;
        font-weight: bold;
      }
      .endtime {
        font-size: 16px;
      }
    }
    .search{
    float: right;
    line-height: 40px;
     .searchbtn {
        margin-right: 10px;
      }
   }
  }
}
.red {
  color: red;
}
.gameTitle {
  text-align: center;
  margin: 10px auto;
  font-size: 16px;
}
.current {
  margin: 20px auto;
  font-size: 14px;
  text-indent: 1em;
}
.radioGroup {
  padding-left: 20px;
}
.modalHead {
  font-size: 18px;
  font-weight: bold;
  margin: 10px auto;
}
.content {
  text-align: center;
  font-size: 14px;
  margin: 5px auto;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
