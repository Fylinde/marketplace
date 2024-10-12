export class WebSocketService {
    private socket: WebSocket;

    constructor(url: string) {
        this.socket = new WebSocket(url);

        this.socket.onopen = (event) => {
            console.log("[WebSocket] Connection opened", event);
        };

        this.socket.onmessage = (event) => {
            console.log("[WebSocket] Message received", event.data);
        };

        this.socket.onclose = (event) => {
            console.log("[WebSocket] Connection closed", event);
        };

        this.socket.onerror = (error) => {
            console.error("[WebSocket] Error occurred", error);
        };
    }

    onMessage(callback: (data: string) => void) {
        this.socket.onmessage = (event) => {
            callback(event.data);
        };
    }

    sendMessage(message: string) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error("WebSocket is not open");
        }
    }

    closeConnection() {
        this.socket.close();
    }
}
