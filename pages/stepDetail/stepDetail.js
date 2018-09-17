// pages/stepDetail/stepDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    stepArray: [{
      title: '预约'
    }, {
      title: '签到'
    }, {
      title: '车行安装'
    }, {
      title: '上画登记'
    }, {
      title: '安装审核'
    }, {
      title: '奔跑中'
    }, {
      title: '检测'
    }, {
      title: '检测审核'
    }, {
      title: '广告结束'
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.status){
      this.setData({
        current: this.getCurrentStep(options.status)
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
      installing: () => 2,
      installed: () => 3,
      installAudit: () => 4,
      installFail: () => strategy.installed(),
      rework: () => strategy.subscribed(),
      runingFixed: () => 5,
      runingByTime: () => strategy.runingFixed(),
      needCheck: () => 6,
      checkAudit: () => 7,
      checkfail: () => strategy.needCheck()
    }
    let currentStep = 1;
    try{
      currentStep =  strategy[status]();
    } catch(error) {
      currentStep = 8;
    }
    console.log('currentStep----------->' + currentStep)
    return currentStep;
  }

})