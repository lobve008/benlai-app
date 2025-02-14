// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const levelDefault = 2;
  const { userInfo } = event;
  const result = {
    avatarUrl: userInfo.avatarUrl,
    nickName: userInfo.nickName,
    openid: wxContext.OPENID,
  }

  // 检查用户是否已存在于数据库
  const db = cloud.database()
  const users = db.collection('users')
  const userResult = await users.where({
    openid: wxContext.OPENID
  }).get()

  if (userResult.data.length === 0) {
    // 新用户，添加到数据库
    result.level = levelDefault;

    await users.add({
      data: {
        openid: wxContext.OPENID,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        level: levelDefault  // 默认权限级别为2
      }
    })
  }

  return result
}