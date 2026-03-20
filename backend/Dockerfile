# use official node.js image
FROM node:20

# set working directory inside container
WORKDIR /app

# copy package.json and package-lock.json 
COPY package*.json ./

# install all depencies
RUN npm install

# copy the rest of the backend source code
COPY . .

# expose backend port must match your port
EXPOSE 5008

# start the server using npm start
CMD ["npm", "start"]