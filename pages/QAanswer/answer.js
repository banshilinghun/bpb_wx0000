// pages/QAanswer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer: '',
    flag: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setNavigationBarTitleText(options.title);
    console.log(options.flag);
    let flag = options.flag;
    this.setData({
      answer: options.content,
      flag: options.flag? options.flag : ''
    })
  },


  setNavigationBarTitleText: function (barText) {
    if (!barText) {
      barText = "奔跑宝"
    }
    wx.setNavigationBarTitle({
      title: barText,
    })
  },

  callPhoneListener: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber,
    })
  }

})