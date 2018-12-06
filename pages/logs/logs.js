const app = getApp()
Page({
  data: {
    flag: true,
    mask: true,
    mask1: true,
    t_length: 0,
    nickname: "",
    mobile: "",
    describe: "",
    wx: "",
    post: "",
    access_token: '',
    user_id: '',
    wechat: '',
    data: {},
    data1: [],
    product: [],
    merchants: [],
    avatar: {},
    avatarUrl: '../../img/pic1.png',
    openid: '',
    tag: '',
    addres: '',
    src: '',
    cuttype: null,
    imgUrl:''
  },

  onLoad: function(options) {
    var that = this;
    // 获取缓存
    wx.getStorage({
      key: 'access_token',
      success: function(res) {
        that.setData({
          access_token: res.data
        });
      },
    })
    wx.getStorage({
      key: 'user_id',
      success: function(res) {
        that.setData({
          user_id: res.data
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
      key: 'tag',
      success: function(res) {
        that.setData({
          tag: res.data
        });
      },
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
        // that.image()
        let resAvatar = res.data.user.avatar || ''
        this.setData({
          data: res.data.user,
          merchants: res.data.merchants,
          product: res.data.product,
          addres: res.data.merchants.address,
        });
        if (resAvatar !== '') {
          this.setData({
            avatarUrl: resAvatar
          })
        }
      }
    })
  },
  // 分享名片
  onShareAppMessage: function(options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      // console.log(options.target)
    }
    return {
      title: this.data.data.nickname + '的名片',
      path: 'pages/share/share?user_id=' + this.data.user_id,
      success: function(res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1000 //持续的时间});
        })
      },
      fail: function() {
        wx.showToast({
          title: '转发失败',
          icon: 'loading',
          duration: 1000 //持续的时间});
        })
      }
    }
  },
  // 电话
  getPhone: function(e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    });
  },
  // 职业
  getPost: function(e) {
    var val = e.detail.value;
    this.setData({
      post: val
    });
  },
  // 微信
  getWx: function(e) {
    var val = e.detail.value;
    this.setData({
      wx: val
    });
  },
  // 姓名
  getNickname: function(e) {
    var val = e.detail.value;
    this.setData({
      nickname: val
    });
  },
  onShow() {
    if (this.data.cuttype) {
      this.setData({
        avatarUrl: this.data.src
      })
    }
  },
  // 上传图片
  image: function(e) {
    wx.navigateTo({
      url: '/pages/cutFace/index?cuttype=1',
    })
    let that = this;
    let user_id = that.data.user_id
    let token = that.data.access_token
  
  },
  // 地址
  address: function(event) {
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
  // 遮罩层显示
  show: function() {
    this.setData({
      flag: false
    })
    // 企业查询
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/user_info/' + this.data.user_id,
      method: 'post',
      header: {
        'Accept': 'application/vnd.myapp.v1+json', // 默认值
        'Authorization': 'Bearer ' + this.data.access_token
      },
      success: (res) => {
        let user = res.data.user
        this.setData({
          data1: user,
          nickname: user.nickname, //姓名
          mobile: user.mobile, //电话
          post: user.post, //职务
          describe: user.describe, //个人描述
          wx: user.wx //微信
        });
      }
    })

  },
  // 遮罩层隐藏
  hide: function() {
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
  send:function(e){
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
  friend:function(e){
    this.setData({
      mask1: false
    })
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/get_mp_img',
      method: 'POST',
      header: {
        'Accept': 'application/vnd.myapp.v1+json', // 默认值
        'Authorization': 'Bearer ' + this.data.access_token
      },
      data: {
        user_id: this.data.user_id,
        path_url: `pages/share/share?user_id=${this.data.user_id}`
      },
      success: (res) => {
        this.setData({
          imgUrl: res.data.img
        })
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
  preservation:function(){
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
  // 定制跳转
  customized: function() {
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
        'Authorization': 'Bearer ' + this.data.access_token
      },
      success: (res) => {
        if (res.data.status == 1) {
          if (res.data.tag == 0) {
            // 跳转页面
            wx.redirectTo({
              url: '../authorization/authorization'
            })
          } else {
            // 跳转页面
            wx.redirectTo({
              url: '../logs/logs?user_id=' + res.data.user_id + '&access_token=' + this.data.access_token
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

  },
  // textarer框长度设置
  bindText: function(e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text,
      describe: e.detail.value
    })
  },
  // 拨打电话
  phone: function(event) {
    wx.makePhoneCall({
      phoneNumber: this.data.data.mobile,
    })
  },
  // 复制信息
  copy: function(e) {
    // 复制　
    wx.setClipboardData({
      data: this.data.data.wx,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
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
  // 提交
  subumit: function() {
    // 用户修改信息
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/edit_userinfo/' + this.data.user_id,
      method: 'post',
      data: {
        "nickname": this.data.nickname, // 用户名	
        "mobile": this.data.mobile, // 电话
        "describe": this.data.describe, // 描述
        "wx": this.data.wx, // 微信	
        "post": this.data.post, // 职务

      },
      header: {
        'Accept': 'application/vnd.myapp.v1+json', // 默认值
        'Authorization': 'Bearer ' + this.data.access_token
      },
      success: (res) => {
        // 提示框
        if (res.data.status == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000 //持续的时间
          })
          this.setData({
            flag: true,
            data: {
              "nickname": this.data.nickname, // 用户名	
              "mobile": this.data.mobile, // 电话
              "describe": this.data.describe, // 描述
              "wx": this.data.wx, // 微信	
              "post": this.data.post, // 职务
            }
          })

        } else {
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