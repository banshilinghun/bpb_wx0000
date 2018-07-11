//app.js
const app = getApp();

App({
  onLaunch: function () {
    // 获取用户信息
  },

  globalData: {
    userInfo: null,
    login: 0,
    uid:'',
    recomId:null,
    recomType:null,
    recomAdId:null,
    header: {
      'Cookie': '',
      'content-type': 'application/json'
    },
    //分享传入的邀请人的id
    shareInviteId: '',
    checkStaus: '',
    isFirst:false,
    //分享开关
    shareFlag: false,
    //是否已经展示认证弹窗
    showAuthTip: false,
    //需要补全车型信息
    needAddCarModel: false
  },

})