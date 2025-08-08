#!/bin/bash

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Символы для статусов
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
LOADING="🔄"

# Функция для печати цветных сообщений
print_status() {
    local status=$1
    local color=$2
    local message=$3
    echo -e "${color}${status} ${message}${NC}"
}

print_header() {
    local message=$1
    echo ""
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║ ${WHITE}${message}${PURPLE} ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    local step=$1
    local message=$2
    echo -e "${CYAN}[STEP ${step}] ${WHITE}${message}${NC}"
}

# Основные параметры
DOMAIN="mdgt.site"
COMPANY="MDGT"
NAME="Mdgtov"
EMAIL="sheepdolly2023@gmail.com"
TARGET_DIR="$(dirname "$0")"
DAEMON_SCRIPT="/root/daemon.sh"
WEBROOT_PATH="/var/www/html"
NGINX_CONF="/etc/nginx/sites-available/default"

print_header "SSL Certificate Setup Script v2.0"
print_status "$INFO" "$BLUE" "Домен: $DOMAIN"
print_status "$INFO" "$BLUE" "Email: $EMAIL"
print_status "$INFO" "$BLUE" "Целевая директория: $TARGET_DIR"

# Функция для установки пакетов с красивым выводом
install_package() {
    local PACKAGE=$1
    print_step "PKG" "Проверка пакета: $PACKAGE"
    
    if ! dpkg -l | grep -q "^ii  $PACKAGE "; then
        print_status "$LOADING" "$YELLOW" "Устанавливаем $PACKAGE..."
        apt-get update &>/dev/null
        if apt-get install -y $PACKAGE &>/dev/null; then
            print_status "$SUCCESS" "$GREEN" "$PACKAGE успешно установлен"
        else
            print_status "$ERROR" "$RED" "Ошибка установки $PACKAGE"
            return 1
        fi
    else
        print_status "$SUCCESS" "$GREEN" "$PACKAGE уже установлен"
    fi
}

# Функция проверки веб-сервера
check_webserver() {
    print_step "WEB" "Диагностика веб-сервера"
    
    # Проверяем nginx
    if systemctl is-active --quiet nginx; then
        print_status "$SUCCESS" "$GREEN" "Nginx активен"
        NGINX_RUNNING=true
    else
        print_status "$WARNING" "$YELLOW" "Nginx не запущен"
        NGINX_RUNNING=false
    fi
    
    # Проверяем apache2 (на всякий случай)
    if systemctl is-active --quiet apache2; then
        print_status "$WARNING" "$YELLOW" "Apache2 запущен (может конфликтовать)"
        systemctl stop apache2
        print_status "$INFO" "$BLUE" "Apache2 остановлен"
    fi
    
    # Проверяем доступность порта 80
    if netstat -tuln | grep -q ":80 "; then
        print_status "$INFO" "$BLUE" "Порт 80 занят"
        PORT_80_FREE=false
    else
        print_status "$WARNING" "$YELLOW" "Порт 80 свободен"
        PORT_80_FREE=true
    fi
    
    return 0
}

# Функция создания базовой конфигурации nginx
setup_basic_nginx() {
    print_step "NGINX" "Настройка базовой конфигурации nginx"
    
    # Создаем webroot если не существует
    mkdir -p $WEBROOT_PATH
    
    # Создаем базовую страницу
    cat > $WEBROOT_PATH/index.html << 'EOF'


SSL Setup
SSL Certificate Setup in Progress


EOF

    # Создаем простую конфигурацию nginx
    cat > $NGINX_CONF << EOF
server {
    listen 80;
    server_name $DOMAIN;
    root $WEBROOT_PATH;
    index index.html;
    
    location /.well-known/acme-challenge/ {
        root $WEBROOT_PATH;
        allow all;
    }
    
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

    # Проверяем конфигурацию
    if nginx -t &>/dev/null; then
        print_status "$SUCCESS" "$GREEN" "Конфигурация nginx корректна"
        systemctl reload nginx
        return 0
    else
        print_status "$ERROR" "$RED" "Ошибка в конфигурации nginx"
        return 1
    fi
}

# Функция получения сертификата
get_certificate() {
    local method=$1
    print_step "CERT" "Получение SSL сертификата методом: $method"
    
    case $method in
        "webroot")
            certbot certonly --non-interactive --agree-tos --email $EMAIL \
                --webroot -w $WEBROOT_PATH -d $DOMAIN
            ;;
        "standalone")
            # Останавливаем веб-серверы для standalone
            systemctl stop nginx 2>/dev/null || true
            systemctl stop apache2 2>/dev/null || true
            
            certbot certonly --non-interactive --agree-tos --email $EMAIL \
                --standalone -d $DOMAIN
            ;;
        *)
            print_status "$ERROR" "$RED" "Неизвестный метод: $method"
            return 1
            ;;
    esac
    
    return $?
}

# Проверка на наличие sudo/root прав
if [ "$(id -u)" -ne 0 ]; then
    print_status "$ERROR" "$RED" "Этот скрипт необходимо запускать с правами суперпользователя (sudo)"
    exit 1
fi

print_status "$SUCCESS" "$GREEN" "Права суперпользователя подтверждены"

# Установка необходимых приложений
print_header "УСТАНОВКА ЗАВИСИМОСТЕЙ"

install_package software-properties-common
add-apt-repository universe -y &>/dev/null
add-apt-repository ppa:certbot/certbot -y &>/dev/null
apt-get update &>/dev/null
install_package certbot
install_package python3-certbot-nginx
install_package nginx
install_package net-tools

# Диагностика веб-сервера
print_header "ДИАГНОСТИКА ВЕБ-СЕРВЕРА"
check_webserver

