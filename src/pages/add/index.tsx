import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import {
  AtButton,
  AtForm,
  AtIcon,
  AtInput,
  AtMessage,
  AtTextarea,
} from "taro-ui";
import { CoverImage, View } from "@tarojs/components";
import styles from "./index.module.scss";
import { ShebeiInfo } from "./types";

const shebeiInfoDefault = {
  name: "",
  summary: "",
  count: "",
  type: "",
  brand: "",
  sellPrice: "",
  basePrice: "",
  tel: "",
  media: [],
};

export default function Add() {
  const [shebeiInfo, setShebeiInfo] = useState<ShebeiInfo>(shebeiInfoDefault);
  const [mediaUpdated, setMediaUpdated] = useState<Boolean>(false);

  const onReset = () => {
    setShebeiInfo(shebeiInfoDefault);
  };
  const onSubmit = () => {
    const uploadPromises = shebeiInfo.media.map(item => {
      return wx.cloud.uploadFile({
        cloudPath: item.cloudPath,
        filePath: item.tempFilePath, // 文件路径
      })
    })

    Promise.all(uploadPromises)
      .then((results) => {
        const newMediaList = shebeiInfo.media.map((item, idx) => {
          return { ...item, fileID: results[idx].fileID }
        })
        setShebeiInfo({
          ...shebeiInfo,
          media: newMediaList,
        });
      })
      .finally(() => {
        if (shebeiInfo.media.length > 0 && shebeiInfo.name) {
          setMediaUpdated(true)
        } else {
          Taro.atMessage({
            message: "请输入必填项",
            type: "error",
          });
        }
      })
      .catch(() => {
        Taro.atMessage({
          message: "提交失败，请稍后重试",
          type: "error",
        });
      })

  };

  function chooseVideo() {
    Taro.chooseMedia({
      mediaType: ["image", "video", "mix"],
      maxDuration: 60,
      camera: "back",
      success: function (res) {

        const imgShowList = res.tempFiles.map((item) => {
          const uniqueName = Math.random().toString(36).substring(2);
          if (item.fileType === "image") return {
            cloudPath: `${uniqueName}.jpg`,
            fileType: item.fileType,
            tempFilePath: item.tempFilePath,
            showPic: item.tempFilePath,
          };
          return {
            cloudPath: `${uniqueName}.mp4`,
            fileType: item.fileType,
            tempFilePath: item.tempFilePath,
            showPic: item.thumbTempFilePath
          };
        });

        setShebeiInfo({
          ...shebeiInfo,
          media: [...shebeiInfo.media, ...imgShowList],
        });
      },
      fail: function () {
        Taro.atMessage({
          message: "上传失败，请稍后重试",
          type: "error",
        });
      },
    });
  }

  useEffect(() => {
    if (!mediaUpdated) return
    Taro.cloud.callFunction({
      name: "shebeiEdit",
      data: {
        type: 'add',
      },
      success: function (response) {
        console.log(response);
        
      },
      fail: console.error,
    });
  }, [mediaUpdated])


  return (
    <View className={styles.addWrap}>
      <AtForm onSubmit={onSubmit} onReset={onReset}>
        <AtInput
          clear
          name='name'
          type='text'
          title='设备名称'
          placeholder='请输入设备名称'
          value={shebeiInfo.name}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, name: val as string })
          }
        />
        <AtInput
          clear
          name='count'
          type='text'
          title='设备数量'
          placeholder='请输入设备数量'
          value={shebeiInfo.count}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, count: val as string })
          }
        />
        <AtInput
          clear
          name='sellPrice'
          type='text'
          title='设备售价'
          placeholder='请输入设备售价'
          value={shebeiInfo.sellPrice}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, sellPrice: val as string })
          }
        />
        <AtInput
          clear
          name='basePrice'
          type='text'
          title='设备底价'
          placeholder='请输入设备底价'
          value={shebeiInfo.basePrice}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, basePrice: val as string })
          }
        />
        <AtInput
          clear
          name='brand'
          type='text'
          title='设备品牌'
          placeholder='请输入设备品牌'
          value={shebeiInfo.brand}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, brand: val as string })
          }
        />
        <AtInput
          clear
          name='type'
          type='text'
          title='设备类型'
          placeholder='请输入设备类型'
          value={shebeiInfo.type}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, type: val as string })
          }
        />
        <AtInput
          clear
          name='tel'
          type='text'
          title='联系电话'
          placeholder='请输入联系电话'
          value={shebeiInfo.tel}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, tel: val as string })
          }
        />
        <View className='subTit'>设备描述</View>
        <AtTextarea
          className={styles.textarea}
          value={shebeiInfo.summary}
          onChange={(val) =>
            setShebeiInfo({ ...shebeiInfo, summary: val as string })
          }
          maxLength={200}
          placeholder='请输入设备描述'
        />
        <View className='subTit'>图片/视频</View>
        <View className={styles.mediePicker}>
          {shebeiInfo.media.map((item, index) => {
            return (
              <View
                key={index}
                className={[styles.mediePickerItem, "border"].join(" ")}
              >
                <View className={styles.itemWrap}>
                  <AtIcon className={styles.del} value='close-circle' onClick={() => {
                    shebeiInfo.media.splice(index, 1);
                    setShebeiInfo({
                      ...shebeiInfo,
                      media: shebeiInfo.media,
                    });
                  }}
                  />
                  <CoverImage src={item?.showPic} />
                </View>
              </View>
            );
          })}
          <View className={[styles.mediePickerItem, "border"].join(" ")}>
            <View className={styles.itemWrap} onClick={chooseVideo}>
              <AtIcon value='add'></AtIcon>
            </View>
          </View>
        </View>

        <AtButton formType='submit'>提交</AtButton>
        <AtButton formType='reset'>重置</AtButton>
      </AtForm>
      <AtMessage />
    </View>
  );
}
