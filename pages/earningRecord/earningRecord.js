// 收益记录

const ApiConst = require("../../utils/api/ApiConst.js");
var util = require("../../utils/common/util");
const dotHelper = require("../../pages/me/dotHelper.js");
const Constant = require("../../utils/constant/Constant.js");
const shareUtil = require("../../utils/module/shareUtil");
const { $Toast } = require('../../components/base/index');
const app = getApp();
//推荐奖励是否关闭
let shareFlag;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepsList: [],
    scrollHeight: 0,
    count: 30,
    totalMoney: 100,
    titleArray: ['收益时间', '收益金额', '收益来源'],
    earningRecords: [],
    //分享朋友圈数据
    shareInfo: {
      shareAvatar: '',
      shareNickname: '',
      awardMoney: '',
      awardType: ''
    },
    showGoodsDetail: false,
    shareTitle: '',
    description: '',
    showShareModel: false,
    showSharePop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //设置 scrollView 高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 60
        })
      },
    })
  },

  onShow: function () {
    let that = this;
    shareFlag = app.globalData.shareFlag;
    shareFlag = true;
    that.requestAccountCoupon();
  },

  /**
   * 请求可领取奖励详情
   */
  requestAccountCoupon() {
    let that = this;
    function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
      }
    }
    wx.request({
      url: ApiConst.ACCOUNT_COUPON,
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
            if (arr[i].type == 2) { //推荐奖励
              recommendList.push(arr[i])
              recommendAmount += Number(arr[i].amount);
              //console.log(arr[i].status)
              if (arr[i].status == 2) {
                recommendHasAward = true;
                recommendIdList.push(arr[i].coupon_id)
                claimAmoun += Number(arr[i].amount)
              }
            } else if (arr[i].type == 1) { //新手礼包
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
            } else if (arr[i].type == 3) { //广告收益
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
            } else if (arr[i].type == 5) { //安装补贴劵
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
            } else if (arr[i].type == 6) { //抢活补贴
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
          that.setData({
            stepsList: stepList.sort(compare('status'))
          });
        } else {
          that.showModal(res.data.msg);
        }
      },
      fail: res => {
        wx.stopPullDownRefresh();
        that.showModal('网络错误');
      }
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

  /**
   * 查看推荐奖励不可领原因
   */
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
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  /**
   * 领取现金劵
   */
  coupon: function (data) {
    var that = this;
    var loginFlag = app.globalData.login;
    var couponData = {};
    couponData.coupon_id_list = data.idList;
    var text = "奖励" + data.amount + "元已放入余额里";
    console.log(data.type)
    var couponType = data.type;
    if (loginFlag == 1) {
      wx.request({
        url: ApiConst.COLLECT_ACCOUNT_COUPON,
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
                description: shareFlag ? '邀请新用户安装广告，还能拿奖励10元哦!' : '赶快邀请好友一起赚钱！'
              })
            } else {
              $Toast({
                content: '领取成功',
                type: 'success'
              });
            }
          } else {
            that.showModel(res.data.msg);
          }
        },
        fail: res => {
          that.showModal('网络错误');
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

  /**
   * 隐藏奖励弹框
   */
  hideDialogListener: function () {
    this.setData({
      showGoodsDetail: false
    })
  },

  /**
   * 朋友圈分享
   */
  shareMomentListener: function () {
    this.setData({
      showShareModel: true
    })
  },

  showModel(msg) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: msg
    });
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
  }

})