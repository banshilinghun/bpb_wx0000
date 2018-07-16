/** 我的广告 */

//1：排队中，可以取消排队，排队中
//2：已预约，可以取消预约，已预约，离预约时间大于等于三小时，可以取消，否则不可以
//3：签到，判断当前定位是否距服务网店小于等于500m，是，签到成功；否，预约不成功，弹窗提示；超时需要提示
//4：开始投放，开始安装广告，拍照上传激活
//5：重新投放，登记信息审核未通过
const PRE_STATUS = [1, 2, 3, 4, 5];

//1：投放中，未到检测时间
//2：检测中，已到检测时间，需要检测
//3：审核中，已经检测，等待后台审核
const RUN_STATUS = [1, 2, 3];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    scrollHeight: 0,
    myAdList: [],
    adId: '',
    preStatus: PRE_STATUS[0], //待投放状态
    runStatus: RUN_STATUS[1], //投放中状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        wx.createSelectorQuery().select('.tab-wrapper').boundingClientRect(function(rect) {
          that.setData({
            scrollHeight: res.windowHeight - rect.height
          })
        }).exec()
      }
    });
    that.requestPrepareList();
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
    switch(detail.key){
      case 'tab2':
        this.requestRunList();
        break;
      case 'tab3':
        this.requestFinishList();
        break;
      default:
        this.requestPrepareList();
        break;
    }
  },

  /**
   * 待投放列表
   */
  requestPrepareList: function() {
    let that = this;
    switch (that.data.preStatus){
      case PRE_STATUS[0]:
        that.setData({
          myAdList: [{
            stateStr: '排队中',
            status: PRE_STATUS[0],
            actionStr: '取消排队'
          }]
        })
        break;
      case PRE_STATUS[1]:
        that.setData({
          myAdList: [{
            stateStr: '已预约',
            status: PRE_STATUS[1],
            actionStr: '取消预约'
          }]
        })
        break;
      case PRE_STATUS[2]:
        that.setData({
          myAdList: [{
            stateStr: '已预约',
            status: PRE_STATUS[2],
            actionStr: '签到'
          }]
        })
        break;
      case PRE_STATUS[3]:
        that.setData({
          myAdList: [{
            stateStr: '已预约',
            status: PRE_STATUS[3],
            actionStr: '开始投放'
          }]
        })
        break;
      case PRE_STATUS[4]:
        that.setData({
          myAdList: [{
            stateStr: '已预约',
            status: PRE_STATUS[4],
            actionStr: '重新投放'
          }]
        })
        break;
    }
  },

  /**
   * 投放中列表
   */
  requestRunList: function() {
    switch (this.data.runStatus) {
      case RUN_STATUS[1]:
        this.setData({
          myAdList: [{
            stateStr: '检测中',
            status: RUN_STATUS[1],
            actionStr: '立即检测'
          }]
        })
        break;
      case RUN_STATUS[2]:
        this.setData({
          myAdList: [{
            stateStr: '审核中',
            status: RUN_STATUS[1],
            actionStr: ''
          }]
        })
        break;
      default:
        this.setData({
          myAdList: [{
            stateStr: '投放中',
            status: RUN_STATUS[0],
            actionStr: ''
          }]
        })
        break;
    }
  },

  /**
   * 已结束列表
   */
  requestFinishList: function() {
    this.setData({
      myAdList: [1, 1, 1, 1, 1, 1, 1]
    })
  },

  showDetail: function(event) {
    //todo
    let that = this;
    wx.navigateTo({
      url: '../details/details?adId=' + that.data.adId
    })
  },

  //待投放 action
  handlePrepare: function(event) {
    console.log(event);
    let that = this;
    let status = event.currentTarget.dataset.prepare.status;
    switch (status) {
      case PRE_STATUS[0]: //取消排队
        that.cancelQueue();
        break;
      case PRE_STATUS[1]: //取消预约
        that.cancelSubscribe();
        break;
      case PRE_STATUS[2]: //签到
        that.signIn();
        break;
      case PRE_STATUS[3]: //开始投放
        that.active();
        break;
      case PRE_STATUS[4]: //重新投放
        break;
    }
  },

  /**
   * 取消排队
   */
  cancelQueue: function() {
    var that = this;
    wx.showModal({
      title: '取消确认',
      content: '您确认取消当前排队吗？',
      confirmText: '确认取消',
      cancelText: '再想想',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '奔跑中🚗...',
          })
          let requestData = {
            url: ApiConst.cancelQueue(),
            data: {
              ad_id: that.data.adId
            },
            header: app.globalData.header,
            success: res => {
              that.setData({
                isQueueing: false,
                subActionText: '预约排队'
              });
              wx.showToast({
                title: '取消排队成功',
                icon: 'success'
              });
              that.requestQueueList();
            },
            complete: res => {
              wx.hideLoading();
            }
          }
          ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
        }
      }
    })
  },

  /**
   * 取消预约
   */
  cancelSubscribe: function() {
    var that = this;
    //todo 预约id
    var subscribe_id = this.data.selId;
    let requestData = {
      url: ApiConst.cancelSubcribe(),
      data: {
        subscribe_id: that.data.subscribe_id
      },
      header: app.globalData.header,
      success: res => {
        wx.showToast({
          title: "取消成功"
        })
        that.onShow(0);
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 签到
   */
  signIn: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        let distance = util.getDistance(res.latitude, res.longitude, marker.lat, marker.lng);
      }
    })
  },

  /**
   * 投放
   */
  active: function() {

  },

  /**
   * 重新投放
   */
  reActive: function() {

  },

  //投放中 action
  handleRun: function(event) {
    console.log(event);
    let that = this;
    let status = event.currentTarget.dataset.run.status;
    switch (status) {
      case RUN_STATUS[1]: //检测
        that.inspect();
        break;
    }
  },

  /**
   * 检测
   */
  inspect: function() {

  }

})