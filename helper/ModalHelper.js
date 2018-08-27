  /**
   * 微信通用模态弹窗
   * @param {*} title  标题
   * @param {*} content 内容
   * @param {*} confirmText 确认按钮文字
   * @param {*} showCancel 是否显示取消按钮
   */
  export function showWxModal(title, content, confirmText, showCancel) {
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      showCancel: showCancel,
      confirmColor: "#ff555c"
    })
  }

  /**
   * 微信通用模态弹窗
   * @param {*} title  标题
   * @param {*} content 内容
   * @param {*} confirmText 确认按钮文字
   * @param {*} showCancel 是否显示取消按钮
   */
  export function showWxModalUseConfirm(title, content, confirmText, showCancel, confirmCallback) {
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      showCancel: showCancel,
      confirmColor: "#ff555c",
      success: confirmCallback
    })
  }

  /**
   * 微信通用模态弹窗
   * @param {*} title  标题
   * @param {*} content 内容
   * @param {*} confirmText 确认按钮文字
   * @param {*} showCancel 是否显示取消按钮
   */
  export function showWxModalShowAllWidthCallback(title, content, confirmText, cancelText, showCancel, confirmCallback) {
    wx.showModal({
      title: title,
      content: content,
      cancelText: cancelText,
      confirmText: confirmText,
      showCancel: showCancel,
      confirmColor: "#ff555c",
      success: confirmCallback
    })
  }
