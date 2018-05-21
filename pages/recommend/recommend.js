// pages/recommend/recommend.js
const app = getApp();
const timeUtil = require('../../utils/timeUtil.js');
const Constant = require("../../utils/Constant.js");

//活动或者推荐 推荐和活动的页面布局有变化
const FLAG_ARRAY = ['active', 'recommend'];
//二维码地址
const QR_CODE_URL = app.globalData.baseUrl + 'app/get/wx_code';
//推荐地址
const RECOMMEND_URL = app.globalData.baseUrl + 'app/get/recommendation_user';
//领取奖励
const COUPON_URL = app.globalData.baseUrl + 'app/get/collect_account_coupon';

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
      imageSrc: 'http://img4.imgtn.bdimg.com/it/u=3075400102,2168157850&fm=27&gp=0.jpg'
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
    remindBtnAbled: true,
    //二维码 path
    qrPath: null,
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
    showAwardModel: false
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

  setShareInfo: function(){
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
          var tempGoatList= [];
          var totalAward = 0;
          var reachableAward = 0;
          var GoatAward = 0;
          var unFinishNumber = 0;
          for (let recommendBean of recommendInfo) {
            //如果有登记时间，则表示已安装广告
            if (recommendBean.register_date) {
              recommendBean.register_date = timeUtil.friendly_time(recommendBean.register_date);
              tempList.push(recommendBean);
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
          
          that.setData({
            recommendList: tempList,
            totalAword: totalAward,
            GoatAward: GoatAward,
            remainAward: reachableAward,
            unfinishedNumber: unFinishNumber,
            unReceiveList: tempGoatList,
            awardBtnAbled: GoatAward == 0 ? false : true,
            remindBtnAbled: unFinishNumber == 0 ? false : true
          })
          console.log('awardBtnAbled----------->' + that.data.awardBtnAbled);
        } else {
          that.showModel(res.data.msg);
        }
      },
      fail: function (res) {
        that.showModel(res.data.msg);
      },
      complete: function(){
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
  shareMoments: function () {
    this.setData({
      showNewShare: true
    })
  },

  /**
   * 领取奖励
   */
  receiveAwardClick: function () {
    var that = this;
    console.log(that.data.unReceiveList);
    if (!that.data.awardBtnAbled){
      return;
    }
    var couponData = {};
    couponData.coupon_id_list = that.data.unReceiveList;
    var text = "恭喜！你的奖励" + that.data.GoatAward + "元已放入余额账户里";
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
              awardMoney: data.amount,
              awardType: 2
            },
          })
          //重新请求接口
          that.getRecommendInfo();
          that.showToast(text)
          //执行分享
          setTimeout(function () {
            that.setData({
              showDialog: true
            })
          }, 1500)
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
    if (!that.data.remindBtnAbled){
      return;
    }
    that.setData({
      showSharePop: true
    })
    wx.showToast({
      title: '✌️邀请成功',
    })
  },

  showModel: function (tip) {
    wx.showModal({
      title: '提示',
      content: tip,
    })
  },

  dialogClickListener: function () {
    this.setData({
      showSharePop: true
    })
  },

  /**
   * 生成分享图片
   */
  shareMomentListener: function () {
    this.shareMoments();
  },

  showLoadingToast: function(){
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res);
    if (res.from == 'button' && res.target.dataset.type == 'award') {
      var shareTitle = '奔跑宝，私家车广告平台';
      var adid = -1;
      var adimg = '../../image/bpbimg.jpg';
      var desc = '拉上好友一起赚钱～';
      var shareType = Constant.shareAward;
    } else {
      var shareTitle = '奔跑宝，私家车广告平台';
      var adid = -1;
      var adimg = '../../image/bpbimg.jpg';
      var desc = '拉上好友一起赚钱～';
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