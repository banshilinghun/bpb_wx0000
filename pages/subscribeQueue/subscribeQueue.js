
const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queueSerial: 0,
    queueCount: 0,
    queueList: [],
    pageIndex: 0,
    sorted_key: '',
    adId: '',
    isShowLoadingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.adId);
    this.setData({
      adId: options.adId
    })
    this.requestQueueList(this.data.pageIndex);
  },

  //todo 限制车主名字长度
  requestQueueList: function(currentPageIndex){
    let that = this;
    let dataBean = {
      ad_id: that.data.adId,
      page: currentPageIndex,
      page_count: 20
    };
    if(!that.data.pageIndex == 0 || that.data.sorted_key){
      dataBean.sorted_key = that.data.sorted_key;
    }
    let requestData = {
      url: ApiConst.getQueueUser(),
      data: dataBean,
      header: app.globalData.header,
      success: res => {
        that.setData({
          queueList: res.users,
          hasmore: res.hasMore,
          sorted_key: res.sortedKey,
          queueSerial: res.my_queue.id,
          queueCount: res.total_count
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.commonRequest();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.hasmore || that.data.isShowLoadingMore) {
      return;
    }
    //this.showLoadingToast();
    that.setData({
      isShowLoadingMore: true
    });
    setTimeout(function () {
      that.requestAdList(that.data.pageIndex + 1);
    }, 1000);
  },

})