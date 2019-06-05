<template>
  <div class="prizeList">
    <div class="search">
      <Input v-model="displayId" style="width: 200px" placeholder="请输入代理ID"></Input>
      <DatePicker
        type="datetimerange"
        :options="options"
        :editable="false"
        v-model="defaultTime"
        placeholder="选择日期时间范围(默认最近一周)"
        style="width: 300px"
        @on-ok="init"
      ></DatePicker>
      <Button type="primary" @click="init">搜索</Button>
      <Button type="ghost" @click="reset">重置</Button>
    </div>
    <Table :columns="columns1" :data="prizeList" size="small"></Table>
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
      defaultTime: getDefaultTime(),
      displayId: "",
      spin: false,
      columns1: [
        {
          title: "所属代理",
          key: "displayName"
        },
        {
          title: "代理ID",
          key: "displayId"
        },
        {
          title: "玩家账号",
          key: "userName",
          render: (h, params) => {
            let name = params.row.userName;
            return h(
              "span",
              {
                style: {
                  color: "rgb(32, 160, 255)",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    localStorage.setItem("playerName", name);
                    this.$router.push({
                      name: "playDetail",
                      query: {
                        name
                      }
                    });
                  }
                }
              },
              name
            );
          }
        },
        {
          title: "玩家ID",
          key: "userId"
        },
        {
          title: "交易号",
          key: "betId"
        },
        {
          title: "日期",
          key: "",
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.betTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "游戏类型",
          key: "gameTypeName"
        },
        {
          title: "游戏ID",
          key: "gameId"
        },
        {
          title: "中奖金额",
          key: "winAmount"
        }
      ],
      prizeList: []
    };
  },
  computed: {
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        if (index == 1 && item.getTime() > Date.now() - 180000) {
          return Date.now() - 180000;
        }
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    }
  },
  //   watch: {},
  created() {
    this.init();
  },
  methods: {
    reset() {
      this.displayId = "";
      this.defaultTime = getDefaultTime();
      this.init();
    },
    init() {
      this.spin = true;
      let params = {
        winType: "SecretBonus",
        betTime: this.changedTime,
        query: {
          displayId: +this.displayId
        }
      };
      if (!this.displayId) {
        delete params.query.displayId;
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
    text-align: right;
    margin-bottom: 10px;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
