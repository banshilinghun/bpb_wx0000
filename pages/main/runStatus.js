// 广告的状态  0:广告未开始(即将开始) 1:广告发布中 2:投放中 3:检测中 4:已结束 
export const NOT_BEGIN = 0;
export const PUBLISHED = 1;
export const RUNNING = 2;
export const CHECKING = 3;
export const FINISH = 4;

//服务端返回的状态， 12:发布中   13:投放中  14:已结束
const SERVER_PUBLISH = 12;
const SERVER_RUNING = 13;
const SERVER_FINISH = 14;

/**
 * 判断广告状态
 */
export function getRunStatus(dataBean) {
  let status = parseInt(dataBean.status);
  if (status === SERVER_PUBLISH) {
    if (dataBean.publish_date && dataBean.publish_date > dataBean.now_date) { // publish_date (发布日期（为空说明是立即发布）)
      return NOT_BEGIN; //即将开始
    } else {
      return PUBLISHED;
    }
  }
  if (status === SERVER_FINISH) {
    return FINISH;
  }
  if (status === SERVER_RUNING) {
    if (dataBean.now_date <= dataBean.end_date) {
      return RUNNING;
    } else {
      return CHECKING;
    }
  }
}

/**
 * 广告当前状态描述
 * @param {} adBean 单个广告信息
 */
export function getAdStatusStr(adBean) {
  let status = getRunStatus(adBean);
  console.log('status--------->' + status);
  let adStatusStr = '';
  switch (status) {
    case NOT_BEGIN:
      adStatusStr = '即将开始';
      break;
    case PUBLISHED:
      adStatusStr = '剩余';
      break;
    case RUNNING:
      adStatusStr = '奔跑中';
      break;
    case CHECKING:
      adStatusStr = '检测中';
      break;
    case FINISH:
      adStatusStr = '已结束';
      break;
    default:
      console.error('广告状态不匹配');
      break;
  }
  return adStatusStr;
}

//未开始
export const NOT_BEGIN_ACTION = 0;
//可预约
export const SUBSCRIBE_ACTION = 1;
//预约数量不足
export const NO_COUNT_ACTION = 2;
//已经接了广告
export const OWNER_ACTION = 3;
//投放中
export const RUNING_ACTION = 4;
//检测中
export const CHECKING_ACTION = 5;
//已结束
export const FINISH_ACTION = 6;
//可排队
export const QUEUE_ACTION = 7;
//取消排队
export const CANCEL_QUEUE_ACTION = 8;
//车身颜色不满足
export const COLOR_REJECT_ACTION = 9;

/**
 * 预约按钮文字
 */
export function updateActionStr(actionStatus) {
  let actionStr = '';
  switch (actionStatus) {
    case NOT_BEGIN_ACTION:
      actionStr = '即将开始';
      break;
    case SUBSCRIBE_ACTION:
    case NO_COUNT_ACTION:
    case COLOR_REJECT_ACTION:
      actionStr = '立即预约';
      break;
    case OWNER_ACTION:
      actionStr = '查看我的任务';
      break;
    case RUNING_ACTION:
      actionStr = '奔跑中';
      break;
    case CHECKING_ACTION:
      actionStr = '广告检测中';
      break;
    case FINISH_ACTION:
      actionStr = '广告已结束';
      break;
    case QUEUE_ACTION:
      actionStr = '预约排队';
      break;
    case QUEUE_ACTION:
      actionStr = '取消排队';
      break;
    default:
      break;
  }
  console.log(actionStr);
  return actionStr;
}