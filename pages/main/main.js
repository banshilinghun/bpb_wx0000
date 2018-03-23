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
    userList: ['张三', '李四', '王二', '麻子', 'hahhdjfdhjfdj', 'ndfmdnfmdnmd', 'dfkdfk', 'mdkmfdk,', 'dmfkdmf', 'mdmfkdmfdk'],
  },

  onLoad: function () {
    var loginFlag = app.globalData.login;
    if (loginFlag != 1) {
      wx.showModal({
        title: "提示",
        content: "你还没有登录",
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

  },
  onShow: function () {
    var z = this;
    var loginFlag = app.globalData.login;
    if (loginFlag == 1) {
      wx.request({
        url: 'https://wxapi.benpaobao.com/app/get/user_auth_status',
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
        url: 'https://wxapi.benpaobao.com/app/get/my_ad',
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
                if (res.data.data.check.checkType == 'SERVER_CHECK' ) {//期末检测
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
                  if (res.data.data.check.status == 1){//期末检测审核中
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
                url: '../login/login'
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
      url: 'https://wxapi.benpaobao.com/app/get/ad_list',
      data: {},
      header: app.globalData.header,
      success: res => {
        wx.stopPullDownRefresh();
        if (res.data.code == 1000) {
          var nowdate = util.dateToString(new Date());
          if (res.data.data.length > 0) {
            //						console.log(res.data.data);
            for (var i = 0; i < res.data.data.length; i++) {
              if (nowdate < res.data.data[i].end_date) {
                if (res.data.data[i].current_count > 0) {
                  res.data.data[i].state = 0;
                } else {
                  res.data.data[i].state = 1;
                }
              } else {
                res.data.data[i].state = 2;
              }
              res.data.data[i].begin_date = res.data.data[i].begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
              res.data.data[i].end_date = res.data.data[i].end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            }

            var adList = res.data.data;
            //console.log(adList)
            this.setData({
              adList: adList
            })
          }else{
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
    var status = this.data.status;
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
    //console.log(this)
    var that = this
    return {
      title: '奔跑宝',
      desc: '私家车广告平台',
      path: 'pages/index/index?inviteId=' + that.data.inviteId,
      imageUrl: 'https://wxapi.benpaobao.com/static/app_img/logo.png',
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
  }

})