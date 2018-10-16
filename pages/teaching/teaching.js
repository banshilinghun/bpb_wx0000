//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    teach:0
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    //如果是小程序码进入，处理逻辑
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        var imageWidth = windowWidth;
        var imageHeight = imageWidth * 7.33;
        that.setData({
          imgWidth: imageWidth,
          imgHeight: imageHeight
        })
      }
    })
  }
})