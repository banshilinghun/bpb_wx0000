var util = require("../../utils/common/util");
const ApiManager = require('../../utils/api/ApiManager');
const ApiConst = require("../../utils/api/ApiConst.js");
const LoadingHelper = require('../../helper/LoadingHelper');
const ModalHelper = require('../../helper/ModalHelper');
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
    disabled: true,
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    parkingData: false, //是否展示剩余车位按钮
    flag: false, //防止多次点击的阀门
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1: '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
    keyboard2: '',
    keyboard2For: ['完成'],
    keyboardValue: '',
    textArr: [],
    textValue: '',
    provinces: [],
    brands: [],
    citys: [],
    models: [],
    areas: [],
    province: '',
    brand: '',
    model: '',
    city: '',
    address: {},
    carList: {},
    sourceType: {},
    car_color: '',
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    addressMenuIsShow2: false,
    istrue: true,
    value: [0, 0],
    value2: [0, 0],
    car_type: 1,
    is_bad: 2,
    show1: true,
    show2: true,
    scrollHeight: 0,
    color: [{
        'carColor': '#ffffff',
        'name': '白色',
        id: 1
      },
      {
        'carColor': '#323232',
        'name': '黑色',
        id: 2
      },
      {
        'carColor': '#e7e7e7',
        'name': '银色',
        id: 3
      },
      {
        'carColor': '#f00a0a',
        'name': '红色',
        id: 4
      },
      {
        'carColor': '#d8bc3c',
        'name': '金色',
        id: 5
      },
      {
        'carColor': '#3275e4',
        'name': '蓝色',
        id: 6
      },
      {
        'carColor': '#804318',
        'name': '棕色',
        id: 7
      },
      {
        'carColor': '#991abe',
        'name': '紫色',
        id: 8
      },
      {
        'carColor': '#50ce5f ',
        'name': '绿色',
        id: 9
      },
      {
        'carColor': '#f792c8 ',
        'name': '粉色',
        id: 10
      },
      {
        'carColor': '#ffac29  ',
        'name': '黄色',
        id: 11
      }
    ]
  },

  onLoad: function (options) {
    var that = this;
    that.judgeCanIUse();
    var colorName = [];
    for (var i = 0; i < that.data.color.length; i++) {
      colorName.push(that.data.color[i].name);
    }
    this.setData({
      colorName: colorName
    })

    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.setScrollHeight();
    this.fillAuthInfo();
  },

  setScrollHeight() {
    const that = this;
    let proSystem = new Promise(function (resolve, reject) {
      wx.getSystemInfo({
        success: function (res) {
          resolve(res);
        }
      });
    })
    let proButton = new Promise((resolve, reject) => {
      let query = wx.createSelectorQuery();
      //选择id
      query.select('#commit').boundingClientRect(rect => {
        resolve(rect);
      }).exec();
    });
    Promise.all([proSystem, proButton]).then(results => {
      that.setData({
        scrollHeight: results[0].windowHeight - results[1].height
      });
    })
  },

  /**
   * 填充车主已有认证信息
   */
  fillAuthInfo() {
    const that = this;
    LoadingHelper.showLoading();
    let requestData = {
      url: ApiConst.GET_USER_AUTH_INFO,
      data: {},
      success: res => {
        let carPhotoList = [];
        if(res.car_photo){
          carPhotoList.push(res.car_photo);
        }
        let licensePhotoList = [];
        if(res.driving_license_photo){
          licensePhotoList.push(res.driving_license_photo);
        }
        that.setData({
          userName: res.real_name,
          textValue: res.plate_no,
          car_type: res.car_type? res.car_type : 1,
          is_bad: res.is_bad? res.is_bad : 2,
          brandName: res.brand_name,
          carModel: res.car_model,
          car_color: res.car_color,
          imageList: carPhotoList,
          carPhoto: res.car_photo,
          imageList2: licensePhotoList,
          licensePhoto: res.driving_license_photo,
          show1: res.car_photo? false : true,
          show2: res.driving_license_photo? false : true
        })
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  /**
   * 判断 微信版本 兼容性
   */
  judgeCanIUse: function () {
    var that = this;
    //组件不兼容
    //微信版本过低
    if (!wx.canIUse('picker.mode.selector')) {
      that.showLowVersionTips();
    }
  },

  showLowVersionTips: function () {
    wx.showModal({
      title: '提示',
      content: '您当前微信版本过低，将导致无法正常使用奔跑宝小程序，请升级到微信最新版本。',
      showCancel: false,
      success: function (res) {},
    })
  },

  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
  },

  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(56 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },

  startAddressAnimation2: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(56 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow2: isShow,
    })
  },

  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },

  sourceTypeChange2: function (e) {
    this.setData({
      car_color: this.data.colorName[e.detail.value]
    })
  },

  showMenuTap: function (e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },

  // 选择状态按钮
  selectState: function (e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
  },

  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },

  selectBrand: function (e) {
    var that = this
    if (that.data.addressMenuIsShow2) {
      return
    }
    //车型选择改变
    wx.navigateTo({
      url: '../brandList/brandList?flag=2',
    })
  },

  formSubmit: function (e) {
    console.log(e)
    var param = e.detail.value;
    var formId = e.detail.formId;
    this.mysubmit(param, formId);
  },

  mysubmit: function (param, formId) {
    let user_name = param.name;
    var carPhoto = this.data.carPhoto;
    var licensePhoto = this.data.licensePhoto;
    var car_color = this.data.car_color;
    var is_bad = this.data.is_bad;
    var car_type = this.data.car_type;
    let carModel = this.data.carModel;
    let plate_no = this.data.textValue;
    var formData = {
      real_name: user_name,
      plate_no: plate_no,
      form_id: formId,
      car_color: car_color,
      car_type: car_type,
      is_bad: is_bad,
      car_model: carModel
    }
    console.log(formData)
    if (!user_name) {
      ModalHelper.showWxModal('提示', '请输入车主姓名', '我知道了', false);
      return;
    }
    if (!this.checkCarCode(plate_no)) {
      return;
    }
    if (!carModel) {
      ModalHelper.showWxModal('提示', '请选择车型', '我知道了', false);
      return;
    }
    if (!car_color) {
      ModalHelper.showWxModal('提示', '请选择车辆颜色', '我知道了', false);
      return;
    }
    if (!carPhoto) {
      ModalHelper.showWxModal('提示', '请上传车辆画面', '我知道了', false);
      return;
    }
    if (!licensePhoto) {
      ModalHelper.showWxModal('提示', '请上传行驶证照片', '我知道了', false);
      return;
    }
    //发起提交认证请求
    LoadingHelper.showLoading();
    let requestData = {
      url: ApiConst.AUTH_IDENTITY_INFO,
      data: formData,
      success: res => {
        wx.showToast({
          title: "提交成功"
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../state/state?followFlag=1'
          })
        }, 1000);
      },
      complete: res => {
        LoadingHelper.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  radioChange: function (e) {
    this.setData({
      car_type: e.detail.value
    })
  },

  switchChange: function (e) {
    this.setData({
      is_bad: e.detail.value
    })
  },

  goStep: function () {
    this.setData({
      currentMenuID: '1',
      currentPage: 1
    })
  },

  //车辆照片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[2],
      sizeType: sizeType[0],
      count: 1,
      success: function (res) {
        console.log(res)
        var wxres = res;
        wx.uploadFile({
          url: ApiConst.UPLOAD_IDENTITY_IMG,
          filePath: res.tempFilePaths[0],
          name: 'car',
          header: {
            "Cookie": app.globalData.header.Cookie,
          },
          success: function (res) {
            var resdata = JSON.parse(res.data);
            if (resdata.code == 1000) {
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

  //行驶证
  chooseImage2: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[2],
      sizeType: sizeType[0],
      count: 1,
      success: function (res) {
        console.log(res)
        var wxres = res;
        wx.uploadFile({
          url: ApiConst.UPLOAD_IDENTITY_IMG,
          filePath: res.tempFilePaths[0],
          name: 'license',
          header: {
            "Cookie": app.globalData.header.Cookie,
          },
          success: function (res) {
            var resdata = JSON.parse(res.data);
            if (resdata.code == 1000) {
              that.setData({
                imageList2: wxres.tempFilePaths,
                licensePhoto: wxres.tempFilePaths[0],
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

  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  checkName: function (param) {
    var name = param.name;
    if (name) {
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

  checkCity: function (param) {
    var city = param.city;
    if (city) {
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

  checkCarCode: function (plate_no) {
    console.log(plate_no);
    if (plate_no) {
      if (util.isVehicleNumber(plate_no)) {
        return true;
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '输入的车牌号不合法'
        });
        return false;
      }
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入的车牌号'
      });
    }

  },

  checkBrand: function (param) {
    var brand = param.brand;
    if (brand) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择车型'
      });
      return false;
    }
  },

  checkColor: function (param) {
    var color = param.color;
    if (color) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择车辆颜色'
      });
      return false;
    }
  },

  showKeyboard: function () {
    var self = this;
    self.setData({
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
      });
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
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
    console.log('carModelDetail------->' + this.data.carModelDetail);
    console.log('carModel------->' + this.data.carModel);
    if (this.data.carModelDetail) {
      this.setData({
        brandName: this.data.carModelDetail
      })
    }
  },

  tapSpecBtn: function () {
    this.hideKeyboard();
  }
})