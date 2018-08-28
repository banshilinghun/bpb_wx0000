
export function showLoading(title){
  wx.showLoading({
    title: title || '奔跑中🚗...'
  });
}

export function hideLoading() { 
  wx.hideLoading();
}