import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Image, Text } from '@tarojs/components'
import { ListItemTypes } from '../../pages/index/types';
import styles from "./index.module.scss";

export default function ShebeiItem(props: ListItemTypes) {
  const { id, shebeiInfo } = props
  const { media = [], name, summary, brand, type, count } = shebeiInfo;
  const tag = [brand, type].filter(a => !!a);
  const [imgUrl, setImgUrl] = useState('');


  function getAndDisplayImage(fileID) {
    return wx.cloud.getTempFileURL({
      fileList: [{
        fileID,
        maxAge: 60 * 60, // 这里设置URL的有效时间
      }],
      success: (res) => {
        setImgUrl(res.fileList[0].tempFileURL)
      }
    })
  }


  useEffect(() => {
    getAndDisplayImage(media[0].fileID)
  }, [])

  return (
    <View className={styles.shebeiInfoWrap} onClick={() => {
      Taro.navigateTo({ url: `/pages/detail/index?id=${id}` });
    }}
    >
      <View className={styles.banner}>
        <Image className={styles.img} src={imgUrl} mode='aspectFill' />
        {count ? <View className={styles.count}>库存：{count}</View> : null}
      </View>
      <View className={styles.textWrap}>
        <View className={styles.name}>{name}</View>
        <View className={styles.summary}>{summary}</View>
        <View className={styles.tagList}>{tag.map((item, idx) => <Text className={styles.tag} key={idx}>{item}</Text>)}</View>
      </View>
    </View>
  );
}
