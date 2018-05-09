//app.js
const app = getApp()
//app.userInfo={};
App({
  onLaunch: function () {
    // 获取用户信息
    

  },

  globalData: {
    userInfo: null,
    login: 0,
    header: {
      'Cookie': '',
      'content-type': 'application/json'
    },
    //分享传入的邀请人的id
    shareInviteId: '',
    checkStaus: '',
    baseUrl: 'https://wxapi.benpaobao.com/',
    //baseUrl: 'http://192.168.1.141:8000/',
  }
})