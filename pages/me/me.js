const app = getApp();
var util = require("../../utils/common/util");
const {
  $Toast
} = require('../../components/base/index');
const Constant = require("../../utils/constant/Constant");
const shareUtil = require("../../utils/module/shareUtil");
const dotHelper = require("./dotHelper.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require("../../utils/api/ApiConst.js");
const ModalHelper = require("../../helper/ModalHelper");
const MineData = require("./data");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeCells: MineData.incomeCells,
    ExceptionCells: MineData.ExceptionCells,
    actionCells: MineData.actionCells,
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
    //是否显示推荐有奖
    let actionCells = that.data.actionCells;
    actionCells[0].visible = app.globalData.shareFlag;
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
    actionCell = actionCell.filter(element => element.type !== MineData.CAR_MODAL);
    if (app.globalData.is_add_car_model) {
      actionCell.push(MineData.carModelCell);
    }
    that.setData({
      actionCells: actionCell
    })
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
            isDiDi: parseInt(res.user_type) === 1 //是否是滴滴合法车主
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
    if (parseInt(that.data.loginFlag) === 0 && item.type !== MineData.RECOMMEND && item.type !== MineData.COURSE) {
      ModalHelper.showWxModalShowAllWidthCallback('登录提示', '你还没有登录', '立即登录', '取消', true, res => {
        if (res.confirm) {
          that.navigateTo('../register/register');
        }
      })
      return;
    }
    switch (item.type) {
      case MineData.AUTH: //注册认证
        if (this.data.status == 0) {
          that.navigateTo(item.url);
        } else {
          //审核中、审核失败、审核成功 跳转到状态页面
          that.navigateTo('../state/state');
        }
        break;
      case MineData.CAR_MODAL:
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