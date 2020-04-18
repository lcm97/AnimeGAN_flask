//获取应用实例
const app = getApp()
Page({
  data: {
    img: '/images/upload_img.png',
    img_result: '',
    server_url: 'your server url',

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
      sourceType: ['album'],
      success: function (res) {
        wx.showLoading({
          title: '图片压缩中...',
        })
        //压缩图片
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success:function(res){
            //-------利用canvas压缩图片--------
            var ratio = 2;
            var canvasWidth = res.width //图片原始长宽
            var canvasHeight = res.height
            while (canvasWidth > 850 || canvasHeight > 850) {// 保证宽高在850以内
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            that.setData({
              cWidth: canvasWidth,
              cHeight: canvasHeight
            })
            //----------绘制图形并取出图片路径--------------
            var ctx = wx.createCanvasContext('canvas')
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function (res) {
                  console.log(res.tempFilePath)//最终图片路径
                  that.setData({
                    img: res.tempFilePath,
                  })
                  wx.hideLoading()
                },
                fail: function (res) {
                  console.log(res.errMsg)
                }
              })
            }, 100))    //留一定的时间绘制canvas
          },
          fail: function (res) {
            console.log(res.errMsg)
          },

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
          console.log(res.data)
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
  onShareAppMessage: function () {
    return {
      title: 'AnimeGAN',
      path: '/pages/anime/anime',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          });
        }
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '分享取消',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  },
})