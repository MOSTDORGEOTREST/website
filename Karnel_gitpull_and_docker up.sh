#!/bin/bash
#
# Скрипт для автоматического обновления приложения mdgt.ru
# Версия: 1.2.0
# Автор: Системный администратор
#

# Проверка запуска от root
if [[ $EUID -ne 0 ]]; then
   echo -e "\e[31m[ОШИБКА] Этот скрипт должен запускаться с правами суперпользователя (sudo)!\e[0m"
   exit 1
fi

# Настройка цветов для логирования
readonly RED='\e[31m'
readonly GREEN='\e[32m'
readonly YELLOW='\e[33m'
readonly BLUE='\e[34m'
readonly MAGENTA='\e[35m'
readonly CYAN='\e[36m'
readonly WHITE='\e[97m'
readonly BOLD='\e[1m'
readonly NC='\e[0m' # No Color

# Настройка логирования
LOG_FILE="/var/log/mdgt_update_$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1  # Сохраняем цвета в логе [[10]]

# Функции логирования с цветами и временной меткой
log() {
    local level="$1"
    local message="$2"
    local color="$3"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    echo -e "${color}[${level}] [${timestamp}] ${message}${NC}"
}

log_info() {
    log "ИНФО" "$1" "${BLUE}"
}

log_success() {
    log "УСПЕХ" "$1" "${GREEN}"
}

log_warn() {
    log "ПРЕДУПРЕЖДЕНИЕ" "$1" "${YELLOW}"
}

log_error() {
    log "ОШИБКА" "$1" "${RED}"
    echo -e "${RED}Для диагностики проблемы проверьте лог-файл: ${LOG_FILE}${NC}"
}

# Функция для проверки успешного выполнения команды
check_result() {
    local cmd="$1"
    local success_msg="$2"
    local error_msg="$3"
    
    if eval "$cmd"; then
        log_success "$success_msg"
        return 0
    else
        log_error "$error_msg"
        return 1
    fi
}

# Обработчик ошибок
error_handler() {
    local exit_code="$?"
    local line_number="$1"
    
    if [ $exit_code -ne 0 ]; then
        log_error "Критическая ошибка на строке $line_number (код: $exit_code)"
        echo -e "${RED}${BOLD}Выполнение скрипта прервано из-за критической ошибки!${NC}"
        exit $exit_code
    fi
}

# Установка обработчика ошибок
trap 'error_handler $LINENO' ERR
set -o errexit  # Прекращать выполнение при ошибках [[8]]
set -o pipefail # Отслеживать ошибки в конвейерах

# ===========================================
# ОСНОВНОЕ ТЕЛО СКРИПТА
# ===========================================

log_info "${BOLD}=== НАЧАЛО ОБНОВЛЕНИЯ ПРИЛОЖЕНИЯ MDGT.RU ===${NC}"
log_info "Версия скрипта: 1.2.0"
log_info "Лог-файл: ${LOG_FILE}"

# ===========================================
# 1. ПОДГОТОВКА ОКРУЖЕНИЯ
# ===========================================
log_info "${BOLD}=== ШАГ 1: ПОДГОТОВКА ОКРУЖЕНИЯ ===${NC}"

PROJECT_DIR="/root/mdgt.ru/website"

if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Директория проекта $PROJECT_DIR не существует!"
    log_info "Попытка создать директорию..."
    mkdir -p "$PROJECT_DIR" || log_error "Не удалось создать директорию $PROJECT_DIR"
    
    if [ ! -d "$PROJECT_DIR" ]; then
        log_error "Критическая ошибка: не удалось создать директорию проекта"
        exit 1
    fi
    log_success "Директория проекта создана успешно"
fi

log_info "Переход в директорию проекта: $PROJECT_DIR"
cd "$PROJECT_DIR" || { log_error "Не удалось перейти в директорию проекта"; exit 1; }
log_success "Текущая директория: $(pwd)"

