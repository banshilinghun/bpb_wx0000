const util = require("../../utils/util.js");
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
var formatLocation = util.formatLocation;
var getDistance = util.getDistance;
const app = getApp();
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");
const ad_server_list = ApiConst.adServerList();
const mapId = 'myMap';
const defaultScale = 11;

Page({
  data: {
    //map start
    mapHeight: 0,
    longitude: '',
    latitude: '',
    scale: defaultScale,
    markers: [],
    controls: [],
    showMap: false,
    actionText: '地图',
    //map end
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
    adServingCity: '', //投放城市
    showWaiting: false, //排队列表
    queueCount: 0,
    queueList: [],
    // 预约排队说明和车身颜色说明
    showExplain: false,
    explainState: 1,
    subActionText: '预约排队',
    //是否正在排队中
    isQueueing: false,
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
    that.requestLocation();
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

  requestAdInfo: function(reqData) {
    var that = this;
    //console.log(reqData)
    wx.request({
      url: ApiConst.getAdInfo(),
      data: reqData,
      header: app.globalData.header,
      success: res => {
        console.log(res.data)
        if (res.data.code == 1000) {
          console.log(res.data)
          var enddate = res.data.data.info.end_date;
          res.data.data.info.begin_date = res.data.data.info.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
          res.data.data.info.end_date = res.data.data.info.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")

          that.setData({
            page: res.data.data.ad_server.page,
            hasMore: res.data.data.ad_server.hasMore,
            sortedKey: res.data.data.ad_server.sortedKey,
            adServingCity: res.data.data.info.city,
            carColor: (!res.data.data.ad_colors || res.data.data.ad_colors.length == 0) ? '不限' : res.data.data.ad_colors.join(','),
            isQueueing: res.data.data.ad_queue && JSON.stringify(res.data.data.ad_queue) != '{}'
          })
          //排队逻辑
          if (that.data.isQueueing) {
            that.setData({
              subActionText: '取消排队'
            })
          } else {
            that.setData({
              subActionText: '预约排队'
            })
          }
          var serviceList = res.data.data.ad_server.servers;
          if (serviceList.length > 0) {
            for (var j = 0; j < serviceList.length; j++) {
              serviceList[j].distance = (serviceList[j].distance / 1000).toFixed(2);
              serviceList[j].lista = 1;
              if (res.data.data.isRegist) {
                serviceList[j].lista = 0;
              } else {
                if (res.data.data.info.current_count > 0) {
                  if (serviceList[j].ad_count - serviceList[j].subscribe_count <= 0) {
                    serviceList[j].lista = 0;
                  } else {
                    if (serviceList[j].is_sub == 1) {
                      serviceList[j].lista = 0;
                    }
                  }
                  if (res.data.data.subscribe != null) {

                    if (res.data.data.subscribe.ad_id == res.data.data.info.id) {
                      if (res.data.data.subscribe.server_id == serviceList[j].id) {
                        serviceList[j].lista = 2;
                        that.setData({
                          selServerId: res.data.data.subscribe.server_id,
                          selDate: res.data.data.subscribe.date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日"),
                          selTime: res.data.data.subscribe.begin_time + "-" + res.data.data.subscribe.end_time,
                          selId: res.data.data.subscribe.id
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
          if (res.data.data.ad_server.page == 0) {
            that.setData({
              service: serviceList,
              joinCount: res.data.data.info.total_count - res.data.data.info.current_count
            })
          } else {
            var serviceList = that.data.service.concat(serviceList)
            that.setData({
              service: serviceList,
              joinCount: res.data.data.info.total_count - res.data.data.info.current_count
            })
          }


          if (res.data.data.imgs.length == 0) {
            that.setData({
              adInfo: res.data.data.info,
              banners: ['../../image/bpb.png']
            })
          } else {
            that.setData({
              adInfo: res.data.data.info,
              banners: res.data.data.imgs
            })
          }
          //赋值分享图数据
          let adInfoBean = res.data.data.info;
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
      serverId: e.currentTarget.dataset.serverid
    })
    console.log(that.data.serverId)
    if (app.globalData.login == 1) {
      wx.request({
        url: ApiConst.getAuthStatus(),
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //					console.log(res.data)
            if (res.data.data.status == 3) {
              console.log(this.data.isDiDi)
              if (that.data.isDiDi == 1) {
                that.setData({
                  showRule: true
                })
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
    console.log('shareMomentListener------------->')
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

  /**
   * 中间 control 图标
   */
  createControl: function() {
    var that = this;
    var controlsWidth = 40;
    var controlsHeight = 48;
    that.setData({
      controls: [{
        id: 1,
        iconPath: '../../image/center-location.png',
        position: {
          left: (that.data.windowWidth - controlsWidth) / 2,
          top: (that.data.mapHeight) / 2 - controlsHeight * 3 / 4,
          width: controlsWidth,
          height: controlsHeight
        },
        clickable: false
      }]
    })
  },

  //请求地理位置
  requestLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        //第一次加载，如果是分享链接点入，需要跳转到指定marker
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.moveTolocation();
        that.requestAllServerList();
      },
    })
  },

  /**
   * 移动到中心点
   */
  moveTolocation: function() {
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },

  /**
   * 请求服务网点列表
   */
  requestAllServerList: function() {
    var that = this;
    wx.request({
      url: ad_server_list,
      data: {
        ad_id: that.data.adId
      },
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          that.createMarker(res.data.data);
        } else {
          that.showModal(res.data.msg);
        }
      },
      fail: res => {
        that.showModal('网络错误');
      }
    })
  },

  /**
   * 创建marker点
   */
  createMarker: function(serverList) {
    for (let marker of serverList) {
      marker.latitude = marker.lat;
      marker.longitude = marker.lng;
      marker.width = 40;
      marker.height = 40;
      marker.iconPath = '../../image/server-map-icon.png';
      marker.callout = this.createCallout(marker);
      //marker.label = this.createLabel(marker);
    }
    console.log(serverList);
    this.setData({
      markers: serverList
    })
  },

  /**
   * marker上的气泡
   */
  createCallout: function(marker) {
    let distance = util.getDistance(this.data.latitude, this.data.longitude, marker.lat, marker.lng);
    let callout = {};
    callout.color = '#ffffff';
    callout.content = marker.name + '\n' + marker.address + '\n' + '距离我 ' + distance.toFixed(2) + ' km';
    callout.fontSize = 13;
    callout.borderRadius = 5;
    callout.bgColor = '#6E707c';
    callout.padding = 5;
    callout.textAlign = 'left';
    callout.display = 'BYCLICK';
    return callout;
  },

  createLabel: function(marker) {
    let label = {};
    label.color = '#ffffff';
    label.content = distance.toFixed(2) + 'km';
    label.fontSize = 10;
    label.borderRadius = 5;
    label.borderWidth = 1;
    label.borderColor = '#ffffff';
    label.bgColor = '#6E707c';
    label.padding = 5;
    label.textAlign = 'left';
    return label;
  },

  showModal: function(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    })
  },

  /**
   * 点击marker事件
   */
  bindMarkertap: function(e) {
    console.log(e);
    for (let marker of this.data.markers) {
      if (e.markerId == marker.id) {
        this.setData({
          longitude: marker.longitude,
          latitude: marker.latitude
        })
      }
    }
  },

  /**
   * 点击control事件
   */
  controlTap: function() {

  },

  /**
   * 拖动地图事件
   */
  regionChange: function() {

  },

  /**
   * 点击地图事件
   */
  bindMapTap: function() {

  },

  moveToSelfLocation: function() {
    this.setData({
      scale: defaultScale
    })
    this.requestLocation();
  },

  changeListMap: function() {
    var that = this;
    that.setData({
      showMap: !that.data.showMap,
      actionText: that.data.showMap ? '地图' : '列表',
    })
    if (that.data.showMap) {
      wx.createSelectorQuery().select('#myMap').boundingClientRect(function(rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec()
    }
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
   * 排队
   */
  handleSubcribeQueue: function() {
    let that = this;
    if (that.data.isQueueing) {
      this.cancelQueue();
    } else {
      this.takeParkInQueue();
    }
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
          subActionText: '取消排队'
        });
        //todo
        let content = '排队序号：' + 12 + '\n当前排队人数：' + 12 + '\n需等待人数：' + 11
        wx.showModal({
          title: '预约排队确认',
          content: content,
          confirmText: '确认排队',
          cancelText: '再想想',
          success: function(res){
            if(res.cancel){
              that.cancelQueue();
            }
          }
        })
        that.requestQueueList();
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 取消排队
   */
  cancelQueue: function() {
    var that = this;
    wx.showModal({
      title: '取消确认',
      content: '您确认取消当前排队吗？',
      confirmText: '确认取消',
      cancelText: '再想想',
      success: res => {
        if(res.confirm){
          wx.showLoading({
            title: '奔跑中🚗...',
          })
          let requestData = {
            url: ApiConst.cancelQueue(),
            data: {
              ad_id: that.data.adId
            },
            header: app.globalData.header,
            success: res => {
              that.setData({
                isQueueing: false,
                subActionText: '预约排队'
              });
              wx.showToast({
                title: '取消排队成功',
                icon: 'success'
              });
              that.requestQueueList();
            },
            complete: res => {
              wx.hideLoading();
            }
          }
          ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
        }
      }
    })
  },

  /**
   * 车身颜色说明
   */
  handleColorExplain: function() {
    this.setData({
      showExplain: true,
      explainState: 2
    })
  },

  /**
   * 预约排队说明
   */
  handleSubscribeExplain: function() {
    this.setData({
      showExplain: true,
      explainState: 1
    })
  }
})