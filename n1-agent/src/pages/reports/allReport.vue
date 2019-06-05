<template>
  <div class="allreport" :style="{width:getTabWidth}">
    <div class="nowList">
      <div class="top">
        <p class="title">
          当前用户列表
          <RadioGroup v-model="source" v-if="level==0" type="button" @on-change="changeSource">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
          <Button type="ghost" @click="exportdata('table_0')">导出数据</Button>
        </p>
        <div class="right">
          <DatePicker
            type="datetimerange"
            :options="options"
            :editable="false"
            v-model="defaultTime"
            placeholder="选择日期时间范围(默认最近一周)"
            style="width: 300px"
            @on-ok="confirm"
          ></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
      </div>
      <Table :columns="columns11" :data="user" size="small" ref="table_0"></Table>
    </div>
    <div class="childList">
      <p class="title">
        直属下级列表
        <Button type="ghost" @click="exportdata('table_1')">导出数据</Button>
      </p>
      <Table :columns="columns11" :data="child" size="small" ref="table_1"></Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
        <Button type="ghost" @click="exportdata(index)">导出数据</Button>
      </p>
      <Table :columns="columns11" :data="item" size="small" :ref="'table'+index"></Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName">({{ userName }})</span>所属玩家列表
        <Button type="ghost" @click="exportdata('table_2')">导出数据</Button>
      </p>
      <Table :columns="columns22" :data="playerList" size="small" ref="table_2"></Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import { thousandFormatter } from "@/config/format";
