# Homework-001-Web-Application-Development-Technologies
Домашнее задание по курсу "Технологии разработки веб-приложений"
Вариант ТРВП-001
## Структура проекта
project-root/
├─ server/
│  ├─ index.js
│  ├─ seed.js
│  ├─ .env
│  ├─ package.json
│  ├─ models/
│  │  ├─ index.js
│  │  ├─ master.js
│  │  └─ task.js
│  └─ routes/
│     ├─ masters.js
│     └─ tasks.js
└─ client/
   ├─ public/
   ├─ src/
   │  ├─ api.js
   │  ├─ App.js
   │  ├─ index.js
   │  ├─ styles.css
   │  └─ components/
   └─ package.json

## Установка и запуск

### Настройка MySQL

Создайте базу и пользователя:
```sql
CREATE DATABASE IF NOT EXISTS `ip_manager_db` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON `ip_manager_db`.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```
### Запуск сервера

```
cd server
npm install
npm run seed
npm run start
```
### Запуск клиента
```
cd client
npm install
npm start
```

## Примеры запросов
```
# создать мастера
Invoke-RestMethod -Uri http://localhost:4000/api/masters -Method POST -ContentType "application/json" -Body '{"fio":"Тестовый мастер"}'

# добавить заявку
Invoke-RestMethod -Uri http://localhost:4000/api/masters/<MASTER_ID>/tasks -Method POST -ContentType "application/json" -Body '{"address":"ул. Ленина, 1","complexity":3}'
```
