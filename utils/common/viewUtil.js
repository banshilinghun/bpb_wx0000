
/**
 * 得到 view 属性
 */
function getViewHeight(viewParams){
  return new Promise((resolve, reject) => {
    let query = wx.createSelectorQuery();
    //选择id
    query.select(viewParams).boundingClientRect(rect => {
      resolve(rect);
    }).exec();
  })
}

/**
 * 得到系统属性
 */
function getSystemInfo(){
  return new Promise(function (resolve, reject) {
    wx.getSystemInfo({
      success: function (res) {
        resolve(res);
      }
    });
  })
}

module.exports = {
  getViewHeight: getViewHeight,
  getSystemInfo: getSystemInfo
}