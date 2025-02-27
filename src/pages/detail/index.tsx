import { useEffect, useState } from 'react';
import { View, Image, Text, Video } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import styles from "./index.module.scss";
import { ListItemTypes } from './types';
import { AtButton } from 'taro-ui';

export default function Detail() {
  const router = useRouter();
  const params = router.params;
  const [detail, setDetail] = useState<ListItemTypes | '{}' | undefined>();
  const [mediaList, setMediaList] = useState<string[]>([]);

  const fetchData = ({ }) => {

    return Taro.cloud.callFunction({
      name: "shebei",
      data: {
        type: 'get',
        id: params.id
      }
    })
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear(); // 获取年份
    const month = date.getMonth() + 1; // 获取月份，月份从0开始，所以需要+1
    const day = date.getDate(); // 获取日
    const hours = date.getHours(); // 获取小时
    const minutes = date.getMinutes(); // 获取分钟
    const seconds = date.getSeconds(); // 获取秒

    // 使用模板字符串来格式化日期和时间，确保每个部分都是两位数字
    return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }

  // 辅助函数，用于确保月、日、时、分、秒为两位数
  function padZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  useEffect(() => {
    if (detail === '{}' || detail === undefined) return;
    if (detail.shebeiInfo?.media.length > 0) {
      Promise.all(detail.shebeiInfo?.media.map(media => {
        return wx.cloud.getTempFileURL({
          fileList: [{
            fileID: media.fileID,
            maxAge: 60 * 60, // 这里设置URL的有效时间
          }]
        })
      })).then(res => {
        const list = res.map(item => {
          return item.fileList[0].tempFileURL
        })
        setMediaList(list)
      })
    }
  }, [detail])


  useLoad(() => {
    fetchData({}).then(res => {
      setDetail(res?.result?.[0])
    }).catch(() => {
      setDetail('{}')
    })
  })

  return (
    <View className={styles.detailWrap}>
      {detail === '{}' || detail === undefined ?
        <View className='noResult detail' />
        :
        <>
          <View className={`${styles.topBox} ${styles.card}`}>
            <View className={styles.name} >
              {detail.shebeiInfo.name}
            </View>
            <View className={styles.summary} >
              {detail.shebeiInfo.summary}
            </View>
            <View className={styles.tagList}>{[detail.shebeiInfo.brand, detail.shebeiInfo.type].filter(a => !!a).map((item, idx) => <Text className={styles.tag} key={idx}>{item}</Text>)}</View>
          </View>
          <View className={`${styles.dateInfo} ${styles.card}`}>
            <View className={styles.date} >
              更新时间：{formatTimestamp(detail.shebeiInfo.date)}
            </View>
            <View className={styles.count} >
              库存：{detail.shebeiInfo.count}台
            </View>
          </View>
          <View className={styles.card}>
            <View className={styles.name} >
              图片
            </View>
            {mediaList.map((item, idx) => {
              if (!item.endsWith('mp4')) {
                return <Image key={idx} className={styles.imgWrap} src={item} mode='widthFix' />

              }
            })}
          </View>
          <View className={styles.card}>
            <View className={styles.name} >
              视频
            </View>
            {mediaList.map((item, idx) => {
              if (item.endsWith('mp4')) {
                return <View key={idx} className={styles.banner}>
                  <Video className={styles.img} src={item} />
                </View>
              }
            })}
          </View>
          <View className={styles.card}>
            <View className={styles.name} >
              管理员
            </View>
            <View className={styles.gmCon}>
              <View className={styles.priceText}>底价：{detail.shebeiInfo.basePrice}</View>
              <View className={styles.priceText}>售价：{detail.shebeiInfo.sellPrice}</View>
              <View className={styles.priceText}>电话：{detail.shebeiInfo.tel}</View>
             
              <AtButton className={styles.btn} >修改</AtButton>
              <AtButton className={styles.btn} >下架</AtButton>

            </View>
          </View>
        </>
      }
    </View>
  );
}
