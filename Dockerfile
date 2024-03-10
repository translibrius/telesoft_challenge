# Use the official Node.js 20 image as a parent image
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Node Dependencies
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
