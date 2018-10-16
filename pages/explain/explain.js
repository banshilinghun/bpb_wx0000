//解释说明页面


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showExplain: true,
    explainState: 1,
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title;
    switch(Number(options.state)){
      case 1:
        title = '预约排队说明';
        break;
      case 2:
        title = '车辆要求说明';
        break;
    }
    this.setData({
      explainState: options.state,
      title: title
    });
  }

})