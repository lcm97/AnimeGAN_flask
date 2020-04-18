// pages/about/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showQrcode() {
    wx.previewImage({
      urls: ['https://yourserverurl/results/zanCode.jpg/'],
      current: 'https://yourserverurl/results/zanCode.jpg/' // 当前显示图片的http链接      
    })
  },
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
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