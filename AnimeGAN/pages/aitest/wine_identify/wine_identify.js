Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    wineNameCn: '尚未分析',
    countryCn: '尚未分析',
    regionCn: '尚未分析',
    wineryCn: '尚未分析',
    color: '尚未分析',
    grapeCn: '尚未分析',
    tasteTemperature	: '尚未分析',
    description: null
  },

  onLoad: function (options) {

  },
  //选择一张图片
  uploads: function (val) {
    var that = this
    console.log(val)
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
      //获取AccessToken
      wx.request({
        url: that.data.access_url,
        method: 'POST',
        success: function (res) {
          console.log(res.data.access_token)
          //请求的图片需经过Base64编码
          var base64 = wx.getFileSystemManager().readFileSync(that.data.img, "base64")
          var api_url = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/redwine?access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              image: base64
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)
              if (res.data.result.hasdetail == 1) {
                that.setData({
                  wineNameCn: res.data.result.wineNameCn,
                  countryCn: res.data.result.countryCn,
                  regionCn: res.data.result.regionCn,
                  wineryCn: res.data.result.wineryCn,
                  color: res.data.result.color,
                  grapeCn: res.data.result.grapeCn,
                  tasteTemperature: res.data.result.tasteTemperature,
                  description: res.data.result.description,
                  loadModal: false
                })
              } else {
                that.setData({
                  loadModal: false,
                  wineNameCn: res.data.result.wineNameCn,
                  countryCn: res.data.result.countryCn,
                  regionCn: res.data.result.regionCn,
                  wineryCn: res.data.result.wineryCn,
                  color: res.data.result.color,
                  grapeCn: res.data.result.grapeCn,
                  tasteTemperature: res.data.result.tasteTemperature,
                  description: res.data.result.description,
                })
                wx.showToast({
                  title: '无法识别的红酒，图片中酒标要清晰可见',
                  icon: 'none',
                  duration: 3000
                })
              }

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
      })

    }


  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  }
})