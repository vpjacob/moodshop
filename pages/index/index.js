//index.js
//获取应用实例
const app = getApp()

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
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    app.socket.onMessage((data) => {
      console.log(data)
      if (data.cmd != "CMD" || data.subCmd != 'ROOMS')
        return
      data.rooms.forEach((room) => {
        room.updated = formatTime(room.updated)
      })
      if (data.cmd == 'CMD' && data.subCmd == 'ROOMS') {
        this.setData({
          list: data.rooms
        })
      }
    })
    // setTimeout(() => {

    //   app.socket.sendMessage({
    //     cmd: 'ROOMS'
    //   })
    // }, 2000)

for(var i = 0;i<10;i++){
  this.setData({
    goods: this.data.goods.concat(i)
  })
}
    console.log(this.data.goods)


    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }


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
