const app = getApp()

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
    shareit: false
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
    //		console.log(app.globalData.userInfo)
    if (app.globalData.userInfo != null) {
      z.setData({
        picture: app.globalData.userInfo.avatarUrl
      })
    }

    //console.log(app.globalData.userInfo.avatarUrl)
    app.userInfoReadyCallback = res => {
      //			console.log(res)
      app.globalData.userInfo = res.userInfo
      z.setData({
        picture: app.globalData.userInfo.avatarUrl
      })
      //console.log(app.globalData.userInfo)
    }
    //		var uidData = {};
    //		uidData.user_id = app.globalData.uid;

    wx.request({
      url: app.globalData.baseUrl + 'app/get/user_auth_status',
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          //					console.log(res.data)
          z.setData({
            name: res.data.data.real_name,
            province: res.data.data.province,
            city: res.data.data.city,
            plate_no: res.data.data.plate_no,
            status: res.data.data.status,
            comment: res.data.data.comment
          })
          if (res.data.data.status == 3) {
            wx.redirectTo({
              url: '../main/main'
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
      url: app.globalData.baseUrl + 'app/get/user_has_subscribe',
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          console.log(res.data.data)
          that.setData({
            isFollow: res.data.data
          })
        } else {
          //					console.log(res.data)
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
      title: '奔跑中...',
      icon: 'loading'
    })
    //		var uidData = {};
    //		uidData.user_id = app.globalData.uid;

    wx.request({
      url: app.globalData.baseUrl + 'app/get/user_auth_status',
      data: {},
      header: app.globalData.header,
      success: res => {
        wx.stopPullDownRefresh();
        if (res.data.code == 1000) {
          //					console.log(res.data)

          z.setData({
            name: res.data.data.real_name,
            province: res.data.data.province,
            city: res.data.data.city,
            plate_no: res.data.data.plate_no,
            status: res.data.data.status,
            comment: res.data.data.comment
          })
          if (res.data.data.status == 3) {
            wx.redirectTo({
              url: '../main/main' //
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
        wx.stopPullDownRefresh();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      }
    })

  },

})