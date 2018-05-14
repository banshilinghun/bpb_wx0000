// pages/step/step.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepsList: [
      {
        current: false,
        text: '新手奖励',
        desc: '￥50.00',
        hasAward: true,
        action: '领取'
      },
      {
        current: false,
        text: '推荐奖励',
        desc: '￥300.00',
        hasAward: false,
        tip: '还有2个好友未安装广告'
      },
      {
        current: false,
        text: '广告任务2期奖励',
        desc: '￥100.00',
        hasAward: false,
        tip: '还有1个广告未安装'
      },
      {
        current: false,
        text: '双方立即获得50元奖励',
        desc: '￥100.00',
        hasAward: true,
        action: '领取'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  actionClickListener: function(e){
    console.log(e.detail);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})