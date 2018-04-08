// pages/joinList/joinList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinListUrl: app.globalData.baseUrl + 'app/get/ad_joined_users',
    userInfo: [],
    adId: '',
    pageIndex: 1,
    count: 20,
    hasmore: false,
    showNomore: false,
    isShowLoadingMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      adId: options.adId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.requestJoinList(that.data.pageIndex);
  },

  /** 请求已参与车主列表 */
  requestJoinList: function (currentPageIndex) {
    let that = this;
    wx.request({
      url: that.data.joinListUrl,
      data: {
        ad_id: that.data.adId,
        page_no: currentPageIndex,
        page_size: that.data.count,
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1000) {
          //更新pageIndex
          that.setData({
            pageIndex: currentPageIndex
          })
          //处理数据
          var dataList = res.data.data.info;
          for (var key in dataList) {
            var dataBean = dataList[key];
            var timeArray = dataBean.update_date.split(' ');
            dataBean.time = timeArray[0];
          }
          //判断是上拉加载还是下拉刷新
          if (currentPageIndex == 1) {
            that.setData({
              userInfo: dataList
            });
          } else {
            dataList = that.data.userInfo.concat(dataList);
            that.setData({
              userInfo: dataList
            })
          }
          that.setData({
            hasmore: res.data.data.more_data == 0 ? false : true,
            showNomore: res.data.data.more_data == 0 ? true : false
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        })
      },
      complete: function () {
        wx.stopPullDownRefresh();
        that.setData({
          isShowLoadingMore: false
        });
      }
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.showLoadingToast();
    this.setData({
      pageIndex: 1
    });
    this.requestJoinList(this.data.pageIndex);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.hasmore) {
      return;
    }
    //this.showLoadingToast();
    console.log('onReachBottom----------->')
    that.setData({
      isShowLoadingMore: true
    });
    setTimeout(function(){
      that.requestJoinList(that.data.pageIndex + 1);
    }, 1000);
  },

  showLoadingToast: function () {
    wx.showToast({
      title: '奔跑中...',
      icon: 'loading'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})