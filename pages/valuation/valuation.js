// pages/valuation/valuation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textSmall: false,
    tableHeight: 360,
    scale: 0.467,
    imageHeight: 0,
    valuList: ['1．在线时长数值向下取整数，例如车主在线6.8小时，以6小时计算。', '2．当日收益将于第二日中午12时前计入车主【我的】-【待收收益】内，活动补贴在车主安装广告后，3个工作日充值到车主的奔跑宝账户。完成广告任务后，即可提现。', '3．【滴滴车主APP】当日在线时长统计时间段为当日的00:00-23:59。', '4．此计价规则仅适用于【滴滴出行平台】内持有《网络预约出租汽车驾驶员证》、《网络预约出租汽车运输证》的车主。', '5．本计价规则最终解释权归深圳奔跑宝科技有限公司所有。']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.arrangementData)
    if (options.arrangementData==undefined){
       that.setData({
         goFlag:0
       })
    }else{
      that.setData({
        goFlag: 1,
        arrangementData: options.arrangementData
      })
    }
  
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          imageHeight: res.windowWidth * that.data.scale
        });
      },
    })
  },

  knowListener: function(){
    var that=this;
    if (that.data.goFlag==0){
      wx.navigateBack({
        delta: 1,
      })
    }else{
      wx.navigateTo({
        url: '../arrangement/arrangement?arrangementData=' + that.data.arrangementData+'&backFlag=1'
      })
    }
  },

  callPhoneListener: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber,
    })
  }

})