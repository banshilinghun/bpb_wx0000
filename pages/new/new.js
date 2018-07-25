const app = getApp();
var util = require("../../utils/util.js");
const {
  $Toast
} = require('../../components/base/index');
const Constant = require("../../utils/Constant.js");
const shareUtil = require("../../utils/shareUtil.js");
const dotHelper = require("../../pages/me/dotHelper.js");
const ApiConst = require("../../utils/api/ApiConst.js");

//1:提现，2:提现记录 3:收益记录 4:损坏申报 5:掉漆申报 6:违章申报 7:推荐有奖 8:新手教程 9:注册认证
const CELL_TYPE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeCells: [{
        type: 1,
        text: '提现',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-2ae97187059b243b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '../withdraw/withdraw',
        visible: true
      },
      {
        type: 2,
        text: '提现记录',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-c787785ebf84d971.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        url: '../withdrawRecord/withdrawRecord',
        visible: true
      }, {
        type: 3,
        text: '收益记录',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-90fb413fc672c3dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        url: '../earningRecord/earningRecord',
        visible: true
      }
    ],
    ExceptionCells: [{
        type: 4,
        text: '损坏申报',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-23ef57a41ce19448.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '../declare/declare?type=damage',
        visible: true
      },
      {
        type: 5,
        text: '掉漆申报',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-51f84e196a11b983.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        url: '../declare/declare?type=drop',
        visible: true
      }, {
        type: 6,
        text: '违章申报',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-d6d2717348a94b1f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        url: '../declare/declare?type=violate',
        visible: true
      }
    ],
    actionCells: [{
        type: 7,
        text: '推荐有奖',
        icon: '../../image/shmgc.png',
      url: '../recommend/recommend?flag=recommend',
        visible: true
      },
      {
        type: 8,
        text: '新手教程',
        icon: 'https://upload-images.jianshu.io/upload_images/4240944-9d66c194774e98c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        url: '../teaching/teaching',
        visible: true
      }, {
        type: 9,
        text: '注册认证',
        icon: '../../image/card.png',
        url: '',
        visible: true
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  handleAction(event) {
    console.log(event);
    let that = this;
    let item = event.currentTarget.dataset.item;
    //判断车主是否登录，推荐有奖无需登录
    if ((item.type != CELL_TYPE[6] || item.type != CELL_TYPE[7]) && app.globalData.login == 0) {
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

        break;
      default:
        break;
    }
  },

  navigateTo(url) {
    wx.navigateTo({
      url: url,
    })
  }

})