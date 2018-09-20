const util = require("../../utils/common/util");
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const app = getApp();
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const LoadingHelper = require("../../helper/LoadingHelper");
const ModalHelper = require("../../helper/ModalHelper");
const RunStatus = require("../main/runStatus");
const TimeUtil = require("../../utils/time/timeUtil");
const StringUtil = require("../../utils/string/stringUtil");
const {
  $Toast
} = require('../../components/base/index');

//记录请求广告信息loading加载状态，只在第一次请求时显示
let loadingFirst = true;

Page({
  data: {
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
    isDiDi: false,
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
    visibleSubscribeTip: false,
    isIpx: false,
    visibleRequire: false
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      latitude: null,
      longitude: null,
      adId: options.adId,
      isIpx: app.globalData.isIpx
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
    that.getLocation();
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
    //请求广告信息
    that.requestDetail();
    that.requestJoinList();
    //that.requestQueueList(); 
    var pages = getCurrentPages();
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
      //如果没有登录直接渲染完视图计算顶部高度
      that.setScrollHeight();
      //未注册和未认证弹框
      that.showRequireAuthDialog(that.data.loginStaus);
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
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          haveLoca: true
        })
      },
      complete: res => {
        that.getAdStationList();
      }
    })
  },

  checkUserAuthStatus: function () {
    let that = this;
    let requestData = {
      url: ApiConst.GET_AUTH_STATUS,
      data: {},
      success: res => {
        that.setData({
          isDiDi: parseInt(res.user_type) === 1
        })
        let status = res.status;
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
        //在认证状态请求完之后才能渲染完视图计算顶部高度
        that.setScrollHeight();
        //未注册和未认证弹框
        that.showRequireAuthDialog(that.data.loginStaus);
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 计算滚动区域高度
   */
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

  showRequireAuthDialog: function (loginStatus) {
    const that = this;
    if (app.globalData.showAuthTip) {
      return;
    }
    if (that.data.loginStaus == 0 || that.data.loginStaus == 1) {
      that.setData({
        showAuthDialog: true,
        authModal: {
          authStr: loginStatus == 0 ? '立即注册' : '立即认证',
          title: '注册认证',
          authContent: loginStatus == 0 ? '先注册，抢活快\n广告安装无障碍' : '先认证，抢活快\n广告安装无障碍',
          authStatus: loginStatus,
          src: 'https://wxapi.benpaobao.com/static/app_img/auth-icon.png'
        }
      })
      app.globalData.showAuthTip = true;
    }
  },

  requestDetail() {
    const that = this;
    let proAdInfo = new Promise((resolve, reject) => {
      that.requestAdInfo(resolve);
    });
    let proUserInfo = new Promise((resolve, reject) => {
      that.getUserCarInfo(resolve);
    });
    Promise.all([proAdInfo, proUserInfo]).then(results => {
      that.initAdInfo(results[0]);
      that.initUserInfo(results[1]);
      //处理预约按钮状态
      that.resolveAction(results[0], results[1]);
    })
  },

  /**
   * 请求广告信息
   */
  requestAdInfo: function (resolve) {
    var that = this;
    if (loadingFirst) {
      LoadingHelper.showLoading();
    }
    let requestData = {
      url: ApiConst.GET_AD_INFO,
      data: {
        ad_id: that.data.adId
      },
      success: res => {
        resolve(res);
      },
      complete: res => {
        if (loadingFirst) {
          LoadingHelper.hideLoading();
          loadingFirst = false;
        }
        that.setData({
          isShowLoadingMore: false
        });
        wx.hideNavigationBarLoading()
      }
    };
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  initAdInfo(res) {
    const that = this;
    let dataBean = res;
    let adTempInfo = dataBean.info;
    adTempInfo.run_status = RunStatus.getRunStatus(adTempInfo);
    adTempInfo.adStatusStr = RunStatus.getAdStatusStr(adTempInfo);
    adTempInfo.adStatusStr = adTempInfo.run_status === 1 ? `${adTempInfo.adStatusStr}${adTempInfo.current_count}` : adTempInfo.adStatusStr;
    adTempInfo.begin_date = adTempInfo.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
    adTempInfo.end_date = adTempInfo.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
    adTempInfo.ad_name = StringUtil.formatAdName(adTempInfo.ad_name, adTempInfo.city_name);
    //广告开放预约时间
    if (adTempInfo.reserve_date.start_date && adTempInfo.reserve_date.last_date) {
      adTempInfo.reserve_date.start_date = adTempInfo.reserve_date.start_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
      adTempInfo.reserve_date.last_date = adTempInfo.reserve_date.last_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
    }
    //广告效果图
    that.resolveEffect(dataBean);
    //banner
    adTempInfo.banners = that.resolveBanner(dataBean);
    //车辆要求
    adTempInfo.cityRequire = adTempInfo.city_limit == 0 && adTempInfo.city_name ? `${ adTempInfo.city_name }车辆` : "";
    adTempInfo.userRequire = adTempInfo.user_limit == 1 ? "双证车主" : adTempInfo.user_limit == 2 ? "普通网约车" : "";
    adTempInfo.carSizeRequire = adTempInfo.car_size_limit ? adTempInfo.car_size_limit : "";
    adTempInfo.car_require = `${ adTempInfo.cityRequire }${ adTempInfo.userRequire? ", " : "" }${ adTempInfo.userRequire }${ adTempInfo.carSizeRequire? ", " : "" }${ adTempInfo.carSizeRequire }`
    that.setData({
      adInfo: adTempInfo,
      designList: dataBean.design_list,
      joinCount: adTempInfo.total_count - adTempInfo.current_count,
      carColor: (!adTempInfo.color_limit || adTempInfo.color_limit.length == 0) ? '不限' : adTempInfo.color_limit.join('、'),
    })
  },

  /**
   * 处理按钮状态
   */
  resolveAction(dataBean, carInfo) {
    //已经有广告在运行
    if (dataBean.current_reserve || dataBean.current_ad) {
      this.updateAction(RunStatus.OWNER_ACTION);
      return;
    }
    //运行状态过滤
    console.log('run_status---------->' + dataBean.info.run_status)
    switch (dataBean.info.run_status) {
      case RunStatus.PUBLISHED:
        // 剩余数过滤
        if (parseInt(dataBean.info.current_count) !== 0) {
          //颜色不匹配
          if (carInfo && this.data.adInfo.color_limit.indexOf(carInfo.car_color) === -1) {
            this.updateAction(RunStatus.COLOR_REJECT_ACTION);
          } else {
            //可预约
            this.updateAction(RunStatus.SUBSCRIBE_ACTION);
          }
        } else {
          //数量不足
          this.updateAction(RunStatus.NO_COUNT_ACTION);
        }
        break;
      case RunStatus.NOT_BEGIN: //即将开始
        this.updateAction(RunStatus.NOT_BEGIN_ACTION);
        break;
      case RunStatus.RUNNING: //投放中
        this.updateAction(RunStatus.RUNING_ACTION);
        break;
      case RunStatus.CHECKING: //检测中
        this.updateAction(RunStatus.CHECKING_ACTION);
        break;
      case RunStatus.FINISH: //已完成
        this.updateAction(RunStatus.FINISH_ACTION);
        break;
    }
  },

  resolveEffect(dataBean) {
    dataBean.design_list.forEach(element => {
      let effect_list = [];
      let left = {
        img: element.left_img,
        desc: '车身左侧'
      };
      let right = {
        img: element.right_img,
        desc: '车身右侧'
      };
      let inner = {
        img: element.inner_img,
        desc: '车内'
      };
      effect_list.push(left);
      effect_list.push(right);
      effect_list.push(inner);
      //过滤空值
      effect_list = effect_list.filter(item => Boolean(item.img.trim()))
      element.effect = effect_list;
    })
  },

  resolveBanner(dataBean) {
    let banners = [];
    if (dataBean.design_list.length === 1) {
      //一套设计直接取这套设计所有图片
      let designBean = dataBean.design_list[0];
      banners.push(designBean.left_img);
      banners.push(designBean.right_img);
      banners.push(designBean.inner_img);
      banners = banners.filter(element => Boolean(element.trim()));
    } else {
      //多套设计取第一张
      dataBean.design_list.forEach(element => {
        banners.push(element.left_img);
      })
    }
    return banners;
  },

  /**
   * 用户车辆信息
   */
  getUserCarInfo(resolve) {
    let requestData = {
      url: ApiConst.GET_USER_CAR_INFO,
      header: app.globalData.header,
      success: res => {
        resolve(res);
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  initUserInfo(res) {
    let that = this;
    //未注册或者未认证
    if (!res) {
      return;
    }
    that.setData({
      userCarColor: res.car_color
    })
  },

  /** 请求已参与车主列表 */
  requestJoinList: function () {
    var that = this;
    let requestData = {
      url: ApiConst.AD_JOINED_USER,
      data: {
        ad_id: that.data.adId,
        page_no: 1,
        page_size: 20,
      },
      success: res => {
        var dataList = res.ad_list;
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
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
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

  //todo
  cancel: function () {
    var that = this;
    let requestData = {
      url: ApiConst.CONFIRM_SUBS_QUEUE,
      data: {
        subscribe_id: that.data.selId
      },
      success: res => {

      },
      complete: res => {

      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
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
   * 生成图片
   */
  shareListener: function () {
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
    wx.navigateTo({
      url: '../valuation/valuation?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },

  showAddress: function (e) {
    this.setData({
      showAddressDialog: true,
      address: e.currentTarget.dataset.address.address,
      phone: e.currentTarget.dataset.address.phone
    })
  },

  handleActionTap: function (event) {
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
    wx.navigateTo({
      url: '../subscribeQueue/subscribeQueue?adId=' + that.data.adId
    })
  },

  /**
   * 预约排队
   */
  takeParkInQueue: function () {
    var that = this;
    LoadingHelper.showLoading();
    let requestData = {
      url: ApiConst.TAKE_PART_IN_QUEUE,
      data: {
        ad_id: that.data.adId
      },
      success: res => {
        that.setData({
          isQueueing: true,
          actionStatus: RunStatus.CANCEL_QUEUE_ACTION
        });
        that.setData({
          position: res.position,
          queue_count: res.queue_count,
          serial_number: res.serial_number,
          visible: true,
          actionStr: RunStatus.updateActionStr(that.data.actionStatus)
        })
      },
      complete: res => {
        LoadingHelper.hideLoading();
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
          actionStatus: RunStatus.QUEUE_ACTION,
          cancelLoading: false,
          visible: false,
          visibleUndo: false,
          doLoading: false
        });
        that.updateAction(RunStatus.QUEUE_ACTION);
        $Toast({
          content: '取消成功',
          type: 'success'
        });
        that.requestQueueList();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  updateAction(run_status) {
    this.setData({
      actionStatus: run_status,
      actionStr: RunStatus.updateActionStr(run_status)
    })
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

  handleAction: function () {
    let that = this;
    switch (that.data.actionStatus) {
      case RunStatus.NOT_BEGIN_ACTION: //即将开始
        //nothing
        ModalHelper.showWxModal('提示', '广告还未开始投放，请耐心等待~', '确定', false);
        break;
      case RunStatus.SUBSCRIBE_ACTION: //立即预约
        that.handleSubscribe();
        break;
      case RunStatus.NO_COUNT_ACTION: //数量不足
        ModalHelper.showWxModal('提示', '当前广告已被预约完，\n下次记得早点来预约哦~', '确定', false);
        break;
      case RunStatus.COLOR_REJECT_ACTION: //颜色不满足广告要求
        ModalHelper.showWxModal('提示', `您的车身颜色为${ that.data.userCarColor },\n暂不满足广告要求`, '确定', false);
        break;
      case RunStatus.OWNER_ACTION: //查看我的任务
        wx.switchTab({
          url: '../task/task'
        })
        break;
      case RunStatus.QUEUE_ACTION: //预约排队
        that.takeParkInQueue();
        break;
      case RunStatus.CANCEL_QUEUE_ACTION: //取消排队
        that.setData({
          visibleUndo: true,
        })
        break;
    }
  },

  /** 预览设计效果图 */
  handlePreviewDesign(event) {
    let effect = event.currentTarget.dataset.effect;
    if (!effect || effect.length === 0) {
      return;
    }
    let imageList = [];
    effect.forEach(element => {
      imageList.push(element.img);
    })
    wx.previewImage({
      current: event.currentTarget.dataset.current,
      urls: imageList
    })
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
      success: res => {
        //计算距离
        that.calculateStationDistance(res);
        //先按数量排序（过滤掉数量为0的），再按距离排序
        res = that.sortStationList(res);
        that.setData({
          stationList: res
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  calculateStationDistance(stationList) {
    const that = this;
    //todo 距离排序
    stationList.forEach(element => {
      const distance = util.getDistance(that.data.latitude, that.data.longitude, element.lat, element.lng).toFixed(2);
      element.distance = distance;
      //通过可预约数判断是否可点击
      element.enable = parseInt(element.surplus_count) !== 0;
    })
  },

  sortStationList(stationList) {
    let targetStationList = [];
    //筛选有可预约数量
    let useableStationList = stationList.filter(element => parseInt(element.surplus_count) !== 0);
    //先数量排序再按距离排序
    useableStationList.sort(this.sortBySurplusCount);
    useableStationList.sort(this.sortByDistance);
    //筛选数量为0的网点
    let emptyStationList = stationList.filter(element => parseInt(element.surplus_count) === 0);
    emptyStationList.sort(this.sortByDistance);
    //拼接为新数组
    targetStationList = targetStationList.concat(useableStationList, emptyStationList);
    return targetStationList;
  },

  sortBySurplusCount(a, b) {
    return b.surplus_count - a.surplus_count;
  },

  sortByDistance(a, b) {
    return a.distance - b.distance;
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
    console.log('stationList----------->' + this.data.stationList);
    if (!this.data.stationList || this.data.stationList.length === 0) {
      $Toast({
        content: '数据正在加载中，请稍后再试'
      })
      return;
    }
    //验证登录状态
    if (parseInt(app.globalData.login) !== 1) { //未登录注册
      this.showLoginModal("您还没有登录，不能预约广告");
    } else {
      this.verifyAuthStatus();
    }
  },

  showLoginModal(content) {
    ModalHelper.showWxModalShowAllWidthCallback("提示", content, "立即登录", "取消", true, sure => {
      if (sure.confirm) {
        wx.navigateTo({
          url: '../register/register'
        })
      }
    });
  },

  /**
   * 验证认证状态
   */
  verifyAuthStatus() {
    let authStatus = app.globalData.checkStaus;
    //未认证
    if (parseInt(authStatus) === 0) {
      this.showNotAuthModal("你没进行身份认证，不能预约广告");
      return;
    }
    //认证审核中
    if (parseInt(authStatus) === 1) {
      this.showAuthingModal('你的身份认证信息正在审核中，\n不能预约广告');
      return;
    }
    //认证失败
    if (parseInt(authStatus) === 2) {
      this.showAuthFailModal("你没通过身份认证，不能预约广告");
      return;
    }
    //补充年检信息
    if (!app.globalData.car_check_date && !app.globalData.visibleCheckDate) { //填写年检信息
      this.initAnnual();
      return;
    }
    this.startSubscribe();
  },

  /**
   * 初始化预约
   */
  startSubscribe() {
    this.setData({
      visibleSubscribe: true,
      colorList: this.data.adInfo.color_limit,
      selectServerIndex: -1,
      selectDateIndex: -1,
      selectTimeIndex: -1
    })
    this.initSelectStatus();
    this.changeRemainCount();
  },

  showAuthFailModal(content) {
    ModalHelper.showWxModalShowAllWidthCallback("提示", content, "立即认证", "取消", true, function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../state/state'
        })
      }
    })
  },

  showAuthingModal(content) {
    ModalHelper.showWxModal('提示', content, '我知道了', false);
  },

  showNotAuthModal(content) {
    ModalHelper.showWxModalShowAllWidthCallback("提示", content, "立即认证", "取消", true, function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      }
    })
  },

  initAnnual() {
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

  /** 取消完善年检信息 */
  handleAnnualCancel() {
    this.setData({
      visibleAnnual: false
    })
    this.startSubscribe();
  },

  /** 保存年检信息 */
  handleAnnualConfirm() {
    let that = this;
    that.setData({
      annualLoading: true
    })
    that.uploadCheckDate();
  },

  bindAnnualChange(event) {
    this.setData({
      selectMonth: this.data.months[event.detail.value[0]],
      selectDay: this.data.days[event.detail.value[1]]
    })
  },

  uploadCheckDate() {
    const that = this;
    const check_date = `${that.formatCheckDate(that.data.selectMonth)}-${that.formatCheckDate(that.data.selectDay)}`;
    let requestData = {
      url: ApiConst.SET_USER_CAR_CHECK_DATE,
      data: {
        car_check_date: check_date
      },
      success: res => {
        $Toast({
          content: '保存成功',
          type: 'success'
        });
        app.globalData.car_check_date = check_date;
        app.globalData.visibleCheckDate = true;
      },
      complete: res => {
        that.setData({
          annualLoading: false,
          visibleAnnual: false
        })
        this.startSubscribe();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  formatCheckDate(number) {
    return String(number).length === 1 ? `0${number}` : number;
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
      if(!app.globalData.showSubscribeClickTip){
        app.globalData.showSubscribeClickTip = true;
        $Toast({
          content: '再次点击可取消选中哦'
        })
      }
    } else { //取消选中
      that.resetServerSelect();
      that.setRemainCount(that.data.totalCount);
    }
    that.initSelectStatus();
  },

  resetServerSelect(){
    this.setData({
      selectServerIndex: -1,
      selectDateIndex: -1,
      selectTimeIndex: -1
    })
  },

  resetStationCount() {
    let that = this;
    that.setRemainCount(that.data.stationList[that.data.selectServerIndex].surplus_count);
  },

  /** 选中服务网点时初始化日期 */
  initDateList(clickIndex) {
    let station = this.data.stationList[clickIndex];
    let dates = station.dates;
    dates.forEach(element => {
      let count = 0;
      let timeAvailable = false;
      element.times.forEach((sub, index) => {
        //计算数量
        count += sub.surplus_count;
        if (index === element.times.length - 1) {
          //先判断时间
          const nowTime = station.now_date;
          let lastTime = TimeUtil.getTimeStapByDate(element.date, sub.end_time);
          timeAvailable = lastTime >= nowTime;
        }
      });
      element.surplus_count = count;
      //预约数为0，不可点击; 当前时间大于预约时间，不可点击
      element.enable = timeAvailable && count !== 0;
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
      that.resetDateSelect();
      //重置数量
      that.resetStationCount();
    }
    that.initSelectStatus();
  },

  resetDateSelect(){
    this.setData({
      selectDateIndex: -1,
      selectTimeIndex: -1
    })
  },

  resetDateCount() {
    let that = this;
    that.setRemainCount(that.data.dateList[that.data.selectDateIndex].surplus_count);
  },

  initTimeList() {
    let selectStation = this.data.stationList[this.data.selectServerIndex];
    let selectDate = this.data.dateList[this.data.selectDateIndex];
    selectDate.times.forEach(element => {
      //先判断时间
      const nowTime = selectStation.now_date;
      let itemTime = TimeUtil.getTimeStapByDate(selectDate.date, element.end_time);
      element.time = element.begin_time + "-" + element.end_time;
      element.enable = nowTime <= itemTime && element.surplus_count !== 0;
    })
    this.setData({
      timeList: selectDate.times
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
      that.resetTimeSelect();
      that.resetDateCount();
    }
    that.initSelectStatus();
  },

  resetTimeSelect(){
    this.setData({
      selectTimeIndex: -1
    })
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
        selectStatusStr: '请选择 ' + (selectServerIndex !== -1 ? "" : "服务网点 ") + (selectDateIndex !== -1 ? "" : "预约日期 ") + (selectTimeIndex !== -1 ? "" : "预约时间")
      })
    }
  },

  handleCancelSelect(event) {
    switch (event.currentTarget.dataset.type) {
      case 'server':
        this.resetServerSelect();
        break;
      case 'date':
        this.resetDateSelect();
        break;
      case 'time':
      this.resetTimeSelect();
        break;
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
        content: '请选择 预约时间',
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
      subscribeTime: that.data.dateList[that.data.selectDateIndex].date + '　' + that.data.timeList[that.data.selectTimeIndex].time,
      subscribeAddress: that.data.stationList[that.data.selectServerIndex].station_address,
      visibleSubscribeTip: true
    })
  },

  /**
   * 发起预约请求
   */
  handleSubscribeRequest() {
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
        that.requestDetail();
        //预约成功跳转我的任务
        ModalHelper.showWxModalUseConfirm("提示", "预约成功", "查看任务", true, function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../task/task'
            })
          }
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
   * 暂不预约
   */
  handleSubscribeCancel() {
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
      urls: [imageUrl],
    })
  },

  handleRequire(event) {
    this.setData({
      visibleRequire: true
    })
  },

  handleCarColor(event) {
    ModalHelper.showWxModal('颜色要求', event.currentTarget.dataset.color, "我知道了", false);
  },

  handleRequireConfirm() {
    this.setData({
      visibleRequire: false
    })
  },

  /**
   * 导航
   */
  handleNavigation(event) {
    let nav = event.currentTarget.dataset.nav;
    wx.openLocation({
      longitude: Number(nav.lng),
      latitude: Number(nav.lat),
      name: nav.station_name,
      address: nav.station_address
    })
  },

  /**
   * 登录注册
   */
  handleGoAuth() {
    if (parseInt(app.globalData.login) !== 1) { //未登录注册
      this.showLoginModal("您还没有登录，暂不能查看收益");
    } else {
      let authStatus = app.globalData.checkStaus;
      //未认证
      if (parseInt(authStatus) === 0) {
        this.showNotAuthModal("你没进行身份认证，暂不能查看收益");
        return;
      }
      //认证审核中
      if (parseInt(authStatus) === 1) {
        this.showAuthingModal('你的身份认证信息正在审核中，暂不能查看收益');
        return;
      }
      if (parseInt(authStatus) === 2) {
        this.showAuthFailModal("你没通过身份认证，暂不能查看收益");
        return;
      }
    }
  }

})