
let params = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    checkImageSrc: 'https://wxapi.benpaobao.com/static/app_img/checkTeach.jpg',
    flag: 1
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
        if(options.flag == 1){
          that.setData({
            scrollHeight: res.windowHeight - 74,
            flag: 1
          })
        } else if (options.flag == 2) {
          that.setData({
            scrollHeight: res.windowHeight,
            flag: 2
          })
        }
      }
    })
  },

  handleCheck(){
    wx.redirectTo({
      url: '../check/check?ckData=' + params
    })
  }

})