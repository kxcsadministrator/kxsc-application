FROM node:14-slim  as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
