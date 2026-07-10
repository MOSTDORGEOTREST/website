FROM node:16 AS react
WORKDIR /usr/share/react
COPY package*.json ./
RUN npm ci --prefer-offline --no-optional
COPY . .
RUN npm run build

FROM nginx
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY server/init.d/app.conf /etc/nginx/conf.d/app.conf
COPY server/docker-entrypoint.d/ /docker-entrypoint.d/
RUN sed -i 's/\r$//' /docker-entrypoint.d/*.sh \
    && chmod +x /docker-entrypoint.d/*.sh
COPY --from=react /usr/share/react/build /usr/share/nginx/html
COPY cert /etc/nginx/cert
RUN chown -R nginx:nginx /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

