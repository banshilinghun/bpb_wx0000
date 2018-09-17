
//检测新版本弹窗
export const NEW_VERSION = 'check_version';

export function saveLocalStorage(key, value){
  wx.setStorageSync(key, value);
}

export function getLocalStorage(key){
  return wx.getStorageSync(key);
}