var app = {
  el: '#app',
  template: `
    <div>
      <!-- 头部导航 -->
      <nav class="navbar navbar-dark bg-primary">
        <div>
          <a class="navbar-brand monospace">
            <span style="color:white">WebSocket</span>
            <small style="color:white">测试工具</small>
          </a>
        </div>
      </nav>

      <!-- 主体内容 -->
      <div class="container mt-3 main-container">
      <div class="row monospace">
       <div class="col-sm-12 mt-5">
        <div class="card">
         <!-- 应用容器 -->
         <div class="card-body">
          <div class="row">

            <!-- 服务设置 -->
            <div class="col-sm-12">
             <h5 class="card-title">服务器配置 状态: 尚未创建</h5>
             <hr class="divider divider-dashed" />
             <!-- 连接地址 -->
             <div class="card-text">
              <div class="input-group">
               <div class="input-group-prepend">
                <div class="input-group-text">
                 服务地址
                </div>
               </div>
               <input type="text" class="form-control" placeholder="输入不带前缀的服务器地址" />
               <div class="input-group-append">
                <button type="button" class="btn btn-block btn-success">开启连接</button>
               </div>
              </div>
             </div>
            </div>

            <!-- 发包设置 -->
            <div class="col-sm-12 mt-3">
              <h5 class="card-title">发包设置</h5>
              <hr class="divider divider-dashed" />
              <!-- 自动发送 -->
              <div class="card-text">
                <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                  每隔
                  </div>
                </div>
                <input title="" type="text" class="form-control text-center" />
                <div class="input-group-append input-group-prepend">
                  <span class="input-group-text">秒发送内容</span>
                </div>
                <input title="" type="text" class="form-control" />
                <div class="input-group-append">
                  <button type="button" class="btn btn-block btn-success">开始发送</button>
                </div>
                </div>
              </div>
              <!-- 手动发送 -->
              <div class="card-text mt-2">
                <textarea class="form-control mt-1" id="exampleTextarea" rows="2" placeholder="需要发送到服务端的内容"></textarea>
                <div class="custom-control custom-checkbox inline-flex mt-2">
                <input type="checkbox" class="custom-control-input" id="sendClean" />
                <label class="custom-control-label" for="sendClean">发包清空输入</label>
                </div>
              </div>
              <div class="card-text mt-2">
                <button class="btn btn-block btn-success">发送到服务端</button>
              </div>
            </div>

            <!-- 消息记录 -->
            <div class="col-sm-12 mt-3">
             <h5 class="card-title">消息记录</h5>
             <hr class="divider divider-dashed" />
             <div>
              <div class="custom-control custom-checkbox inline-flex mt-2">
               <input type="checkbox" class="custom-control-input" id="recvClean" />
               <label class="custom-control-label" for="recvClean">收包清空记录</label>
              </div>
              <div class="custom-control custom-checkbox inline-flex mt-2">
               <input type="checkbox" class="custom-control-input" id="recvDecode" />
               <label class="custom-control-label" for="recvDecode">收包JSON解码</label>
              </div>
              <div class="custom-control custom-checkbox inline-flex mt-2">
               <input type="checkbox" class="custom-control-input" id="recvPause" />
               <label class="custom-control-label" for="recvPause">暂停接收</label>
              </div>
             </div>
            </div>

            <!-- 调试信息 -->
            <div class="col-sm-12 mt-3">
             <h5 class="card-title">调试消息</h5>
             <hr class="divider divider-dashed" />
             <div class="card-text">
              <div class="card-title console-box" id="console-box">
              </div>
             </div>
            </div>
          </div>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
  `
};

new Vue(app);
