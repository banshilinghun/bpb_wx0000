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
    is_add_car_model: false,
    //是否展示过计价规则弹窗
    showRuleTip: false,
    //年检时间
    car_check_date: null,
    //一个应用周期内是否展示过年检弹窗
    visibleCheckDate: false,
    //是否是iPhone X
    isIpx: false,
    //是否展示过预约点击取消提示
    showSubscribeClickTip: false
  },

})