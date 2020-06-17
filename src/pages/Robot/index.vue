<template>
  <div class="container">
    <div class="header">
      <img src="../../../static/assets/robot.png" />
      <span>机器人客服</span>
    </div>
    <div class="communicate" ref="comm">
      <div v-for="(item, index) in list" :key="index" :class="item.owe ? 'flex-right bg-owe': 'bg-robot'">
        <div class="item fontSize-14" v-if="item.type==='2'">
          <span v-if="!playVoiceApi.enable">{{item.text}}</span>
          <a @click.prevent="playRecording(item)" v-if="playVoiceApi.enable">
            {{item.text}}
            <span>{{item.second}}''</span>
            <div class="voiceIcon">
              <voice-icon vwidth="16px" vheight="12px" :isPlaying="item.isPlaying"></voice-icon>
            </div>
          </a>
        </div>
        <div class="item fontSize-14" v-if="item.type==='3'">
          <span v-html="item.text"></span>
        </div>
        <div class="item fontSize-14" v-if="item.type==='i3'">
          <span>{{item.text}}</span>
        </div>
        <div class="item sites" v-if="item.type==='f1'||item.type==='f2'||item.type==='f3'">
          <div class="site-header" v-show="item.guideword && item.guideword !== ''">
            <span>{{item.guideword}}</span>
          </div>
          <template v-if="item.type==='f1'">
            <div class="site fontSize-14" v-for="(st, jedex) in item.sites" :key="jedex">
              <span v-if="st.TTYPE" v-html="st.DAD054"></span>
              <a v-if="!st.TTYPE" @click.prevent="guideSearch(st)">{{st.DAD054}}</a>
            </div>
          </template>
          <template v-else-if="item.type==='f2'">
            <div class="tabs">
              <!-- <a
                v-for="(pg, jedex) in item.page"
                :class="{'active': pg.type === item.currentPageType}"
                :key="jedex"
                @click.prevent="navTab(item, pg.type)"
              >{{dad090s[pg.type]}}</a> -->
              <a v-for="(pg, jedex) in pages"
              :class="{'active': pg.type === item.currentPageType}"
                :key="jedex"
                @click.prevent="navTab(item, pg.type)">
                {{pg.name}}
                </a>
            </div>
            <div
              class="site fontSize-14"
              v-for="(st, jedex) in item.sites"
              :key="jedex"
              v-show="st.DAD090===item.currentPageType"
            >
              <span v-if="st.TTYPE" v-html="st.DAD054"></span>
              <a v-if="!st.TTYPE" @click.prevent="guideSearch(st)">{{st.DAD054}}</a>
            </div>
          </template>
        </div>
        <div class="item" v-if="item.type==='url'">
          <a :href="item.url" target="_blank">点击跳转查看</a>
        </div>
      </div>
    </div>
    <div class="guide" :class="{'show': guideShow}">
      <template v-if="footer&&Object.prototype.toString.call(footer)==='[object Array]'">
        <a
          class="guide-btn"
          v-for="(ft, cdx) in footer"
          :key="cdx"
          @click.prevent="guideSearch(ft);"
        >{{ft.DAD054}}</a>
      </template>
    </div>
    <div class="wordin">
      <div class="left" v-if="mustApis.enable">
        <span v-if="loadingWx">
          <img src="../../../static/assets/loading.gif" />
        </span>
        <a @click.prevent="changeInputType" v-show="!loadingWx">
          <img v-show="inputType === '0'" src="../../../static/assets/yy_btn.png" />
          <img v-show="inputType === '1'" src="../../../static/assets/jp_btn.png" />
        </a>
      </div>
      <div class="right">
        <div v-show="inputType === '0'">
          <div class="input">
            <input v-model="searchText" @blur="scrollTop" />
          </div>
          <a class="send" @click.prevent="inputSearch">搜索</a>
          <a class="send" @click.prevent="guideShow=!guideShow">
            快捷
          </a>
        </div>
        <div v-show="inputType === '1'">
          <a
            class="talk_btn"
            :class="{'active': isrecordering}"
            @touchstart.prevent="startRecording"
            @touchend.prevent="stopRecording"
          >按住说话</a>
          <a class="send" @click.prevent="guideShow=!guideShow">
            快捷
          </a>
        </div>
      </div>
    </div>
    <div class="saying" v-show="isrecordering">
      <img src="../../../static/assets/saying.gif" />
    </div>
  </div>
