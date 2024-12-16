export class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string;
    private subscribers: Record<string, ((data: any) => void)[]> = {};

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    // Establish the WebSocket connection
    private connect() {
        console.log("[WebSocket] Connecting to", this.url);
        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            console.log("[WebSocket] Connection opened", event);
        };

        this.socket.onmessage = (event) => {
            console.log("[WebSocket] Message received", event.data);
            this.handleMessage(event.data);
        };

        this.socket.onclose = (event) => {
            console.warn("[WebSocket] Connection closed", event);
        };

        this.socket.onerror = (error) => {
            console.error("[WebSocket] Error occurred", error);
        };
    }

    // Handle incoming WebSocket messages
    private handleMessage(message: string) {
        try {
            const parsedMessage = JSON.parse(message); // Expecting { event: string, payload: any }
            const { event, payload } = parsedMessage;

            if (this.subscribers[event]) {
                this.subscribers[event].forEach((callback) => callback(payload));
            } else {
                console.warn(`[WebSocket] No subscribers for event: ${event}`);
            }
        } catch (error) {
            console.error("[WebSocket] Failed to parse message:", message, error);
        }
    }

    // Subscribe to an event with a callback
    subscribe(event: string, callback: (data: any) => void) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
        console.log(`[WebSocket] Subscribed to event: ${event}`);
    }

    // Unsubscribe from an event
    unsubscribe(event: string, callback?: (data: any) => void) {
        if (this.subscribers[event]) {
            if (callback) {
                this.subscribers[event] = this.subscribers[event].filter((cb) => cb !== callback);
            } else {
                delete this.subscribers[event];
            }
            console.log(`[WebSocket] Unsubscribed from event: ${event}`);
        }
    }

    // Simplified onMessage interface
    onMessage(callback: (data: string) => void) {
        // Generic listener for all incoming messages
        this.subscribe("message", (data) => {
            callback(data);
        });
    }

    // Send a message through the WebSocket
    sendMessage(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            console.log("[WebSocket] Message sent:", message);
        } else {
            console.error("[WebSocket] Cannot send message, socket is not open");
        }
    }

    // Close the WebSocket connection
    closeConnection() {
        if (this.socket) {
            this.socket.close();
            console.log("[WebSocket] Connection closed by client");
        }
    }
}
