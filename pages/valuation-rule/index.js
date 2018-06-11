// pages/valuation-rule/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRuleDialog: false,
    tableRuleList: [{ content: '车主当日在线时长', isTitle: true}, 
      { content: '车主当日广告收入', isTitle: true}, 
      { content: '小于2小时' }, 
      { content: '0元' }, 
      { content: '大于等于2小时小于6小时' }, 
      { content: '10元' }, 
      { content: '大于等于6小时小于12小时' }, 
      { content: '10元+每增加1小时多得3元' }, 
      { content: '大于等于12小时' },
      { content: '28元' }]
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