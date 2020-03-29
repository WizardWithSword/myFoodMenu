// miniprogram/pages/add/index.js
import {Api} from '../../api/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    anonymous: true,
    name: '',
    resource: '',
    searchStr: '',
    step: '',
    nickName: '',
    avatarUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfo: function (e) {
    let { nickName, avatarUrl} = e.detail.userInfo
    this.setData({
      anonymous: false,
      nickName: nickName,
      avatarUrl: avatarUrl
    })
  },
  save () {
    let obj = {}
    obj.name = this.data.name
    obj.makeSteps = this.data.step
    obj.searchs = this.data.searchStr.split('、')
    obj.resource = this.data.resource // 所有食材
    // obj.img = this.data.img
    if (this.data.anonymous === false) {
      obj.userNick = this.data.nickName
      obj.userHeader = this.data.avatarUrl
      obj.userId = wx.getStorageSync('openid') || ''
    }
    wx.showLoading()
    Api.addFood(obj).then(res => {
      console.log('res', res)
      wx.hideLoading()
      if (res._id) {
        wx.showModal({
          title: '贡献成功',
          content: '感谢分享，其他用户搜索时会看到你的贡献哦。',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  inputAttr (e) {
    let key = e.currentTarget.dataset.key
    let val = e.detail.value
    this.setData({
      [key]: val
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})