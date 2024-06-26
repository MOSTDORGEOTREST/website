#!/bin/bash

DOMAIN="mdgt.site"
COMPANY="MDGT"
NAME="Mdgtov"
EMAIL="sheepdolly2023@gmail.com"
TARGET_DIR="$(dirname "$0")"
DAEMON_SCRIPT="/root/website/daemon.sh"  # Используем абсолютный путь

# Функция для установки пакетов
install_package() {
    PACKAGE=$1
    if ! dpkg -l | grep -q $PACKAGE; then
        echo "Устанавливаем $PACKAGE..."
        apt-get update
        apt-get install -y $PACKAGE
    else
        echo "$PACKAGE уже установлен."
    fi
}

# Проверка на наличие sudo/root прав
if [ "$(id -u)" -ne 0 ]; then
    echo "Этот скрипт необходимо запускать с правами суперпользователя (sudo)."
    exit 1
fi

# Установка необходимых приложений
install_package software-properties-common
add-apt-repository universe
add-apt-repository ppa:certbot/certbot -y
apt-get update
install_package certbot
install_package python3-certbot-nginx

# Получение SSL сертификата с помощью Certbot
certbot certonly --non-interactive --agree-tos --email $EMAIL --webroot -w /var/www/html -d $DOMAIN

# Проверка успешности выполнения
if [ $? -eq 0 ]; then
    echo "SSL сертификат успешно получен для домена $DOMAIN."
    echo "Копирование сертификатов в целевую директорию $TARGET_DIR..."

    # Копирование сертификатов в целевую директорию
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $TARGET_DIR/crt.crt
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $TARGET_DIR/key.key

    if [ -f "$TARGET_DIR/crt.crt" ] && [ -f "$TARGET_DIR/key.key" ]; then
        echo "Сертификаты успешно скопированы в $TARGET_DIR."
    else
        echo "Ошибка при копировании сертификатов."
        exit 1
    fi
else
    echo "Ошибка при получении SSL сертификата для домена $DOMAIN."
    exit 1
fi

# Настройка автоматического обновления сертификатов
echo "Настройка автоматического обновления сертификатов..."
(crontab -l 2>/dev/null; echo "0 0 * * 0 sudo /usr/bin/certbot renew --quiet --deploy-hook '\
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $TARGET_DIR/crt.crt && \
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $TARGET_DIR/key.key'") | crontab -

echo "Настройка завершена."

# Проверка и запуск скрипта DAEMON_SCRIPT
if [ -f "$DAEMON_SCRIPT" ]; then
    if [ -x "$DAEMON_SCRIPT" ]; then
        echo "Запуск $DAEMON_SCRIPT..."
        sudo $DAEMON_SCRIPT
        if [ $? -eq 0 ]; then
            echo "$DAEMON_SCRIPT успешно выполнен."
        else
            echo "Ошибка при выполнении $DAEMON_SCRIPT."
        fi
    else
        echo "Скрипт $DAEMON_SCRIPT существует, но не является исполняемым. Добавление прав на выполнение..."
        chmod +x "$DAEMON_SCRIPT"
        echo "Права на выполнение добавлены. Повторный запуск $DAEMON_SCRIPT..."
        sudo $DAEMON_SCRIPT
        if [ $? -eq 0 ]; then
            echo "$DAEMON_SCRIPT успешно выполнен."
        else
            echo "Ошибка при выполнении $DAEMON_SCRIPT."
        fi
    fi
else
    echo "Скрипт $DAEMON_SCRIPT не найден."
fi

