# Deployment Guide

This document provides instructions on how to deploy the Real-Time Overlay application in a production environment.

There are two recommended methods for deployment:

1.  [Using Docker (Recommended)](#using-docker-recommended)
2.  [Manual Deployment](#manual-deployment)

---

## Using Docker (Recommended)

This is the easiest and recommended method for deploying the application. It uses Docker and Docker Compose to build and run the application in an isolated container.

### Prerequisites

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/suissard/RealTimeOverlay.git
    cd RealTimeOverlay
    ```

2.  **Build and Run the Container**
    In the root of the project directory, run the following command:
    ```bash
    docker-compose up -d --build
    ```
    *   `--build` forces the build of the image from the `Dockerfile`.
    *   `-d` runs the container in detached mode (in the background).

3.  **Access the Application**
    Once the container is running, the application will be accessible at [http://localhost:3000](http://localhost:3000).

### Managing the Application

*   **To stop the application:**
    ```bash
    docker-compose down
    ```
*   **To view logs:**
    ```bash
    docker-compose logs -f
    ```

---

## Manual Deployment

This method requires you to have Node.js installed on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/suissard/RealTimeOverlay.git
    cd RealTimeOverlay
    ```

2.  **Install Dependencies**
    Install all the necessary npm packages.
    ```bash
    npm install
    ```

3.  **Build and Start the Application**
    The `prod` script will first build the frontend application and then start the production server.
    ```bash
    npm run prod
    ```

4.  **Access the Application**
    The application will be running and accessible at [http://localhost:3000](http://localhost:3000). The server will be running in your current terminal session. To run it in the background, consider using a process manager like `pm2`.
