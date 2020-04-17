//获取应用实例
const app = getApp()
Page({
  data: {
    img: '/images/upload_img.png',
    img_result: '',
    server_url: 'https://www.lovenana.site',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //选择一张图片
  uploads: function (val) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          img: res.tempFilePaths[0],
        })
      },
    })
  },
  //开始分析
  analyze: function (val) {
    var that = this
    if (that.data.img == '/images/upload_img.png') {
      that.setData({ modalName: 'Modal' })
    } else {
      that.setData({
        loadModal: true
      })
      wx.uploadFile({
        url: that.data.server_url + '/predict',
        filePath: that.data.img,
        name: 'file',
        success(res) {
          var img_result = that.data.server_url + '/results/' + res.data
          that.setData({
            img_result: img_result,
            loadModal: false
          })
        },
        fail(res) {
          console.log(res.data)
          that.setData({
            loadModal: false
          })
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 3000
          })
        }
      })

    }

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  preview:function(val){
    wx.previewImage({
      current: val.currentTarget.dataset.url,
      urls: [val.currentTarget.dataset.url]
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})