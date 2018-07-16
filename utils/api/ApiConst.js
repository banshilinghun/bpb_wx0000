
/** api 常量类以及方法调用 */

let ApiManager = require('../api/ApiManager.js');
let baseUrl = ApiManager.getBaseUrl();

// 红点显示
function GetDotUrl(){
  return baseUrl + 'app/get/bonus_flag';
}

//获取城市
function getCitys(){
  return baseUrl + 'app/get/citys';
}

//认证状态
function getAuthStatus(){
  return baseUrl + 'app/get/user_auth_status';
}

//添加银行卡
function addBankcard() { 
  return baseUrl + 'app/add/user_bankcard';
}

//银行卡信息
function getBankInfo(){
  return baseUrl + 'app/get/bank_info';
}

//自主检测
function uploadUserAd(){
  return baseUrl + 'app/regist/user_ad';
}

//上传图片
function uploadImg(){
  return baseUrl + 'app/regist/upload_img'
}

//预约时间
function getSubscribeDate(){
  return baseUrl + 'app/get/subscribe_dates';
}

//预约
function adSubscribe(){
  return baseUrl + 'app/save/ad_subscribe';
}

//取消预约
function cancelSubcribe(){
  return baseUrl + 'app/cancel/ad_subscribe';
}

//车型
function getBrands(){
  return baseUrl + 'app/get/brands';
}

//获取所有车型
function getAllBrands(){
  return baseUrl + 'app/get/all_brands';
}

//获取车型详情
function getBrandsDetail(){
  return baseUrl + 'app/get/brand_details';
}

//上传认证信息
function authIdentityInfo(){
  return baseUrl + 'app/user/auth_identity_info';
}

//上传认证照片
function uploadIdentityImg(){
  return baseUrl + 'app/user/upload_identity_img';
}

//期中检测
function midCheck(){
  return baseUrl + 'app/commit/mid_check';
}

//期中检测图片上传
function midCheckImg(){
  return baseUrl + 'app/upload/mid_check_img';
}

//广告检测计划
function adCheckPlans(){
  return baseUrl + 'app/find/ad_check_plans';
}

//押金
function userDepositIspaid(){
  return baseUrl + 'app/get/user_deposit_ispaid';
}

//交押金
function payUserDesposit(){
  return baseUrl + 'app/commit/pay_user_deposit';
}

//退押金信息查询
function checkAdFinsih(){
  return baseUrl + 'app/get/user_not_finish_ad';
}

//退押金
function depositSendback(){
  return baseUrl + 'app/commit/deposit_sendback';
}

// 广告参加列表
function adJoinedUser(){
  return baseUrl + 'app/get/ad_joined_users';
}

//广告信息
function getAdInfo(){
  return baseUrl + 'app/get/ad_info'
}

//获取推荐开关状态
function getShareFlag(){
  return baseUrl + 'app/get/share_flag';
}

//微信登录
function wxLogin(){
  return baseUrl + 'app/user/wx_login';
}

//登录
function loginUrl(){
  return baseUrl + 'app/user/login';
}

//广告列表
function adListUrl(){
  return baseUrl + 'app/get/ad_list';
}

//我的广告
function myAd(){
  return baseUrl + 'app/get/my_ad';
}

//查询是否关注公众号
function userHasSubcribe(){
  return baseUrl + 'app/get/user_has_subscribe';
}

//待收收益
function accountCoupon() { 
  return baseUrl + 'app/get/account_coupon';
}

//账户信息
function userAccount(){
  return baseUrl + 'app/get/account';
}

//余额
function collectAccountCoupon(){
  return baseUrl + 'app/get/collect_account_coupon';
}

//注册
function regist(){
  return baseUrl + 'app/user/regist';
}

//发送验证码
function registVerifyWx(){
  return baseUrl + 'app/get/regist_verify_wx';
}

