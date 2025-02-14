import Taro from "@tarojs/taro";
import { useState } from "react";
import { View } from "@tarojs/components";
import { UserInfo } from "./types";
import styles from "./index.module.scss";
import { AtAvatar , AtList, AtListItem } from "taro-ui";

const LoginPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(
    Taro.getStorageSync("userInfo") || {
      avatarUrl: "",
      nickName: "请登录",
    }
  );

  const handleLogin = () => {
    if (userInfo.openid) return;
    Taro.getUserProfile({
      desc: "用于完善会员资料",
      success: function (res) {
        Taro.cloud.callFunction({
          name: "login",
          data: {
            userInfo: res.userInfo,
          },
          success: function (response) {
            setUserInfo(response.result as UserInfo);
            Taro.setStorageSync("userInfo", response.result);
          },
          fail: console.error,
        });
      },
    });
  };



  return (
    <View className={styles.wrap}>
      <View className={styles.userInfo} onClick={handleLogin}>
        <AtAvatar circle size="large" image={userInfo.avatarUrl}></AtAvatar>
        <View className={styles.nickName}>{userInfo.nickName}</View>
      </View>
      <AtList>
        <AtListItem title="添加设备" arrow="right" onClick={()=>{
          Taro.navigateTo({ url: "/pages/add/index" });
        }} />
      </AtList>
    </View>
  );
};

export default LoginPage;
