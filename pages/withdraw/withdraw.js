var app = getApp()
var util = require("../../utils/common/util");
const ApiManager = require("../../utils/api/ApiManager");
const ApiConst = require("../../utils/api/ApiConst.js");
const ModalHelper = require("../../helper/ModalHelper");
Page({
	data: {
		maxMoney: "0.00",
		freeAmount: 100
	},
	
	onLoad: function() {

	},

	onShow: function() {
		this.requestUserBandcard();
		this.requestUserAccount();
	},

	requestUserBandcard(){
		let requestData = {
      url: ApiConst.USER_BBANCARD,
      data: {},
      success: res => {
        if(res) {
					this.setData({
						haveCard: true,
						bankName: res.bank_name,
						bankIcon: res.icon,
						digits: res.bank_no.substr(res.bank_no.length - 4, 4),
						bank_id: res.id
					})
				} else {
					this.setData({
						haveCard: false
					})
				}
      }
    }
		ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
	},

	requestUserAccount(){
		let requestData = {
      url: ApiConst.GET_USER_ACCOUNT,
      data: {},
      success: res => {
        this.setData({
					maxMoney: util.toDecimal2(res.activityable_amount)
				})
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
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
		const that = this;
    let inputMoney = e.detail.value;
		var maxMoney = this.data.maxMoney;
    if (Number(inputMoney) > Number(maxMoney)) {
			this.setData({
				money: this.data.maxMoney
			})
		}else{
			this.setData({
				money: that.formatMoney(inputMoney)
			})
		}
	},

	formatMoney(inputMoney){
		if(inputMoney.toString().indexOf('.') !== -1 ){
			let inputArr = inputMoney.toString().split('.');
			if(inputArr.length === 2){
				console.log(inputArr);
				if(inputArr[1].length > 2){
					inputMoney = Number(inputMoney).toFixed(2);
				}
			}
		}
		return inputMoney;
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
			ModalHelper.showWxModal('提示', '请绑定银行卡', '我知道了', false);
		} else {
			if(!money) {
				ModalHelper.showWxModal('提示', '请输入提现金额', '我知道了', false);
			} else {
				if(money < 1) {
					ModalHelper.showWxModal('提示', '提现金额不能小于1元', '我知道了', false);
				} else {
					ModalHelper.showWxModalShowAllWidthCallback('提示', '确认要提现？', '确认', '取消', false, res => {
						if(res.confirm){
							this.sendWithdrawCommit(reqdata);
						}
					})
				}
			}
		}
	},

	sendWithdrawCommit(){
		let requestData = {
			url: ApiConst.WITHDRAW,
			data: reqdata,
			success: res => {
				wx.showToast({
					title: "提现成功"
				})
				setTimeout(function() {
					wx.switchTab({
						url: '../me/me'
					})
				}, 1000);
			}
		}
		ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
	}
})