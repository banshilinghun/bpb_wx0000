
// 损坏申报、掉漆申报、违章申报
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const DeclareType = require("./declareType");
const UploadConfig = require("../../utils/common/uploadConfig");
const {
  $Toast
} = require('../../components/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: DeclareType.DAMAGE,
    declareInfo: {},
    visiblePicker: false,
    startDate: '2018-01-01',
    currentDate: '',
    date: '',
    adInfo: null,
    imageList: [],
    trafficAddress: '',
    trafficCost: '',
    reason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      type: options.type,
      adInfo: JSON.parse(options.adInfo)
    })
    that.initData();
    that.getDate();
  },

  initData(){
    let that = this;
    console.log('type------->' + that.data.type)
    switch(parseInt(that.data.type)){
      case DeclareType.DAMAGE:
        that.setData({
          declareInfo: {
            adName: '广告名称',
            date: '损坏日期',
            evidenceImage: '拍摄图片',
            evidenceTip: '拍摄车辆广告损坏位置图片',
            reason: '损坏原因',
            reasonTip: '简短语言描述广告损坏原因',
            src: 'https://wxapi.benpaobao.com/static/app_img/v2/b-add.png'
          }
        })
        break;
      case DeclareType.DROP:
        that.setData({
          declareInfo: {
            adName: '广告名称',
            date: '掉漆日期',
            evidenceImage: '拍摄图片',
            evidenceTip: '拍摄车辆掉漆位置图片',
            reason: '掉漆原因',
            reasonTip: '简短语言描述车辆掉漆原因',
            src: 'https://wxapi.benpaobao.com/static/app_img/v2/b-add.png'
          }
        })
        break;
      default:
        that.setData({
          declareInfo: {
            adName: '广告名称',
            date: '违章日期',
            address: '违章地点',
            price: '违章成本',
            evidenceImage: '违章凭证',
            evidenceTip: '拍摄车辆违章通知单',
            reason: '违章原因',
            reasonTip: '简短语言描述车辆违章原因',
            src: 'https://wxapi.benpaobao.com/static/app_img/v2/b-add.png'
          }
        })
        break;
    }
    that.setNavigationBarTitle();
  },

  setNavigationBarTitle(){
    wx.setNavigationBarTitle({
      title: DeclareType.titleMap[this.data.type]()
    })
  },

  getDate(){
    // 获取当前日期
    let date = new Date();
    // 获取当前月份
    let nowMonth = date.getMonth() + 1;
    // 获取当前是几号
    let strDate = date.getDate();
    // 添加分隔符“-”
    let seperator = "-";
    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
      nowMonth = "0" + nowMonth;
    }
    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    let nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    this.setData({
      currentDate: nowDate,
      date: nowDate
    })
  },

  bindDateChange(event){
    console.log(event);
    this.setData({
      date: event.detail.value
    })
  },

  handlePreviewImage(event){
    console.log(event)
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [event.currentTarget.dataset.image]
    })
  },

  handleAddImage(){
    this.chooseImage()
  },

  chooseImage(){
    const that = this;
    wx.chooseImage({
      sourceType: UploadConfig.sourceType[2],
      sizeType: UploadConfig.sizeType[0],
      count: 1,
      success: function (res) {
        let length = that.data.imageList.length;
        let imageName = `img${ length + 1 }`;
        console.log('imageName---------->' + imageName);
        that.uploadImageRequest(imageName, res.tempFilePaths[0])
      }
    })
  },

  uploadImageRequest(imageName, imagePath){
    let that = this;
    let requestData = {
      url: ApiConst.UPLOAD_EXCEPTION_IMG,
      filePath: imagePath,
      fileName: imageName,
      formData: {
        ad_id: that.data.adInfo.ad_id,
        type: that.data.type
      },
      success: res => {
        let imageList = that.data.imageList;
        imageList.push(imagePath);
        that.setData({
          imageList: imageList
        })
      }
    }
    ApiManager.uploadFile(new ApiManager.uploadInfo(requestData));
  },

  handleSubmit(event){
    console.log(event)
    this.commitVerify(event);
  },

  commitVerify(){
    let that = this;
    if(!that.data.date){
      $Toast({
        content: `请选择${ that.data.declareInfo.date }`,
        type: 'warning'
      });
      return;
    }
    //违章申报需要额外填写地点和成本
    console.log('trafficAddress------>' + that.data.trafficAddress)
    if(parseInt(that.data.type) === DeclareType.VIOLATE){
      if(!that.data.trafficAddress){
        $Toast({
          content: `请输入${ that.data.declareInfo.address }`,
          type: 'warning'
        });
        return;
      }
      if(!that.data.trafficCost){
        $Toast({
          content: `请输入${ that.data.declareInfo.price }`,
          type: 'warning'
        });
        return;
      }
    }
    //违章凭证
    if(that.data.imageList.length === 0){
      $Toast({
        content: `请${ that.data.declareInfo.evidenceTip }`,
        type: 'warning'
      });
      return;
    }
    //违章原因
    if(!that.data.reason){
      $Toast({
        content: `请填写${ that.data.declareInfo.reason }`,
        type: 'warning'
      });
      return;
    }
    this.sendCommitRequest();
  },

  sendCommitRequest(){
    const that = this;
    let params = {
      ad_id: that.data.adInfo.ad_id,
      type: that.data.type,
      description: that.data.reason,
      date: that.data.date
    }
    if(parseInt(that.data.type) === DeclareType.VIOLATE){
      params.cost = that.data.trafficCost;
      params.address = that.data.trafficAddress;
    }
    let requestData = {
      url: ApiConst.COMMIT_AD_EXCEPTION,
      data: params,
      success: res => {
        $Toast({
          content: '提交成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  handleAddressInput(event){
    this.setData({
      trafficAddress: event.detail.value
    })
  },

  handleCostInput(event){
    this.setData({
      trafficCost: event.detail.value
    })
  },

  handleReasonInput(event){
    this.setData({
      reason: event.detail.value
    })
  }

})