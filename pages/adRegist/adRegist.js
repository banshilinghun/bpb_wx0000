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
    istrue:true,
    show1: true,
    show2: true,
    show3: true,
    carw: false,
    cart: false,
    carn: false
  },
  onLoad: function (options) {
    var adData = JSON.parse(options.adData);
    var adId = {};
    adId.ad_id = adData.adid;
    this.setData({
      adId: adData.adid,
      type: adData.type
    })
    if (adData.type == 0) {
      this.setData({
        carw: true
      })
    }
    if (adData.type == 1) {
      this.setData({
        cart: true,
        carn: true
      })
    }
    if (adData.type == 2) {
      this.setData({
        carw: true,
        carn: true
      })
    }
  },


  formSubmit: function (e) {
    var param = e.detail.value;
    var formId = e.detail.formId;
    this.mysubmit(param,formId);
  },
  mysubmit: function (param,formId) {
    //var uid = app.globalData.uid;
    var adId = this.data.adId;
    //		console.log(param)
    var formData = {
      ad_id: adId,
      form_id:formId
    }
    //console.log(formData)
    var carwPhoto = this.data.carwPhoto;
    var carnPhoto = this.data.carnPhoto;
    var cartPhoto = this.data.cartPhoto;
    //		console.log(formData);
    if (this.data.type == 0) {
      if (carwPhoto == undefined) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请上传车尾照片'
        });
      } else {
        wx.request({
          url: 'https://wxapi.benpaobao.com/app/regist/user_ad',
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
    }

    if (this.data.type == 1) {
      if (cartPhoto == undefined) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请上传车头照片'
        });
      }
      if (carnPhoto == undefined) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请上传车内照片'
        });
      }
      if (cartPhoto != undefined && carnPhoto != undefined) {
        wx.request({
          url: 'https://wxapi.benpaobao.com/app/regist/user_ad',
          header: app.globalData.header,
          data: formData,
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
    }
    if (this.data.type == 2) {
      if (carnPhoto == undefined) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请上传车内照片'
        });
      }
      if (carwPhoto == undefined) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请上传车尾照片'
        });
      }
      if (carnPhoto != undefined && carwPhoto != undefined) {
        wx.request({
          url: 'https://wxapi.benpaobao.com/app/regist/user_ad',
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
    }
  },

  chooseImage: function () { //车尾
    var that = this;
    wx.chooseImage({
      sourceType: sourceType[0],
      sizeType: sizeType[2],
      count: 1,
      success: function (res) {
        //				console.log(res)
        var wxres = res;

        wx.uploadFile({
          url: 'https://wxapi.benpaobao.com/app/regist/upload_img',
          filePath: res.tempFilePaths[0],
          name: 'behind_car',
          header: {
            "Cookie": app.globalData.header.Cookie,
          },
          formData: {
            ad_id: that.data.adId
          },
          success: function (res) {
            var resdata = JSON.parse(res.data);
            if (resdata.code == 1000) {
              that.setData({
                imageList: wxres.tempFilePaths,
                carwPhoto: wxres.tempFilePaths[0],
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
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  chooseImage2: function () { //车内
    var that = this
    wx.chooseImage({
      sourceType: sourceType[0],
      sizeType: sizeType[2],
      count: 1,
      success: function (res) {
        //				console.log(res)
        var wxres = res;

        wx.uploadFile({
          url: 'https://wxapi.benpaobao.com/app/regist/upload_img',
          filePath: res.tempFilePaths[0],
          name: 'inside_car',
          header: {
            "Cookie": app.globalData.header.Cookie,
          },
          formData: {
            ad_id: that.data.adId
          },
          success: function (res) {
            var resdata = JSON.parse(res.data);
            if (resdata.code == 1000) {
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
  previewImage2: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList2
    })
  },
  chooseImage3: function () { //车头
    var that = this
    wx.chooseImage({
      sourceType: sourceType[0],
      sizeType: sizeType[2],
      count: 1,
      success: function (res) {
        //				console.log(res)
        var wxres = res;

        wx.uploadFile({
          url: 'https://wxapi.benpaobao.com/app/regist/upload_img',
          filePath: res.tempFilePaths[0],
          name: 'front_car',
          header: {
            "Cookie": app.globalData.header.Cookie,
          },
          formData: {
            ad_id: that.data.adId
          },
          success: function (res) {
            var resdata = JSON.parse(res.data);
            if (resdata.code == 1000) {
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
  previewImage3: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList3
    })
  }
})