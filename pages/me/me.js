const app = getApp();
var util = require("../../utils/common/util");
const {
  $Toast
} = require('../../components/base/index');
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const dotHelper = require("../../pages/me/dotHelper.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require("../../utils/api/ApiConst.js");
const ModalHelper = require("../../helper/ModalHelper");

//1:提现，2:提现记录 3:收益记录 4:损坏申报 5:掉漆申报 6:违章申报 7:推荐有奖 8:新手教程 9:注册认证 10: 补充车型
const CELL_TYPE = ['withdraw', 'withdrawRecord', 'earningRecord', 'damage', 'drop', 'traffic', 'recommend', 'course', 'auth', 'carModel', 'protocol'];
//推荐奖励是否关闭
let shareFlag;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeCells: [{
        type: CELL_TYPE[0],
        text: '提现',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-withdraw-icon.png',
        url: '../withdraw/withdraw',
        visible: true
      },
      {
        type: CELL_TYPE[1],
        text: '提现记录',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-withdraw-record.png',
        url: '../withdrawRecord/withdrawRecord',
        visible: true
      }, {
        type: CELL_TYPE[2],
        text: '收益记录',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-income-record.png',
        url: '../earningRecord/earningRecord',
        visible: false
      }
    ],
    ExceptionCells: [{
        type: CELL_TYPE[3],
        text: '损坏申报',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-damage-icon.png',
        url: '../declare/declare?type=damage',
        visible: true
      },
      {
        type: CELL_TYPE[4],
        text: '掉漆申报',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-drop-icon.png',
        url: '../declare/declare?type=drop',
        visible: true
      }, {
        type: CELL_TYPE[5],
        text: '违章申报',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-traffic-icon.png',
        url: '../declare/declare?type=violate',
        visible: true
      }
    ],
    actionCells: [{
        type: CELL_TYPE[6],
        text: '推荐有奖',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-recommend-icon.png',
        url: '../recommend/recommend?flag=recommend',
        visible: true
      },
      {
        type: CELL_TYPE[7],
        text: '新手教程',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-user-course.png',
        url: '../teaching/teaching',
        visible: true
      }, {
        type: CELL_TYPE[8],
        text: '注册认证',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-auth-icon.png',
        url: '../auth/auth',
        visible: true
      }
    ],
    avatar: '',
    userInfo: {},
    amount: '0',
    incomeNumber: 0,
    total: '0',
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
    //车型
    that.controlCarModel();
    //待收收益数量
    that.requestAccountCoupon();
  },

  controlCarModel() {
    let that = this;
    let actionCell = that.data.actionCells;
    //先过滤
    actionCell = actionCell.filter(element => element.type !== CELL_TYPE[9]);
    if (app.globalData.is_add_car_model) {
      actionCell.push({
        type: CELL_TYPE[9],
        text: '车型补充',
        icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-add-car-model.png',
        url: '../brandList/brandList?flag=1',
        visible: true
      });
    }
    that.setData({
      actionCells: actionCell
    })
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
              amount: that.formatAmount(util.toDecimal2(res.data.data.amount)),
              total: that.formatAmount(util.toDecimal2(res.data.data.total_amount)),
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
   * 小数点后两位为0的话不保留小数位
   */
  formatAmount(amount) {
    if (amount.toString().endsWith('.00')) {
      let amountSplit = amount.split('.');
      return amountSplit[0];
    } else {
      return amount;
    }
  },

  /**
   * 车主认证状态
   */
  requestAuthStatus() {
    let that = this;
    console.log(Boolean(0));
    if (that.data.loginFlag == 1) { //登录了
      let requestData = {
        url: ApiConst.GET_AUTH_STATUS,
        data: {},
        success: res => {
          this.setData({
            status: res.status,
            isDiDi: res.user_type //是否是滴滴合法车主
          })
          if (res.status == 3) {
            that.setData({
              plate_no: res.plate_no,
              real_name: res.real_name
            })
          }
        }
      }
      ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
    }
  },

  /**
   * 请求可领取奖励详情
   */
  requestAccountCoupon() {
    const that = this;
    let requestData = {
      url: ApiConst.ACCOUNT_COUPON,
      data: {},
      success: res => {
        let couponList = res.coupon_info;
        let couponCount = 0;
        if (couponList && couponList.length !== 0) {
          //状态为2表示已激活未领取的奖励, 状态为1表示未激活的奖励
          couponCount = res.coupon_info.filter(element => {
            return parseInt(element.status) === 2 || parseInt(element.status) === 1;
          }).length;
        }
        that.setData({
          incomeNumber: couponCount
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  handleAction(event) {
    console.log(event);
    let that = this;
    let item = event.currentTarget.dataset.item;
    //判断车主是否登录，推荐有奖和新手教程无需登录
    if (parseInt(that.data.loginFlag) === 0 && item.type !== CELL_TYPE[6] && item.type !== CELL_TYPE[7]) {
      ModalHelper.showWxModalShowAllWidthCallback('登录提示', '你还没有登录', '立即登录', '取消', true, res => {
        if (res.confirm) {
          that.navigateTo('../register/register');
        }
      })
      return;
    }
    switch (item.type) {
      case CELL_TYPE[8]: //注册认证
        if (this.data.status == 0) {
          that.navigateTo(item.url);
        } else {
          //审核中、审核失败、审核成功 跳转到状态页面
          that.navigateTo('../state/state');
        }
        break;
      case CELL_TYPE[9]:
        that.addCarModel(item.url);
        break;
      default:
        that.navigateTo(item.url);
        break;
    }
  },

  navigateTo(url) {
    wx.navigateTo({
      url: url,
    })
  },

  addCarModel(url) {
    ModalHelper.showWxModalShowAllWidthCallback('车型补充提示', '为了保证广告安装和广告计费正常进行，需要您补充完善车型信息', '立即补充', '取消', true, res => {
      if (res.confirm) {
        wx.navigateTo({
          url: url,
        })
      }
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