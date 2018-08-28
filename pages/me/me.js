const app = getApp();
var util = require("../../utils/common/util");
const {
  $Toast
} = require('../../components/base/index');
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const dotHelper = require("../../pages/me/dotHelper.js");
const ApiConst = require("../../utils/api/ApiConst.js");

//1:提现，2:提现记录 3:收益记录 4:损坏申报 5:掉漆申报 6:违章申报 7:推荐有奖 8:新手教程 9:注册认证
const CELL_TYPE = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//推荐奖励是否关闭
let shareFlag;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeCells: [{
        type: 1,
        text: '提现',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-withdraw-icon.png',
        url: '../withdraw/withdraw',
        visible: true
      },
      {
        type: 2,
        text: '提现记录',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-withdraw-record.png',
        url: '../withdrawRecord/withdrawRecord',
        visible: true
      }, {
        type: 3,
        text: '收益记录',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-income-record.png',
        url: '../earningRecord/earningRecord',
        visible: false
      }
    ],
    ExceptionCells: [{
        type: 4,
        text: '损坏申报',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-damage-icon.png',
        url: '../declare/declare?type=damage',
        visible: true
      },
      {
        type: 5,
        text: '掉漆申报',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-drop-icon.png',
        url: '../declare/declare?type=drop',
        visible: true
      }, {
        type: 6,
        text: '违章申报',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-traffic-icon.png',
        url: '../declare/declare?type=violate',
        visible: true
      }
    ],
    actionCells: [{
        type: 7,
        text: '推荐有奖',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-recommend-icon.png',
        url: '../recommend/recommend?flag=recommend',
        visible: true
      },
      {
        type: 8,
        text: '新手教程',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-user-course.png',
        url: '../teaching/teaching',
        visible: true
      }, {
        type: 9,
        text: '注册认证',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-auth-icon.png',
        url: '../auth/auth',
        visible: true
      }
    ],
    avatar: '',
    userInfo: {},
    amount: '0.00',
    total: '0.00',
    rate: 0,
    showRecommend: false,
    dotVisible: false,
    loginFlag: 0,
    isDiDi: 0 //是否是滴滴车主
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(that.data.userInfo);
  },

  onShow: function () {
    let that = this;
    shareFlag = app.globalData.shareFlag;
    //是否显示推荐有奖
    let actionCells = that.data.actionCells;
    actionCells[0].visible = shareFlag;
    this.setData({
      loginFlag: app.globalData.login,
      actionCells: actionCells
    })
    //请求判断是否显示红点(有可领取奖励)
    dotHelper.requestDotStatus().then((result) => {
      that.setData({
        dotVisible: result
      });
    }).catch((err) => {
      that.setData({
        dotVisible: err
      });
    });
    //请求账户余额等
    that.requestUserAccount();
    //车主认证状态信息
    that.requestAuthStatus();
  },

  /**
   * 查询是否关注公众号
   */
  followFlag: function () {
    var that = this
    wx.request({
      url: ApiConst.USER_HAS_SUBCRIBE,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          that.setData({
            isFollow: res.data.data
          })
        } else {
          that.showModel(res.data.msg);
        }
      },
      fail: res => {
        that.showModel('网络错误');
      }
    })
  },

  showModel(msg) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: msg
    });
  },

  /**
   * 请求余额等信息
   */
  requestUserAccount() {
    let that = this;
    wx.request({
      url: ApiConst.USER_ACCOUNT,
      data: {},
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data != null) {
            this.setData({
              amount: util.toDecimal2(res.data.data.amount),
              total: util.toDecimal2(res.data.data.total_amount),
              rate: (res.data.data.rate) * 100
            });
          }
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
   * 车主认证状态
   */
  requestAuthStatus() {
    let that = this;
    console.log(Boolean(0));
    if (that.data.loginFlag == 1) { //登录了
      wx.request({
        url: ApiConst.GET_AUTH_STATUS,
        data: {},
        header: app.globalData.header,
        success: res => {
          let dataBean = res.data.data;
          if (res.data.code == 1000) {
            this.setData({
              status: dataBean.status,
              isDiDi: dataBean.user_type //是否是滴滴合法车主
            })
            if (dataBean.status == 3) {
              that.setData({
                plate_no: dataBean.plate_no,
                real_name: dataBean.real_name + 'real_namereal_namereal_name'
              })
            }
          } else {
            that.showModal(res.data.msg);
          }
        },
        fail: res => {
          that.showModal('网络错误');
        }
      })
    }
  },

  handleAction(event) {
    console.log(event);
    let that = this;
    let item = event.currentTarget.dataset.item;
    //判断车主是否登录，推荐有奖和新手教程无需登录
    if ((item.type != CELL_TYPE[6] || item.type != CELL_TYPE[7]) && that.data.loginFlag == 0) {
      wx.showModal({
        title: '登录提示',
        content: '你还没有登录',
        cancelText: '取消',
        confirmText: '立即登录',
        success: res => {
          if (res.confirm) {
            that.navigateTo('../register/register');
          }
        }
      })
      return;
    }
    switch (Number(item.type)) {
      case CELL_TYPE[0]: //提现
      case CELL_TYPE[1]: //提现记录
      case CELL_TYPE[2]: //收益记录
      case CELL_TYPE[3]: //损坏申报
      case CELL_TYPE[4]: //掉漆申报
      case CELL_TYPE[5]: //违章申报
      case CELL_TYPE[6]: //推荐有奖
      case CELL_TYPE[7]: //新手教程
        that.navigateTo(item.url);
        break;
      case CELL_TYPE[8]: //注册认证
        if (this.data.status == 0) {
          that.navigateTo(item.url);
        } else {
          //审核中、审核失败、审核成功 跳转到状态页面
          that.navigateTo('../state/state');
        }
        break;
      default:
        break;
    }
  },

  navigateTo(url) {
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 计价规则
   */
  goValuation() {
    this.navigateTo('../valuation/valuation');
  },

  /**
   * 待收收益
   */
  handleIncomeClick() {
    this.navigateTo('../earningRecord/earningRecord');
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '奔跑中🚗...',
      icon: 'loading'
    })
    this.onShow();
  },

  //分享
  onShareAppMessage: function (res) {
    var that = this;
    var shareTitle = shareUtil.getShareNormalTitle();
    var adid = -1;
    var adimg = '../../image/share-normal.png';
    var desc = '拉上好友一起赚钱～';
    var shareType = Constant.shareNormal;
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index?' + 'user_id=' + app.globalData.uid,
      imageUrl: adimg,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        });
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