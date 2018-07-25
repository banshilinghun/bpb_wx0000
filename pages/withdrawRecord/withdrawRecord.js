// pages/withdrawRecord/withdrawRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArray: ['提现时间', '提现金额', '提现状态'],
    scrollHeight: 0,
    count: 8,
    totalMoney: 1080,
    withdrawRecords: [{
      date: '2018-8-9', money: '888', type: 2
    }, {
        date: '2018-8-9', money: '888', type: 2
      }, {
        date: '2018-8-9', money: '888', type: 1
      }, {
        date: '2018-8-9', money: '888', type: 2
      }, {
        date: '2018-8-9', money: '888', type: 1
      }, {
        date: '2018-8-9', money: '888', type: 2
      }, {
        date: '2018-8-9', money: '888', type: 2
      }, {
        date: '2018-8-9', money: '888', type: 1
      }, {
        date: '2018-8-9', money: '888', type: 1
      }, {
        date: '2018-8-9', money: '888', type: 1
      }, {
        date: '2018-8-9', money: '888', type: 1
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //设置 scrollView 高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 120
        })
      },
    })
  },

})