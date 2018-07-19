
let params = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    checkImageSrc: 'https://wxapi.benpaobao.com/static/app_img/checkTeach.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    params = options.ckData;
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        // 74px 为按钮高度
        that.setData({
          scrollHeight: res.windowHeight - 74
        })
      }
    })
  },

  handleCheck(){
    wx.redirectTo({
      url: '../check/check?ckData=' + params
    })
  }

})