Page({
  data: {
    access_token: '',
    mask: true,
    mask1: true,
    user_id: '',
    data: {},
    data1: [],
    product: [],
    merchants: [],
    openid: '',
    addres: '',
    avatarUrl: '../../img/pic1.png',
    src: '',
    cuttype: null,
    options:{},
    imgUrl:''
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      options: options
    })
  
    // 企业查询
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/information',
      method: 'post',
      data: {
        id: options.user_id
      },
      header: {
        'Accept': 'application/vnd.myapp.v1+json', // 默认值
        // 'Authorization': 'Bearer ' + options.access_token
      },
      success: (res) => {
        let resAvatar = res.data.user.avatar || ''
        that.setData({
          data: res.data.user,
          merchants: res.data.merchants,
          product: res.data.product,
          addres: res.data.merchants.address,
        });
        if (resAvatar !== '') {
          that.setData({
            avatarUrl: resAvatar
          })
        }
      }
    })
  },
  // 分享名片
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      // console.log(options.target)
    }
    return {
      title: this.data.data.nickname + '的名片',
      path: 'pages/share/share?user_id=' + this.data.options.user_id + '&access_token=' + this.data.options.access_token,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1000 //持续的时间;
        })
      },
      fail: function () {
        wx.showToast({
          title: '转发失败',
          icon: 'loading',
          duration: 1000 //持续的时间;
        })
      }
    }
  },
  // 定制跳转
  customized: function () {
    wx.redirectTo({
      url: '../authorization/authorization'
    })

  },
  // 地址
  address: function (event) {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = that.data.merchants.lat
        const longitude = that.data.merchants.lng
        // const latitude = res.latitude
        // const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 28
        })
      }
    })
  },
  // 遮罩层隐藏
  hide: function () {
    this.setData({
      flag: true
    })
  },
  // 遮罩层显示
  show1: function () {
    this.setData({
      mask: false
    })
  },
  send: function (e) {
    console.log(e)
    this.setData({
      flag: true
    })
  },
  // 遮罩层隐藏
  hide1: function () {
    this.setData({
      mask: true
    })
  },
  // 遮罩层显示
  friend: function (e) {
    this.setData({
      mask1: false
    })
    console.log(this.data.options.user_id)
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/get_mp_img',
      method: 'POST',
      header: {
        'Accept': 'application/vnd.myapp.v1+json', // 默认值
        'Authorization': 'Bearer ' + this.data.access_token
      },
      data: {
        user_id: this.data.options.user_id,
        path_url: `pages/share/share?u =${this.data.options.user_id}`
      },
      success: (res) => {
        this.setData({
          imgUrl: res.data.img
        })
        console.log(this.data.imgUrl)
      }
    })
  },
  // 遮罩层隐藏
  delete1: function (e) {
    this.setData({
      mask1: true
    })
  },
  // 保存至相册
  preservation: function () {
    wx.downloadFile({
      url: this.data.imgUrl,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },
  onShow() {
    if (this.data.cuttype) {
      this.setData({
        avatarUrl: this.data.src
      })
    }
  },
  // 拨打电话
  phone: function (event) {
    wx.makePhoneCall({
      phoneNumber: this.data.data.mobile,
    })
  },
  // 复制信息
  copy: function (e) {
    // 复制　
    wx.setClipboardData({
      data: this.data.data.wx,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 1000 //持续的时间

            })
          }
        })
      }
    })
  },

})