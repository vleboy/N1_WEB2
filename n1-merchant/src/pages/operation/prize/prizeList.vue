<template>
  <div class="prizeList">
    <div class="search">
      <DatePicker
        type="datetimerange"
        :options="options"
        :editable="false"
        v-model="defaultTime"
        placeholder="选择日期时间范围(默认最近一周)"
        style="width: 300px;margin-right:1rem"
        @on-ok="init"
        size="small"
      ></DatePicker>
      <Button @click="init" style="margin-right:.3rem" size="small">搜索</Button>
      <Button @click="reset" size="small">重置</Button>
    </div>
    <Table :columns="columns1" :data="prizeList" size="small">
      <template slot-scope="{ row, index }" slot="userName">
        <Tooltip content="跳转到玩家详情">
          <span style="color: rgb(32, 160, 255);cursor: pointer" @click="userNameConfig()">{{row.userName}}</span>
        </Tooltip>
      </template>
      <template slot-scope="{ row, index }" slot="dateTime">
        <span>{{dateTimeConfig(row)}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="winAmount">
        <span>{{row.winAmount.toFixed(2)}}</span>
      </template>
    </Table>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import { getDefaultTime } from "@/config/getDefaultTime";
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
export default {
  name: "prizeList",
  data() {
    return {
      options: {
        shortcuts: [
          {
            text: "本周",
            value() {
              return [
                new Date(
                  dayjs()
                    .startOf("week")
                    .valueOf() +
                    24 * 60 * 60 * 1000
                ),
                new Date(
                  dayjs()
                    .endOf("second")
                    .valueOf()
                )
              ];
            }
          },
          {
            text: "本月",
            value() {
              return [
                new Date(
                  dayjs()
                    .startOf("month")
                    .valueOf()
                ),
                new Date(
                  dayjs()
                    .endOf("second")
                    .valueOf()
                )
              ];
            }
          },
          {
            text: "上周",
            value() {
              return [
                new Date(
                  dayjs()
                    .add(-1, "week")
                    .startOf("week")
                    .valueOf() +
                    24 * 60 * 60 * 1000
                ),
                new Date(
                  dayjs()
                    .startOf("week")
                    .valueOf() +
                    24 * 60 * 60 * 1000 -
                    1
                )
              ];
            }
          },
          {
            text: "上月",
            value() {
              //-1 上月
              return [
                new Date(
                  dayjs()
                    .add(-1, "month")
                    .startOf("month")
                    .valueOf()
                ),
                new Date(
                  dayjs()
                    .startOf("month")
                    .valueOf() - 1
                )
              ];
            }
          }
        ]
      },
      defaultTime: getDefaultTime(true),
      sn: "",
      spinShow: false,
      columns1: [
        {
          title: "玩家账号",
          maxWidth:130,
          slot: "userName",
          align: 'center',
        },
        {
          title: "玩家ID",
          key: "userId",
          maxWidth:130,
          align: 'center',
        },
        {
          title: "交易号",
          key: "betId",
          minWidth:100,
          align: 'center',
        },
        {
          title: "日期",
          slot: "dateTime",
          align: 'center'
        },
        {
          title: "游戏类型",
          key: "gameTypeName",
          align: 'center',
        },
        {
          title: "游戏ID",
          key: "gameId",
          align: 'center',
        },
        {
          title: "中奖金额",
          slot: "winAmount",
          align: 'center'
        }
      ],
      prizeList: []
    };
  },
  computed: {
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item) => {
        return item.getTime();
      });
      return time;
    }
  },
  created() {
    this.init();
  },
  methods: {
    //玩家账号
    userNameConfig() {
      localStorage.setItem("playerName", name)
      this.$router.push({
        name: "playDetail",
        query: {
          name
        }
      })
    },
    //日期
    dateTimeConfig(row) {
      return dayjs(row.betTime).format("YYYY-MM-DD HH:mm:ss")
    },
    reset() {
      this.sn = "";
      this.defaultTime = getDefaultTime(true);
      this.init();
    },
    init() {
      this.spinShow = true;
      let params = {
        winType: "SecretBonus",
        betTime: this.changedTime,
        query: {
          sn: this.sn
        }
      };
      if (!this.sn) {
        delete params.query.sn;
      }
      httpRequest("post", "/mysteryList", params)
        .then(res => {
          this.prizeList = res.payload;
        })
        .finally(() => {
          this.spinShow = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.prizeList {
  min-height: 87vh;
  .search {
    text-align: right;
    margin-bottom: 10px;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
</style>
