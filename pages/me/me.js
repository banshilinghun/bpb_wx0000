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
    that.initReuqest();
  },

  initReuqest(){
    const that = this;
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
    //获取最新一次安装的广告
    that.requestRecentlyAdInfo();
  },

  onPullDownRefresh() {
    this.initReuqest();
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
    const that = this;
    let requestData = {
      url: ApiConst.USER_ACCOUNT,
      data: {},
      success: res => {
        if (res != null) {
          this.setData({
            amount: that.formatAmount(util.toDecimal2(res.amount)),
            total: that.formatAmount(util.toDecimal2(res.total_amount)),
            rate: (res.rate) * 100
          });
        }
      },
      complete: res => {
        wx.stopPullDownRefresh();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
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

  requestRecentlyAdInfo(){
    let that = this;
    let requestData = {
      url: ApiConst.GET_LAST_AD_INFO,
      data: {},
      success: res => {
        that.setData({
          recentlyAdInfo: res
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
      case MineData.DECLARE:
        that.goDeclare(item.url);
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

  goDeclare(url){
    wx.navigateTo({
      url: url + '&adInfo=' + JSON.stringify(this.data.recentlyAdInfo)
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