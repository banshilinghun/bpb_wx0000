//main.js
//获取应用实例
var util = require("../../utils/util.js");
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");
const Api = require("../../utils/Api.js");
const dotHelper = require("../../pages/me/dotHelper.js");
var app = getApp()
Page({
  data: {
    myAd: '',
    adList: '',
    focus: false,
    isShowView: true,
    haveMyAd: false,
    //测试数据
    userList: [],
    background: ['banner1','banner2'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    //是否衔接滑动
    circular: true,
    shareit: false,
    reward: false,
  },

  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    if (that.data.background.length < 2) {
      that.setData({
        indicatorDots: false
      })
    }
    var loginFlag = app.globalData.login;
    var recomType = app.globalData.recomType;
    var recomAdId = app.globalData.recomAdId;
    var recomId = app.globalData.recomId;
    //recomType 1:拉新 2:奖励 3:广告
    if (recomType == 3) {
      wx.navigateTo({
        url: '../details/details?adId=' + recomAdId
      })
    }
    if (app.globalData.isFirst) {
      that.setData({
        reward: true
      })
    }
    app.globalData.isFirst = false;
    //请求红点状态
    dotHelper.requestDotStatus();
    this.judgeCanIUse();
    this.checkUpdate();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          bannerHeight: res.windowWidth * 0.466666
        })
      }
    })
  },

  /**
   * 判断 微信版本 兼容性
   */
  judgeCanIUse: function () {
    var that = this;
    //组件不兼容
    //微信版本过低
    wx.getSystemInfo({
      success: function (res) {
        // console.log('brand------------->' + res.brand);
        // console.log('model------------->' + res.model);
        // console.log('version------------->' + res.version);
        // console.log('system------------->' + res.system);
        // console.log('SDKVersion------------->' + res.SDKVersion);
      },
    })
    if (!wx.canIUse('picker.mode.selector')) {
      that.showLowVersionTips();
    }
  },

  showLowVersionTips: function () {
    wx.showModal({
      title: '提示',
      content: '您当前微信版本过低，将导致无法使用部分重要功能，请升级到微信最新版本。',
      showCancel: false,
      success: function (res) { },
    })
  },

  onShow: function () {
    var z = this;
    var loginFlag = app.globalData.login;
    z.followFlag();
    if (loginFlag == 1) {
      wx.request({
        url: app.globalData.baseUrl + 'app/get/user_auth_status',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //					console.log(res.data)
            this.setData({
              status: res.data.data.status,
              name: res.data.data.real_name,
              province: res.data.data.province,
              city: res.data.data.city,
              plate_no: res.data.data.plate_no
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

      wx.request({
        url: app.globalData.baseUrl + 'app/get/my_ad',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //					console.log(res.data)
            //console.log(res.data.data)
            if (res.data.data != null) {
              var nowdate = util.dateToString(new Date());
              if (res.data.data.subscribe != null && res.data.data.check == null) {
                res.data.data.subscribe.date = res.data.data.subscribe.date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
                this.setData({
                  canCheck: 4
                })
              }
              if (res.data.data.check != null) {
                if (res.data.data.check.checkType == 'SELF_CHECK') {//期中检测
                  if (nowdate < res.data.data.check.checkDate) { //期中检测还未到检测时间
                    this.setData({
                      canCheck: 0
                    })
                  }
                  if (nowdate >= res.data.data.check.checkDate) { //可以期中检测了
                    this.setData({
                      canCheck: 1
                    })
                  }
                }
                if (res.data.data.check.checkType == 'SERVER_CHECK') {//期末检测
                  if (nowdate < res.data.data.check.checkDate && res.data.data.check.status == 0) { //期末检测还未到检测时间
                    this.setData({
                      canCheck: 2
                    })
                  }
                  if (nowdate >= res.data.data.check.checkDate && res.data.data.check.status == 0) { //可以期末检测了
                    this.setData({
                      canCheck: 3
                    })
                  }
                  if (res.data.data.check.status == 1) {//期末检测审核中
                    this.setData({
                      canCheck: 5
                    })
                  }

                }
              }
              res.data.data.begin_date = res.data.data.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
              res.data.data.end_date = res.data.data.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
              if (res.data.data.check != null) {
                res.data.data.check.checkDate = res.data.data.check.checkDate.replace(/(.+?)\-(.+?)\-(.+)/, "$1年$2月$3日");
              }
              var myad = res.data.data;

              z.setData({
                myAd: myad,
                haveMyAd: true
              })

            } else {
              //z.shippingAddress()
              z.setData({
                myAd: null,
                haveMyAd: false
              })
            }

          } else {
            if (res.data.code == 3000) {
              wx.redirectTo({
                url: '../register/register'
              })
            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.msg
              });
            }

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
    }
    wx.request({
      url: app.globalData.baseUrl + 'app/get/ad_list',
      data: {},
      header: app.globalData.header,
      success: res => {
        wx.stopPullDownRefresh();
        if (res.data.code == 1000) {
          var nowdate = util.dateToString(new Date());
          if (res.data.data.length > 0) {
            //						console.log(res.data.data);
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].run_status == 1) {
                if (nowdate < res.data.data[i].end_date) {
                  if (res.data.data[i].current_count > 0) {
                    res.data.data[i].state = 0;//开始的
                  } else {
                    res.data.data[i].state = 2;//已经投完
                  }
                } else {
                  res.data.data[i].state = 3;//已经结束
                }
              } else {
                res.data.data[i].state = 1;//即将开始
              }

              res.data.data[i].begin_date = res.data.data[i].begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
              res.data.data[i].end_date = res.data.data[i].end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            }

            var adList = res.data.data;

            //console.log(adList)
            this.setData({
              adList: adList
            })
          } else {
            this.setData({
              adList: []
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
  go: function (event) {
    //		console.log(event)
    var adId = event.currentTarget.dataset.name;
    //		console.log(adId);
    //var status = this.data.status;
    //				console.log(status);
    wx.navigateTo({
      url: '../details/details?adId=' + adId
    })

  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.onShow();
  },

  check: function (e) {
    wx.navigateTo({
      url: '../check/check?ckData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from == 'button') {
      var shareTitle = shareUtil.getShareAdTitle(res.target.dataset.adname);
      var adid = res.target.dataset.adid;
      var adimg = res.target.dataset.adimg;
      var desc = '全新广告，躺着赚钱，速速来抢～';
      var shareType = Constant.shareAd;
    }
    if (res.from == 'menu') {
      var shareTitle = shareUtil.getShareNormalTitle();
      var adid = -1;
      var adimg = '../../image/share-normal.png';
      var desc = '拉上好友一起赚钱～';
      var shareType = Constant.shareNormal;
    }
    console.log(res);
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?adId=' + adid + '&user_id=' + app.globalData.uid + '&type=' + shareType,
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

  goMap: function (e) {
    //		console.log(e.currentTarget.dataset);
    wx.openLocation({
      longitude: Number(e.currentTarget.dataset.longitude),
      latitude: Number(e.currentTarget.dataset.latitude),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  tapName: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.hi)
    if (event.currentTarget.dataset.hi == 'banner1') {
      // that.setData({
      //   shareit: true
      // })
      wx.navigateTo({
        url: '../teaching/teaching',
      })
    } else if (event.currentTarget.dataset.hi == 'banner2') {
      //活动详情页
      that.skipRecommend();
    }
  },
  hideShare: function () {
    var that = this;
    that.setData({
      shareit: false
    })
  },
  followFlag: function () {//查询是否关注公众号
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'app/get/user_has_subscribe',
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          //console.log(res.data)
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

  /**
   * 版本更新
   */
  checkUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('onCheckForUpdate----------------->');
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，即刻体验？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
      })
    }
  },

  recommendClick: function(){
    this.skipRecommend();
  },

  skipRecommend: function(){
    wx.navigateTo({
      url: '../recommend/recommend?flag=active',
    })
  }

})