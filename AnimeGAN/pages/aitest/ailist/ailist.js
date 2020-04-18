const app = getApp()
Page({
  data: {
    cardCur: 0,
    DotStyle:"square-dot",
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://yourserverurl/results/pic1.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'https://yourserverurl/results/pic2.jpg',
    }, {
      id: 2,
      type: 'image',
        url: 'https://yourserverurl/results/pic3.jpg'
      }, {
        id: 3,
        type: 'image',
        url: 'https://yourserverurl/results/pic4.jpg'
      },{
      id: 4,
      type: 'image',
        url: 'https://yourserverurl/results/pic5.png'
      }],
    //导航条
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [
      { id: 0, name: '人脸识别', items: [{ name: '人脸检测与分析', url: '/pages/aitest/face_analysis/face_analysis' }, { name: '人脸对比', url: '/pages/aitest/face_compare/face_compare' }]},
      { id: 1, name: '图像技术', items: [{ name: '动物识别', url: '/pages/aitest/animal_identify/animal_identify' }, { name: '植物识别', url: '/pages/aitest/plant_identify/plant_identify' }, { name: '红酒识别', url: '/pages/aitest/wine_identify/wine_identify' }, { name: '菜品识别', url: '/pages/aitest/dishes_identify/dishes_identify' }] },
      { id: 2, name: '文字识别', items: [{ name: '身份证识别', url: '/pages/aitest/idcard_identify/idcard_identify' }, { name: '火车票识别', url: '/pages/aitest/train_ticket/train_ticket' }, { name: '车牌识别', url: '/pages/aitest/license_plate/license_plate' }] },
      { id: 3, name: '语言处理', items: [{ name: '文本纠错', url: '/pages/aitest/ecnet/ecnet' }, { name: '情感倾向分析', url: '/pages/aitest/sentiment_classify/sentiment_classify' }, { name: '评论观点抽取', url: '/pages/aitest/comment_tag/comment_tag' }] },
      { id: 4, name: '敬请期待', items: [{ name: '敬请期待', url: '/pages/about/about/about' }, { name: '敬请期待', url: '/pages/about/about/about' }, { name: '敬请期待', url: '/pages/about/about/about' }] },
    ],
    load: true,
    menuArrow: 'arrow'

  },
  onLoad: function (options) {
    let that = this;
    let list = this.data.list;
    this.setData({
      listCur: list[0]
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
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