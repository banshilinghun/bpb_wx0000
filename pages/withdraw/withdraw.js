var app = getApp()
var util = require("../../utils/common/util");
const ApiManager = require("../../utils/api/ApiManager");
const ApiConst = require("../../utils/api/ApiConst.js");
const ModalHelper = require("../../helper/ModalHelper");
const LoadingHelper = require("../../helper/LoadingHelper");
Page({
	data: {
		maxMoney: "0.00",
		freeAmount: 0,
		visibleWithdraw: false,
		confirmWithdrawLoading: false,
		withdrawInfo: null,
		hasFormId: true
	},

	onLoad: function () {

	},

	onShow: function () {
		this.requestUserBandcard();
		this.requestUserAccount();
		this.requestUserTaxfree();
	},

	/**
	 * 用户当前提现额度
	 */
	requestUserTaxfree() {
		let requestData = {
			url: ApiConst.GET_USER_TAXFREE,
			data: {},
			success: res => {
				this.setData({
					freeAmount: Number(res.total_amount) - Number(res.month_amount)
				})
			}
		}
		ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
	},

	requestUserBandcard() {
		let requestData = {
			url: ApiConst.USER_BBANCARD,
			data: {},
			success: res => {
				if (res) {
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

	requestUserAccount() {
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

	addCard: function () {
		wx.navigateTo({
			url: '../addBankCard/addBankCard'
		})
	},

	changeCard: function () {
		wx.showModal({
			title: "提示",
			content: "确认更换为其它银行卡？",
			confirmText: "确认",
			cancelText: "取消",
			success: function (res) {
				if (res.confirm) {
					wx.navigateTo({
						url: '../addBankCard/addBankCard'
					})
				}
			}
		})
	},

	allWithdraw: function () {
		var maxMoney = this.data.maxMoney;
		this.setData({
			money: maxMoney
		})
	},

	searchMoney: function (e) {
		const that = this;
		let inputMoney = e.detail.value;
		var maxMoney = this.data.maxMoney;
		if (Number(inputMoney) > Number(maxMoney)) {
			this.setData({
				money: this.data.maxMoney
			})
		} else {
			this.setData({
				money: that.formatMoney(inputMoney)
			})
		}
	},

	formatMoney(inputMoney) {
		if (inputMoney.toString().indexOf('.') !== -1) {
			let inputArr = inputMoney.toString().split('.');
			if (inputArr.length === 2) {
				console.log(inputArr);
				if (inputArr[1].length > 2) {
					inputMoney = Number(inputMoney).toFixed(2);
				}
			}
		}
		return inputMoney;
	},

	submitWithdraw: function (event) {
		let formId = event.detail.formId;
		var bankId = this.data.bank_id;
		var money = this.data.money;
		var reqdata = {};
		reqdata.bank_id = bankId;
		reqdata.withdraw_amount = money;
		reqdata.formId = formId;
		if (!bankId) {
			ModalHelper.showWxModal('提示', '请绑定银行卡', '我知道了', false);
		} else {
			if (!money) {
				ModalHelper.showWxModal('提示', '请输入提现金额', '我知道了', false);
			} else {
				if (money < 1) {
					ModalHelper.showWxModal('提示', '提现金额不能小于1元', '我知道了', false);
				} else {
					this.sendWithdrawCommit(reqdata);
				}
			}
		}
	},

	/**
	 * 请求提现信息
	 */
	sendWithdrawCommit(reqdata) {
		const that = this;
		LoadingHelper.showLoading();
		let requestData = {
			url: ApiConst.COMMIT_USER_WITHDRAW,
			data: reqdata,
			success: res => {
				that.setData({
					withdrawInfo: res,
					visibleWithdraw: true
				})
			},
			complete: res => {
				LoadingHelper.hideLoading();
			}
		}
		ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
	},

	handleWithdrawCancel() {
		this.setData({
			visibleWithdraw: false
		})
	},

	/**
	 * 提现确认
	 */
	handleConfirmWithdraw() {
		const that = this;
		that.setData({
			confirmWithdrawLoading: true
		})
		let requestData = {
			url: ApiConst.COMMIT_WITHDRAW_INFO,
			data: {
				union_key: that.data.withdrawInfo.union_key
			},
			success: res => {
				that.setData({
					visibleWithdraw: false
				})
				ModalHelper.showWxModalUseConfirm('提交成功', '提现申请已提交，请耐心等待', '我知道了', false, res => {
					wx.redirectTo({
						url: '../withdrawRecord/withdrawRecord'
					})
				})
			},
			complete: res => {
				that.setData({
					confirmWithdrawLoading: false
				})
			}
		}
		ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
	}
})