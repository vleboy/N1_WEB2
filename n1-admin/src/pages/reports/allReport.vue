<template>
  <div class="allreport" :style="{width:getTabWidth}">
 <!--  <div class="allreport" style="width:200%"> -->
    <div class="nowList">
      <div class="top">
        <p class="title" style="margin-top:0">
          当前用户列表
          <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource" size="small" style="margin:0 1rem">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
          <Button  @click="exportdata('table_0')" size="small">导出数据</Button>
        </p>
        <div class="right">
          <DatePicker
          size="small"
            type="datetimerange"
            :options="options"
            :editable="false"
            v-model="defaultTime"
            placeholder="选择日期时间范围(默认最近一周)"
            style="width: 300px"
            @on-ok="confirm"
          ></DatePicker>
          <Button type="primary" @click="search" size="small" style="margin: 0 .3rem 0 1rem">搜索</Button>
          <Button  @click="reset" size="small">重置</Button>
        </div>
      </div>
      <Table :columns="columns11" :data="user" size="small" ref="table_0">
        <template slot-scope="{row, index}" slot="userRole">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userDisplayName">
          <tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="userDisplayName(row)">{{row.displayName}}</span>
          </tooltip>  
        </template>
        <template slot-scope="{row, index}" slot="userUname">
          <Tooltip content="显示下一级" placement="top" transfer>
            <span style="color:#20a0ff;cursor:pointer" @click="userUname(row)">
              {{userUnameConfig(row)}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row,index}" slot="userBetCount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="submitAmount">
          <span>{{submitAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="naWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['70000','90000']).color}">{{gameWinloseAmount(row,["70000","90000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="naSubmitAmount">
          <span>{{gameSubmitAmount(row,["70000","90000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ttgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1010000']).color}">{{gameWinloseAmount(row,["1010000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ttgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1010000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="saWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1060000', '1110000']).color}">{{gameWinloseAmount(row,["1060000", "1110000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="saSubmitAmount">
          <span>{{gameSubmitAmount(row,["1060000", "1110000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="sbWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1120000', '1080000']).color}">{{gameWinloseAmount(row,["1120000", "1080000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="sbSubmitAmount">
          <span>{{gameSubmitAmount(row,["1120000", "1080000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['10300000']).color}">{{gameWinloseAmount(row,["10300000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mgSubmitAmount">
          <span>{{gameSubmitAmount(row,["10300000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="agWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1050000']).color}">{{gameWinloseAmount(row,["1050000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="agSubmitAmount">
          <span>{{gameSubmitAmount(row,["1050000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rtgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1140000']).color}">{{gameWinloseAmount(row,["1140000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rtgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1140000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="dtWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1150000']).color}">{{gameWinloseAmount(row,["1150000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="dtSubmitAmount">
          <span>{{gameSubmitAmount(row,["1150000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ppWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1160000']).color}">{{gameWinloseAmount(row,["1160000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ppSubmitAmount">
          <span>{{gameSubmitAmount(row,["1160000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1090000']).color}">{{gameWinloseAmount(row,["1090000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1090000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="habaWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1040000']).color}">{{gameWinloseAmount(row,["1040000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="habaSubmitAmount">
          <span>{{gameSubmitAmount(row,["1040000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pngWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1020000']).color}">{{gameWinloseAmount(row,["1020000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="pngSubmitAmount">
          <span>{{gameSubmitAmount(row,["1020000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ysbWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1130000']).color}">{{gameWinloseAmount(row,["1130000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ysbSubmitAmount">
          <span>{{gameSubmitAmount(row,["1130000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="kyWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1070000']).color}">{{gameWinloseAmount(row,["1070000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="kySubmitAmount">
          <span>{{gameSubmitAmount(row,["1070000"])}}</span>
        </template>
      </Table>
    </div>
    <div class="childList">
      <p class="title">
        直属下级列表
        <Button  @click="exportdata('table_1')" size="small">导出数据</Button>
      </p>
      <Table :columns="columns11" :data="child" size="small" ref="table_1">
        <template slot-scope="{row, index}" slot="userRole">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userDisplayName">
          <tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="userDisplayName(row)">{{row.displayName}}</span>
          </tooltip>  
        </template>
        <template slot-scope="{row, index}" slot="userUname">
          <Tooltip content="显示下一级" placement="top" transfer>
            <span style="color:#20a0ff;cursor:pointer" @click="userUname(row)">
              {{userUnameConfig(row)}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row,index}" slot="userBetCount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="submitAmount">
          <span>{{submitAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="naWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['70000','90000']).color}">{{gameWinloseAmount(row,["70000","90000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="naSubmitAmount">
          <span>{{gameSubmitAmount(row,["70000","90000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ttgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1010000']).color}">{{gameWinloseAmount(row,["1010000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ttgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1010000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="saWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1060000', '1110000']).color}">{{gameWinloseAmount(row,["1060000", "1110000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="saSubmitAmount">
          <span>{{gameSubmitAmount(row,["1060000", "1110000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="sbWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1120000', '1080000']).color}">{{gameWinloseAmount(row,["1120000", "1080000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="sbSubmitAmount">
          <span>{{gameSubmitAmount(row,["1120000", "1080000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['10300000']).color}">{{gameWinloseAmount(row,["10300000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mgSubmitAmount">
          <span>{{gameSubmitAmount(row,["10300000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="agWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1050000']).color}">{{gameWinloseAmount(row,["1050000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="agSubmitAmount">
          <span>{{gameSubmitAmount(row,["1050000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rtgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1140000']).color}">{{gameWinloseAmount(row,["1140000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rtgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1140000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="dtWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1150000']).color}">{{gameWinloseAmount(row,["1150000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="dtSubmitAmount">
          <span>{{gameSubmitAmount(row,["1150000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ppWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1160000']).color}">{{gameWinloseAmount(row,["1160000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ppSubmitAmount">
          <span>{{gameSubmitAmount(row,["1160000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1090000']).color}">{{gameWinloseAmount(row,["1090000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1090000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="habaWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1040000']).color}">{{gameWinloseAmount(row,["1040000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="habaSubmitAmount">
          <span>{{gameSubmitAmount(row,["1040000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pngWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1020000']).color}">{{gameWinloseAmount(row,["1020000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="pngSubmitAmount">
          <span>{{gameSubmitAmount(row,["1020000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ysbWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1130000']).color}">{{gameWinloseAmount(row,["1130000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ysbSubmitAmount">
          <span>{{gameSubmitAmount(row,["1130000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="kyWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1070000']).color}">{{gameWinloseAmount(row,["1070000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="kySubmitAmount">
          <span>{{gameSubmitAmount(row,["1070000"])}}</span>
        </template>
      </Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
        <Button  @click="exportdata(index)" size="small">导出数据</Button>
      </p>
      <Table :columns="columns11" :data="item" size="small" :ref="'table'+index">
        <template slot-scope="{row, index}" slot="userRole">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userDisplayName">
          <tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="userDisplayName(row)">{{row.displayName}}</span>
          </tooltip>  
        </template>
        <template slot-scope="{row, index}" slot="userUname">
          <Tooltip content="显示下一级" placement="top" transfer>
            <span style="color:#20a0ff;cursor:pointer" @click="userUname(row)">
              {{userUnameConfig(row)}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row,index}" slot="userBetCount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="submitAmount">
          <span>{{submitAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="naWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['70000','90000']).color}">{{gameWinloseAmount(row,["70000","90000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="naSubmitAmount">
          <span>{{gameSubmitAmount(row,["70000","90000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ttgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1010000']).color}">{{gameWinloseAmount(row,["1010000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ttgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1010000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="saWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1060000', '1110000']).color}">{{gameWinloseAmount(row,["1060000", "1110000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="saSubmitAmount">
          <span>{{gameSubmitAmount(row,["1060000", "1110000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="sbWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1120000', '1080000']).color}">{{gameWinloseAmount(row,["1120000", "1080000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="sbSubmitAmount">
          <span>{{gameSubmitAmount(row,["1120000", "1080000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['10300000']).color}">{{gameWinloseAmount(row,["10300000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mgSubmitAmount">
          <span>{{gameSubmitAmount(row,["10300000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="agWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1050000']).color}">{{gameWinloseAmount(row,["1050000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="agSubmitAmount">
          <span>{{gameSubmitAmount(row,["1050000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rtgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1140000']).color}">{{gameWinloseAmount(row,["1140000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rtgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1140000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="dtWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1150000']).color}">{{gameWinloseAmount(row,["1150000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="dtSubmitAmount">
          <span>{{gameSubmitAmount(row,["1150000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ppWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1160000']).color}">{{gameWinloseAmount(row,["1160000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ppSubmitAmount">
          <span>{{gameSubmitAmount(row,["1160000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pgWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1090000']).color}">{{gameWinloseAmount(row,["1090000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pgSubmitAmount">
          <span>{{gameSubmitAmount(row,["1090000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="habaWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1040000']).color}">{{gameWinloseAmount(row,["1040000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="habaSubmitAmount">
          <span>{{gameSubmitAmount(row,["1040000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pngWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1020000']).color}">{{gameWinloseAmount(row,["1020000"]).allCount}}</span>
        </template>
         <template slot-scope="{row, index}" slot="pngSubmitAmount">
          <span>{{gameSubmitAmount(row,["1020000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ysbWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1130000']).color}">{{gameWinloseAmount(row,["1130000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="ysbSubmitAmount">
          <span>{{gameSubmitAmount(row,["1130000"])}}</span>
        </template>
        <template slot-scope="{row, index}" slot="kyWinloseAmount">
          <span :style="{color: gameWinloseAmount(row,['1070000']).color}">{{gameWinloseAmount(row,["1070000"]).allCount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="kySubmitAmount">
          <span>{{gameSubmitAmount(row,["1070000"])}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName">({{ userName }})</span>所属玩家列表
        <Button  @click="exportdata('table_2')" size="small">导出数据</Button>
      </p>
      <Table :columns="columns22" :data="playerList" size="small" ref="table_2">
        <template slot-scope="{row, index}" slot="playerNickname">
          <tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="playerNickname(row)">{{row.nickname == 'NULL!' ? '-' : row.nickname}}</span>
          </tooltip>  
        </template>
        <template slot-scope="{row, index}" slot="playerAccount">
          <Tooltip content="前往玩家详情" placement="top" transfer>
            <span style="color:#20a0ff;cursor:pointer" @click="playerAccount(row)">
              {{row.userName}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row,index}" slot="playerBetCount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="playerWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template v-for="item in winloseAmountList" slot-scope="{row, index}" :slot="item.name">
          <span :style="{color: gameWinloseAmount(row,item.code).color}">{{gameWinloseAmount(row,item.code).allCount}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import { getWinloseAmount } from "@/config/getWinloseAmount";
import { getDefaultTime } from "@/config/getDefaultTime";
import { getGameType } from "@/config/getGameType";
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
      //玩家游戏输赢金额
      winloseAmountList:[
        {
          name: 'pNaWinloseAmount',
          code: ['70000','90000']
        },
        {
          name: 'pTtgWinloseAmount',
          code: ['1010000']
        },
        {
          name: 'pSaWinloseAmount',
          code: ['1060000', '1110000']
        },
        {
          name: 'pSbWinloseAmount',
          code: ['1120000', '1080000']
        },
        {
          name: 'pMgWinloseAmount',
          code: ['10300000']
        },
        {
          name: 'pAgWinloseAmount',
          code: ['1050000']
        },
        {
          name: 'pRtgWinloseAmount',
          code: ['1140000']
        },
        {
          name: 'pDtWinloseAmount',
          code: ['1150000']
        },
        {
          name: 'pPpWinloseAmount',
          code: ['1160000']
        },
        {
          name: 'pPgWinloseAmount',
          code: ['1090000']
        },
        {
          name: 'pHabaWinloseAmount',
          code: ['1040000']
        },
        {
          name: 'pPngWinloseAmount',
          code: ['1020000']
        },
        {
          name: 'pYsbWinloseAmount',
          code: ['1130000']
        },
        {
          name: 'pKyWinloseAmount',
          code: ['1070000']
        },
      ],
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
        1100000,
        1110000,
        1130000,
        1140000,
        1150000,
        1160000,
        1120000,
        1080000
      ],
      columns1: [
        {
          title: "序号",
          align: 'center',
          type: "index",
          maxWidth: 60
        },
        {
          title: "类型",
          align: 'center',
          slot: "userRole"
        },
        {
          title: "昵称",
          align: 'center',
          slot: "userDisplayName"
        },
        {
          title: "账号/标识",
          align: 'center',
          slot: "userUname"
        },
        {
          title: "交易次数",
          align: 'center',
          slot: "userBetCount"
        },
        {
          title: "总游戏输赢金额",
          align: 'center',
          slot: "userWinloseAmount"
        },
        {
          title: "总游戏交公司",
          align: 'center',
          slot: "submitAmount"
        },
        {
          title: "NA游戏(输赢金额)",
          align: 'center',
          slot: "naWinloseAmount"
        },
        {
          title: "NA游戏(商家交公司)",
          align: 'center',
          slot: "naSubmitAmount"
        },
        {
          title: "TTG游戏(输赢金额)",
          align: 'center',
          slot: "ttgWinloseAmount"
        },
        {
          title: "TTG游戏(商家交公司)",
          align: 'center',
          slot: "ttgSubmitAmount"
        },
        {
          title: "SA游戏(输赢金额)",
          align: 'center',
          slot: "saWinloseAmount"
        },
        {
          title: "SA游戏(商家交公司)",
          align: 'center',
          slot: "saSubmitAmount"
        },
        {
          title: "SB游戏(输赢金额)",
          align: 'center',
          slot: "sbWinloseAmount"
        },
        {
          title: "SB游戏(商家交公司)",
          align: 'center',
          slot: "sbSubmitAmount"
        },
        {
          title: "MG游戏(输赢金额)",
          align: 'center',
          slot: "mgWinloseAmount"
        },
        {
          title: "MG游戏(商家交公司)",
          align: 'center',
          slot: "mgSubmitAmount"
        },
        {
          title: "AG游戏(输赢金额)",
          align: 'center',
          slot: "agWinloseAmount"
        },
        {
          title: "AG游戏(商家交公司)",
          align: 'center',
          slot: "agSubmitAmount"
        },
        {
          title: "RTG游戏(输赢金额)",
          align: 'center',
          slot: "rtgWinloseAmount"
        },
        {
          title: "RTG游戏(商家交公司)",
          align: 'center',
          slot: "rtgSubmitAmount"
        },
        {
          title: "DT游戏(输赢金额)",
          align: 'center',
          slot: "dtWinloseAmount"
        },
        {
          title: "DT游戏(商家交公司)",
          align: 'center',
          slot: "dtSubmitAmount"
        },
        {
          title: "PP游戏(输赢金额)",
          align: 'center',
          slot: "ppWinloseAmount"
        },
        {
          title: "PP游戏(商家交公司)",
          align: 'center',
          slot: "ppSubmitAmount"
        },
        {
          title: "PG游戏(输赢金额)",
          align: 'center',
          slot: "pgWinloseAmount"
        },
        {
          title: "PG游戏(商家交公司)",
          align: 'center',
          slot: "pgSubmitAmount"
        },
        {
          title: "HABA游戏(输赢金额)",
          align: 'center',
          slot: "habaWinloseAmount"
        },
        {
          title: "HABA游戏(商家交公司)",
          align: 'center',
          slot: "habaSubmitAmount"
        },
        {
          title: "PNG游戏(输赢金额)",
          align: 'center',
          slot: "pngWinloseAmount"
        },
        {
          title: "PNG游戏(商家交公司)",
          align: 'center',
          slot: "pngSubmitAmount"
        },
        {
          title: "YSB游戏(输赢金额)",
          align: 'center',
          slot: "ysbWinloseAmount"
        },
        {
          title: "YSB游戏(商家交公司)",
          align: 'center',
          slot: "ysbSubmitAmount"
        },
        {
          title: "KY游戏(输赢金额)",
          align: 'center',
          slot: "kyWinloseAmount"
        },
        {
          title: "KY游戏(商家交公司)",
          align: 'center',
          slot: "kySubmitAmount"
        }
      ],
      columns11: [],
      columns22: [],
      columns2: [
        {
          title: "序号",
          align: 'center',
          type: "index",
          maxWidth: 60
        },
        {
          title: "昵称",
          align: 'center',
          slot: "playerNickname"
        },
        {
          title: "账号",
          align: 'center',
          slot: "playerAccount"
        },
        {
          title: "交易次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "总游戏输赢金额",
          align: 'center',
          slot: "playerWinloseAmount"
        },
        {
          title: "NA游戏(输赢金额)",
          align: 'center',
          slot: "pNaWinloseAmount"
        },
        {
          title: "TTG游戏(输赢金额)",
          align: 'center',
          slot: "pTtgWinloseAmount"
        },
        {
          title: "SA游戏(输赢金额)",
          align: 'center',
          slot: "pSaWinloseAmount"
        },
        {
          title: "SB游戏(输赢金额)",
          align: 'center',
          slot: "pSbWinloseAmount"
        },
        {
          title: "MG游戏(输赢金额)",
          align: 'center',
          slot: "pMgWinloseAmount"
        },
        {
          title: "AG游戏(输赢金额)",
          align: 'center',
          slot: "pAgWinloseAmount"
        },
        {
          title: "RTG游戏(输赢金额)",
          align: 'center',
          slot: "pRtgWinloseAmount"
        },
        {
          title: "DT游戏(输赢金额)",
          align: 'center',
          slot: "pDtWinloseAmount"
        },
        {
          title: "PP游戏(输赢金额)",
          align: 'center',
          slot: "pPpWinloseAmount"
        },
        {
          title: "PG游戏(输赢金额)",
          align: 'center',
          slot: "pPgWinloseAmount"
        },
        {
          title: "HABA游戏(输赢金额)",
          align: 'center',
          slot: "pHabaWinloseAmount"
        },
        {
          title: "PNG游戏(输赢金额)",
          align: 'center',
          slot: "pPngWinloseAmount"
        },
        {
          title: "YSB游戏(输赢金额)",
          align: 'center',
          slot: "pYsbWinloseAmount"
        },
        {
          title: "KY游戏(输赢金额)",
          align: 'center',
          slot: "pKyWinloseAmount"
        }
      ]
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
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
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
    /* 用户,直属下级 */
    //类型
    roleConfig(row) {
      return this.types(row.role)
    },
    //昵称
    userDisplayName(row) {
      let time = this.changedTime
      if (row.role == "1") {
        this.$router.push({
          name: "dayCompany",
          query: {
            name: "dayCompany",
            time: time,
            type: "",
            source: this.source
          }
        })
        localStorage.setItem("dayCompany", "dayCompany");
      } else if (row.role == "10") {
        this.$router.push({
          name: "dayManager",
          query: {
            name: row.suffix,
            time: time,
            type: "",
            source: this.source
          }
        });
        localStorage.setItem("dayManager", "dayManager");
      } else {
        this.$router.push({
          name: "dayMerchant",
          query: { name: row.sn, time: time, type: "" }
        });
        localStorage.setItem("dayMerchant", "dayMerchant");
      }
    },
    //账号/标识
    userUnameConfig(row) {
      if (row.role == "1") {
        return row.uname
      } else if (row.role == "10") {
        return row.suffix
      } else {
        return row.sn
      }
    },
    async userUname(row) {
     
      this.spinShow = true;
      if (row.role == "1") {
        //管理员
        this.$store
          .dispatch("getUserChild", {
            parent: "01",
            isTest: +this.source,
            gameType: this.gameType,
            query: {
              createdAt: this.changedTime
            }
          })
          .then(res => {
            // console.log(res);
            this.child = res.payload;
            this.reportChild = [];
            this.showName = false;
            this.playerList = [];
            this.spinShow = false;
          });
      } else if (row.role == "100") {
        //商户
        this.userName = row.displayName;
        this.showName = true;
        let userId = row.userId;
        let level = row.level;
        let oldArr = this.reportChild;
        let len = oldArr.length;
        if (len > 0) {
          while (len--) {
            if (oldArr[len][0].level >= level + 1) {
              oldArr.splice(len, 1);
            }
          }
        }
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
          });
        let anchor = this.$el.querySelector("#playerList");
        document.documentElement.scrollTop = anchor.offsetTop;
      } else if (row.role == "10") {
        //线路商
        this.playerList = [];
        this.showName = false;
        let userId = row.userId;
        let level = row.level;
        if (level == 1) {
          this.reportChild = [];
        }
        let oldArr = this.reportChild;
        let len = oldArr.length;
        if (len > 0) {
          while (len--) {
            if (oldArr[len][0].level > level + 1) {
              oldArr.splice(len, 1);
            }
          }
        }
        let showList = await this.getNextLevel(
          this.reportChild,
          userId
        );
        showList = _.filter(showList, function(o) {
          return o.length;
        });
        this.reportChild = showList;
      }       
    },
    //交易次数
    betAmount(row) {
      
      let arr = this.child;
      let count = 0;
      for (let item of arr) {
        count += item.betCount;
      }
      return row.role == "1" ? count : row.betCount
    },              
    //总游戏输赢金额      
    winloseAmount(row) {
      let arr = this.child;
      let count = 0;
      let color = '';
      let winloseAmount = '';
     
      for (let item of arr) {
        count += item.winloseAmount;
      }
      
      if (row.role == "1") {
        color = count < 0 ? "#f30" : "#0c0"
        winloseAmount = thousandFormatter(count.toFixed(2))
      } else {
        color = row.winloseAmount < 0 ? "#f30" : "#0c0"
        winloseAmount = thousandFormatter(row.winloseAmount)
      }


      return {winloseAmount, color}
          
    },
    //总游戏交公司
    submitAmount(row) {
      return row.role == "1" ? "0.00" : thousandFormatter(row.submitAmount.toFixed(2))
    },
    //游戏输赢金额
    gameWinloseAmount(row,gameCode) {
      let arr = this.child;
      let allCount = 0;
      let color = ""
      
      if (row.role == "1") {
        for (let item of arr) {
          for (let key in item.gameTypeMap) {
            if (gameCode.includes(key)) {
              allCount += item.gameTypeMap[key].winloseAmount;
            }
          }
        }
        color = allCount < 0 ? "#f30" : "#0c0";
        allCount = thousandFormatter(allCount.toFixed(2))
      } else {
        let obj = row.gameTypeMap;
        let count = 0;
        for (let key in obj) {
          if (gameCode.includes(key)) {
            count += obj[key].winloseAmount;
          }
        }
        color = count < 0 ? "#f30" : "#0c0";
        allCount = thousandFormatter(count.toFixed(2))
      }
    
      
      return {allCount, color}    
    },
    //游戏交公司
    gameSubmitAmount(row,gameCode) {
      let count = 0;
      if (row.role == "1") {
        return '0.00'
      } else {
        let obj = row.gameTypeMap;
        for (let key in obj) {
          if (gameCode.includes(key)) {
            count += obj[key].submitAmount;
          }
        }
       return thousandFormatter(count.toFixed(2))
      }
      
    },
  /* 玩家列表 */
    //昵称
    playerNickname(row) {
      this.$router.push({
        name: "dayPlayer",
        query: {
          name: row.userName,
          time: this.changedTime,
          type: ""
        }
      });
      localStorage.setItem("dayPlayer", "dayPlayer");  
    },
    //账号
    playerAccount(row) {
      console.log(this.changedTime);
      
      let name = row.userName;
      localStorage.setItem("playerName", name);
      
      this.$router.push({
        name: "playDetail",
        query: {
          name: name,
          time: this.changedTime,
          type: ""
        }
      })
      localStorage.setItem("playDetail", "playDetail");  
    },      





















































































































    confirm() {
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
    changeSource() {
      this.init();
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
    },
    reset() {
      this.defaultTime = getDefaultTime();
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.init();
    },
    search() {
      this.reportChild = [];
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
    async init() {
      let userId = JSON.parse(localStorage.getItem("userInfo")).userId;
      let params1 = { userId: userId, isTest: +this.source };
      let params2 = {
        parent: "01",
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getUserChild", params2);
      this.spinShow = true;
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];

      this.columns11 = await _.cloneDeep(this.columns1);
      this.columns22 = await _.cloneDeep(this.columns2);

      let arr = perms.payload;
      let removeArr = [];
      let removeArr1 = [];

      if (getWinloseAmount(arr, ["1010000"]) == 0) {
        removeArr.push(9, 10);
        removeArr1.push(6);
      }
      if (getWinloseAmount(arr, ["1060000", "1110000"]) == 0) {
        removeArr.push(11, 12);
        removeArr1.push(7);
      }
      if (getWinloseAmount(arr, ["1120000", "1080000"]) == 0) {
        removeArr.push(13, 14);
        removeArr1.push(8);
      }
      if (getWinloseAmount(arr, ["10300000"]) == 0) {
        removeArr.push(15, 16);
        removeArr1.push(9);
      }
      if (getWinloseAmount(arr, ["1050000"]) == 0) {
        removeArr.push(17, 18);
        removeArr1.push(10);
      }
      if (getWinloseAmount(arr, ["1140000"]) == 0) {
        removeArr.push(19, 20);
        removeArr1.push(11);
      }
      if (getWinloseAmount(arr, ["1150000"]) == 0) {
        removeArr.push(21, 22);
        removeArr1.push(12);
      }
      if (getWinloseAmount(arr, ["1160000"]) == 0) {
        removeArr.push(23, 24);
        removeArr1.push(13);
      }
      if (getWinloseAmount(arr, ["1090000"]) == 0) {
        removeArr.push(25, 26);
        removeArr1.push(14);
      }
      if (getWinloseAmount(arr, ["1040000"]) == 0) {
        removeArr.push(27, 28);
        removeArr1.push(15);
      }
      if (getWinloseAmount(arr, ["1020000"]) == 0) {
        removeArr.push(29, 30);
        removeArr1.push(16);
      }
      if (getWinloseAmount(arr, ["1130000"]) == 0) {
        removeArr.push(31, 32);
        removeArr1.push(17);
      }
      if (getWinloseAmount(arr, ["1070000"]) == 0) {
        removeArr.push(33, 34);
        removeArr1.push(18);
      }

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

      rs = [];
      rs1 = [];

      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.child = perms.payload;
      }
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
  min-height: 87vh;

  .title {
    font-size: 1.2rem;
    font-weight: 600;
    display: inline-block;
    margin: 1rem 0;
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
/deep/ .ivu-radio-group-button .ivu-radio-wrapper {
    border: 1px solid #ccc;
    color: #000;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #000;
    color: #fff;
  }
  /deep/.ivu-select-selection {
    border-color: #000;
  }
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
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
.Nico {
  display: none;
}
</style>
