
// 0:广告未开始(即将开始) 1:广告发布中 2:投放中 3:检测中 4:已结束
const STATUS = [0, 1, 2, 3, 4];

/**
 * 判断广告状态
 */
export function getRunStatus(dataBean) {
  if(dataBean.status == 14) {
    return STATUS[4];
  }
  if (dataBean.publish_date && dataBean.publish_date > dataBean.now_date) { // publish_date (发布日期（为空说明是立即发布）)
    return STATUS[0]; //即将开始
  } else {
    console.log(dataBean.now_date);
    console.log(dataBean.begin_date);
    console.log(dataBean.now_date < dataBean.begin_date);
    if (dataBean.now_date < dataBean.begin_date) { //发布中，可开始预约
      return STATUS[1];
    } else if (dataBean.now_date >= dataBean.begin_date && dataBean.now_date < dataBean.end_date) {
      if (Number(dataBean.current_count) > 0){ // 已到开始时间，但是没投完
        return STATUS[1];
      } else { // 已到开始时间，投放中
        return STATUS[2];
      }
    } else { // 发布已到结束时间，开始检测
      return STATUS[3];
    }
  }
}
