//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    img: '../../image/index.png'
  },
  //事件处理函数
  onLoad: function (o) {
    var that = this;
    that.setData({
      shareAd: o
    })
    // 登录

    // wx.getSetting({
    //   success: res => {
    //     //console.log(res)
    //     if (res) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           //console.log(res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           //console.log(res.userInfo)
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     //console.log(res.userInfo)
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       console.log(res)
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  onShow: function () {
    var that = this;
    var shareAd = this.data.shareAd;
    wx.getUserInfo({
      success: function (infoRes) {
        //console.log(infoRes)
        app.globalData.userInfo = infoRes.userInfo
        that.setData({
          userInfo: infoRes.userInfo,
          hasUserInfo: true
        })
        wx.login({
          success: res => {
            //var that = this;
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            //console.log(res)
            if (res.code) {
              app.globalData.code = res.code
              //console.log(app.globalData.userInfo)
              if (app.globalData.userInfo) {
                var avatarUrl = app.globalData.userInfo.avatarUrl;
                var nickname = app.globalData.userInfo.nickName;
                var gender = app.globalData.userInfo.gender
              } else {
                var avatarUrl = '';
                var nickname = '';
                var gender = 0;
              }
              //console.log(res.code)
              //发起网络请求
              wx.request({
                url: app.globalData.baseUrl + 'app/user/wx_login',
                data: {
                  wx_code: res.code,
                  avatar: avatarUrl,
                  nickname: nickname,
                  gender: gender
                },
                header: {
                  'content-type': 'application/json'
                },
                success: res => {
                  //console.log(res.data.data)
                  if (res.data.code == 1000) {
                    //								var param = JSON.stringify(res.data.data);
                    //app.globalData.session_id = res.data.data.session_id;
                    app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
                    //								console.log(res.data.data);	 ·
                    app.globalData.login = 1;
                    app.globalData.checkStaus = res.data.data.status;
                  } else if (res.data.code == 2001) {
                    app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
                    app.globalData.login = 0;
                  }
                  //console.log(shareAd)
                  if (shareAd.adId == -1 || shareAd.adId == undefined) {
                    wx.switchTab({
                      url: '../main/main'
                    })
                  } else {
                    wx.redirectTo({
                      url: '../details/details?adId=' + shareAd.adId + "&share=1"
                    })
                  }

                },
                fail: res => {
                  //console.log(2222);

                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.errMsg
                  });
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }

        })
      }, fail: function () {
        wx.showModal({
          title: '获取用户信息授权',
          content: '微信登录需要获取您的用户信息，请前往设置页打开用户信息授权',
          confirmText: "去设置",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                    wx.getUserInfo({
                      success: function (res) {
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                          userInfo: res.userInfo,
                          hasUserInfo: true
                        })
                      }
                    })
                  }
                }, fail: function (res) {

                }
              })

            }
          }
        })
      }, complete: function (res) {

      }
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})