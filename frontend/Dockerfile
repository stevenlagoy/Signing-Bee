FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install cypress --save-dev
COPY . .
CMD ["npm", "run", "start"]
