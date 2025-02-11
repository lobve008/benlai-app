import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import styles from "./index.module.scss";

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
    
  })

  return (
    <View className={styles.lNamw}>
      <Text>Hello 2w</Text>
    </View>
  );
}
