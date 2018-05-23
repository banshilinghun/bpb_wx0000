/** 分享工具类 */

const app = getApp();

/**
 * 普通拉新分享title
 */
function getShareNormalTitle(){
  return '[' + app.globalData.userInfo.nickName + '@我]'  + ' 有钱一起赚！在奔跑宝能赚广告费的好事别说我没告诉你！';
}

/**
 * 领取奖励分享title
 */
function getShareAwardTitle(award, awardType) {
  let awardTypeStr;
  if (awardType == 2){
    awardTypeStr = '推荐奖励';
  } else if (awardType == 3){
    awardTypeStr = '广告奖励';
  }else{
    awardTypeStr = '新手奖励';
  }
  return '[' + app.globalData.userInfo.nickName + '@我]' + ' 我刚领取了' + awardTypeStr + award + '元，你还不来？点击领取！';
}

/**
 * 广告分享title
 */
function getShareAdTitle(){
  return '[' + app.globalData.userInfo.nickName + '@我]' + ' 开车不顺手赚广告费是你的损失了！';
}

module.exports = {
  getShareNormalTitle: getShareNormalTitle,
  getShareAwardTitle: getShareAwardTitle,
  getShareAdTitle: getShareAdTitle
}