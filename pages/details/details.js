const util = require("../../utils/common/util");
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
var formatLocation = util.formatLocation;
var getDistance = util.getDistance;
const app = getApp();
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const viewUtil = require("../../utils/common/viewUtil.js");
const RunStatus = require("../main/runStatus");
const {
  $Toast
} = require('../../components/base/index');

//预约排队状态数组  
const ACTION_ARR = ['not_begin', 'start_subscribe', 'reject_error', 'own_ad', 'queue', 'cancel_queue'];

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
    isTop: false,
    isNeedKey: false,
    showMenu: true,
    istrue: true,
    inviteId: '我是shareInviteId',
    showGoodsDetail: false,
    goHome: false,
    avatarList: [],
    showJoining: false,
    joinCount: 0,
    reward: false,
    showSharePop: false,
    //生成分享图片
    shareAvatar: '',
    shareNickname: '',
    incomeMoney: 0,
    joinNumber: 0,
    joinAvatarList: [],
    adImageUrl: '',
    adName: '',
    adTime: '',
    adId: '',
    serverId: '',
    serverName: '',
    serverAddress: '',
    showShareModel: false,
    showShare: true,
    shareAwardText: '分享',
    isShowLoadingMore: false,
    haveLoca: false,
    isPreview: false,
    showRule: false,
    //是否滴滴合法车主
    isDiDi: 0,
    //地址弹框 start
    showAddressDialog: false,
    address: '',
    phone: '',
    //end
    //注册认证弹窗start
    showAuthDialog: false,
    authStr: '',
    authContent: '',
    authStatus: '',
    //end
    carColor: '', //车身颜色
    showWaiting: false, //排队列表
    queueCount: 0,
    queueList: [],
    //是否正在排队中
    isQueueing: false,
    //预约排队弹窗
    visible: false,
    cancelLoading: false,
    confirmLoading: false,
    designList: [],
    //预约 data
    visibleSubscribe: false,
    selectServerIndex: -1, //默认下标-1，表示未选择服务网点
    selectDateIndex: -1, //默认下标-1，表示未选择日期
    selectTimeIndex: -1, //默认下标-1，表示未选择时间段
    totalCount: 0, //剩余总数
    remainCount: 0, //选择条件过滤后的剩余数
    selectStatusStr: '',
    userCarColor: '', //当前车主的车身颜色
    colorList: [],
    subscribeStation: '',
    subscribeTime: '',
    subscribeAddress: '',
    visibleSubscribeTip: false
  },

  onLoad: function (options) {
    //console.log(options.share);
    var that = this;
    that.setData({
      latitude: null,
      longitude: null,
      adId: options.adId
    })
    if (options.share != undefined) {
      this.setData({
        goHome: true
      })
    }
    app.globalData.shareInviteId = options.inviteId;
    if (app.globalData.isFirst) {
      that.setData({
        reward: true
      })
    }
    app.globalData.isFirst = false;
    that.setScrollHeight();
  },

  setScrollHeight() {
    let that = this;
    let proSystem = new Promise(function (resolve, reject) {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowWidth: res.windowWidth,
            bannerHeight: res.windowWidth * 0.5625
          });
          resolve(res);
        }
      });
    })
    let proTop = new Promise((resolve, reject) => {
      let query = wx.createSelectorQuery();
      //选择id
      query.select('#b-detail-top').boundingClientRect(rect => {
        resolve(rect);
      }).exec();
    });
    let proBottom = new Promise((resolve, reject) => {
      let query = wx.createSelectorQuery();
      //选择id
      query.select('#b-detail-bottom').boundingClientRect(rect => {
        resolve(rect);
      }).exec();
    });
    Promise.all([proSystem, proTop, proBottom]).then(results => {
      that.setData({
        scrollHeight: results[0].windowHeight - results[1].height - results[2].height
      });
    })
  },

  setDesignImageHeight() {
    let that = this;
    viewUtil.getViewHeight("#effect-image").then(rect => {
      that.setData({
        designHeight: rect.width * 9 / 16
      })
    })
  },

  onShow: function (n) {
    var that = this;
    //根据 flag 改变分享文案
    wx.showNavigationBarLoading();
    if (that.data.isPreview) {
      that.setData({
        isPreview: false
      })
      wx.hideNavigationBarLoading()
      return;
    }
    that.setData({
      shareAwardText: app.globalData.shareFlag ? '分享有奖' : '分享',
      showRule: false
    })
    that.initUserAuthStatus();
    that.getLocation();
    //请求广告信息
    that.requestAdInfo();
    that.requestJoinList();
    //that.requestQueueList(); 
    var pages = getCurrentPages();
    console.log(pages)
    var currPage = pages[pages.length - 1]; //当前页面
    if (currPage.data.mydata != undefined) {
      if (currPage.data.mydata.share == 1 && n != 0 && that.data.showShare) {
        that.setData({
          showGoodsDetail: true,
          showShare: false
        })
      } else {
        that.setData({
          showGoodsDetail: false
        })
      }
    }
  },

  initUserAuthStatus() {
    const that = this;
    //注册认证状态
    var loginFlag = app.globalData.login;
    if (loginFlag != 1) { //没有登录
      that.setData({
        loginStaus: 0
      })
    } else { //已登录
      //检测是否是滴滴车主以及注册认证状态
      that.checkUserAuthStatus();
    }
  },

  /** 请求地理位置信息 */
  getLocation() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          haveLoca: true
        })
      }
    })
  },

  checkUserAuthStatus: function () {
    let that = this;
    wx.request({
      url: ApiConst.GET_AUTH_STATUS,
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          that.setData({
            isDiDi: res.data.data.user_type
          })
          let status = res.data.data.status;
          //更新全局认证状态
          app.globalData.checkStaus = status;
          //是否认证
          if (status == 0) {
            that.setData({
              loginStaus: 1 //未认证
            })
          } else if (status == 3) {
            that.setData({
              loginStaus: 3 //已认证
            })
          } else {
            that.setData({
              loginStaus: 2 //认证审核中或者失败
            })
          }
          //未注册和未认证弹框
          if (app.globalData.showAuthTip) {
            return;
          }
          if (that.data.loginStaus == 0 || that.data.loginStaus == 1) {
            that.showRequireAuthDialog(that.data.loginStaus);
            app.globalData.showAuthTip = true;
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

  showRequireAuthDialog: function (loginStatus) {
    this.setData({
      showAuthDialog: true,
      authStr: loginStatus == 0 ? '立即注册' : '立即认证',
      authContent: loginStatus == 0 ? '先注册，抢活快\n广告安装无障碍' : '先认证，抢活快\n广告安装无障碍',
      authStatus: loginStatus
    })
  },

  /**
   * 请求广告信息
   */
  requestAdInfo: function () {
    var that = this;
    wx.request({
      url: ApiConst.GET_AD_INFO,
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        console.log(res.data)
        if (res.data.code == 1000) {
          let dataBean = res.data.data;
          let adTempInfo = dataBean.info;
          adTempInfo.run_status = RunStatus.getRunStatus(adTempInfo);
          adTempInfo.begin_date = adTempInfo.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
          adTempInfo.end_date = adTempInfo.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
          //TODO 广告开放预约时间
          if (adTempInfo.reserve_date.start_date && adTempInfo.reserve_date.last_date) {
            adTempInfo.reserve_date.start_date = adTempInfo.reserve_date.start_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
            adTempInfo.reserve_date.last_date = adTempInfo.reserve_date.last_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
          }
          //预约过滤
          that.resolveAction(dataBean);
          //广告效果图
          dataBean.design_list.forEach(element => {
            let effect_list = [];
            effect_list.push(element.left_img);
            effect_list.push(element.right_img);
            effect_list.push(element.inner_img);
            //过滤空值
            effect_list = effect_list.filter((item) => {
              return Boolean(item.trim()) === true;
            })
            console.log(effect_list);
            element.effect = effect_list;
          })
          that.setData({
            adInfo: adTempInfo,
            designList: dataBean.design_list,
            joinCount: adTempInfo.total_count - adTempInfo.current_count,
            carColor: (!adTempInfo.color_limit || adTempInfo.color_limit.length == 0) ? '不限' : adTempInfo.color_limit.join('、'),
            //isQueueing: dataBean.ad_queue && JSON.stringify(dataBean.ad_queue) != '{}',
            banners: dataBean.design_list.length == 0 ? ['../../image/bpb.png'] : [dataBean.design_list[0].left_img],
            //赋值分享图数据
            shareAvatar: app.globalData.userInfo.avatarUrl,
            shareNickname: app.globalData.userInfo.nickName,
            incomeMoney: adTempInfo.predict_amount,
            adImageUrl: adTempInfo.img_url || "",
            adName: adTempInfo.ad_name,
            adTime: adTempInfo.begin_date + ' ~ ' + adTempInfo.end_date,
            adId: adTempInfo.id,
            joinNumber: adTempInfo.total_count - adTempInfo.current_count
          })
          that.setDesignImageHeight();
          that.getUserCarInfo();
          that.getAdStationList();
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
      },
      complete: res => {
        that.setData({
          isShowLoadingMore: false
        });
        wx.hideNavigationBarLoading()
      }
    })
  },

  /**
   * 处理按钮状态
   */
  resolveAction(dataBean) {
    const that = this;
    if (dataBean.current_reserve || dataBean.current_ad) {
      that.setData({
        actionStr: '查看我的广告',
        actionStatus: ACTION_ARR[3]
      });
    } else {
      //运行状态过滤
      if (dataBean.info.run_status == 1) {
        // 剩余数过滤
        if (dataBean.info.current_count != 0) {
          that.setData({
            actionStr: '立即预约',
            actionStatus: ACTION_ARR[1]
          })
        } else {
          that.setData({
            actionStr: '立即预约',
            actionStatus: ACTION_ARR[2],
            errorComment: '当前广告已被预约完，\n下次记得早点来预约哦~'
          })
        }
      } else if (dataBean.info.run_status == 0) { //即将开始
        that.setData({
          actionStr: '即将开始',
          actionStatus: ACTION_ARR[0]
        })
      } else {
        that.setData({
          actionStr: '查看我的广告',
          actionStatus: ACTION_ARR[3]
        });
      }
    }
  },

  /** 请求已参与车主列表 */
  requestJoinList: function () {
    var that = this;
    wx.request({
      url: ApiConst.AD_JOINED_USER,
      data: {
        ad_id: that.data.adId,
        page_no: 1,
        page_size: 20,
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1000) {
          var dataList = res.data.data.ad_list;
          var tempAvatarList = [];
          for (var key in dataList) {
            var dataBean = dataList[key];
            //过滤没有头像用户
            if (!dataBean.wx_avatar.trim()) {
              dataList.splice(key, 1);
            } else {
              tempAvatarList.push(dataBean.wx_avatar);
            }
          }
          that.setData({
            avatarList: dataList,
            showJoining: dataList.length == 0 ? false : true,
            joinAvatarList: tempAvatarList
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        })
      }
    })
  },

  joinClick: function () {
    var that = this;
    wx.navigateTo({
      url: '../joinList/joinList?adId=' + that.data.adId,
    })
  },

  formSubmit: function (e) {
    var param = e.detail.value;
    this.setData({
      formId: e.detail.formId
    })
    this.receiveAd();
  },
  cancel: function () {
    var that = this;
    var subscribe_id = this.data.selId;
    var reqData = {
      subscribe_id: subscribe_id
    }
    wx.request({
      url: ApiConst.CANCEL_SUBSCRIBE,
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          wx.showToast({
            title: "取消成功"
          })
          that.onShow(0);
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

  arrangement: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      serverId: e.currentTarget.dataset.serverid,
      serverName: e.currentTarget.dataset.servername,
      serverAddress: e.currentTarget.dataset.serveraddress,
    })
    console.log(that.data.serverId)
    if (app.globalData.login == 1) {
      wx.request({
        url: ApiConst.GET_AUTH_STATUS,
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            if (res.data.data.status == 3) {
              if (that.data.isDiDi == 1) {
                that.setData({
                  showRule: true
                })
              } else if (that.data.isDiDi == 1 && !app.globalData.showRuleTip) {
                that.setData({
                  showRule: true
                })
                app.globalData.showRuleTip = true;
              } else {
                wx.navigateTo({
                  url: '../arrangement/arrangement?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
                })
              }
            } else {
              if (res.data.data.status == 2) {
                wx.showModal({
                  title: "提示",
                  content: "你没通过身份认证，不能预约广告",
                  confirmText: "立即认证",
                  cancelText: "取消",
                  success: function (sure) {
                    if (sure.confirm) {
                      wx.navigateTo({
                        url: '../state/state'
                      })
                    }
                  }
                })
              } else if (res.data.data.status == 1) {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: "你的身份认证信息正在审核中，不能预约广告"
                });
              } else {
                wx.showModal({
                  title: "提示",
                  content: "你没进行身份认证，不能预约广告",
                  confirmText: "立即认证",
                  cancelText: "取消",
                  success: function (sure) {
                    if (sure.confirm) {
                      wx.navigateTo({
                        url: '../auth/auth'
                      })
                    }
                  }
                })
              }
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
        content: "你还没有登录，不能预约广告",
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

  goMap: function (e) {
    wx.openLocation({
      longitude: Number(e.currentTarget.dataset.longitude),
      latitude: Number(e.currentTarget.dataset.latitude),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },

  /**
   * 分享
   */
  shareDetailListener: function () {
    this.setData({
      showSharePop: true
    })
  },

  /**
   * 生成图片分享朋友圈
   */
  shareMomentListener: function () {
    this.setData({
      showShareModel: true
    })
  },

  dialogClickListener: function () {
    this.setData({
      showSharePop: true
    })
  },

  //分享
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from == 'button') {
      var shareTitle = shareUtil.getShareAdTitle(that.data.adInfo.name);
      var adid = res.target.dataset.adid;
      var adimg = that.data.adInfo.share_img;
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
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?adId=' + adid + '&user_id=' + app.globalData.uid + '&type=' + shareType,
      imageUrl: adimg,
      success: function (res) {
        setTimeout(function () {
          that.setData({
            showGoodsDetail: false
          })
        }, 1000)
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      },
      fail: function () {
        setTimeout(function () {
          that.setData({
            showGoodsDetail: false
          })
        }, 1000)
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

  /**
   * 隐藏弹框
   */
  hideDialogListener: function () {
    this.setData({
      showGoodsDetail: false
    });
  },

  showGoodsDetail: function () {
    this.setData({
      showGoodsDetail: !this.data.showGoodsDetail
    });
  },

  hideGoodsDetail: function () {
    this.setData({
      showGoodsDetail: false
    });
  },

  goRegister: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  goAuth: function () {
    wx.navigateTo({
      url: '../auth/auth'
    })
  },

  backHome: function () {
    wx.switchTab({
      url: '../main/main'
    })
  },

  showModal: function (msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    })
  },

  previewImage: function (e) {
    console.log(e);
    var that = this;
    let image = e.currentTarget.dataset.image;
    let samllImage = e.currentTarget.dataset.samllimage;
    if (!image || image.indexOf('http') == -1) {
      return;
    }
    wx.previewImage({
      urls: [image],
      complete: function () {
        that.setData({
          isPreview: true
        })
      }
    })
  },

  goValuation: function () {
    wx.navigateTo({
      url: '../valuation/valuation',
    })
  },

  iKnow: function (e) {
    wx.navigateTo({
      url: '../arrangement/arrangement?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },

  goRuleDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../valuation/valuation?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },

  showAddress: function (e) {
    console.log(e);
    this.setData({
      showAddressDialog: true,
      address: e.currentTarget.dataset.address.address,
      phone: e.currentTarget.dataset.address.phone
    })
  },

  handleActionTap: function (event) {
    console.log(event);
    let status = event.detail.data.status;
    if (status == 0) {
      wx.navigateTo({
        url: '../register/register',
      })
    } else if (status == 1) {
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },

  /**
   * 排队列表
   */
  requestQueueList: function () {
    let that = this;
    let dataBean = {
      ad_id: that.data.adId,
      page: 0,
      page_count: 20
    };
    let requestData = {
      url: ApiConst.GET_QUEUE_USER,
      data: dataBean,
      header: app.globalData.header,
      success: res => {
        that.setData({
          queueList: res.users,
          queueCount: res.total_count,
          showWaiting: res.users && res.users.length != 0
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /** 预约排队人数 */
  queueClick: function () {
    let that = this;
    console.log('-----' + that.data.adId);
    wx.navigateTo({
      url: '../subscribeQueue/subscribeQueue?adId=' + that.data.adId
    })
  },

  /**
   * 预约排队
   */
  takeParkInQueue: function () {
    var that = this;
    wx.showLoading({
      title: '奔跑中🚗...',
    })
    let requestData = {
      url: ApiConst.TAKE_PART_IN_QUEUE,
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        that.setData({
          isQueueing: true,
          actionStatus: ACTION_ARR[5],
          actionStr: '取消排队'
        });
        that.setData({
          position: res.position,
          queue_count: res.queue_count,
          serial_number: res.serial_number,
          visible: true
        })
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /** 暂不排队 */
  handleQueueCancel() {
    let that = this;
    that.setData({
      cancelLoading: true
    })
    that.cancelQueueRequest();
  },

  /** 确认排队 */
  handleQueueConfirm() {
    let that = this;
    that.setData({
      visible: false
    });
    that.requestQueueList();
  },

  /** 暂不取消 */
  handleUndoCancel() {
    this.setData({
      visibleUndo: false
    });
  },

  /** 确认取消 */
  handleConfirmCancel() {
    this.setData({
      doLoading: true
    });
    this.cancelQueueRequest();
  },

  /**
   * 取消排队
   */
  cancelQueue: function () {
    var that = this;
    wx.showModal({
      title: '取消确认',
      content: '取消后，需重新参加排队\n您确认取消当前排队吗？',
      confirmText: '确认取消',
      cancelText: '暂不取消',
      success: res => {
        if (res.confirm) {
          that.cancelQueueRequest();
        }
      }
    })
  },

  /**
   * 发起排队请求
   */
  cancelQueueRequest() {
    let that = this;
    let requestData = {
      url: ApiConst.CANCEL_QUEUE,
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        that.setData({
          isQueueing: false,
          actionStatus: ACTION_ARR[4],
          actionStr: '预约排队',
          cancelLoading: false,
          visible: false,
          visibleUndo: false,
          doLoading: false
        });
        $Toast({
          content: '取消成功',
          type: 'success'
        });
        that.requestQueueList();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 车身颜色说明
   */
  handleColorExplain: function () {
    wx.navigateTo({
      url: '../explain/explain?state=2'
    });
  },

  /** 排队说明 */
  handleModelExplain() {
    wx.navigateTo({
      url: '../explain/explain?state=1'
    });
  },

  /** 取消完善年检信息 */
  handleAnnualCancel() {
    this.setData({
      visibleAnnual: false
    })
  },

  /** 保存年检信息 */
  handleAnnualConfirm() {
    //todo 删除测试数据
    let that = this;
    that.setData({
      annualLoading: true
    })
    setTimeout(() => {
      that.setData({
        annualLoading: false,
        visibleAnnual: false
      })
      $Toast({
        content: '选择了' + that.data.selectMonth + '月和' + that.data.selectDay + '日',
        type: 'success'
      })
    }, 1000);
  },

  bindAnnualChange(event) {
    this.setData({
      selectMonth: this.data.months[event.detail.value[0]],
      selectDay: this.data.days[event.detail.value[1]]
    })
  },

  handleAction: function () {
    let that = this;
    switch (that.data.actionStatus) {
      case ACTION_ARR[0]: //即将开始
        //nothing
        break;
      case ACTION_ARR[1]: //立即预约
        that.handleSubscribe();
        break;
      case ACTION_ARR[2]: //不满足广告要求
        that.rejectSubscribe();
        break;
      case ACTION_ARR[3]: //查看我的任务
        wx.switchTab({
          url: '../task/task'
        })
        break;
      case ACTION_ARR[4]: //预约排队
        that.takeParkInQueue();
        break;
      case ACTION_ARR[5]: //取消排队
        that.setData({
          visibleUndo: true,
        })
        break;
    }
  },

  /**
   * 不可预约处理
   */
  rejectSubscribe() {
    const that = this;
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmColor: '#ff555c',
      content: that.data.errorComment
    })
  },

  /** 预览设计效果图 */
  handlePreviewDesign(event) {
    console.log(event);
    let effect = event.currentTarget.dataset.effect;
    if (!effect || effect.length === 0) {
      return;
    }
    wx.previewImage({
      current: event.currentTarget.dataset.current,
      urls: effect
    })
  },

  //todo
  handleAnnual() {
    let months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    let days = [];
    for (let j = 1; j <= 31; j++) {
      days.push(j);
    }
    this.setData({
      visibleAnnual: true,
      months: months,
      days: days,
      selectMonth: months[0],
      selectDay: days[0]
    })
  },

  /**
   * 用户车辆信息
   */
  getUserCarInfo() {
    let that = this;
    let requestData = {
      url: ApiConst.GET_USER_CAR_INFO,
      header: app.globalData.header,
      success: res => {
        //未注册或者未认证
        if (!res) {
          return;
        }
        if (that.data.adInfo.color_limit.indexOf(res.car_color) == -1) {
          that.setData({
            userCarColor: res.car_color,
            actionStatus: ACTION_ARR[2],
            actionStr: '立即预约',
            errorComment: '您的车身颜色为' + res.car_color + ',\n暂不满足广告要求'
          })
        } else {
          that.setData({
            userCarColor: res.car_color
          })
        }
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 获取广告站点列表
   */
  getAdStationList() {
    let that = this;
    let requestData = {
      url: ApiConst.GET_AD_STATION_LIST,
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        //通过可预约数判断是否可点击
        res.forEach(element => {
          element.enable = element.surplus_count != 0
        })
        console.log(res);
        //排序
        res.sort(that.sortRuleOfServer);
        console.log(res);
        that.setData({
          stationList: res
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  sortRuleOfServer(a, b) {
    console.log('a----------->' + a.surplus_count);
    console.log('b----------->' + b.surplus_count);
    return b.surplus_count - a.surplus_count;
  },

  /**
   * 预约剩余数
   */
  changeRemainCount() {
    let that = this;
    let count = 0;
    let stationList = that.data.stationList;
    stationList.forEach(element => {
      count += element.surplus_count;
    });
    that.setData({
      totalCount: count,
      remainCount: count
    })
  },

  handleSubscribe() {
    //验证登录状态
    if(app.globalData.login != 1){
      wx.showModal({
        title: "提示",
        content: "你还没有登录，不能预约广告",
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
    } else {
      this.verifyAuthStatus();
    }
  },

  /**
   * 验证认证状态
   */
  verifyAuthStatus(){
    let authStatus = app.globalData.checkStaus;
    if (authStatus == 2) {
      wx.showModal({
        title: "提示",
        content: "你没通过身份认证，不能预约广告",
        confirmText: "立即认证",
        cancelText: "取消",
        success: function (sure) {
          if (sure.confirm) {
            wx.navigateTo({
              url: '../state/state'
            })
          }
        }
      })
    } else if (authStatus == 1) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "你的身份认证信息正在审核中，不能预约广告"
      });
    } else if(authStatus == 0) {
      wx.showModal({
        title: "提示",
        content: "你没进行身份认证，不能预约广告",
        confirmText: "立即认证",
        cancelText: "取消",
        success: function (sure) {
          if (sure.confirm) {
            wx.navigateTo({
              url: '../auth/auth'
            })
          }
        }
      });
    } else {
      this.setData({
        visibleSubscribe: true,
        colorList: this.data.adInfo.color_limit
      })
      this.initSelectStatus();
      this.changeRemainCount();
    }
  },

  handleSubscribeClose() {
    this.setData({
      visibleSubscribe: false
    })
  },

  /**
   * 选择服务网点
   */
  handleServerClick(event) {
    console.log(event);
    let that = this;
    let index = event.currentTarget.dataset.index;
    //当前站点广告数量不足
    if (!event.currentTarget.dataset.station.enable) {
      return;
    }
    if (that.data.selectServerIndex === -1) { //选中
      that.setData({
        selectServerIndex: index
      })
      that.resetStationCount();
      that.initDateList(index);
    } else { //取消选中
      that.setData({
        selectServerIndex: -1,
        selectDateIndex: -1,
        selectTimeIndex: -1
      })
      that.setRemainCount(that.data.totalCount);
    }
    that.initSelectStatus();
  },

  resetStationCount() {
    let that = this;
    that.setRemainCount(that.data.stationList[that.data.selectServerIndex].surplus_count);
  },

  /** 选中服务网点时初始化日期 */
  initDateList(clickIndex) {
    let dates = this.data.stationList[clickIndex].dates;
    dates.forEach(element => {
      let count = 0;
      element.times.forEach(sub => {
        count += sub.surplus_count;
      });
      element.surplus_count = count;
      element.enable = count != 0;
    })
    this.setData({
      dateList: dates
    })
  },

  /** 更新剩余数量 */
  setRemainCount(count) {
    this.setData({
      remainCount: count
    });
  },

  /** 选择日期 */
  handleDateClick(event) {
    console.log(event);
    let that = this;
    let index = event.currentTarget.dataset.index;
    if (!event.currentTarget.dataset.date.enable) {
      return;
    }
    if (that.data.selectDateIndex === -1) {
      that.setData({
        selectDateIndex: index,
      })
      that.initTimeList();
      // 设置选中日期的剩余数
      that.resetDateCount();
    } else {
      that.setData({
        selectDateIndex: -1,
        selectTimeIndex: -1
      })
      //重置数量
      that.resetStationCount();
    }
    that.initSelectStatus();
  },

  resetDateCount() {
    let that = this;
    that.setRemainCount(that.data.dateList[that.data.selectDateIndex].surplus_count);
  },

  initTimeList() {
    let times = this.data.dateList[this.data.selectDateIndex].times;
    times.forEach(element => {
      element.time = element.begin_time + "-" + element.end_time;
      element.enable = element.surplus_count != 0;
    })
    this.setData({
      timeList: times
    })
  },

  /** 选择时间段 */
  handleTimeClick(event) {
    console.log(event);
    let that = this;
    let index = event.currentTarget.dataset.index;
    let time = event.currentTarget.dataset.time;
    if (!event.currentTarget.dataset.time.enable) {
      return;
    }
    if (that.data.selectTimeIndex === -1) {
      that.setData({
        selectTimeIndex: index
      })
      that.resetTimeCount();
    } else {
      that.setData({
        selectTimeIndex: -1
      })
      that.resetDateCount();
    }
    that.initSelectStatus();
  },

  resetTimeCount() {
    let that = this;
    that.setRemainCount(that.data.timeList[that.data.selectTimeIndex].surplus_count);
  },

  initSelectStatus() {
    let that = this;
    let selectServerIndex = that.data.selectServerIndex;
    let selectDateIndex = that.data.selectDateIndex;
    let selectTimeIndex = that.data.selectTimeIndex;
    let stationList = that.data.stationList;
    let dateList = that.data.dateList;
    let timeList = that.data.timeList;
    if (selectServerIndex !== -1 && selectDateIndex !== -1 && selectTimeIndex !== -1) { //全选
      that.setData({
        selectStatusStr: '已选: ' + "\"" + stationList[selectServerIndex].station_name + "\" " + "\"" + dateList[selectDateIndex].date + "\" " + "\"" + timeList[selectTimeIndex].time + "\" " + "\"" + that.data.userCarColor + "\""
      })
    } else { //有选项未选择
      that.setData({
        selectStatusStr: '请选择 ' + (selectServerIndex !== -1 ? "" : "服务网点 ") + (selectDateIndex !== -1 ? "" : "预约日期 ") + (selectTimeIndex !== -1 ? "" : "预约时间段")
      })
    }
  },

  /** 确认预约 */
  handleConfirmSubscribe() {
    let that = this;
    let selectServerIndex = that.data.selectServerIndex;
    let selectDateIndex = that.data.selectDateIndex;
    let selectTimeIndex = that.data.selectTimeIndex;
    if (selectServerIndex === -1) {
      $Toast({
        content: '请选择 服务网点',
        type: 'warning'
      });
      return;
    }
    if (selectDateIndex === -1) {
      $Toast({
        content: '请选择 预约日期',
        type: 'warning'
      });
      return;
    }
    if (selectTimeIndex === -1) {
      $Toast({
        content: '请选择 预约时间段',
        type: 'warning'
      });
      return;
    }
    that.showSubscribeModal();
  },

  /**
   * 弹框提示
   */
  showSubscribeModal() {
    let that = this;
    that.setData({
      subscribeStation: that.data.stationList[that.data.selectServerIndex].station_name,
      subscribeTime: that.data.dateList[that.data.selectDateIndex].date + ' ' + that.data.timeList[that.data.selectTimeIndex].time,
      subscribeAddress: that.data.stationList[that.data.selectServerIndex].station_address,
      visibleSubscribeTip: true
    })
  },

  /**
   * 发起预约请求
   */
  handleSubscribeRequest(){
    const that = this;
    that.setData({
      confirmSubTipLoading: true
    })
    let requestData = {
      url: ApiConst.UPDATE_USER_RESERVE,
      data: {
        ad_id: that.data.adId,
        station_id: that.data.stationList[that.data.selectServerIndex].station_id,
        time_id: that.data.timeList[that.data.selectTimeIndex].time_id
      },
      header: app.globalData.header,
      success: res => {
        //刷新页面
        that.setData({
          visibleSubscribeTip: false,
          visibleSubscribe: false
        })
        that.requestAdInfo();
        //预约成功跳转我的任务
        that.showWxModalUseConfirm("提示", "预约成功", "查看任务", true, res => {
          wx.navigateTo({
            url: '../task/task'
          })
        });
      },
      complete: res => {
        that.setData({
          confirmSubTipLoading: false
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 微信通用模态弹窗
   * @param {*} title  标题
   * @param {*} content 内容
   * @param {*} confirmText 确认按钮文字
   * @param {*} showCancel 是否显示取消按钮
   */
  showWxModal(title, content, confirmText, showCancel){
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      showCancel: showCancel,
      confirmColor: "#ff555c"
    })
  },

    /**
   * 微信通用模态弹窗
   * @param {*} title  标题
   * @param {*} content 内容
   * @param {*} confirmText 确认按钮文字
   * @param {*} showCancel 是否显示取消按钮
   */
  showWxModalUseConfirm(title, content, confirmText, showCancel, confirmCallback){
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      showCancel: showCancel,
      confirmColor: "#ff555c",
      success: confirmCallback
    })
  },

  /**
   * 暂不预约
   */
  handleSubscribeCancel(){
    const that = this;
    that.setData({
      visibleSubscribeTip: false
    })
  },

  handlePreviewStation(event) {
    const imageUrl = event.currentTarget.dataset.image;
    if (!imageUrl) {
      return;
    }
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [imageUrl],
    })
  }

})