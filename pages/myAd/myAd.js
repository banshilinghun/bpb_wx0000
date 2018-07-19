/** 我的广告 */

const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require("../../utils/api/ApiManager.js");
const {
  $Message
} = require('../../components/base/index');

//1：排队中，可以取消排队，排队中
//2：已预约，可以取消预约，已预约，离预约时间大于等于三小时，可以取消，否则不可以
//3：签到，判断当前定位是否距服务网店小于等于500m，是，签到成功；否，预约不成功，弹窗提示；超时需要提示
//4：开始投放，开始安装广告，拍照上传激活
//5：重新投放，登记信息审核未通过
const PRE_STATUS = [1, 2, 3, 4, 5];

//按钮点击状态
const ACTION_STATUS = [1, 2, 3]

//1：投放中，未到检测时间
//2：检测中，已到检测时间，需要检测
//3：审核中，已经检测，等待后台审核
const RUN_STATUS = [1, 2, 3];

//1待投放 2运行中 3已结束
const TYPE = [1, 2, 3];

//计时器
let timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    scrollHeight: 0,
    myAdList: [],
    runStatus: RUN_STATUS[1], //投放中状态
    prepareTip: ''
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
  },

  onShow: function() {
    this.requestPrepareList();
    this.setData({
      current: 'tab1'
    })
  },

  handleChange({
    detail
  }) {
    //切换了不同的tab，先清空列表数据
    if (this.data.current !== detail.key){
      this.setData({
        myAdList: []
      })
    }
    this.setData({
      current: detail.key
    });
    switch (detail.key) {
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
    let requestData = {
      url: ApiConst.getUserPersonalAdList(),
      data: {
        type: TYPE[0]
      },
      header: app.globalData.header,
      success: res => {
        that.invokePrepare(res);
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  //格式化数据
  invokePrepare: function(res) {
    let that = this;
    console.log(res);
    if (res instanceof Array) {
      res.forEach(element => {
        element.statusObj = that.getPrepareObject(element);
        console.log(that.getPrepareObject(element));
      });
      that.setData({
        myAdList: res
      })
    } else {
      console.log('不是数组，数据格式错误'); 
      that.setData({
        myAdList: []
      })
    }
  },

  /**
   * 根据待投放状态返回对象
   */
  getPrepareObject: function (element) {
    let that = this;
    let targetObj = {};
    if (element.date){
      //时间格式化
      let dateArr = element.date.split('-');
      let target_time = dateArr[1] + '月' + dateArr[2]+ '日' +  ' ' + element.begin_time + '~' + element.end_time;
      targetObj.target_time = target_time;
    }
    switch (Number(element.classify)) {
      case PRE_STATUS[0]:
        targetObj.stateStr = '排队中';
        targetObj.status = PRE_STATUS[0];
        targetObj.action = that.requireActionList(element);
        break;
      case PRE_STATUS[1]:
        targetObj.stateStr = '已预约';
        targetObj.status = PRE_STATUS[1];

        targetObj.action = [{
          actionStr: '取消预约',
          type: ACTION_STATUS[1]
        }, {
          actionStr: '签到',
          type: ACTION_STATUS[1]
        }]
        that.getRemainTime(element);
        break;
      case PRE_STATUS[2]:
        targetObj.stateStr = '已预约';
        targetObj.status = PRE_STATUS[2];
        targetObj.actionStr = '签到';
        break;
      case PRE_STATUS[3]:
        targetObj.stateStr = '已预约';
        targetObj.status = PRE_STATUS[3];
        targetObj.actionStr = '开始投放';
        break;
      case PRE_STATUS[4]:
        targetObj.stateStr = '已预约';
        targetObj.status = PRE_STATUS[4];
        targetObj.actionStr = '重新投放';
        break;
    }
    return targetObj;
  },

  /**
   * action 按钮状态以及显示
   */
  requireActionList(element){
    let actionList = []
    switch (Number(element.classify)){
      case PRE_STATUS[0]:
        actionList.push({
          actionStr: '取消排队',
          type: ACTION_STATUS[0],
          enable: true
        });
        break;
      case PRE_STATUS[1]:
        targetObj.stateStr = '已预约';
        targetObj.status = PRE_STATUS[1];

        targetObj.action = [{
          actionStr: '取消预约',
          type: ACTION_STATUS[1]
        }, {
          actionStr: '签到',
          type: ACTION_STATUS[1]
        }]
        that.getRemainTime(element);
        break;
    }
    return actionList;
  },

  /**
   * 判断预约剩余时间，车主是否已超时
   */
  getRemainTime(element){
    //预约时间
    let that = this;
    let date = new Date(element.date + ' ' + element.end_time);
    let targetTime = date.getTime();
    clearInterval(timer);
    timer = setInterval(() => {
      //当前时间
      let currentTime = new Date().getTime();
      let remainTime = currentTime - targetTime;
      if ( remainTime > 0) { //说明已超时
        // 一个小时之内倒计时，所以为 3600
        let remainSeconds = (3600 - (currentTime - targetTime) / 1000);
        if(remainSeconds > 0){
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
          that.requestPrepareList();
        }
      } else {
        that.setData({
          prepareTip: ''
        });
      }
    }, 1000);
  },

  /**
   * 投放中列表
   */
  requestRunList: function() {
    let that = this;
    let requestData = {
      url: ApiConst.getUserPersonalAdList(),
      data: {
        type: TYPE[1]
      },
      header: app.globalData.header,
      success: res => {
        that.invokeRun(res);
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  invokeRun: function(res) {
    let that = this;
    console.log(res);
    if (res instanceof Array) {
      res.forEach(element => {
        element.statusObj = that.getRunObject(element.classify);
        console.log(that.getRunObject(element.classify));
      });
      that.setData({
        myAdList: res
      })
    } else {
      console.log('不是数组，数据格式错误');
      that.setData({
        myAdList: []
      })
    }
  },

  getRunObject: function() {
    switch (this.data.runStatus) {
      case RUN_STATUS[1]:
        return {
          stateStr: '检测中',
          status: RUN_STATUS[1],
          actionStr: '立即检测'
        };
      case RUN_STATUS[2]:
        return {
          stateStr: '审核中',
          status: RUN_STATUS[1],
          actionStr: ''
        }
      default:
        return {
          stateStr: '投放中',
          status: RUN_STATUS[0],
          actionStr: ''
        }
    }
  },

  /**
   * 已结束列表
   */
  requestFinishList: function() {
    let that = this;
    let requestData = {
      url: ApiConst.getUserPersonalAdList(),
      data: {
        type: TYPE[2]
      },
      header: app.globalData.header,
      success: res => {
        that.setData({
          myAdList: res
        })
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  //待投放 action
  handlePrepare: function(event) {
    console.log(event);
    let prepare = event.currentTarget.dataset.prepare;
    let that = this;
    let status = prepare.statusObj.status;
    switch (status) {
      case PRE_STATUS[0]: //取消排队
        that.cancelQueue(prepare.ad_id);
        break;
      case PRE_STATUS[1]: //取消预约
        that.cancelSubscribe(prepare);
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
  cancelQueue: function(adId) {
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
              ad_id: adId
            },
            header: app.globalData.header,
            success: res => {
              $Message({
                content: '取消成功',
                type: 'success'
              });
              that.requestPrepareList();
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
  cancelSubscribe: function(element) {
    let that = this;
    //判断距离预约时间截止是否大于3小时，否则不可取消
    //预约截止时间
    let date = new Date(element.date + ' ' + element.begin_time);
    let targetTime = date.getTime();
    //当前时间
    let currentTime = new Date().getTime();
    if((targetTime -  currentTime) / 1000 < 3600 * 3){
      wx.showModal({
        title: '取消提示',
        content: '您已错过取消时间，\n可联系客服协助处理！',
        cancelText: '联系客服',
        confirmText: '我知道了',
        success: res => {
          if(res.cancel){
            wx.switchTab({
              url: '../QAservice/service'
            })
          }
        }
      })
    } else {
      that.showLoading();
      let requestData = {
        url: ApiConst.cancelSubcribe(),
        data: {
          subscribe_id: element.subscribe_id
        },
        header: app.globalData.header,
        success: res => {
          $Message({
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

  },

  /**
   * 查看广告详情
   */
  handleDetail: function(event) {
    let that = this;
    wx.navigateTo({
      url: '../details/details?adId=' + event.currentTarget.dataset.item.ad_id
    })
  },

  showLoading: function() {
    wx.showLoading({
      title: '加载中🚗...',
    })
  },

  hideLoading: function() {
    wx.hideLoading();
  }

})