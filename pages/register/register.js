var util = require("../../utils/util.js");
const app = getApp()
Page({
	data: {
		registBtnTxt: "注册",
		registBtnBgBgColor: "#ff5539",
		getSmsCodeBtnTxt: "获取验证码",
		getSmsCodeBtnColor: "transparent",
		// getSmsCodeBtnTime:60,
		btnLoading: false,
		registDisabled: false,
		smsCodeDisabled: false,
		inputUserName: '',
		inputPassword: '',
		logIcon: "../../image/logIcon.png",
		pwdIcon: "../../image/pwdIcon.png",
		verifiIcon: "../../image/verifiIcon.png",
    istrue:true
	},
	formSubmit: function(e) {
		var param = e.detail.value;
    console.log(e)
		this.mysubmit(param);
	},
	mysubmit: function(param) {
		//console.log(param)
		var registData = {};
		registData.phone_no = param.username.trim();
		registData.verify_code = param.smsCode.trim();
		registData.password = param.password.trim();
		registData.wx_code = app.globalData.code.trim();
		var flag = this.checkUserName(param) && this.checkPassword(param)
		var that = this;
		if(flag) {
			this.setregistData1();
			wx.request({
				url: 'https://wxapi.benpaobao.com/app/user/regist',
				data: registData,
				header: {
					'content-type': 'application/json'
				},
				success: res => {
					that.setregistData2();
					if(res.data.code == 1000) {
						app.globalData.header.Cookie = 'sessionid='+res.data.data.session_id;
						app.globalData.session_id = res.data.data.session_id;
						wx.showToast({
							title: "注册成功"
						})
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
					that.setregistData2();
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: '网络错误'
					});
				}
			})

		}
	},
	setregistData1: function() {
		this.setData({
			registBtnTxt: "注册中",
			registDisabled: !this.data.registDisabled,
			registBtnBgBgColor: "#999",
			btnLoading: !this.data.btnLoading
		});
	},
	setregistData2: function() {
		this.setData({
			registBtnTxt: "注册",
			registDisabled: !this.data.registDisabled,
			registBtnBgBgColor: "#ff5539",
			btnLoading: !this.data.btnLoading
		});
	},
	checkUserName: function(param) {
		var phone = util.regexConfig().phone;
		var inputUserName = param.username.trim();
		if(phone.test(inputUserName)) {
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
				content: '请设置密码'
			});
			return false;
		} else if(password.length < 6 || password.length > 20) {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '密码长度为6-20位字符'
			});
			return false;
		} else {
			return true;
		}
	},

	mobileInputEvent: function(e) {
		this.setData({
			phone: e.detail.value
		})
	},
	getSmsCode: function() {
		//		console.log(e)
		var that = this;
		// var phoneNo = that.data.phone;
    //var wxcode = app.globalData.code.trim()
		var count = 60;
    var rqData={
      phone_no:that.data.phone,
      wx_code: app.globalData.code.trim()
    }
		var si = setInterval(function() {
			if(count > 0) {
				count--;
				that.setData({
					getSmsCodeBtnTxt: count + ' s',
					getSmsCodeBtnColor: "transparent",
					color: '#9b9b9b',
					smsCodeDisabled: true
				});
			} else {
				that.setData({
					getSmsCodeBtnTxt: "获取验证码",
					getSmsCodeBtnColor: "transparent",
					color: '#ff5539',
					smsCodeDisabled: false
				});
				count = 60;
				clearInterval(si);
			}
		}, 1000);

		wx.request({
			url: 'https://wxapi.benpaobao.com/app/get/regist_verify_wx',
      data: rqData,
			header: {
				'content-type': 'application/json'
			},
			success: res => {
				if(res.data.code == 1000) {

					// console.log(res.data.data)
          wx.showToast({
            title: "验证码已发送"
          })
				} else {
					if(res.data.code != 2002) {
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: res.data.msg
						});
					}

					clearInterval(si);
				}
			},
			fail: res => {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '网络出错'
				});
				clearInterval(si);
			}
		})

	},
	redirectTo: function(param) {
		//需要将param转换为字符串
		//		param = JSON.stringify(param);
		wx.switchTab({
			url: '../main/main' //参数只能是字符串形式，不能为json对象
		})
	}

})