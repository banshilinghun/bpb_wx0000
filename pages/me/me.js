// me.js
var util = require("../../utils/util.js");
const app = getApp()
Page({
  data: {
    inviteId: '我是邀请人id',
		userInfo: {},
		myProfile: [{
			"desc": "身份认证",
			"id": "identity",
			'url': 'auth/auth',
			"icon": '../../image/card.png',
			'deposit': 0
		}, {
			"desc": "提现",
			"id": "withdraw",
			'url': 'withdraw/withdraw',
			"icon": '../../image/money.png',
			'deposit': 0
		}],
		total: "0.00",
		navs: [{
				desc: '可提现(元)',
				num: '0.00'
			},

			{
				desc: '提现中(元)',
				num: '0.00'
			},

			{
				desc: '冻结(元)',
				num: '0.00'
			}
		],
	},
	onLoad: function() {
		//		console.log(app.globalData.uid);

	},
	onShow: function() {
		//
		//		var uidData = {};
		//		uidData.user_id = app.globalData.uid;
    var loginFlag = app.globalData.login;
    this.setData({
      loginFlag: loginFlag
    })
    if (loginFlag==1){
      wx.request({
        url: app.globalData.baseUrl + 'app/get/user_account',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            this.setData({
              navs: [{
                desc: '可提现(元)',
                num: util.toDecimal2(res.data.data.activityable_amount)
              },

              {
                desc: '提现中(元)',
                num: util.toDecimal2(res.data.data.withdraw_amount)
              },

              {
                desc: '冻结(元)',
                num: util.toDecimal2(res.data.data.lock_amount)
              }
              ],
              total: util.toDecimal2(res.data.data.activityable_amount + res.data.data.withdraw_amount + res.data.data.lock_amount)
            });
            //					console.log(res.data);
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
        url: app.globalData.baseUrl + 'app/get/user_auth_status',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            //					console.log(res.data)
            this.setData({
              status: res.data.data.status
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

    }

	},
	loadProfile: function(e) {
		//      console.log(e.target)
	},
	kindToggle: function(e) {
		//		console.log(e);
    var that=this;
		var id = e.currentTarget.id,
			myProfile = this.data.myProfile;
		for(var i = 0, len = myProfile.length; i < len; ++i) {
			if(myProfile[i].id == id) {
				if(i == 0) {
          if (that.data.loginFlag == 1) {
            if (this.data.status == 0) {
              wx.navigateTo({
                url: '../auth/auth'
              })
            } else {
              wx.navigateTo({
                url: '../state/state'
              })
            }
          } else {
            wx.showModal({
              title: "提示",
              content: "你还没有登录",
              confirmText: "立即登录",
              cancelText: "取消",
              success: function (sure) {
                if (sure.confirm) {
                  wx.navigateTo({
                    url: '../register/register'
                  })
                }
              }
            })
          }
				} else {
					if(myProfile[i].id == 'address') {
						if(wx.chooseAddress) {
							wx.chooseAddress({
								success: function(res) {
									wx.switchTab({
										url: '../me/me'
									})
								},
								fail: function(res) {
									// fail
								},
								complete: function(res) {
									// complete
								}
							})
						} else {
							// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
							wx.showModal({
								title: '提示',
								content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
							})
						}
					} else {
            
            if (that.data.loginFlag == 1) {
              wx.navigateTo({
                url: '../' + myProfile[i].url
              })
            }else{
              wx.showModal({
                title: "提示",
                content: "你还没有登录",
                confirmText: "立即登录",
                cancelText: "取消",
                success: function (sure) {
                  if (sure.confirm) {
                    wx.navigateTo({
                      url: '../register/register'
                    })
                  }
                }
              })
            }
     
					}

				}

			}
		}

		this.setData({
			myProfile: myProfile
		});
	},
	onPullDownRefresh: function() {
		wx.showToast({
			title: '奔跑中...',
			icon: 'loading'
		})
    this.onShow();
		
	},
	exit: function() {
		wx.redirectTo({
      url: '../register/register'
		})
	},

  //分享
  onShareAppMessage: function (res) {
    var shareTitle = '奔跑宝，私家车广告平台';
    var adid = -1;
    var adimg = '../../image/bpbimg.jpg';
    var desc = '拉上好友一起赚钱～';
    var that = this
    return {
      title: shareTitle,
      desc: desc,
      path: 'pages/index/index',
      imageUrl: adimg,
      success: function (res) {
        console.log('share------success')
        wx.showToast({
          title: '分享成功',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      },
      fail: function () {
        wx.showToast({
          title: '分享取消',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
        })
      }
    }
  },
})