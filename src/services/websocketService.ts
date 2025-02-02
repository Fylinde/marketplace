export class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string;
    private subscribers: Record<string, ((data: any) => void)[]> = {};
    private isMock: boolean;

    constructor(url: string, isMock: boolean = false) {
        this.url = url;
        this.isMock = isMock;

        if (this.isMock) {
            console.log("[Mock WebSocket] Running in mock mode");
            this.simulateMockServer();
        } else {
            this.connect();
        }
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

            // Attempt to reconnect after a delay
            setTimeout(() => this.connect(), 5000);
        };

        this.socket.onerror = (error) => {
            console.error("[WebSocket] Error occurred", error);

            // Attempt to reconnect after an error
            setTimeout(() => this.connect(), 5000);
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

    // Mock server simulation
    private simulateMockServer() {
        setTimeout(() => {
            console.log("[Mock WebSocket] Mock server connected");
            this.emit("welcome", { message: "Mock WebSocket connected" });
        }, 1000);

        setInterval(() => {
            this.emit("product-update", { productId: 1, status: "available" });
        }, 5000);
    }

    // Emit event for mock
    private emit(event: string, payload: any) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach((callback) => callback(payload));
        }
    }

    // Subscribe to an event with a callback
    subscribe(event: string, callback: (data: any) => void) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
        console.log(`[${this.isMock ? "Mock" : "Real"} WebSocket] Subscribed to event: ${event}`);
    }

    // Unsubscribe from an event
    unsubscribe(event: string, callback?: (data: any) => void) {
        if (this.subscribers[event]) {
            if (callback) {
                this.subscribers[event] = this.subscribers[event].filter((cb) => cb !== callback);
            } else {
                delete this.subscribers[event];
            }
            console.log(`[${this.isMock ? "Mock" : "Real"} WebSocket] Unsubscribed from event: ${event}`);
        }
    }

    // Simplified onMessage interface
    onMessage(callback: (data: string) => void) {
        this.subscribe("message", (data) => {
            callback(data);
        });
    }

    // Send a message through the WebSocket
    sendMessage(message: string) {
        if (this.isMock) {
            console.log(`[Mock WebSocket] Message sent: ${message}`);
            setTimeout(() => this.emit("message", { message: `Echo: ${message}` }), 500);
        } else if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            console.log("[WebSocket] Message sent:", message);
        } else {
            console.error("[WebSocket] Cannot send message, socket is not open");
        }
    }

    // Close the WebSocket connection
    closeConnection() {
        if (this.isMock) {
            console.log("[Mock WebSocket] Connection closed by client");
        } else if (this.socket) {
            this.socket.close();
            console.log("[WebSocket] Connection closed by client");
        }
    }
}
