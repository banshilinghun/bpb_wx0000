const util = require("../../utils/util.js");
const app = getApp()
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
    istrue:true,
    inviteId: '我是shareInviteId',
    //分享后传递的邀请人的id，为空则表示不是从分享页面进入
    shareInviteId: '',
  },

  onLoad: function (options) {
    this.setData({
      adId: options.adId,
      shareInviteId: options.inviteId,
    })
  },
  onShow: function () {
    var that = this
    var reqData = {};
    reqData.ad_id = that.data.adId;
    wx.request({
      url: 'https://wxapi.benpaobao.com/app/get/ad_info',
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data.logistics.ad_logistics) {
            if (res.data.data.logistics.ad_logistics.info) {
              //console.log(res.data.data.logistics.ad_logistics.info);
              var exp = JSON.parse(res.data.data.logistics.ad_logistics.info);
              //console.log(exp);
              for (var i = 0; i < exp.data.length; i++) {
                exp.data[i].ymdate = (exp.data[i].time.split(" ")[0]).replace(/(.+?)\-(.+?)\-(.+)/, "$2-$3");
                exp.data[i].hmtime = (exp.data[i].time.split(" ")[1]).replace(/(.+?)\:(.+?)\:(.+)/, "$1:$2");
              }
              var expdata = exp.data.slice(0, 1);
              this.setData({
                haveExp: true,
                expList: expdata,
                allExpList: exp.data,
                newExpList: expdata
              })
            }
            this.setData({
              receive: 1,
              shippingStatus: res.data.data.logistics.ad_logistics.status,
              recipients: res.data.data.logistics.ad_logistics.name,
              rePhone: res.data.data.logistics.ad_logistics.phone,
              reProvince: res.data.data.logistics.ad_logistics.province,
              reCity: res.data.data.logistics.ad_logistics.city,
              reCounty: res.data.data.logistics.ad_logistics.county,
              reDetail: res.data.data.logistics.ad_logistics.detail
            })
          } else {
            this.setData({
              receive: 0
            })
          }
          var enddate = res.data.data.info.end_date;
          var nowdate = util.dateToString(new Date());
          res.data.data.info.begin_date = res.data.data.info.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
          res.data.data.info.end_date = res.data.data.info.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")

          if (res.data.data.myad == null) { //登记

            if (nowdate < enddate) {
              if (res.data.data.info.current_count == 0) {
                this.setData({
                  sta: 9
                })
              } else {
                if (res.data.data.logistics.now_logistics) {
                  if (res.data.data.logistics.now_logistics.ad_id == res.data.data.info.id) {
                    if (res.data.data.logistics.ad_logistics.status > 0) {
                      this.setData({
                        sta: 0
                      })
                    } else {
                      this.setData({
                        sta: 11
                      })
                    }
                  } else {
                    this.setData({
                      sta: 7
                    })
                  }
                } else {
                  this.setData({
                    sta: 10
                  })
                }

              }

            } else {
              this.setData({
                sta: 8
              })
            }

          } else {
            if (res.data.data.info.id == res.data.data.myad.id) {
              if (res.data.data.myad.regist.status == 1) { //登记审核中
                this.setData({
                  sta: 1
                })
              }
              if (res.data.data.myad.regist.status == 2) { //登记审核没通过
                this.setData({
                  sta: 2
                })
              }
              if (res.data.data.myad.check != null) {
                this.setData({
                  ckid: res.data.data.myad.check.id
                })
                var ckdate = res.data.data.myad.check.date;
                var nowdate = util.dateToString(new Date());
                if (res.data.data.myad.check.status == 0 && nowdate < ckdate) { //检测没开始
                  this.setData({
                    sta: 3
                  })
                }
                if (res.data.data.myad.check.status == 0 && nowdate >= ckdate) { //开始检测了
                  this.setData({
                    sta: 4
                  })
                }
                if (res.data.data.myad.check.status == 1) { //检测中
                  this.setData({
                    sta: 5
                  })
                }
                if (res.data.data.myad.check.status == 2) { //检测未通过
                  this.setData({
                    sta: 6
                  })
                }
                this.setData({
                  ckdate: res.data.data.myad.check.date.replace(/(.+?)\-(.+?)\-(.+)/, "$1年$2月$3日")

                })
              }

            } else {
              if (nowdate < enddate) {
                if (res.data.data.info.current_count == 0) {
                  this.setData({
                    sta: 9
                  })
                } else {
                  this.setData({
                    sta: 7
                  })
                }
              } else {
                this.setData({
                  sta: 8
                })
              }

            }
          }
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

    wx.request({
      url: 'https://wxapi.benpaobao.com/app/find/ad_check_plans',
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data.length>0){
              this.setData({
                checkPlan: true
              })
          }else{
            this.setData({
              checkPlan: false
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
  	formSubmit: function(e) {
		var param = e.detail.value;
        this.setData({
        	 formId:e.detail.formId
        })
		this.receiveAd();
	},

  regist: function (e) {
    if (this.data.shippingStatus == 1) {
      wx.showModal({
        title: "提示",
        content: "确定已收到广告？",
        confirmText: "确认",
        cancelText: "取消",
        success: function (sure) {
          if (sure.confirm) {
            wx.navigateTo({
              url: '../adRegist/adRegist?adData=' + JSON.stringify(e.currentTarget.dataset)
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../adRegist/adRegist?adData=' + JSON.stringify(e.currentTarget.dataset)
      })
    }

  },
  check: function (e) {
    //		console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../check/check?ckData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },
  kindToggle: function (e) {
    if (this.data.receive == 1) {
      return false;
    } else {
      var id = e.currentTarget.id,
        list = this.data.list;
      for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i].id == id) {
          list[i].open = !list[i].open
        } else {
          list[i].open = false
        }
      }
      this.setData({
        list: list
      });
    }

  },
  receiveAd: function () {
    var that = this;
    wx.request({
      url: 'https://wxapi.benpaobao.com/app/get/user_deposit_ispaid',
      data: {},
      header: app.globalData.header,
      success: res2 => {
        if (res2.data.code == 1000) {
          if (res2.data.data == 0) {
            wx.navigateTo({
              url: '../deposit/deposit'
            })
          } else {
            wx.showModal({
              title: "提示",
              content: "广告将以快递形式寄送"+"\r\n前往选择收货地址",
              confirmText: "是",
              cancelText: "否",
              success: function (sure) {
                if (sure.confirm) {
                  if (wx.chooseAddress) {
                    wx.chooseAddress({
                      success: function (res) {
                        wx.showModal({
                          title: "提示",
                          content: "确认将广告寄送到\r\n" + res.provinceName + res.cityName + res.countyName + res.detailInfo + '\r\n收件人:' + res.userName + '(' + res.telNumber + ')',
                          confirmText: "确认",
                          cancelText: "取消",
                          success: function (sure) {
                            if (sure.confirm) {
                              var reqData = {};
                              reqData.ad_id = that.data.adId;
                              reqData.name = res.userName;
                              reqData.phone = res.telNumber;
                              reqData.province = res.provinceName;
                              reqData.city = res.cityName;
                              reqData.county = res.countyName;
                              reqData.detail = res.detailInfo;
                              reqData.form_id=that.data.formId;
                              wx.request({
                                url: 'https://wxapi.benpaobao.com/app/commit/shipping_address',
                                data: reqData,
                                header: app.globalData.header,
                                success: res => {
                                  if (res.data.code == 1000) {
                                    that.onShow()
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
                            }
                          }
                        })
                      },
                      fail: function (res) {
                        // fail
                      },
                      complete: function (res) {
                        // complete
                      }
                    })
                  } else {
                    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                    wx.showModal({
                      title: '提示',
                      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    })
                  }
                }
              }
            })

          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res2.data.msg
          });
        }
      },
      fail: res2 => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      }
    })

  },
  expmenu: function () {
    this.setData({
      expList: this.data.allExpList,
      showMenu: false
    })
  },
  expmenuUp:function(){
    this.setData({
      expList: this.data.newExpList,
      showMenu: true
    })
  },
  checkPlan: function (e) {
  	//console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../checkPlan/checkPlan?adId=' + e.currentTarget.dataset.adid
    })
  },

  //分享
  onShareAppMessage: function(){
    var that = this
    return {
      title: '奔跑宝',
      desc: '奔跑宝广告详情',
      path: 'pages/details/details?adId=' + that.data.adId + '&inviteId=' + that.data.inviteId,
    }
  },

  testClick: res=>{
    wx.redirectTo({
      url: '../test/tesst',
    })
  },
})