
const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require("../../utils/api/ApiManager.js");
const util = require("../../utils/common/util.js");
const {
  $Toast
} = require('../../components/base/index');

//subscribed: 已预约未签到 | signed: 已签到未安装 | installed: 安装完成待上画
const STATUS = ['subscribed', 'signed', 'installed', 'installAudit', 'installFail', 'runing', 'needCheck', 'checkAudit', 'checkfail'];
// 计时器
let timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSignCancel: false,
    task: {
      runList: [{}],
      finishList: [{
        adLogo: 'https://images.unsplash.com/photo-1506666488651-1b443be39878?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3c929314485c6745507b81314b5e7608&auto=format&fit=crop&w=800&q=60',
        adName: '麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳',
        income: '565',
        date: '07月12日-8月11日'
      }]
    },
    status: STATUS[0], //请确认等待广告安装完毕或提醒安装人员确认安装结束
    isDiDi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 判断预约剩余时间，车主是否已超时
   */
  getRemainTime(element) {
    //预约时间
    let that = this;
    let date = new Date(element.date + ' ' + element.end_time);
    let targetTime = date.getTime();
    clearInterval(timer);
    timer = setInterval(() => {
      //当前时间
      let currentTime = new Date().getTime();
      let remainTime = currentTime - targetTime;
      if (remainTime > 0) { //说明已超时
        // 一个小时之内倒计时，所以为 3600
        let remainSeconds = (3600 - (currentTime - targetTime) / 1000);
        if (remainSeconds > 0) {
          //剩余分钟数
          let minutes = Math.floor(remainSeconds / 60);
          //剩余秒数
          let seconds = Math.floor(remainSeconds % 60);
          that.setData({
            prepareTip: '已超时！剩余' + minutes + '分' + seconds + '秒自动取消'
          });
        } else {
          that.setData({
            prepareTip: ''
          });
        }
      } else {
        that.setData({
          prepareTip: ''
        });
      }
    }, 1000);
  },

  /**
   * 取消预约
   */
  handleCancelSubscribe(){
    let that = this;
    //判断距离预约时间截止是否大于3小时，否则不可取消
    //预约截止时间
    let date = new Date(element.date + ' ' + element.begin_time);
    let targetTime = date.getTime();
    //当前时间
    let currentTime = new Date().getTime();
    if ((targetTime - currentTime) / 1000 < 3600 * 3) {
      wx.showModal({
        title: '取消提示',
        content: '您已错过取消时间，\n可联系客服协助处理！',
        cancelText: '联系客服',
        confirmText: '我知道了',
        success: res => {
          if (res.cancel) {
            wx.switchTab({
              url: '../QAservice/service'
            })
          }
        }
      })
    } else {
      that.showLoading();
      let requestData = {
        url: ApiConst.CANCEL_SUBSCRIBE,
        data: {
          subscribe_id: element.subscribe_id
        },
        header: app.globalData.header,
        success: res => {
          $Toast({
            content: '取消成功',
            type: 'success'
          });
          that.requestPrepareList();
        },
        complete: res => {
          that.hideLoading();
        }
      }
      ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
    }
  },

  /**
   * 处理按钮点击事件
   */
  handleAction(){
    let that = this;
    switch (that.data.status){
      case 'subscribed':  //需要签到
        that.sign();
       break;
      case 'signed':      //待上画
      case 'installed':
       break;
      case 'installFail': //安装审核不合格，需重新上画
        break;
      case 'needCheck':   //待检测
        break;
      case 'checkfail':   //检测审核不合格，需重新拍照检测
        break;
    }
  },

  /**
   * 签到
   */
  sign(){
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log('lat----->' + res.latitude);
        console.log('lng----->' + res.longitude);
        // 22.532809, 113.926436
        //113.932713,22.538789
        //22.532620,113.926930
        let distance = util.getDistance(res.latitude, res.longitude, '22.538789', '113.932713');
        console.log('distance------------>' + distance);
        //限制在服务网点五百米范围内可签到
        if(distance * 1000 > 500){
          that.setData({
            visibleSign: true
          })
        }else{
          $Toast({
            content: '签到成功',
            type: 'success'
          })
        }
      }
    })
  },

  handleSignTipdConfirm(){
    this.setData({
      visibleSign: false
    })
  }

})