

const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const DeclareType = require('../declare/declareType');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: DeclareType.DAMAGE,
    adInfo: '',
    declareList: [],
    isViolate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      adInfo: options.adInfo,
      isViolate: parseInt(options.type) === DeclareType.VIOLATE
    })
    this.setNavigationBarTitle();
  },

  onShow: function() {
    this.requestRecord();
  },

  requestRecord(){
    let that = this;
    let requestData = {
      url: ApiConst.GET_EXCEPTION_LIST,
      data: {
        type: that.data.type
      },
      success: res => {
        res.forEach(element => {
          element.date = DeclareType.getDeclareDate(that.data.type) + element.date;
          element.description = DeclareType.getDeclareReason(that.data.type) + element.description;
        });
        that.setData({
          declareList: res
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  setNavigationBarTitle(){
    wx.setNavigationBarTitle({
      title: DeclareType.titleMap[this.data.type]()
    })
  },

  handleSubmit(){
    wx.navigateTo({
      url: '../declare/declare?type='+ this.data.type + '&adInfo=' + this.data.adInfo
    })
  },

  /**
   * 重新申报
   */
  handleReDeclare(event){
    wx.navigateTo({
      url: '../declare/declare?type='+ this.data.type + '&adInfo=' + JSON.stringify(event.currentTarget.dataset.item)
    })
  }
})