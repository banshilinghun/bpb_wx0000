
/**
 * API 接口管理
 */
const domainArray = ['release', 'release2', 'debug']
//api 1
const domain = domainArray[2];//1

const releaseDomain = 'https://wxapi.benpaobao.com/';
const releaseDomain2 = 'https://wxapi2.benpaobao.com/';
const debugDomain = 'https://adapi.benpaobao.com/';

/**
 * 加载域名
 */
function getBaseUrl() {
  switch (domain) {
    case domainArray[0]:
      return releaseDomain;
    case domainArray[1]:
      return releaseDomain2;
    case domainArray[2]:
      return debugDomain;
    default:
      return releaseDomain;
  }
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
    header: uploadInfo.header,
    formData: uploadInfo.formData,
    success: function (res) {
      if (res.statusCode == 200) {
        let dataBean = res.data;
        //json格式错误，解析对象失败，这时候手动parse
        if (typeof (dataBean) == 'string') {
          dataBean = JSON.parse(dataBean);
        }
        if (dataBean.code == 1000) {
          uploadInfo.success && uploadInfo.success(dataBean.data);
        } else {
          showModel(res.data.msg);
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
    header: requestInfo.header,
    success: function (res) {
      if (res.statusCode == 200) {
        let dataBean = res.data;
        //json格式错误，解析对象失败，这时候手动parse
        if (typeof (dataBean) == 'string') {
          dataBean = JSON.parse(dataBean);
        }
        if (dataBean.code == 1000) {
          requestInfo.success && requestInfo.success(dataBean.data);
        } else {
          showModel(res.data.msg);
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
    showCancel: false
  })
}

module.exports = {
  getBaseUrl: getBaseUrl,
  uploadInfo: uploadInfo,
  uploadFile: uploadFile,
  requestInfo: requestInfo,
  sendRequest: sendRequest,
}