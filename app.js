//app.js
const app = getApp();
//user_type 为1时表示滴滴认证,其余状态为普通

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
    needAddCarModel: false,
    showAuthTip: false,
    //是否展示过计价规则弹窗
    showRuleTip: false
  },

})