# RealTimeOverlay

RealTimeOverlay is a web application that allows you to display messages on a screen in real-time, controlled from a remote device. It's perfect for live events, streams, or any situation where you need to display dynamic information on an overlay.

The application generates a unique session and provides a QR code to access a remote control. Once connected, you can send messages from the remote, and they will instantly appear on the overlay screen.

## How It Works

1.  **Open the Overlay**: Navigate to the main page of the application. This is your overlay screen.
2.  **Scan the QR Code**: The overlay screen will display a unique QR code. Scan this with your phone or another remote device.
3.  **Connect the Remote**: The QR code will take you to the remote control page. It will automatically connect to the same session as the overlay.
4.  **Send Messages**: Type a message in the remote control's input field, and it will appear on the overlay in real-time.

## Features

*   **Real-time messaging**: Messages are sent instantly from the remote to the overlay using WebSockets.
*   **Unique session management**: Each overlay session has a unique ID, ensuring your messages are private.
*   **Easy remote connection**: Simply scan a QR code to connect your remote control. No need to type in URLs or room IDs.
*   **Dynamic slot management**: The remote can add or remove "slots" to control the room capacity.
*   **Transparent background**: The overlay has a transparent background when a message is displayed, making it easy to use in broadcasting software like OBS.

## Technology Stack

*   **Frontend**:
    *   [Vue.js](https://vuejs.org/)
    *   [Vite](https://vitejs.dev/) - Build tool
    *   [Pinia](https://pinia.vuejs.org/) - State management
    *   [Vue Router](https://router.vuejs.org/) - Routing
    *   [Tailwind CSS](https://tailwindcss.com/) - CSS framework
    *   [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
*   **Backend**:
    *   [Node.js](https://nodejs.org/)
    *   [Express](https://expressjs.com/) - Web server
    *   [Socket.IO](https://socket.io/) - WebSocket library

## Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (version 18.x or higher recommended)
*   [npm](https://www.npmjs.com/get-npm)

## Installation and Usage

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/suissard/RealTimeOverlay.git
    cd RealTimeOverlay
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Development

To run the application in development mode (with hot-reloading):

```bash
npm run dev
```

This will start the Vite development server for the frontend and the Node.js server for the backend concurrently.
*   The application will be available at `http://localhost:5173` (or another port if 5173 is busy).
*   The backend server will run on `http://localhost:3000`.

### Production

To build the application for production and run it:

```bash
npm run prod
```

This command will first build the frontend assets using Vite and then start the production server. The application will be served from `http://localhost:3000`.

## Project Structure

```
.
├── public/         # Static assets
├── server/
│   └── index.js    # Backend Express and Socket.IO server
├── src/
│   ├── assets/     # Frontend assets (CSS, images)
│   ├── components/ # Shared Vue components
│   ├── layouts/    # Vue layout components
│   ├── router/     # Vue Router configuration
│   ├── stores/     # Pinia stores (state management)
│   ├── views/      # Vue view components (pages)
│   ├── App.vue     # Main Vue component
│   └── main.js     # Frontend entry point
├── tests/          # Test files
├── package.json    # Project dependencies and scripts
└── README.md       # This file
```

## WebSocket API

The backend server listens for the following Socket.IO events:

*   `join`: A client joins a room.
    *   **Payload**: `{ roomId: string, isRemote: boolean }`
    *   **Emits**: `room_joined` to all clients in the room, or `room_full` to the sender if the room is at capacity.
*   `control_message`: A client sends a message to a room.
    *   **Payload**: `{ room: string, message: string }`
    *   **Emits**: `control_message` to all other clients in the room.
*   `manage_slots`: A remote client requests to change the room capacity.
    *   **Payload**: `{ roomId: string, action: 'add' | 'remove' }`
    *   **Emits**: `room_updated` to all clients in the room.
*   `disconnect`: A client disconnects from the server.
    *   **Emits**: `room_left` to all clients in the room.
