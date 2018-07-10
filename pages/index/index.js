//index.js
//获取应用实例
const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
const shareFlagUrl = ApiConst.getShareFlag();

Page({
  data: {
    showDialog: false
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    //如果是小程序码进入，处理逻辑
    console.log(options)
    if(options.pages){
      that.setData({
        jump: options.pages
      })
    }
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
        user_id: getQueryString('user_id') ? getQueryString('user_id') : null,
        type: getQueryString('type') ? getQueryString('type') : null,
        adId: getQueryString('adId') ? getQueryString('adId') : null
      })
    } else {
      that.setData({
        user_id: options.user_id ? options.user_id : null,
        type: options.type ? options.type : null,
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
    wx.login({
      success: res => {
        //var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res)
        if (res.code) {
          app.globalData.code = res.code;
          var reqData = {};
          reqData.wx_code = res.code;
          wx.getUserInfo({
            success: function (infoRes) {
              console.log(infoRes)
              app.globalData.userInfo = infoRes.userInfo
              that.setData({
                userInfo: infoRes.userInfo,
                hasUserInfo: true
              })
              reqData.iv =infoRes.iv;
              reqData.encryptedData=infoRes.encryptedData;
              if (app.globalData.userInfo) {
                //reqData.wx_code = res.code;
                reqData.avatar = app.globalData.userInfo.avatarUrl;
                reqData.nickname = app.globalData.userInfo.nickName;
                reqData.gender = app.globalData.userInfo.gender;

              } else {
                reqData.avatar = '';
                reqData.nickname = '';
                reqData.gender = 0;
              }
              if (recommendId) {
                reqData.recommender_userid = recommendId;
              }
              //console.log(res.code)
              console.log(reqData);
              //发起网络请求
              wx.request({
                url: ApiConst.wxLogin(),
                data: reqData,
                header: {
                  'content-type': 'application/json'
                },
                success: res => {
                  //console.log(res.data.data)
                  if (res.data.code == 1000) {
                    //var param = JSON.stringify(res.data.data);
                    //app.globalData.session_id = res.data.data.session_id;
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
                    if (type == 1 || type == 2) {
                      //没有手机号处理,跳转拉新页面（novice）
                      //if (res.data.data.phone) {}
                      that.showMain();
                    } else {
                      console.log(type)
                      if (that.data.jump == 'ads') {
                        that.showMain();
                      } else if (that.data.jump == 'regist') {
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '../register/register'
                          })
                        }, 1500);
                      } else if (that.data.jump == 'recommend') {
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '../recommend/recommend?flag=mp'
                          })
                        }, 1500);
                      } else if (that.data.jump == 'account') {
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../me/me'
                          })
                        }, 1500);
                      } else {
                        that.showMain();
                      }
                    }
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
            }, fail: function (e) {
              that.setData({
                showDialog: true
              })

            }, complete: function (res) {

            }
          })
          //console.log(app.globalData.userInfo)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 根据开关跳转
   */
  getShareFlag: function (recommendId) {
    var that = this;
    wx.request({
      url: shareFlagUrl,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data){
            setTimeout(function () {
              wx.redirectTo({
                url: '../novice/novice?recomId=' + recommendId
              })
            }, 1500);
          }else{
            that.showMain();
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
        that.showMain();
      }
    })
  },

  showMain: function(){
    // setTimeout(function () {
    //   wx.switchTab({
    //     url: '../main/main'
    //   })
    // }, 1500);
    wx.redirectTo({
      url: '../switchcity/switchcity',
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
  userInfoHandler: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.userInfo == undefined) {
      wx.showToast({
        title: "请允许授权",
        icon: 'loading'
      })
    } else {
      that.setData({
        showDialog: false
      })
      app.globalData.userInfo = e.detail.userInfo
      console.log(e.detail)
      // reqData.iv = infoRes.iv;
      // reqData.encryptedData = infoRes.encryptedData;
      var iv = e.detail.iv;
      var encryptedData = e.detail.encryptedData;
      var wx_code = app.globalData.code;
      var avatarUrl = e.detail.userInfo.avatarUrl;
      var nickname = e.detail.userInfo.nickName;
      var gender = e.detail.userInfo.gender;
      wx.request({
        url: ApiConst.wxLogin(),
        data: {
          wx_code: wx_code,
          avatar: avatarUrl,
          nickname: nickname,
          gender: gender,
          iv:iv,
          encryptedData:encryptedData
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
   
    }
  }
})