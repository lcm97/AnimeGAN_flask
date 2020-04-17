Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    text_val:"请在此输入待纠错的内容，将准确识别输入文本中出现的拼写错别字及其段落位置信息，并针对性给出正确的建议文本内容。",
    text_result:'结果将在这里显示。'
  },
  
  //开始分析
  analyze: function (val) {
    var that = this
    if(that.data.text_val){
      that.setData({
        loadModal: true
      })
      //获取AccessToken
      wx.request({
        url: that.data.access_url,
        method: 'POST',
        success: function (res) {
          var text_val = that.data.text_val
          console.log(text_val)
          var api_url = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/ecnet?charset=UTF-8&access_token=' + res.data.access_token
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
              if (res.data.error_msg) {
                wx.showToast({
                  title: res.data.error_msg,
                  icon: 'none',
                  duration: 3000
                })
                that.setData({
                  loadModal: false
                })
              }else{
                that.setData({
                  text_result:res.data.item.correct_query,
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

    }else{
      that.setData({ modalName: 'Modal' })
    }

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  textInput:function(val){
    this.setData({
      text_val: val.detail.value
    })
  },
})