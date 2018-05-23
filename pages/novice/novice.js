var app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {
    registBtnTxt: "确定",
    registBtnBgBgColor: "#FF555C",
    color: '#FF5539',
    getSmsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "transparent",
    // getSmsCodeBtnTime:60,
    btnLoading: false,
    registDisabled: false,
    smsCodeDisabled: false,
    inputUserName: '',
    inputPassword: '',
    logIcon: "../../image/sz2.png",
    pwdIcon: "../../image/pwdIcon.png",
    verifiIcon: "../../image/sz1.png",
    istrue: true,
    wx_code: app.globalData.code,
    reward: false
  },
  onLoad(options) {
    //console.log(e.title)
    //app.globalData.shareInviteId = options.inviteId;
    this.getWxCode()
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        var imageWidth = windowWidth;
        var imageHeight = imageWidth * 1.8;
        var swiperTop = imageWidth*0.34;
        var headImgTop = windowWidth*0.056;
        var nickNameTop = windowWidth * 0.192;
        var linkconTop = windowWidth * 0.248;
        var bpbImgTop = windowWidth * 0.744;
        var joinImgTop = windowWidth*0.517;
        that.setData({
          imageWidth: imageWidth,
          imageHeight: imageHeight,
          swiperTop: swiperTop,
          headImgTop: headImgTop,
          nickNameTop: nickNameTop,
          linkconTop: linkconTop,
          bpbImgTop: bpbImgTop,
          joinImgTop: joinImgTop
        })
      }
    })
    that.recommend_reward_list(options.recomId)   
    if (app.globalData.isFirst) {
      that.setData({
        reward: true
      })
    }
    app.globalData.isFirst = false;
  
  },
  getWxCode: function () {
    var that = this
    wx.login({
      success: res => {
        that.setData({
          wx_code: res.code,
        })
      },
    })
  },
  formSubmit: function (e) {
    var param = e.detail.value;
    //console.log(e)
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var that = this;
    //console.log(param)
    var registData = {};
    if (app.globalData.recomId){
      registData.recommender_userid = app.globalData.recomId;
    }
    registData.phone_no = param.username.trim();
    registData.verify_code = param.smsCode.trim();
    //registData.password = param.password.trim();
    registData.wx_code = that.data.wx_code.trim();
    if (app.globalData.userInfo) {
      registData.avatar = app.globalData.userInfo.avatarUrl;
      registData.nickname = app.globalData.userInfo.nickName;
      registData.gender = app.globalData.userInfo.gender
    } else {
      registData.avatar = '';
      registData.nickname = '';
      registData.gender = 0;
    }
    var flag = this.checkUserName(param)

    if (flag) {
      this.setregistData1();
      wx.request({
        url: app.globalData.baseUrl + 'app/user/regist',
        data: registData,
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          that.setregistData2();
          if (res.data.code == 1000) {
            app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
            app.globalData.session_id = res.data.data.session_id;
            wx.showToast({
              title: "手机号验证成功"
            })
            wx.switchTab({
              url: '../main/main'
            })

            app.globalData.login = 1;
          } else {
            //console.log(res.data)
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg
            });
          }
        },
        fail: res => {
          that.setregistData2();
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '网络错误'
          });
        }
      })

    }
  },
  setregistData1: function () {
    this.setData({
      registBtnTxt: "验证中",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },

  setregistData2: function () {
    this.setData({
      registBtnTxt: "确定",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#FF555C",
      btnLoading: !this.data.btnLoading
    });
  },

  checkUserName: function (param) {
    var phone = util.regexConfig().phone;
    var inputUserName = param.username.trim();
    if (phone.test(inputUserName)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号码'
      });
      return false;
    }
  },


  mobileInputEvent: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  getSmsCode: function () {
    //		console.log(e)
    var that = this;
    that.getWxCode();
    // var phoneNo = that.data.phone;
    //var wxcode = app.globalData.code.trim()
    var count = 60;
    var rqData = {
      phone_no: that.data.phone,
      wx_code: that.data.wx_code.trim()
    }
    var si = setInterval(function () {
      if (count > 0) {
        count--;
        that.setData({
          getSmsCodeBtnTxt: count + ' s',
          getSmsCodeBtnColor: "transparent",
          color: '#9b9b9b',
          smsCodeDisabled: true
        });
      } else {
        that.setData({
          getSmsCodeBtnTxt: "获取验证码",
          getSmsCodeBtnColor: "transparent",
          color: '#FF5539',
          smsCodeDisabled: false
        });
        count = 60;
        clearInterval(si);
      }
    }, 1000);

    wx.request({
      url: app.globalData.baseUrl + 'app/get/regist_verify_wx',
      data: rqData,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.code == 1000) {

          // console.log(res.data.data)
          wx.showToast({
            title: "验证码已发送"
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });
          clearInterval(si);
        }
      },
      fail: res => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络出错'
        });
        clearInterval(si);
      }
    })
  },
  recommend_reward_list: function (recommender_id){
    var that=this;
    var reqData={};
    reqData.recommender_id=recommender_id;
    wx.request({
      url: app.globalData.baseUrl + 'app/get/recommend_reward_list',
      data: reqData,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.code == 1000) {
          console.log(res.data.data)
          if (res.data.data.info!=null){
            this.setData({
              nickname: res.data.data.info.nickname,
              wx_avatar: res.data.data.info.wx_avatar,
              msgList: res.data.data.reward_list
            });
          }
    
        } else {
          //console.log(res.data)
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });
        }
      },
      fail: res => {
        that.setregistData2();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      }
    })
  }
})