<template>
  <div class="prizeList">
    <div class="search">
      <Input v-model="sn" style="width: 200px;margin-right:1rem" placeholder="请输入商户标识" size="small"></Input>
      <DatePicker
        type="datetimerange"
        :options="options"
        :editable="false"
        v-model="defaultTime"
        placeholder="选择日期时间范围(默认最近一周)"
        style="width: 300px"
        @on-ok="init"
        size="small"
      ></DatePicker>
      <Button type="primary" @click="init" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
      <Button  @click="reset" size="small">重置</Button>
    </div>
    <Table :columns="columns1" :data="prizeList" size="small">
      <template slot-scope="{row, index}" slot="userName">
        <span style="color:#20a0ff;cursor:pointer" @click="userNameConfig(row)">{{row.userName}}</span>
      </template>
      <template slot-scope="{row, index}" slot="betTime">
        <span>{{betTimeConfig(row)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="winAmount">
        <span>{{row.winAmount.toFixed(2)}}</span>
      </template>
    </Table>
    <Spin size="large" fix v-if="spin">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
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
  //   components: {},
  //   filters: {},
  //   props: {},
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
      spin: false,
      columns1: [
        {
          title: "所属商户",
          align: 'center',
          key: "displayName"
        },
        {
          title: "商户标识",
          align: 'center',
          key: "sn"
        },
        {
          title: "玩家账号",
          align: 'center',
          slot: "userName"
        },
        {
          title: "玩家ID",
          align: 'center',
          key: "userId"
        },
        {
          title: "交易号",
          align: 'center',
          key: "betId"
        },
        {
          title: "日期",
          align: 'center',
          slot: "betTime"
        },
        {
          title: "游戏类型",
          align: 'center',
          key: "gameTypeName"
        },
        {
          title: "游戏ID",
          align: 'center',
          key: "gameId"
        },
        {
          title: "初始奖池",
          align: 'center',
          key: "initBonus"
        },
        {
          title: "机器人贡献",
          align: 'center',
          key: "robotBet"
        },
        {
          title: "中奖金额",
          align: 'center',
          slot: "winAmount"
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
      // this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    }
  },
  //   watch: {},
  created() {
    this.init();
  },
  methods: {
    //玩家账号
    userNameConfig(row) {
      localStorage.setItem("playerName", row.userName);
      this.$router.push({
        name: "playDetail",
        query: {
          name
        }
      });    
    },
    //日期
    betTimeConfig(row) {
      return dayjs(row.betTime).format("YYYY-MM-DD HH:mm:ss")
    },


























    reset() {
      this.sn = "";
      this.defaultTime = getDefaultTime(true);
      this.init();
    },
    init() {
      this.spin = true;
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
          this.spin = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.prizeList {
  min-height: 87vh;
  .search {
    margin-bottom: 10px;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