//邀请奖励列表
function recommendRewardList(){
  return baseUrl + 'app/get/recommend_reward_list';
}

//推荐用户列表
function recommendationUser(){
  return baseUrl + 'app/get/recommendation_user';
}

//发送邀请通知
function recommenderNotify(){
  return baseUrl + 'app/send/recommender_notify';
}

//获取银行卡列表
function userBancard(){
  return baseUrl + 'app/get/user_bancard';
}

//账户信息
function getUserAccount(){
  return baseUrl + 'app/get/user_account';
}

//提现
function withdraw(){
  return baseUrl + 'app/commit/user_withdraw';
}

//服务网点列表
function adServerList(){
  return baseUrl + 'app/get/ad_server_list';
}

//获取二维码
function QrCode(){
  return baseUrl + 'app/get/wx_code';
}

//获取用户是否需要补充车型信息
function needAddCarModel(){
  return baseUrl + 'app/get/is_add_car_model';
}

//添加用户车型信息
function addCarModel(){
  return baseUrl + 'app/add/car_model_info';
}

//获取广告用户排队列表
function getQueueUser(){
  return baseUrl + 'app/get/ad_queue_users';
}

//用户加入广告排队
function takePartInQueue(){
  return baseUrl + 'app/join/user_ad_queue';
}

//取消用户广告排队
function cancelQueue(){
  return baseUrl + 'app/cancel/user_ad_queue';
}

//查询用户等待确认的预约信息
function  queryQueueInfo(){
  return baseUrl + 'app/query/user_waith_confirm_queue';
}

//确认预约排队信息
function confirmSubsQueue(){
  return baseUrl + 'app/confirm/wait_subscribe_info';
}

//拒绝预约排队信息
function refuseSubsQueue(){
  return baseUrl + 'app/refuse/wait_subscribe_info';
}

module.exports = {
  GetDotUrl: GetDotUrl,
  getCitys: getCitys,
  getAuthStatus: getAuthStatus,
  getBankInfo: getBankInfo,
  uploadUserAd: uploadUserAd,
  uploadImg: uploadImg,
  getSubscribeDate: getSubscribeDate,
  adSubscribe: adSubscribe,
  getBrands: getBrands,
  authIdentityInfo: authIdentityInfo,
  uploadIdentityImg: uploadIdentityImg,
  midCheck: midCheck,
  midCheckImg: midCheckImg,
  adCheckPlans: adCheckPlans,
  userDepositIspaid: userDepositIspaid,
  payUserDesposit: payUserDesposit,
  checkAdFinsih: checkAdFinsih,
  depositSendback: depositSendback,
  adJoinedUser: adJoinedUser,
  getAdInfo: getAdInfo,
  cancelSubcribe: cancelSubcribe,
  getShareFlag: getShareFlag,
  wxLogin: wxLogin,
  loginUrl: loginUrl,
  adListUrl: adListUrl,
  myAd: myAd,
  userHasSubcribe: userHasSubcribe,
  accountCoupon: accountCoupon,
  userAccount: userAccount,
  collectAccountCoupon: collectAccountCoupon,
  regist: regist,
  registVerifyWx: registVerifyWx,
  recommendRewardList: recommendRewardList,
  recommendationUser: recommendationUser,
  recommenderNotify: recommenderNotify,
  userBancard: userBancard,
  getUserAccount: getUserAccount,
  withdraw: withdraw,
  adServerList: adServerList,
  QrCode: QrCode,
  addBankcard: addBankcard,
  getAllBrands: getAllBrands,
  getBrandsDetail: getBrandsDetail,
  needAddCarModel: needAddCarModel,
  addCarModel: addCarModel,
  getQueueUser: getQueueUser,
  takePartInQueue: takePartInQueue,
  cancelQueue: cancelQueue,
  queryQueueInfo, queryQueueInfo,
  confirmSubsQueue: confirmSubsQueue,
  refuseSubsQueue: refuseSubsQueue
}