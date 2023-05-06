FROM node:14-slim  as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start"]
