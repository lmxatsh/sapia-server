FROM node:16
WORKDIR /home/sapia
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "./src/bin/server.js"]

