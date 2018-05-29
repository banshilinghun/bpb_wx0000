// pages/joinGroup/index.js

//1：创建团，2：加入团
const groupTypeArray = ['create', 'join'];
const titleArray = ['你成功创建了一个团，赶快邀请朋友参团吧！', '你成功加入了一个团，赶快邀请朋友参团吧！', '你成功加入了一个团，恭喜组团成功！'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTitle: titleArray[0],
    hour: 0,
    minute: 0,
    second: 0,
    diffPeople: 0,
    currentPerson: '0/10',
    memberList: [{ avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132', iscreater: true }, { avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132', iscreater: false }, { avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132', iscreater: false }, { avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132', iscreater: false }],
    groupNumber: 5,
    //加入团还是创建团
    status: groupTypeArray[1],
    //是否组团成功
    groupSuccess: true,
    //是否安装广告
    installAd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //状态判断
    if (that.data.status == groupTypeArray[0]){
      that.setData({
        topTitle: titleArray[0]
      })
    }else{
      that.setData({
        topTitle: that.data.groupSuccess ? titleArray[2] : titleArray[1]
      })
    }
    let count = that.data.groupNumber - that.data.memberList.length;
    that.setData({
      diffPeople: count,
      groupSuccess: count == 0,
      currentPerson: that.data.memberList.length + '/' + that.data.groupNumber
    })
    //缺少成员使用默认图
    if(count > 0){
      let tempList = [];
      let dataBean = {};
      for(let i = 0; i < count; i++){
        dataBean.avatar = '../../image/member-placeholder.png';
        tempList.push(dataBean);
      }
      tempList = that.data.memberList.concat(tempList);
      that.setData({
        memberList: tempList
      })
      console.log(that.data.memberList);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})