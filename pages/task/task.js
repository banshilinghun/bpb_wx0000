
//subscribed: 已预约未签到 | signed: 已签到未安装 | installed: 安装完成待上画
const STATUS = ['subscribed', 'signed', 'installed', 'installAudit', 'installFail', 'runing', 'needCheck', 'checkAudit', 'checkfail'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: {
      runList: [{}],
      finishList: [{
        adLogo: 'https://images.unsplash.com/photo-1506666488651-1b443be39878?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3c929314485c6745507b81314b5e7608&auto=format&fit=crop&w=800&q=60',
        adName: '麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳麦当劳',
        income: '565',
        date: '07月12日-8月11日'
      }]
    },
    status: STATUS[8], //请确认等待广告安装完毕或提醒安装人员确认安装结束
    isDiDi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

})