// components/dialog-address/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showAddressDialog: {
      type: Boolean,
      value: false
    },
    address: {
      type: String,
      value: ''
    },
    phone: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    callListener: function (e) {
      console.log(e);
      let that = this;
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.photo,
      })
    },

    dismiss: function () {
      this.setData({
        showAddressDialog: false
      })
    }
  }
})
