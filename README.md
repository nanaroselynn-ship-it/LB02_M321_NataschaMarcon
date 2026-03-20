# Chat App 

## Description 
This project is a real-time chat application.
Users can set a username, send messages and see other online users. 
Messages are stored in MongoDB and remain after reloading the page.
The application is fully containerized using Docker. 


## Technologies
- React (Frontend)
- Vite
- Node.js + Express (Backend)
- Socket.IO (Realtime communication)
- MongoDB (Database)
- Docker & Docker Compose
- Nginx (Reverse Proxy)



## Start the Project

Run this command in the project root:

```bash
docker compose up --build

## Access

After starting the containers, open the application in your browser:

[http://localhost:8080](http://localhost:8080)