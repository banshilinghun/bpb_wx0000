// pages/valuation-rule/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRuleDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  valuationClick: function () {
    var that = this;
    this.setData({
      showRuleDialog: true
    })
  }
})