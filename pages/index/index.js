//index.js
//获取应用实例
const app = getApp()
var Tools = app.Tools;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goods:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../contact/contact'
    })
  },
  onLoad: function () {
    Tools.redirectTo("/pages/my/my",);
    // Tools.redirectTo("/pages/logs/logs", );
    // Tools.redirectTo("/pages/contact/contact", );

    for (var i = 0; i < 10; i++) {
      this.setData({
        goods: this.data.goods.concat(i)
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
