
const url = '../QAcell/QAcell';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellList: [{ cellTitle: '我们是谁？', path: url + '?flag=1', src: '../../image/who.png'},
      { cellTitle: '如何赚钱？', path: url + '?flag=2', src: '../../image/make_money.png'},
      { cellTitle: '拒绝法盲！', path: url + '?flag=3', src: '../../image/law.png'},
      { cellTitle: '其它问题。', path: url + '?flag=4', src: '../../image/other.png'}],
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
          bannerHeight: res.windowWidth * 0.467
        })
      }
    })
  },

  navigateListener: function(e){
    console.log(e);
    wx.navigateTo({
      url: e.detail.cell.path + '&title=' + e.detail.cell.cellTitle,
    })
  }

})