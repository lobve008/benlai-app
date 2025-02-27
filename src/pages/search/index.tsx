import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react';
import { AtSearchBar } from 'taro-ui';
import { isArray } from '@tarojs/shared';
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import styles from "./index.module.scss";
import { ListItemTypes } from './types';
import ShebeiItem from '../../components/shebei-item/index';

export default function Search() {
  const router = useRouter();
  const params = router.params;
  const [list, setList] = useState<ListItemTypes[]>([]);

  const fetchData = ({ offset = 0 }) => {

    return Taro.cloud.callFunction({
      name: "shebei",
      data: {
        type: 'get',
        id: params.id
      }
    })
  }

  useLoad(() => {
    fetchData({}).then(res => {
      const dataList = res.result || [];
      const filterList = isArray(dataList) ? dataList.map(item => {
        return {
          id: item._id,
          shebeiInfo: item.shebeiInfo
        }
      }) : [];
      setList(filterList)
    })
  })

  return (
    <View className={styles.indexWrap}>
      {list.length ? list.map((shebei, idx) => <ShebeiItem key={idx} {...shebei} />) : <View className='noResult' />}
    </View>
  );
}
