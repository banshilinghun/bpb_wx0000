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
  if(status === SERVER_RUNING){
    if(dataBean.now_date <= dataBean.end_date){
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
      adStatusStr = `剩余${ adBean.current_count }`;
      break;
    case RUNNING:
      adStatusStr = '投放中';
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