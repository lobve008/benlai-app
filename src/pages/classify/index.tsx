import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import styles from "./index.module.scss";

export default function Login () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className={styles.lNamw}>
      21
    </View>
  );
}
