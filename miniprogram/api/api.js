const db = wx.cloud.database()
const foods = db.collection('foods')
const search = db.collection('searchHistory')
const _ = db.command
var api = {}
api.addFood = function (obj) {
  obj.recodeTime = new Date()
  return foods.add({data:obj})
}
api.search = function (obj) {
  return foods.where({
    searchs: _.all(obj.searchArr)
  }).get()
}
api.recordSearch = function (obj) {
  obj.searchTime = new Date()
  return search.add({ data: obj })
}
export const Api = api