var util = require("../../utils/util.js");
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
    disabled:true,
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    parkingData: false, //是否展示剩余车位按钮
    isFocus: false, //输入框聚焦
    flag: false, //防止多次点击的阀门
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1:
    '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
    keyboard2: '',
    keyboard2For: ['完成'],
    keyboardValue: '',
    textArr: [],
    textValue: '',
		provinces: [],
		citys: [],
		areas: [],
		province: '',
		city: '',
		address: {},
		sourceTypeIndex: '',
		sourceType: {},
		menuType: 0,
		begin: null,
		status: 1,
		end: null,
		isVisible: false,
		animationData: {},
		animationAddressMenu: {},
		addressMenuIsShow: false,
    istrue:true,
		value: [0, 0],
		show1: true,
		show2: true
	},
	onLoad: function(options) {
		wx.request({
			url: 'https://wxapi.benpaobao.com/app/get/citys',
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
		// 初始化动画变量
		var animation = wx.createAnimation({
			duration: 500,
			transformOrigin: "50% 50%",
			timingFunction: 'ease',
		})
		this.animation = animation;

		// wx.request({
		// 	url: 'https://wxapi.benpaobao.com/app/get/lease_company',
		// 	data: {},
		// 	header: app.globalData.header,
		// 	success: res => {
		// 		if(res.data.code == 1000) {
		// 			//					console.log(res.data.data)
		// 			var sourceType = [];
		// 			var idList = [];
		// 			var nameList = [];
		// 			for(var i = 0; i < res.data.data.length; i++) {
		// 				sourceType.push(res.data.data[i].name);
		// 				idList.push(res.data.data[i].id);
		// 				nameList.push(res.data.data[i].company_name);
		// 			}
		// 			//	console.log(sourceType)
		// 			sourceType.push("无租赁公司");
		// 			idList.push(0);
		// 			nameList.push("无租赁公司");
		// 			this.setData({
		// 				sourceType: sourceType,
		// 				idList: idList,
		// 				nameList: nameList
		// 			})
		// 		} else {
		// 			//					console.log(res.data)
		// 			wx.showModal({
		// 				title: '提示',
		// 				showCancel: false,
		// 				content: res.data.msg
		// 			});
		// 		}
		// 	},
		// 	fail: res => {
		// 		wx.showModal({
		// 			title: '提示',
		// 			showCancel: false,
		// 			content: '网络错误'
		// 		});
		// 	}
		// })

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
		//console.log(that.data)
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
    if(provinces.length>0){
      var citys = this.data.citys
      var provinceNum = value[0]
      var cityNum = value[1]
      //		var countyNum = value[2]
      if (this.data.value[0] != provinceNum) {
        //			console.log(this.data.address);
        var id = provinces[provinceNum].id
        this.setData({
          value: [provinceNum, 0, 0],
          citys: this.data.address.citys[id]
        })
      } else if (this.data.value[1] != cityNum) {
        var id = citys[cityNum].id
        this.setData({
          value: [provinceNum, cityNum]
        })
      } else {
        this.setData({
          value: [provinceNum, cityNum]
        })
      }
    }else{
      console.log("获取省市中")
    }
	
		//		console.log(this.data)
	},
	formSubmit: function(e) {
    console.log(e)
		var param = e.detail.value;
    var formId=e.detail.formId;
		this.mysubmit(param,formId);
	},
	mysubmit: function(param,formId) {
    //console.log(param)
		var carPhoto = this.data.carPhoto;
		var licensePhoto = this.data.licensePhoto;
		// var sourceTypeIndex = this.data.sourceTypeIndex;
		// var leaseId = this.data.idList[sourceTypeIndex];
		// var leaseName = this.data.nameList[sourceTypeIndex];
		var cityId = this.data.cityId;
		//var uid = app.globalData.uid;
		//		console.log(param)
		var formData = {
			real_name: param.name,
			city_id: cityId,
			plate_no: param.carcode,
      form_id: formId
		}
		//console.log(formData)
		//		console.log(formData);
		var flag = this.checkName(param) && this.checkCity(param) && this.checkCarCode(param)
		var that = this;
		if(flag) {
			if(carPhoto == undefined) {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '请上传车辆照片'
				});
			}
			if(licensePhoto == undefined) {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '请上传行驶证照片'
				});
			}
			if(carPhoto != undefined && licensePhoto != undefined) {
				wx.request({
					url: 'https://wxapi.benpaobao.com/app/user/auth_identity_info',
					data: formData,
					header: app.globalData.header,
					success: res => {
						if(res.data.code == 1000) {
							wx.showToast({
								title: "提交成功"
							})
							setTimeout(function() {
								wx.redirectTo({
									url: '../state/state'
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
	chooseImage: function() {
		var that = this
		wx.chooseImage({
			sourceType: sourceType[2],
			sizeType: sizeType[2],
			count: 1,
			success: function(res) {
				//				console.log(res)
				var wxres = res;
				wx.uploadFile({
					url: 'https://wxapi.benpaobao.com/app/user/upload_identity_img', //仅为示例，非真实的接口地址
					filePath: res.tempFilePaths[0],
					name: 'car',
					 header: {
					 	"Cookie":app.globalData.header.Cookie,
					 },
					success: function(res) {
						var resdata = JSON.parse(res.data);
						if(resdata.code == 1000) {
							//							console.log(res.data)
							that.setData({
								imageList: wxres.tempFilePaths,
								carPhoto: wxres.tempFilePaths[0],
								show1: false
							})
						} else {
							wx.showModal({
								title: '提示',
								showCancel: false,
								content: resdata.msg
							});
						}
					},
					fail: res => {
						console.log(res.data)
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: '网络错误'
						});
					}
				})
			}
		})
	},
	previewImage: function(e) {
		var current = e.target.dataset.src

		wx.previewImage({
			current: current,
			urls: this.data.imageList
		})
	},
	chooseImage2: function() {
		var that = this
		wx.chooseImage({
			sourceType: sourceType[2],
			sizeType: sizeType[2],
			count: 1,
			success: function(res) {
				//				console.log(res)
				var wxres = res;
				wx.uploadFile({
					url: 'https://wxapi.benpaobao.com/app/user/upload_identity_img', //仅为示例，非真实的接口地址
					filePath: res.tempFilePaths[0],
					name: 'license',
					 header: {
					 	"Cookie":app.globalData.header.Cookie,
					 },
					success: function(res) {
						var resdata = JSON.parse(res.data);
						if(resdata.code == 1000) {
							that.setData({
								imageList2: wxres.tempFilePaths,
								licensePhoto: wxres.tempFilePaths[0],
								show2: false
							})
						} else {
							//					console.log(res.data)
							wx.showModal({
								title: '提示',
								showCancel: false,
								content: resdata.msg
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
		})
	},
	previewImage2: function(e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList2
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
				content: '请输入车主姓名'
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
				content: '请选择城市'
			});
			return false;
		}
	},
	checkCarCode: function(param) {
		var carcode = param.carcode;
    if (util.isVehicleNumber(carcode)) {
      return true;
		} else {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '输入的车牌号不合法'
			});
			return false;
		}
	},

  showKeyboard: function () {
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true
    });
  },
  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        });
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false
        });
      }
    }
  },

  bindFocus: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      self.setData({
        isKeyboard: false,
        isFocus: true
      });
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
        isFocus: true,
        isKeyboard: true
      });
    }
  },

  tapKeyboard: function (e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == '巛') {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      self.data.textValue = self.data.textArr.join('');
      self.setData({
        textValue: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum
      });
      return false;
    }
    if (self.data.textArr.length >= 8) {
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join('');
    self.setData({
      textValue: self.data.textValue,
      keyboardValue: self.data.keyboard2,
      specialBtn: true
    });
    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      });
    }
  },


  onReady: function () {
    var self = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('');
    self.data.keyboard2 = self.data.keyboard2.split('');
    self.setData({
      keyboardValue: self.data.keyboard1
    });
  },
  onShow: function () {
    var self = this;
    self.setData({
      flag: false
    });
  },
  tapSpecBtn:function(){
    this.hideKeyboard();
  }
})