Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    text_val: "请在此输入待分析的文本内容，将准确识别输入文本情感极性信息。",
    sentiment: '尚未分析',
    confidence:'尚未分析',
    positive_prob:'尚未分析',
    negative_prob:'尚未分析',
  },

  //开始分析
  analyze: function (val) {
    var that = this
    if (that.data.text_val) {
      that.setData({
        loadModal: true
      })
      //获取AccessToken
      wx.request({
        url: that.data.access_url,
        method: 'POST',
        success: function (res) {
          var text_val = that.data.text_val
          var api_url = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?charset=UTF-8&access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              text: text_val,
            },
            header: {
              'content-type': 'application/json;'
            },
            success(res) {
              console.log(res.data)
              if (res.data.error_msg) {
                wx.showToast({
                  title: res.data.error_msg,
                  icon: 'none',
                  duration: 3000
                })
                that.setData({
                  loadModal: false
                })
              } else {
                that.setData({
                  sentiment: res.data.items[0].sentiment,
                  confidence: res.data.items[0].confidence,
                  positive_prob: res.data.items[0].positive_prob,
                  negative_prob: res.data.items[0].negative_prob,
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

    } else {
      that.setData({ modalName: 'Modal' })
    }

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  textInput: function (val) {
    this.setData({
      text_val: val.detail.value
    })
  },
})