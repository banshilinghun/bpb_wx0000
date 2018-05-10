// pages/recommend/recommend.js

//活动或者推荐 推荐和活动的页面布局有变化
const FLAG_ARRAY = ['active', 'recommend'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面状态标识
    pageFlag: FLAG_ARRAY[1],
    banner:{
      bannerHeight: 200,
      bannerWidth: 375,
      bannerList: ['https://images.unsplash.com/photo-1447829172150-e5deb8972256?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7c59a29e62ac65aa6e7f7aefaf296265&auto=format&fit=crop&w=2110&q=80', 'https://images.unsplash.com/photo-1482005253821-5d6a2c685879?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ddad2e18d75348098633d2016efe1f0d&auto=format&fit=crop&w=800&q=60', 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ac9f81b3be20ea13b1524b622b713476&auto=format&fit=crop&w=800&q=60'],
      showBanner: false
    },
    //顶部图片
    topImage: {
      imageHeight: 200,
      imageSrc: 'https://images.unsplash.com/photo-1447829172150-e5deb8972256?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7c59a29e62ac65aa6e7f7aefaf296265&auto=format&fit=crop&w=2110&q=80'
    },
    remindWidth: 0,
    showRecommendList: true,
    recommendList: [{
      nickname: '正🌲',
      adStatus: '已安装广告',
      time: '两天前'
    }, {
      nickname: '粉丝',
      adStatus: '已安装广告',
      time: '两天前'
      }, {
        nickname: 'ken',
        adStatus: '已安装广告',
        time: '两天前'
      }],
    //成功推荐人数
    recommendNumber: 0,
    //累计领取奖励
    totalAword: 0,
    //待领取奖励
    delayAward: 0,
    //好友全部完成可达奖励
    remainAward: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          topImage: {
            imageHeight: res.windowWidth / 2,
            imageSrc: that.data.topImage.imageSrc
          },
          remindWidth: res.windowWidth - 160
        })
      },
    })
    that.setTitle();
  },

  setTitle: function(){
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.pageFlag == FLAG_ARRAY[0] ? '活动详情' : '推荐好友',
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
   * 分享到朋友圈
   */
  shareMoments: function(){
    wx.showToast({
      title: '✌️分享成功',
    })
  },

  previewImage: function(){
    var that = this;
    wx.previewImage({
      urls: [that.data.topImage.imageSrc]
    })
  },

  /**
   * 领取奖励
   */
  receiveAwardClick: function(){
    wx.showToast({
      title: '✌️领取成功',
    })
  },

  /**
   * 提醒好友
   */
  remindFriendClick: function(){
    wx.showToast({
      title: '✌️提醒成功',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})