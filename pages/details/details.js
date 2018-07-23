const util = require("../../utils/util.js");
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
var formatLocation = util.formatLocation;
var getDistance = util.getDistance;
const app = getApp();
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");
const { $Message } = require('../../components/base/index');
const ad_server_list = ApiConst.adServerList();
const mapId = 'myMap';
const defaultScale = 11;

//预约排队状态数组  0:即将开始，1:立即预约，2:已预约或者当前已接广告（查看我的广告），3:预约排队，4:取消排队
const ACTION_ARR = [0, 1, 2, 3, 4];

Page({
  data: {
    joinListUrl: ApiConst.adJoinedUser(),
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
    amount: 1,
    isTop: false,
    isNeedKey: false,
    showMenu: true,
    checkPlan: false,
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
    serverId:'',
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
    confirmLoading: false
  },

  onLoad: function(options) {
    //console.log(options.share);
    var that = this;
    that.setData({
      latitude: null,
      longitude: null
    })
    if (options.share != undefined) {
      this.setData({
        goHome: true
      })
    }
    //console.log(options)
    this.setData({
      adId: options.adId
    })
    app.globalData.shareInviteId = options.inviteId;
    if (app.globalData.isFirst) {
      that.setData({
        reward: true
      })
    }
    app.globalData.isFirst = false;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          bannerHeight: res.windowWidth * 0.5625,
          mapHeight: 0.8 * res.windowHeight
        })
      }
    })
  },

  onShow: function(n) {
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
    //注册认证状态
    var loginFlag = app.globalData.login;
    var checkStaus = app.globalData.checkStaus;
    if (loginFlag != 1) { //没有登录
      that.setData({
        loginStaus: 0
      })
    } else { //已登录
      if (checkStaus == 0) { //未认证
        that.setData({
          loginStaus: 1
        })
      } else { //登录了且认证了
        that.setData({
          loginStaus: 2
        })
      }
    }

    //检测是否是滴滴车主以及注册认证状态
    that.checkUserAuthStatus();

    var pages = getCurrentPages();
    console.log(pages)
    var currPage = pages[pages.length - 1]; //当前页面
    //console.log(currPage.data.mydata) //就可以看到data里mydata的值了
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

    var reqData = {};
    reqData.ad_id = that.data.adId;
    //请求地理位置信息
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //				console.log(res.longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude,
          haveLoca: true
        })
        reqData.lat = latitude;
        reqData.lng = longitude;
        that.requestAdInfo(reqData);
      }
    })
    //请求广告信息
    if (that.data.latitude == null) {
      that.requestAdInfo(reqData);
    } else {
      reqData.lat = that.data.latitude;
      reqData.lng = that.data.longitude;
      that.requestAdInfo(reqData);
    }
    that.requestJoinList();
    that.requestQueueList();
  },

  checkUserAuthStatus: function() {
    let that = this;
    wx.request({
      url: ApiConst.getAuthStatus(),
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          console.log(res.data)
          that.setData({
            isDiDi: res.data.data.user_type
          })
          if (res.data.data.status != 0) {
            that.setData({
              loginStaus: 2
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

  showRequireAuthDialog: function(loginStatus) {
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
  requestAdInfo: function(reqData) {
    var that = this;
    wx.request({
      url: ApiConst.getAdInfo(),
      data: reqData,
      header: app.globalData.header,
      success: res => {
        console.log(res.data)
        if (res.data.code == 1000) {
          console.log(res.data)
          let dataBean = res.data.data;
          var enddate = dataBean.info.end_date;
          dataBean.info.begin_date = dataBean.info.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
          dataBean.info.end_date = dataBean.info.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")

          that.setData({
            page: dataBean.ad_server.page,
            hasMore: dataBean.ad_server.hasMore,
            sortedKey: dataBean.ad_server.sortedKey,
            carColor: (!dataBean.ad_colors || dataBean.ad_colors.length == 0) ? '' : dataBean.ad_colors.join('/'),
            isQueueing: dataBean.ad_queue && JSON.stringify(dataBean.ad_queue) != '{}',

          })
          //预约过滤
          if (dataBean.subscribe){
            that.setData({
              actionStr: '查看我的广告',
              actionStatus: ACTION_ARR[2]
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
                //是否排队中过滤
                if (that.data.isQueueing) {
                  that.setData({
                    actionStr: '取消排队',
                    actionStatus: ACTION_ARR[4]
                  })
                } else {
                  that.setData({
                    actionStr: '预约排队',
                    actionStatus: ACTION_ARR[3]
                  })
                }
              }
            } else if (dataBean.info.run_status == 0) { //即将开始
              that.setData({
                actionStr: '即将开始',
                actionStatus: ACTION_ARR[0]
              })
            } else{
              that.setData({
                actionStr: '查看我的广告',
                actionStatus: ACTION_ARR[2]
              });
            }
          }

          var serviceList = dataBean.ad_server.servers;
          if (serviceList.length > 0) {
            for (var j = 0; j < serviceList.length; j++) {
              serviceList[j].distance = (serviceList[j].distance / 1000).toFixed(2);
              serviceList[j].lista = 1;
              if (dataBean.isRegist) {
                serviceList[j].lista = 0;
              } else {
                if (dataBean.info.current_count > 0) {
                  if (serviceList[j].ad_count - serviceList[j].subscribe_count <= 0) {
                    serviceList[j].lista = 0;
                  } else {
                    if (serviceList[j].is_sub == 1) {
                      serviceList[j].lista = 0;
                    }
                  }
                  if (dataBean.subscribe != null) {

                    if (dataBean.subscribe.ad_id == dataBean.info.id) {
                      if (dataBean.subscribe.server_id == serviceList[j].id) {
                        serviceList[j].lista = 2;
                        that.setData({
                          selServerId: dataBean.subscribe.server_id,
                          selDate: dataBean.subscribe.date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日"),
                          selTime: dataBean.subscribe.begin_time + "-" + dataBean.subscribe.end_time,
                          selId: dataBean.subscribe.id
                        })
                      } else {
                        serviceList[j].lista = 0;
                      }

                    } else {
                      serviceList[j].lista = 0;
                    }

                  }
                } else {
                  serviceList[j].lista = 0;
                }
              }
            }
          }
          console.log(serviceList)
          if (dataBean.ad_server.page == 0) {
            that.setData({
              service: serviceList,
              joinCount: dataBean.info.total_count - dataBean.info.current_count
            })
          } else {
            var serviceList = that.data.service.concat(serviceList)
            that.setData({
              service: serviceList,
              joinCount: dataBean.info.total_count - dataBean.info.current_count
            })
          }

          if (dataBean.imgs.length == 0) {
            that.setData({
              adInfo: dataBean.info,
              banners: ['../../image/bpb.png']
            })
          } else {
            that.setData({
              adInfo: dataBean.info,
              banners: dataBean.imgs
            })
          }
          //赋值分享图数据
          let adInfoBean = dataBean.info;
          that.setData({
            shareAvatar: app.globalData.userInfo.avatarUrl,
            shareNickname: app.globalData.userInfo.nickName,
            incomeMoney: adInfoBean.amount,
            adImageUrl: adInfoBean.img_url || "",
            adName: adInfoBean.name,
            adTime: adInfoBean.begin_date + ' ~ ' + adInfoBean.end_date,
            adId: adInfoBean.id,
            joinNumber: adInfoBean.total_count - adInfoBean.current_count
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
      },
      complete: res => {
        that.setData({
          isShowLoadingMore: false
        });
        wx.hideNavigationBarLoading()
      }
    })
  },

  onReachBottom: function() {
    var that = this;
    if (!that.data.hasMore) {
      return;
    }
    that.setData({
      isShowLoadingMore: true
    });
    var reqData = {};
    reqData.ad_id = that.data.adId;
    reqData.page = that.data.page + 1;
    reqData.sorted_key = that.data.sortedKey;
    that.requestAdInfo(reqData);
    //this.showLoadingToast();
    // that.setData({
    //   isShowLoadingMore: true
    // });
    // setTimeout(function () {
    //   that.requestJoinList(that.data.pageIndex + 1);
    // }, 1000);
  },

  /** 请求已参与车主列表 */
  requestJoinList: function() {
    var that = this;
    wx.request({
      url: that.data.joinListUrl,
      data: {
        ad_id: that.data.adId,
        page_no: 1,
        page_size: 20,
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 1000) {
          var dataList = res.data.data.info;
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
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        })
      }
    })
  },

  joinClick: function() {
    var that = this;
    wx.navigateTo({
      url: '../joinList/joinList?adId=' + that.data.adId,
    })
  },

  formSubmit: function(e) {
    var param = e.detail.value;
    this.setData({
      formId: e.detail.formId
    })
    this.receiveAd();
  },
  cancel: function() {
    var that = this;
    var subscribe_id = this.data.selId;
    var reqData = {
      subscribe_id: subscribe_id
    }
    wx.request({
      url: ApiConst.cancelSubcribe(),
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

  arrangement: function(e) {
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
        url: ApiConst.getAuthStatus(),
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            if (res.data.data.status == 3) {
              console.log(this.data.isDiDi)
              if (that.data.isDiDi == 1) {
                that.setData({
                  showRule: true
                })
              } else if (that.data.isDiDi == 1 && !app.globalData.showRuleTip){
                  that.setData({
                    showRule:true
                  })
                  app.globalData.showRuleTip = true;
              }else{
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
                  success: function(sure) {
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
                  success: function(sure) {
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
        success: function(sure) {
          if (sure.confirm) {
            wx.navigateTo({
              url: '../register/register'
            })
          }
        }
      })
    }
    //console.log(e)
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

  /**
   * 分享
   */
  shareDetailListener: function() {
    this.setData({
      showSharePop: true
    })
  },

  /**
   * 生成图片分享朋友圈
   */
  shareMomentListener: function() {
    this.setData({
      showShareModel: true
    })
  },

  dialogClickListener: function() {
    this.setData({
      showSharePop: true
    })
  },

  //分享
  onShareAppMessage: function(res) {
    //console.log(res)
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
    //console.log(res);
    //console.log(this)
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?adId=' + adid + '&user_id=' + app.globalData.uid + '&type=' + shareType,
      imageUrl: adimg,
      success: function(res) {
        setTimeout(function() {
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
      fail: function() {
        setTimeout(function() {
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
  hideDialogListener: function() {
    console.log('hideDialogListener------------->')
    this.setData({
      showGoodsDetail: false
    });
  },

  showGoodsDetail: function() {
    this.setData({
      showGoodsDetail: !this.data.showGoodsDetail
    });
  },

  hideGoodsDetail: function() {
    this.setData({
      showGoodsDetail: false
    });
  },

  goRegister: function() {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  goAuth: function() {
    wx.navigateTo({
      url: '../auth/auth'
    })
  },

  backHome: function() {
    wx.switchTab({
      url: '../main/main'
    })
  },

  showModal: function(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    })
  },

  previewImage: function(e) {
    console.log(e);
    var that = this;
    let image = e.currentTarget.dataset.image;
    let samllImage = e.currentTarget.dataset.samllimage;
    if (!image || image.indexOf('http') == -1) {
      return;
    }
    wx.previewImage({
      urls: [image],
      complete: function() {
        that.setData({
          isPreview: true
        })
      }
    })
  },

  goValuation: function() {
    wx.navigateTo({
      url: '../valuation/valuation',
    })
  },

  iKnow: function(e) {
    wx.navigateTo({
      url: '../arrangement/arrangement?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },

  goRuleDetail: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../valuation/valuation?arrangementData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },

  showAddress: function(e) {
    console.log(e);
    this.setData({
      showAddressDialog: true,
      address: e.currentTarget.dataset.address.address,
      phone: e.currentTarget.dataset.address.phone
    })
  },

  handleActionTap: function(event) {
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
  requestQueueList: function() {
    let that = this;
    let dataBean = {
      ad_id: that.data.adId,
      page: 0,
      page_count: 20
    };
    let requestData = {
      url: ApiConst.getQueueUser(),
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
  queueClick: function() {
    let that = this;
    console.log('-----' + that.data.adId);
    wx.navigateTo({
      url: '../subscribeQueue/subscribeQueue?adId=' + that.data.adId
    })
  },

  /**
   * 预约排队
   */
  takeParkInQueue: function() {
    var that = this;
    wx.showLoading({
      title: '奔跑中🚗...',
    })
    let requestData = {
      url: ApiConst.takePartInQueue(),
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        that.setData({
          isQueueing: true,
          actionStatus: ACTION_ARR[4],
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

  handleCancel() {
    let that = this;
    that.setData({
      cancelLoading: true
    })
    that.cancelQueueRequest();
  },

  handleConfirm() {
    let that = this;
    that.setData({
      visible: false
    });
    that.requestQueueList();
  },

  /**
   * 取消排队
   */
  cancelQueue: function() {
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
  cancelQueueRequest(){
    let that = this;
    let requestData = {
      url: ApiConst.cancelQueue(),
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        that.setData({
          isQueueing: false,
          actionStatus: ACTION_ARR[3],
          actionStr: '预约排队',
          cancelLoading: false,
          visible: false
        });
        $Message({
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
  handleColorExplain: function() {
    wx.navigateTo({
      url: '../explain/explain?state=2'
    });
  },

  /**
   * 预约排队说明
   */
  handleSubscribeExplain: function() {
    wx.navigateTo({
      url: '../explain/explain?state=1'
    });
  },

  handleAction: function() {
    console.log('handleAction---------->')
    let that = this;
    switch (that.data.actionStatus) {
      case ACTION_ARR[0]: //即将开始
        //nothing
        break;
      case ACTION_ARR[1]: //立即预约
        wx.navigateTo({
          url: '../test/test',
        })
        break;
      case ACTION_ARR[2]: //查看我的广告
        wx.switchTab({
          url: '../myAd/myAd'
        })
        break;
      case ACTION_ARR[3]: //预约排队
        that.takeParkInQueue();
        break;
      case ACTION_ARR[4]: //取消排队
        that.cancelQueue();
        break;
    }
  },

  /**
   * 预览广告设计效果
   */
  handlePreviewDesign(){
    wx.navigateTo({
      url: '../design/design'
    })
  }

})