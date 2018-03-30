const util = require("../../utils/util.js");
var formatLocation = util.formatLocation;
var getDistance = util.getDistance;
const app = getApp();
Page({
  data: {
    banners: [],
    receive: 0,
    expressList: [],
    expressNumber: 0,
    expressType: "",
    message: "",
    detail: null,
    state: 0,
    getDataSuccess: true,
    haveExp: false,
    animationError: {},
    wWidth: 0,
    wHeight: 0,
    obj: {},
    expressChangeList: [],
    title: "",
    amount: 1,
    isTop: false,
    isNeedKey: false,
    showMenu: true,
    checkPlan: false,
    istrue: true,
    inviteId: '我是shareInviteId',
    showGoodsDetail:false,
    goHome:false
  },

  onLoad: function (options) {
    //console.log(options.share);
    if (options.share!=undefined){
      this.setData({
       goHome: true
      })
    }
    this.setData({
      adId: options.adId
    })
    app.globalData.shareInviteId = options.inviteId
  },
  onShow: function (n) {
    var that = this;
    wx.request({
      url: 'https://wxapi.benpaobao.com/app/get/user_auth_status',
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data.status!=0){
            that.setData({
              loginStaus: 2
            })
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
    var loginFlag = app.globalData.login;
    var checkStaus = app.globalData.checkStaus;
    if (loginFlag!=1){//没有登录
        that.setData({
          loginStaus:0
        })
    }else{//已登录
      if (checkStaus==0){//未认证
        that.setData({
          loginStaus: 1
        })
      }else{//登录了且认证了
        that.setData({
          loginStaus: 2
        })
      }
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    //console.log(currPage.data.mydata) //就可以看到data里mydata的值了
    if (currPage.data.mydata!=undefined){
      if (currPage.data.mydata.share == 1 && n != 0){
       that.setData({
         showGoodsDetail: true
       })
      }else{
        that.setData({
          showGoodsDetail: false
        })
      }
    }
 
    var reqData = {};
    reqData.ad_id = that.data.adId;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //				console.log(res.longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        if (that.data.service != undefined) {
          if (that.data.service.length > 0) {
            //var dis = [];
            for (var j = 0; j < that.data.service.length; j++) {
              that.data.service[j].distance = getDistance(that.data.latitude, that.data.longitude, that.data.service[j].lat, that.data.service[j].lng).toFixed(2);
            }

          }
        }
        that.setData({
          service: that.data.service
        })

      }
    })
    wx.request({
      url: 'https://wxapi.benpaobao.com/app/get/ad_info',
      data: reqData,
      header: app.globalData.header,
      success: res => {
        console.log(res.data.data)
        if (res.data.code == 1000) {
          //console.log(res.data)
          var enddate = res.data.data.info.end_date;
          res.data.data.info.begin_date = res.data.data.info.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
          res.data.data.info.end_date = res.data.data.info.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
          var serviceList = res.data.data.ad_server;
          if (serviceList.length > 0) {
            //var dis = [];
            for (var j = 0; j < serviceList.length; j++) {
              //						console.log(serviceList[i])
              //                          console.log(that.data.latitude)
              serviceList[j].distance = getDistance(that.data.latitude, that.data.longitude, serviceList[j].lat, serviceList[j].lng).toFixed(2);
              serviceList[j].lista = 1;
              if (res.data.data.isRegist){
                serviceList[j].lista = 0;
              }else{
                if (res.data.data.info.current_count > 0) {
                  if (serviceList[j].ad_count - serviceList[j].subscribe_count <= 0) {
                    serviceList[j].lista = 0;
                  } else {
                    if (serviceList[j].is_sub == 1) {
                      serviceList[j].lista = 0;
                    }
                  }
                  if (res.data.data.subscribe != null) {
                    if (res.data.data.subscribe.ad_id == res.data.data.info.id) {
                      if (res.data.data.subscribe.server_id == serviceList[j].id) {
                        serviceList[j].lista = 2;
                        that.setData({
                          selServerId: res.data.data.subscribe.server_id,
                          selDate: res.data.data.subscribe.date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日"),
                          selTime: res.data.data.subscribe.begin_time + "-" + res.data.data.subscribe.end_time,
                          selId: res.data.data.subscribe.id
                        })
                      } else {
                        serviceList[j].lista = 0;
                      }

                    } else {
                      serviceList[j].lista = 0;
                    }

                  }
                } else {
                  serviceList[j].lista = 0;
                }
              }
             

            }

          }
          console.log(serviceList)
          that.setData({
            service: serviceList
          })
          //                console.log(that.data.service)

          if (res.data.data.imgs.length == 0) {
            that.setData({
              adInfo: res.data.data.info,
              banners: ['../../image/bpb.png']
            })
          } else {
            that.setData({
              adInfo: res.data.data.info,
              banners: res.data.data.imgs
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
  formSubmit: function (e) {
    var param = e.detail.value;
    this.setData({
      formId: e.detail.formId
    })
    this.receiveAd();
  },
  cancel: function () {
    var that = this;
    var subscribe_id = this.data.selId;
    var reqData = { subscribe_id: subscribe_id }
    wx.request({
      url: 'https://wxapi.benpaobao.com/app/cancel/ad_subscribe',
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          wx.showToast({
            title: "取消成功"
          })
          that.onShow(0);
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
  arrangement: function (e) {
    if(app.globalData.login==1){
      wx.request({
        url: 'https://wxapi.benpaobao.com/app/get/user_auth_status',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //					console.log(res.data)
            if (res.data.data.status == 3) {
              wx.navigateTo({
                url: '../arrangement/arrangement?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
              })
            }else{
              if ( res.data.data.status == 2){
                wx.showModal({
                  title: "提示",
                  content: "你没通过身份认证，不能预约广告",
                  confirmText: "立即认证",
                  cancelText: "取消",
                  success: function (sure) {
                    if (sure.confirm) {
                      wx.navigateTo({
                        url: '../state/state'
                      })
                    }
                  }
                })
              } else if (res.data.data.status == 1){
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: "你的身份认证信息正在审核中，不能预约广告"
                });
              }else{
                wx.showModal({
                  title: "提示",
                  content: "你没进行身份认证，不能预约广告",
                  confirmText: "立即认证",
                  cancelText: "取消",
                  success: function (sure) {
                    if (sure.confirm) {
                      wx.navigateTo({
                        url: '../auth/auth'
                      })
                    }
                  }
                })
              }
            
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
    }else{
      wx.showModal({
        title: "提示",
        content: "你还没有登录，不能预约广告",
        confirmText: "立即登录",
        cancelText: "取消",
        success: function (sure) {
          if (sure.confirm) {
            wx.navigateTo({
              url: '../register/register'
            })
          }
        }
      })
    }
    //console.log(e)
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

  //分享
  onShareAppMessage: function (res) {
    //console.log(res)
    var that=this;
    if (res.from == 'button') {
      var shareTitle = res.target.dataset.adname;
      var adid = res.target.dataset.adid;
      var adimg = that.data.banners[0];
      var desc = '全新广告，躺着赚钱，速速来抢～';
    }
    if (res.from == 'menu') {
      var shareTitle = '奔跑宝，私家车广告平台';
      var adid = -1;
      var adimg = '../../image/bpbimg.jpg';
      var desc = '拉上好友一起赚钱～';
    }
    //console.log(res);
    //console.log(this)
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?adId=' + adid,
      imageUrl: adimg,
      success: function (res) {
        setTimeout(function(){
          that.setData({
            showGoodsDetail: false
          })
        },1000)
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      },
      fail: function () {
        setTimeout(function () {
          that.setData({
            showGoodsDetail: false
          })
        }, 1000)
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

  showGoodsDetail: function () {
    this.setData({
      showGoodsDetail: !this.data.showGoodsDetail
    });
  },
  hideGoodsDetail: function () {
    this.setData({
      showGoodsDetail: false
    });
  },
  goRegister:function(){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  goAuth:function(){
    wx.navigateTo({
      url: '../auth/auth'
    })
  },
  backHome:function(){
    wx.switchTab({
      url: '../main/main'
    })
  }
})