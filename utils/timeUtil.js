
/**
 * 格式化时间
 */
function friendly_time(time_stamp) {
  var now_d = new Date();
  var now_time = now_d.getTime() / 1000;//获取当前时间的秒数
  var f_d = new Date();
  f_d.setTime(time_stamp * 1000);
  var f_time = f_d.toLocaleDateString();

  var ct = now_time - time_stamp;
  console.log('ct----------->' + ct);
  var day = 0;
  if (ct < 0) {
    f_time = f_d.toLocaleDateString();
  } else if (ct < 86400) {//一天
    f_time = '今天';
  } else if (ct < 604800) {//7天
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

module.exports = {
  friendly_time: friendly_time
}