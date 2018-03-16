var util = require("../../utils/util.js");
const app = getApp()
//console.log(222)

Page({
	data: {
		loginBtnTxt: "登录",
		loginBtnBgBgColor: "#ff5539",
		btnLoading: false,
		disabled: false,
		inputUserName: '',
		inputPassword: '',
		userInfo: app.globalData.userInfo,
		logIcon: "../../image/logIcon.png",
		pwdIcon: "../../image/pwdIcon.png"
	},
	onLoad: function(options) {
		// 页面初始化 options为页面跳转所带来的参数
		var z = this;
//		console.log(app.globalData.userInfo)
		if(app.globalData.userInfo!=null) {
			z.setData({
				avatarUrl: app.globalData.userInfo.avatarUrl
			})
		}

		//console.log(app.globalData.userInfo.avatarUrl)
		app.userInfoReadyCallback = res => {
//			console.log(res)
			app.globalData.userInfo = res.userInfo
			z.setData({
				avatarUrl: app.globalData.userInfo.avatarUrl
			})
			//console.log(app.globalData.userInfo)
		}

	},
	onReady: function() {
		// 页面渲染完成

	},
	onShow: function() {
		// 页面显示

	},
	onHide: function() {
		// 页面隐藏

	},
	onUnload: function() {
		// 页面关闭

	},
	formSubmit: function(e) {
		var param = e.detail.value;
		this.mysubmit(param);
	},
	mysubmit: function(param) {
		var loginData = {};
		loginData.username = param.username.trim();
		loginData.password = param.password.trim();
		loginData.wx_code = app.globalData.code.trim();
		var flag = this.checkUserName(param) && this.checkPassword(param)
		var that = this;
		if(flag) {
			this.setLoginData1();
				wx.request({
				url: 'https://wxapi.benpaobao.com/app/user/login',
				data: loginData,
				header: {
					'content-type': 'application/json'
				},
				success: res => {
					that.setLoginData2();
					if(res.data.code == 1000) {
						app.globalData.header.Cookie = 'sessionid='+res.data.data.session_id;
						//app.globalData.uid = res.data.data.uid;
						wx.showToast({
							title: "登录成功"
						})
//						that.redirectTo(res.data.data);
						setTimeout(function() {
							that.redirectTo(res.data.data);
						}, 1000);
					} else {
						console.log(res.data)
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
//			this.checkUserInfo(param);
		}
	},
	setLoginData1: function() {
		this.setData({
			loginBtnTxt: "登录中",
			disabled: !this.data.disabled,
			loginBtnBgBgColor: "#999",
			btnLoading: !this.data.btnLoading
		});
	},
	setLoginData2: function() {
		this.setData({
			loginBtnTxt: "登录",
			disabled: !this.data.disabled,
			loginBtnBgBgColor: "#ff5539",
			btnLoading: !this.data.btnLoading
		});
	},
	checkUserName: function(param) {
		//var email = util.regexConfig().email;
		var phone = util.regexConfig().phone;
		var inputUserName = param.username.trim();
		if( phone.test(inputUserName)) {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请输入正确的手机号码'
			});
			return false;
		}
	},
	checkPassword: function(param) {
		var userName = param.username.trim();
		var password = param.password.trim();
		if(password.length <= 0) {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请输入密码'
			});
			return false;
		} else {
			return true;
		}
	},

	redirectTo: function(param) {
		//需要将param转换为字符串
//		param = JSON.stringify(param);
		wx.switchTab({
			url: '../main/main' //参数只能是字符串形式，不能为json对象
		})
	}

})