// var order = ['demo1', 'demo2', 'demo3']
const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
Page({
  data: {
    toView: 'green',
    scrollLeft: 0,
    index: 0,
    dateList: [],
    myProfile: [],
    showDialog: false,
    serverName: '',
    serverAddress: '',
    content: '',
    remark: '超过预约时间未到，系统会自动取消预约。',
    time_id: '',
  },
  onLoad: function (options) {
    var adData = JSON.parse(options.arrangementData);
    // console.log(adData)
    console.log(options.backFlag)
    var ad_id = adData.adid;
    var server_id = adData.serverid;
    this.getSubscribeDates(ad_id, server_id);
    this.setData({
      backFlag: options.backFlag ? options.backFlag:0,
      serverName: adData.servername,
      serverAddress: adData.serveraddress
    })
  },
  onUnload:function(){
    if (this.data.backFlag==1){
      wx.navigateBack({
        delta: 1
      })
    }
   
  },
  getSubscribeDates: function (ad_id, server_id) {
    var that = this;
    var reqData = {
      ad_id: ad_id,
      server_id: server_id
    }
    wx.request({
      url: ApiConst.GET_SUBSCRIBE_DATE,
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          //					console.log(res.data.data)
          var dateList = [];
          for (var k in res.data.data) {
            if (res.data.data.hasOwnProperty(k))
              dateList.push(k);
          }
          //					console.log(dateList)
          var dataObj = {};
          var repDateList = [];
          for (let i = 0; i < dateList.length; i++) {
            dataObj = {
              'value': i,
              'name': dateList[i].replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
            };
            repDateList.push(dataObj);
          }
          var key = dateList[0];
          var itemList = res.data.data[key];
          that.setData({
            dateList: repDateList,
            selDateList: dateList,
            allData: res.data.data,
            myProfile: itemList
          })
          //					console.log(that.data.dateList)
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });
        }

      },
      fail: res => {
        //console.log(2222);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      }
    })
  },
  scroll: function (e) {

  },

  moneyChange: function (e) {
    //		console.log(e)
    var that = this;
    that.setData({
      index: e.detail.value
    })

    var key = that.data.selDateList[e.detail.value];
    var itemList = that.data.allData[key];
    //console.log(itemList)
    that.setData({
      myProfile: itemList
    })
  },

  arrangement: function (e) {
    console.log(e);
    this.setData({
      showDialog: true,
      content: '网点名称：' + this.data.serverName + '\n预约时间：' + e.currentTarget.dataset.date + " " + e.currentTarget.dataset.btime + '-' + e.currentTarget.dataset.etime + '\n网点地址：' + this.data.serverAddress,
      time_id: e.currentTarget.dataset.id
    })
  },

  sureListener: function(){
    this.setData({
      showDialog: false
    })
    var reqData = {};
    reqData.time_id = this.data.time_id;
    wx.request({
      url: ApiConst.AD_SUBSCRIBE,
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          wx.showToast({
            title: "预约成功"
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            mydata: { share: 1 }
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)

        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          });
        }

      },
      fail: res => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      }
    })
  },

  cancelListener: function(){
    this.setData({
      showDialog: false
    })
  }
})