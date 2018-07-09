var app = getApp()
var util = require("../../utils/util.js");
const ApiConst = require("../../utils/api/ApiConst.js");
Page({
	data: {
		maxMoney: "0.00"
	},
	onLoad: function() {

	},
	onShow: function() {
		wx.request({
			url: ApiConst.userBancard(),
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					if(res.data.data != null) {
						this.setData({
							haveCard: true,
							bankName: res.data.data.bank_name,
							bankIcon: res.data.data.icon,
							digits: res.data.data.bank_no.substr(res.data.data.bank_no.length - 4, 4),
							bank_id: res.data.data.id
						})
					} else {
						this.setData({
							haveCard: false
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
			url: ApiConst.getUserAccount(),
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					if(res.data.data != null) {
						this.setData({
							maxMoney: util.toDecimal2(res.data.data.activityable_amount)
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
	addCard: function() {
		wx.navigateTo({
			url: '../addBankCard/addBankCard'
		})
	},
	changeCard: function() {
		wx.showModal({
			title: "提示",
			content: "确认更换为其它银行卡？",
			confirmText: "确认",
			cancelText: "取消",
			success: function(res) {
				if(res.confirm) {
					wx.navigateTo({
						url: '../addBankCard/addBankCard'
					})
				}
			}
		})
	},
	allWithdraw: function() {
		var maxMoney = this.data.maxMoney;
		this.setData({
			money: maxMoney
		})
	},
	searchMoney: function(e) {
    //console.log(e.detail.value);
    //console.log(this.data.maxMoney);
    var inputMoney = Number(e.detail.value);
    var maxMoney = Number(this.data.maxMoney)
    if (inputMoney > maxMoney) {
			this.setData({
				money: this.data.maxMoney
			})
		}else{
			this.setData({
				money: e.detail.value
			})
		}
	},
	submitWithdraw: function() {
		var bankId = this.data.bank_id;
		var money = this.data.money;
		console.log(money)
		//console.log(bankId)
		var reqdata = {};
		reqdata.bank_id = bankId;
		reqdata.withdraw_amount = money;
		if(!bankId) {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请绑定银行卡'
			});
		} else {
			if(!money) {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '请输入提现金额'
				});
			} else {
				if(money < 1) {
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: '提现金额不能小于1元'
					});
				} else {
					wx.showModal({
						title: "提示",
						content: "确认要提现？",
						confirmText: "确认",
						cancelText: "取消",
						success: function(res) {
							if(res.confirm) {
								wx.request({
									url: ApiConst.withdraw(),
									data: reqdata,
									header: app.globalData.header,
									success: res => {
										if(res.data.code == 1000) {
											wx.showToast({
												title: "提现成功"
											})
											setTimeout(function() {
												wx.switchTab({
													url: '../me/me'
												})
											}, 1000);

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
						}
					})

				}
			}
		}

	}
})