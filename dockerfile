FROM node:16 as react
WORKDIR /usr/share/react
COPY package*.json ./
RUN npm ci --prefer-offline --no-optional
COPY . .
RUN npm run build
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=react /usr/share/react/build /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
