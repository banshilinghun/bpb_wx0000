var util = require("../../utils/common/util");
const ApiConst = require("../../utils/api/ApiConst");
const ApiManager = require("../../utils/api/ApiManager");
const StrategyHelper = require("../../helper/StrategyHelper");
const ModalHelper = require("../../helper/ModalHelper");
const LoadingHelper = require("../../helper/LoadingHelper");
const viewUtil = require("../../utils/common/viewUtil");
const app = getApp()
var sourceType = [
	['camera'],
	['album'],
	['camera', 'album']
]
var sizeType = [
	['compressed'],
	['original'],
	['compressed', 'original']
]

Page({
	data: {
		provinces: [],
		citys: [],
		areas: [],
		province: '',
		city: '',
		address: {},
		sourceTypeIndex: 0,
		sourceType: {},
		menuType: 0,
		begin: null,
		status: 1,
		end: null,
		isVisible: false,
		animationData: {},
		animationAddressMenu: {},
		addressMenuIsShow: false,
		istrue: true,
		value: [0, 0],
		show1: true,
		show2: true,
		show3: true,
		show4: true,
		scrollHeight: 0,
		regist_id: '', //登记id
		check_id: '', //检测id
		actionType: StrategyHelper.REGIST,
		visibleCourse: false,
		hasFormId: true
	},

	onLoad: function (options) {
		var intent = JSON.parse(options.intent);
		console.log(intent);
		this.setData({
			check_id: intent.check_id || '',
			regist_id: intent.regist_id || '',
			carOut: true,
			carTail: true,
			carIn: parseInt(intent.classify) == 3, //3:车内+车外, 4:车外
			actionType: intent.flag,
			visibleCourse: intent.flag === StrategyHelper.CHECK
		})
		this.initScrollViewHeight();
		this.setNavigationBarTitle();
	},

	setNavigationBarTitle(){
		const that = this;
		wx.setNavigationBarTitle({
			title: that.data.actionType === StrategyHelper.REGIST ? '登记' : '检测'
		})
	},

	initScrollViewHeight() {
		//设置scrollView 高度
		const that = this;
		viewUtil.getViewHeight("#b-commit").then(rect => {
			console.log(rect);
			wx.getSystemInfo({
				success: res => {
					if(that.data.actionType === StrategyHelper.REGIST){
						that.setData({
							scrollHeight: res.windowHeight - rect.height
						})
					} else {
						that.setData({
							scrollHeight: res.windowHeight - 35 - rect.height
						})
					}
				}
			})
		})
		
	},

	formSubmit: function (e) {
		console.log(e);
		this.mysubmit(e.detail.formId);
	},

	mysubmit: function (form_id) {
		var carleftPhoto = this.data.carleftPhoto;
		var carrightPhoto = this.data.carrightPhoto;
		var carnPhoto = this.data.carnPhoto;
		var cartPhoto = this.data.cartPhoto;
		if (!carleftPhoto) {
			ModalHelper.showWxModal('提示', '请上传车身左侧照片', '我知道了', false);
		} else if (!carrightPhoto) {
			ModalHelper.showWxModal('提示', '请上传车身右侧照片', '我知道了', false);
		} else if (!cartPhoto) {
			ModalHelper.showWxModal('提示', '请上传车头照片', '我知道了', false);
		} else if (!carnPhoto && this.data.carIn) {
			ModalHelper.showWxModal('提示', '请上传车内照片', '我知道了', false);
		} else {
			this.commitRegistCheckInfo(form_id);
		}
	},

	commitRegistCheckInfo(form_id){
		const that = this;
		LoadingHelper.showLoading();
		//todo
    let commitUrl = that.data.actionType === StrategyHelper.REGIST ? ApiConst.COMMIT_REGIST_INFO : ApiConst.COMMIT_CHECK_INFO;
		let commitData = {};
		if(that.data.actionType == StrategyHelper.REGIST) {
			commitData.regist_id = this.data.regist_id;
		} else {
      commitData.check_id = this.data.check_id;
		}
		commitData.form_id = form_id;
    let requestData = {
			url: commitUrl,
			data: commitData,
      success: res => {
				wx.showToast({
					title: "提交成功"
				})
				setTimeout(function () {
					wx.switchTab({
						url: '../task/task'
					})
				}, 1000);
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
		ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
	},

	chooseImage: function () { //车身左侧
		this.wxChooseImage('left_img');
	},

	wxChooseImage(filename){
		wx.chooseImage({
			sourceType: sourceType[0],
			sizeType: sizeType[0],
			count: 1,
			success: res => {
				this.uploadImage(filename, res);
			}
		})
	},

	uploadImage(filename, imageData){
		LoadingHelper.showLoading();
		const that = this;
		let formTempData = {};
    let uploadUrl = that.data.actionType === StrategyHelper.REGIST ? ApiConst.UPLOAD_REGIST_IMG : ApiConst.UPLOAD_CHECK_IMG;
		if(that.data.actionType == StrategyHelper.REGIST){
			formTempData.regist_id = that.data.regist_id;
		} else {
      formTempData.check_id = that.data.check_id;
		}
    let requestData = {
			url: uploadUrl,
			filePath: imageData.tempFilePaths[0],
      formData: formTempData,
			fileName: filename,
      success: res => {
				that.changeImageStatus(filename, imageData);
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
		ApiManager.uploadFile(new ApiManager.uploadInfo(requestData));
	},

	changeImageStatus(filename, imageData){
		const that = this;
		let imageStrategy = {
			left_img : function(){
				that.setData({
					imageList: imageData.tempFilePaths,
					carleftPhoto: imageData.tempFilePaths[0],
					show1: false
				})
			},
			in_img: function(){
				that.setData({
					imageList2: imageData.tempFilePaths,
					carnPhoto: imageData.tempFilePaths[0],
					show2: false
				})
			},
			front_img: function(){
				that.setData({
					imageList3: imageData.tempFilePaths,
					cartPhoto: imageData.tempFilePaths[0],
					show3: false
				})
			},
			right_img: function(){
				that.setData({
					imageList4: imageData.tempFilePaths,
					carrightPhoto: imageData.tempFilePaths[0],
					show4: false
				})
			}
		}
		imageStrategy[filename]();
	},

	previewImage: function (e) {
		let current = e.target.dataset.src;
		const that = this;
		wx.previewImage({
			current: current,
			urls: this.data.imageList
		})
	},

	chooseImage2: function () { //车内
		this.wxChooseImage('in_img');
	},

	previewImage2: function (e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList2
		})
	},

	chooseImage3: function () { //车头
		this.wxChooseImage('front_img');
	},

	previewImage3: function (e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList3
		})
	},

	chooseImage4: function () { //车身右侧
		this.wxChooseImage('right_img');
	},

	previewImage4: function (e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList4
		})
	},

	/**
	 * 自主检测帮助
	 */
	handleHelp() {
		wx.navigateTo({
			url: '../checkCourse/checkCourse?flag=2'
		})
	}
})