// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("shebei_list").add({
    data: event
  })
}