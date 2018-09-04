
/** 
 * todo 
 * 1、超时未签到处理
 * 2、地理位置显示处理，距离显示
 * 3、多个计时器
 */


const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require("../../utils/api/ApiManager.js");
const util = require("../../utils/common/util.js");
const timeUtil = require("../../utils/time/timeUtil");
const LoadingHelper = require("../../helper/LoadingHelper");
const ModalHelper = require("../../helper/ModalHelper");
const StrategyHelper = require("../../helper/StrategyHelper");
const StringUtil = require("../../utils/string/stringUtil");
const {
  $Toast
} = require('../../components/base/index');

//subscribed: 已预约未签到 | subscribeOvertime 预约中，已超时 | signedWaitInstall: 已签到未安装 | installing: 安装中 | installed: 安装完成待上画 | rework: 返工预约 
//installAudit: 安装审核 | installFail: 安装审核失败 | runingFixed: 投放中固定收益  | runingByTime: 投放中按时计费 | needCheck: 待检测 | checkAudit: 检测审核中 | checkfail: 审核失败

// 计时器
let timer;
//记录请求任务列表时loading加载状态，只在第一次请求时显示
let loadingFirst = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: {
      runningTask: [],
      overTask: []
    },
    status: '', //请确认等待广告安装完毕或提醒安装人员确认安装结束
    isDiDi: false,
    installTime: '',
    waitTime: '',
    installOverTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    this.requestTaskList();
  },

  onPullDownRefresh(){
    this.requestTaskList();
  },

  requestTaskList() {
    const that = this;
    //清除timer
    clearInterval(timer);
    if(loadingFirst){
      LoadingHelper.showLoading();
    }
    let requestData = {
      url: ApiConst.GET_MY_TASK_LIST,
      data: {},
      header: app.globalData.header,
      success: res => {
        //进行中
        let runningTempTask = res.runningTask;
        if (runningTempTask && Object.keys(runningTempTask).length !== 0) {
          runningTempTask.date = timeUtil.formatDateTimeSprit(runningTempTask.begin_date) + "-" + timeUtil.formatDateTimeSprit(runningTempTask.end_date);
          runningTempTask.ad_name = StringUtil.formatAdName(runningTempTask.ad_name, runningTempTask.city_name);
          runningTempTask.statusStr = StrategyHelper.getTaskStatusStr(StrategyHelper.getCurrentStatus(runningTempTask));
          //初始化状态
          that.setData({
            status: StrategyHelper.getCurrentStatus(runningTempTask),
          })
          //计算距离 process=1 || process=2
          that.transformReserve(runningTempTask);
          //签到未安装等待时间,等待人数  process=3
          that.transformWait(runningTempTask);
          //安装数据处理
          that.transformInstall(runningTempTask);
          //判断视图显示隐藏
          runningTempTask.action = StrategyHelper.getTaskActionDisplay(runningTempTask);
          //按时计费数据处理
          that.transformByTime(runningTempTask);
        } else {
          runningTempTask = null;
        }
        //已完成数据处理
        that.transformOverTask(res.overTask);
        that.setData({
          runningTask: runningTempTask,
          overTask: res.overTask
        })
      },
      complete: res => {
        if(loadingFirst){
          LoadingHelper.hideLoading();
          loadingFirst = false;
        }
        wx.stopPullDownRefresh();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  transformReserve(runningTempTask){
    const that = this;
    if (runningTempTask.reserveDate) {
      runningTempTask.reserveDate.subscribeTime = timeUtil.formatDateTime(runningTempTask.reserveDate.date) + " " + runningTempTask.reserveDate.begin_time + "-" + runningTempTask.reserveDate.end_time;
      that.calculateDistance(runningTempTask.reserveDate.lat, runningTempTask.reserveDate.lng).then(distance => {
        that.setData({
          distance: distance
        })
      });
    }
  },

  transformWait(runningTempTask){
    const that = this;
    if (runningTempTask.waitInfo) {
      let nowTime = timeUtil.getTimeStapOnlyDate(runningTempTask.now_date);
      let waitTime = Math.floor(nowTime - runningTempTask.waitInfo.signInDate);
      that.lopperWaitTime(waitTime);
      that.setData({
        waitInfo: runningTempTask.waitInfo,
        waitTime: that.formatTime(waitTime)
      })
    }
  },

  /**
   * 安装等待时间计时
   */
  lopperWaitTime(waitTimeParam) {
    timer = setInterval(() => {
      waitTimeParam++;
      this.setData({
        waitTime: this.formatTime(waitTimeParam)
      })
    }, 1000);
  },

  transformInstall(runningTempTask){
    const that = this;
    if (runningTempTask.installInfo) {
      if (!runningTempTask.installInfo.end_time) {
        //安装中，安装时间 process=4
        let installTime = Math.floor(runningTempTask.installInfo.now_date - runningTempTask.installInfo.begin_time);
        that.lopperInstallTime(installTime);
        that.setData({
          installTime: that.formatTime(installTime)
        })
      } else {
        //安装完成待上画
        that.setData({
          installOverTime: that.formatTime(Math.floor(runningTempTask.installInfo.end_time - runningTempTask.installInfo.begin_time))
        })
      }
    }
  },

  /**
   * 安装用时
   * @param {*} 已安装时间 
   */
  lopperInstallTime(installTimeParam) {
    timer = setInterval(() => {
      installTimeParam++;
      this.setData({
        installTime: this.formatTime(installTimeParam)
      })
    }, 1000);
  },

  /**
   * 按时计费数据处理
   */
  transformByTime(runningTempTask){
    let yesterdayAmount = runningTempTask.yesterdayAmount;
    if(yesterdayAmount){
      let level = parseInt(yesterdayAmount.level);
      // level: 在线时长等级,duration_min 和 duration_max 只在 等级为 1 和 2 时返回
      if(level === 1 || level === 2){
        yesterdayAmount.durationStr = `${yesterdayAmount.duration_min}~${yesterdayAmount.duration_max}`;
      } else if(level === 3 || level === 4){
        yesterdayAmount.durationStr = yesterdayAmount.duration;
      }
    }
  },

  transformOverTask(overTaskList){
    const that = this;
    if(overTaskList && overTaskList.length !== 0){
      overTaskList.forEach(element => {
        element.ad_name = StringUtil.formatAdName(element.ad_name, element.city_name);
        element.begin_date = timeUtil.formatDateTime(element.begin_date);
        element.end_date = timeUtil.formatDateTime(element.end_date);
      });
    }
  },

  formatTime(targetTime) {
    let days = Math.floor(targetTime / (3600 * 24));
    let hours = Math.floor((targetTime % (3600 * 24)) / 3600);
    let minutes = Math.floor((targetTime % 3600) / 60);
    let seconds = targetTime % 60;
    let tempTime = (days == 0 ? '' : `${days}天`) + (hours == 0 && days == 0 ? '' : `${hours}时`) + (minutes == 0 && days == 0 && hours == 0 ? '' : `${minutes}分`) + (`${seconds}秒`);
    return tempTime;
  },

  /**
   * 判断预约剩余时间，车主是否已超时
   */
  getRemainTime(element) {
    //预约时间
    let that = this;
    let targetTime = timeUtil.getTimeStapByDate(element.date, element.end_time);
    timer = setInterval(() => {
      //当前时间
      let currentTime = new Date().getTime() / 1000;
      let remainTime = currentTime - targetTime;
      if (remainTime > 0) { //说明已超时
        // 一个小时之内倒计时，所以为 3600
        let remainSeconds = 3600 - (currentTime - targetTime);
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
   * 处理按钮点击事件
   */
  handleAction() {
    let that = this;
    let actionStrategy = {
      subscribed: function () {
        that.sign();
      },
      subscribeOvertime: function () {
        that.sign();
      },
      //安装审核不合格，需重新上画
      rework: function () {
        that.sign();
      },
      //安装审核不合格，需重新拍照审核
      installFail: function () {
        that.uploadInstallPicture();
      },
      //待上画
      installed: function () {
        that.uploadInstallPicture();
      },
      //待检测
      needCheck: function () {
        that.uploadCheckPicture();
      },
      //检测审核不合格，需重新拍照检测
      checkfail: function () {
        that.uploadCheckPicture();
      }
    }
    console.log('status---------->' + that.data.status);
    actionStrategy[that.data.status]();
  },

  /**
   * 上传车辆安装画面
   */
  uploadInstallPicture() {
    let that = this;
    let registObj = {
      classify: that.data.runningTask.classify,
      regist_id: that.data.status === StrategyHelper.INSTALL_FAIL? that.data.runningTask.registInfo.regist_id : that.data.runningTask.regist_id,
      flag: StrategyHelper.REGIST
    }
    wx.navigateTo({
      url: '../check/check?intent=' + JSON.stringify(registObj)
    })
  },

  /**
   * 上传车辆检测画面
   */
  uploadCheckPicture() {
    let that = this;
    let registObj = {
      classify: that.data.runningTask.classify,
      check_id: that.data.runningTask.detectionInfo.detection_id,
      flag: StrategyHelper.CHECK
    }
    wx.navigateTo({
      url: `../checkCourse/checkCourse?intent=${ JSON.stringify(registObj) }&flag=1`
    })
  },

  /**
   * 取消预约
   */
  handleUnSubscribe() {
    let that = this;
    //判断距离预约时间截止是否大于3小时，否则不可取消
    let targetTime = timeUtil.getTimeStapByDate(that.data.runningTask.reserveDate.date, that.data.runningTask.reserveDate.begin_time);
    //当前时间
    let currentTime = timeUtil.getTimeStapOnlyDate(that.data.runningTask.now_date);
    if ((targetTime - currentTime) < 3600 * 3) {
      that.setData({
        visibleSubTip: true
      })
    } else {
      that.setData({
        visibleSubCancelModel: true
      })
    }
  },

  /**
   * 签到
   */
  sign() {
    let that = this;
    LoadingHelper.showLoading();
    let lat = that.data.status === StrategyHelper.REWORK? that.data.runningTask.stationInfo.lat : that.data.runningTask.reserveDate.lat;
    let lng = that.data.status === StrategyHelper.REWORK? that.data.runningTask.stationInfo.lng : that.data.runningTask.reserveDate.lng;
    that.calculateDistance(lat, lng).then(distance => {
      //限制在服务网点五百米范围内可签到
      if (distance * 1000 > 500) {
        LoadingHelper.hideLoading();
        that.setData({
          visibleSign: true
        })
      } else {
        that.sendSignRequest();
      }
    });
  },

  calculateDistance(serverLat, serverLng) {
    const that = this;
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          console.log('lat----->' + res.latitude);
          console.log('lng----->' + res.longitude);
          // 22.532809, 113.926436
          //113.932713,22.538789
          //22.532620,113.926930
          let distance = util.getDistance(res.latitude, res.longitude, serverLat, serverLng);
          console.log('distance------------>' + distance);
          resolve(distance.toFixed(2));
        }
      })
    });
  },

  sendSignRequest() {
    const that = this;
    let requestData = {
      url: ApiConst.COMMIT_RESERVE_SIGNIN,
      data: {},
      header: app.globalData.header,
      success: res => {
        $Toast({
          content: '签到成功',
          type: 'success'
        })
        that.requestTaskList();
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 关闭签到距离提示弹窗,并跳转导航
   */
  handleSignTipdConfirm() {
    this.setData({
      visibleSign: false
    })
    this.handleNavigation();
  },

  /**
   * 联系客服
   */
  handleContactService() {
    wx.switchTab({
      url: '../QAservice/service'
    })
    this.setData({
      visibleSubTip: false
    })
  },

  /**
   * 超时不可取消确认
   */
  handleUnableCancel() {
    this.setData({
      visibleSubTip: false
    })
  },

  /**
   * 导航
   */
  handleNavigation() {
    const that = this;
    if (that.data.status === StrategyHelper.REWORK) {
      let stationInfo = that.data.runningTask.stationInfo;
      wx.openLocation({
        longitude: Number(stationInfo.lng),
        latitude: Number(stationInfo.lat),
        name: stationInfo.name,
        address: stationInfo.address
      })
    } else {
      let reserveInfo = that.data.runningTask.reserveDate;
      wx.openLocation({
        longitude: Number(reserveInfo.lng),
        latitude: Number(reserveInfo.lat),
        name: reserveInfo.server_name,
        address: reserveInfo.address
      })
    }
  },

  /**
   * 显示完整地址
   */
  handleShowAddress(event) {
    ModalHelper.showWxModal('网点地址确认', event.currentTarget.dataset.address, '我知道了', false);
  },

  handleAdDetail(event) {
    console.log(event);
    wx.navigateTo({
      url: '../details/details?adId=' + event.currentTarget.dataset.adid,
    })
  },

  /**
   *暂不取消预约
   */
  handleNotCancel() {
    this.setData({
      visibleSubCancelModel: false
    })
  },

  /**
   *确认取消预约
   */
  handleSureCancel() {
    const that = this;
    that.setData({
      showCancelLoading: true
    })
    that.sendCancelSubscribeRequest();
  },

  sendCancelSubscribeRequest() {
    const that = this;
    let requestData = {
      url: ApiConst.CANCEL_USER_RESERVE,
      data: {},
      header: app.globalData.header,
      success: res => {
        $Toast({
          content: '取消成功',
          type: 'success'
        });
        that.setData({
          visibleSubCancelModel: false
        })
        that.requestTaskList();
      },
      complete: res => {
        that.setData({
          showCancelLoading: false
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  }

})