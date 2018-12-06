Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    user_id:''
  },
  bindGetUserInfo: function(e) {
    let userinfo = e.detail.userInfo;
    wx.setStorage({
      key: 'userinfo',
      data: userinfo,
    })
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    //  登录
    wx.login({
      success: res => {
        let code = res.code
        wx.request({
          //接口地址
          url: 'https://api.mp.qumatou.com.cn/api/home/grant_authorization',
          method: 'POST',
          data: {
            "code": code,
          },
          header: {
            'Accept': 'application/vnd.sso.v1+json' // 默认值
          },
          success: (res) => {
            let access_token = res.data.access_token;
            let message = res.data.message;
            this.setData({
              openid: res.data.open_id
            })
            // 存缓存
            wx.setStorage({
              key: 'openid',
              data: this.data.openid,
            })
            wx.setStorage({
              key: 'access_token',
              data: access_token,
            })
          // 判断进入
            wx.request({
              //接口地址
              url: 'https://api.mp.qumatou.com.cn/api/home/index',
              method: 'post',
              data: {
                "open_id": this.data.openid
              },
              header: {
                'Accept': 'application/vnd.myapp.v1+json', // 默认值
                'Authorization': 'Bearer ' + access_token
              },
              success: (res) => {
                wx.setStorage({
                  key: 'user_id',
                  data: res.data.user_id,
                })
                wx.setStorage({
                  key: 'user_token',
                  data: {
                    user_id: res.data.user_id,
                    token: access_token,
                  }
                })
                wx.setStorage({
                  key: 'tag',
                  data: res.data.tag,
                })
                if (res.data.status == 1) {
                  if (res.data.tag == 0) {
                    // 跳转页面
                    wx.redirectTo({
                      url: '../index/index?user_id=' + res.data.user_id + '&access_token=' + access_token
                    })
                  } else {
                    // 跳转页面
                    wx.redirectTo({
                      url: '../logs/logs?user_id=' + res.data.user_id + '&access_token=' + access_token
                    })
                  }
                } else {
                  // 提示框
                  wx.showToast({
                    title: res.data.message,
                    icon: 'loading',
                    duration: 1000 //持续的时间
                  })
                }
              }
            })
          }
        })
      }
    });
  },
  onLoad: () => {

  }
})