// pages/moment/moment.js
const app = getApp();

var windowWidth;
var windowHeight;
const TEXT_COLOR = '#000000';
const WHITE = '#FFFFFF';
const THEME_COLOR = '#FF555C';
const GRAY_COLOR = '#333333';
const TINT_COLOR = '#747474';

const temp = 0.01;
//图片长宽比
const scale = 1.78;
//背景图高度
const bgScale = 0.5;
//头像和宽的比
const avatarWidthScale = 0.368;
const avatarHeightScale = 0.117;
//头像白色圆形背景
const avatarBgWidthScale = 0.38;
const avatarStrokeWidth = 4;
//昵称高度比
const nicknameHeightScale = 0.34 + 5 * temp;
//第一行文字高度
const topTextScale = 0.515 + 3 * temp;
//分享内容
const contentScale = 0.585 + 3 * temp;
//二维码直径
const qrCodeWidthScale = 0.341;
//二维码高度
const qrCodeHeightScale = 0.69;
//奔跑宝文字
const bpbScale = 0.90 + temp * 2;
//识别文字
const decodeScale = 0.935 + temp * 2;
//二维码地址
const QR_CODE_URL = app.globalData.baseUrl + 'app/get/wx_code';



Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailStr: {
      tip: '贴上广告，边跑边赚',
      content: '在奔跑宝能赚广告费的好事\n别说我没告诉你!',
      bpbMini: '奔跑宝小程序',
      clickToMini: '(长按进入赚钱)'
    },
    targetSharePath: null,
    avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Is9WGKAc9WE8lVyUNBWeGaEHgLg889UPQ2xxsicdu6y01ArKXyyxWEdT68iaEG7nMAib4lPKUVX2HW5icRp9PfhNuw/132',
    QRPath: null,
    avatarPath: null,
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    showShareModel: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowWidth * scale;
        that.setData({
          canvasHeight: windowHeight,
          imageWidth: windowWidth * 0.7,
          imageHeight: windowHeight *  0.7
        })
        console.log('imageHeight---------->' + that.data.imageHeight);
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.shareMoments();
  },

  /**
   * 生成分享图到朋友圈
   */
  shareMoments: function () {
    var that = this;
    //没有分享图先用 canvas 生成，否则直接预览
    if (that.data.targetSharePath) {
      that.previewImage();
    } else {
      //that.getQRCode();
      that.downloadAvatar();
    }
  },

  /**
 * 请求二维码图片
 */
  getQRCode: function () {
    var that = this;
    wx.request({
      url: QR_CODE_URL,
      header: app.globalData.header,
      data: {
        scene: 'id=1',
        page: 'pages/index/index'
      },
      success: function (res) {
        console.log(res);
        that.downloadQrCode(res.data.data.img_url);
      },
      fail: function (res) {
        that.showModel(res.data.msg);
      }
    })
  },

  /**
   * 下载二维码到本地
   */
  downloadQrCode: function (imageUrl) {
    console.log(imageUrl);
    var that = this;
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          QRPath: res.tempFilePath
        })
        that.downloadAvatar();
      }
    })
  },

  /**
   * 下载头像
   */
  downloadAvatar: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.avatar,
      success: function (res) {
        that.setData({
          avatarPath: res.tempFilePath
        })
        that.drawImage();
      }
    })
  },

  drawImage: function () {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas', this);
    var bgPath = '../../image/share-bg.png';
    ctx.setFillStyle(WHITE);
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, windowHeight * bgScale);

    //头像背景圆
    ctx.arc(windowWidth / 2, avatarWidthScale / 2 * windowWidth + avatarHeightScale * windowHeight, (avatarWidthScale / 2) * windowWidth + avatarStrokeWidth, 0, 2 * Math.PI);
    ctx.setFillStyle(WHITE);
    ctx.fill();

    //先绘制圆，裁剪成圆形图片
    ctx.save();
    ctx.beginPath();
    //圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
    ctx.arc(windowWidth / 2, avatarWidthScale / 2 * windowWidth + avatarHeightScale * windowHeight, (avatarWidthScale / 2) * windowWidth, 0, 2 * Math.PI);
    ctx.setStrokeStyle(WHITE);
    ctx.stroke();
    ctx.clip();
    //绘制头像
    //图片路径，左上角x坐标，左上角y坐标，宽，高
    var avatarWidth = avatarWidthScale * windowWidth;//头像半径
    ctx.drawImage(that.data.avatarPath, windowWidth * (0.5 - avatarWidthScale / 2), avatarHeightScale * windowHeight, avatarWidth, avatarWidth);
    ctx.restore();

    //绘制昵称
    ctx.setFillStyle(WHITE);
    ctx.setFontSize(20);
    ctx.setTextAlign('center');
    ctx.fillText('狗腿🌲', windowWidth / 2, nicknameHeightScale * windowHeight);

    //绘制文字一起赚
    ctx.setFillStyle(THEME_COLOR);
    ctx.setFontSize(24);
    ctx.setTextAlign('center');
    ctx.fillText(that.data.detailStr.tip, windowWidth / 2, topTextScale * windowHeight);

    //绘制 content
    ctx.setFillStyle(GRAY_COLOR);
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.fillText(that.data.detailStr.content, windowWidth / 2, contentScale * windowHeight);

    //绘制二维码
    ctx.drawImage(that.data.avatarPath, windowWidth * (0.5 - qrCodeWidthScale / 2), qrCodeHeightScale * windowHeight, qrCodeWidthScale * windowWidth, qrCodeWidthScale * windowWidth);

    //绘制 奔跑宝小程序
    ctx.setFillStyle(TINT_COLOR);
    ctx.setFontSize(16);
    ctx.setTextAlign('center');
    if (wx.canIUse('canvasContext.font')) {
      ctx.font = 'bold';
    }
    ctx.fillText(that.data.detailStr.bpbMini, windowWidth / 2, bpbScale * windowHeight);
    console.log('font------------>' + wx.canIUse('canvasContext.font'));

    //绘制 按压提示文字
    ctx.setFillStyle(TINT_COLOR);
    ctx.setFontSize(14);
    ctx.setTextAlign('center');
    if (wx.canIUse('canvasContext.font')) {
      ctx.font = 'normal';
    }
    ctx.fillText(that.data.detailStr.clickToMini, windowWidth / 2, decodeScale * windowHeight);

    //绘制到 canvas 上
    ctx.draw(false, function () {
      console.log('callback--------------->');
      that.saveCanvasImage();
    });
  },

  //转化为图片
  saveCanvasImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          targetSharePath: res.tempFilePath
        })
      }
    }, this)
  },

  /**
   * 保存到相册
   */
  saveImageTap: function(){
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.targetSharePath,
    })
  },

  closeModel: function(){
    this.hideDialog();
  },

  hideDialog: function(){
    this.setData({
      showShareModel: false
    })
  }
})