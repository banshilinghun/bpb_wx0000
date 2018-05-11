// pages/recommend/recommend.js
const app =  getApp();
const timeUtil = require('../../utils/timeUtil.js');

//活动或者推荐 推荐和活动的页面布局有变化
const FLAG_ARRAY = ['active', 'recommend'];
//二维码地址
const QR_CODE_URL = app.globalData.baseUrl + 'app/get/wx_code';
//推荐地址
const RECOMMEND_URL = app.globalData.baseUrl + 'app/get/recommendation_user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面状态标识
    pageFlag: true,
    banner:{
      bannerHeight: 200,
      bannerWidth: 375,
      bannerList: [],
      showBanner: false
    },
    //顶部图片
    topImage: {
      imageHeight: 200,
      imageSrc: 'https://images.unsplash.com/photo-1447829172150-e5deb8972256?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7c59a29e62ac65aa6e7f7aefaf296265&auto=format&fit=crop&w=2110&q=80'
    },
    //一键提醒 view 宽度
    remindWidth: 0,
    showRecommendList: true,
    recommendList: [{
      nickname: '正🌲',
      adStatus: '已安装广告',
      time: '两天前'
    }, {
      nickname: '粉丝',
      adStatus: '已安装广告',
      time: '两天前'
      }, {
        nickname: 'ken',
        adStatus: '已安装广告',
        time: '两天前'
      }],
    //累计领取奖励
    totalAword: 0,
    //待领取奖励
    GoatAward: 0,
    //好友全部完成可达奖励
    remainAward: 0,
    //未完成人数
    unfinishedNumber: 0,
    //二维码 path
    qrPath: null,
    showDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('flag------------>' + options.flag);
    that.setData({
      pageFlag: options.flag == FLAG_ARRAY[0]
    })
    console.log('pageFlag------------>' + that.data.pageFlag);
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          topImage: {
            imageHeight: res.windowWidth / 2,
            imageSrc: that.data.topImage.imageSrc
          },
          remindWidth: res.windowWidth - 160
        })
      },
    })
    that.setTitle();
    that.getRecommendInfo();
  },

  getRecommendInfo: function(){
    var that = this; 
    console.log('recommendInfo------------->');
    wx.request({
      url: RECOMMEND_URL,
      header: app.globalData.header,
      success: function(res){
        var dataBean = res.data;
        if (dataBean.code == 1000){
          var recommendInfo = dataBean.data.recommended_info;
          console.log(recommendInfo);
          var tempList = [];
          var totalAward = 0;
          var reachableAward = 0;
          var GoatAward = 0;
          var unFinishNumber = 0;
          for(let recommendBean of recommendInfo){
            //如果有登记时间，则表示已安装广告
            if (recommendBean.register_date) {
              recommendBean.register_date = timeUtil.friendly_time(recommendBean.register_date);
              tempList.push(recommendBean);
            }
            //累计领取奖励
            if (recommendBean.status == 3){
              totalAward += recommendBean.amount;
            } else if(recommendBean.status == 2){
              GoatAward += recommendBean.amount;
            } else if (recommendBean.status == 1){
              reachableAward += recommendBean.amount;
              unFinishNumber += 1;
            }
          }
          that.setData({
            recommendList: tempList,
            totalAword: totalAward,
            GoatAward: GoatAward,
            remainAward: reachableAward,
            unfinishedNumber: unFinishNumber
          })
        }else{
          that.showModel(res.data.msg);
        }
      },
      fail: function(res){
        that.showModel(res.data.msg);
      }
    })
  },

  setTitle: function(){
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.pageFlag == FLAG_ARRAY[0] ? '活动详情' : '推荐好友',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 分享到朋友圈
   */
  shareMoments: function(){
    wx.showToast({
      title: '✌️分享成功',
    });
    this.getQrCode();
  },

  /**
   * 请求二维码图片
   */
  getQrCode: function(){
    var that = this;
    wx.request({
      url: QR_CODE_URL,
      header: app.globalData.header,
      data: {
        scene: 'id=1',
        page: 'pages/index/index'
      },
      success: function(res){
        console.log(res);
        that.downloadQrCode(res.data.data.img_url);
      },
      fail: function(res){
        that.showModel(res.data.msg);
      }
    })
  },

  /**
   * 下载二维码到本地
   */
  downloadQrCode: function(imageUrl){
    console.log(imageUrl);
    var that = this;
    wx.downloadFile({
      url: imageUrl,
      success: function(res){
        console.log(res.tempFilePath);
        that.setData({
          qrPath: res.tempFilePath
        })
      }
    })
  },

  previewImage: function(){
    var that = this;
    wx.previewImage({
      urls: [that.data.topImage.imageSrc]
    })
  },

  /**
   * 领取奖励
   */
  receiveAwardClick: function(){
    wx.showToast({
      title: '✌️领取成功',
    })
  },

  /**
   * 提醒好友
   */
  remindFriendClick: function(){
    // wx.showToast({
    //   title: '✌️提醒成功',
    // })
    console.log('remindFriendClick------------>')
    this.setData({
      showDialog: true
    })
  },

  showModel: function(tip){
    wx.showModal({
      title: '提示',
      content: tip,
    })
  },

  dialogClickListener: function(){
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})