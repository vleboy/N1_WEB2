<template>
  <div class="p-gameList">
    <RadioGroup v-model="companyInfo" @on-change="startSearch" class="searchbox" type="button">
      <Radio
        v-for="(item,index) of companyOptions"
        :key="index"
        :label="item.company"
      >{{item.company}}</Radio>
    </RadioGroup>
    <Row>
      <Col :span="21">
        <Button type="primary" @click="goCreate">创建新游戏</Button>
      </Col>
      <Col :span="3">
        <Select
          v-model="searchInfo.status"
          placeholder="请选择状态"
          filterable
          clearable
          @on-change="statusSearch"
        >
          <Option value="2" label="全部"></Option>
          <Option value="1" label="正常"></Option>
          <Option value="0" label="下线"></Option>
        </Select>
      </Col>
    </Row>
    <div class="outresult">
      <Table :columns="columns" :data="gameItems"></Table>
      <Spin size="large" fix v-if="isFetching">
        <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
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
    console.log(this.searchInfo);
    
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
      gameTypeList: [
        { company: "NA", code: "10000", name: "NA棋牌游戏" },
        { company: "NA", code: "30000", name: "NA真人视讯" },
        { company: "NA", code: "40000", name: "NA电子游戏" },
        { company: "NA", code: "50000", name: "NA街机游戏" },
        { company: "NA", code: "60000", name: "NA捕鱼游戏" },
        { company: "NA", code: "70000", name: "H5电子游戏" },
        { company: "NA", code: "80000", name: "H5真人视讯" },
        { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" },
        { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        { company: "TTG", code: "1010000", name: "TTG电子游戏" },
        { company: "PNG", code: "1020000", name: "PNG电子游戏" },
        { company: "MG", code: "10300000", name: "MG电子游戏" },
        { company: "HABA", code: "1040000", name: "HABA电子游戏" },
        { company: "AG", code: "1050000", name: "AG真人游戏" },
        { company: "SA", code: "1060000", name: "SA真人游戏" },
        { company: "SA", code: "1110000", name: "SA捕鱼游戏" },
        { company: "PG", code: "1090000", name: "PG电子游戏" },
        { company: "YSB", code: "1130000", name: "YSB体育游戏" },
        { company: "RTG", code: "1140000", name: "RTG电子游戏" },
        { company: "SB", code: "1080000", name: "SB电子游戏" },
        { company: "SB", code: "1120000", name: "SB真人游戏" },
        { company: "DT", code: "1150000", name: "DT电子游戏" },
        { company: "PP", code: "1160000", name: "PP电子游戏" }
      ],
      companyInfo: "",
      companyOptions: [],
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
        { company: "YSB", companyName: "YSB" }
      ],
      searchInfo: {
        gameStatus: "2",
        companyIden: "",
        status: '2'
      },
      columns: [
        {
          title: "顺序",
          key: "sortOrder",
          align: 'center',
          maxWidth: 120
        },
        {
          title: "游戏名称",
          key: "gameName",
          align: 'center',
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
          render: (h, params) => {
            return h("span", this.getType(params.row));
          }
        },
        {
          title: "游戏Id",
          key: "kindId",
          align: "center",
          maxWidth: 120,
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
          render: (h, params) => {
            return h(
              "Tag",
              {
                props: {
                  type: "border",
                  color: params.row.gameStatus ? "green" : "red"
                }
              },
              this.gameStatusNum[params.row.gameStatus]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: 'center',
          maxWidth: 250,
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
                    color: "#20a0ff",
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.goDetail(params.row);
                    }
                  }
                },
                "查看"
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
                      this.goUpdate(params.row);
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
                      this.gameOperation(params.row);
                    }
                  }
                },
                `${params.row.gameStatus ? "停用" : "启用"}`
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
                      this.gameId = params.row.gameId;
                      this.gameType = params.row.gameType;
                      this.orderModal = true;
                    }
                  }
                },
                "排序"
              )
            ]);
          }
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
    saveOrder() {
      httpRequest(
        "post",
        "/gameChangeOrder",
        {
          gameType: this.gameType,
          gameId: this.gameId,
          sortOrder: this.gameOrder
        }
      ).then(res => {
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
      if ( this.$route.name == "gameManager" && localStorage.gameManager == "gameManager") {
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
      
      httpRequest(
        "post",
        "/gameList",
        {
          gameType: null,
          query: {companyIden: this.searchInfo.companyIden, gameStatus: this.searchInfo.gameStatus}
        }
      )
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
      httpRequest(
        "get",
        `/gameOne/${row.gameType}/${row.gameId}`,
        {}
      ).then(data => {
        this.propChild = data.payload;
      });
      this.isShowDetail = !this.isShowDetail;
    },
    getType(row) {
      for (var i = 0; i < this.gameTypeList.length; i++) {
        if (this.gameTypeList[i].code === row.gameType) {
          return this.gameTypeList[i].name;
        }
      }
    },
    /* getGameType() {
      httpRequest("post", "/gameType", {}, "game").then(res => {
        this.gameTypeList = res.payload;

        console.log(this.gameTypeList);
        
        
      });
    }, */
    getNowpage(page) {
      this.nowPage = page;
      console.log("当前是第:" + page + "页");
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
          httpRequest(
            "post",
            "/gameChangeStatus",
            {
              gameType: row.gameType,
              gameId: row.gameId,
              status: row.gameStatus ? 0 : 1
            }
          ).then(res => {
            this.$Message.success("状态改变成功");
            this.getGameList();
          });
        }
      });
    }, 
    // 更改玩家状态
    getCompanyList() {
     /*  httpRequest(
        "post",
        "/companySelect",
        {
          parent: localStorage.loginRole == 1 ? "" : localStorage.loginId
        },
        "game"
      ).then(result => {
        */
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

      this.searchInfo.gameStatus = val
      
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
.p-gameList {
  min-height: 89vh;
  .searchbox {
    padding: 16px 0;
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
}
</style>
