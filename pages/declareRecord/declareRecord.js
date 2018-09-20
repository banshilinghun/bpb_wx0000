

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
    declareList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      adInfo: options.adInfo
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
  }
})