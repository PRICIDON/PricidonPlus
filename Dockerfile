# 1. Используем официальный образ Bun
FROM oven/bun:latest

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Устанавливаем необходимые зависимости для node-gyp (Python, make, g++, etc.)
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    ln -s /usr/bin/python3 /usr/bin/python

# 4. Копируем зависимости и устанавливаем
COPY . .
RUN bun install --verbose

# 6. Сборка проекта NestJS
RUN bun run build

# 7. Открываем нужный порт
EXPOSE 3000

# 8. Запуск прод-сервера
CMD ["bun", "run", "start:prod"]
