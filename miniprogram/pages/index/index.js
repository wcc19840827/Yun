//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openid:""
  },

  //wcc
  DoPostApi: function (api,data) {
    // post方式调用API
    that = this;
    wx.showLoading() //播等待动画

    wx.request({
    // url: "https://192.168.80.35:5000/" + api,
    // url: "http://192.168.80.35:5000/" + api,
      url: "https://27513054.cucubao.com/" + api,
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
        while (tmp.indexOf('%2B') != -1)
          tmp = tmp.replace('%2B', '+');

        that.setData({
          //  toastText: Util.jsonToString(res.data),
          toastText: tmp,
        });

        wx.hideLoading()  //停等待动画
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
    var uid = this.data.openid;
    this.DoPostApi("KYC/GetKYCInfo", "uid=" + uid);
  }, 

  Regist: function() {
    var uid = this.data.openid;
    var hashInfo = "12345678901234567890123456789012";
    this.DoPostApi("KYC/Regist", "uid=" + uid + "&hashInfo=" + hashInfo);
  }, 

  GetBalance: function () {
    var myaddress = "0x261fe7219b33a3e4aa91d2744825d7e4d4aed5ad"
    this.DoPostApi("KYCC/GetBalance", "address=" + myaddress);
  }, 

  mgrGetBalance: function () {
    var myaddress = "0x1a45d964dc5896f769465268b359f44c6da7d87d"
    this.DoPostApi("KYCC/GetBalance", "address=" + myaddress);
  }, 
  //wcc end

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    else{
      this.onGetOpenid();
    }

    // 获取用户信息 (使用 wx.getUserInfo 接口直接弹出授权框的开发方式将逐步不再支持)
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo,
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

  },

  // onGetUserInfo: function(e) {
  //   if (!this.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid: res.result.openid
        })

        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
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
