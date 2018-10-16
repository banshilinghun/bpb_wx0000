const LoadingHelper = require("../../helper/LoadingHelper");
const ApiManager = require("../../utils/api/ApiManager");
const ApiConst = require("../../utils/api/ApiConst");
const StrategyHelper = require("../../helper/StrategyHelper");
const TimeUtil = require("../../utils/time/timeUtil");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    count: 0,
    totalMoney: 0,
    withdrawRecords: [],
    page: 0, //页码, 默认为0
    page_count: 20, //每页个数, 默认20
    hasmore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initScrollView();
    this.requestWithdrawRecord(this.data.page);
  },

  initScrollView() {
    //设置 scrollView 高度
    wx.getSystemInfo({
      success: res => {
        this.setData({
          scrollHeight: res.windowHeight - 60
        })
      },
    })
  },

  requestWithdrawRecord(pageIndex) {
    LoadingHelper.showLoading();
    const that = this;
    let requestData = {
      url: ApiConst.GET_WITHDRAW_RECORD_LIST,
      data: {
        page: pageIndex,
        page_count: that.data.page_count
      },
      success: res => {
        res.list.forEach(element => {
          element.statusStr = StrategyHelper.getWithdrawStatus(element.status);
          element.date = TimeUtil.formatTimestamp(element.create_date);
        });
        if(pageIndex === 0){
          that.setData({
            page: pageIndex,
            count: res.total_info.total_count,
            totalMoney: res.total_info.total_amount || 0,
            withdrawRecords: res.list
          })
        } else {
          that.setData({
            page: pageIndex,
            count: res.total_info.total_count,
            totalMoney: res.total_amount || 0,
            withdrawRecords: that.data.withdrawRecords.concat(res.list)
          })
        }
        //是否有更多数据
        const totalLength = that.data.withdrawRecords.length;
        that.setData({
          hasmore: totalLength < res.total_amount,
          showNomore: totalLength === res.total_amount
        })
      },
      complete: res => {
        LoadingHelper.hideLoading();
        that.setData({
          isShowLoadingMore: false
        });
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (!that.data.hasmore || that.data.isShowLoadingMore) {
      return;
    }
    that.setData({
      isShowLoadingMore: true
    });
    setTimeout(function() {
      that.requestWithdrawRecord(that.data.page + 1);
    }, 1000);
  },

})