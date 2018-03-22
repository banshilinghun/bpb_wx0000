//main.js
//获取应用实例
var util = require("../../utils/util.js");
var app = getApp()
Page({
	data: {
		myAd: '',
		adList: '',
		focus: false,
    isShowView: true,
    //测试数据
    userList: ['张三', '李四', '王二', '麻子', 'hahhdjfdhjfdj', 'ndfmdnfmdnmd', 'dfkdfk', 'mdkmfdk,', 'dmfkdmf', 'mdmfkdmfdk'],
	},

	onLoad: function() {

	},
	onShow: function() {
		var z = this;
		wx.request({
			url: 'https://wxapi.benpaobao.com/app/get/my_ad',
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					//					console.log(res.data)
					if(res.data.data != null) {
						var nowdate = util.dateToString(new Date());
						if(res.data.data.status == 1) { //登记审核中
							this.setData({
								canCheck: 4
							})
						}
						if(res.data.data.status == 2) { //登记审核失败
							this.setData({
								canCheck: 5
							})
						}

						if(res.data.data.check != null && res.data.data.status == 3) {
							if(nowdate < res.data.data.check.date && res.data.data.check.status == 0) { //还未到检测时间
								this.setData({
									canCheck: 0
								})
							}
							if(nowdate >= res.data.data.check.date && res.data.data.check.status == 0) { //可以检测了
								this.setData({
									canCheck: 1
								})
							}
							if(res.data.data.check.status == 1) { //检测审核中
								this.setData({
									canCheck: 2
								})
							}
							if(res.data.data.check.status == 2) { //检测未通过
								this.setData({
									canCheck: 3
								})
							}
						}

						res.data.data.begin_date = res.data.data.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
						res.data.data.end_date = res.data.data.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
						if(res.data.data.check != null) {
							res.data.data.check.date = res.data.data.check.date.replace(/(.+?)\-(.+?)\-(.+)/, "$1年$2月$3日");
						}
						var myad = res.data.data;
						this.setData({
							myAd: myad,
							haveMyAd: true
						})
					} else {
						z.shippingAddress()
					}

				} else {
          if (res.data.code == 3000){
            wx.redirectTo({
              url: '../login/login'
            })
          }else{
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg
            });
          }
	
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
			url: 'https://wxapi.benpaobao.com/app/get/ad_list',
			data: {},
			header: app.globalData.header,
			success: res => {
        wx.stopPullDownRefresh();
				if(res.data.code == 1000) {
					var nowdate = util.dateToString(new Date());
					if(res.data.data.length > 0) {
						//						console.log(res.data.data);
						for(var i = 0; i < res.data.data.length; i++) {
							if(nowdate<res.data.data[i].end_date){
								if(res.data.data[i].current_count>0){
									res.data.data[i].state=0;
								}else{
									res.data.data[i].state=1;
								}
							}else{
								res.data.data[i].state=2;
							}
							res.data.data[i].begin_date = res.data.data[i].begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
							res.data.data[i].end_date = res.data.data[i].end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
						}

						var adList = res.data.data;
						//console.log(adList)
						this.setData({
							adList: adList
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
        wx.stopPullDownRefresh();
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '网络错误'
				});
			}
		})
		wx.request({
			url: 'https://wxapi.benpaobao.com/app/get/user_auth_status',
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					//					console.log(res.data)
					this.setData({
						status: res.data.data.status,
						name: res.data.data.real_name,
						province: res.data.data.province,
						city: res.data.data.city,
						plate_no: res.data.data.plate_no
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
	},
	go: function(event) {
		//		console.log(event)
		var adId = event.currentTarget.dataset.name;
		//		console.log(adId);
		var status = this.data.status;
		//				console.log(status);
    wx.navigateTo({
      url: '../details/details?adId=' + adId
    })

	},
	onPullDownRefresh: function() {
		wx.showToast({
			title: '奔跑中...',
			icon: 'loading'
		})
	   this.onShow();
	},
	regist: function(e) {
		if(this.data.shippingStatus == 1) {
			wx.showModal({
				title: "提示",
				content: "确定已收到广告？" ,
				confirmText: "确认",
				cancelText: "取消",
				success: function(sure) {
					if(sure.confirm) {
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
	check: function(e) {
		wx.navigateTo({
			url: '../check/check?ckData=' + JSON.stringify(e.currentTarget.dataset)
		})
	},
	shippingAddress: function() {
		var that = this;
		wx.request({
			url: 'https://wxapi.benpaobao.com/app/get/user_logistics',
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					//					console.log(res.data)
					if(res.data.data != null) {
						//console.log(res.data.data)
						if(res.data.data.status == 0) { //未派送
							that.setData({
								shippingStatus: 0,
								canCheck: -1
							})
						}
						if(res.data.data.status == 1) { //派送中
							that.setData({
								shippingStatus: 1,
								canCheck: 6
							})
						}
						if(res.data.data.status == 2) { //已签收
							that.setData({
								shippingStatus: 2,
								canCheck: 6
							})
						}
						res.data.data.begin_date = res.data.data.begin_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
						res.data.data.end_date = res.data.data.end_date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日")
						var myad = res.data.data;
						that.setData({
							myAd: myad,
							haveMyAd: true
						})
					} else {
						that.setData({
							haveMyAd: false
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
	}

})