# Проверка наличия .git директории
if [ ! -d ".git" ]; then
    log_error "Директория .git не найдена. Это не Git-репозиторий!"
    log_info "Инициализация нового репозитория..."
    git init || log_error "Не удалось инициализировать Git-репозиторий"
    log_success "Git-репозиторий инициализирован"
fi

# ===========================================
# 2. ОБНОВЛЕНИЕ КОДА ЧЕРЕЗ GIT
# ===========================================
log_info "${BOLD}=== ШАГ 2: ОБНОВЛЕНИЕ КОДА ЧЕРЕЗ GIT ===${NC}"

# Проверка доступности Git
if ! command -v git &> /dev/null; then
    log_error "Git не установлен в системе!"
    log_info "Попытка установки Git..."
    apt-get update && apt-get install -y git || log_error "Не удалось установить Git"
    
    if ! command -v git &> /dev/null; then
        log_error "Критическая ошибка: не удалось установить Git"
        exit 1
    fi
    log_success "Git установлен успешно"
fi

log_info "Текущая ветка: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'не определена')"

# Проверка наличия изменений перед обновлением
if ! git diff --quiet; then
    log_warn "Обнаружены локальные изменения в репозитории"
    
    log_info "Сохранение локальных изменений в stash..."
    if ! git stash push -m "Авто-сохранение перед обновлением $(date +%Y%m%d_%H%M%S)"; then
        log_error "Не удалось сохранить изменения в stash"
        log_info "Попытка принудительного сохранения..."
        git stash --all || log_error "Не удалось сохранить изменения даже принудительно"
    fi
    log_success "Локальные изменения сохранены в stash"
fi

# Попытка обновления с обработкой возможных ошибок
log_info "Выполнение git pull для обновления кода..."
if ! git pull; then
    log_warn "Ошибка при выполнении git pull. Попытка восстановления..."
    
    # Проверка наличия удаленного репозитория
    if ! git remote -v | grep -q "origin"; then
        log_warn "Удаленный репозиторий не настроен. Попытка настройки..."
        git remote add origin https://github.com/username/mdgt.ru.git || log_error "Не удалось добавить удаленный репозиторий"
    fi
    
    # Попытка синхронизации с принудительным сбросом
    log_info "Попытка синхронизации с принудительным сбросом..."
    if ! git fetch origin; then
        log_error "Не удалось получить изменения из удаленного репозитория"
        exit 1
    fi
    
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" = "HEAD" ]; then
        CURRENT_BRANCH="main"  # Предполагаем основную ветку
    fi
    
    if ! git reset --hard origin/"$CURRENT_BRANCH"; then
        log_error "Не удалось синхронизировать с удаленным репозиторием"
        exit 1
    fi
    
    log_success "Код успешно синхронизирован с удаленным репозиторием"
else
    log_success "Код успешно обновлен через git pull"
fi

# Восстановление сохраненных изменений, если они были
if git stash list | grep -q "Авто-сохранение"; then
    log_info "Попытка восстановления сохраненных изменений из stash..."
    if ! git stash pop; then
        log_warn "Обнаружены конфликты при восстановлении изменений!"
        log_info "Пожалуйста, вручную разрешите конфликты и выполните git stash drop"
    else
        log_success "Сохраненные изменения успешно восстановлены"
    fi
fi

# ===========================================
# 3. ПЕРЕЗАПУСК DOCKER КОНТЕЙНЕРОВ
# ===========================================
log_info "${BOLD}=== ШАГ 3: ПЕРЕЗАПУСК DOCKER КОНТЕЙНЕРОВ ===${NC}"

# Проверка наличия docker-compose
if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose не установлен!"
    log_info "Попытка установки Docker Compose..."
    
    # Установка Docker Compose
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d '"' -f 4)
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Проверка установки
    if ! command -v docker-compose &> /dev/null; then
        log_error "Не удалось установить Docker Compose"
        exit 1
    fi
    log_success "Docker Compose установлен успешно (версия: $COMPOSE_VERSION)"
fi

# Проверка статуса Docker сервиса
if ! systemctl is-active --quiet docker; then
    log_warn "Docker сервис не запущен. Попытка запуска..."
    systemctl start docker || log_error "Не удалось запустить Docker сервис"
    sleep 5  # Даем время для полного запуска
