<template>
  <div class="merchantDetail">
    <div class="userName">
      <span>{{$route.query.displayName}} ({{$route.query.username }})</span>
      <span class="btns">
        <Button type="primary" class="edit" @click="reload">刷新</Button>
        <Button type="primary" class="edit" @click.stop="editBtn" v-if="isedit">编辑</Button>
        <Button type="primary" class="edit" @click.stop="save" v-else>提交修改</Button>
      </span>
    </div>
    <Collapse v-model="value">
      <Panel name="1">
        基本信息 所属线路商: {{$route.query.parentDisplayName}}
        <div slot="content">
          <Form label-position="left" :label-width="100">
            <Row>
              <Col span="8">
              <FormItem label="商户ID">
                {{ merchantDetail.displayId }}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="上级商户">
                {{ merchantDetail.parentDisplayName }}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="商户昵称">
                {{merchantDetail.displayName}}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="商户密匙">
                <Row>
                  <Col span="18">
                  <span v-if="showKey">{{merchantDetail.apiKey}}</span>
                  <span v-else>********</span>
                  </Col>
                  <Col span="4">
                  <span class="show" @click="showKey=!showKey" v-if="!showKey">显示</span>
                  <span class="show" @click="showKey=!showKey" v-else>隐藏</span>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="商户线路号">
                {{merchantDetail.msn}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="商户标识">
                {{merchantDetail.suffix}}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="创建时间">
                {{dayjs(merchantDetail.createdAt).format("YYYY-MM-DD HH:mm:ss")}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="最后登录时间">
                {{dayjs(merchantDetail.updatedAt).format("YYYY-MM-DD HH:mm:ss")}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="标识">
                {{merchantDetail.sn}}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="上次登录时间">
                {{dayjs(merchantDetail.loginAt).format("YYYY-MM-DD HH:mm:ss")}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="上次登录IP">
                {{merchantDetail.lastIP}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="管理员账号">
                {{ merchantDetail.uname}}
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Panel>
      <Panel name="2">
        配置信息
        <div slot="content">
          <Form :model="basic" label-position="left" :label-width="100">
            <!-- <Row>
              <Col span="8">
              <FormItem label="商户前端域名" v-if="edit">
                {{merchantDetail.frontURL}}
              </FormItem>
              <FormItem label="商户前端域名" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.frontURL"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="商户充值域名" v-if="edit">
                {{merchantDetail.moneyURL}}
              </FormItem>
              <FormItem label="商户充值域名" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.moneyURL"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="商户注册域名" v-if="edit">
                {{merchantDetail.registerURL}}
              </FormItem>
              <FormItem label="商户注册域名" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.registerURL"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
            </Row> -->
            <!-- <Row>
              <Col span="8">
              <FormItem label="商户客服域名" v-if="edit">
                {{merchantDetail.feedbackURL}}
              </FormItem>
              <FormItem label="商户客服域名" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.feedbackURL"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <Checkbox class="browser" v-model="defaultBrower">是否在系统浏览器中打开</Checkbox>
              </Col>
            </Row> -->
            <Row>
              <Col span="8">
              <FormItem label="管理员密码" v-if="edit">
                <Row>
                  <Col span="6">
                  <span v-if="showPass">{{merchantDetail.password}}</span>
                  <span v-else>********</span>
                  </Col>
                  <Col span="6">
                  <span class="show" @click="showPass=!showPass" v-if="!showPass">显示</span>
                  <span class="show" @click="showPass=!showPass" v-else>隐藏</span>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="管理员密码" prop="password" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.password" placeholder="6~16位,包含字母、数字及符号中任意三种组合"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="备注" v-if="edit">
                {{merchantDetail.remark}}
              </FormItem>
              <FormItem label="备注" prop="remark" v-else>
                <Row>
                  <Col span="20">
                  <Input v-model="basic.remark" type="textarea" :maxlength='200' :rows="1" placeholder="请输入备注,最多不超过200个字符"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="商户白名单" v-if="edit">
                {{merchantDetail.loginWhiteList}}
              </FormItem>
              <FormItem label="商户白名单" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.loginWhiteList"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <!-- <Col span="8">
              <Checkbox class="browser" :disabled='edit' v-model="isTest">测试号</Checkbox>
              </Col> -->
            </Row>
            <!-- <Row>
              <Col span="8">
              <FormItem label="LOGO">
                <img :src="merchantDetail.launchImg.logo[0]" alt="oo" class="logo">
                <div v-if="!edit">
                  <Upload ref="upload" :show-upload-list="false" :before-upload="beforeUploadLogo" :action="actionUrl" style="display: inline-block;width:58px;">
                    <Button type="ghost" icon="ios-cloud-upload-outline" :loading="loadingStatusLogo">请选择需要上传文件</Button>
                  </Upload>
                </div>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="NAME">
                <img :src="merchantDetail.launchImg.name[0]" alt="oo" class="logo">
                <div v-if="!edit">
                  <Upload ref="upload" :show-upload-list="false" :before-upload="beforeUploadName" :action="actionUrl" style="display: inline-block;width:58px;">
                    <Button type="ghost" icon="ios-cloud-upload-outline" :loading="loadingStatusName">请选择需要上传文件</Button>
                  </Upload>
                </div>
              </FormItem>
              </Col>
            </Row> -->
          </Form>
        </div>
      </Panel>
      <Panel name="3">
        游戏信息
        <div slot="content">
          <Form ref='gameList' :model="gameForm" :label-width="110" v-if="!edit" :rules="gameValidate">
            <FormItem prop="ownGame">
              <Row>
                <Col span="3">
                <Select v-model="gameForm.gameType" placeholder="请选择" @on-change="selectCompany">
                  <Option v-for="item in gameType" :value="item.company" :key="item.company">{{ item.company }}</Option>
                </Select>
                </Col>
                <Col span="3">
                <Select v-model="gameForm.gamelist" placeholder="请选择" @on-change="selectGame">
                  <Option v-for="item in gameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-if="selected" prop='balance'>
              <label slot="label">{{game}}商家占成(%)</label>
              <Row>
                <Col span="4">
                <Tooltip :content="rateTip" placement="top">
                  <Input v-model="gameForm.balance" placeholder="请输入0.00~100.00之间的数字"></Input>
                </Tooltip>
                </Col>
                <Col span="2">
                <span class="add" @click="addGame">添加</span>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <Table :columns="columns1" :data="gameDetail" width='500' class="table" size="small"></Table>
        </div>
      </Panel>
    </Collapse>
    <div class="finance">
      <h2>
        财务信息
         <span
          style="color:#20a0ff;cursor:pointer;fontSize:1rem"
          @click="getWaterfallList"
        >(点击查询)</span>
      </h2>
      <Table :columns="columns" :data="showData" size="small"></Table>
      <Page :total="total" class="page" show-elevator :page-size='pageSize' show-total @on-change="changepage"></Page>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import {
  getWaterfall,
  oneMerchants,
  companySelect,
  gameBigType,
  updateMerchant,
  httpRequest,
  oneManagers
} from "@/service/index";
import dayjs from "dayjs";
import _ from "lodash";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    const validateRate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("占成不能为空"));
      } else {
        let testReg = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
        if (!testReg.test(value)) {
          callback(new Error("请输入0.00~100.00之间的数字"));
        } else {
          callback();
        }
      }
    };
    return {
      parent: "",
      value: "",
      rateTip: "", //tip
      parentGame: [],
      dayjs: dayjs,
      isTest: false,
      showKey: false,
      showPass: false,
      edit: true, //可编辑
      isedit: true,
      spinShow: false,
      defaultBrower: false,
      pageSize: 100,
      showData: [], //分页显示的data
      gameDetail: [],
      gameValidate: {
        balance: [
          {
            required: true,
            trigger: "blur",
            validator: validateRate
          }
        ]
      },
      basic: {
        password: "",
        remark: "",
        frontURL: "",
        moneyURL: "",
        registerURL: "",
        feedbackURL: "",
        loginWhiteList: ""
      },
      gameForm: {
        gameType: "",
        gamelist: "",
        balance: ""
      },
      selected: false,
      merchantDetail: {
        launchImg: {
          logo: [],
          name: []
        }
      },
      gameType: [],
      gameList: [], //select
      columns1: [
        {
          title: "公司",
          align: 'center',
          key: "company",
        },
        {
          title: "游戏",
          align: 'center',
          key: "name"
        },
        {
          title: "商家占成",
          align: 'center',
          key: "rate",
          render: (h, params) => {
            return h("span", params.row.rate + "%");
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "opreate",
          render: (h, params) => {
            if (!this.edit) {
              return h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      let index = params.row._index;
                      this.gameDetail.splice(index, 1);
                    }
                  }
                },
                "删除"
              );
            }
          }
        }
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 80
        },
        {
          title: "交易时间",
          key: "createdAt",
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              this.dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "交易对象",
          key: "toUser",
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            let row = params.row;
            if (row.fromLevel > row.toLevel) {
              return h(
                "span",
                row.toDisplayName + " 对 " + row.fromDisplayName
              );
            } else {
              return h(
                "span",
                row.fromDisplayName + " 对 " + row.toDisplayName
              );
            }
          }
        },
        {
          title: "交易类型",
          align: 'center',
          key: "action",
          render: (h, params) => {
            let row = params.row;
            if(row.fromDisplayName==row.toDisplayName){
              if(row.amount<0){
                return h('span','玩家充值')
              }else{
                return h('span','玩家提现')
              }
            }else{
              if (row.fromLevel > row.toLevel) {
                return h("span","减点");
              } else {
                return h("span","加点");
              }
            }
          }
        },
        {
          title: "交易前余额",
          key: "oldBalance",
          align: 'center',
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.oldBalance));
          }
        },
        {
          title: "交易点数",
          align: 'center',
          key: "amount",
          render: (h, params) => {
            let color = params.row.amount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(params.row.amount)
            );
          }
        },
        {
          title: "交易后余额",
          key: "balance",
          align: 'center',
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.balance));
          }
        },
        {
          title: "操作人",
          key: "operator",
          align: 'center',
          render: (h, params) => {
            return h("span", params.row.operator.split("_")[1]);
          }
        },
        {
          title: "备注",
          align: 'center',
          key: "remark",
          maxWidth: 80,
          render: (h, params) => {
            if (params.row.remark == "NULL!" || params.row.remark == null) {
              return h("span", "");
            } else {
              return h(
                "Tooltip",
                {
                  props: {
                    content: params.row.remark
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "search",
                      color: "#20a0ff"
                    }
                  })
                ]
              );
            }
          }
        }
      ],
      waterfall: [],
      loadingStatusLogo: false,
      loadingStatusName: false,
      actionUrl: "",
      imgFileLogo: "",
      imgFileName: "",
      uploadActionLogo: "",
      uploadActionName: ""
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      if (to.name == "merchantDetail") {
        this.spinShow = true;
        this.init();
      }
    }
  },
  computed: {
    total() {
      return this.waterfall.length;
    }
  },
  methods: {
    editBtn() {
      this.edit = false;
      this.isedit = false;
      this.value = ["2","3"];
      this.basic.password = this.merchantDetail.password;
      this.basic.remark = this.merchantDetail.remark;
      this.basic.frontURL = this.merchantDetail.frontURL;
      this.basic.moneyURL = this.merchantDetail.moneyURL;
      this.basic.registerURL = this.merchantDetail.registerURL;
      this.basic.feedbackURL = this.merchantDetail.feedbackURL;
      this.basic.loginWhiteList = this.merchantDetail.loginWhiteList;
      // reset
      this.gameForm.gameType = "";
      this.gameForm.gamelist = "";
      this.gameForm.balance = "";
      this.gameList = [];
      this.selected = false;
    },
    handlePage() {
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.total < this.pageSize) {
        this.showData = this.waterfall;
      } else {
        this.showData = this.waterfall.slice(0, this.pageSize);
      }
    },
    changepage(index) {
      let size = this.pageSize;
      let _start = (index - 1) * size;
      let _end = index * size;
      this.showData = this.waterfall.slice(_start, _end);
      // console.log(this.showData);
    },
    save() {
      let password = this.basic.password;
      if (password == "") {
        this.$Message.warning("密码不能为空");
        return;
      }else{
         if (this.passwordLevel(password) < 2) {
         return  this.$Message.warning({
          content: "密码中必须包含6-16位由字母、数字、符号中至少两种组成"
        });
       }
      }
      //  else {
      //   let testReg = /^[a-zA-Z0-9@_#$%^&*!.~-]{6,16}$/;
      //   if (!testReg.test(password)) {
      //     this.$Message.warning("密码6~16位,包含字母、数字及符号");
      //     return;
      //   }
      // }
      this.edit = true;
      this.isedit = true;
      let userId = this.userId;
      let suffix = this.merchantDetail.suffix;
      let params = this.merchantDetail;
      params.password = password;
      params.remark = this.basic.remark;
      params.gameList = this.gameDetail;
      params.frontURL = this.basic.frontURL;
      params.moneyURL = this.basic.moneyURL;
      params.registerURL = this.basic.registerURL;
      params.feedbackURL = this.basic.feedbackURL;
      params.loginWhiteList = this.basic.loginWhiteList;
      params.isOpenBrowser = this.defaultBrower;
      params.launchImg = this.merchantDetail.launchImg;
      params.isTest = this.isTest == true ? 1 : 0;
      this.spinShow = true;
      if (_.isEmpty(params.gameList)) {
        this.$Message.success("尚未选择游戏");
        this.spinShow = false;
        return;
      }
      updateMerchant(userId, params).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
        } else {
          this.resetPass()
          }
          this.spinShow = false;
      });
    },
    selectCompany(value) {
      let userId = this.parent;
      let params = { companyIden: value, userId };
      if (userId == "01") {
        delete params.userId;
      }
      gameBigType(params).then(res => {
        if (res.code == 0) {
          this.gameList = res.payload;
        }
      });
    },
    selectGame(value) {
      this.selected = true;
      this.game = value;
      let rate = 0;
      let parentGame = this.parentGame;
      if (parentGame.length > 0) {
        for (let item of parentGame) {
          if (item.name == value) {
            rate = item.rate;
          }
        }
      } else {
        rate = 100;
      }
      this.rateTip = `该上级线路商${value}占成为${rate}%`;
    },
    reload() {
      this.init();
    },
    passwordLevel(password) {
      let Modes = 0;
      let len=password.length;
      if(len<6||len>16){
        return 0
      }
      for (let i = 0; i < password.length; i++) {
        Modes |= CharMode(password.charCodeAt(i));
      }
      return bitTotal(Modes);
      //CharMode函数
      function CharMode(iN) {
        if (iN >= 48 && iN <= 57)
          //数字
          return 1;
        if (iN >= 65 && iN <= 90)
          //大写字母
          return 2;
        if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90))
          //大小写
          return 4;
        else return 8; //特殊字符
      }
      //bitTotal函数
      function bitTotal(num) {
        let modes = 0;
        for (let i = 0; i < 4; i++) {
          if (num & 1) modes++;
          num >>>= 1;
        }
        return modes;
      }
    },
    addGame() {
      let gamelist = this.gameList;
      let gameName = this.game;
      let gameItem = {};
      for (let item of gamelist) {
        if (item.name == gameName) {
          gameItem = item;
        }
      }
      let oldGame = this.gameDetail;
      for (let item of oldGame) {
        if (item.name == gameName) {
          this.$Message.warning("已选择该游戏");
          return;
        }
      }
      let re = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
      if (re.test(this.gameForm.balance)) {
        gameItem.rate = this.gameForm.balance;
        this.gameDetail.push(gameItem);
        this.gameDetail = _.uniqWith(this.gameDetail, _.isEqual);
      } else {
        this.$Message.warning("占成为0-100数字");
      }
    }, //生成密码
    resetPass(){
      let userId = this.$route.query.userId;
      oneMerchants(userId).then(res=>{
        this.merchantDetail = res.payload;
        this.isTest = res.payload.isTest == 1 ? true : false;
        this.gameDetail = res.payload.gameList;
      })
    },
    async getWaterfallList() {
      let userId = this.$route.query.userId;
      let req1 = getWaterfall(userId);
      this.spinShow = true;
      let waterfall = await this.axios.all([req1]);
      this.spinShow = false;
      /* if (waterfall && waterfall.code == 0) {
        this.waterfall = waterfall.payload;
        console.log(this.waterfall);
      } */
      //console.log(waterfall[0].payload);

      this.showData = waterfall[0].payload;
    },
    async init() {
      this.spinShow = true;
      let userId = this.$route.query.userId;
      let parent = this.$route.query.parent;
      this.parent = parent;
      this.userId = userId;
      this.edit = true;
      this.isedit = true;
      let req1 = getWaterfall(userId);
      let req2 = oneMerchants(userId);
      let req3 = companySelect({ parent });
      let [merchant, company] = await this.axios.all([
        req2,
        req3
      ]);
      if (merchant && merchant.code == 0) {
        this.merchantDetail = merchant.payload;
        this.isTest = merchant.payload.isTest == 1 ? true : false;
        this.gameDetail = merchant.payload.gameList;
      }
      if (company && company.code == 0) {
        this.gameType = company.payload;
      }
      oneManagers(parent).then(res => {
        if (res.code == 0) {
          this.parentGame = res.payload.gameList || [];
        }
      });
      this.spinShow = false;
      this.handlePage();
    },
    uploadAliLogo() {
      this.actionUrl = "http://assetdownload.oss-cn-hangzhou.aliyuncs.com";
      let mi = new OSS.Wrapper({
        region: "oss-cn-hangzhou",
        accessKeyId: this.uploadActionLogo[1].ali.AccessKeyId,
        accessKeySecret: this.uploadActionLogo[1].ali.AccessKeySecret,
        stsToken: this.uploadActionLogo[1].ali.SecurityToken,
        bucket: "assetdownload"
      });
      // console.log(this.imgFile.name)
      let suffix = this.suffixFun(this.imgFileLogo.name);
      let date = new Date().getTime();
      let fileName = `image/${suffix[0] + date}.${suffix[1]}`;
      mi
        .multipartUpload(fileName, this.imgFileLogo, {})
        .then(results => {
          this.$Message.success("上传成功");
          this.loadingStatusLogo = false;
          this.merchantDetail.launchImg.logo[1] =
            `http://app.risheng3d.com/${results.name}` || results.url;
          // console.log(results,this.noticeInfo.img, 'src')
        })
        .catch(err => {
          this.loadingStatusLogo = false;
          // console.log(err);
        });
    }, // 阿里云上传Logo
    uploadAwsLogo() {
      const dev = `https://s3-ap-southeast-1.amazonaws.com/image-na-dev/${
        this.imgFileLogo.fileName
      }`; //测试环境
      const prod = `http://img.na77.com/${this.imgFileLogo.fileName}`; //开发环境

      httpRequest("put", `${this.uploadActionLogo[0].aws}`, this.imgFileLogo)
        .then(
          res => {
            this.$Message.success("上传成功");
            this.merchantDetail.launchImg.logo[0] =
              process.env.NODE_ENV == "development" ? dev : prod;
          },
          err => {
            this.$Message.error("上传失败");
          }
        )
        .finally(() => {
          this.loadingStatusLogo = false;
        });
    }, // 亚马逊上传Logo
    beforeUploadLogo(file) {
      localStorage.setItem("nowUrl", "merchantDetail");
      let fileName = this.suffixFun(file.name);
      let reg = new RegExp(/^[0-9a-zA-Z]*$/)
      const isLt1M = file.size / 1024 / 1024 < 2;
      const suffix = fileName[1].toLowerCase();
      const fileType = ["png", "jpg"];
      this.imgFileLogo = file;
      this.imgFileLogo.fileName = `${fileName[0] + new Date().getTime()}.${
        fileName[1]
      }`;
      if (!(fileType.indexOf(suffix) > -1)) {
        return this.$Message.error("上传图片只能是 JPG或者PNG 格式!");
      } else if (!isLt1M) {
        return this.$Message.error("大小不能超过 2MB!");
      } else if (!reg.exec(this.suffixFun(this.imgFileLogo.fileName)[0])) {
        return this.$Message.error("文件名只能是英文或者数字！");
      }
      return new Promise((resolve, reject) => {
        this.loadingStatusLogo = true;
        httpRequest("post", "/upload", {
          contentType: "image",
          filePath: this.imgFileLogo.fileName
        })
          .then(res => {
            this.uploadActionLogo = res.payload;
            this.actionUrl = res.payload[0].aws;
            this.uploadAliLogo();
            this.uploadAwsLogo();
            resolve(true);
          })
          .catch(err => {
            reject(false);
          });
      });
    }, // 上传前的检验Logo

    uploadAliName() {
      this.actionUrl = "http://assetdownload.oss-cn-hangzhou.aliyuncs.com";
      let mi = new OSS.Wrapper({
        region: "oss-cn-hangzhou",
        accessKeyId: this.uploadActionName[1].ali.AccessKeyId,
        accessKeySecret: this.uploadActionName[1].ali.AccessKeySecret,
        stsToken: this.uploadActionName[1].ali.SecurityToken,
        bucket: "assetdownload"
      });
      // console.log(this.imgFile.name)
      let suffix = this.suffixFun(this.imgFileName.name);
      let date = new Date().getTime();
      let fileName = `image/${suffix[0] + date}.${suffix[1]}`;
      mi
        .multipartUpload(fileName, this.imgFileName, {})
        .then(results => {
          this.$Message.success("上传成功");
          this.loadingStatusName = false;
          this.merchantDetail.launchImg.name[1] =
            `http://app.risheng3d.com/${results.name}` || results.url;
          // console.log(results,this.noticeInfo.img, 'src')
        })
        .catch(err => {
          this.loadingStatusName = false;
          // console.log(err);
        });
    }, // 阿里云上传Name
    uploadAwsName() {
      const dev = `https://s3-ap-southeast-1.amazonaws.com/image-na-dev/${
        this.imgFileName.fileName
      }`; //测试环境
      const prod = `http://img.na77.com/${this.imgFileName.fileName}`; //开发环境

      httpRequest("put", `${this.uploadActionName[0].aws}`, this.imgFileName)
        .then(res => {
          this.$Message.success("上传成功");
          this.merchantDetail.launchImg.name[0] =
            process.env.NODE_ENV == "development" ? dev : prod;
        })
        .finally(() => {
          this.loadingStatusName = false;
        });
    }, // 亚马逊上传Name
    beforeUploadName(file) {
      localStorage.setItem("nowUrl", "merchantDetail");
      let fileName = this.suffixFun(file.name);
      let reg = new RegExp(/^[0-9a-zA-Z]*$/)
      const isLt1M = file.size / 1024 / 1024 < 2;
      const suffix = fileName[1].toLowerCase();
      const fileType = ["png", "jpg"];
      this.imgFileName = file;
      this.imgFileName.fileName = `${fileName[0] + new Date().getTime()}.${
        fileName[1]
      }`;
      if (!(fileType.indexOf(suffix) > -1)) {
        return this.$Message.error("上传图片只能是 JPG或者PNG 格式!");
      } else if (!isLt1M) {
        return this.$Message.error("大小不能超过 2MB!");
      } else if (!reg.exec(this.suffixFun(this.imgFileName.fileName)[0])) {
        return this.$Message.error("文件名只能是英文或者数字！");
      }
      return new Promise((resolve, reject) => {
        this.loadingStatusName = true;
        httpRequest("post", "/upload", {
          contentType: "image",
          filePath: this.imgFileName.fileName
        })
          .then(res => {
            this.uploadActionName = res.payload;
            this.actionUrl = res.payload[0].aws;
            this.uploadAliName();
            this.uploadAwsName();
            resolve(true);
          })
          .catch(err => {
            reject(false);
          });
      });
    }, // 上传前的检验Name
    suffixFun(o) {
      let arr = o.split(".");
      return arr;
    } // 截取文件名的后缀
  }
};
</script>
<style lang="less" scoped>
.merchantDetail {
  min-height: 89vh;
  .userName {
    line-height: 36px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .show {
    margin-left: 1rem;
    color: #20a0ff;
    display: inline-block;
    // font-size: 1rem;
    font-weight: normal;
    cursor: pointer;
  }
  .edit {
    float: right;
    margin-right: 20px;
    height: 38px;
  }
  .logo {
    width: 200px;
    height: 100px;
  }
  .page {
    text-align: right;
    margin-top: 20px;
  }
  .add,
  .create {
    color: #20a0ff;
    margin-left: 15px;
    cursor: pointer;
  }
  .finance {
    margin-top: 15px;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

