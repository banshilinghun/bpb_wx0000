//app.js
const app = getApp();

//正式域名
const releaseDomain = 'https://wxapi.benpaobao.com/';
//是否是发布状态，上线时改为true
const release = true;
//true-ken测试地址，false-小彭测试地址
const domainStatus = false;

App({
  onLaunch: function () {
    // 获取用户信息
    this.globalData.baseUrl = this.getApiUrl();
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
    baseUrl: releaseDomain,
    isFirst:false
  },

  /**
   * 加载域名
   */
  getApiUrl: function(){
    if(release){
      return releaseDomain;
    }else{
      return domainStatus ? 'http://192.168.1.114:8000/' : 'http://192.168.1.142:8000/';
    }
  }
})