// pages/earningRecord/earningRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    count: 30,
    totalMoney: 100,
    titleArray: ['收益时间', '收益金额', '收益来源'],
    earningRecords: [{
      date: '2018-8-9', money: '888', type: 2
    }, {
      date: '2018-8-9', money: '888', type: 2
    }, {
      date: '2018-8-9', money: '888', type: 1
    }, {
      date: '2018-8-9', money: '888', type: 3
    }, {
      date: '2018-8-9', money: '888', type: 1
    }, {
      date: '2018-8-9', money: '888', type: 3
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //设置 scrollView 高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 60
        })
      },
    })
  },

})