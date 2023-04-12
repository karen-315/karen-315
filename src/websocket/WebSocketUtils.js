export const SERVER_WS_CONNECT_SUCCESS = 'connect_success'; //初始化成功
export const SERVER_WS_CONNECT_FAIL = 'connect_fail'; //初始化失败
export const SERVER_WS_DO_NEXT = 'do_next'; //接下来

export default class WebSocketUtils
{
    constructor(strPrefix,isAutoReconnect,strUrl,fnInitConnectCallback,messageCallback)
    {
        this.strPrefix = strPrefix;
        this.isConnected = false;
        this.strUrl = strUrl;
        //this.fnConnectCallback = (isConnected),isConnected:true 成功，false失败
        this.fnConnectCallback = fnInitConnectCallback;
        this.messageCallback = messageCallback;
        this.mWebsocket = null;
        this.fnReConnectedCallback = null;
        this.isReconneccted = false;
        this.isAutoReconnect = true;    //是否自动重新连接

        this.initDataManager();
    }

    initDataManager()
    {
        this.startConnect();
    }

    startConnect()
    {
        let preHost = 'ws://';
        // if(GetQtController().inParam.dataUrl.indexOf('https') != -1) {
        //   preHost = 'wss://';
        // }
        console.log(this.strPrefix,preHost + this.strUrl);
        this.mWebsocket = new WebSocket(preHost + this.strUrl);
        if(!this.mWebsocket)
        {
            console.log(this.strPrefix,'connect failed!')
            if(this.fnConnectCallback && !this.isReconneccted) {
              this.fnConnectCallback(false,SERVER_WS_CONNECT_FAIL);
            }
            return;
        }

        this.mWebsocket.binaryType = 'arraybuffer';
        this.mWebsocket.onopen = this.onAppSocketOpen.bind(this);
        this.mWebsocket.onmessage = this.onAppData.bind(this);
        this.mWebsocket.onerror = this.onError.bind(this);
        this.mWebsocket.onclose = this.onClose.bind(this);
        window.addEventListener("beforeunload", function (e) {
          if(this.webAppSocket) {
            this.webAppSocket.close();
          }
        });

    }

    startReConnectTimer() {
        if(this.isAutoReconnect) {
            this.isReconneccted = true;
            setTimeout(() => {
                this.initDataManager();
            }, 2000);
        }
    }

    setReConnectedCallback(fncallback) {
        this.fnReConnectedCallback = fncallback;
    }

    onClose(event) {
        console.log(this.strPrefix,'onClose',event);
        this.isConnected = false;
        this.startReConnectTimer();
    }

    onError(event) {
        console.log(this.strPrefix,'onError',event);
        this.isConnected = false;
        if(this.fnConnectCallback) {
            this.fnConnectCallback(false,SERVER_WS_CONNECT_FAIL);
            this.fnConnectCallback = null;
        }
    }

    onAppSocketOpen()
    {
      if(this.mWebsocket.readyState === WebSocket.OPEN)
      {
        this.isConnected = true;
          if(this.isConnected && this.isReconneccted && this.fnReConnectedCallback) {
              this.fnReConnectedCallback();
          }
      } else {
        console.log(this.strPrefix,"socket is not connected yet");
      }

      if(this.fnConnectCallback) {
        this.fnConnectCallback(this.isConnected,this.isConnected?SERVER_WS_CONNECT_SUCCESS:SERVER_WS_CONNECT_FAIL);
      }
      console.log(this.strPrefix,'onAppSocketOpen--' + this.strUrl);
    }

    onAppData(event)
    {
      let strData = event.data;
      if(!(typeof(strData)=='string')) {
        //不是String则返回
        return;
      }

      if(this.messageCallback) {
          this.messageCallback(strData);
      }
	}

    sendAppText(text)
    {
        if(this.isConnected)
        {
            this.mWebsocket.binaryType = 'blob';
            this.mWebsocket.send(text);
        }
    }
    // ________________________________________________

    close() {
        if(this.mWebsocket) {
          this.mWebsocket.close();
        }
    }
}
