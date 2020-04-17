Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    ticket_num: '尚未识别',
    starting_station: '尚未识别',
    train_num: '尚未识别',
    destination_station: '尚未识别',
    date: '尚未识别',
    ticket_rates: '尚未识别',
    seat_category: '尚未识别',
    name: '尚未识别',
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
          var api_url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/train_ticket?access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              image: base64,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)
              if (res.data.error_msg){
                wx.showToast({
                  title: res.data.error_msg,
                  icon: 'none',
                  duration: 3000
                })
                that.setData({
                  loadModal: false
                })
              } else if (res.data.words_result.ticket_num) {
                that.setData({
                  ticket_num: res.data.words_result.ticket_num,
                  starting_station: res.data.words_result.starting_station,
                  train_num: res.data.words_result.train_num,
                  destination_station: res.data.words_result.destination_station,
                  date: res.data.words_result.date,
                  ticket_rates: res.data.words_result.ticket_rates,
                  seat_category: res.data.words_result.seat_category,
                  name: res.data.words_result.name,
                  loadModal: false
                })
              } else {
                wx.showToast({
                  title: '未识别到车票信息，请上传清晰的火车票正面',
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