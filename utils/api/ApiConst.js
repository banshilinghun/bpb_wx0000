
/** api 常量类以及 url 调用 */

let ApiManager = require('../api/ApiManager.js');
let baseUrl = ApiManager.getBaseUrl();

// 红点显示
export const GET_DOT_URL = baseUrl + 'app/get/bonus_flag';

//获取城市
export const GET_CITYS = baseUrl + 'app/get/citys';

//认证状态
export const GET_AUTH_STATUS = baseUrl + 'app/get/user_auth_status';

//添加银行卡
export const ADD_BANKCARD = baseUrl + 'app/add/user_bankcard';

//银行卡信息
export const GET_BANK_INFO = baseUrl + 'app/get/bank_info';

//自主检测
export const UPLOAD_USER_AD = baseUrl + 'app/regist/user_ad';

//上传图片
export const UPLOAD_IMG = baseUrl + 'app/regist/upload_img';

//预约时间
export const GET_SUBSCRIBE_DATE = baseUrl + 'app/get/subscribe_dates';

//预约
export const AD_SUBSCRIBE = baseUrl + 'app/save/ad_subscribe';

//取消预约
export const CANCEL_SUBSCRIBE = baseUrl + 'app/cancel/ad_subscribe';

//车型
export const GET_BRANDS = baseUrl + 'app/get/brands';

//获取所有车型
export const GET_ALL_BRANDS = baseUrl + 'app/get/all_brands';

//获取车型详情
export const GET_BRANDS_DETAIL = baseUrl + 'app/get/brand_details';

//上传认证信息
export const AUTH_IDENTITY_INFO = baseUrl + 'app/user/auth_identity_info';

//上传认证照片
export const UPLOAD_IDENTITY_IMG = baseUrl + 'app/user/upload_identity_img';

//期中检测
export const MID_CHECK = baseUrl + 'app/commit/mid_check';

//期中检测图片上传
export const MID_CHECK_IMG = baseUrl + 'app/upload/mid_check_img';

//广告检测计划
export const AD_CHECK_PLANS = baseUrl + 'app/find/ad_check_plans';

//押金
export const USER_DEPOSIT_ISPAID = baseUrl + 'app/get/user_deposit_ispaid';

//交押金
export const PAY_USER_DESPOSIT = baseUrl + 'app/commit/pay_user_deposit';

//退押金信息查询
export const CHECK_AD_FINISH = baseUrl + 'app/get/user_not_finish_ad';

//退押金
export const DESPOSIT_SENDBACK = baseUrl + 'app/commit/deposit_sendback';

// 广告参加列表
export const AD_JOINED_USER = baseUrl + 'app/get/ad_joined_users';

//广告信息
export const GET_AD_INFO = baseUrl + 'app/get/ad_info';

//获取推荐开关状态
export const GET_SHARE_FLAG = baseUrl + 'app/get/share_flag';

//微信登录
export const WX_LOGIN = baseUrl + 'app/user/wx_login';

//登录
export const LOGIN_URL = baseUrl + 'app/user/login';

//广告列表
export const AD_LIST_URL = baseUrl + 'app/get/ad_list';

//我的广告
export const MY_AD = baseUrl + 'app/get/my_ad';

//查询是否关注公众号
export const USER_HAS_SUBCRIBE = baseUrl + 'app/get/user_has_subscribe';

//待收收益
export const ACCOUNT_COUPON = baseUrl + 'app/get/account_coupon';

//账户信息
export const USER_ACCOUNT = baseUrl + 'app/get/account';

//余额
export const COLLECT_ACCOUNT_COUPON = baseUrl + 'app/get/collect_account_coupon';

//注册
export const REGIST = baseUrl + 'app/user/regist';

//发送验证码
export const REGIST_VERRIFY_WX = baseUrl + 'app/get/regist_verify_wx';

//邀请奖励列表
export const RECOMMEND_REWARD_LIST = baseUrl + 'app/get/recommend_reward_list';

//推荐用户列表
export const RECOMMENDDATION_USER = baseUrl + 'app/get/recommendation_user';

//发送邀请通知
export const RECOMMENDER_NOTIFY = baseUrl + 'app/send/recommender_notify';

//获取银行卡列表
export const USER_BBANCARD = baseUrl + 'app/get/user_bancard';

//账户信息
export const GET_USER_ACCOUNT = baseUrl + 'app/get/user_account';

//提现
export const WITHDRAW = baseUrl + 'app/commit/user_withdraw';

//服务网点列表
export const AD_SERVER_LIST = baseUrl + 'app/get/ad_server_list';

//获取二维码
export const QR_CODE = baseUrl + 'app/get/wx_code';

//获取用户是否需要补充车型信息
export const NEED_ADD_CAR_MODEL = baseUrl + 'app/get/is_add_car_model';

//添加用户车型信息
export const ADD_CAR_MODEL_INFO = baseUrl + 'app/add/car_model_info';

//获取广告用户排队列表
export const GET_QUEUE_USER = baseUrl + 'app/get/ad_queue_users';

//用户加入广告排队
export const TAKE_PART_IN_QUEUE = baseUrl + 'app/join/user_ad_queue';

//取消用户广告排队
export const CANCEL_QUEUE = baseUrl + 'app/cancel/user_ad_queue';

//查询用户等待确认的预约信息
export const QUERY_QUEUE_INFO = baseUrl + 'app/query/user_waith_confirm_queue';

//确认预约排队信息
export const CONFIRM_SUBS_QUEUE = baseUrl + 'app/confirm/wait_subscribe_info';

//拒绝预约排队信息
export const REGUSE_SUBS_QUEUE = baseUrl + 'app/refuse/wait_subscribe_info';

//获取用户个人广告列表
export const GET_USER_PERSONAL_AD_LIST = baseUrl + 'app/get/user_personal_adlist';

//获取用户车辆信息
export const GET_USER_CAR_INFO = baseUrl + 'app/get/user_carinfo';

//获取用户车辆信息
export const GET_AD_STATION_LIST = baseUrl + 'app/get/ad_station_list';

//保存预约信息
export const UPDATE_USER_RESERVE = baseUrl + 'app/save/user_reserve';

//提交用户签到请求
export const COMMIT_RESERVE_SIGNIN = baseUrl + 'app/commit/user_reserve_signin';

//取消预约
export const CANCEL_USER_RESERVE = baseUrl + 'app/cancel/user_reserve';

//我的任务
export const GET_MY_TASK_LIST = baseUrl + "app/get/my_task_list";

//上传广告登记图片
export const UPLOAD_REGIST_IMG = baseUrl + "app/upload/ad_regist_img";

//提交广告登记信息
export const COMMIT_REGIST_INFO = baseUrl + "app/commit/ad_regist_info";
