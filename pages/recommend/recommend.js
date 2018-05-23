// pages/recommend/recommend.js
const app = getApp();
const timeUtil = require('../../utils/timeUtil.js');
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");

//活动或者推荐 推荐和活动的页面布局有变化
const FLAG_ARRAY = ['active', 'recommend'];
//二维码地址
const QR_CODE_URL = app.globalData.baseUrl + 'app/get/wx_code';
//推荐地址
const RECOMMEND_URL = app.globalData.baseUrl + 'app/get/recommendation_user';
//领取奖励
const COUPON_URL = app.globalData.baseUrl + 'app/get/collect_account_coupon';
//发送一键邀请通知
const NOTIFY_URL = app.globalData.baseUrl + 'app/send/recommender_notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepsList: [
      {
        current: false,
        done: false,
        text: '分享奔跑宝给好友或朋友圈'
      },
      {
        done: false,
        current: false,
        text: '好友',
        secondText: '从分享链接进入',
        thirdText: '奔跑宝'
      },
      {
        done: false,
        current: false,
        text: '好友首次完成广告安装'
      },
      {
        done: false,
        current: false,
        text: '双方立即获得50元奖励；'
      }
    ],
    //页面状态标识
    pageFlag: true,
    //顶部图片
    topImage: {
      imageHeight: 120,
      imageSrc: 'https://wxapi.benpaobao.com/static/app_img/recommend-icon.png'
    },
    //一键提醒 view 宽度
    remindWidth: 0,
    showRecommendList: true,
    recommendList: [],
    //已激活未领取列表
    unReceiveList: [],
    //累计领取奖励
    totalAword: 0,
    //待领取奖励
    GoatAward: 0,
    //好友全部完成可达奖励
    remainAward: 0,
    //未完成人数
    unfinishedNumber: 0,
    awardBtnAbled: true,
    //二维码 path
    qrPath: null,
    //领奖弹框
    showDialog: false,
    showSharePop: false,

    //分享数据
    shareAvatar: '',
    shareNickname: '',
    showNewShare: false,
    shareId: '',
    shareInfo: {
      shareAvatar: '',
      shareNickname: '',
      awardMoney: '',
      awardType: ''
    },
    showAwardModel: false,
    shareFriendType: 'award',
    shareTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageFlag: options.flag == FLAG_ARRAY[0]
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          topImage: {
            imageHeight: res.windowWidth * 0.34,
            imageSrc: that.data.topImage.imageSrc
          },
          remindWidth: res.windowWidth - 200
        })
      },
    })
    that.setTitle();
    that.setShareInfo();
    that.getRecommendInfo();
  },

  setShareInfo: function () {
    this.setData({
      shareAvatar: app.globalData.userInfo.avatarUrl,
      shareNickname: app.globalData.userInfo.nickName
    })
  },

  getRecommendInfo: function () {
    var that = this;
    wx.request({
      url: RECOMMEND_URL,
      header: app.globalData.header,
      success: function (res) {
        var dataBean = res.data;
        if (dataBean.code == 1000) {
          var recommendInfo = dataBean.data.recommended_info;
          console.log(recommendInfo);
          var tempList = [];
          var tempUnFinishedList = [];
          var tempGoatList = [];
          var totalAward = 0;
          var reachableAward = 0;
          var GoatAward = 0;
          var unFinishNumber = 0;
          for (let recommendBean of recommendInfo) {
            //如果有登记时间，则表示已安装广告
            if (recommendBean.register_date) {
              recommendBean.date = timeUtil.friendly_time(recommendBean.register_date);
              tempList.push(recommendBean);
            } else {
              tempUnFinishedList.push(recommendBean);
            }
            //累计领取奖励
            if (recommendBean.status == 3) {
              totalAward += recommendBean.amount;
            } else if (recommendBean.status == 2) {
              GoatAward += recommendBean.amount;
              tempGoatList.push(recommendBean.coupon_id);
            } else if (recommendBean.status == 1) {
              reachableAward += recommendBean.amount;
              unFinishNumber += 1;
            }
          }
          //数组合并
          tempUnFinishedList = tempUnFinishedList.concat(tempList);

          that.setData({
            recommendList: tempUnFinishedList,
            totalAword: totalAward,
            GoatAward: GoatAward,
            remainAward: reachableAward,
            unfinishedNumber: unFinishNumber,
            unReceiveList: tempGoatList,
            awardBtnAbled: GoatAward == 0 ? false : true,
          })
          console.log('awardBtnAbled----------->' + that.data.awardBtnAbled);
        } else {
          that.showModel(res.data.msg);
        }
      },
      fail: function (res) {
        that.showModel(res.data.msg);
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    })
  },

  setTitle: function () {
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.pageFlag ? '活动详情' : '推荐好友',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 分享到朋友圈
   */
  shareMomentNormalClick: function(){
    this.setData({
      shareFriendType: 'normal'
    })
    this.shareMoments();
  },

  shareMoments: function () {
    if (this.data.shareFriendType == 'award') {
      this.setData({
        showAwardModel: true
      })
    } else if (this.data.shareFriendType == 'normal') {
      this.setData({
        showNewShare: true
      })
    }
  },

  /**
   * 领取奖励
   */
  receiveAwardClick: function () {
    var that = this;
    console.log(that.data.unReceiveList);

    //判断领取状态
    if (!that.data.awardBtnAbled) {
      return;
    }
    if (app.globalData.login == 0) {
      wx.showModal({
        title: '提示',
        content: '登录后可领取奖励',
        confirmText: "登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register',
            })
          }
        }
      })
      return;
    }
    var couponData = {};
    couponData.coupon_id_list = that.data.unReceiveList;
    var text = "奖励" + that.data.GoatAward + "元已放入余额里";
    wx.request({
      url: COUPON_URL,
      data: couponData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          that.setData({
            shareInfo: {
              shareAvatar: app.globalData.userInfo.avatarUrl,
              shareNickname: app.globalData.userInfo.nickName,
              awardMoney: that.data.GoatAward,
              awardType: 2
            },
          })
          //执行分享
          that.setData({
            showDialog: true,
            shareTitle: text
          })
          //重新请求接口
          that.getRecommendInfo();
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

  /**
   * 提醒好友
   */
  remindFriendClick: function () {
    var that = this;
    if (that.data.unfinishedNumber != 0) {
      wx.request({
        url: NOTIFY_URL,
        header: app.globalData.header,
        success: function (res) {
          if (res.data.code == 1000) {
            wx.showToast({
              title: '提醒成功'
            })
          } else {
            that.showModel(res.data.msg);
          }
        },
        fail: function (res) {
          that.showModel(res.data.msg);
        }
      })
    } else {
      that.setData({
        shareFriendType: 'normal',
        showSharePop: true
      })
    }
  },

  showModel: function (tip) {
    wx.showModal({
      title: '提示',
      content: tip,
      showCancel: false
    })
  },

  dialogClickListener: function () {
    this.setData({
      shareFriendType: 'award',
      showSharePop: true
    })
  },

  /**
   * 生成分享图片
   */
  shareMomentListener: function () {
    this.shareMoments();
  },

  showLoadingToast: function () {
    wx.showToast({
      title: '奔跑中...',
      icon: 'loading'
    })
  },

  onPullDownRefresh: function () {
    this.showLoadingToast();
    this.getRecommendInfo();
  },

  /**
   * 点击生成分享图片按钮事件回调，图片保存成功隐藏奖励弹出框
   */
  hideDialogListener: function () {
    console.log('hideDialogListener----------->');
    this.setData({
      showDialog: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log(res);
    if (res.from == 'button' && res.target.dataset.type == 'award') {
      var shareTitle = shareUtil.getShareAwardTitle(that.data.shareInfo.awardMoney, that.data.shareInfo.awardType);
      var adid = -1;
      var adimg = '../../image/share-award.png';
      var desc = "拉上好友一起赚钱～";
      var shareType = Constant.shareAward;
    } else {
      var shareTitle = shareUtil.getShareNormalTitle();
      var adid = -1;
      var adimg = '../../image/share-normal.png';
      var desc = "拉上好友一起赚钱～";
      var shareType = Constant.shareNormal;
    }
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?' + '&user_id=' + app.globalData.uid + '&type=' + shareType,
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
        that.setData({
          showDialog: false
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