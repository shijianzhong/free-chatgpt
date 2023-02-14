"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "gpt",
  setup(__props) {
    const gpt = common_vendor.Es.importObject("chatgpt");
    const cconfig = common_vendor.Es.importObject("cconfig");
    const talkList = common_vendor.ref([]);
    const tempQs = common_vendor.ref();
    const isline = common_vendor.ref(0);
    const send = async () => {
      talkList.value.push({
        type: 1,
        content: tempQs.value
      });
      let _data = await gpt.chatgpt(tempQs.value);
      if (_data.choices.length > 0) {
        tempQs.value = "";
        for (let i = 0; i < _data.choices.length; i++) {
          talkList.value.push({
            type: 0,
            content: _data.choices[i].text
          });
        }
      }
      console.log(_data);
    };
    const getConfig = async () => {
      let { data } = await cconfig.getConfig();
      console.log(data[0].isOnline);
      isline.value = data[0].isOnline;
    };
    getConfig();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(talkList.value, (item, index, i0) => {
          return {
            a: item.pic,
            b: common_vendor.t(item.content),
            c: common_vendor.n(item.type == 1 ? "push" : "pull"),
            d: index,
            e: `msg-${index}`
          };
        }),
        b: isline.value == 1
      }, isline.value == 1 ? {
        c: tempQs.value,
        d: common_vendor.o(($event) => tempQs.value = $event.detail.value),
        e: common_vendor.o(send)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/shijianzhong/Documents/HBuilderProjects/video-without-watermark/pages/gpt/gpt.vue"]]);
wx.createPage(MiniProgramPage);
