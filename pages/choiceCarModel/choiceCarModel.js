
/** 选择车型款式 */

const app = getApp();
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carModelDetail: '',
    carModelList: [],
    checkedModel: null,
    falg: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //添加 checked 属性
    let carModels = JSON.parse(options.carModels);
    for(let i = 0; i < carModels.length; i++){
      let carModelBean = carModels[i];
      carModelBean.checked = false;
    }
    console.log(carModels);
    this.setData({
      carModelDetail: options.carModelDetail,
      carModelList: carModels,
      flag: options.flag
    })
  },

  modelClickListener: function(event){
    let that = this;
    let model = event.currentTarget.dataset.model;
    let carModelList = that.data.carModelList;
    for (let i = 0; i < carModelList.length; i++){
      let carModel = carModelList[i];
      if (model.detail_id == carModel.detail_id){
        carModel.checked = true;
        that.setData({
          checkedModel: carModel
        })
      }else{
        carModel.checked = false;
      }
    }
    that.setData({
      carModelList: carModelList
    });
  },

  back: function(){
    wx.navigateBack({});
  },

  confirm: function(){
    let that = this;
    let checkedModel = that.data.checkedModel;
    if(!checkedModel){
      wx.showToast({
        title: '请选择车辆款式',
      })
      return;
    }
    let modelContent = that.data.carModelDetail + ' ' + checkedModel.detail_name;
    wx.showModal({
      title: "车型确认",
      content: modelContent,
      success: res =>{
        if(res.confirm){
          that.selectListener(checkedModel);
        }
      }
    })
  },

  //确认
  selectListener: function (checkedModel) {
    let that = this;
    let flag = that.data.flag;
    if (flag == 1) {
      //补充
      that.addCarModelInfo(checkedModel);
    } else if (flag == 2) {
      //新增
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 4]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到认证页面中去
      prevPage.setData({
        carModel: checkedModel.detail_id,
        carModelDetail: that.data.carModelDetail + ' ' + checkedModel.detail_name
      });
      wx.navigateBack({
        delta: 3,
      });
    }
  },

  //添加车型信息
  addCarModelInfo: function (checkedModel) {
    let that = this;
    let requestData = {
      url: ApiConst.addCarModel(),
      data: {
        car_model: checkedModel.detail_id
      },
      header: app.globalData.header,
      success: res => {
        this.setData({
          showDialog: false
        })
        app.globalData.needAddCarModel = false;
        wx.showModal({
          title: '提示',
          content: '车型信息提交成功\n请耐心等待审核',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 3,
              })
            }
          }
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  }

})