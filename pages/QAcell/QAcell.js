
const url = '../QAanswer/answer';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellList: [],
    flag: 1,
    title: '',
    isDiDi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setNavigationBarTitleText(options.title);
    let flag = options.flag;
    that.setData({
      flag: flag,
      title: options.title
    })
    that.getCheckStatus();
  },

  setNavigationBarTitleText: function (barText) {
    if (!barText) {
      barText = "奔跑宝"
    }
    wx.setNavigationBarTitle({
      title: barText,
    })
  },
  getCheckStatus:function(){
    let that = this;
    var loginFlag = app.globalData.login;
    if (loginFlag == 1) {//登录了
      wx.showLoading({
        title: '奔跑中🚗...',
      })
      wx.request({
        url: app.globalData.baseUrl + 'app/get/user_auth_status',
        data: {},
        header: app.globalData.header,
        success: res => {
          if (res.data.code == 1000) {
            if (res.data.data.user_type == 1) {//滴滴合法车主
              //res.data.data.status 0 未认证 1审核中 2未通过  3通过了
              that.setData({
                isDiDi: true
              })
            }
            if (res.data.data.status == 3){
              that.getList(true);
            }else{
              that.getList(false);
            }
          } else {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg
            });
          }
        },
        fail: res => {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '网络错误'
          });
        },
        complete: res => {
          wx.hideLoading();
        }
      })

    } else {
      that.getList(false);
    }
  },

  getList: function(isAuth){
    let that = this;
    let list = [];
    let flag = that.data.flag;
    if (flag == 1) {
      list = [{ cellTitle: '奔跑宝是做什么的？', path: url, content: '奔跑宝是一家私家车广告平台，致力于为车主创造更多的增收渠道，获取更多的收益，从而减轻车主日常养车负担。' }]
    } else if (flag == 2) {
      list = [{ cellTitle: '如何注册加入奔跑宝？', path: url, content: '打开微信搜索【奔跑宝】小程序或者关注【奔跑宝】微信公众号，使用手机号进行注册。' },
      { cellTitle: '如何领取广告任务？', path: url, content: '成功注册后，车主在【身份认证】进行车主、车辆信息认证。身份审核通过后可在【广告市场】选择相应的广告，按照预约时间导航前往线下服务网点进行广告安装。' },
      { cellTitle: '广告结束后怎么检测？', path: url, content: '广告结束后车主需要在七个自然日内前往服务网点（特殊情况除外），服务网点工作人员会对广告画面进行完整性检测，审核通过后车主可在程序内申请提现，车主的广告收益会发放到车主银行卡内。' },
      { cellTitle: '广告结束后收益什么时候到账？', path: url, content: '广告结束检测审核通过后，车主可在程序内绑定银行卡，广告收益会在三个工作日内到账（实际到账时间可能会受到银行影响）。' }];
      //未认证不显示计费规则
      if(isAuth){
        list.push({ cellTitle: '广告如何计费？', path: url, content: '奔跑宝小程序根据广告时间以固定价格的计算方式给到车主（特殊情况除外）。', flag: 'valuation' });
      }
      list.push({ cellTitle: '广告损坏如何处理？', path: url, content: '如果广告中途损坏请第一时间联系奔跑宝客服，奔跑宝会安排工作人员进行对接。广告结束后检测时出现损坏奔跑宝会根据规则扣除相应费用，广告每缺少一个门扣除广告总收益的25%。' });
    } else if (flag == 3) {
      list = [{ cellTitle: '此类私家车车身广告是否合法？', path: url, content: '2016年2月19日国务院发布《关于第二批取消152项中央指定地方实施行政审批事项的决定》，取消原属市、县级工商行政管理部门(市场监督管理部门)实施的户外广告登记行政审批。因此，车身广告不需要工商管理部门审批。 \n国家《道路安全法》《道路安全法实施条例》《机动车登记规定》等法律法规规定，私家车车身广告不超过车身2/3是不影响驾驶安全的不属于违法行为。 奔跑宝车身广告完全符合国家相关法律法规，不属于违法行为。' },
      {
        cellTitle: '如因奔跑宝车身广告被交警罚款、扣分怎么处理？', path: url, content: '首先奔跑宝车身广告完全符合国家相关法律法规，不属于违法行为。如果您因奔跑宝车身广告被交警罚款、扣分等情况，请及时联系联系奔跑宝客服，提供相关信息我们将安排相关工作人员为您处理。请在规定时间内进行广告检测，超过时间奔跑宝不予负责。 奔跑宝全国客服热线：400-888-3390。'
      }]
    } else if (flag == 4) {
      list = [{
        cellTitle: '广告贴是否会伤害车辆漆面？', path: url, content: '您好，奔跑宝车身广告材料使用的是奔跑宝磁性贴新型材料和美国进口户外写真背胶，不掉漆、不留胶。只要您粘贴广告的车辆是原厂车漆，广告粘贴位置无刮痕，车贴不会对车漆造成伤害。\n广告检测在服务网点工作人员撕掉时，清除车身广告如造成对车漆（此车漆为原车漆）伤害，车漆维修费用由奔跑宝负责。\n如车主车辆非原车车漆，撕掉车身广告带来的车漆损伤，双方另行协商解决。 \n如车辆漆面本身有破损，车主仍参加车身广告活动，一切损失与奔跑宝无关。' },
      { cellTitle: '怎么联系奔跑宝？', path: url, content: '通过以下方式可联系奔跑宝：', flag: 'contact' },
      { cellTitle: '什么样的车可以加入奔跑宝？', path: url, content: '网约车与私家车均可以加入奔跑宝领取广告任务。 \n车主准入标准： \n无交通肇事犯罪、危险驾驶犯罪记录，无吸毒记录的车主均可。 \n私家车准入标准： \n1.七座及以下乘用车，车况良好； \n2.车辆所有人：驾驶车辆必须为注册车辆，自由车辆或获得车主许可； \n3.车辆注册时间三年内； \n4.车身无掉漆补漆历史，车辆漆面是原厂原装漆。 \n网约车准入标准： \n1.符合国家《网络预约出租汽车经营服务管理暂行办法》的车辆； \n2.获得《网络预约出租汽车运输证》的车辆； \n3.符合滴滴车辆准入条件的； \n4.七座及以下乘用车，车况良好； \n5.车辆所有人：驾驶车辆必须为注册车辆，自由车辆或获得车主许可；\n 6.车辆注册时间三年内； \n7.车身无掉漆补漆历史，车辆漆面是原厂原装漆。' },
      { cellTitle: '如果广告在执行中意外掉落等情况怎么处理？', path: url, content: '如广告在执行中出现意外掉落，请及时拍摄车身照片、保留其它相关证据，同时联系奔跑宝客服，我们会安排相关工作人员及时与您取得联系解决问题。' }]
    }

    this.setData({
      cellList: list
    })
  },

  navigateListener: function (e) {
    console.log(e);
    var that = this;
    //计费逻辑判断
    if (e.detail.cell.flag == 'valuation' && that.data.isDiDi) {
      wx.navigateTo({
        url: '../valuation/valuation',
      })
    } else {
      wx.navigateTo({
        url: e.detail.cell.path + '?title=' + that.data.title + '&content=' + e.detail.cell.content + '&flag=' + e.detail.cell.flag,
      })
    }
  }
})