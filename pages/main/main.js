//main.js
//获取应用实例
var util = require("../../utils/util.js");
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
    background: ['banner1', 'banner2'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    shareit: false
  },

  onLoad: function () {
    var loginFlag = app.globalData.login;
    // if (loginFlag != 1) {
    //   wx.showModal({
    //     title: "提示",
    //     content: "你还没有登录",
    //     confirmText: "立即登录",
    //     cancelText: "取消",
    //     success: function (sure) {
    //       if (sure.confirm) {
    //         wx.navigateTo({
    //           url: '../register/register'
    //         })
    //       }
    //     }
    //   })
    // }
    this.judgeCanIUse();
    this.checkUpdate();
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
    z.followFlag()
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

              // if (res.data.data.check != null) {

              //   if (nowdate >= res.data.data.check.date && res.data.data.check.status == 0) { //可以检测了
              //     this.setData({
              //       canCheck: 1
              //     })
              //   }
              //   if (res.data.data.check.status == 1) { //检测审核中
              //     this.setData({
              //       canCheck: 2
              //     })
              //   }
              //   if (res.data.data.check.status == 2) { //检测未通过
              //     this.setData({
              //       canCheck: 3
              //     })
              //   }
              // }

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
      title: '奔跑中...',
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
      var shareTitle = res.target.dataset.adname;
      var adid = res.target.dataset.adid;
      var adimg = res.target.dataset.adimg;
      var desc = '全新广告，躺着赚钱，速速来抢～';
    }
    if (res.from == 'menu') {
      var shareTitle = '奔跑宝，私家车广告平台';
      var adid = -1;
      var adimg = '../../image/bpbimg.jpg';
      var desc = '拉上好友一起赚钱～';
    }
    console.log(res);
    //console.log(this)
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?adId=' + adid,
      imageUrl: adimg,
      success: function (res) {
        console.log('share------success')
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
      that.setData({
        shareit: true
      })
    } else if (event.currentTarget.dataset.hi == 'banner2') {
      //活动详情页
      wx.navigateTo({
        url: '../recommend/recommend?flag=active',
      })
    }
  },
  hideShare: function () {
    var that = this;
    that.setData({
      shareit: false
    })
  },
  followFlag: function () {//查询是否关注公众号
    wx.request({
      url: app.globalData.baseUrl + 'app/get/user_has_subscribe',
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
             //console.log(res.data)
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

})