//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		img: '../../image/index.png'
	},
	//事件处理函数
	onLoad: function(o) {
		var that = this;
		// 登录
    that.setData({
      shareAd: o
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
  onShow:function(){
    var shareAd = this.data.shareAd;
    wx.login({
      success: res => {
        //var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
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
              //console.log(res.data.data)
              if (res.data.code == 1000) {
                //								var param = JSON.stringify(res.data.data);
                //app.globalData.session_id = res.data.data.session_id;
                app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
                //								console.log(res.data.data);	 ·
                app.globalData.login = 1;
                app.globalData.checkStaus = res.data.data.status;
              } else if (res.data.code == 20001) {
                app.globalData.header.Cookie = 'sessionid=' + res.data.data.session_id;
                app.globalData.login = 0;
              }
              //console.log(shareAd)
              if (shareAd.adId == -1 || shareAd.adId == undefined) {
                wx.switchTab({
                  url: '../main/main'
                })
              } else {
                wx.redirectTo({
                  url: '../details/details?adId=' + shareAd.adId+"&share=1"
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