</template>
<script>
import axios from "axios";
// import Recorder from "recorder-js";
// const audioContext = new (window.audioContext || window.webkitAudioContext)();
// const recorder = new Recorder(audioContext, {});
import voiceIcon from "@/components/voiceIcon";
import wxApiCheck from "@/util/wxApiCheck";
const basePath = "/robot";
export default {
  data() {
    return {
      loadingWx: false,
      mustApis: {
        list: ["startRecord", "stopRecord", "translateVoice"],
        enable: false
      },
      playVoiceApi: {
        name: "playVoice",
        enable: false
      },
      dad090s: {
        "4": "问答",
        "0": "引导",
        "1": "政策",
        "2": "办事",
        "3": "材料"
      },
      pages: [{
        name: "问答",
        type: "4",
      }, {
        name: "政策",
        type: "1"
      }, {
        name: "办事",
        type: "2"
      }, {
        name: "材料",
        type: "3"
      }, {
        name: "引导",
        type: "0"
      }],
      defaultPageType: "4", // 默认页面类型，不填则为"0"
      guideShow: true,
      isrecordering: false,
      seconds: 0,
      startTimestamp: 0,
      endTimestamp: 0,
      intervalId: "",

      inputType: "0",
      searchText: "",
      list: [],
      footer: null
    };
  },
  components: {
    voiceIcon
  },
  methods: {
    initApis() {
      const self = this;
      wxApiCheck([...this.mustApis.list, this.playVoiceApi.name])
        .then(res => {
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          self.mustApis.enable = !(self.mustApis.list.findIndex(ele => res.checkResult[ele] === false) > 0)
          if (res.checkResult[self.playVoiceApi.name]) self.playVoiceApi.enable = true
        })
        .catch(err => {
          console.log("微信检查api接口失败，请检查wx接口版本");
        });
    },
    scrollBottom() {
      const comm = this.$refs.comm;
      comm.scrollTop = comm.scrollHeight;
    },
    scrollTop() {
      window.scrollTo(0, 0);
    },
    changeInputType() {
      // if (!this.mustApis.enable) {
      //   alert("当前不支持语音识别")
      //   return;
      // }

      if (this.inputType === "0" && this.mustApis.enable) {
        this.inputType = "1";
      } else if (this.inputType === "1") {
        this.inputType = "0";
      }
    },
    startRecording() {
      const self = this;
      self.startTimestamp = Date.now();
      self.isrecordering = true;
      wx.ready(function() {
        wx.startRecord({
          cancel: function() {
            alert("用户拒绝授权录音");
          }
        });
      });
      self.startTimestamp = Date.now();
    },

    stopRecording() {
      const voice = {};
      const self = this;
      clearInterval(this.intervalId);
      const second = Math.ceil((Date.now() - this.startTimestamp) / 1000);
      self.isrecordering = false;
      wx.ready(function() {
        wx.stopRecord({
          success: function(res) {
            voice.localId = res.localId;
            wx.translateVoice({
              localId: voice.localId,
              complete: function(res) {
                if (res.hasOwnProperty("translateResult")) {
                  self.list.push({
                    owe: true,
                    type: "2",
                    localId: voice.localId,
                    second,
                    text: res.translateResult
                  });
                  self
                    .search({
                      ptype: "03",
                      ptext: { quetext: res.translateResult }
                    })
                    .then(data => {
                      self.searchResult(data);
                    })
                    .catch(err => {});
                } else {
                  alert("翻译失败");
                }
              }
            });
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        });
      });
    },
    playRecording(item) {
      //  recorder.play(audio);

      const self = this;
      this.$set(item, "isPlaying", true);
      const second = item.second;
      const intervalId = setInterval(function() {
        self.$set(item, "second", item.second - 1);
        if (item.second <= 0) {
          clearInterval(intervalId);
          self.$set(item, "isPlaying", false);
          self.$set(item, "second", second);
        }
      }, 1000);
      if (item.localId == "") {
        alert("localid为空");
        return;
      }
      wx.ready(function() {
        wx.playVoice({
          localId: item.localId
        });
      });
    },
    // 首次进入
    initRobot() {
      this.search({
        ptype: "01",
        pidx: 1
      })
        .then(data => {
          this.searchResult(data);
          this.footer = data.footer;
        })
        .catch(err => {
          console.log(err);
        });
    },
    pushAndScroll(params) {
      this.list.push(params);
      this.$nextTick(() => {
        this.scrollBottom();
      });
    },
    searchResult(data) {
      const {
        footer,
        guideword,
        page,
        pagestype,
        sites,
        answertext,
        url
      } = data;
      switch (pagestype) {
        case "0":
          this.pushAndScroll({
            owe: false,
            type: "f1",
            guideword,
            sites
          });
          //   this.footer = footer;
          break;
        case "1":
          this.pushAndScroll({
            owe: false,
            type: "f2",
            guideword,
            currentPageType:
              Object.prototype.toString.call(page) === "[object Array]" &&
              page.length > 0
                ? (this.defaultPageType? this.defaultPageType: page[0].type)
                : (this.defaultPageType? this.defaultPageType: "0"),
            page,
            sites
          });
          //   this.footer = footer;
          break;
        case "2":
          // 这里是回答
          this.pushAndScroll({
            owe: false,
            type: "3",
            text: answertext
          });
          //   this.footer = footer;
          break;
        case "3":
          this.pushAndScroll({
            owe: false,
            type: "url",
            url:
              url.substr(0, 4) === "http"
                ? url
                : `http://www.labourtech.com${url}`
          });
          break;
      }
      //   return data
    },
    navTab(item, type) {
      this.$set(item, "currentPageType", type);
    },
    guideSearch(st) {
      // const level = st.DAD009 // 层级1，2，3
      const text = st.DAD054;
      if (text && text !== "") {
        // 这里是导航问问题
        this.pushAndScroll({
          owe: true,
          type: "i3",
          text: text
        });

        this.search({
          ptext: st,
          ptype: "02"
        })
          .then(data => {
            this.searchResult(data);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        alert("请输入内容");
      }
    },
    inputSearch() {
      const searchText = this.searchText;
      this.searchText = "";
      if (searchText && searchText !== "") {
        // 这里是输入问问题
        this.pushAndScroll({
          owe: true,
          type: "i3",
          text: searchText
        });

        this.search({
          ptext: { quetext: searchText },
          ptype: "03"
        })
          .then(data => {
            this.searchResult(data);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        alert("请输入内容");
      }
    },
    search(params) {
      params.prod = this.$route.query.prod ? this.$route.query.prod : '1'
      return new Promise((resolve, reject) => {
        axios({
          url: basePath + "/api/search",
          method: "post",
          data: params
        })
          .then(res => {
            // console.log(res.data.data);
            resolve(res.data.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    init() {
      this.initRobot()
      const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid || isiOS) {
        this.initWxApi()
      } else {

      }
      
    },
    initWxApi() {
      const self = this
      this.loadingWx = true
      wx.ready(function() {
        self.loadingWx = false
      })
      axios({
        url: basePath + "/api/oauth"
      }).then(res => {
        if (res.data.success === true) {
          const accessToken = res.data.data;
          // const { access_token, expires_in } = res.data.data
          axios({
            url: basePath + `/api/ticket`
          }).then(res => {
            if (res.data.success === true) {
              const ticket = res.data.data;
              const url = location.href.split("#")[0]
              // url = 'http://robot.lxf.in/robot'
              const encodeUrl = encodeURIComponent(url)
              axios({
                url: basePath + `/api/signature?ticket=${ticket}&url=${encodeUrl}`
              }).then(res => {
                const { nonceStr, timestamp, signature, appid } = res.data.data;
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: appid, // 必填，公众号的唯一标识
                  timestamp, // 必填，生成签名的时间戳
                  nonceStr, // 必填，生成签名的随机串
                  signature, // 必填，签名
                  jsApiList: [
                    "checkJsApi",
                    "translateVoice",
                    "startRecord",
                    "stopRecord",
                    "playVoice",
                  ] // 必填，需要使用的JS接口列表
                })

                wx.ready(function() {
                  self.initApis();
                })

                wx.error(function(res){
                  alert('wx.config出错:，出错信息：' + JSON.stringify(res))
                })
              });
            } else {
              console.log(res.data.data)
            }
          });
        } else {
          console.log(res.data.data)
        }
      });
    }
  },
  mounted() {
    this.init();
    const self = this
    window.__proto__.guideSearch = function(st) {
      self.guideSearch.call(self, st)
    }
  }
};
</script>
<style lang="scss">
$header-height: 40px;
$wordin-height: 46px;
$guide-height: 36px;
// $communicate-height: calc(100% - #{$header-height} - #{$wordin-height} - #{$guide-height});
.fontSize-14 {
  font-size: 14px;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;

  .header {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: $header-height;
    background: #01abff;
    display: flex;
    align-items: center;
    color: #fff;
    & > img {
      width: 36px;
      height: auto;
      margin-left: 10px;
    }
    & > span {
      margin-left: 5px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .communicate {
    width: 100%;
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    .bg-owe {
      .item {
        background: #95EC69;
        &::after {
          background: #95EC69;
          right: -7px;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
      }
    }
    .bg-robot {
      .item {
        &::after {
          background: #fff;
          left: -7px;
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
        }
      }

    }
    .flex-right {
      justify-content: flex-end;
    }
    & > div {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      display: flex;
      .sites {
        font-size: 14px;
        .tabs {
          overflow: hidden;
          & > a {
            display: inline-block;
            padding: 3px 5px;
            border-bottom: 2px solid #fff;
            &.active {
              border-bottom: 2px solid #ff950a;
            }
            &:not(:first-child) {
              margin-left: 10px;
            }
          }
        }
      }
      .item {
        position: relative;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #ccc;
        word-wrap: break-word;
        word-break: break-all;
        background: #fff;
        &::after {
          content: ' ';
          position: absolute;
          width: 14px;
          height: 14px;
          top: 20px;
          margin-top: -7px;
          transform: rotate(45deg);
        }
        .voiceIcon {
          margin-left: 3px;
        }
        & > a {
          display: flex;
          align-items: center;
        }
        span {
          margin-left: 3px;
        }
        img {
          margin-left: 3px;
          width: 12px;
          height: auto;
        }

        a {
          color: #01abff;
          padding: 5px 0;
          // margin-top: 5px;
          &:active {
            color: blue;
            -webkit-tap-highlight-color: blue;
          }
        }
      }
      .site-header {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .site {
        padding: 5px;
      }
    }
  }

  .guide {
    height: 0;
    padding: 0 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    border-top: 1px solid #f2f2f2;
    transition: height 0.3s ease-in-out;
    overflow: hidden;
    background: #f2f2f2;
    &.show {
      height: 36px;
      padding: 0 10px;
      box-sizing: border-box;
      border-top: 1px solid #f2f2f2;
      overflow: hidden;
    }
    .guide-btn {
      height: 28px;
      border-radius: 5px;
      border: 1px solid #ccc;
      padding: 1px 4px;
      box-sizing: border-box;
      display: inline-flex;
      line-height: 28px;
      background: #f2f2f2;
      color: #2eb9ff;
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }

  .saying {
    position: fixed;
    bottom: $wordin-height;
    left: 50%;
    width: 120px;
    margin-left: -60px;
  }
  .saying img {
    width: 100%;
  }

  .wordin {
    width: 100%;
    height: $wordin-height;
    border-top: 1px solid #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    background: #f2f2f2;
    .left {
      box-sizing: border-box;
      border-right: 0.5px solid #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      // padding: 0 10px;
      a, span {
        display: flex;
        padding: 5px;
        & > img {
          width: 30px;
          height: 30px;
        }
        &:active {
          background: transparent;
        }
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      padding: 2px;
      box-sizing: border-box;
      & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        height: 100%;
      }
      .input {
        padding: 2px;
        border: 1px solid #f2f2f2;
        border-radius: 5px;
        display: flex;
        flex: 1;
        & > input {
          border: none;
          height: 28px;
          width: 100%;
          font-size: 14px;
          line-height: 28px;
          &:focus {
            outline: none;
          }
        }
      }
      .send {
        height: 34px;
        width: 40px;
        margin-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #01abff;
        color: #fff;
        border: 1px solid #f2f2f2;
        border-radius: 5px;
      }
      .guide-btn {
        height: 34px;
        width: 34px;
        margin-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #01abff;
        color: #fff;
        border: 1px solid #f2f2f2;
        border-radius: 35px;
        & > img {
          width: 28px;
          height: auto;
          color: #fff;
        }
      }
      .talk_btn {
        width: 100%;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        border: 1px solid #f2f2f2;
        border-radius: 5px;
        &.active {
          background: #CACFD8;
        }
      }
    }
  }
}
</style>