Page({
  data: {
    t_length: 0,
    merchant_id: 0,
    nickname: "",
    mobile: "",
    describe: "", 
    wx: "",
    post: "",
    access_token: '',
    user_id: '',
    index: 0,
    data: []
  },
  onLoad: function(options) {
    var that = this;
    // 获取token
    wx.getStorage({
      key: 'access_token',
      success: function(res) {
        that.setData({
          access_token: res.data
        });
        // 调用选择框接口
        that.getPickerList()
      },
    })
    // 获取用户id
    wx.getStorage({
      key: 'user_id',
      success: function(res) {
        that.setData({
          user_id: res.data
        });
      },
    })
  },
  // 选择框接口
  getPickerList: function() {
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/information',
      method: 'post',
      header: {
        'Accept': 'application/vnd.myapp.v1+json', // 默认值
        'Authorization': 'Bearer ' + this.data.access_token
      },
      success: (res) => {
        this.setData({
          data: res.data.merchants_mps
        })
        for(let i in this.data.data){
          let id = this.data.data[0].id;
          this.data.merchants_mps = id
        }
      }
    })
  },
  // 选择框
  bindPickerChange: function(e) {
    var val = e.detail.value;
    this.setData({
      index: val,
      merchant_id: this.data.data[val]['id']
    });
   
  },
  // 编辑框
  bindText: function(e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text,
      describe: e.detail.value
    })
  },
  // 电话
  getPhone: function(e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    });
  },
  // 来电
  number:function(){
    wx.makePhoneCall({
      phoneNumber: '18681825227'
    })
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
  // 提交
  subimt: function() {
    // 用户修改信息
    wx.request({
      //接口地址
      url: 'https://api.mp.qumatou.com.cn/api/home/edit_userinfo/' + this.data.user_id,
      method: 'post',
      data: {
        "merchant_id": this.data.merchant_id, // 企业id
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
          // 跳转页面
          wx.redirectTo({
            url: '../logs/logs?user_id=' + this.data.user_id + '&access_token=' + this.data.access_token
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