
/** 车型厂商列表 */

const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const app = getApp();
let brandId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandLogo: '',
    brandName: '',
    modelName: '',
    detailName: '',
    modelList: [],
    carModels: [],
    flag: 1, // 1：表示补充车型，2：表示注册选择车型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    brandId = options.brand_id;
    this.setData({
      brandLogo: options.brand_logo,
      brandName: options.brand_name,
      flag: options.flag || 1
    })
    this.requestBrandsDetail();
  },

  requestBrandsDetail: function () {
    var that = this;
    wx.showLoading({
      title: '奔跑中🚗...'
    });
    let requestData = {
      url: ApiConst.getBrandsDetail(),
      data: {
        brand_id: brandId
      },
      header: app.globalData.header,
      success: res => {
        that.setData({
          modelList: res
        })
      },
      complete: res => {
        wx.hideLoading();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  bindCarModel: function(event){
    console.log(event);
    let that = this;
    this.setData({
      carModels: event.currentTarget.dataset.brand.details,
      modelName: event.currentTarget.dataset.brand.model_name
    })
    //选择款式
    wx.navigateTo({
      url: '../choiceCarModel/choiceCarModel?carModels=' + JSON.stringify(that.data.carModels) + '&carModelDetail=' + that.data.brandName + ' ' + that.data.modelName + '&flag=' + that.data.flag
    })
  },

  previewModelLogo: function(event){
    wx.previewImage({
      urls: [event.currentTarget.dataset.image]
    })
  }
})