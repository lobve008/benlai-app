import Taro from "@tarojs/taro";
import { AtAvatar, AtList, AtListItem, AtButton } from "taro-ui";
import { useState } from "react";
import { Button, View,  } from "@tarojs/components";
import { UserInfo } from "./types";
import styles from "./index.module.scss";

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

  const loginOut = () => {
    Taro.setStorage({ key:'userInfo',data:''});
    setUserInfo({
      avatarUrl: "",
      nickName: "请登录",
    })
  }



  return (
    <View className={styles.wrap}>
      <View className={styles.userInfo} onClick={handleLogin}>
        <AtAvatar circle size='large' image={userInfo.avatarUrl}></AtAvatar>
        <View className={styles.nickName}>{userInfo.nickName}</View>
        {userInfo.avatarUrl ? <View className={`${styles.loginOut} border`} onClick={loginOut}>退出登录</View> :null}
      </View>
      <View className={styles.list}>
        <View className={styles.item} onClick={() => {
          Taro.navigateTo({ url: "/pages/add/index" });
        }}
        >添加设备</View>
        <View className={styles.item}>
          <Button className={styles.itemBtn} openType='feedback'>
            意见反馈
          </Button>
        </View>
        <View className={styles.item}>用户协议</View>
        <View className={styles.item}>隐私政策</View>
        <View className={styles.item}></View>
      </View>
    </View>
  );
};

export default LoginPage;
