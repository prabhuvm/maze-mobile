class WebSocketClient {
    constructor(url) {
      this.url = url;
      this.webSocket = null;
    }
  
    connect(accessToken, appId, instanceId) {
    const wsUrl = `${this.url}/ws/game/${appId}/${instanceId}/`;
    console.log('wsUrl >>>>> ', wsUrl);
      this.webSocket = new WebSocket(wsUrl, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Event listeners for open, message, close, and error
      this.webSocket.onopen = this.onOpen;
      this.webSocket.onmessage = this.onMessage;
      this.webSocket.onclose = this.onClose;
      this.webSocket.onerror = this.onError;
    }
  
    onOpen = () => {
      console.log('WebSocket connection established ');
    };
  
    onMessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message received from server: ', data);
    };
  
    onClose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  
    onError = (error) => {
      console.error('WebSocket error:', error);
    };
  
    sendMessage(message) {
      if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.send(JSON.stringify(message));
      } else {
        console.error('WebSocket is not open. Ready state:', this.webSocket.readyState);
      }
    }
  
    disconnect() {
      if (this.webSocket) {
        this.webSocket.close();
      }
    }
  }
  
  export const wsClient = new WebSocketClient('wss://<your-api-domain>');
  