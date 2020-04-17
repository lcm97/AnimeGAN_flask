Page({
  data: {
    img1: '/images/upload_img.png',
    img2: '/images/upload_img.png',

    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    score: '尚未分析',
  },

  onLoad: function (options) {

  },

  //选择图片
  uploads: function (val) {
    var that = this
    var img_idx = val.currentTarget.dataset.idx
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if(img_idx==1){
          that.setData({
            img1: res.tempFilePaths[0],
          })
        }else if(img_idx==2){
          that.setData({
            img2: res.tempFilePaths[0],
          })
        }
      },
    })
  },

  //开始分析
  analyze: function (val) {
    var that = this
    if (that.data.img1 == '/images/upload_img.png' || that.data.img2 == '/images/upload_img.png') {
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
          var base64_1 = wx.getFileSystemManager().readFileSync(that.data.img1, "base64")
          var base64_2 = wx.getFileSystemManager().readFileSync(that.data.img2, "base64")
          var image_json = [{
            "image": base64_1,
            "image_type": "BASE64"
          },{
              "image": base64_2,
              "image_type": "BASE64"
          }]
          var api_url = 'https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: image_json,
            header: {
              'content-type': 'application/json' 
            },
            success(res) {
              console.log(res.data.error_msg)
              if (res.data.error_msg =='SUCCESS'){
                that.setData({
                  loadModal: false,
                  score: res.data.result.score,
                })
              }else{
                that.setData({
                  loadModal: false
                })
                wx.showToast({
                  title: res.data.error_msg,
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