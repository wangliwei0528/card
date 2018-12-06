// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'access_token': '',
    'openid': '',
    user_id:""
  },

  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'access_token',
      success: function(res) {
        that.setData({
          access_token: res.data
        });
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid: res.data
        });
      },
    })
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          user_id: res.data
        });
      },
    })
  },
  subimt: function() {
    // 判断进入
    if (this.data.openid) {
      wx.redirectTo({
        url: '../customized/customized'
      })                                                                                                                     } else {
      wx.redirectTo({
        url: '../authorization/authorization'
      })
    }

  },
})