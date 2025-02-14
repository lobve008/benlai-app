import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import './app.scss'
import "taro-ui/dist/style/index.scss";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    Taro.cloud.init({
      env: "master-9gw12emk37c1425d",
      traceUser: true,
    });
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
