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
    background: ['banner3', 'banner1', 'banner2'],
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
    bannerFlag: 0,
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

  onLoad: function(options) {
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
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          bannerHeight: res.windowWidth * 0.466666,
          checkImg: res.windowWidth * 0.8,
          checkImg2: res.windowWidth * 0.8 * 0.466667
        })
      }
    })
    //获取用户是否需要补充车型信息
    this.judgeNeedAddCarModel();
  },

  judgeNeedAddCarModel: function() {
    let requestData = {
      url: ApiConst.NEED_ADD_CAR_MODEL,
      data: {},
      header: app.globalData.header,
      success: res => {
        console.log(res);
        //需要补充车型信息
        app.globalData.needAddCarModel = res;
        if (res) {
          wx.showModal({
            title: '车型补充提示',
            content: '为了保证广告安装和广告计费正常进行，需要您补充完善车型信息',
            showCancel: false,
            confirmText: '立即补充',
            confirmColor: '#ff555c',
            success: res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../brandList/brandList?flag=1',
                })
              }
            }
          })
        }
      }
    };
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 判断 微信版本 兼容性
   */
  judgeCanIUse: function() {
    var that = this;
    //组件不兼容
    //微信版本过低
    wx.getSystemInfo({
      success: function(res) {
        if (res.SDKVersion >= '1.1.1' && !wx.canIUse('picker.mode.selector')) {
          that.showLowVersionTips();
        }
      },
    })
  },

  showLowVersionTips: function() {
    wx.showModal({
      title: '提示',
      content: '您当前微信版本过低，将导致无法使用部分重要功能，请升级到微信最新版本。',
      showCancel: false,
      success: function(res) {},
    })
  },

  onShow: function() {
    this.commonRequest();
  },

  commonRequest: function() {
    var z = this;
    var loginFlag = app.globalData.login;
    var reqData = {};
    z.followFlag();
    z.getShareFlag();
    //请求定位信息
    z.getLocation(loginFlag, reqData);
    //请求车主认证状态
    if (loginFlag == 1) {
      z.requestAuthStatus(reqData);
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
  requestQueueInfo: function() {
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
  requestAdList: function(currentPageIndex) {
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
          var nowdate = util.dateToString(new Date());
          let dataList = res.data.data.ad_list;
          if (dataList.length > 0) {
            //0:即将开始 1:剩余27(表示预约中的状态） 2投放中 3检测中 4已结束
            for (var i = 0; i < dataList.length; i++) {
              let dataBean = dataList[i];
              dataBean.run_status = RunStatus.getRunStatus(dataBean);
              dataBean.begin_date = dataBean.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
              dataBean.end_date = dataBean.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
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

  onPullDownRefresh: function() {
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.commonRequest();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (!that.data.hasmore || that.data.isShowLoadingMore) {
      return;
    }
    //this.showLoadingToast();
    that.setData({
      isShowLoadingMore: true
    });
    setTimeout(function() {
      that.requestAdList(that.data.pageIndex + 1);
    }, 1000);
  },

  getLocation: function(loginFlag, reqData) {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //        console.log(res.longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        reqData.lat = latitude;
        reqData.lng = longitude;
        if (loginFlag == 1) {
          that.getMyAd(reqData)
        }
      }
    })
  },

  requestAuthStatus: function(reqData) {
    let z = this;
    wx.request({
      url: ApiConst.GET_AUTH_STATUS,
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          //					console.log(res.data)
          z.setData({
            bannerFlag: z.data.bannerFlag + 1,
            status: res.data.data.status,
            name: res.data.data.real_name,
            province: res.data.data.province,
            city: res.data.data.city,
            plate_no: res.data.data.plate_no,
            isDiDi: res.data.data.user_type //是否是滴滴车主
          })
          //if (z.data.bannerFlag==2&&)
          //console.log(z.data.bannerFlag);
          if (z.data.bannerFlag == 2) {
            if (z.data.showRecommend) { //可以显示推荐朋友圈
              if (z.data.isDiDi == 1) { //滴滴合法车主
                z.setData({
                  background: ['banner3', 'banner1', 'banner2']
                })
              } else { //不是滴滴合法车主
                z.setData({
                  background: ['banner1', 'banner2']
                })
              }
            } else { //不显示推荐朋友圈
              if (z.data.isDiDi == 1) { //滴滴合法车主
                z.setData({
                  background: ['banner3', 'banner1']
                })
              } else { //不是滴滴合法车主
                z.setData({
                  background: ['banner1']
                })
              }
            }
            z.setData({
              bannerFlag: 0
            })
          }
          z.setData({
            indicatorDots: z.data.background.length > 1
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
    if (z.data.latitude == null) {
      z.getMyAd(reqData);
    } else {
      reqData.lat = z.data.latitude;
      reqData.lng = z.data.longitude;
      z.getMyAd(reqData);
    }
  },

  getMyAd: function(reqData) {
    var z = this;
    wx.request({
      url: ApiConst.MY_AD,
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data != null) {
            var nowdate = util.dateToString(new Date());
            if (res.data.data.subscribe != null && res.data.data.check == null) {
              res.data.data.subscribe.date = res.data.data.subscribe.date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
            }
            res.data.data.begin_date = res.data.data.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            res.data.data.end_date = res.data.data.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            if (res.data.data.check != null) {
              res.data.data.check.checkDate = res.data.data.check.checkDate.replace(/(.+?)\-(.+?)\-(.+)/, "$1年$2月$3日");
            }
            var myad = res.data.data;
            myad.taskDesc = StrategyHelper.getMyTaskDesc(myad);
            myad.taskStatus = StrategyHelper.getTaskStatusStr(StrategyHelper.getCurrentStatus(myad));
            z.setData({
              myAd: myad
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
  go: function(event) {
    //		console.log(event)
    var adId = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../details/details?adId=' + adId
    })
  },

  //分享
  onShareAppMessage: function(res) {
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
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      },
      fail: function() {
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

  goMap: function(e) {
    //		console.log(e.currentTarget.dataset);
    wx.openLocation({
      longitude: Number(e.currentTarget.dataset.longitude),
      latitude: Number(e.currentTarget.dataset.latitude),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },


  selCheck: function(e) {
    this.setData({
      showDialog: true,
      srver_longitude: Number(e.currentTarget.dataset.longitude),
      srver_latitude: Number(e.currentTarget.dataset.latitude),
      srver_name: e.currentTarget.dataset.name,
      srver_address: e.currentTarget.dataset.address
    })
  },
  severCheck: function() {
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
  
  tapName: function(event) {
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
  hideShare: function() {
    var that = this;
    that.setData({
      shareit: false
    })
  },
  followFlag: function() { //查询是否关注公众号
    var that = this
    wx.request({
      url: ApiConst.USER_HAS_SUBCRIBE,
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
   * 查询是否显示朋友圈
   */
  getShareFlag: function() {
    var that = this;
    wx.request({
      url: ApiConst.GET_SHARE_FLAG,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          app.globalData.shareFlag = res.data.data;
          that.setData({
            bannerFlag: that.data.bannerFlag + 1,
            showRecommend: res.data.data,
            background: res.data.data ? ['banner1', 'banner2'] : ['banner1'],
            shareAwardText: res.data.data ? '分享有奖' : '分享',
          })
          //console.log(that.data.bannerFlag);
          if (that.data.bannerFlag == 2) {
            if (that.data.showRecommend) { //可以显示推荐朋友圈
              if (that.data.isDiDi == 1) { //滴滴合法车主
                that.setData({
                  background: ['banner3', 'banner1', 'banner2']
                })
              } else { //不是滴滴合法车主
                that.setData({
                  background: ['banner1', 'banner2']
                })
              }
            } else { //不显示推荐朋友圈
              if (that.data.isDiDi == 1) { //滴滴合法车主
                that.setData({
                  background: ['banner3', 'banner1']
                })
              } else { //不是滴滴合法车主
                that.setData({
                  background: ['banner1']
                })
              }
            }
            that.setData({
              bannerFlag: 0
            })
          }
          that.setData({
            indicatorDots: that.data.background.length > 1
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
  },

  /**
   * 版本更新
   */
  checkUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
      })

      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，即刻体验？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      })

      updateManager.onUpdateFailed(function() {
        // 新的版本下载失败
      })
    }
  },

  recommendClick: function() {
    this.skipRecommend();
  },

  skipRecommend: function() {
    wx.navigateTo({
      url: '../recommend/recommend?flag=active',
    })
  },
  hideDialog: function() {
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
    setTimeout(function() {
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
    setTimeout(function() {
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

  handleGoTask(){
    wx.switchTab({
      url: '../task/task'
    })
  }

})