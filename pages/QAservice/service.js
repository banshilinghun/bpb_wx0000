
const url = '../QAcell/QAcell';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellList: [{ cellTitle: '项目介绍', path: url + '?flag=1'},
      { cellTitle: '程序使用', path: url + '?flag=2'},
      { cellTitle: '法律问题', path: url + '?flag=3'},
      { cellTitle: '其他问题', path: url + '?flag=4'},]
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