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
    istrue:true,
		value: [0, 0],
		show1: true,
		show2: true,
		show3: true,
    show4: true
	},
	onLoad: function(options) {
		var adData = JSON.parse(options.ckData);
		console.log(adData)
		this.setData({
			ckId: adData.checkid,
			type: adData.type
		})
		// if(adData.type == 0) {
		// 	this.setData({
		// 		carw: true
		// 	})
		// }
		// if(adData.type == 1) {
		// 	this.setData({
		// 		cart: true,
		// 		carn: true
		// 	})
		// }
		// if(adData.type == 2) {
		// 	this.setData({
		// 		carw: true,
		// 		carn: true
		// 	})
		// }

	},

	formSubmit: function(e) {
		var param = e.detail.value;
    //var formId = e.detail.formId;
    this.mysubmit(param);
	},
  mysubmit: function (param) {

		///var uid = app.globalData.uid;
		var ckId = this.data.ckId;
		//		console.log(ckId);
		//		console.log(param)
		var formData = {
			check_id: ckId
		}
    var carleftPhoto = this.data.carleftPhoto;
    var carrightPhoto = this.data.carrightPhoto;
		var carnPhoto = this.data.carnPhoto;
		var cartPhoto = this.data.cartPhoto;
		//		console.log(formData);
    if (carleftPhoto == undefined) {
				wx.showModal({
					title: '提示',
					showCancel: false,
					content: '请上传车身左侧照片'
				});
    } else if (carrightPhoto==undefined){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请上传车身右侧照片'
      });
    } else if (cartPhoto == undefined){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请上传车头照片'
      });
    }else if (carnPhoto == undefined) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请上传车内照片'
      });
    }else{
      wx.request({
        url: app.globalData.baseUrl + 'app/commit/mid_check',
        data: formData,
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            wx.showToast({
              title: "提交成功"
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../main/main'
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
		
	},

	chooseImage: function() { //车身左侧
		var that = this;
		//		console.log(that.data.ckId);
		wx.chooseImage({
			sourceType: sourceType[0],
			sizeType: sizeType[0],
			count: 1,
			success: function(res) {
				//				console.log(res)
				var wxres = res;
				wx.uploadFile({
          url: app.globalData.baseUrl + 'app/upload/mid_check_img',
					filePath: res.tempFilePaths[0],
          name: 'left_img',
					header: {
						"Cookie": app.globalData.header.Cookie,
					},
					formData: {
						check_id: that.data.ckId
					},
					success: function(res) {
						var resdata = JSON.parse(res.data);
						if(resdata.code == 1000) {
							that.setData({
								imageList: wxres.tempFilePaths,
								carleftPhoto: wxres.tempFilePaths[0],
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
  chooseImage4: function () { //车身右侧
    var that = this;
    //		console.log(that.data.ckId);
    wx.chooseImage({
      sourceType: sourceType[0],
      sizeType: sizeType[0],
      count: 1,
      success: function (res) {
        //				console.log(res)
        var wxres = res;
        wx.uploadFile({
          url: app.globalData.baseUrl + 'app/upload/mid_check_img',
          filePath: res.tempFilePaths[0],
          name: 'right_img',
          header: {
            "Cookie": app.globalData.header.Cookie,
          },
          formData: {
            check_id: that.data.ckId
          },
          success: function (res) {
            var resdata = JSON.parse(res.data);
            if (resdata.code == 1000) {
              that.setData({
                imageList4: wxres.tempFilePaths,
                carrightPhoto: wxres.tempFilePaths[0],
                show4: false
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
  previewImage4: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList4
    })
  },
	chooseImage2: function() { //车内
		var that = this
		wx.chooseImage({
			sourceType: sourceType[0],
			sizeType: sizeType[0],
			count: 1,
			success: function(res) {
				//				console.log(res)
				var wxres = res;

				wx.uploadFile({
          url: app.globalData.baseUrl + 'app/upload/mid_check_img',
					filePath: res.tempFilePaths[0],
          name: 'in_img',
					header: {
						"Cookie": app.globalData.header.Cookie,
					},
					formData: {
						check_id: that.data.ckId
					},
					success: function(res) {
						var resdata = JSON.parse(res.data);
						if(resdata.code == 1000) {
							that.setData({
								imageList2: wxres.tempFilePaths,
								carnPhoto: wxres.tempFilePaths[0],
								show2: false
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
	previewImage2: function(e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList2
		})
	},
	chooseImage3: function() { //车头
		var that = this
		wx.chooseImage({
			sourceType: sourceType[0],
			sizeType: sizeType[0],
			count: 1,
			success: function(res) {
				//				console.log(res)
				var wxres = res;
        console.log(wxres);
				wx.uploadFile({
          url: app.globalData.baseUrl + 'app/upload/mid_check_img',
					filePath: res.tempFilePaths[0],
          name: 'front_img',
					header: {
						"Cookie": app.globalData.header.Cookie,
					},
					formData: {
						check_id: that.data.ckId
					},
					success: function(res) {
            //console.log(res)
						var resdata = JSON.parse(res.data);
						if(resdata.code == 1000) {
							that.setData({
								imageList3: wxres.tempFilePaths,
								cartPhoto: wxres.tempFilePaths[0],
								show3: false
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
	previewImage3: function(e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList3
		})
	}
})