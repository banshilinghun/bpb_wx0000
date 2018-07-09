// me.js
var util = require("../../utils/util.js");
const ApiConst = require("../../utils/api/ApiConst.js");
const app = getApp()
Page({
  data: {
    userInfo: {},
    myProfile: [{
      "desc": "身份认证",
      "id": "identity",
      'url': 'auth/auth',
      "icon": '../../image/card.png',
      'deposit': 0
    }, {
      "desc": "提现",
      "id": "withdraw",
      'url': 'withdraw/withdraw',
      "icon": '../../image/money.png',
      'deposit': 0
    }, {
      "desc": "地址管理",
      "id": "address",
      'url': 'address/address',
      "icon": '../../image/adders.png',
      'deposit': 0
    }, {
      "desc": "押金",
      "id": "deposit",
      'url': 'deposit/deposit',
      "icon": '../../image/deposit.png',
      'deposit': 1
    }],
  },
  onLoad: function (options) {
  	//console.log(options)
    this.setData({
      adId: options.adId
    })
  },
  onShow: function () {
    var that = this
    var reqData = {};
    reqData.ad_id = that.data.adId;
    wx.request({
      url: ApiConst.adCheckPlans(),
      data: reqData,
      header: app.globalData.header,
      success: res => {
      	 var nowdate = util.dateToString(new Date());
        if (res.data.code == 1000) {
        	for (var i=0;i<res.data.data.length;i++) {
        		if(res.data.data[i].status==0){
        			//console.log(nowdate);
        			//console.log(res.data.data[i].date);
        			if(nowdate>=res.data.data[i].date){
        				res.data.data[i].status=4
        				//console.log(res.data.data[i].status)
        			}else{
        				res.data.data[i].status=0
        			}
        		}
        	}
          //console.log(res.data.data)
          that.setData({
          	planList:res.data.data
          })
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
  }
})