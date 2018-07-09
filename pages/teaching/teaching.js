//index.js
//获取应用实例
const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");

Page({
  data: {
    teach:0
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    //如果是小程序码进入，处理逻辑
    var reqData={};
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        var imageWidth = windowWidth;
        var imageHeight = imageWidth * 5.36;
        that.setData({
          imgWidth: imageWidth,
          imgHeight: imageHeight
        })
      }
    })
    var loginFlag = app.globalData.login;
    if (loginFlag==1){
      that.getMyAd(reqData)
    }
  },

  onShow: function () {
    var that = this;
    
  },
  getMyAd: function (reqData) { 
    var z = this;
    wx.request({
      url: ApiConst.myAd(),
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
           console.log(res.data)
           if (res.data.data!=null){
             if (res.data.data.id == 28) {
               z.setData({
                 teach: 1
               })
             }
           }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });    
        }
      },
      fail: res => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      }
    })
  },
  goMain:function(){
    wx.switchTab({
      url: '../main/main'
    })
  }
})