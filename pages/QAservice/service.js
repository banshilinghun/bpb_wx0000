
const url = '../QAcell/QAcell';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellList: [{ cellTitle: '我们是谁？', path: url + '?flag=1'},
      { cellTitle: '如何赚钱？', path: url + '?flag=2'},
      { cellTitle: '拒绝法盲！', path: url + '?flag=3'},
      { cellTitle: '其它问题。', path: url + '?flag=4'},]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },

  navigateListener: function(e){
    console.log(e);
    wx.navigateTo({
      url: e.detail.cell.path + '&title=' + e.detail.cell.cellTitle,
    })
  }

})