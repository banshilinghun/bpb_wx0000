// pages/brandDetail/brandDetail.js

const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
let brandId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandLogo: '',
    brandName: '',
    modelList: [],
    showDialog: false,
    carModels: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    brandId = options.brand_id;
    this.setData({
      brandLogo: options.brand_logo,
      brandName: options.brand_name
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
      success: res => {
        that.setData({
          modelList: res
        })
      },
      complete: res => {

      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  bindCarModel: function(event){
    console.log(event);
    this.setData({
      carModels: event.currentTarget.dataset.brand.details
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

  selectListener: function(){

  },

  radioChange: function(event){
    console.log(event.detail.value);
    console.log(event.detail.value.detail_id);
  },

  hideDialog: function(){
    this.setData({
      showDialog: false
    })
  }

})