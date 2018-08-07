// pages/recommend/recommend.js
const app = getApp();
const timeUtil = require('../../utils/timeUtil.js');
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");
const dotHelper = require("../../pages/me/dotHelper.js");

//活动或者推荐 推荐和活动的页面布局有变化
//active:活动，recommend:推荐，rule:活动规则，mp:公众号跳转
const FLAG_ARRAY = ['active', 'recommend', 'rule', 'mp'];
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
        text: '分享小程序给好友'
      },
      {
        done: false,
        current: false,
        text: '好友',
        secondText: '从分享链接进入',
        thirdText: '奔跑宝小程序'
      },
      {
        done: false,
        current: false,
        text: '好友注册，首次完成广告安装'
      },
      {
        done: false,
        current: false,
        text: '即可获得',
        secondText: '10元',
        thirdText: '奖励'
      }
    ],
    //页面状态标识
    pageFlag: FLAG_ARRAY[0],
    //顶部图片
    topImage: {
      imageHeight: 120,
      imageSrc: 'https://wxapi.benpaobao.com/static/app_img/recommend-iconV2.png'
    },
    //一键提醒 view 宽度
    remindWidth: 0,
    showRecommendList: true,
    recommendList: [],
    //已激活未领取列表
    unReceiveList: [],
    //累计领取奖励
    totalAword: 0,
    //成功推荐人数
    successRecommendCount: 0,
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
    shareTitle: '',
    //是否是活动规则
    isRule: false,
    //是否是活动详情
    isActive: true,
    //是否是公众号进入，显示回到首页
    showGoHomeBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageFlag: options.flag,
      isRule: options.flag == FLAG_ARRAY[2],
      isActive: options.flag == FLAG_ARRAY[0],
      showGoHomeBtn: options.flag == FLAG_ARRAY[3]
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          remindWidth: res.windowWidth - 200
        });
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#top-image').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          console.log(res)
          that.setData({
            topImage: {
              imageHeight: res[0].width * 0.467,
              imageSrc: that.data.topImage.imageSrc
            },
          })
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
              recommendBean.adStatus = '广告运行中';
              tempList.push(recommendBean);
            } else {
              recommendBean.date = timeUtil.friendly_time(recommendBean.sign_date);
              recommendBean.adStatus = recommendBean.username ? '已注册，未安装广告' : '未注册';
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
            successRecommendCount: tempList.length,
            recommendList: tempUnFinishedList,
            totalAword: totalAward,
            GoatAward: GoatAward,
            remainAward: reachableAward,
            unfinishedNumber: unFinishNumber,
            unReceiveList: tempGoatList,
            awardBtnAbled: GoatAward == 0 ? false : true,
          })
        } else {
          that.showModel(res.data.msg);
        }
      },
      fail: function (res) {
        that.showModel('服务器开小差了~');
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    })
  },

  setTitle: function () {
    var that = this;
    let pageTitle = '';
    if (that.data.pageFlag == FLAG_ARRAY[2]) {
      pageTitle = '活动规则';
    } else if (that.data.pageFlag == FLAG_ARRAY[1]) {
      pageTitle = '推荐有奖';
    } else {
      pageTitle = '推荐有奖';
    }
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 分享
   */
  shareNormalClick: function () {
    this.setData({
      shareFriendType: 'normal'
    })
    this.shareAction();
  },

  shareAction: function () {
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
          //请求红点状态
          dotHelper.requestDotStatus();
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
    if (that.data.unfinishedNumber == 0) {
      return;
    }
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
        that.showModel('服务器开小差了~');
      }
    })
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
  shareListener: function () {
    this.shareAction();
  },

  showLoadingToast: function () {
    wx.showToast({
      title: '奔跑中🚗...',
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
    this.setData({
      showDialog: false
    })
  },

  goHomeListener: function () {
    wx.switchTab({
      url: '../main/main',
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