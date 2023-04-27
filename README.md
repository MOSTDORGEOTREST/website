# MDGT site:

[Тестовый домен](http://mdgt.tmweb.ru/)

`docker build . -t website:latest` - для сборки проекта
`docker run -it --rm -d -p 80:80/tcp --name web2 website` - для запуска проекта в режиме daemon

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Запуск из папки проекта на http://localhost:3000:
### `npm start`

## Для сборки проекта:
### `docker build . -t website:latest`

## Для запуска проекта в режиме daemon на http://localhost:80:
### `docker run -it --rm -d -p 80:80/tcp --name web2 website`

developed by MDGT
