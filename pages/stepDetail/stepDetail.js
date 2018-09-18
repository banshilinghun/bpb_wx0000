const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require("../../utils/api/ApiConst.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    stepArray: [{
      title: '预约',
      content: '车主领取广告任务，就近选择服务网点并预约安装时间'
    }, {
      title: '签到',
      content: '车主在预约时间内导航前往服务网点，并在程序内签到'
    }, {
      title: '安装',
      content: '网点工作人员免费安装广告'
    }, {
      title: '激活',
      content: '车主在程序内拍摄广告照片并上传，后台审核后激活广告'
    }, {
      title: '奔跑',
      content: '广告激活后车主正常跑车接单，中途如有疑问请及时联系【奔跑宝】客服'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestAuthStatus(options.status);
  },

  /**
   * 车主认证状态
   */
  requestAuthStatus(status) {
    let that = this;
    let requestData = {
      url: ApiConst.GET_AUTH_STATUS,
      data: {},
      success: res => {
        let stepArray = that.data.stepArray;
        if (parseInt(res.user_type) === 1) { //是否是滴滴合法车主
          stepArray.push({
            title: '检测',
            content: '广告任务结束后，车主在程序内拍摄广告照片并上传，审核通过后即可在【滴滴】车主端内提现广告收益'
          })
        } else {
          stepArray.push({
            title: '检测',
            content: '广告任务结束后，车主在程序内拍摄广告照片并上传，审核通过后即可提现广告收益'
          })
        }
        that.setData({
          stepArray: stepArray
        })
        that.initStep(status);
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  initStep(status) {
    if (status) {
      this.setData({
        current: this.getCurrentStep(status)
      })
    } else {
      this.setData({
        current: 0
      })
    }
  },

  getCurrentStep(status) {
    console.log('status------------>' + status)
    let strategy = {
      subscribed: () => 1,
      subscribeOvertime: () => strategy.subscribed(),
      signedWaitInstall: () => 2,
      installing: () => strategy.signedWaitInstall(),
      installed: () => 3,
      installAudit: () => strategy.installed(),
      installFail: () => strategy.installed(),
      rework: () => strategy.subscribed(),
      runingFixed: () => 4,
      runingByTime: () => strategy.runingFixed(),
      needCheck: () => 5,
      checkAudit: () => strategy.needCheck(),
      checkfail: () => strategy.needCheck()
    }
    let currentStep = 1;
    currentStep = strategy[status]();
    console.log('currentStep----------->' + currentStep)
    return currentStep;
  }

})