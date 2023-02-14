"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_easyinput2 + _easycom_uni_card2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    let videoUrl = common_vendor.ref("");
    let percent = common_vendor.ref(0);
    let videoAd = common_vendor.reactive(null);
    let isLoading = common_vendor.ref(false);
    const vvideo = common_vendor.Es.importObject("vvideo");
    let videoSource = common_vendor.ref("");
    let showVideoEle = common_vendor.ref(false);
    let hadShowAd = common_vendor.ref(false);
    common_vendor.onReady(() => {
      isLoading.value = true;
      if (common_vendor.wx$1.createRewardedVideoAd) {
        videoAd = common_vendor.wx$1.createRewardedVideoAd({
          adUnitId: "adunit-7c59818bab10151c"
        });
        videoAd.onLoad(() => {
          isLoading.value = false;
        });
        videoAd.onError((err) => {
          isLoading.value = true;
        });
        videoAd.onClose((res) => {
          console.log(res);
          if (res && res.isEnded) {
            hadShowAd.value = true;
            downData();
            console.log("\u6B63\u5E38\u64AD\u653E\u7ED3\u675F\uFF0C\u53EF\u4EE5\u4E0B\u53D1\u6E38\u620F\u5956\u52B1onClose ");
          } else {
            console.log("\u64AD\u653E\u4E2D\u9014\u9000\u51FA\uFF0C\u4E0D\u4E0B\u53D1\u6E38\u620F\u5956\u52B1onClose ");
          }
        });
      }
    });
    const showAd = () => {
      if (hadShowAd.value) {
        downData();
      } else {
        if (isLoading.value) {
          return;
        }
        if (videoAd) {
          videoAd.show().catch(() => {
            videoAd.load().then(() => videoAd.show()).catch((err) => {
              console.log("\u6FC0\u52B1\u89C6\u9891 \u5E7F\u544A\u663E\u793A\u5931\u8D25");
            });
          });
        }
      }
    };
    const clearUrl = () => {
      videoUrl.value = "";
    };
    const dealUrl = async () => {
      if (!videoUrl.value) {
        common_vendor.index.showToast({
          title: "\u7A7A\u94FE\u63A5",
          duration: 2e3
        });
        return;
      }
      let regexp = /((http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
      let realUrl = videoUrl.value.match(regexp);
      if (!realUrl) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u5206\u4EAB\u94FE\u63A5\u6216\u5185\u5BB9",
          duration: 2e3
        });
        return;
      }
      console.log(realUrl[0]);
      let { code, data } = await vvideo.getPolymerization(realUrl[0]);
      if (code === 200) {
        if (data.code == 200 && data.data && data.data.url) {
          showVideoEle.value = true;
          videoSource.value = data.data.url;
        } else {
          common_vendor.index.showToast({
            title: "\u65E0\u6CD5\u83B7\u53D6\u6570\u636E",
            duration: 2e3
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "\u65E0\u6CD5\u83B7\u53D6\u6570\u636E",
          duration: 2e3
        });
      }
    };
    const downData = async () => {
      vvideo.vvLog("\u89C6\u9891\u5730\u5740", videoSource.value);
      const downloadTask = common_vendor.index.downloadFile({
        url: videoSource.value,
        success: (res) => {
          vvideo.vvLog("\u4E34\u65F6\u5730\u5740", res.tempFilePath);
          common_vendor.index.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (o) => {
              common_vendor.index.showToast({
                title: "\u4FDD\u5B58\u6210\u529F",
                duration: 2e3
              });
            }
          });
        },
        fail: (e) => {
          vvideo.vvLog("\u4E0B\u8F7D\u5931\u8D25", JSON.stringify(e));
        }
      });
      downloadTask.onProgressUpdate((res) => {
        percent.value = res.progress;
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => common_vendor.isRef(videoUrl) ? videoUrl.value = $event : videoUrl = $event),
        b: common_vendor.p({
          inputBorder: false,
          type: "textarea",
          placeholder: "\u89C6\u9891\u70B9\u51FB\u5206\u4EAB\u6309\u94AE,\u590D\u5236\u94FE\u63A5\u540E,\u7C98\u8D34\u81F3\u6B64",
          modelValue: common_vendor.unref(videoUrl)
        }),
        c: common_vendor.o(dealUrl),
        d: common_vendor.o(clearUrl),
        e: common_vendor.p({
          title: "\u89C6\u9891\u5730\u5740"
        }),
        f: common_vendor.unref(showVideoEle)
      }, common_vendor.unref(showVideoEle) ? {
        g: common_vendor.unref(videoSource),
        h: common_vendor.unref(percent),
        i: common_vendor.o(showAd),
        j: common_vendor.p({
          title: "\u9884\u89C8\u89C6\u9891",
          padding: "0",
          spacing: "0"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/shijianzhong/Documents/HBuilderProjects/video-without-watermark/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
