var app = {
  el: '#app',
  template: `
    <div class="container">
      <!-- 导航栏 -->
      <nav class="navbar navbar-light bg-light">
        <div class="navbar-brand monospace">
          <img src="icon.svg" width="30" height="30" class="d-inline-block align-top">
          <small>WebSocket 调试工具</small>
        </div>
      </nav><!-- 导航栏 -->

      <!-- 主体内容 -->
      <div class="row monospace">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <!-- 左侧面板 -->
                <div class="col-sm-12 col-md-5">
                  <!-- 服务设置 -->
                  <div class="col-sm-12">
                    <h5 class="card-title">状态: {{ instance.readyState | rStatus }}</h5>
                    <hr class="divider divider-dashed">
                    <!-- 连接地址 -->
                    <div class="card-text">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">服务地址</div>
                        </div>
                        <input type="text" class="form-control" placeholder="输入服务器地址" v-model="address">
                        <div>
                          <button type="button" class="btn btn-success" @click="autoConnect">{{ connected ? '断开' : '连接' }}</button>
                        </div>
                      </div>
                    </div>
                  </div><!-- 服务设置 -->

                  <!-- 发送设置 -->
                  <div class="col-sm-12 mt-3">
                    <h5 class="card-title">发送设置</h5>
                    <hr class="divider divider-dashed">
                    <!-- 自动发送 -->
                    <div class="card-text">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">每隔</div>
                        </div>
                        <input title="" type="text" class="form-control text-center" v-model="heartBeatSecond" :disabled="!connected">
                        <div class="input-group-append input-group-prepend">
                          <span class="input-group-text">秒发送内容</span>
                        </div>
                        <input title="" type="text" class="form-control" v-model="heartBeatContent" :disabled="!connected">
                        <div class="input-group-append">
                          <button type="button" class="btn btn-block" :class="autoSend ? 'btn-danger' : 'btn-success'" @click="autoHeartBeat" :disabled="!connected">{{ autoSend ? '停止发送' : '开始发送' }}</button>
                        </div>
                      </div>
                    </div>
                    <!-- 手动发送 -->
                    <div class="card-text mt-2">
                      <textarea class="form-control mt-1" rows="2" placeholder="需要发送到服务端的内容" v-model="content" :disabled="!connected"></textarea>
                      <div>
                        <input type="checkbox" v-model="sendClean" :disabled="!connected">
                        <label>自动清空输入</label>
                      </div>
                    </div>
                    <div class="card-text">
                      <div class="btn-group btn-block" role="group">
                        <button class="btn btn-block btn-success" :disabled="!connected" @click="sendData">发送消息</button>
                        <div class="btn-group" role="group">
                          <button id="btnGroupDrop" type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :disabled="!connected">
                            历史记录
                          </button>
                          <div class="dropdown-menu" aria-labelledby="btnGroupDrop">
                            <a class="dropdown-item" href="#" v-for="(item, index) in history" :id="index" @click="selectInput">{{ (index + 1) + '. ' + item.desc }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div><!-- 发送设置 -->

                  <!-- 调试消息 -->
                  <div class="col-sm-12 mt-3">
                    <h5 class="card-title">调试消息</h5>
                    <hr class="divider divider-dashed">
                    <div class="card-text">
                      <div class="card-title console-box" id="console-box">
                        <div class="mb-2" v-for="item in consoleData">
                          <strong :class="'text-'+item.type">{{item.time}} => </strong> <span>{{item.content}}</span>
                        </div>
                      </div>
                    </div>
                  </div><!-- 调试消息 -->
                </div><!-- 左侧面板 -->

                <!-- 右侧面板 -->
                <div class="col-sm-12 col-md-7">
                  <!-- 消息设置 -->
                  <div class="col-sm-12">
                    <h5 class="card-title" style="display: inline">消息设置</h5>
                    <small>
                      <a href="#" @click="cleanMessage">清空消息</a>
                    </small>
                    <hr class="divider divider-dashed">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="recvClean" class="custom-control-input" v-model="recvClean" :disabled="!connected">
                      <label class="custom-control-label" for="recvClean">自动清空历史</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="recvDecode" class="custom-control-input" v-model="recvDecode" :disabled="!connected">
                      <label class="custom-control-label" for="recvDecode">JSON格式化</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="recvPause" class="custom-control-input" v-model="recvPause" :disabled="!connected">
                      <label class="custom-control-label" for="recvPause">暂停接收消息</label>
                    </div>
                    <hr class="divider divider-dashed">
                    <div class="card-text message-box" id="message-box">
                      <div v-for="item in messageData">
                        <div class="mb-2" :class="{ 'text-left' : item.direction , 'text-left' : !item.direction }">
                          <strong><span :class="{'text-success' : item.direction , 'text-primary' : !item.direction}">{{item.direction ? '发送' : '收到'}}消息</span> {{item.time}}</strong>
                          <div class="monospace" v-if="!recvDecode"> {{ item.content }}</div>
                          <div class="monospace" v-html='JSON.format(item.content)' v-if="recvDecode"></div>
                        </div>
                      </div>
                    </div>
                  </div><!-- 消息设置 -->
                </div><!-- 右侧面板 -->
              </div>
            </div>
          </div>
        </div>
      </div><!-- 主体内容 -->
    </div>
  `,
  data: {
    connected: false,
    instance: WebSocket,
    address: 'ws://127.0.0.1/ws',
    content: '',
    autoSend: false,
    heartBeatSecond: 30,
    heartBeatContent: 'PING',
    sendClean: false,
    recvClean: false,
    recvPause: false,
    recvDecode: false,
    autoTimer: undefined,
    history: [],
    consoleData: [],
    messageData: [],
    maxMessageNum: 100,
  },
  filters: {
    rStatus: function (value) {
      switch (value) {
        case undefined:
          return '尚未创建'
        case 0 :
          return '尚未开启'
        case 1:
          return '连接成功'
        case 2:
          return '正在关闭'
        case 3:
          return '连接关闭'
      }
    }
  },
  created: function () {
    var self = this;
    if ('WebSocket' in window) {
      this.writeConsole('success', '初始化完成');
    } else {
      this.writeConsole('danger', '当前浏览器不支持 H5 WebSocket 请更换浏览器');
    }
    chrome.storage.local.get(['address', 'history'], function(result) {
      if (result.history instanceof Array) {
        self.history = result.history;
      }
      if (typeof result.address === 'string') {
        self.address = result.address;
      }
    });
  },
  methods: {
    // 关闭代码
    closeCode: function (code) {
      var codes = {
        1000: '1000 CLOSE_NORMAL',
        1001: '1001 CLOSE_GOING_AWAY',
        1002: '1002 CLOSE_PROTOCOL_ERROR',
        1003: '1003 CLOSE_UNSUPPORTED',
        1004: '1004 CLOSE_RETAIN',
        1005: '1005 CLOSE_NO_STATUS',
        1006: '1006 CLOSE_ABNORMAL',
        1007: '1007 UNSUPPORTED_DATA',
        1008: '1008 POLICY_VIOLATION',
        1009: '1009 CLOSE_TOO_LARGE',
        1010: '1010 MISSING_EXTENSION',
        1011: '1011 INTERNAL_ERROR',
        1012: '1012 SERVICE_RESTART',
        1013: '1013 TRY_AGAIN_LATER',
        1014: '1014 CLOSE_RETAIN',
        1015: '1015 TLS_HANDSHAKE'
      };
      var error = codes[code];
      if (error === undefined) {
        error = '0000 UNKNOWN_ERROR 未知错误';
      }
      return error;
    },
    // 自动连接
    autoConnect: function () {
      try {
        if (!this.connected) {
          var self = this;
          chrome.storage.local.set({address: this.address});
          var wsInstance = new WebSocket(this.address);
          wsInstance.onopen = function (ev) {
            console.info(ev);
            self.connected  = true;
            self.writeConsole('success', '连接成功 => ' + self.instance.url);
          };
          wsInstance.onclose = function (ev) {
            console.info(ev);
            self.autoSend = false;
            self.connected = false;
            clearInterval(self.autoTimer);
            if (ev.code !== 1000) {
              self.writeConsole('danger', '连接关闭 => ' + self.closeCode(ev.code));
            }
          };
          wsInstance.onerror = function (ev) {
            console.warn(ev);
            self.autoSend = false;
            self.connected = false;
            clearInterval(self.autoTimer);
            self.writeConsole('danger', '发生错误 请打开浏览器控制台查看');
          };
          wsInstance.onmessage = function (ev) {
            console.info(ev);
            if (!self.recvPause) {
              var data = ev.data;
              if (self.recvClean) {
                self.messageData = [];
              }
              self.writeNews(0, data);
            }
          };
          this.instance = wsInstance;
        } else {
          this.instance.close(1000);
          this.writeConsole('success', '连接关闭 => ' + '用户主动关闭');
        }
      } catch (err) {
        console.warn(err);
        this.writeConsole('danger', '创建 WebSocket 对象失败 请检查服务器地址');
      };
    },
    // 发送数据
    sendData: function (raw) {
      var data  = raw;
      if (typeof data === 'object') {
        data = this.content;
        if (this.history.length == 0 || this.history[0].data !== data) {
          var item = {data: data, desc: data.length > 64 ? data.substr(0, 64) + '...': data};
          this.history = [item].concat(this.history);
          if (this.history.length > 10) {
            this.history.splice(10, this.history.length - 10);
          }
          chrome.storage.local.set({history: this.history});
        }
      }
      try {
        this.instance.send(data);
        this.writeNews(1, data);
        if (this.sendClean && typeof raw === 'object') {
          this.content = '';
        }
      } catch (err) {
        this.writeConsole('danger', '消息发送失败 原因请查看控制台');
        throw err;
      }
    },
    // 清理消息
    cleanMessage: function() {
      this.messageData = [];
    },
    // 选择输入
    selectInput: function(ev) {
      var idx = parseInt(ev.srcElement.id);
      if (!isNaN(idx) && idx < this.history.length) {
        this.content = this.history[idx].data;
      }
    },
    // 自动心跳
    autoHeartBeat: function () {
      if (this.autoSend) {
        this.autoSend = false;
        clearInterval(this.autoTimer);
      } else {
        var self = this;
        this.autoSend  = true
        this.autoTimer = setInterval(function () {
          self.writeConsole('info', '自动发送: ' + self.heartBeatContent);
          self.sendData(self.heartBeatContent);
        }, this.heartBeatSecond * 1000);
      }
    },
    // 滚动底部
    scrollOver: function scrollOver (e) {
      if (e) {
        e.scrollTop = e.scrollHeight;
      }
    },
    // 写入控制台
    writeConsole: function (className, content) {
      var self = this;
      this.consoleData.push({
        content: content,
        type: className,
        time: moment().format('HH:mm:ss')
      });

      if (this.consoleData.length > this.maxMessageNum) {
        this.consoleData.splice(0, this.consoleData.length - this.maxMessageNum);
      }

      this.$nextTick(function () {
        self.scrollOver(document.getElementById('console-box'));
      });
    },
    // 写入新消息
    writeNews: function (direction, content, callback) {
      if (typeof callback === 'function') {
        content = callback(content);
      }

      this.messageData.push({
        direction: direction,
        content: content,
        time: moment().format('HH:mm:ss')
      });

      if (this.messageData.length > this.maxMessageNum) {
        this.messageData.splice(0, this.messageData.length - this.maxMessageNum);
      }

      var self = this;
      this.$nextTick(function () {
        if (!self.recvClean) {
          self.scrollOver(document.getElementById('message-box'));
        }
      });
    }
  }
};

new Vue(app);