import { getMixAmount } from "@/config/getWinloseAmount";
export default {
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
      spinShow: false, //加载spin
      showName: false, //上级商家
      userName: "", //上级商家名字
      reportChild: [], //点击渲染的下级
      playerList: [], //玩家列表
      user: [], //当前管理员
      child: [], //管理员下级
      source: "1",
      gameType: [
        70000,
        90000,
        1010000,
        1090000,
        1040000,
        1070000,
        1020000,
        10300000,
        1050000,
        1060000,
        1140000,
        1110000,
        1130000,
        1150000,
        1160000,
        1120000,
        1080000
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 60
        },
        {
          title: "类型",
          key: "role",
          render: (h, params) => {
            //console.log(params);

            return h("span", this.types(params.row.role));
          }
        },
        {
          title: "昵称",
          key: "displayName",
          render: (h, params) => {
            //console.log(params)
            return h(
              "Tooltip",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                props: {
                  content: "前往日报表",
                  placement: "top"
                }
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: async () => {
                        let time = this.changedTime;
                        this.$router.push({
                          name: "dayCompany",
                          query: {
                            name: params.row.uname,
                            time: time,
                            type: "",
                            source: this.source,
                            level: params.row.level
                          }
                        });
                        localStorage.setItem("dayCompany", "dayCompany");
                      }
                    }
                  },
                  params.row.displayName
                )
              ]
            );
          }
        },
        {
          title: "管理员账号",
          key: "username",
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                style: {
                  cursor: "pointer",
                  color: "#20a0ff"
                },
                props: {
                  content: "显示下一级",
                  placement: "top",
                  transfer: true
                }
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: async () => {
                        this.spinShow = true;
                        let userId = localStorage.userId;
                        let level = localStorage.level;
                        let parent = "";
                        if (params.row.userId == userId) {
                          if (level == 0) {
                            parent = "01";
                            this.playerList = [];
                          } else {
                            parent = userId;
                            this.$store
                              .dispatch("getPlayerList", {
                                parentId: userId,
                                gameType: this.gameType,
                                query: {
                                  createdAt: this.changedTime
                                }
                              })
                              .then(res => {
                                this.playerList = res.payload;
                              });
                          }
                          this.$store
                            .dispatch("getUserChild", {
                              parent: parent,
                              gameType: this.gameType,
                              isTest: +this.source,
                              query: {
                                createdAt: this.changedTime
                              }
                            })
                            .then(res => {
                              // console.log(res);
                              this.reportChild = [];
                              this.showName = false;
                              this.child = res.payload;
                              this.spinShow = false;
                            });
                        } else {
                          this.userName = params.row.displayName;
                          this.showName = true;
                          let userId = params.row.userId;
                          let level = params.row.level;
                          let showList = await this.getNextLevel(
                            this.reportChild,
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
                          this.reportChild = showList;
                          this.$store
                            .dispatch("getPlayerList", {
                              parentId: userId,
                              gameType: this.gameType,
                              query: {
                                createdAt: this.changedTime
                              }
                            })
                            .then(res => {
                              this.playerList = res.payload;
                              this.spinShow = false;
                              // console.log(res);
                            });
                          const anchor = this.$el.querySelector("#playerList");
                          document.documentElement.scrollTop = anchor.offsetTop;
                        }
                      }
                      // console.log(params.row);
                    }
                  },
                  params.row.username
                )
              ]
            );
          }
        },
        {
          title: "交易次数",
          key: "betCount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            for (let item of arr) {
              count += item.betCount;
            }
            if (params.row.level == 0) {
              return h("span", count);
            } else {
              return h("span", params.row.betCount);
            }
          }
        },
        {
          title: "总游戏输赢金额",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            for (let item of arr) {
              count += item.winloseAmount;
            }
            let color = "";
            if (params.row.level == 0) {
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            } else {
              color = params.row.winloseAmount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(params.row.winloseAmount)
              );
            }
          }
        },
        {
          title: "总游戏交公司",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              if (params.row.submitAmount) {
                return h(
                  "span",
                  thousandFormatter(params.row.submitAmount.toFixed(2))
                );
              } else {
                return h("span", "0.00");
              }
            }
          }
        },
        {
          title: "总游戏洗码量",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let count = 0;
              for (let item of arr) {
                count += item.mixAmount;
              }
              return h("span", thousandFormatter(count));
            } else {
              return h("span", thousandFormatter(params.row.mixAmount));
            }
          }
        },
        {
          title: "NA游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["70000", "90000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["70000", "90000"].includes(key)) {
                  count += obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "NA游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["70000", "90000"].includes(key)) {
                  count += obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "NA游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (["70000", "90000"].includes(key)) {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["70000", "90000"].includes(key)) {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "TTG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["1010000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1010000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "TTG游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1010000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "TTG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1010000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1010000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "SA游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["1060000", "1110000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["1060000", "1110000"].includes(key)) {
                  count += obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "SA游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["1060000", "1110000"].includes(key)) {
                  count += obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "SA游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (["1060000", "1110000"].includes(key)) {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["1060000", "1110000"].includes(key)) {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "SB游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["1080000", "1120000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["1080000", "1120000"].includes(key)) {
                  count += obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "SB游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["1080000", "1120000"].includes(key)) {
                  count += obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "SB游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (["1080000", "1120000"].includes(key)) {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (["1080000", "1120000"].includes(key)) {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "MG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["10300000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "10300000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "MG游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "10300000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "MG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "10300000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "10300000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "AG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["1050000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1050000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "AG游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1050000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "AG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1050000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1050000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "RTG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1140000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1140000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "RTG游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1140000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "RTG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1140000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1140000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "DT游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1150000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1150000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "DT游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1150000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "DT游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1150000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1150000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "PP游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1160000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1160000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "PP游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1160000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "PP游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1160000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1160000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "YSB游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (["1130000"].includes(key)) {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount.toFixed(2))
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1130000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            }
          }
        },
        {
          title: "YSB游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1130000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count.toFixed(2)));
            }
          }
        },
        {
          title: "YSB游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1130000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1130000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "PG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1090000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1090000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "PG游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1090000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "PG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1090000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1090000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "HABA游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1040000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1040000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "HABA游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1040000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "HABA游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1040000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1040000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "PNG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1020000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1020000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "PNG游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1020000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "PNG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1020000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1020000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "KY游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let allCount = 0;
            for (let item of arr) {
              for (let key in item.gameTypeMap) {
                if (key == "1070000") {
                  allCount += item.gameTypeMap[key].winloseAmount;
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = allCount < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(allCount)
              );
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1070000") {
                  count = obj[key].winloseAmount;
                }
              }
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count)
              );
            }
          }
        },
        {
          title: "KY游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1070000") {
                  count = obj[key].submitAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        },
        {
          title: "KY游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let allCount = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1070000") {
                    allCount += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(allCount));
            } else {
              let obj = params.row.gameTypeMap;
              let count = 0;
              for (let key in obj) {
                if (key == "1070000") {
                  count += obj[key].mixAmount;
                }
              }
              return h("span", thousandFormatter(count));
            }
          }
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "昵称",
          key: "nickname",
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                props: {
                  content: "前往日报表",
                  placement: "top"
                }
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "dayPlayer",
                          query: {
                            name: params.row.userName,
                            time: this.changedTime,
                            type: this.gameType
                          }
                        });
                        localStorage.setItem("dayPlayer", "dayPlayer");
                      }
                    }
                  },
                  params.row.nickname
                )
              ]
            );
          }
        },
        {
          title: "账号",
          key: "userName",
          render: (h, params) => {
            let name = params.row.userName;
            return h(
              "Tooltip",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                props: {
                  content: "前往玩家详情",
                  placement: "top"
                }
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        localStorage.setItem("playerName", name);
                        this.$router.push({
                          name: "playDetail",
                          query: {
                            name: name
                          }
                        });
                      }
                    }
                  },
                  name
                )
              ]
            );
          }
        },

        {
          title: "交易次数",
          key: "betCount"
        },
        {
          title: "总游戏输赢金额",
          key: "winloseAmount",
          render: (h, params) => {
            let color = params.row.winloseAmount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(params.row.winloseAmount)
            );
          }
        },
        {
          title: "总游戏洗码量",
          key: "mixAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.mixAmount));
          }
        },
        {
          title: "NA游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["70000", "90000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "NA游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["70000", "90000"].includes(key)) {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "TTG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1010000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "TTG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1010000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "SA游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1060000", "1110000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "SA游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1060000", "1110000"].includes(key)) {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "SB游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1080000", "1120000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "SB游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1080000", "1120000"].includes(key)) {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "MG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["10300000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "MG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "10300000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "AG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1050000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "AG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1050000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "RTG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1140000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "RTG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1140000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "DT游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1150000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "DT游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1150000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "PP游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1160000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "PP游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1160000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "YSB游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (["1130000"].includes(key)) {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count.toFixed(2))
            );
          }
        },
        {
          title: "YSB游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1130000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "PG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1090000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "PG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1090000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "HABA游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1040000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "HABA游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1040000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "PNG游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1020000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "PNG游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1020000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "KY游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1070000") {
                count += obj[key].winloseAmount;
              }
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "KY游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1070000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        }
      ],
      columns11: [],
      columns22: []
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
    },
    permission() {
      return (
        JSON.parse(localStorage.getItem("userInfo")).subRolePermission || []
      );
    },
    level() {
      return JSON.parse(localStorage.getItem("userInfo")).level;
    },
    getTabWidth() {
      if (this.columns11.length <= 9) {
        return "100%";
      } else {
        return (this.columns11.length - 9) * 7 + 100 + "%";
      }
    }
  },
  methods: {
    confirm() {
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
      this.init();
    },
    changeSource() {
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
      this.init();
    },
    exportdata(table) {
      if (table == "table_0") {
        this.$refs.table_0.exportCsv({ filename: "current" });
      } else if (table == "table_1") {
        this.$refs.table_1.exportCsv({ filename: "next" });
      } else if (table == "table_2") {
        this.$refs.table_2.exportCsv({ filename: "player" });
      } else {
        let ref = "table" + table;
        this.$refs[ref][0].exportCsv({ filename: ref });
      }
      this.$Notice.config({
        top: 200,
        duration: 10
      });
      this.$Notice.success({
        title: "温馨提示:",
        desc:
          "因导出报表含中文字符,导出后请进行转码操作,方法是：1、先用记事本打开；2、点击文件-另存为-设置编码为ASNI-保存覆盖"
      });
    },
    reset() {
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
      this.defaultTime = getDefaultTime();
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.init();
    },
    search() {
      this.init();
    },
    types(value) {
      switch (value) {
        case "0":
          return "超级管理员";
          break;
        case "1":
          return "管理员";
          break;
        case "10":
          return "线路商";
          break;
        case "100":
          return "商户";
          break;
        case "1000":
          return "代理";
          break;
        case "10000":
          return "玩家";
          break;
      }
    },
    //获取下级
    async getNextLevel(showList, userId) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("getUserChild", {
            parent: userId,
            isTest: +this.source,
            gameType: this.gameType,
            query: {
              createdAt: this.changedTime
            }
          })
          .then(res => {
            showList.push(res.payload);
            showList = _.uniqWith(showList, _.isEqual);
            this.spinShow = false;
            resolve(showList);
          });
      });
    },
    //初始化
    async init() {
      this.spinShow = true;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let userId = userInfo.userId;
      let level = userInfo.level;
      let parent = "";
      let params1 = {};
      if (level == 0) {
        params1 = { userId: userId, isTest: +this.source };
        parent = "01";
      } else {
        parent = userId;
        this.source = 2;
        params1 = {
          userId: userId,
          isTest: +this.source,
          gameType: this.gameType,
          query: {
            createdAt: this.changedTime
          }
        };
        this.$store
          .dispatch("getPlayerList", {
            parentId: userId,
            gameType: this.gameType,
            query: {
              createdAt: this.changedTime
            }
          })
          .then(res => {
            this.playerList = res.payload;
          });
      }
      let params2 = {
        parent: parent,
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getUserChild", params2);
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.user = [];

      this.columns11 = await _.cloneDeep(this.columns1);
      this.columns22 = await _.cloneDeep(this.columns2);

      let arr = perms.payload;
      let removeArr = [];
      let removeArr1 = [];

      //console.log(getMixAmount(arr, ["1010000"]))

      if (getMixAmount(arr, ["1010000"]) == 0) {
        removeArr.push(11, 12, 13);
        removeArr1.push(8, 9);
      }
      if (getMixAmount(arr, ["1060000", "1110000"]) == 0) {
        removeArr.push(14, 15, 16);
        removeArr1.push(10, 11);
      }
      if (getMixAmount(arr, ["1120000", "1080000"]) == 0) {
        removeArr.push(17, 18, 19);
        removeArr1.push(12, 13);
      }
      if (getMixAmount(arr, ["10300000"]) == 0) {
        removeArr.push(20, 21, 22);
        removeArr1.push(14, 15);
      }
      if (getMixAmount(arr, ["1050000"]) == 0) {
        removeArr.push(23, 24, 25);
        removeArr1.push(16, 17);
      }
      if (getMixAmount(arr, ["1140000"]) == 0) {
        removeArr.push(26, 27, 28);
        removeArr1.push(18, 19);
      }
      if (getMixAmount(arr, ["1150000"]) == 0) {
        removeArr.push(29, 30, 31);
        removeArr1.push(20, 21);
      }
      if (getMixAmount(arr, ["1160000"]) == 0) {
        removeArr.push(32, 33, 34);
        removeArr1.push(22, 23);
      }
      if (getMixAmount(arr, ["1090000"]) == 0) {
        removeArr.push(35, 36, 37);
        removeArr1.push(24, 25);
      }
      if (getMixAmount(arr, ["1040000"]) == 0) {
        removeArr.push(38, 39, 40);
        removeArr1.push(26, 27);
      }
      if (getMixAmount(arr, ["1020000"]) == 0) {
        removeArr.push(41, 42, 43);
        removeArr1.push(28, 29);
      }
      if (getMixAmount(arr, ["1130000"]) == 0) {
        removeArr.push(44, 45, 46);
        removeArr1.push(30, 31);
      }
      if (getMixAmount(arr, ["1070000"]) == 0) {
        removeArr.push(47, 48, 49);
        removeArr1.push(32, 33);
      }

      //console.log(removeArr);

      let rs = Array.from(new Set(removeArr));
      let rs1 = Array.from(new Set(removeArr1));

      let flg = true;
      let flg1 = true;

      for (let i = 0; i < rs.length; i++) {
        if (flg) {
          this.columns11.splice(rs[i], 1);
          flg = !flg;
        } else {
          this.columns11.splice(rs[i] - i, 1);
        }
      }

      for (let i = 0; i < rs1.length; i++) {
        if (flg1) {
          this.columns22.splice(rs1[i], 1);
          flg1 = !flg1;
        } else {
          this.columns22.splice(rs1[i] - i, 1);
        }
      }

      //console.log(this.columns11);

      rs = [];
      rs1 = [];

      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.child = perms.payload;
      }
      this.spinShow = false;
    }
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    this.init();
  }
};
</script>
<style lang="less" scoped>
.allreport {
  min-height: 88vh;
  width: 320%;
  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    .right {
      display: inline-block;
      padding-left: 20px;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
}
</style>
