Page({
  data: {
    img:'/images/upload_img.png',
    access_token:'',
    access_url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Gcrf1Uv68pHsKIFI8X1oSh0l&client_secret=WCvLBEh7C8CxHYkXN7rTUsXrXFIlqQpm',

    age:'尚未分析',
    beauty: '尚未分析',
    expression: '尚未分析',
    face_shape: '尚未分析',
    gender: '尚未分析',
    glasses: '尚未分析',
    race: '尚未分析',
    face_num:'尚未分析'
  },

  onLoad: function (options) {

  },
  //选择一张图片
  uploads:function(val){
    var that = this
    console.log(val)
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], 
      success: function(res) {
        that.setData({
          img: res.tempFilePaths[0],
        })
      },
    })
  },
  //开始分析
  analyze:function(val){
    var that = this 
    if (that.data.img == '/images/upload_img.png'){
      that.setData({ modalName:'Modal'})
    }else{
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
          var api_url = 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + res.data.access_token
          wx.request({
            url: api_url,
            method: 'POST',
            data: {
              image: base64,
              image_type: 'BASE64',
              face_field: 'age,beauty,expression,face_shape,gender,glasses,race',
            },
            success(res) {
              console.log(res.data)
              if (res.data.error_msg == 'SUCCESS'){
                that.setData({
                  age: res.data.result.face_list[0].age,
                  beauty: res.data.result.face_list[0].beauty,
                  expression: res.data.result.face_list[0].expression.type,
                  face_shape: res.data.result.face_list[0].face_shape.type,
                  gender: res.data.result.face_list[0].gender.type,
                  glasses: res.data.result.face_list[0].glasses.type,
                  race: res.data.result.face_list[0].race.type,
                  face_num: res.data.result.face_num,
                  loadModal: false
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