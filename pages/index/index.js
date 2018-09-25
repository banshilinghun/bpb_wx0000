//获取应用实例
const app = getApp();
const ApiManager = require("../../utils/api/ApiManager");
const ApiConst = require("../../utils/api/ApiConst.js");
const Router = require("../../router/Router");

Page({
  data: {
    showDialog: false,
    go_adId: ''
  },

  //事件处理函数
  onLoad: function (options) {
    var that = this;
    //如果是小程序码进入，处理逻辑
    console.log(options)
    if (options.pages) {
      that.setData({
        jump: options.pages
      })
    }
    if (options.ad_id) {
      that.setData({
        go_adId: options.ad_id
      })
    }
    if (options.scene) {
      //console.log(decodeURIComponent(options.scene));
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
    this.getSystemInfo();
  },

  getSystemInfo() {
    wx.getSystemInfo({
      success: function (res) {
        //检测当前手机型号是否是iPhone X, 保存到全局
        app.globalData.isIpx = res.model.indexOf('iPhone X') !== -1
      }
    })
  },

  onShow: function () {
    var that = this;
    var recommendId = that.data.user_id;
    //记录请求开始时间戳
    let startTime = new Date().getTime();
    that.setData({
      startTime: startTime
    })
    console.log('wx----login------start--------->');
    wx.login({
      success: res => {
        //var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('wx----login--------------->');
        console.log(res);
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
              reqData.iv = infoRes.iv;
              reqData.encryptedData = infoRes.encryptedData;
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
              that.requestWxLogin(reqData);
              //发起网络请求
            },
            fail: function (e) {
              that.setData({
                showDialog: true
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: res => {
        console.log('微信登录失败------------>');
        console.log(res);
      }
    })
  },

  requestWxLogin(reqData) {
    const that = this;
    let requestData = {
      url: ApiConst.WX_LOGIN,
      data: reqData,
      success: res => {
        app.globalData.header.Cookie = 'sessionid=' + res.session_id;
        app.globalData.uid = res.uid;
        app.globalData.checkStaus = res.status;
        app.globalData.isFirst = res.isFirst;
        app.globalData.recomId = that.data.user_id;
        app.globalData.recomType = that.data.type;
        app.globalData.recomAdId = that.data.adId;
        //年检状态
        app.globalData.car_check_date = res.car_check_date;
        //补全车型状态
        app.globalData.is_add_car_model = res.is_add_car_model;
        //是否登录
        if (res.phone) {
          app.globalData.login = 1;
        } else {
          app.globalData.login = 0;
        }
        if (that.data.type == 1 || that.data.type == 2) {
          //没有手机号处理,跳转拉新页面（novice）
          //if (res.phone) {}
          that.switchPage(Router.MAIN_URL);
        } else {
          if (that.data.jump == 'ads') {
            that.switchPage(Router.MAIN_URL);
          } else if (that.data.jump == 'regist') {
            that.redirectPage('../register/register');
          } else if (that.data.jump == 'recommend') {
            that.redirectPage('../recommend/recommend?flag=mp');
          } else if (that.data.jump == 'account') {
            that.switchPage('../me/me');
          } else {
            if (that.data.go_adId) {
              console.log(that.data.go_adId)
              that.redirectPage('../details/details?adId=' + that.data.go_adId);
            } else {
              that.switchPage(Router.MAIN_URL);
            }
          }
        }
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 根据开关跳转
   */
  getShareFlag: function (recommendId) {
    const that = this;
    let requestData = {
      url: ApiConst.GET_SHARE_FLAG,
      data: {},
      success: res => {
        if (res) {
          that.redirectPage('../novice/novice?recomId=' + recommendId);
        } else {
          that.switchPage(Router.MAIN_URL);
        }
      },
      fail: res => {
        that.switchPage(Router.MAIN_URL);
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  switchPage(path) {
    let delayTime = this.getDelayTime();
    setTimeout(function () {
      wx.switchTab({
        url: path
      })
    }, delayTime);
  },

  redirectPage(path) {
    let delayTime = this.getDelayTime();
    setTimeout(function () {
      wx.redirectTo({
        url: path
      })
    }, delayTime);
  },

  getDelayTime() {
    //请求结束时间
    let endTime = new Date().getTime();
    let delayTime = endTime - this.data.startTime;
    delayTime = delayTime > 0 ? delayTime : 0;
    return delayTime;
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 未授权
   */
  userInfoHandler: function (e) {
    const that = this;
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
      app.globalData.userInfo = e.detail.userInfo;
      var iv = e.detail.iv;
      var encryptedData = e.detail.encryptedData;
      var wx_code = app.globalData.code;
      var avatarUrl = e.detail.userInfo.avatarUrl;
      var nickname = e.detail.userInfo.nickName;
      var gender = e.detail.userInfo.gender;
      let requestData = {
        url: ApiConst.WX_LOGIN,
        data: {
          wx_code: wx_code,
          avatar: avatarUrl,
          nickname: nickname,
          gender: gender,
          iv: iv,
          encryptedData: encryptedData
        },
        success: res => {
          app.globalData.header.Cookie = 'sessionid=' + res.session_id;
          app.globalData.uid = res.uid;
          app.globalData.checkStaus = res.status;
          app.globalData.isFirst = res.isFirst;
          app.globalData.recomId = that.data.user_id;
          app.globalData.recomType = that.data.type;
          app.globalData.recomAdId = that.data.adId;
          if (res.phone) {
            app.globalData.login = 1;
          } else {
            app.globalData.login = 0;
          }
          wx.switchTab({
            url: Router.MAIN_URL
          })
        }
      }
      ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
    }
  }
})