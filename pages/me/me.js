// me.js
var util = require("../../utils/util.js");
const Toast = require('../../components/toast/toast');
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");
const Api = require("../../utils/Api.js");
const dotHelper = require("../../pages/me/dotHelper.js");
const app = getApp();
//推荐奖励是否关闭
const shareFlag = app.globalData.shareFlag;
Page({
  data: {
    inviteId: '我是邀请人id',
    userInfo: {},
    myProfile: [
    {
      "desc": "新手教程",
      "id": "teaching",
      'url': 'teaching/teaching',
      "icon": '../../image/tech.png',
      'deposit': 0
    },
    {
      "desc": "注册认证",
      "id": "identity",
      'url': 'auth/auth',
      "icon": '../../image/card.png',
      'deposit': 0
    }],
    total: "0.00",
    amount: '0.00',
    total: '0.00',
    rate: 0,
    stepsList: [],
    showGoodsDetail: false,
    description: '',
    isShowToast: false,
    showSharePop: false,
    //分享朋友圈数据
    shareInfo: {
      shareAvatar: '',
      shareNickname: '',
      awardMoney: '',
      awardType: ''
    },
    showShareModel: false,
    shareFriendType: 'normal',
    positionStatus: 'absolute',
    shareTitle: '',
    showRecommend: false,
    isDiDi: 0  //是否是滴滴车主
  },

  onLoad: function () {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },

  onShow: function () {
    //请求判断是否显示红点
    dotHelper.requestDotStatus();
    var loginFlag = app.globalData.login;
    this.followFlag()
    this.setData({
      loginFlag: loginFlag,
    })
    //是否显示推荐有奖
    this.setData({
      showRecommend: app.globalData.shareFlag
    })

    function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
      }
    }
    wx.request({
      url: app.globalData.baseUrl + 'app/get/account_coupon',
      data: {},
      header: app.globalData.header,
      success: res => {
        wx.stopPullDownRefresh();
        if (res.data.code == 1000) {
          //console.log(res)
          var arr = res.data.data.coupon_info;
          //console.log(arr)
          //type券类型 (1注册券 2邀请券 3广告收益)
          //status 推荐状态 1未激活 2已激活未领取 3已领取 4过期
          var recommendAmount = 0;
          var recommendList = [];
          var recommendHasAward = false;
          //var recommendShow = 1;
          var recommendIdList = [];
          var claimAmoun = 0;
          var stepList = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].type == 2) {//推荐奖励
              recommendList.push(arr[i])
              recommendAmount += Number(arr[i].amount);
              //console.log(arr[i].status)
              if (arr[i].status == 2) {
                recommendHasAward = true;
                recommendIdList.push(arr[i].coupon_id)
                claimAmoun += Number(arr[i].amount)
              }
            } else if (arr[i].type == 1) {//新手礼包
              if (arr[i].status == 1) {
                stepList.push({
                  current: false,
                  text: '新手奖励',
                  desc: '¥ ' + util.toDecimal2(arr[i].amount),
                  hasAward: false,
                  tip: '安装广告后可领取',
                  type: arr[i].type,
                  status: 5,
                  amount: arr[i].amount
                })
              } else if (arr[i].status == 2) {
                stepList.push({
                  current: false,
                  text: '新手奖励',
                  desc: '¥ ' + util.toDecimal2(arr[i].amount),
                  hasAward: true,
                  idList: [arr[i].coupon_id],
                  btnType: 1,
                  action: '领 取',
                  type: arr[i].type,
                  status: 6,
                  amount: arr[i].amount
                })
              }
            } else if (arr[i].type == 3) {//广告收益
              if (arr[i].phase > 0) {
                if (arr[i].status == 1) {
                  stepList.push({
                    current: false,
                    text: '广告任务' + arr[i].phase + '期奖励',
                    desc: '¥ ' + util.toDecimal2(arr[i].amount),
                    hasAward: false,
                    tip: '检测广告后可领取',
                    type: arr[i].type,
                    status: arr[i].status,
                    amount: arr[i].amount
                  })
                } else if (arr[i].status == 2) {
                  stepList.push({
                    current: false,
                    text: '广告任务' + arr[i].phase + '期奖励',
                    desc: '¥ ' + util.toDecimal2(arr[i].amount),
                    hasAward: true,
                    idList: [arr[i].coupon_id],
                    btnType: 1,
                    action: '领 取',
                    type: arr[i].type,
                    status: arr[i].status,
                    amount: arr[i].amount
                  })
                }
              } else {
                if (arr[i].status == 1) {
                  stepList.push({
                    current: false,
                    text: '广告任务奖励',
                    desc: '¥ ' + util.toDecimal2(arr[i].amount),
                    hasAward: false,
                    tip: '检测广告后可领取',
                    type: arr[i].type,
                    status: arr[i].status,
                    amount: arr[i].amount
                  })
                } else if (arr[i].status == 2) {
                  stepList.push({
                    current: false,
                    text: '广告任务奖励',
                    desc: '¥ ' + util.toDecimal2(arr[i].amount),
                    hasAward: true,
                    idList: [arr[i].coupon_id],
                    btnType: 1,
                    action: '领 取',
                    type: arr[i].type,
                    status: arr[i].status,
                    amount: arr[i].amount
                  })
                }
              }
            } else if (arr[i].type == 5) {//安装补贴劵
              if (arr[i].status == 1) {
                stepList.push({
                  current: false,
                  text: '安装补贴奖励',
                  desc: '¥ ' + util.toDecimal2(arr[i].amount),
                  hasAward: false,
                  tip: '检测广告后可领取',
                  type: arr[i].type,
                  status: arr[i].status,
                  amount: arr[i].amount
                })
              } else if (arr[i].status == 2) {
                stepList.push({
                  current: false,
                  text: '安装补贴奖励',
                  desc: '¥ ' + util.toDecimal2(arr[i].amount),
                  hasAward: true,
                  idList: [arr[i].coupon_id],
                  btnType: 1,
                  action: '领 取',
                  type: arr[i].type,
                  status: arr[i].status,
                  amount: arr[i].amount
                })
              }
            } else if (arr[i].type == 6) {//抢活补贴
              if (arr[i].status == 1) {
                stepList.push({
                  current: false,
                  text: '抢活补贴奖励',
                  desc: '¥ ' + util.toDecimal2(arr[i].amount),
                  hasAward: false,
                  tip: '检测广告后可领取',
                  type: arr[i].type,
                  status: arr[i].status,
                  amount: arr[i].amount
                })
              } else if (arr[i].status == 2) {
                stepList.push({
                  current: false,
                  text: '抢活补贴奖励',
                  desc: '¥ ' + util.toDecimal2(arr[i].amount),
                  hasAward: true,
                  idList: [arr[i].coupon_id],
                  btnType: 1,
                  action: '领 取',
                  type: arr[i].type,
                  status: arr[i].status,
                  amount: arr[i].amount
                })
              }
            }
          }
          //console.log(recommendAmount)
          //console.log(stepList)
          //没有推荐奖励信息且推荐开关已开才显示推荐邀请
          if (recommendList.length == 0) {
            if (shareFlag) {
              stepList.push({
                current: false,
                text: '推荐奖励',
                desc: '¥ 0.00',
                hasAward: true,
                btnType: 0,
                action: '邀请好友',
                status: 4
              })
            }
          } else {
            if (recommendHasAward) {
              stepList.push({
                current: false,
                text: '推荐奖励',
                desc: '¥ ' + util.toDecimal2(recommendAmount),
                hasAward: recommendHasAward,
                idList: recommendIdList,
                btnType: 1,
                action: '领 取',
                type: '2',
                status: 4,
                amount: claimAmoun
              })
            } else {
              stepList.push({
                current: false,
                text: '推荐奖励',
                desc: '¥ ' + util.toDecimal2(recommendAmount),
                hasAward: true,
                tip2: '有' + (recommendList.length - recommendIdList.length) + '个好友未安装广告',
                type: '2',
                status: 3,
                amount: claimAmoun,
                action: '邀请好友',
                btnType: 0,
                openType: shareFlag ? '' : 'share'
              })
            }

          }
          //console.log(recommendHasAward)
          //console.log(recommendIdList)
          //console.log(stepList)
          this.setData({
            stepsList: stepList.sort(compare('status'))
          });
          //					console.log(res.data);
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

    wx.request({
      url: app.globalData.baseUrl + 'app/get/account',
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          //console.log(res)
          if (res.data.data != null) {
            this.setData({
              amount: util.toDecimal2(res.data.data.amount),
              total: util.toDecimal2(res.data.data.total_amount),
              rate: (res.data.data.rate) * 100
            });
          }

          //					console.log(res.data);
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

    if (loginFlag == 1) {//登录了
      wx.request({
        url: app.globalData.baseUrl + 'app/get/user_auth_status',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //					console.log(res.data)
            this.setData({
              status: res.data.data.status,
              isDiDi: res.data.data.user_type //是否是滴滴合法车主
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

    }

  },
  loadProfile: function (e) {
    //      console.log(e.target)
  },
  kindToggle: function (e) {
    //		console.log(e);
    var that = this;
    var id = e.currentTarget.id,
      myProfile = this.data.myProfile;
    for (var i = 0, len = myProfile.length; i < len; ++i) {
      if (myProfile[i].id == id) {
        if (i == 1) {
          if (that.data.loginFlag == 1) {
            if (this.data.status == 0) {
              wx.navigateTo({
                url: '../auth/auth'
              })
            } else {
              wx.navigateTo({
                url: '../state/state'
              })
            }
          } else {
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
        } else {
          if (myProfile[i].id == 'address') {
            if (wx.chooseAddress) {
              wx.chooseAddress({
                success: function (res) {
                  wx.switchTab({
                    url: '../me/me'
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
          } else if (myProfile[i].id == 'teaching') {
            wx.navigateTo({
              url: '../teaching/teaching'
            })
          } else if (myProfile[i].id == 'qa') {
            wx.navigateTo({
              url: '../QA/index'
            })
          }
          else {

            if (that.data.loginFlag == 1) {
              wx.navigateTo({
                url: '../' + myProfile[i].url
              })
            } else {
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

          }

        }

      }
    }

    this.setData({
      myProfile: myProfile
    });
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.onShow();

  },
  withdraw: function () {
    var that = this;
    if (that.data.loginFlag == 1) {
      wx.navigateTo({
        url: '../withdraw/withdraw'
      })
    } else {
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
  //分享
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from == 'button' && !res.target.dataset.step) {
      var shareTitle = shareUtil.getShareAwardTitle(that.data.shareInfo.awardMoney, that.data.shareInfo.awardType);
      var adid = -1;
      var adimg = '../../image/share-award.png';
      var desc = '拉上好友一起赚钱～';
      var shareType = Constant.shareAward;
    } else {
      var shareTitle = shareUtil.getShareNormalTitle();
      var adid = -1;
      var adimg = '../../image/share-normal.png';
      var desc = '拉上好友一起赚钱～';
      var shareType = Constant.shareNormal;
    }
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?' + 'user_id=' + app.globalData.uid,
      imageUrl: adimg,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
        that.setData({
          showGoodsDetail: false
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
   * 推荐好友
   */
  recommendFriendListener: function () {
    wx.navigateTo({
      url: '../recommend/recommend?flag=recommend'
    })
  },

  /**
   * 待收收益里面的按钮
   */
  actionClickListener: function (e) {
    var that = this;
    //console.log(e.detail.step)
    if (e.detail.step.btnType == 1) {
      that.coupon(e.detail.step)
    } else {
      wx.navigateTo({
        url: '../recommend/recommend?flag=recommend'
      })
    }
  },

  //查看推荐奖励不可领原因
  goTip: function (e) {
    wx.showModal({
      title: '',
      content: e.detail.step.tip2 + '\r\n好友安装广告后方可领取奖励',
      confirmText: shareFlag ? '查看' : '我知道了',
      cancelText: "取消",
      showCancel: shareFlag,
      cancelColor: '#999',
      success: function (res) {
        if (res.confirm && shareFlag) {
          wx.navigateTo({
            url: '../recommend/recommend?flag=recommend'
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  coupon: function (data) {//领取现金劵
    var that = this;
    var loginFlag = app.globalData.login;
    var couponData = {};
    couponData.coupon_id_list = data.idList;
    var text = "奖励" + data.amount + "元已放入余额里";
    console.log(data.type)
    var couponType = data.type;
    if (loginFlag == 1) {
      wx.request({
        url: app.globalData.baseUrl + 'app/get/collect_account_coupon',
        data: couponData,
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //请求红点状态
            dotHelper.requestDotStatus();
            that.setData({
              shareInfo: {
                shareAvatar: app.globalData.userInfo.avatarUrl,
                shareNickname: app.globalData.userInfo.nickName,
                awardMoney: data.amount,
                awardType: data.type
              },
            })
            that.onShow();
            //分享弹框
            if (couponType != 5 && couponType != 6) {
              that.setData({
                showGoodsDetail: true,
                shareTitle: text, 
                description: shareFlag ? '邀请新用户安装广告，双方还能各拿奖励30元哦!' : '赶快邀请好友一起赚钱'
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
    } else {
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

  /**
   * 领取奖励后分享
   */
  dialogClickListener: function () {
    this.setData({
      showSharePop: true
    })
  },

  shareMomentListener: function () {
    this.setData({
      showShareModel: true
    })
  },

  QAListener: function () {
    wx.navigateTo({
      url: '../QA/index',
    })
  },

  /**
   * 隐藏奖励弹框
   */
  hideDialogListener: function () {
    this.setData({
      showGoodsDetail: false
    })
  },

  showToast(text) {
    console.log(text)
    Toast.setDefaultOptions({
      selector: '#zan-toast-test'
    });
    Toast(text);
  },
  goValuation: function () {
    wx.navigateTo({
      url: '../valuation/valuation',
    })
  }
})