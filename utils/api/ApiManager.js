
const ModalHelper = require("../../helper/ModalHelper");

/**
 * API 接口管理
 */
let domainStrategy = {
  release: function(){
    return 'https://wxapi.benpaobao.com/';
  },
  release2: function(){
    return 'https://wxapi2.benpaobao.com/';
  },
  test: function(){
    return 'https://adapi.benpaobao.com/';
  },
  debug: function(){
    return 'http://192.168.2.172:8000/';
  }
}

/**
 * 加载域名
 */
function getBaseUrl() {
  return domainStrategy['release2']();
}

class uploadInfo {
  constructor(object) {
    this.url = object.url;
    this.filePath = object.filePath;
    this.fileName = object.fileName;
    this.formData = object.formData;
    this.header = object.header;
    this.success = object.success;
    this.fail = object.fail;
    this.complete = object.complete;
  }
}

class requestInfo {
  constructor(object) {
    this.url = object.url;
    this.data = object.data;
    this.header = object.header;
    this.success = object.success;
    this.fail = object.fail;
    this.complete = object.complete;
  }
}

/**
 * 上传文件 uploadInfo为 uploadInfo class 对象
 */
function uploadFile(uploadInfo) {
  if (!uploadInfo) {
    return;
  }
  wx.uploadFile({
    url: uploadInfo.url,
    filePath: uploadInfo.filePath,
    name: uploadInfo.fileName,
    header: getApp().globalData.header,
    formData: uploadInfo.formData,
    success: function (res) {
      if (res.statusCode == 200) {
        let dataBean = res.data;
        //json格式错误，解析对象失败，这时候手动parse
        if (typeof (dataBean) === 'string') {
          dataBean = JSON.parse(dataBean);
        }
        if (Number(dataBean.code) === 1000) {
          uploadInfo.success && uploadInfo.success(dataBean.data);
        } else {
          showModel(dataBean.msg);
          uploadInfo.fail && uploadInfo.fail(res);
        }
      } else {
        uploadInfo.fail && uploadInfo.fail(res);
        showModel(res.data.msg);
      }
    },

    fail: function (res) {
      uploadInfo.fail && uploadInfo.fail(res);
      showModel();
    },

    complete: function (res) {
      uploadInfo.complete && uploadInfo.complete(res);
    }
  })
}

/**
 * request请求 requestInfo为 requestInfo class 对象
 */
function sendRequest(requestInfo) {
  if (!requestInfo) {
    return;
  }
  wx.request({
    url: requestInfo.url,
    data: requestInfo.data,
    header: getApp().globalData.header,
    success: function (res) {
      if (res.statusCode == 200) {
        let dataBean = res.data;
        //json格式错误，解析对象失败，这时候手动parse
        if (typeof (dataBean) === 'string') {
          dataBean = JSON.parse(dataBean);
        }
        if (parseInt(dataBean.code) === 1000) {
          requestInfo.success && requestInfo.success(dataBean.data);
        } else if(parseInt(dataBean.code) === 2003) {
          //补充车型
          ModalHelper.showWxModalUseConfirm('提示', dataBean.msg, '立即补充', false, res => {
            wx.navigateTo({
              url: '../brandList/brandList?flag=1'
            })
          })
        } else {
          showModel(dataBean.msg);
          requestInfo.fail && requestInfo.fail(res);
        }
      } else {
        requestInfo.fail && requestInfo.fail(res);
        showModel(res.data.msg);
      }
    },

    fail: function (res) {
      requestInfo.fail && requestInfo.fail(res);
      showModel();
    },

    complete: function (res) {
      requestInfo.complete && requestInfo.complete(res);
    }
  })
}

function showModel(content) {
  if (!content) {
    content = '服务器开小差了\n\r~~~~(>_<)~~~~';
  }
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    confirmColor: "#ff555c"
  })
}

module.exports = {
  getBaseUrl: getBaseUrl,
  uploadInfo: uploadInfo,
  uploadFile: uploadFile,
  requestInfo: requestInfo,
  sendRequest: sendRequest,
}