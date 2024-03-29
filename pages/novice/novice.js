var app = getApp()
var util = require("../../utils/common/util");
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const ApiConst = require("../../utils/api/ApiConst.js");
Page({
  data: {
    registBtnTxt: "确定",
    registBtnBgBgColor: "#FD500D",
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
        var imageHeight = imageWidth * 1.608;
        var swiperTop = imageWidth*0.38;
        var headImgTop = windowWidth*0.05;
        var nickNameTop = windowWidth * 0.208;
        // var linkconTop = windowWidth * 0.248;
        var bpbImgTop = windowWidth * 0.744;
        var joinImgTop = windowWidth*0.517;
        var regWidth = windowWidth * 0.833;
        var marRegWidth = -(regWidth/2)
        that.setData({
          imageWidth: imageWidth,
          imageHeight: imageHeight,
          swiperTop: swiperTop,
          headImgTop: headImgTop,
          nickNameTop: nickNameTop,
          bpbImgTop: bpbImgTop,
          joinImgTop: joinImgTop,
          regWidth: regWidth,
          marRegWidth: marRegWidth
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
        url: ApiConst.REGIST,
        data: registData,
        header: app.globalData.header,
        success: res => {
          that.setregistData2();
          if (res.data.code == 1000) {
            app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
            app.globalData.session_id = res.data.data.session_id;
            app.globalData.login = 1;
            wx.showToast({
              title: "注册成功"
            })
            wx.switchTab({
              url: '../main/main'
            })
            // wx.redirectTo({
            //   url: '../teaching/teaching'
            // })        
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
      registBtnBgBgColor: "#FD500D",
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
      url: ApiConst.REGIST_VERRIFY_WX,
      data: rqData,
      header: app.globalData.header,
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
      url: ApiConst.RECOMMEND_REWARD_LIST,
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
  },
  backHome: function () {
    wx.switchTab({
      url: '../main/main'
    })
  },

  /**
   * 活动规则
   */
  showActiveRule: function(){
    wx.navigateTo({
      url: '../recommend/recommend?flag=rule'
    })
  },

  onShareAppMessage: function(){
    var that = this;
    var shareTitle = shareUtil.getShareNormalTitle();
    var adid = -1;
    var adimg = '../../image/share-normal.png';
    var desc = "拉上好友一起赚钱～";
    var shareType = Constant.shareNormal;
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?' + 'user_id=' + app.globalData.uid + '&type=' + shareType,
      imageUrl: adimg,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      },
      fail: function () {
        wx.showToast({
          title: '分享取消',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      }
    }
  },
  goProtocol:function(){
    wx.navigateTo({
      url: '../protocol/index',
    })
  }
})