//main.js
//获取应用实例
var util = require("../../utils/common/util");
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const dotHelper = require("../../pages/me/dotHelper.js");
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require("../../utils/api/ApiManager.js");
const RunStatus = require("../main/runStatus");
const StrategyHelper = require("../../helper/StrategyHelper");
const StringUtil = require("../../utils/string/stringUtil");
const {
  $Toast
} = require('../../components/base/index');
var app = getApp();

Page({
  data: {
    myAd: '',
    adList: '',
    focus: false,
    isShowView: true,
    //测试数据
    userList: [],
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    //是否衔接滑动
    circular: true,
    shareit: false,
    reward: false,
    showRecommend: false,
    shareAwardText: '分享',
    isDiDi: 0, //是否是滴滴车主
    showDialog: false,
    isShowLoadingMore: false,
    showNomore: false,
    //用于上拉加载
    sortedKey: '',
    hasmore: false,
    pageIndex: 0,
    count: 6,
    showShareBtn: false, //隐藏显示分享按钮
    visible: false, //预约确认
    cancelText: '不接受',
    confirmText: '接受',
    title: '预约确认',
    cancelLoading: false,
    confirmLoading: false,
    subsAdName: '',
    subsServerName: '',
    subsServerAddress: '',
    queue_adId: '',
    queue_serverId: ''
  },

  onLoad: function (options) {
    //console.log(options);
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    if (that.data.background.length < 2) {
      that.setData({
        indicatorDots: false
      })
    }
    var loginFlag = app.globalData.login;
    var recomType = app.globalData.recomType;
    var recomAdId = app.globalData.recomAdId;
    var recomId = app.globalData.recomId;
    //recomType 1:拉新 2:奖励 3:广告
    if (recomType == 3) {
      wx.navigateTo({
        url: '../details/details?adId=' + recomAdId
      })
    }
    if (app.globalData.isFirst) {
      that.setData({
        reward: true
      })
    }
    app.globalData.isFirst = false;
    //请求红点状态
    dotHelper.requestDotStatus();
    this.judgeCanIUse();
    this.checkUpdate();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          bannerHeight: res.windowWidth * 0.466666,
          checkImg: res.windowWidth * 0.8,
          checkImg2: res.windowWidth * 0.8 * 0.466667
        })
      }
    })
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
        if (res.SDKVersion >= '1.1.1' && !wx.canIUse('picker.mode.selector')) {
          that.showLowVersionTips();
        }
      },
    })
  },

  showLowVersionTips: function () {
    wx.showModal({
      title: '提示',
      content: '您当前微信版本过低，将导致无法使用部分重要功能，请升级到微信最新版本。',
      showCancel: false,
      success: function (res) {},
    })
  },

  onShow: function () {
    this.commonRequest();
  },

  commonRequest: function () {
    var that = this;
    var loginFlag = app.globalData.login;
    that.followFlag();
    that.getShareFlag();
    //请求车主认证状态
    if (loginFlag == 1) {
      that.getMyAd()
      that.requestAuthStatus();
      //确认排队预约信息 todo 打开
      //z.requestQueueInfo();
    }
    //加载广告列表
    this.setData({
      pageIndex: 0
    })
    this.requestAdList(this.data.pageIndex);
  },

  /**
   * 查询预约排队信息
   */
  requestQueueInfo: function () {
    let that = this;
    let requestData = {
      url: ApiConst.QUERY_QUEUE_INFO,
      data: {},
      header: app.globalData.header,
      success: res => {
        that.setData({
          visible: res,
          subsAdName: '广告名称：' + res.ad_name,
          subsServerName: '网点名称：' + res.server_name,
          subsServerAddress: '网点地址：' + res.address,
          queue_adId: res.ad_id,
          queue_serverId: res.server_id
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 加载广告列表
   */
  requestAdList: function (currentPageIndex) {
    var that = this;
    let reqInfo = {
      page: currentPageIndex,
      page_count: that.data.count
    };
    if (currentPageIndex != 0 && that.data.sorted_key) {
      reqInfo.sorted_key = that.data.sorted_key
    }
    wx.request({
      url: ApiConst.AD_LIST_URL,
      data: reqInfo,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          //更新pageIndex
          that.setData({
            pageIndex: currentPageIndex
          })
          let dataList = res.data.data.ad_list;
          if (dataList.length > 0) {
            for (var i = 0; i < dataList.length; i++) {
              let dataBean = dataList[i];
              dataBean.run_status = RunStatus.getRunStatus(dataBean);
              dataBean.adStatusStr = RunStatus.getAdStatusStr(dataBean);
              dataBean.begin_date = dataBean.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
              dataBean.end_date = dataBean.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
              dataBean.ad_name = StringUtil.formatAdName(dataBean.ad_name, dataBean.city_name);
            }
            if (currentPageIndex != 0) {
              dataList = that.data.adList.concat(dataList);
            }
            that.setData({
              adList: dataList,
              showNomore: !res.data.data.hasMore,
              hasmore: res.data.data.hasMore,
              sorted_key: res.data.data.sortedKey
            })
          } else {
            that.setData({
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
      },
      complete: res => {
        wx.stopPullDownRefresh();
        that.setData({
          isShowLoadingMore: false
        });
      }
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.commonRequest();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.hasmore || that.data.isShowLoadingMore) {
      return;
    }
    that.setData({
      isShowLoadingMore: true
    });
    setTimeout(function () {
      that.requestAdList(that.data.pageIndex + 1);
    }, 1000);
  },

  requestAuthStatus() {
    let that = this;
    let requestData = {
      url: ApiConst.GET_AUTH_STATUS,
      data: {},
      success: res => {
        that.setData({
          status: res.status,
          name: res.real_name,
          province: res.province,
          city: res.city,
          plate_no: res.plate_no,
          isDiDi: res.user_type //是否是滴滴车主
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  getMyAd() {
    var z = this;
    wx.request({
      url: ApiConst.MY_AD,
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          let dataEntity = res.data.data;
          if (dataEntity != null) {
            if (dataEntity.subscribe != null && dataEntity.check == null) {
              dataEntity.subscribe.date = dataEntity.subscribe.date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
            }
            dataEntity.begin_date = dataEntity.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            dataEntity.end_date = dataEntity.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            dataEntity.ad_name = StringUtil.formatAdName(dataEntity.ad_name, dataEntity.city_name);
            if (dataEntity.check != null) {
              dataEntity.check.checkDate = dataEntity.check.checkDate.replace(/(.+?)\-(.+?)\-(.+)/, "$1年$2月$3日");
            }
            dataEntity.taskDesc = StrategyHelper.getMyTaskDesc(dataEntity);
            dataEntity.taskStatus = StrategyHelper.getTaskStatusStr(StrategyHelper.getCurrentStatus(dataEntity));
            z.setData({
              myAd: dataEntity
            })
          } else {
            z.setData({
              myAd: null
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
  },

  /**
   * 广告详情
   */
  go: function (event) {
    //		console.log(event)
    var adId = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../details/details?adId=' + adId
    })
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from == 'button') {
      console.log(res);
      var shareTitle = shareUtil.getShareAdTitle(res.target.dataset.adname);
      var adid = res.target.dataset.adid;
      var adimg = res.target.dataset.adimg;
      var desc = '全新广告，躺着赚钱，速速来抢～';
      var shareType = Constant.shareAd;
    }
    if (res.from == 'menu') {
      var shareTitle = shareUtil.getShareNormalTitle();
      var adid = -1;
      var adimg = '../../image/share-normal.png';
      var desc = '拉上好友一起赚钱～';
      var shareType = Constant.shareNormal;
    }
    console.log(res);
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?adId=' + adid + '&user_id=' + app.globalData.uid + '&type=' + shareType,
      imageUrl: adimg,
      success: function (res) {
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

  selCheck: function (e) {
    this.setData({
      showDialog: true,
      srver_longitude: Number(e.currentTarget.dataset.longitude),
      srver_latitude: Number(e.currentTarget.dataset.latitude),
      srver_name: e.currentTarget.dataset.name,
      srver_address: e.currentTarget.dataset.address
    })
  },
  
  severCheck: function () {
    var that = this;
    wx.openLocation({
      longitude: Number(that.data.srver_longitude),
      latitude: Number(that.data.srver_latitude),
      name: that.data.srver_name,
      address: that.data.srver_address
    })
    that.setData({
      showDialog: false
    })
  },

  tapName: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.hi)
    if (event.currentTarget.dataset.hi == 'banner1') {
      wx.navigateTo({
        url: '../teaching/teaching',
      })
    } else if (event.currentTarget.dataset.hi == 'banner2') {
      //活动详情页
      that.skipRecommend();
    } else if (event.currentTarget.dataset.hi == 'banner3') {
      wx.navigateTo({
        url: '../valuation/valuation',
      })
    }
  },

  hideShare: function () {
    var that = this;
    that.setData({
      shareit: false
    })
  },

  followFlag: function () { //查询是否关注公众号
    var that = this
    let requestData = {
      url: ApiConst.USER_HAS_SUBCRIBE,
      data: {},
      success: res => {
        that.setData({
          isFollow: res
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 查询是否显示推荐相关
   */
  getShareFlag: function () {
    var that = this;
    let requestData = {
      url: ApiConst.GET_SHARE_FLAG,
      data: {},
      success: res => {
        app.globalData.shareFlag = res;
        const totalBanner = ['banner1', 'banner2'];
        const singleBanner = ['banner1'];
        that.setData({
          showRecommend: res,
          background: res ? totalBanner : singleBanner,
          shareAwardText: res ? '分享有奖' : '分享',
        })
        that.setData({
          indicatorDots: that.data.background.length > 1
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 版本更新
   */
  checkUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
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

  recommendClick: function () {
    this.skipRecommend();
  },

  skipRecommend: function () {
    wx.navigateTo({
      url: '../recommend/recommend?flag=active',
    })
  },
  hideDialog: function () {
    this.setData({
      showDialog: false
    })
  },

  /**
   * 接受预约安排
   */
  handleConfirm() {
    let that = this;
    that.setData({
      confirmLoading: true
    });
    setTimeout(function () {
      let requestData = {
        url: ApiConst.CONFIRM_SUBS_QUEUE,
        data: {},
        header: app.globalData.header,
        success: res => {
          //TODO 跳转到预约页面

        },
        complete: res => {
          that.setData({
            visible: false,
            confirmLoading: false
          });
        }
      }
      ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
    }, 1000);
  },

  /**
   * 不接受预约安排
   */
  handleCancel() {
    let that = this;
    that.setData({
      cancelLoading: true
    });
    setTimeout(function () {
      let requestData = {
        url: ApiConst.REGUSE_SUBS_QUEUE,
        data: {},
        header: app.globalData.header,
        success: res => {
          $Toast({
            content: '你拒绝了预约安排',
            type: 'success'
          });
        },
        complete: res => {
          that.setData({
            visible: false,
            cancelLoading: false
          });
        }
      }
      ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
    }, 1000);
  },

  handleGoTask() {
    wx.switchTab({
      url: '../task/task'
    })
  }

})