import Config from 'config'

var globalObj = {
  //请求地址头
  requestUrl: Config.basePath,
  // requestUrl: Config.wssPath,
  //会员登录方法  (loginType  登录类型 0 普通登录  1 请求方法内登录  callbackFn 回调函数)
  memberLogin: function (loginType, callbackFn) {
    //调用方法
    var sessionId = wx.getStorageSync("loginSessionId"),
      lastRequestTime = wx.getStorageSync("lastRequestTime"),
      headerData = {}, isLogin = false;
    // 判断session是否过期
    if ((!isNaN(lastRequestTime)) && lastRequestTime != "") {
      if (loginType == 1) {
        //判断最近一次登录是否是五分钟内的)
        if ((lastRequestTime + (Config.sessionTime * 60 * 100)) > new Date().getTime()) {
          console.log("十五分钟内登录过一次！");
          isLogin = true;
        }
      }
      if (isLogin == false) {
        if ((lastRequestTime + (25 * 60 * 100)) > new Date().getTime()) {
          headerData = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + sessionId };
        } else {
          headerData = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' };
        }
      }
    }
   
    if (isLogin == false) {
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (infoData) {
              var da = infoData.userInfo;
              wx.request({
                url: Config.basePath + '/xcxlogin/login.do',
                data:
                {
                  'code': res.code,
                  'iv': infoData.iv,
                  'encryptedData': infoData.encryptedData,
                  'lastRequestTime': lastRequestTime,
                  'nikeName': da.nikeName,
                  "city": da.city,
                  "province": da.province,
                  "country": da.country,
                },
                method: 'GET',
                header: headerData,
                success: function (loginData) {
                  if (loginData.data.statusCode <= -98) {
                    wx.setStorageSync('loginSessionId', loginData.data.currentSessionId);
                  }
                  wx.setStorageSync('lastRequestTime', loginData.data.lastRequestTime);
                  callbackFn(loginData.data);
                }
              })
            }
          })
        }
      })
    }
    if (isLogin == true && loginType == 1) {
      callbackFn();
    }
  },
  // 新请求方  （url 请求地址相对路径，rData 请求参数json 类型，callbackFn 请求回调函数）
  requestHttps: function (url, rData, callbackFn) {
    globalObj.memberLogin(1, function () {
      rData["lastRequestTime"] = new Date().getTime()
      // rData["lastRequestTime"] = wx.getStorageSync("lastRequestTime");
      wx.request({
        url: Config.basePath + url,
        data: rData,
        method: 'GET',
        header: { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + wx.getStorageSync("loginSessionId") },
        success: function (res) {
          wx.setStorage({ key: 'lastRequestTime', data: res.data.lastRequestTime });
          callbackFn(res);
        },
        fail: function () { console.log("请求失败！" + url) }, complete: function () { }
      })
    });
  }
};
//声明对外使用
module.exports.globalObj = globalObj;