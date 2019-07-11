<template>
  <div class="allreport" :style="{width:getTabWidth}">
    <div class="nowList">
      <div class="top">
        <p class="title">
          {{$t('allReport.currentUser')}}
          <!-- <Button @click="exportdata('table_0')" size="small">导出数据</Button> -->
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
            size="small"
          ></DatePicker>
          <Button size="small" type="primary" @click="search" style="margin-left:1rem;margin-right:.3rem">{{$t('allReport.search')}}</Button>
          <Button size="small" @click="reset">{{$t('allReport.reset')}}</Button>
        </div>
      </div>
      <Table :columns="columns11" :data="user" size="small" ref="table_0">
        <template slot-scope="{row, index}" slot="userDisplayName">
          <Tooltip :content="$t('allReport.toDayReport')" placement="right">
            <span
              style="cursor:pointer;color:#20a0ff"
              @click="userDisplayNameConfig(row)"
            >{{row.displayName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span
            :style="{color: winloseAmountConfig(row).color}"
          >{{winloseAmountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userSubmitAmount">
          <span>{{submitAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uNaWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['70000', '90000'], row, 'NA').color}"
          >{{gameWinloseAmountConfig(['70000', '90000'], row, 'NA').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uNaSubmitAmount">
          <span>{{gameSubmitAmountConfig(['70000', '90000'], row, 'NA').submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uTtgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1010000'], row, 'TTG').color}"
          >{{gameWinloseAmountConfig(['1010000'], row, 'TTG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uTtgSubmitAmount">
          <span>{{gameSubmitAmountConfig(['1010000'], row, 'TTG', 10).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uSaWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1060000', '1110000'], row, 'SA').color}"
          >{{gameWinloseAmountConfig(['1060000', '1110000'], row, 'SA').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uSaSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1060000", "1110000"], row, 'SA').submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uSbWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1120000', '1080000'], row, 'SB').color}"
          >{{gameWinloseAmountConfig(["1120000", "1080000"], row, 'SB').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uSbSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1120000", "1080000"], row, 'SB').submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uMgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['10300000'], row, 'MG').color}"
          >{{gameWinloseAmountConfig(["10300000"], row, 'MG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uMgSubmitAmount">
          <span>{{gameSubmitAmountConfig(["10300000"], row, 'MG', 16).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uAgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1050000'], row, 'AG').color}"
          >{{gameWinloseAmountConfig(["1050000"], row, 'AG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uAgSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1050000"], row, 'AG', 18).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uRtgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1140000'], row, 'RTG').color}"
          >{{gameWinloseAmountConfig(["1140000"], row, 'RTG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uRtgSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1140000"], row, 'RTG', 20).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uDtWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1150000'], row, 'DT').color}"
          >{{gameWinloseAmountConfig(["1150000"], row, 'DT').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uDtSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1150000"], row, 'DT', 22).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uPpWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1160000'], row, 'PP').color}"
          >{{gameWinloseAmountConfig(["1160000"], row, 'PP').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uPpSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1160000"], row, 'PP', 24).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uYsbWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1130000'], row, 'YSB').color}"
          >{{gameWinloseAmountConfig(["1130000"], row, 'YSB').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uYsbSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1130000"], row, 'YSB', 26).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uPgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1090000'], row, 'PG').color}"
          >{{gameWinloseAmountConfig(["1090000"], row, 'PG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uPgSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1090000"], row, 'PG', 28).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uHabaWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1040000'], row, 'HABA').color}"
          >{{gameWinloseAmountConfig(["1040000"], row, 'HABA').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uHabaSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1040000"], row, 'HABA', 30).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uPngWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1020000'], row, 'PNG').color}"
          >{{gameWinloseAmountConfig(["1020000"], row, 'PNG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uPngSubmitAmount">
          <span>{{gameSubmitAmountConfig(["1020000"], row, 'PNG', 32).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uKyWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1070000'], row, 'KY').color}"
          >{{gameWinloseAmountConfig(["1070000"], row, 'KY', 33).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uKySubmitAmount">
          <span>{{gameSubmitAmountConfig(["1070000"], row, 'KY', 34).submitAmount}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList" style="margin-top:1rem">
      <p class="title">
        {{$t('allReport.PlayerList')}}
        <!-- <Button @click="exportdata('table_1')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns22" :data="playerList" size="small" ref="table_1">
        <template slot-scope="{row, index}" slot="playerName">
          <Tooltip :content="$t('allReport.toPlayerDetail')" placement="right">
            <span
              style="cursor:pointer;color:#20a0ff"
              @click="playerNameConfig(row)"
            >{{row.userName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="playerWinloseAmount">
          <span
            :style="{color: winloseAmountConfig(row).color}"
          >{{winloseAmountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pNaWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['70000', '90000'], row, 'NA').color}"
          >{{gameWinloseAmountConfig(['70000', '90000'], row, 'NA').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="nickname">
          {{row.nickname == 'NULL!' ? '-' : row.nickname}}
        </template>
        <template slot-scope="{row, index}" slot="pTtgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1010000'], row, 'TTG').color}"
          >{{gameWinloseAmountConfig(['1010000'], row, 'TTG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pSaWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1060000', '1110000'], row, 'SA').color}"
          >{{gameWinloseAmountConfig(['1060000', '1110000'], row, 'SA').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pSbWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1120000', '1080000'], row, 'SB').color}"
          >{{gameWinloseAmountConfig(["1120000", "1080000"], row, 'SB').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pMgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['10300000'], row, 'MG').color}"
          >{{gameWinloseAmountConfig(["10300000"], row, 'MG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pAgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1050000'], row, 'AG').color}"
          >{{gameWinloseAmountConfig(["1050000"], row, 'AG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pRtgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1140000'], row, 'RTG').color}"
          >{{gameWinloseAmountConfig(["1140000"], row, 'RTG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pDtWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1150000'], row, 'DT').color}"
          >{{gameWinloseAmountConfig(["1150000"], row, 'DT').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pPpWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1160000'], row, 'PP').color}"
          >{{gameWinloseAmountConfig(["1160000"], row, 'PP').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pYsbWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1130000'], row, 'YSB').color}"
          >{{gameWinloseAmountConfig(["1130000"], row, 'YSB').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pPgWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1090000'], row, 'PG').color}"
          >{{gameWinloseAmountConfig(["1090000"], row, 'PG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pHabaWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1040000'], row, 'HABA').color}"
          >{{gameWinloseAmountConfig(["1040000"], row, 'HABA').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pPngWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1020000'], row, 'PNG').color}"
          >{{gameWinloseAmountConfig(["1020000"], row, 'PNG').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pKyWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1070000'], row, 'KY').color}"
          >{{gameWinloseAmountConfig(["1070000"], row, 'KY', 33).winloseAmount}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div>{{$t('allReport.loading')}}</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import {
  getWinloseAmount,
  getsubmitAmount,
  winloseAmountCount
} from "@/config/getAmount";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    return {
      userRemoveArr: [], //用户需要隐藏的列
      playerRemoveArr: [], //玩家需要隐藏的列
      tabCount: 7, //显示的列数
      options: {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
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
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
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
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
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
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
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
      playerList: [], //玩家列表
      user: [], //当前商户
      gameType: [
        70000,
        90000,
        1010000,
        1090000,
        1040000,
        1020000,
        1070000,
        10300000,
        1050000,
        1060000,
        1100000,
        1110000,
        1130000,
        1140000,
        1160000,
        1150000,
        1080000,
        1120000
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "昵称",
          align: 'center',
          slot: "userDisplayName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '昵称' : 'Nickname'
            )
          }
        },
        {
          title: "交易次数",
          align: 'center',
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易次数' : 'Transaction Count'
            )
          }
        },
        {
          title: "总游戏输赢金额",
          align: 'center',
          slot: "userWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '总游戏输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "总游戏交公司",
          align: 'center',
          slot: "userSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '总游戏交公司' : 'Submit Amount'
            )
          }
        },
        {
          title: "NA游戏(输赢金额)",
          align: 'center',
          slot: "uNaWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA游戏(输赢金额)' : 'NA(win/lose amount)'
            )
          }
        },
        {
          title: "NA游戏(商家交公司)",
          align: 'center',
          slot: "uNaSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA游戏(商家交公司)' : 'NA(submit amount)'
            )
          }
        },
        {
          title: "TTG游戏(输赢金额)",
          align: 'center',
          slot: "uTtgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'TTG游戏(输赢金额)' : 'TTG(win/lose amount)'
            )
          }
        },
        {
          title: "TTG游戏(商家交公司)",
          slot: "uTtgSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'TTG游戏(商家交公司)' : 'TTG(submit amount)'
            )
          }
        },
        {
          title: "SA游戏(输赢金额)",
          align: 'center',
          slot: "uSaWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'SA游戏(输赢金额)' : 'SA(win/lose amount)'
            )
          }
        },
        {
          title: "SA游戏(商家交公司)",
          align: 'center',
          slot: "uSaSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'SA游戏(商家交公司)' : 'SA(submit amount)'
            )
          }
        },
        {
          title: "SB游戏(输赢金额)",
          align: 'center',
          slot: "uSbWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'SB游戏(输赢金额)' : 'SB(win/lose amount)'
            )
          }
        },
        {
          title: "SB游戏(商家交公司)",
          align: 'center',
          slot: "uSbSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'SB游戏(商家交公司)' : 'SB(submit amount)'
            )
          }
        },
        {
          title: "MG游戏(输赢金额)",
          align: 'center',
          slot: "uMgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'MG游戏(输赢金额)' : 'MG(win/lose amount)'
            )
          }
        },
        {
          title: "MG游戏(商家交公司)",
          align: 'center',
          slot: "uMgSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'MG游戏(商家交公司)' : 'MG(submit amount)'
            )
          }
        },
        {
          title: "AG游戏(输赢金额)",
          align: 'center',
          slot: "uAgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'AG游戏(输赢金额)' : 'AG(win/lose amount)'
            )
          }
        },
        {
          title: "AG游戏(商家交公司)",
          align: 'center',
          slot: "uAgSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'AG游戏(商家交公司)' : 'AG(submit amount)'
            )
          }
        },
        {
          title: "RTG游戏(输赢金额)",
          align: 'center',
          slot: "uRtgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'RTG游戏(输赢金额)' : 'RTG(win/lose amount)'
            )
          }
        },
        {
          title: "RTG游戏(商家交公司)",
          align: 'center',
          slot: "uRtgSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'RTG游戏(商家交公司)' : 'RTG(submit amount)'
            )
          }
        },
        {
          title: "DT游戏(输赢金额)",
          align: 'center',
          slot: "uDtWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'DT游戏(输赢金额)' : 'DT(win/lose amount)'
            )
          }
        },
        {
          title: "DT游戏(商家交公司)",
          align: 'center',
          slot: "uDtSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'DT游戏(商家交公司)' : 'DT(submit amount)'
            )
          }
        },
        {
          title: "PP游戏(输赢金额)",
          align: 'center',
          slot: "uPpWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PP游戏(输赢金额)' : 'PP(win/lose amount)'
            )
          }
        },
        {
          title: "PP游戏(商家交公司)",
          align: 'center',
          slot: "uPpSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PP游戏(商家交公司)' : 'PP(submit amount)'
            )
          }
        },
        {
          title: "YSB游戏(输赢金额)",
          align: 'center',
          slot: "uYsbWinloseAmount",
          rrenderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'YSB游戏(输赢金额)' : 'YSB(win/lose amount)'
            )
          }
        },
        {
          title: "YSB游戏(商家交公司)",
          align: 'center',
          slot: "uYsbSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'YSB游戏(商家交公司)' : 'YSB(submit amount)'
            )
          }
        },
        {
          title: "PG游戏(输赢金额)",
          align: 'center',
          slot: "uPgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PG游戏(输赢金额)' : 'PG game(win/lose amount)'
            )
          }
        },
        {
          title: "PG游戏(商家交公司)",
          align: 'center',
          slot: "uPgSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PG游戏(商家交公司)' : 'PG game(submit amount)'
            )
          }
        },
        {
          title: "HABA游戏(输赢金额)",
          align: 'center',
          slot: "uHabaWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'HABA游戏(输赢金额)' : 'HABA game(win/lose amount)'
            )
          }
        },
        {
          title: "HABA游戏(商家交公司)",
          align: 'center',
          slot: "uHabaSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'HABA游戏(商家交公司)' : 'HABA game(submit amount)'
            )
          }
        },
        {
          title: "PNG游戏(输赢金额)",
          align: 'center',
          slot: "uPngWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PNG游戏(输赢金额)' : 'PNG game(win/lose amount)'
            )
          }
        },
        {
          title: "PNG游戏(商家交公司)",
          align: 'center',
          slot: "uPngSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PNG游戏(商家交公司)' : 'PNG game(submit amount)'
            )
          }
        },
        {
          title: "KY游戏(输赢金额)",
          align: 'center',
          slot: "uKyWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'KY游戏(输赢金额)' : 'KY game(win/lose amount)'
            )
          }
        },
        {
          title: "KY游戏(商家交公司)",
          align: 'center',
          slot: "uKySubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'KY游戏(商家交公司)' : 'KY game(submit amount)'
            )
          }
        }
      ],
      columns2: [
        {
          title: "序号",
          align: 'center',
          type: "index",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "账号",
          align: 'center',
          slot: "playerName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '账号' : 'Account'
            )
          }
        },
        {
          title: "昵称",
          align: 'center',
          slot: "nickname",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '昵称' : 'Nicname'
            )
          }
        },
        {
          title: "交易次数",
          align: 'center',
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易次数' : 'Transaction Count'
            )
          }
        },
        {
          title: "总游戏输赢金额",
          align: 'center',
          slot: "playerWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '总游戏输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "NA游戏(输赢金额)",
          align: 'center',
          slot: "pNaWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA游戏(输赢金额)' : 'NA(win/lose amount)'
            )
          }
        },
        {
          title: "TTG游戏(输赢金额)",
          align: 'center',
          slot: "pTtgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'TTG游戏(输赢金额)' : 'TTG(win/lose amount)'
            )
          }
        },
        {
          title: "SA游戏(输赢金额)",
          align: 'center',
          slot: "pSaWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'SA游戏(输赢金额)' : 'SA(win/lose amount)'
            )
          }
        },
        {
          title: "SB游戏(输赢金额)",
          align: 'center',
          slot: "pSbWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'SB游戏(输赢金额)' : 'SB(win/lose amount)'
            )
          }
        },
        {
          title: "MG游戏(输赢金额)",
          align: 'center',
          slot: "pMgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'MG游戏(输赢金额)' : 'MG(win/lose amount)'
            )
          }
        },
        {
          title: "AG游戏(输赢金额)",
          align: 'center',
          slot: "pAgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'AG游戏(输赢金额)' : 'AG(win/lose amount)'
            )
          }
        },
        {
          title: "RTG游戏(输赢金额)",
          align: 'center',
          slot: "pRtgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'RTG游戏(输赢金额)' : 'RTG(win/lose amount)'
            )
          }
        },
        {
          title: "DT游戏(输赢金额)",
          align: 'center',
          slot: "pDtWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'DT游戏(输赢金额)' : 'DT(win/lose amount)'
            )
          }
        },
        {
          title: "PP游戏(输赢金额)",
          align: 'center',
          slot: "pPpWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PP游戏(输赢金额)' : 'PP(win/lose amount)'
            )
          }
        },
        {
          title: "YSB游戏(输赢金额)",
          align: 'center',
          slot: "pYsbWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'YSB游戏(输赢金额)' : 'YSB(win/lose amount)'
            )
          }
        },
        {
          title: "PG游戏(输赢金额)",
          align: 'center',
          slot: "pPgWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PG游戏(输赢金额)' : 'PG(win/lose amount)'
            )
          }
        },
        {
          title: "HABA游戏(输赢金额)",
          align: 'center',
          slot: "pHabaWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'HABA游戏(输赢金额)' : 'HABA(win/lose amount)'
            )
          }
        },
        {
          title: "PNG游戏(输赢金额)",
          align: 'center',
          slot: "pPngWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'PNG游戏(输赢金额)' : 'PNG(win/lose amount)'
            )
          }
        },
        {
          title: "KY游戏(输赢金额)",
          align: 'center',
          slot: "pKyWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'KY游戏(输赢金额)' : 'KY(win/lose amount)'
            )
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
    getTabWidth() {
      if (this.columns11.length <= 9) {
        return "100%";
      } else {
        return (this.columns11.length - 9) * 7 + 100 + "%";
      }
      //return this.columns11.length
    }
  },
  methods: {
    /* 用户列表配置 */
    //昵称
    userDisplayNameConfig(row) {
      let time = this.changedTime;
      this.$router.push({
        name: "dayMerchant",
        query: { name: row.sn, time: time, type: "" }
      });
      localStorage.setItem("dayMerchant", "dayMerchant");
    },
    //总游戏输赢金额
    winloseAmountConfig(row) {
      if (row.winloseAmount < 0) {
        return { amount: thousandFormatter(row.winloseAmount), color: "#f30" };
      } else {
        return { amount: thousandFormatter(row.winloseAmount), color: "#0c0" };
      }
    },
    //总游戏交公司
    submitAmountConfig(row) {
      return thousandFormatter(row.submitAmount);
    },

    //游戏输赢金额
    gameWinloseAmountConfig(arr, row, name) {
      let winloseAmount = getWinloseAmount(arr, row);
      winloseAmount = winloseAmount.toFixed(2);
      if (winloseAmount < 0) {
        return { winloseAmount, color: "#f30" };
      } else {
        return { winloseAmount, color: "#0c0" };
      }
    },
    //游戏交公司
    gameSubmitAmountConfig(arr, row, name) {
      let submitAmount = getsubmitAmount(arr, row);
      submitAmount = submitAmount.toFixed(2);
      return { submitAmount };
    },
    /* 玩家列表配置 */
    //账号
    playerNameConfig(row) {
      localStorage.setItem("playerName", row.userName);
      this.$router.push({
        name: "playDetail",
        query: {
          name: row.userName,
          time: this.changedTime,
          type: ""
        }
      });
      localStorage.setItem("playDetail", "playDetail");  
    },
  
    confirm() {
      this.init();
    },
    exportdata(table) {
      if (table == "table_0") {
        this.$refs.table_0.exportCsv({ filename: "current" });
      } else if (table == "table_1") {
        this.$refs.table_1.exportCsv({ filename: "player" });
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
      this.defaultTime = getDefaultTime();
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
    async init() {
      let userId = localStorage.loginId;
      this.spinShow = true;
      let params1 = {
        userId: userId,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let params2 = {
        parentId: userId,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getPlayerList", params2);
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];

      this.columns11 = await _.cloneDeep(this.columns1);
      this.columns22 = await _.cloneDeep(this.columns2);

      let arr = perms.payload;

      let removeArr = [];
      let removeArr1 = [];

      //要删除的列下标
      if (winloseAmountCount(arr, ["1010000"]) == 0) {
        removeArr.push(7, 8);
        removeArr1.push(6)
      }
      if (winloseAmountCount(arr, ["1060000", "1110000"]) == 0) {
        removeArr.push(9, 10);
        removeArr1.push(7)
      }
      if (winloseAmountCount(arr, ["1120000", "1080000"]) == 0) {
        removeArr.push(11, 12);
        removeArr1.push(8)
      }
      if (winloseAmountCount(arr, ["10300000"]) == 0) {
        removeArr.push(13, 14);
        removeArr1.push(9)
      }
      if (winloseAmountCount(arr, ["1050000"]) == 0) {
        removeArr.push(15, 16);
        removeArr1.push(10)
      }
      if (winloseAmountCount(arr, ["1140000"]) == 0) {
        removeArr.push(17, 18);
        removeArr1.push(11)
      }
      if (winloseAmountCount(arr, ["1150000"]) == 0) {
        removeArr.push(19, 20);
        removeArr1.push(12)
      }
      if (winloseAmountCount(arr, ["1160000"]) == 0) {
        removeArr.push(21, 22);
        removeArr1.push(13)
      }
      if (winloseAmountCount(arr, ["1130000"]) == 0) {
        removeArr.push(23, 24);
        removeArr1.push(14)
      }
      if (winloseAmountCount(arr, ["1090000"]) == 0) {
        removeArr.push(25, 26);
        removeArr1.push(15)
      }
      if (winloseAmountCount(arr, ["1040000"]) == 0) {
        removeArr.push(27, 28);
        removeArr1.push(16)
      }
      if (winloseAmountCount(arr, ["1020000"]) == 0) {
        removeArr.push(29, 30);
        removeArr1.push(17)
      }
      if (winloseAmountCount(arr, ["1070000"]) == 0) {
        removeArr.push(31, 32);
        removeArr1.push(18)
      }

      let flg = true;
      let flg1 = true

      for (let i = 0; i < removeArr.length; i++) {
        if (flg) {
          this.columns11.splice(removeArr[i], 1);
          flg = !flg;
        } else {
          this.columns11.splice(removeArr[i] - i, 1);
        }
      }

      for (let i = 0; i < removeArr1.length; i++) {
        if (flg1) {
          this.columns22.splice(removeArr1[i], 1)
          flg1 = !flg1
        } else {
          this.columns22.splice(removeArr1[i] - i, 1)   
        }
          
      }

      removeArr = [];
      removeArr1 = []

      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.playerList = perms.payload;
      }
    }
  },
  created() {
    // console.log(this.defaultTime);
    this.init();
  }
};
</script>
<style lang="less" scoped>
.allreport {
  min-height: 87vh;
  .title {
    font-size: 1.2rem;
    //margin: 0.5rem 0 0.5rem;
    margin-bottom: 1rem;
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
  /deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
}
</style>
