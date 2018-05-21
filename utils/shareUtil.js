/** 分享工具类 */

const app = getApp();

function getShareNormalTitle(){
  return '[有人@我]' + app.globalData.userInfo.nickName + '邀你一起来赚钱！';
}

function getShareAwardTitle(award) {
  return '[有人@我]' + app.globalData.userInfo.nickName + '已经赚了' + award + '元你还不来？点击领取';
}

module.exports = {
  getShareNormalTitle: getShareNormalTitle,
  getShareAwardTitle: getShareAwardTitle,
}