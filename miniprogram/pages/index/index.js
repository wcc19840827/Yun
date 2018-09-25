//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  //wcc
  DoPostApi: function (api,data) {
    // post方式调用API
    that = this;
    wx.request({
      url: "http://192.168.80.35:5123/" + api,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      //data: Util.json2Form({ cityname: "上海", key: "1430ec127e097e1113259c5e1be1ba70" }),
      data: data,

      complete: function (res) {
        console.info(res.data);
        var tmp = Util.json2Show(res.data);
        while (tmp.indexOf('%20')!=-1)
          tmp = tmp.replace('%20', ' '); //空格会被识别为%20,替换回来

        that.setData({
          //  toastText: Util.jsonToString(res.data),
          toastText: tmp,
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        else {
          console.info('网络请求成功');
        }
      }
    })
  },

  onTest: function () {
    this.DoPostApi("KYC/GetKYCInfo","uid=127002");
  },

  GetKYCInfo: function () {
    this.DoPostApi("KYC/GetKYCInfo","uid=127001");
  }, 

  Regist: function() {
    this.DoPostApi("KYC/Regist","uid=127001&hashInfo=123456789");
  }, 

  mgrBalance: function () {
    this.DoPostApi("Manager/Balance", "address=0x1a45d964dc5896f769465268b359f44c6da7d87d&cointype=eth");
  }, 

  Balance: function () {
    this.DoPostApi("Manager/Balance", "address=0x99fcb46fccf902fb84e40546586542764f6e1214&cointype=eth");
  }, 
  //wcc end

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

})

var that;
var Util = require('../utils/util.js');
