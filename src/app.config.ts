export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/user/index",
    "pages/classify/index",
    "pages/add/index",
    "pages/search/index",
    "pages/detail/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#000",
    selectedColor: "#04BE02",
    backgroundColor: "#F6F6F6",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/classify/index",
        text: "分类",
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
      },
    ],
  },
});
