//index.js
import { Api } from '../../api/api.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
    search: '',
    searchResult: [],
  },
  onShareAppMessage: function (res) {
    return {
      title: '我的冰箱原来能做这！',
      path: 'pages/index/index'
    }
  },
  onShareTimeline () {
    return {
      title: '我的冰箱原来能做这！',
      imageUrl: '/images/timeline-share.jpg',
      query: 'clickfrom=timeline'
    }
  },

  onLoad: function() {
    this.onGetOpenid()
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res, res.result.openid)
        app.globalData.openid = res.result.openid
        wx.setStorageSync('openid', res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  inputKeywords (e) {
    this.setData({
      search: e.detail.value
    })
  },
  goSearch () {
    if (this.data.search == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入3个食材，多个食材间以顿号或空格隔开'
      })
    } else {
      this.recordSearch()
      let obj = {}
      obj.searchArr = this.data.search.split('、')
      Api.search(obj).then(res => {
        console.log('res', res)
        if (res.data && res.data.length > 0) {
          this.setData({
            searchResult: res.data
          })
        } else {
          this.setData({
            searchResult: []
          })
          wx.showModal({
            title: '暂时没有相关菜谱',
            showCancel: false,
            content: '开动脑筋,自由发挥吧。最后别忘了分享菜谱给其他小伙伴哦',
          })
        }
      })
    }
  },
  recordSearch () {
    let obj = {}
    obj.str = this.data.search
    obj.uid = wx.getStorageSync('openid')
    Api.recordSearch(obj)
  },
  getRandom () {
    wx.showToast({
      icon: 'none',
      title: '菜单丰富中...暂时不能随机推荐一道菜哦',
      duration: 2000
    })
  },
  addFood () {
    wx.navigateTo({
      url: '/pages/add/index',
    })
  }

})
