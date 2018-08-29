/**
 * 格式化时间
 */
function friendly_time(time_stamp) {
  var now_d = new Date();
  var now_time = now_d.getTime() / 1000; //获取当前时间的秒数
  var f_d = new Date();
  f_d.setTime(time_stamp * 1000);
  var f_time = f_d.toLocaleDateString();

  var ct = now_time - time_stamp;
  console.log('ct----------->' + ct);
  var day = 0;
  if (ct < 0) {
    f_time = f_d.toLocaleDateString();
  } else if (ct < 86400) { //一天
    f_time = '今天';
  } else if (ct < 604800) { //7天
    day = Math.floor(ct / 86400);
    if (day < 2)
      f_time = '昨天';
    else
      f_time = day + '天前';
  } else {
    f_time = '7天前'
  }
  return f_time;
}

/**
 * 格式化时间 为 x月x日
 *
 * @param {*} date 时间
 */
function formatDateTime(date) {
  return date.replace(/(.+?)\-(.+?)\-(.+)/, "$2月$3日");
}

function formatDateTimeSprit(date) {
  return date.replace(/(.+?)\-(.+?)\-(.+)/, "$2/$3");
}

Date.prototype.Format = function () {
  const Y = this.getFullYear() + '-';
  const M = (this.getMonth() + 1 < 10 ? '0' + (this.getMonth() + 1) : this.getMonth() + 1) + '-';
  const D = this.getDate() + ' ';
  const h = this.getHours() + ':';
  const m = this.getMinutes() + ':';
  const s = this.getSeconds();
  return `${Y}${M}${D}`;
}

/**
 * 将时间戳转换为 日期格式
 * @param {*} timestamp  yyyy-MM-dd HH:mm:ss
 */
function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).Format();
}

module.exports = {
  friendly_time: friendly_time,
  formatDateTime: formatDateTime,
  formatDateTimeSprit: formatDateTimeSprit,
  formatTimestamp: formatTimestamp
}