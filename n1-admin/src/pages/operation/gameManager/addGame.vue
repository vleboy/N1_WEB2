<template>
  <div class="p-addGame">
    <h2 class="title">游戏基本信息<span style="font-size: 14px"> (<span style="color: #ff4949"> * </span>为必填项)</span></h2>
    <Form :model="managerInfo" :rules="rules" ref="managerInfo" class="createform" :label-width="80">
      <FormItem label="游戏名称" prop="gameName">
        <Input v-model="managerInfo.gameName" class="input" type="text"  placeholder="请输入游戏名称" :maxlength='30' :disabled="isEdit"></Input>
      </FormItem>
      <!-- <FormItem label="游戏标识" prop="gameIden">
        <Input v-model="managerInfo.gameIden" class="input" type="text" placeholder="请输入游戏标识(必须首字母开头并且大写)" :maxlength='20' :disabled="isEdit"></Input>
      </FormItem> -->
      <FormItem label="游戏简介" prop="gameRecommend">
        <Input v-model="managerInfo.gameRecommend" class="input" placeholder="请输入游戏简介" type="textarea" :maxlength='200'></Input>
      </FormItem>
      <FormItem label="所属供应商" prop="companyIden" class="is-required">
        <Input v-model="companyIden" class="input" placeholder="请输入游戏简介" type="text" disabled></Input>
      </FormItem>
      <FormItem label="游戏类别" prop="gameType">
        <Select v-model="managerInfo.gameType" placeholder="请选择游戏类别"  class="input" :disabled="isEdit">
          <Option v-for="item in gameTypeOptions" :key="item.code" :label="item.name" :value="item.code" class="select-width"></Option>
        </Select>
      </FormItem>
      <FormItem label="游戏ID" prop="kindId">
        <Input v-model="managerInfo.kindId" class="input" placeholder="请输入游戏ID(范围1-99999)" type='text'></Input>
      </FormItem>
      <FormItem label="key" v-if="companyKey">
        <Tag type="danger">{{companyKey}}</Tag>
      </FormItem>
      <FormItem label="网页地址">
        <Input v-model="managerInfo.gameLink" placeholder="请输入网页游戏地址"></Input>
      </FormItem>
      <FormItem label="游戏LOGO" prop="gameImg" class="is-required">
        <Upload
          ref="upload"
          :action="url"
          :max-size="2048"
          :show-file-list="false"
          :before-upload="beforeUpload">
          <Button icon="ios-cloud-upload-outline" :loading="dialogLoading">请选择需要上传文件</Button>
        </Upload>
        <div style="padding: 16px 0">只能上传一张jpg/png文件，且不超过1M</div>
        <div style="overflow: hidden"><img style="width: 80%" :src="managerInfo.gameImg"></div>
      </FormItem>
    </Form>
    <div class="stepbtn createform">
      <Button type="primary" class="nextBtn" @click="postCreateform">
        {{isSending ? '提交中...' : '确认'}}
      </Button>
    </div>
  </div>
</template>

<script>
  import { pattern } from '@/config/regexp'
  import { httpRequest } from "@/service/index";

