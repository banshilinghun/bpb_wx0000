// pages/teamworkList/index.js

var timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamInfo: [{
      wx_avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132',
      nickname: '刚从梦中醒来，你智障的等待',
      diffNumber: 9,
      time: 1527508911
    }, {
      wx_avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132',
      nickname: '刚从梦中醒来，你智障的等待',
      diffNumber: 9,
      time: 1527565086
    }],
    showSeeMore: true,
    openInterval: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      openInterval: true
    })
  },

  onHide: function () {
    this.setData({
      openInterval: false
    })
  },


  /**
   * 去参团
   */
  goJoinTeamwork: function () {
    wx.navigateTo({
      url: '../joinGroup/index',
    })
  },
})