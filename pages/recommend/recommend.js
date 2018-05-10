// pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:{
      bannerHeight: 200,
      bannerWidth: 375,
      bannerList: ['https://images.unsplash.com/photo-1447829172150-e5deb8972256?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7c59a29e62ac65aa6e7f7aefaf296265&auto=format&fit=crop&w=2110&q=80', 'https://images.unsplash.com/photo-1482005253821-5d6a2c685879?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ddad2e18d75348098633d2016efe1f0d&auto=format&fit=crop&w=800&q=60', 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ac9f81b3be20ea13b1524b622b713476&auto=format&fit=crop&w=800&q=60'],
      showBanner: true
    },
    remindWidth: 0,
    showRecommendList: true,
    recommendList: [1,2,1,1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        // that.setData({
        //   bannerWidth: res.windowWidth,
        //   bannerHeight: res.windowWidth * 0.5
        // })
        that.setData({
          remindWidth: res.windowWidth - 125
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})