// pages/prove/prove.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reconList: ['https://wxapi.benpaobao.com/static/app_img/reconsider1.jpg', 'https://wxapi.benpaobao.com/static/app_img/reconsider2.jpg']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  previewImage: function (event) {
    var that = this;
    console.log(event);
    wx.previewImage({
      current: event.currentTarget.dataset.index,
      urls: that.data.reconList,
    })
  }

})