# Пытаемся настроить nginx если он не работает
if [ "$NGINX_RUNNING" = false ]; then
    print_step "FIX" "Попытка запуска и настройки nginx"
    
    if setup_basic_nginx; then
        systemctl start nginx
        if systemctl is-active --quiet nginx; then
            print_status "$SUCCESS" "$GREEN" "Nginx успешно запущен"
            NGINX_RUNNING=true
        else
            print_status "$WARNING" "$YELLOW" "Не удалось запустить nginx, будем использовать standalone режим"
        fi
    fi
fi

# Получение SSL сертификата
print_header "ПОЛУЧЕНИЕ SSL СЕРТИФИКАТА"

CERT_SUCCESS=false

# Сначала пробуем webroot метод
if [ "$NGINX_RUNNING" = true ]; then
    print_step "TRY" "Попытка получения сертификата через webroot"
    if get_certificate "webroot"; then
        print_status "$SUCCESS" "$GREEN" "SSL сертификат получен через webroot"
        CERT_SUCCESS=true
    else
        print_status "$WARNING" "$YELLOW" "Webroot метод не сработал, пробуем standalone"
    fi
fi

# Если webroot не сработал, используем standalone
if [ "$CERT_SUCCESS" = false ]; then
    print_step "TRY" "Попытка получения сертификата через standalone"
    if get_certificate "standalone"; then
        print_status "$SUCCESS" "$GREEN" "SSL сертификат получен через standalone"
        CERT_SUCCESS=true
        # Перезапускаем nginx после standalone
        systemctl start nginx 2>/dev/null || true
    else
        print_status "$ERROR" "$RED" "Не удалось получить SSL сертификат"
    fi
fi

if [ "$CERT_SUCCESS" = true ]; then
    print_header "КОПИРОВАНИЕ СЕРТИФИКАТОВ"
    
    print_step "COPY" "Копирование сертификатов в $TARGET_DIR"
    
    # Копирование сертификатов
    if cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $TARGET_DIR/crt_site.crt && \
       cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $TARGET_DIR/key_site.key; then
        
        # Устанавливаем правильные права на сертификаты
        chmod 644 $TARGET_DIR/crt_site.crt
        chmod 600 $TARGET_DIR/key_site.key
        
        print_status "$SUCCESS" "$GREEN" "Сертификаты успешно скопированы"
        print_status "$INFO" "$BLUE" "Права на файлы установлены: crt (644), key (600)"
    else
        print_status "$ERROR" "$RED" "Ошибка при копировании сертификатов"
        exit 1
    fi
    
    # Настройка автоматического обновления
    print_header "НАСТРОЙКА АВТООБНОВЛЕНИЯ"
    
    print_step "CRON" "Добавление задания в crontab"
    
    # Создаем скрипт для обновления
    RENEW_SCRIPT="/usr/local/bin/ssl-renew.sh"
    cat > $RENEW_SCRIPT << EOF
#!/bin/bash
/usr/bin/certbot renew --quiet --deploy-hook "\\
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $TARGET_DIR/crt_site.crt && \\
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $TARGET_DIR/key_site.key && \\
chmod 644 $TARGET_DIR/crt_site.crt && \\
chmod 600 $TARGET_DIR/key_site.key && \\
systemctl reload nginx 2>/dev/null || true"
EOF
    
    chmod +x $RENEW_SCRIPT
    
    # Добавляем в crontab
    (crontab -l 2>/dev/null | grep -v ssl-renew; echo "0 0 * * 0 $RENEW_SCRIPT") | crontab -
    
    print_status "$SUCCESS" "$GREEN" "Автообновление настроено (еженедельно в воскресенье)"
    
else
    print_status "$ERROR" "$RED" "Не удалось получить SSL сертификат. Проверьте:"
    echo -e "${YELLOW}  • Доменное имя $DOMAIN указывает на этот сервер${NC}"
    echo -e "${YELLOW}  • Порт 80 открыт в файерволе${NC}"
    echo -e "${YELLOW}  • DNS записи корректны${NC}"
    exit 1
fi

# Запуск daemon скрипта
print_header "ЗАПУСК DAEMON СКРИПТА"

if [ -f "$DAEMON_SCRIPT" ]; then
    print_step "DAEMON" "Найден скрипт: $DAEMON_SCRIPT"
    
    if [ ! -x "$DAEMON_SCRIPT" ]; then
        print_status "$INFO" "$BLUE" "Добавление прав на выполнение"
        chmod +x "$DAEMON_SCRIPT"
    fi
    
    print_step "EXEC" "Запуск daemon скрипта"
    if $DAEMON_SCRIPT; then
        print_status "$SUCCESS" "$GREEN" "Daemon скрипт выполнен успешно"
    else
        print_status "$ERROR" "$RED" "Ошибка при выполнении daemon скрипта"
    fi
else
    print_status "$WARNING" "$YELLOW" "Daemon скрипт $DAEMON_SCRIPT не найден"
fi

print_header "НАСТРОЙКА ЗАВЕРШЕНА УСПЕШНО"
print_status "$SUCCESS" "$GREEN" "SSL сертификат для домена $DOMAIN готов к использованию"
print_status "$INFO" "$BLUE" "Сертификаты сохранены в: $TARGET_DIR"
print_status "$INFO" "$BLUE" "Автообновление настроено"

# Показываем информацию о сертификате
if openssl x509 -in $TARGET_DIR/crt_site.crt -noout -dates &>/dev/null; then
    EXPIRE_DATE=$(openssl x509 -in $TARGET_DIR/crt_site.crt -noout -enddate | cut -d= -f2)
    print_status "$INFO" "$BLUE" "Сертификат действителен до: $EXPIRE_DATE"
fi

echo ""
print_status "$SUCCESS" "$GREEN" "Все операции выполнены успешно! 🎉"
