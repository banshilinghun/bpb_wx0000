//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		img: '../../image/index.png'
	},
	//事件处理函数
	onLoad: function() {
		var that = this;
		// 登录
		wx.login({

			success: res => {
				//var that = this;
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if(res.code) {
					app.globalData.code = res.code
          //console.log(res.code)
					//发起网络请求
					wx.request({
						url: 'https://wxapi.benpaobao.com/app/user/wx_login',
						data: {
							wx_code: res.code
						},
						header: {
							'content-type': 'application/json'
						},
						success: res => {
							if(res.data.code == 1000) {
								//								var param = JSON.stringify(res.data.data);
								//app.globalData.session_id = res.data.data.session_id;
								app.globalData.header.Cookie = 'sessionid='+res.data.data.session_id;
								//								console.log(res.data.data);	 ·
								wx.switchTab({
									url: '../main/main'
								})
							} else {
								wx.redirectTo({
									url: '../login/login'
								})

							}

						},
						fail: res => {
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

		if(app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if(this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	getUserInfo: function(e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	}
})