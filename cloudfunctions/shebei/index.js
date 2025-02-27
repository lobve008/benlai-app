// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
  const { type, keyword, offset = 0,
    id: detailsId, searchType, removeId, shebeiInfo } = event;
  const collection = db.collection('shebei_list');

  if (type === 'add') {
    return await collection.add({
      data: shebeiInfo
    })
  } else if (type === 'get') {
    if (keyword) {
      try {

        if (searchType) {
          const res = await collection.where({
            type2: keyword
          }).get()
          return res.data
        }


        const res = await collection.where(db.command.or([
          {
            ['shebeiInfo.name']: db.RegExp({
              regexp: keyword,
              options: 'i' // 'i' 表示不区分大小写
            })
          },
          {
            ['shebeiInfo.type']: db.RegExp({
              regexp: keyword,
              options: 'i' // 'i' 表示不区分大小写
            })
          },
          {
            ['shebeiInfo.brand']: db.RegExp({
              regexp: keyword,
              options: 'i' // 'i' 表示不区分大小写
            })
          },
          {
            ['shebeiInfo.summary']: db.RegExp({
              regexp: keyword,
              options: 'i' // 'i' 表示不区分大小写
            })
          }
        ])).get();
        return res.data
      } catch (err) {
        return []
      }
    }

    if (detailsId) {
      try {
        const res = await collection.where({
          _id: detailsId
        }).get()
        return res.data
      } catch (err) {
        return []
      }
    }

    if (removeId) {
      try {
        const result = await collection.doc(removeId).get();
        if (result.data) {
          await collection.doc(removeId).update({
            data: {
              isXiaJia: true
            }
          })

          return {
            code: 0,
            message: 'Data updated successfully',
            data: data
          };
        }
      } catch (err) { }
    }

    try {
      const res = await collection.skip(offset).orderBy('date', 'desc').get() // 每次查询限制返回5条数据，并根据偏移量跳过之前的数据
      return res.data
    } catch (err) {
      console.error(err)
      return []
    }
  }
}