fi

# Проверка наличия docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    log_error "Файл docker-compose.yml не найден в директории проекта!"
    
    # Проверка наличия альтернативных имен
    if [ -f "docker-compose.yaml" ]; then
        log_info "Найден файл docker-compose.yaml. Создание симлинка..."
        ln -s docker-compose.yaml docker-compose.yml || log_error "Не удалось создать симлинк"
    else
        log_error "Критическая ошибка: не найден файл конфигурации Docker Compose"
        exit 1
    fi
fi

log_info "Запуск процесса пересборки и перезапуска контейнеров..."
log_info "Команда: docker-compose up --force-recreate --build -d"

# Попытка перезапуска с обработкой ошибок
if ! docker-compose up --force-recreate --build -d; then
    log_warn "Ошибка при запуске docker-compose up. Попытка восстановления..."
    
    # Попытка 1: Остановка и повторный запуск
    log_info "Попытка 1: Полная остановка и перезапуск..."
    docker-compose down || log_warn "Не удалось корректно остановить контейнеры"
    sleep 3
    
    if docker-compose up --build -d; then
        log_success "Контейнеры успешно перезапущены после полной остановки"
        # Успешно завершаем обработку ошибок
    else
        # Попытка 2: Очистка и повторная попытка
        log_info "Попытка 2: Очистка неиспользуемых образов и сетей..."
        docker system prune -f --filter "until=24h" || log_warn "Проблемы при очистке системы Docker"
        docker network prune -f || log_warn "Проблемы при очистке сетей Docker"
        
        if docker-compose up --build -d; then
            log_success "Контейнеры успешно перезапущены после очистки"
        else
            # Попытка 3: Проверка логов и диагностика
            log_error "Не удалось перезапустить контейнеры после нескольких попыток"
            
            log_info "=== АНАЛИЗ ПРОБЛЕМЫ ==="
            log_info "Проверка состояния контейнеров..."
            docker-compose ps
            
            log_info "Проверка логов проблемного контейнера..."
            if [ "$(docker-compose ps -q | wc -l)" -gt 0 ]; then
                docker-compose logs --tail=50 || log_warn "Не удалось получить логи контейнеров"
            fi
            
            log_info "Проверка использования ресурсов..."
            df -h || log_warn "Не удалось проверить использование диска"
            free -h || log_warn "Не удалось проверить использование памяти"
            
            log_error "Критическая ошибка: не удалось перезапустить Docker контейнеры"
            log_info "Рекомендуется вручную проверить логи и конфигурацию"
            exit 1
        fi
    fi
else
    log_success "Docker контейнеры успешно перезапущены"
fi
echo "Ждём прогрузки сервера"
sleep 10
echo "Прошло 10 секунд. Продолжаем выполнение."
# Проверка доступности веб-сайта (если установлен curl)
if command -v curl &> /dev/null; then
    log_info "Проверка доступности веб-сайта локально..."
    if curl -s --head http://localhost | grep "HTTP/1.1 200 OK" > /dev/null; then
        log_success "Веб-сайт доступен (HTTP 200)"
    else
        log_warn "Веб-сайт недоступен или возвращает ошибку"
        log_info "Попытка получить подробную информацию..."
        curl -I http://localhost 2>/dev/null || log_warn "Не удалось проверить HTTP-статус"
    fi
fi

# ===========================================
# ЗАВЕРШЕНИЕ
# ===========================================
log_success "${BOLD}=== ОБНОВЛЕНИЕ ПРИЛОЖЕНИЯ ЗАВЕРШЕНО УСПЕШНО ===${NC}"
log_info "Все этапы выполнены без критических ошибок"
log_info "Лог-файл сохранен: ${LOG_FILE}"

# Отправка уведомления об успешном обновлении (если настроено)
if command -v notify-send &> /dev/null; then
    notify-send "Обновление завершено" "Приложение mdgt.ru успешно обновлено" --icon=dialog-information
fi

exit 0
