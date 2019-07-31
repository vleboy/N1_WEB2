<template>
  <div class="p-gameList">
    <RadioGroup
      v-model="companyInfo"
      @on-change="startSearch"
      class="searchbox"
      type="button"
      size="small"
    >
      <Radio
        v-for="(item,index) of companyOptions"
        :key="index"
        :label="item.company"
      >{{item.company}}</Radio>
    </RadioGroup>
    <Row class="row">
      <Col :span="21">
        <Button type="primary" @click="goCreate" size="small">创建新游戏</Button>
      </Col>
      <Col :span="3">
        <Select
          v-model="searchInfo.status"
          placeholder="请选择状态"
          filterable
          clearable
          @on-change="statusSearch"
          size="small"
        >
          <Option value="2" label="全部"></Option>
          <Option value="1" label="正常"></Option>
          <Option value="0" label="下线"></Option>
        </Select>
      </Col>
    </Row>
    <div class="outresult">
      <Table :columns="columns" :data="gameItems">
        <template slot-scope="{row, index}" slot="classify">
          <span>{{classifyConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="state">
          <Tag type="border" :color="stateConfig(row).color">
            {{stateConfig(row).state}}
          </Tag>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="text" size="small" style="color:#20a0ff;" @click="operateCheck(row)">查看</Button>
          <Button type="text" size="small" style="color:#20a0ff;" @click=" operateEdit(row)">编辑</Button>
          <Button type="text" size="small" :style="{color: operateState(row)}" @click="operateConfig(row)">{{row.gameStatus ? "停用" : "启用"}}</Button>
          <Button type="text" size="small" style="color:#20a0ff;" @click="operateOrder(row)">排序</Button>
        </template>
      </Table>
      
      <Spin size="large" fix v-show="isFetching" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
      <div style="text-align: right;margin:2rem 0">
        <Page
          :total="gameListData.length"
          show-elevator
          :page-size="50"
          :current.sync="currentPage"
          @on-change="getNowpage"
        ></Page>
      </div>
    </div>
    <Modal title="游戏详情" v-model="isShowDetail" class="g-text-center" width="800" cancel-text>
      <detailModal ref="childMethod" :dataProp="propChild"></detailModal>
    </Modal>
    <Modal
      title="游戏排序"
      v-model="orderModal"
      class="g-text-center"
      width="250"
      @on-ok="saveOrder"
      @on-cancel="cancelOrder"
    >
      <InputNumber :min="0" :step="1" v-model="gameOrder" style="width: 150px"></InputNumber>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import { httpRequest } from "@/service/index";
import detailModal from "@/components/detailModal";
import { getGameType } from "@/config/getGameType";
import { log } from "util";

export default {
  beforeRouteEnter(to, from, next) {
    /* console.log(this, 'beforeRouteEnter'); // undefined
    console.log(to, '组件独享守卫beforeRouteEnter第一个参数');
    console.log(from, '组件独享守卫beforeRouteEnter第二个参数');
    console.log(next, '组件独享守卫beforeRouteEnter第三个参数'); */
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      //console.log(vm);//当前组件的实例
      if (localStorage.gameManager == "gameManager") {
        //localStorage.removeItem('dayCompany')
        //console.log(233);
        vm.isFetching = true;
        vm.getGameList();
      }
    });
  },
  name: "gameList",
  components: { detailModal },
  created() {
    this.isFetching = true;
    this.getCompanyList(); // 获取所属游戏商信息
    //this.getGameType();
  },
  data() {
    return {
      orderModal: false,
      gameOrder: 0,
      gameId: "",
      gameType: "",
      nowSize: 50,
      nowPage: 1,
      currentPage: 1,
      isFetching: false,
      isShowDetail: false,

      companyInfo: "",
      gameStatusNum: ["下线", "正常"],
      companyOptions: [
        { company: "NA", companyName: "NA" },
        { company: "KY", companyName: "KY" },
        { company: "MG", companyName: "MG" },
        { company: "DT", companyName: "DT" },
        { company: "RTG", companyName: "RTG" },
        { company: "PP", companyName: "PP" },
        { company: "PG", companyName: "PG" },
        { company: "PNG", companyName: "PNG" },
        { company: "TTG", companyName: "TTG" },
        { company: "HABA", companyName: "HABA" },
        { company: "AG", companyName: "AG" },
        { company: "SA", companyName: "SA" },
        { company: "SB", companyName: "SB" },
        { company: "YSB", companyName: "YSB" },
        { company: "VG", companyName: "VG" }
      ],
      searchInfo: {
        gameStatus: "2",
        companyIden: "",
        status: "2"
      },
      columns: [
        {
          title: "顺序",
          key: "sortOrder",
          align: "center",
          maxWidth: 120
        },
        {
          title: "游戏名称",
          key: "gameName",
          align: "center",
          maxWidth: 120
        },
        {
          title: "供应商",
          key: "companyIden",
          maxWidth: 120,
          align: "center"
        },
        {
          title: "分类",
          maxWidth: 120,
          align: "center",
          slot: "classify"
        },
        {
          title: "游戏Id",
          key: "kindId",
          align: "center",
          maxWidth: 120
        },
        {
          title: "游戏链接",
          key: "gameLink",
          align: "center"
        },
        {
          title: "状态",
          maxWidth: 120,
          align: "center",
          slot: "state"
        },
        {
          title: "操作",
          slot: "operate",
          align: "center",
          maxWidth: 250
        }
      ],
      gameListData: [],
      propChild: ""
    };
  },
  computed: {
    gameItems() {
      if (this.nowPage === 1) {
        return this.gameListData.slice(0, this.nowSize);
      } else {
        return this.gameListData.slice(
          (this.nowPage - 1) * this.nowSize,
          this.nowSize * this.nowPage
        );
      }
    }
  },
  methods: {

    //分类
    classifyConfig(row) {
      return this.getType(row)
    },
    //状态
    stateConfig(row) {  
      let color = row.gameStatus ? "green" : "red"
      return {state: this.gameStatusNum[row.gameStatus], color}
    },
   
    
     /* 操作 */
     //查看
     operateCheck(row) {
       this.goDetail(row);
     },
     //编辑
    operateEdit(row) {
       this.goUpdate(row);
     },
     //停用启用
    operateConfig(row) {
      this.gameOperation(row)
    },
    //停用启用状态
    operateState(row) {
      return row.gameStatus ? "red" : "#20a0ff"
    },
     //排序
    operateOrder(row) {
       this.gameId = row.gameId;
       this.gameType = row.gameType;
       this.orderModal = true;   
     },

    















    saveOrder() {
      httpRequest("post", "/gameChangeOrder", {
        gameType: this.gameType,
        gameId: this.gameId,
        sortOrder: this.gameOrder
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.gameOrder = 0;
          this.getGameList();
        }
      });
    },
    cancelOrder() {
      this.gameOrder = 0;
    },
    getGameList() {
      this.isFetching = true;
      if (
        this.$route.name == "gameManager" &&
        localStorage.gameManager == "gameManager"
      ) {
        localStorage.removeItem("gameManager");
      }

      if (
        this.searchInfo.gameStatus == "" ||
        this.searchInfo.gameStatus == "2"
      ) {
        delete this.searchInfo.gameStatus;
      }
      if (this.searchInfo.companyIden == "") {
        delete this.searchInfo.companyIden;
      }

      httpRequest("post", "/gameList", {
        gameType: null,
        query: {
          companyIden: this.searchInfo.companyIden,
          gameStatus: this.searchInfo.gameStatus
        }
      })
        .then(result => {
          this.gameListData = result.payload;
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    goCreate() {
      this.$store.commit("closeEditState");
      this.$router.push({
        name: "addGame"
      });

      this.$store.commit({
        type: "gameOperatorIden",
        data: this.companyInfo
      });
    },
    goUpdate(row) {
      if (this.isFetching) return;
      this.isFetching = true;
      this.$store.commit("openEditState");
      httpRequest("get", `/gameOne/${row.gameType}/${row.gameId}`, {}, "game")
        .then(data => {
          this.$store.commit({
            type: "storageGameOneItem",
            data: data.payload
          });
          this.$router.push({
            name: "addGame",
            query: {
              name: row.gameName
            }
          });
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    goDetail(row) {
      this.propChild = "";
      httpRequest("get", `/gameOne/${row.gameType}/${row.gameId}`, {}).then(
        data => {
          this.propChild = data.payload;
        }
      );
      this.isShowDetail = !this.isShowDetail;
    },
    getType(row) {
      for (var i = 0; i < getGameType().length; i++) {
        if (getGameType()[i].code === row.gameType) {
          return getGameType()[i].name;
        }
      }
    },
    
    getNowpage(page) {
      this.nowPage = page;
    },
    gameOperation(row) {
      this.$Modal.confirm({
        title: "提示!",
        content: `${
          row.gameStatus
            ? "此操作将停用该游戏！服务器会踢掉所有正在此游戏的玩家，并且停用游戏！， 是否继续？"
            : "此操作将启用该游戏，是否继续？"
        }`,
        onOk: () => {
          httpRequest("post", "/gameChangeStatus", {
            gameType: row.gameType,
            gameId: row.gameId,
            status: row.gameStatus ? 0 : 1
          }).then(res => {
            this.$Message.success("状态改变成功");
            this.getGameList();
          });
        }
      });
    },
    // 更改玩家状态
    getCompanyList() {
      
      this.companyInfo = this.$store.state.add.gameIden
        ? this.$store.state.add.gameIden
        : this.companyOptions[0].company;
      this.searchInfo.companyIden = this.companyInfo;
      this.startSearch();
      //});
    },
    //获取运营商列表
    startSearch(val) {
      this.searchInfo.companyIden =
        this.companyInfo == "全部厂商" ? "" : this.companyInfo;
      this.nowPage = 1;
      this.getGameList();
    },
    statusSearch(val) {
      this.searchInfo.gameStatus = val;

      this.searchInfo.companyIden =
        this.companyInfo == "全部厂商" ? "" : this.companyInfo;
      this.nowPage = 1;
      this.getGameList();
    }
  },
  watch: {
    $route: function(_new, _old) {
      if (_new.name == "gameList" && this.$store.state.add.isRefresh) {
        this.getGameList();
        this.$store.state.add.isRefresh = false;
      }
    }
  },
  mounted() {
    //(getGameType());
    getGameType().shift();
    //console.log(getGameType());
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
.p-gameList {
  min-height: 89vh;
  
  .searchbox {
    padding: 0 0 16px 0;
  }
  .outresult {
    padding-top: 1rem;
  }
  .page {
    padding-bottom: 2rem;
    text-align: right;
    margin-right: 1%;
    margin-top: 2rem;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .row {
    .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
  }
  /deep/.ivu-select-selection {
    border-color: #000;
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
  
}
</style>
