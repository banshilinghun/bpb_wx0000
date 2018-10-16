
const url = '../QAcell/QAcell';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prove: [{ cellTitle: '合法证明！', path: '../prove/prove', src: 'https://wxapi.benpaobao.com/static/app_img/v2/b-prove-icon.png' },],
    cellList: [
      { cellTitle: '我们是谁？', path: url + '?flag=1', src: '../../image/who.png'},
      { cellTitle: '如何赚钱？', path: url + '?flag=2', src: '../../image/make_money.png'},
      { cellTitle: '拒绝法盲！', path: url + '?flag=3', src: '../../image/law.png'},
      { cellTitle: '其它问题。', path: url + '?flag=4', src: '../../image/other.png'}],
    protocol: [{ cellTitle: '服务合作协议。', path: '../protocol/index', src: 'https://wxapi.benpaobao.com/static/app_img/v2/b-protocol-icon.png' }],
    bannerHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          bannerHeight: res.windowWidth * 0.34667
        })
      }
    })
  },

  navigateListener: function(e){
    console.log(e);
    wx.navigateTo({
      url: e.detail.cell.path + '&title=' + e.detail.cell.cellTitle,
    })
  },

  protocolListener(event){
    wx.navigateTo({
      url: event.detail.cell.path,
    })
  },

  proveListener(event){
    wx.navigateTo({
      url: event.detail.cell.path,
    })
  }

})