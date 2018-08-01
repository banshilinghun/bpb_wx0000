var util = require("../../utils/common/util");
const ApiConst = require("../../utils/api/ApiConst.js");
const app = getApp()
Page({
	data: {
		provinces: [],
		citys: [],
		areas: [],
		province: '',
		city: '',
		address: {},
		sourceTypeIndex: 1,
		sourceType: {},
		menuType: 0,
		begin: null,
		status: 1,
		end: null,
		isVisible: false,
		animationData: {},
		animationAddressMenu: {},
		addressMenuIsShow: false,
		value: [0, 0]
	},
	onLoad: function(options) {
		wx.request({
			url: ApiConst.GET_CITYS,
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {
					//					console.log(res.data.data)
					var id = res.data.data.provinces[0].id;
					this.setData({
						address: res.data.data,
						provinces: res.data.data.provinces,
						citys: res.data.data.citys[id]
					})
				} else {
					//					console.log(res.data)
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
			url: ApiConst.GET_AUTH_STATUS,
			data: {},
			header: app.globalData.header,
			success: res => {
				if(res.data.code == 1000) {

					this.setData({
						real_name: res.data.data.real_name
					})
				} else {
					//					console.log(res.data)
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
		// 初始化动画变量
		var animation = wx.createAnimation({
			duration: 500,
			transformOrigin: "50% 50%",
			timingFunction: 'ease',
		})
		this.animation = animation;

	},
	search: function(e) {
		var that = this;
		if(e.detail.value.length >= 15) {
			wx.request({
				url: 'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?cardNo=' + e.detail.value + '&cardBinCheck=true',
				data: {},
				header: {
					'content-type': 'application/json'
				},
				success: res => {
					if(res.data.validated) {
						this.setData({
							bank_abb: res.data.bank
						})
						wx.request({
							url: ApiConst.GET_BANK_INFO,
							data: {
								bank_abb: res.data.bank
							},
							header: app.globalData.header,
							success: res2 => {
								if(res2.data.code == 1000) {
									//					console.log(res.data)
                  if (res2.data.data!=null){
                    this.setData({
                      bank_name: res2.data.data.bank_name
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
					} else {
						this.setData({
							bank_abb: '',
							bank_name: ''
						})
					}
				}
			})
		}
	},
	// 执行动画
	startAnimation: function(isShow, offset) {
		var that = this
		var offsetTem
		if(offset == 0) {
			offsetTem = offset
		} else {
			offsetTem = offset + 'rpx'
		}
		this.animation.translateY(offset).step()
		this.setData({
			animationData: this.animation.export(),
			isVisible: isShow
		})
		console.log(that.data)
	},
	// 执行动画
	startAddressAnimation: function(isShow) {
		//		console.log(isShow)
		var that = this
		if(isShow) {
			that.animation.translateY(0 + 'vh').step()
		} else {
			that.animation.translateY(56 + 'vh').step()
		}
		that.setData({
			animationAddressMenu: that.animation.export(),
			addressMenuIsShow: isShow,
		})
	},

	sourceTypeChange: function(e) {
		this.setData({
			sourceTypeIndex: e.detail.value
		})
	},
	showMenuTap: function(e) {
		console.log('selectState')
		//获取点击菜单的类型 1点击状态 2点击时间 
		var menuType = e.currentTarget.dataset.type
		// 如果当前已经显示，再次点击时隐藏
		if(this.data.isVisible == true) {
			this.startAnimation(false, -200)
			return
		}
		this.setData({
			menuType: menuType
		})
		this.startAnimation(true, 0)
	},
	hideMenuTap: function(e) {
		this.startAnimation(false, -200)
	},

	// 选择状态按钮
	selectState: function(e) {
		console.log('selectState1')
		this.startAnimation(false, -200)
		var status = e.currentTarget.dataset.status
		this.setData({
			status: status
		})
		console.log(this.data)

	},

	// 点击所在地区弹出选择框
	selectDistrict: function(e) {
		var that = this
		//		console.log('111111111')
		if(that.data.addressMenuIsShow) {
			return
		}
		that.startAddressAnimation(true)
	},

	// 点击地区选择取消按钮
	cityCancel: function(e) {
		this.startAddressAnimation(false)
	},
	// 点击地区选择确定按钮
	citySure: function(e) {
		var that = this
		var city = that.data.city
		var value = that.data.value
		that.startAddressAnimation(false)
		// 将选择的城市信息显示到输入框
		//		console.log(that.data.citys[value[1]].id)
		var areaInfo = that.data.citys[value[1]].name
		that.setData({
			areaInfo: areaInfo,
			cityId: that.data.citys[value[1]].id
		})
	},
	hideCitySelected: function(e) {
		//		console.log(e)
		this.startAddressAnimation(false)
	},
	// 处理省市县联动逻辑
	cityChange: function(e) {
		//		console.log(e)
		var value = e.detail.value
		var provinces = this.data.provinces
		if(provinces.length > 0) {
			var citys = this.data.citys
			var provinceNum = value[0]
			var cityNum = value[1]
			//		var countyNum = value[2]
			if(this.data.value[0] != provinceNum) {
				//			console.log(this.data.address);
				var id = provinces[provinceNum].id
				this.setData({
					value: [provinceNum, 0, 0],
					citys: this.data.address.citys[id]
				})
			} else if(this.data.value[1] != cityNum) {
				var id = citys[cityNum].id
				this.setData({
					value: [provinceNum, cityNum]
				})
			} else {
				this.setData({
					value: [provinceNum, cityNum]
				})
			}
		} else {
			console.log("获取省市中")
		}

		//		console.log(this.data)
	},
	formSubmit: function(e) {
		var param = e.detail.value;
		this.mysubmit(param);
	},
	mysubmit: function(param) {
		var bank_abb = this.data.bank_abb;
		console.log(bank_abb);
		var cityId = this.data.cityId;
		var formData = {
			bank_abb: bank_abb,
			bank_name: param.bankName,
			owner: param.name,
			bank_no: param.cardNum,
			bank_branch: param.branch,
			city_id: cityId,
			bank_identity: param.idNum
		}
		//console.log(formData);
		var flag = this.checkName(param) && this.checkCardNum(param) && this.checkBranch(param) && this.checkBankName(param) && this.checkCity(param) && this.checkIdCode(param)
		var that = this;
		if(flag) {
			if(!bank_abb) {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '请输入有效银行账号'
				});
			} else {
				wx.request({
					url: ApiConst.ADD_BANKCARD,
					data: formData,
					header: app.globalData.header,
					success: res => {
						if(res.data.code == 1000) {
							wx.showToast({
								title: "提交成功"
							})
							setTimeout(function() {
								wx.redirectTo({
									url: '../withdraw/withdraw'
								})
							}, 1000);
						} else {
							//					console.log(res.data)
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
	},

	goStep: function() {
		this.setData({
			currentMenuID: '1',
			currentPage: 1
		})
	},

	checkName: function(param) {
		var name = param.name;
		if(name != '') {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请输入持卡人姓名'
			});
			return false;
		}
	},
	checkCardNum: function(param) {
		var cardNum = param.cardNum;
		if(cardNum != '') {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请输入银行卡号'
			});
			return false;
		}
	},
	checkBranch: function(param) {
		var branch = param.branch;
		if(branch != '') {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请输入开户支行'
			});
			return false;
		}
	},
	checkBankName: function(param) {
		var bankName = param.bankName;
		if(bankName != '') {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请输入开户行'
			});
			return false;
		}
	},

	checkCity: function(param) {
		var city = param.city;
		if(city != '') {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请选择开户城市'
			});
			return false;
		}
	},
	checkIdCode: function(param) {
		var idNum = param.idNum;
		if(util.IdentityCodeValid(idNum)) {
			return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '输入的身份证号不合法'
			});
			return false;
		}
	},
})