Page({
  data: {
    img: '/images/upload_img.png',
    access_token: '',
    access_url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    text_val: "请在此输入待分析的文本内容，例如：汤汁味道太好啦，舍不得剩下。",
    prop: '尚未分析',
    adj: '尚未分析',
    sentiment: '尚未分析',
    begin_pos: '尚未分析',
    end_pos: '尚未分析',

    array: ['酒店', 'KTV', '丽人', '美食餐饮', '旅游', '健康', '教育', '商业', '房产', '汽车', '生活', '购物','3C'],
    index: 3,

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
          var type = that.data.index + 1 
          var api_url = 'https://aip.baidubce.com/rpc/2.0/nlp/v2/comment_tag?charset=UTF-8&access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              text: text_val,
              type: type
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
              } else if (res.data.items.length !== 0){
                that.setData({
                  prop: res.data.items[0].prop,
                  adj: res.data.items[0].adj,
                  sentiment: res.data.items[0].sentiment,
                  begin_pos: res.data.items[0].begin_pos,
                  end_pos: res.data.items[0].end_pos,
                  loadModal: false
                })
              }else {
                that.setData({
                  loadModal: false
                })
                wx.showToast({
                  title: '未找到评论词，请重新输入或者更换评论行业类型',
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
})