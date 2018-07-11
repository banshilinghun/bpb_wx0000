const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");

Page({

  data: {
    picture: "",
    name: "",

    // 1.菜单栏数据
    items: [{
      icon: '../../image/user_jiashizheng@2x.png',
      text: '身份认证'
    }],
    showGoodsDetail: false,
    shareit: false,
    stateSrc: '',
    stateStr: ''
  },
  onLoad: function (options) {
    //console.log(options.followFlag)
    var that = this;
    if (options.followFlag == 1) {
      that.setData({
        followFlag: true
      })
    } else {
      that.setData({
        followFlag: false
      })
    }
    that.followFlag();
  },

  onShow: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var z = this;

    this.requestAuthStatus();
  },

  requestAuthStatus: function(){
    let that = this;
    wx.request({
      url: ApiConst.getAuthStatus(),
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          let status = res.data.data.status;
          that.setData({
            status: status,
            comment: res.data.data.comment
          })
          if (status == 1){//审核中
            that.setData({
              stateSrc: '../../image/checking-icon.png',
              stateStr: '您的资料已提交审核，请耐心等待。'
            })
          }else if(status == 2){//未通过
            that.setData({
              stateSrc: '../../image/check-refuse.png',
              stateStr: '很抱歉!您的资料未能通过审核,您可重新提交认证'
            })
          }else if(status == 3){//已通过
            that.setData({
              stateSrc: '../../image/check-over.png',
              stateStr: '您的资料已审核通过，快去预约广告吧~'
            })
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

  bookTap: function () {
    wx.redirectTo({
      url: '../auth/auth'
    })
  },

  dialogClickListener: function () {
    var that = this;
    that.setData({
      showGoodsDetail: false,
      shareit: true
    })
  },

  followFlag: function () {//查询是否关注公众号
    var that = this;
    wx.request({
      url: ApiConst.userHasSubcribe(),
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          console.log(res.data.data)
          that.setData({
            isFollow: res.data.data
          })
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

  onPullDownRefresh: function () {
    var z = this;
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.requestAuthStatus();
  },

  handlePass: function(){
    wx.switchTab({
      url: '../main/main'
    })
  },

  handleChecking: function(){
    wx.switchTab({
      url: '../main/main'
    })
  }

})