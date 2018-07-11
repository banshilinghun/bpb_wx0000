// pages/brandDetail/brandDetail.js

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
    showDialog: false,
    carModels: [],
    flag: 1, // 1：表示补充车型，2：表示注册选择车型
    carModelId: '', //车型id
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
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  bindCarModel: function(event){
    console.log(event);
    this.setData({
      carModels: event.currentTarget.dataset.brand.details,
      modelName: event.currentTarget.dataset.brand.model_name,
      carModelId: event.currentTarget.dataset.brand.details[0].detail_id,
      detailName: event.currentTarget.dataset.brand.details[0].detail_name,
    })
    //选择款式
    if (this.data.carModels && this.data.carModels.length !== 0){
      this.setData({
        showDialog: true
      })
    }else{
      this.setData({
        showDialog: false
      })
    }
  },

  //确认
  selectListener: function(){
    var that = this;
    let flag = this.data.flag;
    if(flag == 1){
      //补充
      this.addCarModelInfo();
    }else if(flag == 2){
      console.log(that.data.brandName + ' ' + that.data.modelName + ' ' + that.data.detailName);
      //新增
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 3]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到认证页面中去
      prevPage.setData({
        carModel: that.data.carModelId,
        carModelDetail: that.data.brandName + ' ' + that.data.modelName + ' ' + that.data.detailName
      });
      wx.navigateBack({
        delta: 2,
      });
    }
  },

  radioChange: function(event){
    console.log(event.detail.value);
    this.setData({
      carModelId: event.detail.value
    })
    for (let i = 0; i < this.data.carModels.length; i++){
      let carModelBean = this.data.carModels[i];
      if (event.detail.value == carModelBean.detail_id){
        this.setData({
          detailName: carModelBean.detail_name
        })
      }
    }
  },

  hideDialog: function(){
    this.setData({
      showDialog: false
    })
  },

  //添加车型信息
  addCarModelInfo: function(){
    var that = this;
    if (!that.data.carModelId){
      wx.showModal({
        title: '提示',
        content: '请选择车型款式',
        showCancel: false,
      });
      return;
    }
    let requestData = {
      url: ApiConst.addCarModel(),
      data: {
        car_model: that.data.carModelId
      },
      header: app.globalData.header,
      success: res => {
        this.setData({
          showDialog: false
        })
        app.globalData.needAddCarModel = false;
        wx.showModal({
          title: '提示',
          content: '车型信息提交成功，请耐心等待审核',
          showCancel: false,
          success: res => {
            if(res.confirm){
              wx.navigateBack({
                delta: 2,
              })
            }
          }
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  }
})