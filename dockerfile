FROM node:20-alpine AS react
WORKDIR /usr/share/react
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY server/init.d/app.conf /etc/nginx/conf.d/app.conf
COPY --from=react /usr/share/react/build /usr/share/nginx/html
COPY cert /etc/nginx/cert
RUN chown -R nginx:nginx /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

