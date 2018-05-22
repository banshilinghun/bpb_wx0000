//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    img: '../../image/index.png',
    showDialog:false 
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    //如果是小程序码进入，处理逻辑
    console.log(options)
    if (options.scene) {
      console.log(decodeURIComponent(options.scene));
      var scene = decodeURIComponent(options.scene);
      function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = scene.match(reg);
        if (r != null) {
          return unescape(r[2])
        }
        return null
      }
      that.setData({
        user_id: getQueryString('user_id') ? getQueryString('user_id'):null,
        type: getQueryString('type') ? getQueryString('type') : null,
        adId: getQueryString('adId') ? getQueryString('adId') : null
      })
    }else{
      that.setData({
        user_id: options.user_id ? options.user_id:null,
        type: options.type ? options.type:null,
        adId: options.adId ? options.adId : null
      })
    }
    //console.log(that.data.user_id)
  },

  onShow: function () {
    var that = this;
    var recommendId = that.data.user_id;
    var type = that.data.type;
    var adId = that.data.adId;
    wx.getUserInfo({
      success: function (infoRes) {
        console.log(infoRes.userInfo)
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
                    app.globalData.uid = res.data.data.uid;
                    //								console.log(res.data.data);	 ·
                    app.globalData.checkStaus = res.data.data.status;
                    app.globalData.isFirst = res.data.data.isFirst;
                    app.globalData.recomId = that.data.user_id;
                    app.globalData.recomType = that.data.type;
                    app.globalData.recomAdId = that.data.adId;
                    if (res.data.data.phone) {
                      app.globalData.login = 1;
                    } else {
                      app.globalData.login = 0;
                    }
                    wx.switchTab({
                      url: '../main/main'
                    })                       
                  } else {
                    wx.showModal({
                      title: '提示',
                      showCancel: false,
                      content: res.data.msg
                    });
                  }
                  //console.log(shareAd)
              

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
      }, fail: function (e) {
        that.setData({
          showDialog: true
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
  userInfoHandler:function(e){
    var that=this;
    console.log(e.detail.userInfo)
    if (e.detail.userInfo==undefined){
      wx.showToast({
        title: "请允许授权",
        icon: 'loading'
      })
    }else{
      that.setData({
        showDialog: false
      })
      app.globalData.userInfo = e.detail.userInfo
      wx.login({
        success: res => {
          if (res.code) {
            app.globalData.code = res.code
            var avatarUrl = e.detail.userInfo.avatarUrl;
            var nickname = e.detail.userInfo.nickName;
            var gender = e.detail.userInfo.gender;
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
                if (res.data.code == 1000) {
                  app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
                  app.globalData.uid = res.data.data.uid;
                  app.globalData.checkStaus = res.data.data.status;
                  app.globalData.isFirst = res.data.data.isFirst;
                  app.globalData.recomId = that.data.user_id;
                  app.globalData.recomType = that.data.type;
                  app.globalData.recomAdId = that.data.adId;
                  if (res.data.data.phone) {
                    app.globalData.login = 1;
                  } else {
                    app.globalData.login = 0;
                  }
                  wx.switchTab({
                    url: '../main/main'
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
                  content: res.errMsg
                });
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }

      })
    }
  }
})