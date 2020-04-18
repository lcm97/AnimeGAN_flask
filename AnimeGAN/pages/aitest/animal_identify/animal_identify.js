Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    name: '尚未识别',
    score: '尚未识别',
    description:null,

  },

  onLoad: function (options) {

  },
  //选择一张图片
  uploads: function (val) {
    var that = this
    console.log(val)
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
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
          var api_url = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              image: base64,
              top_num:1,
              baike_num:1
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)
              if (res.data.result[0].name!='非动物'){
                that.setData({
                  name: res.data.result[0].name,
                  score: res.data.result[0].score,
                  description: res.data.result[0].baike_info.description,
                  loadModal: false
                })
              }else{
                wx.showToast({
                  title: '未识别到动物',
                  icon: 'none',
                  duration: 3000
                })
                that.setData({
                  loadModal: false
                })
              }
            },
            fail(res){
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
  },
  ellipsis: function () {
    var value = !this.data.ellipsis;
    this.setData({
      ellipsis: value
    })
  }
})