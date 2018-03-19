const util = require("../../utils/util.js");
var formatLocation = util.formatLocation;
var getDistance = util.getDistance;
const app = getApp();
Page({
  data: {
    banners: [],
    receive: 0,
    expressList: [],
    expressNumber: 0,
    expressType: "",
    message: "",
    detail: null,
    state: 0,
    getDataSuccess: true,
    haveExp: false,
    animationError: {},
    wWidth: 0,
    wHeight: 0,
    obj: {},
    expressChangeList: [],
    title: "",
    amount: 1,
    isTop: false,
    isNeedKey: false,
    showMenu: true,
    checkPlan: false,
    istrue:true,
    inviteId: '我是shareInviteId',
    //分享后传递的邀请人的id，为空则表示不是从分享页面进入
    shareInviteId: '',
  },

  onLoad: function (options) {
    this.setData({
      adId: options.adId,
      shareInviteId: options.inviteId,
    })
  },
  onShow: function () {
    var that = this
    var reqData = {};
    reqData.ad_id = that.data.adId;
    	wx.getLocation({
			type: 'gcj02',
			success: function(res) {
				var latitude = res.latitude
				var longitude = res.longitude
//				console.log(res.longitude)
				that.setData({
					latitude: latitude,
					longitude: longitude
				})
				if(that.data.service!=undefined){
						if(that.data.service.length > 0) {
						//var dis = [];
						for(var j = 0; j < that.data.service.length; j++) {
							 that.data.service[j].distance = getDistance(that.data.latitude, that.data.longitude,  that.data.service[j].lat,  that.data.service[j].lng).toFixed(2);
						}

					}
				}
				that.setData({
					service:that.data.service
				})
				
			}
		})
 	wx.request({
			url: 'https://wxapi.benpaobao.com/app/get/ad_info',
			data: reqData,
			header:app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					//					console.log(res.data)
					var enddate = res.data.data.info.end_date;
					res.data.data.info.begin_date = res.data.data.info.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
					res.data.data.info.end_date = res.data.data.info.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
					var serviceList = res.data.data.service;
					if(serviceList.length > 0) {
						//var dis = [];
						for(var j = 0; j < serviceList.length; j++) {
							//						console.log(serviceList[i])
//                          console.log(that.data.latitude)
							serviceList[j].distance = getDistance(that.data.latitude, that.data.longitude, serviceList[j].lat, serviceList[j].lng).toFixed(2);


						}

					}
					that.setData({
						service: serviceList
					})
//                console.log(that.data.service)
					if(res.data.data.myad == null) { //登记
						var nowdate = util.dateToString(new Date());

						if(nowdate < enddate) {
							this.setData({
								sta: 0
							})
						} else {
							this.setData({
								sta: 8
							})
						}
					} else {

						if(res.data.data.info.id == res.data.data.myad.id) {
							if(res.data.data.myad.regist.status == 1) { //登记审核中
								this.setData({
									sta: 1
								})
							}
							if(res.data.data.myad.regist.status == 2) { //登记审核没通过
								this.setData({
									sta: 2
								})
							}
							if(res.data.data.myad.check != null) {
								this.setData({
									ckid: res.data.data.myad.check.id
								})
								var ckdate = res.data.data.myad.check.date;
								var nowdate = util.dateToString(new Date());
								if(res.data.data.myad.check.status == 0 && nowdate < ckdate) { //检测没开始
									this.setData({
										sta: 3
									})
								}
								if(res.data.data.myad.check.status == 0 && nowdate >= ckdate) { //开始检测了
									this.setData({
										sta: 4
									})
								}
								if(res.data.data.myad.check.status == 1) { //检测中
									this.setData({
										sta: 5
									})
								}
								if(res.data.data.myad.check.status == 2) { //检测未通过
									this.setData({
										sta: 6
									})
								}
								this.setData({
									ckdate: res.data.data.myad.check.date.replace(/(.+?)\-(.+?)\-(.+)/, "$1年$2月$3日")

								})
							}

						} else {
							this.setData({
								sta: 7
							})
						}
					}
					if(res.data.data.imgs.length == 0) {
						that.setData({
							adInfo: res.data.data.info,
							banners: ['../../image/bpb.png']
						})
					} else {
						that.setData({
							adInfo: res.data.data.info,
							banners: res.data.data.imgs
						})
					}

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

    wx.request({
      url: 'https://wxapi.benpaobao.com/app/find/ad_check_plans',
      data: reqData,
      header: app.globalData.header,
      success: res => {
        if (res.data.code == 1000) {
          if (res.data.data.length>0){
              this.setData({
                checkPlan: true
              })
          }else{
            this.setData({
              checkPlan: false
            })
          }
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
  	formSubmit: function(e) {
		var param = e.detail.value;
        this.setData({
        	 formId:e.detail.formId
        })
		this.receiveAd();
	},

  regist: function (e) {
    if (this.data.shippingStatus == 1) {
      wx.showModal({
        title: "提示",
        content: "确定已收到广告？",
        confirmText: "确认",
        cancelText: "取消",
        success: function (sure) {
          if (sure.confirm) {
            wx.navigateTo({
              url: '../adRegist/adRegist?adData=' + JSON.stringify(e.currentTarget.dataset)
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../adRegist/adRegist?adData=' + JSON.stringify(e.currentTarget.dataset)
      })
    }

  },
  check: function (e) {
    //		console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../check/check?ckData=' + JSON.stringify(e.currentTarget.dataset)
    })
  },
  kindToggle: function (e) {
    if (this.data.receive == 1) {
      return false;
    } else {
      var id = e.currentTarget.id,
        list = this.data.list;
      for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i].id == id) {
          list[i].open = !list[i].open
        } else {
          list[i].open = false
        }
      }
      this.setData({
        list: list
      });
    }

  },
  checkPlan: function (e) {
  	//console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../checkPlan/checkPlan?adId=' + e.currentTarget.dataset.adid
    })
  },

  //分享
  onShareAppMessage: function(){
    var that = this
    return {
      title: '奔跑宝',
      desc: '奔跑宝广告详情',
      path: 'pages/details/details?adId=' + that.data.adId + '&inviteId=' + that.data.inviteId,
    }
  },

  testClick: res=>{
    wx.redirectTo({
      url: '../test/tesst',
    })
  },
})