export default {
  data () {
    var validateGameName = (rule, value, callback) => {
      var regName = new RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_-]+$/)
      if (value === '') {
        callback(new Error('请输入游戏名称'))
        this.isfinish.gameName = false
      } else if (!regName.exec(value)) {
        callback(new Error('请输入中英文或者数字'))
        this.isfinish.gameName = false
      } else if (value.length < 2) {
        callback(new Error('必须为两位数'))
        this.isfinish.gameName = false
      } else {
        callback()
        this.isfinish.gameName = true
      }
    } // 游戏名称
    var validateGameType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择游戏类别'))
      } else {
        callback()
        this.isfinish.gameType = true
      }
    } // 分类
    var validateCompany = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择所属供应商'))
        this.isfinish.company = false
      } else {
        callback()
        this.isfinish.company = true
      }
    } // 供应商
    var validateGameRecommend = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入游戏简介'))
        this.isfinish.gameRecommend = false
      } else if (value.length < 2) {
        callback(new Error('必须为两位数'))
        this.isfinish.gameRecommend = false
      } else {
        callback()
        this.isfinish.gameRecommend = true
      }
    } // 游戏简介
    var validateKindId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入KindId'))
        this.isfinish.kindId = false
      } else if (!pattern.positiveInteger.exec(value) || value > 99999) {
        callback(new Error('必须为正整数，范围在1-99999之间'))
        this.isfinish.kindId = false
      } else {
        callback()
        this.isfinish.kindId = true
      }
    } // kindID
    /* var validateGameIden = (rule, value, callback) => {
      let reg = new RegExp(/^[0-9]*$/)
      if (value === '') {
        callback(new Error('请输入游戏标识'))
        this.isfinish.gameIden = false
      } else if (reg.exec(value) || (value.substring(0,1) != value.substring(0,1).toUpperCase())) {
        callback(new Error('请输入字母或者数字（首位必须是大写字母）'))
        this.isfinish.gameIden = false
      } else if (value.length > 10) {
        callback(new Error('标识长度最多为10位'))
        this.isfinish.gameIden = false
      } else {
        callback()
        this.isfinish.gameIden = true
      }
    }  */
    // 端口
    return {
      GameListEnum: {
        NA: [
          { company: "NA", code: "70000", name: "H5电子游戏" },
          { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" }
        ],
        KY: [
          { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        ],
        TTG: [
          { company: "TTG", code: "1010000", name: "TTG电子游戏" }
        ],
        PNG: [
          { company: "PNG", code: "1020000", name: "PNG电子游戏" }
        ],
        MG: [
          { company: "MG", code: "10300000", name: "MG电子游戏" }
        ],
        HABA: [
          { company: "HABA", code: "1040000", name: "HABA电子游戏" }
        ],
        AG: [
          { company: "AG", code: "1050000", name: "AG真人游戏" }
        ],
        SA: [
          { company: "SA", code: "1060000", name: "SA真人游戏" },
          { company: "SA", code: "1110000", name: "SA捕鱼游戏" }
        ],
        PG: [
          { company: "PG", code: "1090000", name: "PG电子游戏" }
        ],
        YSB: [
          { company: "YSB", code: "1130000", name: "YSB体育游戏" }
        ],
        RTG: [
          { company: "RTG", code: "1140000", name: "RTG电子游戏" }
        ],
        SB: [
          { company: "SB", code: "1080000", name: "SB电子游戏" },
          { company: "SB", code: "1120000", name: "SB真人游戏" }
        ],
        DT: [
          { company: "DT", code: "1150000", name: "DT电子游戏" }
        ],
        PP: [
          { company: "PP", code: "1160000", name: "PP电子游戏" }
        ]
      },
      isfinish: {
        gameName: false,
        gameType: false,
        company: false,
        kindId: false,
        gameRecommend: false,
        //gameIden: false
      },
      managerInfo: {
        gameName: '', // 名称
        gameType: '', // 类别
        company: '', // 供应商
        kindId: '', // kindId
        gameRecommend: '', // 简介
        gameImg: '', // 游戏logo
        gameImgAli: '', // 游戏logoAli
        gameLink: '', // 网页游戏链接
        //isWebGame: '', // 网页游戏标识
        //gameIden: '', // 标识
        companyIden: '', // 供应商标识
        companyName: '' // 供应商名称
      }, // 创建列表
      rules: {
        gameName: [
          {validator: validateGameName, trigger: 'blur',required: true}
        ],
        gameRecommend: [
          {validator: validateGameRecommend, trigger: 'blur',required: true}
        ],
        gameType: [
          {validator: validateGameType, trigger: 'blur',required: true}
        ],
        company: [
          {validator: validateCompany, trigger: 'blur',required: true}
        ],
        kindId: [
          {validator: validateKindId, trigger: 'blur',required: true}
        ],
        /* gameIden: [
          {validator: validateGameIden, trigger: 'blur',required: true}
        ] */
      }, // 列表验证规则
      options: [],
      fileList: [],
      uploadAction: '',
      url: '',
      imgFile:{},
      form: {
        key: '',
        token: ''
      },
      dialogLoading: false,
      isSending: false,
      isShowWebGame: false,
      gameTypeOptions: [],
      //operatorList: [],
      companyIden: '',
      companyKey: ''
    }
  },
  computed: {
    storeInfo () {
      return this.$store.state.add.gameOneItem
    },
    isEdit () {
      return this.$store.state.add.isEdit
    }
  },
  mounted () {
    //this.getOperatorList()
    this.init()
  },
  methods: {
    init() {

      if (this.$store.state.add.isEdit) {
        this.managerInfo = {
          gameId: this.storeInfo.gameId,
          gameName: this.storeInfo.gameName, // 供应商名称
          //gameIden: this.storeInfo.gameIden, // 供应商名标识
          gameRecommend: this.storeInfo.gameRecommend, // 简介
          kindId: Number(this.storeInfo.kindId)-Number(this.storeInfo.gameType), // kindId
          gameType: this.storeInfo.gameType, // 游戏类别
          gameImg: this.storeInfo.gameImg, // logo
          gameImgAli: this.storeInfo.gameImgAli, // logoAli
          //isWebGame: this.storeInfo.isWebGame, // 是否是网页游戏
          gameLink: this.storeInfo.gameLink, // 链接
          company: this.storeInfo.company, // 游戏厂商规则
          companyName: this.storeInfo.companyName, // 游戏厂商规则
          companyIden: this.storeInfo.companyIden // 游戏厂商规则
        }

        //this.isShowWebGame = this.storeInfo.isWebGame == '1'
        this.companyIden = this.storeInfo.companyIden
        this.isfinish = {
          gameName: true,
          gameType: true,
          company: true,
          kindId: true,
          gameRecommend: true,
          //gameIden: true
        }
      } else {

        this.managerInfo.companyName = this.$store.state.add.gameIden
        this.managerInfo.companyIden = this.$store.state.add.gameIden
        this.companyIden = this.$store.state.add.gameIden
      }
      this.getGameType()
    },
    postCreateform () {
      console.log(this.managerInfo);
      
      if(this.isSending) return
      if (!this.isfinish.gameName || !this.managerInfo.gameType ||
        !this.isfinish.gameRecommend || !this.isfinish.kindId || !this.managerInfo.gameImg) {
        this.$Message.error('请完善创建信息')
      } else { 
        /* this.operatorList.forEach((item) => {
          if (item.companyIden === this.companyIden) {
            this.managerInfo.company = item
            this.managerInfo.companyIden = item.companyIden
          }
        }) */
        if (!this.managerInfo.gameLink) {
          return this.$Message.error('请输入网页游戏链接')
        }
 
        //this.managerInfo.isWebGame = this.isShowWebGame ? '1' : '0'
        

         this.isSending = true
        httpRequest("post",
          `${!this.$store.state.add.isEdit ? '/games' : '/gameUpdate'}`,
          this.managerInfo,).then((res)=> {  
          if (res.code == 0) {
          this.$store.commit('closeEditState')
          this.$router.push({
            name: "gameManager"
          });
          this.$store.commit({
            type: 'changeRefresh',
            data: true
          })
          localStorage.setItem('gameManager', 'gameManager')
          }
        }).finally(()=>{
          this.isSending = false
        })
      } 
    },
    getGameType () {
      /* !this.$store.state.add.isEdit && (this.managerInfo.gameType = '')
      httpRequest("post", "/gameBigType", {
        companyIden: this.companyIden
      },'game').then(res => {
        this.gameTypeOptions = res.payloads
      }) */
       //console.log(this.companyIden);
       this.managerInfo.company = this.companyIden 
       this.gameTypeOptions = this.GameListEnum[this.companyIden]
    },
    /* getOperatorList () {
      httpRequest("post", "/companyList", {},'game').then(
        result => {
          this.operatorList = result.payload.Items
        }
      )
    }, */ // 获取游戏商列表
    resetData () {
      this.managerInfo = {
        gameName: '', // 名称
        gameType: '', // 类别
        company: this.company, // 供应商
        gameRecommend: '', // 简介
        gameImg: '', // 图片上传 （暂不实现）
        gameImgAli: '', // 图片上传 （暂不实现）
        gameLink: '', // 网页游戏链接
        //isWebGame: '', // 网页游戏标识
        //gameIden: '', // 标识
        companyIden: '', // 供应商标识
        companyName: '' // 供应商名称
      }
    },

    uploadAli () {
      //console.log('0');
      localStorage.setItem("nowUrl", 'addGame');
      this.url = 'http://assetdownload.oss-cn-hangzhou.aliyuncs.com'
      /* let mi = new OSS.Wrapper({
        region: 'oss-cn-hangzhou',
        accessKeyId: this.uploadAction[1].ali.AccessKeyId,
        accessKeySecret: this.uploadAction[1].ali.AccessKeySecret,
        stsToken: this.uploadAction[1].ali.SecurityToken,
        bucket: 'assetdownload'
      }) */
      
      // console.log(this.imgFile.name)
      let suffix = this.suffixFun(this.imgFile.name)
      let date = new Date().getTime() 
      let fileName = `image/${suffix[0]+date}.${suffix[1]}`
      
      mi.multipartUpload(fileName, this.imgFile, {
      }).then((results) => {
        this.$Message.success('上传阿里云成功')
        this.dialogLoading = false
        this.managerInfo.gameImgAli =  `http://app.risheng3d.com/${results.name}` || results.url
        // console.log(results,this.managerInfo.img, 'src')
      }).catch((err) => {
        this.dialogLoading = false
      });
    },
    uploadAws () {
      const dev = `https://s3-ap-southeast-1.amazonaws.com/image-na-dev/${this.imgFile.fileName}` //测试环境
      this.managerInfo.gameImgAli =  `https://app.risheng3d.com/image/${this.imgFile.fileName}`
      const prod = `https://img.na77.com/${this.imgFile.fileName}` //正式环境
      httpRequest('put',`${this.uploadAction[0].aws}`, this.imgFile)
        .then(res => {
          this.$Message.success('上传亚马逊成功')
          this.managerInfo.gameImg = (process.env.NODE_ENV == 'development') ? dev : prod
          
          console.log(this.managerInfo.gameImg)
          
        }).finally(()=>{
        this.dialogLoading = false
      })
    },

    beforeUpload (file) {
      let fileName = this.suffixFun(file.name)
      const isLt1M = file.size / 1024 / 1024 < 2
      const suffix = fileName[1].toLowerCase()
      const fileType = ['png', 'jpg']
      this.imgFile = file
      this.imgFile.fileName = `${fileName[0]+new Date().getTime()}.${fileName[1]}`
      if (!(fileType.indexOf(suffix) > -1)) {
        return this.$Message.error('上传图片只能是 JPG或者PNG 格式!')
      } else if (!isLt1M) {
        return this.$Message.error('大小不能超过 2MB!')
      }
      return new Promise((resolve, reject) =>{
        this.dialogLoading = true
        httpRequest('post','/upload', {
          contentType: 'image',
          filePath: this.imgFile.fileName
        },'admin').then(res => {
          this.uploadAction = res.payload
          this.actionUrl = res.payload[0].aws
          this.uploadAws()
          this.uploadAli()
          resolve(true)
        }).catch(err => {
          reject(false)
        })
      })
    }, // 上传前的检验
    suffixFun (o) {
      let arr = o.split('.')
      return arr
    } // 截取文件名的后缀
  },
  watch: {
    '$route': function (_new, _old) {
      this.resetData()
      if(_new.name == 'addGame') {
        this.init()
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  .p-addGame{
    min-height: 88vh;
    .createform{
      width:30rem;
      margin: 0 auto;
    }
    .input{
      width: 100%;
    }
    .title{
      font-weight: normal;
      color: #5a5a5a;
      margin: 1rem 0 2rem 0;
      text-align: center;
    }
    .stepbtn{
      text-align: center
    }
  }
</style>
