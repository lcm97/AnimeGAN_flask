Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    image_status: '尚未识别',
    name: '尚未识别',
    address: '尚未识别',
    number: '尚未识别',
    sex:'尚未识别',
    race: '尚未识别',
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
      //获取AccessToken
      wx.request({
        url: that.data.access_url,
        method: 'POST',
        success: function (res) {
          console.log(res.data.access_token)
          //请求的图片需经过Base64编码
          var base64 = wx.getFileSystemManager().readFileSync(that.data.img, "base64")
          var api_url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              image: base64,
              id_card_side:'front',
              detect_direction:false,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)

              if (res.data.image_status != 'non_idcard') {
                that.setData({
                  image_status: res.data.image_status,
                  name: res.data.words_result.姓名.words,
                  address: res.data.words_result.住址.words,
                  number: res.data.words_result.公民身份号码.words,
                  sex: res.data.words_result.性别.words,
                  race: res.data.words_result.民族.words,
                  loadModal: false
                })
              } else {
                wx.showToast({
                  title: '未识别到身份证信息，请上传清晰的身份证正面',
                  icon: 'none',
                  duration: 3000
                })
                that.setData({
                  loadModal: false
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
  },
  ellipsis: function () {
    var value = !this.data.ellipsis;
    this.setData({
      ellipsis: value
    })
  }
})