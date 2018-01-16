// pages/contact/contact.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,//加号的控制打开/关闭
    userInfo: [],//用户信息，用于头像显示
    feedback: [{
      content: '你可以留下联系方式，文本，图片，进行反馈',
      content_type: 0,
      contract_info: '',//弹出框input值
      myDate: '',
      role: false,
      img: '../../image/hotapp_01_03.png',
    }
    ],//返回数据
    minutes: '',//分钟间隔
    addinput: '',//清楚input框的值
    sendflag: false,//发送按钮控制
    networkType: '',//判断当前网络类型
    addtell: {
      addtellHidden: true,//弹出框显示/隐藏

    },
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
    // 页面显示
    //将全局的方法赋值
    var that = this;
    var hotapp = app.globalData.hotapp;
    //调用登录接口
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            })

            typeof cb == "function" && cb(res.userInfo)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  bindfocus: function (e) {
    console.log("bindfocus");
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == 'fail') {
          wx.showToast({
            title: '当前网络不可用',
            icon: 'loading',
            duration: 10000
          })
        } else {
          wx.hideToast()
        }
        that.setData({
          networkType: res.networkType// 返回网络类型2g，3g，4g，wifi
        })
      }
    })

    //当sendflag有值的时候，设置发送按钮显示
    this.setData({
      sendflag: true
    })
  },

  bindblur: function (e) {
    console.log("bindblur");
    var that = this;
    this.setData({
      sendflag: false
    })
    //提交输入框的数据
    if (e.detail.value != '' && this.data.networkType != 'fail') {

      //获取当前时间
      var myDate = new Date();
      var hours = myDate.getHours();       //获取当前小时数(0-23)
      var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
      //如果两次时间
      if (minutes == this.data.minutes) {
        var mydata = ''
      } else {
        var mydata = hours + ':' + minutes
      }


      //消息数组，系统默认
      var newfeedback = this.data.feedback;
      newfeedback.push({
        content: e.detail.value,
        content_type: 0,
        contract_info: that.data.contract_info,
        myDate: mydata,
        role: true,
        img: that.data.userInfo.avatarUrl,
      }, {
          content: '【系统消息】：您的反馈已收到！',
          content_type: 0,
          contract_info: '',
          myDate: '',
          role: false,
          img: "../../image/hotapp_01_07.png"
        })

      //修改feedback,设置addaddinput为[]值为空
      this.setData({
        addinput: [],
        sendflag: false,
        minutes: minutes,
        feedback: newfeedback
      })
      console.log(this.data.feedback);
      //上传文字到服务器

      // app.globalData.hotapp.feedback(e.detail.value, 0, that.data.contract_info, function (res) {

      //   wx.showToast({
      //     title: '已成功反馈',
      //     icon: 'success',
      //     duration: 1000
      //   })
      // })
    }


  },
  bindtapimg: function () {
    console.log("bindtapimg");
    //打开添加图片框
    this.setData({
      flag: false
    })
  },
  closeimg: function () {
    console.log("closeimg");
    //闭合添加图片框
    this.setData({
      flag: true
    })
  },
  footaddimg: function () {
    console.log("footaddimg");
    var that = this;
    //使用hotapp接口获取图片路径
    app.globalData.hotapp.uploadFeedbackImage(res => {
      //添加到反馈数组
      var newfeedback = that.data.feedback;
      newfeedback.push({
        content: res,
        content_type: 1,
        contract_info: '',
        role: false,
        img: that.data.userInfo.avatarUrl,
      }, {
          content: '【系统消息】：您的反馈已收到！',
          content_type: 0,
          contract_info: that.data.contract_info,
          role: true,
          img: "../../images/hotapp_01_07.png"
        })
      //修改feedback
      that.setData({
        flag: true,
        feedback: newfeedback
      })
      //添加图片到服务器

      app.globalData.hotapp.feedback(res, 1, that.data.contract_info, function (res) {
        console.log(res)
      })
    })
  },
  footaddtell: function () {
    console.log("footaddtell");
    //打开弹出框
    this.setData({
      addtell: {
        addtellHidden: false,
        contract_info: ''
      }
    })
  },
  modalconfirm: function () {
    console.log("modalconfirm");
    //弹出框确认操作
    this.setData({
      flag: true,
      addtell: {
        addtellHidden: true,
      }
    })
  },
  modalcancel: function () {
    console.log("modalcancel");
    //弹出框取消操作
    this.setData({
      addtell: {
        addtellHidden: true,
      }
    })
  },
  saveusertell: function (e) {
    console.log("saveusertell");
    //保存input框的值
    this.setData({
      contract_info: e.detail.value,
      addtell: {
        addtellHidden: false,

      }
    })


  },
  footaddmore: function () {
    console.log("footaddmore");
    wx.showModal({
      title: '更多技术支持',
      content: '微信小程序统计hotapp.cn提供支持，讨论QQ群：173063969',
      success: function (res) {
        if (res.confirm) {
          console.log('微信小程序统计hotapp.cn提供支持')
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})