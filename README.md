# RealTimeOverlay

RealTimeOverlay is a web application that allows you to display messages on a screen in real-time, controlled from a remote device. It's perfect for live events, streams, or any situation where you need to display dynamic information on an overlay.

The application generates a unique session and provides a QR code to access a remote control. Once connected, you can send messages from the remote, and they will instantly appear on the overlay screen.

## How It Works

1.  **Open the Overlay Page**: Navigate to the main page of the application. This page will automatically generate a unique session for you.
2.  **Scan the QR Code**: The overlay page will display a unique QR code. Scan this with your phone or another remote device to open the remote control page.
3.  **Connect the Remote**: The remote control page will automatically connect to the same session as the overlay.
4.  **Create and Send Messages**: Use the remote to create overlays, edit their content, and send messages. The content will appear on the overlay screen in real-time.

## User Flow

The user journey is designed to be simple and intuitive. Here is a detailed breakdown of the steps to use the application:

### 1. Starting a Session

When you first open the application, you land on the **Overlay Page**. This page is the main screen where your content will be displayed. Upon loading, the application automatically performs the following actions:
- **Generates a unique Room ID**: This ID is used to create a private session for your overlay and remote control.
- **Displays a QR Code**: A QR code is shown on the screen. This code contains a direct link to the remote control page, with the Room ID already embedded.
- **Shows the connection URL**: For convenience, a clickable URL is also displayed, which you can use if you can't scan the QR code.

### 2. Connecting the Remote Control

Once the session is created, you need to connect a remote device to control the overlay.
- **Scan the QR Code**: Use the camera on your smartphone or tablet to scan the QR code. This will open the **Remote Control Page** in your device's browser.
- **Manual Connection**: Alternatively, you can copy the displayed URL and open it in a new tab or on a different device.

The remote control will automatically connect to the same session as your overlay page.

### 3. Using the Remote Control

The remote control interface is divided into two main tabs:

- **General Tab**:
  - **Send simple text messages**: A text input field allows you to send quick messages to the overlay.
  - **Manage slots**: You can add or remove "slots" to control the capacity of your room (e.g., for multi-user scenarios).
  - **Create new overlays**: You can give a name to a new overlay and create it.

- **Editor Tab**:
  - **Select an overlay**: A list of all created overlays is displayed. You can select one to edit its properties.
  - **Edit overlay content**: The `OverlayEditor` component allows you to modify the content of the selected overlay (e.g., text, images, styles).
  - **Send overlay to the screen**: Once you are done editing, you can send the overlay to the screen.

### 4. Displaying Content on the Overlay

Any message or overlay you send from the remote control will be instantly displayed on the **Overlay Page**. The overlay has a transparent background, making it easy to integrate with broadcasting software like OBS.

## Features

*   **Real-time messaging**: Messages are sent instantly from the remote to the overlay using WebSockets.
*   **Automatic session management**: A unique session is created automatically when you open the overlay page.
*   **Easy remote connection with QR Code**: Simply scan a QR code to connect your remote control.
*   **Dynamic overlay editor**: Create and customize overlays with a rich editor.
*   **Transparent background**: The overlay is designed to be used in broadcasting software like OBS.

## Technology Stack

*   **Frontend**:
    *   [Vue.js](https://vuejs.org/)
    *   [Vite](https://vitejs.dev/) - Build tool
    *   [Pinia](https://pinia.vuejs.org/) - State management
    *   [Vue Router](https://router.vuejs.org/) - Routing
    *   [Tailwind CSS](https://tailwindcss.com/) - CSS framework
    *   [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
    *   [qrcode.vue](https://github.com/scopewu/qrcode.vue) - QR code generator for Vue 3
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
