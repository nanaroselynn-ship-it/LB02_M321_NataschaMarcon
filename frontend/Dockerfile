# Stage 1: Build the React application
FROM node:20 AS build 

 # Set working directory inside container
WORKDIR /app

# copy package files
COPY package*.json ./

# install depencies 
RUN npm install

# copy all source code
COPY . .

# build the app creates dist folder
RUN npm run build

# server the app with nginx
FROM nginx:latest

# copy built files from build stage to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# copy custom nginx config for routing proxy
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# expose port 80 for the webserver 
EXPOSE 80