


Page({

  /**
   * 页面的初始数据
   */
  data: {
    designList: [
      {
        title: '设计效果1',
        effect: [{ src: 'https://images.unsplash.com/photo-1448376561459-dbe8868fa34c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=361907f0deaaf183ac4ce6b62551dfb3&auto=format&fit=crop&w=800&q=60', type: '车身左侧效果' }, { src: 'https://images.unsplash.com/photo-1494260629490-28c1e8e6f388?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=886e20939894ef5dafc54e0cf0cae59d&auto=format&fit=crop&w=800&q=60', type: '车身左侧效果' }, { src: 'https://images.unsplash.com/photo-1497350166004-48ec9adb78bb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fdfe84a326fba9000c444d1ab73d7d18&auto=format&fit=crop&w=800&q=60', type: '车身左侧效果' }]
      },
      {
        title: '设计效果2',
        effect: [{ src: 'https://images.unsplash.com/photo-1515052945961-bbb80118b74b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e24e067ea99c9f433d838baae5bdfa13&auto=format&fit=crop&w=800&q=60', type: '车身左侧效果' }, { src: 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=55cc23bc93a290d1cb4c651856d28c7a&auto=format&fit=crop&w=800&q=60', type: '车身左侧效果' }, { src: 'https://images.unsplash.com/photo-1497202379478-3998ceb0b40c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63a774d57b88b71b2a24fb479536e3f5&auto=format&fit=crop&w=800&q=60', type: '车身左侧效果' }]
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  handlePreview(event){
    console.log(event);
    let imageList = [];
    let effect = event.currentTarget.dataset.effect;
    if(!effect || effect.length === 0){
      return;
    }
    effect.forEach(element => {
      imageList.push(element.src);
    });
    wx.previewImage({
      current: imageList[event.currentTarget.dataset.index],
      urls: imageList
    })
  }

})