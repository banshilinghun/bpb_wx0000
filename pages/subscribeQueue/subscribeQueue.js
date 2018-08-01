
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
    isShowLoadingMore: false,
    queueWaitNumber: 0,
    showAction: false
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

  //todo 限制车主名字长度，分页, 需排队数计算
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
      url: ApiConst.GET_QUEUE_USER,
      data: dataBean,
      header: app.globalData.header,
      success: res => {
        let users = res.users;
        let model = users[0];
        for(let i = 0; i < 10; i++){
          users.push(model);
        }
        that.setData({
          queueList: users,//res.users
          hasmore: res.hasMore,
          sorted_key: res.sortedKey,
          queueSerial: res.my_queue.id,
          queueCount: res.total_count,
          showAction: res.my_queue
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
    this.setData({
      pageIndex: 0
    })
    this.requestQueueList(this.data.pageIndex);
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

  back: function(){
    wx.navigateBack({});
  },

  /**
   * 取消排队
   */
  cancelQueue: function () {
    var that = this;
    wx.showModal({
      title: '取消确认',
      content: '您确认取消当前排队吗？',
      confirmText: '确认取消',
      cancelText: '暂不取消',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '奔跑中🚗...',
          })
          let requestData = {
            url: ApiConst.CANCEL_QUEUE,
            data: {
              ad_id: that.data.adId
            },
            header: app.globalData.header,
            success: res => {
              wx.showToast({
                title: '取消排队成功',
                icon: 'success'
              });
              that.setData({
                showAction: false,
                pageIndex: 0
              })
              that.requestQueueList(that.data.pageIndex);
            },
            complete: res => {
              wx.hideLoading();
            }
          }
          ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
        }
      }
    })
  },

})