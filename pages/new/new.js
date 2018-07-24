
//1:提现，2:
const CELL_TYPE = [1, 2, 3, 4, 5, 6, 7, 8, 9]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeCells: [{
      type: 1,
      text: '提现',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-2ae97187059b243b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '',
      visible: true
    }, {
      type: 2,
      text: '提现记录',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-c787785ebf84d971.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
        url: '../withdrawRecord/withdrawRecord',
      visible: true
    }, {
      type: 3,
      text: '收益记录',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-90fb413fc672c3dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '',
      visible: true
    }],
    ExceptionCells: [{
      type: 4,
      text: '损坏申报',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-23ef57a41ce19448.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '',
      visible: true
    }, {
      type: 5,
      text: '掉漆申报',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-51f84e196a11b983.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '',
      visible: true
    }, {
      type: 6,
      text: '违章申报',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-d6d2717348a94b1f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '',
      visible: true
    }],
    actionCells: [{
      type: 7,
      text: '推荐有奖',
      icon: '../../image/shmgc.png',
      url: '',
      visible: true
    }, {
      type: 8,
      text: '新手教程',
      icon: 'https://upload-images.jianshu.io/upload_images/4240944-9d66c194774e98c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      url: '',
      visible: true
    }, {
      type: 9,
      text: '注册认证',
      icon: '../../image/card.png',
      url: '',
      visible: true
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  handleAction(event){
    console.log(event);
  }

})