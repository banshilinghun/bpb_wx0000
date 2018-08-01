//main.js
//获取应用实例
var md5 = require("../../utils/entrypt/md5");
const ApiConst = require("../../utils/api/ApiConst.js");
var app = getApp()
Page({
	data: {
		myProfile: [{
			"desc": "无限领取广告任务赚钱",
			"id": "1"
		}, {
			"desc": "专享广告免费寄送到家",
			"id": "2"
		}, {
			"desc": "优先领取广告任务",
			"id": "3"
		}],
		haveDeposit: 0
	},
	onLoad: function() {

	},
	onShow: function() {
		wx.request({
			url: ApiConst.USER_DEPOSIT_ISPAID,
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					//					console.log(res.data)
					this.setData({
						haveDeposit: res.data.data
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
	payDeposit: function() {
		var self = this
		self.setData({
			loading: true
		})
		wx.login({
			success: res => {
				//var that = this;
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if(res.code) {
					//console.log(res.code)
					//发起网络请求
					wx.request({
						url: ApiConst.PAY_USER_DESPOSIT,
						data: {
							wx_code: res.code
						},
						header: app.globalData.header,
						success: res2 => {
							if(res2.data.code == 1000) {
								//console.log(res2.data.data.prepay_id)
								//var prepay_id=res2.data.data.prepay_id;
								var appId = 'wx3e6177ae9634cc11';
								var timeStamp = (Date.parse(new Date()) / 1000).toString();
								var nonceStr = Math.random().toString(36).substr(2);
								var package_ = "prepay_id=" + res2.data.data.prepay_id;
								var signType = 'MD5';
								var stringA = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + package_ + "&signType=" + signType + "&timeStamp=" + timeStamp;
								var stringSignTemp = stringA + "&key=67D28A62D2B8F605DA75D9250B29A5D3"
								var sign = md5.md5(stringSignTemp).toUpperCase();
								wx.requestPayment({
									'timeStamp': timeStamp,
									'nonceStr': nonceStr,
									'package': package_,
									'signType': 'MD5',
									'paySign': sign,
									'success': function(res3) {
										wx.showToast({
											title: "押金缴纳成功"
										})
										setTimeout(function() {
											wx.navigateBack({
												delta: 1
											})
										}, 1000);
									},
									'fail': function(res3) {
										console.log(res3)
									},
									'complete': function(res3) {
										self.setData({
											loading: false
										})
									}
								})
							}
						},
						fail: res2 => {
							//console.log(2222);
							wx.showModal({
								title: '提示',
								showCancel: false,
								content: '网络错误'
							});
						}
					})
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		})
	},
	returnDeposit: function() {
		wx.request({
			url: ApiConst.CHECK_AD_FINISH,
			data: {},
			header: app.globalData.header,
			success: obj => {
				if(obj.data.code == 1000) {
					if(obj.data.data.user_ad_flag) {
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: '你目前有广告任务在进行，暂时不能退回押金'
						});
					} else {
						wx.showModal({
							title: "提示",
							content: "退押金后你将无法继续领取广告任务，获取更多收益",
							confirmText: "不退了",
							cancelText: "退押金",
							cancelColor: "#ccc",
							confirmColor: "#FF555C",
							success: function(res) {
								if(res.cancel) {
									wx.request({
										url: ApiConst.DESPOSIT_SENDBACK,
										data: {},
										header: app.globalData.header,
										success: res2 => {
											console.log(res2)
											if(res2.data.code == 1000) {
												wx.showModal({
													title: '提示',
													showCancel: false,
													content: "押金已退回至你的账户(可提现余额中)",
													success: function(res3) {
														if(res3.confirm) {
															wx.switchTab({
																url: '../me/me'
															})
														}
													}
												});

											} else {
												wx.showModal({
													title: '提示',
													showCancel: false,
													content: res2.data.msg
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
							}
						})
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

	}

})